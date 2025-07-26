/**
 * Template Engine - 模板引擎
 * 支持动态数据生成的模板系统
 */

const DynamicIDHandler = require('./DynamicIDHandler');
// const { faker } = require('@faker-js/faker'); // 使用内置实现

class TemplateEngine {
  constructor(config = {}) {
    this.config = {
      locale: 'en-US',
      seed: null,
      ...config
    };
    
    // 初始化组件
    this.idHandler = new DynamicIDHandler();
    this.helpers = new Map();
    this.templates = new Map();
    
    // 初始化内置数据生成器
    this.initializeBuiltinGenerators();
    
    // 注册默认助手函数
    this.registerDefaultHelpers();
  }

  /**
   * 注册助手函数
   */
  registerHelper(name, fn) {
    this.helpers.set(name, fn);
  }

  /**
   * 编译模板
   */
  compile(template) {
    const compiled = {
      template,
      placeholders: this.extractPlaceholders(template),
      type: this.detectTemplateType(template)
    };
    
    return compiled;
  }

  /**
   * 渲染模板
   */
  render(compiled, context = {}) {
    if (typeof compiled === 'string') {
      compiled = this.compile(compiled);
    }
    
    switch (compiled.type) {
      case 'object':
        return this.renderObject(compiled.template, context);
      case 'array':
        return this.renderArray(compiled.template, context);
      case 'string':
        return this.renderString(compiled.template, context);
      default:
        return compiled.template;
    }
  }

  /**
   * 渲染对象模板
   */
  renderObject(template, context) {
    const result = {};
    
    for (const [key, value] of Object.entries(template)) {
      result[key] = this.renderValue(value, context);
    }
    
    return result;
  }

  /**
   * 渲染数组模板
   */
  renderArray(template, context) {
    if (template.length === 0) return [];
    
    // 检查是否是重复模板
    if (template.length === 1 && typeof template[0] === 'object' && template[0]._repeat) {
      const { min = 1, max = 10, template: itemTemplate } = template[0]._repeat;
      const count = Math.floor(Math.random() * (max - min + 1)) + min;
      
      const result = [];
      for (let i = 0; i < count; i++) {
        const itemContext = { ...context, _index: i, _count: count };
        result.push(this.renderValue(itemTemplate, itemContext));
      }
      
      return result;
    }
    
    // 普通数组
    return template.map((item, index) => {
      const itemContext = { ...context, _index: index };
      return this.renderValue(item, itemContext);
    });
  }

  /**
   * 渲染字符串模板
   */
  renderString(template, context) {
    return template.replace(/\${([^}]+)}/g, (match, expr) => {
      const value = this.evaluateExpression(expr, context);
      return value !== undefined ? value : match;
    });
  }

  /**
   * 渲染值
   */
  renderValue(value, context) {
    if (value === null || value === undefined) {
      return value;
    }
    
    if (typeof value === 'string' && value.includes('${')) {
      return this.renderString(value, context);
    }
    
    if (Array.isArray(value)) {
      return this.renderArray(value, context);
    }
    
    if (typeof value === 'object') {
      return this.renderObject(value, context);
    }
    
    return value;
  }

  /**
   * 评估表达式
   */
  evaluateExpression(expr, context) {
    // 直接上下文值
    if (context[expr] !== undefined) {
      return context[expr];
    }
    
    // 函数调用
    if (expr.includes(':')) {
      const [func, ...args] = expr.split(':');
      return this.callHelper(func, args, context);
    }
    
    // 属性访问
    if (expr.includes('.')) {
      return this.getNestedValue(context, expr);
    }
    
    // 助手函数
    if (this.helpers.has(expr)) {
      return this.helpers.get(expr)(context);
    }
    
    return undefined;
  }

  /**
   * 调用助手函数
   */
  callHelper(name, args, context) {
    const helper = this.helpers.get(name);
    if (!helper) {
      console.warn(`Helper function not found: ${name}`);
      return undefined;
    }
    
    // 解析参数
    const parsedArgs = args.map(arg => {
      // 尝试 JSON 解析
      try {
        return JSON.parse(arg);
      } catch {
        // 检查是否是上下文引用
        if (context[arg] !== undefined) {
          return context[arg];
        }
        // 返回原始字符串
        return arg;
      }
    });
    
    return helper(context, ...parsedArgs);
  }

  /**
   * 获取嵌套值
   */
  getNestedValue(obj, path) {
    const parts = path.split('.');
    let current = obj;
    
    for (const part of parts) {
      if (current === null || current === undefined) {
        return undefined;
      }
      current = current[part];
    }
    
    return current;
  }

  /**
   * 提取占位符
   */
  extractPlaceholders(template) {
    const placeholders = new Set();
    
    const extract = (value) => {
      if (typeof value === 'string') {
        const matches = value.matchAll(/\${([^}]+)}/g);
        for (const match of matches) {
          placeholders.add(match[1]);
        }
      } else if (Array.isArray(value)) {
        value.forEach(extract);
      } else if (typeof value === 'object' && value !== null) {
        Object.values(value).forEach(extract);
      }
    };
    
    extract(template);
    return Array.from(placeholders);
  }

  /**
   * 检测模板类型
   */
  detectTemplateType(template) {
    if (Array.isArray(template)) return 'array';
    if (typeof template === 'object' && template !== null) return 'object';
    if (typeof template === 'string') return 'string';
    return 'primitive';
  }

  /**
   * 注册默认助手函数
   */
  registerDefaultHelpers() {
    // ID 生成器
    this.registerHelper('id', (ctx, type = 'uuid') => {
      return this.idHandler.generateBatch(type, 1)[0];
    });
    
    this.registerHelper('mongoId', () => {
      return this.idHandler.generateMongoID();
    });
    
    this.registerHelper('uuid', () => {
      return this.idHandler.generateUUID();
    });
    
    // 随机数
    this.registerHelper('randomInt', (ctx, min = 0, max = 100) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    });
    
    this.registerHelper('randomFloat', (ctx, min = 0, max = 1, decimals = 2) => {
      const value = Math.random() * (max - min) + min;
      return parseFloat(value.toFixed(decimals));
    });
    
    this.registerHelper('randomBool', (ctx, probability = 0.5) => {
      return Math.random() < probability;
    });
    
    // 选择器
    this.registerHelper('randomChoice', (ctx, choices) => {
      if (!Array.isArray(choices) || choices.length === 0) return null;
      return choices[Math.floor(Math.random() * choices.length)];
    });
    
    this.registerHelper('selectFromEnum', (ctx, values) => {
      return this.helpers.get('randomChoice')(ctx, values);
    });
    
    this.registerHelper('selectMultiple', (ctx, items, min = 1, max = 3) => {
      const count = Math.floor(Math.random() * (max - min + 1)) + min;
      const shuffled = [...items].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, Math.min(count, items.length));
    });
    
    // 日期时间
    this.registerHelper('now', () => new Date().toISOString());
    
    this.registerHelper('dateTime', (ctx, offset = 0, unit = 'days') => {
      const date = new Date();
      const units = {
        seconds: 1000,
        minutes: 60000,
        hours: 3600000,
        days: 86400000
      };
      
      date.setTime(date.getTime() + offset * (units[unit] || units.days));
      return date.toISOString();
    });
    
    this.registerHelper('timestamp', () => Date.now());
    
    // 个人信息（使用内置生成器）
    this.registerHelper('firstName', () => this.builtinGenerators.firstName());
    this.registerHelper('lastName', () => this.builtinGenerators.lastName());
    this.registerHelper('fullName', () => this.builtinGenerators.fullName());
    this.registerHelper('email', () => this.builtinGenerators.email());
    this.registerHelper('phone', () => this.builtinGenerators.phone());
    this.registerHelper('avatar', () => this.builtinGenerators.avatar());
    
    // 公司信息
    this.registerHelper('companyName', () => this.builtinGenerators.companyName());
    this.registerHelper('jobTitle', () => this.builtinGenerators.jobTitle());
    this.registerHelper('department', () => this.builtinGenerators.department());
    
    // 地址信息
    this.registerHelper('address', () => this.builtinGenerators.address());
    this.registerHelper('city', () => this.builtinGenerators.city());
    this.registerHelper('country', () => this.builtinGenerators.country());
    this.registerHelper('zipCode', () => this.builtinGenerators.zipCode());
    
    // 商品信息
    this.registerHelper('productName', () => this.builtinGenerators.productName());
    this.registerHelper('productDescription', () => this.builtinGenerators.productDescription());
    this.registerHelper('price', (ctx, min = 10, max = 1000) => {
      const price = Math.random() * (max - min) + min;
      return price.toFixed(2);
    });
    
    // 文本生成
    this.registerHelper('lorem', (ctx, count = 1, unit = 'sentences') => {
      return this.builtinGenerators.lorem(count, unit);
    });
    
    // 条件逻辑
    this.registerHelper('if', (ctx, condition, trueValue, falseValue = '') => {
      return condition ? trueValue : falseValue;
    });
    
    // 计算
    this.registerHelper('calc', (ctx, expression) => {
      try {
        // 安全的数学表达式求值
        const sanitized = expression.replace(/[^0-9+\-*/().\s]/g, '');
        return Function('"use strict"; return (' + sanitized + ')')();
      } catch {
        return 0;
      }
    });
    
    // 数组操作
    this.registerHelper('range', (ctx, start, end, step = 1) => {
      const result = [];
      for (let i = start; i < end; i += step) {
        result.push(i);
      }
      return result;
    });
    
    // 字符串操作
    this.registerHelper('upper', (ctx, str) => {
      // 如果参数包含模板变量，先解析它
      if (typeof str === 'string' && str.includes('${')) {
        str = this.renderString(str, ctx);
      }
      return String(str).toUpperCase();
    });
    this.registerHelper('lower', (ctx, str) => {
      // 如果参数包含模板变量，先解析它
      if (typeof str === 'string' && str.includes('${')) {
        str = this.renderString(str, ctx);
      }
      return String(str).toLowerCase();
    });
    this.registerHelper('capitalize', (ctx, str) => {
      // 如果参数包含模板变量，先解析它
      if (typeof str === 'string' && str.includes('${')) {
        str = this.renderString(str, ctx);
      }
      const s = String(str);
      return s.charAt(0).toUpperCase() + s.slice(1);
    });
    
    // JSON 操作
    this.registerHelper('json', (ctx, value) => JSON.stringify(value));
    this.registerHelper('parseJson', (ctx, str) => {
      try {
        return JSON.parse(str);
      } catch {
        return null;
      }
    });
  }

  /**
   * 创建数据生成器
   */
  createGenerator(templateName, template) {
    this.templates.set(templateName, template);
    
    return {
      generate: (context = {}) => {
        const compiled = this.compile(template);
        return this.render(compiled, context);
      },
      generateBatch: (count, contextFn = () => ({})) => {
        const results = [];
        for (let i = 0; i < count; i++) {
          const context = { ...contextFn(i), _index: i, _total: count };
          results.push(this.generate(context));
        }
        return results;
      }
    };
  }

  /**
   * 从文件加载模板
   */
  async loadTemplate(filePath) {
    const fs = require('fs').promises;
    const content = await fs.readFile(filePath, 'utf8');
    
    if (filePath.endsWith('.json')) {
      return JSON.parse(content);
    }
    
    // 支持 JavaScript 模板
    if (filePath.endsWith('.js')) {
      delete require.cache[require.resolve(filePath)];
      return require(filePath);
    }
    
    throw new Error(`Unsupported template file type: ${filePath}`);
  }

  /**
   * 初始化内置生成器
   */
  initializeBuiltinGenerators() {
    // 常用数据集合
    const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emma', 'James', 'Lisa', 'Robert', 'Mary'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
    const companies = ['Tech Corp', 'Global Industries', 'Innovate LLC', 'Digital Solutions', 'Future Systems'];
    const departments = ['Sales', 'Marketing', 'Engineering', 'HR', 'Finance', 'Operations', 'IT', 'Customer Service'];
    const jobTitles = ['Manager', 'Developer', 'Designer', 'Analyst', 'Consultant', 'Specialist', 'Coordinator', 'Director'];
    const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego'];
    const countries = ['USA', 'Canada', 'UK', 'Germany', 'France', 'Japan', 'Australia', 'Brazil'];
    const streets = ['Main St', 'First Ave', 'Park Rd', 'Oak Dr', 'Elm St', 'Market St', 'High St', 'Broadway'];
    const productAdjectives = ['Premium', 'Deluxe', 'Professional', 'Advanced', 'Essential', 'Ultimate', 'Classic', 'Modern'];
    const productTypes = ['Widget', 'Gadget', 'Device', 'Tool', 'System', 'Solution', 'Product', 'Item'];
    const loremWords = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 
                        'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua'];
    
    // 内置生成器方法
    this.builtinGenerators = {
      // 随机选择
      randomFrom: (array) => array[Math.floor(Math.random() * array.length)],
      
      // 个人信息
      firstName: () => this.builtinGenerators.randomFrom(firstNames),
      lastName: () => this.builtinGenerators.randomFrom(lastNames),
      fullName: () => `${this.builtinGenerators.firstName()} ${this.builtinGenerators.lastName()}`,
      
      email: () => {
        const name = `${this.builtinGenerators.firstName().toLowerCase()}.${this.builtinGenerators.lastName().toLowerCase()}`;
        const domains = ['email.com', 'mail.com', 'example.com', 'test.com'];
        return `${name}@${this.builtinGenerators.randomFrom(domains)}`;
      },
      
      phone: () => {
        const area = Math.floor(Math.random() * 900) + 100;
        const prefix = Math.floor(Math.random() * 900) + 100;
        const line = Math.floor(Math.random() * 9000) + 1000;
        return `(${area}) ${prefix}-${line}`;
      },
      
      avatar: () => {
        const id = Math.floor(Math.random() * 100);
        return `https://i.pravatar.cc/150?img=${id}`;
      },
      
      // 公司信息
      companyName: () => this.builtinGenerators.randomFrom(companies),
      department: () => this.builtinGenerators.randomFrom(departments),
      jobTitle: () => `${this.builtinGenerators.randomFrom(jobTitles)} of ${this.builtinGenerators.department()}`,
      
      // 地址信息
      address: () => {
        const number = Math.floor(Math.random() * 9999) + 1;
        return `${number} ${this.builtinGenerators.randomFrom(streets)}`;
      },
      
      city: () => this.builtinGenerators.randomFrom(cities),
      country: () => this.builtinGenerators.randomFrom(countries),
      
      zipCode: () => {
        return String(Math.floor(Math.random() * 90000) + 10000);
      },
      
      // 商品信息
      productName: () => {
        return `${this.builtinGenerators.randomFrom(productAdjectives)} ${this.builtinGenerators.randomFrom(productTypes)}`;
      },
      
      productDescription: () => {
        const product = this.builtinGenerators.productName();
        return `This ${product} is designed for maximum efficiency and reliability. Features advanced technology and premium materials.`;
      },
      
      // Lorem 文本生成
      lorem: (count = 1, unit = 'sentences') => {
        switch (unit) {
          case 'words':
            const words = [];
            for (let i = 0; i < count; i++) {
              words.push(this.builtinGenerators.randomFrom(loremWords));
            }
            return words.join(' ');
            
          case 'sentences':
            const sentences = [];
            for (let i = 0; i < count; i++) {
              const sentenceLength = Math.floor(Math.random() * 10) + 5;
              const sentenceWords = [];
              for (let j = 0; j < sentenceLength; j++) {
                sentenceWords.push(this.builtinGenerators.randomFrom(loremWords));
              }
              const sentence = sentenceWords.join(' ');
              sentences.push(sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.');
            }
            return sentences.join(' ');
            
          case 'paragraphs':
            const paragraphs = [];
            for (let i = 0; i < count; i++) {
              const paragraphSentences = Math.floor(Math.random() * 3) + 3;
              paragraphs.push(this.builtinGenerators.lorem(paragraphSentences, 'sentences'));
            }
            return paragraphs.join('\n\n');
            
          default:
            return this.builtinGenerators.lorem(1, 'sentences');
        }
      }
    };
  }
}

module.exports = TemplateEngine;