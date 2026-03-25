import { useState, useEffect, useCallback, useRef } from 'react';
import { memoryCache } from '../services/cache.service';
import { logger } from '../utils/logger';

interface UseCachedDataOptions {
  cacheKey: string;
  fetchFn: () => Promise<any>;
  ttl?: number;
  dependencies?: any[];
  refetchInterval?: number;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  enabled?: boolean;
}

interface UseCachedDataResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  invalidate: () => void;
  isStale: boolean;
}

export function useCachedData<T = any>(
  options: UseCachedDataOptions
): UseCachedDataResult<T> {
  const {
    cacheKey,
    fetchFn,
    ttl = 5 * 60 * 1000, // 默认5分钟
    dependencies = [],
    refetchInterval,
    onSuccess,
    onError,
    enabled = true
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isStale, setIsStale] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  // 获取数据的核心函数
  const fetchData = useCallback(async (forceFetch = false) => {
    if (!enabled) return;

    try {
      setLoading(true);
      setError(null);

      let result: T;

      if (forceFetch) {
        // 强制刷新，不使用缓存
        result = await fetchFn();
        memoryCache.set(cacheKey, result, ttl);
      } else {
        // 使用缓存
        result = await memoryCache.getOrSet(cacheKey, fetchFn, ttl);
      }

      if (mountedRef.current) {
        setData(result);
        setIsStale(false);
        onSuccess?.(result);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      
      if (mountedRef.current) {
        setError(error);
        onError?.(error);
      }
      
      logger.error(`Failed to fetch data for ${cacheKey}:`, error);
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [cacheKey, fetchFn, ttl, enabled, onSuccess, onError]);

  // 手动刷新函数
  const refetch = useCallback(async () => {
    await fetchData(true);
  }, [fetchData]);

  // 使缓存失效
  const invalidate = useCallback(() => {
    memoryCache.delete(cacheKey);
    setIsStale(true);
    logger.debug(`Cache invalidated: ${cacheKey}`);
  }, [cacheKey]);

  // 初始加载和依赖变化时重新获取
  useEffect(() => {
    fetchData();
  }, [fetchData, ...dependencies]);

  // 设置自动刷新
  useEffect(() => {
    if (refetchInterval && refetchInterval > 0) {
      intervalRef.current = setInterval(() => {
        fetchData();
      }, refetchInterval);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [refetchInterval, fetchData]);

  // 组件卸载时清理
  useEffect(() => {
    mountedRef.current = true;
    
    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    data,
    loading,
    error,
    refetch,
    invalidate,
    isStale
  };
}

// 便捷 Hook：用于基准数据
export function useCachedBaseline(baselineId: string) {
  return useCachedData({
    cacheKey: `baseline:${baselineId}`,
    fetchFn: async () => {
      // 这里应该调用实际的 API
      const response = await fetch(`/api/baselines/${baselineId}`);
      if (!response.ok) throw new Error('Failed to fetch baseline');
      return response.json();
    },
    ttl: 10 * 60 * 1000 // 10分钟
  });
}

// 便捷 Hook：用于基准列表
export function useCachedBaselineList() {
  return useCachedData({
    cacheKey: 'baselines:list',
    fetchFn: async () => {
      const response = await fetch('/api/baselines');
      if (!response.ok) throw new Error('Failed to fetch baselines');
      return response.json();
    },
    ttl: 5 * 60 * 1000, // 5分钟
    refetchInterval: 5 * 60 * 1000 // 每5分钟自动刷新
  });
}