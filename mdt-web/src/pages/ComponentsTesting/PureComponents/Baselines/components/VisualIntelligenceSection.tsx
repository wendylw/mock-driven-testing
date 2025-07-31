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
  const visualIssues: VisualIssue[] = visualSuggestions.map(suggestion => ({
    id: suggestion.id,
    type: suggestion.type,
    title: suggestion.title,
    priority: suggestion.priority,
    description: suggestion.description,
    suggestion: suggestion.visualEvidence.annotations[0]?.suggestion || '',
    affectedElements: suggestion.affectedElements,
    visualHighlight: {
      screenshot: suggestion.visualEvidence.screenshotUrl,
      annotations: suggestion.visualEvidence.annotations.map(ann => ({
        position: ann.position,
        issue: ann.issue,
        suggestion: ann.suggestion,
        priority: suggestion.priority,
        oneClickFix: ann.oneClickFix
      }))
    },
    beforeAfter: suggestion.beforeAfter ? {
      before: suggestion.beforeAfter.beforeUrl,
      after: suggestion.beforeAfter.afterUrl
    } : {
      before: '',
      after: ''
    }
  }));
  
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
                    {/* 模拟Button组件 */}
                    <div style={{
                      background: '#f0f0f0',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      border: '1px solid #d9d9d9',
                      color: '#666'
                    }}>
                      Save Profile
                    </div>
                    
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
                        <div style={{
                          background: '#f0f0f0',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          color: '#666',
                          fontSize: '12px'
                        }}>
                          Save Profile
                        </div>
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
                        <div style={{
                          background: '#1890ff',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          color: 'white',
                          fontSize: '12px'
                        }}>
                          Save Profile
                        </div>
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