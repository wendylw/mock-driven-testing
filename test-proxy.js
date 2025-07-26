#!/usr/bin/env node

/**
 * 代理服务器测试和诊断工具
 */

const http = require('http');
const { exec } = require('child_process');

console.log('🔍 代理服务器诊断工具\n');

// 检查端口是否被占用
function checkPort(port, callback) {
  const server = http.createServer();
  
  server.once('error', function(err) {
    if (err.code === 'EADDRINUSE') {
      callback(false);
    } else {
      callback(null, err);
    }
  });
  
  server.once('listening', function() {
    server.close();
    callback(true);
  });
  
  server.listen(port);
}

// 检查 beep-v1-webapp 是否运行
function checkBeepApp(callback) {
  http.get('http://localhost:3000', (res) => {
    callback(true, res.statusCode);
  }).on('error', (err) => {
    callback(false, err);
  });
}

// 检查 hosts 文件
function checkHosts(callback) {
  exec('grep "coffee.beep.local.shub.us" /etc/hosts', (error, stdout) => {
    if (error) {
      callback(false);
    } else {
      callback(true, stdout.trim());
    }
  });
}

// 运行诊断
async function runDiagnostics() {
  console.log('1️⃣ 检查端口 3000 (beep-v1-webapp)...');
  checkPort(3000, (available, err) => {
    if (available) {
      console.log('   ❌ 端口 3000 未被使用 - beep-v1-webapp 没有运行');
      console.log('   💡 请先运行: cd ~/workspace/beep-v1-webapp && yarn start\n');
    } else {
      console.log('   ✅ 端口 3000 已被占用 - 可能是 beep-v1-webapp');
      
      // 进一步检查是否真的是 beep-v1-webapp
      checkBeepApp((running, status) => {
        if (running) {
          console.log(`   ✅ beep-v1-webapp 正在运行 (状态码: ${status})\n`);
        } else {
          console.log('   ⚠️  端口 3000 被占用但不是 beep-v1-webapp\n');
        }
      });
    }
  });
  
  setTimeout(() => {
    console.log('2️⃣ 检查端口 3001 (代理服务器)...');
    checkPort(3001, (available, err) => {
      if (available) {
        console.log('   ✅ 端口 3001 可用\n');
      } else {
        console.log('   ❌ 端口 3001 已被占用');
        console.log('   💡 请先关闭占用 3001 端口的程序\n');
      }
    });
  }, 1000);
  
  setTimeout(() => {
    console.log('3️⃣ 检查 hosts 文件配置...');
    checkHosts((configured, content) => {
      if (configured) {
        console.log('   ✅ hosts 文件已配置:');
        console.log(`   ${content}\n`);
      } else {
        console.log('   ❌ hosts 文件未配置');
        console.log('   💡 请添加到 /etc/hosts:');
        console.log('   127.0.0.1 coffee.beep.local.shub.us\n');
      }
    });
  }, 2000);
  
  setTimeout(() => {
    console.log('4️⃣ 测试建议:\n');
    console.log('   步骤 1: 启动 beep-v1-webapp');
    console.log('   cd ~/workspace/beep-v1-webapp');
    console.log('   yarn start');
    console.log('   等待看到 "Compiled successfully!"\n');
    
    console.log('   步骤 2: 新开终端，启动代理服务器');
    console.log('   cd ~/workspace/mock-driven-testing');
    console.log('   node proxy-final.js\n');
    
    console.log('   步骤 3: 访问应用');
    console.log('   http://coffee.beep.local.shub.us:3001\n');
    
    console.log('如果还有问题，请运行:');
    console.log('curl -v http://localhost:3000');
    console.log('curl -v http://coffee.beep.local.shub.us:3000');
  }, 3000);
}

runDiagnostics();