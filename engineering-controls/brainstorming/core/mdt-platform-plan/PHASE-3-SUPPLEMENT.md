# Phase 3: Web可视化管理 - 实施细节补充

## 🔧 技术实施细节

### 1. 项目初始化步骤

#### 1.1 创建前端项目
```bash
# 创建项目
npm create vite@latest mdt-web -- --template react-ts
cd mdt-web

# 安装核心依赖
npm install react react-dom react-router-dom@6
npm install antd@5 @ant-design/icons
npm install zustand axios
npm install socket.io-client
npm install echarts echarts-for-react
npm install dayjs classnames

# 开发依赖
npm install -D @types/react @types/react-dom
npm install -D eslint prettier
npm install -D @vitejs/plugin-react
```

#### 1.2 项目配置文件

**vite.config.ts**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'http://localhost:3001',
        ws: true,
      },
    },
  },
});
```

**tsconfig.json**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 2. 目录结构详细说明

```
mdt-web/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/          # 静态资源
│   │   ├── images/
│   │   └── styles/
│   │       ├── index.css
│   │       ├── variables.css
│   │       └── antd-overrides.css
│   ├── components/      # 通用组件
│   │   ├── Layout/
│   │   │   ├── index.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── layout.module.css
│   │   ├── Table/
│   │   │   ├── index.tsx
│   │   │   ├── TableActions.tsx
│   │   │   └── TableFilters.tsx
│   │   ├── Form/
│   │   │   ├── index.tsx
│   │   │   ├── FormItem.tsx
│   │   │   └── validators.ts
│   │   └── Common/
│   │       ├── Loading.tsx
│   │       ├── ErrorBoundary.tsx
│   │       └── ConfirmModal.tsx
│   ├── pages/          # 页面组件
│   │   ├── Dashboard/
│   │   │   ├── index.tsx
│   │   │   ├── components/
│   │   │   │   ├── StatsCard.tsx
│   │   │   │   ├── RequestChart.tsx
│   │   │   │   └── RecentActivity.tsx
│   │   │   └── dashboard.module.css
│   │   ├── Mocks/
│   │   │   ├── index.tsx
│   │   │   ├── MockList.tsx
│   │   │   ├── MockEditor.tsx
│   │   │   ├── MockTester.tsx
│   │   │   └── components/
│   │   │       ├── MockForm.tsx
│   │   │       ├── ResponseBuilder.tsx
│   │   │       └── MockPreview.tsx
│   │   ├── Scenarios/
│   │   │   ├── index.tsx
│   │   │   ├── ScenarioList.tsx
│   │   │   ├── ScenarioEditor.tsx
│   │   │   ├── ScenarioSwitcher.tsx
│   │   │   └── components/
│   │   │       ├── ScenarioCard.tsx
│   │   │       ├── VariableEditor.tsx
│   │   │       └── MockAssociation.tsx
│   │   └── Monitor/
│   │       ├── index.tsx
│   │       ├── RequestLog.tsx
│   │       ├── PerformanceAnalysis.tsx
│   │       └── ErrorTracking.tsx
│   ├── services/        # API服务层
│   │   ├── api.ts      # axios实例配置
│   │   ├── mockService.ts
│   │   ├── scenarioService.ts
│   │   ├── monitorService.ts
│   │   └── types/      # TypeScript类型定义
│   │       ├── mock.ts
│   │       ├── scenario.ts
│   │       └── common.ts
│   ├── stores/         # Zustand状态管理
│   │   ├── mockStore.ts
│   │   ├── scenarioStore.ts
│   │   ├── monitorStore.ts
│   │   └── uiStore.ts
│   ├── hooks/          # 自定义Hooks
│   │   ├── useSocket.ts
│   │   ├── useDebounce.ts
│   │   ├── useLocalStorage.ts
│   │   └── useAsync.ts
│   ├── utils/          # 工具函数
│   │   ├── format.ts
│   │   ├── validators.ts
│   │   ├── constants.ts
│   │   └── helpers.ts
│   ├── routes/         # 路由配置
│   │   └── index.tsx
│   ├── App.tsx
│   └── main.tsx
├── .env.development
├── .env.production
└── package.json
```

### 3. 核心功能实现细节

#### 3.1 WebSocket实时通信

**src/hooks/useSocket.ts**
```typescript
import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useMonitorStore } from '@/stores/monitorStore';

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const { addRequestLog, updateMetrics } = useMonitorStore();

  useEffect(() => {
    // 创建Socket连接
    socketRef.current = io(import.meta.env.VITE_WS_URL || 'http://localhost:3001', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    const socket = socketRef.current;

    // 连接事件
    socket.on('connect', () => {
      console.log('WebSocket connected');
      // 订阅需要的频道
      socket.emit('subscribe', 'requests');
      socket.emit('subscribe', 'metrics');
      socket.emit('subscribe', 'scenarios');
    });

    // 处理实时数据
    socket.on('request:log', (log) => {
      addRequestLog(log);
    });

    socket.on('metrics:update', (metrics) => {
      updateMetrics(metrics);
    });

    // 清理函数
    return () => {
      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, []);

  const subscribe = useCallback((channel: string) => {
    socketRef.current?.emit('subscribe', channel);
  }, []);

  const unsubscribe = useCallback((channel: string) => {
    socketRef.current?.emit('unsubscribe', channel);
  }, []);

  return {
    socket: socketRef.current,
    subscribe,
    unsubscribe,
  };
};
```

#### 3.2 Mock编辑器Visual模式

**src/pages/Mocks/components/ResponseBuilder.tsx**
```typescript
import React, { useState } from 'react';
import { Form, Input, Select, Button, Space, Card, InputNumber } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import JsonEditor from '@/components/JsonEditor';

interface ResponseBuilderProps {
  value?: any;
  onChange?: (value: any) => void;
}

const ResponseBuilder: React.FC<ResponseBuilderProps> = ({ value = {}, onChange }) => {
  const [mode, setMode] = useState<'visual' | 'json'>('visual');
  
  const handleFieldChange = (field: string, val: any) => {
    onChange?.({
      ...value,
      [field]: val,
    });
  };

  const addHeader = () => {
    const headers = value.headers || {};
    const newKey = `header-${Date.now()}`;
    onChange?.({
      ...value,
      headers: {
        ...headers,
        [newKey]: '',
      },
    });
  };

  if (mode === 'json') {
    return (
      <div>
        <Space style={{ marginBottom: 16 }}>
          <Button onClick={() => setMode('visual')}>Visual模式</Button>
        </Space>
        <JsonEditor
          value={value}
          onChange={onChange}
          height={400}
        />
      </div>
    );
  }

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={() => setMode('json')}>JSON模式</Button>
      </Space>
      
      <Form.Item label="状态码">
        <InputNumber
          value={value.status || 200}
          onChange={(val) => handleFieldChange('status', val)}
          min={100}
          max={599}
        />
      </Form.Item>

      <Form.Item label="响应延迟(ms)">
        <InputNumber
          value={value.delay || 0}
          onChange={(val) => handleFieldChange('delay', val)}
          min={0}
          max={60000}
        />
      </Form.Item>

      <Form.Item label="响应头">
        <Card size="small">
          {Object.entries(value.headers || {}).map(([key, val]) => (
            <Space key={key} style={{ marginBottom: 8, width: '100%' }}>
              <Input
                placeholder="Header Name"
                value={key}
                onChange={(e) => {
                  const newHeaders = { ...value.headers };
                  delete newHeaders[key];
                  newHeaders[e.target.value] = val;
                  handleFieldChange('headers', newHeaders);
                }}
              />
              <Input
                placeholder="Header Value"
                value={val as string}
                onChange={(e) => {
                  handleFieldChange('headers', {
                    ...value.headers,
                    [key]: e.target.value,
                  });
                }}
              />
              <Button
                icon={<DeleteOutlined />}
                danger
                onClick={() => {
                  const newHeaders = { ...value.headers };
                  delete newHeaders[key];
                  handleFieldChange('headers', newHeaders);
                }}
              />
            </Space>
          ))}
          <Button
            type="dashed"
            onClick={addHeader}
            block
            icon={<PlusOutlined />}
          >
            添加响应头
          </Button>
        </Card>
      </Form.Item>

      <Form.Item label="响应体">
        <JsonEditor
          value={value.body || {}}
          onChange={(val) => handleFieldField('body', val)}
          height={300}
        />
      </Form.Item>
    </div>
  );
};

export default ResponseBuilder;
```

#### 3.3 实时图表组件

**src/pages/Dashboard/components/RequestChart.tsx**
```typescript
import React, { useEffect, useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import { useMonitorStore } from '@/stores/monitorStore';

const RequestChart: React.FC = () => {
  const { realtimeData } = useMonitorStore();
  const chartRef = useRef<any>(null);

  const option = {
    title: {
      text: '请求量趋势',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    legend: {
      data: ['请求量', '响应时间'],
      bottom: 0,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: realtimeData.timestamps,
    },
    yAxis: [
      {
        type: 'value',
        name: '请求量',
        axisLabel: {
          formatter: '{value} 次',
        },
      },
      {
        type: 'value',
        name: '响应时间',
        axisLabel: {
          formatter: '{value} ms',
        },
      },
    ],
    series: [
      {
        name: '请求量',
        type: 'line',
        smooth: true,
        data: realtimeData.requests,
        areaStyle: {
          opacity: 0.3,
        },
      },
      {
        name: '响应时间',
        type: 'line',
        smooth: true,
        yAxisIndex: 1,
        data: realtimeData.responseTime,
        lineStyle: {
          color: '#52c41a',
        },
      },
    ],
  };

  // 自动更新图表
  useEffect(() => {
    const timer = setInterval(() => {
      if (chartRef.current) {
        const instance = chartRef.current.getEchartsInstance();
        instance.setOption(option);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [realtimeData]);

  return <ReactECharts ref={chartRef} option={option} style={{ height: 400 }} />;
};

export default RequestChart;
```

### 4. 后端WebSocket集成

#### 4.1 修改主服务器支持WebSocket

**src/server/index.js 修改**
```javascript
const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const WebSocketService = require('./websocket');
const config = require('./utils/config');
const logger = require('./utils/logger');

const app = express();
const server = createServer(app);
const PORT = config.get('port');

// 初始化WebSocket
const wsService = new WebSocketService(server);
app.locals.wsService = wsService;

// ... 其他中间件配置 ...

// 在代理中间件中集成WebSocket
app.use('/', (req, res, next) => {
  req.wsService = wsService;
  return require('./proxy/middleware')(req, res, next);
});

// 启动服务器
server.listen(PORT, () => {
  logger.info(`🚀 MDT Mock Server started successfully!`);
  logger.info(`📡 Server running on http://localhost:${PORT}`);
  logger.info(`🔌 WebSocket ready on ws://localhost:${PORT}`);
});
```

#### 4.2 请求日志推送

**src/server/proxy/middleware.js 修改**
```javascript
async handleRequest(req, res, next) {
  try {
    const startTime = Date.now();
    
    // ... 现有逻辑 ...
    
    // 记录请求并推送WebSocket
    const requestLog = {
      id: generateId(),
      method: req.method,
      url: req.url,
      timestamp: new Date().toISOString(),
      duration: Date.now() - startTime,
      status: res.statusCode,
      mockId: mock?.id || null,
    };
    
    await this.logRequest(req, mock?.id);
    
    // 推送到WebSocket
    if (req.wsService) {
      req.wsService.emitRequestLog(requestLog);
    }
    
  } catch (error) {
    // ... 错误处理 ...
  }
}
```

### 5. 部署配置

#### 5.1 环境变量配置

**.env.development**
```
VITE_API_URL=http://localhost:3001
VITE_WS_URL=http://localhost:3001
```

**.env.production**
```
VITE_API_URL=/api
VITE_WS_URL=/
```

#### 5.2 构建脚本

**package.json**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\"",
    "type-check": "tsc --noEmit"
  }
}
```

#### 5.3 Nginx配置示例

```nginx
server {
    listen 80;
    server_name mdt.example.com;

    # 前端静态文件
    location / {
        root /var/www/mdt-web/dist;
        try_files $uri $uri/ /index.html;
    }

    # API代理
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket代理
    location /socket.io {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 6. 测试策略

#### 6.1 单元测试配置

**vitest.config.ts**
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

#### 6.2 组件测试示例

**src/components/Table/Table.test.tsx**
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Table from './index';

describe('Table Component', () => {
  const mockData = [
    { id: 1, name: 'Mock 1', method: 'GET' },
    { id: 2, name: 'Mock 2', method: 'POST' },
  ];

  it('should render table with data', () => {
    render(<Table data={mockData} />);
    expect(screen.getByText('Mock 1')).toBeInTheDocument();
    expect(screen.getByText('Mock 2')).toBeInTheDocument();
  });

  it('should handle row selection', () => {
    const onSelect = vi.fn();
    render(<Table data={mockData} onSelect={onSelect} />);
    
    fireEvent.click(screen.getByText('Mock 1'));
    expect(onSelect).toHaveBeenCalledWith(mockData[0]);
  });
});
```

### 7. 性能优化清单

1. **代码分割**
   - 路由级别的懒加载
   - 大型组件的动态导入
   - 第三方库的按需加载

2. **缓存策略**
   - API响应缓存
   - 静态资源缓存
   - Service Worker离线缓存

3. **渲染优化**
   - 虚拟列表实现
   - React.memo优化
   - useMemo/useCallback使用

4. **网络优化**
   - 请求合并
   - 数据预加载
   - WebSocket连接池

### 8. 常见问题解决方案

#### Q1: CORS跨域问题
在开发环境使用Vite的proxy配置，生产环境使用Nginx反向代理。

#### Q2: WebSocket连接不稳定
实现自动重连机制，使用心跳检测保持连接。

#### Q3: 大数据量渲染卡顿
使用虚拟滚动库如react-window或rc-virtual-list。

#### Q4: 状态管理复杂
合理划分store，使用中间件处理异步逻辑。

---

## 🎯 实施检查清单

- [ ] 项目初始化完成
- [ ] 基础组件开发完成
- [ ] API服务层实现
- [ ] WebSocket集成测试通过
- [ ] Mock管理界面功能完整
- [ ] 场景管理界面功能完整
- [ ] Dashboard实时数据展示正常
- [ ] 性能指标达标（<500ms响应）
- [ ] 生产环境部署配置完成
- [ ] 用户文档编写完成

通过这份补充文档，Phase 3的实施应该可以顺利进行！