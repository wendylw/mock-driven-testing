# Using Generated Mocks

This guide shows how to use the auto-generated mocks in your tests.

## 1. For Frontend Repositories (API Mocks)

```javascript
// In your test file
import { server, mockEndpoint } from '../generated/beep-v1-webapp/api-mocks';

describe('UserProfile Component', () => {
  it('should display user data', async () => {
    // Override specific endpoint for this test
    mockEndpoint('get', '/api/user/profile', {
      id: 123,
      name: 'Test User',
      email: 'test@storehub.com'
    });

    const { getByText } = render(<UserProfile />);
    
    await waitFor(() => {
      expect(getByText('Test User')).toBeInTheDocument();
    });
  });
});
```

## 2. For Backend Repositories (Service Stubs)

```javascript
// In your test file
const { authServiceMock, paymentServiceMock } = require('../generated/beep-v1-api/service-stubs');

describe('Order Service', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('should create order with payment', async () => {
    // Setup mock responses
    authServiceMock.validateUser.mockResolvedValue({ valid: true });
    paymentServiceMock.processPayment.mockResolvedValue({ 
      success: true, 
      transactionId: 'TXN-123' 
    });

    const order = await orderService.createOrder({
      userId: 123,
      items: [{ productId: 1, quantity: 2 }],
      payment: { method: 'card' }
    });

    expect(order.status).toBe('confirmed');
    expect(paymentServiceMock.processPayment).toHaveBeenCalledOnce();
  });
});
```

## 3. Testing Error Scenarios

```javascript
// Test error handling with mocks
it('should handle payment failure gracefully', async () => {
  paymentServiceMock.processPayment.mockRejectedValue(
    new Error('Payment declined')
  );

  await expect(
    orderService.createOrder({ /* ... */ })
  ).rejects.toThrow('Payment declined');
});
```

## 4. Integration with Jest Configuration

Add to your `jest.config.js`:

```javascript
module.exports = {
  setupFilesAfterEnv: [
    '<rootDir>/generated/[your-repo]/setup-tests.js'
  ],
  // Other Jest config...
};
```

## 5. Custom Mock Scenarios

```javascript
// Create custom mock scenarios for complex testing
const mockScenarios = {
  happyPath: () => {
    mockEndpoint('get', '/api/products', productList);
    mockEndpoint('get', '/api/inventory', inventoryData);
  },
  
  outOfStock: () => {
    mockEndpoint('get', '/api/products', productList);
    mockEndpoint('get', '/api/inventory', { items: [] });
  },
  
  serverError: () => {
    server.use(
      rest.get('/api/*', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: 'Server error' }));
      })
    );
  }
};

// Use in tests
it('should handle out of stock scenario', () => {
  mockScenarios.outOfStock();
  // ... rest of test
});
```