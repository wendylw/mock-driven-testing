#!/usr/bin/env node

/**
 * Mock-Driven Testing CLI
 * 用于启动不同项目的代理服务器
 */

const ProxyServer = require('./proxy-server');
const projects = require('./config/projects');

// 解析命令行参数
const args = process.argv.slice(2);
const command = args[0];

// 显示帮助信息
function showHelp() {
  console.log(`
Mock-Driven Testing CLI

使用方法:
  npm run proxy <project-name>    启动指定项目的代理服务器
  npm run proxy list              列出所有可用项目
  npm run proxy help              显示此帮助信息

可用项目:
${Object.entries(projects)
  .filter(([key, value]) => typeof value === 'object')
  .map(([key, config]) => `  - ${key.padEnd(25)} ${config.name} (端口: ${config.proxyPort})`)
  .join('\n')}

示例:
  npm run proxy beep-v1-webapp
  npm run proxy backoffice-v2-webapp
`);
}

// 列出所有项目
function listProjects() {
  console.log('\n可用项目列表:\n');
  console.log('项目ID                    名称                     代理端口  目标端口  状态');
  console.log('─'.repeat(80));
  
  Object.entries(projects)
    .filter(([key, value]) => typeof value === 'object')
    .forEach(([key, config]) => {
      console.log(
        `${key.padEnd(25)} ${config.name.padEnd(25)} ${
          String(config.proxyPort).padEnd(10)
        } ${String(config.targetPort).padEnd(10)} 可用`
      );
    });
  
  console.log('\n使用 `npm run proxy <project-name>` 启动项目代理');
}

// 主函数
function main() {
  if (!command || command === 'help' || command === '--help' || command === '-h') {
    showHelp();
    return;
  }
  
  if (command === 'list' || command === '--list' || command === '-l') {
    listProjects();
    return;
  }
  
  // 检查项目是否存在
  const projectName = command;
  if (!projects[projectName]) {
    console.error(`\n❌ 错误: 未找到项目 "${projectName}"\n`);
    console.log('可用项目:');
    Object.entries(projects)
      .filter(([key, value]) => typeof value === 'object')
      .forEach(([key, config]) => {
        console.log(`  - ${key}`);
      });
    console.log('\n使用 `npm run proxy list` 查看详细信息');
    process.exit(1);
  }
  
  // 启动代理服务器
  try {
    const server = new ProxyServer(projectName);
    server.start();
  } catch (error) {
    console.error('\n❌ 启动失败:', error.message);
    process.exit(1);
  }
}

// 运行主函数
main();