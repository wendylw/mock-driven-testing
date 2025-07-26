# StoreHub POS Mock Server 执行计划

## 项目概述

基于 pos-v3-mobile 中的技术文档分析，本执行计划旨在构建一个完整的 Mock Server 系统，用于支持 StoreHub POS 应用的独立开发和测试。

## 目标

1. 实现所有外部依赖的模拟，确保 POS 应用可以在无外部系统的情况下运行
2. 提供完整的测试场景支持，包括正常流程和边缘情况
3. 支持自动化测试和 CI/CD 集成
4. 提供开发者友好的配置和管理界面

## 实施阶段

### 第一阶段：核心基础设施（第1-2周）

#### 1.1 项目初始化
- [ ] 创建项目结构
- [ ] 配置 TypeScript + Node.js + Express
- [ ] 设置 ESLint + Prettier
- [ ] 配置 Jest 测试框架
- [ ] 设置日志系统（Winston）

#### 1.2 核心 API Mock Server
- [ ] 实现基础 Express 服务器
- [ ] 配置路由系统
- [ ] 实现请求/响应日志中间件
- [ ] 添加错误处理中间件
- [ ] 实现 CORS 配置

#### 1.3 认证与授权 APIs
- [ ] `/api/v3/auth/login` - 员工登录
- [ ] `/api/v3/auth/logout` - 登出
- [ ] `/api/v3/auth/refresh` - Token 刷新
- [ ] `/api/v3/auth/pin` - PIN 验证
- [ ] 实现 JWT Token 管理

#### 1.4 数据存储层
- [ ] 集成 LokiJS 内存数据库
- [ ] 实现数据持久化到 JSON 文件
- [ ] 创建基础数据模型（Store, Employee, Product等）
- [ ] 实现数据初始化脚本

### 第二阶段：业务 API 和 WebSocket 服务（第3-4周）

#### 2.1 核心业务 APIs
- [ ] **商店管理 APIs**
  - `/api/v3/stores` - 商店信息
  - `/api/v3/stores/{id}/settings` - 商店设置
  - `/api/v3/stores/{id}/registers` - 收银机管理
  
- [ ] **产品管理 APIs**
  - `/api/v3/products` - 产品列表
  - `/api/v3/categories` - 产品分类
  - `/api/v3/modifiers` - 产品修饰符
  - `/api/v3/inventory` - 库存管理

- [ ] **交易处理 APIs**
  - `/api/v3/transactions` - 交易创建/更新
  - `/api/v3/transactions/{id}/payments` - 支付处理
  - `/api/v3/transactions/{id}/refund` - 退款处理
  - `/api/v3/receipts` - 收据管理

#### 2.2 WebSocket 服务
- [ ] 集成 Socket.IO
- [ ] **MRS (Multi-Register Sync)**
  - 实现注册连接管理
  - 交易同步事件
  - 库存更新广播
  - 心跳检测

- [ ] **KDS (Kitchen Display System)**
  - 订单推送
  - 订单状态更新
  - 厨房显示管理

- [ ] **NCS (Notification Center Service)**
  - 实时通知推送
  - 系统消息广播
  - 警告和错误通知

### 第三阶段：外部集成和硬件模拟（第5-6周）

#### 3.1 支付网关集成
- [ ] **GHL Integration**
  - 信用卡支付模拟
  - 终端通信模拟
  - 支付状态回调

- [ ] **电子钱包集成**
  - Alipay 支付流程
  - WeChat Pay 支付流程
  - TNG/Boost/GrabPay 支付流程
  - QR 码生成和验证

#### 3.2 硬件设备模拟
- [ ] **打印机模拟**
  - 虚拟打印机设备
  - 打印任务队列
  - 打印状态反馈
  - ESC/POS 命令解析

- [ ] **扫描器模拟**
  - 条形码扫描模拟
  - QR 码扫描模拟
  - 扫描事件触发

- [ ] **其他硬件**
  - NFC 读卡器模拟
  - 现金抽屉状态
  - 客显屏幕内容

#### 3.3 第三方平台集成
- [ ] **电商平台**
  - Shopify 订单同步
  - WooCommerce 集成
  - TikTok Shop 模拟

- [ ] **外卖平台**
  - Foodpanda 订单接收
  - GrabFood 订单管理
  - Shopeefood 集成

### 第四阶段：高级功能和工具（第7-8周）

#### 4.1 服务发现
- [ ] 实现 mDNS 服务广播
- [ ] 自动服务发现
- [ ] 服务健康检查
- [ ] 动态服务注册

#### 4.2 测试数据管理
- [ ] 场景预设管理
- [ ] 测试数据生成器
- [ ] 数据重置功能
- [ ] 导入/导出功能

#### 4.3 开发者工具
- [ ] Web 管理界面
- [ ] API 文档（Swagger）
- [ ] 请求/响应查看器
- [ ] Mock 行为配置
- [ ] 性能监控面板

#### 4.4 CI/CD 集成
- [ ] Docker 容器化
- [ ] GitHub Actions 集成
- [ ] 自动化测试脚本
- [ ] 版本发布流程

## 技术栈

### 后端
- **运行时**: Node.js v18+
- **框架**: Express.js
- **语言**: TypeScript
- **WebSocket**: Socket.IO
- **数据库**: LokiJS (内存) + JSON 文件存储
- **服务发现**: multicast-dns
- **日志**: Winston
- **API 文档**: Swagger/OpenAPI

### 开发工具
- **测试**: Jest + Supertest
- **代码质量**: ESLint + Prettier
- **构建**: ts-node + nodemon
- **容器化**: Docker + Docker Compose

## 项目结构

```
pos-mock-server/
├── src/
│   ├── api/              # REST API 路由
│   ├── websocket/        # WebSocket 服务
│   ├── services/         # 业务逻辑
│   ├── models/           # 数据模型
│   ├── middleware/       # Express 中间件
│   ├── hardware/         # 硬件模拟
│   ├── integrations/     # 第三方集成
│   ├── database/         # 数据库配置
│   └── utils/            # 工具函数
├── tests/                # 测试文件
├── docs/                 # 文档
├── scripts/              # 脚本工具
├── config/               # 配置文件
└── web-ui/              # 管理界面
```

## 关键里程碑

1. **M1 (第2周末)**: 基础 API Server 运行，认证系统完成
2. **M2 (第4周末)**: 核心业务 API 和 WebSocket 服务完成
3. **M3 (第6周末)**: 支付和硬件模拟完成
4. **M4 (第8周末)**: 完整系统集成，文档和工具完成

## 成功标准

1. POS 应用可以完全在 Mock Server 环境下运行
2. 支持所有主要业务流程的测试
3. 提供完整的 API 文档和使用指南
4. CI/CD 集成，支持自动化测试
5. 性能满足开发测试需求（支持10+并发连接）

## 风险和缓解措施

### 风险
1. **技术复杂度**: WebSocket 和硬件模拟实现复杂
   - *缓解*: 分阶段实现，优先核心功能

2. **数据一致性**: 多注册机同步场景复杂
   - *缓解*: 使用成熟的同步算法，充分测试

3. **第三方 API 变更**: 外部 API 可能更新
   - *缓解*: 版本化 Mock 响应，支持多版本

4. **性能问题**: 大量并发可能导致性能下降
   - *缓解*: 使用内存数据库，优化关键路径

## 下一步行动

1. 创建项目仓库和基础结构
2. 搭建开发环境
3. 实现第一个 API 端点（登录）
4. 建立 CI/CD 流程
5. 开始迭代开发

## 维护计划

- 每两周更新一次 Mock 数据
- 每月同步一次真实 API 变更
- 持续收集开发者反馈
- 定期性能优化