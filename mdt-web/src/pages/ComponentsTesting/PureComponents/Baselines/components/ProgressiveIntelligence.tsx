import React, { useState } from 'react';
import { Card, Row, Col, Progress, Tag, Button, Timeline, Avatar, Badge, message } from 'antd';
import { 
  ExperimentOutlined, 
  TrophyOutlined, 
  TeamOutlined, 
  ClockCircleOutlined, 
  StarOutlined,
  BulbOutlined,
  LineChartOutlined,
  UserOutlined
} from '@ant-design/icons';
import { ProgressiveLearning } from '../../../../../services/types/baseline';

interface LearningPattern {
  id: string;
  type: 'code_style' | 'component_preference' | 'workflow_pattern' | 'team_standard';
  title: string;
  description: string;
  confidence: number;
  examples: number;
  lastSeen: string;
  impact: 'high' | 'medium' | 'low';
}

interface PersonalizedSuggestion {
  id: string;
  title: string;
  reason: string;
  basedOnPattern: string;
  confidence: number;
  previousAcceptance: number;
  customizedFor: string;
  learnedFrom: {
    similarComponents: string[];
    teamPreferences: string[];
    historicalChoices: string[];
  };
}

interface TeamInsight {
  id: string;
  pattern: string;
  adoption: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  recommendation: string;
  impact: string;
}

interface Props {
  baseline: any;
  progressiveLearning?: ProgressiveLearning;
}

const ProgressiveIntelligence: React.FC<Props> = ({ progressiveLearning }) => {
  const [expandedPattern, setExpandedPattern] = useState<string | null>(null);
  
  // 转换API数据或使用默认数据
  const learningPatterns: LearningPattern[] = progressiveLearning?.patterns.map(p => ({
    id: p.id,
    type: p.type.includes('code') ? 'code_style' as const : 
          p.type.includes('workflow') ? 'workflow_pattern' as const : 'component_preference' as const,
    title: p.title,
    description: p.description,
    confidence: p.confidence,
    examples: p.examples,
    lastSeen: p.lastSeen,
    impact: p.confidence > 90 ? 'high' as const : p.confidence > 70 ? 'medium' as const : 'low' as const
  })) || [
    {
      id: 'pattern-1',
      type: 'code_style',
      title: '你偏好使用React.memo进行性能优化',
      description: '基于过去6次选择，你总是接受React.memo的建议',
      confidence: 95,
      examples: 6,
      lastSeen: '2小时前',
      impact: 'high'
    },
    {
      id: 'pattern-2', 
      type: 'component_preference',
      title: '你的团队偏好使用TypeScript严格模式',
      description: '团队成员在90%的组件中使用严格类型定义',
      confidence: 90,
      examples: 23,
      lastSeen: '1天前',
      impact: 'high'
    },
    {
      id: 'pattern-3',
      type: 'workflow_pattern',
      title: '你通常在晚上9点进行组件优化',
      description: '检测到你的活跃优化时间模式',
      confidence: 80,
      examples: 8,
      lastSeen: '3天前',
      impact: 'medium'
    }
  ];

  const personalizedSuggestions: PersonalizedSuggestion[] = [
    {
      id: 'pers-1',
      title: '为Button组件添加loading状态的进度条',
      reason: '基于你过去对用户体验细节的关注',
      basedOnPattern: '你在类似组件中总是优化loading体验',
      confidence: 88,
      previousAcceptance: 85,
      customizedFor: '你的编码风格偏好',
      learnedFrom: {
        similarComponents: ['InputButton', 'SubmitButton', 'ActionButton'],
        teamPreferences: ['使用Ant Design Progress', '保持品牌一致性'],
        historicalChoices: ['选择进度条而非spinner', '重视加载状态反馈']
      }
    },
    {
      id: 'pers-2',
      title: '添加键盘导航支持',
      reason: '你的团队重视可访问性',
      basedOnPattern: '团队在75%的交互组件中添加了键盘支持',
      confidence: 78,
      previousAcceptance: 70,
      customizedFor: '团队标准',
      learnedFrom: {
        similarComponents: ['Modal', 'Dropdown', 'Menu'],
        teamPreferences: ['WCAG 2.1 AA标准', '键盘友好的交互'],
        historicalChoices: ['Tab导航', 'Enter/Space激活', 'Escape关闭']
      }
    }
  ];

  const teamInsights: TeamInsight[] = [
    {
      id: 'insight-1',
      pattern: '团队开始更多使用CSS-in-JS',
      adoption: 65,
      trend: 'increasing',
      recommendation: '考虑在此组件中使用styled-components',
      impact: '提高样式维护性，减少CSS冲突'
    },
    {
      id: 'insight-2', 
      pattern: '错误处理模式逐渐标准化',
      adoption: 80,
      trend: 'stable',
      recommendation: '使用团队统一的错误边界模式',
      impact: '提升用户体验一致性'
    }
  ];

  const getPatternIcon = (type: string) => {
    const icons = {
      code_style: <ExperimentOutlined style={{ color: '#1890ff' }} />,
      component_preference: <StarOutlined style={{ color: '#52c41a' }} />,
      workflow_pattern: <ClockCircleOutlined style={{ color: '#faad14' }} />,
      team_standard: <TeamOutlined style={{ color: '#722ed1' }} />
    };
    return icons[type as keyof typeof icons] || <ExperimentOutlined />;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return '#52c41a';
    if (confidence >= 75) return '#1890ff';
    if (confidence >= 60) return '#faad14';
    return '#ff4d4f';
  };

  const applyPersonalizedSuggestion = async (suggestion: PersonalizedSuggestion) => {
    message.success(`正在应用个性化建议: ${suggestion.title}`);
    // 模拟学习过程
    setTimeout(() => {
      message.info('已记录你的选择，下次会提供更精准的建议');
    }, 2000);
  };

  return (
    <Card 
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ExperimentOutlined style={{ color: '#722ed1' }} />
          <span>渐进式智能学习</span>
          <Tag color="purple">AI持续学习中</Tag>
        </div>
      } 
      style={{ marginBottom: 24 }}
    >
      {/* 学习状态概览 */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        color: 'white'
      }}>
        <Row gutter={24}>
          <Col span={6}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
                {learningPatterns.length}
              </div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>识别的模式</div>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
                {personalizedSuggestions.length}
              </div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>个性化建议</div>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
                87%
              </div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>建议准确率</div>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
                14
              </div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>天学习历史</div>
            </div>
          </Col>
        </Row>
      </div>

      {/* 识别的模式 */}
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <LineChartOutlined style={{ color: '#1890ff' }} />
            <span>识别的行为模式</span>
          </div>
        }
        size="small" 
        style={{ marginBottom: 20 }}
      >
        <Row gutter={16}>
          {learningPatterns.map((pattern) => (
            <Col span={8} key={pattern.id}>
              <Card 
                size="small"
                style={{ 
                  cursor: 'pointer',
                  border: expandedPattern === pattern.id ? '2px solid #1890ff' : '1px solid #f0f0f0'
                }}
                onClick={() => setExpandedPattern(expandedPattern === pattern.id ? null : pattern.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  {getPatternIcon(pattern.type)}
                  <Tag color={pattern.impact === 'high' ? 'red' : pattern.impact === 'medium' ? 'orange' : 'green'}>
                    {pattern.impact.toUpperCase()}
                  </Tag>
                </div>
                
                <div style={{ fontWeight: 'bold', marginBottom: 8, fontSize: '13px' }}>
                  {pattern.title}
                </div>
                
                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: '12px' }}>信心度</span>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: getConfidenceColor(pattern.confidence) }}>
                      {pattern.confidence}%
                    </span>
                  </div>
                  <Progress
                    percent={pattern.confidence}
                    size="small"
                    strokeColor={getConfidenceColor(pattern.confidence)}
                    showInfo={false}
                  />
                </div>

                <div style={{ fontSize: '12px', color: '#666' }}>
                  基于 {pattern.examples} 个样本 • {pattern.lastSeen}
                </div>

                {expandedPattern === pattern.id && (
                  <div style={{ 
                    marginTop: 12, 
                    padding: '8px', 
                    background: '#f8f9fa', 
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}>
                    {pattern.description}
                  </div>
                )}
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* 个性化建议 */}
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <BulbOutlined style={{ color: '#52c41a' }} />
            <span>为你定制的建议</span>
            <Badge count="个性化" style={{ backgroundColor: '#52c41a' }} />
          </div>
        }
        size="small" 
        style={{ marginBottom: 20 }}
      >
        {personalizedSuggestions.map((suggestion) => (
          <Card
            key={suggestion.id}
            size="small"
            style={{ 
              marginBottom: 16,
              border: '1px solid #52c41a',
              borderRadius: '8px'
            }}
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Avatar size="small" icon={<UserOutlined />} style={{ background: '#52c41a' }} />
                  <span style={{ fontSize: '14px' }}>{suggestion.title}</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Tag color="green">{suggestion.confidence}% 匹配</Tag>
                  <Button 
                    size="small" 
                    type="primary"
                    onClick={() => applyPersonalizedSuggestion(suggestion)}
                  >
                    应用建议
                  </Button>
                </div>
              </div>
            }
          >
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: '13px', marginBottom: 4 }}>
                <strong>为什么推荐:</strong> {suggestion.reason}
              </div>
              <div style={{ fontSize: '13px', marginBottom: 4 }}>
                <strong>学习依据:</strong> {suggestion.basedOnPattern}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                历史接受率: {suggestion.previousAcceptance}% • 定制给: {suggestion.customizedFor}
              </div>
            </div>

            {/* 学习来源详情 */}
            <div style={{ 
              background: '#f6ffed', 
              padding: '12px', 
              borderRadius: '6px',
              border: '1px solid #b7eb8f'
            }}>
              <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: 8, color: '#52c41a' }}>
                🧠 AI学习来源:
              </div>
              <Row gutter={16}>
                <Col span={8}>
                  <div style={{ fontSize: '11px', color: '#666', marginBottom: 4 }}>相似组件:</div>
                  {suggestion.learnedFrom.similarComponents.map((comp, i) => (
                    <Tag key={i} style={{ fontSize: '10px', marginBottom: 2 }}>
                      {comp}
                    </Tag>
                  ))}
                </Col>
                <Col span={8}>
                  <div style={{ fontSize: '11px', color: '#666', marginBottom: 4 }}>团队偏好:</div>
                  {suggestion.learnedFrom.teamPreferences.map((pref, i) => (
                    <div key={i} style={{ fontSize: '10px', marginBottom: 2 }}>• {pref}</div>
                  ))}
                </Col>
                <Col span={8}>
                  <div style={{ fontSize: '11px', color: '#666', marginBottom: 4 }}>历史选择:</div>
                  {suggestion.learnedFrom.historicalChoices.map((choice, i) => (
                    <div key={i} style={{ fontSize: '10px', marginBottom: 2 }}>• {choice}</div>
                  ))}
                </Col>
              </Row>
            </div>
          </Card>
        ))}
      </Card>

      {/* 团队洞察 */}
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <TeamOutlined style={{ color: '#722ed1' }} />
            <span>团队趋势洞察</span>
          </div>
        }
        size="small"
      >
        <Timeline>
          {teamInsights.map((insight) => (
            <Timeline.Item
              key={insight.id}
              color={insight.trend === 'increasing' ? '#52c41a' : insight.trend === 'stable' ? '#1890ff' : '#faad14'}
              dot={
                <div style={{ 
                  background: insight.trend === 'increasing' ? '#52c41a' : insight.trend === 'stable' ? '#1890ff' : '#faad14',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <TrophyOutlined style={{ fontSize: '8px', color: 'white' }} />
                </div>
              }
            >
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
                  {insight.pattern}
                  <Tag 
                    color={insight.trend === 'increasing' ? 'green' : insight.trend === 'stable' ? 'blue' : 'orange'}
                    style={{ marginLeft: 8 }}
                  >
                    {insight.trend === 'increasing' ? '上升' : insight.trend === 'stable' ? '稳定' : '下降'}
                  </Tag>
                </div>
                
                <div style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: '12px' }}>团队采用率</span>
                    <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{insight.adoption}%</span>
                  </div>
                  <Progress
                    percent={insight.adoption}
                    size="small"
                    strokeColor={insight.trend === 'increasing' ? '#52c41a' : '#1890ff'}
                    showInfo={false}
                  />
                </div>
                
                <div style={{ 
                  background: '#f0f2f5', 
                  padding: '8px', 
                  borderRadius: '4px',
                  fontSize: '12px'
                }}>
                  <div><strong>建议:</strong> {insight.recommendation}</div>
                  <div style={{ marginTop: 4 }}><strong>影响:</strong> {insight.impact}</div>
                </div>
              </div>
            </Timeline.Item>
          ))}
        </Timeline>
      </Card>

      {/* 学习反馈区域 */}
      <div style={{ 
        borderTop: '1px solid #f0f0f0', 
        paddingTop: '16px',
        marginTop: '16px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '12px', color: '#999', marginBottom: 8 }}>
          💡 AI正在持续学习你的偏好和团队模式，每次交互都会让建议更加精准
        </div>
        <div style={{ fontSize: '11px', color: '#ccc' }}>
          学习数据仅用于改善建议质量，不会泄露任何敏感信息
        </div>
      </div>
    </Card>
  );
};

export default ProgressiveIntelligence;