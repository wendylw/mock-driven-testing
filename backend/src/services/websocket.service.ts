import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';

interface WSClient {
  id: string;
  ws: WebSocket;
  userId?: string;
  subscriptions: Set<string>;
}

export class WebSocketService {
  private wss: WebSocketServer | null = null;
  private clients: Map<string, WSClient> = new Map();
  private subscriptions: Map<string, Set<string>> = new Map(); // topic -> clientIds

  /**
   * 初始化WebSocket服务器
   */
  initialize(server: Server) {
    this.wss = new WebSocketServer({ 
      server,
      path: '/ws',
      verifyClient: (info, cb) => {
        // 可以在这里添加额外的验证逻辑
        cb(true);
      }
    });

    this.wss.on('connection', (ws, req) => {
      const clientId = this.generateClientId();
      const client: WSClient = {
        id: clientId,
        ws,
        subscriptions: new Set()
      };

      this.clients.set(clientId, client);
      logger.info(`WebSocket client connected: ${clientId}`);

      // 发送欢迎消息
      this.sendToClient(clientId, {
        type: 'connected',
        clientId,
        message: 'WebSocket连接成功'
      });

      // 处理客户端消息
      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleClientMessage(clientId, message);
        } catch (error) {
          logger.error('Failed to parse WebSocket message:', error);
          this.sendToClient(clientId, {
            type: 'error',
            message: '消息格式错误'
          });
        }
      });

      // 处理连接关闭
      ws.on('close', () => {
        this.handleClientDisconnect(clientId);
      });

      // 处理错误
      ws.on('error', (error) => {
        logger.error(`WebSocket error for client ${clientId}:`, error);
      });

      // 心跳检测
      const pingInterval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.ping();
        } else {
          clearInterval(pingInterval);
        }
      }, 30000); // 30秒一次心跳
    });

    logger.info('WebSocket server initialized');
  }

  /**
   * 处理客户端消息
   */
  private handleClientMessage(clientId: string, message: any) {
    const client = this.clients.get(clientId);
    if (!client) return;

    switch (message.type) {
      case 'auth':
        this.handleAuth(clientId, message.token);
        break;
      
      case 'subscribe':
        this.handleSubscribe(clientId, message.topic);
        break;
      
      case 'unsubscribe':
        this.handleUnsubscribe(clientId, message.topic);
        break;
      
      case 'ping':
        this.sendToClient(clientId, { type: 'pong' });
        break;
      
      default:
        logger.warn(`Unknown message type: ${message.type}`);
    }
  }

  /**
   * 处理认证
   */
  private handleAuth(clientId: string, token: string) {
    const client = this.clients.get(clientId);
    if (!client) return;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret') as any;
      client.userId = decoded.userId;
      
      this.sendToClient(clientId, {
        type: 'auth-success',
        userId: decoded.userId
      });
      
      logger.info(`Client ${clientId} authenticated as user ${decoded.userId}`);
    } catch (error) {
      this.sendToClient(clientId, {
        type: 'auth-failed',
        message: '认证失败'
      });
    }
  }

  /**
   * 处理订阅
   */
  private handleSubscribe(clientId: string, topic: string) {
    const client = this.clients.get(clientId);
    if (!client) return;

    // 添加到客户端的订阅列表
    client.subscriptions.add(topic);

    // 添加到主题的订阅者列表
    if (!this.subscriptions.has(topic)) {
      this.subscriptions.set(topic, new Set());
    }
    this.subscriptions.get(topic)!.add(clientId);

    this.sendToClient(clientId, {
      type: 'subscribed',
      topic
    });

    logger.info(`Client ${clientId} subscribed to ${topic}`);
  }

  /**
   * 处理取消订阅
   */
  private handleUnsubscribe(clientId: string, topic: string) {
    const client = this.clients.get(clientId);
    if (!client) return;

    // 从客户端的订阅列表移除
    client.subscriptions.delete(topic);

    // 从主题的订阅者列表移除
    const subscribers = this.subscriptions.get(topic);
    if (subscribers) {
      subscribers.delete(clientId);
      if (subscribers.size === 0) {
        this.subscriptions.delete(topic);
      }
    }

    this.sendToClient(clientId, {
      type: 'unsubscribed',
      topic
    });
  }

  /**
   * 处理客户端断开连接
   */
  private handleClientDisconnect(clientId: string) {
    const client = this.clients.get(clientId);
    if (!client) return;

    // 清理所有订阅
    client.subscriptions.forEach(topic => {
      const subscribers = this.subscriptions.get(topic);
      if (subscribers) {
        subscribers.delete(clientId);
        if (subscribers.size === 0) {
          this.subscriptions.delete(topic);
        }
      }
    });

    // 移除客户端
    this.clients.delete(clientId);
    logger.info(`WebSocket client disconnected: ${clientId}`);
  }

  /**
   * 发送消息给特定客户端
   */
  private sendToClient(clientId: string, data: any) {
    const client = this.clients.get(clientId);
    if (client && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(data));
    }
  }

  /**
   * 广播消息给订阅特定主题的所有客户端
   */
  broadcast(topic: string, data: any) {
    const subscribers = this.subscriptions.get(topic);
    if (!subscribers) return;

    const message = {
      type: 'broadcast',
      topic,
      data,
      timestamp: new Date().toISOString()
    };

    subscribers.forEach(clientId => {
      this.sendToClient(clientId, message);
    });

    logger.info(`Broadcasted to ${subscribers.size} clients on topic ${topic}`);
  }

  /**
   * 发送消息给特定用户
   */
  sendToUser(userId: string, data: any) {
    let sent = 0;
    this.clients.forEach(client => {
      if (client.userId === userId) {
        this.sendToClient(client.id, data);
        sent++;
      }
    });

    if (sent > 0) {
      logger.info(`Sent message to ${sent} connections for user ${userId}`);
    }
  }

  /**
   * 广播基准状态更新
   */
  broadcastBaselineUpdate(baselineId: string, data: any) {
    this.broadcast(`baseline:${baselineId}`, {
      type: 'baseline-updated',
      baselineId,
      ...data
    });
  }

  /**
   * 广播分析进度更新
   */
  broadcastAnalysisProgress(analysisId: string, progress: any) {
    this.broadcast(`analysis:${analysisId}`, {
      type: 'analysis-progress',
      analysisId,
      ...progress
    });
  }

  /**
   * 广播分析完成
   */
  broadcastAnalysisComplete(analysisId: string, result: any) {
    this.broadcast(`analysis:${analysisId}`, {
      type: 'analysis-complete',
      analysisId,
      result
    });
  }

  /**
   * 获取当前连接数
   */
  getConnectionCount(): number {
    return this.clients.size;
  }

  /**
   * 获取订阅统计
   */
  getSubscriptionStats(): Record<string, number> {
    const stats: Record<string, number> = {};
    this.subscriptions.forEach((subscribers, topic) => {
      stats[topic] = subscribers.size;
    });
    return stats;
  }

  /**
   * 生成客户端ID
   */
  private generateClientId(): string {
    return `ws-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// 导出单例
export const wsService = new WebSocketService();