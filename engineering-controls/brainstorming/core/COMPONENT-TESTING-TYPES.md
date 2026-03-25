# 组件测试类型详解

## 一、组件测试的三个层次

### 1. Pure Component Testing（纯UI组件测试）
**测试范围**：只测试组件的渲染逻辑，不涉及业务逻辑

```javascript
// 示例：Button组件
import { render, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button Pure Component', () => {
  it('should render with correct text', () => {
    const { getByText } = render(<Button>Click me</Button>);
    expect(getByText('Click me')).toBeInTheDocument();
  });
  
  it('should call onClick when clicked', () => {
    const handleClick = jest.fn();
    const { getByText } = render(
      <Button onClick={handleClick}>Click me</Button>
    );
    
    fireEvent.click(getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  it('should be disabled when disabled prop is true', () => {
    const { getByRole } = render(<Button disabled>Click me</Button>);
    expect(getByRole('button')).toBeDisabled();
  });
});

特点：
✓ 不涉及API调用
✓ 不涉及复杂状态管理
✓ 测试Props → UI的映射
✓ 测试用户交互 → 事件回调
```

### 2. Business Logic Component Testing（业务逻辑组件测试）
**测试范围**：测试包含业务逻辑的组件，包括状态管理、副作用、数据处理

```javascript
// 示例：ProductList组件（包含业务逻辑）
import { render, fireEvent, waitFor } from '@testing-library/react';
import { ProductList } from './ProductList';

describe('ProductList Business Logic', () => {
  it('should load products on mount', async () => {
    // 这里需要Mock API
    mockAPI.get('/products').reply(200, {
      data: [
        { id: 1, name: 'Coffee', price: 10 },
        { id: 2, name: 'Tea', price: 8 }
      ]
    });
    
    const { getByText, getByTestId } = render(<ProductList />);
    
    // 验证加载状态
    expect(getByText('Loading...')).toBeInTheDocument();
    
    // 验证数据加载后的渲染
    await waitFor(() => {
      expect(getByText('Coffee')).toBeInTheDocument();
      expect(getByText('Tea')).toBeInTheDocument();
    });
  });
  
  it('should handle add to cart', async () => {
    // Mock产品数据
    mockAPI.get('/products').reply(200, mockProducts);
    // Mock添加到购物车
    mockAPI.post('/cart/add').reply(200, { success: true });
    
    const { getByTestId } = render(<ProductList />);
    
    await waitFor(() => {
      fireEvent.click(getByTestId('add-to-cart-1'));
    });
    
    expect(mockAPI.post('/cart/add')).toHaveBeenCalledWith({
      productId: 1,
      quantity: 1
    });
  });
  
  it('should handle API errors', async () => {
    mockAPI.get('/products').reply(500);
    
    const { getByText } = render(<ProductList />);
    
    await waitFor(() => {
      expect(getByText('加载失败，请重试')).toBeInTheDocument();
    });
  });
});

特点：
✓ 涉及API调用
✓ 包含复杂状态管理
✓ 测试业务逻辑流程
✓ 需要Mock外部依赖
```

### 3. Integration Component Testing（集成组件测试）
**测试范围**：测试组件与其他组件或系统的集成

```javascript
// 示例：完整的购物车流程组件测试
import { render, fireEvent, waitFor } from '@testing-library/react';
import { CartProvider } from '../context/CartContext';
import { ProductList } from './ProductList';
import { Cart } from './Cart';

describe('Product to Cart Integration', () => {
  it('should add product to cart and update cart count', async () => {
    // Mock完整的API响应链
    mockAPI.get('/products').reply(200, mockProducts);
    mockAPI.post('/cart/add').reply(200, { 
      success: true, 
      cartCount: 1 
    });
    
    const TestComponent = () => (
      <CartProvider>
        <ProductList />
        <Cart />
      </CartProvider>
    );
    
    const { getByTestId, getByText } = render(<TestComponent />);
    
    // 等待产品加载
    await waitFor(() => {
      expect(getByText('Coffee')).toBeInTheDocument();
    });
    
    // 添加到购物车
    fireEvent.click(getByTestId('add-to-cart-1'));
    
    // 验证购物车状态更新
    await waitFor(() => {
      expect(getByTestId('cart-count')).toHaveTextContent('1');
    });
  });
});

特点：
✓ 测试多个组件协作
✓ 测试状态共享
✓ 测试完整用户流程
✓ 更接近真实使用场景
```

## 二、BEEP项目的组件测试缺失分析

### 当前状态
```javascript
// BEEP项目现状
src/components/
├── Button/
│   ├── Button.tsx
│   └── Button.test.tsx        ✓ 有纯UI测试
├── ProductCard/
│   ├── ProductCard.tsx
│   └── ProductCard.test.tsx   ✓ 有基础测试
├── ProductList/
│   ├── ProductList.tsx
│   └── ❌ 缺少业务逻辑测试
├── Cart/
│   ├── Cart.tsx
│   └── ❌ 缺少状态管理测试
└── Checkout/
    ├── Checkout.tsx
    └── ❌ 缺少完整流程测试
```

### 缺失分析
1. **Pure Component Testing** ✓ 基本覆盖
2. **Business Logic Component Testing** ❌ 严重缺失
3. **Integration Component Testing** ❌ 完全缺失

## 三、Mock-Driven Testing 在不同层次的作用

### 1. Pure Component Testing
```javascript
// MDT价值：有限（纯UI组件不需要复杂Mock）
// 主要用于：提供一致的测试数据格式

const mockProductData = {
  id: 1,
  name: 'Coffee',
  price: 10,
  image: '/images/coffee.jpg'
};

// 确保所有Pure Component测试使用相同的数据结构
```

### 2. Business Logic Component Testing ⭐ 重点价值
```javascript
// MDT核心价值：提供丰富的API场景

describe('ProductList with MDT', () => {
  it('should handle all API scenarios', async () => {
    // 正常场景
    useMockScenario('products.success');
    render(<ProductList />);
    await waitFor(() => expect(screen.getByText('Coffee')).toBeInTheDocument());
    
    // 空数据场景
    useMockScenario('products.empty');
    rerender(<ProductList />);
    await waitFor(() => expect(screen.getByText('暂无商品')).toBeInTheDocument());
    
    // 错误场景
    useMockScenario('products.error');
    rerender(<ProductList />);
    await waitFor(() => expect(screen.getByText('加载失败')).toBeInTheDocument());
    
    // 超时场景
    useMockScenario('products.timeout');
    rerender(<ProductList />);
    await waitFor(() => expect(screen.getByText('请求超时')).toBeInTheDocument());
  });
  
  it('should handle different error types', async () => {
    const errorScenarios = [
      'products.networkError',
      'products.serverError', 
      'products.authError',
      'products.rateLimitError'
    ];
    
    for (const scenario of errorScenarios) {
      useMockScenario(scenario);
      // 验证组件是否正确处理每种错误
    }
  });
});
```

### 3. Integration Component Testing ⭐ 最大价值
```javascript
// MDT核心价值：提供完整的业务流程Mock

describe('Complete Shopping Flow with MDT', () => {
  it('should handle end-to-end shopping with various scenarios', async () => {
    // 使用MDT的流程Mock
    useMockFlow('shopping.complete');
    
    const App = () => (
      <CartProvider>
        <ProductList />
        <Cart />
        <Checkout />
      </CartProvider>
    );
    
    render(<App />);
    
    // Step 1: 浏览商品
    await waitFor(() => screen.getByText('Coffee'));
    fireEvent.click(screen.getByTestId('add-to-cart-1'));
    
    // Step 2: 查看购物车
    expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
    
    // Step 3: 应用优惠券
    fireEvent.click(screen.getByTestId('apply-coupon'));
    fireEvent.change(screen.getByPlaceholderText('优惠券码'), {
      target: { value: 'SAVE20' }
    });
    fireEvent.click(screen.getByText('应用'));
    
    // MDT自动处理优惠券验证
    await waitFor(() => {
      expect(screen.getByText('优惠 $20')).toBeInTheDocument();
    });
    
    // Step 4: 结账
    fireEvent.click(screen.getByText('结账'));
    
    // MDT自动处理支付流程
    await waitFor(() => {
      expect(screen.getByText('订单确认')).toBeInTheDocument();
    });
  });
  
  it('should handle payment failures gracefully', async () => {
    useMockFlow('shopping.paymentFailed');
    
    // 完整的失败流程测试
    // MDT自动模拟支付失败场景
  });
});
```

## 四、BEEP项目推荐的组件测试策略

### 短期目标（2-4周）：补充Business Logic Component Testing
```javascript
// 优先级1：核心业务组件
components/
├── ProductList/
│   └── ProductList.business.test.tsx    # 新增
├── Cart/
│   └── Cart.business.test.tsx           # 新增
├── Checkout/
│   └── Checkout.business.test.tsx       # 新增
└── Search/
    └── Search.business.test.tsx         # 新增

// 重点测试：
1. API调用和错误处理
2. 状态管理逻辑
3. 用户交互响应
4. 数据转换和格式化
```

### 中期目标（1-2个月）：添加Integration Component Testing
```javascript
// 优先级2：关键业务流程
flows/
├── shopping-flow.integration.test.tsx   # 新增
├── user-auth-flow.integration.test.tsx  # 新增
├── coupon-flow.integration.test.tsx     # 新增
└── checkout-flow.integration.test.tsx   # 新增

// 重点测试：
1. 完整的用户流程
2. 组件间状态共享
3. 错误传播和恢复
4. 复杂交互场景
```

### 工具配置
```javascript
// jest.config.js
module.exports = {
  testMatch: [
    '**/*.test.tsx',          // 单元测试
    '**/*.business.test.tsx', // 业务逻辑测试
    '**/*.integration.test.tsx' // 集成测试
  ],
  setupFilesAfterEnv: [
    '<rootDir>/src/test/setup.ts',
    '<rootDir>/src/test/mdt-setup.ts' // MDT配置
  ]
};
```

## 五、总结

对于BEEP项目，我推荐的组件测试重点是：

1. **Business Logic Component Testing**（最急需）
   - 测试包含API调用的组件
   - 测试状态管理逻辑
   - 使用MDT提供的丰富场景

2. **Integration Component Testing**（中期目标）
   - 测试完整的业务流程
   - 测试组件间协作
   - 使用MDT的流程Mock

Pure Component Testing相对来说优先级较低，因为BEEP项目的纯UI组件已经有基本覆盖，而缺失的主要是业务逻辑层面的测试保障。