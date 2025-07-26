#!/usr/bin/env node

/**
 * 完美代理服务器 - 完全模拟 beep-v1-webapp 的 setupProxy.js 行为
 */

const http = require('http');
const https = require('https');
const httpProxy = require('http-proxy');
const url = require('url');
const fs = require('fs');
const path = require('path');

const PROXY_PORT = 3001;
const TARGET_PORT = 3000;
const API_HOST = 'coffee.beep.test17.shub.us';

// 创建代理
const proxy = httpProxy.createProxyServer({
  target: `http://127.0.0.1:${TARGET_PORT}`,
  ws: true,
  changeOrigin: false,
  xfwd: true
});

// API 代理
const apiProxy = httpProxy.createProxyServer({
  target: `https://${API_HOST}`,
  changeOrigin: true,
  secure: true,
  xfwd: true
});

// 存储捕获的 API
const capturedAPIs = [];
const apiPatterns = {};
let requestId = 0;

console.log('🚀 启动完美代理服务器 - Mock-Driven Testing');
console.log(`✅ 代理端口: ${PROXY_PORT}`);
console.log(`✅ 目标应用: http://localhost:${TARGET_PORT}`);
console.log(`✅ API 服务器: https://${API_HOST}\n`);

// 错误处理
proxy.on('error', (err, req, res) => {
  console.error('代理错误:', err.message);
  if (res.writeHead) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Proxy Error: ' + err.message);
  }
});

apiProxy.on('error', (err, req, res) => {
  console.error('API代理错误:', err.message);
  if (res.writeHead) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('API Proxy Error: ' + err.message);
  }
});

// 处理代理响应
apiProxy.on('proxyRes', (proxyRes, req, res) => {
  // 捕获响应数据
  let body = [];
  proxyRes.on('data', function(chunk) {
    body.push(chunk);
  });
  
  proxyRes.on('end', function() {
    body = Buffer.concat(body);
    const responseText = body.toString();
    const responseData = tryParseJSON(responseText);
    
    const apiCall = {
      id: req._requestId,
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      endpoint: url.parse(req.url).pathname,
      query: url.parse(req.url, true).query,
      responseStatus: proxyRes.statusCode,
      responseData: responseData,
      responseTime: Date.now() - req._startTime,
      responseHeaders: proxyRes.headers
    };
    
    capturedAPIs.push(apiCall);
    
    // 更新模式
    const pattern = `${req.method} ${apiCall.endpoint}`;
    if (!apiPatterns[pattern]) {
      apiPatterns[pattern] = {
        calls: 0,
        examples: [],
        structure: null
      };
    }
    apiPatterns[pattern].calls++;
    
    if (proxyRes.statusCode === 200 && responseData) {
      apiPatterns[pattern].examples.push(responseData);
    }
    
    console.log(`✅ [${req._requestId}] 已捕获: ${req.method} ${apiCall.endpoint} (${proxyRes.statusCode}) - ${apiCall.responseTime}ms`);
    
    // 实时更新 Mock
    updateMocks();
    
    // 处理 Cookie（模拟 setupProxy.js 的行为）
    if (proxyRes.headers['set-cookie']) {
      const cookies = proxyRes.headers['set-cookie'];
      const hostname = req.headers.host.split(':')[0];
      
      proxyRes.headers['set-cookie'] = cookies.map(cookie => {
        // 处理 sid cookie
        if (cookie.includes('sid=')) {
          const businessName = hostname.split('.')[0];
          const replacedDomain = hostname.replace(businessName, '');
          return cookie.replace(/Domain=[^;]+;?/gi, `Domain=${replacedDomain};`);
        } else {
          // 其他 cookie 移除 Domain
          return cookie.replace(/Domain=[^;]+;?/gi, '');
        }
      });
    }
  });
});

// 创建服务器
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  const hostname = req.headers.host ? req.headers.host.split(':')[0] : 'localhost';
  
  // 记录请求
  req._requestId = ++requestId;
  req._startTime = Date.now();
  
  // 设置正确的 Host header
  req.headers.host = `${hostname}:${TARGET_PORT}`;
  
  // 判断是否是 API 请求
  if (parsedUrl.pathname.startsWith('/api/')) {
    console.log(`📡 [${req._requestId}] API 请求: ${req.method} ${req.url}`);
    
    // 修改请求头
    const business = hostname.split('.')[0];
    req.headers.host = API_HOST;
    req.headers.origin = `https://${business}.beep.test17.shub.us`;
    req.headers.referer = `https://${business}.beep.test17.shub.us/`;
    
    // 代理到 API 服务器
    apiProxy.web(req, res);
    
  } else if (req.url === '/__mock_stats') {
    // 统计端点
    res.writeHead(200, { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    
    res.end(JSON.stringify({
      totalCalls: capturedAPIs.length,
      patterns: Object.keys(apiPatterns).map(pattern => ({
        pattern,
        calls: apiPatterns[pattern].calls,
        examples: apiPatterns[pattern].examples.length
      })),
      recentCalls: capturedAPIs.slice(-20).map(call => ({
        id: call.id,
        time: call.timestamp,
        method: call.method,
        endpoint: call.endpoint,
        status: call.responseStatus,
        responseTime: call.responseTime
      }))
    }, null, 2));
    
  } else {
    // 代理其他请求到本地开发服务器
    proxy.web(req, res);
  }
});

// 处理 WebSocket
server.on('upgrade', (req, socket, head) => {
  console.log('🔌 WebSocket 升级请求:', req.url);
  proxy.ws(req, socket, head);
});

// 辅助函数
function tryParseJSON(str) {
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
  console.log(`\n✨ 完美代理服务器已启动！\n`);
  console.log('📌 使用方法:');
  console.log(`  1. 确保 beep-v1-webapp 正在运行 (yarn start)`);
  console.log(`  2. 访问以下地址:`);
  console.log(`     - http://localhost:${PROXY_PORT}`);
  console.log(`     - http://coffee.beep.local.shub.us:${PROXY_PORT}`);
  console.log(`     - http://jw.beep.local.shub.us:${PROXY_PORT}`);
  console.log(`  3. 所有功能与原版完全一致，同时捕获 API\n`);
  console.log(`📊 查看统计: http://localhost:${PROXY_PORT}/__mock_stats\n`);
});

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n👋 正在保存数据并关闭服务器...');
  
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
  process.exit(0);
});