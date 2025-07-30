import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Row, Col, Statistic, Space, Button, Tabs, Alert, Tag, Spin } from 'antd';
import { BranchesOutlined, WarningOutlined, CheckCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import ComponentVisualComparison from '../../../../components/ComponentVisualComparison';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

interface BranchAnalysisResult {
  id: string;
  repository: string;
  branch: string;
  commit: string;
  prNumber?: number;
  timestamp: Date;
  summary: {
    totalComponents: number;
    changedComponents: number;
    breakingChanges: number;
    newComponents: number;
    deletedComponents: number;
  };
  components: ComponentAnalysis[];
  status: 'success' | 'warning' | 'error';
  approved: boolean;
  approvedBy?: string;
  approvedAt?: Date;
}

interface ComponentAnalysis {
  name: string;
  path: string;
  branch: string;
  hasVisualChange: boolean;
  breakingChange: boolean;
  failedSnapshots: SnapshotComparison[];
  propChanges: PropChange[];
  riskLevel: 'low' | 'medium' | 'high';
  lastModified: Date;
  author: string;
}

interface SnapshotComparison {
  id: string;
  props: Record<string, any>;
  propsHash: string;
  propsDescription: string;
  baselineSnapshot: string;
  currentSnapshot: string;
  diffImage: string;
  diffPercentage: number;
  changedPixels: number;
  resolution: string;
  detectedAt: string;
  detectedChanges: ChangeDetail[];
  potentialImpact: string[];
  severity: 'minor' | 'moderate' | 'critical';
}

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

interface PropChange {
  prop: string;
  type: 'added' | 'removed' | 'modified';
  oldValue?: any;
  newValue?: any;
  impact: 'breaking' | 'non-breaking';
}

const BranchAnalysisDetail: React.FC = () => {
  const { id } = useParams();
  const [analysis, setAnalysis] = useState<BranchAnalysisResult | null>(null);
  const [compareMode, setCompareMode] = useState<'visual' | 'code'>('visual');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟API调用
    setLoading(true);
    setTimeout(() => {
      // 模拟数据
      const mockAnalysis: BranchAnalysisResult = {
        id: id || '1',
        repository: 'beep-v1-webapp',
        branch: 'feature/button-redesign',
        commit: 'a1b2c3d4e5f6',
        prNumber: 123,
        timestamp: new Date('2025-01-29T10:30:00'),
        summary: {
          totalComponents: 15,
          changedComponents: 3,
          breakingChanges: 2,
          newComponents: 0,
          deletedComponents: 0,
        },
        components: [
          {
            name: 'Button',
            path: 'src/common/components/Button/index.jsx',
            branch: 'feature/button-redesign',
            hasVisualChange: true,
            breakingChange: true,
            riskLevel: 'high',
            lastModified: new Date('2025-01-29T09:30:00'),
            author: 'developer@company.com',
            propChanges: [
              {
                prop: 'type',
                type: 'modified',
                oldValue: 'primary',
                newValue: 'primary',
                impact: 'breaking',
              },
            ],
            failedSnapshots: [
              {
                id: 'button-primary-normal',
                props: { type: 'primary', size: 'normal', children: '确认' },
                propsHash: 'abc123',
                propsDescription: 'Primary Button - Normal Size',
                baselineSnapshot: '/api/snapshots/baseline-button-primary-normal.png',
                currentSnapshot: '/api/snapshots/current-button-primary-normal.png',
                diffImage: '/api/snapshots/diff-button-primary-normal.png',
                diffPercentage: 12.5,
                changedPixels: 2840,
                resolution: '1280x800',
                detectedAt: '2025-01-29T10:30:00',
                severity: 'critical',
                detectedChanges: [
                  {
                    type: 'color',
                    description: '按钮背景色从蓝色 #1890FF 变为橙色 #FF9419',
                    area: { x: 10, y: 10, width: 120, height: 32 },
                  },
                ],
                potentialImpact: ['订单确认页面', '支付流程', '设置保存按钮'],
              },
              {
                id: 'button-primary-small',
                props: { type: 'primary', size: 'small', children: '提交' },
                propsHash: 'def456',
                propsDescription: 'Primary Button - Small Size',
                baselineSnapshot: '/api/snapshots/baseline-button-primary-small.png',
                currentSnapshot: '/api/snapshots/current-button-primary-small.png',
                diffImage: '/api/snapshots/diff-button-primary-small.png',
                diffPercentage: 8.3,
                changedPixels: 1520,
                resolution: '1280x800',
                detectedAt: '2025-01-29T10:30:00',
                severity: 'moderate',
                detectedChanges: [
                  {
                    type: 'color',
                    description: '按钮背景色变更',
                    area: { x: 10, y: 10, width: 80, height: 24 },
                  },
                ],
                potentialImpact: ['表单提交按钮', '弹窗确认按钮'],
              },
            ],
          },
          {
            name: 'Modal',
            path: 'src/common/components/Modal/index.jsx',
            branch: 'feature/button-redesign',
            hasVisualChange: true,
            breakingChange: false,
            riskLevel: 'low',
            lastModified: new Date('2025-01-29T09:15:00'),
            author: 'developer@company.com',
            propChanges: [],
            failedSnapshots: [
              {
                id: 'modal-basic',
                props: { visible: true, title: '确认对话框', children: '确认删除此项目？' },
                propsHash: 'ghi789',
                propsDescription: 'Basic Modal',
                baselineSnapshot: '/api/snapshots/baseline-modal-basic.png',
                currentSnapshot: '/api/snapshots/current-modal-basic.png',
                diffImage: '/api/snapshots/diff-modal-basic.png',
                diffPercentage: 3.2,
                changedPixels: 720,
                resolution: '1280x800',
                detectedAt: '2025-01-29T10:30:00',
                severity: 'minor',
                detectedChanges: [
                  {
                    type: 'color',
                    description: '内部按钮颜色继承变更',
                    area: { x: 350, y: 250, width: 100, height: 32 },
                  },
                ],
                potentialImpact: ['删除确认弹窗'],
              },
            ],
          },
        ],
        status: 'error',
        approved: false,
      };
      
      setAnalysis(mockAnalysis);
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleApprove = () => {
    if (analysis) {
      setAnalysis({
        ...analysis,
        approved: true,
        approvedBy: 'current-user',
        approvedAt: new Date(),
        status: 'success',
      });
    }
  };

  const handleExportReport = () => {
    // 导出报告逻辑
    console.log('导出报告');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!analysis) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h3>未找到分析结果</h3>
        <Link to="/branch-analysis">
          <Button type="primary">返回列表</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* 返回按钮 */}
      <div style={{ marginBottom: 16 }}>
        <Link to="/pure-components/branch-results">
          <Button icon={<ArrowLeftOutlined />} type="text">
            返回分支列表
          </Button>
        </Link>
      </div>

      {/* 头部信息 */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 16 }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, marginBottom: 8 }}>
            <BranchesOutlined style={{ marginRight: 12, color: '#1890ff' }} />
            {analysis.branch}
          </h1>
          <div style={{ color: '#666' }}>
            <span>{analysis.repository}</span>
            {analysis.prNumber && (
              <Tag color="blue" style={{ marginLeft: 8 }}>
                PR #{analysis.prNumber}
              </Tag>
            )}
            <span style={{ marginLeft: 16 }}>
              提交: {analysis.commit} • {dayjs(analysis.timestamp).fromNow()}
            </span>
          </div>
        </div>

        <Row gutter={16}>
          <Col span={6}>
            <Statistic
              title="检测到的组件"
              value={analysis.summary.totalComponents}
              prefix={<BranchesOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="破坏性变更"
              value={analysis.summary.breakingChanges}
              valueStyle={{ color: analysis.summary.breakingChanges > 0 ? '#cf1322' : '#3f8600' }}
              prefix={<WarningOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="变更组件"
              value={analysis.summary.changedComponents}
              valueStyle={{ color: '#faad14' }}
            />
          </Col>
          <Col span={6}>
            <Space>
              {!analysis.approved && analysis.summary.breakingChanges > 0 && (
                <Button type="primary" danger onClick={handleApprove}>
                  批准变更
                </Button>
              )}
              {analysis.approved && (
                <Tag color="green" icon={<CheckCircleOutlined />}>
                  已批准
                </Tag>
              )}
              <Button onClick={handleExportReport}>
                导出报告
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 警告提示 */}
      {analysis.summary.breakingChanges > 0 && !analysis.approved && (
        <Alert
          message="检测到破坏性变更"
          description={`发现 ${analysis.summary.breakingChanges} 个组件存在破坏性变更，这些变更可能会影响使用这些组件的其他页面。请仔细检查变更内容并确认是否为预期变更。`}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
          action={
            <Button  danger onClick={handleApprove}>
              确认并批准
            </Button>
          }
        />
      )}

      {/* 组件变更详情 */}
      <Card title="组件变更详情">
        <Tabs activeKey={compareMode} onChange={setCompareMode}>
          <Tabs.TabPane tab={`可视化对比 (${analysis.components.filter(c => c.hasVisualChange).length})`} key="visual">
            <ComponentVisualComparison 
              components={analysis.components.filter(c => c.hasVisualChange)}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab={`代码对比 (${analysis.components.length})`} key="code">
            <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
              <h3>代码对比功能</h3>
              <p>显示组件源代码的具体变更，包括 Props 定义、样式修改等</p>
              <Button type="dashed">查看代码差异</Button>
            </div>
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default BranchAnalysisDetail;