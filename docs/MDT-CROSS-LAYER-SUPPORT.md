# Mock-Driven Testing 跨层级支持机制

## 一、MDT跨层级支持的核心原理

### 1.1 统一的Mock数据源
```javascript
// MDT的核心：一份Mock数据，服务所有测试层级
const productAPIMock = {
  // 基础数据结构（服务Unit Test）
  baseData: {
    id: 'prod_123',
    name: 'Colombian Coffee',
    price: 29.99,
    category: 'coffee',
    stock: 100
  },
  
  // 多场景支持（服务Component/Integration Test）
  scenarios: {
    normal: { 
      status: 200, 
      data: baseData 
    },
    outOfStock: { 
      status: 200, 
      data: { ...baseData, stock: 0 } 
    },
    serverError: { 
      status: 500, 
      error: 'Internal Server Error' 
    },
    timeout: { 
      delay: 30000 
    }
  },
  
  // 业务流程支持（服务System Test）
  flows: {
    'purchase.complete': [
      { step: 'getProduct', scenario: 'normal' },
      { step: 'addToCart', scenario: 'success' },
      { step: 'checkout', scenario: 'success' }
    ]
  }
};
```

### 1.2 分层适配机制
```javascript
// MDT根据测试层级自动适配Mock粒度
class MDTLayerAdapter {
  // Unit Test：提供纯数据
  getUnitTestData(apiPath) {
    return this.mockStore.getBaseData(apiPath);
  }
  
  // Component Test：提供带状态的场景
  getComponentTestScenario(apiPath, scenario) {
    return this.mockStore.getScenario(apiPath, scenario);
  }
  
  // Integration Test：提供API级别的Mock
  getIntegrationTestMock(apiPath) {
    return this.mockStore.getAllScenarios(apiPath);
  }
  
  // System Test：提供完整业务流程
  getSystemTestFlow(flowName) {
    return this.mockStore.getFlow(flowName);
  }
}
```

## 二、开发过程中的跨层级支持

### 2.1 开发阶段1：单个组件开发（Unit + Component层级）

#### 开发者工作流程
```javascript
// Step 1: 开发者启动组件开发
$ mdt dev --component ProductCard

// MDT自动提供：
// 1. Unit Test数据（纯对象）
// 2. Component Test场景（API响应）

// Step 2: 编写组件
function ProductCard({ productId }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchProduct(productId)
      .then(setProduct)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [productId]);
  
  // 组件渲染逻辑...
}

// Step 3: 同时进行的测试
describe('ProductCard', () => {
  // Unit Test：测试纯函数逻辑
  it('should format price correctly', () => {
    const product = MDT.getUnitData('product.base');
    expect(formatPrice(product.price)).toBe('$29.99');
  });
  
  // Component Test：测试完整组件行为
  it('should handle all states', async () => {
    // 加载状态
    MDT.useScenario('product.loading');
    render(<ProductCard productId="123" />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    // 成功状态
    MDT.useScenario('product.success');
    await waitFor(() => {
      expect(screen.getByText('Colombian Coffee')).toBeInTheDocument();
    });
    
    // 错误状态
    MDT.useScenario('product.error');
    await waitFor(() => {
      expect(screen.getByText('加载失败')).toBeInTheDocument();
    });
  });
});
```

#### MDT在此阶段的支持
```javascript
// 自动生成多层级测试数据
MDT.generateForComponent('ProductCard', {
  // Unit层级：纯数据
  unitData: {
    product: { id: '123', name: 'Coffee', price: 29.99 }
  },
  
  // Component层级：API场景
  scenarios: {
    loading: { pending: true },
    success: { status: 200, data: product },
    error: { status: 500, error: 'Server Error' },
    empty: { status: 200, data: null }
  }
});
```

### 2.2 开发阶段2：模块集成开发（Integration层级）

#### 开发者工作流程
```javascript
// Step 1: 开发多组件协作功能
$ mdt dev --module ShoppingCart

// 涉及组件：ProductList + CartSummary + CheckoutButton
// MDT自动提供模块间集成的Mock

// Step 2: 开发购物车逻辑
function ShoppingCart() {
  return (
    <CartProvider>
      <ProductList />      {/* 需要商品数据 */}
      <CartSummary />      {/* 需要购物车数据 */}
      <CheckoutButton />   {/* 需要订单数据 */}
    </CartProvider>
  );
}

// Step 3: 集成测试
describe('Shopping Cart Integration', () => {
  it('should integrate all cart components', async () => {
    // MDT提供一致的数据流
    MDT.useIntegrationScenario('cart.completeFlow');
    
    render(<ShoppingCart />);
    
    // 测试：选择商品 → 添加购物车 → 计算总价 → 准备结账
    fireEvent.click(screen.getByTestId('add-to-cart-1'));
    
    await waitFor(() => {
      expect(screen.getByText('1 item')).toBeInTheDocument();
      expect(screen.getByText('$29.99')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Checkout'));
    // 验证所有组件状态同步
  });
});
```

#### MDT在此阶段的支持
```javascript
// 提供模块级别的数据一致性
MDT.createIntegrationScenario('cart.completeFlow', {
  // 确保所有相关API返回一致的数据
  apis: {
    'GET /products': { data: [product1, product2] },
    'POST /cart/add': { success: true, cartId: 'cart_123' },
    'GET /cart/summary': { items: 1, total: 29.99 },
    'POST /checkout/prepare': { orderId: 'order_456' }
  },
  
  // 定义数据关联关系
  dataFlow: {
    'product.id' → 'cart.item.productId' → 'order.item.productId'
  }
});
```

### 2.3 开发阶段3：完整流程开发（System层级）

#### 开发者工作流程
```javascript
// Step 1: 开发完整业务流程
$ mdt dev --flow PurchaseFlow

// 涉及页面：ProductBrowse → Cart → Checkout → Payment → Confirmation

// Step 2: 系统级测试
describe('Complete Purchase Flow', () => {
  it('should handle end-to-end purchase', async () => {
    // MDT提供完整业务流程Mock
    MDT.useSystemFlow('ecommerce.purchase');
    
    // 测试完整用户旅程
    await runPurchaseFlow();
    
    // 验证每个步骤的状态转换
    expect(finalState.order.status).toBe('completed');
  });
});
```

#### MDT在此阶段的支持
```javascript
// 提供完整业务流程的Mock编排
MDT.createSystemFlow('ecommerce.purchase', {
  steps: [
    { name: 'browse', apis: ['GET /products'], duration: 2000 },
    { name: 'addToCart', apis: ['POST /cart/add'], trigger: 'user.click' },
    { name: 'applyCoupon', apis: ['POST /coupon/apply'], optional: true },
    { name: 'checkout', apis: ['POST /checkout'], require: ['cart.notEmpty'] },
    { name: 'payment', apis: ['POST /payment'], scenarios: ['success', 'failed'] },
    { name: 'confirm', apis: ['GET /order/status'], final: true }
  ],
  
  // 流程中的状态管理
  state: {
    cart: { items: [], total: 0 },
    user: { authenticated: true },
    order: { id: null, status: 'pending' }
  }
});
```

## 三、测试环节中的跨层级支持

### 3.1 测试人员的统一工作界面

#### 测试管理平台
```javascript
// 测试人员看到的统一界面
MDT Testing Platform
├── Unit Test Data          // 基础测试数据管理
│   ├── 产品数据
│   ├── 用户数据
│   └── 订单数据
├── Component Test Scenarios // 组件测试场景管理
│   ├── 加载状态
│   ├── 错误处理
│   └── 边界条件
├── Integration Test Suites  // 集成测试套件
│   ├── API集成
│   ├── 模块集成
│   └── 服务集成
└── System Test Flows       // 系统测试流程
    ├── 购物流程
    ├── 用户流程
    └── 支付流程
```

#### 一键执行多层级测试
```bash
# 测试人员的工作流程
$ mdt test --feature ProductManagement

执行计划：
┌─────────────────────────────────────────┐
│ 测试层级                执行状态         │
├─────────────────────────────────────────┤
│ Unit Tests              ✓ 10/10 通过    │
│ Component Tests         ✓ 15/15 通过    │ 
│ Integration Tests       ✓ 8/8 通过      │
│ System Tests           ⚠️ 2/3 通过      │
│ E2E Tests              ✓ 5/5 通过      │
└─────────────────────────────────────────┘

详细报告：system-test-2失败
原因：支付流程在"优惠券过期"场景下未正确处理
建议：检查CouponService的过期验证逻辑
```

### 3.2 跨层级的缺陷追踪

#### 自动缺陷关联
```javascript
// MDT自动分析缺陷影响范围
defectTracker.analyze({
  defect: 'CouponValidation.expired',
  
  // 自动识别影响的测试层级
  impactedLayers: {
    unit: ['CouponService.isValid()'],
    component: ['CouponInput.handleApply()'],
    integration: ['Cart.applyCoupon()'],
    system: ['PurchaseFlow.withCoupon()'],
    e2e: ['CompleteCheckout.withExpiredCoupon()']
  },
  
  // 自动生成修复验证计划
  verificationPlan: [
    'Fix CouponService.isValid() logic',
    'Update Unit Tests',
    'Verify Component Tests pass',
    'Run Integration Tests',
    'Execute System Flow',
    'Validate E2E scenario'
  ]
});
```

### 3.3 测试数据的统一管理

#### 数据一致性保证
```javascript
// MDT确保所有层级使用一致的测试数据
class TestDataManager {
  // 单一数据源
  generateTestData(domain, scope) {
    const baseData = this.getBaseData(domain);
    
    return {
      // Unit层级：基础对象
      unit: baseData,
      
      // Component层级：带状态的对象
      component: this.addUIStates(baseData),
      
      // Integration层级：带API响应的对象
      integration: this.addAPIContext(baseData),
      
      // System层级：带业务流程的对象
      system: this.addBusinessContext(baseData),
      
      // E2E层级：带环境信息的对象
      e2e: this.addEnvironmentContext(baseData)
    };
  }
  
  // 数据变更时自动同步所有层级
  updateTestData(domain, changes) {
    const affectedLayers = this.findAffectedLayers(changes);
    
    affectedLayers.forEach(layer => {
      this.updateLayerData(layer, changes);
      this.rerunAffectedTests(layer);
    });
  }
}
```

## 四、MDT的技术实现机制

### 4.1 分层数据生成
```javascript
class MDTDataGenerator {
  generateLayeredData(apiSpec) {
    return {
      // 每层级都从同一个源数据生成
      source: this.parseAPISpec(apiSpec),
      
      layers: {
        unit: this.generateUnitData(source),
        component: this.generateComponentScenarios(source),
        integration: this.generateIntegrationMocks(source),
        system: this.generateSystemFlows(source),
        e2e: this.generateE2EEnvironments(source)
      }
    };
  }
}
```

### 4.2 智能场景适配
```javascript
class MDTScenarioAdapter {
  adaptScenarioForLayer(scenario, targetLayer) {
    switch (targetLayer) {
      case 'unit':
        return this.extractDataOnly(scenario);
        
      case 'component':
        return this.addUIStates(scenario);
        
      case 'integration':
        return this.addNetworkContext(scenario);
        
      case 'system':
        return this.addBusinessContext(scenario);
        
      case 'e2e':
        return this.addEnvironmentContext(scenario);
    }
  }
}
```

### 4.3 自动化测试编排
```javascript
class MDTTestOrchestrator {
  executeMultiLayerTest(feature) {
    const plan = this.generateTestPlan(feature);
    
    return {
      // 并行执行独立层级
      parallel: [
        this.runUnitTests(plan.unit),
        this.runComponentTests(plan.component)
      ],
      
      // 串行执行依赖层级
      sequential: [
        this.runIntegrationTests(plan.integration),
        this.runSystemTests(plan.system),
        this.runE2ETests(plan.e2e)
      ]
    };
  }
}
```

## 五、价值总结

### 5.1 开发过程支持
- **一次Mock定义，支持所有层级测试**
- **自动生成不同粒度的测试数据**
- **实时提供各种测试场景**
- **保证数据一致性**

### 5.2 测试过程支持
- **统一的测试管理界面**
- **跨层级的缺陷追踪**
- **自动化的测试执行**
- **智能的影响分析**

### 5.3 关键优势
```
传统方式：每个层级单独准备测试数据和环境
MDT方式：一次配置，全层级支持

效率提升：
- 数据准备时间：减少90%
- 测试维护成本：减少80%
- 缺陷定位时间：减少70%
- 回归测试时间：减少85%
```

MDT通过**统一的数据源**和**智能的分层适配**，让开发和测试人员可以用一套工具支持从Unit到E2E的所有测试层级，这正是它能提供跨层级价值的核心机制。