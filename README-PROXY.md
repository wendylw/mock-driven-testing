# Mock-Driven Testing 代理服务器使用指南

## 工作原理

代理服务器在 beep-v1-webapp 和真实 API 服务器之间创建了一个中间层：

```
浏览器 → localhost:3001（代理） → localhost:3000（beep-v1-webapp）
                ↓
         API 请求拦截
                ↓
      coffee.beep.test17.shub.us
```

## 使用步骤

### 1. 启动 beep-v1-webapp（第一个终端）

```bash
cd ~/workspace/beep-v1-webapp
yarn start
```

等待看到：
```
Compiled successfully!
You can now view beep in the browser.
Local: http://localhost:3000
```

### 2. 启动代理服务器（第二个终端）

```bash
cd ~/workspace/mock-driven-testing
node proxy-simple.js
```

你会看到：
```
🚀 启动 Mock-Driven Testing 代理服务器
✅ 代理端口: 3001
✅ 目标应用: http://localhost:3000
✅ API 服务器: https://coffee.beep.test17.shub.us
```

### 3. 访问应用

在浏览器中访问：**http://localhost:3001**（不是 3000！）

### 4. 正常使用应用

- 浏览产品
- 添加到购物车
- 查看用户信息
- 等等...

每个 API 调用都会在代理服务器终端显示：
```
📡 API 请求: GET /api/products
✅ 已捕获: GET /api/products (200) - 125ms
📝 已更新 Mock 文件 (1 个端点)
```

### 5. 查看捕获的数据

访问：http://localhost:3001/__mock_stats

### 6. 生成的 Mock 文件

自动保存在：
- `generated/beep-v1-webapp/api-mocks-realtime.js`

### 7. 停止服务器

按 Ctrl+C，数据会自动保存到：
- `captured-data/final-capture-[timestamp].json`

## 故障排除

如果看到 "Proxy Error"：
1. 确保 beep-v1-webapp 正在运行在 localhost:3000
2. 确保代理服务器使用的是 localhost:3001
3. 检查防火墙设置