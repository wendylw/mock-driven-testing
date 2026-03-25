const express = require('express');
const cors = require('cors');
const config = require('./utils/config');
const logger = require('./utils/logger');

const app = express();
const PORT = config.get('port');

// 基础中间件
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 请求日志中间件
app.use((req, res, next) => {
  logger.debug(`${req.method} ${req.url}`);
  next();
});

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Mock管理API路由
app.use('/api/mocks', require('./mock/controller'));

// 场景管理API路由
app.use('/api/scenarios', require('./scenario/controller'));

// 初始化场景切换器
const ScenarioService = require('./scenario/service');
const MockService = require('./mock/service');
const ScenarioSwitcher = require('./scenario/switcher');

const scenarioService = new ScenarioService();
const mockService = new MockService();
const scenarioSwitcher = new ScenarioSwitcher(scenarioService, mockService);

// 初始化场景系统
scenarioSwitcher.initialize().catch(err => {
  logger.error('Failed to initialize scenario switcher:', err.message);
});

// 将场景切换器添加到app上下文，以便其他模块使用
app.locals.scenarioSwitcher = scenarioSwitcher;

// 代理中间件（放在最后，匹配所有其他请求）
app.use('/', require('./proxy/middleware'));

// 全局错误处理
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err.message);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  });
});

// 404处理
app.use('*', (req, res) => {
  logger.warn(`404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: {
      message: 'Route not found',
      status: 404
    }
  });
});

// 启动服务器
const server = app.listen(PORT, () => {
  logger.info(`🚀 MDT Mock Server started successfully!`);
  logger.info(`📡 Server running on http://localhost:${PORT}`);
  logger.info(`🎯 Backend target: ${config.get('backendUrl')}`);
  logger.info(`📝 Record mode: ${config.get('recordMode') ? 'ON' : 'OFF'}`);
});

// 优雅关闭
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

module.exports = app;