/**
 * POS API Routes - Main router module
 * Comprehensive API implementation for POS system testing
 * Isolated from beep project - uses /api/v3 prefix for POS-specific endpoints
 */

const express = require('express');
const cors = require('cors');

// Import route modules
const authRoutes = require('./auth');
const storeRoutes = require('./stores');
const productRoutes = require('./products');
const transactionRoutes = require('./transactions');
const customerRoutes = require('./customers');
const paymentRoutes = require('./payments');
const inventoryRoutes = require('./inventory');
const employeeRoutes = require('./employees');
const shiftRoutes = require('./shifts');
const reportRoutes = require('./reports');
const promotionRoutes = require('./promotions');
const settingsRoutes = require('./settings');
const integrationRoutes = require('./integrations');

class POSAPIRouter {
  constructor(stateManager, config = {}) {
    this.stateManager = stateManager;
    this.config = {
      prefix: '/api/v3',
      cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Store-ID', 'X-Register-ID']
      },
      rateLimit: {
        enabled: false,
        maxRequests: 1000,
        windowMs: 15 * 60 * 1000 // 15 minutes
      },
      logging: true,
      ...config
    };

    this.router = express.Router();
    this.currentUser = null;
    this.currentStore = null;
    
    this.setupMiddleware();
    this.setupRoutes();
  }

  setupMiddleware() {
    // CORS for POS-specific domains
    this.router.use(cors(this.config.cors));

    // Parse JSON bodies
    this.router.use(express.json({ limit: '10mb' }));
    this.router.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Request logging middleware
    if (this.config.logging) {
      this.router.use((req, res, next) => {
        const startTime = Date.now();
        
        res.on('finish', () => {
          const duration = Date.now() - startTime;
          console.log(`[POS API] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
        });
        
        next();
      });
    }

    // Store context middleware - extract store and register info
    this.router.use((req, res, next) => {
      req.storeId = req.headers['x-store-id'] || req.query.storeId;
      req.registerId = req.headers['x-register-id'] || req.query.registerId;
      req.posContext = {
        storeId: req.storeId,
        registerId: req.registerId,
        timestamp: new Date().toISOString()
      };
      next();
    });

    // Authentication middleware (applied selectively)
    this.router.use((req, res, next) => {
      // Skip auth for public endpoints
      const publicEndpoints = [
        '/auth/login',
        '/auth/pin',
        '/health',
        '/info'
      ];
      
      const isPublicEndpoint = publicEndpoints.some(endpoint => 
        req.path.endsWith(endpoint)
      );
      
      if (isPublicEndpoint) {
        return next();
      }

      // Extract token from Authorization header
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        req.authToken = authHeader.substring(7);
        req.currentUser = this.validateToken(req.authToken);
      }

      // For mock purposes, allow requests without auth but log warning
      if (!req.currentUser && this.config.strictAuth) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Valid authentication token required'
        });
      }

      next();
    });

    // Error handling middleware
    this.router.use((err, req, res, next) => {
      console.error(`[POS API Error] ${req.method} ${req.originalUrl}:`, err);
      
      // Validation errors
      if (err.name === 'ValidationError') {
        return res.status(400).json({
          error: 'Validation Error',
          message: err.message,
          details: err.details || {}
        });
      }

      // Business logic errors
      if (err.name === 'BusinessLogicError') {
        return res.status(422).json({
          error: 'Business Logic Error',
          message: err.message,
          code: err.code || 'BUSINESS_ERROR'
        });
      }

      // Generic server error
      res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred',
        requestId: req.id || Date.now().toString()
      });
    });
  }

  setupRoutes() {
    // Health check - always available
    this.router.get('/health', (req, res) => {
      res.json({
        status: 'ok',
        service: 'pos-mock-api',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage()
      });
    });

    // API info
    this.router.get('/info', (req, res) => {
      res.json({
        name: 'POS Mock API',
        version: '1.0.0',
        description: 'Comprehensive mock API for POS system testing',
        endpoints: this.getEndpointsList(),
        features: [
          'Authentication & Authorization',
          'Store & Register Management',
          'Product & Inventory Management',
          'Transaction Processing',
          'Payment Gateway Integration',
          'Customer & Loyalty Management',
          'Reporting & Analytics',
          'Hardware Device Simulation',
          'Real-time WebSocket Events'
        ],
        supportedClients: ['pos-v3-mobile', 'pos-web-dashboard', 'kds-display'],
        isolation: 'Isolated from beep project - uses /api/v3 prefix'
      });
    });

    // Mount route modules with proper prefixes
    this.router.use('/auth', authRoutes(this.stateManager, this.config));
    this.router.use('/stores', storeRoutes(this.stateManager, this.config));
    this.router.use('/products', productRoutes(this.stateManager, this.config));
    this.router.use('/transactions', transactionRoutes(this.stateManager, this.config));
    this.router.use('/customers', customerRoutes(this.stateManager, this.config));
    this.router.use('/payments', paymentRoutes(this.stateManager, this.config));
    this.router.use('/inventory', inventoryRoutes(this.stateManager, this.config));
    this.router.use('/employees', employeeRoutes(this.stateManager, this.config));
    this.router.use('/shifts', shiftRoutes(this.stateManager, this.config));
    this.router.use('/reports', reportRoutes(this.stateManager, this.config));
    this.router.use('/promotions', promotionRoutes(this.stateManager, this.config));
    this.router.use('/settings', settingsRoutes(this.stateManager, this.config));
    this.router.use('/integrations', integrationRoutes(this.stateManager, this.config));

    // Catch-all for undefined routes
    this.router.use('*', (req, res) => {
      res.status(404).json({
        error: 'Not Found',
        message: `Endpoint ${req.method} ${req.originalUrl} not found`,
        suggestion: 'Check /api/v3/info for available endpoints'
      });
    });
  }

  validateToken(token) {
    // Mock token validation - in real system would verify JWT
    if (!token) return null;
    
    try {
      // Simple mock user for testing
      return {
        id: 'emp_001',
        name: 'Mock Employee',
        email: 'employee@storehub.com',
        role: 'cashier',
        storeId: 'store_001',
        permissions: ['pos.transaction.create', 'pos.payment.process', 'pos.product.view']
      };
    } catch (error) {
      console.error('Token validation error:', error);
      return null;
    }
  }

  getEndpointsList() {
    const endpoints = [];
    
    // Helper to extract routes from router
    const extractRoutes = (router, basePath = '') => {
      if (router.stack) {
        router.stack.forEach(layer => {
          if (layer.route) {
            const methods = Object.keys(layer.route.methods).map(m => m.toUpperCase());
            endpoints.push({
              path: basePath + layer.route.path,
              methods,
              description: layer.route.description || 'No description available'
            });
          } else if (layer.name === 'router' && layer.regexp) {
            const match = layer.regexp.source.match(/^\^\\?(.+?)\\\?\$/);
            if (match) {
              const subPath = match[1].replace(/\\\//g, '/');
              extractRoutes(layer.handle, basePath + subPath);
            }
          }
        });
      }
    };

    extractRoutes(this.router, this.config.prefix);
    return endpoints;
  }

  // Get the configured router
  getRouter() {
    return this.router;
  }

  // Utility method to generate consistent error responses
  static createError(name, message, statusCode = 400, details = {}) {
    const error = new Error(message);
    error.name = name;
    error.statusCode = statusCode;
    error.details = details;
    return error;
  }

  // Utility method for consistent success responses
  static createResponse(data, meta = {}) {
    return {
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        ...meta
      }
    };
  }

  // Utility method for paginated responses
  static createPaginatedResponse(data, pagination = {}) {
    return {
      success: true,
      data,
      pagination: {
        page: pagination.page || 1,
        limit: pagination.limit || 50,
        total: pagination.total || data.length,
        totalPages: Math.ceil((pagination.total || data.length) / (pagination.limit || 50)),
        hasNext: (pagination.page || 1) * (pagination.limit || 50) < (pagination.total || data.length),
        hasPrev: (pagination.page || 1) > 1
      },
      meta: {
        timestamp: new Date().toISOString()
      }
    };
  }
}

module.exports = POSAPIRouter;