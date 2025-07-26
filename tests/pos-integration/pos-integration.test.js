const { describe, test, beforeAll, afterAll, beforeEach, expect } = require('@jest/globals');
const POSMockServer = require('../../pos-proxy-servers/pos-mock-server');
const POSStateManager = require('../../src/pos-runtime/state-manager');
const { HardwareSimulatorManager } = require('../../src/pos-runtime/hardware-simulators');
const axios = require('axios');
const WebSocket = require('ws');

describe('POS Mock Server Integration Tests', () => {
  let mockServer;
  let stateManager;
  let hardwareManager;
  let baseURL;
  let wsURL;

  beforeAll(async () => {
    // Initialize components
    stateManager = new POSStateManager({
      filename: ':memory:', // Use in-memory database for tests
      autoload: false
    });

    hardwareManager = new HardwareSimulatorManager({
      devices: {
        printer: { autoConnect: false },
        scanner: { autoConnect: false },
        nfc: { autoConnect: false },
        cashDrawer: { autoConnect: false },
        cardReader: { autoConnect: false },
        scale: { autoConnect: false }
      }
    });

    // Initialize mock server
    mockServer = new POSMockServer({
      port: 3333, // Use different port for testing
      wsPort: 3334,
      database: { filename: ':memory:' },
      hardware: { autoConnect: false }
    });

    await mockServer.start();
    
    baseURL = `http://localhost:3333`;
    wsURL = `ws://localhost:3334`;

    // Wait for initialization
    await new Promise(resolve => setTimeout(resolve, 1000));
  }, 30000);

  afterAll(async () => {
    if (mockServer) {
      await mockServer.stop();
    }
  }, 10000);

  beforeEach(() => {
    // Reset state before each test
    if (stateManager && stateManager.initialized) {
      stateManager.reset();
    }
  });

  describe('Server Health and Status', () => {
    test('should respond to health check', async () => {
      const response = await axios.get(`${baseURL}/health`);
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('status', 'ok');
      expect(response.data).toHaveProperty('timestamp');
      expect(response.data).toHaveProperty('uptime');
      expect(response.data).toHaveProperty('services');
    });

    test('should provide API information', async () => {
      const response = await axios.get(`${baseURL}/api/info`);
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('name', 'POS Mock Server');
      expect(response.data).toHaveProperty('version');
      expect(response.data).toHaveProperty('features');
      expect(response.data.features).toContain('REST API Mocking');
      expect(response.data.features).toContain('Hardware Simulation');
    });
  });

  describe('State Management API', () => {
    test('should retrieve all collections', async () => {
      const response = await axios.get(`${baseURL}/api/state/collections`);
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('collections');
      expect(response.data.collections).toHaveProperty('stores');
      expect(response.data.collections).toHaveProperty('products');
      expect(response.data.collections).toHaveProperty('transactions');
    });

    test('should retrieve stores data', async () => {
      const response = await axios.get(`${baseURL}/api/state/stores`);
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('data');
      expect(Array.isArray(response.data.data)).toBe(true);
      expect(response.data).toHaveProperty('meta');
    });

    test('should create a new product', async () => {
      const newProduct = {
        productId: 'TEST_PROD_001',
        storeId: 'STORE_001',
        sku: 'TEST_SKU',
        name: 'Test Product',
        category: 'Test Category',
        price: 9.99,
        quantity: 10
      };

      const response = await axios.post(`${baseURL}/api/state/products`, newProduct);
      
      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('productId', 'TEST_PROD_001');
      expect(response.data).toHaveProperty('createdAt');
      expect(response.data).toHaveProperty('updatedAt');
    });

    test('should update an existing product', async () => {
      // First create a product
      const newProduct = {
        productId: 'TEST_PROD_002',
        storeId: 'STORE_001',
        sku: 'TEST_SKU_2',
        name: 'Test Product 2',
        category: 'Test Category',
        price: 5.99,
        quantity: 20
      };

      await axios.post(`${baseURL}/api/state/products`, newProduct);

      // Then update it
      const updateData = { price: 7.99, quantity: 15 };
      const response = await axios.put(`${baseURL}/api/state/products/TEST_PROD_002`, updateData);
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('price', 7.99);
      expect(response.data).toHaveProperty('quantity', 15);
      expect(response.data).toHaveProperty('updatedAt');
    });

    test('should delete a product', async () => {
      // First create a product
      const newProduct = {
        productId: 'TEST_PROD_003',
        storeId: 'STORE_001',
        sku: 'TEST_SKU_3',
        name: 'Test Product 3',
        category: 'Test Category',
        price: 3.99,
        quantity: 5
      };

      await axios.post(`${baseURL}/api/state/products`, newProduct);

      // Then delete it
      const response = await axios.delete(`${baseURL}/api/state/products/TEST_PROD_003`);
      
      expect(response.status).toBe(204);

      // Verify it's deleted
      try {
        await axios.get(`${baseURL}/api/state/products/TEST_PROD_003`);
        fail('Expected 404 error');
      } catch (error) {
        expect(error.response.status).toBe(404);
      }
    });
  });

  describe('Hardware API', () => {
    test('should get all device statuses', async () => {
      const response = await axios.get(`${baseURL}/api/hardware/devices`);
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('printer');
      expect(response.data).toHaveProperty('scanner');
      expect(response.data).toHaveProperty('nfc');
      expect(response.data).toHaveProperty('cashDrawer');
    });

    test('should get specific device status', async () => {
      const response = await axios.get(`${baseURL}/api/hardware/devices/printer`);
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('connected');
      expect(response.data).toHaveProperty('state');
    });

    test('should connect a device', async () => {
      const response = await axios.post(`${baseURL}/api/hardware/devices/printer/connect`);
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('success', true);
      expect(response.data).toHaveProperty('message');
    });

    test('should execute device operations', async () => {
      // First connect the printer
      await axios.post(`${baseURL}/api/hardware/devices/printer/connect`);

      // Then try to print
      const printData = {
        text: 'Test Receipt',
        items: [
          { name: 'Test Item', price: 5.99, quantity: 1 }
        ]
      };

      const response = await axios.post(`${baseURL}/api/hardware/devices/printer/print`, printData);
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('success', true);
      expect(response.data).toHaveProperty('jobId');
    });

    test('should trigger external hardware events', async () => {
      const response = await axios.post(`${baseURL}/api/hardware/devices/scale/trigger/placeItem`, {
        weight: 1.5
      });
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('success', true);
    });
  });

  describe('POS Business Logic API', () => {
    test('should retrieve stores', async () => {
      const response = await axios.get(`${baseURL}/api/pos/stores`);
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBeGreaterThan(0);
    });

    test('should retrieve products with filters', async () => {
      const response = await axios.get(`${baseURL}/api/pos/products?storeId=STORE_001&category=Beverages`);
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
    });

    test('should create a transaction', async () => {
      const transaction = {
        storeId: 'STORE_001',
        registerId: 'REG_001',
        items: [
          {
            productId: 'PROD_001',
            quantity: 2,
            price: 2.50,
            subtotal: 5.00
          }
        ],
        subtotal: 5.00,
        tax: 0.40,
        total: 5.40
      };

      const response = await axios.post(`${baseURL}/api/pos/transactions`, transaction);
      
      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('transactionId');
      expect(response.data).toHaveProperty('status', 'pending');
      expect(response.data).toHaveProperty('total', 5.40);
    });

    test('should update transaction status', async () => {
      // First create a transaction
      const transaction = {
        storeId: 'STORE_001',
        registerId: 'REG_001',
        items: [{ productId: 'PROD_001', quantity: 1, price: 2.50, subtotal: 2.50 }],
        subtotal: 2.50,
        tax: 0.20,
        total: 2.70
      };

      const createResponse = await axios.post(`${baseURL}/api/pos/transactions`, transaction);
      const transactionId = createResponse.data.transactionId;

      // Then update its status
      const response = await axios.put(`${baseURL}/api/pos/transactions/${transactionId}/status`, {
        status: 'completed'
      });
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('status', 'completed');
    });

    test('should process a payment', async () => {
      const payment = {
        transactionId: 'TXN_TEST_001',
        amount: 10.00,
        method: 'card',
        cardLast4: '1234'
      };

      const response = await axios.post(`${baseURL}/api/pos/payments`, payment);
      
      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('id');
      expect(response.data).toHaveProperty('status', 'processing');
      expect(response.data).toHaveProperty('amount', 10.00);
    });
  });

  describe('WebSocket Integration', () => {
    test('should connect to WebSocket server', (done) => {
      const ws = new WebSocket(`${wsURL}`);
      
      ws.on('open', () => {
        expect(ws.readyState).toBe(WebSocket.OPEN);
        ws.close();
        done();
      });

      ws.on('error', (error) => {
        done(error);
      });
    }, 10000);

    test('should receive WebSocket messages', (done) => {
      const ws = new WebSocket(`${wsURL}`);
      
      ws.on('open', () => {
        // Send a test message
        ws.send(JSON.stringify({
          type: 'ping',
          timestamp: new Date().toISOString()
        }));
      });

      ws.on('message', (data) => {
        const message = JSON.parse(data.toString());
        
        if (message.type === 'pong') {
          expect(message).toHaveProperty('timestamp');
          ws.close();
          done();
        }
      });

      ws.on('error', (error) => {
        done(error);
      });
    }, 10000);

    test('should broadcast messages via API', async () => {
      const broadcastData = {
        event: 'test_event',
        data: { message: 'Test broadcast' },
        room: null
      };

      const response = await axios.post(`${baseURL}/api/websocket/broadcast`, broadcastData);
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('success', true);
    });
  });

  describe('Complete POS Workflow', () => {
    test('should handle complete transaction flow', async () => {
      // 1. Connect hardware devices
      await axios.post(`${baseURL}/api/hardware/devices/printer/connect`);
      await axios.post(`${baseURL}/api/hardware/devices/scanner/connect`);
      await axios.post(`${baseURL}/api/hardware/devices/cardReader/connect`);

      // 2. Create a transaction
      const transaction = {
        storeId: 'STORE_001',
        registerId: 'REG_001',
        items: [
          {
            productId: 'PROD_001',
            quantity: 2,
            price: 2.50,
            subtotal: 5.00
          },
          {
            productId: 'PROD_002',
            quantity: 1,
            price: 8.99,
            subtotal: 8.99
          }
        ],
        subtotal: 13.99,
        tax: 1.12,
        total: 15.11
      };

      const transactionResponse = await axios.post(`${baseURL}/api/pos/transactions`, transaction);
      const transactionId = transactionResponse.data.transactionId;

      expect(transactionResponse.status).toBe(201);
      expect(transactionResponse.data).toHaveProperty('status', 'pending');

      // 3. Process payment
      const payment = {
        transactionId,
        amount: 15.11,
        method: 'card',
        cardLast4: '1234'
      };

      const paymentResponse = await axios.post(`${baseURL}/api/pos/payments`, payment);
      
      expect(paymentResponse.status).toBe(201);
      expect(paymentResponse.data).toHaveProperty('status', 'processing');

      // 4. Update transaction status to completed
      const statusResponse = await axios.put(`${baseURL}/api/pos/transactions/${transactionId}/status`, {
        status: 'completed'
      });

      expect(statusResponse.status).toBe(200);
      expect(statusResponse.data).toHaveProperty('status', 'completed');

      // 5. Print receipt
      const printData = {
        transactionId,
        text: 'Receipt',
        items: transaction.items,
        total: transaction.total
      };

      const printResponse = await axios.post(`${baseURL}/api/hardware/devices/printer/print`, printData);
      
      expect(printResponse.status).toBe(200);
      expect(printResponse.data).toHaveProperty('success', true);

      // 6. Open cash drawer
      const drawerResponse = await axios.post(`${baseURL}/api/hardware/devices/printer/openCashDrawer`);
      
      expect(drawerResponse.status).toBe(200);
      expect(drawerResponse.data).toHaveProperty('success', true);
    }, 15000);

    test('should handle multi-register synchronization', async () => {
      // Create transactions on different registers
      const transaction1 = {
        storeId: 'STORE_001',
        registerId: 'REG_001',
        items: [{ productId: 'PROD_001', quantity: 1, price: 2.50, subtotal: 2.50 }],
        subtotal: 2.50,
        tax: 0.20,
        total: 2.70
      };

      const transaction2 = {
        storeId: 'STORE_001',
        registerId: 'REG_002',
        items: [{ productId: 'PROD_002', quantity: 1, price: 8.99, subtotal: 8.99 }],
        subtotal: 8.99,
        tax: 0.72,
        total: 9.71
      };

      const [response1, response2] = await Promise.all([
        axios.post(`${baseURL}/api/pos/transactions`, transaction1),
        axios.post(`${baseURL}/api/pos/transactions`, transaction2)
      ]);

      expect(response1.status).toBe(201);
      expect(response2.status).toBe(201);
      expect(response1.data.registerId).toBe('REG_001');
      expect(response2.data.registerId).toBe('REG_002');

      // Verify both transactions exist in the system
      const allTransactions = await axios.get(`${baseURL}/api/state/transactions`);
      const transactionIds = allTransactions.data.data.map(t => t.transactionId);
      
      expect(transactionIds).toContain(response1.data.transactionId);
      expect(transactionIds).toContain(response2.data.transactionId);
    });

    test('should handle hardware device errors gracefully', async () => {
      // Try to use a device without connecting first
      try {
        await axios.post(`${baseURL}/api/hardware/devices/printer/print`, {
          text: 'Test print'
        });
        fail('Expected error for disconnected device');
      } catch (error) {
        expect(error.response.status).toBe(400);
        expect(error.response.data).toHaveProperty('error');
      }

      // Connect device and then trigger an error condition
      await axios.post(`${baseURL}/api/hardware/devices/printer/connect`);
      
      // Trigger paper out condition
      await axios.post(`${baseURL}/api/hardware/devices/printer/trigger/paperOut`);

      // Try to print when out of paper
      try {
        await axios.post(`${baseURL}/api/hardware/devices/printer/print`, {
          text: 'Test print'
        });
        fail('Expected error for out of paper');
      } catch (error) {
        expect(error.response.status).toBe(400);
      }
    });
  });

  describe('Performance and Load Testing', () => {
    test('should handle concurrent transactions', async () => {
      const concurrentTransactions = Array.from({ length: 10 }, (_, i) => ({
        storeId: 'STORE_001',
        registerId: 'REG_001',
        items: [{ productId: 'PROD_001', quantity: 1, price: 2.50, subtotal: 2.50 }],
        subtotal: 2.50,
        tax: 0.20,
        total: 2.70,
        testIndex: i
      }));

      const startTime = Date.now();
      const responses = await Promise.all(
        concurrentTransactions.map(transaction => 
          axios.post(`${baseURL}/api/pos/transactions`, transaction)
        )
      );
      const endTime = Date.now();

      // All requests should succeed
      responses.forEach((response, index) => {
        expect(response.status).toBe(201);
        expect(response.data).toHaveProperty('transactionId');
      });

      // Should complete within reasonable time (5 seconds for 10 concurrent requests)
      expect(endTime - startTime).toBeLessThan(5000);

      console.log(`Created ${responses.length} concurrent transactions in ${endTime - startTime}ms`);
    }, 10000);

    test('should maintain data consistency under load', async () => {
      // Create multiple products concurrently
      const products = Array.from({ length: 20 }, (_, i) => ({
        productId: `LOAD_TEST_PROD_${i}`,
        storeId: 'STORE_001',
        sku: `LOAD_SKU_${i}`,
        name: `Load Test Product ${i}`,
        category: 'Load Test',
        price: Math.round(Math.random() * 100 * 100) / 100,
        quantity: Math.floor(Math.random() * 100)
      }));

      await Promise.all(
        products.map(product => 
          axios.post(`${baseURL}/api/state/products`, product)
        )
      );

      // Verify all products were created
      const allProducts = await axios.get(`${baseURL}/api/state/products`);
      const loadTestProducts = allProducts.data.data.filter(p => 
        p.productId.startsWith('LOAD_TEST_PROD_')
      );

      expect(loadTestProducts.length).toBe(20);

      // Verify data integrity
      loadTestProducts.forEach(product => {
        expect(product).toHaveProperty('productId');
        expect(product).toHaveProperty('createdAt');
        expect(product).toHaveProperty('updatedAt');
        expect(product.category).toBe('Load Test');
      });
    }, 15000);
  });
});

// Additional test utilities
class POSTestHelper {
  static async createTestTransaction(baseURL, overrides = {}) {
    const defaultTransaction = {
      storeId: 'STORE_001',
      registerId: 'REG_001',
      items: [
        {
          productId: 'PROD_001',
          quantity: 1,
          price: 2.50,
          subtotal: 2.50
        }
      ],
      subtotal: 2.50,
      tax: 0.20,
      total: 2.70,
      ...overrides
    };

    const response = await axios.post(`${baseURL}/api/pos/transactions`, defaultTransaction);
    return response.data;
  }

  static async connectAllHardware(baseURL) {
    const devices = ['printer', 'scanner', 'nfc', 'cashDrawer', 'cardReader', 'scale'];
    
    const results = await Promise.all(
      devices.map(device => 
        axios.post(`${baseURL}/api/hardware/devices/${device}/connect`)
          .then(response => ({ device, success: true, data: response.data }))
          .catch(error => ({ device, success: false, error: error.message }))
      )
    );

    return results;
  }

  static generateRandomProduct(storeId = 'STORE_001') {
    const categories = ['Beverages', 'Food', 'Bakery', 'Electronics', 'Clothing'];
    const category = categories[Math.floor(Math.random() * categories.length)];
    
    return {
      productId: `TEST_PROD_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      storeId,
      sku: `SKU_${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      name: `Test Product ${Math.random().toString(36).substr(2, 5)}`,
      category,
      price: Math.round(Math.random() * 100 * 100) / 100,
      quantity: Math.floor(Math.random() * 100),
      description: `Generated test product for ${category}`
    };
  }
}

module.exports = { POSTestHelper };