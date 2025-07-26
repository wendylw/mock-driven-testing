/**
 * Dynamic ID Handler - 动态 ID 处理器
 * 智能识别和生成各种类型的 ID
 */

const crypto = require('crypto');
// const { v4: uuidv4 } = require('uuid'); // 使用内置实现

class DynamicIDHandler {
  constructor() {
    // ID 模式定义
    this.patterns = [
      {
        name: 'mongodb',
        regex: /^[0-9a-f]{24}$/,
        generator: this.generateMongoID,
        description: 'MongoDB ObjectId'
      },
      {
        name: 'uuid',
        regex: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
        generator: this.generateUUID,
        description: 'UUID v4'
      },
      {
        name: 'numeric',
        regex: /^\d+$/,
        generator: this.generateNumericID,
        description: 'Numeric ID'
      },
      {
        name: 'alphanumeric',
        regex: /^[a-zA-Z0-9]+$/,
        generator: this.generateAlphanumericID,
        description: 'Alphanumeric ID'
      },
      {
        name: 'prefixed',
        regex: /^([a-zA-Z]+)_([a-zA-Z0-9]+)$/,
        generator: this.generatePrefixedID,
        description: 'Prefixed ID (e.g., user_12345)'
      },
      {
        name: 'slug',
        regex: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        generator: this.generateSlugID,
        description: 'URL-friendly slug'
      },
      {
        name: 'timestamp',
        regex: /^\d{10,13}$/,
        generator: this.generateTimestampID,
        description: 'Timestamp-based ID'
      },
      {
        name: 'hash',
        regex: /^[a-f0-9]{32,64}$/,
        generator: this.generateHashID,
        description: 'Hash-based ID'
      }
    ];
    
    // ID 关系映射
    this.relationships = new Map();
    
    // ID 生成计数器
    this.counters = new Map();
  }

  /**
   * 识别 ID 类型
   */
  recognize(id) {
    if (!id || typeof id !== 'string') {
      return null;
    }
    
    for (const pattern of this.patterns) {
      if (pattern.regex.test(id)) {
        return {
          type: pattern.name,
          pattern: pattern,
          metadata: this.extractMetadata(id, pattern)
        };
      }
    }
    
    // 未识别的 ID 类型
    return {
      type: 'unknown',
      pattern: null,
      metadata: { length: id.length }
    };
  }

  /**
   * 生成相似的 ID
   */
  generateSimilar(id, options = {}) {
    const recognition = this.recognize(id);
    
    if (!recognition || !recognition.pattern) {
      // 无法识别，返回随机字符串
      return this.generateRandomString(id.length);
    }
    
    // 使用对应的生成器
    return recognition.pattern.generator.call(this, {
      ...recognition.metadata,
      ...options
    });
  }

  /**
   * 批量生成 ID
   */
  generateBatch(pattern, count, options = {}) {
    const ids = new Set();
    const patternObj = this.patterns.find(p => p.name === pattern);
    
    if (!patternObj) {
      throw new Error(`Unknown ID pattern: ${pattern}`);
    }
    
    while (ids.size < count) {
      const id = patternObj.generator.call(this, options);
      ids.add(id);
    }
    
    return Array.from(ids);
  }

  /**
   * 提取 ID 元数据
   */
  extractMetadata(id, pattern) {
    const metadata = {};
    
    switch (pattern.name) {
      case 'mongodb':
        // MongoDB ObjectId 包含时间戳
        metadata.timestamp = parseInt(id.substring(0, 8), 16);
        metadata.machine = id.substring(8, 14);
        metadata.process = id.substring(14, 18);
        metadata.counter = id.substring(18, 24);
        break;
        
      case 'prefixed':
        const match = id.match(pattern.regex);
        if (match) {
          metadata.prefix = match[1];
          metadata.value = match[2];
        }
        break;
        
      case 'timestamp':
        metadata.timestamp = parseInt(id);
        metadata.date = new Date(metadata.timestamp);
        break;
        
      default:
        metadata.length = id.length;
    }
    
    return metadata;
  }

  /**
   * MongoDB ObjectId 生成器
   */
  generateMongoID(options = {}) {
    const timestamp = Math.floor((options.timestamp || Date.now()) / 1000);
    const machine = options.machine || crypto.randomBytes(3).toString('hex');
    const pid = options.process || process.pid.toString(16).padStart(4, '0').substring(0, 4);
    const counter = this.getNextCounter('mongodb').toString(16).padStart(6, '0');
    
    return timestamp.toString(16).padStart(8, '0') + machine + pid + counter;
  }

  /**
   * UUID 生成器
   */
  generateUUID(options = {}) {
    if (options.value) return options.value;
    
    // 内置 UUID v4 实现
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * 数字 ID 生成器
   */
  generateNumericID(options = {}) {
    if (options.sequential) {
      return this.getNextCounter('numeric').toString();
    }
    
    const min = options.min || 1;
    const max = options.max || 999999999;
    
    return Math.floor(Math.random() * (max - min + 1) + min).toString();
  }

  /**
   * 字母数字 ID 生成器
   */
  generateAlphanumericID(options = {}) {
    const length = options.length || 12;
    const chars = options.chars || '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    
    let id = '';
    for (let i = 0; i < length; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return id;
  }

  /**
   * 前缀 ID 生成器
   */
  generatePrefixedID(options = {}) {
    const prefix = options.prefix || 'id';
    const separator = options.separator || '_';
    const value = options.value || this.generateAlphanumericID({ length: 8 });
    
    return `${prefix}${separator}${value}`;
  }

  /**
   * Slug ID 生成器
   */
  generateSlugID(options = {}) {
    if (options.title) {
      // 从标题生成 slug
      return options.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    }
    
    // 生成随机 slug
    const words = ['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta'];
    const count = options.wordCount || 3;
    const selected = [];
    
    for (let i = 0; i < count; i++) {
      selected.push(words[Math.floor(Math.random() * words.length)]);
    }
    
    return selected.join('-') + '-' + Date.now().toString(36);
  }

  /**
   * 时间戳 ID 生成器
   */
  generateTimestampID(options = {}) {
    const timestamp = options.timestamp || Date.now();
    const precision = options.precision || 'milliseconds';
    
    switch (precision) {
      case 'seconds':
        return Math.floor(timestamp / 1000).toString();
      case 'microseconds':
        return (timestamp * 1000 + Math.floor(Math.random() * 1000)).toString();
      default:
        return timestamp.toString();
    }
  }

  /**
   * Hash ID 生成器
   */
  generateHashID(options = {}) {
    const algorithm = options.algorithm || 'sha256';
    const data = options.data || crypto.randomBytes(32).toString('hex');
    const length = options.length || 64;
    
    const hash = crypto.createHash(algorithm);
    hash.update(data);
    
    return hash.digest('hex').substring(0, length);
  }

  /**
   * 生成随机字符串
   */
  generateRandomString(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
  }

  /**
   * 获取下一个计数器值
   */
  getNextCounter(name) {
    if (!this.counters.has(name)) {
      this.counters.set(name, 0);
    }
    
    const current = this.counters.get(name);
    this.counters.set(name, current + 1);
    
    return current + 1;
  }

  /**
   * 注册 ID 关系
   */
  registerRelationship(parentType, parentId, childType, childId) {
    const key = `${parentType}:${parentId}`;
    
    if (!this.relationships.has(key)) {
      this.relationships.set(key, new Map());
    }
    
    const children = this.relationships.get(key);
    
    if (!children.has(childType)) {
      children.set(childType, new Set());
    }
    
    children.get(childType).add(childId);
  }

  /**
   * 获取相关 ID
   */
  getRelatedIDs(entityType, entityId, relationType) {
    const key = `${entityType}:${entityId}`;
    const children = this.relationships.get(key);
    
    if (!children || !children.has(relationType)) {
      return [];
    }
    
    return Array.from(children.get(relationType));
  }

  /**
   * 验证 ID 格式
   */
  validate(id, expectedType) {
    const recognition = this.recognize(id);
    
    if (!recognition) {
      return {
        valid: false,
        error: 'Unable to recognize ID format'
      };
    }
    
    if (expectedType && recognition.type !== expectedType) {
      return {
        valid: false,
        error: `Expected ${expectedType} ID, got ${recognition.type}`
      };
    }
    
    return {
      valid: true,
      type: recognition.type,
      metadata: recognition.metadata
    };
  }

  /**
   * ID 转换
   */
  convert(id, fromType, toType, options = {}) {
    // 验证源 ID
    const validation = this.validate(id, fromType);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    // 查找目标生成器
    const targetPattern = this.patterns.find(p => p.name === toType);
    if (!targetPattern) {
      throw new Error(`Unknown target ID type: ${toType}`);
    }
    
    // 特殊转换规则
    const conversionRules = {
      'numeric-to-prefixed': (id) => ({
        prefix: options.prefix || 'id',
        value: id
      }),
      'uuid-to-hash': (id) => ({
        data: id,
        algorithm: 'sha256',
        length: 32
      }),
      'timestamp-to-mongodb': (id) => ({
        timestamp: parseInt(id)
      })
    };
    
    const ruleKey = `${fromType}-to-${toType}`;
    const conversionOptions = conversionRules[ruleKey] 
      ? conversionRules[ruleKey](id) 
      : options;
    
    return targetPattern.generator.call(this, conversionOptions);
  }

  /**
   * 获取统计信息
   */
  getStats() {
    const stats = {
      patterns: this.patterns.length,
      relationships: this.relationships.size,
      counters: {}
    };
    
    for (const [name, value] of this.counters) {
      stats.counters[name] = value;
    }
    
    return stats;
  }
}

// UUID 生成已内置，无需额外的 polyfill

module.exports = DynamicIDHandler;