import { createClient, RedisClientType } from 'redis';
import { logger } from '../utils/logger';

export class RedisService {
  private static client: RedisClientType;

  static async initialize() {
    try {
      this.client = createClient({
        socket: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379')
        },
        password: process.env.REDIS_PASSWORD || undefined
      });

      this.client.on('error', (err) => {
        logger.error('Redis Client Error:', err);
      });

      this.client.on('connect', () => {
        logger.info('Redis Client Connected');
      });

      await this.client.connect();
    } catch (error) {
      logger.error('Failed to initialize Redis:', error);
      throw error;
    }
  }

  static getClient(): RedisClientType {
    if (!this.client || !this.client.isOpen) {
      throw new Error('Redis not initialized or connected');
    }
    return this.client;
  }

  static async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  static async set(
    key: string, 
    value: string, 
    options?: { EX?: number; PX?: number }
  ): Promise<void> {
    if (options?.EX) {
      await this.client.set(key, value, { EX: options.EX });
    } else if (options?.PX) {
      await this.client.set(key, value, { PX: options.PX });
    } else {
      await this.client.set(key, value);
    }
  }

  static async del(key: string): Promise<number> {
    return this.client.del(key);
  }

  static async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result >= 1;
  }

  static async expire(key: string, seconds: number): Promise<boolean> {
    const result = await this.client.expire(key, seconds);
    return result;
  }

  static async setJSON(key: string, value: any, ttl?: number): Promise<void> {
    const jsonString = JSON.stringify(value);
    if (ttl) {
      await this.set(key, jsonString, { EX: ttl });
    } else {
      await this.set(key, jsonString);
    }
  }

  static async getJSON<T = any>(key: string): Promise<T | null> {
    const value = await this.get(key);
    if (!value) return null;
    
    try {
      return JSON.parse(value) as T;
    } catch (error) {
      logger.error(`Failed to parse JSON for key ${key}:`, error);
      return null;
    }
  }

  static async invalidatePattern(pattern: string): Promise<void> {
    const keys = await this.client.keys(pattern);
    if (keys.length > 0) {
      await this.client.del(keys);
    }
  }

  static async close() {
    if (this.client && this.client.isOpen) {
      await this.client.quit();
      logger.info('Redis connection closed');
    }
  }
}