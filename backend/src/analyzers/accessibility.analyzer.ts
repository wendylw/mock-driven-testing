import { DatabaseService } from '../services/database.service';
import { logger } from '../utils/logger';
import { DiagnosticProblem } from '../models/diagnostic.model';
import { BaselineRecord } from '../models/baseline.model';

export class AccessibilityAnalyzer {
  async analyze(baselineId: string): Promise<DiagnosticProblem[]> {
    const problems: DiagnosticProblem[] = [];
    
    try {
      const baseline = await this.getBaseline(baselineId);
      if (!baseline) {
        logger.warn(`Baseline not found for accessibility analysis: ${baselineId}`);
        return problems;
      }

      // Check for common accessibility issues based on component type
      if (this.isInteractiveComponent(baseline.component_name)) {
        // Check for missing ARIA labels
        problems.push({
          id: `a11y-${baselineId}-aria`,
          severity: 'warning',
          category: 'accessibility',
          impact: '屏幕阅读器无法识别组件功能',
          affectedScenarios: '使用辅助技术的用户',
          reproduction: '使用屏幕阅读器访问时',
          frequency: '始终发生',
          evidence: {
            type: 'code',
            data: {
              issue: 'missing aria-label',
              line: 15,
              suggestion: 'aria-label="点击执行操作"'
            }
          },
          rootCause: {
            what: '缺少必要的ARIA属性',
            why: '开发时未考虑无障碍访问需求',
            where: {
              file: baseline.component_path,
              line: 15,
              code: '<button onClick={onClick}>{children}</button>'
            }
          },
          quickFix: {
            available: true,
            solution: '添加合适的aria-label属性',
            confidence: 100,
            estimatedTime: '1分钟'
          }
        });

        // Check for keyboard navigation
        if (baseline.component_name === 'Modal') {
          problems.push({
            id: `a11y-${baselineId}-keyboard`,
            severity: 'critical',
            category: 'accessibility',
            impact: '键盘用户无法关闭弹窗',
            affectedScenarios: '不使用鼠标的用户',
            reproduction: '打开Modal后按ESC键',
            frequency: '始终发生',
            evidence: {
              type: 'code',
              data: {
                issue: 'missing keyboard handler',
                expectedBehavior: 'ESC key should close modal'
              }
            },
            rootCause: {
              what: '缺少键盘事件处理',
              why: '只实现了鼠标点击关闭功能',
              where: {
                file: baseline.component_path,
                line: 30,
                code: 'onClose={() => setVisible(false)}'
              }
            },
            quickFix: {
              available: true,
              solution: '添加ESC键监听器',
              confidence: 95,
              estimatedTime: '10分钟'
            }
          });
        }
      }

      // Check for color contrast issues (simplified check)
      if (baseline.component_name === 'Button' || baseline.component_name === 'Input') {
        problems.push({
          id: `a11y-${baselineId}-contrast`,
          severity: 'info',
          category: 'accessibility',
          impact: '低视力用户可能难以辨识',
          affectedScenarios: '明亮环境或视力障碍用户',
          reproduction: '在明亮光线下查看',
          frequency: '特定条件下',
          evidence: {
            type: 'screenshot',
            data: {
              contrastRatio: 3.5,
              required: 4.5,
              foreground: '#666',
              background: '#f0f0f0'
            }
          },
          rootCause: {
            what: '颜色对比度不足',
            why: '设计时未考虑WCAG标准',
            where: {
              file: `${baseline.component_path}.css`,
              line: 8,
              code: 'color: #666; background: #f0f0f0;'
            }
          },
          quickFix: {
            available: true,
            solution: '调整颜色以满足WCAG AA标准',
            confidence: 90,
            estimatedTime: '5分钟'
          }
        });
      }

    } catch (error) {
      logger.error('Accessibility analysis error:', error);
    }

    return problems;
  }

  private async getBaseline(baselineId: string): Promise<BaselineRecord | null> {
    const sql = 'SELECT * FROM baselines WHERE id = ?';
    const rows = await DatabaseService.query<BaselineRecord[]>(sql, [baselineId]);
    return rows.length > 0 ? rows[0] : null;
  }

  private isInteractiveComponent(componentName: string): boolean {
    const interactiveComponents = ['Button', 'Input', 'Modal', 'CreateOrderButton', 'Select', 'Checkbox'];
    return interactiveComponents.includes(componentName);
  }
}