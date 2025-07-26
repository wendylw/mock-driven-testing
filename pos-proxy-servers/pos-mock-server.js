const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const http = require('http');
const cors = require('cors');

// Import POS components
const POSStateManager = require('../src/pos-runtime/state-manager');
const POSWebSocketServer = require('../src/pos-runtime/websocket-server');
const HardwareManager = require('../src/generators/pos/hardware-generator');
const POSAPIRouter = require('../src/pos-runtime/api-routes');
const POSSeedData = require('../src/pos-runtime/data/seed-data');

class POSMockServer {
  constructor(config = {}) {
    this.config = {
      port: config.port || 3000,
      wsPort: config.wsPort || 3001,
      cors: config.cors || {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
      },
      proxy: config.proxy || {},
      ...config
    };

    // Initialize components
    this.app = express();
    this.server = null;
    this.stateManager = new POSStateManager(config.database);
    this.hardwareManager = new HardwareManager(config.hardware);
    this.posApiRouter = new POSAPIRouter(this.stateManager, config.api);
    this.seedData = new POSSeedData(this.stateManager);
    this.wsServer = null;

    // State
    this.isRunning = false;
    this.connections = new Map();
    this.requestLog = [];

    this.setupMiddleware();
    this.setupRoutes();
    this.setupProxyRoutes();
  }

  setupMiddleware() {
    // CORS
    this.app.use(cors(this.config.cors));

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Request logging
    this.app.use((req, res, next) => {
      const startTime = Date.now();
      
      res.on('finish', () => {
        const duration = Date.now() - startTime;
        const logEntry = {
          timestamp: new Date().toISOString(),
          method: req.method,
          url: req.url,
          status: res.statusCode,
          duration,
          userAgent: req.headers['user-agent'],
          ip: req.ip || req.connection.remoteAddress
        };
        
        this.requestLog.push(logEntry);
        this.trimRequestLog();
        
        console.log(`${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
      });
      
      next();
    });

    // Error handling
    this.app.use((err, req, res, next) => {
      console.error('Server Error:', err);
      res.status(500).json({
        error: 'Internal Server Error',
        message: err.message,
        timestamp: new Date().toISOString()
      });
    });
  }

  setupRoutes() {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        services: {
          database: this.stateManager.initialized,
          hardware: this.hardwareManager.getConnectedDevices().length > 0,
          websocket: this.wsServer ? true : false
        }
      });
    });

    // API Info
    this.app.get('/api/info', (req, res) => {
      res.json({
        name: 'POS Mock Server',
        version: '1.0.0',
        description: 'Mock server for POS applications with comprehensive hardware and data simulation',
        endpoints: this.getApiEndpoints(),
        features: [
          'REST API Mocking',
          'WebSocket Events',
          'Hardware Simulation',
          'Stateful Data Management',
          'Real-time Synchronization'
        ]
      });
    });

    // State Management API
    this.setupStateRoutes();
    
    // Hardware API
    this.setupHardwareRoutes();
    
    // WebSocket API
    this.setupWebSocketRoutes();
    
    // POS Business Logic API (Legacy - kept for compatibility)
    this.setupPOSRoutes();
    
    // New comprehensive POS API (isolated from beep)
    this.setupComprehensivePOSAPI();
  }

  setupStateRoutes() {
    const router = express.Router();

    // Get all collections
    router.get('/collections', (req, res) => {
      const stats = this.stateManager.getStats();
      res.json(stats);
    });

    // Generic CRUD operations
    router.get('/:collection', async (req, res) => {
      try {
        const { collection } = req.params;
        const { limit = 50, offset = 0, ...filters } = req.query;
        
        const data = await this.stateManager.query(collection, {
          where: filters,
          limit: parseInt(limit),
          offset: parseInt(offset)
        });
        
        res.json({
          data,
          meta: {
            collection,
            count: data.length,
            limit: parseInt(limit),
            offset: parseInt(offset)
          }
        });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    });

    router.get('/:collection/:id', async (req, res) => {
      try {
        const { collection, id } = req.params;
        const item = await this.stateManager.findById(collection, id);
        
        if (!item) {
          return res.status(404).json({ error: 'Item not found' });
        }
        
        res.json(item);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    });

    router.post('/:collection', async (req, res) => {
      try {
        const { collection } = req.params;
        const item = await this.stateManager.create(collection, req.body);
        res.status(201).json(item);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    });

    router.put('/:collection/:id', async (req, res) => {
      try {
        const { collection, id } = req.params;
        const item = await this.stateManager.update(collection, id, req.body);
        res.json(item);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    });

    router.delete('/:collection/:id', async (req, res) => {
      try {
        const { collection, id } = req.params;
        await this.stateManager.delete(collection, id);
        res.status(204).send();
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    });

    this.app.use('/api/state', router);
  }

  setupHardwareRoutes() {
    const router = express.Router();

    // Get all devices status
    router.get('/devices', (req, res) => {
      const statuses = this.hardwareManager.getAllDeviceStatuses();
      res.json(statuses);
    });

    // Get specific device status
    router.get('/devices/:deviceType', async (req, res) => {
      try {
        const { deviceType } = req.params;
        const status = await this.hardwareManager.getDeviceStatus(deviceType);
        res.json(status);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    });

    // Connect device
    router.post('/devices/:deviceType/connect', async (req, res) => {
      try {
        const { deviceType } = req.params;
        await this.hardwareManager.connectDevice(deviceType);
        res.json({ success: true, message: `${deviceType} connected` });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    });

    // Disconnect device
    router.post('/devices/:deviceType/disconnect', (req, res) => {
      try {
        const { deviceType } = req.params;
        this.hardwareManager.disconnectDevice(deviceType);
        res.json({ success: true, message: `${deviceType} disconnected` });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    });

    // Execute device operation
    router.post('/devices/:deviceType/:operation', async (req, res) => {
      try {
        const { deviceType, operation } = req.params;
        const device = this.hardwareManager.getDevice(deviceType);
        
        if (!device) {
          return res.status(404).json({ error: 'Device not found' });
        }

        if (typeof device[operation] !== 'function') {
          return res.status(400).json({ error: 'Operation not supported' });
        }

        const result = await device[operation](req.body);
        res.json(result);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    });

    // Trigger external event
    router.post('/devices/:deviceType/trigger/:eventType', (req, res) => {
      try {
        const { deviceType, eventType } = req.params;
        this.hardwareManager.triggerDeviceEvent(deviceType, eventType, req.body);
        res.json({ success: true, message: 'Event triggered' });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    });

    this.app.use('/api/hardware', router);
  }

  setupWebSocketRoutes() {
    const router = express.Router();

    // WebSocket server status
    router.get('/status', (req, res) => {
      res.json({
        running: this.wsServer ? true : false,
        port: this.config.wsPort,
        connections: this.wsServer ? this.wsServer.getStats() : null
      });
    });

    // Send message to WebSocket clients
    router.post('/broadcast', (req, res) => {
      if (!this.wsServer) {
        return res.status(400).json({ error: 'WebSocket server not running' });
      }

      const { event, data, room } = req.body;
      this.wsServer.broadcast(event, data, room);
      res.json({ success: true, message: 'Message broadcasted' });
    });

    this.app.use('/api/websocket', router);
  }

  setupPOSRoutes() {
    const router = express.Router();

    // Store operations
    router.get('/stores', async (req, res) => {
      const stores = await this.stateManager.getAll('stores');
      res.json(stores);
    });

    router.get('/stores/:storeId', async (req, res) => {
      const store = await this.stateManager.getById('stores', req.params.storeId);
      if (!store) {
        return res.status(404).json({ error: 'Store not found' });
      }
      res.json(store);
    });

    // Product operations
    router.get('/products', async (req, res) => {
      const { storeId, category, search } = req.query;
      let filters = {};
      
      if (storeId) filters.storeId = storeId;
      if (category) filters.category = category;
      if (search) filters.name = new RegExp(search, 'i');

      const products = await this.stateManager.query('products', { where: filters });
      res.json(products);
    });

    // Transaction operations
    router.post('/transactions', async (req, res) => {
      try {
        const transaction = await this.createTransaction(req.body);
        res.status(201).json(transaction);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    });

    router.get('/transactions/:transactionId', async (req, res) => {
      const transaction = await this.stateManager.getById('transactions', req.params.transactionId);
      if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found' });
      }
      res.json(transaction);
    });

    router.put('/transactions/:transactionId/status', async (req, res) => {
      try {
        const { transactionId } = req.params;
        const { status } = req.body;
        
        const transaction = await this.stateManager.update('transactions', transactionId, { 
          status,
          updatedAt: new Date().toISOString()
        });
        
        // Broadcast transaction update
        if (this.wsServer) {
          this.wsServer.broadcast('transaction_updated', {
            transactionId,
            status,
            timestamp: new Date().toISOString()
          });
        }
        
        res.json(transaction);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    });

    // Payment operations
    router.post('/payments', async (req, res) => {
      try {
        const payment = await this.processPayment(req.body);
        res.status(201).json(payment);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    });

    this.app.use('/api/pos', router);
  }

  setupComprehensivePOSAPI() {
    // Mount the comprehensive POS API router with /api/v3 prefix
    // This ensures complete isolation from beep project which may use different paths
    this.app.use('/api/v3', this.posApiRouter.getRouter());
    
    console.log('✅ Comprehensive POS API mounted at /api/v3');
    console.log('📋 Available endpoints:');
    console.log('   - /api/v3/auth/* (Authentication & Authorization)');
    console.log('   - /api/v3/stores/* (Store Management)');
    console.log('   - /api/v3/products/* (Product Management)');
    console.log('   - /api/v3/transactions/* (Transaction Processing)');
    console.log('   - /api/v3/customers/* (Customer Management)');
    console.log('   - /api/v3/payments/* (Payment Processing)');
    console.log('   - /api/v3/inventory/* (Inventory Management)');
    console.log('   - /api/v3/employees/* (Employee Management)');
    console.log('   - /api/v3/shifts/* (Shift Management)');
    console.log('   - /api/v3/reports/* (Reports & Analytics)');
    console.log('   - /api/v3/promotions/* (Promotions & Discounts)');
    console.log('   - /api/v3/settings/* (Settings & Configuration)');
    console.log('   - /api/v3/integrations/* (Third-party Integrations)');
  }

  setupProxyRoutes() {
    // Setup proxy middleware for external APIs
    const proxyConfigs = [
      {
        path: '/api/storehub/*',
        target: 'https://api.storehub.com',
        pathRewrite: { '^/api/storehub': '' }
      },
      {
        path: '/api/mrs/*',
        target: 'https://mrs.storehub.com',
        pathRewrite: { '^/api/mrs': '' }
      },
      {
        path: '/api/kds/*',
        target: 'https://kds.storehub.com',
        pathRewrite: { '^/api/kds': '' }
      },
      {
        path: '/api/payment/*',
        target: 'https://payment.storehub.com',
        pathRewrite: { '^/api/payment': '' }
      }
    ];

    proxyConfigs.forEach(config => {
      this.app.use(config.path, createProxyMiddleware({
        target: config.target,
        changeOrigin: true,
        pathRewrite: config.pathRewrite,
        onError: (err, req, res) => {
          console.error('Proxy Error:', err.message);
          res.status(502).json({
            error: 'Proxy Error',
            message: 'Failed to connect to external service',
            service: config.target
          });
        },
        onProxyReq: (proxyReq, req, res) => {
          console.log(`Proxying ${req.method} ${req.url} to ${config.target}`);
        }
      }));
    });
  }

  // Business logic methods
  async createTransaction(transactionData) {
    const transaction = {
      id: this.generateId('TXN'),
      ...transactionData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const created = await this.stateManager.create('transactions', transaction);

    // Broadcast new transaction
    if (this.wsServer) {
      this.wsServer.broadcast('transaction_created', created);
    }

    return created;
  }

  async processPayment(paymentData) {
    const payment = {
      id: this.generateId('PAY'),
      ...paymentData,
      status: 'processing',
      createdAt: new Date().toISOString()
    };

    // Simulate payment processing
    setTimeout(async () => {
      const success = Math.random() > 0.1; // 90% success rate
      const updatedPayment = await this.stateManager.update('payments', payment.id, {
        status: success ? 'completed' : 'failed',
        processedAt: new Date().toISOString()
      });

      // Broadcast payment result
      if (this.wsServer) {
        this.wsServer.broadcast('payment_processed', updatedPayment);
      }
    }, 2000);

    return await this.stateManager.create('payments', payment);
  }

  // Utility methods
  generateId(prefix = 'ID') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getApiEndpoints() {
    const endpoints = [];
    
    this.app._router.stack.forEach(layer => {
      if (layer.route) {
        const methods = Object.keys(layer.route.methods);
        endpoints.push({
          path: layer.route.path,
          methods: methods.map(m => m.toUpperCase())
        });
      }
    });

    return endpoints;
  }

  trimRequestLog(maxEntries = 1000) {
    if (this.requestLog.length > maxEntries) {
      this.requestLog = this.requestLog.slice(-maxEntries);
    }
  }

  // Server lifecycle
  async start() {
    try {
      // Start HTTP server
      this.server = this.app.listen(this.config.port, () => {
        console.log(`POS Mock Server running on port ${this.config.port}`);
      });

      // Start WebSocket server
      if (this.config.websocket !== false) {
        this.wsServer = new POSWebSocketServer({
          port: this.config.wsPort,
          cors: this.config.cors
        });
        this.wsServer.setStateManager(this.stateManager);
        await this.wsServer.start();
      }

      // Connect hardware devices
      if (this.config.hardware !== false) {
        await this.hardwareManager.connectAllDevices();
      }

      // Initialize seed data for POS system (if enabled)
      if (this.config.seedData !== false) {
        try {
          console.log('🌱 Initializing POS seed data...');
          await this.seedData.seedAll();
          console.log('✅ POS seed data initialized successfully');
        } catch (error) {
          console.warn('⚠️ Warning: Failed to initialize seed data:', error.message);
          console.warn('   Server will continue without seed data');
        }
      }

      this.isRunning = true;
      console.log('🚀 POS Mock Server fully initialized');
      console.log(`📍 Server running on: http://localhost:${this.config.port}`);
      console.log(`🔌 WebSocket server on: ws://localhost:${this.config.wsPort}`);
      console.log(`📚 API Documentation: http://localhost:${this.config.port}/api/v3/info`);

      // Setup graceful shutdown
      this.setupGracefulShutdown();

    } catch (error) {
      console.error('Failed to start POS Mock Server:', error);
      throw error;
    }
  }

  async stop() {
    console.log('Stopping POS Mock Server...');

    this.isRunning = false;

    // Stop WebSocket server
    if (this.wsServer) {
      await this.wsServer.stop();
    }

    // Disconnect hardware
    this.hardwareManager.disconnectAllDevices();

    // Close HTTP server
    if (this.server) {
      await new Promise((resolve) => {
        this.server.close(resolve);
      });
    }

    console.log('POS Mock Server stopped');
  }

  setupGracefulShutdown() {
    const shutdown = async (signal) => {
      console.log(`Received ${signal}, shutting down gracefully...`);
      try {
        await this.stop();
        process.exit(0);
      } catch (error) {
        console.error('Error during shutdown:', error);
        process.exit(1);
      }
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGUSR2', () => shutdown('SIGUSR2')); // For nodemon
  }

  // Status and monitoring
  getStatus() {
    return {
      running: this.isRunning,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      connections: this.connections.size,
      requestCount: this.requestLog.length,
      services: {
        http: this.server ? true : false,
        websocket: this.wsServer ? true : false,
        database: this.stateManager.initialized,
        hardware: this.hardwareManager.getConnectedDevices()
      }
    };
  }
}

module.exports = POSMockServer;

// CLI support
if (require.main === module) {
  const config = {
    port: process.env.PORT || 3000,
    wsPort: process.env.WS_PORT || 3001,
    database: {
      filename: process.env.DB_FILE || 'pos-mock.db'
    }
  };

  const server = new POSMockServer(config);
  server.start().catch(console.error);
}