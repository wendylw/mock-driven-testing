import { apiClient } from './api-client';
import { batchRequestService, BatchRequestService } from './batch-request.service';
import { logger } from '../utils/logger';

interface BatchRequestItem {
  id: string;
  type: 'status' | 'diagnostic' | 'suggestions';
  baselineId: string;
}

interface BatchApiResponse {
  success: boolean;
  data?: {
    responses: Array<{
      id: string;
      type: string;
      success: boolean;
      data?: any;
      error?: any;
    }>;
    stats: {
      total: number;
      successful: number;
      failed: number;
    };
  };
  error?: any;
}

class BatchApiService {
  private batcher: BatchRequestService;

  constructor() {
    // 创建专门的批处理器
    this.batcher = new BatchRequestService({
      maxBatchSize: 20,
      batchDelay: 100,
      maxConcurrency: 1 // 批量请求本身就是并发的
    });
  }

  /**
   * 批量获取基准状态
   */
  async getBaselineStatuses(baselineIds: string[]): Promise<Map<string, any>> {
    const results = new Map<string, any>();
    
    // 为每个基准创建批量请求
    const promises = baselineIds.map(id => 
      this.batcher.add(
        `status:${id}`,
        () => this.fetchBatchData([{
          id: `status:${id}`,
          type: 'status' as const,
          baselineId: id
        }])
      ).then(response => {
        const item = response.get(`status:${id}`);
        if (item) {
          results.set(id, item);
        }
      })
    );

    await Promise.all(promises);
    return results;
  }

  /**
   * 批量获取多种类型的数据
   */
  async getBatchData(requests: BatchRequestItem[]): Promise<Map<string, any>> {
    // 根据请求ID去重
    const uniqueRequests = Array.from(
      new Map(requests.map(r => [r.id, r])).values()
    );

    return this.fetchBatchData(uniqueRequests);
  }

  /**
   * 执行批量API请求
   */
  private async fetchBatchData(requests: BatchRequestItem[]): Promise<Map<string, any>> {
    try {
      const response = await apiClient.post<BatchApiResponse>('/batch', { requests });
      
      if (!response.success || !response.data) {
        throw new Error('Batch request failed');
      }

      // 将结果转换为Map
      const resultMap = new Map<string, any>();
      
      response.data.responses.forEach(item => {
        if (item.success) {
          resultMap.set(item.id, item.data);
        } else {
          logger.error(`Batch item failed: ${item.id}`, item.error);
        }
      });

      logger.info(`Batch request completed: ${response.data.stats.successful}/${response.data.stats.total} successful`);
      
      return resultMap;
    } catch (error) {
      logger.error('Batch API request failed:', error);
      throw error;
    }
  }

  /**
   * 使用优化的批量基准加载
   */
  async loadBaselines(baselineIds: string[], fields?: string[]): Promise<{
    baselines: Record<string, any>;
    errors: Record<string, any>;
  }> {
    try {
      const response = await apiClient.post<any>('/batch/baselines', {
        baselineIds,
        fields
      });

      if (!response.success || !response.data) {
        throw new Error('Batch baseline load failed');
      }

      return response.data;
    } catch (error) {
      logger.error('Batch baseline load failed:', error);
      throw error;
    }
  }

  /**
   * 预加载基准数据
   */
  async preloadBaselineData(baselineId: string): Promise<void> {
    const requests: BatchRequestItem[] = [
      { id: `status:${baselineId}`, type: 'status', baselineId },
      { id: `diagnostic:${baselineId}`, type: 'diagnostic', baselineId },
      { id: `suggestions:${baselineId}`, type: 'suggestions', baselineId }
    ];

    await this.getBatchData(requests);
    logger.info(`Preloaded data for baseline: ${baselineId}`);
  }

  /**
   * 获取批处理状态
   */
  getStatus() {
    return this.batcher.getStatus();
  }
}

// 导出单例
export const batchApiService = new BatchApiService();

// 导出类
export default BatchApiService;