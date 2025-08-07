/**
 * 统一的缓存服务接口
 * 根据环境配置自动选择Redis或内存缓存
 */

let cacheService: any;

export async function getCacheService() {
  if (cacheService) {
    return cacheService;
  }

  if (process.env.USE_MEMORY_CACHE === 'true') {
    const { RedisService } = await import('./redis-memory.service');
    cacheService = RedisService;
  } else {
    const { RedisService } = await import('./redis.service');
    cacheService = RedisService;
  }

  return cacheService;
}

// 导出一个默认的CacheService，在初始化时会被替换
export let CacheService = {
  async get(key: string): Promise<string | null> {
    const service = await getCacheService();
    return service.get(key);
  },

  async set(key: string, value: string, options?: { EX?: number; PX?: number }): Promise<void> {
    const service = await getCacheService();
    return service.set(key, value, options);
  },

  async del(key: string): Promise<number> {
    const service = await getCacheService();
    return service.del(key);
  },

  async getJSON<T>(key: string): Promise<T | null> {
    const service = await getCacheService();
    return service.getJSON(key);
  },

  async setJSON<T>(key: string, value: T, ttl?: number): Promise<void> {
    const service = await getCacheService();
    return service.setJSON(key, value, ttl);
  }
};