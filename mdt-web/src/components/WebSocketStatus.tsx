import React, { useState, useEffect } from 'react';
import { Badge, Tooltip } from 'antd';
import { WifiOutlined, DisconnectOutlined, LoadingOutlined } from '@ant-design/icons';
import { wsService } from '../services/websocket.service';

export const WebSocketStatus: React.FC = () => {
  const [status, setStatus] = useState(wsService.connectionState);
  
  useEffect(() => {
    // 监听WebSocket状态变化
    const checkStatus = () => {
      setStatus(wsService.connectionState);
    };
    
    // 每秒检查一次状态
    const interval = setInterval(checkStatus, 1000);
    
    // 订阅重连事件
    const unsubscribe = wsService.subscribe('reconnected', () => {
      setStatus('connected');
    });
    
    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);
  
  const getStatusConfig = () => {
    switch (status) {
      case 'connected':
        return {
          icon: <WifiOutlined />,
          color: '#52c41a',
          text: '实时更新已连接',
          badgeStatus: 'success' as const
        };
      case 'connecting':
        return {
          icon: <LoadingOutlined />,
          color: '#1890ff',
          text: '正在连接...',
          badgeStatus: 'processing' as const
        };
      case 'disconnected':
      case 'closed':
        return {
          icon: <DisconnectOutlined />,
          color: '#ff4d4f',
          text: '实时更新已断开',
          badgeStatus: 'error' as const
        };
      default:
        return {
          icon: <DisconnectOutlined />,
          color: '#d9d9d9',
          text: '未知状态',
          badgeStatus: 'default' as const
        };
    }
  };
  
  const config = getStatusConfig();
  
  return (
    <Tooltip title={config.text}>
      <div style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: 4,
        padding: '4px 8px',
        borderRadius: '4px',
        background: 'rgba(0,0,0,0.02)',
        cursor: 'pointer'
      }}>
        <Badge status={config.badgeStatus} />
        <span style={{ color: config.color, fontSize: 16 }}>
          {config.icon}
        </span>
      </div>
    </Tooltip>
  );
};