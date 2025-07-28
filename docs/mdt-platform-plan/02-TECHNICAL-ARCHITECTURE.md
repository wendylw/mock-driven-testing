# MDT平台 - 技术架构详细设计

## 系统架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                          Client Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Web Console  │  │   CLI Tool   │  │ IDE Plugins  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                          API Gateway                              │
│                    (GraphQL + REST + WebSocket)                   │
└─────────────────────────────────────────────────────────────────┘
                                │
                ┌───────────────┼───────────────┐
                ▼               ▼               ▼
┌─────────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   Mock Service      │ │ Analysis Service │ │ Strategy Service │
│  - CRUD             │ │ - Code Parser    │ │ - Test Gen      │
│  - Scenario         │ │ - Flow Detector  │ │ - Optimization  │
│  - Generator        │ │ - Dependency     │ │ - ML Model      │
└─────────────────────┘ └─────────────────┘ └─────────────────┘
                │               │               │
                └───────────────┼───────────────┘
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Data Layer                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │ PostgreSQL  │  │    Redis    │  │ ElasticSearch│            │
│  │  (Primary)  │  │   (Cache)   │  │   (Search)  │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
```

## 技术栈详细说明

### 前端技术栈

#### Web Console
```typescript
// 核心依赖
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "typescript": "^5.0.0",
  "antd": "^5.0.0",
  "@reduxjs/toolkit": "^1.9.0",
  "react-router-dom": "^6.0.0",
  "@monaco-editor/react": "^4.4.0",
  "echarts": "^5.4.0",
  "d3": "^7.0.0"
}

// 项目结构
src/
├── components/          # 通用组件
│   ├── MockEditor/     # Mock编辑器
│   ├── ScenarioPanel/  # 场景面板
│   └── Charts/         # 图表组件
├── features/           # 功能模块
│   ├── mock/          # Mock管理
│   ├── analysis/      # 分析展示
│   └── monitor/       # 监控面板
├── services/          # API服务
├── store/             # Redux状态
└── utils/             # 工具函数
```

#### CLI Tool
```typescript
// 核心依赖
{
  "commander": "^10.0.0",
  "inquirer": "^9.0.0",
  "chalk": "^5.0.0",
  "ora": "^6.0.0",
  "axios": "^1.0.0",
  "cosmiconfig": "^8.0.0"
}

// 命令结构
mdt init [project]      # 初始化项目
mdt mock <action>       # Mock管理
mdt analyze [path]      # 代码分析
mdt scenario <action>   # 场景管理
mdt test [options]      # 测试执行
```

### 后端技术栈

#### 核心框架
```typescript
// 主要依赖
{
  "express": "^4.18.0",
  "apollo-server-express": "^3.0.0",
  "typeorm": "^0.3.0",
  "typescript": "^5.0.0",
  "inversify": "^6.0.0",
  "bull": "^4.0.0",
  "socket.io": "^4.0.0"
}

// 项目结构
src/
├── modules/            # 业务模块
│   ├── mock/
│   ├── analysis/
│   └── strategy/
├── core/              # 核心功能
│   ├── database/
│   ├── cache/
│   └── queue/
├── shared/            # 共享代码
│   ├── decorators/
│   ├── middleware/
│   └── utils/
└── config/            # 配置文件
```

#### 微服务架构
```yaml
# docker-compose.yml
version: '3.8'
services:
  api-gateway:
    build: ./packages/gateway
    ports:
      - "3000:3000"
    
  mock-service:
    build: ./packages/mock-service
    scale: 3
    
  analysis-service:
    build: ./packages/analysis-service
    scale: 2
    
  strategy-service:
    build: ./packages/strategy-service
    
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: mdt
      
  redis:
    image: redis:7-alpine
    
  elasticsearch:
    image: elasticsearch:8.0.0
```

### 数据库设计

#### PostgreSQL Schema

```sql
-- Mock数据表
CREATE TABLE mocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    endpoint VARCHAR(500) NOT NULL,
    method VARCHAR(10) NOT NULL,
    request_schema JSONB,
    response_schema JSONB,
    response_data JSONB,
    headers JSONB,
    status_code INTEGER DEFAULT 200,
    delay INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    version INTEGER DEFAULT 1,
    created_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_mock_endpoint UNIQUE(project_id, endpoint, method)
);

-- 场景表
CREATE TABLE scenarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT false,
    priority INTEGER DEFAULT 0,
    conditions JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 场景Mock关联表
CREATE TABLE scenario_mocks (
    scenario_id UUID REFERENCES scenarios(id),
    mock_id UUID REFERENCES mocks(id),
    override_data JSONB,
    PRIMARY KEY (scenario_id, mock_id)
);

-- 分析结果表
CREATE TABLE analysis_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL,
    commit_hash VARCHAR(40),
    analysis_type VARCHAR(50),
    file_path TEXT,
    result JSONB,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 测试策略表
CREATE TABLE test_strategies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL,
    component_path TEXT,
    strategy_type VARCHAR(50),
    granularity VARCHAR(20),
    priority INTEGER,
    test_cases JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 索引优化
CREATE INDEX idx_mocks_project ON mocks(project_id);
CREATE INDEX idx_mocks_endpoint ON mocks(endpoint, method);
CREATE INDEX idx_scenarios_project ON scenarios(project_id);
CREATE INDEX idx_analysis_project ON analysis_results(project_id);
CREATE INDEX idx_analysis_commit ON analysis_results(commit_hash);
```

#### Redis缓存策略

```typescript
// 缓存键设计
const CacheKeys = {
  // Mock缓存
  mockById: (id: string) => `mock:${id}`,
  mockByEndpoint: (projectId: string, endpoint: string, method: string) => 
    `mock:${projectId}:${endpoint}:${method}`,
  
  // 场景缓存
  activeScenario: (projectId: string) => `scenario:active:${projectId}`,
  scenarioMocks: (scenarioId: string) => `scenario:mocks:${scenarioId}`,
  
  // 分析结果缓存
  analysisResult: (projectId: string, commitHash: string) => 
    `analysis:${projectId}:${commitHash}`,
  
  // 统计数据
  requestStats: (projectId: string, date: string) => 
    `stats:${projectId}:${date}`
};

// 缓存过期时间
const CacheTTL = {
  mock: 3600,           // 1小时
  scenario: 1800,       // 30分钟
  analysis: 86400,      // 24小时
  stats: 300            // 5分钟
};
```

### 核心算法设计

#### 代码分析算法

```typescript
// AST分析器
export class ASTAnalyzer {
  async analyzeProject(projectPath: string): Promise<AnalysisResult> {
    // 1. 扫描项目文件
    const files = await this.scanFiles(projectPath);
    
    // 2. 并行解析AST
    const astTrees = await Promise.all(
      files.map(file => this.parseAST(file))
    );
    
    // 3. 构建依赖图
    const dependencyGraph = this.buildDependencyGraph(astTrees);
    
    // 4. 识别API调用
    const apiCalls = this.extractAPICalls(astTrees);
    
    // 5. 检测业务流程
    const businessFlows = this.detectBusinessFlows(dependencyGraph, apiCalls);
    
    return {
      files: files.length,
      components: this.countComponents(astTrees),
      dependencies: dependencyGraph,
      apiCalls,
      businessFlows
    };
  }
  
  private parseAST(filePath: string): Promise<AST> {
    // 使用 @babel/parser 或 typescript compiler API
    return parser.parse(filePath, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript']
    });
  }
}
```

#### 场景匹配算法

```typescript
// 场景匹配引擎
export class ScenarioMatcher {
  match(request: Request, scenarios: Scenario[]): Scenario | null {
    // 1. 筛选激活的场景
    const activeScenarios = scenarios.filter(s => s.isActive);
    
    // 2. 按优先级排序
    const sortedScenarios = activeScenarios.sort((a, b) => 
      b.priority - a.priority
    );
    
    // 3. 逐个匹配条件
    for (const scenario of sortedScenarios) {
      if (this.matchConditions(request, scenario.conditions)) {
        return scenario;
      }
    }
    
    return null;
  }
  
  private matchConditions(request: Request, conditions: Condition[]): boolean {
    return conditions.every(condition => {
      switch (condition.type) {
        case 'header':
          return this.matchHeader(request.headers, condition);
        case 'query':
          return this.matchQuery(request.query, condition);
        case 'body':
          return this.matchBody(request.body, condition);
        case 'time':
          return this.matchTime(condition);
        default:
          return true;
      }
    });
  }
}
```

#### 测试策略生成算法

```typescript
// 智能测试策略生成器
export class TestStrategyGenerator {
  generateStrategy(
    component: ComponentInfo,
    analysis: AnalysisResult
  ): TestStrategy {
    // 1. 计算复用度得分
    const reuseScore = this.calculateReuseScore(component, analysis);
    
    // 2. 评估复杂度
    const complexityScore = this.calculateComplexity(component);
    
    // 3. 分析风险等级
    const riskLevel = this.assessRisk(component, analysis);
    
    // 4. 决定测试粒度
    const granularity = this.decideGranularity(
      reuseScore,
      complexityScore,
      riskLevel
    );
    
    // 5. 生成测试用例
    const testCases = this.generateTestCases(component, granularity);
    
    return {
      component: component.name,
      granularity,
      priority: this.calculatePriority(riskLevel),
      testCases,
      estimatedTime: this.estimateTestTime(testCases)
    };
  }
}
```

### 性能优化策略

#### 1. 数据库优化
- 使用连接池
- 查询结果缓存
- 索引优化
- 分区表设计

#### 2. API优化
- GraphQL DataLoader
- 请求合并
- 响应压缩
- CDN加速

#### 3. 缓存策略
- 多级缓存
- 缓存预热
- 缓存更新策略
- 分布式缓存

#### 4. 异步处理
- 消息队列
- 后台任务
- 流式处理
- 并发控制

### 安全设计

#### 1. 认证授权
```typescript
// JWT认证中间件
export const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await userService.findById(payload.userId);
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// 权限控制
export const authorize = (permissions: string[]) => {
  return (req, res, next) => {
    if (!permissions.some(p => req.user.permissions.includes(p))) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
};
```

#### 2. 数据安全
- 敏感数据加密
- SQL注入防护
- XSS防护
- CSRF防护

#### 3. 通信安全
- HTTPS强制
- API限流
- DDoS防护
- 安全头配置

### 监控告警

#### 1. 应用监控
```typescript
// Prometheus指标
export const metrics = {
  httpRequestDuration: new Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status']
  }),
  
  mockHitRate: new Counter({
    name: 'mock_hit_total',
    help: 'Total number of mock hits',
    labelNames: ['project', 'endpoint']
  }),
  
  analysisJobDuration: new Histogram({
    name: 'analysis_job_duration_seconds',
    help: 'Duration of analysis jobs in seconds',
    labelNames: ['type', 'status']
  })
};
```

#### 2. 日志系统
- 结构化日志
- 日志聚合
- 错误追踪
- 审计日志

#### 3. 告警规则
- 响应时间告警
- 错误率告警
- 资源使用告警
- 业务指标告警

---

**这是一个可扩展、高性能、安全可靠的企业级架构设计！** 🏗️