import { message } from 'antd';

type MessageHandler = (data: any) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private pingTimer: NodeJS.Timeout | null = null;
  private subscribers = new Map<string, Set<MessageHandler>>();
  private isConnecting = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000; // 3 seconds

  /**
   * 连接到WebSocket服务器
   */
  connect() {
    if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) {
      return;
    }

    this.isConnecting = true;
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3000/ws';
    
    console.log('Connecting to WebSocket:', wsUrl);
    
    try {
      this.ws = new WebSocket(wsUrl);
      
      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        
        // 认证
        this.authenticate();
        
        // 开始心跳
        this.startHeartbeat();
        
        // 触发重连成功事件
        this.notifySubscribers('reconnected', {});
      };
      
      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };
      
      this.ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        this.isConnecting = false;
        this.stopHeartbeat();
        
        // 尝试重连
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.scheduleReconnect();
        } else {
          message.error('无法连接到实时更新服务，请刷新页面重试');
        }
      };
      
      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.isConnecting = false;
      };
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      this.isConnecting = false;
      this.scheduleReconnect();
    }
  }

  /**
   * 断开连接
   */
  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    
    this.stopHeartbeat();
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  /**
   * 发送认证信息
   */
  private authenticate() {
    const token = localStorage.getItem('auth_token');
    if (token && this.ws?.readyState === WebSocket.OPEN) {
      this.send({
        type: 'auth',
        token
      });
    }
  }

  /**
   * 发送消息
   */
  private send(data: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  /**
   * 处理接收到的消息
   */
  private handleMessage(message: any) {
    console.log('WebSocket message received:', message);
    
    switch (message.type) {
      case 'connected':
        console.log('WebSocket connection confirmed:', message.clientId);
        break;
        
      case 'auth-success':
        console.log('WebSocket authenticated');
        break;
        
      case 'auth-failed':
        console.error('WebSocket authentication failed');
        break;
        
      case 'subscribed':
        console.log('Subscribed to topic:', message.topic);
        break;
        
      case 'broadcast':
        this.handleBroadcast(message);
        break;
        
      case 'pong':
        // 心跳响应
        break;
        
      default:
        console.warn('Unknown message type:', message.type);
    }
  }

  /**
   * 处理广播消息
   */
  private handleBroadcast(message: any) {
    const { topic, data } = message;
    
    // 通知该主题的所有订阅者
    this.notifySubscribers(topic, data);
    
    // 处理特定类型的广播
    switch (data.type) {
      case 'analysis-progress':
        this.notifySubscribers('analysis-progress', data);
        break;
        
      case 'analysis-complete':
        this.notifySubscribers('analysis-complete', data);
        break;
        
      case 'baseline-updated':
        this.notifySubscribers('baseline-updated', data);
        break;
    }
  }

  /**
   * 订阅主题
   */
  subscribe(topic: string, handler: MessageHandler): () => void {
    // 添加到本地订阅列表
    if (!this.subscribers.has(topic)) {
      this.subscribers.set(topic, new Set());
    }
    this.subscribers.get(topic)!.add(handler);
    
    // 向服务器发送订阅请求
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.send({
        type: 'subscribe',
        topic
      });
    }
    
    // 返回取消订阅函数
    return () => {
      this.unsubscribe(topic, handler);
    };
  }

  /**
   * 取消订阅
   */
  private unsubscribe(topic: string, handler: MessageHandler) {
    const handlers = this.subscribers.get(topic);
    if (handlers) {
      handlers.delete(handler);
      
      // 如果没有其他订阅者，向服务器发送取消订阅请求
      if (handlers.size === 0) {
        this.subscribers.delete(topic);
        if (this.ws?.readyState === WebSocket.OPEN) {
          this.send({
            type: 'unsubscribe',
            topic
          });
        }
      }
    }
  }

  /**
   * 订阅分析进度更新
   */
  subscribeToAnalysisProgress(analysisId: string, handler: MessageHandler): () => void {
    return this.subscribe(`analysis:${analysisId}`, handler);
  }

  /**
   * 订阅基准更新
   */
  subscribeToBaselineUpdates(baselineId: string, handler: MessageHandler): () => void {
    return this.subscribe(`baseline:${baselineId}`, handler);
  }

  /**
   * 通知订阅者
   */
  private notifySubscribers(topic: string, data: any) {
    const handlers = this.subscribers.get(topic);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error('Error in message handler:', error);
        }
      });
    }
  }

  /**
   * 开始心跳
   */
  private startHeartbeat() {
    this.stopHeartbeat();
    
    this.pingTimer = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.send({ type: 'ping' });
      }
    }, 30000); // 30秒一次
  }

  /**
   * 停止心跳
   */
  private stopHeartbeat() {
    if (this.pingTimer) {
      clearInterval(this.pingTimer);
      this.pingTimer = null;
    }
  }

  /**
   * 计划重连
   */
  private scheduleReconnect() {
    if (this.reconnectTimer) return;
    
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.min(this.reconnectAttempts, 3);
    
    console.log(`Scheduling reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, delay);
  }

  /**
   * 获取连接状态
   */
  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  /**
   * 获取连接状态文本
   */
  get connectionState(): string {
    if (!this.ws) return 'disconnected';
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting';
      case WebSocket.OPEN:
        return 'connected';
      case WebSocket.CLOSING:
        return 'closing';
      case WebSocket.CLOSED:
        return 'closed';
      default:
        return 'unknown';
    }
  }
}

// 导出单例
export const wsService = new WebSocketService();

// 自动连接（在应用启动时）
if (typeof window !== 'undefined') {
  wsService.connect();
  
  // 页面可见性变化时重连
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && !wsService.isConnected) {
      wsService.connect();
    }
  });
  
  // 在线/离线状态变化时重连
  window.addEventListener('online', () => {
    if (!wsService.isConnected) {
      wsService.connect();
    }
  });
}