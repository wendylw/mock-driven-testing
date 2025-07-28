# 集成测试层次详解

## 一、集成测试的四个层次

### 1. Service Integration Test（服务集成测试）
**测试范围**：测试应用与外部服务的集成

```javascript
// 测试前端与API服务的集成
describe('API Service Integration', () => {
  it('should integrate with product API correctly', async () => {
    // 使用真实的HTTP调用，但API返回Mock数据
    const productService = new ProductService({
      baseURL: 'http://localhost:3001' // Mock代理地址
    });
    
    // 测试正常响应
    const products = await productService.getProducts();
    expect(products).toHaveLength(10);
    expect(products[0]).toMatchObject({
      id: expect.any(String),
      name: expect.any(String),
      price: expect.any(Number)
    });
    
    // 测试错误响应
    try {
      await productService.getProducts({ category: 'invalid' });
    } catch (error) {
      expect(error.status).toBe(400);
      expect(error.message).toContain('Invalid category');
    }
  });
  
  it('should handle network failures', async () => {
    // MDT模拟网络问题
    mockServer.use(
      rest.get('/api/products', (req, res, ctx) => {
        return res(ctx.delay(30000)); // 超时
      })
    );
    
    await expect(productService.getProducts()).rejects.toThrow('Network timeout');
  });
  
  it('should retry failed requests', async () => {
    let callCount = 0;
    mockServer.use(
      rest.get('/api/products', (req, res, ctx) => {
        callCount++;
        if (callCount === 1) {
          return res(ctx.status(500));
        }
        return res(ctx.json(mockProducts));
      })
    );
    
    const products = await productService.getProducts();
    expect(products).toBeDefined();
    expect(callCount).toBe(2); // 验证重试机制
  });
});

特点：
✓ 真实的HTTP调用
✓ 测试网络层问题
✓ 验证错误处理
✓ 测试重试机制
```

### 2. Module Integration Test（模块集成测试）
**测试范围**：测试应用内部模块间的集成

```javascript
// 测试React组件与Redux Store的集成
describe('Component-Store Integration', () => {
  it('should integrate ProductList with CartStore', async () => {
    const store = createTestStore();
    
    const { getByTestId, getByText } = render(
      <Provider store={store}>
        <ProductList />
        <Cart />
      </Provider>
    );
    
    // 等待产品加载
    await waitFor(() => {
      expect(getByText('Coffee')).toBeInTheDocument();
    });
    
    // 添加到购物车
    fireEvent.click(getByTestId('add-to-cart-1'));
    
    // 验证Store状态更新
    const state = store.getState();
    expect(state.cart.items).toHaveLength(1);
    expect(state.cart.items[0].productId).toBe('1');
    
    // 验证UI反映Store变化
    expect(getByTestId('cart-count')).toHaveTextContent('1');
  });
  
  it('should integrate Search with ProductList', async () => {
    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <Search />
        <ProductList />
      </Provider>
    );
    
    // 搜索操作
    fireEvent.change(getByPlaceholderText('搜索商品'), {
      target: { value: 'coffee' }
    });
    fireEvent.click(getByText('搜索'));
    
    // 验证搜索结果
    await waitFor(() => {
      expect(getByText('Colombian Coffee')).toBeInTheDocument();
      expect(queryByText('Green Tea')).not.toBeInTheDocument();
    });
  });
});

特点：
✓ 测试状态管理集成
✓ 测试组件间通信
✓ 测试数据流
✓ 测试副作用
```

### 3. System Integration Test（系统集成测试）
**测试范围**：测试完整的业务流程，跨多个模块和服务

```javascript
// 测试完整的电商业务流程
describe('E-commerce System Integration', () => {
  it('should complete full purchase journey', async () => {
    // 使用MDT提供完整的业务流程Mock
    useMockFlow('ecommerce.purchaseJourney');
    
    const store = createTestStore();
    
    const { getByTestId, getByText, getByPlaceholderText } = render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    );
    
    // Step 1: 用户登录
    fireEvent.click(getByText('登录'));
    fireEvent.change(getByPlaceholderText('邮箱'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(getByPlaceholderText('密码'), {
      target: { value: 'password' }
    });
    fireEvent.click(getByText('提交'));
    
    await waitFor(() => {
      expect(getByText('欢迎回来')).toBeInTheDocument();
    });
    
    // Step 2: 浏览商品
    fireEvent.click(getByText('商品'));
    await waitFor(() => {
      expect(getByText('Coffee')).toBeInTheDocument();
    });
    
    // Step 3: 添加到购物车
    fireEvent.click(getByTestId('add-to-cart-1'));
    expect(getByTestId('cart-count')).toHaveTextContent('1');
    
    // Step 4: 应用优惠券
    fireEvent.click(getByTestId('cart-icon'));
    fireEvent.change(getByPlaceholderText('优惠券码'), {
      target: { value: 'SAVE20' }
    });
    fireEvent.click(getByText('应用'));
    
    await waitFor(() => {
      expect(getByText('节省 $20')).toBeInTheDocument();
    });
    
    // Step 5: 结账
    fireEvent.click(getByText('结账'));
    
    // 填写送货地址
    fireEvent.change(getByPlaceholderText('街道地址'), {
      target: { value: '123 Main St' }
    });
    
    // Step 6: 支付
    fireEvent.click(getByText('信用卡支付'));
    fireEvent.change(getByPlaceholderText('卡号'), {
      target: { value: '4111111111111111' }
    });
    fireEvent.click(getByText('确认支付'));
    
    // Step 7: 确认订单完成
    await waitFor(() => {
      expect(getByText('订单确认')).toBeInTheDocument();
      expect(getByText('订单号：')).toBeInTheDocument();
    });
    
    // 验证最终状态
    const finalState = store.getState();
    expect(finalState.order.status).toBe('completed');
    expect(finalState.cart.items).toHaveLength(0);
  });
  
  it('should handle payment failures gracefully', async () => {
    useMockFlow('ecommerce.paymentFailure');
    
    // 重复上面流程到支付步骤
    // ...
    
    fireEvent.click(getByText('确认支付'));
    
    // 验证支付失败处理
    await waitFor(() => {
      expect(getByText('支付失败')).toBeInTheDocument();
      expect(getByText('请重试或更换支付方式')).toBeInTheDocument();
    });
    
    // 验证用户可以重试
    fireEvent.click(getByText('重试'));
    // ...
  });
});

特点：
✓ 跨多个页面/模块
✓ 完整的用户旅程
✓ 真实的业务场景
✓ 复杂的状态变化
```

### 4. End-to-End Integration Test（端到端集成测试）
**测试范围**：在真实浏览器环境中测试完整应用

```javascript
// 使用Cypress进行E2E集成测试
describe('E2E Purchase Flow', () => {
  it('should complete purchase with real browser interactions', () => {
    // 启动MDT Mock服务
    cy.setupMockServer();
    
    // 访问应用
    cy.visit('/');
    
    // 登录
    cy.get('[data-testid="login-button"]').click();
    cy.get('[data-testid="email-input"]').type('test@example.com');
    cy.get('[data-testid="password-input"]').type('password');
    cy.get('[data-testid="submit-button"]').click();
    
    // 等待登录完成
    cy.contains('欢迎回来').should('be.visible');
    
    // 浏览商品
    cy.get('[data-testid="products-link"]').click();
    cy.contains('Coffee').should('be.visible');
    
    // 添加到购物车
    cy.get('[data-testid="add-to-cart-1"]').click();
    cy.get('[data-testid="cart-count"]').should('contain', '1');
    
    // 查看购物车
    cy.get('[data-testid="cart-icon"]').click();
    cy.contains('Coffee').should('be.visible');
    
    // 应用优惠券
    cy.get('[data-testid="coupon-input"]').type('SAVE20');
    cy.get('[data-testid="apply-coupon"]').click();
    cy.contains('节省 $20').should('be.visible');
    
    // 结账
    cy.get('[data-testid="checkout-button"]').click();
    
    // 填写配送信息
    cy.get('[data-testid="address-input"]').type('123 Main St');
    cy.get('[data-testid="city-input"]').type('New York');
    cy.get('[data-testid="zip-input"]').type('10001');
    
    // 选择支付方式
    cy.get('[data-testid="credit-card-option"]').click();
    cy.get('[data-testid="card-number"]').type('4111111111111111');
    cy.get('[data-testid="expiry"]').type('12/25');
    cy.get('[data-testid="cvv"]').type('123');
    
    // 确认支付
    cy.get('[data-testid="confirm-payment"]').click();
    
    // 验证订单完成
    cy.contains('订单确认').should('be.visible');
    cy.contains('订单号：').should('be.visible');
    
    // 验证跳转到订单详情页
    cy.url().should('include', '/order/');
  });
  
  it('should handle responsive design on mobile', () => {
    cy.viewport('iphone-x');
    // 重复关键流程，验证移动端体验
  });
});

特点：
✓ 真实浏览器环境
✓ 真实用户交互
✓ 跨浏览器测试
✓ 移动端测试
✓ 性能测试
```

## 二、BEEP项目的集成测试缺失分析

### 当前状态
```
集成测试层级               BEEP现状        缺失程度
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Service Integration       ❌ 完全缺失      严重
Module Integration         ❌ 完全缺失      严重  
System Integration        ❌ 完全缺失      严重
E2E Integration           ⚠️ 少量手动      中等
```

### 具体缺失
```javascript
// 1. Service Integration - 完全缺失
services/
├── ProductService.ts
├── CartService.ts
├── OrderService.ts
└── ❌ 无任何服务集成测试

// 2. Module Integration - 完全缺失
components/
├── ProductList/
├── Cart/
├── Checkout/
└── ❌ 无模块间集成测试

// 3. System Integration - 完全缺失
flows/
└── ❌ 无完整业务流程测试

// 4. E2E Integration - 少量存在
e2e/
├── login.spec.js          ✓ 有
└── ❌ 缺少完整购物流程
```

## 三、Mock-Driven Testing 在测试金字塔中的作用

### 测试金字塔 + MDT价值分布图
```
                    /\
                   /E2E\        ✓ 提供稳定后端环境
                  /------\      ⭐ 减少环境依赖问题
                 /System \      ⭐⭐⭐⭐ 最大价值区域
                /----------\    完整业务流程Mock
               /Integration\    ⭐⭐⭐ 核心价值区域  
              /--------------\  API集成测试支持
             /   Component    \ ⭐⭐ 重要价值区域
            /------------------\ 业务组件测试增强
           /      Unit          \ ✓ 提供一致测试数据
          /______________________\ 基础支持
          
MDT价值密度：        低 ←→ 高
Unit Test:           ⭐
Component Test:      ⭐⭐  
Integration Test:    ⭐⭐⭐
System Test:         ⭐⭐⭐⭐
E2E Test:           ⭐
```

### MDT在各层级的具体作用
```
层级              MDT作用                    价值程度
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Unit Test        提供一致的测试数据           ⭐
Component Test   丰富的API状态场景           ⭐⭐
Integration Test API集成+错误场景测试        ⭐⭐⭐
System Test      完整业务流程Mock           ⭐⭐⭐⭐
E2E Test         稳定的测试环境              ⭐
```

## 四、Mock-Driven Testing 在各层次的价值

### 1. Service Integration Test ⭐⭐⭐
```javascript
// MDT最大价值：提供稳定的API测试环境
describe('Product Service Integration with MDT', () => {
  beforeEach(() => {
    // MDT提供一致的测试环境
    mockServer.resetToDefaults();
  });
  
  it('should test all API scenarios', async () => {
    const scenarios = [
      'products.success',
      'products.empty', 
      'products.serverError',
      'products.timeout',
      'products.authError'
    ];
    
    for (const scenario of scenarios) {
      useMockScenario(scenario);
      // 测试服务在每种场景下的行为
      const result = await productService.getProducts();
      // 验证错误处理、重试机制等
    }
  });
});
```

### 2. Module Integration Test ⭐⭐⭐
```javascript
// MDT价值：提供组件间集成的数据一致性
describe('Cart-Product Integration with MDT', () => {
  it('should maintain data consistency across modules', async () => {
    // 所有组件使用相同的Mock数据
    useMockScenario('shopping.cartFlow');
    
    // 测试ProductList → Cart → Checkout的数据流
    // 确保数据在各个模块间正确传递
  });
});
```

### 3. System Integration Test ⭐⭐⭐⭐
```javascript
// MDT最大价值：提供完整业务流程的Mock
describe('Complete Shopping System with MDT', () => {
  it('should support full business journey', async () => {
    // MDT提供端到端的Mock流程
    useMockFlow('ecommerce.complete');
    
    // 测试：登录→浏览→购物车→优惠券→支付→确认
    // 所有API调用都有对应的Mock响应
  });
});
```

### 4. E2E Integration Test ⭐⭐
```javascript
// MDT价值：提供可控的E2E测试环境
describe('E2E with MDT', () => {
  beforeEach(() => {
    // 启动MDT Mock服务，提供稳定的后端
    cy.setupMDTServer();
  });
  
  it('should test with controlled backend', () => {
    // E2E测试不再依赖真实后端服务
    // 可以控制各种场景和错误情况
  });
});
```

## 四、BEEP项目集成测试实施建议

### Phase 1: Service Integration Test（2-3周）
```javascript
// 优先实施
tests/integration/services/
├── ProductService.integration.test.ts     # 新增
├── CartService.integration.test.ts        # 新增
├── OrderService.integration.test.ts       # 新增
├── UserService.integration.test.ts        # 新增
└── PaymentService.integration.test.ts     # 新增

重点：
- 所有API调用的错误处理
- 网络问题处理
- 重试机制验证
- 数据格式验证
```

### Phase 2: Module Integration Test（3-4周）
```javascript
tests/integration/modules/
├── cart-product.integration.test.tsx      # 新增
├── search-product.integration.test.tsx    # 新增
├── auth-user.integration.test.tsx         # 新增
└── checkout-payment.integration.test.tsx  # 新增

重点：
- 组件间状态同步
- 数据流验证
- 副作用处理
- 错误传播
```

### Phase 3: System Integration Test（4-6周）
```javascript
tests/integration/flows/
├── shopping-flow.integration.test.tsx     # 新增
├── user-auth-flow.integration.test.tsx    # 新增
├── coupon-flow.integration.test.tsx       # 新增
└── refund-flow.integration.test.tsx       # 新增

重点：
- 完整业务流程
- 跨页面状态管理
- 复杂用户场景
- 异常情况恢复
```

### Phase 4: E2E Integration Test（2-3周）
```javascript
e2e/flows/
├── complete-purchase.e2e.test.js          # 增强
├── mobile-shopping.e2e.test.js            # 新增
├── error-recovery.e2e.test.js             # 新增
└── performance.e2e.test.js                # 新增

重点：
- 跨浏览器兼容
- 移动端体验
- 性能基准
- 可访问性
```

## 五、工具配置建议

### Jest配置
```javascript
// jest.config.js
module.exports = {
  projects: [
    {
      displayName: 'unit',
      testMatch: ['**/*.test.{ts,tsx}']
    },
    {
      displayName: 'integration-service',
      testMatch: ['**/integration/services/*.test.{ts,tsx}'],
      setupFilesAfterEnv: ['<rootDir>/src/test/integration-setup.ts']
    },
    {
      displayName: 'integration-module', 
      testMatch: ['**/integration/modules/*.test.{ts,tsx}'],
      setupFilesAfterEnv: ['<rootDir>/src/test/integration-setup.ts']
    },
    {
      displayName: 'integration-system',
      testMatch: ['**/integration/flows/*.test.{ts,tsx}'],
      setupFilesAfterEnv: ['<rootDir>/src/test/system-setup.ts']
    }
  ]
};
```

### MDT集成配置
```javascript
// src/test/integration-setup.ts
import { setupMockServer } from '@mdt/testing';

beforeAll(() => {
  // 启动MDT Mock服务器
  mockServer = setupMockServer({
    project: 'beep-webapp',
    scenarios: 'all'
  });
});

beforeEach(() => {
  // 每个测试前重置为默认场景
  mockServer.resetToDefaults();
});
```

## 六、总结

集成测试的四个层次各有重点：

1. **Service Integration**：测试与外部服务的集成
2. **Module Integration**：测试内部模块间的集成  
3. **System Integration**：测试完整业务流程
4. **E2E Integration**：测试真实环境下的用户体验

BEEP项目在前三个层次完全缺失，这正是MDT能发挥最大价值的地方：**提供稳定、可控、场景丰富的集成测试环境**。