# Mock-Driven Testing 测试人员使用指南

## 一、测试人员的全新工作模式

### 传统测试模式 vs Mock-Driven测试模式

#### 传统模式的痛点
```
1. 等待开发完成才能开始测试
2. 手动编写大量测试用例
3. 环境问题导致测试阻塞
4. 难以构造异常场景
5. 测试数据准备繁琐
```

#### Mock-Driven模式的优势
```
1. 开发同时自动生成测试用例
2. 基于契约的测试覆盖保证
3. 独立的Mock环境，无阻塞
4. 轻松模拟各种异常场景
5. 测试数据自动生成
```

## 二、核心工作流程

### 2.1 测试准备阶段

#### 查看新增/变更的API
```bash
# 登录测试平台
http://localhost:3002

# 仪表板显示
┌─────────────────────────────────┐
│ 今日API变更                     │
├─────────────────────────────────┤
│ ➕ 新增: POST /api/coupon/apply │
│ 🔄 变更: GET /api/order/list    │
│ ➕ 新增: DELETE /api/cart/item  │
└─────────────────────────────────┘
```

#### 查看自动生成的测试
```javascript
// 点击API查看测试用例
POST /api/coupon/apply
├── ✅ 基础功能测试 (5个)
│   ├── 成功应用优惠券
│   ├── 优惠券不存在
│   ├── 优惠券已过期
│   ├── 优惠券已使用
│   └── 金额不满足条件
├── 🔍 边界测试 (8个)
├── ❌ 异常测试 (6个)
└── 🚀 性能测试 (3个)
```

### 2.2 测试执行阶段

#### 单个测试执行
```bash
# 方式1：Web界面执行
点击测试用例 → 点击"运行"按钮 → 查看实时结果

# 方式2：命令行执行
mdt test run test_coupon_apply_success

# 方式3：批量执行
mdt test run --suite coupon_tests
```

#### 测试结果实时展示
```
测试: 优惠券过期处理
状态: 运行中... 

步骤1: 准备过期优惠券 ✅
步骤2: 发送应用请求 ✅
步骤3: 验证错误响应 ✅

结果: 通过 ✅
耗时: 45ms
```

### 2.3 场景测试

#### 正常场景测试
```javascript
// 自动覆盖所有成功路径
测试场景：正常应用优惠券
├── 新用户首次使用
├── 老用户重复购买
├── 不同金额订单
├── 不同类型优惠券
└── 组合优惠券使用
```

#### 异常场景测试
```javascript
// 轻松测试各种异常
异常场景：
├── 网络超时（Mock延迟响应）
├── 服务器错误（Mock返回500）
├── 数据库异常（Mock返回特定错误）
├── 并发冲突（Mock模拟锁错误）
└── 限流场景（Mock返回429）
```

#### 边界条件测试
```javascript
// 自动生成的边界测试
边界测试：
├── 最小金额：0.01元
├── 最大金额：99999.99元
├── 空字符串参数
├── 超长字符串
├── 特殊字符
└── SQL注入测试
```

## 三、高级测试功能

### 3.1 数据驱动测试

#### 批量测试数据
```yaml
# test-data.yaml
test_cases:
  - name: "小额订单"
    amount: 10
    coupon: "SAVE5"
    expected: "金额不足"
    
  - name: "正常订单"
    amount: 100
    coupon: "SAVE20"
    expected: "成功"
    
  - name: "大额订单"
    amount: 10000
    coupon: "SAVE20"
    expected: "成功"
```

#### 执行数据驱动测试
```bash
# 一键执行所有数据组合
mdt test run --data test-data.yaml

结果摘要：
总计：50个测试
通过：48个
失败：2个
耗时：2.3秒
```

### 3.2 端到端流程测试

#### 定义业务流程
```javascript
// 可视化流程编辑器
购物流程测试：
1. 用户登录
   ↓
2. 浏览商品
   ↓
3. 加入购物车
   ↓
4. 应用优惠券 ← Mock控制各种场景
   ↓
5. 创建订单
   ↓
6. 支付订单
```

#### 流程测试执行
```bash
# 执行完整流程
mdt flow run shopping_flow

流程执行进度：
[===========     ] 6/8 步骤
当前步骤：支付订单
状态：进行中...

⚠️ 步骤5失败：优惠券验证异常
查看详情：http://localhost:3002/test/12345
```

### 3.3 性能测试

#### 配置性能测试
```javascript
性能测试配置：
- 并发用户：100
- 持续时间：5分钟
- 请求间隔：随机1-5秒
- 场景分布：
  - 80% 正常请求
  - 15% 慢请求
  - 5% 错误请求
```

#### 性能测试结果
```
性能测试报告：
┌──────────────┬─────────┬──────────┐
│ 指标         │ 结果    │ 基准值   │
├──────────────┼─────────┼──────────┤
│ 平均响应时间  │ 45ms   │ <100ms  ✅│
│ P95响应时间   │ 120ms  │ <200ms  ✅│
│ P99响应时间   │ 450ms  │ <500ms  ✅│
│ 错误率       │ 0.1%   │ <1%     ✅│
│ QPS         │ 1200   │ >1000   ✅│
└──────────────┴─────────┴──────────┘
```

### 3.4 回归测试

#### 配置回归测试策略
```yaml
回归测试配置：
  触发条件：
    - 代码提交
    - 每日定时（凌晨2点）
    - API契约变更
    
  测试范围：
    - 核心业务流程（P0）
    - 变更影响的API（P1）
    - 其他相关测试（P2）
    
  失败处理：
    - 邮件通知
    - 阻止部署
    - 创建缺陷单
```

#### 回归测试报告
```
回归测试日报（2025-01-27）
━━━━━━━━━━━━━━━━━━━━━━━
执行统计：
- 总用例数：1,234
- 执行用例：1,200
- 通过：1,180 (98.3%)
- 失败：20
- 跳过：34

失败分析：
1. 支付回调超时（10个）
   原因：Mock响应延迟设置过高
   
2. 优惠券验证失败（8个）
   原因：契约变更未同步
   
3. 权限校验失败（2个）
   原因：测试数据问题

改进建议：
- 调整Mock延迟配置
- 更新测试用例适配新契约
- 修复测试数据生成逻辑
```

## 四、测试效率工具

### 4.1 智能测试推荐
```javascript
// 基于代码变更推荐测试
代码变更：CouponService.java - applyCoupon()

推荐测试：
🎯 必须执行（直接影响）：
- test_coupon_apply_success
- test_coupon_validation
- test_coupon_expiry_check

📍 建议执行（间接影响）：
- test_order_with_coupon
- test_payment_with_discount

💡 可选执行（回归验证）：
- test_user_coupon_list
- test_coupon_statistics
```

### 4.2 测试结果分析
```javascript
// 失败模式分析
失败模式识别：
├── 时间相关（30%）
│   └── 建议：检查时区和Mock时间设置
├── 环境相关（25%）
│   └── 建议：确认Mock环境配置
├── 数据相关（20%）
│   └── 建议：更新测试数据
└── 真实缺陷（25%）
    └── 建议：提交缺陷报告
```

### 4.3 一键生成测试报告
```bash
# 生成测试报告
mdt report generate --format html

# 报告内容
测试报告包含：
- 执行摘要
- 详细结果
- 失败分析
- 覆盖率统计
- 趋势图表
- 改进建议
```

## 五、常用命令速查

### 基础命令
```bash
# 查看所有测试
mdt test list

# 运行单个测试
mdt test run <test-name>

# 运行测试套件
mdt test run --suite <suite-name>

# 查看测试历史
mdt test history <test-name>
```

### Mock管理
```bash
# 查看当前Mock场景
mdt mock status

# 切换Mock场景
mdt mock switch <scenario>

# 创建自定义Mock
mdt mock create
```

### 报告相关
```bash
# 生成日报
mdt report daily

# 生成周报
mdt report weekly

# 导出测试数据
mdt export --format csv
```

## 六、最佳实践

### 6.1 测试用例管理
```
✅ 推荐做法：
- 利用自动生成的测试作为基础
- 补充业务特定的测试场景
- 定期清理过时的测试用例
- 保持测试命名规范

❌ 避免做法：
- 完全依赖自动生成
- 忽略边界条件测试
- 测试用例重复冗余
```

### 6.2 Mock数据管理
```
✅ 推荐做法：
- 使用真实的数据格式
- 覆盖各种业务场景
- 定期更新Mock数据
- 版本化管理Mock

❌ 避免做法：
- 使用过于简单的Mock
- Mock数据不符合业务规则
- 硬编码测试数据
```

### 6.3 缺陷报告
```markdown
# 缺陷报告模板
## 概述
优惠券在特定条件下无法使用

## 复现步骤
1. 使用测试账号登录
2. 选择金额为99.99的商品
3. 应用优惠券"SAVE100"
4. 观察结果

## 期望结果
优惠券应用成功，订单金额变为0

## 实际结果
返回错误：金额计算异常

## Mock场景
scenario: edge_case_calculation

## 相关测试
test_coupon_edge_amount

## 严重程度
高 - 影响用户支付
```

## 七、故障排查

### 问题1：测试环境连接失败
```bash
# 检查Mock服务状态
mdt status

# 重启Mock服务
mdt restart

# 查看错误日志
tail -f logs/mock-error.log
```

### 问题2：测试数据不一致
```bash
# 清理测试数据
mdt clean --data

# 重新生成测试数据
mdt generate --test-data

# 验证数据完整性
mdt verify --data
```

### 问题3：测试执行超时
```bash
# 调整超时配置
mdt config set timeout 30000

# 查看慢查询
mdt analyze --slow-tests

# 优化建议
mdt optimize suggest
```

## 八、获取支持

### 资源链接
- 测试平台：http://localhost:3002
- 文档中心：http://localhost:3002/docs
- 视频教程：http://localhost:3002/tutorials

### 团队支持
- Slack: #qa-mock-testing
- 邮箱：qa-support@storehub.com
- 每周四下午：测试技术分享会

### 反馈改进
- 功能建议：[Feature Request](http://localhost:3002/feedback)
- 问题报告：[Bug Report](http://localhost:3002/issues)
- 满意度调查：每月一次