const MockStorage = require('./storage');
const logger = require('../utils/logger');

class MockService {
  constructor() {
    this.storage = new MockStorage();
  }

  async list(options = {}) {
    try {
      return await this.storage.getAllMocks(options);
    } catch (error) {
      logger.error('Error listing mocks:', error.message);
      throw error;
    }
  }

  async create(mockData) {
    try {
      // 标准化数据
      const normalizedData = {
        name: mockData.name.trim(),
        description: mockData.description?.trim() || '',
        method: mockData.method.toUpperCase(),
        url: mockData.url?.trim(),
        urlPattern: mockData.urlPattern?.trim(),
        headers: mockData.headers || {},
        query: mockData.query || {},
        body: mockData.body,
        response: {
          status: mockData.response?.status || 200,
          headers: mockData.response?.headers || {},
          body: mockData.response?.body,
          delay: mockData.response?.delay || 0
        },
        priority: mockData.priority || 0,
        active: mockData.active !== false,
        scenarioId: mockData.scenarioId
      };

      return await this.storage.createMock(normalizedData);
    } catch (error) {
      logger.error('Error creating mock:', error.message);
      throw error;
    }
  }

  async getById(id) {
    try {
      const mock = await this.storage.getMockById(id);
      if (!mock) {
        throw new Error('Mock not found');
      }
      return mock;
    } catch (error) {
      logger.error('Error getting mock:', error.message);
      throw error;
    }
  }

  async update(id, updateData) {
    try {
      // 只更新允许的字段
      const allowedFields = [
        'name', 'description', 'method', 'url', 'urlPattern',
        'headers', 'query', 'body', 'response', 'priority', 'active', 'scenarioId'
      ];

      const filteredData = {};
      for (const field of allowedFields) {
        if (updateData.hasOwnProperty(field)) {
          filteredData[field] = updateData[field];
        }
      }

      // 标准化方法名
      if (filteredData.method) {
        filteredData.method = filteredData.method.toUpperCase();
      }

      return await this.storage.updateMock(id, filteredData);
    } catch (error) {
      logger.error('Error updating mock:', error.message);
      throw error;
    }
  }

  async delete(id) {
    try {
      await this.storage.deleteMock(id);
    } catch (error) {
      logger.error('Error deleting mock:', error.message);
      throw error;
    }
  }

  async deleteAll() {
    try {
      await this.storage.deleteAllMocks();
    } catch (error) {
      logger.error('Error deleting all mocks:', error.message);
      throw error;
    }
  }

  async export() {
    try {
      return await this.storage.exportMocks();
    } catch (error) {
      logger.error('Error exporting mocks:', error.message);
      throw error;
    }
  }

  async import(data) {
    try {
      return await this.storage.importMocks(data);
    } catch (error) {
      logger.error('Error importing mocks:', error.message);
      throw error;
    }
  }

  async getActiveMocks() {
    try {
      return await this.storage.getActiveMocks();
    } catch (error) {
      logger.error('Error getting active mocks:', error.message);
      throw error;
    }
  }

  async logRequest(requestData) {
    try {
      return await this.storage.logRequest(requestData);
    } catch (error) {
      logger.error('Error logging request:', error.message);
      throw error;
    }
  }

  async getRequestLogs(options = {}) {
    try {
      return await this.storage.getRequestLogs(options);
    } catch (error) {
      logger.error('Error getting request logs:', error.message);
      throw error;
    }
  }
}

module.exports = MockService;