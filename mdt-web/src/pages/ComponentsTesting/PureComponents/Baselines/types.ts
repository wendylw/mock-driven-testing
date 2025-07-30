// 基准详情数据类型定义

// ========== 智能状态相关类型定义 ==========

// 基线状态类型定义
export type BaselineStatus = 
  | 'healthy'      // 健康：一切正常
  | 'outdated'     // 过时：组件已更新但基准未更新
  | 'corrupted'    // 损坏：文件缺失或损坏
  | 'deleted'      // 已删除：组件不存在  
  | 'unstable'     // 不稳定：频繁变更
  | 'drifting'     // 渐变中：小改动累积
  | 'optimizable'  // 可优化：发现改进空间

// 状态详情接口
export interface StatusDetail {
  type: BaselineStatus;
  label: string;
  badgeStatus: 'success' | 'warning' | 'error' | 'default' | 'processing';
  hasDetail: boolean;
  detailTitle?: string;
  detailMessage?: string;
}

// 版本记录接口
export interface VersionRecord {
  commit: string;
  timestamp: string;
  author: string;
  message: string;
  linesChanged: {
    added: number;
    deleted: number;
  };
  type: 'normal' | 'breaking' | 'refactoring';
}

// 优化机会接口
export interface OptimizationOpportunity {
  type: 'performance' | 'css' | 'type-safety' | 'accessibility';
  title: string;
  impact: 'high' | 'medium' | 'low';
}

// ========== 原有类型定义 ==========

export interface QualityMetrics {
  // 渲染性能数据
  performance: {
    averageRenderTime: number; // 平均渲染时间(ms)
    memorySizeProfile: number; // 内存占用(KB)
    bundleSize: number; // 打包后大小(KB)
    renderComplexity: 'low' | 'medium' | 'high'; // 渲染复杂度
    performanceScore: number; // 性能评分(0-100)
    benchmarks: {
      firstPaint: number; // 首次绘制时间(ms)
      firstContentfulPaint: number; // 首次内容绘制(ms)
      largestContentfulPaint: number; // 最大内容绘制(ms)
    };
  };

  // 测试覆盖率
  testCoverage: {
    snapshotCoverage: number; // 快照覆盖率(%)
    propsCoverage: number; // Props覆盖率(%)
    stateCoverage: number; // 状态覆盖率(%)
    interactionCoverage: number; // 交互覆盖率(%)
    overallCoverage: number; // 总体覆盖率(%)
    missingTests: string[]; // 缺失的测试用例
  };

  // 已知问题和风险点
  knownIssues: {
    criticalIssues: Issue[];
    warnings: Issue[];
    suggestions: Issue[];
  };

  // 基准质量评估
  qualityAssessment: {
    stability: 'excellent' | 'good' | 'fair' | 'poor'; // 稳定性
    maintainability: 'excellent' | 'good' | 'fair' | 'poor'; // 可维护性
    testability: 'excellent' | 'good' | 'fair' | 'poor'; // 可测试性
    overallGrade: 'A' | 'B' | 'C' | 'D' | 'F'; // 综合评级
  };
}

export interface Issue {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: 'performance' | 'accessibility' | 'compatibility' | 'security' | 'maintainability';
  title: string;
  description: string;
  impact: string;
  recommendation: string;
  estimatedFixTime: string; // 预计修复时间
}

// 操作建议数据结构
export interface OperationSuggestions {
  // 基于状态的建议
  statusBasedActions: {
    primaryAction?: ActionSuggestion;
    secondaryActions: ActionSuggestion[];
  };

  // 质量改进建议
  qualityImprovements: ActionSuggestion[];

  // 维护建议
  maintenanceRecommendations: ActionSuggestion[];

  // 风险预警
  riskAlerts: RiskAlert[];
}

export interface ActionSuggestion {
  id: string;
  type: 'update' | 'rebuild' | 'optimize' | 'test' | 'refactor' | 'monitor';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  benefits: string[];
  estimatedTime: string;
  steps: string[];
  dependencies?: string[];
}

export interface RiskAlert {
  id: string;
  level: 'critical' | 'high' | 'medium' | 'low';
  category: 'release-blocking' | 'quality-degradation' | 'maintenance-overhead' | 'security';
  message: string;
  impact: string;
  timeline: string; // 风险时间线
  mitigation: string; // 缓解措施
}

// 基准详情完整数据结构
export interface BaselineDetails {
  baselineInfo: {
    id: string;
    component: string;
    status: 'healthy' | 'outdated' | 'corrupted';
    lastCheck: string;
  };
  qualityMetrics: QualityMetrics;
  operationSuggestions: OperationSuggestions;
  metadata: {
    dataVersion: string;
    generatedAt: string;
    expiresAt: string;
  };
}