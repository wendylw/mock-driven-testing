const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

async function setupDatabase() {
  let connection;
  
  try {
    console.log('🚀 开始设置数据库...\n');
    
    // 连接MySQL（不指定数据库）
    connection = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: '',
      multipleStatements: true
    });
    
    console.log('✅ 连接MySQL成功');
    
    // 读取并执行schema.sql
    console.log('\n📋 创建数据库结构...');
    const schemaSQL = await fs.readFile(
      path.join(__dirname, '../database/schema.sql'), 
      'utf8'
    );
    await connection.query(schemaSQL);
    console.log('✅ 数据库结构创建成功');
    
    // 读取并执行seed.sql
    console.log('\n🌱 导入初始数据...');
    const seedSQL = await fs.readFile(
      path.join(__dirname, '../database/seed.sql'), 
      'utf8'
    );
    await connection.query(seedSQL);
    console.log('✅ 初始数据导入成功');
    
    console.log('\n🎉 数据库设置完成！');
    console.log('\n创建的表：');
    console.log('  - baselines (基准表)');
    console.log('  - analysis_results (分析结果表)');
    console.log('  - diagnostic_problems (问题记录表)');
    console.log('  - suggestions (建议记录表)');
    console.log('  - learning_patterns (学习模式表)');
    console.log('  - version_history (版本历史表)');
    console.log('  - analysis_queue (分析任务队列表)');
    console.log('  - interactive_sessions (交互会话表)');
    console.log('  - users (用户表)');
    console.log('  - baseline_status_overview (基准状态视图)');
    
    console.log('\n插入的测试数据：');
    console.log('  - 3个测试用户');
    console.log('  - 5个基准数据（Button, CreateOrderButton, Modal, Input, OldCard）');
    console.log('  - 7条版本历史记录');
    console.log('  - 3个问题诊断记录');
    console.log('  - 3个建议记录');
    console.log('  - 2个学习模式记录');
    console.log('  - 2个分析任务');
    
  } catch (error) {
    console.error('\n❌ 数据库设置失败：');
    console.error(error.message);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n请检查MySQL用户名和密码是否正确');
      console.error('当前配置：用户名=root, 密码=空');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\n请确保MySQL服务已启动');
    }
    
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// 执行设置
setupDatabase();