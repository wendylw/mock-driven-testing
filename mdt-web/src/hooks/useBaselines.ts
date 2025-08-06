import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { cachedBaselineApi } from '../services/cached-baseline-api';
import { memoryCache } from '../services/cache.service';

// 基准信息接口（与现有的保持一致）
interface BaselineInfo {
  id: string;
  component: string;
  path: string;
  version: string;
  createdAt: Date;
  lastUpdated: Date;
  snapshotCount: number;
  propsVariations: number;
  status: 'healthy' | 'outdated' | 'corrupted';
  corruptionType?: 'fileCorrupted' | 'componentDeleted';
  branch: string;
  commit: string;
  size: number;
  usageCount: number;
  riskLevel: 'low' | 'high';
  businessImpact: string;
  criticalUsageScenarios: string[];
  
  // 智能状态（来自API）
  intelligentStatus?: any;
}

interface UseBaselinesResult {
  baselines: BaselineInfo[];
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

// Helper function to map intelligent status to basic status
const mapIntelligentStatusToBasicStatus = (intelligentStatus: string): 'healthy' | 'outdated' | 'corrupted' => {
  const statusMap: Record<string, 'healthy' | 'outdated' | 'corrupted'> = {
    'healthy': 'healthy',
    'optimizable': 'healthy',
    'outdated': 'outdated',
    'drifting': 'outdated',
    'unstable': 'outdated',
    'corrupted': 'corrupted',
    'deleted': 'corrupted',
    'deprecated': 'healthy' // 已弃用但仍然是健康的文件
  };
  
  return statusMap[intelligentStatus] || 'healthy';
};

/**
 * Hook for managing baseline data with API integration
 */
export const useBaselines = (): UseBaselinesResult => {
  const [baselines, setBaselines] = useState<BaselineInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadBaselines = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 检查是否启用远程API
      const useRemoteApi = import.meta.env.VITE_USE_REMOTE_API === 'true';
      
      if (useRemoteApi) {
        // 尝试从API加载
        try {
          const response = await cachedBaselineApi.getBaselines();
          
          if (response.success && response.data) {
            // 转换API数据为前端格式
            const apiBaselines = response.data.map((item: any) => ({
              ...item,
              createdAt: new Date(item.createdAt || item.created_at),
              lastUpdated: new Date(item.lastUpdated || item.updated_at),
              // 保留其他必要的转换
            }));
            
            // 并行获取每个基准的智能状态（使用缓存）
            const baselinesWithStatus = await Promise.all(
              apiBaselines.map(async (baseline: BaselineInfo) => {
                try {
                  const statusResponse = await cachedBaselineApi.getStatus(baseline.id);
                  if (statusResponse.success) {
                    return {
                      ...baseline,
                      intelligentStatus: statusResponse.data.statusDetail,
                      // 可以覆盖其他字段
                      status: mapIntelligentStatusToBasicStatus(statusResponse.data.status)
                    };
                  }
                } catch (statusError) {
                  console.warn(`Failed to get status for ${baseline.id}:`, statusError);
                }
                return baseline;
              })
            );
            
            setBaselines(baselinesWithStatus);
            return;
          }
        } catch (apiError) {
          console.warn('API load failed, falling back to local data:', apiError);
        }
      }

      // 降级到本地Mock数据
      const response = await fetch('/baselines.json');
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      
      const jsonData = await response.json();
      if (jsonData.success && jsonData.data) {
        const mockBaselines = jsonData.data.map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt),
          lastUpdated: new Date(item.lastUpdated)
        }));
        setBaselines(mockBaselines);
      } else {
        throw new Error('Invalid data format');
      }
      
    } catch (err) {
      console.error('Failed to load baselines:', err);
      setError(err as Error);
      message.error('加载基准数据失败');
      setBaselines([]); // 确保有空数组
    } finally {
      setLoading(false);
    }
  }, []);

  // 刷新函数：清除缓存并重新加载
  const refresh = useCallback(async () => {
    // 清除相关缓存
    memoryCache.deletePattern(/^baselines:/);
    memoryCache.deletePattern(/^baseline:/);
    
    // 重新加载数据
    await loadBaselines();
  }, [loadBaselines]);

  useEffect(() => {
    loadBaselines();
  }, [loadBaselines]);

  return {
    baselines,
    loading,
    error,
    refresh
  };
};