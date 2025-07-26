/**
 * Data Generator - 智能数据生成器
 * 集成动态 ID 和模板引擎，生成符合业务逻辑的数据
 */

const DynamicIDHandler = require('./DynamicIDHandler');
const TemplateEngine = require('./TemplateEngine');
const fs = require('fs').promises;
const path = require('path');

class DataGenerator {
  constructor(config = {}) {
    this.config = config;
    
    // 初始化组件
    this.idHandler = new DynamicIDHandler();
    this.templateEngine = new TemplateEngine(config);
    
    // 数据模式存储
    this.schemas = new Map();
    this.learnedPatterns = new Map();
    
    // 业务规则
    this.businessRules = new Map();
    
    // 关系管理
    this.relationships = new Map();
  }

  /**
   * 注册实体模式
   */
  registerSchema(entityType, schema) {
    this.schemas.set(entityType, {
      ...schema,
      compiled: this.compileSchema(schema)
    });
  }

  /**
   * 编译模式
   */
  compileSchema(schema) {
    const compiled = {
      required: new Set(schema.required || []),
      properties: {},
      relationships: schema.relationships || {},
      constraints: schema.constraints || {}
    };
    
    // 编译属性
    for (const [key, prop] of Object.entries(schema.properties || {})) {
      compiled.properties[key] = {
        ...prop,
        template: prop.template ? this.templateEngine.compile(prop.template) : null
      };
    }
    
    return compiled;
  }

  /**
   * 生成单个实体数据
   */
  async generate(entityType, params = {}) {
    const schema = this.schemas.get(entityType);
    
    if (!schema) {
      // 使用学习的模式
      const learned = this.learnedPatterns.get(entityType);
      if (learned) {
        return this.generateFromLearnedPattern(entityType, params);
      }
      
      throw new Error(`No schema found for entity type: ${entityType}`);
    }
    
    // 生成基础数据
    const data = await this.generateFromSchema(schema, params);
    
    // 应用业务规则
    await this.applyBusinessRules(entityType, data);
    
    // 处理关系
    if (schema.relationships) {
      await this.handleRelationships(entityType, data, schema.relationships);
    }
    
    return data;
  }

  /**
   * 从模式生成数据
   */
  async generateFromSchema(schema, params) {
    const data = {};
    const context = {
      ...params,
      _entity: data, // 允许引用其他字段
      _schema: schema
    };
    
    // 生成 ID
    if (schema.idField && !params[schema.idField]) {
      const idType = schema.idType || 'uuid';
      data[schema.idField] = this.idHandler.generateBatch(idType, 1)[0];
      context[schema.idField] = data[schema.idField];
    }
    
    // 生成各个字段
    for (const [field, config] of Object.entries(schema.compiled.properties)) {
      // 跳过已提供的参数
      if (params[field] !== undefined) {
        data[field] = params[field];
        continue;
      }
      
      // 使用模板生成
      if (config.template) {
        data[field] = this.templateEngine.render(config.template, context);
        context[field] = data[field]; // 更新上下文
        continue;
      }
      
      // 使用类型生成器
      data[field] = await this.generateFieldValue(field, config, context);
      context[field] = data[field];
    }
    
    // 验证必需字段
    for (const field of schema.compiled.required) {
      if (data[field] === undefined || data[field] === null) {
        throw new Error(`Required field missing: ${field}`);
      }
    }
    
    return data;
  }

  /**
   * 生成字段值
   */
  async generateFieldValue(field, config, context) {
    const type = config.type || 'string';
    const constraints = config.constraints || {};
    
    switch (type) {
      case 'string':
        return this.generateString(field, constraints, context);
        
      case 'number':
      case 'integer':
        return this.generateNumber(field, constraints, type === 'integer');
        
      case 'boolean':
        return this.generateBoolean(constraints);
        
      case 'array':
        return this.generateArray(field, config, context);
        
      case 'object':
        return this.generateObject(field, config, context);
        
      case 'date':
      case 'datetime':
        return this.generateDate(constraints);
        
      case 'enum':
        return this.generateEnum(constraints.values || []);
        
      case 'reference':
        return this.generateReference(config.ref, constraints);
        
      default:
        // 尝试自定义生成器
        if (this.hasCustomGenerator(type)) {
          return this.callCustomGenerator(type, field, constraints, context);
        }
        
        return null;
    }
  }

  /**
   * 生成字符串
   */
  generateString(field, constraints, context) {
    // 特殊字段处理
    const fieldLower = field.toLowerCase();
    
    if (fieldLower.includes('email')) {
      return this.templateEngine.helpers.get('email')(context);
    }
    
    if (fieldLower.includes('name')) {
      if (fieldLower.includes('first')) {
        return this.templateEngine.helpers.get('firstName')(context);
      }
      if (fieldLower.includes('last')) {
        return this.templateEngine.helpers.get('lastName')(context);
      }
      if (fieldLower.includes('full') || fieldLower === 'name') {
        return this.templateEngine.helpers.get('fullName')(context);
      }
    }
    
    if (fieldLower.includes('phone')) {
      return this.templateEngine.helpers.get('phone')(context);
    }
    
    if (fieldLower.includes('address')) {
      return this.templateEngine.helpers.get('address')(context);
    }
    
    if (fieldLower.includes('description') || fieldLower.includes('content')) {
      return this.templateEngine.helpers.get('lorem')(context, 2, 'sentences');
    }
    
    // 使用约束生成
    const minLength = constraints.minLength || 1;
    const maxLength = constraints.maxLength || 50;
    const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
    
    if (constraints.pattern) {
      return this.generateFromPattern(constraints.pattern, length);
    }
    
    // 默认随机字符串
    return this.idHandler.generateRandomString(length);
  }

  /**
   * 生成数字
   */
  generateNumber(field, constraints, isInteger = false) {
    const min = constraints.min ?? 0;
    const max = constraints.max ?? 1000000;
    
    // 价格字段特殊处理
    if (field.toLowerCase().includes('price') || field.toLowerCase().includes('amount')) {
      const price = Math.random() * (max - min) + min;
      return isInteger ? Math.round(price) : parseFloat(price.toFixed(2));
    }
    
    // 百分比字段
    if (field.toLowerCase().includes('percent') || field.toLowerCase().includes('rate')) {
      const rate = Math.random() * 100;
      return isInteger ? Math.round(rate) : parseFloat(rate.toFixed(2));
    }
    
    const value = Math.random() * (max - min) + min;
    return isInteger ? Math.floor(value) : value;
  }

  /**
   * 生成布尔值
   */
  generateBoolean(constraints) {
    const probability = constraints.probability ?? 0.5;
    return Math.random() < probability;
  }

  /**
   * 生成数组
   */
  async generateArray(field, config, context) {
    const minItems = config.minItems || 0;
    const maxItems = config.maxItems || 10;
    const count = Math.floor(Math.random() * (maxItems - minItems + 1)) + minItems;
    
    const items = [];
    for (let i = 0; i < count; i++) {
      const itemContext = { ...context, _index: i, _count: count };
      
      if (config.items) {
        if (config.items.template) {
          items.push(this.templateEngine.render(config.items.template, itemContext));
        } else {
          items.push(await this.generateFieldValue(`${field}[${i}]`, config.items, itemContext));
        }
      } else {
        items.push(null);
      }
    }
    
    return items;
  }

  /**
   * 生成对象
   */
  async generateObject(field, config, context) {
    if (config.properties) {
      const obj = {};
      
      for (const [key, propConfig] of Object.entries(config.properties)) {
        obj[key] = await this.generateFieldValue(`${field}.${key}`, propConfig, context);
      }
      
      return obj;
    }
    
    return {};
  }

  /**
   * 生成日期
   */
  generateDate(constraints) {
    const min = constraints.min ? new Date(constraints.min).getTime() : Date.now() - 365 * 24 * 60 * 60 * 1000;
    const max = constraints.max ? new Date(constraints.max).getTime() : Date.now() + 365 * 24 * 60 * 60 * 1000;
    
    const timestamp = Math.floor(Math.random() * (max - min)) + min;
    const date = new Date(timestamp);
    
    return constraints.format === 'date' 
      ? date.toISOString().split('T')[0]
      : date.toISOString();
  }

  /**
   * 生成枚举值
   */
  generateEnum(values) {
    if (!Array.isArray(values) || values.length === 0) {
      return null;
    }
    
    return values[Math.floor(Math.random() * values.length)];
  }

  /**
   * 生成引用
   */
  async generateReference(refType, constraints) {
    // 查找已存在的实体
    const existing = await this.findExistingEntity(refType, constraints);
    
    if (existing) {
      return existing.id || existing._id;
    }
    
    // 生成新的引用 ID
    const idType = this.getEntityIdType(refType);
    return this.idHandler.generateBatch(idType, 1)[0];
  }

  /**
   * 应用业务规则
   */
  async applyBusinessRules(entityType, data) {
    const rules = this.businessRules.get(entityType);
    if (!rules) return;
    
    for (const rule of rules) {
      if (rule.condition(data)) {
        await rule.apply(data);
      }
    }
  }

  /**
   * 处理关系
   */
  async handleRelationships(entityType, data, relationships) {
    for (const [field, relation] of Object.entries(relationships)) {
      if (relation.type === 'belongsTo') {
        // 确保外键存在
        if (!data[field] && relation.required) {
          data[field] = await this.generateReference(relation.entity, {});
        }
      } else if (relation.type === 'hasMany') {
        // 生成子实体
        if (!data[field]) {
          const count = relation.min || 0;
          data[field] = [];
          
          for (let i = 0; i < count; i++) {
            const child = await this.generate(relation.entity, {
              [relation.foreignKey]: data.id
            });
            data[field].push(child);
          }
        }
      }
    }
  }

  /**
   * 从学习的模式生成
   */
  async generateFromLearnedPattern(entityType, params) {
    const pattern = this.learnedPatterns.get(entityType);
    if (!pattern) {
      throw new Error(`No learned pattern for entity type: ${entityType}`);
    }
    
    // 选择一个样本作为基础
    const sample = pattern.samples[Math.floor(Math.random() * pattern.samples.length)];
    const data = JSON.parse(JSON.stringify(sample)); // 深拷贝
    
    // 替换 ID 和唯一字段
    for (const field of pattern.uniqueFields) {
      if (data[field]) {
        const fieldType = pattern.fieldTypes[field];
        data[field] = await this.generateFieldValue(field, fieldType, { ...params, _entity: data });
      }
    }
    
    // 应用参数覆盖
    Object.assign(data, params);
    
    return data;
  }

  /**
   * 学习数据模式
   */
  async learnFromSamples(entityType, samples) {
    if (!Array.isArray(samples) || samples.length === 0) {
      throw new Error('No samples provided for learning');
    }
    
    const pattern = {
      entityType,
      samples: samples.slice(0, 100), // 保留最多 100 个样本
      fieldTypes: {},
      uniqueFields: [],
      enumFields: {},
      statistics: {}
    };
    
    // 分析字段类型
    const fieldValues = {};
    
    for (const sample of samples) {
      for (const [field, value] of Object.entries(sample)) {
        if (!fieldValues[field]) {
          fieldValues[field] = [];
        }
        fieldValues[field].push(value);
      }
    }
    
    // 分析每个字段
    for (const [field, values] of Object.entries(fieldValues)) {
      const analysis = this.analyzeFieldValues(field, values);
      pattern.fieldTypes[field] = analysis.type;
      
      // 识别唯一字段
      if (analysis.uniqueRatio > 0.95) {
        pattern.uniqueFields.push(field);
      }
      
      // 识别枚举字段
      if (analysis.isEnum) {
        pattern.enumFields[field] = analysis.enumValues;
      }
      
      pattern.statistics[field] = analysis.stats;
    }
    
    this.learnedPatterns.set(entityType, pattern);
    
    // 生成模式定义
    const schema = this.patternToSchema(pattern);
    this.registerSchema(entityType, schema);
    
    return pattern;
  }

  /**
   * 分析字段值
   */
  analyzeFieldValues(field, values) {
    const uniqueValues = new Set(values);
    const uniqueRatio = uniqueValues.size / values.length;
    
    // 类型检测
    let type = 'mixed';
    const types = new Set();
    
    for (const value of values) {
      if (value === null || value === undefined) {
        types.add('null');
      } else if (typeof value === 'boolean') {
        types.add('boolean');
      } else if (typeof value === 'number') {
        types.add(Number.isInteger(value) ? 'integer' : 'number');
      } else if (typeof value === 'string') {
        types.add('string');
        
        // 检测特殊格式
        if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
          types.add('date');
        }
        if (/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(value)) {
          types.add('uuid');
        }
        if (/^[a-f0-9]{24}$/i.test(value)) {
          types.add('mongodb');
        }
      } else if (Array.isArray(value)) {
        types.add('array');
      } else if (typeof value === 'object') {
        types.add('object');
      }
    }
    
    // 确定主要类型
    if (types.size === 1) {
      type = Array.from(types)[0];
    } else if (types.has('string') && types.size === 2 && types.has('null')) {
      type = 'string';
    }
    
    // 统计信息
    const stats = {
      count: values.length,
      unique: uniqueValues.size,
      nullCount: values.filter(v => v == null).length
    };
    
    // 数值统计
    if (type === 'number' || type === 'integer') {
      const numbers = values.filter(v => typeof v === 'number');
      stats.min = Math.min(...numbers);
      stats.max = Math.max(...numbers);
      stats.avg = numbers.reduce((a, b) => a + b, 0) / numbers.length;
    }
    
    // 字符串统计
    if (type === 'string') {
      const strings = values.filter(v => typeof v === 'string');
      const lengths = strings.map(s => s.length);
      stats.minLength = Math.min(...lengths);
      stats.maxLength = Math.max(...lengths);
      stats.avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    }
    
    // 枚举检测
    const isEnum = uniqueRatio < 0.1 && uniqueValues.size <= 20;
    
    return {
      type,
      uniqueRatio,
      isEnum,
      enumValues: isEnum ? Array.from(uniqueValues) : null,
      stats,
      nullable: stats.nullCount > 0
    };
  }

  /**
   * 将学习的模式转换为模式定义
   */
  patternToSchema(pattern) {
    const schema = {
      type: 'object',
      properties: {},
      required: []
    };
    
    for (const [field, fieldType] of Object.entries(pattern.fieldTypes)) {
      const config = {
        type: fieldType.type
      };
      
      // 添加约束
      if (pattern.statistics[field]) {
        const stats = pattern.statistics[field];
        
        if (fieldType.type === 'number' || fieldType.type === 'integer') {
          config.constraints = {
            min: stats.min,
            max: stats.max
          };
        }
        
        if (fieldType.type === 'string') {
          config.constraints = {
            minLength: stats.minLength,
            maxLength: stats.maxLength
          };
        }
      }
      
      // 枚举
      if (pattern.enumFields[field]) {
        config.type = 'enum';
        config.constraints = {
          values: pattern.enumFields[field]
        };
      }
      
      // 必需字段
      if (pattern.statistics[field].nullCount === 0) {
        schema.required.push(field);
      }
      
      schema.properties[field] = config;
    }
    
    // 识别 ID 字段
    const idField = pattern.uniqueFields.find(f => 
      f === 'id' || f === '_id' || f.endsWith('Id') || f.endsWith('ID')
    );
    
    if (idField) {
      schema.idField = idField;
      schema.idType = pattern.fieldTypes[idField].type;
    }
    
    return schema;
  }

  /**
   * 注册业务规则
   */
  registerBusinessRule(entityType, rule) {
    if (!this.businessRules.has(entityType)) {
      this.businessRules.set(entityType, []);
    }
    
    this.businessRules.get(entityType).push(rule);
  }

  /**
   * 批量生成
   */
  async generateBatch(entityType, count, paramsFn = () => ({})) {
    const results = [];
    
    for (let i = 0; i < count; i++) {
      const params = typeof paramsFn === 'function' ? paramsFn(i) : paramsFn;
      const data = await this.generate(entityType, params);
      results.push(data);
    }
    
    return results;
  }
}

module.exports = DataGenerator;