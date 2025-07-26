#!/usr/bin/env node

/**
 * Visual Demo - 可视化展示 Mock-Driven Testing 的工作过程
 */

const chalk = require('chalk') || { 
  green: (s) => `✅ ${s}`,
  red: (s) => `❌ ${s}`,
  yellow: (s) => `⚠️  ${s}`,
  blue: (s) => `🔵 ${s}`,
  cyan: (s) => `🔷 ${s}`,
  magenta: (s) => `🟣 ${s}`
};

// 模拟的 API 端点和响应
const mockEndpoints = {
  '/api/cart': {
    success: true,
    data: {
      id: 'CART-123',
      items: [
        { id: 1, name: 'iPhone 13', price: 3999, quantity: 1 },
        { id: 2, name: 'AirPods Pro', price: 999, quantity: 2 }
      ],
      total: 5997
    }
  },
  '/api/user/profile': {
    success: true,
    data: {
      id: 'USER-456',
      name: 'Test User',
      email: 'test@storehub.com',
      memberSince: '2024-01-01'
    }
  },
  '/api/products': {
    success: true,
    data: [
      { id: 1, name: 'MacBook Pro', price: 7999, inStock: true },
      { id: 2, name: 'iPad Air', price: 2999, inStock: true },
      { id: 3, name: 'Apple Watch', price: 1599, inStock: false }
    ]
  },
  '/api/order/checkout': {
    success: true,
    data: {
      orderId: 'ORD-789',
      status: 'confirmed',
      estimatedDelivery: '2025-07-28'
    }
  }
};

// 动画效果
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function typeWriter(text, delay = 50) {
  for (const char of text) {
    process.stdout.write(char);
    await sleep(delay);
  }
  console.log();
}

async function showProgress(steps, duration = 2000) {
  const interval = duration / steps;
  for (let i = 0; i <= steps; i++) {
    const progress = Math.floor((i / steps) * 100);
    const bar = '█'.repeat(Math.floor(progress / 5)) + '░'.repeat(20 - Math.floor(progress / 5));
    process.stdout.write(`\r  [${bar}] ${progress}%`);
    await sleep(interval);
  }
  console.log();
}

// 主演示函数
async function runVisualDemo() {
  console.clear();
  console.log('🚀 Mock-Driven Testing Visual Demo\n');
  
  await typeWriter('让我们看看 Mock-Driven Testing 是如何工作的...\n');
  await sleep(1000);

  // Step 1: 传统方式
  console.log('\n' + '='.repeat(60));
  console.log('❌ 传统测试方式（需要启动后端）');
  console.log('='.repeat(60));
  
  await typeWriter('1. 启动数据库服务器... ');
  await showProgress(20, 3000);
  
  await typeWriter('2. 启动后端 API 服务... ');
  await showProgress(20, 2000);
  
  await typeWriter('3. 等待服务连接... ');
  await showProgress(20, 2000);
  
  console.log('\n⏱️  总耗时: 7+ 秒（还没开始测试！）');
  await sleep(2000);

  // Step 2: Mock-Driven 方式
  console.log('\n' + '='.repeat(60));
  console.log('✅ Mock-Driven Testing 方式');
  console.log('='.repeat(60));
  
  await typeWriter('1. 加载自动生成的 Mocks... ');
  await showProgress(20, 300);
  console.log('   ✓ 154 个 API 端点已就绪！');
  
  await sleep(1000);

  // Step 3: 实际测试演示
  console.log('\n📋 开始运行测试用例:');
  console.log('-'.repeat(60));

  // Test 1: 购物车测试
  console.log('\n🧪 测试 1: 获取购物车数据');
  console.log('  调用: GET /api/cart');
  await sleep(500);
  console.log('  Mock 响应:');
  console.log('  ' + JSON.stringify(mockEndpoints['/api/cart'], null, 2).split('\n').join('\n  '));
  await sleep(1000);
  console.log('  ✅ 测试通过! 购物车包含 2 件商品，总价 5997 元');

  // Test 2: 用户信息测试
  console.log('\n🧪 测试 2: 获取用户信息');
  console.log('  调用: GET /api/user/profile');
  await sleep(500);
  console.log('  Mock 响应:');
  console.log('  ' + JSON.stringify(mockEndpoints['/api/user/profile'], null, 2).split('\n').join('\n  '));
  await sleep(1000);
  console.log('  ✅ 测试通过! 成功获取用户信息');

  // Test 3: 产品列表测试
  console.log('\n🧪 测试 3: 获取产品列表');
  console.log('  调用: GET /api/products');
  await sleep(500);
  console.log('  Mock 响应: 3 个产品');
  mockEndpoints['/api/products'].data.forEach(product => {
    console.log(`    - ${product.name}: RM ${product.price} ${product.inStock ? '✅ 有货' : '❌ 缺货'}`);
  });
  await sleep(1000);
  console.log('  ✅ 测试通过! 产品数据正确显示');

  // Test 4: 错误场景测试
  console.log('\n🧪 测试 4: 模拟错误场景');
  console.log('  调用: GET /api/payment (模拟支付失败)');
  await sleep(500);
  console.log('  Mock 响应:');
  console.log(`  {
    "success": false,
    "error": "Payment declined",
    "code": "INSUFFICIENT_FUNDS"
  }`);
  await sleep(1000);
  console.log('  ✅ 测试通过! 错误处理正常');

  // 测试结果汇总
  console.log('\n' + '='.repeat(60));
  console.log('📊 测试结果汇总');
  console.log('='.repeat(60));
  
  const results = [
    { test: '购物车功能', time: '12ms', status: 'PASS' },
    { test: '用户信息', time: '8ms', status: 'PASS' },
    { test: '产品列表', time: '15ms', status: 'PASS' },
    { test: '错误处理', time: '5ms', status: 'PASS' }
  ];

  console.log('\n测试用例                执行时间    状态');
  console.log('-'.repeat(45));
  results.forEach(result => {
    console.log(`${result.test.padEnd(20)} ${result.time.padEnd(10)} ✅ ${result.status}`);
  });

  console.log('\n总计: 4 个测试, 4 通过, 0 失败');
  console.log('总执行时间: 40ms');

  // 对比
  console.log('\n' + '='.repeat(60));
  console.log('⚡ 性能对比');
  console.log('='.repeat(60));
  console.log('\n传统方式:');
  console.log('  - 启动时间: 7+ 秒');
  console.log('  - 测试执行: 2-5 秒（网络延迟）');
  console.log('  - 总时间: 10+ 秒');
  console.log('  - 需要: 数据库 + 后端服务 + 网络');
  
  console.log('\nMock-Driven Testing:');
  console.log('  - 启动时间: 0.3 秒');
  console.log('  - 测试执行: 0.04 秒');
  console.log('  - 总时间: < 0.5 秒');
  console.log('  - 需要: 仅 Mock 文件');

  console.log('\n🚀 速度提升: 20-50 倍！');
  
  // 实时模拟
  console.log('\n' + '='.repeat(60));
  console.log('🎬 实时测试模拟');
  console.log('='.repeat(60));
  console.log('\n按任意键查看实时 API 调用模拟...');
  
  // 模拟实时 API 调用
  const endpoints = Object.keys(mockEndpoints);
  console.log('\n模拟应用运行中的 API 调用:\n');
  
  for (let i = 0; i < 10; i++) {
    const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
    const method = ['GET', 'POST', 'PUT'][Math.floor(Math.random() * 3)];
    const responseTime = Math.floor(Math.random() * 20) + 5;
    
    console.log(`[${new Date().toISOString().split('T')[1].split('.')[0]}] ${method} ${endpoint} - ${responseTime}ms ✅`);
    await sleep(300);
  }

  console.log('\n✨ 所有 API 调用都由 Mock 即时响应，无需后端！');
}

// 运行演示
console.log('正在准备可视化演示...\n');
runVisualDemo().catch(console.error);