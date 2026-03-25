const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const fs = require('fs-extra');
const path = require('path');
const { glob } = require('glob');

class ComponentAnalyzer {
  constructor() {
    this.componentRegistry = new Map();
    this.importGraph = new Map();
    this.targetComponents = ['Button', 'CreateOrderButton', 'Modal', 'Input'];
  }

  // 分析项目
  async analyzeProject(projectPath) {
    console.log('🔍 开始分析项目:', projectPath);
    const startTime = Date.now();

    // 扫描所有JSX文件
    const files = await this.findAllJSXFiles(projectPath);
    console.log(`📁 找到 ${files.length} 个JSX文件`);

    // 分析每个文件
    for (const file of files) {
      await this.analyzeFile(file);
    }

    // 计算统计数据
    const report = this.generateReport();
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`✅ 分析完成，耗时 ${duration} 秒`);

    return report;
  }

  // 查找所有JSX文件
  async findAllJSXFiles(projectPath) {
    const patterns = [
      path.join(projectPath, 'src/common/components/**/*.{jsx,js}'),
      path.join(projectPath, 'src/ordering/components/**/*.{jsx,js}'),
      path.join(projectPath, 'src/site/components/**/*.{jsx,js}'),
      path.join(projectPath, 'src/ordering/containers/**/*.{jsx,js}')
    ];
    
    let allFiles = [];
    for (const pattern of patterns) {
      try {
        const files = await glob(pattern, { 
          ignore: ['**/node_modules/**', '**/__tests__/**', '**/*.test.js'] 
        });
        allFiles = allFiles.concat(files);
      } catch (err) {
        console.log(`警告: 无法扫描 ${pattern}`);
      }
    }
    
    return allFiles;
  }

  // 分析单个文件
  async analyzeFile(filePath) {
    try {
      const code = await fs.readFile(filePath, 'utf8');
      const ast = parser.parse(code, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript']
      });

      const fileInfo = {
        filePath,
        components: [],
        imports: []
      };

      traverse(ast, {
        // 识别import语句
        ImportDeclaration: (path) => {
          const source = path.node.source.value;
          path.node.specifiers.forEach(spec => {
            if (spec.type === 'ImportDefaultSpecifier' || spec.type === 'ImportSpecifier') {
              const importedName = spec.imported?.name || spec.local.name;
              
              // 检查是否是我们关注的组件
              if (this.targetComponents.includes(importedName)) {
                fileInfo.imports.push({
                  name: importedName,
                  source: source,
                  local: spec.local.name
                });
                
                // 更新使用统计
                this.updateComponentUsage(importedName, filePath);
              }
            }
          });
        },

        // 识别组件定义
        FunctionDeclaration: (path) => {
          const name = path.node.id?.name;
          if (name && this.targetComponents.includes(name)) {
            this.registerComponent(name, filePath);
          }
        },

        // 识别箭头函数组件
        VariableDeclarator: (path) => {
          const name = path.node.id?.name;
          if (name && this.targetComponents.includes(name)) {
            const init = path.node.init;
            if (init && (init.type === 'ArrowFunctionExpression' || init.type === 'FunctionExpression')) {
              this.registerComponent(name, filePath);
            }
          }
        }
      });

    } catch (error) {
      // 忽略解析错误，继续处理其他文件
      if (error.code !== 'BABEL_PARSE_ERROR') {
        console.error(`分析文件出错 ${filePath}:`, error.message);
      }
    }
  }

  // 注册组件定义
  registerComponent(name, filePath) {
    if (!this.componentRegistry.has(name)) {
      this.componentRegistry.set(name, {
        name,
        definedIn: filePath,
        usedIn: []
      });
    }
  }

  // 更新组件使用统计
  updateComponentUsage(componentName, usedInFile) {
    if (!this.componentRegistry.has(componentName)) {
      this.componentRegistry.set(componentName, {
        name: componentName,
        definedIn: null,
        usedIn: []
      });
    }

    const component = this.componentRegistry.get(componentName);
    if (!component.usedIn.includes(usedInFile)) {
      component.usedIn.push(usedInFile);
    }
  }

  // 生成分析报告
  generateReport() {
    const report = {
      summary: {
        totalComponents: this.componentRegistry.size,
        analyzedComponents: []
      },
      components: {}
    };

    // 分析目标组件
    this.targetComponents.forEach(componentName => {
      const component = this.componentRegistry.get(componentName);
      if (component) {
        const analysis = {
          name: componentName,
          definedIn: component.definedIn,
          usageCount: component.usedIn.length,
          usedIn: component.usedIn,
          riskLevel: this.calculateRiskLevel(component),
          testingNeeded: component.usedIn.length > 0
        };
        
        report.components[componentName] = analysis;
        report.summary.analyzedComponents.push({
          name: componentName,
          usage: component.usedIn.length,
          risk: analysis.riskLevel
        });
      } else {
        // 组件未找到
        report.components[componentName] = {
          name: componentName,
          definedIn: null,
          usageCount: 0,
          usedIn: [],
          riskLevel: 'not-found',
          testingNeeded: false
        };
      }
    });

    return report;
  }

  // 计算风险等级
  calculateRiskLevel(component) {
    const usageCount = component.usedIn.length;
    
    // 特殊处理CreateOrderButton - 核心业务组件
    if (component.name === 'CreateOrderButton') {
      return 'high';
    }
    
    if (usageCount > 100) return 'high';
    if (usageCount > 50) return 'medium';
    if (usageCount > 0) return 'low';
    return 'none';
  }

  // 格式化输出报告
  formatReport(report) {
    console.log('\n' + '='.repeat(50));
    console.log('📊 MDT智能分析报告 - 组件分析结果');
    console.log('='.repeat(50) + '\n');

    console.log('🎯 目标组件分析：\n');
    
    const tableData = [];
    this.targetComponents.forEach(name => {
      const comp = report.components[name];
      tableData.push({
        '组件名': name,
        '使用次数': comp.usageCount,
        '风险等级': this.getRiskEmoji(comp.riskLevel) + ' ' + comp.riskLevel,
        '需要测试': comp.testingNeeded ? '✅' : '❌'
      });
    });

    console.table(tableData);

    // 显示详细使用位置（只显示前5个）
    console.log('\n📍 组件使用详情：\n');
    this.targetComponents.forEach(name => {
      const comp = report.components[name];
      if (comp.usageCount > 0) {
        console.log(`${name} (${comp.usageCount}次使用):`);
        const displayFiles = comp.usedIn.slice(0, 5);
        displayFiles.forEach(file => {
          const shortPath = file.replace(/.*\/src\//, 'src/');
          console.log(`  - ${shortPath}`);
        });
        if (comp.usedIn.length > 5) {
          console.log(`  ... 还有 ${comp.usedIn.length - 5} 个文件`);
        }
        console.log('');
      }
    });
  }

  getRiskEmoji(level) {
    const emojis = {
      'high': '🔴',
      'medium': '🟡',
      'low': '🟢',
      'none': '⚪',
      'not-found': '❓'
    };
    return emojis[level] || '❓';
  }
}

module.exports = ComponentAnalyzer;