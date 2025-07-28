// 简化版验证器（不依赖Joi，使用原生JS验证）
class MockValidator {
  static validateMock(mockData) {
    const errors = [];

    // 名称验证
    if (!mockData.name || typeof mockData.name !== 'string' || mockData.name.trim() === '') {
      errors.push('Name is required and must be a non-empty string');
    }

    // HTTP方法验证
    const validMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];
    if (!mockData.method || !validMethods.includes(mockData.method.toUpperCase())) {
      errors.push(`Method must be one of: ${validMethods.join(', ')}`);
    }

    // URL验证
    if (!mockData.url && !mockData.urlPattern) {
      errors.push('Either url or urlPattern is required');
    }

    if (mockData.url && mockData.urlPattern) {
      errors.push('Cannot specify both url and urlPattern');
    }

    // URL格式验证
    if (mockData.url && (typeof mockData.url !== 'string' || !mockData.url.startsWith('/'))) {
      errors.push('URL must be a string starting with /');
    }

    // 响应验证
    if (!mockData.response) {
      errors.push('Response is required');
    } else {
      if (mockData.response.status && (
        typeof mockData.response.status !== 'number' || 
        mockData.response.status < 100 || 
        mockData.response.status > 599
      )) {
        errors.push('Response status must be a number between 100 and 599');
      }

      if (mockData.response.delay && (
        typeof mockData.response.delay !== 'number' || 
        mockData.response.delay < 0 || 
        mockData.response.delay > 30000
      )) {
        errors.push('Response delay must be a number between 0 and 30000ms');
      }
    }

    // 优先级验证
    if (mockData.priority !== undefined && (
      typeof mockData.priority !== 'number' || 
      mockData.priority < 0 || 
      mockData.priority > 1000
    )) {
      errors.push('Priority must be a number between 0 and 1000');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateMiddleware(req, res, next) {
    const validation = MockValidator.validateMock(req.body);
    
    if (!validation.isValid) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.errors
      });
    }

    next();
  }
}

module.exports = MockValidator;