import React, { useState, useEffect } from 'react';
import { Modal, Tabs, Card, Row, Col, Progress, Tag, Alert, Button, List, Timeline } from 'antd';
import { CheckCircleOutlined, ExclamationCircleOutlined, ClockCircleOutlined, BugOutlined, RocketOutlined, ToolOutlined } from '@ant-design/icons';
import type { BaselineDetails, ActionSuggestion, RiskAlert, Issue } from './types';
import VisualIntelligenceSection from './components/VisualIntelligenceSection';
import ExecutableRecommendations from './components/ExecutableRecommendations';
import InteractiveRecommendations from './components/InteractiveRecommendations';
import ProgressiveIntelligence from './components/ProgressiveIntelligence';

interface BaselineInfo {
  id: string;
  component: string;
  path: string;
  version: string;
  createdAt: Date;
  lastUpdated: Date;
  snapshotCount: number;
  propsVariations: number;
  status: 'healthy' | 'outdated' | 'corrupted';
  corruptionType?: 'fileCorrupted' | 'componentDeleted';
  branch: string;
  commit: string;
  size: number;
  usageCount: number;
  riskLevel: 'low' | 'high';
  businessImpact: string;
  criticalUsageScenarios: string[];
}

interface BaselineDetailModalProps {
  visible: boolean;
  onClose: () => void;
  baseline: BaselineInfo | null;
}

const BaselineDetailModal: React.FC<BaselineDetailModalProps> = ({
  visible,
  onClose,
  baseline
}) => {
  const [details, setDetails] = useState<BaselineDetails | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && baseline) {
      loadBaselineDetails(baseline.id);
    }
  }, [visible, baseline]);

  const loadBaselineDetails = async (baselineId: string) => {
    setLoading(true);
    setDetails(null);
    try {
      const response = await fetch('/baseline-details.json');
      const data = await response.json();
      if (data.success && data.data[baselineId]) {
        setDetails(data.data[baselineId]);
      } else {
        console.warn(`未找到基准详情数据: ${baselineId}`);
      }
    } catch (error) {
      console.error('加载基准详情失败:', error);
    }
    setLoading(false);
  };

  const renderQualityMetrics = () => {
    if (!details) return null;
    const { qualityMetrics } = details;

    return (
      <div>
        {/* 质量维度评估 */}
        <Card 
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircleOutlined style={{ color: '#1890ff' }} />
              <span>质量维度评估</span>
            </div>
          }
          style={{ marginBottom: 20 }}
        >
          <Row gutter={24}>
            <Col span={6}>
              <div style={{ 
                textAlign: 'center',
                padding: '20px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '12px',
                color: 'white'
              }}>
                <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '8px' }}>
                  {qualityMetrics.qualityAssessment.overallGrade}
                </div>
                <div style={{ fontSize: '14px', opacity: 0.9 }}>综合评级</div>
              </div>
            </Col>
            <Col span={18}>
              <Row gutter={16}>
                <Col span={8}>
                  <div style={{ textAlign: 'center', padding: '16px' }}>
                    <div style={{ 
                      fontSize: '20px', 
                      fontWeight: 'bold', 
                      color: getAssessmentColor(qualityMetrics.qualityAssessment.stability),
                      marginBottom: '8px'
                    }}>
                      {qualityMetrics.qualityAssessment.stability}
                    </div>
                    <div style={{ fontSize: '14px', color: '#666' }}>稳定性</div>
                    <Progress 
                      percent={getAssessmentPercent(qualityMetrics.qualityAssessment.stability)} 
                      size="small" 
                      strokeColor={getAssessmentColor(qualityMetrics.qualityAssessment.stability)}
                      showInfo={false}
                      style={{ marginTop: '8px' }}
                    />
                  </div>
                </Col>
                <Col span={8}>
                  <div style={{ textAlign: 'center', padding: '16px' }}>
                    <div style={{ 
                      fontSize: '20px', 
                      fontWeight: 'bold', 
                      color: getAssessmentColor(qualityMetrics.qualityAssessment.maintainability),
                      marginBottom: '8px'
                    }}>
                      {qualityMetrics.qualityAssessment.maintainability}
                    </div>
                    <div style={{ fontSize: '14px', color: '#666' }}>可维护性</div>
                    <Progress 
                      percent={getAssessmentPercent(qualityMetrics.qualityAssessment.maintainability)} 
                      size="small" 
                      strokeColor={getAssessmentColor(qualityMetrics.qualityAssessment.maintainability)}
                      showInfo={false}
                      style={{ marginTop: '8px' }}
                    />
                  </div>
                </Col>
                <Col span={8}>
                  <div style={{ textAlign: 'center', padding: '16px' }}>
                    <div style={{ 
                      fontSize: '20px', 
                      fontWeight: 'bold', 
                      color: getAssessmentColor(qualityMetrics.qualityAssessment.testability),
                      marginBottom: '8px'
                    }}>
                      {qualityMetrics.qualityAssessment.testability}
                    </div>
                    <div style={{ fontSize: '14px', color: '#666' }}>可测试性</div>
                    <Progress 
                      percent={getAssessmentPercent(qualityMetrics.qualityAssessment.testability)} 
                      size="small" 
                      strokeColor={getAssessmentColor(qualityMetrics.qualityAssessment.testability)}
                      showInfo={false}
                      style={{ marginTop: '8px' }}
                    />
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>

        {/* 性能指标 */}
        <Card 
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <RocketOutlined style={{ color: '#fa8c16' }} />
              <span>性能指标</span>
            </div>
          }
          style={{ marginBottom: 20 }}
        >
          <Row gutter={24}>
            <Col span={8}>
              <div style={{ 
                textAlign: 'center',
                padding: '20px',
                background: `linear-gradient(135deg, ${getPerformanceColor(qualityMetrics.performance.performanceScore)}20, ${getPerformanceColor(qualityMetrics.performance.performanceScore)}40)`,
                borderRadius: '12px',
                border: `2px solid ${getPerformanceColor(qualityMetrics.performance.performanceScore)}`
              }}>
                <div style={{ 
                  fontSize: '36px', 
                  fontWeight: 'bold', 
                  color: getPerformanceColor(qualityMetrics.performance.performanceScore),
                  marginBottom: '8px'
                }}>
                  {qualityMetrics.performance.performanceScore}
                </div>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>性能评分</div>
                <Progress
                  percent={qualityMetrics.performance.performanceScore}
                  size="small"
                  strokeColor={getPerformanceColor(qualityMetrics.performance.performanceScore)}
                  showInfo={false}
                />
              </div>
            </Col>
            <Col span={16}>
              <Row gutter={16}>
                <Col span={8}>
                  <Card size="small" style={{ textAlign: 'center', height: '100px' }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff', marginBottom: '4px' }}>
                      {qualityMetrics.performance.averageRenderTime}ms
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>平均渲染时间</div>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card size="small" style={{ textAlign: 'center', height: '100px' }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#52c41a', marginBottom: '4px' }}>
                      {qualityMetrics.performance.memorySizeProfile}KB
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>内存占用</div>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card size="small" style={{ textAlign: 'center', height: '100px' }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#722ed1', marginBottom: '4px' }}>
                      {qualityMetrics.performance.bundleSize}KB
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>打包大小</div>
                  </Card>
                </Col>
              </Row>
              
              <div style={{ marginTop: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '12px', color: '#666' }}>
                  Web Vitals 指标
                </div>
                <Row gutter={12}>
                  <Col span={8}>
                    <div style={{ textAlign: 'center', padding: '8px', background: '#f5f5f5', borderRadius: '6px' }}>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1890ff' }}>
                        {qualityMetrics.performance.benchmarks.firstPaint}ms
                      </div>
                      <div style={{ fontSize: '11px', color: '#666' }}>首次绘制</div>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div style={{ textAlign: 'center', padding: '8px', background: '#f5f5f5', borderRadius: '6px' }}>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1890ff' }}>
                        {qualityMetrics.performance.benchmarks.firstContentfulPaint}ms
                      </div>
                      <div style={{ fontSize: '11px', color: '#666' }}>首次内容绘制</div>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div style={{ textAlign: 'center', padding: '8px', background: '#f5f5f5', borderRadius: '6px' }}>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1890ff' }}>
                        {qualityMetrics.performance.benchmarks.largestContentfulPaint}ms
                      </div>
                      <div style={{ fontSize: '11px', color: '#666' }}>最大内容绘制</div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Card>

        {/* 测试覆盖率 */}
        <Card title="测试覆盖率" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={6}>
              <div style={{ textAlign: 'center' }}>
                <Progress
                  type="circle"
                  percent={qualityMetrics.testCoverage.overallCoverage}
                  size={80}
                  strokeColor={getCoverageColor(qualityMetrics.testCoverage.overallCoverage)}
                />
                <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>总体覆盖率</div>
              </div>
            </Col>
            <Col span={18}>
              <Row gutter={16}>
                <Col span={12}>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span>快照覆盖率</span>
                      <span>{qualityMetrics.testCoverage.snapshotCoverage}%</span>
                    </div>
                    <Progress percent={qualityMetrics.testCoverage.snapshotCoverage} size="small" />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span>Props覆盖率</span>
                      <span>{qualityMetrics.testCoverage.propsCoverage}%</span>
                    </div>
                    <Progress percent={qualityMetrics.testCoverage.propsCoverage} size="small" />
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span>状态覆盖率</span>
                      <span>{qualityMetrics.testCoverage.stateCoverage}%</span>
                    </div>
                    <Progress percent={qualityMetrics.testCoverage.stateCoverage} size="small" />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span>交互覆盖率</span>
                      <span>{qualityMetrics.testCoverage.interactionCoverage}%</span>
                    </div>
                    <Progress percent={qualityMetrics.testCoverage.interactionCoverage} size="small" />
                  </div>
                </Col>
              </Row>

              {qualityMetrics.testCoverage.missingTests.length > 0 && (
                <div>
                  <div style={{ marginBottom: 8, fontWeight: 'bold' }}>缺失的测试用例:</div>
                  <List
                    size="small"
                    dataSource={qualityMetrics.testCoverage.missingTests}
                    renderItem={item => <List.Item style={{ padding: '4px 0' }}>• {item}</List.Item>}
                  />
                </div>
              )}
            </Col>
          </Row>
        </Card>

        {/* 已知问题 */}
        <Card title="已知问题和风险点">
          {renderIssues(qualityMetrics.knownIssues.criticalIssues, 'critical', '关键问题')}
          {renderIssues(qualityMetrics.knownIssues.warnings, 'warning', '警告')}
          {renderIssues(qualityMetrics.knownIssues.suggestions, 'suggestion', '改进建议')}
        </Card>
      </div>
    );
  };

  const renderOperationSuggestions = () => {
    if (!details) return null;
    const { operationSuggestions } = details;

    return (
      <div>
        {/* 风险预警 - 最优先显示 */}
        {operationSuggestions.riskAlerts.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ 
              fontSize: '18px', 
              fontWeight: 'bold', 
              marginBottom: '16px',
              color: '#ff4d4f',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <ExclamationCircleOutlined />
              <span>⚠️ 风险预警</span>
            </div>
            {operationSuggestions.riskAlerts.map(alert => renderRiskAlert(alert))}
          </div>
        )}

        {/* 紧急操作 */}
        {operationSuggestions.statusBasedActions.primaryAction && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ 
              fontSize: '18px', 
              fontWeight: 'bold', 
              marginBottom: '16px',
              color: '#fa8c16',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <RocketOutlined />
              <span>🔥 紧急操作</span>
            </div>
            {renderActionSuggestion(operationSuggestions.statusBasedActions.primaryAction, true)}
          </div>
        )}

        {/* 质量改进建议 */}
        {operationSuggestions.qualityImprovements.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ 
              fontSize: '18px', 
              fontWeight: 'bold', 
              marginBottom: '16px',
              color: '#1890ff',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <ToolOutlined />
              <span>🔧 质量改进建议</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {operationSuggestions.qualityImprovements.map(suggestion => 
                renderActionSuggestion(suggestion, false)
              )}
            </div>
          </div>
        )}

        {/* 维护建议 */}
        {operationSuggestions.maintenanceRecommendations.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ 
              fontSize: '18px', 
              fontWeight: 'bold', 
              marginBottom: '16px',
              color: '#52c41a',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <ClockCircleOutlined />
              <span>📋 维护建议</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {operationSuggestions.maintenanceRecommendations.map(suggestion => 
                renderActionSuggestion(suggestion, false)
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderIssues = (issues: Issue[], type: string, title: string) => {
    if (issues.length === 0) return null;

    return (
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 'bold', marginBottom: 8 }}>{title} ({issues.length})</div>
        {issues.map(issue => (
          <Alert
            key={issue.id}
            type={type === 'critical' ? 'error' : type === 'warning' ? 'warning' : 'info'}
            style={{ marginBottom: 8 }}
            message={issue.title}
            description={
              <div>
                <div style={{ marginBottom: 4 }}>{issue.description}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  <strong>影响:</strong> {issue.impact} • 
                  <strong>建议:</strong> {issue.recommendation} • 
                  <strong>预计修复时间:</strong> {issue.estimatedFixTime}
                </div>
              </div>
            }
          />
        ))}
      </div>
    );
  };

  const renderActionSuggestion = (suggestion: ActionSuggestion, isPrimary: boolean) => (
    <Card
      key={suggestion.id}
      style={{ 
        marginBottom: 0,
        border: isPrimary ? `2px solid ${getPriorityColor(suggestion.priority)}` : '1px solid #f0f0f0',
        borderRadius: '12px',
        boxShadow: isPrimary ? '0 4px 12px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.1)'
      }}
      bodyStyle={{ padding: '20px' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ flex: 1 }}>
          <div style={{ 
            fontSize: '16px', 
            fontWeight: 'bold', 
            marginBottom: '8px',
            color: isPrimary ? getPriorityColor(suggestion.priority) : '#262626'
          }}>
            {getActionIcon(suggestion.type)} {suggestion.title}
          </div>
          <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
            {suggestion.description}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginLeft: 16 }}>
          <Tag 
            color={getPriorityColor(suggestion.priority)} 
            style={{ margin: 0, fontWeight: 'bold' }}
          >
            {suggestion.priority.toUpperCase()}
          </Tag>
          <Tag style={{ margin: 0, textAlign: 'center' }}>
            {suggestion.estimatedTime}
          </Tag>
        </div>
      </div>
      
      {suggestion.benefits.length > 0 && (
        <div style={{ 
          marginBottom: 16,
          padding: '12px',
          background: '#f6ffed',
          borderRadius: '8px',
          border: '1px solid #b7eb8f'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: 8, color: '#52c41a' }}>
            ✅ 预期收益:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {suggestion.benefits.map((benefit, index) => (
              <Tag key={index} color="green" style={{ margin: 0 }}>
                {benefit}
              </Tag>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginBottom: isPrimary ? 16 : 0 }}>
        <div style={{ fontWeight: 'bold', marginBottom: 12, color: '#666' }}>
          📋 执行步骤:
        </div>
        <Timeline>
          {suggestion.steps.map((step, index) => (
            <Timeline.Item 
              key={index}
              color={isPrimary ? getPriorityColor(suggestion.priority) : '#1890ff'}
            >
              <span style={{ fontSize: '13px' }}>{step}</span>
            </Timeline.Item>
          ))}
        </Timeline>
      </div>

      {isPrimary && (
        <div style={{ textAlign: 'right' }}>
          <Button 
            type="primary" 
            size="large"
            icon={getActionIcon(suggestion.type)}
            style={{ 
              background: getPriorityColor(suggestion.priority),
              borderColor: getPriorityColor(suggestion.priority),
              fontWeight: 'bold'
            }}
          >
            立即执行
          </Button>
        </div>
      )}
    </Card>
  );

  const renderRiskAlert = (alert: RiskAlert) => (
    <Alert
      key={alert.id}
      type={alert.level === 'critical' ? 'error' : 'warning'}
      style={{ marginBottom: 12 }}
      message={alert.message}
      description={
        <div>
          <div style={{ marginBottom: 4 }}><strong>影响:</strong> {alert.impact}</div>
          <div style={{ marginBottom: 4 }}><strong>时间线:</strong> {alert.timeline}</div>
          <div><strong>缓解措施:</strong> {alert.mitigation}</div>
        </div>
      }
    />
  );

  // 工具函数
  const getGradeColor = (grade: string) => {
    const colors = { A: '#52c41a', B: '#1890ff', C: '#faad14', D: '#ff7a45', F: '#ff4d4f' };
    return colors[grade as keyof typeof colors] || '#666';
  };

  const getAssessmentColor = (level: string) => {
    const colors = { excellent: '#52c41a', good: '#1890ff', fair: '#faad14', poor: '#ff4d4f' };
    return colors[level as keyof typeof colors] || '#666';
  };

  const getAssessmentPercent = (level: string) => {
    const percents = { excellent: 100, good: 80, fair: 60, poor: 30 };
    return percents[level as keyof typeof percents] || 0;
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return '#52c41a';
    if (score >= 70) return '#1890ff';
    if (score >= 50) return '#faad14';
    return '#ff4d4f';
  };

  const getCoverageColor = (coverage: number) => {
    if (coverage >= 90) return '#52c41a';
    if (coverage >= 80) return '#1890ff';
    if (coverage >= 70) return '#faad14';
    return '#ff4d4f';
  };

  const getPriorityColor = (priority: string) => {
    const colors = { critical: 'red', high: 'orange', medium: 'blue', low: 'green' };
    return colors[priority as keyof typeof colors] || 'default';
  };

  const getActionIcon = (type: string) => {
    const icons = {
      update: <RocketOutlined />,
      rebuild: <ToolOutlined />,
      optimize: <RocketOutlined />,
      test: <BugOutlined />,
      refactor: <ToolOutlined />,
      monitor: <ClockCircleOutlined />
    };
    return icons[type as keyof typeof icons] || <ToolOutlined />;
  };

  const renderComponentOverview = () => {
    if (!baseline || !details) return null;

    const { qualityMetrics } = details;
    const overallGrade = qualityMetrics.qualityAssessment.overallGrade;
    const performanceScore = qualityMetrics.performance.performanceScore;
    const coverageScore = qualityMetrics.testCoverage.overallCoverage;

    return (
      <div style={{ 
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '24px'
      }}>
        <Row gutter={24}>
          <Col span={8}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '48px', 
                fontWeight: 'bold', 
                color: getGradeColor(overallGrade),
                lineHeight: '1'
              }}>
                {overallGrade}
              </div>
              <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
                综合评级
              </div>
              <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                {baseline.businessImpact}
              </div>
            </div>
          </Col>
          <Col span={16}>
            <Row gutter={16}>
              <Col span={8}>
                <Card size="small" style={{ textAlign: 'center', height: '90px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: getPerformanceColor(performanceScore) }}>
                    {performanceScore}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>性能评分</div>
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" style={{ textAlign: 'center', height: '90px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: getCoverageColor(coverageScore) }}>
                    {coverageScore}%
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>测试覆盖率</div>
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" style={{ textAlign: 'center', height: '90px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: baseline.riskLevel === 'high' ? '#ff4d4f' : '#52c41a' }}>
                    {baseline.usageCount}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>使用次数</div>
                  <Tag 
                    color={baseline.riskLevel === 'high' ? 'red' : 'green'} 
                    style={{ marginTop: '4px' }}
                  >
                    {baseline.riskLevel === 'high' ? '高风险' : '低风险'}
                  </Tag>
                </Card>
              </Col>
            </Row>
            <div style={{ marginTop: '12px', fontSize: '12px', color: '#666' }}>
              <Row gutter={16}>
                <Col span={12}>
                  <strong>组件路径:</strong> {baseline.path}
                </Col>
                <Col span={6}>
                  <strong>版本:</strong> {baseline.version}
                </Col>
                <Col span={6}>
                  <strong>分支:</strong> {baseline.branch}
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ fontSize: '16px', marginBottom: 16 }}>正在加载基准详情...</div>
          <Progress percent={0} showInfo={false} />
        </div>
      );
    }

    if (!details) {
      return (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <ExclamationCircleOutlined style={{ fontSize: '48px', color: '#faad14', marginBottom: 16 }} />
          <div style={{ fontSize: '16px', marginBottom: 8 }}>暂无详情数据</div>
          <div style={{ fontSize: '14px', color: '#666' }}>
            该组件的详细分析数据正在生成中，请稍后再试
          </div>
        </div>
      );
    }

    return (
      <div>
        {renderComponentOverview()}
        <Tabs 
          items={tabItems} 
          size="large"
          tabBarStyle={{ marginBottom: 24 }}
        />
      </div>
    );
  };

  const renderIntelligentSuggestions = () => {
    if (!baseline) return null;
    
    return (
      <div>
        {/* 可视化智能建议 */}
        <VisualIntelligenceSection baseline={baseline} />
        
        {/* 可执行代码建议 */}
        <ExecutableRecommendations baseline={baseline} />
        
        {/* 交互式智能助手 */}
        <InteractiveRecommendations baseline={baseline} />
        
        {/* 渐进式智能学习 */}
        <ProgressiveIntelligence baseline={baseline} />
      </div>
    );
  };

  const tabItems = [
    {
      key: 'intelligent',
      label: '🤖 智能建议',
      children: renderIntelligentSuggestions()
    },
    {
      key: 'quality',
      label: '📊 质量指标',
      children: renderQualityMetrics()
    },
    {
      key: 'suggestions',
      label: '⚙️ 操作建议',
      children: renderOperationSuggestions()
    }
  ];

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
            基准详情 - {baseline?.component || ''}
          </span>
          {baseline && (
            <div style={{ display: 'flex', gap: 8 }}>
              <Tag color={baseline.riskLevel === 'high' ? 'red' : 'green'}>
                {baseline.riskLevel === 'high' ? '高风险' : '低风险'}
              </Tag>
              <Tag color="blue">
                {baseline.usageCount} 次使用
              </Tag>
            </div>
          )}
        </div>
      }
      open={visible}
      onCancel={onClose}
      width={1400}
      style={{ top: 20 }}
      bodyStyle={{ padding: '16px 24px', maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}
      footer={[
        <div key="footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '12px', color: '#666' }}>
            最后检查: {baseline ? new Date(baseline.lastUpdated).toLocaleString() : ''}
          </div>
          <Button key="close" onClick={onClose} size="large">
            关闭
          </Button>
        </div>
      ]}
    >
      {renderContent()}
    </Modal>
  );
};

export default BaselineDetailModal;