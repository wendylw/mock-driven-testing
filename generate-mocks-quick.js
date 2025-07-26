#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load the deep analysis report
const report = JSON.parse(
  fs.readFileSync('beep-v1-webapp-deep-analysis.json', 'utf-8')
);

// Mock data generators based on endpoint patterns
const mockGenerators = {
  user: () => ({
    id: Math.floor(Math.random() * 1000),
    name: 'Test User',
    email: 'test@storehub.com',
    phone: '+60123456789'
  }),
  
  cart: () => ({
    id: 'CART-' + Math.random().toString(36).substr(2, 9),
    items: [
      { productId: 1, name: 'Test Product', quantity: 2, price: 29.99 },
      { productId: 2, name: 'Another Product', quantity: 1, price: 49.99 }
    ],
    subtotal: 109.97,
    tax: 10.99,
    total: 120.96
  }),
  
  product: () => ({
    id: Math.floor(Math.random() * 1000),
    name: 'Sample Product',
    description: 'This is a test product',
    price: 99.99,
    stock: 100,
    category: 'Electronics'
  }),
  
  order: () => ({
    id: 'ORD-' + Date.now(),
    status: 'pending',
    items: [],
    total: 299.99,
    createdAt: new Date().toISOString()
  }),
  
  payment: () => ({
    id: 'PAY-' + Math.random().toString(36).substr(2, 9),
    status: 'success',
    amount: 100.00,
    method: 'card',
    last4: '4242'
  }),
  
  cashback: () => ({
    amount: 15.50,
    currency: 'MYR',
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active'
  }),
  
  voucher: () => ({
    id: 'VOUCH-' + Math.random().toString(36).substr(2, 9),
    code: 'SAVE20',
    discount: 20,
    type: 'percentage',
    minSpend: 100,
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  }),
  
  store: () => ({
    id: Math.floor(Math.random() * 100),
    name: 'Test Store',
    address: '123 Test Street',
    rating: 4.5,
    isOpen: true,
    deliveryTime: '30-45 mins'
  }),
  
  transaction: () => ({
    id: 'TXN-' + Date.now(),
    amount: 150.00,
    status: 'completed',
    date: new Date().toISOString(),
    description: 'Purchase at Test Store'
  })
};

// Generate mock response based on endpoint
function generateMockResponse(endpoint) {
  // Default success response
  let mockData = {
    success: true,
    data: null,
    message: 'Mock response generated'
  };

  // Match endpoint patterns
  if (endpoint.includes('cart')) {
    mockData.data = mockGenerators.cart();
  } else if (endpoint.includes('user') || endpoint.includes('consumer')) {
    mockData.data = mockGenerators.user();
  } else if (endpoint.includes('product')) {
    mockData.data = [mockGenerators.product(), mockGenerators.product()];
  } else if (endpoint.includes('order')) {
    mockData.data = mockGenerators.order();
  } else if (endpoint.includes('payment')) {
    mockData.data = mockGenerators.payment();
  } else if (endpoint.includes('cashback')) {
    mockData.data = mockGenerators.cashback();
  } else if (endpoint.includes('voucher')) {
    mockData.data = [mockGenerators.voucher(), mockGenerators.voucher()];
  } else if (endpoint.includes('store')) {
    mockData.data = mockGenerators.store();
  } else if (endpoint.includes('transaction')) {
    mockData.data = [mockGenerators.transaction(), mockGenerators.transaction()];
  } else if (endpoint.includes('address')) {
    mockData.data = {
      id: 1,
      line1: '123 Test Street',
      city: 'Kuala Lumpur',
      state: 'WP',
      postcode: '50000',
      country: 'Malaysia'
    };
  }

  return mockData;
}

// Generate MSW handlers
function generateMSWHandlers() {
  const handlers = report.analysis.apiEndpoints.map(endpoint => {
    const mockResponse = generateMockResponse(endpoint);
    
    return `  rest.get('${endpoint}', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(${JSON.stringify(mockResponse, null, 6).split('\n').join('\n      ')})
    );
  }),`;
  });

  return handlers.join('\n\n');
}

// Generate the mock file
const mockFileContent = `/**
 * Auto-generated API mocks for beep-v1-webapp
 * Generated on: ${new Date().toISOString()}
 * Total endpoints: ${report.analysis.apiEndpoints.length}
 */

import { rest } from 'msw';
import { setupServer } from 'msw/node';

// Mock handlers for all API endpoints
export const handlers = [
${generateMSWHandlers()}
];

// Setup MSW server
export const server = setupServer(...handlers);

// Start server before all tests
beforeAll(() => server.listen());

// Reset handlers after each test
afterEach(() => server.resetHandlers());

// Clean up after all tests
afterAll(() => server.close());

// Helper function to override specific endpoints
export const mockEndpoint = (method, endpoint, response, status = 200) => {
  server.use(
    rest[method](endpoint, (req, res, ctx) => {
      return res(ctx.status(status), ctx.json(response));
    })
  );
};

// Helper to mock error responses
export const mockError = (endpoint, status = 500, message = 'Internal Server Error') => {
  server.use(
    rest.get(endpoint, (req, res, ctx) => {
      return res(
        ctx.status(status),
        ctx.json({ success: false, error: message })
      );
    })
  );
};
`;

// Save the generated mock file
const outputDir = 'generated/beep-v1-webapp';
fs.mkdirSync(outputDir, { recursive: true });

const outputPath = path.join(outputDir, 'api-mocks.js');
fs.writeFileSync(outputPath, mockFileContent);

// Generate a test setup file
const setupFileContent = `/**
 * Test setup for beep-v1-webapp
 * Import this file in your Jest setup
 */

// Import the generated mocks
import './api-mocks';

// Global test utilities
global.mockHelpers = {
  // Reset all mocks
  resetMocks: () => {
    jest.clearAllMocks();
  },
  
  // Wait for async operations
  waitForAsync: () => new Promise(resolve => setTimeout(resolve, 0)),
  
  // Mock localStorage
  mockLocalStorage: () => {
    const storage = {};
    global.localStorage = {
      getItem: (key) => storage[key] || null,
      setItem: (key, value) => { storage[key] = value; },
      removeItem: (key) => { delete storage[key]; },
      clear: () => { Object.keys(storage).forEach(key => delete storage[key]); }
    };
  }
};

// Setup before all tests
beforeAll(() => {
  global.mockHelpers.mockLocalStorage();
});
`;

fs.writeFileSync(path.join(outputDir, 'setup-tests.js'), setupFileContent);

// Generate usage example
const exampleContent = `# Using beep-v1-webapp Mocks

## Quick Start

1. Add to your Jest configuration:

\`\`\`javascript
// jest.config.js
module.exports = {
  setupFilesAfterEnv: [
    '<rootDir>/generated/beep-v1-webapp/setup-tests.js'
  ]
};
\`\`\`

2. Use in your tests:

\`\`\`javascript
import { mockEndpoint, mockError } from '../../generated/beep-v1-webapp/api-mocks';

describe('Cart Component', () => {
  it('should load cart data', async () => {
    // The mock is already set up!
    const response = await fetch('/api/cart');
    const data = await response.json();
    
    expect(data.success).toBe(true);
    expect(data.data.items).toHaveLength(2);
  });

  it('should handle custom responses', async () => {
    // Override for specific test
    mockEndpoint('get', '/api/cart', {
      success: true,
      data: { items: [], total: 0 }
    });
    
    // Test empty cart scenario
  });

  it('should handle errors', async () => {
    // Mock an error
    mockError('/api/cart', 500, 'Server is down');
    
    // Test error handling
  });
});
\`\`\`

## Available Endpoints

Total mocked endpoints: ${report.analysis.apiEndpoints.length}

Sample endpoints:
${report.analysis.apiEndpoints.slice(0, 10).map(e => `- ${e}`).join('\n')}

... and ${report.analysis.apiEndpoints.length - 10} more!
`;

fs.writeFileSync(path.join(outputDir, 'README.md'), exampleContent);

console.log(`
✅ Mock generation complete!

📁 Generated files:
- ${outputPath}
- ${path.join(outputDir, 'setup-tests.js')}
- ${path.join(outputDir, 'README.md')}

📊 Summary:
- Total API endpoints mocked: ${report.analysis.apiEndpoints.length}
- Mock strategies used: MSW (Mock Service Worker)
- Ready for immediate use in tests

🚀 Next steps:
1. Copy the generated files to your beep-v1-webapp project
2. Install MSW: npm install --save-dev msw
3. Add the setup file to your Jest config
4. Start writing isolated tests!
`);