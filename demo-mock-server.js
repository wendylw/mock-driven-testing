#!/usr/bin/env node

/**
 * BEEP Mock服务器演示版
 * 使用Node.js内置模块，无需额外依赖
 */

const http = require('http')
const url = require('url')
const fs = require('fs')
const path = require('path')

class BeepMockDemo {
  constructor() {
    this.port = 3001
    this.adminPort = 3002
    this.scenario = 'normal'
    this.stats = {
      totalRequests: 0,
      requestsByEndpoint: {},
      startTime: new Date().toISOString()
    }
    
    console.log('🚀 启动BEEP Mock-Driven Testing演示服务器...')
    this.startMockServer()
    this.startAdminServer()
  }

  log(message, color = 'white') {
    const colors = {
      red: '\x1b[31m',
      green: '\x1b[32m',
      yellow: '\x1b[33m',
      blue: '\x1b[34m',
      cyan: '\x1b[36m',
      white: '\x1b[37m',
      reset: '\x1b[0m'
    }
    
    const timestamp = new Date().toLocaleTimeString()
    console.log(`${colors[color]}[${timestamp}] ${message}${colors.reset}`)
  }

  startMockServer() {
    const server = http.createServer((req, res) => {
      // 设置CORS头
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      
      // 处理OPTIONS预检请求
      if (req.method === 'OPTIONS') {
        res.statusCode = 200
        res.end()
        return
      }

      const parsedUrl = url.parse(req.url, true)
      const pathname = parsedUrl.pathname
      
      // 统计请求
      this.stats.totalRequests++
      
      // GraphQL API处理
      if (pathname.startsWith('/api/gql/')) {
        this.handleGraphQL(req, res, pathname)
      } else if (pathname === '/api/orders') {
        this.handleOrders(req, res)
      } else if (pathname === '/health') {
        this.handleHealth(req, res)
      } else {
        res.statusCode = 404
        res.end('Not Found')
      }
    })

    server.listen(this.port, () => {
      this.log(`🎯 Mock代理服务器启动成功: http://localhost:${this.port}`, 'green')
      this.log(`📡 支持的端点:`, 'cyan')
      this.log(`   - POST /api/gql/OnlineCategory`, 'cyan')
      this.log(`   - POST /api/gql/ProductDetail`, 'cyan') 
      this.log(`   - POST /api/gql/AddOrUpdateShoppingCartItem`, 'cyan')
      this.log(`   - POST /api/gql/GetShoppingCart`, 'cyan')
      this.log(`   - GET /health`, 'cyan')
    })
  }

  handleGraphQL(req, res, pathname) {
    const operationName = pathname.split('/').pop()
    
    // 更新统计
    this.stats.requestsByEndpoint[operationName] = 
      (this.stats.requestsByEndpoint[operationName] || 0) + 1
    
    this.log(`🎭 GraphQL请求: ${operationName} (场景: ${this.scenario})`, 'yellow')
    
    // 收集请求体
    let body = ''
    req.on('data', chunk => {
      body += chunk.toString()
    })
    
    req.on('end', () => {
      try {
        const requestData = JSON.parse(body || '{}')
        const mockData = this.getMockData(operationName, requestData)
        
        // 添加Mock响应头
        res.setHeader('Content-Type', 'application/json')
        res.setHeader('X-Mock-Used', 'true')
        res.setHeader('X-Mock-Scenario', this.scenario)
        res.setHeader('X-Response-Time', Date.now())
        
        // 模拟延迟
        const delay = this.getDelay()
        setTimeout(() => {
          res.statusCode = 200
          res.end(JSON.stringify(mockData, null, 2))
          this.log(`✅ 响应发送: ${operationName} (延迟: ${delay}ms)`, 'green')
        }, delay)
        
      } catch (error) {
        this.log(`❌ 处理错误: ${error.message}`, 'red')
        res.statusCode = 500
        res.end(JSON.stringify({ error: error.message }))
      }
    })
  }

  getMockData(operationName, requestData) {
    switch (operationName) {
      case 'OnlineCategory':
        return this.getOnlineCategoryData()
      case 'ProductDetail':
        return this.getProductDetailData(requestData)
      case 'AddOrUpdateShoppingCartItem':
        return this.getCartUpdateData(requestData)
      case 'GetShoppingCart':
        return this.getShoppingCartData()
      default:
        return { error: `未实现的操作: ${operationName}` }
    }
  }

  getOnlineCategoryData() {
    if (this.scenario === 'error') {
      return {
        errors: [{ 
          message: '商品分类加载失败', 
          extensions: { code: 'CATEGORY_LOAD_ERROR' } 
        }]
      }
    }
    
    if (this.scenario === 'empty') {
      return { data: { onlineCategory: [] } }
    }

    return {
      data: {
        onlineCategory: [
          {
            id: "bestseller",
            name: "热门推荐",
            products: [
              {
                id: "prod_mocha",
                title: "摩卡咖啡",
                displayPrice: 25,
                stockStatus: this.scenario === 'outofstock' ? 'outOfStock' : 'inStock'
              },
              {
                id: "prod_latte", 
                title: "拿铁咖啡",
                displayPrice: 18,
                stockStatus: 'inStock'
              }
            ]
          },
          {
            id: "coffee",
            name: "精品咖啡",
            products: [
              {
                id: "prod_americano",
                title: "美式咖啡", 
                displayPrice: 12,
                stockStatus: 'inStock'
              },
              {
                id: "prod_cappuccino",
                title: "卡布奇诺",
                displayPrice: 16,
                stockStatus: 'inStock'
              }
            ]
          }
        ]
      }
    }
  }

  getProductDetailData(requestData) {
    const productId = requestData?.variables?.productId || 'prod_latte'
    
    if (this.scenario === 'error') {
      return {
        errors: [{ 
          message: '商品详情加载失败', 
          extensions: { code: 'PRODUCT_NOT_FOUND' } 
        }]
      }
    }

    return {
      data: {
        productDetail: {
          id: productId,
          title: "拿铁咖啡",
          description: "香浓意式浓缩搭配丝滑蒸奶",
          displayPrice: 18,
          stockStatus: this.scenario === 'outofstock' ? 'outOfStock' : 'inStock',
          variations: [
            { id: "size_s", name: "小杯", priceAdjustment: -3 },
            { id: "size_m", name: "中杯", priceAdjustment: 0 },
            { id: "size_l", name: "大杯", priceAdjustment: 4 }
          ]
        }
      }
    }
  }

  getCartUpdateData(requestData) {
    const { productId, quantity } = requestData?.variables || {}
    
    if (this.scenario === 'error' || this.scenario === 'outofstock') {
      return {
        errors: [{ 
          message: this.scenario === 'outofstock' ? '库存不足' : '添加失败',
          extensions: { 
            code: this.scenario === 'outofstock' ? 'OUT_OF_STOCK' : 'ADD_CART_ERROR'
          } 
        }]
      }
    }

    return {
      data: {
        addOrUpdateShoppingCartItem: {
          success: true,
          cartItem: {
            id: `item_${Date.now()}`,
            productId: productId || 'prod_latte',
            quantity: quantity || 1,
            subtotal: (quantity || 1) * 18
          }
        }
      }
    }
  }

  getShoppingCartData() {
    if (this.scenario === 'empty') {
      return {
        data: {
          getShoppingCart: {
            items: [],
            itemCount: 0,
            subtotal: 0,
            total: 0
          }
        }
      }
    }

    if (this.scenario === 'error') {
      return {
        errors: [{ 
          message: '购物车加载失败', 
          extensions: { code: 'CART_LOAD_ERROR' } 
        }]
      }
    }

    return {
      data: {
        getShoppingCart: {
          items: [
            {
              id: "item_1",
              product: { title: "拿铁咖啡" },
              quantity: 2,
              unitPrice: 18,
              subtotal: 36
            }
          ],
          itemCount: 2,
          subtotal: 36,
          tax: 3.6,
          total: 39.6
        }
      }
    }
  }

  getDelay() {
    const delays = {
      normal: 100,
      empty: 50,
      error: 200,
      slow: 2000,
      outofstock: 100
    }
    return delays[this.scenario] || 100
  }

  handleHealth(req, res) {
    res.setHeader('Content-Type', 'application/json')
    res.statusCode = 200
    res.end(JSON.stringify({
      status: 'ok',
      scenario: this.scenario,
      stats: this.stats
    }))
  }

  handleOrders(req, res) {
    res.setHeader('Content-Type', 'application/json')
    res.statusCode = 200
    res.end(JSON.stringify({
      id: 'order_demo',
      status: 'confirmed',
      total: 39.6
    }))
  }

  startAdminServer() {
    const adminServer = http.createServer((req, res) => {
      const parsedUrl = url.parse(req.url, true)
      const pathname = parsedUrl.pathname
      
      if (pathname === '/') {
        this.serveAdminPage(res)
      } else if (pathname === '/api/stats') {
        this.serveStats(res)
      } else if (pathname === '/api/scenario' && req.method === 'POST') {
        this.handleScenarioChange(req, res)
      } else {
        res.statusCode = 404
        res.end('Not Found')
      }
    })

    adminServer.listen(this.adminPort, () => {
      this.log(`🎛️ Mock管理界面启动: http://localhost:${this.adminPort}`, 'blue')
      this.log(`✨ 在浏览器中打开管理界面来切换测试场景`, 'blue')
    })
  }

  serveStats(res) {
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.statusCode = 200
    res.end(JSON.stringify({
      ...this.stats,
      activeScenario: this.scenario
    }))
  }

  handleScenarioChange(req, res) {
    let body = ''
    req.on('data', chunk => {
      body += chunk.toString()
    })
    
    req.on('end', () => {
      try {
        const { scenario } = JSON.parse(body)
        const validScenarios = ['normal', 'empty', 'error', 'slow', 'outofstock']
        
        if (validScenarios.includes(scenario)) {
          this.scenario = scenario
          this.log(`🔄 场景切换: ${scenario}`, 'cyan')
          
          res.setHeader('Content-Type', 'application/json')
          res.setHeader('Access-Control-Allow-Origin', '*')
          res.statusCode = 200
          res.end(JSON.stringify({ success: true, scenario }))
        } else {
          res.statusCode = 400
          res.end(JSON.stringify({ error: 'Invalid scenario' }))
        }
      } catch (error) {
        res.statusCode = 400
        res.end(JSON.stringify({ error: error.message }))
      }
    })
  }

  serveAdminPage(res) {
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>🚀 BEEP Mock管理界面</title>
    <meta charset="utf-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container { 
            max-width: 1200px; 
            margin: 0 auto; 
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 { font-size: 2.5em; margin-bottom: 10px; }
        .header p { opacity: 0.9; font-size: 1.1em; }
        .content { padding: 30px; }
        .stats { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
            gap: 20px; 
            margin-bottom: 30px;
        }
        .stat-card { 
            background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
            padding: 20px; 
            border-radius: 10px; 
            text-align: center;
            color: white;
            box-shadow: 0 8px 16px rgba(0,0,0,0.1);
        }
        .stat-number { font-size: 2.5em; font-weight: bold; }
        .stat-label { font-size: 0.9em; opacity: 0.9; margin-top: 5px; }
        .scenarios { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
            gap: 20px;
            margin-bottom: 30px;
        }
        .scenario { 
            padding: 20px; 
            border: 2px solid #e0e0e0; 
            border-radius: 10px; 
            cursor: pointer; 
            transition: all 0.3s;
            background: #f8f9fa;
        }
        .scenario:hover { 
            border-color: #667eea; 
            transform: translateY(-2px);
            box-shadow: 0 8px 16px rgba(0,0,0,0.1);
        }
        .scenario.active { 
            border-color: #28a745; 
            background: linear-gradient(135deg, #d4ffd4 0%, #e8ffe8 100%);
        }
        .scenario h3 { margin-bottom: 10px; color: #333; }
        .scenario p { color: #666; font-size: 0.9em; }
        .demo-section {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 20px;
        }
        .demo-button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            margin: 5px;
            transition: all 0.3s;
        }
        .demo-button:hover { transform: translateY(-2px); }
        .log {
            background: #000;
            color: #00ff00;
            padding: 15px;
            border-radius: 10px;
            font-family: 'Courier New', monospace;
            height: 200px;
            overflow-y: auto;
            font-size: 0.9em;
        }
        .endpoints {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 BEEP Mock-Driven Testing</h1>
            <p>实时Mock服务器管理界面 - 演示版</p>
        </div>
        
        <div class="content">
            <div class="stats" id="stats">
                <!-- 动态加载统计 -->
            </div>

            <div class="demo-section">
                <h2>🎮 快速测试体验</h2>
                <p>点击按钮测试不同的API调用：</p>
                <button class="demo-button" onclick="testAPI('OnlineCategory')">测试商品分类</button>
                <button class="demo-button" onclick="testAPI('ProductDetail')">测试商品详情</button>
                <button class="demo-button" onclick="testAPI('GetShoppingCart')">测试购物车</button>
                <button class="demo-button" onclick="testAPI('AddToCart')">测试添加购物车</button>
            </div>

            <div class="demo-section">
                <h2>🎭 场景切换</h2>
                <div class="scenarios" id="scenarios">
                    <!-- 动态加载场景 -->
                </div>
            </div>

            <div class="demo-section">
                <h2>📊 API端点统计</h2>
                <div class="endpoints" id="endpoints">
                    <!-- 动态加载端点统计 -->
                </div>
            </div>

            <div class="demo-section">
                <h2>📝 实时日志</h2>
                <div class="log" id="log"></div>
                <button class="demo-button" onclick="clearLog()">清空日志</button>
            </div>
        </div>
    </div>

    <script>
        let currentScenario = 'normal';
        let logMessages = [];

        function log(message) {
            const timestamp = new Date().toLocaleTimeString();
            logMessages.push(\`[\${timestamp}] \${message}\`);
            if (logMessages.length > 20) logMessages = logMessages.slice(-20);
            document.getElementById('log').innerHTML = logMessages.join('<br>');
            document.getElementById('log').scrollTop = document.getElementById('log').scrollHeight;
        }

        function clearLog() {
            logMessages = [];
            document.getElementById('log').innerHTML = '';
        }

        async function loadStats() {
            try {
                const response = await fetch('/api/stats');
                const stats = await response.json();
                
                const statsHTML = \`
                    <div class="stat-card">
                        <div class="stat-number">\${stats.totalRequests}</div>
                        <div class="stat-label">总请求数</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">\${stats.activeScenario}</div>
                        <div class="stat-label">当前场景</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">\${Object.keys(stats.requestsByEndpoint).length}</div>
                        <div class="stat-label">活跃端点</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">\${new Date(stats.startTime).toLocaleTimeString()}</div>
                        <div class="stat-label">启动时间</div>
                    </div>
                \`;
                document.getElementById('stats').innerHTML = statsHTML;

                const endpointsHTML = Object.entries(stats.requestsByEndpoint)
                    .map(([endpoint, count]) => \`<p><strong>\${endpoint}:</strong> \${count} 次调用</p>\`)
                    .join('');
                document.getElementById('endpoints').innerHTML = endpointsHTML || '<p>暂无API调用</p>';
                
                currentScenario = stats.activeScenario;
                updateScenarios();
            } catch (error) {
                log('❌ 加载统计失败: ' + error.message);
            }
        }

        function updateScenarios() {
            const scenarios = [
                { key: 'normal', name: '正常场景', desc: '所有API正常响应，返回完整数据' },
                { key: 'empty', name: '空数据场景', desc: '返回空的商品列表和购物车' },
                { key: 'error', name: '错误场景', desc: '模拟API错误和异常情况' },
                { key: 'slow', name: '慢响应场景', desc: '模拟网络缓慢，响应延迟2秒' },
                { key: 'outofstock', name: '缺货场景', desc: '模拟商品库存不足' }
            ];
            
            const scenariosHTML = scenarios.map(scenario => \`
                <div class="scenario \${scenario.key === currentScenario ? 'active' : ''}" 
                     onclick="switchScenario('\${scenario.key}')">
                    <h3>\${scenario.name}</h3>
                    <p>\${scenario.desc}</p>
                </div>
            \`).join('');
            
            document.getElementById('scenarios').innerHTML = scenariosHTML;
        }

        async function switchScenario(scenario) {
            try {
                const response = await fetch('/api/scenario', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ scenario })
                });
                
                const result = await response.json();
                if (result.success) {
                    log(\`🔄 场景切换成功: \${scenario}\`);
                    currentScenario = scenario;
                    updateScenarios();
                    loadStats();
                } else {
                    log('❌ 场景切换失败: ' + result.error);
                }
            } catch (error) {
                log('❌ 场景切换失败: ' + error.message);
            }
        }

        async function testAPI(apiType) {
            log(\`🎯 开始测试: \${apiType}\`);
            
            const apiCalls = {
                'OnlineCategory': {
                    url: 'http://localhost:3001/api/gql/OnlineCategory',
                    body: { operationName: 'OnlineCategory', variables: {} }
                },
                'ProductDetail': {
                    url: 'http://localhost:3001/api/gql/ProductDetail',
                    body: { operationName: 'ProductDetail', variables: { productId: 'prod_latte' } }
                },
                'GetShoppingCart': {
                    url: 'http://localhost:3001/api/gql/GetShoppingCart',
                    body: { operationName: 'GetShoppingCart', variables: {} }
                },
                'AddToCart': {
                    url: 'http://localhost:3001/api/gql/AddOrUpdateShoppingCartItem',
                    body: { operationName: 'AddOrUpdateShoppingCartItem', variables: { productId: 'prod_latte', quantity: 1 } }
                }
            };
            
            const apiCall = apiCalls[apiType];
            if (!apiCall) {
                log('❌ 未知的API类型: ' + apiType);
                return;
            }
            
            try {
                const response = await fetch(apiCall.url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(apiCall.body)
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    if (data.errors) {
                        log(\`⚠️ \${apiType} 返回错误: \${data.errors[0].message}\`);
                    } else {
                        log(\`✅ \${apiType} 调用成功\`);
                    }
                } else {
                    log(\`❌ \${apiType} 调用失败: HTTP \${response.status}\`);
                }
                
                // 刷新统计
                setTimeout(loadStats, 500);
                
            } catch (error) {
                log(\`❌ \${apiType} 网络错误: \${error.message}\`);
            }
        }

        // 初始化
        loadStats();
        setInterval(loadStats, 5000); // 每5秒更新统计
        log('🚀 BEEP Mock管理界面已加载');
        log('💡 提示：切换不同场景体验Mock功能');
    </script>
</body>
</html>
    `
    
    res.setHeader('Content-Type', 'text/html')
    res.statusCode = 200
    res.end(html)
  }
}

// 启动演示服务器
new BeepMockDemo()