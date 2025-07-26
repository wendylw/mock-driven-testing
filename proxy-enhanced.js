#!/usr/bin/env node

/**
 * 增强版代理服务器 - 特别优化 GraphQL 支持
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
  'coffee.beep.local.shub.us',
  'jw.beep.local.shub.us',
  'hcbeep.beep.local.shub.us'
];

// 存储捕获的 API
const capturedAPIs = [];
const apiPatterns = {};
let requestId = 0;

console.log('🚀 启动 Mock-Driven Testing 增强版代理服务器');
console.log(`✅ 代理端口: ${PROXY_PORT}`);
console.log(`✅ 目标应用: http://localhost:${TARGET_PORT}`);
console.log(`✅ API 服务器: https://${API_HOST}\n`);

// 创建代理服务器
const server = http.createServer((req, res) => {
  const host = req.headers.host;
  const hostname = host ? host.split(':')[0] : 'localhost';
  const parsedUrl = url.parse(req.url, true); // 解析查询参数
  const reqId = ++requestId;
  
  // 判断是否是 API 请求
  if (parsedUrl.pathname.startsWith('/api/')) {
    // 特别处理 GraphQL 请求
    const isGraphQL = parsedUrl.pathname.startsWith('/api/gql/');
    
    if (isGraphQL) {
      console.log(`\n🔷 [${reqId}] GraphQL 请求: ${req.method} ${parsedUrl.pathname}`);
      console.log(`   查询参数:`, parsedUrl.query);
    } else {
      console.log(`\n📡 [${reqId}] API 请求: ${req.method} ${req.url}`);
    }
    
    // 代理 API 请求到远程服务器
    const options = {
      hostname: API_HOST,
      port: 443,
      path: req.url,
      method: req.method,
      headers: {
        ...req.headers,
        host: API_HOST,
        origin: `https://${hostname.replace('.local', '')}.test17.shub.us`,
        referer: `https://${hostname.replace('.local', '')}.test17.shub.us/`
      }
    };
    
    // 对于 GraphQL，确保正确的 Content-Type
    if (isGraphQL && req.method === 'POST') {
      options.headers['content-type'] = 'application/json';
    }
    
    const startTime = Date.now();
    
    const proxyReq = https.request(options, (proxyRes) => {
      let body = '';
      
      proxyRes.on('data', (chunk) => {
        body += chunk;
      });
      
      proxyRes.on('end', () => {
        const responseTime = Date.now() - startTime;
        
        // 解析响应
        let responseData = tryParseJSON(body);
        
        // 记录 API 调用
        const apiCall = {
          id: reqId,
          timestamp: new Date().toISOString(),
          domain: hostname,
          method: req.method,
          endpoint: parsedUrl.pathname,
          query: parsedUrl.query,
          isGraphQL: isGraphQL,
          requestHeaders: req.headers,
          responseStatus: proxyRes.statusCode,
          responseData: responseData,
          responseTime: responseTime,
          responseHeaders: proxyRes.headers
        };
        
        capturedAPIs.push(apiCall);
        
        // 更新模式
        const pattern = `${req.method} ${parsedUrl.pathname}`;
        if (!apiPatterns[pattern]) {
          apiPatterns[pattern] = {
            calls: 0,
            isGraphQL: isGraphQL,
            domains: new Set(),
            examples: [],
            queries: new Set(),
            structure: null
          };
        }
        
        apiPatterns[pattern].calls++;
        apiPatterns[pattern].domains.add(hostname);
        
        // 记录 GraphQL 查询参数
        if (isGraphQL && parsedUrl.query) {
          Object.keys(parsedUrl.query).forEach(key => {
            apiPatterns[pattern].queries.add(key);
          });
        }
        
        if (proxyRes.statusCode === 200 && responseData) {
          apiPatterns[pattern].examples.push({
            query: parsedUrl.query,
            response: responseData
          });
          
          if (!apiPatterns[pattern].structure) {
            apiPatterns[pattern].structure = analyzeStructure(responseData);
          }
        }
        
        // 显示响应状态
        const statusEmoji = proxyRes.statusCode === 200 ? '✅' : '❌';
        console.log(`${statusEmoji} [${reqId}] 响应: ${proxyRes.statusCode} - ${responseTime}ms`);
        
        // 如果是 GraphQL 且有错误，显示错误信息
        if (isGraphQL && responseData && responseData.errors) {
          console.log(`   ⚠️  GraphQL 错误:`, responseData.errors);
        }
        
        // 如果是 CoreStores，显示特殊信息
        if (parsedUrl.pathname === '/api/gql/CoreStores') {
          console.log(`   📍 CoreStores 请求参数:`, parsedUrl.query);
          if (responseData && responseData.data) {
            console.log(`   📍 返回数据概要:`, {
              hasData: !!responseData.data,
              dataKeys: Object.keys(responseData.data || {})
            });
          }
        }
        
        // 实时更新 Mock
        updateMocks();
        
        // 转发响应
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        res.end(body);
      });
    });
    
    proxyReq.on('error', (err) => {
      console.error(`❌ [${reqId}] API 代理错误:`, err.message);
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Proxy Error', details: err.message }));
    });
    
    // 转发请求体（如果有）
    req.pipe(proxyReq);
    
  } else if (req.url === '/__mock_stats') {
    // 增强的统计端点
    res.writeHead(200, { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    
    const graphqlStats = Object.entries(apiPatterns)
      .filter(([pattern, data]) => data.isGraphQL)
      .map(([pattern, data]) => ({
        pattern,
        calls: data.calls,
        queries: [...data.queries],
        exampleCount: data.examples.length
      }));
    
    const stats = {
      totalCalls: capturedAPIs.length,
      graphqlCalls: capturedAPIs.filter(c => c.isGraphQL).length,
      domains: [...new Set(capturedAPIs.map(c => c.domain))],
      graphqlEndpoints: graphqlStats,
      coreStoresInfo: apiPatterns['GET /api/gql/CoreStores'] || null,
      recentCalls: capturedAPIs.slice(-20).map(call => ({
        id: call.id,
        time: call.timestamp,
        domain: call.domain,
        method: call.method,
        endpoint: call.endpoint,
        isGraphQL: call.isGraphQL,
        status: call.responseStatus,
        responseTime: call.responseTime,
        query: call.query
      }))
    };
    
    res.end(JSON.stringify(stats, null, 2));
    
  } else if (req.url === '/__captured_data') {
    // 返回所有捕获的数据
    res.writeHead(200, { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify(capturedAPIs, null, 2));
    
  } else {
    // 代理其他请求到本地服务器
    const options = {
      hostname: '127.0.0.1',
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
      if (!req.url.includes('favicon') && !req.url.includes('hot-update')) {
        console.error('❌ 静态资源代理错误:', err.message);
      }
      res.writeHead(500);
      res.end('Proxy Error');
    });
    
    req.pipe(proxyReq);
  }
});

// WebSocket 支持
server.on('upgrade', (req, socket, head) => {
  console.log('🔌 WebSocket 连接:', req.url);
  
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
      
      // 对于 GraphQL，可能需要根据查询参数返回不同的响应
      if (data.isGraphQL) {
        // 使用最新的例子
        const latestExample = data.examples[data.examples.length - 1];
        handlers.push(`
  rest.${method.toLowerCase()}('${endpoint}', (req, res, ctx) => {
    // GraphQL endpoint: ${endpoint}
    // Query parameters seen: ${[...data.queries].join(', ')}
    return res(
      ctx.status(200),
      ctx.json(${JSON.stringify(latestExample.response, null, 4)})
    );
  })`);
      } else {
        // 普通 REST API
        const latestExample = data.examples[data.examples.length - 1];
        handlers.push(`
  rest.${method.toLowerCase()}('${endpoint}', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(${JSON.stringify(latestExample.response || latestExample, null, 4)})
    );
  })`);
      }
    }
  }
  
  const content = `/**
 * 实时捕获的 API Mock - 基于真实的 beep-v1-webapp API 响应
 * 自动生成时间: ${new Date().toISOString()}
 * 已捕获 ${Object.keys(apiPatterns).length} 个端点，共 ${capturedAPIs.length} 次调用
 * GraphQL 调用: ${capturedAPIs.filter(c => c.isGraphQL).length} 次
 */

import { rest } from 'msw';

export const handlers = [${handlers.join(',\n')}
];

// GraphQL 端点信息
export const graphqlEndpoints = ${JSON.stringify(
  Object.entries(apiPatterns)
    .filter(([_, data]) => data.isGraphQL)
    .map(([pattern, data]) => ({
      pattern,
      calls: data.calls,
      queries: [...data.queries]
    })), 
  null, 
  2
)};
`;
  
  const dir = path.dirname(mockFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(mockFile, content);
}

// 启动服务器
server.listen(PROXY_PORT, () => {
  console.log(`\n✨ 增强版代理服务器已启动！\n`);
  console.log('📌 使用方法:');
  console.log(`  1. 确保 beep-v1-webapp 正在运行 (yarn start)`);
  console.log(`  2. 访问: http://coffee.beep.local.shub.us:${PROXY_PORT}`);
  console.log(`  3. 正常使用应用，所有 API 调用会被自动捕获\n`);
  console.log('🔍 特别关注:');
  console.log('  - GraphQL 端点 (/api/gql/*) 会被特殊处理');
  console.log('  - CoreStores 请求会显示详细信息\n');
  console.log(`📊 查看统计: http://localhost:${PROXY_PORT}/__mock_stats`);
  console.log(`📋 查看数据: http://localhost:${PROXY_PORT}/__captured_data\n`);
});

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n👋 正在保存数据并关闭服务器...');
  
  // 显示 CoreStores 的统计
  const coreStoresPattern = apiPatterns['GET /api/gql/CoreStores'];
  if (coreStoresPattern) {
    console.log('\n📍 CoreStores 统计:');
    console.log(`  - 调用次数: ${coreStoresPattern.calls}`);
    console.log(`  - 查询参数: ${[...coreStoresPattern.queries].join(', ')}`);
    console.log(`  - 示例数量: ${coreStoresPattern.examples.length}`);
  }
  
  const captureFile = path.join(__dirname, `captured-data/final-capture-${Date.now()}.json`);
  const captureDir = path.dirname(captureFile);
  
  if (!fs.existsSync(captureDir)) {
    fs.mkdirSync(captureDir, { recursive: true });
  }
  
  fs.writeFileSync(captureFile, JSON.stringify({
    captureDate: new Date().toISOString(),
    totalCalls: capturedAPIs.length,
    graphqlCalls: capturedAPIs.filter(c => c.isGraphQL).length,
    patterns: apiPatterns,
    calls: capturedAPIs
  }, null, 2));
  
  console.log(`\n✅ 已保存捕获数据到: ${captureFile}`);
  console.log(`📊 共捕获 ${capturedAPIs.length} 个 API 调用`);
  console.log(`🔷 其中 GraphQL: ${capturedAPIs.filter(c => c.isGraphQL).length} 个`);
  process.exit(0);
});