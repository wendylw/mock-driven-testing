# Phase 3: Web可视化管理 - 详细实施计划

## 📚 相关文档

- **技术实施细节**：[PHASE-3-SUPPLEMENT.md](./PHASE-3-SUPPLEMENT.md) - 包含项目初始化、目录结构、核心组件实现等详细代码
- **总体计划**：[MDT-PHASED-IMPLEMENTATION-PLAN.md](./MDT-PHASED-IMPLEMENTATION-PLAN.md) - 查看Phase 3在整体计划中的位置

## 🎯 Phase 3 目标

实现直观的Web管理界面，让Mock管理变得简单高效：
- 可视化Mock管理覆盖率 100%
- 页面响应时间 < 500ms
- 实时数据更新延迟 < 100ms

## 🔑 核心概念

### 为什么需要可视化？

1. **降低使用门槛**：非技术人员也能管理Mock
2. **提升效率**：拖拽操作比编写JSON快10倍
3. **实时监控**：一眼看清系统状态
4. **团队协作**：共享Mock配置和场景

### 技术选型

```javascript
// 前端技术栈
{
  "framework": "React 18", // 组件化、高性能
  "ui": "Ant Design 5", // 企业级UI组件库
  "state": "Zustand", // 轻量级状态管理
  "charts": "ECharts", // 强大的图表库
  "realtime": "Socket.io", // 实时通信
  "bundler": "Vite", // 快速构建工具
}
```

## 📊 UI/UX设计

### 页面结构

```
MDT Platform
├── Dashboard (仪表盘)
│   ├── 系统概览
│   ├── 实时请求监控
│   └── 快速操作面板
├── Mocks (Mock管理)
│   ├── Mock列表
│   ├── Mock编辑器
│   └── Mock测试器
├── Scenarios (场景管理)
│   ├── 场景列表
│   ├── 场景编辑器
│   └── 场景切换器
├── Monitor (监控中心)
│   ├── 请求日志
│   ├── 性能分析
│   └── 错误追踪
└── Settings (设置)
    ├── 代理配置
    ├── 用户管理
    └── 系统设置
```

### 核心功能设计

#### 1. Dashboard设计
```javascript
// 仪表盘数据结构
{
  overview: {
    totalMocks: 156,
    activeMocks: 142,
    totalScenarios: 12,
    activeScenario: "正常用户场景",
    todayRequests: 15234,
    mockHitRate: 89.5, // 百分比
    avgResponseTime: 23 // ms
  },
  realtimeData: {
    requestsPerSecond: [],
    responseTimeChart: [],
    topEndpoints: [],
    recentErrors: []
  },
  quickActions: [
    { action: "switchScenario", label: "切换场景" },
    { action: "createMock", label: "创建Mock" },
    { action: "viewLogs", label: "查看日志" }
  ]
}
```

#### 2. Mock编辑器设计
```javascript
// Mock编辑器功能
{
  editor: {
    mode: "visual", // visual | json | split
    features: [
      "语法高亮",
      "自动补全",
      "实时预览",
      "模板变量",
      "响应构建器"
    ]
  },
  responseBuilder: {
    presets: ["成功响应", "错误响应", "空数据"],
    dataGenerators: ["随机数据", "序列数据", "时间戳"],
    validators: ["JSON验证", "Schema验证"]
  }
}
```

## 📅 Week 5: 前端基础架构

### Day 1-2: 项目初始化和基础组件

#### 任务清单
```javascript
// 1. 项目搭建
- [ ] 使用Vite创建React项目
- [ ] 配置TypeScript
- [ ] 集成Ant Design
- [ ] 设置路由系统
- [ ] 配置状态管理

// 2. 基础组件开发
- [ ] Layout组件（侧边栏、顶栏）
- [ ] 通用表格组件
- [ ] 通用表单组件
- [ ] 加载和错误组件
- [ ] 确认对话框组件

// 3. API客户端
- [ ] 封装HTTP客户端
- [ ] 定义API接口
- [ ] 错误处理机制
- [ ] 请求拦截器
```

#### 项目结构
```
src/
├── components/          # 通用组件
│   ├── Layout/
│   ├── Table/
│   ├── Form/
│   └── Common/
├── pages/              # 页面组件
│   ├── Dashboard/
│   ├── Mocks/
│   ├── Scenarios/
│   └── Monitor/
├── services/           # API服务
│   ├── api.js
│   ├── mockService.js
│   └── scenarioService.js
├── stores/             # 状态管理
│   ├── mockStore.js
│   └── scenarioStore.js
├── utils/              # 工具函数
├── styles/             # 样式文件
└── App.jsx             # 主应用
```

#### 基础代码实现

**package.json**
```json
{
  "name": "mdt-web",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "antd": "^5.12.0",
    "zustand": "^4.4.0",
    "axios": "^1.6.0",
    "socket.io-client": "^4.5.0",
    "echarts": "^5.4.0",
    "echarts-for-react": "^3.0.0",
    "@ant-design/icons": "^5.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0",
    "typescript": "^5.3.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0"
  }
}
```

**src/services/api.js**
```javascript
import axios from 'axios';
import { message } from 'antd';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
api.interceptors.request.use(
  config => {
    // 可以在这里添加token等
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    const errorMsg = error.response?.data?.message || '请求失败';
    message.error(errorMsg);
    return Promise.reject(error);
  }
);

export default api;
```

**src/stores/mockStore.js**
```javascript
import { create } from 'zustand';
import { mockService } from '../services/mockService';

const useMockStore = create((set, get) => ({
  mocks: [],
  loading: false,
  selectedMock: null,
  filters: {
    search: '',
    method: '',
    active: null
  },

  // 获取Mock列表
  fetchMocks: async () => {
    set({ loading: true });
    try {
      const data = await mockService.getMocks(get().filters);
      set({ mocks: data.mocks, loading: false });
    } catch (error) {
      set({ loading: false });
    }
  },

  // 创建Mock
  createMock: async (mockData) => {
    try {
      const newMock = await mockService.createMock(mockData);
      set(state => ({
        mocks: [...state.mocks, newMock]
      }));
      message.success('Mock创建成功');
      return newMock;
    } catch (error) {
      throw error;
    }
  },

  // 更新Mock
  updateMock: async (id, mockData) => {
    try {
      const updatedMock = await mockService.updateMock(id, mockData);
      set(state => ({
        mocks: state.mocks.map(m => m.id === id ? updatedMock : m),
        selectedMock: state.selectedMock?.id === id ? updatedMock : state.selectedMock
      }));
      message.success('Mock更新成功');
      return updatedMock;
    } catch (error) {
      throw error;
    }
  },

  // 删除Mock
  deleteMock: async (id) => {
    try {
      await mockService.deleteMock(id);
      set(state => ({
        mocks: state.mocks.filter(m => m.id !== id),
        selectedMock: state.selectedMock?.id === id ? null : state.selectedMock
      }));
      message.success('Mock删除成功');
    } catch (error) {
      throw error;
    }
  },

  // 设置选中的Mock
  setSelectedMock: (mock) => set({ selectedMock: mock }),

  // 更新过滤器
  setFilters: (filters) => {
    set({ filters: { ...get().filters, ...filters } });
    get().fetchMocks();
  }
}));

export default useMockStore;
```

### Day 3-4: Mock管理界面

#### 任务清单
```javascript
// 1. Mock列表页面
- [ ] 高级搜索过滤
- [ ] 批量操作功能
- [ ] 导入导出功能
- [ ] 快速启用/禁用
- [ ] 拖拽排序

// 2. Mock编辑器
- [ ] Visual编辑模式
- [ ] JSON编辑模式
- [ ] 分屏对比模式
- [ ] 模板变量提示
- [ ] 响应预览

// 3. Mock测试器
- [ ] 请求构建器
- [ ] 发送测试请求
- [ ] 响应查看器
- [ ] 历史记录
- [ ] cURL导入
```

#### Mock列表组件

**src/pages/Mocks/MockList.jsx**
```javascript
import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Input, Select, Tag, Switch, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import useMockStore from '../../stores/mockStore';
import MockEditor from './MockEditor';

const { Search } = Input;
const { Option } = Select;

const MockList = () => {
  const { mocks, loading, fetchMocks, deleteMock, updateMock, setFilters } = useMockStore();
  const [editorVisible, setEditorVisible] = useState(false);
  const [editingMock, setEditingMock] = useState(null);

  useEffect(() => {
    fetchMocks();
  }, []);

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text, record) => (
        <a onClick={() => handleEdit(record)}>{text}</a>
      )
    },
    {
      title: '方法',
      dataIndex: 'method',
      key: 'method',
      width: 80,
      render: method => (
        <Tag color={getMethodColor(method)}>{method}</Tag>
      )
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
      ellipsis: true
    },
    {
      title: '状态码',
      dataIndex: ['response', 'status'],
      key: 'status',
      width: 80,
      render: status => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      )
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 80,
      sorter: (a, b) => a.priority - b.priority
    },
    {
      title: '激活',
      dataIndex: 'active',
      key: 'active',
      width: 80,
      render: (active, record) => (
        <Switch
          checked={active}
          onChange={(checked) => handleToggleActive(record.id, checked)}
        />
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="确定删除这个Mock吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      )
    }
  ];

  const handleEdit = (mock) => {
    setEditingMock(mock);
    setEditorVisible(true);
  };

  const handleCreate = () => {
    setEditingMock(null);
    setEditorVisible(true);
  };

  const handleDelete = async (id) => {
    await deleteMock(id);
  };

  const handleToggleActive = async (id, active) => {
    await updateMock(id, { active });
  };

  const getMethodColor = (method) => {
    const colors = {
      GET: 'green',
      POST: 'blue',
      PUT: 'orange',
      DELETE: 'red',
      PATCH: 'purple'
    };
    return colors[method] || 'default';
  };

  const getStatusColor = (status) => {
    if (status >= 200 && status < 300) return 'success';
    if (status >= 300 && status < 400) return 'processing';
    if (status >= 400 && status < 500) return 'warning';
    if (status >= 500) return 'error';
    return 'default';
  };

  return (
    <div className="mock-list">
      <div className="mock-list-header">
        <Space>
          <Search
            placeholder="搜索Mock名称或URL"
            onSearch={(value) => setFilters({ search: value })}
            style={{ width: 300 }}
          />
          <Select
            placeholder="方法"
            style={{ width: 120 }}
            allowClear
            onChange={(value) => setFilters({ method: value })}
          >
            <Option value="GET">GET</Option>
            <Option value="POST">POST</Option>
            <Option value="PUT">PUT</Option>
            <Option value="DELETE">DELETE</Option>
            <Option value="PATCH">PATCH</Option>
          </Select>
          <Select
            placeholder="状态"
            style={{ width: 120 }}
            allowClear
            onChange={(value) => setFilters({ active: value })}
          >
            <Option value={true}>激活</Option>
            <Option value={false}>未激活</Option>
          </Select>
        </Space>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
        >
          创建Mock
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={mocks}
        loading={loading}
        rowKey="id"
        pagination={{
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`
        }}
      />

      <MockEditor
        visible={editorVisible}
        mock={editingMock}
        onClose={() => setEditorVisible(false)}
        onSuccess={() => {
          setEditorVisible(false);
          fetchMocks();
        }}
      />
    </div>
  );
};

export default MockList;
```

### Day 5: 场景管理界面

#### 任务清单
```javascript
// 1. 场景列表
- [ ] 场景卡片视图
- [ ] 场景继承关系图
- [ ] 快速切换功能
- [ ] 场景标签管理
- [ ] 场景搜索过滤

// 2. 场景编辑器
- [ ] 可视化变量配置
- [ ] Mock关联管理
- [ ] 继承关系设置
- [ ] 场景预览
- [ ] 场景模板

// 3. 场景切换器
- [ ] 一键切换
- [ ] 切换历史
- [ ] 切换预览
- [ ] 批量切换
```

## 📅 Week 6: 实时监控和数据可视化

### Day 1-2: 实时通信系统

#### 任务清单
```javascript
// 1. WebSocket集成
- [ ] Socket.io客户端配置
- [ ] 连接管理
- [ ] 断线重连
- [ ] 心跳检测

// 2. 实时数据流
- [ ] 请求日志推送
- [ ] 状态变更通知
- [ ] 性能指标更新
- [ ] 错误告警

// 3. 数据缓存
- [ ] 本地状态同步
- [ ] 增量更新
- [ ] 数据压缩
- [ ] 历史数据管理
```

#### WebSocket服务实现

**src/server/websocket/index.js**
```javascript
const { Server } = require('socket.io');
const logger = require('../utils/logger');

class WebSocketService {
  constructor(server) {
    this.io = new Server(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });

    this.clients = new Map();
    this.setupHandlers();
  }

  setupHandlers() {
    this.io.on('connection', (socket) => {
      logger.info(`Client connected: ${socket.id}`);
      this.clients.set(socket.id, { socket, subscriptions: new Set() });

      socket.on('subscribe', (channel) => {
        this.subscribe(socket.id, channel);
      });

      socket.on('unsubscribe', (channel) => {
        this.unsubscribe(socket.id, channel);
      });

      socket.on('disconnect', () => {
        logger.info(`Client disconnected: ${socket.id}`);
        this.clients.delete(socket.id);
      });
    });
  }

  subscribe(clientId, channel) {
    const client = this.clients.get(clientId);
    if (client) {
      client.subscriptions.add(channel);
      client.socket.join(channel);
    }
  }

  unsubscribe(clientId, channel) {
    const client = this.clients.get(clientId);
    if (client) {
      client.subscriptions.delete(channel);
      client.socket.leave(channel);
    }
  }

  // 发送请求日志
  emitRequestLog(log) {
    this.io.to('requests').emit('request:log', {
      id: log.id,
      method: log.method,
      url: log.url,
      status: log.status,
      duration: log.duration,
      timestamp: log.timestamp,
      mockId: log.mockId
    });
  }

  // 发送Mock变更
  emitMockChange(event, mock) {
    this.io.to('mocks').emit(`mock:${event}`, mock);
  }

  // 发送场景切换
  emitScenarioSwitch(scenario) {
    this.io.to('scenarios').emit('scenario:switched', scenario);
  }

  // 发送性能指标
  emitMetrics(metrics) {
    this.io.to('metrics').emit('metrics:update', metrics);
  }

  // 发送系统告警
  emitAlert(alert) {
    this.io.emit('alert', alert);
  }
}

module.exports = WebSocketService;
```

### Day 3-4: 数据可视化

#### 任务清单
```javascript
// 1. 仪表盘图表
- [ ] 请求量趋势图
- [ ] 响应时间分布
- [ ] Mock命中率饼图
- [ ] Top端点排行
- [ ] 错误率曲线

// 2. 监控图表
- [ ] 实时请求流
- [ ] 性能火焰图
- [ ] 错误分布图
- [ ] 场景使用统计

// 3. 交互功能
- [ ] 图表缩放
- [ ] 数据下钻
- [ ] 时间范围选择
- [ ] 数据导出
```

#### Dashboard组件

**src/pages/Dashboard/index.jsx**
```javascript
import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Space } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { useSocket } from '../../hooks/useSocket';
import './dashboard.less';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalMocks: 0,
    activeMocks: 0,
    totalRequests: 0,
    avgResponseTime: 0,
    mockHitRate: 0,
    errorRate: 0
  });

  const [realtimeData, setRealtimeData] = useState({
    requests: [],
    responseTime: [],
    timestamps: []
  });

  const socket = useSocket();

  useEffect(() => {
    // 订阅实时数据
    socket.subscribe('metrics');
    socket.on('metrics:update', handleMetricsUpdate);

    // 获取初始数据
    fetchDashboardData();

    return () => {
      socket.unsubscribe('metrics');
      socket.off('metrics:update', handleMetricsUpdate);
    };
  }, []);

  const handleMetricsUpdate = (metrics) => {
    setStats(prev => ({
      ...prev,
      ...metrics.current
    }));

    setRealtimeData(prev => {
      const newData = {
        requests: [...prev.requests, metrics.requestsPerSecond].slice(-60),
        responseTime: [...prev.responseTime, metrics.avgResponseTime].slice(-60),
        timestamps: [...prev.timestamps, new Date().toLocaleTimeString()].slice(-60)
      };
      return newData;
    });
  };

  const requestTrendOption = {
    title: { text: '请求量趋势' },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: realtimeData.timestamps
    },
    yAxis: { type: 'value' },
    series: [{
      data: realtimeData.requests,
      type: 'line',
      smooth: true,
      areaStyle: {}
    }]
  };

  const responseTimeOption = {
    title: { text: '响应时间分布' },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: realtimeData.timestamps
    },
    yAxis: {
      type: 'value',
      axisLabel: { formatter: '{value} ms' }
    },
    series: [{
      data: realtimeData.responseTime,
      type: 'line',
      smooth: true,
      lineStyle: { color: '#52c41a' }
    }]
  };

  const mockHitRateOption = {
    title: { text: 'Mock命中率' },
    tooltip: { trigger: 'item' },
    series: [{
      type: 'pie',
      radius: '50%',
      data: [
        { value: stats.mockHitRate, name: '命中' },
        { value: 100 - stats.mockHitRate, name: '未命中' }
      ]
    }]
  };

  return (
    <div className="dashboard">
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总Mock数"
              value={stats.totalMocks}
              suffix="个"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="激活Mock数"
              value={stats.activeMocks}
              valueStyle={{ color: '#3f8600' }}
              suffix="个"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日请求"
              value={stats.totalRequests}
              prefix={<ArrowUpOutlined />}
              suffix="次"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均响应时间"
              value={stats.avgResponseTime}
              precision={2}
              suffix="ms"
              prefix={stats.avgResponseTime < 100 ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
              valueStyle={{ color: stats.avgResponseTime < 100 ? '#3f8600' : '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card>
            <ReactECharts option={requestTrendOption} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <ReactECharts option={responseTimeOption} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={8}>
          <Card>
            <ReactECharts option={mockHitRateOption} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col span={16}>
          <Card title="最近请求">
            <RequestList />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
```

### Day 5: 集成测试和优化

#### 任务清单
```javascript
// 1. 功能测试
- [ ] Mock CRUD测试
- [ ] 场景切换测试
- [ ] 实时更新测试
- [ ] 图表交互测试

// 2. 性能优化
- [ ] 懒加载优化
- [ ] 虚拟滚动
- [ ] 图表渲染优化
- [ ] WebSocket优化

// 3. 用户体验
- [ ] 加载状态
- [ ] 错误提示
- [ ] 操作反馈
- [ ] 快捷键支持
```

## 🔧 技术实现要点

### 1. 状态管理策略
```javascript
// 全局状态分层
stores/
├── mockStore.js      // Mock相关状态
├── scenarioStore.js  // 场景相关状态
├── monitorStore.js   // 监控数据状态
└── uiStore.js        // UI状态（主题、布局等）

// 状态更新优化
const optimizedUpdate = (state, updates) => {
  // 使用immer进行不可变更新
  return produce(state, draft => {
    Object.assign(draft, updates);
  });
};
```

### 2. 实时数据处理
```javascript
// 数据节流和防抖
const throttledUpdate = throttle((data) => {
  updateChart(data);
}, 100);

// 数据聚合
const aggregateMetrics = (dataPoints) => {
  return dataPoints.reduce((acc, point) => {
    acc.sum += point.value;
    acc.count += 1;
    acc.avg = acc.sum / acc.count;
    return acc;
  }, { sum: 0, count: 0, avg: 0 });
};
```

### 3. 性能优化技巧
```javascript
// 虚拟列表
import { VirtualList } from '@tanstack/react-virtual';

// 图表懒加载
const Chart = lazy(() => import('./Chart'));

// 组件缓存
const MemoizedMockItem = memo(MockItem, (prev, next) => {
  return prev.mock.updatedAt === next.mock.updatedAt;
});
```

## 🎯 Phase 3 交付物

### 核心功能
1. ✅ 完整的Web管理界面
   - Mock可视化管理
   - 场景切换控制
   - 实时请求监控

2. ✅ 数据可视化
   - 实时图表
   - 性能分析
   - 使用统计

3. ✅ 实时通信
   - WebSocket集成
   - 实时数据推送
   - 状态同步

4. ✅ 用户体验
   - 响应式设计
   - 快捷操作
   - 丰富反馈

### 性能指标
- 页面加载时间 < 2s
- 页面响应时间 < 500ms
- 实时数据延迟 < 100ms
- 支持1000+ Mock管理

## 📋 测试计划

### 单元测试
```javascript
describe('Mock Management', () => {
  it('should create mock successfully');
  it('should update mock in realtime');
  it('should handle batch operations');
});

describe('Dashboard', () => {
  it('should display realtime metrics');
  it('should update charts smoothly');
  it('should handle WebSocket reconnection');
});
```

### E2E测试
```javascript
describe('User Flow', () => {
  it('should complete mock creation flow');
  it('should switch scenarios quickly');
  it('should show realtime updates');
});
```

## 🚀 开始实施

### Week 5 立即行动
```bash
# 1. 创建前端项目
npm create vite@latest mdt-web -- --template react-ts
cd mdt-web

# 2. 安装依赖
npm install antd zustand axios socket.io-client echarts echarts-for-react

# 3. 启动开发
npm run dev
```

**⚠️ 重要提示**：
1. 项目初始化的详细步骤请查看 [PHASE-3-SUPPLEMENT.md#1-项目初始化步骤](./PHASE-3-SUPPLEMENT.md#1-项目初始化步骤)
2. 目录结构说明请查看 [PHASE-3-SUPPLEMENT.md#2-目录结构详细说明](./PHASE-3-SUPPLEMENT.md#2-目录结构详细说明)
3. WebSocket实现代码请查看 [PHASE-3-SUPPLEMENT.md#31-websocket实时通信](./PHASE-3-SUPPLEMENT.md#31-websocket实时通信)
4. 部署配置请查看 [PHASE-3-SUPPLEMENT.md#5-部署配置](./PHASE-3-SUPPLEMENT.md#5-部署配置)

### Week 6 后续任务
- 实现WebSocket通信
- 完成数据可视化
- 优化性能体验
- 部署上线

## 💡 关键创新点

1. **可视化Mock编辑器**
   - 拖拽式响应构建
   - 实时预览
   - 智能提示

2. **实时监控大屏**
   - 多维度数据展示
   - 实时告警
   - 性能分析

3. **智能操作引导**
   - 新手引导
   - 快捷操作
   - 批量处理

4. **团队协作功能**
   - Mock共享
   - 场景同步
   - 操作日志

---

**记住：Phase 3的核心是让Mock管理变得简单直观，让每个人都能轻松使用MDT平台！**