#!/usr/bin/env node

/**
 * 分析捕获的 API 数据
 */

const fs = require('fs');
const path = require('path');

// 读取生成的 Mock 文件
const mockFile = path.join(__dirname, 'generated/beep-v1-webapp/api-mocks-realtime.js');

if (!fs.existsSync(mockFile)) {
  console.log('❌ Mock 文件不存在');
  process.exit(1);
}

const content = fs.readFileSync(mockFile, 'utf8');

// 分析 OnlineCategory
const onlineCategoryMatch = content.match(/"onlineCategory":\s*\[([\s\S]*?)\]\s*}/);

if (onlineCategoryMatch) {
  console.log('📊 OnlineCategory 分析：\n');
  
  // 统计分类
  const categories = content.match(/"name":\s*"[^"]+",\s*"products":/g);
  console.log(`✅ 商品分类数量: ${categories ? categories.length : 0}`);
  
  // 统计商品
  const products = content.match(/"title":\s*"[^"]+"/g);
  console.log(`✅ 商品总数: ${products ? products.length : 0}`);
  
  // 提取分类名称
  const categoryNames = [];
  const categoryPattern = /"name":\s*"([^"]+)",\s*"products":/g;
  let match;
  while ((match = categoryPattern.exec(content)) !== null) {
    categoryNames.push(match[1]);
  }
  
  console.log('\n📋 商品分类列表:');
  categoryNames.forEach((name, index) => {
    console.log(`   ${index + 1}. ${name}`);
  });
  
  // 提取商品名称
  const productNames = [];
  const productPattern = /"title":\s*"([^"]+)"/g;
  while ((match = productPattern.exec(content)) !== null) {
    productNames.push(match[1]);
  }
  
  console.log('\n📦 商品列表:');
  productNames.forEach((name, index) => {
    console.log(`   ${index + 1}. ${name}`);
  });
  
  // 检查数据完整性
  console.log('\n🔍 数据完整性检查:');
  
  // 检查是否有图片
  const hasImages = content.includes('"images":');
  console.log(`   ${hasImages ? '✅' : '❌'} 包含商品图片`);
  
  // 检查是否有价格
  const hasPrice = content.includes('"displayPrice":');
  console.log(`   ${hasPrice ? '✅' : '❌'} 包含商品价格`);
  
  // 检查是否有库存信息
  const hasInventory = content.includes('"trackInventory":');
  console.log(`   ${hasInventory ? '✅' : '❌'} 包含库存信息`);
  
  // 检查是否有变体
  const hasVariations = content.includes('"variations":');
  console.log(`   ${hasVariations ? '✅' : '❌'} 包含商品变体`);
  
} else {
  console.log('❌ 未找到 OnlineCategory 数据');
}

// 统计所有 API 端点
console.log('\n📊 已捕获的 API 端点:');
const endpoints = content.match(/rest\.\w+\('([^']+)'/g);
if (endpoints) {
  const uniqueEndpoints = [...new Set(endpoints)];
  uniqueEndpoints.forEach((endpoint, index) => {
    const cleaned = endpoint.replace(/rest\.\w+\('/, '').replace(/'/, '');
    console.log(`   ${index + 1}. ${cleaned}`);
  });
}

// 检查捕获的数据目录
const captureDir = path.join(__dirname, 'captured-data');
if (fs.existsSync(captureDir)) {
  const files = fs.readdirSync(captureDir);
  console.log(`\n💾 捕获的数据文件: ${files.length} 个`);
  files.forEach(file => {
    const stat = fs.statSync(path.join(captureDir, file));
    console.log(`   - ${file} (${(stat.size / 1024).toFixed(1)} KB)`);
  });
}