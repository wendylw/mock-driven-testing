/**
 * BEEP Mock 适配器 - 基于现有的真实API数据
 * 
 * 这个适配器将现有的 api-mocks-realtime.js 转换为可灵活使用的Mock系统
 * 支持场景切换、动态响应、错误注入等功能
 */

import { rest, graphql } from 'msw'
import fs from 'fs'
import path from 'path'

class BeepMockAdapter {
  constructor() {
    this.originalHandlers = []
    this.scenarios = new Map()
    this.activeScenario = 'normal'
    this.loadOriginalData()
    this.createEnhancedHandlers()
  }

  // 加载原始Mock数据
  loadOriginalData() {
    try {
      // 动态导入原始handlers（处理ES模块）
      const mockDataPath = '../generated/beep-v1-webapp/api-mocks-realtime.js'
      console.log('📄 加载BEEP原始Mock数据...')
      
      // 这里我们需要解析原始文件并提取handlers
      // 由于原始文件使用ES模块，我们需要特殊处理
      this.parseMockData()
    } catch (error) {
      console.error('❌ 加载Mock数据失败:', error)
      this.originalHandlers = []
    }
  }

  // 解析原始Mock数据文件
  parseMockData() {
    const mockFilePath = path.join(__dirname, '../generated/beep-v1-webapp/api-mocks-realtime.js')
    
    // 临时方案：手动提取关键的GraphQL端点数据
    // 基于我们看到的文件内容创建handlers
    this.createBaseHandlers()
  }

  // 创建基础handlers（基于真实数据结构）
  createBaseHandlers() {
    console.log('🔧 创建基础Mock处理器...')
    
    // GraphQL: OnlineCategory
    this.originalHandlers.push({
      type: 'graphql',
      operation: 'OnlineCategory',
      handler: rest.post('/api/gql/OnlineCategory', (req, res, ctx) => {
        const scenario = this.getActiveScenario('OnlineCategory')
        return res(
          ctx.status(200),
          ctx.json(this.getOnlineCategoryData(scenario))
        )
      })
    })

    // GraphQL: ProductDetail
    this.originalHandlers.push({
      type: 'graphql',
      operation: 'ProductDetail',
      handler: rest.post('/api/gql/ProductDetail', (req, res, ctx) => {
        const scenario = this.getActiveScenario('ProductDetail')
        return res(
          ctx.status(200),
          ctx.json(this.getProductDetailData(scenario, req.body))
        )
      })
    })

    // GraphQL: AddOrUpdateShoppingCartItem
    this.originalHandlers.push({
      type: 'graphql',
      operation: 'AddOrUpdateShoppingCartItem',
      handler: rest.post('/api/gql/AddOrUpdateShoppingCartItem', (req, res, ctx) => {
        const scenario = this.getActiveScenario('AddOrUpdateShoppingCartItem')
        return res(
          ctx.status(200),
          ctx.json(this.getCartUpdateData(scenario, req.body))
        )
      })
    })

    // GraphQL: GetShoppingCart
    this.originalHandlers.push({
      type: 'graphql',
      operation: 'GetShoppingCart',
      handler: rest.post('/api/gql/GetShoppingCart', (req, res, ctx) => {
        const scenario = this.getActiveScenario('GetShoppingCart')
        return res(
          ctx.status(200),
          ctx.json(this.getShoppingCartData(scenario))
        )
      })
    })

    console.log(`✅ 创建了 ${this.originalHandlers.length} 个基础处理器`)
  }

  // 创建增强的handlers
  createEnhancedHandlers() {
    this.setupScenarios()
    console.log('🚀 BEEP Mock适配器初始化完成')
  }

  // 设置不同的测试场景
  setupScenarios() {
    // 正常场景
    this.scenarios.set('normal', {
      name: '正常业务场景',
      description: '所有API返回正常响应',
      config: {
        delay: 100,
        errorRate: 0
      }
    })

    // 空数据场景
    this.scenarios.set('empty', {
      name: '空数据场景',
      description: '返回空的商品列表和购物车',
      config: {
        delay: 50,
        errorRate: 0
      }
    })

    // 错误场景
    this.scenarios.set('error', {
      name: '错误场景',
      description: '模拟各种API错误',
      config: {
        delay: 200,
        errorRate: 0.3
      }
    })

    // 慢响应场景
    this.scenarios.set('slow', {
      name: '慢响应场景',
      description: '模拟网络缓慢的情况',
      config: {
        delay: 3000,
        errorRate: 0
      }
    })

    console.log(`📋 设置了 ${this.scenarios.size} 个测试场景`)
  }

  // 获取当前活跃场景
  getActiveScenario(operation) {
    const scenario = this.scenarios.get(this.activeScenario)
    return scenario ? this.activeScenario : 'normal'
  }

  // 切换场景
  switchScenario(scenarioName) {
    if (this.scenarios.has(scenarioName)) {
      this.activeScenario = scenarioName
      console.log(`🔄 切换到场景: ${scenarioName}`)
      return true
    }
    console.warn(`⚠️ 场景不存在: ${scenarioName}`)
    return false
  }

  // 获取商品分类数据
  getOnlineCategoryData(scenario) {
    const baseData = {
      "data": {
        "onlineCategory": [
          {
            "id": "b4a8947ab841eccd36f370f8e95027bc",
            "isEnabled": true,
            "isBestSeller": true,
            "name": "Best Seller",
            "products": [
              {
                "id": "67287c47e097f800076d2c77",
                "title": "Mocha",
                "displayPrice": 25,
                "originalDisplayPrice": null,
                "trackInventory": false,
                "images": [
                  "https://d16kpilgrxu9w6.cloudfront.net/coffee/product/67287c47e097f800076d2c77/bf3a71bd-cc82-4d91-e702-aa7975a16a81"
                ],
                "stock": 1,
                "stockStatus": "notTrackInventory"
              }
            ]
          },
          {
            "id": "cat_coffee_001",
            "isEnabled": true,
            "isBestSeller": false,
            "name": "咖啡",
            "products": [
              {
                "id": "prod_latte_001",
                "title": "拿铁咖啡",
                "displayPrice": 12,
                "originalDisplayPrice": 15,
                "trackInventory": true,
                "images": [
                  "https://example.com/latte.jpg"
                ],
                "stock": 50,
                "stockStatus": "inStock"
              },
              {
                "id": "prod_americano_001",
                "title": "美式咖啡",
                "displayPrice": 8,
                "originalDisplayPrice": 10,
                "trackInventory": true,
                "images": [
                  "https://example.com/americano.jpg"
                ],
                "stock": 30,
                "stockStatus": "inStock"
              }
            ]
          }
        ]
      }
    }

    // 根据场景修改数据
    if (scenario === 'empty') {
      baseData.data.onlineCategory = []
    } else if (scenario === 'error') {
      return {
        "errors": [
          {
            "message": "商品分类加载失败",
            "extensions": {
              "code": "CATEGORY_LOAD_ERROR"
            }
          }
        ]
      }
    }

    return baseData
  }

  // 获取商品详情数据
  getProductDetailData(scenario, requestBody) {
    const productId = requestBody?.variables?.productId || 'default'
    
    const baseData = {
      "data": {
        "productDetail": {
          "id": productId,
          "title": "拿铁咖啡",
          "description": "浓郁的意式浓缩配上丝滑的蒸奶",
          "displayPrice": 12,
          "originalDisplayPrice": 15,
          "images": [
            "https://example.com/latte.jpg"
          ],
          "variations": [
            {
              "id": "var_size",
              "name": "规格",
              "options": [
                { "id": "small", "name": "小杯", "priceAdjustment": -2 },
                { "id": "medium", "name": "中杯", "priceAdjustment": 0 },
                { "id": "large", "name": "大杯", "priceAdjustment": 3 }
              ]
            },
            {
              "id": "var_temperature",
              "name": "温度",
              "options": [
                { "id": "hot", "name": "热饮", "priceAdjustment": 0 },
                { "id": "cold", "name": "冰饮", "priceAdjustment": 1 }
              ]
            }
          ],
          "modifiers": [
            {
              "id": "mod_sugar",
              "name": "糖度",
              "options": [
                { "id": "no_sugar", "name": "无糖", "priceAdjustment": 0 },
                { "id": "less_sugar", "name": "少糖", "priceAdjustment": 0 },
                { "id": "normal_sugar", "name": "正常", "priceAdjustment": 0 }
              ]
            }
          ],
          "stockStatus": "inStock",
          "stock": 50
        }
      }
    }

    if (scenario === 'error') {
      return {
        "errors": [
          {
            "message": "商品不存在",
            "extensions": {
              "code": "PRODUCT_NOT_FOUND"
            }
          }
        ]
      }
    }

    return baseData
  }

  // 获取购物车更新数据
  getCartUpdateData(scenario, requestBody) {
    if (scenario === 'error') {
      return {
        "errors": [
          {
            "message": "库存不足",
            "extensions": {
              "code": "OUT_OF_STOCK",
              "availableStock": 0
            }
          }
        ]
      }
    }

    const quantity = requestBody?.variables?.quantity || 1
    const unitPrice = 12.00

    return {
      "data": {
        "addOrUpdateShoppingCartItem": {
          "success": true,
          "cartItem": {
            "id": "cart_item_" + Date.now(),
            "productId": requestBody?.variables?.productId || "prod_001",
            "quantity": quantity,
            "unitPrice": unitPrice,
            "subtotal": quantity * unitPrice
          }
        }
      }
    }
  }

  // 获取购物车数据
  getShoppingCartData(scenario) {
    if (scenario === 'empty') {
      return {
        "data": {
          "getShoppingCart": {
            "items": [],
            "itemCount": 0,
            "subtotal": 0,
            "tax": 0,
            "total": 0
          }
        }
      }
    }

    if (scenario === 'error') {
      return {
        "errors": [
          {
            "message": "购物车加载失败",
            "extensions": {
              "code": "CART_LOAD_ERROR"
            }
          }
        ]
      }
    }

    return {
      "data": {
        "getShoppingCart": {
          "items": [
            {
              "id": "cart_item_1",
              "product": {
                "id": "prod_latte_001",
                "title": "拿铁咖啡",
                "images": ["https://example.com/latte.jpg"]
              },
              "quantity": 2,
              "unitPrice": 12.00,
              "subtotal": 24.00,
              "selectedVariations": [
                { "name": "规格", "value": "中杯" },
                { "name": "温度", "value": "热饮" }
              ]
            }
          ],
          "itemCount": 2,
          "subtotal": 24.00,
          "tax": 2.40,
          "total": 26.40
        }
      }
    }
  }

  // 获取所有handlers
  getHandlers() {
    return this.originalHandlers.map(h => h.handler)
  }

  // 获取场景列表
  getScenarios() {
    return Array.from(this.scenarios.entries()).map(([key, value]) => ({
      key,
      ...value
    }))
  }

  // 获取统计信息
  getStats() {
    return {
      totalHandlers: this.originalHandlers.length,
      activeScenario: this.activeScenario,
      availableScenarios: this.scenarios.size,
      lastUpdated: new Date().toISOString()
    }
  }
}

// 创建全局实例
const beepAdapter = new BeepMockAdapter()

// 导出
export default beepAdapter
export const beepHandlers = beepAdapter.getHandlers()
export const switchScenario = (scenario) => beepAdapter.switchScenario(scenario)
export const getScenarios = () => beepAdapter.getScenarios()
export const getStats = () => beepAdapter.getStats()