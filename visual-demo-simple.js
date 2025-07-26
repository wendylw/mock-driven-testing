#!/usr/bin/env node

/**
 * Visual Demo - 可视化展示 Mock-Driven Testing 的工作过程
 */

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
  }
};

// 动画效果
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function showProgress(label, duration = 2000) {
  process.stdout.write(`  ${label} `);
  const steps = 20;
  const interval = duration / steps;
  
  for (let i = 0; i <= steps; i++) {
    const progress = Math.floor((i / steps) * 100);
    const filled = Math.floor(i);
    const empty = steps - filled;
    process.stdout.write(`\r  ${label} [${'█'.repeat(filled)}${'░'.repeat(empty)}] ${progress}%`);
    await sleep(interval);
  }
  console.log(' ✓');
}

// 主演示函数
async function runVisualDemo() {
  console.log('\n🚀 Mock-Driven Testing 可视化演示\n');
  console.log('让我们看看传统测试 vs Mock-Driven Testing 的区别...\n');
  await sleep(1000);

  // Part 1: 传统方式
  console.log('=' .repeat(60));
  console.log('❌ 场景 1: 传统测试方式（需要完整后端环境）');
  console.log('=' .repeat(60));
  console.log('\n开始测试前需要：\n');
  
  await showProgress('1. 启动 PostgreSQL 数据库', 3000);
  await showProgress('2. 启动 Redis 缓存服务', 2000);
  await showProgress('3. 启动后端 API 服务器', 2500);
  await showProgress('4. 等待服务健康检查', 1500);
  
  console.log('\n⏱️  启动时间: 9 秒（还没开始写测试！）');
  console.log('📍 需要资源: 数据库 + 缓存 + API服务器 + 网络\n');
  await sleep(2000);

  // Part 2: Mock-Driven 方式
  console.log('\n' + '=' .repeat(60));
  console.log('✅ 场景 2: Mock-Driven Testing 方式');
  console.log('=' .repeat(60));
  console.log('\n开始测试只需要：\n');
  
  await showProgress('1. 加载生成的 Mock 文件', 300);
  console.log('\n✨ 启动时间: 0.3 秒（立即可以测试！）');
  console.log('📍 需要资源: 仅 Mock 文件\n');
  await sleep(1500);

  // Part 3: 实际测试对比
  console.log('\n' + '=' .repeat(60));
  console.log('🧪 实际测试执行对比');
  console.log('=' .repeat(60));

  // 测试场景展示
  const testScenarios = [
    { name: '获取购物车', endpoint: '/api/cart', traditional: '245ms', mock: '12ms' },
    { name: '用户登录', endpoint: '/api/user/profile', traditional: '189ms', mock: '8ms' },
    { name: '商品列表', endpoint: '/api/products', traditional: '312ms', mock: '15ms' },
    { name: '提交订单', endpoint: '/api/order', traditional: '567ms', mock: '20ms' }
  ];

  console.log('\n测试用例执行时间对比：\n');
  console.log('测试场景          传统方式    Mock方式    提升');
  console.log('-'.repeat(50));
  
  for (const test of testScenarios) {
    const speedup = Math.floor(parseInt(test.traditional) / parseInt(test.mock));
    console.log(`${test.name.padEnd(16)} ${test.traditional.padEnd(10)} ${test.mock.padEnd(10)} ${speedup}x 更快`);
    await sleep(500);
  }

  // Part 4: 实时 API 调用模拟
  console.log('\n\n' + '=' .repeat(60));
  console.log('🎬 实时模拟：Mock 如何响应 API 调用');
  console.log('=' .repeat(60));
  console.log('\n模拟前端应用调用 API...\n');
  await sleep(1000);

  // 模拟购物车调用
  console.log('📱 前端: 用户打开购物车页面');
  console.log('🔄 调用: GET /api/cart');
  await sleep(500);
  console.log('✅ Mock 响应 (12ms):');
  console.log(JSON.stringify(mockEndpoints['/api/cart'].data, null, 2));
  await sleep(1500);

  // 模拟用户信息调用
  console.log('\n📱 前端: 加载用户信息');
  console.log('🔄 调用: GET /api/user/profile');
  await sleep(500);
  console.log('✅ Mock 响应 (8ms):');
  console.log(JSON.stringify(mockEndpoints['/api/user/profile'].data, null, 2));
  await sleep(1500);

  // Part 5: 错误场景演示
  console.log('\n\n' + '=' .repeat(60));
  console.log('⚠️  错误场景测试（Mock 让错误测试变简单）');
  console.log('=' .repeat(60));
  
  console.log('\n📱 模拟支付失败场景：');
  console.log('🔄 调用: POST /api/payment');
  await sleep(500);
  console.log('❌ Mock 错误响应 (5ms):');
  console.log(JSON.stringify({
    success: false,
    error: 'Payment declined',
    code: 'INSUFFICIENT_FUNDS'
  }, null, 2));
  console.log('\n💡 使用 Mock 可以轻松测试各种错误场景！');
  await sleep(1500);

  // 最终总结
  console.log('\n\n' + '=' .repeat(60));
  console.log('📊 Mock-Driven Testing 优势总结');
  console.log('=' .repeat(60));
  
  const benefits = [
    { feature: '启动速度', traditional: '9+ 秒', mock: '0.3 秒', benefit: '30倍速度提升' },
    { feature: '测试执行', traditional: '~300ms/测试', mock: '~15ms/测试', benefit: '20倍速度提升' },
    { feature: '环境依赖', traditional: 'DB+Redis+API', mock: '无', benefit: '零依赖' },
    { feature: '数据一致性', traditional: '不稳定', mock: '100%一致', benefit: '完全可控' },
    { feature: '并行测试', traditional: '困难', mock: '简单', benefit: '提高效率' }
  ];

  console.log('\n特性            传统方式        Mock方式       优势');
  console.log('-'.repeat(60));
  
  for (const item of benefits) {
    console.log(`${item.feature.padEnd(14)} ${item.traditional.padEnd(14)} ${item.mock.padEnd(13)} ✅ ${item.benefit}`);
    await sleep(300);
  }

  console.log('\n\n🎯 结论：Mock-Driven Testing 让测试变得：');
  console.log('   • 更快速（20-30倍提升）');
  console.log('   • 更稳定（数据完全可控）');
  console.log('   • 更简单（无需环境配置）');
  console.log('   • 更全面（轻松测试边界情况）');
  
  console.log('\n✨ beep-v1-webapp 已有 154 个 API 端点的 Mock 准备就绪！');
  console.log('🚀 现在就可以开始编写独立、快速、可靠的测试了！\n');
}

// 运行演示
console.log('准备可视化演示...');
runVisualDemo().catch(console.error);