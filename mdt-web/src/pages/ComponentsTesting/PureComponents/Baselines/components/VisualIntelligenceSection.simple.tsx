import React from 'react';
import { Card, Row, Col, Tag } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

interface Props {
  baseline: any;
  baselineId: string;
  visualSuggestions?: any[];
}

const VisualIntelligenceSection: React.FC<Props> = ({ visualSuggestions = [] }) => {
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
      {visualSuggestions.map((issue) => (
        <div key={issue.id} style={{ marginBottom: 24 }}>
          <Row gutter={24}>
            {/* 问题展示 - 直接使用后端计算好的样式 */}
            <Col span={12}>
              <div>
                <Tag color={issue.severity === 'critical' ? 'red' : 'orange'}>
                  {issue.severity}
                </Tag>
                <span style={{ fontWeight: 'bold' }}>{issue.title}</span>
              </div>
              
              {/* 直接使用computedStyles渲染按钮 */}
              <div style={{ marginTop: 16, textAlign: 'center' }}>
                <button style={issue.computedStyles?.actual}>
                  保存资料
                </button>
              </div>
              
              {/* 显示设计系统信息 */}
              {issue.designTokens && (
                <div style={{ 
                  marginTop: 8, 
                  fontSize: '12px', 
                  background: '#f6ffed',
                  padding: '8px',
                  borderRadius: '4px'
                }}>
                  <div>字体: {issue.designTokens.fontFamily}</div>
                  <div>颜色: {issue.designTokens.colorPalette?.orange?.DEFAULT}</div>
                  <div>圆角: {issue.designTokens.borderRadius?.default}</div>
                </div>
              )}
            </Col>
            
            {/* 修复效果预览 */}
            <Col span={12}>
              <div style={{ textAlign: 'center' }}>
                <div>修复前</div>
                <button style={issue.computedStyles?.actual}>
                  保存资料
                </button>
              </div>
              
              <div style={{ textAlign: 'center', marginTop: 16 }}>
                <div>修复后</div>
                <button style={issue.computedStyles?.expected}>
                  保存资料
                </button>
              </div>
            </Col>
          </Row>
          
          {/* 问题详情 */}
          <div style={{ 
            marginTop: 16, 
            padding: '12px', 
            background: '#fafafa', 
            borderRadius: '4px'
          }}>
            <div>{issue.description}</div>
            {issue.visualDiff?.location && (
              <div>位置: {issue.visualDiff.location.file} 第{issue.visualDiff.location.line}行</div>
            )}
          </div>
        </div>
      ))}
    </Card>
  );
};

export default VisualIntelligenceSection;