# Pure Component 智能分析 - 精简版API设计

## 设计原则
1. **简单实用** - 每个接口都有明确的用途
2. **减少调用** - 一个页面一次调用即可获得所需数据
3. **渐进实现** - 先实现核心功能，后续逐步扩展

## 1. 核心接口设计

### 1.1 基准状态接口（列表页）
```
GET /api/baselines/{baselineId}/status

用途：基准列表页的状态显示，轻量级快速返回

Response:
{
  "success": true,
  "data": {
    "baselineId": "baseline-button-001",
    "component": "Button",
    "status": "optimizable", // healthy | outdated | corrupted | deleted | unstable | drifting | optimizable
    "statusLabel": "可优化",
    "statusDetail": {
      "hasDetail": true,
      "title": "发现3个优化机会",
      "message": "添加React.memo可减少70%重渲染"
    },
    "metrics": {
      "usageCount": 8,          // 被引用次数
      "lastUpdated": "2025-01-30T10:30:00Z",
      "snapshotCount": 12,
      "size": 2.3               // KB
    }
  }
}
```

### 1.2 问题诊断接口（问题诊断标签页）
```
GET /api/baselines/{baselineId}/diagnostic

用途：详情Modal的"问题诊断"标签页数据

Response:
{
  "success": true,
  "data": {
    "summary": {
      "criticalCount": 1,
      "warningCount": 2,
      "infoCount": 1,
      "fixableCount": 3
    },
    "problems": [
      {
        "id": "problem-001",
        "severity": "critical",    // critical | warning | info
        "category": "performance", // performance | accessibility | compatibility | security | ux
        "impact": "导致列表页面卡顿，影响用户下单",
        "affectedScenarios": "影响低端设备（iPhone 8 及以下规格）",
        "reproduction": "在商品列表页快速滚动时",
        "frequency": "每次滚动触发 50+ 次",
        
        // 问题证据
        "evidence": {
          "type": "trace",         // trace | code | screenshot | video
          "data": {
            "renderTime": 45,
            "threshold": 16,
            "callStack": ["Button.render", "ProductList.render", "App.render"]
          }
        },
        
        // 根因分析
        "rootCause": {
          "what": "组件在列表中重复渲染",
          "why": "Button组件未使用React.memo，每次父组件更新都会重新渲染",
          "where": {
            "file": "src/components/Button/index.tsx",
            "line": 12,
            "code": "export const Button = ({ onClick, children, type }) => {"
          },
          "when": "父组件任何state变化时"
        },
        
        // 快速修复（如果有）
        "quickFix": {
          "available": true,
          "solution": "添加 React.memo 包装组件",
          "confidence": 95,
          "estimatedTime": "30秒"
        }
      }
    ]
  }
}
```

### 1.3 智能建议接口（智能建议标签页）
```
GET /api/baselines/{baselineId}/suggestions

用途：详情Modal的"智能建议"标签页数据

Response:
{
  "success": true,
  "data": {
    // 1. 可视化智能建议
    "visualSuggestions": [
      {
        "id": "visual-001",
        "type": "accessibility",
        "title": "发现3个可访问性问题",
        "priority": "high",
        "description": "按钮缺少合适的颜色对比度和aria-label",
        "affectedElements": 3,
        "visualEvidence": {
          "screenshotUrl": "/api/snapshots/button-accessibility-issues.png",
          "annotations": [
            {
              "position": { "x": 120, "y": 45 },
              "issue": "缺少aria-label",
              "suggestion": "添加 aria-label='保存用户资料'",
              "oneClickFix": "自动添加建议的aria-label"
            }
          ]
        },
        "beforeAfter": {
          "beforeUrl": "/api/snapshots/button-before.png",
          "afterUrl": "/api/snapshots/button-after.png"
        }
      }
    ],
    
    // 2. 可执行代码建议
    "codeSuggestions": [
      {
        "id": "code-001",
        "issue": "Button组件重复渲染",
        "impact": "性能降低15%",
        "reasoning": "当前组件在父组件重渲染时会无条件重渲染",
        "benefits": ["渲染性能提升15%", "重渲染次数减少60%", "降低CPU使用率"],
        "codeDiff": {
          "title": "添加React.memo优化",
          "current": "export const Button = ({type, children, onClick}) => {",
          "suggested": "export const Button = React.memo(({type, children, onClick}) => {",
          "filePath": "src/components/Button/index.tsx",
          "lineNumber": 12
        },
        "autoFix": {
          "available": true,
          "confidence": 95,
          "estimatedTime": "30秒",
          "command": "apply-suggestion-code-001"
        }
      }
    ],
    
    // 3. 交互式建议对话（初始状态）
    "interactiveSuggestions": {
      "currentTopic": "loading状态优化",
      "initialMessage": "检测到Button组件的loading状态可能有更好的用户体验方案",
      "options": [
        {
          "id": "show-suggestion",
          "text": "显示具体建议",
          "action": "show_detailed_suggestion"
        },
        {
          "id": "show-best-practices",
          "text": "查看其他项目的最佳实践",
          "action": "show_best_practices"
        },
        {
          "id": "auto-optimize",
          "text": "自动优化并预览效果",
          "action": "auto_optimize"
        }
      ]
    },
    
    // 4. 渐进式学习数据
    "progressiveLearning": {
      "patterns": [
        {
          "id": "pattern-001",
          "type": "code_style",
          "title": "你偏好使用React.memo进行性能优化",
          "description": "基于过去6次选择，你总是接受React.memo的建议",
          "confidence": 95,
          "examples": 6,
          "lastSeen": "2小时前"
        }
      ],
      "personalizedSuggestions": [
        {
          "id": "personal-001",
          "title": "为Button组件添加loading状态的进度条",
          "reason": "基于你过去对用户体验细节的关注",
          "basedOnPattern": "你在类似组件中总是优化loading体验",
          "confidence": 88,
          "learnedFrom": {
            "similarComponents": ["InputButton", "SubmitButton"],
            "teamPreferences": ["使用Ant Design Progress"],
            "historicalChoices": ["选择进度条而非spinner"]
          }
        }
      ],
      "teamInsights": [
        {
          "pattern": "团队开始更多使用CSS-in-JS",
          "adoption": 65,
          "trend": "increasing",
          "recommendation": "考虑在此组件中使用styled-components"
        }
      ]
    }
  }
}
```

### 1.4 触发分析接口
```
POST /api/baselines/{baselineId}/analyze

用途：手动触发重新分析

Request:
{
  "analysisTypes": ["status", "diagnostic", "suggestions"], // 可选，默认全部
  "priority": "normal"  // high | normal | low
}

Response:
{
  "success": true,
  "data": {
    "analysisId": "analysis-123",
    "status": "processing", // queued | processing | completed | failed
    "estimatedTime": "30秒",
    "progress": 0
  }
}
```

### 1.5 分析进度查询（可选）
```
GET /api/analysis/{analysisId}/progress

用途：查询分析进度（用于长时间分析）

Response:
{
  "success": true,
  "data": {
    "analysisId": "analysis-123",
    "status": "processing",
    "progress": 60,
    "currentStep": "分析代码结构",
    "completedSteps": ["收集文件", "解析AST"],
    "remainingSteps": ["视觉对比", "生成建议"]
  }
}
```

## 2. 交互式建议的会话接口（扩展）

### 2.1 发送交互选择
```
POST /api/baselines/{baselineId}/suggestions/interact

用途：处理用户在交互式建议中的选择

Request:
{
  "sessionId": "session-001",
  "action": "show_detailed_suggestion",
  "context": {
    "previousOptions": ["show-suggestion"],
    "currentTopic": "loading状态优化"
  }
}

Response:
{
  "success": true,
  "data": {
    "nextMessage": "基于用户体验研究，建议loading状态显示进度而不是spinner",
    "visualDemo": "/api/demos/loading-comparison.gif",
    "implementationOptions": [
      {
        "title": "快速修复：使用内置进度组件",
        "effort": "5分钟",
        "impact": "用户体验提升20%"
      }
    ],
    "nextOptions": [
      {
        "id": "apply-quick-fix",
        "text": "应用快速修复",
        "action": "apply_quick_fix"
      },
      {
        "id": "see-more",
        "text": "查看更多选项",
        "action": "show_more_options"
      }
    ]
  }
}
```

## 3. 数据模型定义

### 3.1 通用数据类型
```typescript
// 严重程度
type Severity = 'critical' | 'warning' | 'info';

// 问题类别
type ProblemCategory = 'performance' | 'accessibility' | 'compatibility' | 'security' | 'ux';

// 组件状态
type ComponentStatus = 'healthy' | 'outdated' | 'corrupted' | 'deleted' | 'unstable' | 'drifting' | 'optimizable';

// 证据类型
type EvidenceType = 'trace' | 'code' | 'screenshot' | 'video';

// 学习模式类型
type PatternType = 'code_style' | 'component_preference' | 'workflow_pattern' | 'team_standard';
```

### 3.2 错误响应格式
```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: string;
    suggestions?: string[];
  };
}

// 错误码
const ERROR_CODES = {
  BASELINE_NOT_FOUND: '基准不存在',
  ANALYSIS_FAILED: '分析失败',
  INVALID_REQUEST: '请求参数无效',
  RATE_LIMITED: '请求过于频繁',
  INTERNAL_ERROR: '内部服务错误'
};
```

## 4. 实施计划

### Phase 1：核心功能（第1-2周）
- [ ] 实现 `/status` 接口 - 支持列表页
- [ ] 实现 `/diagnostic` 接口 - 支持问题诊断
- [ ] 实现基础的 `/analyze` 接口

### Phase 2：智能建议（第3-4周）
- [ ] 实现 `/suggestions` 接口的基础功能
- [ ] 添加可视化建议和代码建议
- [ ] 实现简单的模式识别

### Phase 3：交互式功能（第5-6周）
- [ ] 实现交互式建议对话
- [ ] 添加渐进式学习功能
- [ ] 实现 `/interact` 接口

### Phase 4：优化和扩展（第7-8周）
- [ ] 性能优化
- [ ] 添加缓存机制
- [ ] 完善错误处理

## 5. 前后端集成示例

```javascript
// 前端调用示例
class BaselineService {
  // 获取列表页数据
  async getBaselineStatus(baselineId) {
    const response = await fetch(`/api/baselines/${baselineId}/status`);
    return response.json();
  }
  
  // 获取诊断数据
  async getDiagnostic(baselineId) {
    const response = await fetch(`/api/baselines/${baselineId}/diagnostic`);
    return response.json();
  }
  
  // 获取建议数据
  async getSuggestions(baselineId) {
    const response = await fetch(`/api/baselines/${baselineId}/suggestions`);
    return response.json();
  }
  
  // 触发分析
  async triggerAnalysis(baselineId) {
    const response = await fetch(`/api/baselines/${baselineId}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priority: 'normal' })
    });
    return response.json();
  }
}
```

## 6. 性能考虑

1. **缓存策略**
   - status接口：缓存5分钟
   - diagnostic/suggestions：缓存30分钟
   - 分析触发后自动清除相关缓存

2. **数据量控制**
   - 问题列表限制最多20个
   - 建议列表限制最多10个
   - 截图使用CDN和懒加载

3. **并发控制**
   - 同一基准同时只能有一个分析任务
   - 全局并发分析任务不超过10个

## 7. 安全考虑

1. **认证授权**
   - 所有接口需要Bearer Token认证
   - 基于项目权限控制访问

2. **输入验证**
   - 严格验证baselineId格式
   - 限制分析类型的有效值
   - XSS防护

3. **速率限制**
   - 每用户每分钟最多10次分析请求
   - 每用户每小时最多100次查询请求

这个精简版的API设计更加实用，减少了接口数量，每个接口都有明确的用途，便于前后端开发和维护。