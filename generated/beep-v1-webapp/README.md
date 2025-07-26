# Using beep-v1-webapp Mocks

## Quick Start

1. Add to your Jest configuration:

```javascript
// jest.config.js
module.exports = {
  setupFilesAfterEnv: [
    '<rootDir>/generated/beep-v1-webapp/setup-tests.js'
  ]
};
```

2. Use in your tests:

```javascript
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
```

## Available Endpoints

Total mocked endpoints: 154

Sample endpoints:
- /api/cart
- /api/cart/apply-cashback
- /api/cart/applyPromoCode
- /api/cart/applyVoucher
- /api/cart/checkInventory
- /api/cart/pax
- /api/cart/removePromoCode
- /api/cart/unApplyVoucher
- /api/cart/unapply-cashback
- /api/cashback

... and 144 more!
