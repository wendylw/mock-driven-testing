#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Deep analysis of beep-v1-webapp
async function deepAnalyze() {
  const repoPath = '../beep-v1-webapp';
  console.log('🔍 Deep analysis of beep-v1-webapp...\n');

  const apiCalls = new Set();
  const services = new Set();
  const imports = new Set();

  // Recursively scan src directory
  function scanDirectory(dirPath) {
    const files = fs.readdirSync(dirPath);
    
    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !file.includes('test') && !file.startsWith('.')) {
        scanDirectory(filePath);
      } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
        analyzeFile(filePath);
      }
    });
  }

  function analyzeFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Find API endpoints
      const apiPatterns = [
        /api\.get\(['"`]([^'"`]+)['"`]/g,
        /api\.post\(['"`]([^'"`]+)['"`]/g,
        /api\.put\(['"`]([^'"`]+)['"`]/g,
        /api\.delete\(['"`]([^'"`]+)['"`]/g,
        /axios\.[a-z]+\(['"`]([^'"`]+)['"`]/g,
        /fetch\(['"`]([^'"`]+)['"`]/g,
        /['"`](\/api\/[^'"`]+)['"`]/g
      ];

      apiPatterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          if (match[1] && match[1].startsWith('/')) {
            apiCalls.add(match[1]);
          }
        }
      });

      // Find service imports
      const servicePatterns = [
        /import\s+.*\s+from\s+['"`].*services\/([^'"`]+)['"`]/g,
        /import\s+\*\s+as\s+(\w+Service)\s+from/g,
        /const\s+(\w+Service)\s*=/g
      ];

      servicePatterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          if (match[1]) {
            services.add(match[1]);
          }
        }
      });

      // Find StoreHub imports
      const importPattern = /import\s+.*\s+from\s+['"`](@storehub[^'"`]+)['"`]/g;
      let match;
      while ((match = importPattern.exec(content)) !== null) {
        imports.add(match[1]);
      }

    } catch (error) {
      // Skip files that can't be read
    }
  }

  // Start scanning
  const srcPath = path.join(repoPath, 'src');
  if (fs.existsSync(srcPath)) {
    scanDirectory(srcPath);
  }

  // Create detailed report
  const report = {
    repository: 'beep-v1-webapp',
    scanDate: new Date().toISOString(),
    type: 'frontend',
    framework: 'React',
    analysis: {
      apiEndpoints: Array.from(apiCalls).sort(),
      services: Array.from(services).sort(),
      storeHubImports: Array.from(imports).sort(),
      statistics: {
        totalApiEndpoints: apiCalls.size,
        totalServices: services.size,
        totalStoreHubImports: imports.size
      }
    },
    mockRecommendations: {
      apiMocks: Array.from(apiCalls).slice(0, 10).map(endpoint => ({
        endpoint,
        suggestedResponse: generateMockResponse(endpoint)
      })),
      serviceMocks: Array.from(services).slice(0, 5).map(service => ({
        service,
        methods: ['get', 'list', 'create', 'update', 'delete']
      }))
    }
  };

  // Save detailed report
  const outputPath = 'beep-v1-webapp-deep-analysis.json';
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));

  // Display results
  console.log('📊 Deep Analysis Results:');
  console.log('========================');
  console.log(`\n🔌 API Endpoints: ${report.analysis.statistics.totalApiEndpoints}`);
  if (apiCalls.size > 0) {
    console.log('Sample endpoints:');
    Array.from(apiCalls).slice(0, 5).forEach(endpoint => {
      console.log(`  • ${endpoint}`);
    });
  }

  console.log(`\n🛠️  Services: ${report.analysis.statistics.totalServices}`);
  if (services.size > 0) {
    console.log('Sample services:');
    Array.from(services).slice(0, 5).forEach(service => {
      console.log(`  • ${service}`);
    });
  }

  console.log(`\n📦 StoreHub Imports: ${report.analysis.statistics.totalStoreHubImports}`);
  
  console.log(`\n✅ Deep analysis complete! Report saved to: ${outputPath}`);
}

function generateMockResponse(endpoint) {
  // Generate appropriate mock based on endpoint
  if (endpoint.includes('user')) {
    return { id: 1, name: 'Test User', email: 'test@example.com' };
  } else if (endpoint.includes('product')) {
    return { id: 1, name: 'Test Product', price: 99.99 };
  } else if (endpoint.includes('order')) {
    return { id: 'ORD001', status: 'pending', total: 199.99 };
  } else if (endpoint.includes('auth')) {
    return { token: 'mock-jwt-token', expiresIn: 3600 };
  }
  return { success: true, data: {} };
}

// Run deep analysis
deepAnalyze().catch(console.error);