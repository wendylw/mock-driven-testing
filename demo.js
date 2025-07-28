#!/usr/bin/env node

// MDT Phase 1 演示脚本 - 不依赖外部包的纯Node.js实现

const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// 简化的UUID生成
function generateId() {
  return crypto.randomBytes(16).toString('hex');
}

// 简化的Logger
class Logger {
  info(message, ...args) {
    console.log(`[INFO] ${message}`, ...args);
  }
  
  error(message, ...args) {
    console.error(`[ERROR] ${message}`, ...args);
  }
  
  debug(message, ...args) {
    console.log(`[DEBUG] ${message}`, ...args);
  }
}

const logger = new Logger();

// 简化的Mock存储
class MockStorage {
  constructor() {
    this.dataDir = path.join(__dirname, 'data');
    this.mocksFile = path.join(this.dataDir, 'mocks.json');
    this.ensureDataDir();
    this.mocks = this.loadMocks();
  }

  ensureDataDir() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }

  loadMocks() {
    try {
      if (fs.existsSync(this.mocksFile)) {
        return JSON.parse(fs.readFileSync(this.mocksFile, 'utf8'));
      }
    } catch (error) {
      logger.error('Error loading mocks:', error.message);
    }
    return [];
  }

  saveMocks() {
    fs.writeFileSync(this.mocksFile, JSON.stringify(this.mocks, null, 2));
  }

  createMock(mockData) {
    const mock = {
      id: generateId(),
      ...mockData,
      createdAt: new Date().toISOString()
    };
    this.mocks.push(mock);
    this.saveMocks();
    return mock;
  }

  getAllMocks() {
    return this.mocks;
  }

  getMockById(id) {
    return this.mocks.find(m => m.id === id);
  }

  getActiveMocks() {
    return this.mocks.filter(m => m.active !== false);
  }
}

// Mock匹配器
class MockMatcher {
  constructor(storage) {
    this.storage = storage;
  }

  findMatch(req) {
    const activeMocks = this.storage.getActiveMocks();
    
    for (const mock of activeMocks) {
      if (this.isMatch(req, mock)) {
        return mock;
      }
    }
    return null;
  }

  isMatch(req, mock) {
    if (mock.method && mock.method !== req.method) {
      return false;
    }
    
    const reqPath = url.parse(req.url).pathname;
    if (mock.url && reqPath !== mock.url) {
      return false;
    }
    
    return true;
  }
}

// MDT服务器
class MDTServer {
  constructor() {
    this.storage = new MockStorage();
    this.matcher = new MockMatcher(this.storage);
    this.port = 3001;
  }

  start() {
    const server = http.createServer((req, res) => {
      this.handleRequest(req, res);
    });

    server.listen(this.port, () => {
      logger.info(`🚀 MDT Demo Server started on http://localhost:${this.port}`);
      logger.info(`📚 Try these endpoints:`);
      logger.info(`   GET  /health - Health check`);
      logger.info(`   GET  /api/mocks - List mocks`);
      logger.info(`   POST /api/mocks - Create mock`);
      logger.info(`   GET  /demo - Demo endpoint (will be mocked)`);
    });

    return server;
  }

  async handleRequest(req, res) {
    try {
      // 解析请求体
      await this.parseRequestBody(req);
      
      const parsedUrl = url.parse(req.url, true);
      const pathname = parsedUrl.pathname;

      // 健康检查
      if (pathname === '/health') {
        return this.sendJSON(res, 200, { 
          status: 'ok', 
          version: '1.0.0',
          timestamp: new Date().toISOString() 
        });
      }

      // Mock管理API
      if (pathname.startsWith('/api/mocks')) {
        return this.handleMockAPI(req, res, pathname);
      }

      // 尝试Mock匹配
      const mock = this.matcher.findMatch(req);
      if (mock) {
        return this.handleMockResponse(req, res, mock);
      }

      // 默认响应
      this.sendJSON(res, 404, { 
        error: 'Not found',
        message: 'No mock or route matched',
        suggestion: 'Create a mock for this endpoint using POST /api/mocks'
      });

    } catch (error) {
      logger.error('Request handling error:', error.message);
      this.sendJSON(res, 500, { error: error.message });
    }
  }

  async parseRequestBody(req) {
    return new Promise((resolve) => {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        try {
          req.body = body ? JSON.parse(body) : {};
        } catch {
          req.body = body;
        }
        resolve();
      });
    });
  }

  handleMockAPI(req, res, pathname) {
    if (req.method === 'GET' && pathname === '/api/mocks') {
      // 获取所有Mock
      const mocks = this.storage.getAllMocks();
      return this.sendJSON(res, 200, { mocks, total: mocks.length });
    }

    if (req.method === 'POST' && pathname === '/api/mocks') {
      // 创建Mock
      try {
        const mock = this.storage.createMock(req.body);
        logger.info(`Mock created: ${mock.name}`);
        return this.sendJSON(res, 201, mock);
      } catch (error) {
        return this.sendJSON(res, 400, { error: error.message });
      }
    }

    return this.sendJSON(res, 404, { error: 'API endpoint not found' });
  }

  handleMockResponse(req, res, mock) {
    logger.info(`Mock matched: ${mock.name}`);
    
    const status = mock.response?.status || 200;
    const headers = mock.response?.headers || {};
    const body = mock.response?.body || { message: 'Mock response' };

    // 设置响应头
    Object.entries(headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });

    this.sendJSON(res, status, body);
  }

  sendJSON(res, status, data) {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data, null, 2));
  }
}

// 启动演示
if (require.main === module) {
  const server = new MDTServer();
  server.start();

  // 创建一些演示Mock
  setTimeout(() => {
    logger.info('\n🎭 Creating demo mocks...');
    
    // 演示Mock 1
    server.storage.createMock({
      name: 'Demo API - Success',
      method: 'GET',
      url: '/demo',
      response: {
        status: 200,
        body: {
          message: 'Hello from MDT Mock!',
          timestamp: new Date().toISOString(),
          version: '1.0.0'
        }
      }
    });

    // 演示Mock 2
    server.storage.createMock({
      name: 'User API - Mock User',
      method: 'GET',
      url: '/api/user',
      response: {
        status: 200,
        body: {
          id: 1,
          name: 'Mock User',
          email: 'mock@example.com'
        }
      }
    });

    logger.info('✅ Demo mocks created!');
    logger.info('\n🧪 Test the server:');
    logger.info('   curl http://localhost:3001/health');
    logger.info('   curl http://localhost:3001/api/mocks');
    logger.info('   curl http://localhost:3001/demo');
    logger.info('   curl http://localhost:3001/api/user');
  }, 1000);
}

module.exports = MDTServer;