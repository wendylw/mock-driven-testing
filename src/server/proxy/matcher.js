const logger = require('../utils/logger');

class MockMatcher {
  constructor(mockService) {
    this.mockService = mockService;
  }

  async findMatch(req) {
    try {
      const activeMocks = await this.mockService.getActiveMocks();
      
      // 按优先级排序已经在storage中完成
      for (const mock of activeMocks) {
        if (this.isMatch(req, mock)) {
          logger.debug(`Mock matched: ${mock.id} - ${mock.name}`);
          return mock;
        }
      }
      
      logger.debug(`No mock matched for ${req.method} ${req.url}`);
      return null;
    } catch (error) {
      logger.error('Error finding mock match:', error.message);
      return null;
    }
  }

  isMatch(req, mock) {
    try {
      // 1. 方法匹配
      if (mock.method && mock.method !== req.method) {
        return false;
      }
      
      // 2. URL匹配
      if (!this.isUrlMatch(req.url, mock)) {
        return false;
      }
      
      // 3. Headers匹配
      if (mock.headers && Object.keys(mock.headers).length > 0) {
        if (!this.isHeadersMatch(req.headers, mock.headers)) {
          return false;
        }
      }
      
      // 4. Query参数匹配
      if (mock.query && Object.keys(mock.query).length > 0) {
        if (!this.isQueryMatch(req.query, mock.query)) {
          return false;
        }
      }
      
      // 5. Body匹配（POST/PUT/PATCH请求）
      if (mock.body && ['POST', 'PUT', 'PATCH'].includes(req.method)) {
        if (!this.isBodyMatch(req.body, mock.body)) {
          return false;
        }
      }
      
      return true;
    } catch (error) {
      logger.error('Error in isMatch:', error.message);
      return false;
    }
  }

  isUrlMatch(requestUrl, mock) {
    try {
      // 移除查询参数
      const cleanUrl = requestUrl.split('?')[0];
      
      if (mock.url) {
        // 精确匹配
        return cleanUrl === mock.url;
      } else if (mock.urlPattern) {
        // 正则匹配
        const regex = new RegExp(mock.urlPattern);
        return regex.test(cleanUrl);
      }
      
      return false;
    } catch (error) {
      logger.error('Error in URL matching:', error.message);
      return false;
    }
  }

  isHeadersMatch(requestHeaders, mockHeaders) {
    try {
      return Object.entries(mockHeaders).every(([key, value]) => {
        const requestValue = requestHeaders[key.toLowerCase()];
        return requestValue === value;
      });
    } catch (error) {
      logger.error('Error in headers matching:', error.message);
      return false;
    }
  }

  isQueryMatch(requestQuery, mockQuery) {
    try {
      return Object.entries(mockQuery).every(([key, value]) => {
        return requestQuery[key] === value;
      });
    } catch (error) {
      logger.error('Error in query matching:', error.message);
      return false;
    }
  }

  isBodyMatch(requestBody, mockBody) {
    try {
      // 简单的深度比较
      return JSON.stringify(requestBody) === JSON.stringify(mockBody);
    } catch (error) {
      logger.error('Error in body matching:', error.message);
      return false;
    }
  }
}

module.exports = MockMatcher;