import React, { useState } from 'react';
import { Menu, Badge } from 'antd';
import { 
  DashboardOutlined, 
  ApiOutlined, 
  BranchesOutlined, 
  MonitorOutlined,
  ExperimentOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined 
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<LayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: <Link to="/">仪表盘</Link>,
    },
    {
      key: '/mocks',
      icon: <ApiOutlined />,
      label: <Link to="/mocks">Mock管理</Link>,
    },
    {
      key: '/scenarios',
      icon: <BranchesOutlined />,
      label: <Link to="/scenarios">场景管理</Link>,
    },
    {
      key: '/monitor',
      icon: <MonitorOutlined />,
      label: <Link to="/monitor">监控中心</Link>,
    },
    {
      key: 'components-monitoring',
      icon: <ExperimentOutlined />,
      label: '组件监测',
      children: [
        {
          key: '/components-testing',
          label: <Link to="/components-testing">监测总览</Link>,
        },
        {
          key: 'pure-components',
          label: '纯组件测试',
          children: [
            {
              key: '/pure-components/analysis',
              label: <Link to="/pure-components/analysis">组件分析</Link>,
            },
            {
              key: '/pure-components/branch-results',
              label: <Link to="/pure-components/branch-results">分支检测结果</Link>,
            },
            {
              key: '/pure-components/baselines',
              label: <Link to="/pure-components/baselines">基准管理</Link>,
            }
          ]
        },
        {
          key: 'business-components',
          label: '业务组件测试',
          children: [
            {
              key: '/business-components/scenarios',
              label: <Link to="/business-components/scenarios">业务场景测试</Link>,
            },
            {
              key: '/business-components/workflows',
              label: <Link to="/business-components/workflows">业务流程验证</Link>,
            }
          ]
        },
        {
          key: 'integration-components',
          label: '集成组件测试',
          children: [
            {
              key: '/integration-components/e2e',
              label: <Link to="/integration-components/e2e">端到端测试</Link>,
            },
            {
              key: '/integration-components/pages',
              label: <Link to="/integration-components/pages">页面集成测试</Link>,
            }
          ]
        }
      ]
    },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* 侧边栏 */}
      <div 
        style={{
          width: collapsed ? 80 : 200,
          background: '#001529',
          transition: 'width 0.2s',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        <div style={{
          height: 64,
          margin: 16,
          background: 'rgba(255, 255, 255, 0.3)',
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
        }}>
          {collapsed ? 'MDT' : 'MDT Platform'}
        </div>
        
        <div style={{ flex: 1, overflow: 'auto' }}>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            style={{ border: 'none' }}
          />
        </div>
      </div>
      
      {/* 主内容区域 */}
      <div style={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{ 
          height: 64,
          padding: '0 24px', 
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,21,41,.08)',
          zIndex: 1,
          flex: 'none'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: 'trigger',
                onClick: () => setCollapsed(!collapsed),
                style: { fontSize: 18, cursor: 'pointer', marginRight: 16 }
              }
            )}
            <h1 style={{ margin: 0, fontSize: 20, color: '#262626' }}>
              Mock Driven Testing Platform
            </h1>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Badge status="processing" text="实时监控" />
          </div>
        </div>
        
        {/* Content */}
        <div style={{ 
          flex: 1,
          padding: '24px',
          background: '#f0f2f5',
          overflow: 'auto'
        }}>
          <div style={{
            background: '#fff',
            padding: 24,
            borderRadius: 8,
            boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
            minHeight: 'calc(100vh - 112px)', // 减去header和padding的高度
            overflow: 'auto'
          }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;