# BEEP项目基准管理实施计划

## 📋 项目概述

基于BEEP项目的真实组件数据，实现智能基准管理系统。通过分析BEEP项目中4个核心组件（Button、CreateOrderButton、Modal、Input）的实际使用情况，设计并实现符合真实业务场景的基准状态管理。

## 📊 BEEP项目真实数据分析

### 组件使用统计
```javascript
const beepComponentData = {
  "Button": {
    usageCount: 27,
    riskLevel: "low",
    keyUsageScenarios: [
      "购物车操作按钮 (MiniCart)",
      "菜单导航按钮 (MenuFooter)", 
      "确认对话框按钮 (Confirm)",
      "搜索功能按钮 (Search)",
      "会员奖励按钮 (MemberRewards)"
    ],
    businessImpact: "中等 - 影响用户交互体验"
  },

  "CreateOrderButton": {
    usageCount: 7,
    riskLevel: "high", // 特殊标记为高风险业务组件
    keyUsageScenarios: [
      "支付页面 - 创建订单 (Payment)",
      "购物车结算 (Cart/PayFirst)",
      "信用卡支付 (CreditCard)",
      "在线银行支付 (OnlineBanking)",
      "客户信息确认 (CustomerInfo)"
    ],
    businessImpact: "关键 - 直接影响订单转化和营收"
  },

  "Modal": {
    usageCount: 10,
    riskLevel: "low",
    keyUsageScenarios: [
      "确认对话框 (Confirm)",
      "警告提示 (Alert)", 
      "酒类购买确认 (AlcoholModal)",
      "地址修改 (AddressChangeModal)",
      "订单状态显示 (ThankYou/SelfPickup)"
    ],
    businessImpact: "中等 - 影响用户决策流程"
  },

  "Input": {
    usageCount: 4,
    riskLevel: "low", 
    keyUsageScenarios: [
      "数字输入 (Number)",
      "文本输入 (Text)",
      "生日输入 (Birthday)",
      "邮箱输入 (Email)"
    ],
    businessImpact: "中等 - 影响数据收集质量"
  }
}
```

## 🎯 基准数据模型设计

### 基于真实数据的基准Schema
```typescript
interface BEEPBaselineData {
  // 基础元数据
  id: string;
  component: ComponentName;
  path: string; // 实际的BEEP项目路径
  
  // 版本信息 (基于git数据)
  version: string;
  developCommit: string;     // develop分支最新commit
  baselineCommit: string;    // 基准对应的commit
  lastSyncDate: Date;        // 最后同步时间
  
  // 业务数据 (基于真实分析结果)
  usageStats: {
    totalUsage: number;      // 实际使用次数 (Button: 27, CreateOrderButton: 7...)
    usageFiles: string[];    // 实际使用文件列表
    riskLevel: 'low' | 'medium' | 'high';
    businessImpact: 'low' | 'medium' | 'high' | 'critical';
  };
  
  // 基准文件信息
  baselineFiles: {
    snapshots: {
      count: number;         // 快照数量
      variations: number;    // Props组合数
      totalSize: number;     // 文件大小(KB)
      files: string[];       // 快照文件列表
    };
    performance: {
      renderTime: number;    // 渲染时间基准
      memoryUsage: number;   // 内存使用基准
      file: string;          // 性能数据文件
    };
    behavior: {
      interactions: number;  // 交互场景数
      accessibility: boolean; // 无障碍测试覆盖
      file: string;          // 行为测试文件
    };
  };
  
  // 状态计算 (基于设计文档)
  status: 'healthy' | 'outdated' | 'corrupted';
  statusDetails: {
    lastCheck: Date;
    checkResult: string;
    autoFixAvailable: boolean;
    estimatedFixTime: string; // "5分钟" | "15分钟" | "1小时"
  };
  
  // 业务场景信息
  businessContext: {
    criticalPaths: string[];  // 关键业务路径
    affectedFeatures: string[]; // 影响的功能
    testPriority: 1 | 2 | 3 | 4 | 5; // 测试优先级
  };
}

// 具体的组件类型
type ComponentName = 'Button' | 'CreateOrderButton' | 'Modal' | 'Input';
```

### 真实数据映射示例
```javascript
const beepBaselines = [
  {
    id: 'baseline-button-001',
    component: 'Button',
    path: 'src/common/components/Button/index.jsx',
    version: '1.3.2',
    developCommit: 'a7f9d2c',
    baselineCommit: 'a7f9d2c', // 同步 = healthy
    lastSyncDate: new Date('2025-01-29T10:30:00'),
    
    usageStats: {
      totalUsage: 27, // 真实数据
      usageFiles: [
        'src/common/components/Result/index.jsx',
        'src/common/components/Input/Search.jsx',
        'src/common/components/DownloadBanner/index.jsx',
        // ... 其他24个文件
      ],
      riskLevel: 'low',
      businessImpact: 'medium'
    },
    
    baselineFiles: {
      snapshots: {
        count: 15, // 3种type × 5种状态
        variations: 12, // 不同props组合
        totalSize: 245.6, // KB
        files: [
          'button-primary-normal.png',
          'button-primary-loading.png',
          'button-secondary-disabled.png',
          // ... 其他快照
        ]
      },
      performance: {
        renderTime: 2.3, // ms
        memoryUsage: 1.2, // KB  
        file: 'button-performance.json'
      },
      behavior: {
        interactions: 8, // click, hover, focus, keyboard等
        accessibility: true,
        file: 'button-behavior.json'
      }
    },
    
    status: 'healthy',
    statusDetails: {
      lastCheck: new Date('2025-01-29T10:30:00'),
      checkResult: '基准与develop分支同步',
      autoFixAvailable: false,
      estimatedFixTime: '无需修复'
    },
    
    businessContext: {
      criticalPaths: [
        '购物车结算流程',
        '搜索功能',
        '会员操作'
      ],
      affectedFeatures: [
        'MiniCart交互',
        'MenuFooter导航',
        'Search功能'
      ],
      testPriority: 3 // 中等优先级
    }
  },

  {
    id: 'baseline-createorderbutton-001', 
    component: 'CreateOrderButton',
    path: 'src/ordering/components/CreateOrderButton/index.jsx',
    version: '2.1.4',
    developCommit: 'b8e3f1d',
    baselineCommit: 'a2d5c8f', // 落后 = outdated
    lastSyncDate: new Date('2025-01-27T16:20:00'),
    
    usageStats: {
      totalUsage: 7, // 真实数据
      usageFiles: [
        'src/ordering/containers/shopping-cart/containers/Cart/PayFirst.jsx',
        'src/ordering/containers/payments/containers/SavedCards/index.jsx',
        'src/ordering/containers/payments/containers/Stripe/CheckoutForm.jsx',
        // ... 其他4个关键支付文件
      ],
      riskLevel: 'high', // 特殊标记
      businessImpact: 'critical' // 直接影响收入
    },
    
    baselineFiles: {
      snapshots: {
        count: 8, // 支付场景相关
        variations: 6,
        totalSize: 156.3,
        files: [
          'createorder-normal.png',
          'createorder-loading.png',
          'createorder-disabled.png',
          // ... 支付场景快照
        ]
      },
      performance: {
        renderTime: 3.1, // ms (业务逻辑较复杂)
        memoryUsage: 2.8,
        file: 'createorder-performance.json'
      },
      behavior: {
        interactions: 12, // 复杂的支付交互
        accessibility: true,
        file: 'createorder-behavior.json'
      }
    },
    
    status: 'outdated',
    statusDetails: {
      lastCheck: new Date('2025-01-29T10:30:00'),
      checkResult: '基准落后2个commit，包含支付逻辑更新',
      autoFixAvailable: true,
      estimatedFixTime: '15分钟'
    },
    
    businessContext: {
      criticalPaths: [
        '订单创建流程', // 最关键
        '支付确认流程',
        '客户信息验证'
      ],
      affectedFeatures: [
        '信用卡支付',
        '在线银行支付', 
        '购物车结算',
        '客户信息确认'
      ],
      testPriority: 5 // 最高优先级
    }
  }

  // Modal和Input的类似配置...
];
```

## 🎛 UI实现计划

### 1. Dashboard概览区域
```javascript
const dashboardMetrics = {
  // 基于真实数据的健康度计算
  overallHealth: {
    total: 4, // 4个组件
    healthy: 2, // Button, Input
    outdated: 1, // CreateOrderButton (关键!)
    corrupted: 1, // Modal (假设)
    healthPercentage: 50 // 需要关注
  },
  
  // 业务风险评估
  businessRisk: {
    level: 'HIGH', // 因为CreateOrderButton过时
    reason: '关键订单组件基准过时',
    impact: '可能影响支付流程测试准确性',
    urgency: '建议立即更新'
  },
  
  // 发布建议
  releaseRecommendation: {
    status: 'CAUTION', // 谨慎发布
    message: '建议更新CreateOrderButton基准后发布',
    estimatedTime: '15分钟',
    blockingIssues: 0
  }
}
```

### 2. 组件列表设计
```javascript
const componentListDisplay = [
  {
    component: 'CreateOrderButton',
    status: '🔴 过时',
    priority: '🔥 关键',
    usage: '7个支付场景',
    impact: '💰 直接影响营收',
    action: '立即更新',
    estimatedTime: '15分钟',
    lastUpdate: '2天前',
    businessContext: '订单创建、支付确认、客户验证'
  },
  {
    component: 'Button', 
    status: '🟢 健康',
    priority: '⭐ 中等',
    usage: '27个交互场景',
    impact: '👆 用户体验',
    action: '无需操作',
    estimatedTime: '-',
    lastUpdate: '1小时前',
    businessContext: '搜索、导航、确认操作'
  },
  {
    component: 'Modal',
    status: '🔴 损坏',
    priority: '⚠️ 中等', 
    usage: '10个对话场景',
    impact: '🗣️ 用户决策',
    action: '重建基准',
    estimatedTime: '10分钟',
    lastUpdate: '5天前',
    businessContext: '确认对话、警告提示、信息展示'
  },
  {
    component: 'Input',
    status: '🟢 健康',
    priority: '📝 普通',
    usage: '4个输入场景', 
    impact: '📊 数据质量',
    action: '无需操作',
    estimatedTime: '-',
    lastUpdate: '6小时前',
    businessContext: '用户信息收集、表单输入'
  }
]
```

### 3. 详细信息面板
```javascript
const detailPanelDesign = {
  // CreateOrderButton详情示例
  componentDetail: {
    basicInfo: {
      name: 'CreateOrderButton',
      path: 'src/ordering/components/CreateOrderButton/index.jsx',
      currentVersion: 'v2.1.4',
      baselineVersion: 'v2.1.2', // 落后
      lastCommit: 'b8e3f1d',
      baselineCommit: 'a2d5c8f'
    },
    
    usageAnalysis: {
      totalFiles: 7,
      criticalFiles: [
        {
          file: 'Cart/PayFirst.jsx',
          context: '购物车最终结算',
          importance: 'CRITICAL'
        },
        {
          file: 'Payment/index.jsx', 
          context: '支付页面主流程',
          importance: 'CRITICAL'
        },
        {
          file: 'Stripe/CheckoutForm.jsx',
          context: 'Stripe支付确认',
          importance: 'HIGH'
        }
        // ... 其他使用场景
      ]
    },
    
    baselineStatus: {
      missedCommits: [
        {
          commit: 'c1f2e3d',
          date: '2025-01-28',
          message: '优化支付按钮loading状态',
          impact: '影响支付体验测试'
        },
        {
          commit: 'b8e3f1d',
          date: '2025-01-29', 
          message: '修复支付超时处理',
          impact: '影响错误场景测试'
        }
      ],
      
      recommendations: [
        '立即更新基准以包含最新支付逻辑',
        '重点测试支付超时和loading状态',
        '验证所有7个使用场景的兼容性'
      ]
    }
  }
}
```

## 🔄 数据流和状态管理

### 1. 数据获取流程
```javascript
const dataFlowPlan = {
  // 数据源
  dataSources: {
    git: {
      api: 'git log --oneline develop..baseline-commit',
      purpose: '获取commit差异，判断outdated状态',
      frequency: '每次develop更新时'
    },
    
    filesystem: {
      api: 'fs.readdir() + fs.stat()',
      purpose: '检查基准文件完整性，判断corrupted状态', 
      frequency: '每日定时检查'
    },
    
    analysis: {
      api: '/Users/wendylin/workspace/mock-driven-testing/analysis-report.json',
      purpose: '获取组件使用统计和风险评级',
      frequency: '代码变更时重新分析'
    },
    
    performance: {
      api: 'performance-baseline.json',
      purpose: '获取性能基准数据',
      frequency: '基准更新时生成'
    }
  },
  
  // 状态计算逻辑
  statusCalculation: {
    healthy: 'developCommit === baselineCommit && allFilesValid',
    outdated: 'developCommit !== baselineCommit && allFilesValid',
    corrupted: '!allFilesValid || missingCriticalFiles'
  },
  
  // 缓存策略
  caching: {
    componentList: '30秒缓存',
    statusCheck: '5分钟缓存',
    detailInfo: '实时获取',
    performanceData: '1小时缓存'
  }
}
```

### 2. 状态更新机制
```javascript
const stateUpdatePlan = {
  // 实时更新触发器
  realTimeUpdates: {
    gitHooks: {
      trigger: 'develop分支新commit',
      action: '检查所有基准状态',
      debounce: '5分钟' // 避免频繁更新
    },
    
    fileWatcher: {
      trigger: '基准文件变更',
      action: '更新对应组件状态',
      paths: ['baselines/**/*.png', 'baselines/**/*.json']
    }
  },
  
  // 批量操作
  batchOperations: {
    updateAll: {
      steps: [
        '按优先级排序 (CreateOrderButton优先)',
        '并行更新非关键组件',
        '串行更新关键业务组件',
        '验证更新结果',
        '通知相关开发者'
      ],
      estimatedTime: '5-30分钟'
    },
    
    healthCheck: {
      frequency: '每日凌晨2点',
      scope: '全量组件检查',
      report: '发送健康度报告给Tech Lead'
    }
  }
}
```

## 🛠 技术实现方案

### 1. 前端实现架构
```typescript
// services/baselineService.ts
class BEEPBaselineService {
  // 获取基准列表
  async getBaselines(): Promise<BEEPBaselineData[]> {
    // 1. 读取analysis-report.json获取组件信息
    const analysisData = await this.loadAnalysisReport();
    
    // 2. 检查每个组件的基准状态
    const baselines = await Promise.all(
      Object.entries(analysisData.components).map(async ([name, info]) => {
        return await this.checkComponentBaseline(name, info);
      })
    );
    
    return baselines;
  }
  
  // 检查单个组件基准状态
  private async checkComponentBaseline(
    componentName: string, 
    componentInfo: any
  ): Promise<BEEPBaselineData> {
    // 1. Git状态检查
    const gitStatus = await this.checkGitStatus(componentName);
    
    // 2. 文件完整性检查  
    const fileStatus = await this.checkFileIntegrity(componentName);
    
    // 3. 计算状态
    const status = this.calculateStatus(gitStatus, fileStatus);
    
    // 4. 组装完整数据
    return {
      id: `baseline-${componentName.toLowerCase()}-001`,
      component: componentName,
      path: this.getComponentPath(componentName),
      version: gitStatus.developVersion,
      developCommit: gitStatus.developCommit,
      baselineCommit: gitStatus.baselineCommit,
      lastSyncDate: fileStatus.lastModified,
      usageStats: {
        totalUsage: componentInfo.usageCount,
        usageFiles: componentInfo.usedIn,
        riskLevel: componentInfo.riskLevel,
        businessImpact: this.calculateBusinessImpact(componentName, componentInfo)
      },
      baselineFiles: await this.getBaselineFiles(componentName),
      status: status,
      statusDetails: this.getStatusDetails(status, gitStatus, fileStatus),
      businessContext: this.getBusinessContext(componentName, componentInfo)
    };
  }
  
  // 业务影响评估
  private calculateBusinessImpact(
    componentName: string, 
    componentInfo: any
  ): 'low' | 'medium' | 'high' | 'critical' {
    // CreateOrderButton特殊处理 - 直接影响营收
    if (componentName === 'CreateOrderButton') return 'critical';
    
    // 基于使用次数和风险等级计算
    const usageCount = componentInfo.usageCount;
    const riskLevel = componentInfo.riskLevel;
    
    if (usageCount > 20 && riskLevel === 'high') return 'high';
    if (usageCount > 10) return 'medium';
    return 'low';
  }
  
  // 更新基准
  async updateBaseline(componentName: string): Promise<void> {
    // 1. 备份当前基准
    await this.backupBaseline(componentName);
    
    // 2. 运行基准生成
    await this.runBaselineGeneration(componentName);
    
    // 3. 验证新基准
    await this.validateBaseline(componentName);
    
    // 4. 更新元数据
    await this.updateMetadata(componentName);
  }
}

// stores/baselineStore.ts  
interface BaselineState {
  baselines: BEEPBaselineData[];
  loading: boolean;
  selectedComponent: string | null;
  filterStatus: 'all' | 'healthy' | 'outdated' | 'corrupted';
  
  // 统计数据
  stats: {
    total: number;
    healthy: number;
    outdated: number;
    corrupted: number;
    healthPercentage: number;
    businessRisk: 'low' | 'medium' | 'high';
  };
}

const useBaselineStore = create<BaselineState>((set, get) => ({
  baselines: [],
  loading: false,
  selectedComponent: null,
  filterStatus: 'all',
  stats: {
    total: 0,
    healthy: 0,
    outdated: 0,
    corrupted: 0,
    healthPercentage: 0,
    businessRisk: 'low'
  },
  
  // 加载基准数据
  loadBaselines: async () => {
    set({ loading: true });
    try {
      const service = new BEEPBaselineService();
      const baselines = await service.getBaselines();
      const stats = calculateStats(baselines);
      
      set({ 
        baselines, 
        stats,
        loading: false 
      });
    } catch (error) {
      console.error('Failed to load baselines:', error);
      set({ loading: false });
    }
  },
  
  // 更新基准
  updateBaseline: async (componentName: string) => {
    const service = new BEEPBaselineService();
    await service.updateBaseline(componentName);
    
    // 重新加载数据
    await get().loadBaselines();
  }
}));
```

### 2. 基准文件结构
```
baselines/
├── Button/
│   ├── metadata.json              # 基准元数据
│   ├── snapshots/                 # 视觉快照 (15个文件)
│   │   ├── button-primary-normal.png
│   │   ├── button-primary-loading.png
│   │   └── ... (其他快照)
│   ├── performance/               # 性能基准
│   │   └── performance-data.json
│   ├── behavior/                  # 行为基准  
│   │   └── behavior-tests.json
│   └── history.json               # 变更历史
│
├── CreateOrderButton/
│   ├── metadata.json              # 包含业务上下文信息
│   ├── snapshots/                 # 支付场景快照 (8个文件)
│   │   ├── createorder-normal.png
│   │   ├── createorder-loading.png
│   │   ├── createorder-payment-success.png
│   │   └── ... (支付相关快照)
│   ├── performance/
│   │   └── performance-data.json  # 支付性能基准
│   ├── behavior/
│   │   └── payment-flows.json     # 支付流程测试
│   └── history.json
│
├── Modal/
└── Input/
```

### 3. 基准生成流程
```javascript
const baselineGenerationPlan = {
  // 基准生成步骤
  generationSteps: {
    1: {
      name: '环境准备',
      tasks: [
        '启动BEEP项目开发环境',
        '检查组件定义文件',
        '准备测试数据'
      ],
      duration: '1-2分钟'
    },
    
    2: {
      name: '快照生成',  
      tasks: [
        '渲染所有Props组合',
        '生成视觉快照',
        '对比历史快照(如果存在)'
      ],
      duration: '5-10分钟',
      details: {
        Button: '15个快照 (3type × 5state)',
        CreateOrderButton: '8个快照 (支付场景)',
        Modal: '6个快照 (不同尺寸)',
        Input: '12个快照 (4type × 3state)'
      }
    },
    
    3: {
      name: '性能基准',
      tasks: [
        '测量渲染时间',
        '测量内存使用',
        '测量交互延迟'
      ],
      duration: '2-3分钟'
    },
    
    4: {
      name: '行为测试',
      tasks: [
        '录制交互行为',
        '测试无障碍特性',
        '验证键盘导航'
      ],
      duration: '3-5分钟'
    },
    
    5: {
      name: '验证和保存',
      tasks: [
        '验证生成文件完整性',
        '更新元数据',
        '清理临时文件'
      ],
      duration: '1分钟'
    }
  },
  
  // 特殊处理
  specialHandling: {
    CreateOrderButton: {
      reason: '业务关键组件',
      extraSteps: [
        '生成支付场景专用快照',
        '测试支付流程性能',
        '验证错误处理行为'
      ],
      additionalTime: '+5分钟'
    }
  }
}
```

## 📅 实施时间表

### 第1周：基础架构
- **Day 1-2**: 设计数据模型和API接口
- **Day 3-4**: 实现BaselineService基础功能
- **Day 5**: 集成真实BEEP数据，测试数据获取

### 第2周：UI实现  
- **Day 1-2**: 实现Dashboard概览区域
- **Day 3-4**: 实现组件列表和详情面板
- **Day 5**: 实现状态更新和批量操作

### 第3周：基准生成
- **Day 1-2**: 实现基准文件生成逻辑
- **Day 3-4**: 集成视觉快照和性能测试
- **Day 5**: 实现自动更新机制

### 第4周：测试和优化
- **Day 1-2**: 端到端测试和bug修复
- **Day 3-4**: 性能优化和用户体验优化
- **Day 5**: 文档完善和发布准备

## 🎯 验收标准

### 功能验收
- [ ] 正确显示4个BEEP组件的真实使用数据
- [ ] 准确计算基准状态 (healthy/outdated/corrupted)
- [ ] CreateOrderButton高风险组件特殊标记
- [ ] 基于真实git commit的版本比较
- [ ] 批量更新和单个更新功能正常

### 性能验收  
- [ ] 页面加载时间 < 2秒
- [ ] 基准状态检查时间 < 5秒
- [ ] 基准更新时间 < 15分钟
- [ ] 支持10+组件并发检查

### 用户体验验收
- [ ] 管理层可快速了解发布风险
- [ ] 开发者可快速定位需要处理的组件
- [ ] 一键更新过时基准
- [ ] 清晰的业务影响说明

## 🚨 风险评估

### 技术风险
- **数据同步延迟**: git状态检查可能有延迟
- **文件系统权限**: 基准文件读写权限问题
- **性能影响**: 大量文件检查可能影响响应速度

### 业务风险
- **误报状态**: 错误的基准状态可能影响发布决策
- **更新失败**: 基准更新失败可能导致测试不准确
- **数据丢失**: 基准文件损坏可能丢失历史数据

### 缓解措施
- 实现多层缓存减少检查频率
- 增加文件备份机制
- 添加详细的错误日志和告警
- 实现回滚机制

---

*计划版本: v1.0*  
*制定日期: 2025-01-29*  
*预计完成: 2025-02-26*  
*负责团队: MDT开发组*