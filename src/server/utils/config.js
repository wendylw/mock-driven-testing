const path = require('path');

class Config {
  constructor() {
    this.config = {
      // 服务器配置
      port: process.env.PORT || 3001,
      host: process.env.HOST || 'localhost',
      
      // 代理配置
      backendUrl: process.env.BACKEND_URL || 'http://localhost:8080',
      recordMode: process.env.RECORD_MODE === 'true',
      
      // 数据库配置
      databasePath: process.env.DATABASE_PATH || './data/mdt.db',
      
      // 日志配置
      logLevel: process.env.LOG_LEVEL || 'info',
      logFile: process.env.LOG_FILE || './logs/mdt.log',
      
      // Mock配置
      mockTimeout: parseInt(process.env.MOCK_TIMEOUT || '5000'),
      maxMockSize: parseInt(process.env.MAX_MOCK_SIZE || '10485760'), // 10MB
      
      // 开发配置
      isDevelopment: process.env.NODE_ENV !== 'production',
      isTest: process.env.NODE_ENV === 'test'
    };
  }

  get(key, defaultValue) {
    return this.config[key] !== undefined ? this.config[key] : defaultValue;
  }

  getAll() {
    return { ...this.config };
  }

  set(key, value) {
    this.config[key] = value;
  }
}

module.exports = new Config();