# 让 beep-v1-webapp 支持自定义域名访问

如果你想让 beep-v1-webapp 直接支持 `http://coffee.beep.local.shub.us:3000`，需要修改配置：

## 方法 1：环境变量（临时）

```bash
DANGEROUSLY_DISABLE_HOST_CHECK=true yarn start
```

## 方法 2：修改 craco.config.js（永久）

在 `beep-v1-webapp/craco.config.js` 中添加：

```javascript
module.exports = {
  devServer: {
    allowedHosts: [
      'localhost',
      '.beep.local.shub.us'  // 允许所有 *.beep.local.shub.us
    ],
    // 或者完全禁用 host 检查（不推荐）
    // disableHostCheck: true
  },
  // ... 其他配置
};
```

## 方法 3：使用 setupProxy.js

在 `src/setupProxy.js` 中已经有代理配置，可以在那里添加自定义逻辑。

## 为什么使用代理服务器更好？

1. **不需要修改源代码**
2. **可以捕获和分析 API 调用**
3. **可以实时生成 Mock 数据**
4. **支持多个域名同时工作**