# Mock-Driven Testing 开发者使用指南

## 一、快速开始

### 1.1 系统要求
- Node.js 14+
- Git
- 支持的项目：StoreHub所有前端项目

### 1.2 安装与启动
```bash
# 克隆项目
git clone https://github.com/storehub/mock-driven-testing.git
cd mock-driven-testing

# 安装依赖
npm install

# 查看可用项目
node cli.js list

# 启动特定项目的Mock服务
node cli.js beep-v1-webapp
```

### 1.3 访问应用
```bash
# 通过代理访问（自动应用Mock）
http://coffee.beep.local.shub.us:3001

# Mock管理界面（即将推出）
http://localhost:3002
```

## 二、开发工作流程

### 2.1 传统开发流程 vs Mock-Driven流程

#### 传统流程
```
1. 等待后端API开发完成
2. 阅读API文档
3. 开始前端开发
4. 联调测试
5. 修复问题
```

#### Mock-Driven流程
```
1. 与后端一起定义API契约
2. 自动生成Mock数据
3. 立即开始前端开发
4. 后端开发同步进行
5. 自动验证契约一致性
```

### 2.2 典型使用场景

#### 场景1：开发新功能
```javascript
// 1. 查看API契约
契约定义：POST /api/coupon/apply
{
  request: {
    userId: string,
    couponCode: string,
    orderId: string
  },
  response: {
    success: boolean,
    finalAmount?: number,
    error?: string
  }
}

// 2. 前端直接开发（Mock自动生效）
const applyCoupon = async (data) => {
  const response = await fetch('/api/coupon/apply', {
    method: 'POST',
    body: JSON.stringify(data)
  });
  
  // Mock会返回符合契约的响应
  return response.json();
};

// 3. 自动获得各种场景的Mock
- 成功场景：{ success: true, finalAmount: 80 }
- 过期场景：{ success: false, error: 'COUPON_EXPIRED' }
- 已使用场景：{ success: false, error: 'COUPON_USED' }
```

#### 场景2：处理边界情况
```javascript
// Mock自动提供边界测试数据
// 无需等待后端实现

// 测试优惠券码为空
await applyCoupon({ couponCode: '' });
// Mock返回：{ success: false, error: 'INVALID_COUPON' }

// 测试超大金额
await applyCoupon({ orderId: 'large-order' });
// Mock返回：{ success: false, error: 'AMOUNT_EXCEEDS_LIMIT' }

// 测试并发使用
Promise.all([
  applyCoupon(data),
  applyCoupon(data)
]);
// Mock返回：第二个请求失败
```

#### 场景3：模拟异常情况
```javascript
// 通过Mock控制面板切换场景（即将推出）
// 或通过特殊Header控制

// 模拟网络超时
fetch('/api/coupon/apply', {
  headers: {
    'Mock-Scenario': 'timeout'
  }
});

// 模拟服务器错误
fetch('/api/coupon/apply', {
  headers: {
    'Mock-Scenario': 'server-error'
  }
});

// 模拟限流
fetch('/api/coupon/apply', {
  headers: {
    'Mock-Scenario': 'rate-limit'
  }
});
```

### 2.3 契约变更处理

#### 收到变更通知
```
🔔 契约变更通知
API: POST /api/coupon/apply
变更: 新增必填字段 'userId'
影响: 你的代码可能需要更新

建议操作：
1. 更新调用代码，添加userId
2. 运行测试验证
```

#### 处理变更
```javascript
// 更新前
applyCoupon({
  couponCode: 'SAVE20',
  orderId: 'order123'
});

// 更新后
applyCoupon({
  userId: currentUser.id,    // 新增
  couponCode: 'SAVE20',
  orderId: 'order123'
});
```

## 三、调试技巧

### 3.1 查看Mock日志
```bash
# 实时查看Mock请求日志
tail -f logs/mock-requests.log

# 输出示例
[2025-01-27 10:30:15] Mock响应: POST /api/coupon/apply
Request: { userId: "user123", couponCode: "SAVE20", orderId: "order456" }
Response: { success: true, finalAmount: 80 }
Scenario: success
```

### 3.2 验证契约符合度
```javascript
// 开发时的实时反馈
// 如果你的请求不符合契约，控制台会警告

console.warn('⚠️ 契约验证失败');
console.warn('缺少必填字段: userId');
console.warn('查看契约: http://localhost:3002/contracts/coupon-apply');
```

### 3.3 切换Mock场景
```javascript
// 方式1：通过Header
fetch('/api/coupon/apply', {
  headers: {
    'Mock-Scenario': 'expired-coupon'
  }
});

// 方式2：通过查询参数（开发环境）
fetch('/api/coupon/apply?_mock=expired-coupon');

// 方式3：通过Mock控制台（推荐）
// 访问 http://localhost:3002/mock-control
// 选择场景并应用
```

## 四、最佳实践

### 4.1 契约定义参与
```javascript
// ❌ 不好的做法：被动等待API
等待后端完成 → 开始开发 → 发现问题 → 返工

// ✅ 好的做法：主动参与契约定义
参与API设计 → 提出前端需求 → 共同定义契约 → 并行开发
```

### 4.2 错误处理完善
```javascript
// ❌ 不好的做法：只处理成功情况
const result = await applyCoupon(data);
setDiscount(result.discount);

// ✅ 好的做法：处理所有契约定义的情况
try {
  const result = await applyCoupon(data);
  if (result.success) {
    setDiscount(result.discount);
  } else {
    switch (result.error) {
      case 'COUPON_EXPIRED':
        showError('优惠券已过期');
        break;
      case 'COUPON_USED':
        showError('优惠券已使用');
        break;
      default:
        showError('优惠券使用失败');
    }
  }
} catch (error) {
  showError('网络错误，请重试');
}
```

### 4.3 测试用例编写
```javascript
// 利用Mock的多场景特性编写完整测试

describe('优惠券功能', () => {
  it('应该成功应用优惠券', async () => {
    const result = await applyCoupon(validData);
    expect(result.success).toBe(true);
    expect(result.finalAmount).toBeLessThan(originalAmount);
  });
  
  it('应该处理过期优惠券', async () => {
    // Mock自动返回过期错误
    const result = await applyCoupon({
      couponCode: 'EXPIRED2023'
    });
    expect(result.success).toBe(false);
    expect(result.error).toBe('COUPON_EXPIRED');
  });
  
  it('应该处理网络错误', async () => {
    // 触发超时Mock
    mockScenario('timeout');
    await expect(applyCoupon(data)).rejects.toThrow();
  });
});
```

## 五、常见问题

### Q1: Mock数据不符合预期？
```bash
# 检查当前激活的Mock场景
curl http://localhost:3002/api/mock/active-scenarios

# 查看契约定义
curl http://localhost:3002/api/contracts/[api-name]

# 更新Mock数据
# 编辑 mocks/[api-name].json
```

### Q2: 如何添加自定义Mock？
```javascript
// 方式1：编辑Mock文件
// mocks/custom-mocks.json
{
  "POST /api/special-case": {
    "response": {
      "customField": "customValue"
    }
  }
}

// 方式2：通过API（即将支持）
await fetch('http://localhost:3002/api/mocks', {
  method: 'POST',
  body: JSON.stringify({
    path: '/api/special-case',
    method: 'POST',
    response: { customField: 'customValue' }
  })
});
```

### Q3: 如何与真实API切换？
```javascript
// 方式1：环境变量
// .env.development
REACT_APP_USE_MOCK=true

// .env.production  
REACT_APP_USE_MOCK=false

// 方式2：代理配置
// 开发环境：指向Mock代理
// 生产环境：指向真实API

// 方式3：运行时切换
if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = 'http://localhost:3001';
} else {
  axios.defaults.baseURL = 'https://api.production.com';
}
```

## 六、进阶功能（即将推出）

### 6.1 Mock录制回放
```javascript
// 录制真实API响应
startRecording();
// ... 执行真实API调用 ...
stopRecording();

// 之后自动使用录制的响应作为Mock
```

### 6.2 智能Mock生成
```javascript
// 基于使用模式自动生成Mock
// 系统学习你的API使用方式
// 自动生成更真实的测试数据
```

### 6.3 协作功能
```javascript
// 分享Mock场景
shareScenario('complex-checkout-flow');

// 团队成员可以直接使用
importScenario('complex-checkout-flow');
```

## 七、获取帮助

### 文档资源
- 使用文档：http://localhost:3002/docs
- API参考：http://localhost:3002/api-reference
- 最佳实践：http://localhost:3002/best-practices

### 社区支持
- Slack频道：#mock-driven-testing
- 问题反馈：[GitHub Issues](https://github.com/storehub/mock-driven-testing/issues)
- 功能建议：[Feature Requests](https://github.com/storehub/mock-driven-testing/discussions)

### 技术支持
- 邮箱：mock-platform@storehub.com
- 内部Wiki：MockDrivenTesting