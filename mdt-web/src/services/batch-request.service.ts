import { logger } from '../utils/logger';

interface BatchRequest<T = any> {
  id: string;
  request: () => Promise<T>;
  resolve: (value: T) => void;
  reject: (reason: any) => void;
}

interface BatchOptions {
  maxBatchSize?: number;
  batchDelay?: number;
  maxConcurrency?: number;
}

class BatchRequestService {
  private queue: Map<string, BatchRequest> = new Map();
  private timer: NodeJS.Timeout | null = null;
  private processing = false;
  private options: Required<BatchOptions>;

  constructor(options: BatchOptions = {}) {
    this.options = {
      maxBatchSize: options.maxBatchSize || 10,
      batchDelay: options.batchDelay || 50, // 50ms延迟
      maxConcurrency: options.maxConcurrency || 3
    };
  }

  /**
   * 添加请求到批处理队列
   */
  add<T>(id: string, request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      // 如果已经有相同ID的请求在队列中，直接返回该请求的结果
      if (this.queue.has(id)) {
        const existing = this.queue.get(id)!;
        // 链接到现有的 Promise
        existing.request().then(resolve).catch(reject);
        return;
      }

      // 添加到队列
      this.queue.set(id, {
        id,
        request,
        resolve,
        reject
      });

      logger.debug(`Batch request added: ${id}, queue size: ${this.queue.size}`);

      // 如果达到批处理大小，立即处理
      if (this.queue.size >= this.options.maxBatchSize) {
        this.processBatch();
      } else {
        // 否则设置延迟处理
        this.scheduleProcessing();
      }
    });
  }

  /**
   * 调度批处理
   */
  private scheduleProcessing() {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.timer = setTimeout(() => {
      this.processBatch();
    }, this.options.batchDelay);
  }

  /**
   * 处理批量请求
   */
  private async processBatch() {
    if (this.processing || this.queue.size === 0) {
      return;
    }

    this.processing = true;

    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    // 获取要处理的批次
    const batch = Array.from(this.queue.values()).slice(0, this.options.maxBatchSize);
    
    // 从队列中移除
    batch.forEach(item => this.queue.delete(item.id));

    logger.info(`Processing batch of ${batch.length} requests`);

    // 分组并发执行
    const chunks = this.chunkArray(batch, this.options.maxConcurrency);
    
    for (const chunk of chunks) {
      await Promise.all(
        chunk.map(async (item) => {
          try {
            const result = await item.request();
            item.resolve(result);
          } catch (error) {
            item.reject(error);
            logger.error(`Batch request failed: ${item.id}`, error);
          }
        })
      );
    }

    this.processing = false;

    // 如果还有剩余请求，继续处理
    if (this.queue.size > 0) {
      this.scheduleProcessing();
    }
  }

  /**
   * 将数组分成指定大小的块
   */
  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  /**
   * 清空队列
   */
  clear() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    // 拒绝所有待处理的请求
    this.queue.forEach(item => {
      item.reject(new Error('Batch queue cleared'));
    });

    this.queue.clear();
    this.processing = false;
  }

  /**
   * 获取队列状态
   */
  getStatus() {
    return {
      queueSize: this.queue.size,
      processing: this.processing,
      options: this.options
    };
  }
}

// 创建默认实例
export const batchRequestService = new BatchRequestService();

// 创建专门用于基准状态的批处理服务
export const baselineStatusBatcher = new BatchRequestService({
  maxBatchSize: 20,
  batchDelay: 100,
  maxConcurrency: 5
});

// 导出类以便创建自定义实例
export default BatchRequestService;