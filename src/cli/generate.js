#!/usr/bin/env node

const { Command } = require('commander');
const path = require('path');
const fs = require('fs-extra');
const DependencyAnalyzer = require('../analyzer/dependency-analyzer');
const MockGenerator = require('../generator/mock-generator');

const program = new Command();

program
  .name('generate-mocks')
  .description('Generate mocks for a StoreHub repository')
  .option('-r, --repo <name>', 'Repository name')
  .option('-p, --path <path>', 'Repository path')
  .option('-c, --config <file>', 'Custom config file')
  .parse(process.argv);

const options = program.opts();

async function loadRepoConfig(repoName) {
  const configPath = path.join(__dirname, '../../config/repos.json');
  const config = await fs.readJson(configPath);
  
  const repoConfig = config.repositories.find(r => r.name === repoName);
  if (!repoConfig) {
    throw new Error(`Repository ${repoName} not found in config`);
  }
  
  return repoConfig;
}

async function main() {
  try {
    let repoPath;
    let repoName;
    
    if (options.path) {
      repoPath = path.resolve(options.path);
      repoName = path.basename(repoPath);
    } else if (options.repo) {
      repoName = options.repo;
      repoPath = path.join(process.env.STOREHUB_REPOS_PATH || '../', repoName);
    } else {
      console.error('❌ Please specify either --repo or --path');
      process.exit(1);
    }

    console.log(`\n🚀 Generating mocks for ${repoName}`);
    
    // Step 1: Analyze
    console.log('\n📊 Step 1: Analyzing dependencies...');
    const analyzer = new DependencyAnalyzer(repoPath);
    const report = await analyzer.analyze();
    
    // Step 2: Load config
    console.log('\n⚙️  Step 2: Loading configuration...');
    const repoConfig = await loadRepoConfig(repoName);
    
    // Step 3: Generate mocks
    console.log('\n🤖 Step 3: Generating mocks...');
    const generator = new MockGenerator(report, repoConfig);
    await generator.generate();
    
    console.log('\n✅ Mock generation complete!');
    console.log(`📁 Mocks available at: generated/${repoName}/`);
    
  } catch (error) {
    console.error('❌ Generation failed:', error.message);
    process.exit(1);
  }
}

main();