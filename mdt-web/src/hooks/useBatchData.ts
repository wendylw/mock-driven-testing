import { useState, useEffect, useCallback, useRef } from 'react';
import { batchApiService } from '../services/batch-api.service';
import { logger } from '../utils/logger';

interface UseBatchDataOptions<T> {
  requests: Array<{
    id: string;
    type: 'status' | 'diagnostic' | 'suggestions';
    baselineId: string;
  }>;
  onSuccess?: (data: Map<string, T>) => void;
  onError?: (error: Error) => void;
  enabled?: boolean;
}

interface UseBatchDataResult<T> {
  data: Map<string, T>;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useBatchData<T = any>(
  options: UseBatchDataOptions<T>
): UseBatchDataResult<T> {
  const {
    requests,
    onSuccess,
    onError,
    enabled = true
  } = options;

  const [data, setData] = useState<Map<string, T>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const mountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    if (!enabled || requests.length === 0) return;

    try {
      setLoading(true);
      setError(null);

      const result = await batchApiService.getBatchData(requests);

      if (mountedRef.current) {
        setData(result as Map<string, T>);
        onSuccess?.(result as Map<string, T>);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      
      if (mountedRef.current) {
        setError(error);
        onError?.(error);
      }
      
      logger.error('Batch data fetch failed:', error);
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [requests, enabled, onSuccess, onError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    mountedRef.current = true;
    
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}

/**
 * Hook for batch loading baseline statuses
 */
export function useBatchBaselineStatuses(baselineIds: string[]) {
  const [statuses, setStatuses] = useState<Map<string, any>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadStatuses = useCallback(async () => {
    if (baselineIds.length === 0) return;

    try {
      setLoading(true);
      setError(null);

      const result = await batchApiService.getBaselineStatuses(baselineIds);
      setStatuses(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      logger.error('Failed to load baseline statuses:', error);
    } finally {
      setLoading(false);
    }
  }, [baselineIds]);

  useEffect(() => {
    loadStatuses();
  }, [loadStatuses]);

  return {
    statuses,
    loading,
    error,
    refetch: loadStatuses
  };
}

/**
 * Hook for preloading baseline data
 */
export function usePreloadBaseline(baselineId: string | null) {
  const [preloaded, setPreloaded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!baselineId) return;

    const preload = async () => {
      try {
        setLoading(true);
        await batchApiService.preloadBaselineData(baselineId);
        setPreloaded(true);
      } catch (error) {
        logger.error(`Failed to preload baseline ${baselineId}:`, error);
      } finally {
        setLoading(false);
      }
    };

    preload();
  }, [baselineId]);

  return { preloaded, loading };
}