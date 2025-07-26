# 端口 3000 vs 3001 对比

## 端口 3000 (beep-v1-webapp 原始服务)

**工作原理：**
1. `yarn start` 启动 webpack-dev-server
2. setupProxy.js 自动代理 API 请求到 `https://coffee.beep.test17.shub.us`
3. 支持 `coffee.beep.local.shub.us:3000` 是因为 hosts 文件映射到 127.0.0.1

**请求流程：**
```
浏览器 → coffee.beep.local.shub.us:3000 (实际是 127.0.0.1:3000)
         ↓
    webpack-dev-server
         ↓
    setupProxy.js 判断
         ↓
    /api/* → coffee.beep.test17.shub.us
```

## 端口 3001 (我们的代理服务器)

**工作原理：**
1. 代理服务器监听 3001
2. 转发请求到 localhost:3000
3. 同时捕获和记录 API 调用

**请求流程：**
```
浏览器 → coffee.beep.local.shub.us:3001
         ↓
    我们的代理服务器
         ↓
    判断请求类型
         ↓
    /api/* → coffee.beep.test17.shub.us (捕获)
    其他 → localhost:3000
```

## 主要区别

| 特性 | 3000 端口 | 3001 端口 |
|------|-----------|-----------|
| Cookie 处理 | setupProxy.js 自动处理 | 需要手动处理 |
| Session 同步 | 自动 | 需要转发 |
| API 捕获 | 无 | 有 |
| Mock 生成 | 无 | 实时生成 |

## 如果你想让 3001 完全模拟 3000

需要：
1. 正确转发和处理 Cookie
2. 保持 Session 一致性
3. 处理所有 setupProxy.js 的逻辑

## 建议

如果只是想捕获 API 数据，可以：

1. **使用浏览器扩展**
   - 安装 Network 监控扩展
   - 直接访问 coffee.beep.local.shub.us:3000

2. **使用 Chrome DevTools Protocol**
   - 通过 Puppeteer 或类似工具监控

3. **修改 setupProxy.js**
   - 在原有代理中添加日志记录
   - 将 API 响应保存到文件