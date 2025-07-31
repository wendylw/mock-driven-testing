import React, { useState } from 'react';
import { Card, Row, Col, Tag, Timeline, Button, Collapse, Space, Tooltip, Badge } from 'antd';
import { 
  WarningOutlined, 
  BugOutlined, 
  ThunderboltOutlined,
  CodeOutlined,
  DesktopOutlined,
  MobileOutlined,
  ApiOutlined,
  ClockCircleOutlined,
  FireOutlined,
  RightOutlined,
  TeamOutlined
} from '@ant-design/icons';

const { Panel } = Collapse;

interface LiveIssue {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  category: 'performance' | 'accessibility' | 'compatibility' | 'security' | 'ux';
  impact: string;
  affectedUsers: string;
  reproduction: string;
  frequency: string;
  evidence: {
    type: 'screenshot' | 'code' | 'trace' | 'video';
    content: any;
  };
  rootCause: {
    what: string;
    why: string;
    where: {
      file: string;
      line: number;
      code: string;
    };
    when: string;
  };
  quickFix?: {
    available: boolean;
    solution: string;
    confidence: number;
    estimatedTime: string;
  };
}

interface Props {
  baseline: any;
}

const ProblemDiagnostic: React.FC<Props> = ({ baseline }) => {
  const [expandedIssue, setExpandedIssue] = useState<string | null>(null);
  const [activeDevice, setActiveDevice] = useState<'desktop' | 'mobile'>('desktop');

  // 模拟实时检测的问题
  const liveIssues: LiveIssue[] = [
    {
      id: 'perf-001',
      severity: 'critical',
      category: 'performance',
      impact: '导致列表页面卡顿，影响用户下单',
      affectedUsers: '影响低端设备（iPhone 8 及以下规格）',
      reproduction: '在商品列表页快速滚动时',
      frequency: '每次滚动触发 50+ 次',
      evidence: {
        type: 'trace',
        content: {
          renderTime: 45,
          threshold: 16,
          callStack: ['Button.render', 'ProductList.render', 'App.render']
        }
      },
      rootCause: {
        what: '组件在列表中重复渲染',
        why: 'Button组件未使用React.memo，每次父组件更新都会重新渲染',
        where: {
          file: 'src/components/Button/index.tsx',
          line: 12,
          code: 'export const Button = ({ onClick, children, type }) => {'
        },
        when: '父组件任何state变化时'
      },
      quickFix: {
        available: true,
        solution: '添加 React.memo 包装组件',
        confidence: 95,
        estimatedTime: '30秒'
      }
    },
    {
      id: 'a11y-001',
      severity: 'warning',
      category: 'accessibility',
      impact: '屏幕阅读器无法识别按钮功能',
      affectedUsers: '不符合WCAG 2.1 AA标准',
      reproduction: '使用屏幕阅读器浏览时',
      frequency: '每个按钮实例',
      evidence: {
        type: 'code',
        content: {
          issue: '缺少 aria-label',
          current: '<button onClick={handleClick}>{icon}</button>',
          expected: '<button aria-label="保存" onClick={handleClick}>{icon}</button>'
        }
      },
      rootCause: {
        what: '纯图标按钮无文字说明',
        why: '仅使用图标，没有提供文本替代',
        where: {
          file: 'src/components/Button/index.tsx',
          line: 28,
          code: '{icon && <Icon type={icon} />}'
        },
        when: '渲染纯图标按钮时'
      },
      quickFix: {
        available: true,
        solution: '自动添加 aria-label 属性',
        confidence: 90,
        estimatedTime: '1分钟'
      }
    },
    {
      id: 'ux-001',
      severity: 'info',
      category: 'ux',
      impact: '用户不知道操作是否在进行中',
      affectedUsers: '用户测试发现的体验问题',
      reproduction: '点击提交按钮后等待响应时',
      frequency: '约20%的用户会重复点击',
      evidence: {
        type: 'video',
        content: {
          description: '用户点击后没有反馈，3秒内点击了4次'
        }
      },
      rootCause: {
        what: '缺少loading状态反馈',
        why: 'loading时仅禁用按钮，无视觉提示',
        where: {
          file: 'src/components/Button/index.tsx',
          line: 35,
          code: 'disabled={loading || disabled}'
        },
        when: '执行异步操作时'
      },
      quickFix: {
        available: true,
        solution: '添加 loading 动画效果',
        confidence: 85,
        estimatedTime: '2分钟'
      }
    }
  ];

  const getSeverityColor = (severity: string) => {
    const colors = {
      critical: '#ff4d4f',
      warning: '#faad14',
      info: '#1890ff'
    };
    return colors[severity as keyof typeof colors] || '#666';
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      performance: <ThunderboltOutlined />,
      accessibility: <ApiOutlined />,
      compatibility: <DesktopOutlined />,
      security: <WarningOutlined />,
      ux: <BugOutlined />
    };
    return icons[category as keyof typeof icons] || <BugOutlined />;
  };

  const renderIssueEvidence = (evidence: any) => {
    switch (evidence.type) {
      case 'trace':
        return (
          <div style={{ 
            background: '#f5f5f5', 
            padding: '12px', 
            borderRadius: '6px',
            fontFamily: 'monospace',
            fontSize: '12px'
          }}>
            <div style={{ marginBottom: 8 }}>
              <FireOutlined style={{ color: '#ff4d4f', marginRight: 4 }} />
              渲染时间: <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>
                {evidence.content.renderTime}ms
              </span> (阈值: {evidence.content.threshold}ms)
            </div>
            <div style={{ color: '#666' }}>
              调用栈: {evidence.content.callStack.join(' → ')}
            </div>
          </div>
        );

      case 'code':
        return (
          <div>
            <div style={{ marginBottom: 8 }}>
              <Tag color="red">当前代码</Tag>
              <pre style={{ 
                background: '#fff5f5',
                border: '1px solid #ffccc7',
                padding: '8px',
                borderRadius: '4px',
                margin: '4px 0',
                overflow: 'auto'
              }}>
                {evidence.content.current}
              </pre>
            </div>
            <div>
              <Tag color="green">期望代码</Tag>
              <pre style={{ 
                background: '#f6ffed',
                border: '1px solid #b7eb8f',
                padding: '8px',
                borderRadius: '4px',
                margin: '4px 0',
                overflow: 'auto'
              }}>
                {evidence.content.expected}
              </pre>
            </div>
          </div>
        );

      case 'video':
        return (
          <div style={{ 
            background: '#e6f7ff',
            border: '1px solid #91d5ff',
            padding: '12px',
            borderRadius: '6px'
          }}>
            <DesktopOutlined style={{ fontSize: '24px', color: '#1890ff', marginBottom: 8 }} />
            <div>{evidence.content.description}</div>
          </div>
        );

      default:
        return null;
    }
  };

  const applyQuickFix = (issue: LiveIssue) => {
    console.log('Applying quick fix for:', issue.id);
    // 这里可以跳转到智能建议或直接应用修复
  };

  return (
    <Card 
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <BugOutlined style={{ color: '#ff4d4f' }} />
            <span>实时问题诊断</span>
            <Badge count={liveIssues.filter(i => i.severity === 'critical').length} />
          </div>
          <div>
            <Button.Group size="small">
              <Button 
                type={activeDevice === 'desktop' ? 'primary' : 'default'}
                icon={<DesktopOutlined />}
                onClick={() => setActiveDevice('desktop')}
              >
                桌面端
              </Button>
              <Button 
                type={activeDevice === 'mobile' ? 'primary' : 'default'}
                icon={<MobileOutlined />}
                onClick={() => setActiveDevice('mobile')}
              >
                移动端
              </Button>
            </Button.Group>
          </div>
        </div>
      } 
      style={{ marginBottom: 24 }}
    >
      {/* 问题概览 */}
      <div style={{ marginBottom: 20 }}>
        <Row gutter={16}>
          <Col span={6}>
            <div style={{ 
              textAlign: 'center',
              padding: '20px',
              background: '#fff2e8',
              borderRadius: '8px',
              border: '1px solid #ffbb96'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fa541c' }}>
                {liveIssues.filter(i => i.severity === 'critical').length}
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>严重问题</div>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ 
              textAlign: 'center',
              padding: '20px',
              background: '#fffbe6',
              borderRadius: '8px',
              border: '1px solid #ffe58f'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#faad14' }}>
                {liveIssues.filter(i => i.severity === 'warning').length}
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>警告</div>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ 
              textAlign: 'center',
              padding: '20px',
              background: '#e6f7ff',
              borderRadius: '8px',
              border: '1px solid #91d5ff'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                {liveIssues.filter(i => i.quickFix?.available).length}
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>可快速修复</div>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ 
              textAlign: 'center',
              padding: '20px',
              background: '#f6ffed',
              borderRadius: '8px',
              border: '1px solid #b7eb8f'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                {Math.round(
                  liveIssues
                    .filter(i => i.quickFix?.available)
                    .reduce((sum, i) => sum + (i.quickFix?.confidence || 0), 0) / 
                  liveIssues.filter(i => i.quickFix?.available).length
                )}%
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>平均修复置信度</div>
            </div>
          </Col>
        </Row>
      </div>

      {/* 问题列表 */}
      <Collapse 
        activeKey={expandedIssue}
        onChange={(key) => setExpandedIssue(Array.isArray(key) ? key[0] : key)}
        accordion
      >
        {liveIssues.map((issue) => (
          <Panel
            key={issue.id}
            header={
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Tag 
                    color={getSeverityColor(issue.severity)}
                    style={{ margin: 0 }}
                  >
                    {issue.severity === 'critical' ? '严重' : 
                     issue.severity === 'warning' ? '警告' : '建议'}
                  </Tag>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {getCategoryIcon(issue.category)}
                    <span style={{ fontWeight: 'bold' }}>{issue.impact}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {issue.quickFix?.available && (
                    <Tag color="green" style={{ margin: 0 }}>
                      可修复 • {issue.quickFix.estimatedTime}
                    </Tag>
                  )}
                  <span style={{ fontSize: '12px', color: '#666' }}>
                    {issue.frequency}
                  </span>
                </div>
              </div>
            }
            style={{ marginBottom: 12 }}
          >
            <Row gutter={16}>
              {/* 问题详情 */}
              <Col span={12}>
                <Card size="small" title="问题详情" style={{ height: '100%' }}>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontWeight: 'bold', marginBottom: 8 }}>
                      <ClockCircleOutlined style={{ marginRight: 4 }} />
                      触发场景
                    </div>
                    <div style={{ 
                      background: '#f5f5f5', 
                      padding: '8px 12px', 
                      borderRadius: '4px',
                      fontSize: '13px'
                    }}>
                      {issue.reproduction}
                    </div>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontWeight: 'bold', marginBottom: 8 }}>
                      <TeamOutlined style={{ marginRight: 4 }} />
                      影响范围
                    </div>
                    <div style={{ fontSize: '13px', color: '#666' }}>
                      {issue.affectedUsers}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontWeight: 'bold', marginBottom: 8 }}>
                      <CodeOutlined style={{ marginRight: 4 }} />
                      问题证据
                    </div>
                    {renderIssueEvidence(issue.evidence)}
                  </div>
                </Card>
              </Col>

              {/* 根因分析 */}
              <Col span={12}>
                <Card size="small" title="根因分析" style={{ height: '100%' }}>
                  <Timeline>
                    <Timeline.Item color="red">
                      <div>
                        <div style={{ fontWeight: 'bold' }}>发生了什么</div>
                        <div style={{ fontSize: '13px', color: '#666' }}>
                          {issue.rootCause.what}
                        </div>
                      </div>
                    </Timeline.Item>
                    <Timeline.Item color="orange">
                      <div>
                        <div style={{ fontWeight: 'bold' }}>为什么会发生</div>
                        <div style={{ fontSize: '13px', color: '#666' }}>
                          {issue.rootCause.why}
                        </div>
                      </div>
                    </Timeline.Item>
                    <Timeline.Item color="blue">
                      <div>
                        <div style={{ fontWeight: 'bold' }}>问题位置</div>
                        <div style={{ 
                          background: '#f5f5f5', 
                          padding: '8px', 
                          borderRadius: '4px',
                          fontFamily: 'monospace',
                          fontSize: '12px',
                          marginTop: 4
                        }}>
                          <div>{issue.rootCause.where.file}:{issue.rootCause.where.line}</div>
                          <code style={{ color: '#666' }}>{issue.rootCause.where.code}</code>
                        </div>
                      </div>
                    </Timeline.Item>
                    <Timeline.Item color="gray">
                      <div>
                        <div style={{ fontWeight: 'bold' }}>触发时机</div>
                        <div style={{ fontSize: '13px', color: '#666' }}>
                          {issue.rootCause.when}
                        </div>
                      </div>
                    </Timeline.Item>
                  </Timeline>

                  {issue.quickFix?.available && (
                    <div style={{ 
                      marginTop: 16,
                      padding: '12px',
                      background: '#f6ffed',
                      border: '1px solid #b7eb8f',
                      borderRadius: '6px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 'bold', color: '#52c41a' }}>
                            快速修复方案
                          </div>
                          <div style={{ fontSize: '13px', marginTop: 4 }}>
                            {issue.quickFix.solution}
                          </div>
                          <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
                            置信度: {issue.quickFix.confidence}% • 
                            预计耗时: {issue.quickFix.estimatedTime}
                          </div>
                        </div>
                        <Button 
                          type="primary"
                          size="small"
                          icon={<ThunderboltOutlined />}
                          onClick={() => applyQuickFix(issue)}
                        >
                          立即修复
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              </Col>
            </Row>
          </Panel>
        ))}
      </Collapse>

      {/* 底部提示 */}
      <div style={{ 
        marginTop: 16,
        padding: '12px',
        background: '#f0f2f5',
        borderRadius: '6px',
        fontSize: '12px',
        color: '#666',
        textAlign: 'center'
      }}>
        💡 问题基于实时分析和用户行为数据 • 点击"立即修复"会跳转到智能建议获取详细方案
      </div>
    </Card>
  );
};

export default ProblemDiagnostic;