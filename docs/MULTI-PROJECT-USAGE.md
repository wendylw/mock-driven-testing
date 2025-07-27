# Mock-Driven Testing 多项目支持使用指南

## 快速开始

### 1. 查看可用项目
```bash
npm run proxy:list
```

### 2. 启动项目代理

#### 方式一：使用快捷命令
```bash
# 启动 Beep 项目
npm run proxy:beep

# 启动 BackOffice 项目  
npm run proxy:backoffice
```

#### 方式二：使用通用命令
```bash
# 启动指定项目
npm run proxy beep-v1-webapp
npm run proxy backoffice-v2-webapp
```

### 3. 访问应用

#### Beep V1 WebApp
启动后可以通过以下地址访问：
- http://coffee.beep.local.shub.us:3001
- http://jw.beep.local.shub.us:3001
- http://www.beep.local.shub.us:3001

#### BackOffice V2
启动后可以通过以下地址访问：
- http://coffee.backoffice.local.shub.us:3003

## 前置要求

### 1. 配置 hosts 文件
确保 `/etc/hosts` 包含以下配置：

```bash
# Beep 项目
127.0.0.1    coffee.beep.local.shub.us
127.0.0.1    jw.beep.local.shub.us
127.0.0.1    www.beep.local.shub.us

# BackOffice 项目
127.0.0.1    coffee.backoffice.local.shub.us
```

### 2. 启动目标项目
在启动代理之前，确保目标项目已经在运行：

```bash
# Beep 项目
cd ~/workspace/beep-v1-webapp
yarn start  # 运行在 localhost:3000

# BackOffice 项目
cd ~/workspace/backoffice-v2-webapp
yarn dev    # 运行在 localhost:8001
```

## 功能特性

### 1. Mock 数据组织
捕获的 Mock 数据按项目和业务分组存储：
```
generated/
├── beep-v1-webapp/
│   ├── coffee/              # coffee 业务的 Mock
│   ├── jw/                  # jw 业务的 Mock
│   └── common/              # 通用 Mock
└── backoffice-v2-webapp/
    ├── coffee/
    └── common/
```

### 2. 实时查看统计
访问以下地址查看 API 捕获统计：
- Beep: http://localhost:3001/__mock_stats
- BackOffice: http://localhost:3003/__mock_stats

### 3. 参数化 Mock 信息
查看参数化 Mock 配置：
- Beep: http://localhost:3001/__parameterized_info
- BackOffice: http://localhost:3003/__parameterized_info

## 常见问题

### Q: 端口被占用怎么办？
A: 每个项目使用固定端口：
- Beep 使用 3001
- BackOffice 使用 3003

如果端口被占用，请先关闭占用的程序。

### Q: 为什么访问显示 502 错误？
A: 502 错误表示目标项目没有运行。请确保：
1. 目标项目已启动（yarn start 或 yarn dev）
2. 端口配置正确（Beep: 3000, BackOffice: 8001）

### Q: Mock 数据保存在哪里？
A: Mock 数据保存在：
- 实时 Mock: `generated/{project}/{business}/api-mocks-realtime.js`
- 捕获历史: `captured-data/{project}/capture-{timestamp}.json`

### Q: 如何添加新项目？
A: 编辑 `config/projects.js` 文件，添加新的项目配置。

## 进阶使用

### 同时运行多个项目
可以在不同终端窗口分别启动：
```bash
# 终端 1
npm run proxy:beep

# 终端 2  
npm run proxy:backoffice
```

### 查看捕获的数据
程序退出时（Ctrl+C）会自动保存捕获的数据到：
```
captured-data/{project}/capture-{timestamp}.json
```

### 自定义配置
如需修改项目配置，编辑 `config/projects.js` 文件。