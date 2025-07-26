#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Simple dependency analyzer without external dependencies
async function analyzeBeepWebapp() {
  const repoPath = '../beep-v1-webapp';
  console.log('🔍 Analyzing beep-v1-webapp...\n');

  // 1. Read package.json
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(repoPath, 'package.json'), 'utf-8')
  );

  // 2. Extract StoreHub dependencies
  const dependencies = {};
  const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  Object.entries(allDeps).forEach(([name, version]) => {
    if (name.includes('storehub') || name.includes('beep')) {
      dependencies[name] = version;
    }
  });

  // 3. Scan for API calls (simplified)
  const srcPath = path.join(repoPath, 'src');
  const apiPatterns = [];
  
  // Look for common API patterns in a few files
  const sampleFiles = [
    'services/api.js',
    'services/auth.js',
    'api/index.js',
    'utils/request.js'
  ];

  for (const file of sampleFiles) {
    const filePath = path.join(srcPath, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Find API endpoints
      const endpointMatches = content.match(/['"`](\/api\/[^'"`]+)['"`]/g) || [];
      endpointMatches.forEach(match => {
        const endpoint = match.replace(/['"`]/g, '');
        if (!apiPatterns.includes(endpoint)) {
          apiPatterns.push(endpoint);
        }
      });
    }
  }

  // 4. Generate report
  const report = {
    repository: 'beep-v1-webapp',
    type: 'frontend',
    framework: 'React',
    analysis: {
      storeHubDependencies: dependencies,
      dependencyCount: Object.keys(dependencies).length,
      apiEndpoints: apiPatterns,
      apiEndpointCount: apiPatterns.length,
      mainDependencies: [
        'React ' + allDeps.react,
        'Redux ' + allDeps.redux,
        'Axios ' + allDeps.axios
      ].filter(Boolean)
    },
    mockStrategy: 'api-responses',
    suggestedMocks: {
      apiMocks: apiPatterns.map(endpoint => ({
        endpoint,
        method: 'GET/POST',
        description: `Mock for ${endpoint}`
      })),
      services: ['AuthService', 'UserService', 'ProductService']
    }
  };

  // Save report
  const outputPath = 'beep-v1-webapp-analysis.json';
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));

  // Display results
  console.log('📊 Analysis Summary:');
  console.log('====================');
  console.log(`Repository: ${report.repository}`);
  console.log(`Type: ${report.type}`);
  console.log(`Framework: ${report.framework}`);
  console.log(`\n📦 Dependencies:`);
  console.log(`- StoreHub dependencies: ${report.analysis.dependencyCount}`);
  console.log(`- Main deps: ${report.analysis.mainDependencies.join(', ')}`);
  console.log(`\n🔌 API Endpoints found: ${report.analysis.apiEndpointCount}`);
  
  if (apiPatterns.length > 0) {
    console.log('- Sample endpoints:');
    apiPatterns.slice(0, 5).forEach(endpoint => {
      console.log(`  • ${endpoint}`);
    });
  }

  console.log(`\n✅ Analysis complete! Report saved to: ${outputPath}`);
  console.log('\n📋 Suggested next steps:');
  console.log('1. Review the analysis report');
  console.log('2. Generate mocks based on the identified patterns');
  console.log('3. Start using mocks in your tests!');
}

// Run the analysis
analyzeBeepWebapp().catch(console.error);