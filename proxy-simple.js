#!/usr/bin/env node

/**
 * 简化版代理服务器 - 使用内置模块
 */

const http = require('http');
const https = require('https');
const url = require('url');
const fs = require('fs');
const path = require('path');

const PROXY_PORT = 3001;
const TARGET_PORT = 3000;
const API_HOST = 'coffee.beep.test17.shub.us';

// 存储捕获的 API
const capturedAPIs = [];
const apiPatterns = {};

console.log('🚀 启动 Mock-Driven Testing 代理服务器');
console.log(`✅ 代理端口: ${PROXY_PORT}`);
console.log(`✅ 目标应用: http://localhost:${TARGET_PORT}`);
console.log(`✅ API 服务器: https://${API_HOST}\n`);

// 创建代理服务器
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  
  // 判断是否是 API 请求
  if (parsedUrl.pathname.startsWith('/api/')) {
    // 代理 API 请求到远程服务器
    const options = {
      hostname: API_HOST,
      port: 443,
      path: req.url,
      method: req.method,
      headers: {
        ...req.headers,
        host: API_HOST
      }
    };
    
    console.log(`📡 API 请求: ${req.method} ${req.url}`);
    const startTime = Date.now();
    
    const proxyReq = https.request(options, (proxyRes) => {
      let body = '';
      
      proxyRes.on('data', (chunk) => {
        body += chunk;
      });
      
      proxyRes.on('end', () => {
        const responseTime = Date.now() - startTime;
        
        // 记录 API 调用
        const apiCall = {
          timestamp: new Date().toISOString(),
          method: req.method,
          endpoint: parsedUrl.pathname,
          responseStatus: proxyRes.statusCode,
          responseData: tryParseJSON(body),
          responseTime: responseTime
        };
        
        capturedAPIs.push(apiCall);
        
        // 更新模式
        const pattern = `${req.method} ${parsedUrl.pathname}`;
        if (!apiPatterns[pattern]) {
          apiPatterns[pattern] = {
            calls: 0,
            examples: []
          };
        }
        apiPatterns[pattern].calls++;
        if (proxyRes.statusCode === 200 && apiCall.responseData) {
          apiPatterns[pattern].examples.push(apiCall.responseData);
        }
        
        console.log(`✅ 已捕获: ${req.method} ${parsedUrl.pathname} (${proxyRes.statusCode}) - ${responseTime}ms`);
        
        // 实时更新 Mock
        updateMocks();
        
        // 转发响应
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        res.end(body);
      });
    });
    
    proxyReq.on('error', (err) => {
      console.error('❌ API 代理错误:', err);
      res.writeHead(500);
      res.end('Proxy Error');
    });
    
    req.pipe(proxyReq);
    
  } else if (req.url === '/__mock_stats') {
    // 统计端点
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      totalCalls: capturedAPIs.length,
      patterns: Object.keys(apiPatterns).map(pattern => ({
        pattern,
        calls: apiPatterns[pattern].calls
      })),
      recentCalls: capturedAPIs.slice(-10)
    }, null, 2));
    
  } else {
    // 代理其他请求到本地服务器
    const options = {
      hostname: '127.0.0.1',  // 使用 IPv4 地址避免 IPv6 问题
      port: TARGET_PORT,
      path: req.url,
      method: req.method,
      headers: req.headers
    };
    
    const proxyReq = http.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
    });
    
    proxyReq.on('error', (err) => {
      console.error('❌ 静态资源代理错误:', err);
      res.writeHead(500);
      res.end('Proxy Error');
    });
    
    req.pipe(proxyReq);
  }
});

// 尝试解析 JSON
function tryParseJSON(str) {
  try {
    return JSON.parse(str);
  } catch {
    return str;
  }
}

// 更新 Mock 文件
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
 * 实时捕获的 API Mock
 * 自动生成时间: ${new Date().toISOString()}
 * 已捕获 ${Object.keys(apiPatterns).length} 个端点
 */

import { rest } from 'msw';

export const handlers = [${handlers.join(',\n')}
];
`;
  
  // 确保目录存在
  const dir = path.dirname(mockFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(mockFile, content);
  console.log(`📝 已更新 Mock 文件 (${handlers.length} 个端点)`);
}

// 启动服务器
server.listen(PROXY_PORT, () => {
  console.log(`\n✨ 代理服务器已启动！\n`);
  console.log('📌 使用方法:');
  console.log(`  1. 访问 http://localhost:${PROXY_PORT} (而不是 localhost:3000)`);
  console.log('  2. 正常使用应用，所有 API 调用会被自动捕获');
  console.log('  3. Mock 文件会实时更新\n');
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