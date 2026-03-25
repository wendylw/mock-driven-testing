# Phase 1: 基础Mock平台 - 详细实施计划

## 🎯 Phase 1 目标

建立Mock数据管理和代理服务的基础设施，解决环境依赖问题，实现：
- 环境启动时间 < 1秒
- 零侵入代理模式
- 支持主流测试框架

**补充技术细节**：[PHASE-1-SUPPLEMENT.md](./PHASE-1-SUPPLEMENT.md)

## 📁 项目结构设计

```
mock-driven-testing/
├── src/
│   ├── server/                 # 服务端代码
│   │   ├── index.js           # 主入口
│   │   ├── proxy/             # 代理服务
│   │   │   ├── middleware.js  # 代理中间件
│   │   │   ├── matcher.js     # Mock匹配器
│   │   │   └── recorder.js    # 请求记录器
│   │   ├── mock/              # Mock管理
│   │   │   ├── controller.js  # Mock CRUD控制器
│   │   │   ├── service.js     # Mock业务逻辑
│   │   │   ├── storage.js     # 存储层
│   │   │   └── validator.js   # 数据验证
│   │   └── utils/             # 工具函数
│   │       ├── logger.js      # 日志工具
│   │       └── config.js      # 配置管理
│   ├── cli/                    # CLI工具
│   │   ├── index.js           # CLI入口
│   │   └── commands/          # 命令实现
│   │       ├── start.js       # 启动服务
│   │       ├── mock.js        # Mock管理命令
│   │       └── config.js      # 配置命令
│   └── integrations/          # 测试框架集成
│       ├── jest/              # Jest插件
│       └── cypress/           # Cypress插件
├── data/                      # 数据存储
│   ├── mocks/                # Mock文件
│   └── mdt.db               # SQLite数据库
├── tests/                    # 测试文件
│   ├── unit/                # 单元测试
│   ├── integration/         # 集成测试
│   └── fixtures/            # 测试数据
├── examples/                # 示例项目
│   └── basic-demo/         # 基础示例
├── docs/                   # 已有文档
└── package.json           # 项目配置
```

## 📅 Week 1: 核心Mock功能

### Day 1-2: 基础架构搭建

#### 任务清单
```javascript
// 1. 初始化项目结构
- [ ] 创建项目目录结构
- [ ] 初始化package.json
- [ ] 配置ESLint和Prettier
- [ ] 设置基础测试环境

// 2. 搭建Express服务器
- [ ] 创建src/server/index.js
- [ ] 配置基础中间件（cors, body-parser等）
- [ ] 实现健康检查端点
- [ ] 配置环境变量管理

// 3. 实现HTTP代理基础
- [ ] 集成http-proxy-middleware
- [ ] 创建proxy/middleware.js
- [ ] 实现基础请求转发
- [ ] 添加请求/响应日志

// 4. 设计数据存储
- [ ] 创建SQLite数据库schema
- [ ] 实现storage.js基础接口
- [ ] 创建Mock数据模型
- [ ] 实现基础CRUD操作
```

#### 代码示例

**src/server/index.js**
```javascript
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const mockRoutes = require('./mock/controller');
const proxyMiddleware = require('./proxy/middleware');
const config = require('./utils/config');
const logger = require('./utils/logger');

const app = express();
const PORT = config.get('port', 3001);

// 基础中间件
app.use(cors());
app.use(express.json());

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0' });
});

// Mock管理API
app.use('/api/mocks', mockRoutes);

// 代理中间件（核心功能）
app.use('/', proxyMiddleware);

// 启动服务器
app.listen(PORT, () => {
  logger.info(`MDT Mock Server running on port ${PORT}`);
});
```

**src/server/proxy/middleware.js**
```javascript
const { createProxyMiddleware } = require('http-proxy-middleware');
const MockMatcher = require('./matcher');
const RequestRecorder = require('./recorder');
const logger = require('../utils/logger');

const matcher = new MockMatcher();
const recorder = new RequestRecorder();

module.exports = createProxyMiddleware({
  target: process.env.BACKEND_URL || 'http://localhost:8080',
  changeOrigin: true,
  
  onProxyReq: async (proxyReq, req, res) => {
    logger.debug(`Proxying ${req.method} ${req.url}`);
    
    // 尝试匹配Mock
    const mock = await matcher.findMatch(req);
    if (mock) {
      logger.info(`Mock matched for ${req.method} ${req.url}`);
      
      // 直接返回Mock响应
      res.status(mock.response.status || 200);
      res.set(mock.response.headers || {});
      
      // 处理延迟
      if (mock.response.delay) {
        await new Promise(resolve => setTimeout(resolve, mock.response.delay));
      }
      
      res.json(mock.response.body);
      return false; // 阻止代理请求
    }
  },
  
  onProxyRes: async (proxyRes, req, res) => {
    // 记录真实响应（可选）
    if (process.env.RECORD_MODE === 'true') {
      await recorder.record(req, proxyRes);
    }
  }
});
```

### Day 3-4: Mock管理功能

#### 任务清单
```javascript
// 1. Mock CRUD API实现
- [ ] 创建Mock控制器
- [ ] 实现创建Mock接口 (POST /api/mocks)
- [ ] 实现查询Mock接口 (GET /api/mocks)
- [ ] 实现更新Mock接口 (PUT /api/mocks/:id)
- [ ] 实现删除Mock接口 (DELETE /api/mocks/:id)

// 2. Mock数据验证
- [ ] 创建Mock schema验证
- [ ] 实现请求数据验证中间件
- [ ] 添加错误处理

// 3. 版本管理机制
- [ ] 设计版本号策略
- [ ] 实现Mock版本历史
- [ ] 添加版本回退功能

// 4. 导入导出功能
- [ ] 实现Mock导出为JSON
- [ ] 实现从JSON导入Mock
- [ ] 支持批量操作
```

#### 代码示例

**src/server/mock/controller.js**
```javascript
const express = require('express');
const router = express.Router();
const mockService = require('./service');
const validator = require('./validator');

// 获取Mock列表
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const mocks = await mockService.list({ page, limit, search });
    res.json(mocks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 创建Mock
router.post('/', validator.validateMock, async (req, res) => {
  try {
    const mock = await mockService.create(req.body);
    res.status(201).json(mock);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 更新Mock
router.put('/:id', validator.validateMock, async (req, res) => {
  try {
    const mock = await mockService.update(req.params.id, req.body);
    res.json(mock);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 删除Mock
router.delete('/:id', async (req, res) => {
  try {
    await mockService.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 导出Mock
router.get('/export', async (req, res) => {
  try {
    const data = await mockService.export();
    res.header('Content-Type', 'application/json');
    res.header('Content-Disposition', 'attachment; filename=mocks.json');
    res.send(JSON.stringify(data, null, 2));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 导入Mock
router.post('/import', async (req, res) => {
  try {
    const result = await mockService.import(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
```

### Day 5: 代理服务完善

#### 任务清单
```javascript
// 1. 完善Mock匹配逻辑
- [ ] 实现精确URL匹配
- [ ] 实现正则表达式匹配
- [ ] 实现请求头匹配
- [ ] 实现请求体匹配

// 2. 请求记录功能
- [ ] 记录所有请求信息
- [ ] 实现请求历史查询
- [ ] 添加请求重放功能

// 3. 响应处理优化
- [ ] 支持动态响应生成
- [ ] 实现响应模板
- [ ] 添加响应延迟模拟
```

#### 代码示例

**src/server/proxy/matcher.js**
```javascript
class MockMatcher {
  constructor(storage) {
    this.storage = storage;
  }

  async findMatch(req) {
    const mocks = await this.storage.getActiveMocks();
    
    // 按优先级排序
    const sortedMocks = mocks.sort((a, b) => b.priority - a.priority);
    
    for (const mock of sortedMocks) {
      if (this.isMatch(req, mock)) {
        return mock;
      }
    }
    
    return null;
  }

  isMatch(req, mock) {
    // 1. 方法匹配
    if (mock.method && mock.method !== req.method) {
      return false;
    }
    
    // 2. URL匹配
    if (!this.isUrlMatch(req.url, mock)) {
      return false;
    }
    
    // 3. Headers匹配
    if (mock.headers && !this.isHeadersMatch(req.headers, mock.headers)) {
      return false;
    }
    
    // 4. Body匹配
    if (mock.body && !this.isBodyMatch(req.body, mock.body)) {
      return false;
    }
    
    return true;
  }

  isUrlMatch(requestUrl, mock) {
    if (mock.url) {
      // 精确匹配
      return requestUrl === mock.url;
    } else if (mock.urlPattern) {
      // 正则匹配
      const regex = new RegExp(mock.urlPattern);
      return regex.test(requestUrl);
    }
    return false;
  }

  isHeadersMatch(requestHeaders, mockHeaders) {
    return Object.entries(mockHeaders).every(([key, value]) => {
      return requestHeaders[key.toLowerCase()] === value;
    });
  }

  isBodyMatch(requestBody, mockBody) {
    // 简单的深度比较
    return JSON.stringify(requestBody) === JSON.stringify(mockBody);
  }
}

module.exports = MockMatcher;
```

## 📅 Week 2: 测试集成与优化

### Day 1-2: 测试框架集成

#### 任务清单
```javascript
// 1. Jest集成
- [ ] 创建Jest插件包
- [ ] 实现自动Mock注入
- [ ] 添加测试辅助函数
- [ ] 编写使用文档

// 2. Cypress集成
- [ ] 创建Cypress命令
- [ ] 实现Mock管理命令
- [ ] 添加场景切换支持
- [ ] 编写集成示例

// 3. 测试数据管理
- [ ] 实现测试数据隔离
- [ ] 添加数据清理机制
- [ ] 支持测试数据导入
```

#### 代码示例

**src/integrations/jest/index.js**
```javascript
const axios = require('axios');

class MDTJestPlugin {
  constructor(options = {}) {
    this.serverUrl = options.serverUrl || 'http://localhost:3001';
    this.axios = axios.create({
      baseURL: this.serverUrl,
      timeout: 5000
    });
  }

  async setup() {
    // 清理测试数据
    await this.clearMocks();
  }

  async teardown() {
    // 清理测试数据
    await this.clearMocks();
  }

  async createMock(mock) {
    const response = await this.axios.post('/api/mocks', mock);
    return response.data;
  }

  async clearMocks() {
    await this.axios.delete('/api/mocks/all');
  }

  async useMockScenario(scenarioName) {
    await this.axios.post(`/api/scenarios/${scenarioName}/activate`);
  }
}

// Jest全局设置
global.mdt = new MDTJestPlugin();

// 测试辅助函数
global.useMock = async (mock) => {
  return global.mdt.createMock(mock);
};

global.useMockScenario = async (scenario) => {
  return global.mdt.useMockScenario(scenario);
};

module.exports = MDTJestPlugin;
```

### Day 3-4: 使用体验优化

#### 任务清单
```javascript
// 1. CLI工具开发
- [ ] 创建CLI入口
- [ ] 实现start命令
- [ ] 实现mock管理命令
- [ ] 添加配置命令

// 2. 配置管理
- [ ] 支持配置文件
- [ ] 环境变量管理
- [ ] 配置验证

// 3. 错误处理和日志
- [ ] 统一错误处理
- [ ] 结构化日志输出
- [ ] 日志级别控制
```

#### 代码示例

**src/cli/index.js**
```javascript
#!/usr/bin/env node

const { program } = require('commander');
const package = require('../../package.json');

program
  .version(package.version)
  .description('MDT - Mock-Driven Testing CLI');

// start命令
program
  .command('start')
  .description('Start the MDT mock server')
  .option('-p, --port <port>', 'Server port', '3001')
  .option('-t, --target <url>', 'Backend target URL')
  .option('-r, --record', 'Enable record mode')
  .action(require('./commands/start'));

// mock命令
program
  .command('mock <action>')
  .description('Manage mocks (list|create|delete|export|import)')
  .option('-f, --file <file>', 'File path for import/export')
  .action(require('./commands/mock'));

// config命令
program
  .command('config <action>')
  .description('Manage configuration')
  .option('-k, --key <key>', 'Config key')
  .option('-v, --value <value>', 'Config value')
  .action(require('./commands/config'));

program.parse(process.argv);
```

### Day 5: 文档和示例

#### 任务清单
```javascript
// 1. 快速开始文档
- [ ] 安装指南
- [ ] 5分钟快速上手
- [ ] 基础使用示例

// 2. API文档
- [ ] REST API文档
- [ ] Mock数据格式说明
- [ ] 配置选项说明

// 3. 示例项目
- [ ] 创建基础示例
- [ ] Jest集成示例
- [ ] Cypress集成示例
```

## 🎯 Phase 1 交付物

### 核心功能
1. ✅ Mock管理服务
   - CRUD操作
   - 版本管理
   - 导入导出

2. ✅ 代理服务器
   - 零侵入代理
   - 智能Mock匹配
   - 请求记录

3. ✅ 测试集成
   - Jest插件
   - Cypress支持
   - 测试数据管理

4. ✅ CLI工具
   - 服务启动
   - Mock管理
   - 配置管理

### 文档
1. ✅ 快速开始指南
2. ✅ API文档
3. ✅ 集成指南
4. ✅ 示例项目

### 性能指标
- 环境启动时间 < 1秒
- Mock匹配时间 < 5ms
- 支持1000+ Mock并发

## 📋 测试计划

### 单元测试
```javascript
describe('MockMatcher', () => {
  it('should match exact URL');
  it('should match URL pattern');
  it('should match with headers');
  it('should respect priority');
});

describe('MockService', () => {
  it('should create mock');
  it('should update mock');
  it('should handle versioning');
  it('should export/import');
});
```

### 集成测试
```javascript
describe('Proxy Integration', () => {
  it('should proxy requests without mock');
  it('should return mock when matched');
  it('should record requests in record mode');
  it('should handle errors gracefully');
});
```

### 性能测试
```javascript
describe('Performance', () => {
  it('should start server in < 1s');
  it('should match mock in < 5ms');
  it('should handle 1000 concurrent requests');
});
```

## 🚀 开始实施

### 立即行动
```bash
# 1. 创建项目结构
mkdir -p src/{server,cli,integrations} tests/{unit,integration} data examples

# 2. 初始化项目
npm init -y
npm install express http-proxy-middleware sqlite3 cors body-parser

# 3. 开始编码
code src/server/index.js
```

### 每日进度检查
- 每天结束时提交代码
- 更新任务完成状态
- 记录遇到的问题和解决方案

### 风险和应对
1. **代理兼容性问题**
   - 准备多种代理方案
   - 充分测试不同项目类型

2. **性能瓶颈**
   - 提前进行性能测试
   - 准备缓存优化方案

3. **集成复杂度**
   - 先实现最简单的集成
   - 逐步增加功能

---

**记住：Phase 1是整个项目的基础，质量和稳定性最重要！**