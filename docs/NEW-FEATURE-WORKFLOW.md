# 新功能开发工作流程

## 场景：开发"会员订阅"功能

### 📅 Day 1：需求讨论与Mock定义（上午）

#### 1. 产品需求会议（9:00-10:00）
```
参与人：产品经理、前端、后端、测试
讨论内容：
- 订阅等级：基础版/专业版/企业版
- 功能权限差异
- 支付流程
- 自动续费逻辑
```

#### 2. 快速Mock定义（10:00-11:00）
```javascript
// 前端开发者在Mock平台创建初始Mock
// http://localhost:3002/mock/create

// Step 1: 选择模板 - "订阅服务模板"
// Step 2: 自定义数据
export const subscriptionMocks = {
  // 订阅计划列表
  'GET /api/subscription/plans': {
    normal: {
      status: 200,
      data: [
        { id: 'basic', name: '基础版', price: 9.99, features: ['功能1', '功能2'] },
        { id: 'pro', name: '专业版', price: 29.99, features: ['所有基础功能', '功能3', '功能4'] },
        { id: 'enterprise', name: '企业版', price: 99.99, features: ['所有功能', '专属支持'] }
      ]
    }
  },
  
  // 创建订阅
  'POST /api/subscription/create': {
    normal: {
      status: 200,
      data: { 
        subscriptionId: 'sub_123456',
        status: 'active',
        expiresAt: '2025-02-27'
      }
    },
    // 错误场景 - 自动生成
    paymentFailed: {
      status: 400,
      data: { error: 'PAYMENT_FAILED', message: '支付失败' }
    },
    // 边界场景 - 自动生成
    planNotFound: {
      status: 404,
      data: { error: 'PLAN_NOT_FOUND', message: '订阅计划不存在' }
    }
  }
};
```

#### 3. API契约确认（11:00-11:30）
```javascript
// Mock平台自动生成API契约文档
// http://localhost:3002/contracts/subscription

契约文档：
┌─────────────────────────────────────────┐
│ API: 订阅服务                           │
├─────────────────────────────────────────┤
│ GET /api/subscription/plans             │
│ 响应: Plan[]                            │
│   - id: string                          │
│   - name: string                        │
│   - price: number                       │
│   - features: string[]                  │
├─────────────────────────────────────────┤
│ POST /api/subscription/create           │
│ 请求:                                   │
│   - planId: string                      │
│   - paymentMethod: string               │
│ 响应:                                   │
│   - subscriptionId: string              │
│   - status: string                      │
│   - expiresAt: string                   │
└─────────────────────────────────────────┘

// 前后端基于此契约开发
```

### 💻 Day 1-2：并行开发（下午开始）

#### 前端开发（使用Mock）
```javascript
// 1. 启动Mock代理
$ npm run mock:start --feature subscription

// 2. 立即开始开发
function SubscriptionPage() {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  
  // 使用Mock数据开发
  useEffect(() => {
    fetch('/api/subscription/plans')
      .then(res => res.json())
      .then(data => setPlans(data.data));
  }, []);
  
  const handleSubscribe = async (planId) => {
    try {
      const response = await fetch('/api/subscription/create', {
        method: 'POST',
        body: JSON.stringify({ planId })
      });
      
      if (!response.ok) {
        // Mock会返回各种错误场景
        const error = await response.json();
        showError(error.message);
        return;
      }
      
      const result = await response.json();
      showSuccess('订阅成功！');
    } catch (error) {
      showError('网络错误');
    }
  };
  
  return <SubscriptionPlans plans={plans} onSubscribe={handleSubscribe} />;
}

// 3. 测试各种场景
// 切换Mock场景测试错误处理
$ npm run mock:scenario payment-failed
$ npm run mock:scenario network-timeout
```

#### 后端开发（基于契约）
```python
# 后端基于契约定义开发API
# 知道需要返回什么数据结构

@app.route('/api/subscription/plans', methods=['GET'])
def get_subscription_plans():
    plans = [
        {
            'id': 'basic',
            'name': '基础版',
            'price': 9.99,
            'features': ['功能1', '功能2']
        },
        # ... 更多计划
    ]
    return jsonify({'data': plans})

@app.route('/api/subscription/create', methods=['POST'])
def create_subscription():
    # 实现业务逻辑
    # 返回符合契约的响应
    pass
```

#### 测试编写（基于Mock场景）
```javascript
// 测试自动获得各种Mock场景
describe('订阅功能测试', () => {
  it('应该正确显示订阅计划', async () => {
    // Mock自动提供数据
    const plans = await fetchSubscriptionPlans();
    expect(plans).toHaveLength(3);
    expect(plans[0].name).toBe('基础版');
  });
  
  it('应该处理支付失败', async () => {
    // 切换到错误场景
    mockScenario.use('paymentFailed');
    
    const result = await createSubscription('pro');
    expect(result.error).toBe('PAYMENT_FAILED');
  });
  
  it('应该处理网络超时', async () => {
    // Mock自动模拟超时
    mockScenario.use('timeout');
    
    await expect(createSubscription('pro')).rejects.toThrow('Network timeout');
  });
  
  it('应该处理空数据', async () => {
    // Mock提供边界场景
    mockScenario.use('emptyPlans');
    
    const plans = await fetchSubscriptionPlans();
    expect(plans).toHaveLength(0);
  });
});
```

### 🎨 Day 2：原型展示（下午）

#### 1. 原型演示准备（14:00）
```bash
# 生成可分享的原型链接
$ npm run mock:prototype --feature subscription

生成链接：https://prototype.local/subscription-demo-x7k3d

功能：
- 完整的订阅流程演示
- 可切换不同场景（成功/失败/加载中）
- 收集反馈功能
```

#### 2. 产品评审会议（15:00）
```
// 实时切换Mock场景演示
- 展示正常订阅流程 ✓
- 展示支付失败处理 ✓
- 展示网络异常处理 ✓
- 展示空数据状态 ✓

// 收集反馈
产品："价格显示需要加上货币符号"
设计："按钮颜色需要调整"
```

#### 3. 快速调整（16:00）
```javascript
// 在Mock编辑器中实时修改
http://localhost:3002/mock/edit/subscription

// 修改价格显示
plans.data[0].price = '$9.99';  // 之前是 9.99

// 立即生效，无需重启
```

### 🔄 Day 3-4：联调与完善

#### API联调（Day 3）
```javascript
// 后端API开发完成后

// 1. 运行契约验证
$ npm run contract:verify --api subscription

契约验证报告：
✅ GET /api/subscription/plans - 通过
❌ POST /api/subscription/create - 失败
   - 缺少字段：expiresAt
   - 类型不匹配：status (expected: string, actual: number)

// 2. 修复不一致
// 后端修复 或 更新契约

// 3. 切换到真实API测试
$ npm run mock:disable --feature subscription
```

#### 回归测试（Day 4）
```bash
# Mock自动更新，运行回归测试
$ npm run test:regression

回归测试报告：
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 订阅功能测试: 15/15 通过
✅ 影响分析: 
   - 用户dashboard需要显示订阅状态
   - 支付流程需要支持订阅
✅ 性能测试: 响应时间 < 200ms
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 📊 Day 5：上线准备

#### 1. Mock数据归档
```bash
# 保存这次开发的Mock数据作为测试基准
$ npm run mock:snapshot --name "subscription-v1.0"

已保存：
- 5个API端点Mock
- 15个测试场景
- 契约文档
- 测试用例
```

#### 2. 文档自动生成
```
Mock平台自动生成：
- API文档（基于契约）
- 集成指南（基于Mock示例）
- 错误处理说明（基于错误场景）
```

## 工作流程总结

### 🎯 效率提升点

1. **Day 1 即可开始前端开发**
   - 传统：等待后端API（3-5天）
   - 现在：立即开始（0天）

2. **自动化测试场景**
   - 传统：手动构造测试数据（2天）
   - 现在：自动生成（0天）

3. **原型快速验证**
   - 传统：完整开发后验证（2周）
   - 现在：2天内可演示

4. **API文档自动维护**
   - 传统：手动编写和更新
   - 现在：Mock即文档

### 📈 关键指标

| 阶段 | 传统开发 | Mock-Driven | 提升 |
|------|----------|-------------|------|
| 需求到原型 | 2周 | 2天 | 7倍 |
| 前端等待时间 | 3-5天 | 0天 | ∞ |
| 测试用例编写 | 2天 | 0.5天 | 4倍 |
| API文档编写 | 1天 | 0天 | ∞ |
| 总开发周期 | 3周 | 1周 | 3倍 |

### 🔧 工具支持

```bash
# 日常使用的命令
npm run mock:start          # 启动Mock服务
npm run mock:edit           # 编辑Mock数据
npm run mock:scenario       # 切换测试场景
npm run mock:prototype      # 生成原型链接
npm run contract:verify     # 验证契约一致性
npm run test:regression     # 运行回归测试
```

### 💡 最佳实践

1. **Mock先行**：先定义Mock，明确API契约
2. **场景完整**：覆盖正常、错误、边界场景
3. **持续验证**：保持Mock与实际API同步
4. **版本管理**：重要版本创建Mock快照