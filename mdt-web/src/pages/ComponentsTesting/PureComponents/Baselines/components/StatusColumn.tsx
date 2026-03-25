import React from 'react';
import { Space, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { calculateIntelligentStatus } from '../utils/statusCalculator';
import { BaselineInfo } from '../types';

interface Props {
  baseline: BaselineInfo;
}

const StatusColumn: React.FC<Props> = ({ baseline }) => {
  const intelligentStatus = calculateIntelligentStatus(baseline);
  
  // 获取状态颜色 - 与行主色保持一致
  const getStatusColor = (type: string) => {
    switch (type) {
      case 'healthy': return '#52c41a';     // 绿色 - 健康
      case 'outdated': return '#faad14';    // 橙色 - 过时
      case 'corrupted': return '#ff4d4f';   // 红色 - 损坏
      case 'deleted': return '#ff4d4f';     // 红色 - 已删除（合并到损坏色）
      case 'unstable': return '#fa8c16';    // 橙红色 - 不稳定
      case 'drifting': return '#1890ff';    // 蓝色 - 渐变中
      case 'optimizable': return '#52c41a'; // 绿色 - 可优化（归为绿色）
      case 'deprecated': return '#d9d9d9';  // 灰色 - 已弃用
      default: return '#666';
    }
  };
  
  // 需要解释图标的状态：不稳定、渐变中、可优化、损坏、过时、已删除、已弃用
  const needsExplanation = ['unstable', 'drifting', 'optimizable', 'corrupted', 'outdated', 'deleted', 'deprecated'].includes(intelligentStatus.type);
  
  return (
    <Space size={4}>
      <span 
        style={{ 
          color: getStatusColor(intelligentStatus.type),
          fontSize: '12px',
          fontWeight: 500
        }}
      >
        {intelligentStatus.label}
      </span>
      
      {needsExplanation && intelligentStatus.hasDetail && (
        <Tooltip 
          title={
            <div style={{ maxWidth: 300 }}>
              <strong>{intelligentStatus.detailTitle}</strong>
              <div style={{ marginTop: 4, fontSize: '12px' }}>
                {intelligentStatus.detailMessage}
              </div>
            </div>
          }
          placement="left"
        >
          <InfoCircleOutlined 
            style={{ 
              color: getStatusColor(intelligentStatus.type), 
              cursor: 'pointer',
              fontSize: '12px' 
            }} 
          />
        </Tooltip>
      )}
    </Space>
  );
};

export default StatusColumn;