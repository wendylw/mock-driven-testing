# 🎓 BEEP Mock系统实时演示教学

## 🚀 当前系统状态

Mock代理服务器已经在运行！你现在就可以使用它。

### 服务器信息
- **代理端口**: 3001 
- **目标BEEP**: 3000
- **进程ID**: 25783

## 📊 实时功能演示

### 1. 查看Mock统计（刚刚测试的结果）
访问: http://localhost:3001/__mock_stats

你会看到：
```json
{
    "totalCalls": 1,
    "patterns": [
        {
            "pattern": "POST /api/gql/OnlineCategory",
            "calls": 1,
            "examples": 1
        }
    ]
}
```

### 2. 测试不同的API
```bash
# 获取商品详情
curl -X POST http://localhost:3001/api/gql/ProductDetail \
  -H "Content-Type: application/json" \
  -d '{"operationName": "ProductDetail", "variables": {"productId": "67287c47e097f800076d2c77"}}'

# 获取购物车
curl -X POST http://localhost:3001/api/gql/GetShoppingCart \
  -H "Content-Type: application/json" \
  -d '{"operationName": "GetShoppingCart", "variables": {}}'
```

## 🎯 核心概念理解

### 工作流程
1. **浏览器访问** → localhost:3001（不是3000）
2. **代理拦截** → 识别API请求
3. **Mock判断** → 检查是否有Mock数据
4. **智能响应** → 返回Mock或转发到真实API

### 参数化Mock
系统会智能识别参数：
- GraphQL: 从variables中提取productId、orderId等
- REST: 从URL路径或查询参数提取

## 💡 实战使用技巧

### 技巧1: 开发新功能
```bash
# 1. 启动BEEP（如果还没启动）
cd ~/workspace/beep-v1-webapp
yarn start

# 2. 访问代理端口开发
open http://localhost:3001

# 3. 所有API都会被Mock处理，无需等待后端
```

### 技巧2: 测试边界情况
编辑 `parameterized-patch.js` 添加测试场景：
```javascript
// 模拟库存不足
if (pathname === '/api/gql/AddToCart' && scenario === 'outofstock') {
  return {
    errors: [{
      message: '商品库存不足',
      code: 'OUT_OF_STOCK'
    }]
  };
}
```

### 技巧3: 查看实时日志
```bash
# 查看代理服务器日志
tail -f proxy.log

# 你会看到：
# 📡 [1] API 请求: POST /api/gql/OnlineCategory
# 🎯 [1] 使用参数化Mock
# ✅ [1] Mock响应: 200 - 5ms (参数化)
```

## 🔍 调试技巧

### 检查Mock是否生效
1. 看控制台是否有 "使用参数化Mock" 提示
2. 检查响应头 `X-Mock-Source: parameterized`
3. 查看统计数据增长

### 常见问题
- **Q: 为什么没有使用Mock？**
  A: 确保访问的是3001端口，不是3000

- **Q: 如何添加新的Mock数据？**
  A: 编辑 `api-mocks-realtime.js` 或 `parameterized-patch.js`

- **Q: 如何切换测试场景？**
  A: 在 `parameterized-patch.js` 中添加场景逻辑

## 🎉 你已经掌握了！

现在你可以：
- ✅ 通过代理开发BEEP（无需等待API）
- ✅ 查看实时统计了解系统状态
- ✅ 自定义Mock响应测试各种场景
- ✅ 享受Mock-Driven Testing的所有好处

**记住：只需访问 localhost:3001 而不是 3000！**

## 📝 下一步建议

1. **立即尝试**: 打开浏览器访问 http://localhost:3001
2. **观察统计**: 刷新几次页面，查看 __mock_stats 变化
3. **自定义Mock**: 尝试修改 parameterized-patch.js
4. **开始测试**: 使用稳定的Mock数据编写测试

Happy Mock-Driven Testing! 🚀