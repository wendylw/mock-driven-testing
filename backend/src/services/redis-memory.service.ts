import { logger } from '../utils/logger';

/**
 * 内存版Redis服务，用于开发环境
 */
export class RedisService {
  private static cache = new Map<string, { value: string; expiry?: number }>();

  static async initialize() {
    logger.info('Using in-memory cache (Redis not required)');
  }

  static getClient() {
    return this;
  }

  static async get(key: string): Promise<string | null> {
    const item = this.cache.get(key);
    if (!item) return null;
    
    // 检查是否过期
    if (item.expiry && Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }

  static async set(
    key: string, 
    value: string, 
    options?: { EX?: number; PX?: number }
  ): Promise<void> {
    let expiry: number | undefined;
    
    if (options?.EX) {
      expiry = Date.now() + (options.EX * 1000);
    } else if (options?.PX) {
      expiry = Date.now() + options.PX;
    }
    
    this.cache.set(key, { value, expiry });
  }

  static async del(key: string): Promise<number> {
    const existed = this.cache.has(key);
    this.cache.delete(key);
    return existed ? 1 : 0;
  }

  static async exists(key: string): Promise<boolean> {
    const item = this.cache.get(key);
    if (!item) return false;
    
    // 检查是否过期
    if (item.expiry && Date.now() > item.expiry) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  static async expire(key: string, seconds: number): Promise<boolean> {
    const item = this.cache.get(key);
    if (!item) return false;
    
    item.expiry = Date.now() + (seconds * 1000);
    return true;
  }

  static async setJSON(key: string, value: any, ttl?: number): Promise<void> {
    const jsonString = JSON.stringify(value);
    if (ttl) {
      await this.set(key, jsonString, { EX: ttl });
    } else {
      await this.set(key, jsonString);
    }
  }

  static async getJSON<T = any>(key: string): Promise<T | null> {
    const value = await this.get(key);
    if (!value) return null;
    
    try {
      return JSON.parse(value) as T;
    } catch (error) {
      logger.error(`Failed to parse JSON for key ${key}:`, error);
      return null;
    }
  }

  static async invalidatePattern(pattern: string): Promise<void> {
    const regex = new RegExp(pattern.replace('*', '.*'));
    const keysToDelete: string[] = [];
    
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        keysToDelete.push(key);
      }
    }
    
    keysToDelete.forEach(key => this.cache.delete(key));
  }

  static async close() {
    this.cache.clear();
    logger.info('In-memory cache cleared');
  }
}