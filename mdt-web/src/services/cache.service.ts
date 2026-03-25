import { logger } from '../utils/logger';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface CacheConfig {
  defaultTTL?: number; // 默认过期时间（毫秒）
  maxSize?: number;    // 最大缓存条目数
  persistent?: boolean; // 是否持久化到 localStorage
}

class CacheService {
  private cache = new Map<string, CacheEntry<any>>();
  private config: Required<CacheConfig>;
  private readonly STORAGE_KEY = 'mdt_cache';

  constructor(config: CacheConfig = {}) {
    this.config = {
      defaultTTL: config.defaultTTL || 5 * 60 * 1000, // 默认5分钟
      maxSize: config.maxSize || 100,
      persistent: config.persistent || false
    };

    // 从 localStorage 恢复缓存
    if (this.config.persistent) {
      this.restoreFromStorage();
    }

    // 定期清理过期缓存
    this.startCleanupTimer();
  }

  /**
   * 设置缓存
   */
  set<T>(key: string, data: T, ttl?: number): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.config.defaultTTL
    };

    // 检查缓存大小限制
    if (this.cache.size >= this.config.maxSize && !this.cache.has(key)) {
      this.evictOldest();
    }

    this.cache.set(key, entry);
    logger.debug(`Cache set: ${key}`);

    // 持久化到 localStorage
    if (this.config.persistent) {
      this.saveToStorage();
    }
  }

  /**
   * 获取缓存
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // 检查是否过期
    if (this.isExpired(entry)) {
      this.cache.delete(key);
      logger.debug(`Cache expired: ${key}`);
      return null;
    }

    logger.debug(`Cache hit: ${key}`);
    return entry.data as T;
  }

  /**
   * 删除缓存
   */
  delete(key: string): void {
    this.cache.delete(key);
    logger.debug(`Cache deleted: ${key}`);

    if (this.config.persistent) {
      this.saveToStorage();
    }
  }

  /**
   * 清空所有缓存
   */
  clear(): void {
    this.cache.clear();
    logger.debug('Cache cleared');

    if (this.config.persistent) {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  /**
   * 使用模式匹配删除缓存
   */
  deletePattern(pattern: string | RegExp): void {
    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
    const keysToDelete: string[] = [];

    this.cache.forEach((_, key) => {
      if (regex.test(key)) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.delete(key));
    logger.debug(`Cache deleted by pattern: ${pattern}, removed ${keysToDelete.length} entries`);
  }

  /**
   * 获取或设置缓存（如果不存在则执行函数并缓存结果）
   */
  async getOrSet<T>(
    key: string, 
    fetchFn: () => Promise<T>, 
    ttl?: number
  ): Promise<T> {
    // 尝试从缓存获取
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // 执行函数获取数据
    try {
      const data = await fetchFn();
      this.set(key, data, ttl);
      return data;
    } catch (error) {
      logger.error(`Failed to fetch data for cache key: ${key}`, error);
      throw error;
    }
  }

  /**
   * 检查缓存是否过期
   */
  private isExpired(entry: CacheEntry<any>): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  /**
   * 移除最旧的缓存条目
   */
  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTimestamp = Infinity;

    this.cache.forEach((entry, key) => {
      if (entry.timestamp < oldestTimestamp) {
        oldestTimestamp = entry.timestamp;
        oldestKey = key;
      }
    });

    if (oldestKey) {
      this.cache.delete(oldestKey);
      logger.debug(`Cache evicted (oldest): ${oldestKey}`);
    }
  }

  /**
   * 清理过期缓存
   */
  private cleanup(): void {
    const keysToDelete: string[] = [];

    this.cache.forEach((entry, key) => {
      if (this.isExpired(entry)) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.cache.delete(key));

    if (keysToDelete.length > 0) {
      logger.debug(`Cache cleanup: removed ${keysToDelete.length} expired entries`);
      if (this.config.persistent) {
        this.saveToStorage();
      }
    }
  }

  /**
   * 启动定期清理定时器
   */
  private startCleanupTimer(): void {
    setInterval(() => {
      this.cleanup();
    }, 60 * 1000); // 每分钟清理一次
  }

  /**
   * 保存到 localStorage
   */
  private saveToStorage(): void {
    try {
      const data = Array.from(this.cache.entries());
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      logger.error('Failed to save cache to localStorage:', error);
    }
  }

  /**
   * 从 localStorage 恢复
   */
  private restoreFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored) as Array<[string, CacheEntry<any>]>;
        data.forEach(([key, entry]) => {
          if (!this.isExpired(entry)) {
            this.cache.set(key, entry);
          }
        });
        logger.info(`Restored ${this.cache.size} cache entries from localStorage`);
      }
    } catch (error) {
      logger.error('Failed to restore cache from localStorage:', error);
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  /**
   * 获取缓存统计信息
   */
  getStats(): {
    size: number;
    maxSize: number;
    hitRate: number;
    keys: string[];
  } {
    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
      hitRate: 0, // 可以实现命中率统计
      keys: Array.from(this.cache.keys())
    };
  }
}

// 创建缓存实例
export const memoryCache = new CacheService({
  defaultTTL: 5 * 60 * 1000,  // 5分钟
  maxSize: 100,
  persistent: false
});

export const persistentCache = new CacheService({
  defaultTTL: 30 * 60 * 1000, // 30分钟
  maxSize: 50,
  persistent: true
});

// 导出类以便创建自定义实例
export default CacheService;