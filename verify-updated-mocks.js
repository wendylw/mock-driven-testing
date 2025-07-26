#!/usr/bin/env node

/**
 * 验证更新后的 Mock 数据
 */

const fs = require('fs');
const path = require('path');

function verifyUpdatedMocks() {
  console.log('🔍 验证更新后的 Mock 数据...\n');
  
  const files = {
    original: path.join(__dirname, 'generated/beep-v1-webapp/api-mocks.js'),
    updated: path.join(__dirname, 'generated/beep-v1-webapp/api-mocks-updated.js'),
    structure: path.join(__dirname, 'generated/beep-v1-webapp/api-structure.md')
  };
  
  // 检查文件是否存在
  console.log('📋 检查文件:');
  for (const [name, filePath] of Object.entries(files)) {
    const exists = fs.existsSync(filePath);
    console.log(`  ${exists ? '✅' : '❌'} ${name}: ${filePath}`);
  }
  
  if (!fs.existsSync(files.updated)) {
    console.log('\n⚠️  还没有更新的 Mock 文件。请先运行:');
    console.log('  node update-mocks-from-capture.js <capture-file.json>\n');
    return;
  }
  
  // 读取并分析更新的 Mock
  console.log('\n📊 分析更新的 Mock:');
  const updatedContent = fs.readFileSync(files.updated, 'utf8');
  
  // 统计端点数量
  const endpointMatches = updatedContent.match(/rest\.\w+\(['"](.*?)['"]/g) || [];
  console.log(`  - 端点数量: ${endpointMatches.length}`);
  
  // 提取端点列表
  const endpoints = endpointMatches.map(match => {
    const [method, endpoint] = match.match(/rest\.(\w+)\(['"](.*?)['"]/).slice(1);
    return `${method.toUpperCase()} ${endpoint}`;
  });
  
  console.log('  - 包含的端点:');
  endpoints.forEach(ep => console.log(`    • ${ep}`));
  
  // 检查数据结构文档
  if (fs.existsSync(files.structure)) {
    console.log('\n📄 数据结构文档已生成');
    const structureContent = fs.readFileSync(files.structure, 'utf8');
    const apiSections = structureContent.match(/### \w+ \/api\/\w+/g) || [];
    console.log(`  - 文档化的 API: ${apiSections.length} 个`);
  }
  
  // 生成示例测试
  console.log('\n📝 生成示例测试代码:');
  const testExample = `
// 在 beep-v1-webapp 中使用更新后的 Mock
import { setupWorker } from 'msw';
import { handlers } from './mock-driven-testing/generated/beep-v1-webapp/api-mocks-updated';

// 设置 Mock
const worker = setupWorker(...handlers);
worker.start();

// 现在可以运行测试，使用真实的数据结构
test('购物车功能 - 使用真实数据结构', async () => {
  const response = await fetch('/api/cart');
  const cart = await response.json();
  
  // 数据结构现在与真实 API 完全一致！
  expect(cart).toHaveProperty('items');
  expect(cart.items[0]).toHaveProperty('id');
  expect(cart.items[0]).toHaveProperty('price');
});
`;
  
  console.log(testExample);
  
  console.log('\n✅ 验证完成！');
  console.log('💡 提示: 更新后的 Mock 基于真实 API 数据，测试将更加可靠');
}

// 运行验证
verifyUpdatedMocks();