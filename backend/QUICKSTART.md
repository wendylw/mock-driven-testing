# 快速启动指南

## 前提条件

1. **MySQL** 已安装并运行（默认端口3306）
2. **Redis** 已安装并运行（默认端口6379）
3. **Node.js** 16+ 已安装

## 启动步骤

### 1. 安装依赖
```bash
cd backend
npm install
```

### 2. 创建数据库

登录MySQL并执行：
```sql
mysql -u root

# 在MySQL中执行
source src/database/schema.sql;
source src/database/seed.sql;
```

或者直接执行：
```bash
mysql -u root < src/database/schema.sql
mysql -u root mdt < src/database/seed.sql
```

### 3. 启动Redis
```bash
redis-server
```

### 4. 启动后端服务
```bash
npm run dev
```

服务将在 http://localhost:3000 启动

## 测试API

### 获取基准列表
```bash
curl http://localhost:3000/api/baselines
```

### 获取基准状态（开发模式无需认证）
```bash
curl http://localhost:3000/api/baselines/baseline-button-001/status
```

### 获取问题诊断
```bash
curl http://localhost:3000/api/baselines/baseline-button-001/diagnostic
```

## 环境配置说明

`.env` 文件已配置为开发环境，主要配置：
- MySQL: root用户，无密码，本地连接
- Redis: 本地连接，无密码
- JWT: 开发密钥
- 开发模式：无需认证即可访问API

## 常见问题

### MySQL连接失败
- 检查MySQL是否启动
- 确认root用户无密码（或修改.env中的密码）

### Redis连接失败
- 确保Redis服务已启动：`redis-server`

### 端口3000被占用
- 修改.env中的PORT配置