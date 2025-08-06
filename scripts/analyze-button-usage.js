const fs = require('fs').promises;
const path = require('path');
const glob = require('glob');

async function analyzeButtonUsage() {
  const projectPath = '/Users/wendylin/workspace/beep-v1-webapp';
  const results = {
    totalUsages: 0,
    usageByType: {},
    usageByTheme: {},
    usageBySize: {},
    commonPatterns: [],
    files: []
  };

  try {
    // Find all files that import Button
    const files = await new Promise((resolve, reject) => {
      glob('src/**/*.{js,jsx,ts,tsx}', {
        cwd: projectPath,
        ignore: ['**/node_modules/**', '**/*.test.*', '**/*.spec.*']
      }, (err, files) => {
        if (err) reject(err);
        else resolve(files);
      });
    });

    console.log(`Found ${files.length} source files to analyze`);

    for (const file of files) {
      const filePath = path.join(projectPath, file);
      const content = await fs.readFile(filePath, 'utf-8');
      
      // Check if file imports Button from common components
      if (content.includes("from '../common/components/Button'") ||
          content.includes('from "../../common/components/Button"') ||
          content.includes("from '../../../common/components/Button'") ||
          content.includes("from '../../../../common/components/Button'") ||
          content.includes("from '../../../../../common/components/Button'")) {
        
        results.files.push(file);
        
        // Count Button usages in the file
        const buttonMatches = content.match(/<Button[\s\S]*?(?:\/\>|<\/Button\>)/g) || [];
        results.totalUsages += buttonMatches.length;
        
        // Analyze each Button usage
        buttonMatches.forEach(match => {
          // Extract type prop
          const typeMatch = match.match(/type\s*=\s*["']([^"']+)["']/);
          if (typeMatch) {
            results.usageByType[typeMatch[1]] = (results.usageByType[typeMatch[1]] || 0) + 1;
          } else {
            results.usageByType['primary'] = (results.usageByType['primary'] || 0) + 1; // default
          }
          
          // Extract theme prop
          const themeMatch = match.match(/theme\s*=\s*["']([^"']+)["']/);
          if (themeMatch) {
            results.usageByTheme[themeMatch[1]] = (results.usageByTheme[themeMatch[1]] || 0) + 1;
          } else {
            results.usageByTheme['default'] = (results.usageByTheme['default'] || 0) + 1; // default
          }
          
          // Extract size prop
          const sizeMatch = match.match(/size\s*=\s*["']([^"']+)["']/);
          if (sizeMatch) {
            results.usageBySize[sizeMatch[1]] = (results.usageBySize[sizeMatch[1]] || 0) + 1;
          } else {
            results.usageBySize['normal'] = (results.usageBySize['normal'] || 0) + 1; // default
          }
          
          // Check common patterns
          if (match.includes('loading=')) {
            results.commonPatterns.push('loading state');
          }
          if (match.includes('block')) {
            results.commonPatterns.push('block/full-width');
          }
          if (match.includes('disabled')) {
            results.commonPatterns.push('disabled state');
          }
          if (match.includes('icon=')) {
            results.commonPatterns.push('with icon');
          }
          if (match.includes('onClick=')) {
            results.commonPatterns.push('with click handler');
          }
        });
      }
    }
    
    // Deduplicate patterns
    results.commonPatterns = [...new Set(results.commonPatterns)];
    
    // Sort results
    results.files.sort();
    
    return results;
  } catch (error) {
    console.error('Error analyzing Button usage:', error);
    throw error;
  }
}

// Run the analysis
analyzeButtonUsage()
  .then(results => {
    console.log('\n=== Button Usage Analysis Results ===\n');
    console.log(`Total Button usages: ${results.totalUsages}`);
    console.log(`Files using Button: ${results.files.length}`);
    
    console.log('\nUsage by Type:');
    Object.entries(results.usageByType).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`);
    });
    
    console.log('\nUsage by Theme:');
    Object.entries(results.usageByTheme).forEach(([theme, count]) => {
      console.log(`  ${theme}: ${count}`);
    });
    
    console.log('\nUsage by Size:');
    Object.entries(results.usageBySize).forEach(([size, count]) => {
      console.log(`  ${size}: ${count}`);
    });
    
    console.log('\nCommon Patterns:');
    results.commonPatterns.forEach(pattern => {
      console.log(`  - ${pattern}`);
    });
    
    console.log('\nTop 10 Files using Button:');
    results.files.slice(0, 10).forEach(file => {
      console.log(`  - ${file}`);
    });
    
    // Save results to file
    return fs.writeFile(
      path.join(__dirname, '../data/button-usage-analysis.json'),
      JSON.stringify(results, null, 2)
    );
  })
  .then(() => {
    console.log('\nAnalysis results saved to data/button-usage-analysis.json');
  })
  .catch(error => {
    console.error('Failed to analyze Button usage:', error);
    process.exit(1);
  });