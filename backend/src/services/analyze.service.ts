import { StatusService } from './status.service';
import { DiagnosticService } from './diagnostic.service';
import { SuggestionService } from './suggestion.service';
import { DatabaseService } from './database.service';
import { RedisService } from './redis.service';
import { logger } from '../utils/logger';

export interface AnalysisResult {
  id: string;
  baselineId: string;
  timestamp: Date;
  status: any;
  diagnostic: any;
  suggestions: any;
  duration: number;
}

export class AnalyzeService {
  private statusService: StatusService;
  private diagnosticService: DiagnosticService;
  private suggestionService: SuggestionService;
  
  constructor() {
    this.statusService = new StatusService();
    this.diagnosticService = new DiagnosticService();
    this.suggestionService = new SuggestionService();
  }

  async analyzeBaseline(baselineId: string, options?: { force?: boolean }): Promise<AnalysisResult> {
    const startTime = Date.now();
    const analysisId = `analysis-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    logger.info(`Starting analysis for baseline: ${baselineId}, analysisId: ${analysisId}`);

    try {
      // 检查是否需要跳过分析（已有最近的分析结果）
      if (!options?.force) {
        const recentAnalysis = await this.getRecentAnalysis(baselineId);
        if (recentAnalysis) {
          logger.info(`Using recent analysis for baseline: ${baselineId}`);
          return recentAnalysis;
        }
      }

      // 并行执行所有分析
      const [status, diagnostic, suggestions] = await Promise.all([
        this.statusService.getBaselineStatus(baselineId),
        this.diagnosticService.getDiagnostic(baselineId),
        this.suggestionService.getSuggestions(baselineId)
      ]);

      const duration = Date.now() - startTime;
      
      const result: AnalysisResult = {
        id: analysisId,
        baselineId,
        timestamp: new Date(),
        status,
        diagnostic,
        suggestions,
        duration
      };

      // 存储分析结果
      await this.storeAnalysisResult(result);
      
      // 触发后续操作（如通知、自动修复等）
      await this.triggerPostAnalysisActions(result);

      logger.info(`Analysis completed for baseline: ${baselineId}, duration: ${duration}ms`);
      
      return result;
    } catch (error) {
      logger.error(`Analysis failed for baseline: ${baselineId}`, error);
      throw error;
    }
  }

  async getAnalysisHistory(baselineId: string, limit: number = 10): Promise<AnalysisResult[]> {
    const sql = `
      SELECT * FROM analysis_results 
      WHERE baseline_id = ? 
      ORDER BY created_at DESC 
      LIMIT ?
    `;
    
    const rows = await DatabaseService.query<any[]>(sql, [baselineId, limit]);
    
    return rows.map(row => ({
      id: row.id,
      baselineId: row.baseline_id,
      timestamp: row.created_at,
      status: JSON.parse(row.status_data || '{}'),
      diagnostic: JSON.parse(row.diagnostic_data || '{}'),
      suggestions: JSON.parse(row.suggestion_data || '{}'),
      duration: row.duration
    }));
  }

  private async getRecentAnalysis(baselineId: string): Promise<AnalysisResult | null> {
    // 检查缓存
    const cacheKey = `analysis:${baselineId}:latest`;
    const cached = await RedisService.getJSON<AnalysisResult>(cacheKey);
    if (cached) {
      return cached;
    }

    // 检查数据库中是否有30分钟内的分析
    const sql = `
      SELECT * FROM analysis_results 
      WHERE baseline_id = ? 
        AND created_at > datetime('now', '-30 minutes')
      ORDER BY created_at DESC 
      LIMIT 1
    `;
    
    const rows = await DatabaseService.query<any[]>(sql, [baselineId]);
    
    if (rows.length === 0) {
      return null;
    }

    const row = rows[0];
    const result: AnalysisResult = {
      id: row.id,
      baselineId: row.baseline_id,
      timestamp: row.created_at,
      status: JSON.parse(row.status_data || '{}'),
      diagnostic: JSON.parse(row.diagnostic_data || '{}'),
      suggestions: JSON.parse(row.suggestion_data || '{}'),
      duration: row.duration
    };

    // 缓存结果
    await RedisService.setJSON(cacheKey, result, 30 * 60); // 30分钟
    
    return result;
  }

  private async storeAnalysisResult(result: AnalysisResult) {
    try {
      await DatabaseService.query(
        `INSERT INTO analysis_results 
         (id, baseline_id, status_data, diagnostic_data, suggestion_data, duration) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          result.id,
          result.baselineId,
          JSON.stringify(result.status),
          JSON.stringify(result.diagnostic),
          JSON.stringify(result.suggestions),
          result.duration
        ]
      );

      // 缓存最新分析结果
      const cacheKey = `analysis:${result.baselineId}:latest`;
      await RedisService.setJSON(cacheKey, result, 30 * 60);
      
    } catch (error) {
      logger.error('Failed to store analysis result:', error);
      // 不抛出错误，避免影响分析结果返回
    }
  }

  private async triggerPostAnalysisActions(result: AnalysisResult) {
    try {
      // 根据分析结果触发不同的操作
      
      // 1. 如果状态是corrupted，发送告警
      if (result.status.status === 'corrupted') {
        logger.warn(`Baseline ${result.baselineId} is corrupted!`, {
          issues: result.diagnostic.rootCauses
        });
        // TODO: 发送告警通知
      }

      // 2. 如果有高优先级建议，记录日志
      const highPrioritySuggestions = [
        ...result.suggestions.visualSuggestions.filter((s: any) => s.priority === 'high'),
        ...result.suggestions.codeSuggestions.filter((s: any) => s.impact.includes('性能降低'))
      ];
      
      if (highPrioritySuggestions.length > 0) {
        logger.info(`Found ${highPrioritySuggestions.length} high priority suggestions for ${result.baselineId}`);
        // TODO: 可以自动创建修复任务
      }

      // 3. 更新基准的最后分析时间
      await DatabaseService.query(
        'UPDATE baselines SET last_analyzed_at = CURRENT_TIMESTAMP WHERE id = ?',
        [result.baselineId]
      );
      
    } catch (error) {
      logger.error('Post-analysis actions failed:', error);
      // 不抛出错误，避免影响主流程
    }
  }

  async invalidateAnalysisCache(baselineId: string): Promise<void> {
    const cacheKey = `analysis:${baselineId}:latest`;
    await RedisService.del(cacheKey);
    
    // 同时清除各个服务的缓存
    await this.statusService.invalidateCache(baselineId);
    await this.diagnosticService.invalidateCache(baselineId);
    await this.suggestionService.invalidateCache(baselineId);
    
    logger.info(`Analysis cache invalidated for baseline: ${baselineId}`);
  }
}