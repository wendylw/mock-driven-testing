#!/bin/bash
cd /Users/wendylin/workspace/mock-driven-testing
echo "🚀 启动代理服务器..."
node proxy-final.js &
PID=$!
echo "✅ 代理服务器已启动，PID: $PID"
echo $PID > proxy.pid
echo "💡 停止服务器: kill $(cat proxy.pid)"