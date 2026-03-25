import { memoryCache } from '../services/cache.service';
import { logger } from '../utils/logger';

interface CacheOptions {
  ttl?: number;
  keyGenerator?: (...args: any[]) => string;
  condition?: (...args: any[]) => boolean;
}

/**
 * 方法缓存装饰器
 * @param options 缓存选项
 */
export function Cacheable(options: CacheOptions = {}) {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      // 检查是否应该缓存
      if (options.condition && !options.condition(...args)) {
        return originalMethod.apply(this, args);
      }

      // 生成缓存键
      const cacheKey = options.keyGenerator
        ? options.keyGenerator(...args)
        : `${target.constructor.name}.${propertyName}:${JSON.stringify(args)}`;

      // 尝试从缓存获取
      const cached = memoryCache.get(cacheKey);
      if (cached !== null) {
        logger.debug(`Cache hit for method: ${propertyName}`);
        return cached;
      }

      // 执行原方法
      try {
        const result = await originalMethod.apply(this, args);
        
        // 缓存结果
        if (result !== null && result !== undefined) {
          memoryCache.set(cacheKey, result, options.ttl);
        }
        
        return result;
      } catch (error) {
        logger.error(`Error in cached method ${propertyName}:`, error);
        throw error;
      }
    };

    return descriptor;
  };
}

/**
 * 清除方法缓存装饰器
 * @param patterns 要清除的缓存键模式
 */
export function CacheEvict(patterns: string | string[] | ((...args: any[]) => string | string[])) {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      // 执行原方法
      const result = await originalMethod.apply(this, args);

      // 清除缓存
      const patternsToEvict = typeof patterns === 'function' 
        ? patterns(...args) 
        : patterns;
      
      const patternArray = Array.isArray(patternsToEvict) 
        ? patternsToEvict 
        : [patternsToEvict];

      patternArray.forEach(pattern => {
        memoryCache.deletePattern(pattern);
        logger.debug(`Cache evicted by method ${propertyName}: ${pattern}`);
      });

      return result;
    };

    return descriptor;
  };
}

/**
 * 缓存键生成器工具函数
 */
export const CacheKeyGenerators = {
  /**
   * 基于类名、方法名和参数生成键
   */
  default: (className: string, methodName: string) => 
    (...args: any[]) => `${className}.${methodName}:${JSON.stringify(args)}`,

  /**
   * 基于单个ID参数生成键
   */
  byId: (prefix: string) => 
    (id: string | number) => `${prefix}:${id}`,

  /**
   * 基于多个参数生成键
   */
  byParams: (prefix: string, paramNames: string[]) => 
    (...args: any[]) => {
      const params = paramNames.map((name, index) => `${name}=${args[index]}`).join('&');
      return `${prefix}:${params}`;
    },

  /**
   * 自定义键生成器
   */
  custom: (generator: (...args: any[]) => string) => generator
};