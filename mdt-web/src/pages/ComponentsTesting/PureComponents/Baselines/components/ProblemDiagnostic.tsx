import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Tag, Timeline, Button, Collapse, Space, Tooltip, Badge, Spin, message } from 'antd';
import { 
  WarningOutlined, 
  BugOutlined, 
  ThunderboltOutlined,
  CodeOutlined,
  DesktopOutlined,
  ApiOutlined,
  ClockCircleOutlined,
  FireOutlined,
  RightOutlined,
  TeamOutlined
} from '@ant-design/icons';
import BaselineApiService from '../../../../../services/baselineApi';

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
  const [expandedIssue, setExpandedIssue] = useState<string | string[]>([]);
  const [loading, setLoading] = useState(true);
  const [diagnosticData, setDiagnosticData] = useState<any>(null);

  useEffect(() => {
    loadDiagnosticData();
  }, [baseline.id]);

  const loadDiagnosticData = async () => {
    setLoading(true);
    try {
      console.log('Loading diagnostic data for baseline:', baseline.id);
      const response = await BaselineApiService.getDiagnostic(baseline.id);
      console.log('Diagnostic response:', response);
      if (response.success) {
        setDiagnosticData(response.data);
      }
    } catch (error) {
      console.error('Failed to load diagnostic data:', error);
      message.error('加载诊断数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 转换API数据格式为组件期望的格式
  const transformProblemData = (problem: any): LiveIssue => {
    // 处理 evidence 字段的不同格式
    let evidence = problem.evidence;
    if (evidence && typeof evidence === 'object') {
      // 如果是字符串，尝试解析
      if (typeof evidence === 'string') {
        try {
          evidence = JSON.parse(evidence);
        } catch (e) {
          console.error('Failed to parse evidence:', e);
        }
      }
      // 确保有 content 字段（后端可能用 data 字段）
      if (!evidence.content && evidence.data) {
        evidence.content = evidence.data;
      }
      // 确保有 type 字段
      if (!evidence.type) {
        evidence.type = 'code';
      }
    }

    // 处理 rootCause 字段
    let rootCause = problem.rootCause || problem.root_cause;
    if (typeof rootCause === 'string') {
      try {
        rootCause = JSON.parse(rootCause);
      } catch (e) {
        console.error('Failed to parse rootCause:', e);
        rootCause = {};
      }
    }

    // 处理 quickFix 字段
    let quickFix = problem.quickFix || problem.quick_fix;
    if (typeof quickFix === 'string') {
      try {
        quickFix = JSON.parse(quickFix);
      } catch (e) {
        console.error('Failed to parse quickFix:', e);
        quickFix = null;
      }
    }

    return {
      id: problem.id,
      severity: problem.severity,
      category: problem.category,
      impact: problem.impact,
      affectedUsers: problem.affectedScenarios || problem.affected_scenarios || problem.affectedUsers || '影响部分用户',
      reproduction: problem.reproduction,
      frequency: problem.frequency,
      evidence: evidence || { type: 'code', content: {} },
      rootCause: {
        what: rootCause?.what || rootCause?.issue || '',
        why: rootCause?.why || rootCause?.parentUpdates || '',
        where: rootCause?.where || { file: '', line: 0, code: '' },
        when: rootCause?.when || ''
      },
      quickFix: quickFix ? {
        available: true,
        solution: quickFix.solution || '',
        confidence: quickFix.confidence || 85,
        estimatedTime: quickFix.estimatedTime || quickFix.effort || '未知'
      } : undefined
    };
  };

  // 使用API数据
  const liveIssues: LiveIssue[] = diagnosticData?.problems?.map(transformProblemData) || [];

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

  if (loading) {
    return (
      <Card style={{ marginBottom: 24, minHeight: 400 }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
          <Spin size="large" tip="正在分析问题..." />
        </div>
      </Card>
    );
  }

  const summary = diagnosticData?.summary || {
    criticalCount: 0,
    warningCount: 0,
    infoCount: 0,
    fixableCount: 0
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
                {summary.criticalCount}
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
                {summary.warningCount}
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
                {summary.fixableCount}
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
                {liveIssues.length === 0 
                  ? '无需修复'
                  : liveIssues.filter(i => i.quickFix?.available).length > 0 
                    ? Math.round(
                        liveIssues
                          .filter(i => i.quickFix?.available)
                          .reduce((sum, i) => sum + (i.quickFix?.confidence || 0), 0) / 
                        liveIssues.filter(i => i.quickFix?.available).length
                      ) + '%'
                    : '手动修复'
                }
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>平均修复置信度</div>
            </div>
          </Col>
        </Row>
      </div>

      {/* 问题列表 */}
      {liveIssues.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px',
          color: '#999'
        }}>
          暂无检测到问题
        </div>
      ) : (
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
      )}

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