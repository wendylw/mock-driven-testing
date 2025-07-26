#!/usr/bin/env node

/**
 * 代理服务器 - 自动捕获 beep-v1-webapp 的 API 调用并更新 Mock
 */

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;
const TARGET = 'http://localhost:3000';
const API_TARGET = 'https://coffee.beep.test17.shub.us';

// 存储捕获的 API
const capturedAPIs = [];
const apiPatterns = {};

// 日志颜色
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m'
};

console.log(`${colors.blue}🚀 启动 Mock-Driven Testing 代理服务器${colors.reset}`);
console.log(`${colors.green}✅ 代理端口: ${PORT}${colors.reset}`);
console.log(`${colors.green}✅ 目标应用: ${TARGET}${colors.reset}`);
console.log(`${colors.green}✅ API 服务器: ${API_TARGET}${colors.reset}\n`);

// 解析响应体
function parseResponseBody(body, contentType) {
  if (contentType && contentType.includes('application/json')) {
    try {
      return JSON.parse(body);
    } catch (e) {
      return body;
    }
  }
  return body;
}

// 分析数据结构
function analyzeStructure(data, path = '') {
  if (data === null) return { type: 'null' };
  if (data === undefined) return { type: 'undefined' };
  
  const type = typeof data;
  
  if (type === 'object') {
    if (Array.isArray(data)) {
      return {
        type: 'array',
        length: data.length,
        itemType: data.length > 0 ? analyzeStructure(data[0], path + '[]') : { type: 'unknown' }
      };
    } else {
      const structure = { type: 'object', properties: {} };
      for (const [key, value] of Object.entries(data)) {
        structure.properties[key] = analyzeStructure(value, path + '.' + key);
      }
      return structure;
    }
  }
  
  return { type, example: data };
}

// API 代理中间件
const apiProxy = createProxyMiddleware({
  target: API_TARGET,
  changeOrigin: true,
  selfHandleResponse: true,
  onProxyReq: (proxyReq, req, res) => {
    console.log(`${colors.yellow}📡 API 请求: ${req.method} ${req.url}${colors.reset}`);
    
    // 记录请求开始时间
    req.startTime = Date.now();
  },
  onProxyRes: (proxyRes, req, res) => {
    const chunks = [];
    
    proxyRes.on('data', chunk => {
      chunks.push(chunk);
    });
    
    proxyRes.on('end', () => {
      const body = Buffer.concat(chunks).toString();
      const responseTime = Date.now() - req.startTime;
      
      // 解析响应
      const contentType = proxyRes.headers['content-type'];
      const responseData = parseResponseBody(body, contentType);
      
      // 记录 API 调用
      const apiCall = {
        timestamp: new Date().toISOString(),
        method: req.method,
        endpoint: req.url,
        requestBody: req.body,
        responseStatus: proxyRes.statusCode,
        responseData: responseData,
        responseTime: responseTime,
        contentType: contentType
      };
      
      capturedAPIs.push(apiCall);
      
      // 分析模式
      const pattern = `${req.method} ${req.url.split('?')[0]}`;
      if (!apiPatterns[pattern]) {
        apiPatterns[pattern] = {
          calls: 0,
          structure: null,
          examples: []
        };
      }
      
      apiPatterns[pattern].calls++;
      if (proxyRes.statusCode === 200 && responseData) {
        apiPatterns[pattern].structure = analyzeStructure(responseData);
        apiPatterns[pattern].examples.push(responseData);
      }
      
      console.log(`${colors.green}✅ 已捕获: ${req.method} ${req.url} (${proxyRes.statusCode}) - ${responseTime}ms${colors.reset}`);
      
      // 实时更新 Mock
      updateMocks();
      
      // 转发响应
      res.status(proxyRes.statusCode);
      Object.keys(proxyRes.headers).forEach(key => {
        res.setHeader(key, proxyRes.headers[key]);
      });
      res.end(body);
    });
  }
});

// 静态资源代理
const staticProxy = createProxyMiddleware({
  target: TARGET,
  changeOrigin: true,
  ws: true
});

// 路由配置
app.use('/api', apiProxy);
app.use('/', staticProxy);

// 更新 Mock 文件
function updateMocks() {
  const mockFile = path.join(__dirname, 'generated/beep-v1-webapp/api-mocks-realtime.js');
  const handlers = [];
  
  for (const [pattern, data] of Object.entries(apiPatterns)) {
    if (data.examples.length > 0) {
      const [method, endpoint] = pattern.split(' ');
      const mockData = data.examples[data.examples.length - 1]; // 使用最新的例子
      
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

export const setupMocks = (worker) => {
  handlers.forEach(handler => worker.use(handler));
};
`;
  
  // 确保目录存在
  const dir = path.dirname(mockFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(mockFile, content);
  console.log(`${colors.blue}📝 已更新 Mock 文件 (${handlers.length} 个端点)${colors.reset}`);
}

// API 统计端点
app.get('/__mock_stats', (req, res) => {
  res.json({
    totalCalls: capturedAPIs.length,
    patterns: Object.keys(apiPatterns).map(pattern => ({
      pattern,
      calls: apiPatterns[pattern].calls,
      hasStructure: !!apiPatterns[pattern].structure
    })),
    recentCalls: capturedAPIs.slice(-10).map(call => ({
      time: call.timestamp,
      method: call.method,
      endpoint: call.endpoint,
      status: call.responseStatus,
      responseTime: call.responseTime
    }))
  });
});

// 下载捕获数据
app.get('/__download_capture', (req, res) => {
  const data = {
    captureDate: new Date().toISOString(),
    totalCalls: capturedAPIs.length,
    patterns: apiPatterns,
    calls: capturedAPIs
  };
  
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename=beep-capture-${Date.now()}.json`);
  res.send(JSON.stringify(data, null, 2));
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`${colors.bright}${colors.green}✨ 代理服务器已启动！${colors.reset}\n`);
  console.log('📌 使用方法:');
  console.log(`  1. 访问 ${colors.bright}http://localhost:${PORT}${colors.reset} (而不是 localhost:3000)`);
  console.log('  2. 正常使用应用，所有 API 调用会被自动捕获');
  console.log('  3. Mock 文件会实时更新\n');
  console.log('📊 查看统计: http://localhost:3001/__mock_stats');
  console.log('💾 下载数据: http://localhost:3001/__download_capture\n');
});

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n👋 正在保存数据并关闭服务器...');
  
  // 保存最终的捕获数据
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