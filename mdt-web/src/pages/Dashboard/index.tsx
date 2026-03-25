import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Space, Divider, Button, Tag, Typography, Progress } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, ApiOutlined, BranchesOutlined, MonitorOutlined, SettingOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalMocks: 0,
    activeMocks: 0,
    totalScenarios: 0,
    activeScenario: '暂无',
    totalRequests: 0,
    avgResponseTime: 0,
    mockHitRate: 0,
    errorRate: 0
  });

  useEffect(() => {
    // 模拟获取统计数据
    setStats({
      totalMocks: 156,
      activeMocks: 142,
      totalScenarios: 12,
      activeScenario: '正常用户场景',
      totalRequests: 15234,
      avgResponseTime: 23,
      mockHitRate: 89.5,
      errorRate: 2.1
    });
  }, []);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, color: '#262626' }}>
          🎭 Mock Driven Testing 平台
        </Title>
        <Paragraph style={{ marginTop: 8, fontSize: 16, color: '#666' }}>
          欢迎使用MDT平台！这里是您的智能Mock管理中心，让API测试变得更简单高效。
        </Paragraph>
      </div>
      
      {/* 核心统计数据 */}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            hoverable
            style={{ textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
            bodyStyle={{ padding: 24 }}
          >
            <ApiOutlined style={{ fontSize: 32, color: 'white', marginBottom: 16 }} />
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>总Mock数</span>}
              value={stats.totalMocks}
              suffix="个"
              valueStyle={{ color: 'white', fontSize: 28 }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card 
            hoverable
            style={{ textAlign: 'center', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}
            bodyStyle={{ padding: 24 }}
          >
            <ArrowUpOutlined style={{ fontSize: 32, color: 'white', marginBottom: 16 }} />
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>激活Mock数</span>}
              value={stats.activeMocks}
              suffix="个"
              valueStyle={{ color: 'white', fontSize: 28 }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card 
            hoverable
            style={{ textAlign: 'center', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}
            bodyStyle={{ padding: 24 }}
          >
            <MonitorOutlined style={{ fontSize: 32, color: 'white', marginBottom: 16 }} />
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>今日请求</span>}
              value={stats.totalRequests}
              suffix="次"
              valueStyle={{ color: 'white', fontSize: 28 }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card 
            hoverable
            style={{ textAlign: 'center', background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}
            bodyStyle={{ padding: 24 }}
          >
            <ArrowDownOutlined style={{ fontSize: 32, color: 'white', marginBottom: 16 }} />
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>平均响应</span>}
              value={stats.avgResponseTime}
              suffix="ms"
              valueStyle={{ color: 'white', fontSize: 28 }}
            />
          </Card>
        </Col>
      </Row>

      {/* 详细信息和操作区域 */}
      <Row gutter={[24, 24]} style={{ marginTop: 32 }}>
        <Col xs={24} lg={12}>
          <Card 
            title={
              <span style={{ fontSize: 18 }}>
                <BranchesOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                当前场景状态
              </span>
            }
            extra={<Tag color="processing">实时同步</Tag>}
          >
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div>
                <div style={{ marginBottom: 8 }}>
                  <strong style={{ fontSize: 16 }}>激活场景：</strong>
                  <Tag color="success" style={{ marginLeft: 8, fontSize: 14 }}>
                    {stats.activeScenario}
                  </Tag>
                </div>
                <div style={{ color: '#666' }}>
                  当前已激活 {stats.activeMocks} 个Mock规则，覆盖主要API接口
                </div>
              </div>
              
              <div>
                <div style={{ marginBottom: 8 }}>
                  <strong style={{ fontSize: 16 }}>场景总数：</strong>
                  <span style={{ marginLeft: 8, fontSize: 16, color: '#1890ff' }}>
                    {stats.totalScenarios} 个
                  </span>
                </div>
                <div style={{ color: '#666' }}>
                  支持快速切换不同测试场景，提高测试效率
                </div>
              </div>
            </Space>
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card 
            title={
              <span style={{ fontSize: 18 }}>
                <MonitorOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                系统性能
              </span>
            }
            extra={<Tag color="success">运行良好</Tag>}
          >
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <strong style={{ fontSize: 16 }}>Mock命中率</strong>
                  <span style={{ color: '#52c41a', fontSize: 16, fontWeight: 'bold' }}>
                    {stats.mockHitRate}%
                  </span>
                </div>
                <Progress 
                  percent={stats.mockHitRate} 
                  strokeColor="#52c41a"
                  showInfo={false}
                />
                <div style={{ color: '#666', marginTop: 4 }}>
                  API请求成功匹配到Mock规则的比例
                </div>
              </div>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <strong style={{ fontSize: 16 }}>系统错误率</strong>
                  <span style={{ color: stats.errorRate < 5 ? '#52c41a' : '#ff4d4f', fontSize: 16, fontWeight: 'bold' }}>
                    {stats.errorRate}%
                  </span>
                </div>
                <Progress 
                  percent={stats.errorRate} 
                  strokeColor={stats.errorRate < 5 ? '#52c41a' : '#ff4d4f'}
                  showInfo={false}
                />
                <div style={{ color: '#666', marginTop: 4 }}>
                  系统运行稳定，错误率控制在合理范围内
                </div>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* 快速操作区域 */}
      <Row style={{ marginTop: 32 }}>
        <Col span={24}>
          <Card 
            title={
              <span style={{ fontSize: 18 }}>
                <SettingOutlined style={{ marginRight: 8, color: '#faad14' }} />
                快速操作
              </span>
            }
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Button 
                  type="primary" 
                  size="large" 
                  block
                  icon={<ApiOutlined />}
                  style={{ height: 60, fontSize: 16 }}
                >
                  创建新Mock
                </Button>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Button 
                  size="large" 
                  block
                  icon={<BranchesOutlined />}
                  style={{ height: 60, fontSize: 16 }}
                >
                  切换场景
                </Button>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Button 
                  size="large" 
                  block
                  icon={<MonitorOutlined />}
                  style={{ height: 60, fontSize: 16 }}
                >
                  查看监控
                </Button>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Button 
                  size="large" 
                  block
                  icon={<SettingOutlined />}
                  style={{ height: 60, fontSize: 16 }}
                >
                  系统设置
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;