#!/usr/bin/env node

/**
 * BEEP Mock服务器启动脚本
 * 
 * 功能：
 * 1. 启动Mock代理服务器 (端口3001)
 * 2. 启动Mock管理界面 (端口3002)
 * 3. 使用BEEP适配器处理真实Mock数据
 * 4. 支持场景切换和实时监控
 */

const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')
const cors = require('cors')
const path = require('path')
const chalk = require('chalk')

// 项目配置
const config = require('./config/projects.js')['beep-v1-webapp']

class BeepMockServer {
  constructor() {
    this.proxyApp = express()
    this.adminApp = express()
    this.mockStats = {
      totalRequests: 0,
      requestsByEndpoint: {},
      activeScenario: 'normal',
      startTime: new Date()
    }
    
    this.setupProxyServer()
    this.setupAdminInterface()
  }

  // 设置代理服务器
  setupProxyServer() {
    console.log(chalk.blue('🔧 设置BEEP Mock代理服务器...'))

    // CORS支持
    this.proxyApp.use(cors({
      origin: [`http://localhost:${config.targetPort}`, 'http://localhost:3000'],
      credentials: true
    }))

    // 解析JSON请求体
    this.proxyApp.use(express.json())

    // Mock拦截中间件
    this.proxyApp.use('/api/gql/*', this.mockInterceptor.bind(this))
    
    // 其他API请求代理到真实服务器
    this.proxyApp.use('/api', createProxyMiddleware({
      target: `https://${config.apiHost}`,
      changeOrigin: true,
      secure: true,
      onProxyReq: (proxyReq, req, res) => {
        console.log(chalk.gray(`🔄 代理请求: ${req.method} ${req.url}`))
      },
      onError: (err, req, res) => {
        console.log(chalk.red(`❌ 代理错误: ${err.message}`))
        res.status(500).json({ error: 'Proxy Error', message: err.message })
      }
    }))

    // 健康检查
    this.proxyApp.get('/health', (req, res) => {
      res.json({ 
        status: 'ok', 
        service: 'beep-mock-proxy',
        stats: this.mockStats 
      })
    })
  }

  // Mock拦截器
  mockInterceptor(req, res, next) {
    const operationName = this.extractOperationName(req)
    
    if (!operationName) {
      return next()
    }

    console.log(chalk.green(`🎯 Mock拦截: ${operationName}`))
    
    // 更新统计
    this.mockStats.totalRequests++
    this.mockStats.requestsByEndpoint[operationName] = 
      (this.mockStats.requestsByEndpoint[operationName] || 0) + 1

    // 添加Mock响应头
    res.setHeader('X-Mock-Used', 'true')
    res.setHeader('X-Mock-Scenario', this.mockStats.activeScenario)
    res.setHeader('X-Response-Time', Date.now())

    // 根据操作类型返回Mock数据
    const mockData = this.getMockData(operationName, req.body)
    
    // 添加延迟（如果配置了）
    const delay = this.getScenarioDelay()
    
    setTimeout(() => {
      res.json(mockData)
    }, delay)
  }

  // 提取GraphQL操作名
  extractOperationName(req) {
    // 从URL路径提取：/api/gql/OperationName
    const pathParts = req.path.split('/')
    return pathParts[pathParts.length - 1]
  }

  // 获取Mock数据
  getMockData(operationName, requestBody) {
    const scenario = this.mockStats.activeScenario

    console.log(chalk.yellow(`📋 场景: ${scenario}, 操作: ${operationName}`))

    switch (operationName) {
      case 'OnlineCategory':
        return this.getOnlineCategoryMock(scenario)
      
      case 'ProductDetail':
        return this.getProductDetailMock(scenario, requestBody)
      
      case 'AddOrUpdateShoppingCartItem':
        return this.getCartUpdateMock(scenario, requestBody)
      
      case 'GetShoppingCart':
        return this.getShoppingCartMock(scenario)
      
      default:
        console.log(chalk.orange(`⚠️ 未知操作: ${operationName}`))
        return this.getDefaultMock()
    }
  }

  // 商品分类Mock
  getOnlineCategoryMock(scenario) {
    if (scenario === 'empty') {
      return { data: { onlineCategory: [] } }
    }
    
    if (scenario === 'error') {
      return {
        errors: [{ 
          message: '商品分类加载失败', 
          extensions: { code: 'CATEGORY_LOAD_ERROR' } 
        }]
      }
    }

    return {
      data: {
        onlineCategory: [
          {
            id: "cat_bestseller",
            isEnabled: true,
            isBestSeller: true,
            name: "Best Seller",
            products: [
              {
                id: "prod_mocha",
                title: "Mocha",
                displayPrice: 25,
                originalDisplayPrice: null,
                trackInventory: false,
                images: ["https://example.com/mocha.jpg"],
                stock: 1,
                stockStatus: "notTrackInventory"
              }
            ]
          },
          {
            id: "cat_coffee",
            isEnabled: true,
            isBestSeller: false,
            name: "咖啡",
            products: [
              {
                id: "prod_latte",
                title: "拿铁咖啡",
                displayPrice: 12,
                originalDisplayPrice: 15,
                trackInventory: true,
                images: ["https://example.com/latte.jpg"],
                stock: 50,
                stockStatus: "inStock"
              },
              {
                id: "prod_americano",
                title: "美式咖啡",
                displayPrice: 8,
                originalDisplayPrice: 10,
                trackInventory: true,
                images: ["https://example.com/americano.jpg"],
                stock: 30,
                stockStatus: "inStock"
              }
            ]
          }
        ]
      }
    }
  }

  // 商品详情Mock
  getProductDetailMock(scenario, requestBody) {
    if (scenario === 'error') {
      return {
        errors: [{ 
          message: '商品不存在', 
          extensions: { code: 'PRODUCT_NOT_FOUND' } 
        }]
      }
    }

    const productId = requestBody?.variables?.productId || 'prod_latte'
    
    return {
      data: {
        productDetail: {
          id: productId,
          title: "拿铁咖啡",
          description: "浓郁的意式浓缩配上丝滑的蒸奶",
          displayPrice: 12,
          originalDisplayPrice: 15,
          images: ["https://example.com/latte.jpg"],
          variations: [
            {
              id: "var_size",
              name: "规格",
              options: [
                { id: "small", name: "小杯", priceAdjustment: -2 },
                { id: "medium", name: "中杯", priceAdjustment: 0 },
                { id: "large", name: "大杯", priceAdjustment: 3 }
              ]
            }
          ],
          stockStatus: scenario === 'outofstock' ? 'outOfStock' : 'inStock',
          stock: scenario === 'outofstock' ? 0 : 50
        }
      }
    }
  }

  // 购物车更新Mock
  getCartUpdateMock(scenario, requestBody) {
    if (scenario === 'error') {
      return {
        errors: [{ 
          message: '库存不足', 
          extensions: { 
            code: 'OUT_OF_STOCK',
            availableStock: 0
          } 
        }]
      }
    }

    const quantity = requestBody?.variables?.quantity || 1
    
    return {
      data: {
        addOrUpdateShoppingCartItem: {
          success: true,
          cartItem: {
            id: "cart_item_" + Date.now(),
            productId: requestBody?.variables?.productId || "prod_latte",
            quantity: quantity,
            unitPrice: 12.00,
            subtotal: quantity * 12.00
          }
        }
      }
    }
  }

  // 购物车Mock
  getShoppingCartMock(scenario) {
    if (scenario === 'empty') {
      return {
        data: {
          getShoppingCart: {
            items: [],
            itemCount: 0,
            subtotal: 0,
            tax: 0,
            total: 0
          }
        }
      }
    }

    return {
      data: {
        getShoppingCart: {
          items: [
            {
              id: "cart_item_1",
              product: {
                id: "prod_latte",
                title: "拿铁咖啡",
                images: ["https://example.com/latte.jpg"]
              },
              quantity: 2,
              unitPrice: 12.00,
              subtotal: 24.00
            }
          ],
          itemCount: 2,
          subtotal: 24.00,
          tax: 2.40,
          total: 26.40
        }
      }
    }
  }

  // 默认Mock响应
  getDefaultMock() {
    return {
      data: null,
      errors: [{ 
        message: 'Mock未实现该操作', 
        extensions: { code: 'MOCK_NOT_IMPLEMENTED' } 
      }]
    }
  }

  // 获取场景延迟
  getScenarioDelay() {
    const delays = {
      normal: 100,
      empty: 50,
      error: 200,
      slow: 3000
    }
    return delays[this.mockStats.activeScenario] || 100
  }

  // 设置管理界面
  setupAdminInterface() {
    console.log(chalk.blue('🎛️ 设置Mock管理界面...'))

    this.adminApp.use(cors())
    this.adminApp.use(express.json())

    // 静态文件服务
    this.adminApp.use(express.static(path.join(__dirname, 'public')))

    // API端点
    this.adminApp.get('/api/stats', (req, res) => {
      res.json(this.mockStats)
    })

    this.adminApp.post('/api/scenario', (req, res) => {
      const { scenario } = req.body
      const validScenarios = ['normal', 'empty', 'error', 'slow', 'outofstock']
      
      if (validScenarios.includes(scenario)) {
        this.mockStats.activeScenario = scenario
        console.log(chalk.cyan(`🔄 场景切换至: ${scenario}`))
        res.json({ success: true, activeScenario: scenario })
      } else {
        res.status(400).json({ success: false, error: '无效的场景' })
      }
    })

    this.adminApp.get('/api/scenarios', (req, res) => {
      res.json([
        { key: 'normal', name: '正常场景', description: '所有API正常响应' },
        { key: 'empty', name: '空数据场景', description: '返回空的商品列表' },
        { key: 'error', name: '错误场景', description: '模拟API错误' },
        { key: 'slow', name: '慢响应场景', description: '模拟网络缓慢' },
        { key: 'outofstock', name: '缺货场景', description: '模拟商品缺货' }
      ])
    })

    // 根路径返回管理界面
    this.adminApp.get('/', (req, res) => {
      res.send(this.getAdminHTML())
    })
  }

  // 生成管理界面HTML
  getAdminHTML() {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <title>BEEP Mock 管理界面</title>
        <meta charset="utf-8">
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
            .container { max-width: 1200px; margin: 0 auto; }
            .card { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
            .stat-item { text-align: center; padding: 15px; background: #007bff; color: white; border-radius: 5px; }
            .scenarios { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; }
            .scenario { padding: 15px; border: 2px solid #ddd; border-radius: 5px; cursor: pointer; transition: all 0.3s; }
            .scenario:hover { border-color: #007bff; }
            .scenario.active { border-color: #28a745; background: #f8fff9; }
            .endpoints { max-height: 300px; overflow-y: auto; }
            button { padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; }
            button:hover { background: #0056b3; }
            .log { background: #f8f9fa; padding: 15px; border-radius: 5px; font-family: monospace; max-height: 200px; overflow-y: auto; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🚀 BEEP Mock-Driven Testing 管理界面</h1>
            
            <div class="card">
                <h2>📊 统计信息</h2>
                <div class="stats" id="stats">
                    <!-- 动态加载 -->
                </div>
            </div>

            <div class="card">
                <h2>🎭 场景切换</h2>
                <div class="scenarios" id="scenarios">
                    <!-- 动态加载 -->
                </div>
            </div>

            <div class="card">
                <h2>📡 API端点调用统计</h2>
                <div class="endpoints" id="endpoints">
                    <!-- 动态加载 -->
                </div>
            </div>

            <div class="card">
                <h2>📝 操作日志</h2>
                <div class="log" id="log">
                    Mock服务器已启动...
                </div>
                <button onclick="clearLog()">清空日志</button>
            </div>
        </div>

        <script>
            let currentScenario = 'normal';
            let logMessages = [];

            function log(message) {
                const timestamp = new Date().toLocaleTimeString();
                logMessages.push(\`[\${timestamp}] \${message}\`);
                if (logMessages.length > 50) logMessages = logMessages.slice(-50);
                document.getElementById('log').innerHTML = logMessages.join('<br>');
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
                        <div class="stat-item">
                            <h3>\${stats.totalRequests}</h3>
                            <p>总请求数</p>
                        </div>
                        <div class="stat-item">
                            <h3>\${stats.activeScenario}</h3>
                            <p>当前场景</p>
                        </div>
                        <div class="stat-item">
                            <h3>\${Object.keys(stats.requestsByEndpoint).length}</h3>
                            <p>活跃端点</p>
                        </div>
                        <div class="stat-item">
                            <h3>\${new Date(stats.startTime).toLocaleTimeString()}</h3>
                            <p>启动时间</p>
                        </div>
                    \`;
                    document.getElementById('stats').innerHTML = statsHTML;

                    const endpointsHTML = Object.entries(stats.requestsByEndpoint)
                        .map(([endpoint, count]) => \`<p><strong>\${endpoint}:</strong> \${count} 次调用</p>\`)
                        .join('');
                    document.getElementById('endpoints').innerHTML = endpointsHTML || '<p>暂无API调用</p>';
                    
                    currentScenario = stats.activeScenario;
                } catch (error) {
                    log('❌ 加载统计信息失败: ' + error.message);
                }
            }

            async function loadScenarios() {
                try {
                    const response = await fetch('/api/scenarios');
                    const scenarios = await response.json();
                    
                    const scenariosHTML = scenarios.map(scenario => \`
                        <div class="scenario \${scenario.key === currentScenario ? 'active' : ''}" 
                             onclick="switchScenario('\${scenario.key}')">
                            <h3>\${scenario.name}</h3>
                            <p>\${scenario.description}</p>
                        </div>
                    \`).join('');
                    
                    document.getElementById('scenarios').innerHTML = scenariosHTML;
                } catch (error) {
                    log('❌ 加载场景失败: ' + error.message);
                }
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
                        log(\`🔄 场景切换至: \${scenario}\`);
                        currentScenario = scenario;
                        loadStats();
                        loadScenarios();
                    } else {
                        log('❌ 场景切换失败: ' + result.error);
                    }
                } catch (error) {
                    log('❌ 场景切换失败: ' + error.message);
                }
            }

            // 定期更新统计信息
            setInterval(loadStats, 3000);
            
            // 初始化
            loadStats();
            loadScenarios();
            log('🚀 管理界面已加载');
        </script>
    </body>
    </html>
    `
  }

  // 启动服务器
  start() {
    // 启动代理服务器
    const proxyPort = config.proxyPort
    this.proxyApp.listen(proxyPort, () => {
      console.log(chalk.green(`🚀 BEEP Mock代理服务器已启动`))
      console.log(chalk.blue(`📡 代理地址: http://localhost:${proxyPort}`))
      console.log(chalk.gray(`🎯 目标项目: ${config.name}`))
    })

    // 启动管理界面
    const adminPort = 3002
    this.adminApp.listen(adminPort, () => {
      console.log(chalk.green(`🎛️ Mock管理界面已启动`))
      console.log(chalk.blue(`🌐 管理地址: http://localhost:${adminPort}`))
    })

    console.log(chalk.yellow('🔧 配置您的BEEP项目:'))
    console.log(chalk.gray(`   1. 修改 .env.development 中的 REACT_APP_API_URL=http://localhost:${proxyPort}`))
    console.log(chalk.gray(`   2. 启动BEEP项目: npm start`))
    console.log(chalk.gray(`   3. 访问管理界面切换测试场景`))
  }
}

// 启动服务器
if (require.main === module) {
  console.log(chalk.cyan('🎯 启动BEEP Mock-Driven Testing服务器...'))
  const server = new BeepMockServer()
  server.start()
}

module.exports = BeepMockServer