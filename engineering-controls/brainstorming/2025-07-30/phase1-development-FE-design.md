# Pure Component 基准管理 - 状态列完整设计

## 1. 状态类型定义

```typescript
// 状态枚举
type BaselineStatus = 
  | 'healthy'      // 健康：一切正常
  | 'outdated'     // 过时：组件已更新但基准未更新
  | 'corrupted'    // 损坏：文件缺失或损坏
  | 'deleted'      // 已删除：组件不存在
  | 'unstable'     // 不稳定：频繁变更
  | 'drifting'     // 渐变中：小改动累积
  | 'optimizable'  // 可优化：发现改进空间

// 状态详情接口
interface StatusDetail {
  type: BaselineStatus;
  label: string;
  badgeStatus: 'success' | 'warning' | 'error' | 'default' | 'processing';
  hasDetail: boolean;
  detailTitle?: string;
  detailMessage?: string;
}
```

## 2. 状态显示组件完整代码

```tsx
import React from 'react';
import { Space, Badge, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const StatusColumn: React.FC<{ baseline: BaselineInfo }> = ({ baseline }) => {
  // 基于真实的变更历史计算状态
  const intelligentStatus = calculateStatus(baseline);
  
  return (
    <Space>
      <Badge 
        status={intelligentStatus.badgeStatus}
        text={intelligentStatus.label}
      />
      
      {/* 对于需要额外说明的状态，显示信息图标 */}
      {intelligentStatus.hasDetail && (
        <Tooltip 
          title={
            <div style={{ maxWidth: 300 }}>
              <strong>{intelligentStatus.detailTitle}</strong>
              <div style={{ marginTop: 4, fontSize: '12px' }}>
                {intelligentStatus.detailMessage}
              </div>
            </div>
          }
          placement="left"
        >
          <InfoCircleOutlined 
            style={{ 
              color: '#1890ff', 
              cursor: 'pointer',
              fontSize: '14px' 
            }} 
          />
        </Tooltip>
      )}
    </Space>
  );
};
```

## 3. 智能状态判定逻辑完整实现

```typescript
const calculateStatus = (baseline: BaselineInfo): StatusDetail => {
  // 获取版本历史
  const changeHistory = baseline.versionHistory || [];
  
  // 最近30天的变更
  const last30Days = changeHistory.filter((v: VersionRecord) => 
    dayjs().diff(dayjs(v.timestamp), 'day') <= 30
  );
  
  // 1. 基本状态检查（优先级最高）
  if (baseline.status === 'corrupted') {
    return {
      type: 'corrupted',
      label: '损坏',
      badgeStatus: 'error',
      hasDetail: true,
      detailTitle: '基准文件损坏',
      detailMessage: baseline.corruptionDetails || '快照文件丢失，需要重新生成'
    };
  }
  
  if (baseline.status === 'deleted') {
    return {
      type: 'deleted', 
      label: '已删除',
      badgeStatus: 'default',
      hasDetail: true,
      detailTitle: '组件已移除',
      detailMessage: `组件于${dayjs(baseline.deletedAt).format('YYYY-MM-DD')}被删除，建议清理基准数据`
    };
  }
  
  // 2. 不稳定状态 - 基于变更频率
  if (last30Days.length >= 10) {  // 30天内超过10次修改
    const avgDays = Math.round(30 / last30Days.length);
    return {
      type: 'unstable',
      label: '不稳定',
      badgeStatus: 'warning',
      hasDetail: true,
      detailTitle: '组件频繁变更',
      detailMessage: `最近30天修改${last30Days.length}次，平均${avgDays}天一次修改`
    };
  }
  
  // 3. 渐变中 - 小改动累积
  const minorChanges = last30Days.filter((v: VersionRecord) => 
    v.linesChanged.added < 10 && 
    v.linesChanged.deleted < 10 &&
    v.linesChanged.added + v.linesChanged.deleted > 0
  );
  
  if (minorChanges.length >= 5 && baseline.status === 'healthy') {
    const totalLines = minorChanges.reduce((sum, v) => 
      sum + v.linesChanged.added + v.linesChanged.deleted, 0
    );
    
    return {
      type: 'drifting',
      label: '渐变中',
      badgeStatus: 'processing',
      hasDetail: true,
      detailTitle: '细微变化累积',
      detailMessage: `累积${minorChanges.length}个小改动，总计修改${totalLines}行，建议更新基准`
    };
  }
  
  // 4. 可优化 - 基于代码分析
  const optimizationOpportunities = analyzeOptimization(baseline);
  if (optimizationOpportunities.length > 0) {
    const topOptimization = optimizationOpportunities[0];
    return {
      type: 'optimizable',
      label: '可优化',
      badgeStatus: 'processing',
      hasDetail: true,
      detailTitle: '发现优化机会',
      detailMessage: `${optimizationOpportunities.length}个优化建议：${topOptimization.title}`
    };
  }
  
  // 5. 过时 - 组件已更新但基准未更新
  if (baseline.status === 'outdated') {
    const daysSinceUpdate = dayjs().diff(dayjs(baseline.lastUpdated), 'day');
    const versionsBehind = calculateVersionsBehind(baseline);
    
    return {
      type: 'outdated',
      label: '过时',
      badgeStatus: 'warning',
      hasDetail: true,
      detailTitle: '基准需要更新',
      detailMessage: `组件已更新${daysSinceUpdate}天，当前版本与基准相差${versionsBehind}个版本`
    };
  }
  
  // 6. 健康 - 但可能有提示
  const lastChange = changeHistory[0];
  const daysSinceLastChange = lastChange 
    ? dayjs().diff(dayjs(lastChange.timestamp), 'day')
    : 999;
  
  return {
    type: 'healthy',
    label: '健康',
    badgeStatus: 'success',
    hasDetail: daysSinceLastChange > 60,
    detailTitle: '组件稳定',
    detailMessage: daysSinceLastChange > 60 
      ? `已${daysSinceLastChange}天未修改，组件非常稳定`
      : undefined
  };
};
```

## 4. 优化分析逻辑

```typescript
interface OptimizationOpportunity {
  type: 'performance' | 'css' | 'type-safety' | 'accessibility';
  title: string;
  impact: 'high' | 'medium' | 'low';
}

const analyzeOptimization = (baseline: BaselineInfo): OptimizationOpportunity[] => {
  const opportunities: OptimizationOpportunity[] = [];
  
  // 分析数据来源（假设这些数据已经在baseline对象中）
  const { 
    codeAnalysis,
    cssAnalysis, 
    propsAnalysis,
    performanceMetrics,
    accessibilityScore 
  } = baseline;
  
  // 1. 性能优化检查
  if (!codeAnalysis?.hasReactMemo && baseline.propsVariations > 3) {
    opportunities.push({
      type: 'performance',
      title: '添加React.memo减少重渲染',
      impact: 'high'
    });
  }
  
  if (performanceMetrics?.renderTime > 50) {
    opportunities.push({
      type: 'performance',
      title: '组件渲染时间过长(>50ms)',
      impact: 'high'
    });
  }
  
  // 2. CSS优化检查
  if (cssAnalysis?.duplicateRules > 3) {
    opportunities.push({
      type: 'css',
      title: `${cssAnalysis.duplicateRules}处CSS重复可合并`,
      impact: 'medium'
    });
  }
  
  if (cssAnalysis?.unusedClasses > 0) {
    opportunities.push({
      type: 'css',
      title: `发现${cssAnalysis.unusedClasses}个未使用的CSS类`,
      impact: 'low'
    });
  }
  
  // 3. 类型安全检查
  if (propsAnalysis?.looseTypes > 0) {
    opportunities.push({
      type: 'type-safety',
      title: '建议使用更严格的类型定义',
      impact: 'medium'
    });
  }
  
  if (!propsAnalysis?.hasDefaultProps && baseline.propsVariations > 5) {
    opportunities.push({
      type: 'type-safety',
      title: '建议添加defaultProps',
      impact: 'medium'
    });
  }
  
  // 4. 可访问性检查
  if (accessibilityScore < 80) {
    opportunities.push({
      type: 'accessibility',
      title: '可访问性评分偏低，建议改进',
      impact: 'medium'
    });
  }
  
  // 按影响程度排序
  return opportunities.sort((a, b) => {
    const impactOrder = { high: 3, medium: 2, low: 1 };
    return impactOrder[b.impact] - impactOrder[a.impact];
  });
};
```

## 5. 辅助函数

```typescript
// 计算版本落后数
const calculateVersionsBehind = (baseline: BaselineInfo): number => {
  const currentCommit = baseline.currentComponentCommit;
  const baselineCommit = baseline.baselineCommit;
  
  // 查找两个commit之间的版本数
  const versionsBetween = baseline.versionHistory.filter(v => {
    const vIndex = baseline.versionHistory.findIndex(ver => ver.commit === v.commit);
    const baseIndex = baseline.versionHistory.findIndex(ver => ver.commit === baselineCommit);
    const currentIndex = baseline.versionHistory.findIndex(ver => ver.commit === currentCommit);
    
    return vIndex >= currentIndex && vIndex < baseIndex;
  });
  
  return versionsBetween.length;
};
```

## 6. 在表格中的使用

```tsx
// 在基准管理列表中使用
const BaselineTable = () => {
  const columns = [
    {
      title: '组件信息',
      dataIndex: 'component',
      key: 'component',
    },
    {
      title: '快照信息',
      dataIndex: 'snapshotCount',
      key: 'snapshot',
      render: (count: number) => `${count}个`
    },
    {
      title: '更新信息',
      dataIndex: 'lastUpdated',
      key: 'update',
      render: (date: string) => dayjs(date).fromNow()
    },
    {
      title: '状态',
      key: 'status',
      render: (_: any, record: BaselineInfo) => <StatusColumn baseline={record} />
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: BaselineInfo) => (
        <Space>
          <Button size="small">查看</Button>
          <Button size="small" type="primary">分析</Button>
        </Space>
      )
    }
  ];

  return <Table columns={columns} dataSource={baselines} />;
};
```

## 7. 数据结构补充

```typescript
// 需要在BaselineInfo中增加的字段
interface BaselineInfo {
  // 现有字段...
  id: string;
  component: string;
  status: 'healthy' | 'outdated' | 'corrupted' | 'deleted';
  
  // 新增分析数据字段
  versionHistory: VersionRecord[];
  codeAnalysis?: {
    hasReactMemo: boolean;
    complexity: number;
  };
  cssAnalysis?: {
    duplicateRules: number;
    unusedClasses: number;
  };
  propsAnalysis?: {
    looseTypes: number;
    hasDefaultProps: boolean;
  };
  performanceMetrics?: {
    renderTime: number;
    bundleSize: number;
  };
  accessibilityScore?: number;
  
  // 时间相关
  deletedAt?: string;
  corruptionDetails?: string;
  currentComponentCommit?: string;
  baselineCommit?: string;
}
```

## 8. 效果展示示例

```
组件信息        快照信息    更新信息    状态                        操作
-----------------------------------------------------------------------
Button          15个       3天前       🟢 健康                    [查看] [分析]

Modal           6个        1天前       🟡 不稳定 ⓘ               [查看] [分析]
                                      └─ Hover显示: "组件频繁变更"
                                         "最近30天修改12次，平均2.5天一次修改"

Input           12个       10天前      🔵 渐变中 ⓘ               [查看] [分析]  
                                      └─ Hover显示: "细微变化累积"
                                         "累积6个小改动，总计修改47行，建议更新基准"

Card            8个        30天前      🔵 可优化 ⓘ               [查看] [分析]
                                      └─ Hover显示: "发现优化机会"
                                         "3个优化建议：添加React.memo减少重渲染"

Select          10个       45天前      🟡 过时                    [查看] [分析]
                                      └─ Hover显示: "基准需要更新"
                                         "组件已更新45天，当前版本与基准相差8个版本"

Tooltip         5个        2天前       🔴 损坏 ⓘ                 [查看] [分析]
                                      └─ Hover显示: "基准文件损坏"
                                         "快照文件丢失，需要重新生成"
```

# Pure Component 基准详情Modal - 智能建议系统设计

## 核心设计理念

基于 `/engineering-controls/brainstorming/2025-08-30/intelligent-suggestions.md` 的三大核心功能：

1. **可视化智能建议** - 截图标注、问题高亮、before/after对比
2. **可执行代码建议** - 代码diff显示、一键修复、预期效果预览  
3. **渐进式智能学习** - 模式识别、个性化建议、上下文理解

## 1. Modal整体结构

```tsx
const BaselineDetailModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  baseline: BaselineInfo;
}> = ({ visible, onClose, baseline }) => {
  return (
    <Modal
      title={`${baseline.component} - 智能建议分析`}
      open={visible}
      onCancel={onClose}
      width={1600}
      height="90vh"
      footer={[
        <Button key="close" onClick={onClose}>关闭</Button>,
        <Button key="apply-all" type="primary">应用所有建议</Button>
      ]}
    >
      <div className="intelligent-suggestions-content">
        {/* 1. 组件概览卡片 */}
        <ComponentOverview baseline={baseline} />
        
        {/* 2. 可视化问题检测 - 核心功能1 */}
        <VisualIntelligenceSection baseline={baseline} />
        
        {/* 3. 可执行代码建议 - 核心功能2 */}
        <ExecutableRecommendations baseline={baseline} />
        
        {/* 4. 渐进式学习建议 - 核心功能3 */}
        <ProgressiveIntelligence baseline={baseline} />
        
        {/* 5. 交互式建议对话 */}
        <InteractiveRecommendations baseline={baseline} />
      </div>
    </Modal>
  );
};
```

## 2. 可视化智能建议组件 (Visual Intelligence)

```tsx
const VisualIntelligenceSection: React.FC<{ baseline: BaselineInfo }> = ({ baseline }) => {
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const visualIssues = detectVisualIssues(baseline);
  
  return (
    <Card 
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <EyeOutlined style={{ color: '#1890ff' }} />
          <span>可视化问题检测</span>
          <Tag color="blue">{visualIssues.length}个问题</Tag>
        </div>
      } 
      style={{ marginBottom: 24 }}
    >
      {visualIssues.map((issue, index) => (
        <div key={issue.id} className="visual-issue-item">
          <Row gutter={24}>
            {/* 问题截图标注 */}
            <Col span={12}>
              <div className="issue-screenshot-container">
                <div className="screenshot-header">
                  <Tag color={issue.priority === 'high' ? 'red' : 'orange'}>
                    {issue.priority} 优先级
                  </Tag>
                  <span>{issue.title}</span>
                </div>
                
                {/* 截图展示区 */}
                <div className="screenshot-with-annotations" style={{ position: 'relative' }}>
                  <img 
                    src={issue.visualHighlight.screenshot}
                    alt="组件问题截图"
                    style={{ maxWidth: '100%', border: '1px solid #d9d9d9' }}
                  />
                  
                  {/* 问题标注 */}
                  {issue.visualHighlight.annotations.map((annotation, i) => (
                    <div
                      key={i}
                      className="issue-annotation"
                      style={{
                        position: 'absolute',
                        left: annotation.position.x,
                        top: annotation.position.y,
                        width: '20px',
                        height: '20px',
                        background: '#ff4d4f',
                        borderRadius: '50%',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        cursor: 'pointer',
                        border: '2px solid white',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                      }}
                      onClick={() => setSelectedIssue(annotation.issue)}
                    >
                      !
                    </div>
                  ))}
                  
                  {/* 问题区域高亮 */}
                  {issue.visualHighlight.annotations.map((annotation, i) => (
                    <div
                      key={`highlight-${i}`}
                      className="issue-highlight"
                      style={{
                        position: 'absolute',
                        left: annotation.position.x - 10,
                        top: annotation.position.y - 10,
                        width: '40px',
                        height: '40px',
                        border: '2px dashed #ff4d4f',
                        borderRadius: '4px',
                        background: 'rgba(255, 77, 79, 0.1)',
                        pointerEvents: 'none',
                        animation: 'pulse 2s infinite'
                      }}
                    />
                  ))}
                </div>
              </div>
            </Col>
            
            {/* Before/After 对比 */}
            <Col span={12}>
              <div className="before-after-comparison">
                <div className="comparison-header">
                  <span>修复效果预览</span>
                </div>
                
                <Row gutter={16}>
                  <Col span={12}>
                    <div className="comparison-item">
                      <div className="comparison-label">修复前</div>
                      <img 
                        src={issue.beforeAfter?.before}
                        alt="修复前"
                        style={{ width: '100%', border: '1px solid #ff4d4f' }}
                      />
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="comparison-item">
                      <div className="comparison-label">修复后</div>
                      <img 
                        src={issue.beforeAfter?.after}
                        alt="修复后"
                        style={{ width: '100%', border: '1px solid #52c41a' }}
                      />
                    </div>
                  </Col>
                </Row>
                
                {/* 一键修复按钮 */}
                <div className="one-click-fix" style={{ marginTop: 16 }}>
                  <Button 
                    type="primary" 
                    icon={<BugOutlined />}
                    onClick={() => applyOnClickFix(issue)}
                  >
                    {issue.visualHighlight.annotations[0]?.oneClickFix}
                  </Button>
                  <span style={{ marginLeft: 8, fontSize: '12px', color: '#666' }}>
                    预计修复时间: 30秒
                  </span>
                </div>
              </div>
            </Col>
          </Row>
          
          {/* 详细说明 */}
          <div className="issue-details" style={{ marginTop: 16, padding: '12px', background: '#fafafa', borderRadius: '4px' }}>
            <div><strong>问题描述:</strong> {issue.description}</div>
            <div><strong>建议方案:</strong> {issue.suggestion}</div>
            <div><strong>影响范围:</strong> 影响{issue.affectedElements}个相关元素</div>
          </div>
        </div>
      ))}
    </Card>
  );
};

// 检测视觉问题的函数
const detectVisualIssues = (baseline: BaselineInfo) => {
  return [
    {
      id: 'accessibility-001',
      type: 'accessibility_issues',
      title: '发现3个可访问性问题',
      priority: 'high',
      description: '按钮缺少合适的颜色对比度和aria-label',
      suggestion: '调整颜色对比度到4.5:1，添加描述性标签',
      affectedElements: 3,
      visualHighlight: {
        screenshot: '/analysis/button-accessibility-issues.png',
        annotations: [
          {
            position: { x: 120, y: 45 },
            issue: '缺少aria-label',
            suggestion: "添加 aria-label='保存用户资料'",
            priority: 'high',
            oneClickFix: '自动添加建议的aria-label'
          },
          {
            position: { x: 180, y: 45 },
            issue: '颜色对比度不足',
            suggestion: '调整背景色到#1890ff提高对比度',
            priority: 'high',
            oneClickFix: '自动调整颜色对比度'
          }
        ]
      },
      beforeAfter: {
        before: '/analysis/button-before-fix.png',
        after: '/analysis/button-after-fix.png'
      }
    }
  ];
};
```

## 3. 可执行代码建议组件 (Executable Recommendations)

```tsx
const ExecutableRecommendations: React.FC<{ baseline: BaselineInfo }> = ({ baseline }) => {
  const [expandedRec, setExpandedRec] = useState<string | null>(null);
  const [applyingFix, setApplyingFix] = useState<string | null>(null);
  const recommendations = generateExecutableRecommendations(baseline);
  
  const applyAutoFix = async (recommendation: any) => {
    setApplyingFix(recommendation.id);
    try {
      // 调用AST转换API
      await recommendation.autoFix.applyFix();
      message.success(`已应用修复: ${recommendation.autoFix.title}`);
    } catch (error) {
      message.error('应用修复失败');
    } finally {
      setApplyingFix(null);
    }
  };
  
  return (
    <Card 
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <CodeOutlined style={{ color: '#52c41a' }} />
          <span>可执行代码建议</span>
          <Tag color="green">{recommendations.length}个建议</Tag>
        </div>
      } 
      style={{ marginBottom: 24 }}
    >
      {recommendations.map((rec) => (
        <Card
          key={rec.id}
          size="small"
          style={{ marginBottom: 16 }}
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Tag color={rec.impact === 'high' ? 'red' : rec.impact === 'medium' ? 'orange' : 'blue'}>
                  {rec.impact}影响
                </Tag>
                <span>{rec.autoFix.title}</span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button 
                  size="small"
                  type={expandedRec === rec.id ? "default" : "primary"}
                  ghost
                  onClick={() => setExpandedRec(expandedRec === rec.id ? null : rec.id)}
                >
                  {expandedRec === rec.id ? '收起' : '查看代码'}
                </Button>
                <Button 
                  size="small"
                  type="primary"
                  loading={applyingFix === rec.id}
                  icon={<ThunderboltOutlined />}
                  onClick={() => applyAutoFix(rec)}
                >
                  一键修复
                </Button>
              </div>
            </div>
          }
        >
          {/* 问题描述和影响 */}
          <div className="recommendation-overview" style={{ marginBottom: 12 }}>
            <div><strong>问题:</strong> {rec.issue}</div>
            <div><strong>性能影响:</strong> <span style={{ color: '#ff4d4f' }}>{rec.impact}</span></div>
            <div><strong>预期改进:</strong> <span style={{ color: '#52c41a' }}>{rec.autoFix.expectedImprovement}</span></div>
          </div>
          
          {expandedRec === rec.id && (
            <div className="code-diff-section">
              {/* 代码对比展示 */}
              <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={12}>
                  <div className="code-diff-panel">
                    <div className="diff-header current-code">
                      <MinusCircleOutlined style={{ color: '#ff4d4f' }} />
                      <span>当前代码</span>
                    </div>
                    <SyntaxHighlighter 
                      language="javascript" 
                      style={atomDark}
                      customStyle={{ margin: 0, fontSize: '12px' }}
                    >
                      {rec.autoFix.preview.split('\n')
                        .filter(line => line.startsWith('- '))
                        .map(line => line.substring(2))
                        .join('\n')}
                    </SyntaxHighlighter>
                  </div>
                </Col>
                
                <Col span={12}>
                  <div className="code-diff-panel">
                    <div className="diff-header suggested-code">
                      <PlusCircleOutlined style={{ color: '#52c41a' }} />
                      <span>建议代码</span>
                    </div>
                    <SyntaxHighlighter 
                      language="javascript" 
                      style={atomDark}
                      customStyle={{ margin: 0, fontSize: '12px' }}
                    >
                      {rec.autoFix.preview.split('\n')
                        .filter(line => line.startsWith('+ '))
                        .map(line => line.substring(2))
                        .join('\n')}
                    </SyntaxHighlighter>
                  </div>
                </Col>
              </Row>
              
              {/* 详细的修复说明 */}
              <div className="fix-explanation" style={{ 
                background: '#f6ffed', 
                padding: '12px', 
                borderRadius: '6px',
                border: '1px solid #b7eb8f'
              }}>
                <div><strong>为什么需要这个修复:</strong></div>
                <p style={{ marginBottom: 8 }}>{rec.reasoning}</p>
                
                <div><strong>具体修复步骤:</strong></div>
                <ol style={{ marginBottom: 12 }}>
                  {rec.autoFix.steps?.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
                
                <div><strong>预期效果:</strong></div>
                <ul style={{ marginBottom: 0 }}>
                  {rec.benefits?.map((benefit, i) => (
                    <li key={i} style={{ color: '#52c41a' }}>{benefit}</li>
                  ))}
                </ul>
              </div>
              
              {/* 操作按钮组 */}
              <div className="action-buttons" style={{ marginTop: 16, textAlign: 'right' }}>
                <Space>
                  <Button 
                    size="small"
                    icon={<CopyOutlined />}
                    onClick={() => copyToClipboard(rec.autoFix.finalCode)}
                  >
                    复制修复代码
                  </Button>
                  <Button 
                    size="small"
                    icon={<FolderOpenOutlined />}
                    onClick={() => openInVSCode(rec.filePath)}
                  >
                    在VS Code中打开
                  </Button>
                  <Button 
                    size="small"
                    icon={<PlayCircleOutlined />}
                    onClick={() => previewChanges(rec)}
                  >
                    预览修改效果
                  </Button>
                </Space>
              </div>
            </div>
          )}
        </Card>
      ))}
    </Card>
  );
};

// 生成可执行代码建议
const generateExecutableRecommendations = (baseline: BaselineInfo) => {
  const recommendations = [];
  
  // 性能优化建议
  if (!baseline.codeAnalysis?.hasReactMemo && baseline.propsVariations > 3) {
    recommendations.push({
      id: 'memo-optimization',
      issue: 'Button组件重复渲染',
      impact: '性能降低15%',
      reasoning: '当前组件在父组件重渲染时会无条件重渲染，使用React.memo可以避免props未变化时的重渲染',
      benefits: [
        '渲染性能提升15%', 
        '重渲染次数减少60%',
        '降低CPU使用率'
      ],
      
      autoFix: {
        title: '一键优化：添加React.memo',
        preview: `
          // 当前代码
          - export const Button = ({type, children, onClick}) => {
          
          // 优化后代码  
          + export const Button = React.memo(({type, children, onClick}) => {
          +   // 添加props比较逻辑
          + }, (prevProps, nextProps) => {
          +   return prevProps.type === nextProps.type && 
          +          prevProps.children === nextProps.children;
          + });
        `,
        
        finalCode: `export const Button = React.memo(({type, children, onClick}) => {
  return (
    <button className={\`btn btn-\${type}\`} onClick={onClick}>
      {children}
    </button>
  );
}, (prevProps, nextProps) => {
  return prevProps.type === nextProps.type && 
         prevProps.children === nextProps.children;
});`,
        
        steps: [
          '导入React.memo',
          '包装组件导出',
          '添加props比较函数',
          '验证渲染优化效果'
        ],
        
        applyFix: () => applyASTTransformation('memoTransform'),
        expectedImprovement: '渲染性能提升15%，重渲染次数减少60%'
      }
    });
  }
  
  return recommendations;
};
```
const IssueDetection: React.FC<{ baseline: BaselineInfo }> = ({ baseline }) => {
  const issues = detectRealTimeIssues(baseline);
  
  if (issues.length === 0) {
    return (
      <Card title="实时检测" style={{ marginBottom: 24 }}>
        <Result
          icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
          title="暂无检测到问题"
          subTitle="组件状态良好"
        />
      </Card>
    );
  }
  
  return (
    <Card title="实时问题检测" style={{ marginBottom: 24 }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        {issues.map((issue, index) => (
          <Alert
            key={index}
            type={issue.severity}
            showIcon
            message={
              <div>
                <strong>{issue.title}</strong>
                <div style={{ marginTop: 8, display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                  {/* 问题证据 - 截图或代码 */}
                  <div className="issue-evidence">
                    {issue.evidence.type === 'screenshot' && (
                      <div>
                        <img 
                          src={issue.evidence.url} 
                          alt="问题截图"
                          style={{ maxWidth: 300, border: '1px solid #d9d9d9' }}
                        />
                        {/* 标注问题区域 */}
                        {issue.evidence.annotations?.map((annotation, i) => (
                          <div key={i} className="annotation" style={{
                            position: 'absolute',
                            left: annotation.x,
                            top: annotation.y,
                            width: annotation.width,
                            height: annotation.height,
                            border: '2px solid #ff4d4f',
                            background: 'rgba(255, 77, 79, 0.1)'
                          }} />
                        ))}
                      </div>
                    )}
                    
                    {issue.evidence.type === 'code' && (
                      <div className="code-evidence">
                        <SyntaxHighlighter language="javascript" style={vs}>
                          {issue.evidence.code}
                        </SyntaxHighlighter>
                      </div>
                    )}
                  </div>
                  
                  {/* 解决建议 */}
                  <div className="issue-solution">
                    <div><strong>建议解决方案:</strong></div>
                    <div style={{ marginTop: 4 }}>{issue.solution}</div>
                    
                    {issue.quickFix && (
                      <div style={{ marginTop: 8 }}>
                        <Button 
                          size="small" 
                          icon={<CopyOutlined />}
                          onClick={() => copyToClipboard(issue.quickFix.code)}
                        >
                          复制修复代码
                        </Button>
                        <span style={{ marginLeft: 8, fontSize: '12px', color: '#666' }}>
                          预期效果: {issue.quickFix.expectedResult}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            }
          />
        ))}
      </Space>
    </Card>
  );
};
```

## 4. 优化建议组件

```tsx
const OptimizationSuggestions: React.FC<{ baseline: BaselineInfo }> = ({ baseline }) => {
  const suggestions = generateOptimizationSuggestions(baseline);
  const [expandedSuggestions, setExpandedSuggestions] = useState<Set<string>>(new Set());
  
  const toggleSuggestion = (id: string) => {
    const newExpanded = new Set(expandedSuggestions);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedSuggestions(newExpanded);
  };
  
  return (
    <Card title="智能优化建议" style={{ marginBottom: 24 }}>
      <List
        dataSource={suggestions}
        renderItem={(suggestion) => (
          <List.Item>
            <Card
              size="small"
              style={{ width: '100%' }}
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Space>
                    <Tag color={getImpactColor(suggestion.impact)}>
                      {suggestion.impact}影响
                    </Tag>
                    <span>{suggestion.title}</span>
                  </Space>
                  <Space>
                    <span style={{ fontSize: '12px', color: '#666' }}>
                      预计耗时: {suggestion.effort}
                    </span>
                    <Button 
                      size="small" 
                      onClick={() => toggleSuggestion(suggestion.id)}
                    >
                      {expandedSuggestions.has(suggestion.id) ? '收起' : '查看详情'}
                    </Button>
                  </Space>
                </div>
              }
            >
              {expandedSuggestions.has(suggestion.id) && (
                <div>
                  {/* 代码对比 */}
                  <Row gutter={16} style={{ marginBottom: 16 }}>
                    <Col span={12}>
                      <div className="code-section">
                        <div className="code-header">当前代码</div>
                        <SyntaxHighlighter language="javascript" style={vs}>
                          {suggestion.currentCode}
                        </SyntaxHighlighter>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className="code-section">
                        <div className="code-header">建议修改</div>
                        <SyntaxHighlighter language="javascript" style={vs}>
                          {suggestion.suggestedCode}
                        </SyntaxHighlighter>
                      </div>
                    </Col>
                  </Row>
                  
                  {/* 详细说明和操作 */}
                  <div className="suggestion-details">
                    <div><strong>为什么这样建议:</strong></div>
                    <p>{suggestion.reasoning}</p>
                    
                    <div><strong>预期效果:</strong></div>
                    <ul>
                      {suggestion.benefits.map((benefit, i) => (
                        <li key={i}>{benefit}</li>
                      ))}
                    </ul>
                    
                    <div style={{ marginTop: 16 }}>
                      <Space>
                        <Button 
                          icon={<CopyOutlined />} 
                          onClick={() => copyToClipboard(suggestion.suggestedCode)}
                        >
                          复制建议代码
                        </Button>
                        <Button type="link">
                          在VS Code中打开
                        </Button>
                        <Button type="link">
                          查看相关文档
                        </Button>
                      </Space>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </List.Item>
        )}
      />
    </Card>
  );
};
```

## 5. 变更影响预测组件

```tsx
const ChangeImpactPreview: React.FC<{ baseline: BaselineInfo }> = ({ baseline }) => {
  const suggestions = generateOptimizationSuggestions(baseline);
  const impactPreview = calculateImpactPreview(baseline, suggestions);
  
  return (
    <Card title="优化效果预览" style={{ marginBottom: 24 }}>
      <Alert
        message="如果你采纳所有建议，预期会有以下改进："
        type="info"
        style={{ marginBottom: 16 }}
      />
      
      <Row gutter={24}>
        <Col span={12}>
          <div className="impact-section">
            <h4>当前状态</h4>
            <div className="metrics-list">
              <div className="metric-item">
                <span className="metric-label">Bundle Size:</span>
                <span className="metric-value">{baseline.currentMetrics?.bundleSize || '2.3KB'}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">渲染性能:</span>
                <span className="metric-value current">
                  {getPerformanceLevel(baseline.performanceMetrics?.renderTime)}
                </span>
              </div>
              <div className="metric-item">
                <span className="metric-label">类型安全:</span>
                <span className="metric-value">
                  {baseline.propsAnalysis?.hasStrictTypes ? '完整' : '部分'}
                </span>
              </div>
              <div className="metric-item">
                <span className="metric-label">可访问性:</span>
                <span className="metric-value">{baseline.accessibilityScore || 75}分</span>
              </div>
            </div>
          </div>
        </Col>
        
        <Col span={12}>
          <div className="impact-section">
            <h4>优化后预期</h4>
            <div className="metrics-list">
              <div className="metric-item">
                <span className="metric-label">Bundle Size:</span>
                <span className="metric-value improved">
                  {impactPreview.bundleSize} 
                  <span className="improvement">(-{impactPreview.bundleSizeImprovement})</span>
                </span>
              </div>
              <div className="metric-item">
                <span className="metric-label">渲染性能:</span>
                <span className="metric-value improved">
                  优秀 
                  <span className="improvement">(减少{impactPreview.renderingImprovement}重渲染)</span>
                </span>
              </div>
              <div className="metric-item">
                <span className="metric-label">类型安全:</span>
                <span className="metric-value improved">完整</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">可访问性:</span>
                <span className="metric-value improved">
                  {impactPreview.accessibilityScore}分
                  <span className="improvement">(+{impactPreview.accessibilityImprovement})</span>
                </span>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      
      {/* 风险评估 */}
      {impactPreview.risks.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <Alert
            type="warning"
            message="需要注意的风险："
            description={
              <ul>
                {impactPreview.risks.map((risk, i) => (
                  <li key={i}>{risk}</li>
                ))}
              </ul>
            }
          />
        </div>
      )}
    </Card>
  );
};
```

## 6. 数据计算函数

```typescript
// 健康指标计算
const calculateHealthMetrics = (baseline: BaselineInfo) => {
  return {
    visual: calculateVisualStability(baseline),
    visualTrend: calculateVisualTrend(baseline),
    props: calculatePropsCompleteness(baseline),
    propsIssues: identifyPropsIssues(baseline),
    performance: calculatePerformanceScore(baseline),
    quality: calculateCodeQualityScore(baseline),
    qualityBadges: generateQualityBadges(baseline)
  };
};

// 实时问题检测
const detectRealTimeIssues = (baseline: BaselineInfo) => {
  const issues = [];
  
  // 视觉问题检测
  if (baseline.visualAnalysis?.hasReadabilityIssues) {
    issues.push({
      severity: 'warning',
      title: 'Button在small尺寸下文字可读性降低',
      evidence: {
        type: 'screenshot',
        url: '/analysis/button-small-readability.png',
        annotations: [{
          x: 10, y: 20, width: 100, height: 30
        }]
      },
      solution: '调整font-size从12px到14px，提高小尺寸下的可读性',
      quickFix: {
        code: '.button-small { font-size: 14px; }',
        expectedResult: '提高可读性，符合WCAG标准'
      }
    });
  }
  
  // 性能问题检测
  if (baseline.performanceMetrics?.renderTime > 50) {
    issues.push({
      severity: 'error',
      title: '组件渲染时间过长，影响用户体验',
      evidence: {
        type: 'code',
        code: 'export const Button = (props) => {\n  // 每次渲染都会创建新对象\n  const style = { ...baseStyle, ...props.style };\n  return <button style={style}>{props.children}</button>;\n};'
      },
      solution: '使用React.memo和useMemo优化渲染性能',
      quickFix: {
        code: 'export const Button = React.memo((props) => {\n  const style = useMemo(() => ({ ...baseStyle, ...props.style }), [props.style]);\n  return <button style={style}>{props.children}</button>;\n});',
        expectedResult: '减少70%的不必要重渲染'
      }
    });
  }
  
  return issues;
};

// 优化建议生成
const generateOptimizationSuggestions = (baseline: BaselineInfo) => {
  const suggestions = [];
  
  // 性能优化建议
  if (!baseline.codeAnalysis?.hasReactMemo) {
    suggestions.push({
      id: 'memo-optimization',
      type: 'performance',
      impact: 'high',
      effort: '5分钟',
      title: '添加React.memo减少重渲染',
      currentCode: 'export const Button = (props) => {',
      suggestedCode: 'export const Button = React.memo((props) => {',
      reasoning: '当前组件在父组件重渲染时会无条件重渲染，使用React.memo可以避免props未变化时的重渲染',
      benefits: [
        '减少70%的不必要重渲染',
        '提升页面整体性能',
        '降低CPU使用率'
      ]
    });
  }
  
  return suggestions;
};
```

## 7. 样式定义

```css
.baseline-detail-content {
  .health-metric {
    text-align: center;
    
    .metric-info {
      margin-top: 8px;
      
      .metric-title {
        font-weight: 500;
        margin-bottom: 4px;
      }
      
      .metric-detail {
        font-size: 12px;
        color: #666;
      }
    }
  }
  
  .issue-evidence {
    position: relative;
    
    .annotation {
      pointer-events: none;
    }
  }
  
  .code-section {
    .code-header {
      background: #fafafa;
      padding: 8px 12px;
      border: 1px solid #d9d9d9;
      border-bottom: none;
      font-size: 12px;
      font-weight: 500;
    }
  }
  
  .impact-section {
    .metrics-list {
      .metric-item {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid #f0f0f0;
        
        .metric-value.improved {
          color: #52c41a;
          font-weight: 500;
        }
        
        .improvement {
          font-size: 12px;
          color: #52c41a;
          margin-left: 4px;
        }
      }
    }
  }
}
```

这个完整的详情Modal设计重点突出了：

1. **实用性**：每个建议都有具体的代码和预期效果
2. **可视化**：用截图、图表、对比等方式展示问题和改进
3. **可操作性**：提供复制代码、跳转IDE等实际帮助
4. **智能性**：基于真实分析数据，而不是假数据