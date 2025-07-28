# MDT智能化平台项目结构

## 📁 项目目录结构

```
mock-driven-testing/
├── packages/                     # Monorepo结构
│   ├── core/                    # 核心库
│   │   ├── src/
│   │   │   ├── analyzer/       # 智能分析引擎
│   │   │   │   ├── code-analyzer.ts
│   │   │   │   ├── dependency-analyzer.ts
│   │   │   │   ├── flow-detector.ts
│   │   │   │   └── scenario-classifier.ts
│   │   │   ├── mock/           # Mock管理
│   │   │   │   ├── mock-repository.ts
│   │   │   │   ├── mock-generator.ts
│   │   │   │   ├── parameterizer.ts
│   │   │   │   └── data-factory.ts
│   │   │   ├── scenario/       # 场景管理
│   │   │   │   ├── scenario-manager.ts
│   │   │   │   ├── scenario-matrix.ts
│   │   │   │   ├── scenario-executor.ts
│   │   │   │   └── scenario-optimizer.ts
│   │   │   └── strategy/       # 测试策略
│   │   │       ├── granularity-decider.ts
│   │   │       ├── risk-assessor.ts
│   │   │       ├── reuse-analyzer.ts
│   │   │       └── test-generator.ts
│   │   └── package.json
│   │
│   ├── server/                  # 服务端
│   │   ├── src/
│   │   │   ├── api/           # API接口
│   │   │   │   ├── graphql/
│   │   │   │   └── rest/
│   │   │   ├── proxy/         # 代理服务
│   │   │   │   ├── interceptor.ts
│   │   │   │   ├── router.ts
│   │   │   │   └── response-builder.ts
│   │   │   ├── services/      # 业务服务
│   │   │   │   ├── analysis-service.ts
│   │   │   │   ├── mock-service.ts
│   │   │   │   └── scenario-service.ts
│   │   │   └── db/            # 数据层
│   │   │       ├── models/
│   │   │       └── repositories/
│   │   └── package.json
│   │
│   ├── web/                     # Web管理界面
│   │   ├── src/
│   │   │   ├── components/    # UI组件
│   │   │   │   ├── MockEditor/
│   │   │   │   ├── ScenarioManager/
│   │   │   │   ├── AnalysisReport/
│   │   │   │   └── Dashboard/
│   │   │   ├── features/      # 功能模块
│   │   │   │   ├── mock-management/
│   │   │   │   ├── scenario-control/
│   │   │   │   ├── analysis-viewer/
│   │   │   │   └── test-runner/
│   │   │   └── store/         # 状态管理
│   │   └── package.json
│   │
│   └── cli/                     # CLI工具
│       ├── src/
│       │   ├── commands/      # 命令
│       │   │   ├── analyze.ts
│       │   │   ├── mock.ts
│       │   │   ├── scenario.ts
│       │   │   └── test.ts
│       │   └── utils/
│       └── package.json
│
├── docs/                        # 文档（已有）
├── examples/                    # 示例项目
│   ├── simple-api/
│   ├── react-app/
│   └── complex-system/
├── scripts/                     # 构建脚本
├── tests/                       # 测试
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .github/                     # CI/CD配置
│   └── workflows/
├── docker/                      # Docker配置
│   ├── Dockerfile
│   └── docker-compose.yml
├── package.json                 # 根配置
├── lerna.json                  # Monorepo配置
└── README.md

```

## 🏗️ 核心模块详细设计

### 1. 智能分析引擎 (analyzer)

```typescript
// code-analyzer.ts
export class CodeAnalyzer {
  // AST解析
  parseProject(projectPath: string): ProjectAST
  
  // 组件依赖分析
  analyzeComponentDependencies(): DependencyGraph
  
  // API调用分析
  analyzeAPIUsage(): APICallGraph
}

// flow-detector.ts
export class FlowDetector {
  // 业务流程检测
  detectBusinessFlows(): BusinessFlow[]
  
  // 用户路径分析
  analyzeUserPaths(): UserPath[]
  
  // 关键路径识别
  identifyCriticalPaths(): CriticalPath[]
}

// scenario-classifier.ts
export class ScenarioClassifier {
  // 场景分类
  classifyScenarios(): ScenarioCategories
  
  // 场景优先级
  prioritizeScenarios(): PriorityMatrix
  
  // 场景复用分析
  analyzeScenarioReuse(): ReuseMatrix
}
```

### 2. Mock管理系统 (mock)

```typescript
// mock-repository.ts
export class MockRepository {
  // CRUD操作
  create(mock: MockData): Promise<Mock>
  update(id: string, mock: MockData): Promise<Mock>
  delete(id: string): Promise<void>
  find(criteria: MockCriteria): Promise<Mock[]>
  
  // 版本管理
  createVersion(mockId: string): Promise<Version>
  rollback(mockId: string, versionId: string): Promise<Mock>
}

// mock-generator.ts
export class MockGenerator {
  // 基于模板生成
  generateFromTemplate(template: MockTemplate): Mock
  
  // 基于规则生成
  generateFromRules(rules: GenerationRules): Mock
  
  // 智能生成
  generateSmart(context: AnalysisContext): Mock
}
```

### 3. 场景管理系统 (scenario)

```typescript
// scenario-manager.ts
export class ScenarioManager {
  // 场景CRUD
  createScenario(scenario: ScenarioDefinition): Promise<Scenario>
  
  // 场景切换
  switchScenario(scenarioId: string): Promise<void>
  
  // 场景组合
  combineScenarios(scenarios: Scenario[]): CompositeScenario
}

// scenario-matrix.ts
export class ScenarioMatrix {
  // 生成场景矩阵
  generateMatrix(dimensions: Dimension[]): Matrix
  
  // 优化场景组合
  optimizeCombinations(matrix: Matrix): OptimizedMatrix
  
  // 场景覆盖分析
  analyzeCoverage(matrix: Matrix): CoverageReport
}
```

### 4. 测试策略系统 (strategy)

```typescript
// granularity-decider.ts
export class GranularityDecider {
  // 决定测试粒度
  decideGranularity(component: Component, context: Context): TestGranularity
  
  // 推荐测试层级
  recommendTestLayers(analysis: AnalysisResult): TestLayer[]
}

// test-generator.ts
export class TestGenerator {
  // 生成测试用例
  generateTests(scenario: Scenario, strategy: TestStrategy): TestCase[]
  
  // 生成测试代码
  generateTestCode(testCase: TestCase, framework: TestFramework): string
}
```

## 🔧 技术实现要点

### 数据库设计
```sql
-- Mock数据表
CREATE TABLE mocks (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  endpoint VARCHAR(255),
  method VARCHAR(10),
  scenario_id UUID,
  request_schema JSONB,
  response_data JSONB,
  metadata JSONB,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- 场景表
CREATE TABLE scenarios (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50),
  config JSONB,
  is_active BOOLEAN,
  created_at TIMESTAMP
);

-- 分析结果表
CREATE TABLE analysis_results (
  id UUID PRIMARY KEY,
  project_id UUID,
  analysis_type VARCHAR(50),
  result_data JSONB,
  recommendations JSONB,
  created_at TIMESTAMP
);
```

### API设计
```graphql
# GraphQL Schema
type Query {
  # Mock查询
  mocks(filter: MockFilter): [Mock!]!
  mock(id: ID!): Mock
  
  # 场景查询
  scenarios(type: ScenarioType): [Scenario!]!
  activeScenario: Scenario
  
  # 分析结果
  analysisResults(projectId: ID!): [AnalysisResult!]!
}

type Mutation {
  # Mock操作
  createMock(input: MockInput!): Mock!
  updateMock(id: ID!, input: MockInput!): Mock!
  
  # 场景操作
  createScenario(input: ScenarioInput!): Scenario!
  switchScenario(id: ID!): Scenario!
  
  # 分析操作
  runAnalysis(projectPath: String!): AnalysisResult!
}
```

## 🚀 启动命令

```bash
# 开发环境
npm run dev

# 启动各个服务
npm run dev:core    # 核心库开发
npm run dev:server  # 服务端
npm run dev:web     # Web界面

# 构建
npm run build

# 测试
npm run test
npm run test:e2e

# Docker部署
docker-compose up
```

这个结构设计支持：
- 模块化开发
- 独立部署
- 横向扩展
- 插件机制

是一个真正的企业级智能化Mock平台架构！