# MDT Backend - 智能分析系统后端

这是Mock-Driven Testing平台的智能分析系统后端服务。

## 功能特性

- ✅ 基准状态智能检测
- ✅ 问题诊断与根因分析
- 🚧 智能建议生成
- 🚧 分析任务管理
- 🚧 WebSocket实时通信

## 技术栈

- Node.js + TypeScript
- Express.js
- MySQL
- Redis
- JWT认证
- WebSocket

## 快速开始

### 1. 安装依赖

```bash
cd backend
npm install
```

### 2. 配置环境变量

复制环境变量示例文件：
```bash
cp .env.example .env
```

编辑 `.env` 文件，配置数据库连接等信息。

### 3. 创建数据库

```bash
# 登录MySQL
mysql -u root -p

# 执行数据库脚本
source src/database/schema.sql
source src/database/seed.sql
```

### 4. 启动服务

开发模式：
```bash
npm run dev
```

生产模式：
```bash
npm run build
npm start
```

## API接口

### 基准管理

- `GET /api/baselines` - 获取基准列表
- `GET /api/baselines/:id/status` - 获取基准状态
- `GET /api/baselines/:id/diagnostic` - 获取问题诊断
- `GET /api/baselines/:id/suggestions` - 获取智能建议（开发中）
- `POST /api/baselines/:id/analyze` - 触发分析（开发中）

### 分析管理

- `GET /api/analysis/:id/progress` - 获取分析进度

## 项目结构

```
backend/
├── src/
│   ├── controllers/      # API控制器
│   ├── services/         # 业务逻辑服务
│   ├── analyzers/        # 分析引擎
│   ├── models/          # 数据模型
│   ├── middleware/      # 中间件
│   ├── routes/          # 路由定义
│   ├── utils/           # 工具函数
│   └── database/        # 数据库脚本
├── logs/                # 日志文件
├── dist/               # 编译输出
└── package.json
```

## 开发指南

### 添加新的分析器

1. 在 `src/analyzers/` 创建新的分析器类
2. 实现 `analyze(baselineId: string)` 方法
3. 在 `DiagnosticService` 中集成新的分析器

### 添加新的API接口

1. 在 `src/controllers/` 添加控制器方法
2. 在 `src/routes/` 配置路由
3. 更新相关服务层逻辑

## 环境要求

- Node.js 16+
- MySQL 5.7+
- Redis 6+

## 常见问题

### 数据库连接失败

检查 `.env` 文件中的数据库配置是否正确。

### Redis连接失败

确保Redis服务已启动：
```bash
redis-server
```

### 端口被占用

修改 `.env` 中的 `PORT` 配置。

## License

MIT