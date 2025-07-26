/**
 * POS Mock Data Seeder
 * Generates initial test data for POS system
 * Isolated from beep project data
 */

const crypto = require('crypto');

class POSSeedData {
  constructor(stateManager) {
    this.stateManager = stateManager;
  }

  // Helper to hash passwords
  hashPassword(password, salt) {
    return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  }

  generateSalt() {
    return crypto.randomBytes(32).toString('hex');
  }

  async seedAll() {
    console.log('🌱 Starting POS seed data generation...');
    
    try {
      await this.seedStores();
      await this.seedRoles();
      await this.seedEmployees();
      await this.seedCategories();
      await this.seedProducts();
      await this.seedCustomers();
      await this.seedInventory();
      await this.seedPricebooks();
      await this.seedSettings();
      
      console.log('✅ POS seed data generation completed successfully');
    } catch (error) {
      console.error('❌ Error seeding POS data:', error);
      throw error;
    }
  }

  async seedStores() {
    const stores = [
      {
        id: 'store_001',
        name: 'Main Branch Cafe',
        address: '123 Jalan Bukit Bintang, Kuala Lumpur',
        phone: '+60312345678',
        email: 'main@mockcafe.com',
        timezone: 'Asia/Kuala_Lumpur',
        currency: 'MYR',
        taxRate: 0.06,
        businessHours: {
          monday: { open: '08:00', close: '22:00' },
          tuesday: { open: '08:00', close: '22:00' },
          wednesday: { open: '08:00', close: '22:00' },
          thursday: { open: '08:00', close: '22:00' },
          friday: { open: '08:00', close: '23:00' },
          saturday: { open: '09:00', close: '23:00' },
          sunday: { open: '09:00', close: '21:00' }
        },
        status: 'active',
        createdAt: new Date().toISOString()
      },
      {
        id: 'store_002',
        name: 'Mall Branch',
        address: 'Level 2, KLCC Shopping Centre',
        phone: '+60387654321',
        email: 'mall@mockcafe.com',
        timezone: 'Asia/Kuala_Lumpur',
        currency: 'MYR',
        taxRate: 0.06,
        status: 'active',
        createdAt: new Date().toISOString()
      }
    ];

    for (const store of stores) {
      await this.stateManager.create('stores', store);
    }

    console.log(`📍 Seeded ${stores.length} stores`);
  }

  async seedRoles() {
    const roles = [
      {
        id: 'role_cashier',
        name: 'cashier',
        displayName: 'Cashier',
        description: 'Handle transactions and customer service',
        level: 1,
        permissions: [
          'pos.transaction.create',
          'pos.transaction.view',
          'pos.payment.process',
          'pos.product.view',
          'pos.customer.view',
          'pos.customer.create'
        ]
      },
      {
        id: 'role_supervisor',
        name: 'supervisor',
        displayName: 'Supervisor',
        description: 'Supervise operations and handle advanced functions',
        level: 2,
        permissions: [
          'pos.transaction.create',
          'pos.transaction.view',
          'pos.transaction.void',
          'pos.payment.process',
          'pos.payment.refund',
          'pos.product.view',
          'pos.product.edit',
          'pos.customer.view',
          'pos.customer.create',
          'pos.customer.edit',
          'pos.discount.apply',
          'pos.shift.manage'
        ]
      },
      {
        id: 'role_manager',
        name: 'manager',
        displayName: 'Store Manager',
        description: 'Full store management access',
        level: 3,
        permissions: [
          'pos.*',
          'inventory.*',
          'reports.*',
          'settings.*'
        ]
      }
    ];

    for (const role of roles) {
      await this.stateManager.create('roles', role);
    }

    console.log(`👥 Seeded ${roles.length} roles`);
  }

  async seedEmployees() {
    const employees = [
      {
        id: 'emp_001',
        name: 'John Cashier',
        email: 'john@mockcafe.com',
        role: 'cashier',
        roleId: 'role_cashier',
        storeId: 'store_001',
        allowedStores: ['store_001'],
        defaultStoreId: 'store_001',
        active: true,
        pinEnabled: true,
        phone: '+60123456789',
        hireDate: '2023-01-15',
        permissions: [],
        preferences: {
          language: 'en',
          theme: 'light'
        },
        profileImage: null,
        createdAt: new Date().toISOString()
      },
      {
        id: 'emp_002',
        name: 'Sarah Manager',
        email: 'sarah@mockcafe.com',
        role: 'manager',
        roleId: 'role_manager',
        storeId: 'store_001',
        allowedStores: ['store_001', 'store_002'],
        defaultStoreId: 'store_001',
        active: true,
        pinEnabled: true,
        phone: '+60123456790',
        hireDate: '2022-08-01',
        permissions: [],
        preferences: {
          language: 'en',
          theme: 'dark'
        },
        profileImage: null,
        createdAt: new Date().toISOString()
      }
    ];

    // Add password hashes
    for (const employee of employees) {
      const salt = this.generateSalt();
      const pinSalt = this.generateSalt();
      
      employee.salt = salt;
      employee.passwordHash = this.hashPassword('password123', salt);
      employee.pinSalt = pinSalt;
      employee.pinHash = this.hashPassword('1234', pinSalt);
      employee.loginCount = 0;
      
      await this.stateManager.create('employees', employee);
    }

    console.log(`👤 Seeded ${employees.length} employees`);
  }

  async seedCategories() {
    const categories = [
      {
        id: 'cat_001',
        name: 'Coffee',
        description: 'All coffee beverages',
        storeId: 'store_001',
        color: '#8B4513',
        sortOrder: 1,
        active: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'cat_002',
        name: 'Tea',
        description: 'Tea and herbal beverages',
        storeId: 'store_001',
        color: '#228B22',
        sortOrder: 2,
        active: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'cat_003',
        name: 'Pastries',
        description: 'Baked goods and pastries',
        storeId: 'store_001',
        color: '#DAA520',
        sortOrder: 3,
        active: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'cat_004',
        name: 'Sandwiches',
        description: 'Fresh sandwiches and wraps',
        storeId: 'store_001',
        color: '#CD853F',
        sortOrder: 4,
        active: true,
        createdAt: new Date().toISOString()
      }
    ];

    for (const category of categories) {
      await this.stateManager.create('categories', category);
    }

    console.log(`🏷️ Seeded ${categories.length} categories`);
  }

  async seedProducts() {
    const products = [
      {
        id: 'prod_001',
        name: 'Americano',
        description: 'Rich espresso with hot water',
        sku: 'AME001',
        barcode: '1234567890123',
        storeId: 'store_001',
        categoryId: 'cat_001',
        basePrice: 8.50,
        cost: 3.20,
        taxable: true,
        taxRate: 0.06,
        trackInventory: false,
        allowBackorder: true,
        images: [],
        variants: [
          { name: 'Small', priceModifier: -1.00 },
          { name: 'Regular', priceModifier: 0 },
          { name: 'Large', priceModifier: 2.00 }
        ],
        modifierIds: [],
        tags: ['hot', 'coffee', 'popular'],
        status: 'active',
        weight: null,
        dimensions: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'prod_002',
        name: 'Cappuccino',
        description: 'Espresso with steamed milk and foam',
        sku: 'CAP001',
        barcode: '1234567890124',
        storeId: 'store_001',
        categoryId: 'cat_001',
        basePrice: 10.50,
        cost: 4.50,
        taxable: true,
        taxRate: 0.06,
        trackInventory: false,
        allowBackorder: true,
        status: 'active',
        createdAt: new Date().toISOString()
      },
      {
        id: 'prod_003',
        name: 'Earl Grey Tea',
        description: 'Classic bergamot-flavored black tea',
        sku: 'EGT001',
        storeId: 'store_001',
        categoryId: 'cat_002',
        basePrice: 7.00,
        cost: 2.50,
        taxable: true,
        trackInventory: false,
        status: 'active',
        createdAt: new Date().toISOString()
      },
      {
        id: 'prod_004',
        name: 'Chocolate Croissant',
        description: 'Buttery croissant with chocolate filling',
        sku: 'CRC001',
        storeId: 'store_001',
        categoryId: 'cat_003',
        basePrice: 6.50,
        cost: 2.80,
        taxable: true,
        trackInventory: true,
        status: 'active',
        createdAt: new Date().toISOString()
      },
      {
        id: 'prod_005',
        name: 'Club Sandwich',
        description: 'Triple-decker with turkey, bacon, lettuce, tomato',
        sku: 'CLS001',
        storeId: 'store_001',
        categoryId: 'cat_004',
        basePrice: 15.50,
        cost: 7.20,
        taxable: true,
        trackInventory: true,
        status: 'active',
        createdAt: new Date().toISOString()
      }
    ];

    for (const product of products) {
      await this.stateManager.create('products', product);
    }

    console.log(`🛍️ Seeded ${products.length} products`);
  }

  async seedCustomers() {
    const customers = [
      {
        id: 'cust_001',
        name: 'Alice Wong',
        email: 'alice@example.com',
        phone: '+60123456001',
        dateOfBirth: '1990-05-15',
        gender: 'female',
        membershipId: 'MEMBER001',
        membershipTier: 'gold',
        totalSpent: 450.75,
        visitCount: 23,
        lastVisit: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        preferences: {
          notifications: true,
          newsletter: true
        },
        address: {
          street: '456 Jalan Raja',
          city: 'Kuala Lumpur',
          state: 'WP Kuala Lumpur',
          postalCode: '50300',
          country: 'Malaysia'
        },
        notes: 'Prefers oat milk alternatives',
        status: 'active',
        createdAt: new Date().toISOString()
      },
      {
        id: 'cust_002',
        name: 'Robert Lee',
        email: 'robert@example.com',
        phone: '+60123456002',
        dateOfBirth: '1985-12-03',
        gender: 'male',
        membershipId: 'MEMBER002',
        membershipTier: 'silver',
        totalSpent: 234.50,
        visitCount: 12,
        lastVisit: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        createdAt: new Date().toISOString()
      }
    ];

    for (const customer of customers) {
      await this.stateManager.create('customers', customer);
    }

    console.log(`👥 Seeded ${customers.length} customers`);
  }

  async seedInventory() {
    const inventoryItems = [
      {
        id: 'inv_001',
        productId: 'prod_004',
        storeId: 'store_001',
        quantity: 25,
        lowStockThreshold: 5,
        lastUpdated: new Date().toISOString(),
        lastStockCount: new Date().toISOString()
      },
      {
        id: 'inv_002',
        productId: 'prod_005',
        storeId: 'store_001',
        quantity: 12,
        lowStockThreshold: 3,
        lastUpdated: new Date().toISOString(),
        lastStockCount: new Date().toISOString()
      }
    ];

    for (const item of inventoryItems) {
      await this.stateManager.create('inventory', item);
    }

    console.log(`📦 Seeded ${inventoryItems.length} inventory items`);
  }

  async seedPricebooks() {
    const pricebooks = [
      {
        id: 'pb_001',
        name: 'Default Pricing',
        storeId: 'store_001',
        currency: 'MYR',
        active: true,
        isDefault: true,
        createdAt: new Date().toISOString()
      }
    ];

    for (const pricebook of pricebooks) {
      await this.stateManager.create('pricebooks', pricebook);
    }

    // Create pricebook items
    const products = await this.stateManager.query('products', {
      where: { storeId: 'store_001' }
    });

    for (const product of products) {
      const priceItem = {
        id: `pbi_${product.id}`,
        pricebookId: 'pb_001',
        productId: product.id,
        price: product.basePrice,
        currency: 'MYR',
        createdAt: new Date().toISOString()
      };
      
      await this.stateManager.create('pricebook_items', priceItem);
    }

    console.log(`💰 Seeded ${pricebooks.length} pricebooks`);
  }

  async seedSettings() {
    const storeSettings = [
      {
        id: 'settings_store_001',
        storeId: 'store_001',
        receiptSettings: {
          logo: null,
          header: 'Mock Cafe',
          footer: 'Thank you for your visit!',
          showTax: true,
          showQR: true
        },
        taxSettings: {
          defaultRate: 0.06,
          taxIncluded: false,
          roundingMethod: 'nearest'
        },
        printerSettings: {
          defaultPrinter: 'receipt_printer_001',
          autoPrint: true,
          copies: 1
        },
        paymentSettings: {
          allowCash: true,
          allowCard: true,
          allowEWallet: true,
          defaultMethod: 'cash'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    for (const settings of storeSettings) {
      await this.stateManager.create('store_settings', settings);
    }

    const systemSettings = {
      id: 'system_settings_001',
      version: '1.0.0',
      maintenance: false,
      features: {
        loyalty: true,
        inventory: true,
        reporting: true,
        integrations: true
      },
      limits: {
        maxTransactionItems: 100,
        maxDiscountPercent: 50,
        sessionTimeout: 8 * 60 * 60 * 1000 // 8 hours
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await this.stateManager.create('system_settings', systemSettings);

    console.log(`⚙️ Seeded store and system settings`);
  }

  // Clean existing data (for testing)
  async clearAllData() {
    const collections = [
      'stores', 'roles', 'employees', 'categories', 'products', 
      'customers', 'inventory', 'pricebooks', 'pricebook_items',
      'store_settings', 'system_settings', 'transactions', 'payments',
      'sessions', 'elevated_sessions'
    ];

    for (const collection of collections) {
      try {
        const items = await this.stateManager.getAll(collection);
        for (const item of items) {
          await this.stateManager.delete(collection, item.id);
        }
      } catch (error) {
        // Collection might not exist yet, ignore
      }
    }

    console.log('🧹 Cleared all existing POS data');
  }
}

module.exports = POSSeedData;