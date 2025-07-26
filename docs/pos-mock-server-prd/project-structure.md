# StoreHub POS Mock Server 项目结构

## 目录结构详解

```
pos-mock-server/
├── src/                          # 源代码目录
│   ├── api/                      # REST API 路由和控制器
│   │   ├── auth/                 # 认证相关 API
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.routes.ts
│   │   │   └── auth.validator.ts
│   │   ├── stores/               # 商店管理 API
│   │   │   ├── stores.controller.ts
│   │   │   ├── stores.routes.ts
│   │   │   └── stores.validator.ts
│   │   ├── products/             # 产品管理 API
│   │   │   ├── products.controller.ts
│   │   │   ├── products.routes.ts
│   │   │   └── products.validator.ts
│   │   ├── transactions/         # 交易处理 API
│   │   │   ├── transactions.controller.ts
│   │   │   ├── transactions.routes.ts
│   │   │   └── transactions.validator.ts
│   │   ├── payments/             # 支付处理 API
│   │   │   ├── payments.controller.ts
│   │   │   ├── payments.routes.ts
│   │   │   └── payments.validator.ts
│   │   ├── customers/            # 客户管理 API
│   │   │   ├── customers.controller.ts
│   │   │   ├── customers.routes.ts
│   │   │   └── customers.validator.ts
│   │   ├── reports/              # 报表 API
│   │   │   ├── reports.controller.ts
│   │   │   ├── reports.routes.ts
│   │   │   └── reports.validator.ts
│   │   └── index.ts              # API 路由聚合
│   │
│   ├── websocket/                # WebSocket 服务
│   │   ├── mrs/                  # Multi-Register Sync
│   │   │   ├── mrs.service.ts
│   │   │   ├── mrs.events.ts
│   │   │   └── mrs.types.ts
│   │   ├── kds/                  # Kitchen Display System
│   │   │   ├── kds.service.ts
│   │   │   ├── kds.events.ts
│   │   │   └── kds.types.ts
│   │   ├── ncs/                  # Notification Center Service
│   │   │   ├── ncs.service.ts
│   │   │   ├── ncs.events.ts
│   │   │   └── ncs.types.ts
│   │   ├── cfd/                  # Customer Facing Display
│   │   │   ├── cfd.service.ts
│   │   │   ├── cfd.events.ts
│   │   │   └── cfd.types.ts
│   │   ├── socket.manager.ts     # Socket.IO 管理器
│   │   └── index.ts
│   │
│   ├── services/                 # 业务逻辑服务
│   │   ├── auth.service.ts       # 认证服务
│   │   ├── store.service.ts      # 商店服务
│   │   ├── product.service.ts    # 产品服务
│   │   ├── transaction.service.ts # 交易服务
│   │   ├── payment.service.ts    # 支付服务
│   │   ├── inventory.service.ts  # 库存服务
│   │   ├── promotion.service.ts  # 促销服务
│   │   ├── sync.service.ts       # 数据同步服务
│   │   └── mdns.service.ts       # 服务发现
│   │
│   ├── models/                   # 数据模型
│   │   ├── store.model.ts        # 商店模型
│   │   ├── employee.model.ts     # 员工模型
│   │   ├── product.model.ts      # 产品模型
│   │   ├── transaction.model.ts  # 交易模型
│   │   ├── customer.model.ts     # 客户模型
│   │   ├── payment.model.ts      # 支付模型
│   │   ├── printer.model.ts      # 打印机模型
│   │   └── index.ts
│   │
│   ├── middleware/               # Express 中间件
│   │   ├── auth.middleware.ts    # JWT 认证
│   │   ├── error.middleware.ts   # 错误处理
│   │   ├── logger.middleware.ts  # 请求日志
│   │   ├── cors.middleware.ts    # CORS 配置
│   │   ├── rate-limit.middleware.ts # 速率限制
│   │   └── validation.middleware.ts  # 请求验证
│   │
│   ├── hardware/                 # 硬件设备模拟
│   │   ├── printer/              # 打印机模拟
│   │   │   ├── printer.simulator.ts
│   │   │   ├── escpos.parser.ts
│   │   │   └── printer.types.ts
│   │   ├── scanner/              # 扫描器模拟
│   │   │   ├── scanner.simulator.ts
│   │   │   ├── barcode.generator.ts
│   │   │   └── scanner.types.ts
│   │   ├── nfc/                  # NFC 读卡器模拟
│   │   │   ├── nfc.simulator.ts
│   │   │   └── nfc.types.ts
│   │   ├── cash-drawer/          # 现金抽屉模拟
│   │   │   ├── drawer.simulator.ts
│   │   │   └── drawer.types.ts
│   │   └── device.manager.ts     # 设备管理器
│   │
│   ├── integrations/             # 第三方集成
│   │   ├── payment/              # 支付网关
│   │   │   ├── ghl/              # GHL 集成
│   │   │   │   ├── ghl.service.ts
│   │   │   │   └── ghl.types.ts
│   │   │   ├── alipay/           # 支付宝
│   │   │   │   ├── alipay.service.ts
│   │   │   │   └── alipay.types.ts
│   │   │   ├── wechat/           # 微信支付
│   │   │   │   ├── wechat.service.ts
│   │   │   │   └── wechat.types.ts
│   │   │   └── ewallet/          # 电子钱包
│   │   │       ├── tng.service.ts
│   │   │       ├── boost.service.ts
│   │   │       └── grabpay.service.ts
│   │   ├── ecommerce/            # 电商平台
│   │   │   ├── shopify/          # Shopify
│   │   │   │   ├── shopify.service.ts
│   │   │   │   └── shopify.types.ts
│   │   │   ├── woocommerce/      # WooCommerce
│   │   │   │   ├── woocommerce.service.ts
│   │   │   │   └── woocommerce.types.ts
│   │   │   └── tiktok/           # TikTok Shop
│   │   │       ├── tiktok.service.ts
│   │   │       └── tiktok.types.ts
│   │   ├── delivery/             # 外卖平台
│   │   │   ├── foodpanda/        # Foodpanda
│   │   │   │   ├── foodpanda.service.ts
│   │   │   │   └── foodpanda.types.ts
│   │   │   ├── grabfood/         # GrabFood
│   │   │   │   ├── grabfood.service.ts
│   │   │   │   └── grabfood.types.ts
│   │   │   └── shopeefood/       # Shopeefood
│   │   │       ├── shopeefood.service.ts
│   │   │       └── shopeefood.types.ts
│   │   └── mall/                 # 商场集成
│   │       ├── ayala.service.ts
│   │       └── robinson.service.ts
│   │
│   ├── database/                 # 数据库层
│   │   ├── lokijs.config.ts      # LokiJS 配置
│   │   ├── collections/          # 数据集合
│   │   │   ├── stores.collection.ts
│   │   │   ├── products.collection.ts
│   │   │   ├── transactions.collection.ts
│   │   │   └── customers.collection.ts
│   │   ├── migrations/           # 数据迁移
│   │   ├── seeds/                # 种子数据
│   │   │   ├── stores.seed.ts
│   │   │   ├── products.seed.ts
│   │   │   └── employees.seed.ts
│   │   └── backup.service.ts     # 备份服务
│   │
│   ├── utils/                    # 工具函数
│   │   ├── logger.ts             # 日志工具
│   │   ├── crypto.ts             # 加密工具
│   │   ├── validator.ts          # 验证工具
│   │   ├── response.ts           # 响应格式化
│   │   ├── date.ts               # 日期处理
│   │   ├── qrcode.ts             # QR码生成
│   │   └── constants.ts          # 常量定义
│   │
│   ├── types/                    # TypeScript 类型定义
│   │   ├── api.types.ts          # API 类型
│   │   ├── models.types.ts       # 模型类型
│   │   ├── websocket.types.ts    # WebSocket 类型
│   │   └── global.d.ts           # 全局类型
│   │
│   ├── config/                   # 配置文件
│   │   ├── default.ts            # 默认配置
│   │   ├── development.ts        # 开发环境配置
│   │   ├── test.ts               # 测试环境配置
│   │   └── production.ts         # 生产环境配置
│   │
│   ├── app.ts                    # Express 应用初始化
│   ├── server.ts                 # 服务器启动文件
│   └── index.ts                  # 入口文件
│
├── tests/                        # 测试文件
│   ├── unit/                     # 单元测试
│   │   ├── services/
│   │   ├── models/
│   │   └── utils/
│   ├── integration/              # 集成测试
│   │   ├── api/
│   │   └── websocket/
│   ├── e2e/                      # 端到端测试
│   ├── fixtures/                 # 测试数据
│   └── helpers/                  # 测试辅助函数
│
├── docs/                         # 文档
│   ├── api/                      # API 文档
│   │   ├── swagger.yaml          # Swagger 定义
│   │   └── postman/              # Postman 集合
│   ├── guides/                   # 使用指南
│   │   ├── getting-started.md
│   │   ├── configuration.md
│   │   └── deployment.md
│   └── architecture/             # 架构文档
│       ├── overview.md
│       └── diagrams/
│
├── scripts/                      # 脚本工具
│   ├── setup.ts                  # 初始化脚本
│   ├── seed-data.ts              # 数据填充脚本
│   ├── generate-types.ts         # 类型生成脚本
│   ├── build.ts                  # 构建脚本
│   └── deploy.ts                 # 部署脚本
│
├── web-ui/                       # 管理界面（React）
│   ├── src/
│   │   ├── components/           # UI 组件
│   │   ├── pages/                # 页面组件
│   │   ├── services/             # API 服务
│   │   ├── hooks/                # React Hooks
│   │   └── App.tsx               # 主应用
│   ├── public/                   # 静态资源
│   └── package.json
│
├── docker/                       # Docker 相关
│   ├── Dockerfile                # Docker 镜像定义
│   ├── docker-compose.yml        # Docker Compose 配置
│   └── nginx.conf                # Nginx 配置
│
├── .github/                      # GitHub 配置
│   ├── workflows/                # GitHub Actions
│   │   ├── ci.yml                # CI 流程
│   │   └── release.yml           # 发布流程
│   └── ISSUE_TEMPLATE/           # Issue 模板
│
├── config/                       # 项目配置
│   ├── jest.config.js            # Jest 配置
│   ├── tsconfig.json             # TypeScript 配置
│   ├── .eslintrc.js              # ESLint 配置
│   └── .prettierrc               # Prettier 配置
│
├── .env.example                  # 环境变量示例
├── .gitignore                    # Git 忽略文件
├── package.json                  # 项目依赖
├── README.md                     # 项目说明
├── CHANGELOG.md                  # 更新日志
└── LICENSE                       # 许可证
```

## 关键模块说明

### 1. API 模块 (`src/api/`)
- 每个业务领域有独立的文件夹
- 包含控制器、路由和验证器
- 遵循 RESTful 设计原则

### 2. WebSocket 模块 (`src/websocket/`)
- 每个实时服务独立实现
- 统一的事件管理和类型定义
- Socket.IO 管理器负责连接管理

### 3. 服务层 (`src/services/`)
- 业务逻辑与 API 控制器分离
- 可重用的业务功能
- 便于单元测试

### 4. 硬件模拟 (`src/hardware/`)
- 每种硬件设备独立模拟
- 支持虚拟设备管理
- 提供真实的硬件行为模拟

### 5. 集成模块 (`src/integrations/`)
- 按类型组织第三方服务
- 每个服务独立实现
- 统一的接口定义

### 6. 数据库层 (`src/database/`)
- LokiJS 内存数据库配置
- 数据集合定义
- 种子数据和备份功能

### 7. Web UI (`web-ui/`)
- React 管理界面
- 独立的前端项目
- 提供可视化管理功能

## 开发规范

1. **文件命名**
   - 使用 kebab-case 命名文件
   - 测试文件以 `.test.ts` 结尾
   - 类型文件以 `.types.ts` 结尾

2. **代码组织**
   - 每个模块保持单一职责
   - 相关功能放在同一目录
   - 公共代码放在 utils 目录

3. **导入规则**
   - 使用绝对路径导入
   - 按类型分组导入
   - 避免循环依赖

4. **测试结构**
   - 单元测试镜像源代码结构
   - 集成测试按功能组织
   - E2E 测试模拟真实场景