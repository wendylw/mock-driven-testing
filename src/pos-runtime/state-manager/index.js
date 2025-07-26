const loki = require('lokijs');
const EventEmitter = require('events');

class POSStateManager extends EventEmitter {
  constructor(config = {}) {
    super();
    
    this.config = {
      filename: config.filename || 'pos-mock.db',
      autoload: config.autoload !== false,
      autoloadCallback: this.databaseInitialize.bind(this),
      autosave: config.autosave !== false,
      autosaveInterval: config.autosaveInterval || 4000,
      ...config
    };
    
    this.db = new loki(this.config.filename, this.config);
    this.collections = {};
    this.initialized = false;
    this.schemas = {};
    this.relationships = [];
    
    // Transaction support
    this.transactionQueue = [];
    this.inTransaction = false;
    
    // Change tracking
    this.changeLog = [];
    this.maxChangeLogSize = 1000;
    
    this.setupSchemas();
  }

  setupSchemas() {
    // Define POS data schemas
    this.schemas = {
      stores: {
        name: 'stores',
        primaryKey: 'storeId',
        properties: {
          storeId: { type: 'string', required: true },
          name: { type: 'string', required: true },
          address: { type: 'object', required: false },
          timezone: { type: 'string', required: true },
          currency: { type: 'string', required: true },
          settings: { type: 'object', required: false },
          status: { type: 'string', required: true, default: 'active' }
        }
      },
      products: {
        name: 'products',
        primaryKey: 'productId',
        properties: {
          productId: { type: 'string', required: true },
          storeId: { type: 'string', required: true },
          sku: { type: 'string', required: true },
          name: { type: 'string', required: true },
          description: { type: 'string', required: false },
          category: { type: 'string', required: true },
          price: { type: 'number', required: true },
          cost: { type: 'number', required: false },
          quantity: { type: 'number', required: true, default: 0 },
          unit: { type: 'string', required: true, default: 'piece' },
          barcode: { type: 'string', required: false },
          variants: { type: 'array', required: false, default: [] },
          status: { type: 'string', required: true, default: 'active' }
        }
      },
      transactions: {
        name: 'transactions',
        primaryKey: 'transactionId',
        properties: {
          transactionId: { type: 'string', required: true },
          storeId: { type: 'string', required: true },
          registerId: { type: 'string', required: true },
          customerId: { type: 'string', required: false },
          items: { type: 'array', required: true },
          subtotal: { type: 'number', required: true },
          tax: { type: 'number', required: true, default: 0 },
          discount: { type: 'number', required: false, default: 0 },
          total: { type: 'number', required: true },
          payments: { type: 'array', required: false, default: [] },
          status: { type: 'string', required: true, default: 'pending' },
          receiptNumber: { type: 'string', required: false },
          notes: { type: 'string', required: false }
        }
      },
      customers: {
        name: 'customers',
        primaryKey: 'customerId',
        properties: {
          customerId: { type: 'string', required: true },
          storeId: { type: 'string', required: true },
          name: { type: 'string', required: true },
          email: { type: 'string', required: false },
          phone: { type: 'string', required: false },
          address: { type: 'object', required: false },
          loyaltyPoints: { type: 'number', required: false, default: 0 },
          membershipTier: { type: 'string', required: false },
          preferences: { type: 'object', required: false },
          status: { type: 'string', required: true, default: 'active' }
        }
      },
      registers: {
        name: 'registers',
        primaryKey: 'registerId',
        properties: {
          registerId: { type: 'string', required: true },
          storeId: { type: 'string', required: true },
          name: { type: 'string', required: true },
          location: { type: 'string', required: false },
          hardware: { type: 'object', required: false },
          currentUser: { type: 'string', required: false },
          status: { type: 'string', required: true, default: 'offline' },
          lastSync: { type: 'date', required: false }
        }
      },
      inventory: {
        name: 'inventory',
        primaryKey: 'inventoryId',
        properties: {
          inventoryId: { type: 'string', required: true },
          storeId: { type: 'string', required: true },
          productId: { type: 'string', required: true },
          quantity: { type: 'number', required: true, default: 0 },
          reorderLevel: { type: 'number', required: false, default: 10 },
          maxLevel: { type: 'number', required: false },
          lastUpdated: { type: 'date', required: true },
          updateReason: { type: 'string', required: false }
        }
      },
      staff: {
        name: 'staff',
        primaryKey: 'staffId',
        properties: {
          staffId: { type: 'string', required: true },
          storeId: { type: 'string', required: true },
          name: { type: 'string', required: true },
          email: { type: 'string', required: false },
          role: { type: 'string', required: true },
          permissions: { type: 'array', required: false, default: [] },
          pin: { type: 'string', required: false },
          schedule: { type: 'object', required: false },
          status: { type: 'string', required: true, default: 'active' }
        }
      }
    };

    // Define relationships
    this.relationships = [
      { from: 'products', to: 'stores', foreignKey: 'storeId' },
      { from: 'transactions', to: 'stores', foreignKey: 'storeId' },
      { from: 'transactions', to: 'customers', foreignKey: 'customerId' },
      { from: 'transactions', to: 'registers', foreignKey: 'registerId' },
      { from: 'customers', to: 'stores', foreignKey: 'storeId' },
      { from: 'registers', to: 'stores', foreignKey: 'storeId' },
      { from: 'inventory', to: 'stores', foreignKey: 'storeId' },
      { from: 'inventory', to: 'products', foreignKey: 'productId' },
      { from: 'staff', to: 'stores', foreignKey: 'storeId' }
    ];
  }

  databaseInitialize() {
    try {
      this.initializeCollections();
      this.createIndexes();
      this.loadSeedData();
      this.initialized = true;
      
      console.log('POS State Manager initialized successfully');
      this.emit('ready');
      
    } catch (error) {
      console.error('Failed to initialize POS State Manager:', error);
      this.emit('error', error);
    }
  }

  initializeCollections() {
    Object.entries(this.schemas).forEach(([name, schema]) => {
      this.collections[name] = this.db.getCollection(name) || 
                               this.db.addCollection(name, {
                                 unique: [schema.primaryKey],
                                 indices: this.getIndicesForSchema(schema)
                               });
    });
  }

  getIndicesForSchema(schema) {
    const indices = [schema.primaryKey];
    
    Object.entries(schema.properties).forEach(([propName, propDef]) => {
      if (propName.endsWith('Id') || propName === 'status' || propName === 'category') {
        indices.push(propName);
      }
    });
    
    return [...new Set(indices)]; // Remove duplicates
  }

  createIndexes() {
    // Additional composite indexes for common queries
    const compositeIndexes = [
      { collection: 'products', fields: ['storeId', 'category'] },
      { collection: 'products', fields: ['storeId', 'status'] },
      { collection: 'transactions', fields: ['storeId', 'status'] },
      { collection: 'transactions', fields: ['storeId', 'createdAt'] },
      { collection: 'inventory', fields: ['storeId', 'productId'] }
    ];

    compositeIndexes.forEach(index => {
      const collection = this.collections[index.collection];
      if (collection) {
        index.fields.forEach(field => {
          collection.ensureIndex(field);
        });
      }
    });
  }

  loadSeedData() {
    // Only load seed data if collections are empty
    if (this.collections.stores.count() === 0) {
      this.seedStores();
      this.seedProducts();
      this.seedRegisters();
      this.seedStaff();
      this.seedCustomers();
      this.seedInventory();
      
      console.log('Seed data loaded');
    }
  }

  // CRUD Operations
  async create(collectionName, data) {
    const collection = this.collections[collectionName];
    if (!collection) {
      throw new Error(`Collection ${collectionName} not found`);
    }

    const schema = this.schemas[collectionName];
    if (!schema) {
      throw new Error(`Schema for ${collectionName} not found`);
    }

    // Validate data
    this.validateData(data, schema);

    // Add metadata
    const enrichedData = {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Set default values
    Object.entries(schema.properties).forEach(([prop, def]) => {
      if (enrichedData[prop] === undefined && def.default !== undefined) {
        enrichedData[prop] = def.default;
      }
    });

    const result = collection.insert(enrichedData);
    
    this.logChange('create', collectionName, result);
    this.emit('created', { collection: collectionName, data: result });
    
    return result;
  }

  async findById(collectionName, id) {
    const collection = this.collections[collectionName];
    if (!collection) {
      throw new Error(`Collection ${collectionName} not found`);
    }

    const schema = this.schemas[collectionName];
    const primaryKey = schema ? schema.primaryKey : 'id';
    
    return collection.findOne({ [primaryKey]: id });
  }

  async getAll(collectionName, filters = {}) {
    const collection = this.collections[collectionName];
    if (!collection) {
      throw new Error(`Collection ${collectionName} not found`);
    }

    return collection.find(filters);
  }

  async query(collectionName, queryOptions = {}) {
    const collection = this.collections[collectionName];
    if (!collection) {
      throw new Error(`Collection ${collectionName} not found`);
    }

    let chain = collection.chain();

    if (queryOptions.where) {
      chain = chain.find(queryOptions.where);
    }

    if (queryOptions.sort) {
      const { field, desc = false } = queryOptions.sort;
      chain = chain.simplesort(field, desc);
    }

    if (queryOptions.limit) {
      chain = chain.limit(queryOptions.limit);
    }

    if (queryOptions.offset) {
      chain = chain.offset(queryOptions.offset);
    }

    return chain.data();
  }

  async update(collectionName, id, updateData) {
    const collection = this.collections[collectionName];
    if (!collection) {
      throw new Error(`Collection ${collectionName} not found`);
    }

    const schema = this.schemas[collectionName];
    const primaryKey = schema ? schema.primaryKey : 'id';
    
    const record = collection.findOne({ [primaryKey]: id });
    if (!record) {
      throw new Error(`Record with ${primaryKey} ${id} not found in ${collectionName}`);
    }

    // Validate update data
    this.validateUpdateData(updateData, schema);

    // Update record
    Object.assign(record, updateData, {
      updatedAt: new Date().toISOString()
    });

    collection.update(record);
    
    this.logChange('update', collectionName, record, updateData);
    this.emit('updated', { collection: collectionName, id, data: record });
    
    return record;
  }

  async delete(collectionName, id) {
    const collection = this.collections[collectionName];
    if (!collection) {
      throw new Error(`Collection ${collectionName} not found`);
    }

    const schema = this.schemas[collectionName];
    const primaryKey = schema ? schema.primaryKey : 'id';
    
    const record = collection.findOne({ [primaryKey]: id });
    if (!record) {
      throw new Error(`Record with ${primaryKey} ${id} not found in ${collectionName}`);
    }

    collection.remove(record);
    
    this.logChange('delete', collectionName, record);
    this.emit('deleted', { collection: collectionName, id, data: record });
    
    return true;
  }

  // Validation
  validateData(data, schema) {
    Object.entries(schema.properties).forEach(([prop, def]) => {
      if (def.required && (data[prop] === undefined || data[prop] === null)) {
        throw new Error(`Required field ${prop} is missing`);
      }

      if (data[prop] !== undefined) {
        this.validateFieldType(data[prop], def.type, prop);
      }
    });
  }

  validateUpdateData(data, schema) {
    Object.entries(data).forEach(([prop, value]) => {
      if (schema.properties[prop]) {
        this.validateFieldType(value, schema.properties[prop].type, prop);
      }
    });
  }

  validateFieldType(value, expectedType, fieldName) {
    const actualType = Array.isArray(value) ? 'array' : typeof value;
    
    if (expectedType === 'date') {
      if (!(value instanceof Date) && !this.isValidDateString(value)) {
        throw new Error(`Field ${fieldName} must be a Date or valid date string`);
      }
    } else if (actualType !== expectedType) {
      throw new Error(`Field ${fieldName} must be of type ${expectedType}, got ${actualType}`);
    }
  }

  isValidDateString(value) {
    return typeof value === 'string' && !isNaN(Date.parse(value));
  }

  // Change Tracking
  logChange(operation, collection, data, updateData = null) {
    const change = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      operation,
      collection,
      recordId: data[this.schemas[collection]?.primaryKey || 'id'],
      data: operation === 'update' ? updateData : data
    };

    this.changeLog.push(change);
    this.trimChangeLog();
  }

  trimChangeLog() {
    if (this.changeLog.length > this.maxChangeLogSize) {
      this.changeLog = this.changeLog.slice(-this.maxChangeLogSize);
    }
  }

  getChangeLog(limit = 100) {
    return this.changeLog.slice(-limit);
  }

  // Transaction Support
  beginTransaction() {
    this.inTransaction = true;
    this.transactionQueue = [];
  }

  commitTransaction() {
    if (!this.inTransaction) {
      throw new Error('No active transaction');
    }

    try {
      // Execute all queued operations
      this.transactionQueue.forEach(operation => {
        operation.execute();
      });
      
      this.inTransaction = false;
      this.transactionQueue = [];
      
      this.emit('transactionCommitted');
    } catch (error) {
      this.rollbackTransaction();
      throw error;
    }
  }

  rollbackTransaction() {
    this.inTransaction = false;
    this.transactionQueue = [];
    this.emit('transactionRolledBack');
  }

  // Utility Methods
  generateId(prefix = 'ID') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getStats() {
    const stats = {};
    
    Object.entries(this.collections).forEach(([name, collection]) => {
      stats[name] = {
        count: collection.count(),
        size: collection.data ? collection.data.length : 0
      };
    });

    return {
      collections: stats,
      totalRecords: Object.values(stats).reduce((sum, col) => sum + col.count, 0),
      changeLogSize: this.changeLog.length,
      initialized: this.initialized
    };
  }

  reset() {
    Object.values(this.collections).forEach(collection => {
      collection.clear();
    });
    
    this.changeLog = [];
    this.loadSeedData();
    
    this.emit('reset');
  }

  export() {
    const data = {};
    
    Object.entries(this.collections).forEach(([name, collection]) => {
      data[name] = collection.data || [];
    });

    return {
      data,
      schemas: this.schemas,
      metadata: {
        exportedAt: new Date().toISOString(),
        version: '1.0.0'
      }
    };
  }

  import(exportData) {
    if (!exportData.data || !exportData.schemas) {
      throw new Error('Invalid import data format');
    }

    // Clear existing data
    this.reset();

    // Import data
    Object.entries(exportData.data).forEach(([collectionName, records]) => {
      const collection = this.collections[collectionName];
      if (collection) {
        records.forEach(record => {
          collection.insert(record);
        });
      }
    });

    this.emit('imported', { recordCount: Object.values(exportData.data).flat().length });
  }

  // Seed Data Methods
  seedStores() {
    const stores = [
      {
        storeId: 'STORE_001',
        name: 'Main Store',
        address: {
          street: '123 Main St',
          city: 'Anytown',
          state: 'ST',
          zipCode: '12345',
          country: 'US'
        },
        timezone: 'America/New_York',
        currency: 'USD',
        settings: {
          taxRate: 0.08,
          serviceCharge: 0.1,
          roundingMode: 'nearest_cent'
        }
      },
      {
        storeId: 'STORE_002',
        name: 'Branch Store',
        address: {
          street: '456 Branch Ave',
          city: 'Otherville',
          state: 'ST',
          zipCode: '67890',
          country: 'US'
        },
        timezone: 'America/New_York',
        currency: 'USD',
        settings: {
          taxRate: 0.075,
          serviceCharge: 0.12,
          roundingMode: 'up'
        }
      }
    ];

    stores.forEach(store => {
      this.collections.stores.insert({
        ...store,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    });
  }

  seedProducts() {
    const products = [
      {
        productId: 'PROD_001',
        storeId: 'STORE_001',
        sku: 'SKU001',
        name: 'Coffee - Regular',
        description: 'House blend coffee',
        category: 'Beverages',
        price: 2.50,
        cost: 0.75,
        quantity: 100,
        unit: 'cup',
        barcode: '1234567890123'
      },
      {
        productId: 'PROD_002',
        storeId: 'STORE_001',
        sku: 'SKU002',
        name: 'Sandwich - Ham & Cheese',
        description: 'Fresh ham and cheese sandwich',
        category: 'Food',
        price: 8.99,
        cost: 3.50,
        quantity: 50,
        unit: 'piece',
        barcode: '2345678901234'
      },
      {
        productId: 'PROD_003',
        storeId: 'STORE_001',
        sku: 'SKU003',
        name: 'Muffin - Blueberry',
        description: 'Fresh baked blueberry muffin',
        category: 'Bakery',
        price: 3.25,
        cost: 1.20,
        quantity: 30,
        unit: 'piece',
        barcode: '3456789012345'
      }
    ];

    products.forEach(product => {
      this.collections.products.insert({
        ...product,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    });
  }

  seedRegisters() {
    const registers = [
      {
        registerId: 'REG_001',
        storeId: 'STORE_001',
        name: 'Main Counter',
        location: 'Front of store',
        hardware: {
          printer: true,
          scanner: true,
          cashDrawer: true,
          cardReader: true
        },
        status: 'online'
      },
      {
        registerId: 'REG_002',
        storeId: 'STORE_001',
        name: 'Express Lane',
        location: 'Side counter',
        hardware: {
          printer: true,
          scanner: true,
          cashDrawer: false,
          cardReader: true
        },
        status: 'online'
      }
    ];

    registers.forEach(register => {
      this.collections.registers.insert({
        ...register,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    });
  }

  seedStaff() {
    const staff = [
      {
        staffId: 'STAFF_001',
        storeId: 'STORE_001',
        name: 'John Manager',
        email: 'john@example.com',
        role: 'manager',
        permissions: ['all'],
        pin: '1234'
      },
      {
        staffId: 'STAFF_002',
        storeId: 'STORE_001',
        name: 'Jane Cashier',
        email: 'jane@example.com',
        role: 'cashier',
        permissions: ['transactions', 'products'],
        pin: '5678'
      }
    ];

    staff.forEach(member => {
      this.collections.staff.insert({
        ...member,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    });
  }

  seedCustomers() {
    const customers = [
      {
        customerId: 'CUST_001',
        storeId: 'STORE_001',
        name: 'Regular Customer',
        email: 'regular@example.com',
        phone: '+1234567890',
        loyaltyPoints: 150,
        membershipTier: 'silver'
      },
      {
        customerId: 'CUST_002',
        storeId: 'STORE_001',
        name: 'VIP Customer',
        email: 'vip@example.com',
        phone: '+1987654321',
        loyaltyPoints: 2500,
        membershipTier: 'gold'
      }
    ];

    customers.forEach(customer => {
      this.collections.customers.insert({
        ...customer,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    });
  }

  seedInventory() {
    const inventory = [
      {
        inventoryId: 'INV_001',
        storeId: 'STORE_001',
        productId: 'PROD_001',
        quantity: 100,
        reorderLevel: 20,
        maxLevel: 200,
        lastUpdated: new Date().toISOString(),
        updateReason: 'initial_stock'
      },
      {
        inventoryId: 'INV_002',
        storeId: 'STORE_001',
        productId: 'PROD_002',
        quantity: 50,
        reorderLevel: 10,
        maxLevel: 100,
        lastUpdated: new Date().toISOString(),
        updateReason: 'initial_stock'
      }
    ];

    inventory.forEach(item => {
      this.collections.inventory.insert({
        ...item,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    });
  }
}

module.exports = POSStateManager;