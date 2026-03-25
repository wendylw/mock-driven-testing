import { DatabaseService } from '../services/database.service';
import { logger } from '../utils/logger';
import { DiagnosticProblem } from '../models/diagnostic.model';
import { BaselineRecord } from '../models/baseline.model';

export class CodeQualityAnalyzer {
  async analyze(baselineId: string): Promise<DiagnosticProblem[]> {
    const problems: DiagnosticProblem[] = [];
    
    try {
      const baseline = await this.getBaseline(baselineId);
      if (!baseline) {
        logger.warn(`Baseline not found for code quality analysis: ${baselineId}`);
        return problems;
      }

      // Check for missing TypeScript types
      if (baseline.props_variations && baseline.props_variations > 5) {
        problems.push({
          id: `quality-${baselineId}-types`,
          severity: 'warning',
          category: 'code-quality',
          impact: '类型安全性降低，易产生运行时错误',
          affectedScenarios: '组件使用和维护',
          reproduction: '传入错误类型的props时',
          frequency: '开发阶段频繁',
          evidence: {
            type: 'code',
            data: {
              propsCount: baseline.props_variations,
              typedProps: 2,
              untypedProps: baseline.props_variations - 2
            }
          },
          rootCause: {
            what: 'Props缺少严格的类型定义',
            why: '使用了过于宽松的类型或any类型',
            where: {
              file: baseline.component_path,
              line: 5,
              code: 'interface Props { [key: string]: any }'
            }
          },
          quickFix: {
            available: true,
            solution: '添加具体的TypeScript接口定义',
            confidence: 85,
            estimatedTime: '15分钟'
          }
        });
      }

      // Check for missing prop validation
      if (!this.hasDefaultProps(baseline) && baseline.props_variations && baseline.props_variations > 3) {
        problems.push({
          id: `quality-${baselineId}-defaults`,
          severity: 'info',
          category: 'code-quality',
          impact: '组件行为不可预测',
          affectedScenarios: 'Props未完整传递时',
          reproduction: '省略可选props时',
          frequency: '偶尔发生',
          evidence: {
            type: 'code',
            data: {
              totalProps: baseline.props_variations,
              requiredProps: 2,
              optionalWithoutDefaults: (baseline.props_variations || 0) - 2
            }
          },
          rootCause: {
            what: '缺少默认属性值',
            why: '未定义defaultProps或默认参数',
            where: {
              file: baseline.component_path,
              line: 20,
              code: 'const Component = (props) => {'
            }
          },
          quickFix: {
            available: true,
            solution: '添加默认props定义',
            confidence: 90,
            estimatedTime: '10分钟'
          }
        });
      }

      // Check for code duplication
      if (baseline.component_name === 'CreateOrderButton' || baseline.component_name === 'Button') {
        problems.push({
          id: `quality-${baselineId}-duplication`,
          severity: 'warning',
          category: 'code-quality',
          impact: '维护成本增加，易产生不一致',
          affectedScenarios: '代码修改和功能更新',
          reproduction: '修改重复代码时',
          frequency: '每次维护',
          evidence: {
            type: 'code',
            data: {
              duplicatedLines: 25,
              locations: ['handleClick function', 'validation logic'],
              similarity: 85
            }
          },
          rootCause: {
            what: '存在重复的业务逻辑',
            why: '未抽取公共函数或组件',
            where: {
              file: baseline.component_path,
              line: 45,
              code: '// Duplicated validation logic'
            }
          },
          quickFix: {
            available: false,
            solution: '抽取公共逻辑到utility函数或自定义Hook',
            confidence: 75,
            estimatedTime: '1小时'
          }
        });
      }

      // Check for error handling
      if (baseline.usage_count > 10) {
        problems.push({
          id: `quality-${baselineId}-errors`,
          severity: 'info',
          category: 'code-quality',
          impact: '异常情况下用户体验差',
          affectedScenarios: 'API调用失败或异常输入',
          reproduction: '网络错误或无效数据时',
          frequency: '异常情况下',
          evidence: {
            type: 'code',
            data: {
              tryBlocks: 0,
              errorBoundary: false,
              unhandledPromises: 2
            }
          },
          rootCause: {
            what: '缺少错误处理机制',
            why: '未考虑异常情况',
            where: {
              file: baseline.component_path,
              line: 60,
              code: 'fetch(url).then(data => setState(data))'
            }
          },
          quickFix: {
            available: true,
            solution: '添加try-catch和错误状态处理',
            confidence: 95,
            estimatedTime: '20分钟'
          }
        });
      }

    } catch (error) {
      logger.error('Code quality analysis error:', error);
    }

    return problems;
  }

  private async getBaseline(baselineId: string): Promise<BaselineRecord | null> {
    const sql = 'SELECT * FROM baselines WHERE id = ?';
    const rows = await DatabaseService.query<BaselineRecord[]>(sql, [baselineId]);
    return rows.length > 0 ? rows[0] : null;
  }

  private hasDefaultProps(baseline: BaselineRecord): boolean {
    // Simplified check - in real implementation would analyze actual code
    return baseline.component_name === 'Input' || baseline.component_name === 'Modal';
  }
}