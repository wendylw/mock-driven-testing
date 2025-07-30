import React, { useState } from 'react';
import { Row, Col, Card, List, Space, Badge, Tag, Alert, Radio, Statistic, Empty } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

interface ComponentAnalysis {
  name: string;
  path: string;
  branch: string;
  hasVisualChange: boolean;
  breakingChange: boolean;
  failedSnapshots: SnapshotComparison[];
  propChanges: PropChange[];
  riskLevel: 'low' | 'medium' | 'high';
  lastModified: Date;
  author: string;
}

interface SnapshotComparison {
  id: string;
  props: Record<string, any>;
  propsHash: string;
  propsDescription: string;
  baselineSnapshot: string;
  currentSnapshot: string;
  diffImage: string;
  diffPercentage: number;
  changedPixels: number;
  resolution: string;
  detectedAt: string;
  detectedChanges: ChangeDetail[];
  potentialImpact: string[];
  severity: 'minor' | 'moderate' | 'critical';
}

interface ChangeDetail {
  type: 'color' | 'size' | 'position' | 'content' | 'layout';
  description: string;
  area: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

interface PropChange {
  prop: string;
  type: 'added' | 'removed' | 'modified';
  oldValue?: any;
  newValue?: any;
  impact: 'breaking' | 'non-breaking';
}

interface ComponentVisualComparisonProps {
  components: ComponentAnalysis[];
}

const ComponentVisualComparison: React.FC<ComponentVisualComparisonProps> = ({ components }) => {
  const [selectedComponent, setSelectedComponent] = useState<ComponentAnalysis | undefined>(
    components?.[0]
  );
  const [selectedSnapshot, setSelectedSnapshot] = useState<string>();
  const [compareMode, setCompareMode] = useState<'side-by-side' | 'overlay' | 'diff-highlight'>('side-by-side');

  // 当组件选择变化时，自动选择第一个快照
  React.useEffect(() => {
    if (selectedComponent && selectedComponent.failedSnapshots.length > 0) {
      setSelectedSnapshot(selectedComponent.failedSnapshots[0].id);
    }
  }, [selectedComponent]);

  // 获取当前选中的快照数据
  const getCurrentSnapshot = (): SnapshotComparison | undefined => {
    return selectedComponent?.failedSnapshots?.find(s => s.id === selectedSnapshot);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return '#ff4d4f';
      case 'medium': return '#faad14';
      case 'low': return '#52c41a';
      default: return '#666';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'red';
      case 'moderate': return 'orange';
      case 'minor': return 'yellow';
      default: return 'default';
    }
  };

  if (!components || components.length === 0) {
    return (
      <Empty
        description="没有检测到组件变更"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  }

  const currentSnapshot = getCurrentSnapshot();

  return (
    <Row gutter={16}>
      {/* 左侧组件和快照列表 */}
      <Col span={6}>
        <Space direction="vertical" style={{ width: '100%' }} size={12}>
          {/* 组件选择 */}
          <Card  title="失败的组件" style={{ height: '300px', overflow: 'auto' }}>
            <List
              
              dataSource={components.filter(c => c.hasVisualChange)}
              renderItem={(component) => (
                <List.Item
                  onClick={() => setSelectedComponent(component)}
                  style={{ 
                    cursor: 'pointer',
                    backgroundColor: selectedComponent?.name === component.name ? '#fff2e8' : undefined,
                    borderLeft: component.breakingChange ? '3px solid #ff4d4f' : '3px solid transparent',
                    borderRadius: '4px',
                    margin: '4px 0',
                    padding: '8px'
                  }}
                >
                  <div style={{ width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Badge 
                        status={component.breakingChange ? 'error' : 'warning'} 
                        text={<span style={{ fontWeight: 'bold' }}>{component.name}</span>}
                      />
                      <Tag color={component.breakingChange ? 'red' : 'orange'}>
                        {component.failedSnapshots?.length || 0}
                      </Tag>
                    </div>
                    <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>
                      风险: <span style={{ color: getRiskColor(component.riskLevel) }}>
                        {component.riskLevel.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </Card>
          
          {/* 快照选择 */}
          {selectedComponent && (
            <Card  title="失败的快照" style={{ height: '350px', overflow: 'auto' }}>
              <List
                
                dataSource={selectedComponent.failedSnapshots}
                renderItem={(snapshot) => (
                  <List.Item
                    onClick={() => setSelectedSnapshot(snapshot.id)}
                    style={{ 
                      cursor: 'pointer',
                      backgroundColor: selectedSnapshot === snapshot.id ? '#e6f7ff' : undefined,
                      borderRadius: '4px',
                      margin: '4px 0',
                      padding: '6px'
                    }}
                  >
                    <div style={{ width: '100%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '12px' }}>
                          {snapshot.propsDescription}
                        </div>
                        <Tag color={getSeverityColor(snapshot.severity)}>
                          {snapshot.severity}
                        </Tag>
                      </div>
                      <div style={{ fontSize: '11px', color: '#666', marginTop: 4 }}>
                        差异: <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>
                          {snapshot.diffPercentage}%
                        </span>
                      </div>
                      <div style={{ fontSize: '10px', color: '#999', marginTop: 2 }}>
                        {snapshot.propsHash.substring(0, 8)}... • {snapshot.changedPixels.toLocaleString()} 像素
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            </Card>
          )}
        </Space>
      </Col>
      
      {/* 右侧快照对比视图 */}
      <Col span={18}>
        {selectedComponent && currentSnapshot ? (
          <div>
            {/* 对比模式切换 */}
            <Card  style={{ marginBottom: 16 }}>
              <Space>
                <span>对比模式:</span>
                <Radio.Group value={compareMode} onChange={e => setCompareMode(e.target.value)}>
                  <Radio.Button value="side-by-side">并排对比</Radio.Button>
                  <Radio.Button value="overlay">叠加对比</Radio.Button>
                  <Radio.Button value="diff-highlight">差异高亮</Radio.Button>
                </Radio.Group>
              </Space>
            </Card>
            
            {/* Props信息显示 */}
            <Card title="Props 详情"  style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>相同的Props输入:</div>
                  <pre style={{ 
                    background: '#f5f5f5', 
                    padding: '8px', 
                    fontSize: '11px',
                    borderRadius: '4px',
                    margin: 0,
                    maxHeight: '120px',
                    overflow: 'auto'
                  }}>
                    {JSON.stringify(currentSnapshot.props, null, 2)}
                  </pre>
                </Col>
                <Col span={12}>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>检测到的变化:</div>
                  <div>
                    {currentSnapshot.detectedChanges.map((change, index) => (
                      <Tag key={index} color="red" style={{ marginBottom: '2px', display: 'block' }}>
                        {change.type}: {change.description}
                      </Tag>
                    ))}
                  </div>
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#666' }}>影响范围:</div>
                    {currentSnapshot.potentialImpact.map((impact, index) => (
                      <Tag key={index} color="orange" style={{ marginTop: '2px' }}>
                        {impact}
                      </Tag>
                    ))}
                  </div>
                </Col>
              </Row>
            </Card>
            
            {/* 快照对比区域 */}
            {compareMode === 'side-by-side' && (
              <Row gutter={16}>
                <Col span={12}>
                  <Card 
                    title={
                      <Space>
                        <Badge status="success" />
                        <span>基准版本 (develop)</span>
                        <Tag color="green">正常</Tag>
                      </Space>
                    }
                    
                  >
                    <div style={{ textAlign: 'center', background: '#f9f9f9', padding: '16px', minHeight: '200px' }}>
                      <div style={{ 
                        background: '#fff', 
                        border: '2px solid #52c41a',
                        borderRadius: '8px',
                        padding: '16px',
                        display: 'inline-block'
                      }}>
                        {/* 模拟Button组件 */}
                        <div style={{
                          background: '#1890ff',
                          color: 'white',
                          padding: '8px 16px',
                          borderRadius: '4px',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: currentSnapshot.props.size === 'small' ? '12px' : '14px',
                          fontFamily: 'Lato, -apple-system, BlinkMacSystemFont, sans-serif'
                        }}>
                          {currentSnapshot.props.children || '按钮'}
                        </div>
                      </div>
                      <div style={{ marginTop: '8px', fontSize: '12px', color: '#52c41a' }}>
                        预期渲染结果
                      </div>
                    </div>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card 
                    title={
                      <Space>
                        <Badge status="error" />
                        <span>Feature分支 ({selectedComponent.branch})</span>
                        <Tag color="red">异常</Tag>
                      </Space>
                    }
                    
                  >
                    <div style={{ textAlign: 'center', background: '#fff2f0', padding: '16px', minHeight: '200px' }}>
                      <div style={{ 
                        background: '#fff', 
                        border: '2px solid #ff4d4f',
                        borderRadius: '8px',
                        padding: '16px',
                        display: 'inline-block'
                      }}>
                        {/* 模拟修改后的Button组件 */}
                        <div style={{
                          background: '#FF9419',  // BEEP的橙色
                          color: 'white',
                          padding: '8px 16px',
                          borderRadius: '4px',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: currentSnapshot.props.size === 'small' ? '12px' : '14px',
                          fontFamily: 'Lato, -apple-system, BlinkMacSystemFont, sans-serif'
                        }}>
                          {currentSnapshot.props.children || '按钮'}
                        </div>
                      </div>
                      <div style={{ marginTop: '8px', fontSize: '12px', color: '#ff4d4f' }}>
                        实际渲染结果 (与预期不符)
                      </div>
                    </div>
                  </Card>
                </Col>
              </Row>
            )}
            
            {compareMode === 'overlay' && (
              <Card title="叠加对比视图" >
                <div style={{ textAlign: 'center', background: '#fafafa', padding: '20px' }}>
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <div style={{ 
                      background: '#fff', 
                      border: '1px solid #d9d9d9',
                      borderRadius: '8px',
                      padding: '20px',
                      display: 'inline-block'
                    }}>
                      {/* 基准版本 */}
                      <div style={{
                        background: '#1890ff',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        position: 'relative',
                        fontSize: currentSnapshot.props.size === 'small' ? '12px' : '14px'
                      }}>
                        {currentSnapshot.props.children || '按钮'}
                      </div>
                      
                      {/* 叠加的变更版本 */}
                      <div style={{
                        position: 'absolute',
                        top: '20px',
                        left: '20px',
                        background: '#FF9419',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        opacity: 0.7,
                        mixBlendMode: 'difference',
                        fontSize: currentSnapshot.props.size === 'small' ? '12px' : '14px'
                      }}>
                        {currentSnapshot.props.children || '按钮'}
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: '12px', fontSize: '12px', color: '#666' }}>
                    重叠区域显示视觉差异（混合模式渲染）
                  </div>
                </div>
              </Card>
            )}
            
            {compareMode === 'diff-highlight' && (
              <Card title="差异高亮分析" >
                <Row gutter={16}>
                  <Col span={16}>
                    <div style={{ textAlign: 'center', background: '#fafafa', padding: '16px' }}>
                      <div style={{ 
                        background: '#fff', 
                        border: '1px solid #d9d9d9',
                        borderRadius: '8px',
                        padding: '20px',
                        display: 'inline-block',
                        position: 'relative'
                      }}>
                        {/* 差异高亮的按钮 */}
                        <div style={{
                          background: 'linear-gradient(45deg, #ff4d4f 25%, transparent 25%, transparent 75%, #ff4d4f 75%), linear-gradient(45deg, #ff4d4f 25%, transparent 25%, transparent 75%, #ff4d4f 75%)',
                          backgroundSize: '4px 4px',
                          backgroundPosition: '0 0, 2px 2px',
                          color: 'white',
                          padding: '8px 16px',
                          borderRadius: '4px',
                          fontSize: currentSnapshot.props.size === 'small' ? '12px' : '14px',
                          border: '2px solid #ff4d4f'
                        }}>
                          {currentSnapshot.props.children || '按钮'}
                        </div>
                        
                        {/* 差异标注 */}
                        <div style={{
                          position: 'absolute',
                          top: '-10px',
                          right: '-10px',
                          background: '#ff4d4f',
                          color: 'white',
                          fontSize: '10px',
                          padding: '2px 6px',
                          borderRadius: '10px'
                        }}>
                          颜色差异
                        </div>
                      </div>
                      <div style={{ marginTop: '8px', fontSize: '12px' }}>
                        <Tag color="red">红色区域</Tag>删除的像素 
                        <Tag color="green" style={{ marginLeft: 8 }}>绿色区域</Tag>新增的像素
                      </div>
                    </div>
                  </Col>
                  <Col span={8}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Statistic
                        title="视觉差异度"
                        value={currentSnapshot.diffPercentage}
                        suffix="%"
                        valueStyle={{ 
                          color: currentSnapshot.diffPercentage > 5 ? '#cf1322' : '#faad14' 
                        }}
                      />
                      <Statistic
                        title="变化像素数"
                        value={currentSnapshot.changedPixels}
                        formatter={value => `${value?.toLocaleString()}`}
                      />
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        <div>检测时间: {new Date(currentSnapshot.detectedAt).toLocaleString()}</div>
                        <div>分辨率: {currentSnapshot.resolution}</div>
                        <div>严重程度: <Tag color={getSeverityColor(currentSnapshot.severity)}>
                          {currentSnapshot.severity.toUpperCase()}
                        </Tag></div>
                      </div>
                    </Space>
                  </Col>
                </Row>
              </Card>
            )}
            
            {/* 影响分析和建议 */}
            <Card title="影响分析与建议"  style={{ marginTop: 16 }}>
              <Alert
                message={`${currentSnapshot.severity === 'critical' ? '严重' : ''}破坏性变更检测`}
                description={
                  <div>
                    <p style={{ margin: '8px 0' }}>
                      <strong>问题描述:</strong> 相同的props输入产生了不同的视觉输出，这可能会影响使用该组件的其他页面。
                    </p>
                    <p style={{ margin: '8px 0' }}>
                      <strong>变更详情:</strong> 
                      {currentSnapshot.detectedChanges.map((change, index) => (
                        <Tag key={index} color="red" style={{ margin: '2px' }}>
                          {change.description}
                        </Tag>
                      ))}
                    </p>
                    <p style={{ margin: '8px 0' }}>
                      <strong>潜在影响:</strong> 
                      {currentSnapshot.potentialImpact.map((impact, index) => (
                        <Tag key={index} color="orange" style={{ margin: '2px' }}>{impact}</Tag>
                      ))}
                    </p>
                    <p style={{ margin: '8px 0' }}>
                      <strong>建议操作:</strong>
                    </p>
                    <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                      <li>检查组件CSS样式是否有意外更改</li>
                      <li>确认这是否为预期的视觉更新（如品牌色调整）</li>
                      <li>如果是预期变更，需要更新基准快照</li>
                      <li>通知相关页面的维护者检查兼容性</li>
                      <li>考虑在不同环境中测试影响范围</li>
                    </ul>
                  </div>
                }
                type={currentSnapshot.severity === 'critical' ? 'error' : 'warning'}
                showIcon
                style={{ marginTop: 16 }}
              />
            </Card>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
            <InfoCircleOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
            <h3>请选择组件和快照进行对比</h3>
            <p>从左侧列表中选择一个失败的组件，然后选择具体的快照进行详细对比分析</p>
          </div>
        )}
      </Col>
    </Row>
  );
};

export default ComponentVisualComparison;