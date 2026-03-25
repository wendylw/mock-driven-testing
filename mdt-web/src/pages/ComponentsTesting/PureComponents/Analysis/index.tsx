import React, { useEffect, useState } from 'react';
import { Card, Table, Tag, Progress, Row, Col, Statistic, Space, Typography, Alert, Button, Modal, List, Divider, Steps } from 'antd';
import { ExperimentOutlined, BugOutlined, CheckCircleOutlined, WarningOutlined, DollarOutlined, ClockCircleOutlined, UserOutlined, InfoCircleOutlined, PlayCircleOutlined, FolderOutlined, CodeOutlined, LoadingOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

interface ComponentAnalysis {
  name: string;
  usageCount: number;
  riskLevel: 'low' | 'medium' | 'high';
  testingNeeded: boolean;
  usedIn: string[];
  businessImpact: 'critical' | 'high' | 'medium' | 'low';
  estimatedBugCost: number;
  testCoverage: number;
  userImpact: number;
}

interface VideoScenario {
  name: string;
  videoUrl: string;
  thumbnail: string;
  description: string;
  timestamp: string;
}

interface ComponentVideo {
  title: string;
  duration: string;
  scenarios: VideoScenario[];
}

const Analysis: React.FC = () => {
  // Add CSS for spinner animation
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  const [analysisData, setAnalysisData] = useState<ComponentAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [analysisDetailModal, setAnalysisDetailModal] = useState(false);
  const [fileListModal, setFileListModal] = useState(false);
  const [testReplayModal, setTestReplayModal] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<ComponentAnalysis | null>(null);
  const [videoManifest, setVideoManifest] = useState<Record<string, ComponentVideo>>({});
  const [currentVideo, setCurrentVideo] = useState<VideoScenario | null>(null);
  const [testExecuting, setTestExecuting] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [currentTestGroup, setCurrentTestGroup] = useState<string>('');

  useEffect(() => {
    // 模拟从Phase 4分析结果中加载数据
    setTimeout(() => {
      const mockData: ComponentAnalysis[] = [
        {
          name: 'Button',
          usageCount: 127,
          riskLevel: 'high',
          testingNeeded: true,
          usedIn: [
            'src/ordering/components/CreateOrderButton/index.jsx',
            'src/common/components/Modal/index.jsx',
            'src/payment/components/PaymentButton/index.jsx',
            'src/user/components/LoginForm/index.jsx'
          ],
          businessImpact: 'critical',
          estimatedBugCost: 8,
          testCoverage: 45,
          userImpact: 15000
        },
        {
          name: 'CreateOrderButton',
          usageCount: 23,
          riskLevel: 'high',
          testingNeeded: true,
          usedIn: [
            'src/ordering/pages/Cart/index.jsx',
            'src/ordering/pages/Checkout/index.jsx',
            'src/ordering/components/OrderSummary/index.jsx'
          ],
          businessImpact: 'critical',
          estimatedBugCost: 12,
          testCoverage: 30,
          userImpact: 8000
        },
        {
          name: 'Modal',
          usageCount: 89,
          riskLevel: 'medium',
          testingNeeded: true,
          usedIn: [
            'src/common/components/ConfirmDialog/index.jsx',
            'src/ordering/components/AddressModal/index.jsx',
            'src/user/components/ProfileModal/index.jsx'
          ],
          businessImpact: 'high',
          estimatedBugCost: 6,
          testCoverage: 60,
          userImpact: 12000
        },
        {
          name: 'Input',
          usageCount: 156,
          riskLevel: 'medium',
          testingNeeded: true,
          usedIn: [
            'src/user/components/LoginForm/index.jsx',
            'src/ordering/components/AddressForm/index.jsx',
            'src/common/components/SearchBox/index.jsx'
          ],
          businessImpact: 'high',
          estimatedBugCost: 4,
          testCoverage: 70,
          userImpact: 10000
        }
      ];
      setAnalysisData(mockData);
      setLoading(false);
    }, 1500);
  }, []);

  const executeTest = (component: ComponentAnalysis) => {
    setSelectedComponent(component);
    setTestExecuting(true);
    setTestCompleted(false);
    setTestReplayModal(true);
    setCurrentTestGroup('Primary Button 组'); // 默认显示Primary Button组
    
    // 延长测试演示时间，然后保持结果可见
    setTimeout(() => {
      setTestExecuting(false);
      setTestCompleted(true);
    }, 8000); // 8秒测试演示，然后保持结果可见
  };

  const columns = [
    {
      title: '组件名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <Space>
          <CodeOutlined />
          <strong>{text}</strong>
        </Space>
      ),
    },
    {
      title: '使用次数',
      dataIndex: 'usageCount',
      key: 'usageCount',
      sorter: (a: ComponentAnalysis, b: ComponentAnalysis) => a.usageCount - b.usageCount,
    },
    {
      title: '风险等级',
      dataIndex: 'riskLevel',
      key: 'riskLevel',
      render: (level: string) => {
        const config = {
          high: { color: 'red', text: '高风险' },
          medium: { color: 'orange', text: '中风险' },
          low: { color: 'green', text: '低风险' }
        };
        return <Tag color={config[level as keyof typeof config].color}>{config[level as keyof typeof config].text}</Tag>;
      },
    },
    {
      title: '业务影响',
      dataIndex: 'businessImpact',
      key: 'businessImpact',
      render: (impact: string) => {
        const config = {
          critical: { color: 'red', text: '关键' },
          high: { color: 'orange', text: '重要' },
          medium: { color: 'blue', text: '中等' },
          low: { color: 'green', text: '较低' }
        };
        return <Tag color={config[impact as keyof typeof config].color}>{config[impact as keyof typeof config].text}</Tag>;
      },
    },
    {
      title: '测试覆盖率',
      dataIndex: 'testCoverage',
      key: 'testCoverage',
      render: (coverage: number) => (
        <Progress percent={coverage}  status={coverage < 50 ? 'exception' : coverage < 80 ? 'active' : 'success'} />
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record: ComponentAnalysis) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<InfoCircleOutlined />}
            onClick={() => {
              setSelectedComponent(record);
              setAnalysisDetailModal(true);
            }}
          >
            详细分析
          </Button>
          <Button
            type="link"
            icon={<FolderOutlined />}
            onClick={() => {
              setSelectedComponent(record);
              setFileListModal(true);
            }}
          >
            文件列表
          </Button>
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            onClick={() => executeTest(record)}
          >
            测试演示
          </Button>
        </Space>
      ),
    },
  ];

  // 计算业务指标
  const totalComponents = analysisData.length;
  const highRiskComponents = analysisData.filter(c => c.riskLevel === 'high').length;
  const averageTestCoverage = analysisData.reduce((sum, c) => sum + c.testCoverage, 0) / totalComponents || 0;
  const totalUsage = analysisData.reduce((sum, c) => sum + c.usageCount, 0);
  const testsGenerated = analysisData.filter(c => c.testingNeeded).length;

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>
        <ExperimentOutlined /> 组件分析结果
      </Title>
      <Paragraph>
        基于MDT智能分析引擎，对核心组件进行全面的风险评估和测试建议。
      </Paragraph>

      {/* 业务指标卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="分析组件数"
              value={totalComponents}
              prefix={<CodeOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="高风险组件"
              value={highRiskComponents}
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均测试覆盖率"
              value={averageTestCoverage}
              precision={1}
              suffix="%"
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: averageTestCoverage > 60 ? '#3f8600' : '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总使用次数"
              value={totalUsage}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* ROI 分析卡片 */}
      <Alert
        message="测试投资回报分析"
        description={
          <div>
            <p><strong>预期收益:</strong> 通过MDT自动化测试，预计可减少90%的手动测试工作量，节省测试成本约 <strong>¥240,000/年</strong></p>
            <p><strong>风险降低:</strong> 可及早发现关键组件问题，避免生产环境故障损失约 <strong>¥180,000/年</strong></p>
            <p><strong>ROI:</strong> 投资回报比约 <strong>1:16</strong>，投入1元可获得16元收益</p>
          </div>
        }
        type="success"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Card>
        <Table
          columns={columns}
          dataSource={analysisData}
          loading={loading}
          rowKey="name"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          }}
        />
      </Card>

      {/* 详细分析弹窗 */}
      <Modal
        title="组件详细分析"
        visible={analysisDetailModal}
        onCancel={() => setAnalysisDetailModal(false)}
        footer={null}
        width={800}
      >
        {selectedComponent && (
          <div>
            <Title level={4}>风险分析依据</Title>
            <List
              dataSource={[
                `使用频率: ${selectedComponent.usageCount}次 - ${selectedComponent.usageCount > 100 ? '使用频率极高，影响面广' : '使用频率适中'}`,
                `测试覆盖率: ${selectedComponent.testCoverage}% - ${selectedComponent.testCoverage < 50 ? '覆盖率偏低，存在测试盲点' : '覆盖率良好'}`,
                `业务影响: ${selectedComponent.businessImpact} - ${selectedComponent.businessImpact === 'critical' ? '核心业务组件，故障影响严重' : '重要业务组件'}`,
                `预估故障成本: ${selectedComponent.estimatedBugCost}小时 - 包含定位、修复、测试、发布时间`
              ]}
              renderItem={item => <List.Item>{item}</List.Item>}
            />
          </div>
        )}
      </Modal>

      {/* 文件列表弹窗 */}
      <Modal
        title="组件使用位置"
        visible={fileListModal}
        onCancel={() => setFileListModal(false)}
        footer={null}
        width={600}
      >
        {selectedComponent && (
          <List
            dataSource={selectedComponent.usedIn}
            renderItem={item => (
              <List.Item>
                <CodeOutlined style={{ marginRight: 8 }} />
                <code>{item}</code>
              </List.Item>
            )}
          />
        )}
      </Modal>

      {/* 测试演示弹窗 */}
      <Modal
        title="组件测试演示回放"
        visible={testReplayModal}
        onCancel={() => {
          setTestReplayModal(false);
          setTestExecuting(false);
          setTestCompleted(false);
          setCurrentTestGroup('');
        }}
        footer={null}
        width={1000}
        bodyStyle={{ minHeight: '600px' }}
      >
        {selectedComponent?.name === 'Button' ? (
          <div style={{ display: 'flex', height: '600px' }}>
            {/* 左侧导航 */}
            <div style={{
              width: '200px',
              borderRight: '1px solid #e8e8e8',
              padding: '20px 0',
              backgroundColor: '#f9f9f9'
            }}>
              <h4 style={{ 
                margin: '0 0 16px 0', 
                padding: '0 20px',
                color: '#333',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                测试分组选择
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {['Primary Button 组', 'Secondary Button 组', 'Text Button 组'].map((group) => (
                  <button
                    key={group}
                    onClick={() => setCurrentTestGroup(group)}
                    style={{
                      padding: '12px 20px',
                      margin: '0',
                      border: 'none',
                      backgroundColor: currentTestGroup === group ? '#FF9419' : 'transparent',
                      color: currentTestGroup === group ? 'white' : '#666',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: currentTestGroup === group ? '600' : '400',
                      textAlign: 'left',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      if (currentTestGroup !== group) {
                        (e.target as HTMLElement).style.backgroundColor = '#f0f0f0';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentTestGroup !== group) {
                        (e.target as HTMLElement).style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    {group}
                  </button>
                ))}
              </div>
            </div>

            {/* 右侧内容区域 */}
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#fafafa',
              padding: '20px'
            }}>
              {testExecuting ? (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ marginBottom: 16 }}>
                    <LoadingOutlined spin style={{ fontSize: 24, color: '#1890ff' }} />
                  </div>
                  <div style={{ marginBottom: 24, color: '#666' }}>正在渲染组件...</div>
                </div>
              ) : null}
              
              {/* 基于BEEP Button Pure Component的测试分组演示 */}
              {(testExecuting || testCompleted) && (
                <div style={{ 
                  animation: testExecuting ? 'fadeIn 2s ease-in' : 'none',
                  padding: '20px',
                  width: '100%',
                  maxWidth: '800px'
                }}>
                  {/* 测试结果显示状态 */}
                  {testCompleted && !testExecuting && (
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                      <CheckCircleOutlined style={{ fontSize: 24, color: '#52c41a', marginRight: 8 }} />
                      <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#52c41a' }}>
                        测试通过 - {currentTestGroup}
                      </span>
                    </div>
                  )}

                  {/* Primary Button 组测试 */}
                  {(currentTestGroup === 'Primary Button 组' || currentTestGroup === '') && (
                    <div style={{ marginBottom: '40px' }}>
                      <h4 style={{ 
                        margin: '0 0 20px 0', 
                        color: '#333',
                        fontSize: '16px',
                        fontWeight: '600'
                      }}>
                        🔸 Primary Button 组 - Pure Component 测试
                      </h4>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                        gap: '20px',
                        backgroundColor: '#fafafa',
                        padding: '20px',
                        borderRadius: '8px',
                        border: '1px solid #eee'
                      }}>
                        {/* Primary Default Normal */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                          <button
                            className="button type-primary-default size-normal"
                            type="submit"
                            data-test-id="common.button.btn"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              paddingTop: '12px',
                              paddingBottom: '12px',
                              paddingLeft: '16px',
                              paddingRight: '16px',
                              border: '1px solid #FF9419',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              height: '50px',
                              color: 'white',
                              backgroundColor: '#FF9419',
                              borderColor: '#FF9419',
                              transition: 'all 0.2s ease',
                              letterSpacing: '0.02em',
                              fontFamily: 'Lato, Open Sans, Helvetica, Arial, sans-serif',
                              fontSize: '1rem',
                              fontWeight: '700',
                              lineHeight: '1.4'
                            }}
                            onMouseOver={(e) => {
                              (e.target as HTMLElement).style.backgroundColor = '#FC7118';
                              (e.target as HTMLElement).style.borderColor = '#FC7118';
                            }}
                            onMouseLeave={(e) => {
                              (e.target as HTMLElement).style.backgroundColor = '#FF9419';
                              (e.target as HTMLElement).style.borderColor = '#FF9419';
                            }}
                          >
                            <div className="buttonContent" style={{ 
                              fontSize: 'inherit',
                              lineHeight: '1.4'
                            }}>提交订单</div>
                          </button>
                          <code style={{ fontSize: '11px', color: '#666', textAlign: 'center' }}>
                            Normal Size<br/>
                            type="primary" theme="default"
                          </code>
                        </div>

                        {/* Primary Default Small */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                          <button
                            className="button type-primary-default size-small"
                            type="button"
                            data-test-id="common.button.btn"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              paddingTop: '12px',
                              paddingBottom: '12px',
                              paddingLeft: '16px',
                              paddingRight: '16px',
                              border: '1px solid #FF9419',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              height: '40px',
                              color: 'white',
                              backgroundColor: '#FF9419',
                              borderColor: '#FF9419',
                              transition: 'all 0.2s ease',
                              letterSpacing: '0.02em',
                              fontFamily: 'Lato, Open Sans, Helvetica, Arial, sans-serif',
                              fontSize: '1rem',
                              fontWeight: '700',
                              lineHeight: '1.4'
                            }}
                          >
                            <div className="buttonContent">提交订单</div>
                          </button>
                          <code style={{ fontSize: '11px', color: '#666', textAlign: 'center' }}>
                            Small Size (40px)<br/>
                            
                          </code>
                        </div>

                        {/* Primary Disabled */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                          <button
                            className="button type-primary-default size-normal"
                            type="button"
                            data-test-id="common.button.btn"
                            disabled
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              paddingTop: '12px',
                              paddingBottom: '12px',
                              paddingLeft: '16px',
                              paddingRight: '16px',
                              border: '1px solid #DEDEDF',
                              borderRadius: '8px',
                              cursor: 'not-allowed',
                              height: '50px',
                              color: 'white',
                              backgroundColor: '#DEDEDF',
                              borderColor: '#DEDEDF',
                              fontFamily: 'Lato, Open Sans, Helvetica, Arial, sans-serif',
                              fontSize: '1rem',
                              fontWeight: '700',
                              lineHeight: '1.4'
                            }}
                          >
                            <div className="buttonContent">提交订单</div>
                          </button>
                          <code style={{ fontSize: '11px', color: '#666', textAlign: 'center' }}>
                            Disabled State<br/>
                            disabled={true}
                          </code>
                        </div>

                        {/* Primary Loading - 测试loading状态同时测试icon */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                          <button
                            className="button type-primary-default size-normal"
                            type="button"
                            data-test-id="common.button.btn"
                            disabled
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              paddingTop: '12px',
                              paddingBottom: '12px',
                              paddingLeft: '16px',
                              paddingRight: '16px',
                              border: '1px solid #FF9419',
                              borderRadius: '8px',
                              cursor: 'not-allowed',
                              height: '50px',
                              color: 'white',
                              backgroundColor: '#FF9419',
                              borderColor: '#FF9419',
                              opacity: 0.8,
                              fontFamily: 'Lato, Open Sans, Helvetica, Arial, sans-serif',
                              fontSize: '1rem',
                              fontWeight: '700',
                              lineHeight: '1.4'
                            }}
                          >
                            <span className="iconWrapper" style={{ marginRight: '8px' }}>
                              <span className="iconInnerWrapper">
                                <svg width="16" height="16" fill="currentColor" viewBox="0 0 256 256" style={{ animation: 'spin 1s linear infinite' }}>
                                  <path d="M232,128a104,104,0,0,1-208,0c0-41,23.81-78.36,60.66-95.27a8,8,0,0,1,6.68,14.54C60.15,61.59,40,93.27,40,128a88,88,0,0,0,176,0c0-34.73-20.15-66.41-51.34-80.73a8,8,0,0,1,6.68-14.54C208.19,49.64,232,87,232,128Z"/>
                                </svg>
                              </span>
                            </span>
                            <div className="buttonContent">提交订单</div>
                          </button>
                          <code style={{ fontSize: '11px', color: '#666', textAlign: 'center' }}>
                            Loading State<br/>
                            loading={true}
                          </code>
                        </div>

                        {/* Primary Danger */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                          <button
                            className="button type-primary-danger size-normal"
                            type="button"
                            data-test-id="common.button.btn"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              paddingTop: '12px',
                              paddingBottom: '12px',
                              paddingLeft: '16px',
                              paddingRight: '16px',
                              border: '1px solid #E15343',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              height: '50px',
                              color: 'white',
                              backgroundColor: '#E15343',
                              borderColor: '#E15343',
                              transition: 'all 0.2s ease',
                              letterSpacing: '0.02em',
                              fontFamily: 'Lato, Open Sans, Helvetica, Arial, sans-serif',
                              fontSize: '1rem',
                              fontWeight: '700',
                              lineHeight: '1.4'
                            }}
                            onMouseOver={(e) => {
                              (e.target as HTMLElement).style.backgroundColor = '#C04537';
                              (e.target as HTMLElement).style.borderColor = '#C04537';
                            }}
                            onMouseLeave={(e) => {
                              (e.target as HTMLElement).style.backgroundColor = '#E15343';
                              (e.target as HTMLElement).style.borderColor = '#E15343';
                            }}
                          >
                            <div className="buttonContent">提交订单</div>
                          </button>
                          <code style={{ fontSize: '11px', color: '#666', textAlign: 'center' }}>
                            Danger Theme<br/>
                            theme="danger"
                          </code>
                        </div>

                        {/* Primary with Star Icon - 测试其他icon类型 */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                          <button
                            className="button type-primary-default size-normal"
                            type="button"
                            data-test-id="common.button.btn"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              paddingTop: '12px',
                              paddingBottom: '12px',
                              paddingLeft: '16px',
                              paddingRight: '16px',
                              border: '1px solid #FF9419',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              height: '50px',
                              color: 'white',
                              backgroundColor: '#FF9419',
                              borderColor: '#FF9419',
                              transition: 'all 0.2s ease',
                              letterSpacing: '0.02em',
                              fontFamily: 'Lato, Open Sans, Helvetica, Arial, sans-serif',
                              fontSize: '1rem',
                              fontWeight: '700',
                              lineHeight: '1.4'
                            }}
                          >
                            <span className="iconWrapper" style={{ marginRight: '8px' }}>
                              <span className="iconInnerWrapper">
                                <svg width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                                  <path d="M234.29,114.85l-45,38.83L203,211.75a16.4,16.4,0,0,1-24.5,17.82L128,198.49,77.47,229.57A16.4,16.4,0,0,1,53,211.75l13.76-58.07-45-38.83A16.46,16.46,0,0,1,31.08,86l59-4.76,22.76-55.08a16.36,16.36,0,0,1,30.27,0l22.75,55.08,59,4.76a16.46,16.46,0,0,1,9.37,28.86Z"/>
                                </svg>
                              </span>
                            </span>
                            <div className="buttonContent">提交订单</div>
                          </button>
                          <code style={{ fontSize: '11px', color: '#666', textAlign: 'center' }}>
                            With Icon<br/>
                            icon={`<StarIcon />`}
                          </code>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Secondary Button 组测试 */}
                  {currentTestGroup === 'Secondary Button 组' && (
                    <div style={{ marginBottom: '40px' }}>
                      <h4 style={{ 
                        margin: '0 0 20px 0', 
                        color: '#333',
                        fontSize: '16px',
                        fontWeight: '600'
                      }}>
                        🔸 Secondary Button 组 - Pure Component 测试
                      </h4>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                        gap: '20px',
                        backgroundColor: '#fafafa',
                        padding: '20px',
                        borderRadius: '8px',
                        border: '1px solid #eee'
                      }}>
                        {/* Secondary Default Normal */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                          <button
                            className="button type-secondary-default size-normal"
                            type="button"
                            data-test-id="common.button.btn"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              paddingTop: '12px',
                              paddingBottom: '12px',
                              paddingLeft: '16px',
                              paddingRight: '16px',
                              border: '1px solid #FF9419',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              height: '50px',
                              color: '#FF9419',
                              backgroundColor: 'white',
                              borderColor: '#FF9419',
                              transition: 'all 0.2s ease',
                              letterSpacing: '0.02em',
                              fontFamily: 'Lato, Open Sans, Helvetica, Arial, sans-serif',
                              fontSize: '1rem',
                              fontWeight: '700',
                              lineHeight: '1.4'
                            }}
                            onMouseOver={(e) => {
                              (e.target as HTMLElement).style.color = '#FC7118';
                              (e.target as HTMLElement).style.borderColor = '#FC7118';
                            }}
                            onMouseLeave={(e) => {
                              (e.target as HTMLElement).style.color = '#FF9419';
                              (e.target as HTMLElement).style.borderColor = '#FF9419';
                            }}
                          >
                            <div className="buttonContent">提交订单</div>
                          </button>
                          <code style={{ fontSize: '11px', color: '#666', textAlign: 'center' }}>
                            Normal Size<br/>
                            type="secondary" theme="default"
                          </code>
                        </div>

                        {/* Secondary Default Small */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                          <button
                            className="button type-secondary-default size-small"
                            type="button"
                            data-test-id="common.button.btn"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              paddingTop: '12px',
                              paddingBottom: '12px',
                              paddingLeft: '16px',
                              paddingRight: '16px',
                              border: '1px solid #FF9419',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              height: '40px',
                              color: '#FF9419',
                              backgroundColor: 'white',
                              borderColor: '#FF9419',
                              transition: 'all 0.2s ease',
                              letterSpacing: '0.02em',
                              fontFamily: 'Lato, Open Sans, Helvetica, Arial, sans-serif',
                              fontSize: '1rem',
                              fontWeight: '700',
                              lineHeight: '1.4'
                            }}
                          >
                            <div className="buttonContent">提交订单</div>
                          </button>
                          <code style={{ fontSize: '11px', color: '#666', textAlign: 'center' }}>
                            Small Size (40px)<br/>
                            
                          </code>
                        </div>

                        {/* Secondary Disabled */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                          <button
                            className="button type-secondary-default size-normal"
                            type="button"
                            data-test-id="common.button.btn"
                            disabled
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              paddingTop: '12px',
                              paddingBottom: '12px',
                              paddingLeft: '16px',
                              paddingRight: '16px',
                              border: '1px solid #DEDEDF',
                              borderRadius: '8px',
                              cursor: 'not-allowed',
                              height: '50px',
                              color: '#DEDEDF',
                              backgroundColor: 'white',
                              borderColor: '#DEDEDF',
                              fontFamily: 'Lato, Open Sans, Helvetica, Arial, sans-serif',
                              fontSize: '1rem',
                              fontWeight: '700',
                              lineHeight: '1.4'
                            }}
                          >
                            <div className="buttonContent">提交订单</div>
                          </button>
                          <code style={{ fontSize: '11px', color: '#666', textAlign: 'center' }}>
                            Disabled State<br/>
                            disabled={true}
                          </code>
                        </div>

                        {/* Secondary Danger */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                          <button
                            className="button type-secondary-danger size-normal"
                            type="button"
                            data-test-id="common.button.btn"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              paddingTop: '12px',
                              paddingBottom: '12px',
                              paddingLeft: '16px',
                              paddingRight: '16px',
                              border: '1px solid #E15343',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              height: '50px',
                              color: '#E15343',
                              backgroundColor: 'white',
                              borderColor: '#E15343',
                              transition: 'all 0.2s ease',
                              letterSpacing: '0.02em',
                              fontFamily: 'Lato, Open Sans, Helvetica, Arial, sans-serif',
                              fontSize: '1rem',
                              fontWeight: '700',
                              lineHeight: '1.4'
                            }}
                            onMouseOver={(e) => {
                              (e.target as HTMLElement).style.color = '#C04537';
                              (e.target as HTMLElement).style.borderColor = '#C04537';
                            }}
                            onMouseLeave={(e) => {
                              (e.target as HTMLElement).style.color = '#E15343';
                              (e.target as HTMLElement).style.borderColor = '#E15343';
                            }}
                          >
                            <div className="buttonContent">提交订单</div>
                          </button>
                          <code style={{ fontSize: '11px', color: '#666', textAlign: 'center' }}>
                            Danger Theme<br/>
                            theme="danger"
                          </code>
                        </div>

                        {/* Secondary Loading */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                          <button
                            className="button type-secondary-default size-normal"
                            type="button"
                            data-test-id="common.button.btn"
                            disabled
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              paddingTop: '12px',
                              paddingBottom: '12px',
                              paddingLeft: '16px',
                              paddingRight: '16px',
                              border: '1px solid #FF9419',
                              borderRadius: '8px',
                              cursor: 'not-allowed',
                              height: '50px',
                              color: '#FF9419',
                              backgroundColor: 'white',
                              borderColor: '#FF9419',
                              opacity: 0.8,
                              transition: 'all 0.2s ease',
                              letterSpacing: '0.02em',
                              fontFamily: 'Lato, Open Sans, Helvetica, Arial, sans-serif',
                              fontSize: '1rem',
                              fontWeight: '700',
                              lineHeight: '1.4'
                            }}
                          >
                            <span className="iconWrapper" style={{ marginRight: '8px' }}>
                              <span className="iconInnerWrapper">
                                <svg width="16" height="16" fill="currentColor" viewBox="0 0 256 256" style={{ animation: 'spin 1s linear infinite' }}>
                                  <path d="M232,128a104,104,0,0,1-208,0c0-41,23.81-78.36,60.66-95.27a8,8,0,0,1,6.68,14.54C60.15,61.59,40,93.27,40,128a88,88,0,0,0,176,0c0-34.73-20.15-66.41-51.34-80.73a8,8,0,0,1,6.68-14.54C208.19,49.64,232,87,232,128Z"/>
                                </svg>
                              </span>
                            </span>
                            <div className="buttonContent">提交订单</div>
                          </button>
                          <code style={{ fontSize: '11px', color: '#666', textAlign: 'center' }}>
                            Loading State<br/>
                            loading={true}
                          </code>
                        </div>

                        {/* Secondary with Icon */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                          <button
                            className="button type-secondary-default size-normal"
                            type="button"
                            data-test-id="common.button.btn"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              paddingTop: '12px',
                              paddingBottom: '12px',
                              paddingLeft: '16px',
                              paddingRight: '16px',
                              border: '1px solid #FF9419',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              height: '50px',
                              color: '#FF9419',
                              backgroundColor: 'white',
                              borderColor: '#FF9419',
                              transition: 'all 0.2s ease',
                              letterSpacing: '0.02em',
                              fontFamily: 'Lato, Open Sans, Helvetica, Arial, sans-serif',
                              fontSize: '1rem',
                              fontWeight: '700',
                              lineHeight: '1.4'
                            }}
                            onMouseOver={(e) => {
                              (e.target as HTMLElement).style.color = '#FC7118';
                              (e.target as HTMLElement).style.borderColor = '#FC7118';
                            }}
                            onMouseLeave={(e) => {
                              (e.target as HTMLElement).style.color = '#FF9419';
                              (e.target as HTMLElement).style.borderColor = '#FF9419';
                            }}
                          >
                            <span className="iconWrapper" style={{ marginRight: '8px' }}>
                              <span className="iconInnerWrapper">
                                <svg width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                                  <path d="M234.29,114.85l-45,38.83L203,211.75a16.4,16.4,0,0,1-24.5,17.82L128,198.49,77.47,229.57A16.4,16.4,0,0,1,53,211.75l13.76-58.07-45-38.83A16.46,16.46,0,0,1,31.08,86l59-4.76,22.76-55.08a16.36,16.36,0,0,1,30.27,0l22.75,55.08,59,4.76a16.46,16.46,0,0,1,9.37,28.86Z"/>
                                </svg>
                              </span>
                            </span>
                            <div className="buttonContent">提交订单</div>
                          </button>
                          <code style={{ fontSize: '11px', color: '#666', textAlign: 'center' }}>
                            With Icon<br/>
                            icon={`<StarIcon />`}
                          </code>
                        </div>

                        {/* Secondary Info */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                          <button
                            className="button type-secondary-info size-normal"
                            type="button"
                            data-test-id="common.button.btn"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              paddingTop: '12px',
                              paddingBottom: '12px',
                              paddingLeft: '16px',
                              paddingRight: '16px',
                              border: '1px solid #00B0FF',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              height: '50px',
                              color: '#00B0FF',
                              backgroundColor: 'white',
                              borderColor: '#00B0FF',
                              transition: 'all 0.2s ease',
                              letterSpacing: '0.02em',
                              fontFamily: 'Lato, Open Sans, Helvetica, Arial, sans-serif',
                              fontSize: '1rem',
                              fontWeight: '700',
                              lineHeight: '1.4'
                            }}
                            onMouseOver={(e) => {
                              (e.target as HTMLElement).style.color = '#0089C7';
                              (e.target as HTMLElement).style.borderColor = '#0089C7';
                            }}
                            onMouseLeave={(e) => {
                              (e.target as HTMLElement).style.color = '#00B0FF';
                              (e.target as HTMLElement).style.borderColor = '#00B0FF';
                            }}
                          >
                            <div className="buttonContent">提交订单</div>
                          </button>
                          <code style={{ fontSize: '11px', color: '#666', textAlign: 'center' }}>
                            Info Theme<br/>
                            theme="info"
                          </code>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Text Button 组测试 */}
                  {currentTestGroup === 'Text Button 组' && (
                    <div style={{ marginBottom: '40px' }}>
                      <h4 style={{ 
                        margin: '0 0 20px 0', 
                        color: '#333',
                        fontSize: '16px',
                        fontWeight: '600'
                      }}>
                        🔸 Text Button 组 - Pure Component 测试
                      </h4>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                        gap: '20px',
                        backgroundColor: '#fafafa',
                        padding: '20px',
                        borderRadius: '8px',
                        border: '1px solid #eee'
                      }}>
                        {/* Text Default */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                          <button
                            className="button type-text-default"
                            type="button"
                            data-test-id="common.button.btn"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '8px',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              height: 'auto',
                              color: '#FF9419',
                              backgroundColor: 'transparent',
                              transition: 'all 0.2s ease',
                              letterSpacing: '0.01em',
                              fontFamily: 'Lato, Open Sans, Helvetica, Arial, sans-serif',
                              fontSize: '1rem',
                              fontWeight: '700',
                              lineHeight: '1.4'
                            }}
                            onMouseOver={(e) => {
                              (e.target as HTMLElement).style.color = '#FC7118';
                            }}
                            onMouseLeave={(e) => {
                              (e.target as HTMLElement).style.color = '#FF9419';
                            }}
                          >
                            <div className="buttonContent">提交订单</div>
                          </button>
                          <code style={{ fontSize: '11px', color: '#666', textAlign: 'center' }}>
                            Text Button<br/>
                            type="text" theme="default"
                          </code>
                        </div>

                        {/* Text Ghost */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                          <button
                            className="button type-text-ghost"
                            type="button"
                            data-test-id="common.button.btn"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '8px',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              height: 'auto',
                              color: '#303030',
                              backgroundColor: 'transparent',
                              transition: 'all 0.2s ease',
                              letterSpacing: '0.01em',
                              fontFamily: 'Lato, Open Sans, Helvetica, Arial, sans-serif',
                              fontSize: '1rem',
                              fontWeight: '700',
                              lineHeight: '1.4'
                            }}
                            onMouseOver={(e) => {
                              (e.target as HTMLElement).style.color = '#1C1C1C';
                            }}
                            onMouseLeave={(e) => {
                              (e.target as HTMLElement).style.color = '#303030';
                            }}
                          >
                            <div className="buttonContent">提交订单</div>
                          </button>
                          <code style={{ fontSize: '11px', color: '#666', textAlign: 'center' }}>
                            Ghost Theme<br/>
                            theme="ghost"
                          </code>
                        </div>

                        {/* Text Danger */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                          <button
                            className="button type-text-danger"
                            type="button"
                            data-test-id="common.button.btn"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '8px',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              height: 'auto',
                              color: '#E15343',
                              backgroundColor: 'transparent',
                              transition: 'all 0.2s ease',
                              letterSpacing: '0.01em',
                              fontFamily: 'Lato, Open Sans, Helvetica, Arial, sans-serif',
                              fontSize: '1rem',
                              fontWeight: '700',
                              lineHeight: '1.4'
                            }}
                            onMouseOver={(e) => {
                              (e.target as HTMLElement).style.color = '#C04537';
                            }}
                            onMouseLeave={(e) => {
                              (e.target as HTMLElement).style.color = '#E15343';
                            }}
                          >
                            <div className="buttonContent">提交订单</div>
                          </button>
                          <code style={{ fontSize: '11px', color: '#666', textAlign: 'center' }}>
                            Danger Theme<br/>
                            theme="danger"
                          </code>
                        </div>

                        {/* Text Disabled */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                          <button
                            className="button type-text-default"
                            type="button"
                            data-test-id="common.button.btn"
                            disabled
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '8px',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: 'not-allowed',
                              height: 'auto',
                              color: '#DEDEDF',
                              backgroundColor: 'transparent',
                              letterSpacing: '0.01em',
                              fontFamily: 'Lato, Open Sans, Helvetica, Arial, sans-serif',
                              fontSize: '1rem',
                              fontWeight: '700',
                              lineHeight: '1.4'
                            }}
                          >
                            <div className="buttonContent">提交订单</div>
                          </button>
                          <code style={{ fontSize: '11px', color: '#666', textAlign: 'center' }}>
                            Disabled State<br/>
                            disabled={true}
                          </code>
                        </div>

                        {/* Text Loading */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                          <button
                            className="button type-text-default"
                            type="button"
                            data-test-id="common.button.btn"
                            disabled
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '8px',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: 'not-allowed',
                              height: 'auto',
                              color: '#FF9419',
                              backgroundColor: 'transparent',
                              opacity: 0.8,
                              letterSpacing: '0.01em',
                              fontFamily: 'Lato, Open Sans, Helvetica, Arial, sans-serif',
                              fontSize: '1rem',
                              fontWeight: '700',
                              lineHeight: '1.4'
                            }}
                          >
                            <span className="iconWrapper" style={{ marginRight: '8px' }}>
                              <span className="iconInnerWrapper">
                                <svg width="16" height="16" fill="currentColor" viewBox="0 0 256 256" style={{ animation: 'spin 1s linear infinite' }}>
                                  <path d="M232,128a104,104,0,0,1-208,0c0-41,23.81-78.36,60.66-95.27a8,8,0,0,1,6.68,14.54C60.15,61.59,40,93.27,40,128a88,88,0,0,0,176,0c0-34.73-20.15-66.41-51.34-80.73a8,8,0,0,1,6.68-14.54C208.19,49.64,232,87,232,128Z"/>
                                </svg>
                              </span>
                            </span>
                            <div className="buttonContent">提交订单</div>
                          </button>
                          <code style={{ fontSize: '11px', color: '#666', textAlign: 'center' }}>
                            Loading State<br/>
                            loading={true}
                          </code>
                        </div>

                        {/* Text with Delete Icon */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                          <button
                            className="button type-text-danger"
                            type="button"
                            data-test-id="common.button.btn"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '8px',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              height: 'auto',
                              color: '#E15343',
                              backgroundColor: 'transparent',
                              transition: 'all 0.2s ease',
                              letterSpacing: '0.01em',
                              fontFamily: 'Lato, Open Sans, Helvetica, Arial, sans-serif',
                              fontSize: '1rem',
                              fontWeight: '700',
                              lineHeight: '1.4'
                            }}
                            onMouseOver={(e) => {
                              (e.target as HTMLElement).style.color = '#C04537';
                            }}
                            onMouseLeave={(e) => {
                              (e.target as HTMLElement).style.color = '#E15343';
                            }}
                          >
                            <span className="iconWrapper" style={{ marginRight: '8px' }}>
                              <span className="iconInnerWrapper">
                                <svg width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                                  <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"/>
                                </svg>
                              </span>
                            </span>
                            <div className="buttonContent">删除</div>
                          </button>
                          <code style={{ fontSize: '11px', color: '#666', textAlign: 'center' }}>
                            Delete Icon<br/>
                            icon={`<DeleteIcon />`}
                          </code>
                        </div>

                        {/* Text Info */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                          <button
                            className="button type-text-info"
                            type="button"
                            data-test-id="common.button.btn"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '8px',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              height: 'auto',
                              color: '#00B0FF',
                              backgroundColor: 'transparent',
                              transition: 'all 0.2s ease',
                              letterSpacing: '0.01em',
                              fontFamily: 'Lato, Open Sans, Helvetica, Arial, sans-serif',
                              fontSize: '1rem',
                              fontWeight: '700',
                              lineHeight: '1.4'
                            }}
                            onMouseOver={(e) => {
                              (e.target as HTMLElement).style.color = '#0089C7';
                            }}
                            onMouseLeave={(e) => {
                              (e.target as HTMLElement).style.color = '#00B0FF';
                            }}
                          >
                            <div className="buttonContent">查看详情</div>
                          </button>
                          <code style={{ fontSize: '11px', color: '#666', textAlign: 'center' }}>
                            Info Theme<br/>
                            theme="info"
                          </code>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '500px',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#fafafa'
          }}>
            <div style={{ textAlign: 'center' }}>
              <InfoCircleOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
              <div style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>组件测试演示</div>
              <div style={{ color: '#666' }}>暂未实现此组件的测试演示</div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Analysis;