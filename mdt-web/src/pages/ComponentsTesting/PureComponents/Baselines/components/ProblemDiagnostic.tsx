import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Tag, Timeline, Button, Collapse, Badge, Spin, message } from 'antd';
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
  diagnosticData?: any; // 可以从外部传入诊断数据
}

const renderQuickFixDiff = (quickFix: any) => {
  if (!quickFix || !quickFix.diff) return null;
  
  const diff = typeof quickFix.diff === 'string' ? JSON.parse(quickFix.diff) : quickFix.diff;
  const alternativeDiff = quickFix.alternativeDiff ? 
    (typeof quickFix.alternativeDiff === 'string' ? JSON.parse(quickFix.alternativeDiff) : quickFix.alternativeDiff) : null;
  
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ fontWeight: 'bold', marginBottom: 8, fontSize: '13px' }}>修复方案：</div>
      
      {/* 主要修复方案 */}
      <div style={{ marginBottom: alternativeDiff ? 16 : 0 }}>
        <div style={{ 
          background: '#fafafa', 
          border: '1px solid #d9d9d9',
          borderRadius: '6px',
          overflow: 'hidden',
          fontSize: '12px',
          fontFamily: 'Consolas, Monaco, "Courier New", monospace'
        }}>
          {/* 文件路径 */}
          <div style={{ 
            padding: '8px 12px',
            background: '#f5f5f5',
            borderBottom: '1px solid #d9d9d9',
            color: '#666'
          }}>
            📁 {diff.file} · 第 {diff.line} 行
          </div>
          
          {/* 删除的代码 */}
          <div style={{ padding: '12px 0' }}>
            <div style={{ 
              background: '#ffebe9',
              color: '#a8071a',
              padding: '4px 12px',
              display: 'flex',
              alignItems: 'flex-start'
            }}>
              <span style={{ marginRight: 8, userSelect: 'none' }}>-</span>
              <pre style={{ margin: 0, flex: 1, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                {diff.before}
              </pre>
            </div>
            
            {/* 添加的代码 */}
            <div style={{ 
              background: '#f6ffed',
              color: '#135200',
              padding: '4px 12px',
              display: 'flex',
              alignItems: 'flex-start'
            }}>
              <span style={{ marginRight: 8, userSelect: 'none' }}>+</span>
              <pre style={{ margin: 0, flex: 1, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                {diff.after}
              </pre>
            </div>
          </div>
        </div>
      </div>
      
      {/* 替代方案 */}
      {alternativeDiff && (
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: 8, fontSize: '13px' }}>替代方案（更精细的控制）：</div>
          <div style={{ 
            background: '#fafafa', 
            border: '1px solid #d9d9d9',
            borderRadius: '6px',
            overflow: 'hidden',
            fontSize: '12px',
            fontFamily: 'Consolas, Monaco, "Courier New", monospace'
          }}>
            <div style={{ 
              padding: '8px 12px',
              background: '#f5f5f5',
              borderBottom: '1px solid #d9d9d9',
              color: '#666'
            }}>
              📁 {alternativeDiff.file} · 第 {alternativeDiff.line} 行
            </div>
            
            <div style={{ padding: '12px 0' }}>
              <div style={{ 
                background: '#ffebe9',
                color: '#a8071a',
                padding: '4px 12px',
                display: 'flex',
                alignItems: 'flex-start'
              }}>
                <span style={{ marginRight: 8, userSelect: 'none' }}>-</span>
                <pre style={{ margin: 0, flex: 1, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                  {alternativeDiff.before}
                </pre>
              </div>
              
              <div style={{ 
                background: '#f6ffed',
                color: '#135200',
                padding: '4px 12px',
                display: 'flex',
                alignItems: 'flex-start'
              }}>
                <span style={{ marginRight: 8, userSelect: 'none' }}>+</span>
                <pre style={{ margin: 0, flex: 1, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                  {alternativeDiff.after}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* 使用示例 */}
      {quickFix.usageExample && (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontWeight: 'bold', marginBottom: 8, fontSize: '13px' }}>使用示例：</div>
          <div style={{ 
            background: '#fafafa', 
            border: '1px solid #d9d9d9',
            borderRadius: '6px',
            overflow: 'hidden',
            fontSize: '12px',
            fontFamily: 'Consolas, Monaco, "Courier New", monospace'
          }}>
            <div style={{ padding: '12px 0' }}>
              <div style={{ 
                background: '#ffebe9',
                color: '#a8071a',
                padding: '4px 12px',
                display: 'flex',
                alignItems: 'flex-start'
              }}>
                <span style={{ marginRight: 8, userSelect: 'none' }}>-</span>
                <pre style={{ margin: 0, flex: 1, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                  {quickFix.usageExample.before}
                </pre>
              </div>
              
              <div style={{ 
                background: '#f6ffed',
                color: '#135200',
                padding: '4px 12px',
                display: 'flex',
                alignItems: 'flex-start'
              }}>
                <span style={{ marginRight: 8, userSelect: 'none' }}>+</span>
                <pre style={{ margin: 0, flex: 1, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                  {quickFix.usageExample.after}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ProblemDiagnostic: React.FC<Props> = ({ baseline, diagnosticData: externalData }) => {
  const [expandedIssue, setExpandedIssue] = useState<string | string[]>([]);
  const [loading, setLoading] = useState(!externalData); // 如果有外部数据，不需要加载
  const [diagnosticData, setDiagnosticData] = useState<any>(externalData || null);

  useEffect(() => {
    // 如果已经有外部数据，不需要再加载
    if (!externalData) {
      loadDiagnosticData();
    } else {
      console.log('Using external diagnostic data:', externalData);
    }
  }, [baseline.id, externalData]);

  const loadDiagnosticData = async () => {
    setLoading(true);
    try {
      console.log('Loading diagnostic data for baseline:', baseline.id, baseline);
      const response = await BaselineApiService.getDiagnostic(baseline.id);
      console.log('Diagnostic response:', response);
      if (response.success) {
        setDiagnosticData(response.data);
      }
    } catch (error) {
      console.error('Failed to load diagnostic data:', error);
      // 不显示错误消息，直接使用备用数据
      // message.error('加载诊断数据失败');
      
      // API失败时的降级处理 - 使用最小数据集
      setDiagnosticData({
        problems: [{
          id: 'fallback-001',
          severity: 'info',
          category: 'general',
          impact: '无法加载诊断数据',
          affectedUsers: '所有用户',
          reproduction: '请检查网络连接',
          frequency: '未知',
          evidence: { type: 'none', content: {} },
          rootCause: {
            what: '网络或服务错误',
            why: '无法连接到诊断服务',
            where: { file: '', line: 0, code: '' },
            when: ''
          },
          quickFix: undefined
        }]
      });
    } finally {
      setLoading(false);
    }
  };

  // 转换API数据格式为组件期望的格式
  const transformProblemData = (problem: any): LiveIssue => {
    console.log('Transforming problem:', problem);
    
    // 处理 evidence 字段的不同格式
    let evidence = problem.evidence;
    // 如果是字符串，尝试解析
    if (typeof evidence === 'string') {
      try {
        evidence = JSON.parse(evidence);
      } catch (e) {
        console.error('Failed to parse evidence:', e);
      }
    }
    
    // 确保 evidence 是对象
    if (evidence && typeof evidence === 'object') {
      // 确保有 content 字段（后端可能用 data 字段或直接存储内容）
      if (!evidence.content) {
        if (evidence.data) {
          evidence.content = evidence.data;
        } else {
          // 如果没有 content 或 data，使用整个 evidence 对象作为 content
          evidence = { type: 'code', content: evidence };
        }
      }
      // 确保有 type 字段
      if (!evidence.type) {
        evidence.type = 'code';
      }
    } else {
      evidence = { type: 'code', content: {} };
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
    console.log('Original quickFix:', quickFix);
    
    if (typeof quickFix === 'string') {
      try {
        quickFix = JSON.parse(quickFix);
      } catch (e) {
        console.error('Failed to parse quickFix:', e);
        quickFix = null;
      }
    }
    
    // 确保 quickFix 有效且有 solution、action 或 code
    const processedQuickFix = quickFix && (quickFix.solution || quickFix.action || quickFix.code) ? {
      available: true,
      solution: quickFix.solution || quickFix.action || quickFix.title || '',
      confidence: quickFix.confidence || 85,
      estimatedTime: quickFix.estimatedTime || (quickFix.effort === 'low' ? '5分钟' : quickFix.effort === 'medium' ? '30分钟' : quickFix.effort === 'high' ? '2小时' : quickFix.effort) || '未知',
      diff: quickFix.diff,
      alternativeDiff: quickFix.alternativeDiff,
      usageExample: quickFix.usageExample,
      code: quickFix.code,
      steps: quickFix.steps
    } : undefined;
    
    console.log('Processed quickFix:', processedQuickFix);

    const transformed = {
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
        where: rootCause?.where || (rootCause && { file: '', line: 0, code: '' }) || { file: '', line: 0, code: '' },
        when: rootCause?.when || ''
      },
      quickFix: processedQuickFix
    };
    
    console.log('Transformed issue:', transformed);
    return transformed;
  };

  // 使用API数据
  const liveIssues: LiveIssue[] = diagnosticData?.problems?.map(transformProblemData) || [];
  console.log('Live issues:', liveIssues, 'from diagnosticData:', diagnosticData);
  
  // 设置默认展开严重问题和警告
  useEffect(() => {
    if (liveIssues.length > 0 && expandedIssue.length === 0) {
      const criticalAndWarningIds = liveIssues
        .filter(issue => issue.severity === 'critical' || issue.severity === 'warning')
        .map(issue => issue.id);
      if (criticalAndWarningIds.length > 0) {
        setExpandedIssue(criticalAndWarningIds);
      }
    }
  }, [liveIssues]);

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
    // Handle new natural language evidence format
    if (evidence?.description) {
      return (
        <div style={{ fontSize: '13px', lineHeight: '1.8' }}>
          {/* Main description */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ color: '#262626', marginBottom: 8 }}>
              {evidence.description}
            </div>
          </div>

          {/* Preconditions */}
          {evidence.preconditions && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 'bold', marginBottom: 4, color: '#595959' }}>前提条件：</div>
              <ul style={{ margin: '0 0 0 20px', padding: 0 }}>
                {evidence.preconditions.map((condition: string, index: number) => (
                  <li key={index} style={{ color: '#595959' }}>{condition}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Observations */}
          {evidence.observations && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 'bold', marginBottom: 4, color: '#595959' }}>观察结果：</div>
              <div style={{ paddingLeft: 16 }}>
                {Object.entries(evidence.observations).map(([key, value]) => (
                  <div key={key} style={{ marginBottom: 4 }}>
                    <span style={{ color: '#8c8c8c' }}>{key === 'visual' ? '视觉表现' : key === 'technical' ? '技术细节' : key === 'measurement' ? '测量数据' : key}：</span>
                    <span style={{ color: '#595959', marginLeft: 8 }}>{value as string}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Affected Users */}
          {evidence.affectedUsers && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 'bold', marginBottom: 4, color: '#595959' }}>受影响用户：</div>
              <ul style={{ margin: '0 0 0 20px', padding: 0 }}>
                {evidence.affectedUsers.map((user: string, index: number) => (
                  <li key={index} style={{ color: '#595959' }}>{user}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Reproducibility */}
          {evidence.reproducibility && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 'bold', marginBottom: 4, color: '#595959' }}>
                复现步骤（成功率：{evidence.reproducibility.frequency}）：
              </div>
              <ol style={{ margin: '0 0 0 20px', padding: 0 }}>
                {evidence.reproducibility.steps.map((step: string, index: number) => (
                  <li key={index} style={{ color: '#595959', marginBottom: 4 }}>{step}</li>
                ))}
              </ol>
            </div>
          )}

          {/* References */}
          {evidence.references && (
            <div style={{ 
              marginTop: 16, 
              paddingTop: 16, 
              borderTop: '1px solid #f0f0f0',
              fontSize: '12px'
            }}>
              {Object.entries(evidence.references).map(([key, value]) => (
                <div key={key} style={{ color: '#8c8c8c', marginBottom: 2 }}>
                  {key === 'wcagGuideline' ? 'WCAG标准' : key === 'codeLocation' ? '代码位置' : key === 'cssSelector' ? 'CSS选择器' : key}：
                  <span style={{ color: '#595959', marginLeft: 4 }}>{value as string}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    // Fallback to old format
    if (!evidence || !evidence.content) {
      return null;
    }

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
                {evidence.content.renderTime || 'N/A'}ms
              </span> {evidence.content.threshold && `(阈值: ${evidence.content.threshold}ms)`}
            </div>
            {evidence.content.callStack && (
              <div style={{ color: '#666' }}>
                调用栈: {Array.isArray(evidence.content.callStack) ? evidence.content.callStack.join(' → ') : 'N/A'}
              </div>
            )}
          </div>
        );

      case 'code':
        // For simple evidence objects, just display as JSON
        if (typeof evidence.content === 'object' && !evidence.content.current) {
          return (
            <div style={{ 
              background: '#f5f5f5', 
              padding: '12px', 
              borderRadius: '6px',
              fontFamily: 'monospace',
              fontSize: '12px'
            }}>
              <div style={{ marginBottom: 8 }}>
                <CodeOutlined style={{ marginRight: 4 }} />
                证据详情:
              </div>
              <pre style={{ margin: 0, overflow: 'auto' }}>
                {JSON.stringify(evidence.content, null, 2)}
              </pre>
            </div>
          );
        }

        return (
          <div>
            {evidence.content.current && (
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
            )}
            {evidence.content.expected && (
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
            )}
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
  
  // 调试信息
  console.log('Rendering ProblemDiagnostic, liveIssues count:', liveIssues.length);

  // Calculate summary based on actual liveIssues
  const summary = {
    criticalCount: liveIssues.filter(i => i.severity === 'critical').length,
    warningCount: liveIssues.filter(i => i.severity === 'warning').length,
    infoCount: liveIssues.filter(i => i.severity === 'info').length,
    fixableCount: liveIssues.filter(i => i.quickFix?.available).length
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
          onChange={(key) => setExpandedIssue(Array.isArray(key) ? key : [key])}
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
                      {(() => {
                        // 如果 reproduction 包含分隔符，转换为列表
                        const scenarios = issue.reproduction
                          .split(/[，,、;；]/)
                          .map(s => s.trim())
                          .filter(s => s.length > 0);
                        
                        if (scenarios.length > 1) {
                          return (
                            <ul style={{ margin: 0, paddingLeft: '20px' }}>
                              {scenarios.map((scenario, index) => (
                                <li key={index} style={{ marginBottom: '4px' }}>
                                  {scenario}
                                </li>
                              ))}
                            </ul>
                          );
                        } else {
                          // 单个场景直接显示
                          return issue.reproduction;
                        }
                      })()}
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
                        {issue.rootCause.where ? (
                          <div>
                            <div style={{ 
                              fontSize: '12px', 
                              color: '#666',
                              marginBottom: 8
                            }}>
                              📁 {issue.rootCause.where.file || '未知文件'} · 第 {issue.rootCause.where.line || '?'} 行
                            </div>
                            {issue.rootCause.where.code && (
                              <pre style={{ 
                                background: '#f5f5f5', 
                                padding: '12px', 
                                borderRadius: '6px',
                                fontSize: '11px',
                                fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                                overflow: 'auto',
                                margin: 0,
                                border: '1px solid #e8e8e8'
                              }}>
                                <code style={{ color: '#333' }}>{issue.rootCause.where.code}</code>
                              </pre>
                            )}
                          </div>
                        ) : (
                          <div style={{ fontSize: '13px', color: '#666' }}>
                            位置信息不可用
                          </div>
                        )}
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
                          {renderQuickFixDiff(issue.quickFix)}
                        </div>
                        {/* 按用户要求移除立即修复按钮 */}
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
        💡 问题基于实时分析和用户行为数据
      </div>
    </Card>
  );
};

export default ProblemDiagnostic;