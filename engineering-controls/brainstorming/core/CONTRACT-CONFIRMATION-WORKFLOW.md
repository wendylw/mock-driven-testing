# 契约确认工作流程

## 一、契约确认的参与方

### 核心参与者
- **前端开发**：提出数据需求，确认响应格式
- **后端开发**：评估可行性，确认数据结构
- **产品经理**：确认业务规则正确
- **测试工程师**：补充边界场景和异常情况

## 二、契约确认流程

### Step 1：初始Mock创建（前端主导）
```javascript
// 前端基于产品需求创建初始Mock
// 时间：需求会议后 30分钟内

// 1. 登录Mock平台
http://localhost:3002/mock/create

// 2. 创建草稿状态的Mock
{
  "status": "draft",
  "creator": "frontend-developer",
  "feature": "subscription",
  "apis": [...],
  "created": "2025-01-27 10:30"
}
```

### Step 2：契约评审会议（全员参与）
```
时间：初始Mock创建后 1小时内
地点：会议室 / 视频会议
时长：30分钟

议程：
1. 前端展示Mock数据结构（5分钟）
2. 后端评审和建议（10分钟）
3. 产品确认业务规则（5分钟）
4. 测试补充场景（5分钟）
5. 达成共识（5分钟）
```

#### 评审要点清单
```yaml
前端关注：
  - 数据是否满足UI展示需求
  - 字段命名是否符合前端规范
  - 是否有冗余数据

后端关注：
  - 数据结构是否合理
  - 是否符合数据库设计
  - 性能影响（如N+1查询）
  - 实现复杂度

产品关注：
  - 业务规则是否完整
  - 错误提示是否友好
  - 是否遗漏业务场景

测试关注：
  - 是否覆盖异常场景
  - 边界条件是否完整
  - 错误码是否规范
```

### Step 3：在线协作修改
```javascript
// Mock平台的协作编辑功能
http://localhost:3002/mock/edit/subscription

// 实时协作特性：
1. 多人同时在线编辑
2. 修改实时同步
3. 修改历史记录
4. 评论和标注功能
```

#### 典型的协作修改过程
```javascript
// 初始版本（前端创建）
{
  "GET /api/subscription/plans": {
    "data": [
      {
        "id": "basic",
        "name": "基础版",
        "price": 9.99
      }
    ]
  }
}

// 后端建议：添加货币字段
{
  "GET /api/subscription/plans": {
    "data": [
      {
        "id": "basic",
        "name": "基础版",
        "price": 9.99,
        "currency": "USD"  // 新增
      }
    ]
  }
}

// 产品建议：添加功能限制说明
{
  "GET /api/subscription/plans": {
    "data": [
      {
        "id": "basic",
        "name": "基础版",
        "price": 9.99,
        "currency": "USD",
        "limits": {         // 新增
          "projects": 5,
          "users": 10
        }
      }
    ]
  }
}

// 测试建议：添加错误场景
{
  "POST /api/subscription/create": {
    "success": { ... },
    "invalidPlan": {      // 新增错误场景
      "status": 400,
      "error": "INVALID_PLAN_ID"
    },
    "paymentFailed": {    // 新增错误场景
      "status": 402,
      "error": "PAYMENT_REQUIRED"
    }
  }
}
```

### Step 4：契约确认和锁定
```javascript
// 所有人达成一致后，在Mock平台操作

// 1. 点击"确认契约"按钮
// 2. 填写确认信息
{
  "version": "1.0.0",
  "confirmedBy": [
    { "role": "frontend", "name": "张三", "time": "10:55" },
    { "role": "backend", "name": "李四", "time": "10:56" },
    { "role": "product", "name": "王五", "time": "10:57" },
    { "role": "qa", "name": "赵六", "time": "10:58" }
  ],
  "status": "confirmed",
  "lockedAt": "2025-01-27 11:00"
}

// 3. 系统自动操作
- 生成契约文档
- 发送确认邮件给所有人
- 创建契约版本快照
- 设置为"开发中"状态
```

### Step 5：契约变更流程
```javascript
// 如果开发过程中需要修改契约

// 1. 提出变更请求
http://localhost:3002/contract/change-request

{
  "contractId": "subscription-v1.0.0",
  "changeType": "add_field",
  "description": "需要添加订阅开始时间字段",
  "proposedBy": "backend-developer",
  "reason": "业务需求变更"
}

// 2. 变更通知
系统自动通知：
- 邮件通知所有确认人
- Slack 消息推送
- Mock平台显示待处理变更

// 3. 快速评审（可在线）
- 相关人员在Mock平台查看变更
- 在线评论和投票
- 达成一致后确认

// 4. 版本更新
{
  "version": "1.0.1",
  "changeLog": "添加 startDate 字段",
  "backwardCompatible": true
}
```

## 三、通知机制

### 1. 即时通知
```yaml
触发事件：
  - Mock创建完成
  - 契约待确认
  - 契约已确认
  - 契约变更请求
  - 契约版本更新

通知方式：
  - Email: 发送给所有参与者
  - Slack: 发送到项目频道
  - 站内信: Mock平台内通知
  - Webhook: 集成其他系统
```

### 2. 通知模板
```
【契约待确认】订阅功能API契约

相关人员：
- 前端：@张三
- 后端：@李四
- 产品：@王五
- 测试：@赵六

契约地址：http://localhost:3002/contract/subscription
会议时间：2025-01-27 11:00
会议室：技术讨论室 / Zoom链接

请准时参加契约评审会议。
```

## 四、最佳实践

### 1. 契约确认原则
- **快速决策**：1小时内完成确认
- **全员参与**：相关方都要参与
- **版本管理**：每次变更升级版本
- **向后兼容**：尽量保持兼容性

### 2. 避免的问题
- ❌ 只有前端或后端单方面决定
- ❌ 频繁修改已确认的契约
- ❌ 跳过确认流程直接开发
- ❌ 口头约定不记录

### 3. 工具支持
```bash
# CLI命令
mdt contract create          # 创建契约草稿
mdt contract review          # 发起评审
mdt contract confirm         # 确认契约
mdt contract change-request  # 请求变更

# Web界面
/contracts                   # 契约列表
/contracts/:id/edit         # 协作编辑
/contracts/:id/history      # 变更历史
/contracts/:id/confirm      # 确认页面
```

## 五、契约状态流转

```
草稿(Draft) 
    ↓ 发起评审
评审中(Reviewing)
    ↓ 全员确认
已确认(Confirmed)
    ↓ 开始开发
开发中(Developing)
    ↓ 开发完成
已实现(Implemented)
    ↓ 需要变更
变更中(Changing) → 回到评审中
```

## 六、度量指标

### 效率指标
- 契约确认平均时长：< 2小时
- 契约变更频率：< 2次/功能
- 一次确认成功率：> 80%

### 质量指标
- 契约完整性：覆盖所有场景
- 契约准确性：与实现一致
- 契约稳定性：变更可控

通过这个流程，确保前后端、产品、测试都参与契约定义，避免理解偏差，真正实现"契约驱动开发"。