const fs = require('fs');
const path = require('path');

class StateGenerator {
  constructor() {
    this.templates = {
      stateManager: this.getStateManagerTemplate(),
      collection: this.getCollectionTemplate(),
      operations: this.getOperationsTemplate(),
      seedData: this.getSeedDataTemplate()
    };
  }

  generate(analysis) {
    const { models, relationships, operations, seedData } = analysis;
    
    const stateManager = this.createStateManager(models, relationships);
    const collections = this.generateCollections(models);
    const operationsCode = this.generateOperations(operations, models);
    const seedDataCode = this.generateSeedData(seedData, models);

    return {
      files: [
        {
          path: 'state/manager.js',
          content: this.renderTemplate('stateManager', {
            collections,
            operations: operationsCode,
            models: Object.keys(models)
          })
        },
        {
          path: 'state/collections.js',
          content: this.renderTemplate('collection', {
            models,
            relationships
          })
        },
        {
          path: 'state/operations.js',
          content: this.renderTemplate('operations', {
            operations: operationsCode,
            models
          })
        },
        {
          path: 'state/seed-data.js',
          content: this.renderTemplate('seedData', {
            seedData: seedDataCode,
            models
          })
        }
      ]
    };
  }

  createStateManager(models, relationships) {
    const collections = Object.keys(models).map(modelName => {
      return {
        name: modelName.toLowerCase() + 's',
        model: modelName,
        primaryKey: models[modelName].primaryKey || 'id',
        relationships: relationships.filter(rel => rel.from === modelName)
      };
    });

    return {
      collections,
      indexes: this.generateIndexes(models, relationships),
      views: this.generateViews(models, relationships)
    };
  }

  generateIndexes(models, relationships) {
    const indexes = [];
    
    // Primary key indexes
    Object.entries(models).forEach(([modelName, schema]) => {
      if (schema.primaryKey) {
        indexes.push({
          collection: modelName.toLowerCase() + 's',
          field: schema.primaryKey,
          unique: true
        });
      }
    });

    // Foreign key indexes
    relationships.forEach(rel => {
      if (rel.type === 'one-to-one' || rel.type === 'many-to-one') {
        indexes.push({
          collection: rel.from.toLowerCase() + 's',
          field: rel.property,
          unique: false
        });
      }
    });

    // Common query indexes
    Object.entries(models).forEach(([modelName, schema]) => {
      Object.entries(schema.properties).forEach(([propName, propDef]) => {
        if (propName.includes('Id') || propName.includes('Code') || propName.includes('Status')) {
          indexes.push({
            collection: modelName.toLowerCase() + 's',
            field: propName,
            unique: false
          });
        }
      });
    });

    return indexes;
  }

  generateViews(models, relationships) {
    const views = [];
    
    // Generate views for common queries
    relationships.forEach(rel => {
      if (rel.type === 'one-to-many') {
        views.push({
          name: `${rel.from.toLowerCase()}With${rel.to}s`,
          transform: this.generateViewTransform(rel)
        });
      }
    });

    return views;
  }

  generateViewTransform(relationship) {
    return `
    function(doc) {
      if (doc.${relationship.property} && doc.${relationship.property}.length > 0) {
        return {
          ...doc,
          ${relationship.property}: doc.${relationship.property}.map(item => ({
            ...item,
            _expanded: true
          }))
        };
      }
      return doc;
    }`;
  }

  generateCollections(models) {
    return Object.entries(models).map(([modelName, schema]) => {
      return {
        name: modelName.toLowerCase() + 's',
        schema: this.convertSchemaToLokiJS(schema),
        indices: this.getIndicesForModel(schema),
        constraints: this.generateConstraints(schema)
      };
    });
  }

  convertSchemaToLokiJS(schema) {
    const lokiSchema = {
      name: schema.name,
      properties: {}
    };

    Object.entries(schema.properties).forEach(([propName, propDef]) => {
      const propType = typeof propDef === 'string' ? propDef : propDef.type;
      lokiSchema.properties[propName] = {
        type: this.mapRealmTypeToJS(propType),
        required: !propDef.optional,
        default: this.getDefaultValue(propType)
      };
    });

    return lokiSchema;
  }

  mapRealmTypeToJS(realmType) {
    const typeMapping = {
      'string': 'string',
      'int': 'number',
      'integer': 'number',
      'float': 'number',
      'double': 'number',
      'bool': 'boolean',
      'boolean': 'boolean',
      'date': 'date',
      'data': 'object',
      'list': 'array'
    };

    return typeMapping[realmType.toLowerCase()] || 'string';
  }

  getDefaultValue(type) {
    const defaults = {
      'string': '',
      'number': 0,
      'boolean': false,
      'date': null,
      'object': null,
      'array': []
    };

    return defaults[this.mapRealmTypeToJS(type)] || null;
  }

  getIndicesForModel(schema) {
    const indices = [];
    
    if (schema.primaryKey) {
      indices.push(schema.primaryKey);
    }

    Object.keys(schema.properties).forEach(propName => {
      if (propName.endsWith('Id') || propName.endsWith('Code')) {
        indices.push(propName);
      }
    });

    return indices;
  }

  generateConstraints(schema) {
    const constraints = [];

    if (schema.primaryKey) {
      constraints.push({
        field: schema.primaryKey,
        type: 'unique',
        message: `${schema.primaryKey} must be unique`
      });
    }

    Object.entries(schema.properties).forEach(([propName, propDef]) => {
      if (!propDef.optional) {
        constraints.push({
          field: propName,
          type: 'required',
          message: `${propName} is required`
        });
      }
    });

    return constraints;
  }

  generateOperations(operations, models) {
    const operationMethods = {};

    // Generate CRUD operations for each model
    Object.keys(models).forEach(modelName => {
      const collectionName = modelName.toLowerCase() + 's';
      
      operationMethods[modelName] = {
        create: this.generateCreateOperation(modelName, collectionName),
        read: this.generateReadOperation(modelName, collectionName),
        update: this.generateUpdateOperation(modelName, collectionName),
        delete: this.generateDeleteOperation(modelName, collectionName),
        query: this.generateQueryOperation(modelName, collectionName)
      };
    });

    // Add custom operations based on analysis
    Object.entries(operations).forEach(([opType, opList]) => {
      opList.forEach(op => {
        if (op.model && operationMethods[op.model]) {
          operationMethods[op.model][`custom_${opType}`] = this.generateCustomOperation(op);
        }
      });
    });

    return operationMethods;
  }

  generateCreateOperation(modelName, collectionName) {
    return `
    create${modelName}(data) {
      const collection = this.db.getCollection('${collectionName}');
      if (!collection) {
        throw new Error('Collection ${collectionName} not found');
      }
      
      // Validate required fields
      this.validate${modelName}(data);
      
      // Set default values
      const record = {
        ...data,
        id: data.id || this.generateId(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      return collection.insert(record);
    }`;
  }

  generateReadOperation(modelName, collectionName) {
    return `
    get${modelName}(id) {
      const collection = this.db.getCollection('${collectionName}');
      if (!collection) {
        throw new Error('Collection ${collectionName} not found');
      }
      
      return collection.findOne({ id: id });
    }
    
    getAll${modelName}s(filter = {}) {
      const collection = this.db.getCollection('${collectionName}');
      if (!collection) {
        throw new Error('Collection ${collectionName} not found');
      }
      
      return collection.find(filter);
    }`;
  }

  generateUpdateOperation(modelName, collectionName) {
    return `
    update${modelName}(id, data) {
      const collection = this.db.getCollection('${collectionName}');
      if (!collection) {
        throw new Error('Collection ${collectionName} not found');
      }
      
      const record = collection.findOne({ id: id });
      if (!record) {
        throw new Error('${modelName} not found');
      }
      
      // Update fields
      Object.assign(record, data, {
        updatedAt: new Date()
      });
      
      collection.update(record);
      return record;
    }`;
  }

  generateDeleteOperation(modelName, collectionName) {
    return `
    delete${modelName}(id) {
      const collection = this.db.getCollection('${collectionName}');
      if (!collection) {
        throw new Error('Collection ${collectionName} not found');
      }
      
      const record = collection.findOne({ id: id });
      if (!record) {
        throw new Error('${modelName} not found');
      }
      
      collection.remove(record);
      return true;
    }`;
  }

  generateQueryOperation(modelName, collectionName) {
    return `
    query${modelName}s(query) {
      const collection = this.db.getCollection('${collectionName}');
      if (!collection) {
        throw new Error('Collection ${collectionName} not found');
      }
      
      let chain = collection.chain();
      
      if (query.where) {
        chain = chain.find(query.where);
      }
      
      if (query.sort) {
        chain = chain.simplesort(query.sort.field, query.sort.desc);
      }
      
      if (query.limit) {
        chain = chain.limit(query.limit);
      }
      
      if (query.offset) {
        chain = chain.offset(query.offset);
      }
      
      return chain.data();
    }`;
  }

  generateCustomOperation(operation) {
    return `
    // Custom operation based on: ${operation.operation}
    // File: ${operation.file}
    customOperation() {
      // Implementation based on analyzed operation
      return this.db.getCollection('default').find({});
    }`;
  }

  generateSeedData(seedData, models) {
    const seedMethods = {};

    Object.entries(seedData).forEach(([modelName, data]) => {
      seedMethods[modelName] = {
        data: data,
        method: this.generateSeedMethod(modelName, data)
      };
    });

    return seedMethods;
  }

  generateSeedMethod(modelName, data) {
    return `
    seed${modelName}s() {
      const collection = this.db.getCollection('${modelName.toLowerCase()}s');
      if (!collection) {
        console.warn('Collection ${modelName.toLowerCase()}s not found for seeding');
        return;
      }
      
      // Clear existing data
      collection.clear();
      
      // Insert seed data
      const seedData = ${JSON.stringify(data, null, 2)};
      seedData.forEach(item => {
        collection.insert({
          ...item,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      });
      
      console.log('Seeded ${data.length} ${modelName} records');
    }`;
  }

  renderTemplate(templateName, data) {
    const template = this.templates[templateName];
    if (!template) {
      throw new Error(`Template ${templateName} not found`);
    }

    return this.interpolateTemplate(template, data);
  }

  interpolateTemplate(template, data) {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      if (key in data) {
        if (typeof data[key] === 'object') {
          return JSON.stringify(data[key], null, 2);
        }
        return String(data[key]);
      }
      return match;
    });
  }

  getStateManagerTemplate() {
    return `
const loki = require('lokijs');

class POSStateManager {
  constructor(config = {}) {
    this.config = {
      filename: 'pos-mock.db',
      autoload: true,
      autoloadCallback: this.databaseInitialize.bind(this),
      autosave: true,
      autosaveInterval: 4000,
      ...config
    };
    
    this.db = new loki(this.config.filename, this.config);
    this.collections = {};
    this.initialized = false;
  }

  databaseInitialize() {
    this.initializeCollections();
    this.createIndexes();
    this.seedDatabase();
    this.initialized = true;
    console.log('POS State Manager initialized');
  }

  initializeCollections() {
    {{models}}.forEach(modelName => {
      const collectionName = modelName.toLowerCase() + 's';
      this.collections[collectionName] = this.db.getCollection(collectionName) || 
                                        this.db.addCollection(collectionName);
    });
  }

  createIndexes() {
    // Create indexes for better performance
    {{collections}}.forEach(collection => {
      if (collection.indices) {
        collection.indices.forEach(index => {
          this.collections[collection.name].ensureIndex(index);
        });
      }
    });
  }

  seedDatabase() {
    if (this.collections.stores && this.collections.stores.count() === 0) {
      this.seedStores();
      this.seedProducts();
      this.seedTransactions();
      console.log('Database seeded with initial data');
    }
  }

  // Transaction management
  beginTransaction() {
    // LokiJS doesn't have native transactions, but we can implement a simple version
    this.transactionData = {};
    this.inTransaction = true;
  }

  commitTransaction() {
    if (this.inTransaction && this.transactionData) {
      // Apply all changes
      Object.entries(this.transactionData).forEach(([collection, operations]) => {
        operations.forEach(op => {
          this[op.method](...op.args);
        });
      });
      this.transactionData = {};
      this.inTransaction = false;
    }
  }

  rollbackTransaction() {
    this.transactionData = {};
    this.inTransaction = false;
  }

  // Utility methods
  generateId() {
    return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  getStats() {
    const stats = {};
    Object.entries(this.collections).forEach(([name, collection]) => {
      stats[name] = {
        count: collection.count(),
        size: collection.data.length
      };
    });
    return stats;
  }

  reset() {
    Object.values(this.collections).forEach(collection => {
      collection.clear();
    });
    this.seedDatabase();
  }

  export() {
    const data = {};
    Object.entries(this.collections).forEach(([name, collection]) => {
      data[name] = collection.data;
    });
    return data;
  }

  import(data) {
    Object.entries(data).forEach(([collectionName, records]) => {
      if (this.collections[collectionName]) {
        this.collections[collectionName].clear();
        records.forEach(record => {
          this.collections[collectionName].insert(record);
        });
      }
    });
  }

  {{operations}}
}

module.exports = POSStateManager;
`;
  }

  getCollectionTemplate() {
    return `
// Collection definitions for POS models
const collections = {{models}};

module.exports = collections;
`;
  }

  getOperationsTemplate() {
    return `
// Database operations for POS models
{{operations}}

module.exports = {
  {{models}}
};
`;
  }

  getSeedDataTemplate() {
    return `
// Seed data for POS models
const seedData = {{seedData}};

function seedDatabase(stateManager) {
  Object.entries(seedData).forEach(([modelName, data]) => {
    const methodName = 'seed' + modelName + 's';
    if (typeof stateManager[methodName] === 'function') {
      stateManager[methodName]();
    }
  });
}

module.exports = {
  seedData,
  seedDatabase
};
`;
  }
}

module.exports = StateGenerator;
`;
  }
}

module.exports = StateGenerator;