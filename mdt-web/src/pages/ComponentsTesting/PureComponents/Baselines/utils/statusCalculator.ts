import dayjs from 'dayjs';
import { StatusDetail, VersionRecord, OptimizationOpportunity } from '../types';

// 基线信息接口（与主文件保持一致）
interface BaselineInfo {
  id: string;
  component: string;
  path: string;
  version: string;
  createdAt: Date;
  lastUpdated: Date;
  snapshotCount: number;
  propsVariations: number;
  status: 'healthy' | 'outdated' | 'corrupted';
  corruptionType?: 'fileCorrupted' | 'componentDeleted';
  branch: string;
  commit: string;
  size: number;
  usageCount: number;
  riskLevel: 'low' | 'high';
  businessImpact: string;
  criticalUsageScenarios: string[];
  
  // 扩展字段
  versionHistory?: VersionRecord[];
  codeAnalysis?: {
    hasReactMemo: boolean;
    complexity: number;
    hasStrictTypes: boolean;
  };
  cssAnalysis?: {
    duplicateRules: number;
    unusedClasses: number;
    gridInconsistencies: string[];
  };
  propsAnalysis?: {
    looseTypes: number;
    hasDefaultProps: boolean;
    propsCount: number;
  };
  performanceMetrics?: {
    renderTime: number;
    bundleSize: number;
    p95RenderTime: number;
  };
  accessibilityScore?: number;
  deletedAt?: string;
  corruptionDetails?: string;
  currentComponentCommit?: string;
  baselineCommit?: string;
}

/**
 * 计算智能状态的主函数
 */
export const calculateIntelligentStatus = (baseline: BaselineInfo): StatusDetail => {
  // 如果已经有智能状态（来自API），直接返回
  if ((baseline as any).intelligentStatus) {
    return (baseline as any).intelligentStatus;
  }

  // 获取版本历史（模拟数据或真实数据）
  const changeHistory = getVersionHistory(baseline);
  const last30Days = changeHistory.filter((v: VersionRecord) => 
    dayjs().diff(dayjs(v.timestamp), 'day') <= 30
  );
  
  // 1. 基本状态检查（优先级最高）
  if (baseline.status === 'corrupted') {
    if (baseline.corruptionType === 'componentDeleted') {
      return {
        type: 'deleted',
        label: '已删除',
        badgeStatus: 'default',
        hasDetail: true,
        detailTitle: '组件已移除',
        detailMessage: `组件于${baseline.deletedAt ? dayjs(baseline.deletedAt).format('YYYY-MM-DD') : '未知时间'}被删除，建议清理基准数据`
      };
    } else {
      return {
        type: 'corrupted',
        label: '损坏',
        badgeStatus: 'error',
        hasDetail: true,
        detailTitle: '基准文件损坏',
        detailMessage: baseline.corruptionDetails || '快照文件丢失，需要重新生成'
      };
    }
  }
  
  // 2. 不稳定状态 - 基于变更频率
  if (last30Days.length >= 10) {
    const avgDays = Math.round(30 / last30Days.length);
    return {
      type: 'unstable',
      label: '不稳定',
      badgeStatus: 'warning',
      hasDetail: true,
      detailTitle: '组件频繁变更',
      detailMessage: `最近30天修改${last30Days.length}次，平均${avgDays}天一次修改`
    };
  }
  
  // 3. 渐变中 - 小改动累积
  const minorChanges = last30Days.filter((v: VersionRecord) => 
    v.linesChanged.added < 10 && 
    v.linesChanged.deleted < 10 &&
    v.linesChanged.added + v.linesChanged.deleted > 0
  );
  
  if (minorChanges.length >= 5 && baseline.status === 'healthy') {
    const totalLines = minorChanges.reduce((sum, v) => 
      sum + v.linesChanged.added + v.linesChanged.deleted, 0
    );
    
    return {
      type: 'drifting',
      label: '渐变中',
      badgeStatus: 'processing',
      hasDetail: true,
      detailTitle: '细微变化累积',
      detailMessage: `累积${minorChanges.length}个小改动，总计修改${totalLines}行，建议更新基准`
    };
  }
  
  // 4. 可优化 - 基于代码分析
  const optimizationOpportunities = analyzeOptimization(baseline);
  if (optimizationOpportunities.length > 0) {
    const topOptimization = optimizationOpportunities[0];
    return {
      type: 'optimizable',
      label: '可优化',
      badgeStatus: 'processing',
      hasDetail: true,
      detailTitle: '发现优化机会',
      detailMessage: `${optimizationOpportunities.length}个优化建议：${topOptimization.title}`
    };
  }
  
  // 5. 过时状态
  if (baseline.status === 'outdated') {
    const daysSinceUpdate = dayjs().diff(dayjs(baseline.lastUpdated), 'day');
    const versionsBehind = calculateVersionsBehind(baseline);
    
    return {
      type: 'outdated',
      label: '过时',
      badgeStatus: 'warning',
      hasDetail: true,
      detailTitle: '基准需要更新',
      detailMessage: `组件已更新${daysSinceUpdate}天，当前版本与基准相差${versionsBehind}个版本`
    };
  }
  
  // 6. 健康状态
  const lastChange = changeHistory[0];
  const daysSinceLastChange = lastChange 
    ? dayjs().diff(dayjs(lastChange.timestamp), 'day')
    : 999;
  
  return {
    type: 'healthy',
    label: '健康',
    badgeStatus: 'success',
    hasDetail: daysSinceLastChange > 60,
    detailTitle: '组件稳定',
    detailMessage: daysSinceLastChange > 60 
      ? `已${daysSinceLastChange}天未修改，组件非常稳定`
      : undefined
  };
};

/**
 * 获取版本历史（模拟数据或真实数据）
 */
const getVersionHistory = (baseline: BaselineInfo): VersionRecord[] => {
  // 如果有真实的版本历史数据，直接使用
  if (baseline.versionHistory && baseline.versionHistory.length > 0) {
    return baseline.versionHistory;
  }

  // 否则生成模拟数据
  const mockHistory: VersionRecord[] = [];
  const baseDate = dayjs().subtract(60, 'day');
  
  // 根据组件特性生成不同的变更模式
  if (baseline.component === 'CreateOrderButton') {
    // 模拟频繁变更的组件
    for (let i = 0; i < 15; i++) {
      mockHistory.push({
        commit: `commit${i.toString().padStart(3, '0')}`,
        timestamp: baseDate.add(i * 2, 'day').toISOString(),
        author: 'Wendy Lin',
        message: i % 3 === 0 ? 'feat: 新增支付功能' : i % 3 === 1 ? 'fix: 修复按钮样式' : 'refactor: 优化代码结构',
        linesChanged: {
          added: Math.floor(Math.random() * 20) + 1,
          deleted: Math.floor(Math.random() * 15) + 1
        },
        type: i % 8 === 0 ? 'breaking' : i % 5 === 0 ? 'refactoring' : 'normal'
      });
    }
  } else if (baseline.component === 'Modal') {
    // 模拟有一些小改动的组件
    for (let i = 0; i < 8; i++) {
      mockHistory.push({
        commit: `modal${i.toString().padStart(3, '0')}`,
        timestamp: baseDate.add(i * 5, 'day').toISOString(),
        author: 'Wendy Lin',
        message: i % 4 === 0 ? 'style: 调整Modal样式' : 'fix: 修复小问题',
        linesChanged: {
          added: Math.floor(Math.random() * 8) + 1,
          deleted: Math.floor(Math.random() * 6) + 1
        },
        type: 'normal'
      });
    }
  } else {
    // 模拟稳定组件
    for (let i = 0; i < 3; i++) {
      mockHistory.push({
        commit: `stable${i.toString().padStart(3, '0')}`,
        timestamp: baseDate.add(i * 20, 'day').toISOString(),
        author: 'Wendy Lin',
        message: 'docs: 更新文档',
        linesChanged: {
          added: Math.floor(Math.random() * 5) + 1,
          deleted: Math.floor(Math.random() * 3) + 1
        },
        type: 'normal'
      });
    }
  }
  
  return mockHistory.sort((a, b) => dayjs(b.timestamp).valueOf() - dayjs(a.timestamp).valueOf());
};

/**
 * 分析优化机会
 */
const analyzeOptimization = (baseline: BaselineInfo): OptimizationOpportunity[] => {
  const opportunities: OptimizationOpportunity[] = [];
  
  // 1. 性能优化检查
  if (!baseline.codeAnalysis?.hasReactMemo && baseline.propsVariations > 3) {
    opportunities.push({
      type: 'performance',
      title: '添加React.memo减少重渲染',
      impact: 'high'
    });
  }
  
  if (baseline.performanceMetrics?.renderTime && baseline.performanceMetrics.renderTime > 50) {
    opportunities.push({
      type: 'performance',
      title: '组件渲染时间过长(>50ms)',
      impact: 'high'
    });
  }
  
  // 2. CSS优化检查
  if (baseline.cssAnalysis?.duplicateRules && baseline.cssAnalysis.duplicateRules > 3) {
    opportunities.push({
      type: 'css',
      title: `${baseline.cssAnalysis.duplicateRules}处CSS重复可合并`,
      impact: 'medium'
    });
  }
  
  if (baseline.cssAnalysis?.unusedClasses && baseline.cssAnalysis.unusedClasses > 0) {
    opportunities.push({
      type: 'css',
      title: `发现${baseline.cssAnalysis.unusedClasses}个未使用的CSS类`,
      impact: 'low'
    });
  }
  
  // 3. 类型安全检查
  if (baseline.propsAnalysis?.looseTypes && baseline.propsAnalysis.looseTypes > 0) {
    opportunities.push({
      type: 'type-safety',
      title: '建议使用更严格的类型定义',
      impact: 'medium'
    });
  }
  
  if (!baseline.propsAnalysis?.hasDefaultProps && baseline.propsVariations > 5) {
    opportunities.push({
      type: 'type-safety',
      title: '建议添加defaultProps',
      impact: 'medium'
    });
  }
  
  // 4. 可访问性检查
  if (baseline.accessibilityScore && baseline.accessibilityScore < 80) {
    opportunities.push({
      type: 'accessibility',
      title: '可访问性评分偏低，建议改进',
      impact: 'medium'
    });
  }
  
  // 按影响程度排序
  return opportunities.sort((a, b) => {
    const impactOrder = { high: 3, medium: 2, low: 1 };
    return impactOrder[b.impact] - impactOrder[a.impact];
  });
};

/**
 * 计算版本落后数
 */
const calculateVersionsBehind = (baseline: BaselineInfo): number => {
  const currentCommit = baseline.currentComponentCommit;
  const baselineCommit = baseline.baselineCommit;
  
  if (!currentCommit || !baselineCommit || !baseline.versionHistory) {
    return 0;
  }
  
  // 查找两个commit之间的版本数
  const versionsBetween = baseline.versionHistory.filter(v => {
    const vIndex = baseline.versionHistory!.findIndex(ver => ver.commit === v.commit);
    const baseIndex = baseline.versionHistory!.findIndex(ver => ver.commit === baselineCommit);
    const currentIndex = baseline.versionHistory!.findIndex(ver => ver.commit === currentCommit);
    
    return vIndex >= currentIndex && vIndex < baseIndex;
  });
  
  return versionsBetween.length;
};