import BaselineApiService from './baselineApi';
import { memoryCache, persistentCache } from './cache.service';
import { logger } from '../utils/logger';

// API响应类型定义（从 baselineApi.ts 复制）
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

class CachedBaselineApiService {
  private api = BaselineApiService;

  /**
   * 获取基准列表（缓存5分钟）
   */
  async getBaselines(): Promise<ApiResponse<any[]>> {
    return memoryCache.getOrSet(
      'baselines:all',
      () => this.api.getBaselines(),
      5 * 60 * 1000 // 5分钟
    );
  }

  /**
   * 获取基准状态（缓存2分钟）
   */
  async getStatus(baselineId: string): Promise<ApiResponse<any>> {
    return memoryCache.getOrSet(
      `baseline:status:${baselineId}`,
      () => this.api.getStatus(baselineId),
      2 * 60 * 1000 // 2分钟
    );
  }

  /**
   * 获取诊断数据（缓存10分钟）
   */
  async getDiagnostic(baselineId: string): Promise<ApiResponse<any>> {
    return memoryCache.getOrSet(
      `baseline:diagnostic:${baselineId}`,
      () => this.api.getDiagnostic(baselineId),
      10 * 60 * 1000 // 10分钟
    );
  }

  /**
   * 获取建议数据（缓存10分钟）
   */
  async getSuggestions(baselineId: string): Promise<ApiResponse<any>> {
    return memoryCache.getOrSet(
      `baseline:suggestions:${baselineId}`,
      () => this.api.getSuggestions(baselineId),
      10 * 60 * 1000 // 10分钟
    );
  }

  /**
   * 触发分析（不缓存）
   */
  async triggerAnalysis(baselineId: string, priority: 'high' | 'normal' | 'low' = 'normal'): Promise<ApiResponse<any>> {
    // 触发分析后清除相关缓存
    this.invalidateBaselineCache(baselineId);
    
    return this.api.triggerAnalysis(baselineId, priority);
  }

  /**
   * 获取分析进度（缓存1秒，用于降低轮询压力）
   */
  async getAnalysisProgress(analysisId: string): Promise<ApiResponse<any>> {
    return memoryCache.getOrSet(
      `analysis:progress:${analysisId}`,
      () => this.api.getAnalysisProgress(analysisId),
      1000 // 1秒
    );
  }

  /**
   * 交互式建议（不缓存）
   */
  async interactWithSuggestion(
    baselineId: string,
    sessionId: string,
    action: string,
    context: any
  ): Promise<ApiResponse<any>> {
    return this.api.interactWithSuggestion(baselineId, sessionId, action, context);
  }

  /**
   * 失效指定基准的所有缓存
   */
  invalidateBaselineCache(baselineId: string): void {
    const patterns = [
      `baseline:status:${baselineId}`,
      `baseline:diagnostic:${baselineId}`,
      `baseline:suggestions:${baselineId}`,
      'baselines:all' // 列表也需要刷新
    ];

    patterns.forEach(pattern => {
      memoryCache.delete(pattern);
    });

    logger.info(`Invalidated cache for baseline: ${baselineId}`);
  }

  /**
   * 失效所有缓存
   */
  invalidateAllCache(): void {
    memoryCache.clear();
    logger.info('All cache invalidated');
  }

  /**
   * 预加载基准数据
   */
  async preloadBaseline(baselineId: string): Promise<void> {
    try {
      // 并行加载所有数据
      await Promise.all([
        this.getStatus(baselineId),
        this.getDiagnostic(baselineId),
        this.getSuggestions(baselineId)
      ]);
      logger.info(`Preloaded data for baseline: ${baselineId}`);
    } catch (error) {
      logger.error(`Failed to preload baseline data: ${baselineId}`, error);
    }
  }

  /**
   * 批量预加载基准数据
   */
  async preloadBaselines(baselineIds: string[]): Promise<void> {
    // 限制并发数
    const concurrency = 3;
    const chunks = [];
    
    for (let i = 0; i < baselineIds.length; i += concurrency) {
      chunks.push(baselineIds.slice(i, i + concurrency));
    }

    for (const chunk of chunks) {
      await Promise.all(chunk.map(id => this.preloadBaseline(id)));
    }
  }

  /**
   * 获取缓存统计信息
   */
  getCacheStats() {
    return {
      memory: memoryCache.getStats(),
      persistent: persistentCache.getStats()
    };
  }
}

// 导出单例
export const cachedBaselineApi = new CachedBaselineApiService();

// 导出类以便测试
export default CachedBaselineApiService;