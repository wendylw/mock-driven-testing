# Phase 1 实施补充细节

## 1. 数据库Schema设计

### SQLite数据库结构
```sql
-- Mocks表
CREATE TABLE mocks (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  method TEXT NOT NULL,
  url TEXT,
  url_pattern TEXT,
  headers TEXT, -- JSON
  query TEXT,   -- JSON
  body TEXT,    -- JSON
  response_status INTEGER DEFAULT 200,
  response_headers TEXT, -- JSON
  response_body TEXT,    -- JSON
  response_delay INTEGER DEFAULT 0,
  priority INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT 1,
  scenario_id TEXT,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mock版本历史
CREATE TABLE mock_versions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  mock_id TEXT NOT NULL,
  version INTEGER NOT NULL,
  data TEXT NOT NULL, -- JSON
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (mock_id) REFERENCES mocks(id)
);

-- 请求日志
CREATE TABLE request_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  method TEXT NOT NULL,
  url TEXT NOT NULL,
  headers TEXT, -- JSON
  body TEXT,    -- JSON
  response_status INTEGER,
  response_body TEXT, -- JSON
  mock_id TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_mocks_url ON mocks(url);
CREATE INDEX idx_mocks_method ON mocks(method);
CREATE INDEX idx_mocks_scenario ON mocks(scenario_id);
CREATE INDEX idx_request_logs_timestamp ON request_logs(timestamp);
```

## 2. 关键模块实现细节

### 2.1 存储层实现 (storage.js)
```javascript
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class MockStorage {
  constructor(dbPath) {
    this.dbPath = dbPath || path.join(__dirname, '../../../data/mdt.db');
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) reject(err);
        else {
          this.createTables().then(resolve).catch(reject);
        }
      });
    });
  }

  async createTables() {
    const schema = `...`; // 上面的SQL schema
    return this.run(schema);
  }

  async createMock(mockData) {
    const id = uuidv4();
    const mock = {
      id,
      ...mockData,
      headers: JSON.stringify(mockData.headers || {}),
      query: JSON.stringify(mockData.query || {}),
      body: JSON.stringify(mockData.body || {}),
      response_headers: JSON.stringify(mockData.response?.headers || {}),
      response_body: JSON.stringify(mockData.response?.body || {}),
      response_status: mockData.response?.status || 200,
      response_delay: mockData.response?.delay || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const sql = `
      INSERT INTO mocks (
        id, name, description, method, url, url_pattern,
        headers, query, body, response_status, response_headers,
        response_body, response_delay, priority, active, scenario_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await this.run(sql, [
      mock.id, mock.name, mock.description, mock.method,
      mock.url, mock.url_pattern, mock.headers, mock.query,
      mock.body, mock.response_status, mock.response_headers,
      mock.response_body, mock.response_delay, mock.priority || 0,
      mock.active !== false ? 1 : 0, mock.scenario_id
    ]);

    return this.getMockById(id);
  }

  async getMockById(id) {
    const sql = 'SELECT * FROM mocks WHERE id = ?';
    const row = await this.get(sql, [id]);
    return this.parseMockRow(row);
  }

  async getActiveMocks() {
    const sql = 'SELECT * FROM mocks WHERE active = 1 ORDER BY priority DESC';
    const rows = await this.all(sql);
    return rows.map(row => this.parseMockRow(row));
  }

  parseMockRow(row) {
    if (!row) return null;
    return {
      ...row,
      headers: JSON.parse(row.headers || '{}'),
      query: JSON.parse(row.query || '{}'),
      body: JSON.parse(row.body || '{}'),
      response: {
        status: row.response_status,
        headers: JSON.parse(row.response_headers || '{}'),
        body: JSON.parse(row.response_body || '{}'),
        delay: row.response_delay
      },
      active: !!row.active
    };
  }

  // Promise包装的数据库方法
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, changes: this.changes });
      });
    });
  }

  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
}

module.exports = MockStorage;
```

### 2.2 配置管理 (config.js)
```javascript
const dotenv = require('dotenv');
const path = require('path');

// 加载环境变量
dotenv.config();

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
```

### 2.3 日志工具 (logger.js)
```javascript
const winston = require('winston');
const path = require('path');
const config = require('./config');

const logger = winston.createLogger({
  level: config.get('logLevel'),
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'mdt' },
  transports: [
    // 文件日志
    new winston.transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error'
    }),
    new winston.transports.File({
      filename: path.join('logs', 'combined.log')
    })
  ]
});

// 开发环境下输出到控制台
if (config.get('isDevelopment')) {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

module.exports = logger;
```

## 3. 错误处理和验证

### 3.1 Mock数据验证 (validator.js)
```javascript
const Joi = require('joi');

const mockSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
  method: Joi.string().valid('GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS').required(),
  url: Joi.string().when('url_pattern', {
    is: Joi.exist(),
    then: Joi.optional(),
    otherwise: Joi.required()
  }),
  url_pattern: Joi.string().optional(),
  headers: Joi.object().optional(),
  query: Joi.object().optional(),
  body: Joi.any().optional(),
  response: Joi.object({
    status: Joi.number().min(100).max(599).default(200),
    headers: Joi.object().optional(),
    body: Joi.any().required(),
    delay: Joi.number().min(0).max(30000).optional()
  }).required(),
  priority: Joi.number().integer().min(0).max(1000).default(0),
  active: Joi.boolean().default(true),
  scenario_id: Joi.string().optional()
});

const validateMock = (req, res, next) => {
  const { error } = mockSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: 'Validation error',
      details: error.details.map(d => d.message)
    });
  }
  next();
};

module.exports = {
  mockSchema,
  validateMock
};
```

### 3.2 全局错误处理中间件
```javascript
// errorHandler.js
const logger = require('./utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error('Unhandled error:', err);

  // 默认错误响应
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    error: {
      message,
      status,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};

module.exports = errorHandler;
```

## 4. 测试策略细节

### 4.1 单元测试示例
```javascript
// tests/unit/matcher.test.js
const MockMatcher = require('../../src/server/proxy/matcher');

describe('MockMatcher', () => {
  let matcher;
  let mockStorage;

  beforeEach(() => {
    mockStorage = {
      getActiveMocks: jest.fn()
    };
    matcher = new MockMatcher(mockStorage);
  });

  describe('URL matching', () => {
    it('should match exact URL', async () => {
      const mocks = [{
        id: '1',
        method: 'GET',
        url: '/api/users',
        response: { body: { users: [] } }
      }];
      mockStorage.getActiveMocks.mockResolvedValue(mocks);

      const req = { method: 'GET', url: '/api/users' };
      const result = await matcher.findMatch(req);

      expect(result).toEqual(mocks[0]);
    });

    it('should match URL pattern', async () => {
      const mocks = [{
        id: '2',
        method: 'GET',
        url_pattern: '/api/users/\\d+',
        response: { body: { user: {} } }
      }];
      mockStorage.getActiveMocks.mockResolvedValue(mocks);

      const req = { method: 'GET', url: '/api/users/123' };
      const result = await matcher.findMatch(req);

      expect(result).toEqual(mocks[0]);
    });
  });
});
```

### 4.2 集成测试示例
```javascript
// tests/integration/proxy.test.js
const request = require('supertest');
const app = require('../../src/server');

describe('Proxy Integration', () => {
  it('should return mock when matched', async () => {
    // 创建Mock
    const mock = {
      name: 'Test Mock',
      method: 'GET',
      url: '/api/test',
      response: {
        body: { message: 'mocked' }
      }
    };

    await request(app)
      .post('/api/mocks')
      .send(mock)
      .expect(201);

    // 验证Mock返回
    const response = await request(app)
      .get('/api/test')
      .expect(200);

    expect(response.body).toEqual({ message: 'mocked' });
  });
});
```

## 5. 部署和运维

### 5.1 Docker配置
```dockerfile
FROM node:16-alpine

WORKDIR /app

# 复制package文件
COPY package*.json ./
RUN npm ci --only=production

# 复制源代码
COPY . .

# 创建必要的目录
RUN mkdir -p data logs

# 暴露端口
EXPOSE 3001

# 启动命令
CMD ["node", "src/server/index.js"]
```

### 5.2 生产环境配置
```javascript
// config/production.js
module.exports = {
  // 使用更严格的安全设置
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    credentials: true
  },
  
  // 生产数据库
  database: {
    path: '/data/mdt.db',
    backup: true,
    backupInterval: 3600000 // 每小时备份
  },
  
  // 性能优化
  cache: {
    enabled: true,
    ttl: 300 // 5分钟
  },
  
  // 限流
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15分钟
    max: 100 // 限制100个请求
  }
};
```

## 6. 常见问题解决方案

### 6.1 代理HTTPS请求
```javascript
// 处理HTTPS代理
const proxyConfig = {
  target: process.env.BACKEND_URL,
  changeOrigin: true,
  secure: false, // 开发环境下忽略证书验证
  
  onProxyReq: (proxyReq, req, res) => {
    // 处理HTTPS请求头
    if (req.headers['x-forwarded-proto'] === 'https') {
      proxyReq.setHeader('X-Forwarded-Proto', 'https');
    }
  }
};
```

### 6.2 大文件处理
```javascript
// 流式处理大响应
const handleLargeResponse = (proxyRes, req, res) => {
  let chunks = [];
  
  proxyRes.on('data', (chunk) => {
    chunks.push(chunk);
    
    // 检查大小限制
    const totalSize = chunks.reduce((acc, c) => acc + c.length, 0);
    if (totalSize > config.get('maxMockSize')) {
      logger.warn('Response too large, skipping recording');
      chunks = null;
    }
  });
  
  proxyRes.on('end', () => {
    if (chunks) {
      const body = Buffer.concat(chunks).toString();
      // 处理响应
    }
  });
};
```

这个补充文档提供了实施Phase 1所需的所有技术细节。