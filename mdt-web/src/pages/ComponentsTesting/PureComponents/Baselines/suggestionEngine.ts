import { BaselineInfo } from './index';
import { OperationSuggestions, ActionSuggestion, RiskAlert, QualityMetrics } from './types';

/**
 * 操作建议生成引擎
 * 根据基准状态、质量指标和业务规则生成具体的操作建议
 */
export class SuggestionEngine {
  
  /**
   * 生成操作建议
   */
  static generateSuggestions(
    baseline: BaselineInfo, 
    qualityMetrics: QualityMetrics
  ): OperationSuggestions {
    
    const statusBasedActions = this.generateStatusBasedActions(baseline);
    const qualityImprovements = this.generateQualityImprovements(qualityMetrics);
    const maintenanceRecommendations = this.generateMaintenanceRecommendations(baseline, qualityMetrics);
    const riskAlerts = this.generateRiskAlerts(baseline, qualityMetrics);

    return {
      statusBasedActions,
      qualityImprovements,
      maintenanceRecommendations,
      riskAlerts
    };
  }

  /**
   * 基于基准状态生成操作建议
   */
  private static generateStatusBasedActions(baseline: BaselineInfo) {
    switch (baseline.status) {
      case 'healthy':
        return {
          secondaryActions: [
            {
              id: 'monitor-performance',
              type: 'monitor' as const,
              priority: 'low' as const,
              title: '持续性能监控',
              description: '基准状态健康，建议保持现有监控频率',
              benefits: ['及时发现性能退化', '保证发布质量'],
              estimatedTime: '无需额外时间',
              steps: [
                '保持现有自动化监控',
                '关注性能指标趋势',
                '定期检查基准完整性'
              ]
            }
          ]
        };

      case 'outdated':
        return {
          primaryAction: {
            id: 'update-baseline',
            type: 'update' as const,
            priority: 'high' as const,
            title: '更新基准快照',
            description: '组件已更新但基准快照仍为旧版本，需要同步',
            benefits: [
              '确保基准反映最新组件状态',
              '避免误报质量问题',
              '提高测试准确性'
            ],
            estimatedTime: '10-15分钟',
            steps: [
              '备份当前基准数据',
              '运行基准更新流程',
              '验证新基准完整性',
              '更新基准版本记录'
            ],
            dependencies: ['develop分支稳定', '测试环境可用']
          },
          secondaryActions: [
            {
              id: 'compare-changes',
              type: 'test' as const,
              priority: 'medium' as const,
              title: '对比变更影响',
              description: '分析新旧基准差异，评估变更影响',
              benefits: ['了解具体变更内容', '评估潜在风险'],
              estimatedTime: '5分钟',
              steps: [
                '运行基准对比工具',
                '查看视觉差异报告',
                '分析性能变化趋势'
              ]
            }
          ]
        };

      case 'corrupted':
        const isDeleted = baseline.corruptionType === 'componentDeleted';
        
        if (isDeleted) {
          return {
            primaryAction: {
              id: 'cleanup-baseline',
              type: 'rebuild' as const,
              priority: 'medium' as const,
              title: '清理已删除组件基准',
              description: '组件已从代码库删除，清理相关基准数据',
              benefits: [
                '提高基准健康度统计准确性',
                '减少存储空间占用',
                '避免发布检查误报'
              ],
              estimatedTime: '2分钟',
              steps: [
                '确认组件确实已删除',
                '备份基准数据到归档',
                '清理基准存储',
                '更新统计信息'
              ]
            },
            secondaryActions: []
          };
        } else {
          return {
            primaryAction: {
              id: 'rebuild-baseline',
              type: 'rebuild' as const,
              priority: 'critical' as const,
              title: '重建损坏基准',
              description: '基准文件损坏，需要完全重新生成',
              benefits: [
                '恢复组件质量检测能力',
                '确保发布安全',
                '修复数据完整性'
              ],
              estimatedTime: '15-25分钟',
              steps: [
                '诊断损坏原因',
                '清理损坏的基准文件',
                '重新运行基准生成流程',
                '验证新基准完整性',
                '恢复监控和检查'
              ],
              dependencies: ['组件代码可用', '测试环境稳定']
            },
            secondaryActions: [
              {
                id: 'investigate-corruption',
                type: 'test' as const,
                priority: 'high' as const,
                title: '调查损坏原因',
                description: '分析基准损坏的根本原因，避免再次发生',
                benefits: ['预防类似问题', '改进基准可靠性'],
                estimatedTime: '10分钟',
                steps: [
                  '检查文件系统日志',
                  '分析最近的系统变更',
                  '验证存储完整性'
                ]
              }
            ]
          };
        }

      default:
        return { secondaryActions: [] };
    }
  }

  /**
   * 生成质量改进建议
   */
  private static generateQualityImprovements(qualityMetrics: QualityMetrics): ActionSuggestion[] {
    const suggestions: ActionSuggestion[] = [];

    // 性能优化建议
    if (qualityMetrics.performance.performanceScore < 80) {
      suggestions.push({
        id: 'improve-performance',
        type: 'optimize',
        priority: qualityMetrics.performance.performanceScore < 60 ? 'high' : 'medium',
        title: '优化组件性能',
        description: `当前性能评分${qualityMetrics.performance.performanceScore}分，建议优化`,
        benefits: ['提升用户体验', '减少资源消耗', '提高页面响应速度'],
        estimatedTime: '2-4小时',
        steps: [
          '分析性能瓶颈',
          '优化渲染逻辑',
          '减少不必要的重新渲染',
          '运行性能测试验证'
        ]
      });
    }

    // 测试覆盖率改进
    if (qualityMetrics.testCoverage.overallCoverage < 90) {
      suggestions.push({
        id: 'improve-test-coverage',
        type: 'test',
        priority: 'medium',
        title: '提高测试覆盖率',
        description: `当前覆盖率${qualityMetrics.testCoverage.overallCoverage}%，建议提升到90%以上`,
        benefits: ['提高代码质量', '减少bug风险', '增强重构信心'],
        estimatedTime: '3-6小时',
        steps: [
          '识别未覆盖的代码路径',
          '编写缺失的测试用例',
          '补充边界情况测试',
          '验证测试有效性'
        ]
      });
    }

    return suggestions;
  }

  /**
   * 生成维护建议
   */
  private static generateMaintenanceRecommendations(
    baseline: BaselineInfo, 
    qualityMetrics: QualityMetrics
  ): ActionSuggestion[] {
    const suggestions: ActionSuggestion[] = [];

    // 定期维护建议
    const daysSinceUpdate = this.calculateDaysSinceUpdate(baseline.lastUpdated);
    if (daysSinceUpdate > 30) {
      suggestions.push({
        id: 'regular-maintenance',
        type: 'test',
        priority: 'low',
        title: '定期基准检查',
        description: `基准已${daysSinceUpdate}天未更新，建议进行健康检查`,
        benefits: ['确保基准时效性', '预防潜在问题'],
        estimatedTime: '10分钟',
        steps: [
          '运行基准完整性检查',
          '验证测试环境配置',
          '检查存储空间使用',
          '更新基准元数据'
        ]
      });
    }

    return suggestions;
  }

  /**
   * 生成风险预警
   */
  private static generateRiskAlerts(
    baseline: BaselineInfo, 
    qualityMetrics: QualityMetrics
  ): RiskAlert[] {
    const alerts: RiskAlert[] = [];

    // 发布阻塞风险
    if (baseline.status === 'corrupted') {
      alerts.push({
        id: 'release-blocking-corruption',
        level: 'critical',
        category: 'release-blocking',
        message: '基准损坏可能阻塞发布',
        impact: '无法进行质量检测，存在发布有问题代码的风险',
        timeline: '立即处理',
        mitigation: '优先重建基准，在修复前避免发布包含此组件的版本'
      });
    }

    // 性能退化风险
    if (qualityMetrics.performance.performanceScore < 60) {
      alerts.push({
        id: 'performance-degradation',
        level: 'high',
        category: 'quality-degradation',
        message: '性能评分过低',
        impact: '可能影响用户体验，导致页面加载缓慢',
        timeline: '本次迭代内处理',
        mitigation: '分析性能瓶颈，优化关键渲染路径'
      });
    }

    // 测试覆盖率风险
    if (qualityMetrics.testCoverage.overallCoverage < 70) {
      alerts.push({
        id: 'low-test-coverage',
        level: 'medium',
        category: 'quality-degradation',
        message: '测试覆盖率不足',
        impact: '可能漏检潜在bug，增加发布风险',
        timeline: '下个迭代内改进',
        mitigation: '逐步补充测试用例，重点覆盖核心功能路径'
      });
    }

    return alerts;
  }

  /**
   * 计算距离上次更新的天数
   */
  private static calculateDaysSinceUpdate(lastUpdated: Date): number {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastUpdated.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}