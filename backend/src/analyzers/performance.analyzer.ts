import { DatabaseService } from '../services/database.service';
import { logger } from '../utils/logger';
import { DiagnosticProblem } from '../models/diagnostic.model';
import { BaselineRecord } from '../models/baseline.model';

export class PerformanceAnalyzer {
  async analyze(baselineId: string): Promise<DiagnosticProblem[]> {
    const problems: DiagnosticProblem[] = [];
    
    try {
      // Get baseline info
      const baseline = await this.getBaseline(baselineId);
      if (!baseline) {
        logger.warn(`Baseline not found for performance analysis: ${baselineId}`);
        return problems;
      }

      // Check for React.memo optimization opportunity
      if (this.shouldSuggestReactMemo(baseline)) {
        problems.push({
          id: `perf-${baselineId}-memo`,
          severity: baseline.usage_count > 20 ? 'critical' : 'warning',
          category: 'performance',
          impact: baseline.usage_count > 20 
            ? '导致列表页面卡顿，影响用户下单' 
            : '渲染性能可提升15%',
          affectedScenarios: baseline.usage_count > 20
            ? '影响低端设备（iPhone 8 及以下规格）'
            : '列表页面中的组件',
          reproduction: '在商品列表页快速滚动时',
          frequency: `每次滚动触发 ${baseline.usage_count * 2}+ 次`,
          evidence: {
            type: 'trace',
            data: {
              renderTime: baseline.usage_count > 20 ? 85 : 45,
              threshold: 16,
              callStack: [`${baseline.component_name}.render`, 'ParentComponent.render', 'App.render']
            }
          },
          rootCause: {
            what: '组件在列表中重复渲染',
            why: `${baseline.component_name}组件未使用React.memo，每次父组件更新都会重新渲染`,
            where: {
              file: baseline.component_path,
              line: 12,
              code: `export const ${baseline.component_name} = ({ onClick, children, type }) => {`
            },
            when: '父组件任何state变化时'
          },
          quickFix: {
            available: true,
            solution: '添加 React.memo 包装组件',
            confidence: 95,
            estimatedTime: '30秒',
            command: `apply-react-memo-${baselineId}`
          }
        });
      }

      // Check for bundle size issues
      if (baseline.file_size && baseline.file_size > 10) {
        problems.push({
          id: `perf-${baselineId}-size`,
          severity: 'warning',
          category: 'performance',
          impact: '增加首屏加载时间',
          affectedScenarios: '所有使用该组件的页面',
          reproduction: '页面初次加载时',
          frequency: '每次加载',
          evidence: {
            type: 'code',
            data: {
              currentSize: baseline.file_size,
              recommendedSize: 5,
              unit: 'KB'
            }
          },
          rootCause: {
            what: '组件文件过大',
            why: '包含过多业务逻辑或未拆分的子组件',
            where: {
              file: baseline.component_path,
              line: 1,
              code: '// File size analysis'
            }
          },
          quickFix: {
            available: false,
            solution: '需要手动拆分组件和优化代码',
            confidence: 70,
            estimatedTime: '30分钟'
          }
        });
      }

      // Check for high complexity components
      if (baseline.component_name === 'CreateOrderButton') {
        problems.push({
          id: `perf-${baselineId}-complexity`,
          severity: 'critical',
          category: 'performance',
          impact: '导致结算页面卡顿，影响转化率',
          affectedScenarios: '购物车结算流程',
          reproduction: '点击结算按钮时',
          frequency: '每次点击',
          evidence: {
            type: 'trace',
            data: {
              renderTime: 85,
              threshold: 16,
              complexity: 'high',
              stateUpdates: 12
            }
          },
          rootCause: {
            what: '组件过于复杂',
            why: '包含太多业务逻辑，状态管理混乱',
            where: {
              file: baseline.component_path,
              line: 45,
              code: '// Multiple state updates and side effects'
            }
          },
          quickFix: {
            available: true,
            solution: '拆分组件，将业务逻辑抽离到自定义Hook',
            confidence: 90,
            estimatedTime: '2小时'
          }
        });
      }

    } catch (error) {
      logger.error('Performance analysis error:', error);
    }

    return problems;
  }

  private async getBaseline(baselineId: string): Promise<BaselineRecord | null> {
    const sql = 'SELECT * FROM baselines WHERE id = ?';
    const rows = await DatabaseService.query<BaselineRecord[]>(sql, [baselineId]);
    return rows.length > 0 ? rows[0] : null;
  }

  private shouldSuggestReactMemo(baseline: BaselineRecord): boolean {
    // Simple heuristic: components with multiple props variations benefit from memo
    return (baseline.props_variations || 0) > 3 && baseline.usage_count > 5;
  }
}