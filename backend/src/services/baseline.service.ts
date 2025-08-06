import { db } from '../database/db';

export class BaselineService {
  async getBaseline(id: string) {
    try {
      const baseline = db.prepare(`
        SELECT * FROM baselines WHERE id = ?
      `).get(id);
      
      return baseline;
    } catch (error) {
      console.error('Error getting baseline:', error);
      throw error;
    }
  }
  
  async getBaselineDetails(id: string) {
    try {
      // 获取基准信息
      const baseline = await this.getBaseline(id);
      if (!baseline) {
        return null;
      }
      
      // 获取相关的诊断问题
      const problems = db.prepare(`
        SELECT * FROM diagnostic_problems 
        WHERE baseline_id = ? 
        ORDER BY severity DESC
      `).all(id);
      
      // 获取建议
      const suggestions = db.prepare(`
        SELECT * FROM suggestions 
        WHERE baseline_id = ? 
        ORDER BY priority DESC
      `).all(id);
      
      // 获取版本历史
      const versions = db.prepare(`
        SELECT * FROM version_history 
        WHERE baseline_id = ? 
        ORDER BY date DESC 
        LIMIT 5
      `).all(id);
      
      // 构建详情对象（这里需要根据实际数据结构来构建）
      // 对于非 BEEP Button 的基准，返回基础数据
      return {
        id: baseline.id,
        component: baseline.component_name,
        status: baseline.status || 'healthy',
        statusLabel: this.getStatusLabel(baseline.status),
        // ... 其他字段根据实际需要构建
        qualityMetrics: {
          healthScore: 80,
          issues: problems.map(p => ({
            id: p.id,
            severity: p.severity,
            category: p.category,
            title: p.title,
            description: p.description,
            impact: p.impact,
            recommendation: p.recommendation,
            estimatedFixTime: p.estimated_fix_time
          })),
          issueCount: problems.length,
          criticalCount: problems.filter(p => p.severity === 'critical').length,
          // ... 其他默认值
        },
        actionSuggestions: suggestions.map(s => ({
          id: s.id,
          type: s.type,
          priority: s.priority,
          title: s.title,
          description: s.description,
          benefits: JSON.parse(s.benefits || '[]'),
          estimatedTime: s.estimated_time,
          steps: JSON.parse(s.steps || '[]')
        })),
        versions: versions.map(v => ({
          version: v.version,
          date: v.date,
          changes: JSON.parse(v.changes || '[]')
        }))
      };
    } catch (error) {
      console.error('Error getting baseline details:', error);
      throw error;
    }
  }
  
  async getAnalysisHistory(baselineId: string, limit: number = 10) {
    try {
      // 这里应该从数据库获取分析历史
      // 暂时返回空数组
      return [];
    } catch (error) {
      console.error('Error getting analysis history:', error);
      throw error;
    }
  }
  
  private getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      healthy: '健康',
      outdated: '过时',
      corrupted: '损坏',
      deprecated: '已弃用'
    };
    return labels[status] || status;
  }
}