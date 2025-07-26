#!/usr/bin/env node

/**
 * 最简单的代理测试
 */

const http = require('http');

// 创建一个最简单的代理服务器
const server = http.createServer((req, res) => {
  console.log(`收到请求: ${req.method} ${req.url} from ${req.headers.host}`);
  
  // 如果是测试端点
  if (req.url === '/test') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('代理服务器工作正常！');
    return;
  }
  
  // 代理到 localhost:3000
  const options = {
    hostname: '127.0.0.1',
    port: 3000,
    path: req.url,
    method: req.method,
    headers: {
      ...req.headers,
      host: req.headers.host.replace(':3001', ':3000')
    }
  };
  
  console.log('代理请求到:', options.hostname + ':' + options.port + options.path);
  
  const proxyReq = http.request(options, (proxyRes) => {
    console.log('收到响应:', proxyRes.statusCode);
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });
  
  proxyReq.on('error', (err) => {
    console.error('代理错误:', err.message);
    res.writeHead(502);
    res.end('Bad Gateway: ' + err.message);
  });
  
  req.pipe(proxyReq);
});

server.listen(3001, () => {
  console.log('测试代理服务器启动在 http://localhost:3001');
  console.log('测试: http://localhost:3001/test');
});

server.on('error', (err) => {
  console.error('服务器错误:', err);
});