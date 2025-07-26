const fs = require('fs');
const path = require('path');

class WebSocketAnalyzer {
  constructor() {
    this.socketPatterns = {
      socketIO: [
        /socket\.emit\s*\(\s*['"`]([^'"`]+)['"`]/g,
        /socket\.on\s*\(\s*['"`]([^'"`]+)['"`]/g,
        /io\.emit\s*\(\s*['"`]([^'"`]+)['"`]/g,
        /io\.to\s*\([^)]+\)\.emit\s*\(\s*['"`]([^'"`]+)['"`]/g
      ],
      websocket: [
        /ws\.send\s*\(/g,
        /WebSocket\s*\(/g,
        /addEventListener\s*\(\s*['"`]message['"`]/g
      ]
    };
    
    this.posServices = ['mrs', 'kds', 'ncs', 'cfd', 'payment', 'inventory'];
    this.eventCategories = {
      transaction: ['transaction_start', 'transaction_complete', 'payment_processed'],
      inventory: ['inventory_update', 'product_sync', 'stock_change'],
      kitchen: ['order_received', 'order_ready', 'order_cancelled'],
      display: ['display_update', 'customer_display', 'staff_notification'],
      system: ['sync_status', 'connection_status', 'error_notification']
    };
  }

  analyze(codebase) {
    const wsFiles = this.findWebSocketFiles(codebase);
    const events = this.extractEvents(wsFiles);
    const eventSchemas = this.analyzeEventPayloads(events);
    const flows = this.mapEventFlows(events);
    const services = this.identifyServices(events);

    return {
      services: services.length > 0 ? services : this.posServices,
      events: eventSchemas,
      flows,
      connections: this.analyzeConnections(wsFiles),
      namespaces: this.extractNamespaces(wsFiles)
    };
  }

  findWebSocketFiles(codebase) {
    const wsFiles = [];
    
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
          if (this.containsWebSocketCode(content)) {
            wsFiles.push({
              path: filePath,
              content,
              name: file
            });
          }
        }
      });
    }

    scanDirectory(codebase);
    return wsFiles;
  }

  containsWebSocketCode(content) {
    const wsKeywords = [
      'socket.io', 'Socket.IO', 'socketio',
      'WebSocket', 'ws://', 'wss://',
      'socket.emit', 'socket.on',
      'io.connect', 'io.emit'
    ];
    
    return wsKeywords.some(keyword => content.includes(keyword));
  }

  extractEvents(wsFiles) {
    const events = new Set();
    
    wsFiles.forEach(file => {
      // Extract Socket.IO events
      Object.values(this.socketPatterns.socketIO).forEach(pattern => {
        const matches = [...file.content.matchAll(pattern)];
        matches.forEach(match => {
          if (match[1]) {
            events.add(match[1]);
          }
        });
      });

      // Extract custom event names from strings
      const customEventMatches = [...file.content.matchAll(/['"`]([a-zA-Z_][a-zA-Z0-9_]*(?::[a-zA-Z0-9_]*)?(?:\.[a-zA-Z0-9_]*)?(?:_[a-zA-Z0-9_]*)?)['"`]/g)];
      customEventMatches.forEach(match => {
        const eventName = match[1];
        if (this.looksLikeEvent(eventName)) {
          events.add(eventName);
        }
      });
    });

    return Array.from(events);
  }

  looksLikeEvent(eventName) {
    // Check if string looks like an event name
    const eventIndicators = [
      '_update', '_complete', '_start', '_end', '_change',
      '_received', '_sent', '_ready', '_cancelled', '_failed',
      '_sync', '_status', '_notification', '_alert',
      'transaction', 'payment', 'order', 'inventory', 'display'
    ];
    
    const lowercaseName = eventName.toLowerCase();
    return eventIndicators.some(indicator => lowercaseName.includes(indicator)) ||
           eventName.includes(':') || eventName.includes('.') ||
           (eventName.includes('_') && eventName.length > 3);
  }

  analyzeEventPayloads(events) {
    const eventSchemas = {};
    
    events.forEach(eventName => {
      eventSchemas[eventName] = this.generateEventSchema(eventName);
    });

    return eventSchemas;
  }

  generateEventSchema(eventName) {
    const lowercaseName = eventName.toLowerCase();
    const schema = {
      name: eventName,
      category: this.categorizeEvent(eventName),
      payload: {},
      timestamp: true,
      source: 'pos-system'
    };

    // Generate payload based on event name patterns
    if (lowercaseName.includes('transaction')) {
      schema.payload = {
        transactionId: 'string',
        storeId: 'string',
        amount: 'number',
        items: 'array',
        paymentMethod: 'string',
        status: 'string'
      };
    } else if (lowercaseName.includes('inventory')) {
      schema.payload = {
        productId: 'string',
        sku: 'string',
        quantity: 'number',
        storeId: 'string',
        action: 'string'
      };
    } else if (lowercaseName.includes('order')) {
      schema.payload = {
        orderId: 'string',
        items: 'array',
        status: 'string',
        kitchen: 'string',
        timestamp: 'date'
      };
    } else if (lowercaseName.includes('payment')) {
      schema.payload = {
        paymentId: 'string',
        transactionId: 'string',
        amount: 'number',
        method: 'string',
        status: 'string',
        gateway: 'string'
      };
    } else if (lowercaseName.includes('display')) {
      schema.payload = {
        displayId: 'string',
        content: 'object',
        type: 'string',
        duration: 'number'
      };
    } else if (lowercaseName.includes('sync')) {
      schema.payload = {
        entityType: 'string',
        entityId: 'string',
        data: 'object',
        version: 'number',
        timestamp: 'date'
      };
    } else {
      // Generic payload
      schema.payload = {
        id: 'string',
        data: 'object',
        status: 'string'
      };
    }

    return schema;
  }

  categorizeEvent(eventName) {
    const lowercaseName = eventName.toLowerCase();
    
    for (const [category, eventList] of Object.entries(this.eventCategories)) {
      if (eventList.some(event => lowercaseName.includes(event.split('_')[0]))) {
        return category;
      }
    }

    // Fallback categorization
    if (lowercaseName.includes('transaction') || lowercaseName.includes('payment')) {
      return 'transaction';
    } else if (lowercaseName.includes('inventory') || lowercaseName.includes('stock')) {
      return 'inventory';
    } else if (lowercaseName.includes('order') || lowercaseName.includes('kitchen')) {
      return 'kitchen';
    } else if (lowercaseName.includes('display') || lowercaseName.includes('screen')) {
      return 'display';
    } else {
      return 'system';
    }
  }

  mapEventFlows(events) {
    const flows = [];
    
    // Common POS event flows
    const posFlows = [
      {
        name: 'Transaction Flow',
        events: [
          'transaction_start',
          'items_scanned',
          'payment_initiated',
          'payment_processed',
          'receipt_printed',
          'transaction_complete'
        ]
      },
      {
        name: 'Kitchen Order Flow',
        events: [
          'order_received',
          'order_preparation_start',
          'order_ready',
          'order_served'
        ]
      },
      {
        name: 'Inventory Sync Flow',
        events: [
          'inventory_update_request',
          'inventory_data_sync',
          'inventory_update_complete'
        ]
      },
      {
        name: 'Multi-Register Sync',
        events: [
          'register_event',
          'mrs_broadcast',
          'register_sync_update'
        ]
      }
    ];

    // Add flows that exist in the extracted events
    posFlows.forEach(flow => {
      const existingEvents = flow.events.filter(event => 
        events.some(extractedEvent => 
          extractedEvent.toLowerCase().includes(event.toLowerCase()) ||
          event.toLowerCase().includes(extractedEvent.toLowerCase())
        )
      );
      
      if (existingEvents.length > 0) {
        flows.push({
          ...flow,
          existingEvents,
          coverage: (existingEvents.length / flow.events.length * 100).toFixed(1) + '%'
        });
      }
    });

    return flows;
  }

  identifyServices(events) {
    const services = new Set();
    
    events.forEach(event => {
      const lowercaseEvent = event.toLowerCase();
      
      // Check for service-specific patterns
      if (lowercaseEvent.includes('mrs') || lowercaseEvent.includes('register')) {
        services.add('mrs');
      }
      if (lowercaseEvent.includes('kds') || lowercaseEvent.includes('kitchen')) {
        services.add('kds');
      }
      if (lowercaseEvent.includes('ncs') || lowercaseEvent.includes('customer')) {
        services.add('ncs');
      }
      if (lowercaseEvent.includes('cfd') || lowercaseEvent.includes('display')) {
        services.add('cfd');
      }
      if (lowercaseEvent.includes('payment') || lowercaseEvent.includes('gateway')) {
        services.add('payment');
      }
      if (lowercaseEvent.includes('inventory') || lowercaseEvent.includes('stock')) {
        services.add('inventory');
      }
    });

    return Array.from(services);
  }

  analyzeConnections(wsFiles) {
    const connections = [];
    
    wsFiles.forEach(file => {
      // Extract connection URLs
      const urlMatches = [...file.content.matchAll(/(?:ws:\/\/|wss:\/\/|socket\.io\()([^'"`\s)]+)/g)];
      urlMatches.forEach(match => {
        connections.push({
          url: match[1],
          file: file.path,
          type: match[0].includes('socket.io') ? 'socket.io' : 'websocket'
        });
      });

      // Extract namespace connections
      const namespaceMatches = [...file.content.matchAll(/io\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g)];
      namespaceMatches.forEach(match => {
        connections.push({
          url: match[1],
          file: file.path,
          type: 'socket.io',
          namespace: true
        });
      });
    });

    return connections;
  }

  extractNamespaces(wsFiles) {
    const namespaces = new Set();
    
    wsFiles.forEach(file => {
      // Extract Socket.IO namespaces
      const namespaceMatches = [...file.content.matchAll(/io\.of\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g)];
      namespaceMatches.forEach(match => {
        namespaces.add(match[1]);
      });

      // Extract namespace from connection strings
      const connectionMatches = [...file.content.matchAll(/['"`]([^'"`]*\/[^'"`]+)['"`]/g)];
      connectionMatches.forEach(match => {
        const path = match[1];
        if (path.startsWith('/') && path.length > 1) {
          namespaces.add(path);
        }
      });
    });

    // Add common POS namespaces if none found
    if (namespaces.size === 0) {
      ['/mrs', '/kds', '/ncs', '/cfd', '/payment'].forEach(ns => namespaces.add(ns));
    }

    return Array.from(namespaces);
  }
}

module.exports = WebSocketAnalyzer;