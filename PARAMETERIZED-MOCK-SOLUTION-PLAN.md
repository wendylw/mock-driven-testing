# 参数化 Mock 接口解决方案计划

## 1. 接口分类与分析

### 1.1 动态ID类接口
这类接口包含动态ID参数，不同ID返回不同的实例数据：

| 接口 | 参数类型 | 示例 | 特点 |
|------|----------|------|------|
| `/api/ordering/stores/:storeId` | 店铺ID | `67220fa7e097f8000711b668` | 每个店铺信息不同 |
| `/api/v3/consumers/:consumerId/profile` | 用户ID | `5d285b152734781c0fcadee2` | 每个用户资料不同 |
| `/api/v3/consumers/:consumerId/customer` | 用户ID | `5d285b152734781c0fcadee2` | 客户详细信息 |
| `/api/v3/offers/:offerId` | 优惠ID | `673c348e19d2ef543f29ed99` | 不同优惠内容 |
| `/api/transactions/:transactionId/status` | 交易ID | `851318305909420` | 交易状态变化 |
| `/api/transactions/:transactionId/review` | 交易ID | `851318305909420` | 评价信息 |
| `/api/v3/points/rewards/:rewardId` | 奖励ID | `673c348e19d2efca1429ed9d` | 积分奖励详情 |
| `/api/consumers/:id/store/:storeId/address/:addressId` | 多级ID | 组合参数 | 地址详情 |
| `/api/v3/consumers/:id/unique-promos/:promoId` | 多级ID | 组合参数 | 促销详情 |

### 1.2 GraphQL 查询类接口
GraphQL接口通过请求体中的变量来区分不同查询：

| 接口 | 查询类型 | 参数示例 | 特点 |
|------|----------|----------|------|
| `/api/gql/ProductDetail` | 商品详情 | `{ productId, variationId }` | 商品变体信息 |
| `/api/gql/Order` | 订单查询 | `{ orderId, status }` | 订单状态追踪 |
| `/api/gql/OnlineCategory` | 分类商品 | `{ categoryId, filters }` | 商品列表过滤 |
| `/api/gql/CoreStores` | 店铺信息 | `{ location, radius }` | 地理位置相关 |

### 1.3 查询参数类接口
通过URL查询参数来过滤或定制响应：

| 接口 | 参数 | 示例 | 特点 |
|------|------|------|------|
| `/api/stores/search` | location, radius, type | `?lat=1.2&lng=103.8&radius=5` | 搜索结果变化 |
| `/api/stores/collection` | type, limit | `?type=featured&limit=10` | 集合内容不同 |
| `/api/v3/points/history` | page, limit, dateRange | `?page=1&limit=20` | 分页数据 |
| `/api/v3/loyalty-change-logs` | startDate, endDate | `?from=2024-01&to=2024-02` | 时间范围查询 |

### 1.4 组合参数类接口
需要多个参数组合才能确定唯一响应：

| 接口 | 参数组合 | 特点 |
|------|----------|------|
| `/api/consumers/:id/store/:storeId/address` | 用户+店铺 | 配送地址选择 |
| `/api/v3/consumers/:id/unique-promos/available-count` | 用户+时间 | 可用优惠数量 |

### 1.5 状态相关类接口
响应会随时间或操作状态变化：

| 接口 | 状态类型 | 特点 |
|------|----------|------|
| `/api/cart` | 购物车状态 | 随商品增减变化 |
| `/api/cart/checkInventory` | 库存状态 | 实时库存检查 |
| `/api/transactions/:id/status` | 订单状态 | pending → completed |

## 2. 解决方案设计

### 2.1 动态ID类接口解决方案

#### 策略：实例池 + 模板生成
```javascript
// 数据结构
mockData/
├── stores/
│   ├── template.json          // 店铺数据模板
│   ├── instances/             // 已捕获的实例
│   │   ├── 67220fa7e097f8000711b668.json
│   │   └── 6077b44eb07f400006229705.json
│   └── generator.js           // 基于模板生成新实例

// Mock 实现
rest.get('/api/ordering/stores/:storeId', (req, res, ctx) => {
  const { storeId } = req.params;
  
  // 1. 查找已存在的实例
  if (existsInstance(storeId)) {
    return res(ctx.json(getInstance(storeId)));
  }
  
  // 2. 基于模板生成新实例
  const newInstance = generateFromTemplate('stores', {
    id: storeId,
    // 保持ID相关字段一致性
    name: generateStoreName(storeId),
    // 其他字段使用合理默认值
  });
  
  return res(ctx.json(newInstance));
});
```

### 2.2 GraphQL 查询类解决方案

#### 策略：查询指纹 + 响应映射
```javascript
// 数据结构
graphqlMocks/
├── ProductDetail/
│   ├── queries/               // 查询指纹
│   │   ├── [hash1].query.json
│   │   └── [hash2].query.json
│   ├── responses/             // 对应响应
│   │   ├── [hash1].response.json
│   │   └── [hash2].response.json
│   └── matcher.js             // 查询匹配器

// 查询指纹生成
function getQueryFingerprint(query, variables) {
  // 提取关键参数
  const key = {
    operation: extractOperation(query),
    productId: variables.productId,
    variationId: variables.variationId
  };
  return hash(key);
}
```

### 2.3 查询参数类解决方案

#### 策略：参数组合索引 + 智能过滤
```javascript
// 数据结构
searchMocks/
├── stores/
│   ├── base-data.json         // 完整数据集
│   ├── indexes/               // 参数索引
│   │   ├── by-location.json
│   │   └── by-type.json
│   └── filter.js              // 过滤逻辑

// Mock 实现
rest.get('/api/stores/search', (req, res, ctx) => {
  const { lat, lng, radius, type } = req.query;
  
  // 1. 加载基础数据
  let results = loadBaseData('stores');
  
  // 2. 应用过滤器
  if (lat && lng && radius) {
    results = filterByLocation(results, { lat, lng, radius });
  }
  if (type) {
    results = filterByType(results, type);
  }
  
  // 3. 返回过滤结果
  return res(ctx.json({ stores: results }));
});
```

### 2.4 状态相关类解决方案

#### 策略：状态机 + 会话管理
```javascript
// 数据结构
statefulMocks/
├── cart/
│   ├── sessions/              // 会话数据
│   │   └── [sessionId].json
│   ├── state-machine.js       // 状态转换逻辑
│   └── default-state.json     // 默认状态

// 状态管理
class CartStateMachine {
  constructor(sessionId) {
    this.sessionId = sessionId;
    this.state = loadOrCreateSession(sessionId);
  }
  
  addItem(product) {
    this.state.items.push(product);
    this.state.total = calculateTotal(this.state.items);
    saveSession(this.sessionId, this.state);
  }
  
  getState() {
    return this.state;
  }
}
```

## 3. 实施计划

### 第一阶段：基础架构（第1周）
1. **数据存储重构**
   - 创建分类目录结构
   - 实现实例管理器
   - 建立模板系统

2. **参数解析器**
   - REST 参数提取
   - GraphQL 变量解析
   - 查询参数处理

### 第二阶段：核心功能（第2周）
1. **匹配引擎**
   - 精确匹配算法
   - 模糊匹配算法
   - 默认值生成器

2. **数据生成器**
   - 基于模板生成
   - 保持数据一致性
   - 业务规则引擎

### 第三阶段：高级特性（第3周）
1. **状态管理**
   - 会话跟踪
   - 状态持久化
   - 状态转换逻辑

2. **智能学习**
   - 参数模式识别
   - 响应模式学习
   - 自动规则生成

### 第四阶段：优化集成（第4周）
1. **性能优化**
   - 缓存机制
   - 索引优化
   - 批量处理

2. **开发体验**
   - 可视化管理界面
   - 调试工具
   - 文档生成

## 4. 技术实现要点

### 4.1 数据一致性保证
- ID 关联：确保相关接口返回的ID保持一致
- 时间戳：使用相对时间而非绝对时间
- 状态同步：多个接口共享状态时保持同步

### 4.2 默认值生成策略
- 类型推断：根据字段名推断数据类型
- 范围限制：数值类型的合理范围
- 格式规范：邮箱、电话等格式验证

### 4.3 性能考虑
- 懒加载：按需加载大数据集
- 预计算：提前计算常用组合
- 内存管理：定期清理过期数据

## 5. 预期成果

### 5.1 覆盖率提升
- 参数化接口覆盖率：从 0% → 95%
- 测试场景覆盖：从单一场景 → 多样化场景
- 边界情况处理：从崩溃 → 优雅降级

### 5.2 开发效率
- Mock 创建时间：从 30分钟 → 30秒
- 测试数据准备：从手动 → 自动
- 场景切换成本：从重启 → 实时

### 5.3 质量保证
- 数据真实性：基于真实数据生成
- 行为一致性：符合业务逻辑
- 错误处理：支持异常场景测试

## 6. 风险与应对

### 6.1 数据量增长
- 风险：存储空间不足
- 应对：数据压缩、定期清理、云存储

### 6.2 复杂度管理
- 风险：规则过于复杂难以维护
- 应对：模块化设计、规则可视化、自动化测试

### 6.3 性能瓶颈
- 风险：匹配算法性能下降
- 应对：缓存优化、并行处理、算法优化

## 7. 总结

通过这个分层的参数化 Mock 解决方案，我们可以：
1. **全面覆盖**所有类型的参数化接口
2. **智能生成**符合业务逻辑的响应数据
3. **灵活管理**不同场景下的测试数据
4. **持续优化**基于使用情况改进系统

这将使 Mock-Driven Testing 真正成为一个生产级的测试解决方案，不仅解决了基础的 Mock 问题，还能处理复杂的参数化场景，为 StoreHub 的 45 个仓库提供完整的测试支持。