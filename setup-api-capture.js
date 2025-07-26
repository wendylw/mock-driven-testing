#!/usr/bin/env node

/**
 * 在 beep-v1-webapp 的 setupProxy.js 中注入 API 捕获代码
 */

const fs = require('fs');
const path = require('path');

const setupProxyPath = path.join(__dirname, '../beep-v1-webapp/src/setupProxy.js');
const captureCodePath = path.join(__dirname, 'api-capture-middleware.js');

// 创建 API 捕获中间件
const captureMiddlewareCode = `
// API 捕获中间件 - 由 mock-driven-testing 自动注入
const apiCaptureMiddleware = (() => {
  const fs = require('fs');
  const path = require('path');
  
  const capturedAPIs = [];
  const captureDir = path.join(__dirname, '../../mock-driven-testing/captured-data');
  
  // 确保目录存在
  if (!fs.existsSync(captureDir)) {
    fs.mkdirSync(captureDir, { recursive: true });
  }
  
  return (req, res, next) => {
    if (req.url.startsWith('/api/')) {
      const originalSend = res.send;
      const originalJson = res.json;
      const startTime = Date.now();
      
      // 拦截响应
      res.send = function(data) {
        const responseTime = Date.now() - startTime;
        capturedAPIs.push({
          timestamp: new Date().toISOString(),
          method: req.method,
          url: req.url,
          endpoint: req.path,
          query: req.query,
          body: req.body,
          response: tryParseJSON(data),
          responseTime: responseTime,
          statusCode: res.statusCode
        });
        
        console.log(\`📸 已捕获 API: \${req.method} \${req.path} (\${res.statusCode}) - \${responseTime}ms\`);
        
        // 每 10 个请求保存一次
        if (capturedAPIs.length % 10 === 0) {
          saveCapturedData();
        }
        
        return originalSend.call(this, data);
      };
      
      res.json = function(data) {
        const responseTime = Date.now() - startTime;
        capturedAPIs.push({
          timestamp: new Date().toISOString(),
          method: req.method,
          url: req.url,
          endpoint: req.path,
          query: req.query,
          body: req.body,
          response: data,
          responseTime: responseTime,
          statusCode: res.statusCode
        });
        
        console.log(\`📸 已捕获 API: \${req.method} \${req.path} (\${res.statusCode}) - \${responseTime}ms\`);
        
        // 每 10 个请求保存一次
        if (capturedAPIs.length % 10 === 0) {
          saveCapturedData();
        }
        
        return originalJson.call(this, data);
      };
    }
    
    next();
  };
  
  function tryParseJSON(data) {
    if (typeof data === 'string') {
      try {
        return JSON.parse(data);
      } catch {
        return data;
      }
    }
    return data;
  }
  
  function saveCapturedData() {
    const filename = \`api-capture-\${new Date().toISOString().split('T')[0]}.json\`;
    const filepath = path.join(captureDir, filename);
    
    fs.writeFileSync(filepath, JSON.stringify({
      captureDate: new Date().toISOString(),
      totalCalls: capturedAPIs.length,
      calls: capturedAPIs
    }, null, 2));
    
    console.log(\`💾 已保存 \${capturedAPIs.length} 个 API 调用到: \${filepath}\`);
  }
  
  // 程序退出时保存
  process.on('SIGINT', () => {
    if (capturedAPIs.length > 0) {
      saveCapturedData();
    }
    process.exit(0);
  });
  
  return { middleware: apiCaptureMiddleware, capturedAPIs };
})();
`;

// 读取原始 setupProxy.js
const originalContent = fs.readFileSync(setupProxyPath, 'utf8');

// 检查是否已经注入
if (originalContent.includes('API 捕获中间件')) {
  console.log('✅ API 捕获代码已经存在，无需重复注入');
  process.exit(0);
}

// 找到 module.exports 的位置
const moduleExportsIndex = originalContent.indexOf('module.exports = function(app)');

if (moduleExportsIndex === -1) {
  console.error('❌ 找不到 module.exports，请检查 setupProxy.js 格式');
  process.exit(1);
}

// 在 module.exports 之前注入代码
const newContent = 
  originalContent.slice(0, moduleExportsIndex) +
  '\n' + captureMiddlewareCode + '\n\n' +
  originalContent.slice(moduleExportsIndex).replace(
    'module.exports = function(app) {',
    `module.exports = function(app) {
  // 使用 API 捕获中间件
  app.use(apiCaptureMiddleware.middleware);
  console.log('🎯 API 捕获中间件已启动！');
  `
  );

// 备份原始文件
const backupPath = setupProxyPath + '.backup.' + Date.now();
fs.copyFileSync(setupProxyPath, backupPath);
console.log(`📦 已备份原始文件到: ${backupPath}`);

// 写入新内容
fs.writeFileSync(setupProxyPath, newContent);
console.log('✅ 已成功注入 API 捕获代码！');
console.log('\n下一步：');
console.log('1. 重启 beep-v1-webapp (Ctrl+C 然后 yarn start)');
console.log('2. 正常访问 http://coffee.beep.local.shub.us:3000');
console.log('3. API 调用会被自动捕获到 mock-driven-testing/captured-data/');
console.log('\n恢复原始文件：');
console.log(`cp ${backupPath} ${setupProxyPath}`);