import React, { useEffect } from 'react';
import { Card, Row, Col, Tag, Button, Space, Badge, Divider } from 'antd';
import { PlusOutlined, PlayCircleOutlined, CopyOutlined, EditOutlined } from '@ant-design/icons';
import { useScenarioStore } from '../../stores/scenarioStore';
import { Scenario } from '../../services/types/scenario';
import { formatDate } from '../../utils/helpers';

const ScenarioList: React.FC = () => {
  const { 
    scenarios, 
    loading, 
    activeScenario,
    fetchScenarios, 
    fetchActiveScenario,
    activateScenario,
    cloneScenario
  } = useScenarioStore();

  useEffect(() => {
    fetchScenarios();
    fetchActiveScenario();
  }, [fetchScenarios, fetchActiveScenario]);

  const handleActivate = async (id: string) => {
    await activateScenario(id);
  };

  const handleClone = async (id: string) => {
    await cloneScenario(id);
  };

  const handleEdit = (scenario: Scenario) => {
    console.log('Edit scenario:', scenario);
    // TODO: 打开编辑对话框
  };

  const ScenarioCard: React.FC<{ scenario: Scenario }> = ({ scenario }) => (
    <Card
      
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{scenario.name}</span>
          {scenario.active && <Badge status="processing" text="激活中" />}
        </div>
      }
      extra={
        <Space>
          <Button
            type="text"
            icon={<PlayCircleOutlined />}
            onClick={() => handleActivate(scenario.id)}
            disabled={scenario.active}
          >
            激活
          </Button>
          <Button
            type="text"
            icon={<CopyOutlined />}
            onClick={() => handleClone(scenario.id)}
          >
            克隆
          </Button>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(scenario)}
          >
            编辑
          </Button>
        </Space>
      }
      style={{ 
        marginBottom: 16,
        border: scenario.active ? '2px solid #52c41a' : '1px solid #d9d9d9'
      }}
    >
      <div style={{ marginBottom: 8 }}>
        <strong>描述：</strong> {scenario.description || '暂无描述'}
      </div>
      
      <div style={{ marginBottom: 8 }}>
        <strong>标签：</strong>
        <Space>
          {scenario.tags.map(tag => (
            <Tag key={tag} color="blue">{tag}</Tag>
          ))}
        </Space>
      </div>
      
      {scenario.parent && (
        <div style={{ marginBottom: 8 }}>
          <strong>继承自：</strong> 
          <Tag color="orange">{scenario.parent}</Tag>
        </div>
      )}
      
      <div style={{ marginBottom: 8 }}>
        <strong>Mock数量：</strong> {scenario.mocks.length}
      </div>
      
      <div style={{ marginBottom: 8 }}>
        <strong>变量数量：</strong> {Object.keys(scenario.variables).length}
      </div>
      
      <div>
        <strong>更新时间：</strong> {formatDate(scenario.updatedAt)}
      </div>
    </Card>
  );

  return (
    <div>
      <Card>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: 16 
        }}>
          <h2>场景管理</h2>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => console.log('Create scenario')}
          >
            创建场景
          </Button>
        </div>

        <div style={{ marginBottom: 16 }}>
          <strong>当前活动场景：</strong>
          {activeScenario ? (
            <Tag color="green" style={{ marginLeft: 8 }}>
              {activeScenario.name}
            </Tag>
          ) : (
            <span style={{ marginLeft: 8, color: '#999' }}>暂无</span>
          )}
        </div>

        <Divider />

        <Row gutter={[16, 16]}>
          {scenarios.map(scenario => (
            <Col xs={24} sm={12} lg={8} xl={6} key={scenario.id}>
              <ScenarioCard scenario={scenario} />
            </Col>
          ))}
        </Row>

        {scenarios.length === 0 && !loading && (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px 0', 
            color: '#999' 
          }}>
            暂无场景数据
          </div>
        )}
      </Card>
    </div>
  );
};

export default ScenarioList;