const fs = require('fs-extra');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const glob = require('glob');

class DependencyAnalyzer {
  constructor(repoPath) {
    this.repoPath = repoPath;
    this.dependencies = new Set();
    this.apiCalls = [];
    this.imports = new Map();
  }

  async analyze() {
    console.log(`🔍 Analyzing repository: ${this.repoPath}`);
    
    // Analyze package.json
    await this.analyzePackageJson();
    
    // Analyze source files
    await this.analyzeSourceFiles();
    
    // Analyze API calls
    await this.analyzeApiCalls();
    
    return this.generateReport();
  }

  async analyzePackageJson() {
    const packageJsonPath = path.join(this.repoPath, 'package.json');
    
    if (await fs.pathExists(packageJsonPath)) {
      const packageJson = await fs.readJson(packageJsonPath);
      const deps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies
      };
      
      Object.keys(deps).forEach(dep => {
        if (dep.includes('storehub') || dep.includes('beep')) {
          this.dependencies.add(dep);
        }
      });
    }
  }

  async analyzeSourceFiles() {
    const sourceFiles = glob.sync('**/*.{js,jsx,ts,tsx}', {
      cwd: this.repoPath,
      ignore: ['node_modules/**', 'dist/**', 'build/**']
    });

    for (const file of sourceFiles) {
      await this.analyzeFile(path.join(this.repoPath, file));
    }
  }

  async analyzeFile(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const ast = parser.parse(content, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript']
      });

      traverse(ast, {
        ImportDeclaration: (path) => {
          const importPath = path.node.source.value;
          if (this.isInternalDependency(importPath)) {
            this.imports.set(filePath, importPath);
          }
        },
        CallExpression: (path) => {
          this.detectApiCall(path, filePath);
        }
      });
    } catch (error) {
      console.warn(`⚠️  Could not parse ${filePath}: ${error.message}`);
    }
  }

  isInternalDependency(importPath) {
    return importPath.includes('@storehub') || 
           importPath.includes('beep') ||
           importPath.startsWith('../services');
  }

  detectApiCall(path, filePath) {
    const node = path.node;
    
    // Detect axios/fetch calls
    if (node.callee.name === 'axios' || node.callee.name === 'fetch') {
      const firstArg = node.arguments[0];
      if (firstArg && firstArg.type === 'StringLiteral') {
        this.apiCalls.push({
          file: filePath,
          url: firstArg.value,
          method: node.callee.property?.name || 'get'
        });
      }
    }
    
    // Detect service calls
    if (node.callee.type === 'MemberExpression') {
      const object = node.callee.object;
      if (object.name && object.name.includes('Service')) {
        this.apiCalls.push({
          file: filePath,
          service: object.name,
          method: node.callee.property.name
        });
      }
    }
  }

  async analyzeApiCalls() {
    // Group API calls by service/endpoint
    this.apiCallsSummary = this.apiCalls.reduce((acc, call) => {
      const key = call.service || call.url;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(call);
      return acc;
    }, {});
  }

  generateReport() {
    return {
      repository: path.basename(this.repoPath),
      dependencies: Array.from(this.dependencies),
      imports: Object.fromEntries(this.imports),
      apiCalls: this.apiCallsSummary,
      summary: {
        totalDependencies: this.dependencies.size,
        totalApiEndpoints: Object.keys(this.apiCallsSummary).length,
        totalFiles: this.imports.size
      }
    };
  }
}

module.exports = DependencyAnalyzer;