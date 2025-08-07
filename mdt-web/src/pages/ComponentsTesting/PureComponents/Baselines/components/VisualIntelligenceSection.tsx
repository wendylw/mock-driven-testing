import React, { useState } from 'react';
import { Card, Row, Col, Tag, Button, message } from 'antd';
import { EyeOutlined, BugOutlined } from '@ant-design/icons';
import { VisualSuggestion } from '../../../../../services/types/baseline';
import { baselineService } from '../../../../../services/baseline.service';

interface VisualIssue {
  id: string;
  type: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  description: string;
  suggestion: string;
  affectedElements: number;
  visualHighlight: {
    screenshot: string;
    annotations: Array<{
      position: { x: number; y: number };
      issue: string;
      suggestion: string;
      priority: string;
      oneClickFix: string;
    }>;
  };
  beforeAfter: {
    before: string;
    after: string;
  };
}

interface Props {
  baseline: any;
  baselineId: string;
  visualSuggestions?: VisualSuggestion[];
}

const VisualIntelligenceSection: React.FC<Props> = ({ baseline, baselineId, visualSuggestions = [] }) => {
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const [applyingFix, setApplyingFix] = useState<string | null>(null);
  
  // 将API数据转换为组件内部格式
  const visualIssues: VisualIssue[] = visualSuggestions.map(suggestion => {
    const visualDiff = suggestion.visualDiff || {};
    const affectedStyles = suggestion.affectedStyles || {};
    
    // 根据问题类型生成合适的标注
    const annotations = [];
    if (suggestion.title?.includes('内边距')) {
      // Padding问题标注
      annotations.push({
        position: { x: 50, y: 45 },
        issue: `Expected: ${visualDiff.expected}`,
        suggestion: `Actual: ${visualDiff.actual}`,
        priority: suggestion.severity || 'medium',
        oneClickFix: '应用设计规范'
      });
    } else if (suggestion.title?.includes('颜色对比度')) {
      // 颜色对比度问题
      annotations.push({
        position: { x: 120, y: 45 },
        issue: `对比度: ${visualDiff.contrast || '2.8:1'}`,
        suggestion: `需要: ${visualDiff.required || '4.5:1'}`,
        priority: suggestion.severity || 'high',
        oneClickFix: '调整颜色对比度'
      });
    } else if (suggestion.title?.includes('圆角')) {
      // 圆角问题
      Object.entries(affectedStyles).forEach(([type, radius], index) => {
        annotations.push({
          position: { x: 50 + index * 80, y: 30 },
          issue: `${type}: ${radius}`,
          suggestion: '应该: 4px',
          priority: 'low',
          oneClickFix: '统一圆角'
        });
      });
    }
    
    return {
      id: suggestion.id,
      type: suggestion.type,
      title: suggestion.title || 'Visual Issue Detected',
      priority: (suggestion.severity === 'critical' ? 'high' : 
                suggestion.severity === 'warning' ? 'medium' : 'low') as 'high' | 'medium' | 'low',
      description: suggestion.description || 'Visual problem detected',
      suggestion: suggestion.recommendation?.action || '需要修复',
      affectedElements: Object.keys(affectedStyles).length || 1,
      visualHighlight: {
        screenshot: '/mock-screenshot.png',
        annotations: annotations.length > 0 ? annotations : [{
          position: { x: 120, y: 45 },
          issue: '视觉问题',
          suggestion: '需要修复',
          priority: 'medium',
          oneClickFix: '修复'
        }]
      },
      beforeAfter: {
        before: '/mock-before.png',
        after: '/mock-after.png'
      }
    };
  });
  
  // 如果没有API数据，使用默认数据
  const defaultVisualIssues: VisualIssue[] = visualIssues.length > 0 ? visualIssues : [
    {
      id: 'accessibility-001',
      type: 'accessibility_issues',
      title: '发现3个可访问性问题',
      priority: 'high',
      description: '按钮缺少合适的颜色对比度和aria-label',
      suggestion: '调整颜色对比度到4.5:1，添加描述性标签',
      affectedElements: 3,
      visualHighlight: {
        screenshot: '/mdt-output/2025-07-29/button-accessibility-issues.png',
        annotations: [
          {
            position: { x: 120, y: 45 },
            issue: '缺少aria-label',
            suggestion: "添加 aria-label='保存用户资料'",
            priority: 'high',
            oneClickFix: '自动添加建议的aria-label'
          },
          {
            position: { x: 180, y: 45 },
            issue: '颜色对比度不足',
            suggestion: '调整背景色到#1890ff提高对比度',
            priority: 'high',
            oneClickFix: '自动调整颜色对比度'
          }
        ]
      },
      beforeAfter: {
        before: '/mdt-output/2025-07-29/button-before-fix.png',
        after: '/mdt-output/2025-07-29/button-after-fix.png'
      }
    }
  ];

  const applyOnClickFix = async (issue: VisualIssue) => {
    setApplyingFix(issue.id);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 2000));
      message.success(`已应用修复: ${issue.visualHighlight.annotations[0]?.oneClickFix}`);
    } catch (error) {
      message.error('应用修复失败');
    } finally {
      setApplyingFix(null);
    }
  };

  return (
    <Card 
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <EyeOutlined style={{ color: '#1890ff' }} />
          <span>可视化问题检测</span>
          <Tag color="blue">{visualIssues.length}个问题</Tag>
        </div>
      } 
      style={{ marginBottom: 24 }}
    >
      {visualIssues.map((issue) => (
        <div key={issue.id} className="visual-issue-item" style={{ marginBottom: 24 }}>
          <Row gutter={24}>
            {/* 问题截图标注 */}
            <Col span={12}>
              <div className="issue-screenshot-container">
                <div className="screenshot-header" style={{ marginBottom: 12 }}>
                  <Tag color={issue.priority === 'high' ? 'red' : 'orange'}>
                    {issue.priority} 优先级
                  </Tag>
                  <span style={{ fontWeight: 'bold' }}>{issue.title}</span>
                </div>
                
                {/* 截图展示区 */}
                <div className="screenshot-with-annotations" style={{ position: 'relative' }}>
                  <div style={{ 
                    width: '100%',
                    height: '200px',
                    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}>
                    {/* 根据问题类型展示不同的按钮状态 */}
                    {issue.title.includes('内边距') && (
                      <div style={{
                        position: 'relative',
                        display: 'inline-block'
                      }}>
                        <button style={{
                          background: '#FF9419',
                          padding: '8px 16px', // 实际的padding (错误)
                          borderRadius: '8px',
                          border: '1px solid #FF9419',
                          color: 'white',
                          height: '40px', // small size
                          fontSize: '14px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          fontFamily: 'Lato, "Open Sans", Helvetica, Arial, sans-serif',
                          letterSpacing: '0.02em'
                        }}>
                          保存资料
                        </button>
                        {/* 显示padding标注线 */}
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          border: '1px dashed #ff4d4f',
                          pointerEvents: 'none'
                        }}>
                          <div style={{
                            position: 'absolute',
                            top: '8px',
                            left: '16px',
                            right: '16px',
                            bottom: '8px',
                            border: '1px dashed #52c41a',
                          }} />
                        </div>
                      </div>
                    )}
                    
                    {issue.title.includes('颜色对比度') && (
                      <button style={{
                        background: '#DEDEDF', // gray-400
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '1px solid #DEDEDF',
                        color: '#9E9E9E', // gray-600 (低对比度)
                        height: '50px',
                        fontSize: '16px',
                        fontWeight: '700',
                        cursor: 'not-allowed',
                        opacity: 0.6,
                        fontFamily: 'Lato, "Open Sans", Helvetica, Arial, sans-serif',
                          letterSpacing: '0.02em'
                      }} disabled>
                        保存资料
                      </button>
                    )}
                    
                    {issue.title.includes('圆角') && (
                      <div style={{ display: 'flex', gap: 12 }}>
                        <button style={{
                          background: '#FF9419',
                          padding: '12px 16px',
                          borderRadius: '4px', // primary圆角
                          border: '1px solid #FF9419',
                          color: 'white',
                          height: '50px',
                          fontSize: '16px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          fontFamily: 'Lato, "Open Sans", Helvetica, Arial, sans-serif',
                          letterSpacing: '0.02em'
                        }}>
                          主要按钮
                        </button>
                        <button style={{
                          background: 'white',
                          padding: '12px 16px',
                          borderRadius: '2px', // 不一致的圆角
                          border: '1px solid #FF9419',
                          color: '#FF9419',
                          height: '50px',
                          fontSize: '16px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          fontFamily: 'Lato, "Open Sans", Helvetica, Arial, sans-serif',
                          letterSpacing: '0.02em'
                        }}>
                          次要按钮
                        </button>
                      </div>
                    )}
                    
                    {/* 问题标注点 */}
                    {issue.visualHighlight.annotations.map((annotation, i) => (
                      <div
                        key={i}
                        className="issue-annotation"
                        style={{
                          position: 'absolute',
                          left: annotation.position.x,
                          top: annotation.position.y,
                          width: '20px',
                          height: '20px',
                          background: '#ff4d4f',
                          borderRadius: '50%',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          cursor: 'pointer',
                          border: '2px solid white',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                          animation: 'pulse 2s infinite'
                        }}
                        onClick={() => setSelectedIssue(`${issue.id}-${i}`)}
                      >
                        !
                      </div>
                    ))}
                    
                    {/* 问题区域高亮 */}
                    {issue.visualHighlight.annotations.map((annotation, i) => (
                      <div
                        key={`highlight-${i}`}
                        className="issue-highlight"
                        style={{
                          position: 'absolute',
                          left: annotation.position.x - 20,
                          top: annotation.position.y - 10,
                          width: '60px',
                          height: '40px',
                          border: '2px dashed #ff4d4f',
                          borderRadius: '4px',
                          background: 'rgba(255, 77, 79, 0.1)',
                          pointerEvents: 'none'
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Col>
            
            {/* Before/After 对比 */}
            <Col span={12}>
              <div className="before-after-comparison">
                <div className="comparison-header" style={{ marginBottom: 12 }}>
                  <span style={{ fontWeight: 'bold' }}>修复效果预览</span>
                </div>
                
                <Row gutter={16}>
                  <Col span={12}>
                    <div className="comparison-item">
                      <div className="comparison-label" style={{ 
                        fontSize: '12px', 
                        color: '#ff4d4f', 
                        marginBottom: 8,
                        fontWeight: 'bold'
                      }}>
                        修复前
                      </div>
                      <div style={{ 
                        width: '100%',
                        height: '80px',
                        background: '#fff',
                        border: '2px solid #ff4d4f',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {issue.title.includes('内边距') && (
                          <button style={{
                            background: '#FF9419',
                            padding: '8px 16px', // 错误的padding
                            borderRadius: '8px',
                            border: '1px solid #FF9419',
                            color: 'white',
                            height: '40px',
                            fontSize: '14px',
                            fontWeight: '700',
                            cursor: 'pointer'
                          }}>
                            保存资料
                          </button>
                        )}
                        {issue.title.includes('颜色对比度') && (
                          <button style={{
                            background: '#f5f5f5',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: '1px solid #e8e8e8',
                            color: '#bfbfbf', // 低对比度
                            height: '50px',
                            fontSize: '16px',
                            fontWeight: '700',
                            cursor: 'not-allowed',
                            opacity: 0.6
                          }} disabled>
                            保存资料
                          </button>
                        )}
                        {issue.title.includes('圆角') && (
                          <button style={{
                            background: '#FF9419',
                            padding: '12px 16px',
                            borderRadius: '2px', // 错误的圆角
                            border: '1px solid #FF9419',
                            color: 'white',
                            height: '50px',
                            fontSize: '16px',
                            fontWeight: '500'
                          }}>
                            主要按钮
                          </button>
                        )}
                      </div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="comparison-item">
                      <div className="comparison-label" style={{ 
                        fontSize: '12px', 
                        color: '#52c41a', 
                        marginBottom: 8,
                        fontWeight: 'bold'
                      }}>
                        修复后
                      </div>
                      <div style={{ 
                        width: '100%',
                        height: '80px',
                        background: '#fff',
                        border: '2px solid #52c41a',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {issue.title.includes('内边距') && (
                          <button style={{
                            background: '#FF9419',
                            padding: '12px 24px', // 正确的padding (设计规范)
                            borderRadius: '8px',
                            border: '1px solid #FF9419',
                            color: 'white',
                            height: '50px',
                            fontSize: '16px',
                            fontWeight: '700',
                            cursor: 'pointer'
                          }}>
                            保存资料
                          </button>
                        )}
                        {issue.title.includes('颜色对比度') && (
                          <button style={{
                            background: '#DEDEDF', // gray-400
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: '1px solid #DEDEDF',
                            color: '#303030', // gray-800 (高对比度)
                            height: '50px',
                            fontSize: '16px',
                            fontWeight: '700',
                            cursor: 'not-allowed',
                            opacity: 0.8
                          }} disabled>
                            保存资料
                          </button>
                        )}
                        {issue.title.includes('圆角') && (
                          <button style={{
                            background: '#FF9419',
                            padding: '12px 16px',
                            borderRadius: '8px', // 统一的圆角 (设计规范)
                            border: '1px solid #FF9419',
                            color: 'white',
                            height: '50px',
                            fontSize: '16px',
                            fontWeight: '500'
                          }}>
                            主要按钮
                          </button>
                        )}
                      </div>
                    </div>
                  </Col>
                </Row>
                
                {/* 一键修复按钮 */}
                <div className="one-click-fix" style={{ marginTop: 16 }}>
                  <Button 
                    type="primary" 
                    icon={<BugOutlined />}
                    loading={applyingFix === issue.id}
                    onClick={() => applyOnClickFix(issue)}
                    style={{ marginRight: 8 }}
                  >
                    {issue.visualHighlight.annotations[0]?.oneClickFix}
                  </Button>
                  <span style={{ fontSize: '12px', color: '#666' }}>
                    预计修复时间: 30秒
                  </span>
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
            <div><strong>建议方案:</strong> {issue.suggestion}</div>
            <div><strong>影响范围:</strong> 影响{issue.affectedElements}个相关元素</div>
          </div>
        </div>
      ))}
      
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.8; }
            100% { transform: scale(1); opacity: 1; }
          }
        `
      }} />
    </Card>
  );
};

export default VisualIntelligenceSection;