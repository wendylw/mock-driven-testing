# Phase 2: 场景化Mock - 详细实施计划

## 🎯 Phase 2 目标

实现场景管理和快速切换，提升边界测试覆盖率：
- 边界测试覆盖率提升至95%
- 场景切换时间 < 10ms
- 测试数据一致性保证

## 🔑 核心概念

### 什么是场景化Mock？

场景化Mock允许为同一个API端点定义多种响应场景，例如：
- **正常场景**：返回成功的数据
- **错误场景**：返回各种错误状态
- **边界场景**：空数据、超大数据、特殊字符等
- **性能场景**：模拟延迟、超时等

### 场景管理的价值
1. **完整测试覆盖**：轻松测试各种边界条件
2. **快速切换**：一键切换测试场景，无需修改Mock
3. **场景复用**：场景可以跨Mock共享和继承
4. **测试一致性**：确保每次测试使用相同的场景数据

## 📊 场景模型设计

### 场景数据结构
```javascript
{
  "scenario": {
    "id": "scenario-id",
    "name": "购物车正常场景",
    "description": "所有服务正常响应的场景",
    "tags": ["normal", "happy-path"],
    "active": true,
    "parent": "base-scenario", // 继承自哪个场景
    "variables": {
      // 场景级变量，可在Mock中使用
      "userId": "12345",
      "cartId": "cart-001"
    },
    "mocks": [
      // 该场景下的Mock列表
      {
        "mockId": "mock-1",
        "overrides": {
          // 覆盖Mock的默认响应
          "response": {
            "body": {
              "cartId": "{{cartId}}", // 使用场景变量
              "items": []
            }
          }
        }
      }
    ],
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T00:00:00Z"
  }
}
```

### 场景组合矩阵
```javascript
// 多维度场景组合
{
  "matrix": {
    "name": "电商测试场景矩阵",
    "dimensions": [
      {
        "name": "用户状态",
        "values": ["未登录", "已登录", "VIP用户"]
      },
      {
        "name": "库存状态", 
        "values": ["有货", "缺货", "库存不足"]
      },
      {
        "name": "网络状态",
        "values": ["正常", "慢速", "超时"]
      }
    ],
    "combinations": [
      // 自动生成的组合
      {
        "name": "未登录+有货+正常",
        "values": ["未登录", "有货", "正常"],
        "scenarioId": "scenario-1"
      }
    ]
  }
}
```

## 📅 Week 3: 场景模型设计与实现

### Day 1-2: 场景管理核心

#### 任务清单
```javascript
// 1. 场景数据模型
- [ ] 设计场景Schema
- [ ] 实现场景存储层
- [ ] 场景CRUD操作
- [ ] 场景验证逻辑

// 2. 场景继承机制
- [ ] 实现场景继承逻辑
- [ ] 变量覆盖机制
- [ ] Mock覆盖机制
- [ ] 继承链解析

// 3. 场景变量系统
- [ ] 变量定义和存储
- [ ] 变量解析引擎
- [ ] 变量作用域管理
- [ ] 内置变量（时间戳、随机数等）
```

#### 代码实现

**src/server/scenario/model.js**
```javascript
class Scenario {
  constructor(data = {}) {
    this.id = data.id || generateId();
    this.name = data.name;
    this.description = data.description || '';
    this.tags = data.tags || [];
    this.active = data.active !== false;
    this.parent = data.parent || null;
    this.variables = data.variables || {};
    this.mocks = data.mocks || [];
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  // 合并继承的场景数据
  mergeWithParent(parentScenario) {
    if (!parentScenario) return this;

    return new Scenario({
      ...this,
      variables: {
        ...parentScenario.variables,
        ...this.variables
      },
      mocks: this.mergeMocks(parentScenario.mocks, this.mocks)
    });
  }

  mergeMocks(parentMocks, childMocks) {
    const mergedMocks = [...parentMocks];
    
    childMocks.forEach(childMock => {
      const existingIndex = mergedMocks.findIndex(
        m => m.mockId === childMock.mockId
      );
      
      if (existingIndex >= 0) {
        // 覆盖父场景的Mock
        mergedMocks[existingIndex] = this.mergeMockOverrides(
          mergedMocks[existingIndex],
          childMock
        );
      } else {
        // 添加新Mock
        mergedMocks.push(childMock);
      }
    });

    return mergedMocks;
  }

  mergeMockOverrides(baseMock, overrideMock) {
    return {
      ...baseMock,
      ...overrideMock,
      overrides: {
        ...baseMock.overrides,
        ...overrideMock.overrides
      }
    };
  }
}

module.exports = Scenario;
```

**src/server/scenario/storage.js**
```javascript
const fs = require('fs');
const path = require('path');
const { generateId } = require('../utils/helpers');
const logger = require('../utils/logger');

class ScenarioStorage {
  constructor() {
    this.dataDir = path.join(__dirname, '../../../data');
    this.scenariosFile = path.join(this.dataDir, 'scenarios.json');
    this.scenarios = this.loadScenarios();
  }

  loadScenarios() {
    try {
      if (fs.existsSync(this.scenariosFile)) {
        const data = fs.readFileSync(this.scenariosFile, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      logger.error('Error loading scenarios:', error.message);
    }
    return [];
  }

  saveScenarios() {
    try {
      fs.writeFileSync(this.scenariosFile, JSON.stringify(this.scenarios, null, 2));
      logger.debug('Scenarios saved to file');
    } catch (error) {
      logger.error('Error saving scenarios:', error.message);
      throw error;
    }
  }

  async createScenario(scenarioData) {
    const scenario = {
      id: generateId(),
      ...scenarioData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.scenarios.push(scenario);
    this.saveScenarios();
    
    logger.info(`Scenario created: ${scenario.id} - ${scenario.name}`);
    return scenario;
  }

  async getScenarioById(id) {
    return this.scenarios.find(scenario => scenario.id === id);
  }

  async getAllScenarios() {
    return this.scenarios;
  }

  async getActiveScenario() {
    return this.scenarios.find(scenario => scenario.active);
  }

  async updateScenario(id, updateData) {
    const index = this.scenarios.findIndex(scenario => scenario.id === id);
    if (index === -1) {
      throw new Error('Scenario not found');
    }

    this.scenarios[index] = {
      ...this.scenarios[index],
      ...updateData,
      id, // 保持ID不变
      updatedAt: new Date().toISOString()
    };

    this.saveScenarios();
    logger.info(`Scenario updated: ${id}`);
    return this.scenarios[index];
  }

  async deleteScenario(id) {
    const index = this.scenarios.findIndex(scenario => scenario.id === id);
    if (index === -1) {
      throw new Error('Scenario not found');
    }

    this.scenarios.splice(index, 1);
    this.saveScenarios();
    logger.info(`Scenario deleted: ${id}`);
  }

  async activateScenario(id) {
    // 先将所有场景设为非激活
    this.scenarios.forEach(scenario => {
      scenario.active = false;
    });

    // 激活指定场景
    const scenario = this.scenarios.find(s => s.id === id);
    if (!scenario) {
      throw new Error('Scenario not found');
    }

    scenario.active = true;
    scenario.updatedAt = new Date().toISOString();
    this.saveScenarios();

    logger.info(`Scenario activated: ${id} - ${scenario.name}`);
    return scenario;
  }
}

module.exports = ScenarioStorage;
```

### Day 3-4: 预定义场景库

#### 任务清单
```javascript
// 1. 通用场景模板
- [ ] 创建正常响应场景
- [ ] 创建错误响应场景集
- [ ] 创建边界测试场景
- [ ] 创建性能测试场景

// 2. 场景模板系统
- [ ] 场景模板定义格式
- [ ] 模板参数化
- [ ] 模板实例化逻辑
- [ ] 内置模板库

// 3. 场景导入导出
- [ ] 场景导出为JSON
- [ ] 从JSON导入场景
- [ ] 场景共享格式
- [ ] 场景市场准备
```

#### 预定义场景模板

**src/server/scenario/templates.js**
```javascript
const scenarioTemplates = {
  // 基础场景模板
  base: {
    normal: {
      name: "正常响应场景",
      description: "所有API返回正常响应",
      tags: ["normal", "happy-path"],
      variables: {
        responseDelay: 0,
        timestamp: "{{now}}"
      },
      mockOverrides: {
        response: {
          status: 200
        }
      }
    },

    error: {
      name: "错误响应场景",
      description: "模拟各种错误情况",
      tags: ["error", "negative-test"],
      subScenarios: {
        unauthorized: {
          name: "未授权错误",
          mockOverrides: {
            response: {
              status: 401,
              body: {
                error: "Unauthorized",
                message: "Authentication required"
              }
            }
          }
        },
        forbidden: {
          name: "禁止访问错误",
          mockOverrides: {
            response: {
              status: 403,
              body: {
                error: "Forbidden",
                message: "Access denied"
              }
            }
          }
        },
        notFound: {
          name: "资源不存在",
          mockOverrides: {
            response: {
              status: 404,
              body: {
                error: "Not Found",
                message: "Resource not found"
              }
            }
          }
        },
        serverError: {
          name: "服务器错误",
          mockOverrides: {
            response: {
              status: 500,
              body: {
                error: "Internal Server Error",
                message: "An unexpected error occurred"
              }
            }
          }
        }
      }
    },

    boundary: {
      name: "边界测试场景",
      description: "测试各种边界条件",
      tags: ["boundary", "edge-case"],
      subScenarios: {
        emptyData: {
          name: "空数据",
          mockOverrides: {
            response: {
              status: 200,
              body: {
                data: [],
                total: 0
              }
            }
          }
        },
        largeData: {
          name: "大数据量",
          mockOverrides: {
            response: {
              status: 200,
              body: {
                data: "{{generateArray(1000)}}",
                total: 1000
              }
            }
          }
        },
        specialCharacters: {
          name: "特殊字符",
          mockOverrides: {
            response: {
              status: 200,
              body: {
                data: "!@#$%^&*()_+-=[]{}|;':\",./<>?",
                unicode: "你好世界 🌍 émojis"
              }
            }
          }
        },
        nullValues: {
          name: "空值测试",
          mockOverrides: {
            response: {
              status: 200,
              body: {
                string: null,
                number: null,
                object: null,
                array: null
              }
            }
          }
        }
      }
    },

    performance: {
      name: "性能测试场景",
      description: "模拟各种性能情况",
      tags: ["performance", "load-test"],
      subScenarios: {
        slowResponse: {
          name: "慢速响应",
          mockOverrides: {
            response: {
              delay: 3000 // 3秒延迟
            }
          }
        },
        timeout: {
          name: "请求超时",
          mockOverrides: {
            response: {
              delay: 30000 // 30秒延迟
            }
          }
        },
        throttled: {
          name: "限流响应",
          mockOverrides: {
            response: {
              status: 429,
              headers: {
                "Retry-After": "60"
              },
              body: {
                error: "Too Many Requests",
                message: "Rate limit exceeded"
              }
            }
          }
        }
      }
    }
  },

  // 业务场景模板
  business: {
    ecommerce: {
      name: "电商业务场景",
      description: "电商相关的测试场景",
      scenarios: {
        productOutOfStock: {
          name: "商品缺货",
          mocks: [
            {
              url: "/api/products/*",
              overrides: {
                response: {
                  body: {
                    stock: 0,
                    available: false
                  }
                }
              }
            },
            {
              url: "/api/cart/add",
              overrides: {
                response: {
                  status: 400,
                  body: {
                    error: "OUT_OF_STOCK",
                    message: "Product is out of stock"
                  }
                }
              }
            }
          ]
        },
        paymentFailed: {
          name: "支付失败",
          mocks: [
            {
              url: "/api/payment/process",
              overrides: {
                response: {
                  status: 400,
                  body: {
                    error: "PAYMENT_FAILED",
                    message: "Payment processing failed"
                  }
                }
              }
            }
          ]
        }
      }
    }
  }
};

module.exports = scenarioTemplates;
```

### Day 5: 场景配置系统

#### 任务清单
```javascript
// 1. 场景定义DSL
- [ ] 设计场景DSL语法
- [ ] 实现DSL解析器
- [ ] 变量插值系统
- [ ] 表达式求值

// 2. 场景管理API
- [ ] 场景CRUD端点
- [ ] 场景激活端点
- [ ] 场景克隆功能
- [ ] 场景搜索过滤

// 3. 场景验证
- [ ] 场景数据验证
- [ ] 循环依赖检测
- [ ] Mock引用验证
- [ ] 变量引用检查
```

## 📅 Week 4: 场景切换引擎

### Day 1-2: 切换机制实现

#### 任务清单
```javascript
// 1. 实时切换核心
- [ ] 场景切换事件系统
- [ ] 切换状态管理
- [ ] 切换通知机制
- [ ] 切换历史记录

// 2. 场景状态同步
- [ ] 内存状态管理
- [ ] 持久化状态
- [ ] 多实例同步
- [ ] 状态恢复机制

// 3. 切换性能优化
- [ ] 场景预加载
- [ ] 切换缓存
- [ ] 增量更新
- [ ] 并发控制
```

#### 切换引擎实现

**src/server/scenario/switcher.js**
```javascript
const EventEmitter = require('events');
const logger = require('../utils/logger');

class ScenarioSwitcher extends EventEmitter {
  constructor(scenarioService, mockService) {
    super();
    this.scenarioService = scenarioService;
    this.mockService = mockService;
    this.currentScenario = null;
    this.switchHistory = [];
  }

  async initialize() {
    // 加载当前激活的场景
    this.currentScenario = await this.scenarioService.getActiveScenario();
    if (this.currentScenario) {
      await this.applyScenario(this.currentScenario);
      logger.info(`Initialized with scenario: ${this.currentScenario.name}`);
    }
  }

  async switchToScenario(scenarioId) {
    const startTime = Date.now();
    
    try {
      // 获取目标场景
      const scenario = await this.scenarioService.getScenarioById(scenarioId);
      if (!scenario) {
        throw new Error('Scenario not found');
      }

      // 记录切换历史
      this.recordSwitch(this.currentScenario, scenario);

      // 停用当前场景
      if (this.currentScenario) {
        await this.deactivateScenario(this.currentScenario);
      }

      // 激活新场景
      await this.activateScenario(scenario);
      
      // 应用场景
      await this.applyScenario(scenario);

      // 更新状态
      this.currentScenario = scenario;

      // 发送切换事件
      this.emit('scenarioSwitched', {
        from: this.currentScenario,
        to: scenario,
        duration: Date.now() - startTime
      });

      logger.info(`Switched to scenario: ${scenario.name} (${Date.now() - startTime}ms)`);
      
      return scenario;
    } catch (error) {
      logger.error('Error switching scenario:', error.message);
      this.emit('scenarioSwitchError', error);
      throw error;
    }
  }

  async applyScenario(scenario) {
    // 获取场景的完整数据（包括继承）
    const fullScenario = await this.scenarioService.getFullScenario(scenario.id);
    
    // 应用场景的Mock覆盖
    for (const scenarioMock of fullScenario.mocks) {
      const mock = await this.mockService.getMockById(scenarioMock.mockId);
      if (mock) {
        // 应用覆盖
        const updatedMock = this.applyMockOverrides(mock, scenarioMock.overrides, fullScenario.variables);
        await this.mockService.updateMock(mock.id, updatedMock);
      }
    }
  }

  applyMockOverrides(mock, overrides, variables) {
    if (!overrides) return mock;

    // 深度合并覆盖
    const merged = {
      ...mock,
      ...overrides,
      response: {
        ...mock.response,
        ...overrides.response
      }
    };

    // 应用变量替换
    return this.interpolateVariables(merged, variables);
  }

  interpolateVariables(obj, variables) {
    const interpolate = (value) => {
      if (typeof value === 'string') {
        // 替换变量引用 {{variableName}}
        return value.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
          if (varName === 'now') {
            return new Date().toISOString();
          }
          if (varName === 'random') {
            return Math.random().toString();
          }
          return variables[varName] || match;
        });
      }
      if (Array.isArray(value)) {
        return value.map(interpolate);
      }
      if (typeof value === 'object' && value !== null) {
        const result = {};
        for (const key in value) {
          result[key] = interpolate(value[key]);
        }
        return result;
      }
      return value;
    };

    return interpolate(obj);
  }

  recordSwitch(from, to) {
    this.switchHistory.push({
      from: from?.id,
      to: to?.id,
      timestamp: new Date().toISOString()
    });

    // 保持最近100条记录
    if (this.switchHistory.length > 100) {
      this.switchHistory = this.switchHistory.slice(-100);
    }
  }

  async deactivateScenario(scenario) {
    // 场景停用逻辑
    this.emit('scenarioDeactivating', scenario);
  }

  async activateScenario(scenario) {
    // 场景激活逻辑
    await this.scenarioService.activateScenario(scenario.id);
    this.emit('scenarioActivating', scenario);
  }

  getSwitchHistory() {
    return this.switchHistory;
  }

  getCurrentScenario() {
    return this.currentScenario;
  }
}

module.exports = ScenarioSwitcher;
```

### Day 3-4: 场景应用功能

#### 任务清单
```javascript
// 1. 测试场景矩阵
- [ ] 矩阵定义模型
- [ ] 组合生成算法
- [ ] 矩阵执行引擎
- [ ] 结果收集分析

// 2. A/B测试支持
- [ ] A/B测试配置
- [ ] 流量分配逻辑
- [ ] 数据收集机制
- [ ] 对比分析工具

// 3. 场景录制回放
- [ ] 请求录制为场景
- [ ] 场景回放引擎
- [ ] 录制过滤规则
- [ ] 回放验证机制
```

### Day 5: 集成验证

#### 任务清单
```javascript
// 1. 多场景测试
- [ ] 场景批量测试
- [ ] 场景对比测试
- [ ] 回归测试支持
- [ ] 测试报告生成

// 2. 性能测试
- [ ] 切换性能基准
- [ ] 并发切换测试
- [ ] 内存占用分析
- [ ] 优化建议

// 3. 真实项目验证
- [ ] 创建示例场景集
- [ ] 集成测试用例
- [ ] 用户反馈收集
- [ ] 问题修复
```

## 🔧 技术实现要点

### 1. 场景变量系统
```javascript
// 变量类型
const variableTypes = {
  static: "静态值",
  dynamic: "动态生成",
  reference: "引用其他变量",
  function: "函数计算"
};

// 内置函数
const builtInFunctions = {
  now: () => new Date().toISOString(),
  random: () => Math.random(),
  uuid: () => generateId(),
  timestamp: () => Date.now(),
  date: (format) => formatDate(new Date(), format),
  env: (key) => process.env[key],
  sequence: (start = 1) => sequenceGenerator(start)
};
```

### 2. 场景继承链
```javascript
// 场景继承解析
async function resolveScenarioChain(scenario, storage) {
  const chain = [scenario];
  let current = scenario;
  
  while (current.parent) {
    const parent = await storage.getScenarioById(current.parent);
    if (!parent) break;
    
    // 检测循环依赖
    if (chain.find(s => s.id === parent.id)) {
      throw new Error('Circular dependency detected');
    }
    
    chain.unshift(parent);
    current = parent;
  }
  
  return chain;
}
```

### 3. 性能优化策略
```javascript
// 场景缓存
class ScenarioCache {
  constructor(maxSize = 100) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  get(key) {
    const value = this.cache.get(key);
    if (value) {
      // LRU: 移到末尾
      this.cache.delete(key);
      this.cache.set(key, value);
    }
    return value;
  }

  set(key, value) {
    if (this.cache.size >= this.maxSize) {
      // 删除最老的
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }
}
```

## 🎯 Phase 2 交付物

### 核心功能
1. ✅ 场景管理系统
   - 场景CRUD操作
   - 场景继承机制
   - 变量系统

2. ✅ 场景切换引擎
   - 实时切换（< 10ms）
   - 状态管理
   - 事件通知

3. ✅ 预定义场景库
   - 通用测试场景
   - 业务场景模板
   - 场景导入导出

4. ✅ 高级功能
   - 场景矩阵
   - A/B测试
   - 录制回放

### 性能指标
- 场景切换时间 < 10ms
- 支持100+场景并发
- 边界测试覆盖率 > 95%

## 📋 测试计划

### 单元测试
```javascript
describe('Scenario Management', () => {
  it('should create scenario');
  it('should handle inheritance');
  it('should interpolate variables');
  it('should detect circular dependencies');
});

describe('Scenario Switcher', () => {
  it('should switch scenarios < 10ms');
  it('should apply mock overrides');
  it('should emit switch events');
  it('should maintain switch history');
});
```

### 集成测试
```javascript
describe('Scenario Integration', () => {
  it('should apply scenario to all mocks');
  it('should handle complex inheritance chains');
  it('should support concurrent scenario switches');
  it('should persist scenario state');
});
```

## 🚀 开始实施

### Week 3 立即行动
```bash
# 1. 创建场景相关目录
mkdir -p src/server/scenario

# 2. 实现场景模型
code src/server/scenario/model.js

# 3. 实现场景存储
code src/server/scenario/storage.js

# 4. 开始场景服务开发
code src/server/scenario/service.js
```

### Week 4 后续任务
- 实现场景切换引擎
- 开发场景管理API
- 创建预定义场景库
- 集成测试验证

## 💡 关键创新点

1. **场景继承机制**
   - 减少重复定义
   - 灵活的覆盖策略
   - 多层继承支持

2. **智能变量系统**
   - 动态值生成
   - 变量作用域
   - 内置函数库

3. **实时切换引擎**
   - 毫秒级切换
   - 零停机时间
   - 状态一致性

4. **场景矩阵测试**
   - 自动组合生成
   - 批量执行
   - 结果分析

---

**记住：Phase 2的核心是提升测试覆盖率，让边界测试变得简单！**