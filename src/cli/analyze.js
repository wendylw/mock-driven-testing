#!/usr/bin/env node

const { Command } = require('commander');
const path = require('path');
const fs = require('fs-extra');
const DependencyAnalyzer = require('../analyzer/dependency-analyzer');

const program = new Command();

program
  .name('analyze')
  .description('Analyze StoreHub repository dependencies')
  .option('-r, --repo <name>', 'Repository name')
  .option('-p, --path <path>', 'Repository path (alternative to name)')
  .option('-o, --output <file>', 'Output file for analysis report')
  .parse(process.argv);

const options = program.opts();

async function main() {
  try {
    let repoPath;
    
    if (options.path) {
      repoPath = path.resolve(options.path);
    } else if (options.repo) {
      // Assume repos are in a standard location
      repoPath = path.join(process.env.STOREHUB_REPOS_PATH || '../', options.repo);
    } else {
      console.error('❌ Please specify either --repo or --path');
      process.exit(1);
    }

    if (!await fs.pathExists(repoPath)) {
      console.error(`❌ Repository not found: ${repoPath}`);
      process.exit(1);
    }

    const analyzer = new DependencyAnalyzer(repoPath);
    const report = await analyzer.analyze();
    
    // Output report
    if (options.output) {
      await fs.writeJson(options.output, report, { spaces: 2 });
      console.log(`📄 Report saved to: ${options.output}`);
    } else {
      console.log('\n📊 Analysis Report:');
      console.log(JSON.stringify(report, null, 2));
    }

    console.log('\n✅ Analysis complete!');
  } catch (error) {
    console.error('❌ Analysis failed:', error.message);
    process.exit(1);
  }
}

main();