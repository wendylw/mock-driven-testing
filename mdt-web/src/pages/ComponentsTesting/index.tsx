import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Progress, Alert, Tag, Space, Button, Tabs, Timeline, Avatar } from 'antd';
import {
  CheckCircleOutlined,
  WarningOutlined,
  ClockCircleOutlined,
  BugOutlined,
  ArrowUpOutlined,
  EyeOutlined,
  TeamOutlined,
  FireOutlined,
  RocketOutlined,
  SafetyOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

interface ExecutiveDashboardStats {
  // 风险指标
  riskAssessment: {
    highRiskComponents: number;
    blockerIssues: number;
    productionRiskScore: number; // 0-100
    weeklyTrend: 'up' | 'down' | 'stable';
  };

  // 质量指标
  qualityMetrics: {
    overallHealthScore: number; // 0-100
    testCoverage: number;
    componentStability: number;
    releaseReadiness: 'ready' | 'caution' | 'not_ready';
  };

  // 团队效能
  teamPerformance: TeamMetrics[];

  // 关键决策信息
  executiveInsights: {
    urgentActions: ExecutiveAction[];
    successHighlights: SuccessMetric[];
    resourceNeeds: ResourceNeed[];
  };

  // 合规性
  compliance: {
    criticalComponentsCovered: number;
    totalCriticalComponents: number;
    complianceScore: number;
    lastAuditDate: Date;
  };
}

interface TeamMetrics {
  teamName: string;
  lead: string;
  componentsOwned: number;
  qualityScore: number;
  issueCount: number;
  weeklyProgress: 'improving' | 'stable' | 'declining';
  avatar?: string;
}

interface ExecutiveAction {
  id: string;
  title: string;
  description: string;
  impact: 'critical' | 'high' | 'medium';
  owner: string;
  deadline?: Date;
  estimatedEffort: string;
}

interface SuccessMetric {
  title: string;
  value: string;
  improvement: string;
  description: string;
}

interface ResourceNeed {
  area: string;
  description: string;
  priority: 'urgent' | 'high' | 'medium';
  estimatedCost: string;
}

const ComponentsTesting: React.FC = () => {
  const [stats, setStats] = useState<ExecutiveDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('risk');

  useEffect(() => {
    // 模拟管理层数据加载
    setLoading(true);
    setTimeout(() => {
      setStats({
        riskAssessment: {
          highRiskComponents: 3,
          blockerIssues: 1,
          productionRiskScore: 25, // 低风险
          weeklyTrend: 'down', // 风险在降低
        },
        qualityMetrics: {
          overallHealthScore: 87,
          testCoverage: 78,
          componentStability: 92,
          releaseReadiness: 'caution', // 需要谨慎
        },
        teamPerformance: [
          {
            teamName: 'Frontend Core',
            lead: 'Alice Chen',
            componentsOwned: 18,
            qualityScore: 92,
            issueCount: 1,
            weeklyProgress: 'improving',
          },
          {
            teamName: 'Product UI',
            lead: 'Bob Wang',
            componentsOwned: 15,
            qualityScore: 85,
            issueCount: 2,
            weeklyProgress: 'stable',
          },
          {
            teamName: 'Platform',
            lead: 'Carol Liu',
            componentsOwned: 12,
            qualityScore: 78,
            issueCount: 3,
            weeklyProgress: 'declining',
          },
        ],
        executiveInsights: {
          urgentActions: [
            {
              id: '1',
              title: 'Button组件破坏性变更需要评估',
              description: 'feature/button-redesign分支的颜色变更可能影响15个页面，建议在发布前完成影响范围确认',
              impact: 'critical',
              owner: 'Alice Chen',
              deadline: new Date('2025-02-01'),
              estimatedEffort: '2天',
            },
            {
              id: '2',
              title: 'Platform团队测试覆盖率偏低',
              description: '当前覆盖率65%，低于公司标准(80%)，建议增加测试资源投入',
              impact: 'high',
              owner: 'Carol Liu',
              estimatedEffort: '1周',
            },
          ],
          successHighlights: [
            {
              title: '组件稳定性',
              value: '92%',
              improvement: '+5%',
              description: '本周组件稳定性显著提升',
            },
            {
              title: 'bug修复效率',
              value: '1.2天',
              improvement: '-0.8天',
              description: '平均bug修复时间大幅缩短',
            },
          ],
          resourceNeeds: [
            {
              area: 'UI测试自动化',
              description: '需要增加自动化测试工具License',
              priority: 'high',
              estimatedCost: '¥15,000/月',
            },
            {
              area: '测试人力',
              description: 'Platform团队需要1名测试工程师',
              priority: 'medium',
              estimatedCost: '¥25,000/月',
            },
          ],
        },
        compliance: {
          criticalComponentsCovered: 16,
          totalCriticalComponents: 18,
          complianceScore: 89,
          lastAuditDate: new Date('2025-01-25'),
        },
      });
      setLoading(false);
    }, 1000);
  }, []);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUpOutlined style={{ color: '#ff4d4f' }} />;
      case 'down': return <ArrowUpOutlined style={{ color: '#52c41a', transform: 'rotate(180deg)' }} />;
      case 'stable': return <ClockCircleOutlined style={{ color: '#faad14' }} />;
      default: return <ClockCircleOutlined />;
    }
  };

  const getProgressColor = (progress: string) => {
    switch (progress) {
      case 'improving': return '#52c41a';
      case 'stable': return '#faad14';
      case 'declining': return '#ff4d4f';
      default: return '#1890ff';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'red';
      case 'high': return 'orange';
      case 'medium': return 'yellow';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#ff4d4f';
      case 'high': return '#faad14';
      case 'medium': return '#1890ff';
      default: return '#52c41a';
    }
  };

  const getReleaseReadinessConfig = (status: string) => {
    switch (status) {
      case 'ready':
        return { color: '#52c41a', text: '可发布', icon: <CheckCircleOutlined /> };
      case 'caution':
        return { color: '#faad14', text: '需谨慎', icon: <WarningOutlined /> };
      case 'not_ready':
        return { color: '#ff4d4f', text: '不可发布', icon: <FireOutlined /> };
      default:
        return { color: '#1890ff', text: '评估中', icon: <ClockCircleOutlined /> };
    }
  };

  if (loading || !stats) {
    return <div>Loading...</div>;
  }

  const releaseReadiness = getReleaseReadinessConfig(stats.qualityMetrics.releaseReadiness);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, marginBottom: 8 }}>
          <SafetyOutlined style={{ marginRight: 16, color: '#1890ff' }} />
          组件监测总览
        </h1>
        <p style={{ color: '#666', fontSize: '16px', margin: 0 }}>
          为 Tech Owner、QA Leader 和 Reviewers 提供的组件质量决策面板
        </p>
      </div>

      {/* 关键风险指标 - 最重要 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card style={{ borderLeft: '4px solid #ff4d4f' }}>
            <Statistic
              title="高风险组件"
              value={stats.riskAssessment.highRiskComponents}
              prefix={<FireOutlined />}
              valueStyle={{ color: '#ff4d4f', fontSize: '28px' }}
            />
            <div style={{ marginTop: 8, display: 'flex', alignItems: 'center' }}>
              {getTrendIcon(stats.riskAssessment.weeklyTrend)}
              <span style={{ marginLeft: 4, fontSize: '12px', color: '#666' }}>
                本周趋势: {stats.riskAssessment.weeklyTrend === 'down' ? '降低' : '上升'}
              </span>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ borderLeft: '4px solid #faad14' }}>
            <Statistic
              title="阻塞问题"
              value={stats.riskAssessment.blockerIssues}
              prefix={<BugOutlined />}
              valueStyle={{ color: '#faad14', fontSize: '28px' }}
            />
            <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
              需要立即处理的问题
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ borderLeft: `4px solid ${releaseReadiness.color}` }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              {releaseReadiness.icon}
              <span style={{ marginLeft: 8, fontSize: '16px', fontWeight: 'bold' }}>
                发布就绪度
              </span>
            </div>
            <div style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: releaseReadiness.color
            }}>
              {releaseReadiness.text}
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ borderLeft: '4px solid #52c41a' }}>
            <Statistic
              title="整体健康分"
              value={stats.qualityMetrics.overallHealthScore}
              suffix="/100"
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a', fontSize: '28px' }}
            />
            <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
              组件质量评分
            </div>
          </Card>
        </Col>
      </Row>

      {/* 紧急行动提醒 */}
      {stats.executiveInsights.urgentActions.filter(action => action.impact === 'critical').length > 0 && (
        <Alert
          message="紧急行动需要"
          description={
            <div>
              <p style={{ margin: '8px 0' }}>
                发现 {stats.executiveInsights.urgentActions.filter(action => action.impact === 'critical').length} 个关键问题需要立即处理
              </p>
              <Timeline>
                {stats.executiveInsights.urgentActions
                  .filter(action => action.impact === 'critical')
                  .map(action => (
                    <Timeline.Item
                      key={action.id}
                      color="red"
                      dot={<FireOutlined style={{ color: '#ff4d4f' }} />}
                    >
                      <strong>{action.title}</strong>
                      <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
                        负责人: {action.owner} | 预计工作量: {action.estimatedEffort}
                        {action.deadline && ` | 截止: ${action.deadline.toLocaleDateString()}`}
                      </div>
                    </Timeline.Item>
                  ))}
              </Timeline>
            </div>
          }
          type="error"
          showIcon
          style={{ marginBottom: 24 }}
          action={
            <Button  danger>
              查看处理方案
            </Button>
          }
        />
      )}

      {/* 核心指标标签页 */}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <Tabs.TabPane tab="风险评估" key="risk">
            <Row gutter={16}>
              <Col span={16}>
                <Card title="团队表现" >
                  {stats.teamPerformance.map(team => (
                    <div key={team.teamName} style={{
                      padding: '12px',
                      border: '1px solid #f0f0f0',
                      borderRadius: '6px',
                      marginBottom: '12px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar  style={{ backgroundColor: '#1890ff' }}>
                            {team.lead.charAt(0)}
                          </Avatar>
                          <div style={{ marginLeft: 12 }}>
                            <div style={{ fontWeight: 'bold' }}>{team.teamName}</div>
                            <div style={{ fontSize: '12px', color: '#666' }}>
                              负责人: {team.lead} | 组件数: {team.componentsOwned}
                            </div>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{
                            fontSize: '18px',
                            fontWeight: 'bold',
                            color: getProgressColor(team.weeklyProgress)
                          }}>
                            {team.qualityScore}分
                          </div>
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            问题: {team.issueCount}个
                          </div>
                        </div>
                      </div>
                      <div style={{ marginTop: 8 }}>
                        <Progress
                          percent={team.qualityScore}
                          showInfo={false}
                          strokeColor={getProgressColor(team.weeklyProgress)}
                          
                        />
                      </div>
                    </div>
                  ))}
                </Card>
              </Col>
              <Col span={8}>
                <Space direction="vertical" style={{ width: '100%' }} size={16}>
                  <Card title="质量指标" >
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span>测试覆盖率</span>
                        <span style={{ fontWeight: 'bold' }}>{stats.qualityMetrics.testCoverage}%</span>
                      </div>
                      <Progress percent={stats.qualityMetrics.testCoverage} showInfo={false} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span>组件稳定性</span>
                        <span style={{ fontWeight: 'bold' }}>{stats.qualityMetrics.componentStability}%</span>
                      </div>
                      <Progress percent={stats.qualityMetrics.componentStability} showInfo={false} strokeColor="#52c41a" />
                    </div>
                  </Card>

                  <Card title="合规性检查" >
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span>关键组件覆盖</span>
                        <span style={{ fontWeight: 'bold' }}>
                          {stats.compliance.criticalComponentsCovered}/{stats.compliance.totalCriticalComponents}
                        </span>
                      </div>
                      <Progress
                        percent={Math.round((stats.compliance.criticalComponentsCovered / stats.compliance.totalCriticalComponents) * 100)}
                        showInfo={false}
                        strokeColor="#722ed1"
                      />
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      合规评分: {stats.compliance.complianceScore}/100
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      上次审计: {stats.compliance.lastAuditDate.toLocaleDateString()}
                    </div>
                  </Card>
                </Space>
              </Col>
            </Row>
          </Tabs.TabPane>

          <Tabs.TabPane tab={`待处理事项 (${stats.executiveInsights.urgentActions.length})`} key="actions">
            <Timeline>
              {stats.executiveInsights.urgentActions.map(action => (
                <Timeline.Item
                  key={action.id}
                  color={getImpactColor(action.impact)}
                  dot={action.impact === 'critical' ? <FireOutlined /> : <WarningOutlined />}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '16px' }}>{action.title}</strong>
                      <Tag color={getImpactColor(action.impact)}>
                        {action.impact.toUpperCase()}
                      </Tag>
                    </div>
                    <p style={{ color: '#666', margin: '8px 0' }}>{action.description}</p>
                    <div style={{ fontSize: '12px', color: '#999' }}>
                      <Space>
                        <span>👤 {action.owner}</span>
                        <span>⏱️ {action.estimatedEffort}</span>
                        {action.deadline && <span>📅 {action.deadline.toLocaleDateString()}</span>}
                      </Space>
                    </div>
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>
          </Tabs.TabPane>

          <Tabs.TabPane tab="成功亮点" key="success">
            <Row gutter={16}>
              <Col span={12}>
                <Card title="本周亮点" >
                  {stats.executiveInsights.successHighlights.map((highlight, index) => (
                    <div key={index} style={{ marginBottom: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 'bold' }}>{highlight.title}</span>
                        <div>
                          <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#52c41a' }}>
                            {highlight.value}
                          </span>
                          <Tag color="green" style={{ marginLeft: 8 }}>
                            {highlight.improvement}
                          </Tag>
                        </div>
                      </div>
                      <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
                        {highlight.description}
                      </div>
                    </div>
                  ))}
                </Card>
              </Col>
              <Col span={12}>
                <Card title="资源需求" >
                  {stats.executiveInsights.resourceNeeds.map((need, index) => (
                    <div key={index} style={{
                      padding: '12px',
                      border: '1px solid #f0f0f0',
                      borderRadius: '6px',
                      marginBottom: '12px',
                      borderLeft: `4px solid ${getPriorityColor(need.priority)}`
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong>{need.area}</strong>
                        <Tag color={need.priority === 'urgent' ? 'red' : need.priority === 'high' ? 'orange' : 'blue'}>
                          {need.priority.toUpperCase()}
                        </Tag>
                      </div>
                      <div style={{ fontSize: '12px', color: '#666', margin: '8px 0' }}>
                        {need.description}
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1890ff' }}>
                        预估成本: {need.estimatedCost}
                      </div>
                    </div>
                  ))}
                </Card>
              </Col>
            </Row>
          </Tabs.TabPane>

          <Tabs.TabPane tab="快速操作" key="quickActions">
            <Row gutter={16}>
              <Col span={8}>
                <Card title="组件监测" >
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Link to="/pure-components/analysis">
                      <Button block icon={<EyeOutlined />}>查看组件分析</Button>
                    </Link>
                    <Link to="/pure-components/branch-results">
                      <Button block icon={<BugOutlined />}>分支检测结果</Button>
                    </Link>
                    <Link to="/pure-components/baselines">
                      <Button block icon={<ArrowUpOutlined />}>基准管理</Button>
                    </Link>
                  </Space>
                </Card>
              </Col>
              <Col span={8}>
                <Card title="管理操作" >
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Button block icon={<TeamOutlined />}>团队绩效报告</Button>
                    <Button block icon={<RocketOutlined />}>发布风险评估</Button>
                    <Button block icon={<SafetyOutlined />}>合规性审计</Button>
                  </Space>
                </Card>
              </Col>
              <Col span={8}>
                <Card title="决策支持" >
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Button block>导出质量报告</Button>
                    <Button block>资源分配建议</Button>
                    <Button block>风险预警设置</Button>
                  </Space>
                </Card>
              </Col>
            </Row>
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default ComponentsTesting;