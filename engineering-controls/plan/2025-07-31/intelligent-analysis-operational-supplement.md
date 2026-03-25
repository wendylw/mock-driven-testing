# 智能分析系统实施计划 - 运维补充

## 一、前端状态计算迁移策略

### 1.1 渐进式迁移方案

```typescript
// src/services/statusService.ts
export class StatusService {
  private useRemoteStatus = process.env.REACT_APP_USE_REMOTE_STATUS === 'true';
  
  async getStatus(baseline: BaselineInfo) {
    try {
      if (this.useRemoteStatus) {
        // 使用远程API获取智能状态
        const response = await BaselineApiService.getStatus(baseline.id);
        if (response.success) {
          return response.data.statusDetail;
        }
      }
    } catch (error) {
      console.error('Failed to get remote status, falling back to local', error);
    }
    
    // 降级到本地计算
    return calculateIntelligentStatus(baseline);
  }
}
```

### 1.2 特性开关实现

```typescript
// src/config/features.ts
export const FeatureFlags = {
  USE_REMOTE_STATUS: {
    enabled: process.env.REACT_APP_USE_REMOTE_STATUS === 'true',
    rolloutPercentage: parseInt(process.env.REACT_APP_STATUS_ROLLOUT || '0'),
    enabledComponents: (process.env.REACT_APP_ENABLED_COMPONENTS || '').split(',')
  },
  USE_REMOTE_DIAGNOSTIC: {
    enabled: process.env.REACT_APP_USE_REMOTE_DIAGNOSTIC === 'true',
    rolloutPercentage: parseInt(process.env.REACT_APP_DIAGNOSTIC_ROLLOUT || '0')
  },
  USE_REMOTE_SUGGESTIONS: {
    enabled: process.env.REACT_APP_USE_REMOTE_SUGGESTIONS === 'true',
    rolloutPercentage: parseInt(process.env.REACT_APP_SUGGESTIONS_ROLLOUT || '0')
  }
};

// 灰度发布控制
export const shouldUseFeature = (feature: keyof typeof FeatureFlags, userId?: string) => {
  const flag = FeatureFlags[feature];
  if (!flag.enabled) return false;
  
  if (flag.rolloutPercentage === 100) return true;
  
  // 基于用户ID的稳定hash判断
  if (userId) {
    const hash = userId.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    return Math.abs(hash) % 100 < flag.rolloutPercentage;
  }
  
  return false;
};
```

## 二、Mock数据平滑过渡

### 2.1 数据适配层

```typescript
// src/adapters/baselineAdapter.ts
export class BaselineAdapter {
  /**
   * 将后端API数据转换为前端期望的格式
   */
  static fromApiResponse(apiData: any): BaselineInfo {
    return {
      id: apiData.baselineId,
      component: apiData.component,
      path: apiData.path || `src/components/${apiData.component}/index.tsx`,
      version: apiData.version || '0.1.0',
      createdAt: new Date(apiData.createdAt || apiData.created_at),
      lastUpdated: new Date(apiData.lastUpdated || apiData.updated_at),
      snapshotCount: apiData.metrics?.snapshotCount || 0,
      propsVariations: apiData.metrics?.propsVariations || 0,
      status: this.mapStatus(apiData.status),
      corruptionType: apiData.statusDetail?.corruptionType,
      branch: apiData.branch || 'develop',
      commit: apiData.commit || 'unknown',
      size: apiData.metrics?.size || 0,
      usageCount: apiData.metrics?.usageCount || 0,
      riskLevel: this.calculateRiskLevel(apiData),
      businessImpact: apiData.businessImpact || '影响用户体验',
      criticalUsageScenarios: apiData.criticalScenarios || [],
      
      // 智能状态直接使用API返回的数据
      intelligentStatus: apiData.statusDetail
    };
  }
  
  /**
   * 批量转换时保留原有Mock数据作为fallback
   */
  static mergeWithMockData(apiData: any[], mockData: BaselineInfo[]): BaselineInfo[] {
    const apiMap = new Map(apiData.map(item => [item.baselineId, item]));
    
    return mockData.map(mock => {
      const api = apiMap.get(mock.id);
      if (api) {
        return this.fromApiResponse(api);
      }
      return mock; // 保留mock数据
    });
  }
  
  private static mapStatus(apiStatus: string): 'healthy' | 'outdated' | 'corrupted' {
    const statusMap: Record<string, 'healthy' | 'outdated' | 'corrupted'> = {
      'healthy': 'healthy',
      'optimizable': 'healthy', // 可优化归类为健康
      'outdated': 'outdated',
      'corrupted': 'corrupted',
      'deleted': 'corrupted',   // 已删除归类为损坏
      'unstable': 'outdated',   // 不稳定归类为过时
      'drifting': 'outdated'    // 渐变中归类为过时
    };
    
    return statusMap[apiStatus] || 'healthy';
  }
  
  private static calculateRiskLevel(apiData: any): 'low' | 'high' {
    // 基于多个因素计算风险等级
    if (apiData.status === 'corrupted' || apiData.status === 'deleted') return 'high';
    if (apiData.metrics?.usageCount > 20) return 'high';
    if (apiData.problems?.criticalCount > 0) return 'high';
    return 'low';
  }
}
```

### 2.2 数据加载策略

```typescript
// src/hooks/useBaselines.ts
export const useBaselines = () => {
  const [baselines, setBaselines] = useState<BaselineInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const loadBaselines = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 1. 尝试从API加载
      if (FeatureFlags.USE_REMOTE_STATUS.enabled) {
        try {
          const response = await fetch('/api/baselines');
          if (response.ok) {
            const data = await response.json();
            const apiBaselines = data.data.map(BaselineAdapter.fromApiResponse);
            setBaselines(apiBaselines);
            setLoading(false);
            return;
          }
        } catch (apiError) {
          console.warn('API load failed, falling back to mock', apiError);
        }
      }
      
      // 2. 降级到本地Mock数据
      const mockResponse = await fetch('/baselines.json');
      const mockData = await mockResponse.json();
      setBaselines(mockData.data);
      
    } catch (err) {
      setError(err as Error);
      setBaselines([]); // 确保有空数组
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadBaselines();
  }, []);
  
  return { baselines, loading, error, refresh: loadBaselines };
};
```

## 三、实时更新机制

### 3.1 WebSocket集成

```typescript
// services/websocket.service.ts
export class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private subscribers = new Map<string, Set<(data: any) => void>>();
  
  connect() {
    const wsUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:3000/ws';
    
    this.ws = new WebSocket(wsUrl);
    
    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.authenticate();
    };
    
    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.handleMessage(message);
    };
    
    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.scheduleReconnect();
    };
    
    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }
  
  private authenticate() {
    const token = authManager.getToken();
    if (token && this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'auth',
        token
      }));
    }
  }
  
  private handleMessage(message: any) {
    switch (message.type) {
      case 'baseline-updated':
        this.notify('baseline-update', message.data);
        break;
      case 'analysis-complete':
        this.notify('analysis-complete', message.data);
        break;
      case 'status-changed':
        this.notify('status-change', message.data);
        break;
    }
  }
  
  subscribe(event: string, callback: (data: any) => void) {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, new Set());
    }
    this.subscribers.get(event)!.add(callback);
    
    return () => {
      this.subscribers.get(event)?.delete(callback);
    };
  }
  
  private notify(event: string, data: any) {
    this.subscribers.get(event)?.forEach(callback => callback(data));
  }
  
  private scheduleReconnect() {
    if (this.reconnectTimer) return;
    
    this.reconnectTimer = setTimeout(() => {
      console.log('Attempting to reconnect...');
      this.reconnectTimer = null;
      this.connect();
    }, 5000);
  }
  
  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const wsService = new WebSocketService();
```

### 3.2 实时更新集成

```typescript
// 在基准列表组件中使用
useEffect(() => {
  // 订阅实时更新
  const unsubscribe = wsService.subscribe('baseline-update', (data) => {
    console.log('Baseline updated:', data);
    
    // 更新单个基准
    setBaselines(prev => prev.map(b => 
      b.id === data.baselineId 
        ? BaselineAdapter.fromApiResponse(data)
        : b
    ));
    
    // 显示通知
    message.info(`基准 ${data.component} 已更新`);
  });
  
  return unsubscribe;
}, []);

// 订阅分析完成事件
useEffect(() => {
  const unsubscribe = wsService.subscribe('analysis-complete', (data) => {
    if (data.baselineId === selectedBaseline?.id) {
      // 刷新当前查看的基准数据
      refreshBaselineDetails();
    }
  });
  
  return unsubscribe;
}, [selectedBaseline]);
```

## 四、监控和日志实现

### 4.1 前端监控

```typescript
// utils/monitoring.ts
import * as Sentry from '@sentry/react';

export class MonitoringService {
  static init() {
    if (process.env.REACT_APP_SENTRY_DSN) {
      Sentry.init({
        dsn: process.env.REACT_APP_SENTRY_DSN,
        environment: process.env.NODE_ENV,
        tracesSampleRate: 0.1,
        integrations: [
          new Sentry.BrowserTracing(),
          new Sentry.Replay()
        ]
      });
    }
  }
  
  static trackApiCall(endpoint: string, duration: number, success: boolean) {
    if (window.gtag) {
      window.gtag('event', 'api_call', {
        endpoint,
        duration,
        success
      });
    }
    
    // 性能监控
    if (performance && performance.mark) {
      performance.mark(`api-${endpoint}-end`);
      performance.measure(
        `api-${endpoint}`,
        `api-${endpoint}-start`,
        `api-${endpoint}-end`
      );
    }
  }
  
  static trackFeatureUsage(feature: string, metadata?: any) {
    if (window.gtag) {
      window.gtag('event', 'feature_usage', {
        feature,
        ...metadata
      });
    }
  }
  
  static logError(error: Error, context?: any) {
    console.error('Error:', error, context);
    Sentry.captureException(error, {
      contexts: {
        custom: context
      }
    });
  }
}
```

### 4.2 API调用包装器

```typescript
// utils/apiWrapper.ts
export const apiCall = async <T>(
  name: string,
  apiFunction: () => Promise<T>,
  options?: {
    showError?: boolean;
    retries?: number;
    timeout?: number;
  }
): Promise<T> => {
  const startTime = Date.now();
  performance.mark(`api-${name}-start`);
  
  try {
    const result = await withRetry(apiFunction, options?.retries || 0);
    
    const duration = Date.now() - startTime;
    MonitoringService.trackApiCall(name, duration, true);
    
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    MonitoringService.trackApiCall(name, duration, false);
    MonitoringService.logError(error as Error, { api: name });
    
    if (options?.showError !== false) {
      handleApiError(error, `${name} 请求失败`);
    }
    
    throw error;
  }
};

const withRetry = async <T>(
  fn: () => Promise<T>,
  retries: number
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return withRetry(fn, retries - 1);
    }
    throw error;
  }
};
```

### 4.3 后端日志策略

```typescript
// backend/utils/logger.ts
import winston from 'winston';
import { ElasticsearchTransport } from 'winston-elasticsearch';

const esTransport = new ElasticsearchTransport({
  level: 'info',
  clientOpts: {
    node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200'
  },
  index: 'mdt-logs'
});

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'mdt-backend' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    esTransport
  ]
});

// 请求日志中间件
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('HTTP Request', {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration,
      ip: req.ip,
      userAgent: req.get('user-agent')
    });
  });
  
  next();
};
```

## 五、迁移回滚策略

### 5.1 版本化配置

```json
// config/versions.json
{
  "apiVersions": {
    "v1": {
      "endpoints": {
        "status": "/api/v1/baselines/:id/status",
        "diagnostic": "/api/v1/baselines/:id/diagnostic",
        "suggestions": "/api/v1/baselines/:id/suggestions"
      },
      "deprecated": false,
      "sunset": null
    },
    "v2": {
      "endpoints": {
        "unified": "/api/v2/baselines/:id/analysis"
      },
      "deprecated": false,
      "sunset": "2025-12-31"
    }
  },
  "currentVersion": "v1",
  "rollback": {
    "enabled": true,
    "triggerConditions": {
      "errorRate": 0.05,
      "responseTime": 3000
    }
  }
}
```

### 5.2 自动回滚机制

```typescript
// services/rollback.service.ts
export class RollbackService {
  private metrics = {
    errorCount: 0,
    totalRequests: 0,
    avgResponseTime: 0
  };
  
  recordRequest(success: boolean, responseTime: number) {
    this.metrics.totalRequests++;
    if (!success) this.metrics.errorCount++;
    
    // 计算移动平均响应时间
    this.metrics.avgResponseTime = 
      (this.metrics.avgResponseTime * (this.metrics.totalRequests - 1) + responseTime) 
      / this.metrics.totalRequests;
    
    // 每100个请求检查一次
    if (this.metrics.totalRequests % 100 === 0) {
      this.checkRollbackConditions();
    }
  }
  
  private checkRollbackConditions() {
    const errorRate = this.metrics.errorCount / this.metrics.totalRequests;
    const config = configService.getRollbackConfig();
    
    if (errorRate > config.triggerConditions.errorRate ||
        this.metrics.avgResponseTime > config.triggerConditions.responseTime) {
      
      this.triggerRollback();
    }
  }
  
  private triggerRollback() {
    console.error('Triggering rollback due to high error rate or slow response');
    
    // 1. 切换到本地计算
    FeatureFlags.USE_REMOTE_STATUS.enabled = false;
    FeatureFlags.USE_REMOTE_DIAGNOSTIC.enabled = false;
    FeatureFlags.USE_REMOTE_SUGGESTIONS.enabled = false;
    
    // 2. 通知用户
    notification.warning({
      message: '系统检测到异常',
      description: '已自动切换到本地模式，部分功能可能受限',
      duration: 0
    });
    
    // 3. 上报监控
    MonitoringService.logError(new Error('Auto rollback triggered'), {
      metrics: this.metrics
    });
    
    // 4. 重置计数器
    this.metrics = {
      errorCount: 0,
      totalRequests: 0,
      avgResponseTime: 0
    };
  }
}

export const rollbackService = new RollbackService();
```

## 六、性能优化建议

### 6.1 批量请求优化

```typescript
// services/batchRequest.service.ts
export class BatchRequestService {
  private queue: Map<string, Promise<any>> = new Map();
  private batchTimer: NodeJS.Timeout | null = null;
  private pendingRequests: Array<{
    url: string;
    resolve: (value: any) => void;
    reject: (error: any) => void;
  }> = [];
  
  async get(url: string): Promise<any> {
    // 检查是否已有相同请求
    if (this.queue.has(url)) {
      return this.queue.get(url);
    }
    
    const promise = new Promise((resolve, reject) => {
      this.pendingRequests.push({ url, resolve, reject });
      this.scheduleBatch();
    });
    
    this.queue.set(url, promise);
    return promise;
  }
  
  private scheduleBatch() {
    if (this.batchTimer) return;
    
    this.batchTimer = setTimeout(() => {
      this.executeBatch();
    }, 50); // 50ms延迟批量处理
  }
  
  private async executeBatch() {
    const requests = [...this.pendingRequests];
    this.pendingRequests = [];
    this.batchTimer = null;
    
    try {
      // 批量请求
      const response = await fetch('/api/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authManager.getToken()}`
        },
        body: JSON.stringify({
          requests: requests.map(r => ({ url: r.url }))
        })
      });
      
      const results = await response.json();
      
      // 分发结果
      requests.forEach((req, index) => {
        if (results.data[index].success) {
          req.resolve(results.data[index].data);
        } else {
          req.reject(new Error(results.data[index].error));
        }
        this.queue.delete(req.url);
      });
    } catch (error) {
      requests.forEach(req => {
        req.reject(error);
        this.queue.delete(req.url);
      });
    }
  }
}
```

## 七、部署检查清单

### 7.1 上线前检查

```yaml
# deployment-checklist.yml
pre-deployment:
  - name: 环境变量配置
    checks:
      - REACT_APP_API_URL 已设置
      - REACT_APP_WS_URL 已设置
      - REACT_APP_USE_REMOTE_STATUS 设为 false（初始）
      - JWT_SECRET 已配置
      - DATABASE_URL 已配置
      
  - name: 数据库迁移
    checks:
      - 所有migration已执行
      - 索引已创建
      - 初始数据已导入
      
  - name: 依赖服务
    checks:
      - Redis服务运行正常
      - Elasticsearch服务运行正常
      - CDN配置完成
      
  - name: 监控配置
    checks:
      - Sentry项目已创建
      - 日志收集已配置
      - 告警规则已设置

post-deployment:
  - name: 功能验证
    checks:
      - API健康检查通过
      - WebSocket连接正常
      - 基本功能测试通过
      
  - name: 性能验证
    checks:
      - API响应时间 < 500ms
      - 页面加载时间 < 3s
      - 错误率 < 1%
      
  - name: 回滚准备
    checks:
      - 回滚脚本已准备
      - 数据库备份完成
      - 回滚触发条件已配置
```

这个运维补充文档涵盖了实施过程中的关键运维考虑，确保系统能够平稳上线和运行。