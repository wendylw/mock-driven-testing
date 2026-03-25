# 纯后端需求工作流程

## 一、典型的纯后端需求场景

### 1. 内部服务API
- 微服务间调用
- 数据同步接口
- 定时任务触发API
- 管理后台API

### 2. 第三方集成
- Webhook接收
- 数据导入/导出
- 外部系统回调
- API网关路由

### 3. 系统级功能
- 健康检查接口
- 监控数据收集
- 日志聚合API
- 配置管理接口

## 二、Mock-Driven 在纯后端场景的价值

### 🎯 价值1：服务间集成测试
```javascript
// 场景：订单服务需要调用库存服务
// 传统方式：需要启动完整的库存服务
// Mock方式：直接Mock库存服务响应

// 库存服务Mock
export const inventoryServiceMock = {
  'POST /internal/inventory/check': {
    // 正常情况
    available: {
      status: 200,
      data: {
        productId: 'prod123',
        available: true,
        quantity: 100
      }
    },
    // 库存不足
    outOfStock: {
      status: 200,
      data: {
        productId: 'prod123',
        available: false,
        quantity: 0
      }
    },
    // 服务异常
    serviceError: {
      status: 503,
      data: {
        error: 'SERVICE_UNAVAILABLE',
        message: '库存服务暂时不可用'
      }
    }
  }
};
```

### 🎯 价值2：第三方依赖隔离
```javascript
// 场景：支付回调处理
// 问题：无法控制第三方何时调用
// 解决：Mock模拟各种回调场景

export const paymentCallbackMock = {
  'POST /webhook/payment/notify': {
    // 支付成功
    success: {
      headers: {
        'X-Signature': 'valid-signature'
      },
      body: {
        orderId: 'order123',
        status: 'PAID',
        amount: 100.00,
        paidAt: '2025-01-27T10:00:00Z'
      }
    },
    // 支付失败
    failed: {
      body: {
        orderId: 'order123',
        status: 'FAILED',
        reason: 'INSUFFICIENT_FUNDS'
      }
    },
    // 重复通知
    duplicate: {
      body: {
        orderId: 'order123',
        status: 'PAID',
        notifyCount: 3
      }
    }
  }
};
```

### 🎯 价值3：性能和压力测试
```javascript
// Mock可以模拟各种响应时间和并发场景
export const performanceTestMock = {
  'GET /internal/data/batch': {
    // 快速响应
    fast: {
      delay: 10,
      data: generateBatchData(100)
    },
    // 慢响应
    slow: {
      delay: 3000,
      data: generateBatchData(100)
    },
    // 超大数据量
    huge: {
      delay: 100,
      data: generateBatchData(10000)
    }
  }
};
```

## 三、纯后端需求的工作流程

### Step 1：需求分析和Mock定义
```javascript
// 后端开发者自己定义Mock
// 重点：定义清楚输入输出格式

// 1. 分析依赖服务
依赖服务清单：
- 库存服务：检查库存
- 用户服务：验证权限
- 通知服务：发送消息

// 2. 为每个依赖创建Mock
http://localhost:3002/mock/create

// 3. 定义各种场景
- 正常响应
- 异常响应
- 超时情况
- 数据异常
```

### Step 2：开发和测试
```python
# 使用Mock进行开发
class OrderService:
    def __init__(self, inventory_client, user_client):
        self.inventory = inventory_client
        self.user = user_client
    
    def create_order(self, order_data):
        # 调用库存服务（Mock响应）
        stock_check = self.inventory.check_stock(
            order_data['product_id'],
            order_data['quantity']
        )
        
        if not stock_check['available']:
            raise OutOfStockError()
        
        # 继续订单创建逻辑...

# 单元测试
def test_order_creation_out_of_stock():
    # Mock返回库存不足
    with mock_scenario('inventory.outOfStock'):
        order_service = OrderService()
        
        with pytest.raises(OutOfStockError):
            order_service.create_order({
                'product_id': 'prod123',
                'quantity': 10
            })

# 集成测试
def test_order_flow_with_all_services():
    # 同时Mock多个服务
    with mock_scenario([
        'inventory.available',
        'user.authorized',
        'notification.success'
    ]):
        result = complete_order_flow()
        assert result['status'] == 'completed'
```

### Step 3：服务间契约管理
```javascript
// 虽然没有前端，但服务间也需要契约

// 1. 定义服务契约
{
  "service": "inventory-service",
  "version": "1.0.0",
  "apis": [
    {
      "endpoint": "/internal/inventory/check",
      "method": "POST",
      "request": {
        "productId": "string",
        "quantity": "integer"
      },
      "response": {
        "available": "boolean",
        "quantity": "integer"
      }
    }
  ]
}

// 2. 契约确认（服务提供方和消费方）
确认人：
- 库存服务负责人（提供方）
- 订单服务负责人（消费方）

// 3. 版本管理
- 契约变更需要通知所有消费方
- 保持向后兼容
```

### Step 4：测试数据管理
```bash
# 为不同测试环境准备Mock数据集

# 开发环境：快速响应，固定数据
$ mdt mock use --env dev --dataset minimal

# 测试环境：完整场景，真实数据结构
$ mdt mock use --env test --dataset complete

# 压测环境：大数据量，各种延迟
$ mdt mock use --env perf --dataset stress
```

## 四、纯后端场景的特殊功能

### 1. 批量Mock生成
```javascript
// 基于OpenAPI/Swagger自动生成Mock
$ mdt mock generate --from-swagger inventory-api.yaml

生成Mock：
✓ 10个端点
✓ 每个端点3-5个场景
✓ 包含所有错误码
```

### 2. Mock录制回放
```bash
# 录制真实服务响应
$ mdt mock record --service inventory --duration 1h

# 回放录制的响应
$ mdt mock replay --service inventory --session 20250127-1030
```

### 3. 服务虚拟化
```javascript
// 完整模拟一个服务
export const virtualInventoryService = {
  // 状态管理
  state: {
    products: new Map(),
    reservations: new Map()
  },
  
  // 行为模拟
  handlers: {
    'POST /check': function(req) {
      const product = this.state.products.get(req.body.productId);
      return {
        available: product.stock >= req.body.quantity,
        quantity: product.stock
      };
    },
    
    'POST /reserve': function(req) {
      // 模拟预留库存逻辑
      const reservation = {
        id: generateId(),
        productId: req.body.productId,
        quantity: req.body.quantity,
        expiresAt: Date.now() + 15 * 60 * 1000
      };
      this.state.reservations.set(reservation.id, reservation);
      return reservation;
    }
  }
};
```

## 五、最佳实践

### 1. Mock组织结构
```
mocks/
├── external/          # 外部服务Mock
│   ├── payment/
│   ├── shipping/
│   └── sms/
├── internal/          # 内部服务Mock
│   ├── inventory/
│   ├── user/
│   └── notification/
├── scenarios/         # 复杂场景组合
│   ├── order-flow/
│   └── refund-flow/
└── performance/       # 性能测试Mock
```

### 2. 命名规范
```javascript
// 服务名.场景名
'inventory.available'
'inventory.outOfStock'
'payment.success'
'payment.timeout'
```

### 3. 数据一致性
```javascript
// 使用共享的测试数据
const testProducts = require('./shared/products.json');
const testUsers = require('./shared/users.json');

// Mock中引用共享数据
export const inventoryMock = {
  'GET /products/:id': {
    found: {
      data: testProducts.find(p => p.id === ':id')
    }
  }
};
```

## 六、工具支持

### CLI命令
```bash
# 后端专用命令
mdt mock create --type backend      # 创建后端Mock
mdt mock record --service <name>    # 录制服务响应
mdt mock replay --service <name>    # 回放录制
mdt mock virtual --service <name>   # 启动虚拟服务
mdt test integration --with-mocks   # 集成测试
```

### 监控和调试
```bash
# 查看Mock调用情况
$ mdt mock monitor --service inventory

Mock调用统计：
├── /check: 1523次
│   ├── available: 1200次
│   ├── outOfStock: 300次
│   └── error: 23次
├── /reserve: 450次
└── /cancel: 120次

# 调试Mock响应
$ mdt mock debug --service inventory --scenario outOfStock
```

## 七、总结

即使是纯后端需求，Mock-Driven Testing 仍然提供巨大价值：

1. **依赖隔离**：不需要启动所有依赖服务
2. **测试覆盖**：轻松测试各种异常场景
3. **并行开发**：多个服务可以并行开发
4. **调试方便**：可控的测试环境

关键是要根据场景选择合适的Mock策略，不是所有场景都需要前端参与，但Mock的核心价值——**可控的测试环境**和**完整的场景覆盖**——在纯后端场景同样适用。