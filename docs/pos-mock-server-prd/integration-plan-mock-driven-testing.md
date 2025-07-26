# POS Mock Server 集成到 Mock-Driven-Testing 的实施计划

## 概述

本文档详细说明如何将 POS Mock Server 功能集成到现有的 mock-driven-testing 项目中，利用其现有架构优势，同时扩展必要的功能以满足 POS 应用的特殊需求。

## 集成架构设计

### 项目结构扩展

```
mock-driven-testing/
├── src/
│   ├── analyzers/
│   │   ├── existing-analyzers/
│   │   └── pos/                        # 新增：POS 特定分析器
│   │       ├── realm-analyzer.js       # Realm 数据库分析
│   │       ├── websocket-analyzer.js   # WebSocket 事件分析
│   │       └── hardware-analyzer.js    # 硬件接口分析
│   ├── generators/
│   │   ├── existing-generators/
│   │   └── pos/                        # 新增：POS Mock 生成器
│   │       ├── api-generator.js        # REST API Mock 生成
│   │       ├── websocket-generator.js  # WebSocket Mock 生成
│   │       ├── hardware-generator.js   # 硬件模拟器生成
│   │       └── state-generator.js      # 状态管理生成
│   ├── templates/
│   │   ├── existing-templates/
│   │   └── pos/                        # 新增：POS 模板
│   │       ├── rest-api/               # REST API 模板
│   │       ├── websocket/              # WebSocket 模板
│   │       ├── hardware/               # 硬件模拟模板
│   │       └── database/               # 数据库模板
│   └── pos-runtime/                    # 新增：POS 运行时组件
│       ├── state-manager/              # 状态管理
│       ├── hardware-simulators/        # 硬件模拟器
│       ├── websocket-server/           # WebSocket 服务
│       └── business-logic/             # 业务逻辑引擎
├── pos-proxy-servers/                  # 新增：POS 专用代理
│   ├── pos-capture-proxy.js            # POS API 捕获代理
│   ├── pos-websocket-proxy.js          # WebSocket 捕获代理
│   └── pos-hardware-proxy.js           # 硬件事件捕获
└── generated/
    └── pos-mocks/                      # 新增：POS Mock 输出
        ├── storehub-pos/               # POS 应用 Mock
        ├── hardware-mocks/             # 硬件设备 Mock
        └── integrations/               # 第三方集成 Mock
```

## 实施阶段

### 第 0 阶段：环境准备（第 1 周）

#### 1. 项目设置
```bash
# 克隆并设置开发环境
git clone [mock-driven-testing-repo]
cd mock-driven-testing
npm install

# 创建 POS 功能分支
git checkout -b feature/pos-mock-server

# 安装 POS 特定依赖
npm install lokijs socket.io express-ws \
  @types/lokijs @types/socket.io --save
```

#### 2. 配置更新
```javascript
// config/repos.json
{
  "repos": {
    // ... 现有配置
    "pos-v3-mobile": {
      "type": "frontend",
      "category": "pos",
      "mockStrategy": "pos-comprehensive",
      "features": {
        "restApi": true,
        "websocket": true,
        "hardware": true,
        "stateful": true,
        "realm": true
      },
      "targetDomains": [
        "api.storehub.com",
        "mrs.storehub.com",
        "kds.storehub.com",
        "payment.storehub.com"
      ]
    }
  }
}
```

### 第 1 阶段：核心分析器开发（第 2-3 周）

#### 1. Realm 数据库分析器
```javascript
// src/analyzers/pos/realm-analyzer.js
class RealmAnalyzer {
  analyze(codebase) {
    // 扫描 Realm 模式定义
    const schemas = this.findRealmSchemas(codebase);
    // 分析数据关系
    const relationships = this.analyzeRelationships(schemas);
    // 生成模型报告
    return {
      models: schemas,
      relationships,
      operations: this.findDataOperations(codebase)
    };
  }
}
```

#### 2. WebSocket 事件分析器
```javascript
// src/analyzers/pos/websocket-analyzer.js
class WebSocketAnalyzer {
  analyze(codebase) {
    // 识别 Socket.IO 事件
    const events = this.findSocketEvents(codebase);
    // 分析事件数据结构
    const eventSchemas = this.analyzeEventPayloads(events);
    // 映射事件流
    return {
      services: ['mrs', 'kds', 'ncs', 'cfd'],
      events: eventSchemas,
      flows: this.mapEventFlows(events)
    };
  }
}
```

#### 3. 硬件接口分析器
```javascript
// src/analyzers/pos/hardware-analyzer.js
class HardwareAnalyzer {
  analyze(codebase) {
    // 检测硬件库导入
    const hardwareImports = this.findHardwareImports(codebase);
    // 分析硬件调用
    const hardwareCalls = this.analyzeHardwareCalls(codebase);
    // 生成硬件清单
    return {
      devices: ['printer', 'scanner', 'nfc', 'cash-drawer'],
      operations: hardwareCalls,
      configurations: this.extractConfigs(codebase)
    };
  }
}
```

### 第 2 阶段：Mock 生成器实现（第 4-5 周）

#### 1. 状态管理生成器
```javascript
// src/generators/pos/state-generator.js
class StateGenerator {
  generate(analysis) {
    const stateManager = this.createStateManager(analysis.models);
    const collections = this.generateCollections(analysis.models);
    const operations = this.generateOperations(analysis.operations);
    
    return {
      files: [
        {
          path: 'state/manager.ts',
          content: this.renderTemplate('state-manager', { 
            collections, 
            operations 
          })
        }
      ]
    };
  }
}
```

#### 2. WebSocket Mock 生成器
```javascript
// src/generators/pos/websocket-generator.js
class WebSocketGenerator {
  generate(analysis) {
    const servers = analysis.services.map(service => ({
      name: service,
      events: analysis.events[service],
      handlers: this.generateHandlers(analysis.events[service])
    }));
    
    return {
      files: servers.map(server => ({
        path: `websocket/${server.name}.ts`,
        content: this.renderTemplate('websocket-server', server)
      }))
    };
  }
}
```

#### 3. 硬件模拟器生成器
```javascript
// src/generators/pos/hardware-generator.js
class HardwareGenerator {
  generate(analysis) {
    const simulators = analysis.devices.map(device => ({
      type: device,
      operations: analysis.operations[device],
      simulator: this.createSimulator(device)
    }));
    
    return {
      files: simulators.map(sim => ({
        path: `hardware/${sim.type}-simulator.ts`,
        content: this.renderTemplate('hardware-simulator', sim)
      }))
    };
  }
}
```

### 第 3 阶段：运行时组件开发（第 6 周）

#### 1. POS Mock 服务器
```javascript
// pos-proxy-servers/pos-mock-server.js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const StateManager = require('../src/pos-runtime/state-manager');
const WebSocketServer = require('../src/pos-runtime/websocket-server');
const HardwareManager = require('../src/pos-runtime/hardware-manager');

class POSMockServer {
  constructor(config) {
    this.app = express();
    this.stateManager = new StateManager();
    this.wsServer = new WebSocketServer();
    this.hardwareManager = new HardwareManager();
    
    this.setupMiddleware();
    this.setupRoutes();
    this.setupWebSocket();
  }
  
  start(port = 3000) {
    const server = this.app.listen(port);
    this.wsServer.attach(server);
    console.log(`POS Mock Server running on port ${port}`);
  }
}
```

#### 2. 状态管理器
```javascript
// src/pos-runtime/state-manager/index.js
const loki = require('lokijs');

class POSStateManager {
  constructor() {
    this.db = new loki('pos-mock.db', {
      autoload: true,
      autoloadCallback: this.databaseInitialize.bind(this),
      autosave: true,
      autosaveInterval: 4000
    });
  }
  
  databaseInitialize() {
    // 初始化集合
    this.stores = this.db.getCollection('stores') || 
                  this.db.addCollection('stores');
    this.products = this.db.getCollection('products') || 
                    this.db.addCollection('products');
    this.transactions = this.db.getCollection('transactions') || 
                        this.db.addCollection('transactions');
    
    // 加载种子数据
    this.loadSeedData();
  }
}
```

#### 3. 硬件模拟管理器
```javascript
// src/pos-runtime/hardware-manager/index.js
class HardwareManager {
  constructor() {
    this.devices = new Map();
    this.initializeDevices();
  }
  
  initializeDevices() {
    // 注册虚拟设备
    this.registerDevice('printer', new PrinterSimulator());
    this.registerDevice('scanner', new ScannerSimulator());
    this.registerDevice('nfc', new NFCSimulator());
    this.registerDevice('cash-drawer', new CashDrawerSimulator());
  }
  
  registerDevice(type, device) {
    this.devices.set(type, device);
    device.on('event', (data) => this.handleDeviceEvent(type, data));
  }
}
```

### 第 4 阶段：集成测试与优化（第 7-8 周）

#### 1. 创建集成测试套件
```javascript
// tests/pos-integration.test.js
describe('POS Mock Server Integration', () => {
  let mockServer;
  let posApp;
  
  beforeAll(async () => {
    // 启动 Mock 服务器
    mockServer = new POSMockServer(config);
    await mockServer.start(3000);
    
    // 启动 POS 应用
    posApp = await startPOSApp({
      apiUrl: 'http://localhost:3000',
      wsUrl: 'ws://localhost:3000'
    });
  });
  
  test('完整交易流程', async () => {
    // 测试从登录到结账的完整流程
  });
  
  test('多注册机同步', async () => {
    // 测试 MRS 同步功能
  });
  
  test('硬件设备交互', async () => {
    // 测试打印、扫描等硬件功能
  });
});
```

#### 2. 性能优化
```javascript
// 优化策略
const optimizations = {
  // 数据库索引
  database: {
    indexes: ['storeId', 'productId', 'transactionId'],
    caching: true
  },
  
  // API 响应缓存
  api: {
    cache: new Map(),
    ttl: 60000 // 1分钟
  },
  
  // WebSocket 连接池
  websocket: {
    maxConnections: 1000,
    heartbeatInterval: 30000
  }
};
```

## 集成检查清单

### 基础设施
- [ ] POS 分析器集成到主分析流程
- [ ] POS 生成器注册到生成器管理器
- [ ] POS 模板添加到模板库
- [ ] POS 运行时组件初始化

### 功能验证
- [ ] REST API Mock 生成和运行
- [ ] WebSocket 服务正常工作
- [ ] 硬件模拟器响应正确
- [ ] 状态管理和持久化

### 测试覆盖
- [ ] 单元测试：各组件独立测试
- [ ] 集成测试：组件协同工作
- [ ] 端到端测试：完整业务流程
- [ ] 性能测试：负载和压力测试

### 文档更新
- [ ] README 添加 POS Mock 说明
- [ ] API 文档包含 POS 端点
- [ ] 配置指南更新
- [ ] 示例代码添加

## 维护计划

### 持续集成
```yaml
# .github/workflows/pos-mock-ci.yml
name: POS Mock CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: npm install
      - name: Run POS tests
        run: npm run test:pos
      - name: Generate POS mocks
        run: npm run generate:pos
```

### 版本策略
- 主版本：与 mock-driven-testing 保持一致
- 次版本：POS 功能更新
- 补丁版本：bug 修复

### 监控指标
- Mock 生成成功率
- API 响应时间
- WebSocket 连接稳定性
- 硬件模拟准确性

## 风险缓解

### 技术风险
1. **代码冲突**: 使用命名空间隔离 POS 代码
2. **性能影响**: 实施缓存和优化策略
3. **兼容性问题**: 保持向后兼容的 API

### 运营风险
1. **维护负担**: 自动化测试和部署
2. **知识转移**: 详细文档和培训
3. **版本管理**: 清晰的发布流程

## 总结

通过这个集成计划，我们可以在 8 周内将 POS Mock Server 功能完整集成到 mock-driven-testing 项目中。这种方法充分利用了现有架构的优势，同时通过模块化设计保持了系统的可维护性和可扩展性。

关键成功因素：
1. 充分利用现有基础设施
2. 模块化和增量式开发
3. 全面的测试覆盖
4. 持续的性能优化
5. 清晰的文档和培训