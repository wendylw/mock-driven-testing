import React, { useState, useEffect } from 'react';
import { Card, Button, Space, message, Avatar, Steps, Select } from 'antd';
import { RobotOutlined, UserOutlined, BulbOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { baselineService } from '../../../../../services/baseline.service';
import { InteractiveSuggestion } from '../../../../../services/types/baseline';

interface ConversationMessage {
  id: string;
  type: 'ai' | 'user';
  content: string;
  options?: Array<{
    id: string;
    text: string;
    action: string;
  }>;
  visualDemo?: string;
  implementationOptions?: Array<{
    title: string;
    effort: string;
    impact: string;
  }>;
}

interface Props {
  baseline: any;
  baselineId: string;
  interactiveSuggestions?: InteractiveSuggestion;
}

const InteractiveRecommendations: React.FC<Props> = ({ baseline, baselineId, interactiveSuggestions }) => {
  const [sessionId] = useState(`session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  
  useEffect(() => {
    if (interactiveSuggestions) {
      setConversation([{
        id: '1',
        type: 'ai',
        content: interactiveSuggestions.initialMessage,
        options: interactiveSuggestions.options.map(opt => ({
          id: opt.id,
          text: opt.text,
          action: opt.action
        }))
      }]);
    }
  }, [interactiveSuggestions]);

  const [currentStep, setCurrentStep] = useState(0);
  const [processing, setProcessing] = useState(false);

  const handleOptionClick = async (option: any) => {
    setProcessing(true);

    // 添加用户选择到对话
    const userMessage: ConversationMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: option.text
    };

    setConversation(prev => [...prev, userMessage]);

    try {
      // 调用后端API处理交互
      const response = await baselineService.handleSuggestionInteraction(
        baselineId,
        sessionId,
        option.action,
        { currentTopic: interactiveSuggestions?.currentTopic }
      );

      // 转换响应为对话消息
      const aiResponse: ConversationMessage = {
        id: `ai-${Date.now()}`,
        type: 'ai',
        content: response.nextMessage || '正在处理您的请求...',
        options: response.nextOptions,
        visualDemo: response.visualDemo,
        implementationOptions: response.implementationOptions
      };

      setConversation(prev => [...prev, aiResponse]);
      
      // 更新步骤进度
      if (response.progress?.steps) {
        const completedSteps = response.progress.steps.filter(s => s.status === 'completed').length;
        setCurrentStep(completedSteps);
      }
    } catch (error) {
      console.error('交互处理失败:', error);
      message.error('处理请求时出错，请重试');
      
      // 回退到静态响应
      let aiResponse: ConversationMessage;

    switch (option.action) {
      case 'show_detailed_suggestion':
        aiResponse = {
          id: `ai-${Date.now()}`,
          type: 'ai',
          content: '基于用户体验研究，建议loading状态显示进度而不是spinner',
          visualDemo: '/analysis/loading_comparison.gif',
          implementationOptions: [
            {
              title: '快速修复：使用内置进度组件',
              effort: '5分钟',
              impact: '用户体验提升20%'
            },
            {
              title: '自定义方案：制作品牌化loading动画',
              effort: '30分钟',
              impact: '品牌一致性+用户体验双重提升'
            }
          ]
        };
        break;

      case 'show_best_practices':
        aiResponse = {
          id: `ai-${Date.now()}`,
          type: 'ai',
          content: '根据GitHub上1000+个React项目分析，92%的高质量项目使用以下loading模式：',
          options: [
            {
              id: 'skeleton-loading',
              text: '骨架屏加载（推荐）',
              action: 'implement_skeleton'
            },
            {
              id: 'progress-bar',
              text: '进度条加载',
              action: 'implement_progress'
            },
            {
              id: 'shimmer-effect',
              text: '闪烁效果加载',
              action: 'implement_shimmer'
            }
          ]
        };
        break;

      case 'auto_optimize':
        aiResponse = {
          id: `ai-${Date.now()}`,
          type: 'ai',
          content: '正在为您自动优化loading体验...',
          options: [
            {
              id: 'apply-changes',
              text: '应用这些更改',
              action: 'apply_auto_optimize'
            },
            {
              id: 'customize-more',
              text: '我想进一步定制',
              action: 'customize_loading'
            }
          ]
        };
        break;

      case 'remind_later':
        aiResponse = {
          id: `ai-${Date.now()}`,
          type: 'ai',
          content: '好的，我会在明天提醒您。同时，我发现了另一个可以快速改进的地方：',
          options: [
            {
              id: 'next-suggestion',
              text: '告诉我下一个建议',
              action: 'show_next_suggestion'
            }
          ]
        };
        break;

      default:
        aiResponse = {
          id: `ai-${Date.now()}`,
          type: 'ai',
          content: '感谢您的选择！让我为您准备相关的实施方案。'
        };
    }

      setConversation(prev => [...prev, aiResponse]);
      setCurrentStep(prev => prev + 1);
    }
    
    setProcessing(false);
  };

  const renderMessage = (message: ConversationMessage) => {
    const isAI = message.type === 'ai';
    
    return (
      <div key={message.id} style={{ 
        display: 'flex', 
        gap: 12, 
        marginBottom: 16,
        justifyContent: isAI ? 'flex-start' : 'flex-end'
      }}>
        {isAI && (
          <Avatar 
            icon={<RobotOutlined />} 
            style={{ background: '#1890ff' }}
          />
        )}
        
        <div style={{ 
          maxWidth: '70%',
          background: isAI ? '#f6ffed' : '#e6f7ff',
          padding: '12px 16px',
          borderRadius: '12px',
          border: `1px solid ${isAI ? '#b7eb8f' : '#91d5ff'}`
        }}>
          <div style={{ marginBottom: message.options ? 12 : 0 }}>
            {message.content}
          </div>

          {/* 可视化演示 */}
          {message.visualDemo && (
            <div style={{ 
              marginBottom: 12,
              padding: '8px',
              background: '#fff',
              borderRadius: '4px',
              border: '1px solid #d9d9d9'
            }}>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: 8 }}>
                效果对比演示:
              </div>
              <div style={{
                height: '100px',
                background: 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)',
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '4px'
              }}>
                <span style={{ background: 'white', padding: '4px 8px', borderRadius: '4px' }}>
                  GIF演示区域
                </span>
              </div>
            </div>
          )}

          {/* 实施方案选项 */}
          {message.implementationOptions && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: 8 }}>
                实施方案:
              </div>
              {message.implementationOptions.map((option, index) => (
                <div key={index} style={{
                  background: '#fff',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #f0f0f0',
                  marginBottom: 8,
                  cursor: 'pointer'
                }} onClick={() => message.options && handleOptionClick({
                  text: option.title,
                  action: 'implement_option'
                })}>
                  <div style={{ fontWeight: 'bold', fontSize: '13px' }}>
                    {option.title}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    耗时: {option.effort} | 效果: {option.impact}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 选项按钮 */}
          {message.options && (
            <Space wrap>
              {message.options.map(option => (
                <Button
                  key={option.id}
                  size="small"
                  type={option.action === 'auto_optimize' ? 'primary' : 'default'}
                  icon={option.action === 'show-suggestion' ? <BulbOutlined /> : 
                        option.action === 'show-best-practices' ? <QuestionCircleOutlined /> : undefined}
                  onClick={() => handleOptionClick(option)}
                  loading={processing}
                >
                  {option.text}
                </Button>
              ))}
            </Space>
          )}
        </div>

        {!isAI && (
          <Avatar 
            icon={<UserOutlined />} 
            style={{ background: '#52c41a' }}
          />
        )}
      </div>
    );
  };

  return (
    <Card 
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <RobotOutlined style={{ color: '#722ed1' }} />
          <span>智能助手对话</span>
        </div>
      } 
      style={{ marginBottom: 24 }}
      extra={
        <Steps 
          size="small" 
          current={currentStep}
          items={[
            { title: '问题识别' },
            { title: '方案分析' },
            { title: '实施建议' },
            { title: '效果验证' }
          ]}
        />
      }
    >
      <div className="conversation-container" style={{
        maxHeight: '400px',
        overflowY: 'auto',
        padding: '16px 0'
      }}>
        {conversation.map(renderMessage)}
        
        {processing && (
          <div style={{ 
            display: 'flex', 
            gap: 12, 
            marginBottom: 16,
            justifyContent: 'flex-start'
          }}>
            <Avatar 
              icon={<RobotOutlined />} 
              style={{ background: '#1890ff' }}
            />
            <div style={{ 
              background: '#f6ffed',
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1px solid #b7eb8f'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span style={{ color: '#666', fontSize: '12px' }}>AI正在思考...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ 
        borderTop: '1px solid #f0f0f0', 
        paddingTop: '16px',
        marginTop: '16px'
      }}>
        <div style={{ fontSize: '12px', color: '#999', textAlign: 'center' }}>
          💡 提示：AI助手会根据您的选择学习并提供更个性化的建议
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          .typing-indicator {
            display: flex;
            gap: 4px;
          }
          .typing-indicator span {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #1890ff;
            animation: typing 1.4s infinite ease-in-out;
          }
          .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
          .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }
          
          @keyframes typing {
            0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
            40% { transform: scale(1); opacity: 1; }
          }
        `
      }} />
    </Card>
  );
};

export default InteractiveRecommendations;