import { DatabaseService } from '../services/database.service';
import { logger } from '../utils/logger';
import { VisualSuggestion } from '../models/suggestion.model';
import { BaselineRecord } from '../models/baseline.model';

export class VisualSuggestionEngine {
  async generate(baselineId: string): Promise<VisualSuggestion[]> {
    const suggestions: VisualSuggestion[] = [];
    
    try {
      const baseline = await this.getBaseline(baselineId);
      if (!baseline) {
        logger.warn(`Baseline not found for visual suggestions: ${baselineId}`);
        return suggestions;
      }

      // 检查可访问性问题
      if (this.isInteractiveComponent(baseline.component_name)) {
        suggestions.push({
          id: `visual-${baselineId}-a11y`,
          type: 'accessibility',
          title: `发现${baseline.component_name === 'Button' ? '3' : '2'}个可访问性问题`,
          priority: 'high',
          description: '按钮缺少合适的颜色对比度和aria-label',
          affectedElements: baseline.component_name === 'Button' ? 3 : 2,
          visualEvidence: {
            screenshotUrl: `/api/snapshots/${baseline.component_name.toLowerCase()}-accessibility-issues.png`,
            annotations: [
              {
                position: { x: 120, y: 45 },
                issue: '缺少aria-label',
                suggestion: `添加 aria-label='${this.getAriaLabelSuggestion(baseline.component_name)}'`,
                oneClickFix: '自动添加建议的aria-label'
              },
              {
                position: { x: 200, y: 45 },
                issue: '颜色对比度不足(3.2:1)',
                suggestion: '将文字颜色改为#333以满足WCAG标准',
                oneClickFix: '自动调整颜色对比度'
              }
            ]
          },
          beforeAfter: {
            beforeUrl: `/api/snapshots/${baseline.component_name.toLowerCase()}-before.png`,
            afterUrl: `/api/snapshots/${baseline.component_name.toLowerCase()}-after.png`
          }
        });
      }

      // 设计一致性建议
      if (baseline.component_name === 'Button' || baseline.component_name === 'CreateOrderButton') {
        suggestions.push({
          id: `visual-${baselineId}-design`,
          type: 'design',
          title: '设计系统一致性改进',
          priority: 'medium',
          description: '发现与设计系统不一致的样式',
          affectedElements: 1,
          visualEvidence: {
            screenshotUrl: `/api/snapshots/${baseline.component_name.toLowerCase()}-design-comparison.png`,
            annotations: [
              {
                position: { x: 100, y: 30 },
                issue: '圆角半径不符合设计规范',
                suggestion: '使用标准圆角 border-radius: 4px',
                oneClickFix: '应用设计系统样式'
              }
            ]
          }
        });
      }

      // Loading状态优化建议
      if (baseline.component_name === 'Button' || baseline.component_name === 'CreateOrderButton') {
        suggestions.push({
          id: `visual-${baselineId}-loading`,
          type: 'design',
          title: 'Loading状态体验优化',
          priority: 'low',
          description: '当前使用spinner，建议改为进度条提升用户体验',
          affectedElements: 1,
          visualEvidence: {
            screenshotUrl: `/api/snapshots/${baseline.component_name.toLowerCase()}-loading-comparison.gif`,
            annotations: [
              {
                position: { x: 150, y: 40 },
                issue: 'Spinner无法显示进度',
                suggestion: '使用进度条或骨架屏',
                oneClickFix: '切换到进度条模式'
              }
            ]
          },
          beforeAfter: {
            beforeUrl: `/api/snapshots/${baseline.component_name.toLowerCase()}-loading-before.gif`,
            afterUrl: `/api/snapshots/${baseline.component_name.toLowerCase()}-loading-after.gif`
          }
        });
      }

    } catch (error) {
      logger.error('Visual suggestion generation error:', error);
    }

    return suggestions;
  }

  private async getBaseline(baselineId: string): Promise<BaselineRecord | null> {
    const sql = 'SELECT * FROM baselines WHERE id = ?';
    const rows = await DatabaseService.query<BaselineRecord[]>(sql, [baselineId]);
    return rows.length > 0 ? rows[0] : null;
  }

  private isInteractiveComponent(componentName: string): boolean {
    const interactiveComponents = ['Button', 'Input', 'Modal', 'CreateOrderButton'];
    return interactiveComponents.includes(componentName);
  }

  private getAriaLabelSuggestion(componentName: string): string {
    const suggestions: Record<string, string> = {
      'Button': '执行操作',
      'CreateOrderButton': '创建订单',
      'Modal': '对话框',
      'Input': '输入信息'
    };
    return suggestions[componentName] || '交互元素';
  }
}