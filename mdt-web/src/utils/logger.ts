/* eslint-disable no-console */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  data?: any;
  stack?: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  private log(level: LogLevel, message: string, ...args: any[]) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      data: args.length > 0 ? args : undefined
    };

    // 保存日志记录
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // 在开发环境输出到控制台
    if (this.isDevelopment) {
      const consoleMethod = level === 'error' ? console.error : 
                           level === 'warn' ? console.warn : 
                           level === 'debug' ? console.debug : 
                           console.log;
      
      consoleMethod(`[${level.toUpperCase()}] ${message}`, ...args);
    }

    // 错误级别的日志总是输出
    if (level === 'error' && !this.isDevelopment) {
      console.error(`[ERROR] ${message}`, ...args);
      
      // 可以在这里添加错误上报逻辑
      this.reportError(entry);
    }
  }

  debug(message: string, ...args: any[]) {
    this.log('debug', message, ...args);
  }

  info(message: string, ...args: any[]) {
    this.log('info', message, ...args);
  }

  warn(message: string, ...args: any[]) {
    this.log('warn', message, ...args);
  }

  error(message: string, error?: Error | any, ...args: any[]) {
    const errorData = error instanceof Error ? {
      message: error.message,
      stack: error.stack,
      name: error.name
    } : error;
    
    this.log('error', message, errorData, ...args);
  }

  // 获取所有日志
  getLogs(level?: LogLevel): LogEntry[] {
    if (level) {
      return this.logs.filter(log => log.level === level);
    }
    return this.logs;
  }

  // 清空日志
  clearLogs() {
    this.logs = [];
  }

  // 导出日志
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  // 错误上报（可以集成第三方服务）
  private reportError(entry: LogEntry) {
    // TODO: 集成 Sentry 或其他错误监控服务
    // 示例：
    // if (window.Sentry) {
    //   window.Sentry.captureMessage(entry.message, entry.level);
    // }
  }
}

export const logger = new Logger();