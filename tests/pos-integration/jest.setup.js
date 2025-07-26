// Jest setup for POS integration tests

// Global test configuration
global.console = {
  ...console,
  // Suppress console.log during tests unless explicitly needed
  log: process.env.VERBOSE_TESTS ? console.log : jest.fn(),
  debug: process.env.VERBOSE_TESTS ? console.debug : jest.fn(),
  info: process.env.VERBOSE_TESTS ? console.info : jest.fn(),
  warn: console.warn,
  error: console.error,
};

// Increase timeout for integration tests
jest.setTimeout(30000);

// Global test utilities
global.testUtils = {
  generateId: (prefix = 'TEST') => {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
  },
  
  sleep: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
  
  waitForCondition: async (condition, timeout = 5000, interval = 100) => {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      if (await condition()) {
        return true;
      }
      await global.testUtils.sleep(interval);
    }
    throw new Error(`Condition not met within ${timeout}ms`);
  },

  createMockTransaction: (overrides = {}) => {
    return {
      storeId: 'STORE_001',
      registerId: 'REG_001',
      items: [
        {
          productId: 'PROD_001',
          quantity: 1,
          price: 2.50,
          subtotal: 2.50
        }
      ],
      subtotal: 2.50,
      tax: 0.20,
      total: 2.70,
      ...overrides
    };
  },

  createMockProduct: (overrides = {}) => {
    const id = global.testUtils.generateId('PROD');
    return {
      productId: id,
      storeId: 'STORE_001',
      sku: `SKU_${id}`,
      name: `Test Product ${id}`,
      category: 'Test Category',
      price: 9.99,
      quantity: 10,
      ...overrides
    };
  }
};

// Custom matchers
expect.extend({
  toBeValidPOSResponse(received) {
    const pass = (
      received && 
      typeof received === 'object' &&
      received.hasOwnProperty('timestamp') ||
      received.hasOwnProperty('createdAt') ||
      received.hasOwnProperty('updatedAt')
    );

    if (pass) {
      return {
        message: () => `Expected ${received} not to be a valid POS response`,
        pass: true,
      };
    } else {
      return {
        message: () => `Expected ${received} to be a valid POS response with timestamp fields`,
        pass: false,
      };
    }
  },

  toBeValidTransactionId(received) {
    const pass = (
      typeof received === 'string' &&
      received.startsWith('TXN_')
    );

    if (pass) {
      return {
        message: () => `Expected ${received} not to be a valid transaction ID`,
        pass: true,
      };
    } else {
      return {
        message: () => `Expected ${received} to be a valid transaction ID starting with 'TXN_'`,
        pass: false,
      };
    }
  },

  toBeValidProductId(received) {
    const pass = (
      typeof received === 'string' &&
      (received.startsWith('PROD_') || received.startsWith('TEST_PROD_'))
    );

    if (pass) {
      return {
        message: () => `Expected ${received} not to be a valid product ID`,
        pass: true,
      };
    } else {
      return {
        message: () => `Expected ${received} to be a valid product ID`,
        pass: false,
      };
    }
  },

  toHaveValidPOSFields(received) {
    const requiredFields = ['createdAt', 'updatedAt'];
    const missingFields = requiredFields.filter(field => !received.hasOwnProperty(field));

    if (missingFields.length === 0) {
      return {
        message: () => `Expected ${received} not to have valid POS fields`,
        pass: true,
      };
    } else {
      return {
        message: () => `Expected ${received} to have fields: ${missingFields.join(', ')}`,
        pass: false,
      };
    }
  }
});

// Global error handling for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Setup and teardown hooks
beforeAll(async () => {
  // Global setup
  console.log('🚀 Starting POS Integration Tests');
});

afterAll(async () => {
  // Global cleanup
  console.log('✅ POS Integration Tests Complete');
});

beforeEach(async () => {
  // Reset any global state before each test
});

afterEach(async () => {
  // Cleanup after each test
});