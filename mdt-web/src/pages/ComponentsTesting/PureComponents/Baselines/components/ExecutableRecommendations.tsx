import React, { useState } from 'react';
import { Card, Row, Col, Tag, Button, Space, message } from 'antd';
import { 
  CodeOutlined, 
  ThunderboltOutlined, 
  CopyOutlined, 
  FolderOpenOutlined, 
  PlayCircleOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined
} from '@ant-design/icons';

interface CodeRecommendation {
  id: string;
  issue: string;
  impact: string;
  reasoning: string;
  benefits: string[];
  autoFix: {
    title: string;
    preview: string;
    finalCode: string;
    steps: string[];
    expectedImprovement: string;
  };
  filePath?: string;
}

interface Props {
  baseline: any;
}

const ExecutableRecommendations: React.FC<Props> = ({ baseline }) => {
  const [expandedRec, setExpandedRec] = useState<string | null>(null);
  const [applyingFix, setApplyingFix] = useState<string | null>(null);
  
  const recommendations: CodeRecommendation[] = [
    {
      id: 'memo-optimization',
      issue: 'Button组件重复渲染',
      impact: '性能降低15%',
      reasoning: '当前组件在父组件重渲染时会无条件重渲染，使用React.memo可以避免props未变化时的重渲染',
      benefits: [
        '渲染性能提升15%', 
        '重渲染次数减少60%',
        '降低CPU使用率'
      ],
      autoFix: {
        title: '一键优化：添加React.memo',
        preview: `// 当前代码
- export const Button = ({type, children, onClick}) => {
-   return (
-     <button className={\`btn btn-\${type}\`} onClick={onClick}>
-       {children}
-     </button>
-   );
- };

// 优化后代码  
+ export const Button = React.memo(({type, children, onClick}) => {
+   return (
+     <button className={\`btn btn-\${type}\`} onClick={onClick}>
+       {children}
+     </button>
+   );
+ }, (prevProps, nextProps) => {
+   return prevProps.type === nextProps.type && 
+          prevProps.children === nextProps.children;
+ });`,
        finalCode: `export const Button = React.memo(({type, children, onClick}) => {
  return (
    <button className={\`btn btn-\${type}\`} onClick={onClick}>
      {children}
    </button>
  );
}, (prevProps, nextProps) => {
  return prevProps.type === nextProps.type && 
         prevProps.children === nextProps.children;
});`,
        steps: [
          '导入React.memo',
          '包装组件导出',
          '添加props比较函数',
          '验证渲染优化效果'
        ],
        expectedImprovement: '渲染性能提升15%，重渲染次数减少60%'
      },
      filePath: 'src/components/Button/index.tsx'
    }
  ];

  const applyAutoFix = async (recommendation: CodeRecommendation) => {
    setApplyingFix(recommendation.id);
    try {
      // 模拟AST转换API调用
      await new Promise(resolve => setTimeout(resolve, 3000));
      message.success(`已应用修复: ${recommendation.autoFix.title}`);
    } catch (error) {
      message.error('应用修复失败');
    } finally {
      setApplyingFix(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      message.success('代码已复制到剪贴板');
    });
  };

  const openInVSCode = (filePath: string) => {
    message.info(`正在VS Code中打开: ${filePath}`);
  };

  const previewChanges = (recommendation: CodeRecommendation) => {
    message.info('正在生成预览...');
  };

  const renderCodeDiff = (preview: string) => {
    const lines = preview.split('\n');
    const currentCode = lines.filter(line => line.startsWith('- ')).map(line => line.substring(2)).join('\n');
    const suggestedCode = lines.filter(line => line.startsWith('+ ')).map(line => line.substring(2)).join('\n');
    
    return (
      <Row gutter={16}>
        <Col span={12}>
          <div className="code-diff-panel">
            <div className="diff-header" style={{ 
              background: '#fff2f0', 
              padding: '8px 12px', 
              borderRadius: '4px 4px 0 0',
              border: '1px solid #ffccc7',
              borderBottom: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <MinusCircleOutlined style={{ color: '#ff4d4f' }} />
              <span style={{ fontWeight: 'bold' }}>当前代码</span>
            </div>
            <pre style={{ 
              background: '#fafafa',
              padding: '12px',
              margin: 0,
              fontSize: '12px',
              fontFamily: '"Fira Code", "Monaco", "Consolas", monospace',
              border: '1px solid #ffccc7',
              borderRadius: '0 0 4px 4px',
              overflow: 'auto',
              minHeight: '200px'
            }}>
              {currentCode}
            </pre>
          </div>
        </Col>
        
        <Col span={12}>
          <div className="code-diff-panel">
            <div className="diff-header" style={{ 
              background: '#f6ffed', 
              padding: '8px 12px', 
              borderRadius: '4px 4px 0 0',
              border: '1px solid #b7eb8f',
              borderBottom: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <PlusCircleOutlined style={{ color: '#52c41a' }} />
              <span style={{ fontWeight: 'bold' }}>建议代码</span>
            </div>
            <pre style={{ 
              background: '#fafafa',
              padding: '12px',
              margin: 0,
              fontSize: '12px',
              fontFamily: '"Fira Code", "Monaco", "Consolas", monospace',
              border: '1px solid #b7eb8f',
              borderRadius: '0 0 4px 4px',
              overflow: 'auto',
              minHeight: '200px'
            }}>
              {suggestedCode}
            </pre>
          </div>
        </Col>
      </Row>
    );
  };

  return (
    <Card 
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <CodeOutlined style={{ color: '#52c41a' }} />
          <span>可执行代码建议</span>
          <Tag color="green">{recommendations.length}个建议</Tag>
        </div>
      } 
      style={{ marginBottom: 24 }}
    >
      {recommendations.map((rec) => (
        <Card
          key={rec.id}
          size="small"
          style={{ marginBottom: 16 }}
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Tag color="red">高影响</Tag>
                <span>{rec.autoFix.title}</span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button 
                  size="small"
                  type={expandedRec === rec.id ? "default" : "primary"}
                  ghost
                  onClick={() => setExpandedRec(expandedRec === rec.id ? null : rec.id)}
                >
                  {expandedRec === rec.id ? '收起' : '查看代码'}
                </Button>
                <Button 
                  size="small"
                  type="primary"
                  loading={applyingFix === rec.id}
                  icon={<ThunderboltOutlined />}
                  onClick={() => applyAutoFix(rec)}
                >
                  一键修复
                </Button>
              </div>
            </div>
          }
        >
          {/* 问题描述和影响 */}
          <div className="recommendation-overview" style={{ marginBottom: 12 }}>
            <div><strong>问题:</strong> {rec.issue}</div>
            <div><strong>性能影响:</strong> <span style={{ color: '#ff4d4f' }}>{rec.impact}</span></div>
            <div><strong>预期改进:</strong> <span style={{ color: '#52c41a' }}>{rec.autoFix.expectedImprovement}</span></div>
          </div>
          
          {expandedRec === rec.id && (
            <div className="code-diff-section">
              {/* 代码对比展示 */}
              <div style={{ marginBottom: 16 }}>
                {renderCodeDiff(rec.autoFix.preview)}
              </div>
              
              {/* 详细的修复说明 */}
              <div className="fix-explanation" style={{ 
                background: '#f6ffed', 
                padding: '12px', 
                borderRadius: '6px',
                border: '1px solid #b7eb8f',
                marginBottom: 16
              }}>
                <div><strong>为什么需要这个修复:</strong></div>
                <p style={{ marginBottom: 8 }}>{rec.reasoning}</p>
                
                <div><strong>具体修复步骤:</strong></div>
                <ol style={{ marginBottom: 12 }}>
                  {rec.autoFix.steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
                
                <div><strong>预期效果:</strong></div>
                <ul style={{ marginBottom: 0 }}>
                  {rec.benefits.map((benefit, i) => (
                    <li key={i} style={{ color: '#52c41a' }}>{benefit}</li>
                  ))}
                </ul>
              </div>
              
              {/* 操作按钮组 */}
              <div className="action-buttons" style={{ textAlign: 'right' }}>
                <Space>
                  <Button 
                    size="small"
                    icon={<CopyOutlined />}
                    onClick={() => copyToClipboard(rec.autoFix.finalCode)}
                  >
                    复制修复代码
                  </Button>
                  <Button 
                    size="small"
                    icon={<FolderOpenOutlined />}
                    onClick={() => openInVSCode(rec.filePath || '')}
                  >
                    在VS Code中打开
                  </Button>
                  <Button 
                    size="small"
                    icon={<PlayCircleOutlined />}
                    onClick={() => previewChanges(rec)}
                  >
                    预览修改效果
                  </Button>
                </Space>
              </div>
            </div>
          )}
        </Card>
      ))}
    </Card>
  );
};

export default ExecutableRecommendations;