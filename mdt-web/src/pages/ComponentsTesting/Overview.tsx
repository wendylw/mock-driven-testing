import React from 'react';
import { Card, Row, Col, Button, Progress, Tag, Space } from 'antd';
import { ExperimentOutlined, ApiOutlined, LinkOutlined, RightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const ComponentsTestingOverview: React.FC = () => {
  const testingLevels = [
    {
      id: 'pure',
      title: 'Pure Components',
      icon: <ExperimentOutlined style={{ fontSize: '24px', color: '#52c41a' }} />,
      description: '测试组件本身的纯净性：相同Props → 相同输出',
      features: [
        '组件快照对比',
        'Props变化检测',
        '视觉回归测试',
        '分支影响分析',
        '基准管理'
      ],
      coverage: 85,
      status: 'active',
      routes: [
        { name: '组件分析', path: '/pure-components/analysis' },
        { name: '分支检测结果', path: '/pure-components/branch-results' },
        { name: '基准管理', path: '/pure-components/baselines' }
      ]
    },
    {
      id: 'business',
      title: 'Business Components',
      icon: <ApiOutlined style={{ fontSize: '24px', color: '#1890ff' }} />,
      description: '测试组件在业务场景中的行为和逻辑',
      features: [
        '业务数据驱动测试',
        '用户交互流程验证',
        '业务规则一致性检查',
        '场景适配性测试',
        '工作流程验证'
      ],
      coverage: 35,
      status: 'development',
      routes: [
        { name: '业务场景测试', path: '/business-components/scenarios' },
        { name: '业务流程验证', path: '/business-components/workflows' }
      ]
    },
    {
      id: 'integration',
      title: 'Integration Components',
      icon: <LinkOutlined style={{ fontSize: '24px', color: '#722ed1' }} />,
      description: '测试组件在完整系统中的集成表现',
      features: [
        '组件间交互测试',
        '页面集成验证',
        '端到端用户旅程',
        '系统性能测试',
        'API集成验证'
      ],
      coverage: 15,
      status: 'planning',
      routes: [
        { name: '端到端测试', path: '/integration-components/e2e' },
        { name: '页面集成测试', path: '/integration-components/pages' }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'development': return 'blue';
      case 'planning': return 'orange';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '已上线';
      case 'development': return '开发中';
      case 'planning': return '规划中';
      default: return '未知';
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, marginBottom: 8 }}>
          <ExperimentOutlined style={{ marginRight: 16, color: '#1890ff' }} />
          组件测试体系总览
        </h1>
        <p style={{ color: '#666', fontSize: '16px', margin: 0 }}>
          分层级的组件质量保障体系，从组件本身到业务场景再到系统集成
        </p>
      </div>

      {/* 架构图示 */}
      <Card 
        title="测试架构层级" 
        style={{ marginBottom: 24 }}
        bodyStyle={{ padding: '32px' }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
            {testingLevels.map((level, index) => (
              <div key={level.id}>
                <div style={{ 
                  background: '#f5f5f5', 
                  borderRadius: '12px', 
                  padding: '24px', 
                  textAlign: 'center',
                  minWidth: '200px',
                  border: level.status === 'active' ? '2px solid #52c41a' : '1px solid #d9d9d9'
                }}>
                  {level.icon}
                  <h3 style={{ margin: '12px 0 8px 0', fontSize: '18px' }}>
                    {level.title}
                  </h3>
                  <Tag color={getStatusColor(level.status)} style={{ marginBottom: '8px' }}>
                    {getStatusText(level.status)}
                  </Tag>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    覆盖率: {level.coverage}%
                  </div>
                  <Progress 
                    percent={level.coverage} 
                     
                    showInfo={false}
                    style={{ marginTop: '8px' }}
                  />
                </div>
                
                {index < testingLevels.length - 1 && (
                  <div style={{ 
                    display: 'inline-block', 
                    margin: '0 20px',
                    fontSize: '24px',
                    color: '#1890ff'
                  }}>
                    <RightOutlined />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* 详细信息卡片 */}
      <Row gutter={[16, 16]}>
        {testingLevels.map((level) => (
          <Col key={level.id} span={8}>
            <Card
              title={
                <Space>
                  {level.icon}
                  <span>{level.title}</span>
                  <Tag color={getStatusColor(level.status)}>
                    {getStatusText(level.status)}
                  </Tag>
                </Space>
              }
              style={{ 
                height: '100%',
                border: level.status === 'active' ? '2px solid #52c41a' : undefined
              }}
              bodyStyle={{ display: 'flex', flexDirection: 'column', height: '100%' }}
            >
              <div style={{ flex: 1 }}>
                <p style={{ color: '#666', marginBottom: '16px' }}>
                  {level.description}
                </p>
                
                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>核心功能:</h4>
                  <ul style={{ margin: 0, paddingLeft: '16px' }}>
                    {level.features.map((feature, index) => (
                      <li key={index} style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>测试覆盖率:</h4>
                  <Progress 
                    percent={level.coverage} 
                    strokeColor={level.coverage > 70 ? '#52c41a' : level.coverage > 40 ? '#faad14' : '#ff4d4f'}
                  />
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>快速访问:</h4>
                <Space direction="vertical" size={4} style={{ width: '100%' }}>
                  {level.routes.map((route, index) => (
                    <Link key={index} to={route.path}>
                      <Button 
                        block 
                         
                        type={level.status === 'active' ? 'default' : 'dashed'}
                        disabled={level.status === 'planning'}
                      >
                        {route.name}
                      </Button>
                    </Link>
                  ))}
                </Space>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 使用指南 */}
      <Card title="使用指南" style={{ marginTop: 24 }}>
        <Row gutter={16}>
          <Col span={8}>
            <h4>🎯 Pure Components</h4>
            <p style={{ fontSize: '13px', color: '#666' }}>
              从这里开始！检测组件的基本功能是否正常，确保相同的Props总是产生相同的输出。
              这是整个测试体系的基础。
            </p>
          </Col>
          <Col span={8}>
            <h4>🏢 Business Components</h4>
            <p style={{ fontSize: '13px', color: '#666' }}>
              在Pure Components测试通过后，验证组件在具体业务场景中的表现，
              确保业务逻辑正确。
            </p>
          </Col>
          <Col span={8}>
            <h4>🔗 Integration Components</h4>
            <p style={{ fontSize: '13px', color: '#666' }}>
              最后验证组件在完整系统中的集成表现，包括与其他组件的交互和
              端到端的用户体验。
            </p>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ComponentsTestingOverview;