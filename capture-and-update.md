# 捕获真实 API 并更新 Mock 数据

## 步骤 1: 捕获真实 API 数据

### 1.1 在 beep-v1-webapp 中运行捕获脚本

1. 启动 beep-v1-webapp:
```bash
cd ~/workspace/beep-v1-webapp
yarn start
```

2. 打开浏览器，访问应用（通常是 http://localhost:3000）

3. 打开浏览器的开发者工具（F12）

4. 在 Console 中粘贴并运行 `capture-real-api.js` 的内容

5. 正常使用应用的各个功能：
   - 浏览产品
   - 添加到购物车
   - 查看用户信息
   - 下单流程
   - 支付（如果有测试环境）

6. 查看捕获统计：
```javascript
showCaptureStats()
```

7. 下载捕获的数据：
```javascript
downloadCapturedAPIs()
```

### 1.2 捕获的数据格式

下载的文件（例如 `beep-api-capture-1737864000000.json`）包含：
```json
{
  "captureDate": "2025-07-26T12:00:00.000Z",
  "totalCalls": 25,
  "uniqueEndpoints": ["/api/cart", "/api/products", ...],
  "calls": [
    {
      "timestamp": "2025-07-26T12:00:01.000Z",
      "method": "GET",
      "url": "http://localhost:3000/api/cart",
      "endpoint": "/api/cart",
      "requestBody": null,
      "responseStatus": 200,
      "responseData": { /* 真实响应数据 */ },
      "responseHeaders": { /* 响应头 */ }
    }
  ]
}
```

## 步骤 2: 使用真实数据更新 Mock

将捕获的文件复制到 mock-driven-testing 项目：
```bash
cp ~/Downloads/beep-api-capture-*.json ~/workspace/mock-driven-testing/captured-data/
```

然后运行更新脚本：
```bash
cd ~/workspace/mock-driven-testing
node update-mocks-from-capture.js captured-data/beep-api-capture-*.json
```

## 步骤 3: 验证更新后的 Mock

更新后，Mock 数据将基于真实的 API 响应，使测试更加真实可靠。

运行验证：
```bash
node verify-updated-mocks.js
```

## 注意事项

1. **隐私数据**: 捕获的数据可能包含敏感信息，请在使用前清理
2. **数据量**: 不需要捕获所有请求，只需要典型场景
3. **错误场景**: 记得也要捕获一些错误场景（如支付失败）