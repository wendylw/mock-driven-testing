#!/usr/bin/env node

/**
 * 最终版代理服务器 - 无需额外依赖，完美模拟 beep-v1-webapp
 */

const http = require('http');
const https = require('https');
const url = require('url');
const fs = require('fs');
const path = require('path');
const net = require('net');

const PROXY_PORT = 3001;
const TARGET_PORT = 3000;
const API_HOST = 'coffee.beep.test17.shub.us';

// 存储捕获的 API
const capturedAPIs = [];
const apiPatterns = {};
let requestId = 0;

console.log('🚀 启动 Mock-Driven Testing 代理服务器');
console.log(`✅ 代理端口: ${PROXY_PORT}`);
console.log(`✅ 目标应用: http://localhost:${TARGET_PORT}`);
console.log(`✅ API 服务器: https://${API_HOST}\n`);

// 创建代理服务器
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  const hostname = req.headers.host ? req.headers.host.split(':')[0] : 'localhost';
  const reqId = ++requestId;
  const startTime = Date.now();
  
  // 判断是否是 API 请求
  if (parsedUrl.pathname.startsWith('/api/')) {
    console.log(`📡 [${reqId}] API 请求: ${req.method} ${req.url} (来自: ${hostname})`);
    
    // 收集请求体
    let requestBody = '';
    req.on('data', chunk => {
      requestBody += chunk.toString();
    });
    
    req.on('end', () => {
      // 代理 API 请求到远程服务器
      const options = {
        hostname: API_HOST,
        port: 443,
        path: req.url,
        method: req.method,
        headers: {
          ...req.headers,
          host: API_HOST,
          origin: `https://${hostname.replace('.local', '').replace('.shub.us', '')}.beep.test17.shub.us`,
          referer: `https://${hostname.replace('.local', '').replace('.shub.us', '')}.beep.test17.shub.us/`
        }
      };
      
      // 移除可能导致问题的 header
      delete options.headers['accept-encoding'];
      
      const proxyReq = https.request(options, (proxyRes) => {
        let responseBody = '';
        
        // 移除可能导致问题的响应头
        delete proxyRes.headers['content-encoding'];
        delete proxyRes.headers['content-length'];
        
        proxyRes.on('data', (chunk) => {
          responseBody += chunk.toString();
        });
        
        proxyRes.on('end', () => {
          const responseTime = Date.now() - startTime;
          
          // 记录 API 调用
          const apiCall = {
            id: reqId,
            timestamp: new Date().toISOString(),
            domain: hostname,
            method: req.method,
            endpoint: parsedUrl.pathname,
            query: parsedUrl.query,
            requestBody: tryParseJSON(requestBody),
            responseStatus: proxyRes.statusCode,
            responseData: tryParseJSON(responseBody),
            responseTime: responseTime,
            responseHeaders: proxyRes.headers
          };
          
          capturedAPIs.push(apiCall);
          
          // 更新模式
          const pattern = `${req.method} ${parsedUrl.pathname}`;
          if (!apiPatterns[pattern]) {
            apiPatterns[pattern] = {
              calls: 0,
              examples: [],
              domains: new Set()
            };
          }
          apiPatterns[pattern].calls++;
          apiPatterns[pattern].domains.add(hostname);
          
          if (proxyRes.statusCode === 200 && apiCall.responseData) {
            apiPatterns[pattern].examples.push(apiCall.responseData);
          }
          
          console.log(`✅ [${reqId}] 响应: ${proxyRes.statusCode} - ${responseTime}ms`);
          
          // 处理 Cookie（模拟 setupProxy.js）
          if (proxyRes.headers['set-cookie']) {
            const cookies = proxyRes.headers['set-cookie'];
            proxyRes.headers['set-cookie'] = cookies.map(cookie => {
              if (cookie.includes('sid=')) {
                const businessName = hostname.split('.')[0];
                const replacedDomain = hostname.replace(businessName, '');
                return cookie.replace(/Domain=[^;]+;?/gi, `Domain=${replacedDomain};`);
              } else {
                return cookie.replace(/Domain=[^;]+;?/gi, '');
              }
            });
          }
          
          // 实时更新 Mock
          updateMocks();
          
          // 发送响应
          res.writeHead(proxyRes.statusCode, proxyRes.headers);
          res.end(responseBody);
        });
      });
      
      proxyReq.on('error', (err) => {
        console.error(`❌ [${reqId}] API 代理错误:`, err.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'API Proxy Error', details: err.message }));
      });
      
      // 发送请求体
      if (requestBody) {
        proxyReq.write(requestBody);
      }
      proxyReq.end();
    });
    
  } else if (req.url === '/__mock_stats') {
    // 统计端点
    res.writeHead(200, { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    
    res.end(JSON.stringify({
      totalCalls: capturedAPIs.length,
      domains: [...new Set(capturedAPIs.map(c => c.domain))],
      patterns: Object.keys(apiPatterns).map(pattern => ({
        pattern,
        calls: apiPatterns[pattern].calls,
        domains: [...apiPatterns[pattern].domains],
        examples: apiPatterns[pattern].examples.length
      })),
      recentCalls: capturedAPIs.slice(-20).map(call => ({
        id: call.id,
        time: call.timestamp,
        domain: call.domain,
        method: call.method,
        endpoint: call.endpoint,
        status: call.responseStatus,
        responseTime: call.responseTime
      }))
    }, null, 2));
    
  } else {
    // 代理其他请求到本地服务器
    const options = {
      hostname: '127.0.0.1',
      port: TARGET_PORT,
      path: req.url,
      method: req.method,
      headers: {
        ...req.headers,
        // 保持原始 host，让 webpack-dev-server 识别域名
        host: hostname + ':' + TARGET_PORT
      }
    };
    
    const proxyReq = http.request(options, (proxyRes) => {
      // 直接传递响应头
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      // 流式传输响应
      proxyRes.pipe(res);
    });
    
    proxyReq.on('error', (err) => {
      if (!req.url.includes('favicon.ico') && !req.url.includes('hot-update')) {
        console.error('❌ 静态资源代理错误:', err.message);
        console.error('   请确保 beep-v1-webapp 正在 localhost:3000 运行');
      }
      res.writeHead(502, { 'Content-Type': 'text/html' });
      res.end(`
        <h1>502 Bad Gateway</h1>
        <p>无法连接到 beep-v1-webapp (localhost:${TARGET_PORT})</p>
        <p>请确保已经运行: yarn start</p>
        <p>错误: ${err.message}</p>
      `);
    });
    
    // 流式传输请求
    req.pipe(proxyReq);
  }
});

// 处理 WebSocket (Hot Module Replacement)
server.on('upgrade', (req, socket, head) => {
  console.log('🔌 WebSocket 升级:', req.url);
  
  const target = net.createConnection(TARGET_PORT, '127.0.0.1', () => {
    target.write(`${req.method} ${req.url} HTTP/${req.httpVersion}\r\n`);
    
    for (const [key, value] of Object.entries(req.headers)) {
      target.write(`${key}: ${value}\r\n`);
    }
    target.write('\r\n');
    
    target.write(head);
    socket.pipe(target);
    target.pipe(socket);
  });
  
  target.on('error', (err) => {
    console.error('❌ WebSocket 代理错误:', err);
    socket.end();
  });
  
  socket.on('error', (err) => {
    console.error('❌ Socket 错误:', err);
    target.end();
  });
});

// 辅助函数
function tryParseJSON(str) {
  if (!str) return null;
  try {
    return JSON.parse(str);
  } catch {
    return str;
  }
}

function updateMocks() {
  const mockFile = path.join(__dirname, 'generated/beep-v1-webapp/api-mocks-realtime.js');
  const handlers = [];
  
  for (const [pattern, data] of Object.entries(apiPatterns)) {
    if (data.examples.length > 0) {
      const [method, endpoint] = pattern.split(' ');
      const mockData = data.examples[data.examples.length - 1];
      
      handlers.push(`
  rest.${method.toLowerCase()}('${endpoint}', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(${JSON.stringify(mockData, null, 4)})
    );
  })`);
    }
  }
  
  const content = `/**
 * 实时捕获的 API Mock - 基于真实的 beep-v1-webapp API 响应
 * 自动生成时间: ${new Date().toISOString()}
 * 已捕获 ${Object.keys(apiPatterns).length} 个端点，共 ${capturedAPIs.length} 次调用
 * 
 * 使用方法:
 * import { handlers } from './api-mocks-realtime';
 * const worker = setupWorker(...handlers);
 */

import { rest } from 'msw';

export const handlers = [${handlers.join(',\n')}
];
`;
  
  const dir = path.dirname(mockFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(mockFile, content);
}

// 启动服务器
server.listen(PROXY_PORT, '0.0.0.0', () => {
  console.log(`\n✨ 代理服务器已启动！\n`);
  console.log('📌 请按以下步骤使用:');
  console.log(`  1. 确保 beep-v1-webapp 正在运行:`);
  console.log(`     cd ~/workspace/beep-v1-webapp && yarn start`);
  console.log(`  2. 等待看到 "Compiled successfully!"`);
  console.log(`  3. 在浏览器访问:`);
  console.log(`     - http://coffee.beep.local.shub.us:${PROXY_PORT}`);
  console.log(`     - http://jw.beep.local.shub.us:${PROXY_PORT}`);
  console.log(`     - http://localhost:${PROXY_PORT}`);
  console.log(`\n📊 查看捕获统计: http://localhost:${PROXY_PORT}/__mock_stats`);
  console.log(`\n💡 提示: 如果出现 502 错误，说明 beep-v1-webapp 还没启动\n`);
});

// 错误处理
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ 端口 ${PROXY_PORT} 已被占用！`);
    console.error('请先关闭占用该端口的程序，或修改 PROXY_PORT 变量');
  } else {
    console.error('\n❌ 服务器错误:', err);
  }
  process.exit(1);
});

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n\n👋 正在保存数据并关闭服务器...');
  
  const captureFile = path.join(__dirname, `captured-data/final-capture-${Date.now()}.json`);
  const captureDir = path.dirname(captureFile);
  
  if (!fs.existsSync(captureDir)) {
    fs.mkdirSync(captureDir, { recursive: true });
  }
  
  fs.writeFileSync(captureFile, JSON.stringify({
    captureDate: new Date().toISOString(),
    totalCalls: capturedAPIs.length,
    patterns: apiPatterns,
    calls: capturedAPIs
  }, null, 2));
  
  console.log(`✅ 已保存捕获数据到: ${captureFile}`);
  console.log(`📊 共捕获 ${capturedAPIs.length} 个 API 调用`);
  console.log(`📋 涵盖 ${Object.keys(apiPatterns).length} 个不同的端点`);
  process.exit(0);
});