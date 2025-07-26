#!/usr/bin/env node

/**
 * 多域名代理服务器 - 支持 localhost 和 *.beep.local.shub.us
 */

const http = require('http');
const https = require('https');
const url = require('url');
const fs = require('fs');
const path = require('path');

const PROXY_PORT = 3001;
const TARGET_PORT = 3000;
const API_HOST = 'coffee.beep.test17.shub.us';

// 支持的本地域名
const LOCAL_DOMAINS = [
  'localhost',
  'jw.beep.local.shub.us',
  'coffee.beep.local.shub.us',
  'hcbeep.beep.local.shub.us',
  'www.beep.local.shub.us',
  'e-invoice.beep.local.shub.us'
];

// 存储捕获的 API
const capturedAPIs = [];
const apiPatterns = {};

console.log('🚀 启动 Mock-Driven Testing 多域名代理服务器');
console.log(`✅ 代理端口: ${PROXY_PORT}`);
console.log(`✅ 目标应用: http://localhost:${TARGET_PORT}`);
console.log(`✅ API 服务器: https://${API_HOST}`);
console.log(`✅ 支持的域名:`);
LOCAL_DOMAINS.forEach(domain => {
  console.log(`   - http://${domain}:${PROXY_PORT}`);
});
console.log();

// 创建代理服务器
const server = http.createServer((req, res) => {
  const host = req.headers.host;
  const hostname = host ? host.split(':')[0] : 'localhost';
  const parsedUrl = url.parse(req.url);
  
  // 记录访问的域名
  if (!req.url.includes('hot-update') && !req.url.includes('favicon')) {
    console.log(`🌐 请求来自: http://${host}${req.url}`);
  }
  
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
        host: API_HOST,
        origin: `https://${hostname.replace('.local', '')}.test17.shub.us`
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
          domain: hostname,
          method: req.method,
          endpoint: parsedUrl.pathname,
          query: parsedUrl.query,
          responseStatus: proxyRes.statusCode,
          responseData: tryParseJSON(body),
          responseTime: responseTime,
          headers: proxyRes.headers
        };
        
        capturedAPIs.push(apiCall);
        
        // 更新模式
        const pattern = `${req.method} ${parsedUrl.pathname}`;
        if (!apiPatterns[pattern]) {
          apiPatterns[pattern] = {
            calls: 0,
            domains: new Set(),
            examples: [],
            structure: null
          };
        }
        apiPatterns[pattern].calls++;
        apiPatterns[pattern].domains.add(hostname);
        
        if (proxyRes.statusCode === 200 && apiCall.responseData) {
          apiPatterns[pattern].examples.push(apiCall.responseData);
          if (!apiPatterns[pattern].structure) {
            apiPatterns[pattern].structure = analyzeStructure(apiCall.responseData);
          }
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
    res.writeHead(200, { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    
    const stats = {
      totalCalls: capturedAPIs.length,
      domains: [...new Set(capturedAPIs.map(c => c.domain))],
      patterns: Object.keys(apiPatterns).map(pattern => ({
        pattern,
        calls: apiPatterns[pattern].calls,
        domains: [...apiPatterns[pattern].domains],
        hasExamples: apiPatterns[pattern].examples.length > 0
      })),
      recentCalls: capturedAPIs.slice(-10).map(call => ({
        time: call.timestamp,
        domain: call.domain,
        method: call.method,
        endpoint: call.endpoint,
        status: call.responseStatus,
        responseTime: call.responseTime
      }))
    };
    
    res.end(JSON.stringify(stats, null, 2));
    
  } else {
    // 代理其他请求到本地服务器
    const targetHost = '127.0.0.1';
    const options = {
      hostname: targetHost,
      port: TARGET_PORT,
      path: req.url,
      method: req.method,
      headers: {
        ...req.headers,
        host: hostname + ':' + TARGET_PORT
      }
    };
    
    const proxyReq = http.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
    });
    
    proxyReq.on('error', (err) => {
      if (!req.url.includes('favicon.ico')) {
        console.error('❌ 静态资源代理错误:', err.message);
      }
      res.writeHead(500);
      res.end('Proxy Error');
    });
    
    req.pipe(proxyReq);
  }
});

// 处理 WebSocket
server.on('upgrade', (req, socket, head) => {
  const options = {
    hostname: '127.0.0.1',
    port: TARGET_PORT,
    path: req.url,
    method: req.method,
    headers: req.headers
  };
  
  const proxyReq = http.request(options);
  proxyReq.on('upgrade', (proxyRes, proxySocket, proxyHead) => {
    socket.write('HTTP/1.1 101 Switching Protocols\r\n' +
                 Object.keys(proxyRes.headers).map(key => `${key}: ${proxyRes.headers[key]}`).join('\r\n') +
                 '\r\n\r\n');
    proxySocket.pipe(socket);
    socket.pipe(proxySocket);
  });
  
  proxyReq.on('error', (err) => {
    console.error('❌ WebSocket 代理错误:', err);
    socket.end();
  });
  
  proxyReq.end();
});

// 辅助函数
function tryParseJSON(str) {
  try {
    return JSON.parse(str);
  } catch {
    return str;
  }
}

function analyzeStructure(data) {
  if (data === null) return { type: 'null' };
  if (data === undefined) return { type: 'undefined' };
  
  const type = typeof data;
  
  if (type === 'object') {
    if (Array.isArray(data)) {
      return {
        type: 'array',
        length: data.length,
        itemType: data.length > 0 ? analyzeStructure(data[0]) : { type: 'unknown' }
      };
    } else {
      const structure = { type: 'object', properties: {} };
      for (const [key, value] of Object.entries(data)) {
        structure.properties[key] = analyzeStructure(value);
      }
      return structure;
    }
  }
  
  return { type, example: data };
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
 * 捕获的域名:
${[...new Set(capturedAPIs.map(c => c.domain))].map(d => ` * - ${d}`).join('\n')}
 */

import { rest } from 'msw';

export const handlers = [${handlers.join(',\n')}
];

// API 模式统计
export const apiStats = ${JSON.stringify(
  Object.entries(apiPatterns).map(([pattern, data]) => ({
    pattern,
    calls: data.calls,
    domains: [...data.domains],
    hasData: data.examples.length > 0
  })), null, 2
)};
`;
  
  const dir = path.dirname(mockFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(mockFile, content);
  console.log(`📝 已更新 Mock 文件 (${handlers.length} 个端点)`);
}

// 启动服务器
server.listen(PROXY_PORT, () => {
  console.log(`\n✨ 多域名代理服务器已启动！\n`);
  console.log('📌 使用方法:');
  console.log(`  1. 确保 beep-v1-webapp 正在运行 (yarn start)`);
  console.log(`  2. 访问以下任一地址:`);
  console.log(`     - http://localhost:${PROXY_PORT}`);
  console.log(`     - http://coffee.beep.local.shub.us:${PROXY_PORT}`);
  console.log(`     - http://jw.beep.local.shub.us:${PROXY_PORT}`);
  console.log(`     - http://hcbeep.beep.local.shub.us:${PROXY_PORT}`);
  console.log('  3. 所有 API 调用会被自动捕获\n');
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
    domains: [...new Set(capturedAPIs.map(c => c.domain))],
    patterns: apiPatterns,
    calls: capturedAPIs
  }, null, 2));
  
  console.log(`✅ 已保存捕获数据到: ${captureFile}`);
  console.log(`📊 共捕获 ${capturedAPIs.length} 个 API 调用`);
  console.log(`📋 涵盖 ${Object.keys(apiPatterns).length} 个不同的端点`);
  process.exit(0);
});