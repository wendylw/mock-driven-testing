/**
 * Button组件截图生成工具
 * 用于生成beep-v1-webapp Button组件的真实截图
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs-extra');

// Button的所有Props组合
const buttonVariations = [
  // Primary类型
  { id: 'primary-default', type: 'primary', theme: 'default', size: 'normal', text: '按钮' },
  { id: 'primary-default-small', type: 'primary', theme: 'default', size: 'small', text: '按钮' },
  { id: 'primary-danger', type: 'primary', theme: 'danger', size: 'normal', text: '按钮' },
  { id: 'primary-info', type: 'primary', theme: 'info', size: 'normal', text: '按钮' },
  { id: 'primary-disabled', type: 'primary', theme: 'default', size: 'normal', disabled: true, text: '按钮' },
  { id: 'primary-loading', type: 'primary', theme: 'default', size: 'normal', loading: true, text: '按钮' },
  { id: 'primary-block', type: 'primary', theme: 'default', size: 'normal', block: true, text: '按钮' },
  
  // Secondary类型
  { id: 'secondary-default', type: 'secondary', theme: 'default', size: 'normal', text: '按钮' },
  { id: 'secondary-default-small', type: 'secondary', theme: 'default', size: 'small', text: '按钮' },
  { id: 'secondary-danger', type: 'secondary', theme: 'danger', size: 'normal', text: '按钮' },
  { id: 'secondary-info', type: 'secondary', theme: 'info', size: 'normal', text: '按钮' },
  { id: 'secondary-disabled', type: 'secondary', theme: 'default', size: 'normal', disabled: true, text: '按钮' },
  { id: 'secondary-loading', type: 'secondary', theme: 'default', size: 'normal', loading: true, text: '按钮' },
  
  // Text类型
  { id: 'text-default', type: 'text', theme: 'default', size: 'normal', text: '按钮' },
  { id: 'text-default-small', type: 'text', theme: 'default', size: 'small', text: '按钮' },
  { id: 'text-ghost', type: 'text', theme: 'ghost', size: 'normal', text: '按钮' },
  { id: 'text-danger', type: 'text', theme: 'danger', size: 'normal', text: '按钮' },
  { id: 'text-danger-icon', type: 'text', theme: 'danger', size: 'normal', icon: 'Trash', text: '删除' },
  { id: 'text-info', type: 'text', theme: 'info', size: 'normal', text: '按钮' },
  { id: 'text-disabled', type: 'text', theme: 'default', size: 'normal', disabled: true, text: '按钮' },
];

// 生成Button展示页面的HTML
function generateButtonShowcaseHTML() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Button Showcase</title>
  <style>
    body {
      font-family: 'Lato', 'Open Sans', 'Helvetica', 'Arial', sans-serif;
      padding: 20px;
      background: #f5f5f5;
    }
    .button-container {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
    }
    .button-item {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      min-width: 150px;
      text-align: center;
    }
    .button-label {
      font-size: 12px;
      color: #666;
      margin-bottom: 10px;
    }
    .button-wrapper {
      min-height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  </style>
  <link rel="stylesheet" href="http://localhost:8080/static/css/main.css">
</head>
<body>
  <div class="button-container">
    ${buttonVariations.map(variation => `
      <div class="button-item" id="${variation.id}">
        <div class="button-label">${variation.id}</div>
        <div class="button-wrapper">
          <!-- 这里需要React渲染Button组件 -->
          <div id="button-${variation.id}"></div>
        </div>
      </div>
    `).join('')}
  </div>
  
  <script crossorigin src="https://unpkg.com/react@17/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"></script>
  <script>
    // 这里需要加载并渲染Button组件
    // 实际实现需要webpack打包Button组件
  </script>
</body>
</html>
  `;
}

async function generateSnapshots() {
  const outputDir = path.join(__dirname, '../public/button-snapshots');
  await fs.ensureDir(outputDir);

  // 生成展示页面
  const showcaseHTML = generateButtonShowcaseHTML();
  const showcasePath = path.join(outputDir, 'showcase.html');
  await fs.writeFile(showcasePath, showcaseHTML);

  console.log('Button截图生成工具已创建');
  console.log('注意：完整实现需要:');
  console.log('1. 设置beep项目的开发服务器');
  console.log('2. 使用webpack打包Button组件为独立bundle');
  console.log('3. 使用Puppeteer访问展示页面并截图');
  console.log('4. 将截图保存到MDT平台的public目录');
}

// 简化版本：创建一个Button组件的独立渲染环境
async function createStandaloneButtonRenderer() {
  const rendererPath = path.join(__dirname, 'button-renderer');
  await fs.ensureDir(rendererPath);

  // 创建一个简单的React应用来渲染Button
  const packageJson = {
    name: 'button-renderer',
    version: '1.0.0',
    scripts: {
      start: 'react-scripts start',
      build: 'react-scripts build'
    },
    dependencies: {
      react: '^17.0.2',
      'react-dom': '^17.0.2',
      'react-scripts': '5.0.1',
      'phosphor-react': '^1.4.1'
    }
  };

  await fs.writeJSON(path.join(rendererPath, 'package.json'), packageJson, { spaces: 2 });

  // 创建App组件
  const appContent = `
import React from 'react';
import './App.css';
// 这里需要复制Button组件代码和样式

function App() {
  return (
    <div className="App">
      <h1>Button Component Showcase</h1>
      <div className="button-grid">
        {/* 在这里渲染所有Button变体 */}
      </div>
    </div>
  );
}

export default App;
`;

  const srcDir = path.join(rendererPath, 'src');
  await fs.ensureDir(srcDir);
  await fs.writeFile(path.join(srcDir, 'App.js'), appContent);

  console.log('独立Button渲染器已创建于:', rendererPath);
  console.log('下一步:');
  console.log('1. 复制Button组件和相关依赖到渲染器');
  console.log('2. 运行 npm install && npm start');
  console.log('3. 使用Puppeteer截图');
}

// 主函数
async function main() {
  console.log('开始生成Button组件截图...');
  
  try {
    await createStandaloneButtonRenderer();
    // await generateSnapshots();
  } catch (error) {
    console.error('生成失败:', error);
  }
}

// 如果直接运行此文件
if (require.main === module) {
  main();
}

module.exports = { generateSnapshots, buttonVariations };