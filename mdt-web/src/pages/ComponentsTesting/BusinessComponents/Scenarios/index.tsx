import React from 'react';
import { Card, Empty, Button } from 'antd';
import { ExperimentOutlined, RocketOutlined } from '@ant-design/icons';

const BusinessComponentsScenarios: React.FC = () => {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, marginBottom: 8 }}>
          <ExperimentOutlined style={{ marginRight: 12, color: '#1890ff' }} />
          Business Components 业务场景测试
        </h1>
        <p style={{ color: '#666', margin: 0 }}>
          测试组件在具体业务场景中的行为和表现
        </p>
      </div>

      <Card>
        <Empty
          image={<RocketOutlined style={{ fontSize: '64px', color: '#1890ff' }} />}
          description={
            <div>
              <h3>Business Components 测试即将上线</h3>
              <p style={{ color: '#666', marginBottom: 16 }}>
                这个层级将测试组件在具体业务场景中的使用，包括：
              </p>
              <ul style={{ textAlign: 'left', maxWidth: '400px', margin: '0 auto' }}>
                <li>业务数据驱动的组件行为验证</li>
                <li>用户交互流程中的组件状态测试</li>
                <li>业务规则和组件逻辑的一致性检查</li>
                <li>不同业务场景下的组件适配性测试</li>
              </ul>
            </div>
          }
        >
          <Button type="primary" size="large">
            敬请期待
          </Button>
        </Empty>
      </Card>
    </div>
  );
};

export default BusinessComponentsScenarios;