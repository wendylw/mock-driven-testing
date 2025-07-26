const fs = require('fs');
const path = require('path');

class RealmAnalyzer {
  constructor() {
    this.realmSchemaPatterns = [
      /class\s+(\w+)\s+extends\s+Realm\.Object/g,
      /(\w+)\.schema\s*=\s*{/g,
      /static\s+schema\s*=\s*{/g
    ];
    this.relationshipPatterns = [
      /(\w+)\s*:\s*['"`](\w+)['"`]/g,
      /type\s*:\s*['"`](\w+)['"`]/g,
      /objectType\s*:\s*['"`](\w+)['"`]/g
    ];
  }

  analyze(codebase) {
    const realmFiles = this.findRealmFiles(codebase);
    const schemas = this.extractSchemas(realmFiles);
    const relationships = this.analyzeRelationships(schemas);
    const operations = this.findDataOperations(codebase);

    return {
      models: schemas,
      relationships,
      operations,
      seedData: this.generateSeedData(schemas)
    };
  }

  findRealmFiles(codebase) {
    const realmFiles = [];
    
    function scanDirectory(dir) {
      if (!fs.existsSync(dir)) return;
      
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
          scanDirectory(filePath);
        } else if (file.endsWith('.js') || file.endsWith('.ts')) {
          const content = fs.readFileSync(filePath, 'utf8');
          if (content.includes('Realm') || content.includes('realm')) {
            realmFiles.push({
              path: filePath,
              content,
              name: file
            });
          }
        }
      });
    }

    scanDirectory(codebase);
    return realmFiles;
  }

  extractSchemas(realmFiles) {
    const schemas = {};

    realmFiles.forEach(file => {
      // Extract class-based schemas
      const classMatches = [...file.content.matchAll(/class\s+(\w+)\s+extends\s+Realm\.Object\s*{([^}]*)}/gs)];
      classMatches.forEach(match => {
        const [, className, classBody] = match;
        const schema = this.parseSchemaFromClass(className, classBody);
        if (schema) {
          schemas[className] = schema;
        }
      });

      // Extract static schema definitions
      const schemaMatches = [...file.content.matchAll(/(\w+)\.schema\s*=\s*({[^}]*})/gs)];
      schemaMatches.forEach(match => {
        const [, objectName, schemaDefinition] = match;
        const schema = this.parseSchemaDefinition(objectName, schemaDefinition);
        if (schema) {
          schemas[objectName] = schema;
        }
      });
    });

    return schemas;
  }

  parseSchemaFromClass(className, classBody) {
    const schema = {
      name: className,
      properties: {},
      primaryKey: null
    };

    // Extract static schema property
    const staticSchemaMatch = classBody.match(/static\s+schema\s*=\s*({[^}]*})/s);
    if (staticSchemaMatch) {
      return this.parseSchemaDefinition(className, staticSchemaMatch[1]);
    }

    // Extract properties from class body
    const propertyMatches = [...classBody.matchAll(/(\w+)\s*(?::\s*([^;,\n]+))?/g)];
    propertyMatches.forEach(match => {
      const [, propName, propType] = match;
      if (propName && !['constructor', 'static'].includes(propName)) {
        schema.properties[propName] = {
          type: propType || 'string',
          optional: true
        };
      }
    });

    return Object.keys(schema.properties).length > 0 ? schema : null;
  }

  parseSchemaDefinition(objectName, schemaDefinition) {
    try {
      // Clean up the schema definition for parsing
      const cleanedSchema = schemaDefinition
        .replace(/'/g, '"')
        .replace(/(\w+):/g, '"$1":')
        .replace(/,\s*}/g, '}');

      const parsed = JSON.parse(cleanedSchema);
      
      return {
        name: parsed.name || objectName,
        properties: parsed.properties || {},
        primaryKey: parsed.primaryKey || null
      };
    } catch (error) {
      // Fallback to regex parsing
      return this.parseSchemaWithRegex(objectName, schemaDefinition);
    }
  }

  parseSchemaWithRegex(objectName, schemaDefinition) {
    const schema = {
      name: objectName,
      properties: {},
      primaryKey: null
    };

    // Extract properties
    const propMatches = [...schemaDefinition.matchAll(/['"`]?(\w+)['"`]?\s*:\s*['"`]?([^,}]+)['"`]?/g)];
    propMatches.forEach(match => {
      const [, propName, propValue] = match;
      if (propName === 'name') {
        schema.name = propValue.replace(/['"`]/g, '');
      } else if (propName === 'primaryKey') {
        schema.primaryKey = propValue.replace(/['"`]/g, '');
      } else if (propName === 'properties') {
        // This is the properties object, parse it separately
        const propsMatch = schemaDefinition.match(/properties\s*:\s*({[^}]*})/);
        if (propsMatch) {
          schema.properties = this.parsePropertiesObject(propsMatch[1]);
        }
      }
    });

    return schema;
  }

  parsePropertiesObject(propertiesString) {
    const properties = {};
    const propMatches = [...propertiesString.matchAll(/['"`]?(\w+)['"`]?\s*:\s*['"`]?([^,}]+)['"`]?/g)];
    
    propMatches.forEach(match => {
      const [, propName, propType] = match;
      properties[propName] = {
        type: propType.replace(/['"`]/g, ''),
        optional: true
      };
    });

    return properties;
  }

  analyzeRelationships(schemas) {
    const relationships = [];

    Object.values(schemas).forEach(schema => {
      Object.entries(schema.properties).forEach(([propName, propDef]) => {
        const propType = typeof propDef === 'string' ? propDef : propDef.type;
        
        // Check if this property references another model
        if (schemas[propType]) {
          relationships.push({
            from: schema.name,
            to: propType,
            property: propName,
            type: 'one-to-one'
          });
        } else if (propType.includes('[]') || propType.includes('list')) {
          const referencedType = propType.replace(/[\[\]]/g, '').replace('list<', '').replace('>', '');
          if (schemas[referencedType]) {
            relationships.push({
              from: schema.name,
              to: referencedType,
              property: propName,
              type: 'one-to-many'
            });
          }
        }
      });
    });

    return relationships;
  }

  findDataOperations(codebase) {
    const operations = {
      create: [],
      read: [],
      update: [],
      delete: []
    };

    const operationPatterns = {
      create: [
        /realm\.create\s*\(\s*['"`](\w+)['"`]/g,
        /new\s+(\w+)\s*\(/g
      ],
      read: [
        /realm\.objects\s*\(\s*['"`](\w+)['"`]/g,
        /realm\.objectForPrimaryKey\s*\(\s*['"`](\w+)['"`]/g
      ],
      update: [
        /realm\.create\s*\(\s*['"`](\w+)['"`].*true/g,
        /\.update\s*\(/g
      ],
      delete: [
        /realm\.delete\s*\(/g,
        /\.deleteRealmIfMigrationNeeded/g
      ]
    };

    function scanDirectory(dir) {
      if (!fs.existsSync(dir)) return;
      
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
          scanDirectory(filePath);
        } else if (file.endsWith('.js') || file.endsWith('.ts')) {
          const content = fs.readFileSync(filePath, 'utf8');
          
          Object.entries(operationPatterns).forEach(([opType, patterns]) => {
            patterns.forEach(pattern => {
              const matches = [...content.matchAll(pattern)];
              matches.forEach(match => {
                operations[opType].push({
                  file: filePath,
                  operation: match[0],
                  model: match[1] || 'unknown'
                });
              });
            });
          });
        }
      });
    }

    scanDirectory(codebase);
    return operations;
  }

  generateSeedData(schemas) {
    const seedData = {};

    Object.entries(schemas).forEach(([modelName, schema]) => {
      seedData[modelName] = this.generateSampleData(schema);
    });

    return seedData;
  }

  generateSampleData(schema) {
    const sampleData = [];
    const dataCount = 5; // Generate 5 sample records

    for (let i = 0; i < dataCount; i++) {
      const record = {};
      
      Object.entries(schema.properties).forEach(([propName, propDef]) => {
        const propType = typeof propDef === 'string' ? propDef : propDef.type;
        record[propName] = this.generateSampleValue(propType, propName, i);
      });

      // Set primary key if exists
      if (schema.primaryKey && record[schema.primaryKey]) {
        record[schema.primaryKey] = `${schema.name.toLowerCase()}_${i + 1}`;
      }

      sampleData.push(record);
    }

    return sampleData;
  }

  generateSampleValue(type, propName, index) {
    const lowerPropName = propName.toLowerCase();
    
    switch (type.toLowerCase()) {
      case 'string':
        if (lowerPropName.includes('id')) return `id_${index + 1}`;
        if (lowerPropName.includes('name')) return `Sample ${propName} ${index + 1}`;
        if (lowerPropName.includes('email')) return `user${index + 1}@example.com`;
        if (lowerPropName.includes('phone')) return `+1234567890${index}`;
        return `Sample ${propName} ${index + 1}`;
      
      case 'int':
      case 'integer':
      case 'number':
        if (lowerPropName.includes('price') || lowerPropName.includes('amount')) {
          return parseFloat((Math.random() * 100).toFixed(2));
        }
        return index + 1;
      
      case 'bool':
      case 'boolean':
        return index % 2 === 0;
      
      case 'date':
        return new Date(Date.now() - Math.random() * 10000000000);
      
      case 'float':
      case 'double':
        return parseFloat((Math.random() * 100).toFixed(2));
      
      default:
        return `Sample ${type} ${index + 1}`;
    }
  }
}

module.exports = RealmAnalyzer;