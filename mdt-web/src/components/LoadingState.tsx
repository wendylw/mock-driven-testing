import React from 'react';
import { Spin, Empty, Result, Button } from 'antd';
import { LoadingOutlined, ReloadOutlined } from '@ant-design/icons';

interface LoadingStateProps {
  loading?: boolean;
  error?: Error | string | null;
  empty?: boolean;
  emptyText?: string;
  emptyImage?: React.ReactNode;
  onRetry?: () => void;
  loadingText?: string;
  size?: 'small' | 'default' | 'large';
  fullScreen?: boolean;
  children: React.ReactNode;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  loading = false,
  error = null,
  empty = false,
  emptyText = '暂无数据',
  emptyImage,
  onRetry,
  loadingText = '加载中...',
  size = 'default',
  fullScreen = false,
  children
}) => {
  // 错误状态
  if (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return (
      <Result
        status="error"
        title="加载失败"
        subTitle={errorMessage}
        extra={
          onRetry && (
            <Button 
              type="primary" 
              icon={<ReloadOutlined />} 
              onClick={onRetry}
            >
              重试
            </Button>
          )
        }
      />
    );
  }

  // 加载状态
  if (loading) {
    const spinner = (
      <Spin
        indicator={<LoadingOutlined style={{ fontSize: size === 'large' ? 48 : size === 'small' ? 24 : 32 }} spin />}
        tip={loadingText}
        size={size}
      >
        <div style={{ 
          minHeight: fullScreen ? '100vh' : 200, 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }} />
      </Spin>
    );

    if (fullScreen) {
      return (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255, 255, 255, 0.9)',
          zIndex: 1000
        }}>
          {spinner}
        </div>
      );
    }

    return spinner;
  }

  // 空状态
  if (empty) {
    return (
      <Empty
        description={emptyText}
        image={emptyImage || Empty.PRESENTED_IMAGE_SIMPLE}
      >
        {onRetry && (
          <Button type="primary" onClick={onRetry}>
            刷新重试
          </Button>
        )}
      </Empty>
    );
  }

  // 正常渲染子组件
  return <>{children}</>;
};

// 用于包装异步数据的 Hook
export function useLoadingState<T>(
  asyncFn: () => Promise<T>,
  deps: React.DependencyList = []
) {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);
  const [data, setData] = React.useState<T | null>(null);

  const execute = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await asyncFn();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, deps);

  React.useEffect(() => {
    execute();
  }, [execute]);

  return {
    loading,
    error,
    data,
    retry: execute
  };
}