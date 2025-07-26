/**
 * Mock-Driven Testing Revolution
 * Main entry point for the mock generation system
 */

const DependencyAnalyzer = require('./analyzer/dependency-analyzer');
const MockGenerator = require('./generator/mock-generator');
const fs = require('fs-extra');
const path = require('path');

class MockDrivenTesting {
  constructor(configPath = './config/repos.json') {
    this.configPath = configPath;
    this.config = null;
  }

  async initialize() {
    this.config = await fs.readJson(this.configPath);
    console.log('🚀 Mock-Driven Testing System Initialized');
    console.log(`📋 Loaded configuration for ${this.config.repositories.length} repositories`);
  }

  async analyzeRepository(repoName, repoPath) {
    const analyzer = new DependencyAnalyzer(repoPath);
    const report = await analyzer.analyze();
    
    // Save analysis report
    const reportPath = path.join('generated', repoName, 'analysis-report.json');
    await fs.ensureDir(path.dirname(reportPath));
    await fs.writeJson(reportPath, report, { spaces: 2 });
    
    return report;
  }

  async generateMocksForRepository(repoName, repoPath) {
    // Find repo config
    const repoConfig = this.config.repositories.find(r => r.name === repoName);
    if (!repoConfig) {
      throw new Error(`Repository ${repoName} not found in configuration`);
    }

    // Analyze first
    console.log(`\n📊 Analyzing ${repoName}...`);
    const report = await this.analyzeRepository(repoName, repoPath);
    
    // Generate mocks
    console.log(`\n🤖 Generating mocks for ${repoName}...`);
    const generator = new MockGenerator(report, repoConfig);
    await generator.generate();
    
    return {
      repository: repoName,
      mocksGenerated: true,
      outputPath: path.join('generated', repoName)
    };
  }

  async generateAllMocks(reposBasePath) {
    const results = [];
    
    for (const repo of this.config.repositories) {
      try {
        const repoPath = path.join(reposBasePath, repo.name);
        
        if (await fs.pathExists(repoPath)) {
          const result = await this.generateMocksForRepository(repo.name, repoPath);
          results.push(result);
        } else {
          console.warn(`⚠️  Repository not found: ${repoPath}`);
          results.push({
            repository: repo.name,
            mocksGenerated: false,
            error: 'Repository not found'
          });
        }
      } catch (error) {
        console.error(`❌ Failed to generate mocks for ${repo.name}: ${error.message}`);
        results.push({
          repository: repo.name,
          mocksGenerated: false,
          error: error.message
        });
      }
    }
    
    return results;
  }

  async getRepositoryInfo(repoName) {
    const repo = this.config.repositories.find(r => r.name === repoName);
    if (!repo) {
      throw new Error(`Repository ${repoName} not found`);
    }
    
    const analysisPath = path.join('generated', repoName, 'analysis-report.json');
    const hasAnalysis = await fs.pathExists(analysisPath);
    
    return {
      ...repo,
      hasGeneratedMocks: hasAnalysis,
      generatedPath: hasAnalysis ? path.join('generated', repoName) : null
    };
  }
}

module.exports = MockDrivenTesting;