#!/usr/bin/env node

/**
 * 简化的POS Mock Server测试启动脚本
 */

const express = require('express');
const cors = require('cors');

// 创建简化的状态管理器
class SimpleStateManager {
  constructor() {
    this.data = {
      stores: [
        {
          id: 'store_001',
          name: 'Main Branch Cafe',
          address: '123 Jalan Bukit Bintang, Kuala Lumpur',
          currency: 'MYR',
          status: 'active'
        }
      ],
      employees: [
        {
          id: 'emp_001',
          name: 'John Cashier',
          email: 'john@mockcafe.com',
          role: 'cashier',
          storeId: 'store_001',
          active: true
        },
        {
          id: 'emp_002',
          name: 'Sarah Manager',
          email: 'sarah@mockcafe.com',
          role: 'manager',
          storeId: 'store_001',
          active: true
        }
      ],
      products: [
        {
          id: 'prod_001',
          name: 'Americano',
          description: 'Rich espresso with hot water',
          sku: 'AME001',
          storeId: 'store_001',
          basePrice: 8.50,
          status: 'active'
        },
        {
          id: 'prod_002',
          name: 'Cappuccino',
          description: 'Espresso with steamed milk and foam',
          sku: 'CAP001',
          storeId: 'store_001',
          basePrice: 10.50,
          status: 'active'
        }
      ],
      customers: [
        {
          id: 'cust_001',
          name: 'Alice Wong',
          email: 'alice@example.com',
          phone: '+60123456001',
          membershipId: 'MEMBER001'
        }
      ],
      transactions: [],
      payments: []
    };
    this.initialized = true;
  }

  async getAll(collection) {
    return this.data[collection] || [];
  }

  async findById(collection, id) {
    const items = this.data[collection] || [];
    return items.find(item => item.id === id);
  }

  async query(collection, options = {}) {
    let items = this.data[collection] || [];
    
    if (options.where) {
      items = items.filter(item => {
        for (const [key, value] of Object.entries(options.where)) {
          if (item[key] !== value) return false;
        }
        return true;
      });
    }
    
    if (options.limit) {
      items = items.slice(0, options.limit);
    }
    
    return items;
  }

  async create(collection, item) {
    if (!this.data[collection]) {
      this.data[collection] = [];
    }
    
    if (!item.id) {
      item.id = `${collection}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    item.createdAt = new Date().toISOString();
    this.data[collection].push(item);
    return item;
  }

  async update(collection, id, updates) {
    const items = this.data[collection] || [];
    const index = items.findIndex(item => item.id === id);
    
    if (index === -1) {
      throw new Error(`Item not found in ${collection}`);
    }
    
    const updated = { ...items[index], ...updates, updatedAt: new Date().toISOString() };
    items[index] = updated;
    return updated;
  }

  async delete(collection, id) {
    const items = this.data[collection] || [];
    const index = items.findIndex(item => item.id === id);
    
    if (index === -1) {
      throw new Error(`Item not found in ${collection}`);
    }
    
    items.splice(index, 1);
    return true;
  }
}

// 创建Express应用
const app = express();
const port = process.env.POS_PORT || 3000;

// 中间件
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Store-ID', 'X-Register-ID']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 请求日志
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// 初始化状态管理器
const stateManager = new SimpleStateManager();

// ===== POS API 路由 =====

// 健康检查
app.get('/api/v3/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'pos-mock-api',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API信息
app.get('/api/v3/info', (req, res) => {
  res.json({
    name: 'POS Mock API',
    version: '1.0.0',
    description: 'Simplified mock API for POS system testing',
    endpoints: [
      'GET /api/v3/health - Health check',
      'POST /api/v3/auth/login - Employee login',
      'GET /api/v3/stores - Get stores',
      'GET /api/v3/products - Get products',
      'POST /api/v3/transactions - Create transaction',
      'GET /api/v3/customers - Get customers'
    ]
  });
});

// 认证API
app.post('/api/v3/auth/login', async (req, res) => {
  try {
    const { email, password, storeId } = req.body;
    
    const employee = await stateManager.query('employees', {
      where: { email: email.toLowerCase(), active: true }
    });
    
    if (employee.length === 0) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Employee not found'
      });
    }
    
    // 简化的token生成
    const token = Buffer.from(JSON.stringify({
      id: employee[0].id,
      email: employee[0].email,
      role: employee[0].role,
      exp: Date.now() + 8 * 60 * 60 * 1000
    })).toString('base64');
    
    res.json({
      success: true,
      data: {
        token,
        employee: {
          id: employee[0].id,
          name: employee[0].name,
          email: employee[0].email,
          role: employee[0].role,
          storeId: storeId || employee[0].storeId
        }
      }
    });
    
  } catch (error) {
    res.status(500).json({
      error: 'Login failed',
      message: error.message
    });
  }
});

// PIN登录
app.post('/api/v3/auth/pin', async (req, res) => {
  try {
    const { pin, storeId } = req.body;
    
    // 简化：假设PIN 1234对应第一个员工
    if (pin === '1234') {
      const employees = await stateManager.query('employees', {
        where: { storeId, active: true }
      });
      
      if (employees.length > 0) {
        const employee = employees[0];
        const token = Buffer.from(JSON.stringify({
          id: employee.id,
          email: employee.email,
          role: employee.role,
          exp: Date.now() + 8 * 60 * 60 * 1000
        })).toString('base64');
        
        res.json({
          success: true,
          data: {
            token,
            employee: {
              id: employee.id,
              name: employee.name,
              role: employee.role,
              storeId
            }
          }
        });
        return;
      }
    }
    
    res.status(401).json({
      error: 'Invalid PIN',
      message: 'PIN not found or incorrect'
    });
    
  } catch (error) {
    res.status(500).json({
      error: 'PIN login failed',
      message: error.message
    });
  }
});

// 商店API
app.get('/api/v3/stores', async (req, res) => {
  try {
    const stores = await stateManager.getAll('stores');
    res.json({
      success: true,
      data: stores
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch stores',
      message: error.message
    });
  }
});

// 产品API
app.get('/api/v3/products', async (req, res) => {
  try {
    const { storeId, search } = req.query;
    let filters = {};
    
    if (storeId) filters.storeId = storeId;
    
    let products = await stateManager.query('products', { where: filters });
    
    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.sku.toLowerCase().includes(searchLower)
      );
    }
    
    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch products',
      message: error.message
    });
  }
});

// 交易API
app.post('/api/v3/transactions', async (req, res) => {
  try {
    const transaction = {
      id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      receiptNumber: `R${Date.now()}`,
      storeId: req.body.storeId,
      registerId: req.body.registerId,
      type: req.body.type || 'sale',
      status: 'pending',
      items: [],
      subtotal: 0,
      total: 0,
      createdAt: new Date().toISOString()
    };
    
    const created = await stateManager.create('transactions', transaction);
    
    res.status(201).json({
      success: true,
      data: created
    });
  } catch (error) {
    res.status(400).json({
      error: 'Failed to create transaction',
      message: error.message
    });
  }
});

// 获取交易
app.get('/api/v3/transactions/:transactionId', async (req, res) => {
  try {
    const transaction = await stateManager.findById('transactions', req.params.transactionId);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch transaction',
      message: error.message
    });
  }
});

// 客户API
app.get('/api/v3/customers', async (req, res) => {
  try {
    const customers = await stateManager.getAll('customers');
    res.json({
      success: true,
      data: customers
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch customers',
      message: error.message
    });
  }
});

// 支付API
app.post('/api/v3/payments', async (req, res) => {
  try {
    const { transactionId, amount, method = 'cash' } = req.body;
    
    // 模拟支付处理延迟
    setTimeout(async () => {
      const payment = {
        id: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        transactionId,
        amount: parseFloat(amount),
        method,
        status: Math.random() > 0.1 ? 'completed' : 'failed', // 90% 成功率
        processedAt: new Date().toISOString(),
        reference: `REF${Date.now()}`
      };
      
      await stateManager.create('payments', payment);
    }, 1000);
    
    res.status(201).json({
      success: true,
      message: 'Payment processing initiated'
    });
  } catch (error) {
    res.status(400).json({
      error: 'Payment processing failed',
      message: error.message
    });
  }
});

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Endpoint ${req.method} ${req.originalUrl} not found`,
    suggestion: 'Check /api/v3/info for available endpoints'
  });
});

// 启动服务器
app.listen(port, () => {
  console.log('🚀 POS Mock Server (Test Version) Started!');
  console.log('');
  console.log('📋 Server Information:');
  console.log(`   - Port: ${port}`);
  console.log(`   - Health: http://localhost:${port}/api/v3/health`);
  console.log(`   - API Info: http://localhost:${port}/api/v3/info`);
  console.log('');
  console.log('🧪 Test Data:');
  console.log('   - Employee: john@mockcafe.com / any password');
  console.log('   - PIN: 1234');
  console.log('   - Store ID: store_001');
  console.log('');
  console.log('✅ Ready for testing!');
});