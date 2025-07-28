const config = require('./config');

// 简化版日志工具（不依赖winston，避免安装问题）
class Logger {
  constructor() {
    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3
    };
    
    this.currentLevel = this.levels[config.get('logLevel')] || this.levels.info;
  }

  log(level, message, ...args) {
    if (this.levels[level] <= this.currentLevel) {
      const timestamp = new Date().toISOString();
      const formattedMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
      
      if (level === 'error') {
        console.error(formattedMessage, ...args);
      } else if (level === 'warn') {
        console.warn(formattedMessage, ...args);
      } else {
        console.log(formattedMessage, ...args);
      }
    }
  }

  error(message, ...args) {
    this.log('error', message, ...args);
  }

  warn(message, ...args) {
    this.log('warn', message, ...args);
  }

  info(message, ...args) {
    this.log('info', message, ...args);
  }

  debug(message, ...args) {
    this.log('debug', message, ...args);
  }
}

module.exports = new Logger();