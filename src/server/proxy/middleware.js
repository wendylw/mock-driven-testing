const url = require('url');
const crypto = require('crypto');
const MockService = require('../mock/service');
const MockMatcher = require('./matcher');
const config = require('../utils/config');
const logger = require('../utils/logger');

// 简化的UUID生成
function generateId() {
  return crypto.randomBytes(16).toString('hex');
}

class ProxyMiddleware {
  constructor() {
    this.mockService = new MockService();
    this.matcher = new MockMatcher(this.mockService);
    this.backendUrl = config.get('backendUrl');
    this.recordMode = config.get('recordMode');
  }

  async handleRequest(req, res, next) {
    try {
      // 解析查询参数
      const parsedUrl = url.parse(req.url, true);
      req.query = parsedUrl.query;

      // 尝试匹配Mock
      const mock = await this.matcher.findMatch(req);
      
      if (mock) {
        return await this.handleMockResponse(req, res, mock);
      }

      // 如果是记录模式但没有后端URL，返回404
      if (!this.backendUrl) {
        return res.status(404).json({
          error: 'Backend not configured',
          message: 'No backend URL configured and no mock matched'
        });
      }

      // 代理到后端
      return await this.proxyToBackend(req, res);
      
    } catch (error) {
      logger.error('Proxy middleware error:', error.message);
      res.status(500).json({
        error: 'Proxy error',
        message: error.message
      });
    }
  }

  async handleMockResponse(req, res, mock) {
    try {
      // 记录请求
      await this.logRequest(req, mock.id);

      // 设置响应状态
      const status = mock.response.status || 200;
      res.status(status);

      // 设置响应头
      if (mock.response.headers) {
        Object.entries(mock.response.headers).forEach(([key, value]) => {
          res.set(key, value);
        });
      }

      // 设置默认Content-Type
      if (!res.get('Content-Type')) {
        res.set('Content-Type', 'application/json');
      }

      // 处理延迟
      if (mock.response.delay && mock.response.delay > 0) {
        await new Promise(resolve => setTimeout(resolve, mock.response.delay));
      }

      // 发送响应
      if (typeof mock.response.body === 'string') {
        res.send(mock.response.body);
      } else {
        res.json(mock.response.body);
      }

      logger.info(`Mock response sent: ${mock.name} (${status})`);
    } catch (error) {
      logger.error('Error handling mock response:', error.message);
      res.status(500).json({
        error: 'Mock response error',
        message: error.message
      });
    }
  }

  async proxyToBackend(req, res) {
    try {
      // 简化的HTTP代理实现（不依赖外部库）
      const http = require('http');
      const https = require('https');
      
      const backendUrl = new URL(this.backendUrl);
      const isHttps = backendUrl.protocol === 'https:';
      const httpModule = isHttps ? https : http;

      const options = {
        hostname: backendUrl.hostname,
        port: backendUrl.port || (isHttps ? 443 : 80),
        path: req.url,
        method: req.method,
        headers: {
          ...req.headers,
          host: backendUrl.host
        }
      };

      const proxyReq = httpModule.request(options, (proxyRes) => {
        // 复制响应头
        Object.entries(proxyRes.headers).forEach(([key, value]) => {
          res.set(key, value);
        });

        res.status(proxyRes.statusCode);

        let responseData = '';
        proxyRes.on('data', (chunk) => {
          responseData += chunk;
          res.write(chunk);
        });

        proxyRes.on('end', async () => {
          res.end();
          
          // 记录请求和响应（如果启用记录模式）
          if (this.recordMode) {
            await this.recordRequest(req, proxyRes, responseData);
          }
          
          logger.debug(`Proxied ${req.method} ${req.url} -> ${proxyRes.statusCode}`);
        });
      });

      proxyReq.on('error', (error) => {
        logger.error('Proxy request error:', error.message);
        if (!res.headersSent) {
          res.status(502).json({
            error: 'Backend unavailable',
            message: error.message
          });
        }
      });

      // 转发请求体
      if (req.body && ['POST', 'PUT', 'PATCH'].includes(req.method)) {
        proxyReq.write(JSON.stringify(req.body));
      }

      proxyReq.end();

    } catch (error) {
      logger.error('Error proxying to backend:', error.message);
      res.status(502).json({
        error: 'Proxy error',
        message: error.message
      });
    }
  }

  async logRequest(req, mockId = null) {
    try {
      const requestData = {
        method: req.method,
        url: req.url,
        headers: req.headers,
        query: req.query,
        body: req.body,
        mockId,
        userAgent: req.get('User-Agent'),
        ip: req.ip || req.connection.remoteAddress
      };

      await this.mockService.logRequest(requestData);
    } catch (error) {
      logger.error('Error logging request:', error.message);
    }
  }

  async recordRequest(req, proxyRes, responseData) {
    try {
      // 自动创建Mock（基于真实响应）
      let responseBody;
      try {
        responseBody = JSON.parse(responseData);
      } catch {
        responseBody = responseData;
      }

      const mockData = {
        name: `Auto-recorded ${req.method} ${req.url}`,
        description: 'Automatically recorded mock',
        method: req.method,
        url: req.url.split('?')[0], // 移除查询参数
        response: {
          status: proxyRes.statusCode,
          headers: proxyRes.headers,
          body: responseBody
        },
        priority: 0,
        active: false // 默认不激活自动录制的Mock
      };

      await this.mockService.create(mockData);
      logger.info(`Auto-recorded mock for ${req.method} ${req.url}`);
      
    } catch (error) {
      logger.error('Error recording request:', error.message);
    }
  }
}

// 创建中间件实例
const proxyMiddleware = new ProxyMiddleware();

// 导出Express中间件函数
module.exports = (req, res, next) => {
  // 跳过已处理的API路由
  if (req.url.startsWith('/api/mocks') || req.url === '/health') {
    return next();
  }

  proxyMiddleware.handleRequest(req, res, next);
};