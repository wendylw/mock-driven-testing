import React, { useState, useMemo } from 'react';
import { Card, Row, Col, Tag, Button, message } from 'antd';
import { EyeOutlined, BugOutlined } from '@ant-design/icons';
import { VisualSuggestion } from '../../../../../services/types/baseline';
import { baselineService } from '../../../../../services/baseline.service';
import { getActualButtonStyle, getExpectedButtonStyle, BeepDesignTokens } from '../../../../../utils/beepDesignSystem';

interface Props {
  baseline: any;
  baselineId: string;
  visualSuggestions?: VisualSuggestion[];
}

const VisualIntelligenceSection: React.FC<Props> = ({ baseline, baselineId, visualSuggestions = [] }) => {
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const [applyingFix, setApplyingFix] = useState<string | null>(null);
  
  // 根据后端数据生成视觉展示
  const renderVisualProblem = (issue: any) => {
    const visualDiff = issue.visualDiff || issue.evidence?.visualDiff;
    
    if (!visualDiff) {
      return <div>无可视化数据</div>;
    }

    // 根据问题类型渲染不同的视觉展示
    switch (visualDiff.property) {
      case 'padding':
        return (
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <button style={{
              ...getActualButtonStyle(visualDiff),
              background: BeepDesignTokens.colors.orange.DEFAULT,
              color: 'white',
              border: `1px solid ${BeepDesignTokens.colors.orange.DEFAULT}`,
              height: BeepDesignTokens.button.height.normal,
              fontSize: '16px'
            }}>
              保存资料
            </button>
            
            {/* Padding标注 */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              pointerEvents: 'none'
            }}>
              {/* 外边框 - 实际padding */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                border: '2px dashed #ff4d4f'
              }}>
                <span style={{
                  position: 'absolute',
                  top: '-20px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'white',
                  padding: '0 4px',
                  fontSize: '12px',
                  color: '#ff4d4f'
                }}>
                  实际: {visualDiff.actual.vertical} {visualDiff.actual.horizontal}
                </span>
              </div>
              
              {/* 内边框 - 期望padding */}
              <div style={{
                position: 'absolute',
                top: visualDiff.expected.vertical,
                left: visualDiff.expected.horizontal,
                right: visualDiff.expected.horizontal,
                bottom: visualDiff.expected.vertical,
                border: '2px dashed #52c41a'
              }}>
                <span style={{
                  position: 'absolute',
                  bottom: '-20px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'white',
                  padding: '0 4px',
                  fontSize: '12px',
                  color: '#52c41a'
                }}>
                  期望: {visualDiff.expected.vertical} {visualDiff.expected.horizontal}
                </span>
              </div>
            </div>
          </div>
        );
        
      case 'color-contrast':
        return (
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <button style={{
              ...getActualButtonStyle(visualDiff),
              height: BeepDesignTokens.button.height.normal,
              fontSize: '16px',
              cursor: 'not-allowed'
            }} disabled>
              保存资料
            </button>
            
            <div style={{
              fontSize: '14px',
              lineHeight: 1.5
            }}>
              <div style={{ color: '#ff4d4f' }}>
                对比度: {visualDiff.actual.contrast} ❌
              </div>
              <div style={{ color: '#999', fontSize: '12px' }}>
                背景: {visualDiff.actual.background}
              </div>
              <div style={{ color: '#999', fontSize: '12px' }}>
                文字: {visualDiff.actual.foreground}
              </div>
            </div>
          </div>
        );
        
      case 'border-radius':
        const affectedStyles = issue.affectedStyles || issue.evidence?.affectedStyles || {};
        return (
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {Object.entries(affectedStyles).map(([type, value]: [string, any]) => (
              <div key={type} style={{ textAlign: 'center' }}>
                <button style={{
                  background: type.includes('primary') ? BeepDesignTokens.colors.orange.DEFAULT : 'white',
                  color: type.includes('primary') ? 'white' : BeepDesignTokens.colors.orange.DEFAULT,
                  border: `1px solid ${BeepDesignTokens.colors.orange.DEFAULT}`,
                  padding: '12px 16px',
                  borderRadius: value.actual || value,
                  height: BeepDesignTokens.button.height.normal,
                  fontSize: '14px',
                  fontWeight: 700,
                  fontFamily: BeepDesignTokens.typography.fontFamily,
                  letterSpacing: BeepDesignTokens.typography.letterSpacing.wider,
                  cursor: 'pointer'
                }}>
                  {type}
                </button>
                <div style={{ fontSize: '12px', marginTop: 4, color: '#666' }}>
                  {value.actual || value}
                </div>
              </div>
            ))}
          </div>
        );
        
      default:
        return <div>未知的视觉问题类型</div>;
    }
  };

  // 渲染修复前后对比
  const renderBeforeAfter = (issue: any) => {
    const visualDiff = issue.visualDiff || issue.evidence?.visualDiff;
    
    if (!visualDiff) return null;
    
    return (
      <Row gutter={16}>
        <Col span={12}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '12px', 
              color: '#ff4d4f', 
              marginBottom: 8,
              fontWeight: 'bold'
            }}>
              修复前
            </div>
            <div style={{ 
              padding: 16,
              background: '#fff',
              border: '2px solid #ff4d4f',
              borderRadius: '8px',
              display: 'inline-block'
            }}>
              <button style={{
                ...getActualButtonStyle(visualDiff),
                background: visualDiff.property === 'color-contrast' 
                  ? visualDiff.actual.background 
                  : BeepDesignTokens.colors.orange.DEFAULT,
                color: visualDiff.property === 'color-contrast'
                  ? visualDiff.actual.foreground
                  : 'white',
                border: `1px solid ${visualDiff.property === 'color-contrast' 
                  ? visualDiff.actual.background 
                  : BeepDesignTokens.colors.orange.DEFAULT}`,
                height: BeepDesignTokens.button.height.normal,
                fontSize: '16px',
                minWidth: '120px'
              }} disabled={visualDiff.property === 'color-contrast'}>
                保存资料
              </button>
            </div>
          </div>
        </Col>
        
        <Col span={12}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '12px', 
              color: '#52c41a', 
              marginBottom: 8,
              fontWeight: 'bold'
            }}>
              修复后
            </div>
            <div style={{ 
              padding: 16,
              background: '#fff',
              border: '2px solid #52c41a',
              borderRadius: '8px',
              display: 'inline-block'
            }}>
              <button style={{
                ...getExpectedButtonStyle(visualDiff),
                background: visualDiff.property === 'color-contrast' 
                  ? visualDiff.expected.background 
                  : BeepDesignTokens.colors.orange.DEFAULT,
                color: visualDiff.property === 'color-contrast'
                  ? visualDiff.expected.foreground
                  : 'white',
                border: `1px solid ${visualDiff.property === 'color-contrast' 
                  ? visualDiff.expected.background 
                  : BeepDesignTokens.colors.orange.DEFAULT}`,
                height: BeepDesignTokens.button.height.normal,
                fontSize: '16px',
                minWidth: '120px'
              }} disabled={visualDiff.property === 'color-contrast'}>
                保存资料
              </button>
            </div>
          </div>
        </Col>
      </Row>
    );
  };

  return (
    <Card 
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <EyeOutlined style={{ color: '#1890ff' }} />
          <span>可视化问题检测</span>
          <Tag color="blue">{visualSuggestions.length}个问题</Tag>
        </div>
      } 
      style={{ marginBottom: 24 }}
    >
      {visualSuggestions.map((issue) => {
        const visualDiff = issue.visualDiff || issue.evidence?.visualDiff;
        const priority = issue.severity === 'critical' ? 'high' : 
                        issue.severity === 'warning' ? 'medium' : 'low';
        
        return (
          <div key={issue.id} className="visual-issue-item" style={{ marginBottom: 24 }}>
            <Row gutter={24}>
              {/* 问题展示 */}
              <Col span={12}>
                <div className="issue-display">
                  <div className="screenshot-header" style={{ marginBottom: 12 }}>
                    <Tag color={priority === 'high' ? 'red' : 'orange'}>
                      {priority} 优先级
                    </Tag>
                    <span style={{ fontWeight: 'bold' }}>{issue.title}</span>
                  </div>
                  
                  {/* 动态渲染视觉问题 */}
                  <div style={{ 
                    padding: 16,
                    background: '#f5f7fa',
                    borderRadius: '8px',
                    minHeight: 100,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {renderVisualProblem(issue)}
                  </div>
                  
                  {/* 问题详情 */}
                  {visualDiff?.designSystemRef && (
                    <div style={{ 
                      marginTop: 8, 
                      fontSize: '12px', 
                      color: '#666',
                      background: '#f6ffed',
                      padding: '8px 12px',
                      borderRadius: '4px'
                    }}>
                      <div><strong>设计令牌:</strong> {visualDiff.designSystemRef.token}</div>
                      <div><strong>期望值:</strong> {visualDiff.designSystemRef.value}</div>
                      <div><strong>来源:</strong> {visualDiff.designSystemRef.source}</div>
                    </div>
                  )}
                </div>
              </Col>
              
              {/* Before/After 对比 */}
              <Col span={12}>
                <div className="before-after-comparison">
                  <div className="comparison-header" style={{ marginBottom: 12 }}>
                    <span style={{ fontWeight: 'bold' }}>修复效果预览</span>
                  </div>
                  
                  {renderBeforeAfter(issue)}
                  
                  {/* 修复建议 */}
                  <div style={{ 
                    marginTop: 16,
                    padding: '12px',
                    background: '#f0f9ff',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}>
                    <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
                      建议修复方案：
                    </div>
                    <div>{issue.recommendation?.action}</div>
                    {issue.recommendation?.code && (
                      <pre style={{ 
                        background: '#f5f5f5', 
                        padding: '8px', 
                        borderRadius: '4px',
                        marginTop: 8,
                        fontSize: '12px',
                        overflow: 'auto'
                      }}>
                        {issue.recommendation.code}
                      </pre>
                    )}
                  </div>
                </div>
              </Col>
            </Row>
            
            {/* 详细说明 */}
            <div className="issue-details" style={{ 
              marginTop: 16, 
              padding: '12px', 
              background: '#fafafa', 
              borderRadius: '4px',
              border: '1px solid #f0f0f0'
            }}>
              <div><strong>问题描述:</strong> {issue.description}</div>
              {visualDiff?.location && (
                <div><strong>代码位置:</strong> {visualDiff.location.file} 第{visualDiff.location.line}行</div>
              )}
              {visualDiff?.selector && (
                <div><strong>CSS选择器:</strong> <code>{visualDiff.selector}</code></div>
              )}
            </div>
          </div>
        );
      })}
    </Card>
  );
};

export default VisualIntelligenceSection;