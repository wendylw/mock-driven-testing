import React from 'react';
import { Card, Row, Col, Table, Tag, Empty, Typography, Badge, Progress, Space, Button } from 'antd';
import { MonitorOutlined, ApiOutlined, CheckCircleOutlined, ExclamationCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { formatDate, formatDuration, getMethodColor, getStatusColor } from '../../utils/helpers';

const { Title, Text } = Typography;

const Monitor: React.FC = () => {
  // 模拟请求日志数据
  const requestLogs = [
    {
      id: '1',
      method: 'GET',
      url: '/api/user/123',
      status: 200,
      duration: 45,
      timestamp: new Date().toISOString(),
      mockId: 'mock-1',
      mockName: 'User API - Success'
    },
    {
      id: '2',
      method: 'POST',
      url: '/api/order',
      status: 400,
      duration: 23,
      timestamp: new Date(Date.now() - 60000).toISOString(),
      mockId: null,
      mockName: null
    },
    {
      id: '3',
      method: 'GET',
      url: '/api/products',
      status: 200,
      duration: 89,
      timestamp: new Date(Date.now() - 120000).toISOString(),
      mockId: 'mock-2',
      mockName: 'Product API - List'
    }
  ];

  const columns = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 150,
      render: (timestamp: string) => formatDate(timestamp, 'HH:mm:ss')
    },
    {
      title: '方法',
      dataIndex: 'method',
      key: 'method',
      width: 80,
      render: (method: string) => (
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
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: number) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      )
    },
    {
      title: '耗时',
      dataIndex: 'duration',
      key: 'duration',
      width: 80,
      render: (duration: number) => formatDuration(duration)
    },
    {
      title: 'Mock',
      dataIndex: 'mockName',
      key: 'mockName',
      render: (mockName: string | null) => (
        mockName ? (
          <Tag color="blue">{mockName}</Tag>
        ) : (
          <Tag color="red">未匹配</Tag>
        )
      )
    }
  ];

  // 计算统计数据
  const totalRequests = requestLogs.length;
  const mockHits = requestLogs.filter(log => log.mockId).length;
  const avgResponseTime = Math.round(requestLogs.reduce((sum, log) => sum + log.duration, 0) / requestLogs.length) || 0;
  const successRate = totalRequests > 0 ? Math.round((mockHits / totalRequests) * 100) : 0;

  return (
    <div>
      {/* 页面标题 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, color: '#262626' }}>
          <MonitorOutlined style={{ marginRight: 8, color: '#52c41a' }} />
          实时监控中心
        </Title>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
          <Badge status="processing" />
          <Text style={{ fontSize: 16, color: '#666', marginLeft: 8 }}>
            系统运行状态良好，正在实时监控API请求
          </Text>
          <Button 
            type="text" 
            icon={<ReloadOutlined />} 
            style={{ marginLeft: 16 }}
            onClick={() => window.location.reload()}
          >
            刷新数据
          </Button>
        </div>
      </div>

      {/* 核心指标卡片 */}
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            hoverable
            style={{ 
              textAlign: 'center',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}
            bodyStyle={{ padding: 20 }}
          >
            <ApiOutlined style={{ fontSize: 28, marginBottom: 12 }} />
            <div style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 8 }}>
              {totalRequests}
            </div>
            <div style={{ fontSize: 14, opacity: 0.9 }}>今日总请求数</div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card 
            hoverable
            style={{ 
              textAlign: 'center',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white'
            }}
            bodyStyle={{ padding: 20 }}
          >
            <CheckCircleOutlined style={{ fontSize: 28, marginBottom: 12 }} />
            <div style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 8 }}>
              {mockHits}
            </div>
            <div style={{ fontSize: 14, opacity: 0.9 }}>Mock成功命中</div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card 
            hoverable
            style={{ 
              textAlign: 'center',
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white'
            }}
            bodyStyle={{ padding: 20 }}
          >
            <div style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 8 }}>
              {avgResponseTime}ms
            </div>
            <div style={{ fontSize: 14, opacity: 0.9 }}>平均响应时间</div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card 
            hoverable
            style={{ 
              textAlign: 'center',
              background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
              color: 'white'
            }}
            bodyStyle={{ padding: 20 }}
          >
            <div style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 8 }}>
              {successRate}%
            </div>
            <div style={{ fontSize: 14, opacity: 0.9 }}>Mock命中率</div>
          </Card>
        </Col>
      </Row>

      {/* 详细分析区域 */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <span style={{ fontSize: 18 }}>
                <CheckCircleOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                系统健康状态
              </span>
            }
            extra={<Badge status="processing" text="实时监控" />}
          >
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text strong>Mock命中率</Text>
                  <Text style={{ color: successRate >= 80 ? '#52c41a' : '#faad14' }}>
                    {successRate}%
                  </Text>
                </div>
                <Progress 
                  percent={successRate} 
                  strokeColor={successRate >= 80 ? '#52c41a' : '#faad14'}
                  showInfo={false}
                />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {successRate >= 80 ? '✅ 命中率良好' : '⚠️ 建议检查Mock规则配置'}
                </Text>
              </div>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text strong>响应时间</Text>
                  <Text style={{ color: avgResponseTime <= 100 ? '#52c41a' : '#ff4d4f' }}>
                    {avgResponseTime}ms
                  </Text>
                </div>
                <Progress 
                  percent={Math.min((avgResponseTime / 200) * 100, 100)} 
                  strokeColor={avgResponseTime <= 100 ? '#52c41a' : '#ff4d4f'}
                  showInfo={false}
                />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {avgResponseTime <= 100 ? '⚡ 响应速度优秀' : '🐌 响应稍慢，建议优化'}
                </Text>
              </div>
            </Space>
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card
            title={
              <span style={{ fontSize: 18 }}>
                <ExclamationCircleOutlined style={{ marginRight: 8, color: '#faad14' }} />
                请求分析
              </span>
            }
          >
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>总请求数:</Text>
                <Text strong style={{ color: '#1890ff' }}>{totalRequests} 次</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>成功命中:</Text>
                <Text strong style={{ color: '#52c41a' }}>{mockHits} 次</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>未命中:</Text>
                <Text strong style={{ color: '#ff4d4f' }}>{totalRequests - mockHits} 次</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>平均耗时:</Text>
                <Text strong style={{ color: '#722ed1' }}>{avgResponseTime}ms</Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* 请求日志表格 */}
      <Card 
        title={
          <span style={{ fontSize: 18 }}>
            <MonitorOutlined style={{ marginRight: 8, color: '#1890ff' }} />
            实时请求日志
          </span>
        }
        extra={
          <Space>
            <Badge status="processing" text="实时更新" />
            <Text type="secondary">最近 {requestLogs.length} 条记录</Text>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={requestLogs}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
          }}
          size="middle"
          locale={{
            emptyText: (
              <Empty 
                description="暂无请求日志" 
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )
          }}
        />
      </Card>
    </div>
  );
};

export default Monitor;