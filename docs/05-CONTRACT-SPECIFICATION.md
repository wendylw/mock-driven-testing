# Mock-Driven Testing 契约规范

## 一、什么是API契约

### 定义
API契约是前后端之间的正式约定，包含：
- 接口定义（路径、方法、参数）
- 数据格式（请求体、响应体）
- 业务规则（验证逻辑、约束条件）
- 错误处理（错误码、错误信息）

### 契约的价值
1. **明确性**：消除理解歧义
2. **可验证**：自动验证实现
3. **可执行**：生成Mock和测试
4. **文档化**：自动生成文档

## 二、契约结构

### 2.1 完整契约示例
```json
{
  "contractId": "coupon-apply-v1",
  "name": "应用优惠券",
  "version": "1.0.0",
  "api": {
    "path": "/api/coupon/apply",
    "method": "POST",
    "description": "将优惠券应用到订单"
  },
  
  "request": {
    "headers": {
      "Content-Type": {
        "type": "string",
        "required": true,
        "example": "application/json"
      }
    },
    "body": {
      "type": "object",
      "required": ["userId", "orderId", "couponCode"],
      "properties": {
        "userId": {
          "type": "string",
          "description": "用户ID",
          "pattern": "^[0-9a-f]{24}$",
          "example": "507f1f77bcf86cd799439011"
        },
        "orderId": {
          "type": "string",
          "description": "订单ID",
          "pattern": "^ORD[0-9]{10}$",
          "example": "ORD1234567890"
        },
        "couponCode": {
          "type": "string",
          "description": "优惠券码",
          "pattern": "^[A-Z0-9]{6,10}$",
          "example": "SAVE20"
        }
      }
    }
  },
  
  "responses": {
    "200": {
      "description": "成功应用优惠券",
      "body": {
        "type": "object",
        "required": ["success", "finalAmount"],
        "properties": {
          "success": {
            "type": "boolean",
            "example": true
          },
          "finalAmount": {
            "type": "number",
            "description": "应用优惠券后的金额",
            "minimum": 0,
            "example": 80.00
          },
          "discount": {
            "type": "number",
            "description": "优惠金额",
            "example": 20.00
          },
          "appliedAt": {
            "type": "string",
            "format": "datetime",
            "example": "2025-01-27T10:30:00Z"
          }
        }
      }
    },
    
    "400": {
      "description": "业务错误",
      "body": {
        "type": "object",
        "required": ["success", "error", "message"],
        "properties": {
          "success": {
            "type": "boolean",
            "example": false
          },
          "error": {
            "type": "string",
            "enum": [
              "COUPON_NOT_FOUND",
              "COUPON_EXPIRED", 
              "COUPON_USED",
              "AMOUNT_TOO_LOW",
              "USER_NOT_ELIGIBLE"
            ],
            "description": "错误码"
          },
          "message": {
            "type": "string",
            "description": "用户友好的错误信息",
            "example": "优惠券已过期"
          }
        }
      }
    },
    
    "500": {
      "description": "服务器错误",
      "body": {
        "type": "object",
        "properties": {
          "error": {
            "type": "string",
            "example": "INTERNAL_ERROR"
          },
          "message": {
            "type": "string",
            "example": "服务器内部错误"
          }
        }
      }
    }
  },
  
  "businessRules": [
    {
      "id": "BR001",
      "type": "validation",
      "description": "优惠券必须在有效期内",
      "implementation": "coupon.startDate <= now <= coupon.endDate"
    },
    {
      "id": "BR002", 
      "type": "constraint",
      "description": "每个用户每种优惠券只能使用一次",
      "implementation": "count(user.usedCoupons, coupon.type) < 1"
    },
    {
      "id": "BR003",
      "type": "calculation",
      "description": "优惠金额不能超过订单金额的50%",
      "implementation": "discount <= orderAmount * 0.5"
    },
    {
      "id": "BR004",
      "type": "eligibility",
      "description": "新用户专享优惠券只能新用户使用",
      "implementation": "if coupon.type == 'NEW_USER' then user.orderCount == 0"
    }
  ],
  
  "examples": {
    "success": {
      "request": {
        "body": {
          "userId": "507f1f77bcf86cd799439011",
          "orderId": "ORD1234567890",
          "couponCode": "SAVE20"
        }
      },
      "response": {
        "status": 200,
        "body": {
          "success": true,
          "finalAmount": 80.00,
          "discount": 20.00,
          "appliedAt": "2025-01-27T10:30:00Z"
        }
      }
    },
    
    "expired": {
      "request": {
        "body": {
          "userId": "507f1f77bcf86cd799439011",
          "orderId": "ORD1234567890",
          "couponCode": "EXPIRED2023"
        }
      },
      "response": {
        "status": 400,
        "body": {
          "success": false,
          "error": "COUPON_EXPIRED",
          "message": "优惠券已过期"
        }
      }
    }
  },
  
  "performance": {
    "sla": {
      "responseTime": {
        "p50": 50,
        "p95": 200,
        "p99": 500,
        "unit": "ms"
      },
      "availability": 99.9,
      "throughput": {
        "min": 1000,
        "unit": "requests/second"
      }
    }
  },
  
  "security": {
    "authentication": "required",
    "authorization": "user must own the order",
    "rateLimit": {
      "requests": 100,
      "window": "1m",
      "key": "userId"
    }
  },
  
  "metadata": {
    "owner": "payment-team",
    "createdAt": "2025-01-15T10:00:00Z",
    "updatedAt": "2025-01-20T15:30:00Z",
    "tags": ["payment", "coupon", "discount"],
    "relatedContracts": ["order-create", "payment-process"]
  }
}
```

## 三、契约定义规范

### 3.1 数据类型

#### 基础类型
```json
{
  "string": {
    "type": "string",
    "minLength": 1,
    "maxLength": 100,
    "pattern": "^[A-Za-z0-9]+$",
    "example": "example123"
  },
  
  "number": {
    "type": "number",
    "minimum": 0,
    "maximum": 1000000,
    "multipleOf": 0.01,
    "example": 99.99
  },
  
  "integer": {
    "type": "integer",
    "minimum": 1,
    "maximum": 100,
    "example": 42
  },
  
  "boolean": {
    "type": "boolean",
    "example": true
  }
}
```

#### 复合类型
```json
{
  "object": {
    "type": "object",
    "required": ["field1"],
    "properties": {
      "field1": { "type": "string" },
      "field2": { "type": "number" }
    }
  },
  
  "array": {
    "type": "array",
    "minItems": 0,
    "maxItems": 100,
    "items": {
      "type": "string"
    }
  },
  
  "enum": {
    "type": "string",
    "enum": ["ACTIVE", "INACTIVE", "PENDING"]
  }
}
```

### 3.2 验证规则

#### 字符串验证
```json
{
  "email": {
    "type": "string",
    "format": "email",
    "example": "user@example.com"
  },
  
  "url": {
    "type": "string",
    "format": "url",
    "example": "https://example.com"
  },
  
  "date": {
    "type": "string",
    "format": "date",
    "example": "2025-01-27"
  },
  
  "datetime": {
    "type": "string",
    "format": "datetime",
    "example": "2025-01-27T10:30:00Z"
  }
}
```

#### 数字验证
```json
{
  "price": {
    "type": "number",
    "minimum": 0.01,
    "maximum": 999999.99,
    "multipleOf": 0.01,
    "description": "价格必须精确到分"
  },
  
  "percentage": {
    "type": "integer",
    "minimum": 0,
    "maximum": 100,
    "description": "百分比"
  }
}
```

### 3.3 业务规则定义

#### 规则类型
```json
{
  "businessRules": [
    {
      "type": "validation",
      "description": "输入验证规则"
    },
    {
      "type": "constraint", 
      "description": "业务约束规则"
    },
    {
      "type": "calculation",
      "description": "计算规则"
    },
    {
      "type": "workflow",
      "description": "流程规则"
    }
  ]
}
```

#### 规则表达式
```json
{
  "rule": {
    "id": "BR001",
    "description": "VIP用户享受额外折扣",
    "condition": "user.isVIP == true",
    "action": "discount = discount * 1.2",
    "priority": 1
  }
}
```

## 四、契约版本管理

### 4.1 版本规则
```
主版本.次版本.修订版本
1.0.0

主版本：不兼容的API变更
次版本：向后兼容的功能新增
修订版本：向后兼容的问题修复
```

### 4.2 版本兼容性
```json
{
  "version": "2.0.0",
  "previousVersion": "1.5.0",
  "compatibility": {
    "breaking": [
      "移除了字段 oldField",
      "修改了字段类型 amount: string -> number"
    ],
    "deprecated": [
      {
        "field": "legacyField",
        "since": "1.8.0",
        "removeIn": "3.0.0",
        "alternative": "newField"
      }
    ]
  }
}
```

## 五、契约编写最佳实践

### 5.1 命名规范
```
路径命名：
✅ /api/users/{userId}/orders
✅ /api/products/{productId}
❌ /api/getUser
❌ /api/user_list

字段命名：
✅ userId, orderAmount, createdAt
❌ user_id, OrderAmount, created-at
```

### 5.2 错误设计
```json
{
  "errors": {
    "格式规范": {
      "error": "ERROR_CODE",
      "message": "用户友好的错误信息",
      "details": {}
    },
    
    "错误分类": [
      "4xx: 客户端错误",
      "5xx: 服务器错误"
    ],
    
    "错误码规范": [
      "RESOURCE_NOT_FOUND",
      "VALIDATION_ERROR", 
      "PERMISSION_DENIED",
      "RATE_LIMIT_EXCEEDED"
    ]
  }
}
```

### 5.3 示例数据
```json
{
  "examples": {
    "原则": [
      "使用真实的数据格式",
      "覆盖主要业务场景",
      "包含成功和失败案例",
      "数据符合业务规则"
    ],
    
    "注意": [
      "不要包含敏感信息",
      "使用有意义的测试数据",
      "保持数据的一致性"
    ]
  }
}
```

## 六、契约验证

### 6.1 请求验证
```javascript
// 自动验证请求是否符合契约
function validateRequest(contract, request) {
  // 验证必填字段
  // 验证字段类型
  // 验证格式规则
  // 验证业务规则
}
```

### 6.2 响应验证
```javascript
// 自动验证响应是否符合契约
function validateResponse(contract, response) {
  // 验证状态码
  // 验证响应结构
  // 验证字段类型
  // 验证业务规则
}
```

## 七、契约工具支持

### 7.1 契约编辑器
- 可视化编辑
- 语法高亮
- 实时验证
- 自动补全

### 7.2 契约测试
- 自动生成测试用例
- 契约一致性测试
- 兼容性测试
- 性能测试

### 7.3 契约文档
- 自动生成API文档
- 交互式文档
- 变更历史
- 使用示例

## 八、契约治理

### 8.1 契约评审
```
评审要点：
□ 完整性：是否覆盖所有场景
□ 一致性：是否符合规范
□ 可行性：是否可以实现
□ 兼容性：是否向后兼容
```

### 8.2 契约指标
```
契约质量指标：
- 契约覆盖率：API的契约定义比例
- 契约符合度：实现与契约的一致性
- 契约稳定性：契约变更频率
- 契约使用率：Mock/测试使用情况
```

## 九、常见问题

### Q1: 契约粒度如何把握？
```
原则：
- 不要过于详细（避免频繁变更）
- 不要过于简单（失去约束意义）
- 关注稳定的业务规则
- 预留合理的扩展性
```

### Q2: 契约变更如何处理？
```
流程：
1. 评估变更影响
2. 通知相关方
3. 提供迁移期
4. 更新版本号
5. 保持兼容性
```

### Q3: 契约与代码不一致怎么办？
```
处理：
1. 分析不一致原因
2. 确定正确的版本
3. 更新契约或代码
4. 添加验证测试
5. 防止再次发生
```