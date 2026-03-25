# Feature分支检测结果可视化方案

## 1. 概述

本文档描述如何在MDT平台上展示不同feature分支的Pure Component检测结果，让开发者和QA能够直观地看到各个分支的组件变更情况。

## 2. 数据收集架构

### 2.1 CI推送结果到MDT
```yaml
# 在feature分支的GitHub Actions中
- name: Push Results to MDT
  if: always()
  run: |
    curl -X POST ${{ secrets.MDT_API_URL }}/api/pct/results \
      -H "Authorization: Bearer ${{ secrets.MDT_API_TOKEN }}" \
      -H "Content-Type: application/json" \
      -d '{
        "repository": "${{ github.repository }}",
        "branch": "${{ github.ref_name }}",
        "commit": "${{ github.sha }}",
        "pr_number": "${{ github.event.pull_request.number }}",
        "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'",
        "results": '$(cat pct-report.json)'
      }'
```

### 2.2 MDT后端存储结构
```typescript
// 检测结果数据模型
interface BranchAnalysisResult {
  id: string;
  repository: string;
  branch: string;
  commit: string;
  prNumber?: number;
  timestamp: Date;
  
  // 检测结果
  summary: {
    totalComponents: number;
    changedComponents: number;
    breakingChanges: number;
    newComponents: number;
    deletedComponents: number;
  };
  
  // 详细结果
  components: ComponentAnalysis[];
  
  // 状态
  status: 'success' | 'warning' | 'error';
  approved: boolean;
  approvedBy?: string;
  approvedAt?: Date;
}

// 组件分析详情（支持快照对比）
interface ComponentAnalysis {
  name: string;
  path: string;
  branch: string;
  hasVisualChange: boolean;
  breakingChange: boolean;
  
  // 失败的快照列表（核心）
  failedSnapshots: SnapshotComparison[];
  
  // 变更摘要
  propChanges: PropChange[];
  riskLevel: 'low' | 'medium' | 'high';
  
  // 元数据
  lastModified: Date;
  author: string;
}

// 快照对比详情（重点设计）
interface SnapshotComparison {
  id: string;
  
  // Props信息（相同的输入）
  props: Record<string, any>;
  propsHash: string;
  propsDescription: string; // 如 "Primary Button - Normal Size"
  
  // 快照图片
  baselineSnapshot: string; // develop分支的快照URL
  currentSnapshot: string;  // feature分支的快照URL
  diffImage: string;        // 差异高亮图片URL
  
  // 差异分析
  diffPercentage: number;   // 视觉差异百分比
  changedPixels: number;    // 变化的像素数量
  resolution: string;       // 截图分辨率
  
  // 检测信息
  detectedAt: string;
  detectedChanges: ChangeDetail[];
  potentialImpact: string[]; // 潜在影响的页面/功能
  
  // 严重程度
  severity: 'minor' | 'moderate' | 'critical';
}

// 变化详情
interface ChangeDetail {
  type: 'color' | 'size' | 'position' | 'content' | 'layout';
  description: string;
  area: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

// Props变更
interface PropChange {
  prop: string;
  type: 'added' | 'removed' | 'modified';
  oldValue?: any;
  newValue?: any;
  impact: 'breaking' | 'non-breaking';
}
```

## 3. 前端页面设计

### 3.1 分支概览页面

```typescript
// src/pages/BranchAnalysis/index.tsx
import React, { useState, useEffect } from 'react';
import { Table, Tag, Select, DatePicker, Space, Button, Badge } from 'antd';
import { BranchOutlined, WarningOutlined, CheckCircleOutlined } from '@ant-design/icons';

const BranchAnalysis: React.FC = () => {
  const [branches, setBranches] = useState<BranchSummary[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[Date, Date]>();

  return (
    <div style={{ padding: '24px' }}>
      <h1><BranchOutlined /> Feature分支检测结果</h1>
      
      {/* 过滤器 */}
      <Space style={{ marginBottom: 16 }}>
        <Select
          style={{ width: 200 }}
          placeholder="选择仓库"
          value={selectedRepo}
          onChange={setSelectedRepo}
        >
          <Select.Option value="all">所有仓库</Select.Option>
          <Select.Option value="beep-v1-webapp">BEEP Web App</Select.Option>
          <Select.Option value="beep-mobile">BEEP Mobile</Select.Option>
        </Select>
        
        <DatePicker.RangePicker
          value={dateRange}
          onChange={setDateRange}
        />
        
        <Button type="primary">刷新</Button>
      </Space>

      {/* 分支列表 */}
      <Table
        dataSource={branches}
        columns={[
          {
            title: '分支名称',
            dataIndex: 'branch',
            key: 'branch',
            render: (branch, record) => (
              <Space>
                <BranchOutlined />
                <a href={`/branch-analysis/${record.id}`}>{branch}</a>
                {record.prNumber && (
                  <Tag color="blue">PR #{record.prNumber}</Tag>
                )}
              </Space>
            )
          },
          {
            title: '检测时间',
            dataIndex: 'timestamp',
            key: 'timestamp',
            render: (time) => new Date(time).toLocaleString()
          },
          {
            title: '变更统计',
            key: 'changes',
            render: (_, record) => (
              <Space>
                <Badge count={record.summary.changedComponents} showZero>
                  <Tag>已修改</Tag>
                </Badge>
                <Badge count={record.summary.newComponents} showZero>
                  <Tag color="green">新增</Tag>
                </Badge>
                <Badge count={record.summary.breakingChanges} showZero>
                  <Tag color="red">破坏性</Tag>
                </Badge>
              </Space>
            )
          },
          {
            title: '状态',
            key: 'status',
            render: (_, record) => {
              if (record.status === 'error') {
                return <Tag color="red"><WarningOutlined /> 需要处理</Tag>;
              }
              if (record.approved) {
                return <Tag color="green"><CheckCircleOutlined /> 已批准</Tag>;
              }
              return <Tag color="orange">待确认</Tag>;
            }
          },
          {
            title: '操作',
            key: 'actions',
            render: (_, record) => (
              <Space>
                <Button size="small" href={`/branch-analysis/${record.id}`}>
                  查看详情
                </Button>
                <Button size="small" type="link">
                  对比基准
                </Button>
              </Space>
            )
          }
        ]}
      />
    </div>
  );
};
```

### 3.2 分支详情页面

```typescript
// src/pages/BranchAnalysis/Detail.tsx
const BranchAnalysisDetail: React.FC = () => {
  const { id } = useParams();
  const [analysis, setAnalysis] = useState<BranchAnalysisResult>();
  const [compareMode, setCompareMode] = useState<'visual' | 'code'>('visual');

  return (
    <div style={{ padding: '24px' }}>
      {/* 头部信息 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={6}>
            <Statistic
              title="分支"
              value={analysis?.branch}
              prefix={<BranchOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="破坏性变更"
              value={analysis?.summary.breakingChanges}
              valueStyle={{ color: analysis?.summary.breakingChanges > 0 ? '#cf1322' : '#3f8600' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="检测时间"
              value={analysis?.timestamp}
              formatter={(value) => moment(value).fromNow()}
            />
          </Col>
          <Col span={6}>
            <Space>
              {!analysis?.approved && (
                <Button type="primary" onClick={handleApprove}>
                  批准变更
                </Button>
              )}
              <Button onClick={handleExportReport}>
                导出报告
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 组件变更列表 */}
      <Card title="组件变更详情">
        <Tabs activeKey={compareMode} onChange={setCompareMode}>
          <Tabs.TabPane tab="可视化对比" key="visual">
            <ComponentVisualComparison 
              components={analysis?.components.filter(c => c.hasVisualChange)}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="代码对比" key="code">
            <ComponentCodeDiff
              components={analysis?.components}
            />
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </div>
  );
};
```

### 3.3 快照对比可视化组件（重点设计）

```typescript
// src/components/ComponentVisualComparison.tsx
const ComponentVisualComparison: React.FC<{ components: ComponentAnalysis[] }> = ({ components }) => {
  const [selectedComponent, setSelectedComponent] = useState(components?.[0]);
  const [selectedSnapshot, setSelectedSnapshot] = useState<string>();
  const [compareMode, setCompareMode] = useState<'side-by-side' | 'overlay' | 'diff-highlight'>('side-by-side');
  
  return (
    <Row gutter={16}>
      {/* 左侧组件和快照列表 */}
      <Col span={6}>
        <Space direction="vertical" style={{ width: '100%' }}>
          {/* 组件选择 */}
          <Card size="small" title="失败的组件">
            <List
              size="small"
              dataSource={components.filter(c => c.hasVisualChange)}
              renderItem={(component) => (
                <List.Item
                  onClick={() => setSelectedComponent(component)}
                  style={{ 
                    cursor: 'pointer',
                    backgroundColor: selectedComponent?.name === component.name ? '#fff2e8' : undefined,
                    borderLeft: component.breakingChange ? '3px solid #ff4d4f' : '3px solid transparent'
                  }}
                >
                  <Space>
                    <Badge 
                      status={component.breakingChange ? 'error' : 'warning'} 
                      text={component.name}
                    />
                    <Tag color={component.breakingChange ? 'red' : 'orange'} size="small">
                      {component.failedSnapshots?.length || 0}
                    </Tag>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
          
          {/* 快照选择 */}
          {selectedComponent && (
            <Card size="small" title="失败的快照">
              <List
                size="small"
                dataSource={selectedComponent.failedSnapshots}
                renderItem={(snapshot) => (
                  <List.Item
                    onClick={() => setSelectedSnapshot(snapshot.id)}
                    style={{ 
                      cursor: 'pointer',
                      backgroundColor: selectedSnapshot === snapshot.id ? '#e6f7ff' : undefined
                    }}
                  >
                    <div style={{ width: '100%' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '12px' }}>
                        {snapshot.propsDescription}
                      </div>
                      <div style={{ fontSize: '11px', color: '#666', marginTop: 4 }}>
                        差异: {snapshot.diffPercentage}%
                      </div>
                      <div style={{ fontSize: '10px', color: '#999', marginTop: 2 }}>
                        {snapshot.propsHash.substring(0, 8)}...
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            </Card>
          )}
        </Space>
      </Col>
      
      {/* 右侧快照对比视图 */}
      <Col span={18}>
        {selectedComponent && selectedSnapshot && (
          <div>
            {/* 对比模式切换 */}
            <Card size="small" style={{ marginBottom: 16 }}>
              <Space>
                <span>对比模式:</span>
                <Radio.Group value={compareMode} onChange={e => setCompareMode(e.target.value)}>
                  <Radio.Button value="side-by-side">并排对比</Radio.Button>
                  <Radio.Button value="overlay">叠加对比</Radio.Button>
                  <Radio.Button value="diff-highlight">差异高亮</Radio.Button>
                </Radio.Group>
              </Space>
            </Card>
            
            {/* Props信息显示 */}
            <Card title="Props 详情" size="small" style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <div style={{ fontSize: '12px', color: '#666' }}>相同的Props输入:</div>
                  <pre style={{ 
                    background: '#f5f5f5', 
                    padding: '8px', 
                    fontSize: '11px',
                    borderRadius: '4px',
                    marginTop: '4px'
                  }}>
                    {JSON.stringify(getCurrentSnapshot()?.props, null, 2)}
                  </pre>
                </Col>
                <Col span={12}>
                  <div style={{ fontSize: '12px', color: '#666' }}>检测到的变化:</div>
                  <div style={{ marginTop: '4px' }}>
                    {getCurrentSnapshot()?.detectedChanges.map(change => (
                      <Tag key={change.type} color="red" size="small" style={{ marginBottom: '2px' }}>
                        {change.type}: {change.description}
                      </Tag>
                    ))}
                  </div>
                </Col>
              </Row>
            </Card>
            
            {/* 快照对比区域 */}
            {compareMode === 'side-by-side' && (
              <Row gutter={16}>
                <Col span={12}>
                  <Card 
                    title={
                      <Space>
                        <Badge status="success" />
                        <span>基准版本 (develop)</span>
                        <Tag color="green" size="small">正常</Tag>
                      </Space>
                    }
                    size="small"
                  >
                    <div style={{ textAlign: 'center', background: '#f9f9f9', padding: '16px' }}>
                      <Image
                        src={`/api/pct/snapshots/${getCurrentSnapshot()?.baselineSnapshot}`}
                        alt="Baseline"
                        style={{ maxWidth: '100%', border: '2px solid #52c41a' }}
                      />
                      <div style={{ marginTop: '8px', fontSize: '12px', color: '#52c41a' }}>
                        预期渲染结果
                      </div>
                    </div>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card 
                    title={
                      <Space>
                        <Badge status="error" />
                        <span>Feature分支 ({selectedComponent.branch})</span>
                        <Tag color="red" size="small">异常</Tag>
                      </Space>
                    }
                    size="small"
                  >
                    <div style={{ textAlign: 'center', background: '#fff2f0', padding: '16px' }}>
                      <Image
                        src={`/api/pct/snapshots/${getCurrentSnapshot()?.currentSnapshot}`}
                        alt="Current"
                        style={{ maxWidth: '100%', border: '2px solid #ff4d4f' }}
                      />
                      <div style={{ marginTop: '8px', fontSize: '12px', color: '#ff4d4f' }}>
                        实际渲染结果 (与预期不符)
                      </div>
                    </div>
                  </Card>
                </Col>
              </Row>
            )}
            
            {compareMode === 'overlay' && (
              <Card title="叠加对比视图" size="small">
                <div style={{ position: 'relative', textAlign: 'center' }}>
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <Image
                      src={`/api/pct/snapshots/${getCurrentSnapshot()?.baselineSnapshot}`}
                      alt="Baseline"
                      style={{ maxWidth: '100%' }}
                    />
                    <div 
                      style={{ 
                        position: 'absolute', 
                        top: 0, 
                        left: 0, 
                        width: '100%', 
                        height: '100%',
                        opacity: 0.7,
                        mixBlendMode: 'difference'
                      }}
                    >
                      <Image
                        src={`/api/pct/snapshots/${getCurrentSnapshot()?.currentSnapshot}`}
                        alt="Current"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  </div>
                  <div style={{ marginTop: '8px', fontSize: '12px' }}>
                    红色区域表示视觉差异
                  </div>
                </div>
              </Card>
            )}
            
            {compareMode === 'diff-highlight' && (
              <Card title="差异高亮分析" size="small">
                <Row gutter={16}>
                  <Col span={16}>
                    <div style={{ textAlign: 'center', background: '#fafafa', padding: '16px' }}>
                      <Image
                        src={`/api/pct/diff/${getCurrentSnapshot()?.diffImage}`}
                        alt="Diff Highlight"
                        style={{ maxWidth: '100%' }}
                      />
                      <div style={{ marginTop: '8px', fontSize: '12px' }}>
                        红色区域：删除的像素 | 绿色区域：新增的像素
                      </div>
                    </div>
                  </Col>
                  <Col span={8}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Statistic
                        title="视觉差异度"
                        value={getCurrentSnapshot()?.diffPercentage}
                        suffix="%"
                        valueStyle={{ 
                          color: getCurrentSnapshot()?.diffPercentage > 5 ? '#cf1322' : '#faad14' 
                        }}
                      />
                      <Statistic
                        title="变化像素数"
                        value={getCurrentSnapshot()?.changedPixels}
                        formatter={value => `${value?.toLocaleString()}`}
                      />
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        <div>检测时间: {getCurrentSnapshot()?.detectedAt}</div>
                        <div>分辨率: {getCurrentSnapshot()?.resolution}</div>
                      </div>
                    </Space>
                  </Col>
                </Row>
              </Card>
            )}
            
            {/* 影响分析和建议 */}
            <Card title="影响分析与建议" size="small" style={{ marginTop: 16 }}>
              <Alert
                message="破坏性变更检测"
                description={
                  <div>
                    <p style={{ margin: '8px 0' }}>
                      <strong>问题描述:</strong> 相同的props输入产生了不同的视觉输出，这可能会影响使用该组件的其他页面。
                    </p>
                    <p style={{ margin: '8px 0' }}>
                      <strong>潜在影响:</strong> 
                      {getCurrentSnapshot()?.potentialImpact?.map(impact => (
                        <Tag key={impact} color="orange" style={{ margin: '2px' }}>{impact}</Tag>
                      ))}
                    </p>
                    <p style={{ margin: '8px 0' }}>
                      <strong>建议操作:</strong>
                    </p>
                    <ul style={{ margin: '4px 0' }}>
                      <li>检查组件CSS样式是否有意外更改</li>
                      <li>确认这是否为预期的视觉更新</li>
                      <li>如果是预期变更，需要更新基准快照</li>
                      <li>通知相关页面的维护者检查兼容性</li>
                    </ul>
                  </div>
                }
                type="warning"
                showIcon
              />
            </Card>
          </div>
        )}
      </Col>
    </Row>
  );
  
  // 获取当前选中的快照数据
  function getCurrentSnapshot() {
    return selectedComponent?.failedSnapshots?.find(s => s.id === selectedSnapshot);
  }
};
```

### 3.4 实时监控大屏

```typescript
// src/pages/Dashboard/PCTMonitor.tsx
const PCTMonitor: React.FC = () => {
  const [realtimeData, setRealtimeData] = useState<RealtimeStats>();
  
  useEffect(() => {
    // WebSocket连接接收实时数据
    const ws = new WebSocket('ws://localhost:3000/ws/pct-monitor');
    ws.onmessage = (event) => {
      setRealtimeData(JSON.parse(event.data));
    };
    return () => ws.close();
  }, []);

  return (
    <div style={{ padding: '24px', backgroundColor: '#001529', minHeight: '100vh' }}>
      <Row gutter={[16, 16]}>
        {/* 活跃分支监控 */}
        <Col span={8}>
          <Card title="活跃分支" bordered={false}>
            <List
              dataSource={realtimeData?.activeBranches}
              renderItem={branch => (
                <List.Item>
                  <Space>
                    <Badge status={branch.status} />
                    {branch.name}
                    <Tag>{branch.lastUpdate}</Tag>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        
        {/* 今日统计 */}
        <Col span={8}>
          <Card title="今日检测统计" bordered={false}>
            <Statistic title="检测次数" value={realtimeData?.todayStats.totalChecks} />
            <Statistic 
              title="发现问题" 
              value={realtimeData?.todayStats.issuesFound}
              valueStyle={{ color: '#cf1322' }}
            />
            <Statistic 
              title="已解决" 
              value={realtimeData?.todayStats.resolved}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        
        {/* 组件健康度 */}
        <Col span={8}>
          <Card title="组件健康度" bordered={false}>
            <Progress
              type="dashboard"
              percent={realtimeData?.componentHealth}
              format={percent => `${percent}%`}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
```

## 4. 数据流设计

### 4.1 实时数据推送
```typescript
// 后端WebSocket服务
class PCTWebSocketService {
  broadcastBranchUpdate(branchId: string, data: any) {
    this.connections.forEach(client => {
      client.send(JSON.stringify({
        type: 'branch_update',
        branchId,
        data
      }));
    });
  }
}
```

### 4.2 API设计
```typescript
// API端点
interface PCTApiEndpoints {
  // 获取分支列表
  GET /api/pct/branches
  
  // 获取分支详情
  GET /api/pct/branches/:id
  
  // 获取组件快照
  GET /api/pct/snapshots/:id
  
  // 获取差异图片
  GET /api/pct/diff/:id
  
  // 批准变更
  POST /api/pct/branches/:id/approve
  
  // 获取统计数据
  GET /api/pct/statistics
}
```

## 5. 集成到现有MDT平台

### 5.1 路由配置
```typescript
// src/routes/index.tsx
const routes = [
  // ... 现有路由
  {
    path: '/branch-analysis',
    component: BranchAnalysis,
    name: 'Feature分支检测',
    icon: <BranchOutlined />
  },
  {
    path: '/branch-analysis/:id',
    component: BranchAnalysisDetail,
    hidden: true
  },
  {
    path: '/pct-monitor',
    component: PCTMonitor,
    name: 'PCT实时监控',
    icon: <DashboardOutlined />
  }
];
```

### 5.2 导航菜单更新
```typescript
// 在现有的Analysis菜单下添加子菜单
<SubMenu key="analysis" icon={<ExperimentOutlined />} title="组件分析">
  <Menu.Item key="component-analysis">
    <Link to="/analysis">组件分析</Link>
  </Menu.Item>
  <Menu.Item key="branch-analysis">
    <Link to="/branch-analysis">分支检测结果</Link>
  </Menu.Item>
  <Menu.Item key="pct-monitor">
    <Link to="/pct-monitor">实时监控</Link>
  </Menu.Item>
</SubMenu>
```

## 6. 高级功能

### 6.1 分支对比功能
```typescript
// 对比两个分支的组件差异
const BranchComparison: React.FC = () => {
  const [branch1, setBranch1] = useState<string>();
  const [branch2, setBranch2] = useState<string>();
  
  return (
    <div>
      <Space>
        <Select placeholder="选择分支1" onChange={setBranch1}>
          {branches.map(b => <Option key={b} value={b}>{b}</Option>)}
        </Select>
        <span>VS</span>
        <Select placeholder="选择分支2" onChange={setBranch2}>
          {branches.map(b => <Option key={b} value={b}>{b}</Option>)}
        </Select>
        <Button onClick={handleCompare}>对比</Button>
      </Space>
      
      {comparisonResult && (
        <ComparisonResult data={comparisonResult} />
      )}
    </div>
  );
};
```

### 6.2 趋势分析
```typescript
// 组件变更趋势图表
const ComponentTrends: React.FC = () => {
  return (
    <Card title="组件变更趋势">
      <LineChart
        data={trendData}
        xField="date"
        yField="value"
        seriesField="type"
        legend={{ position: 'top' }}
      />
    </Card>
  );
};
```

### 6.3 批量操作
```typescript
// 批量批准多个分支的变更
const BatchApproval: React.FC = () => {
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  
  const handleBatchApprove = async () => {
    await api.batchApproveBranches(selectedBranches);
    message.success('批量批准成功');
  };
  
  return (
    <Space>
      <Checkbox.Group
        options={branches}
        value={selectedBranches}
        onChange={setSelectedBranches}
      />
      <Button 
        type="primary"
        onClick={handleBatchApprove}
        disabled={selectedBranches.length === 0}
      >
        批量批准 ({selectedBranches.length})
      </Button>
    </Space>
  );
};
```

## 7. 通知集成

### 7.1 钉钉/Slack通知
```typescript
// 当检测到破坏性变更时发送通知
const sendNotification = async (analysis: BranchAnalysisResult) => {
  if (analysis.summary.breakingChanges > 0) {
    await dingTalkBot.send({
      msgtype: 'markdown',
      markdown: {
        title: '⚠️ Pure Component破坏性变更',
        text: `
### ${analysis.branch} 分支检测到破坏性变更

- 仓库: ${analysis.repository}
- 破坏性变更数: ${analysis.summary.breakingChanges}
- PR: #${analysis.prNumber}

[查看详情](${MDT_URL}/branch-analysis/${analysis.id})
        `
      }
    });
  }
};
```

## 8. 性能优化

### 8.1 数据缓存
```typescript
// 使用Redis缓存分支检测结果
class BranchAnalysisCache {
  async get(branchId: string) {
    const cached = await redis.get(`pct:branch:${branchId}`);
    return cached ? JSON.parse(cached) : null;
  }
  
  async set(branchId: string, data: any, ttl = 3600) {
    await redis.setex(
      `pct:branch:${branchId}`,
      ttl,
      JSON.stringify(data)
    );
  }
}
```

### 8.2 图片优化
```typescript
// 快照图片懒加载和压缩
const LazySnapshot: React.FC<{ src: string }> = ({ src }) => {
  const [inView, ref] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  
  return (
    <div ref={ref}>
      {inView ? (
        <Image
          src={`${src}?w=400&q=75`} // 压缩参数
          loading="lazy"
          placeholder={<Skeleton.Image />}
        />
      ) : (
        <Skeleton.Image />
      )}
    </div>
  );
};
```

## 9. 快照对比最佳实践

### 9.1 核心理念：相同Props，不同结果
快照对比的核心是检测**相同props输入产生不同视觉输出**的情况：

```typescript
// 示例：同样的Button props
const testProps = {
  type: 'primary',
  size: 'normal',
  children: '提交订单'
};

// 在develop分支：渲染成蓝色按钮
// 在feature分支：渲染成橙色按钮（可能是意外的CSS修改）
// → 这就是需要检测的破坏性变更
```

### 9.2 对比模式选择指南

**1. 并排对比 (Side-by-Side)**
- **适用场景**：初次查看，快速识别差异
- **优势**：直观清晰，容易发现明显变化
- **适合变更**：颜色差异、尺寸变化、布局调整

**2. 叠加对比 (Overlay)**
- **适用场景**：检测细微位置偏移
- **优势**：能发现像素级别的细微差异
- **适合变更**：字体渲染、边框变化、阴影效果

**3. 差异高亮 (Diff Highlight)**
- **适用场景**：精确分析变化区域
- **优势**：量化差异，提供具体数据
- **适合变更**：复杂布局变化、多处修改

### 9.3 视觉差异阈值设置

```typescript
// 差异检测配置
const diffThresholds = {
  // 像素级差异阈值
  pixelDiffThreshold: 0.1,        // 0.1% 像素差异视为不同
  
  // 颜色差异阈值  
  colorDiffThreshold: 5,          // RGB值差异超过5视为不同
  
  // 布局差异阈值
  layoutDiffThreshold: 2,         // 位置偏移超过2px视为不同
  
  // 破坏性变更阈值
  breakingChangeThreshold: 5,     // 5%以上差异视为破坏性变更
};
```

### 9.4 常见破坏性变更案例

**案例1：品牌色无意修改**
```jsx
// develop分支：主品牌色
<Button type="primary">确认</Button>  // 蓝色 #1890FF

// feature分支：意外继承了全局样式
<Button type="primary">确认</Button>  // 变成红色 #FF4D4F
```

**案例2：尺寸意外变化**
```jsx
// develop分支：正常尺寸
<Button size="normal">保存</Button>   // height: 32px

// feature分支：CSS规则冲突
<Button size="normal">保存</Button>   // height: 28px (意外缩小)
```

**案例3：字体渲染差异**
```jsx
// develop分支：系统字体
<Button>中文按钮</Button>              // font-family: system-ui

// feature分支：引入新字体后
<Button>中文按钮</Button>              // font-family: custom-font (字间距变化)
```

### 9.5 快照生成和存储策略

```typescript
// 智能快照生成
const generateSnapshots = async (component: ComponentInfo) => {
  const snapshots = [];
  
  // 为每个props组合生成快照
  for (const propsCombo of component.testCombinations) {
    // 1. 渲染组件
    const renderedComponent = await renderComponent(component, propsCombo);
    
    // 2. 等待样式加载完成
    await waitForStylesLoaded(renderedComponent);
    
    // 3. 截图并优化
    const screenshot = await captureScreenshot(renderedComponent, {
      waitForFonts: true,
      removeAnimations: true,
      stabilizeAsync: true
    });
    
    // 4. 生成描述性标识
    const description = generatePropsDescription(propsCombo);
    const hash = generatePropsHash(propsCombo);
    
    snapshots.push({
      id: `${component.name}-${hash}`,
      props: propsCombo,
      propsDescription: description,
      propsHash: hash,
      imageData: screenshot,
      metadata: {
        timestamp: new Date(),
        resolution: '1280x800',
        devicePixelRatio: 1
      }
    });
  }
  
  return snapshots;
};
```

### 9.6 多项目支持策略

由于用户提到"系统中有多个beep-v1-webapp项目"，需要设计多项目区分机制：

```typescript
// 项目识别策略
interface ProjectIdentifier {
  repository: string;           // github.com/org/beep-v1-webapp
  branch: string;               // feature/button-update
  projectPath?: string;         // /Users/wendylin/workspace/beep-v1-webapp
  environment: 'dev' | 'staging' | 'prod';
  
  // 项目特征识别
  packageJsonHash: string;      // package.json的hash，用于区分不同项目
  tailwindConfigHash: string;   // tailwind配置的hash
  componentsVersion: string;    // 组件库版本
}

// 在MDT平台显示
const ProjectSelector: React.FC = () => {
  return (
    <Select placeholder="选择项目实例">
      <Option value="beep-v1-webapp-main">
        beep-v1-webapp (主项目)
        <Tag color="blue">v2.1.0</Tag>
      </Option>
      <Option value="beep-v1-webapp-feature">
        beep-v1-webapp (特性分支)
        <Tag color="orange">v2.2.0-beta</Tag>
      </Option>
      <Option value="beep-v1-webapp-staging">
        beep-v1-webapp (预发布)
        <Tag color="green">v2.1.5</Tag>
      </Option>
    </Select>
  );
};
```

## 10. 总结

通过这套**以快照对比为核心**的可视化方案，实现：

### 10.1 核心价值
1. **破坏性检测**：相同props输入，不同视觉输出的精确检测
2. **直观对比**：三种对比模式（并排/叠加/差异高亮）满足不同场景
3. **量化分析**：像素级差异统计，客观评估变更影响
4. **智能识别**：自动识别颜色、尺寸、布局等类型的变化

### 10.2 实施效果
1. **集中查看**：所有feature分支的检测结果集中展示
2. **实时更新**：CI运行后自动推送结果到MDT平台  
3. **可视化对比**：直观展示组件变更的视觉差异
4. **批量管理**：支持批量批准和处理
5. **趋势分析**：了解组件质量的变化趋势
6. **及时通知**：破坏性变更及时通知相关人员
7. **多项目支持**：区分和管理多个项目实例

### 10.3 下一步实施
基于用户反馈"本地的web能看到效果"，建议：
1. **第一步**：在现有MDT平台集成分支检测结果页面
2. **第二步**：实现快照对比的三种模式
3. **第三步**：集成到CI流程，自动推送检测结果
4. **第四步**：支持多项目实例管理

这样就将CI中的检测结果与MDT平台完美结合，提供了完整的Pure Component质量管理体验。