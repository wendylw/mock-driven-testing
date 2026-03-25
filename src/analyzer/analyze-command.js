#!/usr/bin/env node

const ComponentAnalyzer = require('./component-analyzer');
const path = require('path');

async function main() {
  console.log('🚀 MDT Phase 4 - 智能分析引擎\n');
  
  // 获取要分析的项目路径
  const projectPath = process.argv[2] || '/Users/wendylin/workspace/beep-v1-webapp';
  
  const analyzer = new ComponentAnalyzer();
  
  try {
    // 执行分析
    const report = await analyzer.analyzeProject(projectPath);
    
    // 格式化输出报告
    analyzer.formatReport(report);
    
    // 保存报告到文件
    const fs = require('fs-extra');
    const reportPath = path.join(__dirname, '../../analysis-report.json');
    await fs.writeJson(reportPath, report, { spaces: 2 });
    console.log(`\n📄 详细报告已保存到: ${reportPath}`);
    
    // 询问是否生成测试代码
    console.log('\n');
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('是否生成测试代码？ [Y/n] ', async (answer) => {
      if (answer.toLowerCase() !== 'n') {
        await generateTests(report);
      }
      rl.close();
    });
    
  } catch (error) {
    console.error('❌ 分析失败:', error.message);
    process.exit(1);
  }
}

async function generateTests(report) {
  const TestGenerator = require('./test-generator');
  const generator = new TestGenerator();
  const outputDir = path.join(process.cwd(), 'mdt-output', new Date().toISOString().split('T')[0]);
  
  console.log('\n🔧 开始生成测试代码...\n');
  
  for (const [componentName, componentInfo] of Object.entries(report.components)) {
    if (componentInfo.testingNeeded) {
      try {
        const result = await generator.generateTestsForComponent(componentInfo, outputDir);
        console.log(`✅ ${componentName}:`);
        console.log(`   - 测试文件: ${path.basename(result.testFile)}`);
        console.log(`   - Mock配置: ${path.basename(result.mockFile)}`);
      } catch (error) {
        console.log(`❌ ${componentName}: 生成失败 - ${error.message}`);
      }
    }
  }
  
  console.log(`\n📁 测试文件已生成到: ${outputDir}`);
  console.log('\n💡 使用提示:');
  console.log('   1. 将生成的测试文件复制到您的项目中');
  console.log('   2. 安装MDT依赖: npm install @mdt/react');
  console.log('   3. 配合MDT Mock服务运行测试: npm test');
}

// 运行主程序
main().catch(console.error);