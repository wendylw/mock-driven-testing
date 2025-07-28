# BEEP Mock代理配置指南（零代码修改）

## 🎯 核心理念

**不修改BEEP项目的任何代码**，只需通过浏览器访问代理端口即可使用Mock系统。

## 📋 快速开始（2分钟完成）

### 步骤1: 启动Mock代理服务器

在`mock-driven-testing`项目中：
```bash
cd /Users/wendylin/workspace/mock-driven-testing
node proxy-final.js
```

你会看到：
```
🚀 启动 Mock-Driven Testing 代理服务器
✅ 代理端口: 3001
✅ 目标应用: http://localhost:3000
✅ API 服务器: https://coffee.beep.test17.shub.us
```

### 步骤2: 正常启动BEEP项目（无需修改）

在`beep-v1-webapp`项目中：
```bash
cd ~/workspace/beep-v1-webapp
yarn start
```

等待看到 "Compiled successfully!"

### 步骤3: 通过代理访问BEEP

不要访问 `localhost:3000`，而是访问：
- http://coffee.beep.local.shub.us:3001
- http://jw.beep.local.shub.us:3001
- http://localhost:3001

## 🔧 工作原理

```
浏览器 → :3001代理 → :3000 BEEP前端
                ↓
            API请求拦截
                ↓
         ┌─────────────┐
         │ Mock判断    │
         ├─────────────┤
         │ 有Mock?     │
         │ ↓         ↓ │
         │ 是       否 │
         │ ↓         ↓ │
         │Mock响应  真实API│
         └─────────────┘
```

## 🎭 Mock功能

### 1. 自动Mock识别
代理服务器会自动识别API请求并应用Mock：
- GraphQL请求：`/api/gql/*`
- REST API：`/api/*`

### 2. 实时统计查看
访问：http://localhost:3001/__mock_stats

查看：
- 总API调用次数
- 各端点调用统计
- Mock命中情况
- 最近请求记录

### 3. 参数化Mock信息
访问：http://localhost:3001/__parameterized_info

## 📊 使用场景

### 场景1: 前端开发（无需等待API）
```bash
# 启动代理
node proxy-final.js

# 正常开发BEEP
yarn start

# 访问代理端口开发
http://localhost:3001
```

### 场景2: 测试特定Mock数据
Mock系统会自动使用`generated/beep-v1-webapp/api-mocks-realtime.js`中的数据。

### 场景3: 捕获新的API数据
正常使用系统，代理会自动捕获并更新Mock数据。

## 🎯 关键优势

1. **零侵入**：不修改BEEP任何代码
2. **透明代理**：开发体验完全一致
3. **实时更新**：自动捕获新API并生成Mock
4. **参数化Mock**：智能识别参数化请求

## 💡 高级配置

### 自定义Mock响应
编辑 `parameterized-patch.js` 添加自定义Mock规则：

```javascript
// 添加自定义Mock
if (pathname === '/api/custom') {
  return {
    status: 'success',
    data: 'custom mock response'
  };
}
```

### 切换Mock场景
在 `parameterized-patch.js` 中配置不同场景：
- 正常场景
- 错误场景
- 空数据场景
- 慢响应场景

## 🐛 故障排查

### 问题：502 Bad Gateway
原因：BEEP项目未启动
解决：先启动BEEP项目 `yarn start`

### 问题：Mock不生效
检查：
1. 访问的是代理端口3001（不是3000）
2. 查看控制台是否有"使用参数化Mock"提示
3. 检查 `__mock_stats` 统计

### 问题：WebSocket错误
正常现象，不影响使用。这是Hot Module Replacement连接。

## 📝 总结

通过这种方式，你可以：
- ✅ 完全不修改BEEP代码
- ✅ 享受Mock-Driven Testing的所有好处
- ✅ 前端开发不再等待API
- ✅ 自动化测试有稳定的Mock数据

**只需改变访问端口，即可开启Mock模式！**