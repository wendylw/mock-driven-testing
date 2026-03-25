import React, { useState, useEffect } from 'react';
import { Modal, Progress, Steps, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import BaselineApiService from '../services/baselineApi';
import { wsService } from '../services/websocket.service';

interface Props {
  analysisId: string;
  visible: boolean;
  onComplete: () => void;
  onClose: () => void;
}

export const AnalysisProgress: React.FC<Props> = ({ 
  analysisId, 
  visible, 
  onComplete,
  onClose 
}) => {
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!visible || !analysisId) return;
    
    // 先获取一次初始进度
    const fetchInitialProgress = async () => {
      try {
        const response = await BaselineApiService.getAnalysisProgress(analysisId);
        if (response.success) {
          setProgress(response.data);
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to get initial analysis progress:', error);
      }
    };
    
    fetchInitialProgress();
    
    // 订阅WebSocket进度更新
    const unsubscribe = wsService.subscribeToAnalysisProgress(analysisId, (data) => {
      console.log('Analysis progress update:', data);
      
      if (data.type === 'analysis-progress') {
        setProgress({
          analysisId: data.analysisId,
          ...data
        });
        setLoading(false);
      } else if (data.type === 'analysis-complete') {
        setProgress(prev => ({
          ...prev,
          status: 'completed',
          progress: 100
        }));
        message.success('分析完成！');
        setTimeout(() => {
          onComplete();
        }, 1000);
      }
    });
    
    // 如果WebSocket未连接，降级到轮询
    let pollInterval: NodeJS.Timeout | null = null;
    if (!wsService.isConnected) {
      console.log('WebSocket not connected, falling back to polling');
      pollInterval = setInterval(async () => {
        try {
          const response = await BaselineApiService.getAnalysisProgress(analysisId);
          if (response.success) {
            setProgress(response.data);
            setLoading(false);
            
            if (response.data.status === 'completed') {
              clearInterval(pollInterval!);
              message.success('分析完成！');
              setTimeout(() => {
                onComplete();
              }, 1000);
            } else if (response.data.status === 'failed') {
              clearInterval(pollInterval!);
              message.error('分析失败：' + response.data.error);
              setTimeout(() => {
                onClose();
              }, 2000);
            }
          }
        } catch (error) {
          console.error('Failed to get analysis progress:', error);
        }
      }, 2000);
    }
    
    return () => {
      unsubscribe();
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [analysisId, visible, onComplete, onClose]);
  
  if (!progress || loading) {
    return (
      <Modal
        title="正在准备分析..."
        visible={visible}
        footer={null}
        closable={false}
        width={600}
      >
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <LoadingOutlined style={{ fontSize: 48, color: '#1890ff' }} />
          <div style={{ marginTop: 16, fontSize: 16 }}>正在初始化分析任务...</div>
        </div>
      </Modal>
    );
  }
  
  // 构建步骤数据
  const allSteps = [
    ...progress.completedSteps,
    ...(progress.currentStep && !progress.completedSteps.includes(progress.currentStep) 
      ? [progress.currentStep] : []),
    ...progress.remainingSteps
  ];
  
  const currentStepIndex = progress.completedSteps.length;
  
  return (
    <Modal
      title="正在分析组件"
      visible={visible}
      footer={null}
      closable={false}
      width={700}
    >
      <div style={{ padding: '20px 0' }}>
        {/* 总体进度条 */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 16, fontWeight: 'bold' }}>
              总体进度
            </span>
            <span style={{ color: '#1890ff' }}>
              {progress.progress}%
            </span>
          </div>
          <Progress 
            percent={progress.progress} 
            status={progress.status === 'processing' ? 'active' : 
                   progress.status === 'completed' ? 'success' : 
                   progress.status === 'failed' ? 'exception' : 'normal'}
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
          />
        </div>
        
        {/* 分析步骤 */}
        <Steps
          current={currentStepIndex}
          direction="vertical"
          size="small"
          items={allSteps.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const isPending = index > currentStepIndex;
            
            return {
              title: step,
              status: isCompleted ? 'finish' : 
                     isCurrent ? 'process' : 
                     'wait',
              icon: isCurrent ? <LoadingOutlined /> : undefined,
              description: isCurrent ? '正在处理...' : 
                          isCompleted ? '已完成' : 
                          '等待中'
            };
          })}
        />
        
        {/* 预计剩余时间 */}
        {progress.estimatedTime && progress.status === 'processing' && (
          <div style={{ 
            marginTop: 24, 
            padding: '12px',
            background: '#f0f2f5',
            borderRadius: '6px',
            textAlign: 'center'
          }}>
            <span style={{ color: '#666' }}>
              预计剩余时间：约 {Math.ceil((progress.estimatedTime * (100 - progress.progress) / 100))} 秒
            </span>
          </div>
        )}
        
        {/* 当前步骤提示 */}
        <div style={{ 
          marginTop: 16,
          textAlign: 'center',
          color: '#666',
          fontSize: '14px'
        }}>
          {progress.status === 'processing' && (
            <>当前步骤：{progress.currentStep}</>
          )}
          {progress.status === 'completed' && (
            <span style={{ color: '#52c41a' }}>✅ 分析已完成</span>
          )}
          {progress.status === 'failed' && (
            <span style={{ color: '#ff4d4f' }}>❌ 分析失败</span>
          )}
        </div>
      </div>
    </Modal>
  );
};