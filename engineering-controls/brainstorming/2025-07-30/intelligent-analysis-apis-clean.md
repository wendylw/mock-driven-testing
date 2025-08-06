# Pure Component 智能分析 - 后端接口设计（基于原设计优化）

## 1. 静态代码分析服务（原设计优化）

### 1.1 组件分析接口
```
POST /api/components/{componentId}/analyze
{
  // 输入
  componentPath: "src/common/components/Button",
  version: "68bb4f5",
  baselineVersion: "36b5fbfa"
}

// 优化后的返回结构
{
  "success": true,
  "data": {
    // 智能状态判定（新增）
    "intelligentStatus": {
      "type": "optimizable", // healthy | outdated | corrupted | deleted | unstable | drifting | optimizable
      "label": "可优化",
      "hasDetail": true,
      "detailTitle": "发现优化机会", 
      "detailMessage": "3个优化建议：添加React.memo减少重渲染"
    },
    
    // 原有的代码分析结果
    "codeAnalysis": {
      "props": {
        "added": [],
        "removed": [],
        "modified": [{
          "name": "type",
          "from": "string", 
          "to": "string",
          "suggestion": "可以限定为 'primary' | 'secondary' | 'text'",
          "quickFix": {
            "file": "Button/index.jsx",
            "line": 12,
            "code": "type: 'primary' | 'secondary' | 'text'"
          }
        }]
      },
      "cssAnalysis": {
        "duplicateRules": 3,
        "unusedClasses": 2,
        "gridInconsistencies": ["padding不符合8px网格"],
        "optimizationSuggestions": [
          {
            "type": "duplicate-removal",
            "description": "3处CSS重复可合并",
            "impact": "减少8.7%体积",
            "quickFix": {
              "file": "Button.module.scss",
              "description": "提取公共样式到.button-base"
            }
          }
        ]
      },
      
      // 新增：性能分析
      "performanceAnalysis": {
        "hasReactMemo": false,
        "renderTimeMs": 67,
        "bundleSizeKB": 2.3,
        "suggestions": [
          {
            "type": "performance",
            "title": "添加React.memo减少重渲染", 
            "impact": "预计减少70%的重渲染",
            "effort": "5分钟"
          }
        ]
      }
    }
  }
}
```

## 2. 视觉对比分析服务（原设计优化）

### 2.1 视觉差异分析接口
```
POST /api/components/{componentId}/visual-diff
{
  baselineId: "baseline-button-001",
  currentVersion: "68bb4f5", 
  propsVariations: ["primary-default", "secondary-small"]
}

// 优化后的返回结构 - 支持详情Modal展示
{
  "success": true,
  "data": {
    "visualDiff": {
      "overallSimilarity": 0.92,
      "annotatedScreenshots": {
        "primary-default": {
          "url": "/snapshots/diff/button-primary-annotated.png",
          "baselineUrl": "/snapshots/baseline/button-primary.png",
          "currentUrl": "/snapshots/current/button-primary.png",
          "issues": [{
            "type": "spacing",
            "severity": "minor", // minor | major | critical
            "location": {x: 20, y: 10, width: 100, height: 40},
            "description": "padding增加了2px",
            "suggestion": "确认是否为预期的设计更新",
            "quickFix": {
              "file": "Button.module.scss",
              "line": 25,
              "code": ".button-primary { padding: 12px 20px; }"
            }
          }]
        }
      }
    },
    
    // 新增：实时问题检测（支持详情Modal的问题检测区域）
    "realTimeIssues": [
      {
        "severity": "warning",
        "title": "Button在small尺寸下文字可读性降低",
        "evidence": {
          "type": "screenshot",
          "url": "/analysis/button-small-readability.png",
          "annotations": [{ "x": 10, "y": 20, "width": 100, "height": 30 }]
        },
        "solution": "调整font-size从12px到14px",
        "quickFix": {
          "file": "Button.module.scss",
          "line": 45,
          "code": ".button-small { font-size: 14px; }",
          "expectedResult": "提高可读性，符合WCAG标准"
        }
      }
    ]
  }
}
```

## 3. 智能建议生成服务（原设计优化）

### 3.1 获取优化建议
```
GET /api/components/{componentId}/suggestions
{
  analysisId: "analysis-123", // 基于前面的分析结果
  suggestionTypes: ["performance", "a11y", "consistency"]
}

// 优化后的返回结构 - 支持详情Modal的建议展示
{
  "success": true,
  "data": {
    // 原有的建议结构，增加详细信息
    "suggestions": [
      {
        "id": "sug-001",
        "type": "performance",
        "severity": "medium",
        "impact": "high", // high | medium | low
        "effort": "5分钟",
        "title": "添加React.memo减少重渲染",
        "description": "当前组件在父组件重渲染时会无条件重渲染",
        "location": {
          "file": "Button/index.jsx",
          "line": 23,
          "column": 5
        },
        "currentCode": "export const Button = (props) => {",
        "suggestedCode": "export const Button = React.memo((props) => {",
        "reasoning": "使用React.memo可以避免props未变化时的重渲染，特别适合此组件因为props相对稳定",
        "benefits": [
          "减少70%的不必要重渲染",
          "提升页面整体性能", 
          "降低CPU使用率"
        ],
        "relatedDocs": [
          {
            "title": "React.memo官方文档",
            "url": "https://react.dev/reference/react/memo"
          }
        ]
      }
    ],
    
    // 新增：变更影响预测（支持详情Modal的影响预测区域）
    "impactPreview": {
      "current": {
        "bundleSize": "2.3KB",
        "renderTime": 67,
        "typesSafety": "partial",
        "accessibilityScore": 75
      },
      "optimized": {
        "bundleSize": "2.1KB", 
        "bundleSizeImprovement": "8.7%",
        "renderTime": 23,
        "renderingImprovement": "70%",
        "typesSafety": "complete",
        "accessibilityScore": 88,
        "accessibilityImprovement": 13
      },
      "risks": [
        "React.memo可能在某些边界情况下影响组件更新",
        "类型变更可能需要更新使用此组件的代码"
      ]
    }
  }
}
```

## 4. 批量分析和趋势服务（原设计优化）

### 4.1 组件历史趋势分析
```
GET /api/components/{componentId}/trends
{
  metrics: ["complexity", "performance", "coverage"],
  timeRange: "last-30-days"
}

// 优化后的返回结构 - 支持详情Modal的健康仪表盘
{
  "success": true,
  "data": {
    // 健康指标趋势（支持详情Modal仪表盘）
    "healthMetrics": {
      "visual": {
        "current": 92,
        "trend": 0, // -1下降, 0稳定, 1上升
        "history": [88, 90, 91, 92] // 最近4周数据
      },
      "props": {
        "current": 85,
        "issues": ["type未限定", "缺少defaultProps"],
        "improvements": ["新增size类型定义"]
      },
      "performance": {
        "current": 78,
        "renderTime": 67,
        "bundleSize": 2.3,
        "benchmark": "渲染时间: 23ms"
      },
      "quality": {
        "current": 88,
        "badges": [
          { "text": "无重复CSS", "color": "green" },
          { "text": "类型安全", "color": "blue" }
        ]
      }
    },
    
    // 变更频率分析（支持智能状态判定）
    "changeFrequency": {
      "last30Days": 12,
      "averageDaysBetweenChanges": 2.5,
      "minorChanges": 6,
      "majorChanges": 2,
      "changePattern": "unstable" // stable | drifting | unstable
    }
  }
}
```

## 5. 简化的实用接口设计

### 5.1 快速健康检查（用于列表页状态显示）
```
GET /api/baselines/{baselineId}/quick-health

// 轻量级返回，仅用于列表页状态显示
{
  "success": true,
  "data": {
    "intelligentStatus": {
      "type": "optimizable",
      "label": "可优化", 
      "hasDetail": true,
      "detailTitle": "发现优化机会",
      "detailMessage": "3个优化建议：添加React.memo减少重渲染"
    },
    "lastAnalyzedAt": "2025-01-30T10:30:00Z"
  }
}
```

### 5.2 完整详情数据（用于详情Modal）
```
GET /api/baselines/{baselineId}/full-analysis

// 包含所有详情Modal需要的数据
{
  "success": true,
  "data": {
    // 健康仪表盘数据
    "healthMetrics": { /* 来自trends接口 */ },
    
    // 实时问题检测数据  
    "realTimeIssues": [ /* 来自visual-diff接口 */ ],
    
    // 优化建议数据
    "optimizationSuggestions": [ /* 来自suggestions接口 */ ],
    
    // 影响预测数据
    "impactPreview": { /* 来自suggestions接口 */ },
    
    // 版本历史数据（保持现有）
    "versionHistory": [ /* 现有数据结构 */ ]
  }
}
```

## 6. 基于原设计的数据流优化

### 6.1 前后端交互流程
```javascript
// 1. 列表页加载 - 使用快速健康检查
页面加载 -> GET /api/baselines/{id}/quick-health -> 显示智能状态

// 2. 详情Modal打开 - 使用完整分析数据
点击查看详情 -> GET /api/baselines/{id}/full-analysis -> 展示完整分析结果

// 3. 手动触发分析 - 使用原有的分析接口  
点击"重新分析" -> POST /api/components/{id}/analyze -> 更新分析结果

// 4. 用户交互 - 记录反馈
复制建议代码 -> POST /api/suggestions/{id}/feedback -> 优化建议算法
```

### 6.2 实施优先级（基于原设计）
```
第1周：优化原有的analyze接口，增加intelligentStatus返回
第2周：扩展visual-diff接口，增加realTimeIssues数据  
第3周：增强suggestions接口，增加详细的benefits和reasoning
第4周：实现quick-health和full-analysis简化接口
第5周：集成到前端，实现状态列和详情Modal
```

## 总结

这套接口设计基于你原有的4个核心API，通过以下方式优化：

1. **保持原有结构**：不破坏现有的analyze、visual-diff、suggestions、trends接口
2. **增加智能判断**：在返回数据中增加intelligentStatus，支持新的状态系统
3. **丰富展示数据**：增加quickFix、reasoning、benefits等详细信息，支持详情Modal展示
4. **简化调用**：提供quick-health和full-analysis两个简化接口，减少前端调用复杂度
5. **渐进实施**：可以逐步优化现有接口，不需要重新设计整套系统