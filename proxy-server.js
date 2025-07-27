#!/usr/bin/env node

/**
 * 多项目支持的代理服务器
 * 基于 proxy-final.js 重构
 */

const http = require('http');
const https = require('https');
const url = require('url');
const fs = require('fs');
const path = require('path');
const net = require('net');

class ProxyServer {
  constructor(projectName) {
    const projects = require('./config/projects');
    if (!projects[projectName]) {
      throw new Error(`未找到项目配置: ${projectName}`);
    }
    
    this.projectName = projectName;
    this.config = projects[projectName];
    this.proxyPort = this.config.proxyPort;
    this.targetPort = this.config.targetPort;
    this.apiHost = this.config.apiHost;
    
    // 存储捕获的 API
    this.capturedAPIs = [];
    this.apiPatterns = {};
    this.requestId = 0;
    
    // 加载参数化Mock补丁
    this.mockPatch = require('./parameterized-patch');
    
    // 加载特殊session处理器
    if (this.config.sessionHandler) {
      this.sessionHandler = require(`./session-handlers/${this.config.sessionHandler}`);
    }
  }
  
  start() {
    console.log(`🚀 启动 ${this.config.name} Mock-Driven Testing 代理服务器`);
    console.log(`✅ 代理端口: ${this.proxyPort}`);
    console.log(`✅ 目标应用: http://localhost:${this.targetPort}`);
    console.log(`✅ API 服务器: https://${this.apiHost}`);
    
    if (this.config.domains) {
      console.log(`✅ 支持域名: ${this.config.domains.join(', ')}`);
    }
    
    if (this.config.supportedBusinesses) {
      console.log('\n📌 访问地址:');
      this.config.supportedBusinesses.forEach(business => {
        const domain = this.config.domains[0].replace('*', business);
        console.log(`   - http://${domain}:${this.proxyPort}`);
      });
    }
    
    this.createServer();
  }
  
  createServer() {
    const server = http.createServer((req, res) => {
      const parsedUrl = url.parse(req.url);
      const hostname = req.headers.host ? req.headers.host.split(':')[0] : 'localhost';
      const reqId = ++this.requestId;
      const startTime = Date.now();
      const businessName = this.resolveBusinessName(hostname);
      
      // 判断是否是 API 请求
      if (this.isApiRequest(parsedUrl.pathname)) {
        console.log(`📡 [${reqId}] API 请求: ${req.method} ${req.url} (业务: ${businessName})`);
        this.handleApiRequest(req, res, parsedUrl, hostname, reqId, startTime, businessName);
      } else if (req.url === '/__parameterized_info') {
        this.handleParameterizedInfo(res);
      } else if (req.url === '/__mock_stats') {
        this.handleMockStats(res, businessName);
      } else {
        this.handleStaticRequest(req, res, hostname);
      }
    });
    
    // 处理 WebSocket (Hot Module Replacement)
    server.on('upgrade', (req, socket, head) => {
      this.handleWebSocketUpgrade(req, socket, head);
    });
    
    // 启动服务器
    server.listen(this.proxyPort, '0.0.0.0', () => {
      console.log(`\n✨ ${this.config.name} 代理服务器已启动！\n`);
      this.generateHostsConfig();
      console.log(`\n📊 查看捕获统计: http://localhost:${this.proxyPort}/__mock_stats\n`);
    });
    
    // 错误处理
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`\n❌ 端口 ${this.proxyPort} 已被占用！`);
        console.error('请先关闭占用该端口的程序');
      } else {
        console.error('\n❌ 服务器错误:', err);
      }
      process.exit(1);
    });
    
    // 优雅关闭
    process.on('SIGINT', () => {
      this.gracefulShutdown();
    });
  }
  
  isApiRequest(pathname) {
    return this.config.apiPatterns.some(pattern => pathname.startsWith(pattern));
  }
  
  resolveBusinessName(hostname) {
    const hostnames = hostname.split('.');
    return hostnames[0];
  }
  
  replaceHostNameWithBusiness(requestHost, targetHost) {
    if (!requestHost || requestHost.toLowerCase().startsWith('localhost')) {
      return targetHost;
    }
    
    if (targetHost.toLowerCase().startsWith('localhost')) {
      return requestHost;
    }
    
    const businessName = this.resolveBusinessName(requestHost);
    return targetHost.replace(/^[^.]+/, businessName);
  }
  
  handleApiRequest(req, res, parsedUrl, hostname, reqId, startTime, businessName) {
    let requestBody = '';
    req.on('data', chunk => {
      requestBody += chunk.toString();
    });
    
    req.on('end', async () => {
      // 检查是否使用参数化Mock
      if (this.mockPatch.shouldUseMock(req.url)) {
        this.handleParameterizedMock(req, res, parsedUrl, requestBody, reqId, startTime);
        return;
      }
      
      // 代理到真实API服务器
      this.proxyApiRequest(req, res, parsedUrl, hostname, requestBody, reqId, startTime, businessName);
    });
  }
  
  async handleParameterizedMock(req, res, parsedUrl, requestBody, reqId, startTime) {
    console.log(`🎯 [${reqId}] 使用参数化Mock`);
    
    try {
      const mockResponse = await this.mockPatch.generateMockResponse(
        parsedUrl, 
        req.method, 
        this.tryParseJSON(requestBody)
      );
      const responseTime = Date.now() - startTime;
      
      console.log(`✅ [${reqId}] Mock响应: 200 - ${responseTime}ms (参数化)`);
      
      res.writeHead(200, { 
        'Content-Type': 'application/json',
        'X-Mock-Source': 'parameterized',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(JSON.stringify(mockResponse, null, 2));
    } catch (error) {
      console.error(`❌ [${reqId}] Mock生成失败:`, error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Mock generation failed' }));
    }
  }
  
  proxyApiRequest(req, res, parsedUrl, hostname, requestBody, reqId, startTime, businessName) {
    const options = {
      hostname: this.apiHost,
      port: 443,
      path: req.url,
      method: req.method,
      headers: {
        ...req.headers,
        host: this.apiHost,
        origin: `https://${hostname.replace('.local', '').replace('.shub.us', '')}.${this.config.name.includes('BackOffice') ? 'backoffice' : 'beep'}.test17.shub.us`,
        referer: `https://${hostname.replace('.local', '').replace('.shub.us', '')}.${this.config.name.includes('BackOffice') ? 'backoffice' : 'beep'}.test17.shub.us/`
      }
    };
    
    // 移除可能导致问题的 header
    delete options.headers['accept-encoding'];
    
    // 应用session处理器（如果有）
    if (this.sessionHandler) {
      this.sessionHandler.onProxyReq(options, req);
    }
    
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
          business: businessName,
          method: req.method,
          endpoint: parsedUrl.pathname,
          query: parsedUrl.query,
          requestBody: this.tryParseJSON(requestBody),
          responseStatus: proxyRes.statusCode,
          responseData: this.tryParseJSON(responseBody),
          responseTime: responseTime,
          responseHeaders: proxyRes.headers
        };
        
        this.capturedAPIs.push(apiCall);
        this.updateApiPatterns(req, parsedUrl, apiCall);
        
        console.log(`✅ [${reqId}] 响应: ${proxyRes.statusCode} - ${responseTime}ms`);
        
        // 处理 Cookie
        this.processCookies(proxyRes, req, hostname);
        
        // 应用session处理器（如果有）
        if (this.sessionHandler) {
          this.sessionHandler.onProxyRes(proxyRes, req, res);
        }
        
        // 实时更新 Mock
        this.updateMocks(businessName);
        
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
  }
  
  processCookies(proxyRes, req, hostname) {
    if (proxyRes.headers['set-cookie']) {
      const cookies = proxyRes.headers['set-cookie'];
      proxyRes.headers['set-cookie'] = cookies.map(cookie => {
        if (cookie.includes('sid=')) {
          const businessName = this.resolveBusinessName(hostname);
          const replacedDomain = hostname.replace(businessName, '');
          return cookie.replace(/Domain=[^;]+;?/gi, `Domain=${replacedDomain};`);
        } else {
          return cookie.replace(/Domain=[^;]+;?/gi, '');
        }
      });
    }
  }
  
  updateApiPatterns(req, parsedUrl, apiCall) {
    let pattern = `${req.method} ${parsedUrl.pathname}`;
    let paramKey = null;
    
    try {
      // GraphQL请求参数提取
      if (parsedUrl.pathname.startsWith('/api/gql/')) {
        const reqBody = apiCall.requestBody;
        if (reqBody && reqBody.variables) {
          paramKey = reqBody.variables.productId || 
                    reqBody.variables.orderId || 
                    reqBody.variables.storeId || 
                    reqBody.variables.consumerId ||
                    reqBody.variables.id;
        }
      }
      // REST接口参数提取
      else if (parsedUrl.pathname.includes('/')) {
        const pathSegments = parsedUrl.pathname.split('/');
        for (const segment of pathSegments) {
          if (segment.length > 10 || /^\d+$/.test(segment)) {
            paramKey = segment;
            break;
          }
        }
      }
      
      if (paramKey) {
        pattern = `${req.method} ${parsedUrl.pathname}#${paramKey}`;
      }
    } catch (e) {
      // 解析失败，使用原始pattern
    }
    
    if (!this.apiPatterns[pattern]) {
      this.apiPatterns[pattern] = {
        calls: 0,
        examples: [],
        domains: new Set(),
        businesses: new Set()
      };
    }
    
    this.apiPatterns[pattern].calls++;
    this.apiPatterns[pattern].domains.add(apiCall.domain);
    this.apiPatterns[pattern].businesses.add(apiCall.business);
    
    if (apiCall.responseStatus === 200 && apiCall.responseData) {
      this.apiPatterns[pattern].examples.push(apiCall.responseData);
    }
  }
  
  updateMocks(businessName) {
    const outputDir = path.join(__dirname, 'generated', this.projectName, businessName);
    const mockFile = path.join(outputDir, 'api-mocks-realtime.js');
    
    // 确保目录存在
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const handlers = [];
    
    // 生成 Mock handlers
    for (const [pattern, data] of Object.entries(this.apiPatterns)) {
      if (data.examples.length > 0 && data.businesses.has(businessName)) {
        const [method, endpoint] = pattern.split(' ');
        const mockData = data.examples[data.examples.length - 1];
        
        handlers.push(`
  rest.${method.toLowerCase()}('${endpoint.split('#')[0]}', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(${JSON.stringify(mockData, null, 4)})
    );
  })`);
      }
    }
    
    const content = `/**
 * 实时捕获的 API Mock - ${this.config.name} (${businessName})
 * 自动生成时间: ${new Date().toISOString()}
 * 已捕获 ${Object.keys(this.apiPatterns).length} 个端点
 */

import { rest } from 'msw';

export const handlers = [${handlers.join(',\n')}
];
`;
    
    fs.writeFileSync(mockFile, content);
  }
  
  handleStaticRequest(req, res, hostname) {
    const options = {
      hostname: '127.0.0.1',
      port: this.targetPort,
      path: req.url,
      method: req.method,
      headers: {
        ...req.headers,
        // 保持原始 host，让 webpack-dev-server 识别域名
        host: hostname + ':' + this.targetPort
      }
    };
    
    const proxyReq = http.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
    });
    
    proxyReq.on('error', (err) => {
      if (!req.url.includes('favicon.ico') && !req.url.includes('hot-update')) {
        console.error('❌ 静态资源代理错误:', err.message);
        console.error(`   请确保 ${this.config.name} 正在 localhost:${this.targetPort} 运行`);
      }
      res.writeHead(502, { 'Content-Type': 'text/html' });
      res.end(`
        <h1>502 Bad Gateway</h1>
        <p>无法连接到 ${this.config.name} (localhost:${this.targetPort})</p>
        <p>请确保已经运行相应的启动命令</p>
        <p>错误: ${err.message}</p>
      `);
    });
    
    req.pipe(proxyReq);
  }
  
  handleParameterizedInfo(res) {
    res.writeHead(200, { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify(this.mockPatch.getPatchInfo(), null, 2));
  }
  
  handleMockStats(res, businessName) {
    res.writeHead(200, { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    
    const stats = {
      project: this.config.name,
      currentBusiness: businessName,
      totalCalls: this.capturedAPIs.length,
      domains: [...new Set(this.capturedAPIs.map(c => c.domain))],
      businesses: [...new Set(this.capturedAPIs.map(c => c.business))],
      patterns: Object.keys(this.apiPatterns).map(pattern => ({
        pattern,
        calls: this.apiPatterns[pattern].calls,
        domains: [...this.apiPatterns[pattern].domains],
        businesses: [...this.apiPatterns[pattern].businesses],
        examples: this.apiPatterns[pattern].examples.length
      })),
      recentCalls: this.capturedAPIs.slice(-20).map(call => ({
        id: call.id,
        time: call.timestamp,
        domain: call.domain,
        business: call.business,
        method: call.method,
        endpoint: call.endpoint,
        status: call.responseStatus,
        responseTime: call.responseTime
      }))
    };
    
    res.end(JSON.stringify(stats, null, 2));
  }
  
  handleWebSocketUpgrade(req, socket, head) {
    console.log('🔌 WebSocket 升级:', req.url);
    
    const target = net.createConnection(this.targetPort, '127.0.0.1', () => {
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
  }
  
  generateHostsConfig() {
    if (!this.config.domains || !this.config.supportedBusinesses) return;
    
    console.log('📌 请确保 /etc/hosts 包含以下配置:');
    this.config.supportedBusinesses.forEach(business => {
      const domain = this.config.domains[0].replace('*', business);
      console.log(`   127.0.0.1    ${domain}`);
    });
  }
  
  tryParseJSON(str) {
    if (!str) return null;
    try {
      return JSON.parse(str);
    } catch {
      return str;
    }
  }
  
  gracefulShutdown() {
    console.log('\n\n👋 正在保存数据并关闭服务器...');
    
    const captureDir = path.join(__dirname, 'captured-data', this.projectName);
    const captureFile = path.join(captureDir, `capture-${Date.now()}.json`);
    
    if (!fs.existsSync(captureDir)) {
      fs.mkdirSync(captureDir, { recursive: true });
    }
    
    const captureData = {
      project: this.config.name,
      captureDate: new Date().toISOString(),
      totalCalls: this.capturedAPIs.length,
      patterns: this.apiPatterns,
      calls: this.capturedAPIs
    };
    
    fs.writeFileSync(captureFile, JSON.stringify(captureData, null, 2));
    
    console.log(`✅ 已保存捕获数据到: ${captureFile}`);
    console.log(`📊 共捕获 ${this.capturedAPIs.length} 个 API 调用`);
    console.log(`📋 涵盖 ${Object.keys(this.apiPatterns).length} 个不同的端点`);
    
    // 按业务分组统计
    const businessStats = {};
    this.capturedAPIs.forEach(call => {
      if (!businessStats[call.business]) {
        businessStats[call.business] = 0;
      }
      businessStats[call.business]++;
    });
    
    console.log('\n📈 按业务统计:');
    Object.entries(businessStats).forEach(([business, count]) => {
      console.log(`   ${business}: ${count} 个调用`);
    });
    
    process.exit(0);
  }
}

module.exports = ProxyServer;

// 如果直接运行此文件
if (require.main === module) {
  const projectName = process.argv[2];
  if (!projectName) {
    console.error('请指定项目名称');
    process.exit(1);
  }
  
  const server = new ProxyServer(projectName);
  server.start();
}