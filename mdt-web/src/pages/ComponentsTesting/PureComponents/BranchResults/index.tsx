import React, { useState, useEffect } from 'react';
import { Table, Tag, Select, DatePicker, Space, Button, Badge, Row, Col, Card, Statistic } from 'antd';
import { BranchesOutlined, WarningOutlined, CheckCircleOutlined, EyeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

interface BranchSummary {
  id: string;
  branch: string;
  repository: string;
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
  status: 'success' | 'warning' | 'error';
  approved: boolean;
  approvedBy?: string;
  approvedAt?: Date;
}

const BranchAnalysis: React.FC = () => {
  const [branches, setBranches] = useState<BranchSummary[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[Date, Date]>();
  const [loading, setLoading] = useState(false);

  // 模拟数据加载
  useEffect(() => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      setBranches([
        {
          id: '1',
          branch: 'feature/button-redesign',
          repository: 'beep-v1-webapp',
          commit: 'a1b2c3d',
          prNumber: 123,
          timestamp: new Date('2025-01-29T10:30:00'),
          summary: {
            totalComponents: 15,
            changedComponents: 3,
            breakingChanges: 2,
            newComponents: 0,
            deletedComponents: 0,
          },
          status: 'error',
          approved: false,
        },
        {
          id: '2',
          branch: 'feature/modal-update',
          repository: 'beep-v1-webapp',
          commit: 'b2c3d4e',
          prNumber: 124,
          timestamp: new Date('2025-01-29T09:15:00'),
          summary: {
            totalComponents: 8,
            changedComponents: 1,
            breakingChanges: 0,
            newComponents: 1,
            deletedComponents: 0,
          },
          status: 'success',
          approved: true,
          approvedBy: 'tech-lead',
          approvedAt: new Date('2025-01-29T09:45:00'),
        },
        {
          id: '3',
          branch: 'feature/input-validation',
          repository: 'beep-v1-webapp',
          commit: 'c3d4e5f',
          prNumber: 125,
          timestamp: new Date('2025-01-29T08:20:00'),
          summary: {
            totalComponents: 12,
            changedComponents: 2,
            breakingChanges: 1,
            newComponents: 0,
            deletedComponents: 0,
          },
          status: 'warning',
          approved: false,
        },
      ]);
      setLoading(false);
    }, 1000);
  }, [selectedRepo, dateRange]);

  const getStatusStats = () => {
    const stats = {
      total: branches.length,
      needsAttention: branches.filter(b => b.status === 'error').length,
      approved: branches.filter(b => b.approved).length,
      pending: branches.filter(b => !b.approved && b.status !== 'error').length,
    };
    return stats;
  };

  const stats = getStatusStats();

  const columns = [
    {
      title: '分支信息',
      key: 'branch',
      render: (_: any, record: BranchSummary) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
            <BranchesOutlined style={{ marginRight: 8, color: '#1890ff' }} />
            <Link 
              to={`/pure-components/branch-results/${record.id}`}
              style={{ fontWeight: 'bold', fontSize: '14px' }}
            >
              {record.branch}
            </Link>
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            <span>{record.repository}</span>
            {record.prNumber && (
              <Tag color="blue"  style={{ marginLeft: 8 }}>
                PR #{record.prNumber}
              </Tag>
            )}
          </div>
          <div style={{ fontSize: '11px', color: '#999', marginTop: 2 }}>
            {record.commit} • {new Date(record.timestamp).toLocaleString()}
          </div>
        </div>
      ),
      width: 280,
    },
    {
      title: '组件变更统计',
      key: 'changes',
      render: (_: any, record: BranchSummary) => (
        <div>
          <Row gutter={[8, 4]}>
            <Col span={24}>
              <span style={{ fontSize: '12px', color: '#666' }}>
                总计: {record.summary.totalComponents} 个组件
              </span>
            </Col>
            <Col span={24}>
              <Space size={4}>
                {record.summary.changedComponents > 0 && (
                  <Tag color="orange" >
                    已修改 {record.summary.changedComponents}
                  </Tag>
                )}
                {record.summary.newComponents > 0 && (
                  <Tag color="green" >
                    新增 {record.summary.newComponents}
                  </Tag>
                )}
                {record.summary.breakingChanges > 0 && (
                  <Tag color="red" >
                    破坏性 {record.summary.breakingChanges}
                  </Tag>
                )}
              </Space>
            </Col>
          </Row>
        </div>
      ),
      width: 200,
    },
    {
      title: '检测状态',
      key: 'status',
      render: (_: any, record: BranchSummary) => {
        if (record.status === 'error') {
          return (
            <div>
              <Tag color="red" icon={<WarningOutlined />}>
                需要处理
              </Tag>
              <div style={{ fontSize: '11px', color: '#ff4d4f', marginTop: 2 }}>
                发现 {record.summary.breakingChanges} 个破坏性变更
              </div>
            </div>
          );
        }
        if (record.approved) {
          return (
            <div>
              <Tag color="green" icon={<CheckCircleOutlined />}>
                已批准
              </Tag>
              <div style={{ fontSize: '11px', color: '#52c41a', marginTop: 2 }}>
                {record.approvedBy} • {record.approvedAt ? new Date(record.approvedAt).toLocaleString() : ''}
              </div>
            </div>
          );
        }
        return (
          <div>
            <Tag color="orange">
              待确认
            </Tag>
            <div style={{ fontSize: '11px', color: '#faad14', marginTop: 2 }}>
              等待审核批准
            </div>
          </div>
        );
      },
      width: 150,
    },
    {
      title: '操作',
      key: 'actions',
      render: (_: any, record: BranchSummary) => (
        <Space direction="vertical" size={4}>
          <Link to={`/pure-components/branch-results/${record.id}`}>
            <Button  icon={<EyeOutlined />}>
              查看详情
            </Button>
          </Link>
          <Button  type="link" style={{ padding: 0, height: 'auto' }}>
            对比基准
          </Button>
        </Space>
      ),
      width: 120,
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, marginBottom: 8 }}>
          <BranchesOutlined style={{ marginRight: 12, color: '#1890ff' }} />
          Feature分支检测结果
        </h1>
        <p style={{ color: '#666', margin: 0 }}>
          自动检测feature分支中Pure Component的变更，确保组件修改的可控性
        </p>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总分支数"
              value={stats.total}
              valueStyle={{ color: '#1890ff' }}
              prefix={<BranchesOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="需要处理"
              value={stats.needsAttention}
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已批准"
              value={stats.approved}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="待确认"
              value={stats.pending}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>
      
      {/* 过滤器 */}
      <Card style={{ marginBottom: 16 }}>
        <Space>
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
            placeholder={['开始时间', '结束时间']}
          />
          
          <Button type="primary" onClick={() => window.location.reload()}>
            刷新
          </Button>
        </Space>
      </Card>

      {/* 分支列表 */}
      <Card>
        <Table
          dataSource={branches}
          columns={columns}
          loading={loading}
          rowKey="id"
          pagination={{
            total: branches.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          }}
          rowClassName={(record) => {
            if (record.status === 'error') return 'error-row';
            if (record.approved) return 'success-row';
            return '';
          }}
        />
      </Card>

      <style jsx>{`
        .error-row {
          background-color: #fff2f0 !important;
        }
        .success-row {
          background-color: #f6ffed !important;
        }
      `}</style>
    </div>
  );
};

export default BranchAnalysis;