const fs = require('fs');
const path = require('path');

class WebSocketGenerator {
  constructor() {
    this.templates = {
      server: this.getWebSocketServerTemplate(),
      service: this.getServiceTemplate(),
      events: this.getEventsTemplate(),
      client: this.getClientTemplate()
    };
  }

  generate(analysis) {
    const { services, events, flows, connections, namespaces } = analysis;
    
    const servers = this.generateServers(services, events, namespaces);
    const eventHandlers = this.generateEventHandlers(events);
    const clientMocks = this.generateClientMocks(connections, events);
    const flowHandlers = this.generateFlowHandlers(flows);

    return {
      files: [
        // Main WebSocket server
        {
          path: 'websocket/pos-websocket-server.js',
          content: this.renderTemplate('server', {
            services,
            namespaces,
            events: Object.keys(events)
          })
        },
        // Individual service servers
        ...servers.map(server => ({
          path: `websocket/services/${server.name}-service.js`,
          content: this.renderTemplate('service', server)
        })),
        // Event handlers
        {
          path: 'websocket/event-handlers.js',
          content: this.renderTemplate('events', {
            events: eventHandlers,
            flows: flowHandlers
          })
        },
        // Client mocks
        {
          path: 'websocket/client-mocks.js',
          content: this.renderTemplate('client', {
            connections: clientMocks,
            events: Object.keys(events)
          })
        }
      ]
    };
  }

  generateServers(services, events, namespaces) {
    return services.map(serviceName => {
      const serviceEvents = this.getEventsForService(serviceName, events);
      const namespace = this.getNamespaceForService(serviceName, namespaces);
      
      return {
        name: serviceName,
        namespace: namespace || `/${serviceName}`,
        events: serviceEvents,
        handlers: this.generateHandlersForService(serviceName, serviceEvents),
        rooms: this.generateRoomsForService(serviceName),
        middleware: this.generateMiddlewareForService(serviceName)
      };
    });
  }

  getEventsForService(serviceName, events) {
    const serviceEvents = {};
    
    Object.entries(events).forEach(([eventName, eventSchema]) => {
      if (this.eventBelongsToService(eventName, serviceName)) {
        serviceEvents[eventName] = eventSchema;
      }
    });

    // Add default events if none found
    if (Object.keys(serviceEvents).length === 0) {
      serviceEvents[`${serviceName}_update`] = {
        name: `${serviceName}_update`,
        category: 'system',
        payload: { data: 'object', timestamp: 'date' }
      };
    }

    return serviceEvents;
  }

  eventBelongsToService(eventName, serviceName) {
    const lowerEventName = eventName.toLowerCase();
    const lowerServiceName = serviceName.toLowerCase();
    
    // Direct service name match
    if (lowerEventName.includes(lowerServiceName)) {
      return true;
    }

    // Service-specific patterns
    const servicePatterns = {
      mrs: ['register', 'sync', 'multi'],
      kds: ['kitchen', 'order', 'cook'],
      ncs: ['customer', 'display', 'screen'],
      cfd: ['display', 'cashier', 'front'],
      payment: ['payment', 'transaction', 'card'],
      inventory: ['inventory', 'stock', 'product']
    };

    const patterns = servicePatterns[lowerServiceName] || [];
    return patterns.some(pattern => lowerEventName.includes(pattern));
  }

  getNamespaceForService(serviceName, namespaces) {
    return namespaces.find(ns => ns.includes(serviceName)) || `/${serviceName}`;
  }

  generateHandlersForService(serviceName, serviceEvents) {
    const handlers = {};
    
    Object.entries(serviceEvents).forEach(([eventName, eventSchema]) => {
      handlers[eventName] = this.generateEventHandler(eventName, eventSchema, serviceName);
    });

    // Add connection handlers
    handlers.connection = this.generateConnectionHandler(serviceName);
    handlers.disconnect = this.generateDisconnectHandler(serviceName);

    return handlers;
  }

  generateEventHandler(eventName, eventSchema, serviceName) {
    const handlerCode = `
    handle${this.toPascalCase(eventName)}(socket, data) {
      console.log('${serviceName}: Received ${eventName}', data);
      
      // Validate payload
      if (!this.validatePayload(data, ${JSON.stringify(eventSchema.payload)})) {
        socket.emit('error', { message: 'Invalid payload for ${eventName}' });
        return;
      }
      
      // Process event
      const processedData = this.process${this.toPascalCase(eventName)}(data);
      
      // Broadcast to relevant clients
      this.broadcast${this.toPascalCase(eventName)}(socket, processedData);
      
      // Acknowledge receipt
      socket.emit('${eventName}_ack', { 
        status: 'received',
        timestamp: new Date().toISOString(),
        data: processedData
      });
    }`;

    return handlerCode;
  }

  generateConnectionHandler(serviceName) {
    return `
    handleConnection(socket) {
      console.log('${serviceName}: Client connected', socket.id);
      
      // Join service room
      socket.join('${serviceName}');
      
      // Send service info
      socket.emit('service_info', {
        service: '${serviceName}',
        version: '1.0.0',
        capabilities: this.getServiceCapabilities(),
        timestamp: new Date().toISOString()
      });
      
      // Track connection
      this.connections.set(socket.id, {
        socket,
        service: '${serviceName}',
        connectedAt: new Date(),
        lastActivity: new Date()
      });
    }`;
  }

  generateDisconnectHandler(serviceName) {
    return `
    handleDisconnect(socket) {
      console.log('${serviceName}: Client disconnected', socket.id);
      
      // Remove from tracking
      this.connections.delete(socket.id);
      
      // Leave all rooms
      socket.leaveAll();
      
      // Notify other clients if needed
      socket.to('${serviceName}').emit('client_disconnected', {
        clientId: socket.id,
        timestamp: new Date().toISOString()
      });
    }`;
  }

  generateRoomsForService(serviceName) {
    const commonRooms = {
      mrs: ['store_{storeId}', 'register_{registerId}'],
      kds: ['kitchen_{kitchenId}', 'station_{stationId}'],
      ncs: ['display_{displayId}', 'customer_{customerId}'],
      cfd: ['cashier_{cashierId}', 'front_{frontId}'],
      payment: ['terminal_{terminalId}', 'gateway_{gatewayId}'],
      inventory: ['warehouse_{warehouseId}', 'store_{storeId}']
    };

    return commonRooms[serviceName] || [`${serviceName}_default`];
  }

  generateMiddlewareForService(serviceName) {
    return `
    setupMiddleware(io) {
      // Authentication middleware
      io.use((socket, next) => {
        const token = socket.handshake.auth.token || socket.handshake.query.token;
        if (this.validateToken(token)) {
          socket.userId = this.getUserFromToken(token);
          next();
        } else {
          next(new Error('Authentication failed'));
        }
      });
      
      // Rate limiting
      io.use((socket, next) => {
        if (this.checkRateLimit(socket.userId)) {
          next();
        } else {
          next(new Error('Rate limit exceeded'));
        }
      });
      
      // Service-specific middleware for ${serviceName}
      io.use((socket, next) => {
        socket.service = '${serviceName}';
        socket.capabilities = this.getServiceCapabilities();
        next();
      });
    }`;
  }

  generateEventHandlers(events) {
    const handlers = {};
    
    Object.entries(events).forEach(([eventName, eventSchema]) => {
      handlers[eventName] = {
        validator: this.generateEventValidator(eventSchema),
        processor: this.generateEventProcessor(eventSchema),
        broadcaster: this.generateEventBroadcaster(eventSchema)
      };
    });

    return handlers;
  }

  generateEventValidator(eventSchema) {
    return `
    validate${this.toPascalCase(eventSchema.name)}(data) {
      const schema = ${JSON.stringify(eventSchema.payload, null, 2)};
      
      for (const [field, type] of Object.entries(schema)) {
        if (!(field in data)) {
          return { valid: false, error: \`Missing required field: \${field}\` };
        }
        
        if (!this.validateType(data[field], type)) {
          return { valid: false, error: \`Invalid type for \${field}: expected \${type}\` };
        }
      }
      
      return { valid: true };
    }`;
  }

  generateEventProcessor(eventSchema) {
    const category = eventSchema.category || 'system';
    
    const processors = {
      transaction: `
        // Transaction processing
        const processedData = {
          ...data,
          processedAt: new Date().toISOString(),
          status: data.status || 'processing',
          transactionNumber: this.generateTransactionNumber()
        };
        
        // Update transaction state
        this.stateManager.updateTransaction(data.transactionId, processedData);
        
        return processedData;`,
      
      inventory: `
        // Inventory processing
        const processedData = {
          ...data,
          processedAt: new Date().toISOString(),
          previousQuantity: this.stateManager.getProductQuantity(data.productId),
          newQuantity: data.quantity
        };
        
        // Update inventory
        this.stateManager.updateInventory(data.productId, data.quantity);
        
        return processedData;`,
      
      kitchen: `
        // Kitchen order processing
        const processedData = {
          ...data,
          processedAt: new Date().toISOString(),
          estimatedTime: this.calculateEstimatedTime(data.items),
          kitchenStatus: data.status || 'received'
        };
        
        // Update order status
        this.stateManager.updateOrder(data.orderId, processedData);
        
        return processedData;`,
      
      system: `
        // Generic system processing
        const processedData = {
          ...data,
          processedAt: new Date().toISOString(),
          systemStatus: 'processed'
        };
        
        return processedData;`
    };

    return processors[category] || processors.system;
  }

  generateEventBroadcaster(eventSchema) {
    const category = eventSchema.category || 'system';
    
    return `
    broadcast${this.toPascalCase(eventSchema.name)}(socket, data) {
      const broadcastData = {
        event: '${eventSchema.name}',
        data,
        timestamp: new Date().toISOString(),
        source: socket.id
      };
      
      // Broadcast to relevant rooms based on category
      ${this.getBroadcastLogic(category)}
    }`;
  }

  getBroadcastLogic(category) {
    const logics = {
      transaction: `
        // Broadcast to store and register rooms
        if (data.storeId) {
          socket.to(\`store_\${data.storeId}\`).emit('${category}_update', broadcastData);
        }
        if (data.registerId) {
          socket.to(\`register_\${data.registerId}\`).emit('${category}_update', broadcastData);
        }`,
      
      inventory: `
        // Broadcast to store and warehouse rooms
        if (data.storeId) {
          socket.to(\`store_\${data.storeId}\`).emit('${category}_update', broadcastData);
        }
        socket.to('inventory_managers').emit('${category}_update', broadcastData);`,
      
      kitchen: `
        // Broadcast to kitchen and display rooms
        if (data.kitchenId) {
          socket.to(\`kitchen_\${data.kitchenId}\`).emit('${category}_update', broadcastData);
        }
        socket.to('kitchen_displays').emit('${category}_update', broadcastData);`,
      
      system: `
        // Broadcast to all connected clients
        socket.broadcast.emit('${category}_update', broadcastData);`
    };

    return logics[category] || logics.system;
  }

  generateFlowHandlers(flows) {
    const flowHandlers = {};
    
    flows.forEach(flow => {
      flowHandlers[flow.name] = this.generateFlowHandler(flow);
    });

    return flowHandlers;
  }

  generateFlowHandler(flow) {
    return `
    handle${this.toPascalCase(flow.name)}(socket, initialData) {
      const flowId = this.generateFlowId();
      const flowState = {
        id: flowId,
        name: '${flow.name}',
        currentStep: 0,
        steps: ${JSON.stringify(flow.events)},
        data: initialData,
        startedAt: new Date().toISOString(),
        status: 'started'
      };
      
      // Store flow state
      this.flowStates.set(flowId, flowState);
      
      // Start the flow
      this.executeFlowStep(socket, flowState);
      
      return flowId;
    }
    
    executeFlowStep(socket, flowState) {
      if (flowState.currentStep >= flowState.steps.length) {
        // Flow completed
        flowState.status = 'completed';
        flowState.completedAt = new Date().toISOString();
        socket.emit('flow_completed', { flowId: flowState.id, data: flowState.data });
        return;
      }
      
      const currentStep = flowState.steps[flowState.currentStep];
      socket.emit('flow_step', {
        flowId: flowState.id,
        step: currentStep,
        stepIndex: flowState.currentStep,
        totalSteps: flowState.steps.length
      });
    }`;
  }

  generateClientMocks(connections, events) {
    return connections.map(connection => ({
      url: connection.url,
      type: connection.type,
      namespace: connection.namespace,
      mockImplementation: this.generateClientMock(connection, events)
    }));
  }

  generateClientMock(connection, events) {
    return `
    // Mock client for ${connection.url}
    class Mock${this.toPascalCase(connection.type)}Client {
      constructor(url = '${connection.url}') {
        this.url = url;
        this.connected = false;
        this.events = new Map();
        this.messageQueue = [];
      }
      
      connect() {
        return new Promise((resolve) => {
          setTimeout(() => {
            this.connected = true;
            this.emit('connect');
            resolve();
          }, 100);
        });
      }
      
      disconnect() {
        this.connected = false;
        this.emit('disconnect');
      }
      
      emit(event, data) {
        if (this.events.has(event)) {
          this.events.get(event).forEach(handler => {
            setTimeout(() => handler(data), 0);
          });
        }
      }
      
      on(event, handler) {
        if (!this.events.has(event)) {
          this.events.set(event, []);
        }
        this.events.get(event).push(handler);
      }
      
      send(event, data) {
        if (!this.connected) {
          this.messageQueue.push({ event, data });
          return;
        }
        
        // Simulate server response
        this.simulateResponse(event, data);
      }
      
      simulateResponse(event, data) {
        // Simulate various responses based on event
        setTimeout(() => {
          this.emit(\`\${event}_ack\`, { 
            status: 'received', 
            timestamp: new Date().toISOString() 
          });
        }, Math.random() * 100);
      }
    }`;
  }

  toPascalCase(str) {
    return str.replace(/(?:^|_)([a-z])/g, (match, letter) => letter.toUpperCase());
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

  getWebSocketServerTemplate() {
    return `
const { Server } = require('socket.io');
const http = require('http');

class POSWebSocketServer {
  constructor(options = {}) {
    this.port = options.port || 3001;
    this.cors = options.cors || { origin: "*" };
    this.services = {{services}};
    this.namespaces = {{namespaces}};
    
    this.server = http.createServer();
    this.io = new Server(this.server, {
      cors: this.cors,
      transports: ['websocket', 'polling']
    });
    
    this.connections = new Map();
    this.flowStates = new Map();
    this.stateManager = null;
    
    this.setupNamespaces();
    this.setupMiddleware();
  }
  
  setStateManager(stateManager) {
    this.stateManager = stateManager;
  }
  
  setupNamespaces() {
    // Setup main namespace
    this.setupMainNamespace();
    
    // Setup service namespaces
    this.namespaces.forEach(namespace => {
      this.setupServiceNamespace(namespace);
    });
  }
  
  setupMainNamespace() {
    this.io.on('connection', (socket) => {
      console.log('Client connected to main namespace:', socket.id);
      
      socket.on('disconnect', () => {
        console.log('Client disconnected from main namespace:', socket.id);
        this.connections.delete(socket.id);
      });
      
      // Handle ping/pong for connection monitoring
      socket.on('ping', () => {
        socket.emit('pong', { timestamp: new Date().toISOString() });
      });
    });
  }
  
  setupServiceNamespace(namespace) {
    const nsp = this.io.of(namespace);
    const serviceName = namespace.replace('/', '');
    
    nsp.on('connection', (socket) => {
      console.log(\`Client connected to \${namespace}:\`, socket.id);
      
      // Join service room
      socket.join(serviceName);
      
      // Setup service-specific event handlers
      this.setupServiceEventHandlers(socket, serviceName);
      
      socket.on('disconnect', () => {
        console.log(\`Client disconnected from \${namespace}:\`, socket.id);
      });
    });
  }
  
  setupServiceEventHandlers(socket, serviceName) {
    // Load service-specific handlers
    try {
      const ServiceClass = require(\`./services/\${serviceName}-service\`);
      const serviceInstance = new ServiceClass(this.stateManager);
      
      // Bind event handlers
      serviceInstance.bindEventHandlers(socket);
    } catch (error) {
      console.warn(\`No service class found for \${serviceName}:\`, error.message);
    }
  }
  
  setupMiddleware() {
    this.io.use((socket, next) => {
      // Basic authentication
      const token = socket.handshake.auth.token;
      if (this.validateToken(token)) {
        next();
      } else {
        next(new Error('Authentication failed'));
      }
    });
  }
  
  validateToken(token) {
    // Simple token validation for mock server
    return token === 'mock-token' || !token; // Allow no token for development
  }
  
  broadcast(event, data, room = null) {
    if (room) {
      this.io.to(room).emit(event, data);
    } else {
      this.io.emit(event, data);
    }
  }
  
  getConnectedClients() {
    return Array.from(this.connections.values());
  }
  
  getStats() {
    return {
      totalConnections: this.connections.size,
      namespaces: this.namespaces.length,
      uptime: process.uptime()
    };
  }
  
  start() {
    return new Promise((resolve) => {
      this.server.listen(this.port, () => {
        console.log(\`POS WebSocket Server running on port \${this.port}\`);
        resolve();
      });
    });
  }
  
  stop() {
    return new Promise((resolve) => {
      this.server.close(() => {
        console.log('POS WebSocket Server stopped');
        resolve();
      });
    });
  }
}

module.exports = POSWebSocketServer;
`;
  }

  getServiceTemplate() {
    return `
class {{name}}Service {
  constructor(stateManager) {
    this.stateManager = stateManager;
    this.serviceName = '{{name}}';
    this.namespace = '{{namespace}}';
    this.events = {{events}};
    this.connections = new Map();
  }
  
  bindEventHandlers(socket) {
    // Connection handling
    this.handleConnection(socket);
    
    // Event handlers
    {{#each handlers}}
    socket.on('{{@key}}', (data) => {
      this.{{@key}}(socket, data);
    });
    {{/each}}
    
    // Disconnect handling
    socket.on('disconnect', () => {
      this.handleDisconnect(socket);
    });
  }
  
  {{handlers}}
  
  validatePayload(data, schema) {
    // Simple payload validation
    for (const [field, type] of Object.entries(schema)) {
      if (!(field in data)) {
        return false;
      }
    }
    return true;
  }
  
  validateToken(token) {
    return token === 'mock-token' || !token;
  }
  
  getUserFromToken(token) {
    return { id: 'mock-user', name: 'Mock User' };
  }
  
  checkRateLimit(userId) {
    // Simple rate limiting - always allow for mock
    return true;
  }
  
  getServiceCapabilities() {
    return Object.keys(this.events);
  }
  
  generateTransactionNumber() {
    return 'TXN_' + Date.now();
  }
  
  calculateEstimatedTime(items) {
    return items.length * 5; // 5 minutes per item
  }
  
  generateFlowId() {
    return 'FLOW_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}

module.exports = {{name}}Service;
`;
  }

  getEventsTemplate() {
    return `
const EventEmitter = require('events');

class POSEventHandlers extends EventEmitter {
  constructor(stateManager) {
    super();
    this.stateManager = stateManager;
    this.events = {{events}};
    this.flows = {{flows}};
  }
  
  validateType(value, type) {
    switch (type) {
      case 'string': return typeof value === 'string';
      case 'number': return typeof value === 'number';
      case 'boolean': return typeof value === 'boolean';
      case 'object': return typeof value === 'object' && value !== null;
      case 'array': return Array.isArray(value);
      case 'date': return value instanceof Date || !isNaN(Date.parse(value));
      default: return true;
    }
  }
  
  // Event validation methods
  {{#each events}}
  {{this.validator}}
  {{/each}}
  
  // Event processing methods
  {{#each events}}
  process{{toPascalCase @key}}(data) {
    {{this.processor}}
  }
  {{/each}}
  
  // Event broadcasting methods
  {{#each events}}
  {{this.broadcaster}}
  {{/each}}
  
  // Flow handling methods
  {{#each flows}}
  {{this}}
  {{/each}}
}

module.exports = POSEventHandlers;
`;
  }

  getClientTemplate() {
    return `
// WebSocket client mocks for testing
{{#each connections}}
{{this.mockImplementation}}
{{/each}}

class POSWebSocketClientFactory {
  static createClient(type, url) {
    switch (type) {
      case 'socket.io':
        return new MockSocketIOClient(url);
      case 'websocket':
        return new MockWebSocketClient(url);
      default:
        throw new Error(\`Unknown client type: \${type}\`);
    }
  }
}

module.exports = {
  POSWebSocketClientFactory,
  {{#each connections}}
  Mock{{toPascalCase this.type}}Client,
  {{/each}}
};
`;
  }
}

module.exports = WebSocketGenerator;