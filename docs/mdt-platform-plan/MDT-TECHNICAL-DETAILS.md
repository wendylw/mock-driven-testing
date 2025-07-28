# MDT平台 - 技术实现细节

## 1. 核心技术架构

### 1.1 代理服务器实现

```javascript
// 基于http-proxy-middleware的透明代理
const proxyConfig = {
  target: process.env.BACKEND_URL || 'http://localhost:8080',
  changeOrigin: true,
  
  onProxyReq: (proxyReq, req, res) => {
    // 记录请求信息
    const requestData = {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body
    };
    
    // 查找匹配的Mock
    const mock = mockMatcher.findMatch(requestData);
    if (mock) {
      // 直接返回Mock响应
      res.status(mock.status || 200);
      res.json(mock.response);
      return false; // 阻止代理请求
    }
  },
  
  onProxyRes: (proxyRes, req, res) => {
    // 记录真实响应（用于Mock录制）
    if (recordMode) {
      recordResponse(req, proxyRes);
    }
  }
};
```

### 1.2 Mock匹配算法

```javascript
class MockMatcher {
  findMatch(request) {
    // 1. 精确匹配
    let mock = this.exactMatch(request);
    if (mock) return mock;
    
    // 2. 模式匹配
    mock = this.patternMatch(request);
    if (mock) return mock;
    
    // 3. 场景匹配
    mock = this.scenarioMatch(request);
    if (mock) return mock;
    
    return null;
  }
  
  exactMatch(request) {
    // URL + Method + Headers完全匹配
    return mocks.find(m => 
      m.url === request.url &&
      m.method === request.method &&
      this.headersMatch(m.headers, request.headers)
    );
  }
  
  patternMatch(request) {
    // 支持路径参数和查询参数
    return mocks.find(m => {
      const pattern = new RegExp(m.urlPattern);
      return pattern.test(request.url) &&
             m.method === request.method;
    });
  }
  
  scenarioMatch(request) {
    // 基于当前激活场景匹配
    const scenario = scenarioManager.getActive();
    return scenario.mocks.find(m => 
      this.urlMatches(m, request) &&
      m.method === request.method
    );
  }
}
```

## 2. 数据模型设计

### 2.1 Mock数据Schema

```typescript
interface Mock {
  id: string;
  name: string;
  description?: string;
  
  // 匹配条件
  match: {
    url?: string;          // 精确URL
    urlPattern?: string;   // 正则表达式
    method: string;        // HTTP方法
    headers?: Record<string, string>;
    query?: Record<string, any>;
    body?: any;
  };
  
  // 响应定义
  response: {
    status: number;
    headers?: Record<string, string>;
    body: any;
    delay?: number;       // 模拟延迟
  };
  
  // 元数据
  metadata: {
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
    version: number;
  };
}
```

### 2.2 场景数据结构

```typescript
interface Scenario {
  id: string;
  name: string;
  description: string;
  
  // 场景配置
  config: {
    priority: number;      // 优先级
    parent?: string;       // 继承自哪个场景
    active: boolean;
  };
  
  // Mock集合
  mocks: string[];        // Mock IDs
  
  // 场景参数
  parameters: {
    [key: string]: {
      type: 'string' | 'number' | 'boolean';
      default: any;
      description: string;
    };
  };
  
  // 场景矩阵
  matrix?: {
    dimensions: string[];
    combinations: Array<{
      values: any[];
      mockOverrides: Partial<Mock>[];
    }>;
  };
}
```

### 2.3 契约存储格式

```typescript
interface Contract {
  id: string;
  apiPath: string;
  method: string;
  version: string;
  
  // 请求定义
  request: {
    parameters?: Parameter[];
    headers?: Header[];
    body?: Schema;
  };
  
  // 响应定义
  responses: {
    [statusCode: string]: {
      description: string;
      headers?: Header[];
      body?: Schema;
      examples?: any[];
    };
  };
  
  // 变更历史
  history: Array<{
    version: string;
    changes: Change[];
    timestamp: Date;
    author: string;
  }>;
}
```

## 3. 智能分析引擎设计

### 3.1 代码分析流程

```javascript
class CodeAnalyzer {
  async analyze(projectPath) {
    const result = {
      components: [],
      apis: [],
      flows: [],
      dependencies: []
    };
    
    // 1. 扫描项目文件
    const files = await this.scanProject(projectPath);
    
    // 2. AST解析
    for (const file of files) {
      const ast = parser.parse(file.content, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript']
      });
      
      // 3. 提取组件信息
      traverse(ast, {
        // React组件
        ClassDeclaration(path) {
          if (this.isReactComponent(path)) {
            result.components.push(
              this.extractComponentInfo(path)
            );
          }
        },
        
        // API调用
        CallExpression(path) {
          if (this.isAPICall(path)) {
            result.apis.push(
              this.extractAPIInfo(path)
            );
          }
        }
      });
    }
    
    // 4. 构建依赖图
    result.dependencies = this.buildDependencyGraph(result);
    
    // 5. 识别业务流程
    result.flows = this.identifyBusinessFlows(result);
    
    return result;
  }
}
```

### 3.2 场景识别算法

```javascript
class ScenarioIdentifier {
  identifyScenarios(analysisResult) {
    const scenarios = [];
    
    // 1. 基于组件复用度分类
    const componentScenarios = this.classifyByReuse(
      analysisResult.components
    );
    
    // 2. 基于API使用模式分类
    const apiScenarios = this.classifyByAPIPattern(
      analysisResult.apis
    );
    
    // 3. 基于业务流程分类
    const flowScenarios = this.classifyByFlow(
      analysisResult.flows
    );
    
    // 4. 合并和优化场景
    return this.mergeAndOptimize([
      ...componentScenarios,
      ...apiScenarios,
      ...flowScenarios
    ]);
  }
  
  classifyByReuse(components) {
    return components.map(comp => {
      const reuseCount = this.countReferences(comp);
      
      if (reuseCount > 5) {
        return {
          type: 'high-reuse',
          component: comp.name,
          testStrategy: 'comprehensive',
          scenarios: this.generateHighReuseScenarios(comp)
        };
      } else if (reuseCount > 2) {
        return {
          type: 'medium-reuse',
          component: comp.name,
          testStrategy: 'focused',
          scenarios: this.generateMediumReuseScenarios(comp)
        };
      } else {
        return {
          type: 'low-reuse',
          component: comp.name,
          testStrategy: 'basic',
          scenarios: this.generateBasicScenarios(comp)
        };
      }
    });
  }
}
```

### 3.3 测试策略生成

```javascript
class TestStrategyGenerator {
  generateStrategy(component, context) {
    const strategy = {
      layers: [],
      scenarios: [],
      priority: 'normal'
    };
    
    // 1. 分析组件特征
    const features = this.analyzeFeatures(component);
    
    // 2. 评估风险等级
    const risk = this.assessRisk(component, context);
    
    // 3. 决定测试层级
    if (features.hasBusinessLogic) {
      strategy.layers.push('unit');
    }
    
    if (features.hasUIInteraction) {
      strategy.layers.push('component');
    }
    
    if (features.hasAPICall) {
      strategy.layers.push('integration');
    }
    
    if (risk.affectsUserFlow) {
      strategy.layers.push('system');
    }
    
    // 4. 生成测试场景
    strategy.scenarios = this.generateTestScenarios(
      component, 
      features, 
      risk
    );
    
    // 5. 设置优先级
    strategy.priority = this.calculatePriority(risk);
    
    return strategy;
  }
}
```

## 4. API设计

### 4.1 RESTful API端点

```yaml
# Mock管理
GET    /api/mocks              # 获取Mock列表
POST   /api/mocks              # 创建Mock
GET    /api/mocks/:id          # 获取Mock详情
PUT    /api/mocks/:id          # 更新Mock
DELETE /api/mocks/:id          # 删除Mock

# 场景管理
GET    /api/scenarios          # 获取场景列表
POST   /api/scenarios          # 创建场景
PUT    /api/scenarios/:id/activate  # 激活场景
GET    /api/scenarios/:id/mocks     # 获取场景Mock

# 智能分析
POST   /api/analyze            # 触发项目分析
GET    /api/analyze/report     # 获取分析报告
POST   /api/analyze/suggest    # 获取测试建议

# 契约管理
GET    /api/contracts          # 获取契约列表
POST   /api/contracts/extract  # 从代码提取契约
GET    /api/contracts/:id/diff # 获取契约差异
```

### 4.2 WebSocket实时通信

```javascript
// 实时Mock切换通知
ws.on('scenario:change', (data) => {
  // 通知所有连接的客户端
  broadcast({
    type: 'scenario:changed',
    scenario: data.scenario,
    timestamp: Date.now()
  });
});

// 实时请求监控
ws.on('request:intercepted', (data) => {
  broadcast({
    type: 'request:log',
    request: data.request,
    mock: data.mock,
    timestamp: Date.now()
  });
});
```

## 5. 性能优化策略

### 5.1 缓存机制

```javascript
class CacheManager {
  constructor() {
    // 多级缓存
    this.memoryCache = new LRU({ max: 1000 });
    this.redisCache = new Redis();
  }
  
  async get(key) {
    // L1: 内存缓存
    let value = this.memoryCache.get(key);
    if (value) return value;
    
    // L2: Redis缓存
    value = await this.redisCache.get(key);
    if (value) {
      this.memoryCache.set(key, value);
      return value;
    }
    
    return null;
  }
  
  async set(key, value, ttl = 3600) {
    this.memoryCache.set(key, value);
    await this.redisCache.setex(key, ttl, value);
  }
}
```

### 5.2 并发优化

```javascript
// 请求批处理
class BatchProcessor {
  constructor() {
    this.queue = [];
    this.processing = false;
  }
  
  async add(request) {
    this.queue.push(request);
    
    if (!this.processing) {
      this.processing = true;
      setTimeout(() => this.process(), 10);
    }
  }
  
  async process() {
    const batch = this.queue.splice(0, 100);
    
    // 并行处理
    await Promise.all(
      batch.map(req => this.handleRequest(req))
    );
    
    this.processing = false;
    
    if (this.queue.length > 0) {
      setTimeout(() => this.process(), 10);
    }
  }
}
```

## 6. 部署方案

### 6.1 Docker配置

```dockerfile
# 多阶段构建
FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:16-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .

EXPOSE 3000
CMD ["node", "server.js"]
```

### 6.2 监控配置

```javascript
// Prometheus指标
const promClient = require('prom-client');

// 自定义指标
const mockHitRate = new promClient.Counter({
  name: 'mdt_mock_hits_total',
  help: 'Total number of mock hits',
  labelNames: ['scenario', 'path']
});

const responseTime = new promClient.Histogram({
  name: 'mdt_response_duration_seconds',
  help: 'Response time in seconds',
  labelNames: ['method', 'path', 'status']
});
```

## 7. 测试策略

### 7.1 单元测试

```javascript
describe('MockMatcher', () => {
  it('should match exact URL', () => {
    const matcher = new MockMatcher();
    const mock = {
      url: '/api/users',
      method: 'GET'
    };
    
    const request = {
      url: '/api/users',
      method: 'GET'
    };
    
    expect(matcher.exactMatch(request)).toBe(mock);
  });
  
  it('should match pattern URL', () => {
    const mock = {
      urlPattern: '/api/users/\\d+',
      method: 'GET'
    };
    
    const request = {
      url: '/api/users/123',
      method: 'GET'
    };
    
    expect(matcher.patternMatch(request)).toBe(mock);
  });
});
```

### 7.2 集成测试

```javascript
describe('Proxy Integration', () => {
  it('should return mock when matched', async () => {
    // 设置Mock
    await request(app)
      .post('/api/mocks')
      .send({
        url: '/api/test',
        method: 'GET',
        response: { data: 'mocked' }
      });
    
    // 验证代理返回Mock
    const response = await request(app)
      .get('/api/test')
      .expect(200);
    
    expect(response.body).toEqual({ data: 'mocked' });
  });
});
```

这个技术细节文档提供了实施所需的具体技术方案，可以作为开发时的参考。