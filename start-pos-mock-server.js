#!/usr/bin/env node

/**
 * POS Mock Server Startup Script
 * Starts the comprehensive POS mock server with full API coverage
 * Isolated from beep project - uses dedicated configuration
 */

const POSMockServer = require('./pos-proxy-servers/pos-mock-server');

// POS-specific configuration
const posConfig = {
  // Server configuration
  port: process.env.POS_PORT || 3000,
  wsPort: process.env.POS_WS_PORT || 3001,
  
  // CORS configuration for POS clients
  cors: {
    origin: [
      'http://localhost:3000',
      'http://localhost:3001', 
      'http://localhost:8081', // React Native metro bundler
      'http://10.0.2.2:8081',  // Android emulator
      'http://192.168.*.*',    // Local network devices
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type', 
      'Authorization', 
      'X-Requested-With', 
      'X-Store-ID', 
      'X-Register-ID',
      'X-Employee-ID'
    ],
    credentials: true
  },

  // Database configuration
  database: {
    filename: process.env.POS_DB_FILE || 'pos-mock.db',
    autoSave: true,
    autoSaveInterval: 5000, // 5 seconds
    autoPurge: true,
    purgeInterval: 300000   // 5 minutes
  },

  // API configuration
  api: {
    prefix: '/api/v3',
    strictAuth: false, // Allow requests without auth for development
    logging: true,
    rateLimit: {
      enabled: false,
      maxRequests: 1000,
      windowMs: 15 * 60 * 1000
    }
  },

  // Hardware simulation
  hardware: {
    enabled: true,
    devices: {
      printer: {
        type: 'thermal',
        model: 'EP-TM20',
        port: 'USB001',
        paperWidth: 80,
        autoReconnect: true
      },
      scanner: {
        type: 'barcode',
        model: 'Honeywell-1900',
        interface: 'USB',
        autoTrigger: true
      },
      cashDrawer: {
        type: 'standard',
        interface: 'RJ11',
        connected: true
      },
      display: {
        type: 'customer',
        size: '2x20',
        backlight: true
      }
    }
  },

  // WebSocket configuration
  websocket: {
    enabled: true,
    namespaces: ['mrs', 'kds', 'ncs', 'cfd'],
    heartbeat: true,
    heartbeatInterval: 30000,
    maxConnections: 100
  },

  // Seed data configuration
  seedData: true,
  
  // Development features
  development: {
    hotReload: true,
    mockDelay: {
      enabled: false,
      min: 100,
      max: 500
    },
    errorSimulation: {
      enabled: false,
      rate: 0.05 // 5% error rate
    }
  },

  // Logging configuration
  logging: {
    level: process.env.POS_LOG_LEVEL || 'info',
    format: 'detailed',
    includeRequests: true,
    includeResponses: false
  }
};

async function startPOSMockServer() {
  console.log('🚀 Starting POS Mock Server...');
  console.log('🔧 Configuration:');
  console.log(`   - HTTP Port: ${posConfig.port}`);
  console.log(`   - WebSocket Port: ${posConfig.wsPort}`);
  console.log(`   - Database: ${posConfig.database.filename}`);
  console.log(`   - Seed Data: ${posConfig.seedData ? 'Enabled' : 'Disabled'}`);
  console.log(`   - Hardware Simulation: ${posConfig.hardware.enabled ? 'Enabled' : 'Disabled'}`);
  console.log(`   - WebSocket: ${posConfig.websocket.enabled ? 'Enabled' : 'Disabled'}`);
  console.log('');

  try {
    const server = new POSMockServer(posConfig);
    await server.start();

    // Display useful information
    console.log('');
    console.log('📋 POS Mock Server Information:');
    console.log('┌─────────────────────────────────────────────────────────┐');
    console.log('│                    🎯 ENDPOINTS                         │');
    console.log('├─────────────────────────────────────────────────────────┤');
    console.log(`│ Health Check: http://localhost:${posConfig.port}/api/v3/health    │`);
    console.log(`│ API Info:     http://localhost:${posConfig.port}/api/v3/info      │`);
    console.log(`│ Login:        POST http://localhost:${posConfig.port}/api/v3/auth/login │`);
    console.log(`│ Products:     GET http://localhost:${posConfig.port}/api/v3/products   │`);
    console.log(`│ Transactions: POST http://localhost:${posConfig.port}/api/v3/transactions │`);
    console.log('└─────────────────────────────────────────────────────────┘');
    console.log('');
    console.log('📱 Test Credentials:');
    console.log('┌─────────────────────────────────────────────────────────┐');
    console.log('│ Cashier:  john@mockcafe.com / password123               │');
    console.log('│ Manager:  sarah@mockcafe.com / password123              │');
    console.log('│ PIN:      1234 (for both employees)                    │');
    console.log('└─────────────────────────────────────────────────────────┘');
    console.log('');
    console.log('🏪 Test Store Data:');
    console.log('┌─────────────────────────────────────────────────────────┐');
    console.log('│ Store ID: store_001                                     │');
    console.log('│ Name:     Main Branch Cafe                              │');
    console.log('│ Products: Coffee, Tea, Pastries, Sandwiches            │');
    console.log('│ Customer: Alice Wong (cust_001)                         │');
    console.log('└─────────────────────────────────────────────────────────┘');
    console.log('');
    console.log('🔄 Real-time Features:');
    console.log('┌─────────────────────────────────────────────────────────┐');
    console.log(`│ WebSocket: ws://localhost:${posConfig.wsPort}                     │`);
    console.log('│ MRS:       Multi-Register Sync                         │');
    console.log('│ KDS:       Kitchen Display System                      │');
    console.log('│ NCS:       Notification Center                         │');
    console.log('│ CFD:       Customer Facing Display                     │');
    console.log('└─────────────────────────────────────────────────────────┘');
    console.log('');
    console.log('⚠️  ISOLATION NOTE: This server is completely isolated from beep project');
    console.log('   - Uses /api/v3 prefix (beep may use different paths)');
    console.log('   - Separate database file (pos-mock.db)');
    console.log('   - Independent configuration and seed data');
    console.log('');
    console.log('✅ POS Mock Server is ready for testing!');
    console.log('   Press Ctrl+C to stop the server');

  } catch (error) {
    console.error('❌ Failed to start POS Mock Server:', error);
    process.exit(1);
  }
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Received SIGINT, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

// Start the server
if (require.main === module) {
  startPOSMockServer().catch(console.error);
}

module.exports = { startPOSMockServer, posConfig };