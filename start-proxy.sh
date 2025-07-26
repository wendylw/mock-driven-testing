#!/bin/bash

echo "🚀 启动 Mock-Driven Testing 代理服务器..."

# 检查依赖
if ! npm list express >/dev/null 2>&1; then
    echo "📦 安装依赖..."
    npm install express http-proxy-middleware --no-save
fi

# 启动代理服务器
echo "✨ 代理服务器启动中..."
node proxy-server.js