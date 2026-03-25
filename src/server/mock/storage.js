const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

// 简化版存储（使用JSON文件，避免SQLite依赖问题）
class MockStorage {
  constructor() {
    this.dataDir = path.join(__dirname, '../../../data');
    this.mocksFile = path.join(this.dataDir, 'mocks.json');
    this.logsFile = path.join(this.dataDir, 'request-logs.json');
    
    this.ensureDataDir();
    this.mocks = this.loadMocks();
    this.requestLogs = this.loadRequestLogs();
  }

  ensureDataDir() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
      logger.info('Created data directory:', this.dataDir);
    }
  }

  loadMocks() {
    try {
      if (fs.existsSync(this.mocksFile)) {
        const data = fs.readFileSync(this.mocksFile, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      logger.error('Error loading mocks:', error.message);
    }
    return [];
  }

  loadRequestLogs() {
    try {
      if (fs.existsSync(this.logsFile)) {
        const data = fs.readFileSync(this.logsFile, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      logger.error('Error loading request logs:', error.message);
    }
    return [];
  }

  saveMocks() {
    try {
      fs.writeFileSync(this.mocksFile, JSON.stringify(this.mocks, null, 2));
      logger.debug('Mocks saved to file');
    } catch (error) {
      logger.error('Error saving mocks:', error.message);
      throw error;
    }
  }

  saveRequestLogs() {
    try {
      fs.writeFileSync(this.logsFile, JSON.stringify(this.requestLogs, null, 2));
      logger.debug('Request logs saved to file');
    } catch (error) {
      logger.error('Error saving request logs:', error.message);
    }
  }

  async createMock(mockData) {
    const mock = {
      id: uuidv4(),
      ...mockData,
      active: mockData.active !== false,
      priority: mockData.priority || 0,
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.mocks.push(mock);
    this.saveMocks();
    
    logger.info(`Mock created: ${mock.id} - ${mock.name}`);
    return mock;
  }

  async getMockById(id) {
    return this.mocks.find(mock => mock.id === id);
  }

  async getAllMocks({ page = 1, limit = 20, search } = {}) {
    let filteredMocks = this.mocks;
    
    if (search) {
      filteredMocks = this.mocks.filter(mock => 
        mock.name.toLowerCase().includes(search.toLowerCase()) ||
        mock.url?.includes(search) ||
        mock.urlPattern?.includes(search)
      );
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return {
      mocks: filteredMocks.slice(startIndex, endIndex),
      total: filteredMocks.length,
      page: parseInt(page),
      limit: parseInt(limit)
    };
  }

  async getActiveMocks() {
    return this.mocks
      .filter(mock => mock.active)
      .sort((a, b) => b.priority - a.priority);
  }

  async updateMock(id, updateData) {
    const index = this.mocks.findIndex(mock => mock.id === id);
    if (index === -1) {
      throw new Error('Mock not found');
    }

    this.mocks[index] = {
      ...this.mocks[index],
      ...updateData,
      id, // 保持ID不变
      updatedAt: new Date().toISOString(),
      version: (this.mocks[index].version || 1) + 1
    };

    this.saveMocks();
    logger.info(`Mock updated: ${id}`);
    return this.mocks[index];
  }

  async deleteMock(id) {
    const index = this.mocks.findIndex(mock => mock.id === id);
    if (index === -1) {
      throw new Error('Mock not found');
    }

    this.mocks.splice(index, 1);
    this.saveMocks();
    logger.info(`Mock deleted: ${id}`);
  }

  async deleteAllMocks() {
    this.mocks = [];
    this.saveMocks();
    logger.info('All mocks deleted');
  }

  async exportMocks() {
    return {
      mocks: this.mocks,
      exported_at: new Date().toISOString(),
      version: '1.0.0'
    };
  }

  async importMocks(data) {
    if (!data.mocks || !Array.isArray(data.mocks)) {
      throw new Error('Invalid import data format');
    }

    let imported = 0;
    for (const mockData of data.mocks) {
      try {
        // 重新生成ID以避免冲突
        const { id, ...mockWithoutId } = mockData;
        await this.createMock(mockWithoutId);
        imported++;
      } catch (error) {
        logger.warn(`Failed to import mock: ${error.message}`);
      }
    }

    return { imported, total: data.mocks.length };
  }

  async logRequest(requestData) {
    const log = {
      id: uuidv4(),
      ...requestData,
      timestamp: new Date().toISOString()
    };

    this.requestLogs.push(log);
    
    // 保持最近1000条记录
    if (this.requestLogs.length > 1000) {
      this.requestLogs = this.requestLogs.slice(-1000);
    }

    this.saveRequestLogs();
    return log;
  }

  async getRequestLogs({ page = 1, limit = 50 } = {}) {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return {
      logs: this.requestLogs
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(startIndex, endIndex),
      total: this.requestLogs.length,
      page: parseInt(page),
      limit: parseInt(limit)
    };
  }
}

module.exports = MockStorage;