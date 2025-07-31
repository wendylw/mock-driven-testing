import mysql from 'mysql2/promise';
import { logger } from '../utils/logger';

export class DatabaseService {
  private static pool: mysql.Pool;

  static async initialize() {
    try {
      this.pool = mysql.createPool({
        host: process.env.DATABASE_HOST || 'localhost',
        port: parseInt(process.env.DATABASE_PORT || '3306'),
        user: process.env.DATABASE_USER || 'root',
        password: process.env.DATABASE_PASSWORD || '',
        database: process.env.DATABASE_NAME || 'mdt',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0
      });

      // Test connection
      const connection = await this.pool.getConnection();
      await connection.ping();
      connection.release();
      
      logger.info('Database connection pool created successfully');
    } catch (error) {
      logger.error('Failed to initialize database:', error);
      throw error;
    }
  }

  static getPool(): mysql.Pool {
    if (!this.pool) {
      throw new Error('Database not initialized. Call initialize() first.');
    }
    return this.pool;
  }

  static async query<T = any>(sql: string, params?: any[]): Promise<T> {
    const pool = this.getPool();
    const [rows] = await pool.execute(sql, params);
    return rows as T;
  }

  static async transaction<T>(
    callback: (connection: mysql.PoolConnection) => Promise<T>
  ): Promise<T> {
    const pool = this.getPool();
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      const result = await callback(connection);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async close() {
    if (this.pool) {
      await this.pool.end();
      logger.info('Database connection pool closed');
    }
  }
}