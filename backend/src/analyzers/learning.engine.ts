import { DatabaseService } from '../services/database.service';
import { logger } from '../utils/logger';
import { ProgressiveLearning } from '../models/suggestion.model';

export class LearningEngine {
  async getLearningData(baselineId: string): Promise<ProgressiveLearning> {
    const userId = await this.getCurrentUserId();
    
    // 获取用户行为模式
    const patterns = await this.getUserPatterns(userId);
    
    // 生成个性化建议
    const personalizedSuggestions = await this.generatePersonalizedSuggestions(
      baselineId, 
      patterns
    );
    
    // 获取团队洞察
    const teamInsights = await this.getTeamInsights();
    
    return {
      patterns,
      personalizedSuggestions,
      teamInsights
    };
  }

  async recordUserChoice(userId: string, choice: any) {
    // 记录用户选择，用于学习
    const id = `pattern-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    await DatabaseService.query(
      `INSERT INTO learning_patterns (id, user_id, pattern_type, pattern_data, confidence) 
       VALUES (?, ?, ?, ?, ?)`,
      [id, userId, 'choice', JSON.stringify(choice), 80]
    );
    
    // 更新模式置信度
    await this.updatePatternConfidence(userId, choice.type);
  }

  private async getCurrentUserId(): Promise<string> {
    // 在实际应用中，这应该从认证上下文获取
    return 'user-001';
  }

  private async getUserPatterns(userId: string): Promise<any[]> {
    const sql = `
      SELECT * FROM learning_patterns 
      WHERE user_id = ? 
      ORDER BY confidence DESC, updated_at DESC 
      LIMIT 10
    `;
    
    const rows = await DatabaseService.query<any[]>(sql, [userId]);
    
    return rows.map(row => ({
      id: row.id,
      type: row.pattern_type,
      title: this.getPatternTitle(row.pattern_type, row.pattern_data),
      description: this.getPatternDescription(row.pattern_type, row.pattern_data),
      confidence: row.confidence,
      examples: this.getPatternExamples(row.pattern_data),
      lastSeen: this.getRelativeTime(row.updated_at)
    }));
  }

  private async generatePersonalizedSuggestions(baselineId: string, patterns: any[]): Promise<any[]> {
    const suggestions = [];
    
    // 基于React.memo偏好
    const memoPattern = patterns.find(p => p.type === 'code_style' && p.title.includes('React.memo'));
    if (memoPattern && memoPattern.confidence > 90) {
      suggestions.push({
        id: `personal-${baselineId}-memo`,
        title: '为Button组件添加React.memo',
        reason: '基于你过去对性能优化的重视',
        basedOnPattern: '你在类似组件中总是使用React.memo',
        confidence: memoPattern.confidence,
        learnedFrom: {
          similarComponents: ['InputButton', 'SubmitButton', 'IconButton'],
          teamPreferences: ['性能优先', '减少重渲染'],
          historicalChoices: ['6次选择了添加memo', '0次拒绝memo建议']
        }
      });
    }

    // 基于loading体验偏好
    if (baselineId.includes('button')) {
      suggestions.push({
        id: `personal-${baselineId}-loading`,
        title: '为Button组件添加loading状态的进度条',
        reason: '基于你过去对用户体验细节的关注',
        basedOnPattern: '你在类似组件中总是优化loading体验',
        confidence: 88,
        learnedFrom: {
          similarComponents: ['InputButton', 'SubmitButton'],
          teamPreferences: ['使用Ant Design Progress'],
          historicalChoices: ['选择进度条而非spinner']
        }
      });
    }

    // 基于代码风格偏好
    suggestions.push({
      id: `personal-${baselineId}-hooks`,
      title: '将业务逻辑抽离到自定义Hook',
      reason: '你倾向于保持组件简洁',
      basedOnPattern: '80%的情况下你会将复杂逻辑抽离',
      confidence: 82,
      learnedFrom: {
        similarComponents: ['FormButton', 'DataTable'],
        teamPreferences: ['关注点分离', '可测试性'],
        historicalChoices: ['抽离了5个复杂组件的逻辑']
      }
    });

    return suggestions;
  }

  private async getTeamInsights(): Promise<any[]> {
    // 模拟团队洞察数据
    return [
      {
        pattern: '团队开始更多使用CSS-in-JS',
        adoption: 65,
        trend: 'increasing' as const,
        recommendation: '考虑在此组件中使用styled-components'
      },
      {
        pattern: 'TypeScript严格模式采用率提升',
        adoption: 78,
        trend: 'increasing' as const,
        recommendation: '启用strict模式并添加详细类型定义'
      },
      {
        pattern: '组件测试覆盖率要求提高',
        adoption: 85,
        trend: 'stable' as const,
        recommendation: '确保组件有完整的单元测试'
      }
    ];
  }

  private async updatePatternConfidence(userId: string, patternType: string) {
    await DatabaseService.query(
      `UPDATE learning_patterns 
       SET confidence = LEAST(confidence + 5, 100), 
           updated_at = CURRENT_TIMESTAMP 
       WHERE user_id = ? AND pattern_type = ?`,
      [userId, patternType]
    );
  }

  private getPatternTitle(type: string, data: string): string {
    const parsedData = JSON.parse(data);
    
    switch (type) {
      case 'code_style':
        return `你偏好使用${parsedData.preference}进行${parsedData.context}`;
      case 'workflow_pattern':
        return '你总是优先修复严重问题';
      default:
        return '未知模式';
    }
  }

  private getPatternDescription(type: string, data: string): string {
    const parsedData = JSON.parse(data);
    
    switch (type) {
      case 'code_style':
        return `基于过去${parsedData.frequency}次选择，你总是接受${parsedData.preference}的建议`;
      case 'workflow_pattern':
        return `观察到${parsedData.observed}次这种行为模式`;
      default:
        return '正在学习你的偏好';
    }
  }

  private getPatternExamples(data: string): number {
    try {
      const parsedData = JSON.parse(data);
      return parsedData.frequency || parsedData.observed || 1;
    } catch {
      return 1;
    }
  }

  private getRelativeTime(date: Date | string): string {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return '刚刚';
    if (diffHours < 24) return `${diffHours}小时前`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}天前`;
    return `${Math.floor(diffDays / 7)}周前`;
  }
}