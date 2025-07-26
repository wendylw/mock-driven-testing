/**
 * 参数化Mock补丁 - 最小侵入式增强现有proxy-final.js
 * 
 * 使用方法：
 * 1. 保持现有proxy-final.js不变
 * 2. 在API请求中添加 ?_mock=1 参数即可使用参数化Mock
 * 3. 添加 ?_demo=1 查看参数化功能演示
 */

const DataGenerator = require('./parameterized-mocks/entities/DataGenerator');
const DynamicIDHandler = require('./parameterized-mocks/entities/DynamicIDHandler');

class ParameterizedMockPatch {
  constructor() {
    this.dataGenerator = new DataGenerator();
    this.idHandler = new DynamicIDHandler();
    this.initialized = false;
  }

  // 延迟初始化，只在需要时执行
  initialize() {
    if (this.initialized) return;

    // 简单的用户模式
    this.dataGenerator.registerSchema('user', {
      properties: {
        id: { template: '${uuid}' },
        name: { template: '${fullName}' },
        email: { template: '${email}' },
        avatar: { template: '${avatar}' },
        createdAt: { template: '${dateTime:-30:days}' }
      }
    });

    // 简单的产品模式  
    this.dataGenerator.registerSchema('product', {
      properties: {
        id: { template: '${randomInt:1000:9999}' },
        name: { template: '${productName}' },
        price: { template: '${randomFloat:10:1000:2}' },
        inStock: { template: '${randomBool:0.8}' }
      }
    });

    // 支持复数形式的实体类型
    this.dataGenerator.registerSchema('products', {
      properties: {
        id: { template: '${randomInt:1000:9999}' },
        name: { template: '${productName}' },
        price: { template: '${randomFloat:10:1000:2}' },
        inStock: { template: '${randomBool:0.8}' },
        category: { template: '${randomChoice:["Electronics","Books","Clothing","Food"]}' }
      }
    });

    this.dataGenerator.registerSchema('users', {
      properties: {
        id: { template: '${uuid}' },
        name: { template: '${fullName}' },
        email: { template: '${email}' },
        avatar: { template: '${avatar}' },
        createdAt: { template: '${dateTime:-30:days}' }
      }
    });

    // 基于捕获的API添加更多实体类型
    this.dataGenerator.registerSchema('stores', {
      properties: {
        id: { template: '${id:mongodb}' },
        name: { template: '${companyName}' },
        address: { template: '${address}' },
        phone: { template: '${phone}' },
        isOpen: { template: '${randomBool:0.8}' },
        rating: { template: '${randomFloat:3.5:5.0:1}' }
      }
    });

    this.dataGenerator.registerSchema('orders', {
      properties: {
        id: { template: '${id:prefixed:ORD:-}' },
        userId: { template: '${uuid}' },
        status: { template: '${randomChoice:["pending","processing","shipped","delivered"]}' },
        total: { template: '${randomFloat:10:500:2}' },
        createdAt: { template: '${dateTime:-7:days}' }
      }
    });

    this.initialized = true;
    console.log('🎯 参数化Mock补丁已初始化');
  }

  // 生成GraphQL响应
  async generateGraphQLResponse(parsedUrl, requestBody) {
    const operationName = parsedUrl.pathname.replace('/api/gql/', '');
    
    try {
      const body = typeof requestBody === 'string' ? JSON.parse(requestBody) : requestBody;
      const variables = body.variables || {};
      
      switch (operationName) {
        case 'ProductDetail':
          return this.generateProductDetailResponse(variables);
        case 'OnlineCategory':
          return this.generateOnlineCategoryResponse(variables);
        case 'CoreStores':
          return this.generateCoreStoresResponse(variables);
        default:
          return {
            data: null,
            errors: [{ message: `GraphQL operation ${operationName} not supported in mock` }],
            _mock: true,
            _graphql: true
          };
      }
    } catch (error) {
      return {
        data: null,
        errors: [{ message: 'Invalid GraphQL request body', details: error.message }],
        _mock: true,
        _graphql: true
      };
    }
  }

  // 生成ProductDetail响应
  async generateProductDetailResponse(variables) {
    const { productId, variationId } = variables;
    
    // 基于productId生成稳定的产品数据
    const productData = {
      id: productId || this.idHandler.generateUUID(),
      name: `${this.generateProductName(productId)} ${variationId ? `(${variationId})` : ''}`,
      description: `This is a detailed description for product ${productId}. Made with premium ingredients and crafted with care.`,
      price: this.generatePriceFromId(productId),
      currency: "MYR",
      currencySymbol: "RM",
      availability: this.hashId(productId, 5) % 10 > 2,
      images: [
        `https://picsum.photos/400/300?random=${this.hashId(productId, 1)}`,
        `https://picsum.photos/400/300?random=${this.hashId(productId, 2)}`
      ],
      category: {
        id: this.idHandler.generateUUID(),
        name: this.generateCategoryName(productId),
        slug: this.generateCategorySlug(productId)
      },
      variations: variationId ? [{
        id: variationId,
        name: `Variation ${variationId}`,
        price: this.generatePriceFromId(variationId),
        availability: true
      }] : [],
      nutritionalInfo: {
        calories: 100 + (this.hashId(productId, 6) % 400),
        protein: 5 + (this.hashId(productId, 7) % 25),
        carbs: 10 + (this.hashId(productId, 8) % 40),
        fat: 2 + (this.hashId(productId, 9) % 20)
      },
      allergens: this.generateAllergens(productId),
      tags: this.generateProductTags(productId)
    };

    return {
      data: {
        productDetail: productData
      },
      _mock: true,
      _graphql: true,
      _parameterized: true
    };
  }

  // 辅助方法：基于ID生成稳定的产品名称
  generateProductName(id) {
    const adjectives = ['Premium', 'Artisan', 'Classic', 'Special', 'Signature', 'House', 'Original'];
    const products = ['Coffee', 'Latte', 'Cappuccino', 'Americano', 'Espresso', 'Mocha', 'Macchiato'];
    
    const hash = this.hashId(id, 0);
    const adj = adjectives[hash % adjectives.length];
    const prod = products[(hash >> 3) % products.length];
    
    return `${adj} ${prod}`;
  }

  // 辅助方法：基于ID生成稳定的价格
  generatePriceFromId(id) {
    const hash = this.hashId(id, 1);
    const basePrice = 5.50 + (hash % 20); // 5.50 - 24.50 range
    return parseFloat(basePrice.toFixed(2));
  }

  // 辅助方法：基于ID生成稳定的分类
  generateCategoryName(id) {
    const categories = ['Hot Beverages', 'Cold Beverages', 'Pastries', 'Sandwiches', 'Salads', 'Desserts'];
    const hash = this.hashId(id, 2);
    return categories[hash % categories.length];
  }

  // 辅助方法：生成分类slug
  generateCategorySlug(id) {
    return this.generateCategoryName(id).toLowerCase().replace(/\s+/g, '-');
  }

  // 辅助方法：生成过敏原信息
  generateAllergens(id) {
    const allAllergens = ['milk', 'nuts', 'gluten', 'soy', 'eggs'];
    const hash = this.hashId(id, 3);
    const count = hash % 3; // 0-2 allergens
    
    const allergens = [];
    for (let i = 0; i < count; i++) {
      const allergen = allAllergens[(hash + i) % allAllergens.length];
      if (!allergens.includes(allergen)) {
        allergens.push(allergen);
      }
    }
    return allergens;
  }

  // 辅助方法：生成产品标签
  generateProductTags(id) {
    const allTags = ['popular', 'new', 'bestseller', 'vegan', 'organic', 'fair-trade', 'seasonal'];
    const hash = this.hashId(id, 4);
    const count = 1 + (hash % 3); // 1-3 tags
    
    const tags = [];
    for (let i = 0; i < count; i++) {
      const tag = allTags[(hash + i) % allTags.length];
      if (!tags.includes(tag)) {
        tags.push(tag);
      }
    }
    return tags;
  }

  // 辅助方法：基于字符串生成稳定的hash值
  hashId(str, seed = 0) {
    if (!str) return seed;
    let hash = seed;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash + str.charCodeAt(i)) & 0xffffffff;
    }
    return Math.abs(hash);
  }

  // 检查是否应该使用Mock
  shouldUseMock(url) {
    return url.includes('_mock=1') || url.includes('_demo=1');
  }

  // 生成Mock响应
  async generateResponse(parsedUrl, method, requestBody) {
    this.initialize();

    const query = new URLSearchParams(parsedUrl.query || '');
    
    // 演示模式
    if (query.get('_demo') === '1') {
      return {
        message: '🎯 参数化Mock演示',
        instructions: {
          usage: '在任何API请求后添加 ?_mock=1 即可启用参数化Mock',
          examples: [
            '/api/users?_mock=1',
            '/api/users/123?_mock=1', 
            '/api/products?limit=5&_mock=1'
          ]
        },
        sample_data: {
          user: await this.dataGenerator.generate('user'),
          product: await this.dataGenerator.generate('product')
        },
        id_examples: {
          uuid: this.idHandler.generateUUID(),
          numeric: this.idHandler.generateNumericID(),
          prefixed: this.idHandler.generatePrefixedID({ prefix: 'DEMO' })
        }
      };
    }

    // 处理GraphQL请求
    if (parsedUrl.pathname.startsWith('/api/gql/')) {
      return this.generateGraphQLResponse(parsedUrl, requestBody);
    }

    // 解析REST端点
    const pathMatch = parsedUrl.pathname.match(/^\/api\/(\w+)(?:\/(.+))?/);
    if (!pathMatch) {
      return { error: 'Invalid API endpoint' };
    }

    const [, entityType, entityId] = pathMatch;
    const limit = Math.min(parseInt(query.get('limit')) || 5, 20);

    try {
      if (entityId) {
        // 单个实体
        const entity = await this.dataGenerator.generate(entityType, { id: entityId });
        return {
          success: true,
          data: entity,
          _mock: true,
          _parameterized: true
        };
      } else {
        // 实体列表
        const entities = await this.dataGenerator.generateBatch(entityType, limit);
        return {
          success: true,
          data: entities,
          count: entities.length,
          _mock: true,
          _parameterized: true
        };
      }
    } catch (error) {
      return {
        error: 'Mock generation failed',
        details: error.message,
        _mock: true
      };
    }
  }
}

// 创建全局补丁实例
const mockPatch = new ParameterizedMockPatch();

// 导出补丁函数，可以在proxy-final.js中调用
module.exports = {
  // 检查是否需要Mock
  shouldUseMock: (url) => mockPatch.shouldUseMock(url),
  
  // 生成Mock响应
  generateMockResponse: async (parsedUrl, method, requestBody) => {
    return await mockPatch.generateResponse(parsedUrl, method, requestBody);
  },
  
  // 获取补丁信息
  getPatchInfo: () => ({
    name: 'Parameterized Mock Patch',
    version: '1.0.0',
    initialized: mockPatch.initialized,
    usage: 'Add ?_mock=1 to any API request to use parameterized mock'
  })
};