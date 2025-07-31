import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';
import fs from 'fs/promises';
import { logger } from '../utils/logger';

export class DatabaseService {
  private static db: Database<sqlite3.Database, sqlite3.Statement>;

  static async initialize() {
    try {
      // 创建数据库文件目录
      const dbDir = path.join(__dirname, '../../data');
      await fs.mkdir(dbDir, { recursive: true });
      
      // 打开SQLite数据库
      this.db = await open({
        filename: path.join(dbDir, 'mdt.db'),
        driver: sqlite3.Database
      });

      // 启用外键约束
      await this.db.exec('PRAGMA foreign_keys = ON');
      
      // 初始化数据库结构
      await this.initializeSchema();
      
      logger.info('SQLite database initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize SQLite database:', error);
      throw error;
    }
  }

  private static async initializeSchema() {
    // 读取并执行schema
    const schemaPath = path.join(__dirname, '../database/sqlite-schema.sql');
    const schema = await fs.readFile(schemaPath, 'utf-8');
    await this.db.exec(schema);
    
    // 检查是否需要插入初始数据
    const count = await this.db.get('SELECT COUNT(*) as count FROM baselines');
    if (count?.count === 0) {
      logger.info('Inserting seed data...');
      const seedPath = path.join(__dirname, '../database/sqlite-seed.sql');
      const seed = await fs.readFile(seedPath, 'utf-8');
      await this.db.exec(seed);
      logger.info('Seed data inserted successfully');
    }
  }

  static getPool() {
    return this.db;
  }

  static async query<T = any>(sql: string, params?: any[]): Promise<T> {
    if (sql.trim().toUpperCase().startsWith('SELECT')) {
      return this.db.all(sql, params) as Promise<T>;
    } else {
      const result = await this.db.run(sql, params);
      return result as any;
    }
  }

  static async transaction<T>(
    callback: (connection: any) => Promise<T>
  ): Promise<T> {
    await this.db.exec('BEGIN TRANSACTION');
    
    try {
      const result = await callback(this.db);
      await this.db.exec('COMMIT');
      return result;
    } catch (error) {
      await this.db.exec('ROLLBACK');
      throw error;
    }
  }

  static async close() {
    if (this.db) {
      await this.db.close();
      logger.info('SQLite database connection closed');
    }
  }
}