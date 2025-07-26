const fs = require('fs');
const path = require('path');

class HardwareGenerator {
  constructor() {
    this.templates = {
      simulator: this.getSimulatorTemplate(),
      manager: this.getManagerTemplate(),
      events: this.getEventsTemplate(),
      config: this.getConfigTemplate()
    };
  }

  generate(analysis) {
    const { devices, operations, configurations, events, simulators } = analysis;
    
    const simulatorFiles = this.generateSimulators(simulators);
    const managerFile = this.generateHardwareManager(devices, simulators);
    const eventsFile = this.generateEventSystem(events);
    const configFile = this.generateConfiguration(configurations, devices);

    return {
      files: [
        // Hardware manager
        {
          path: 'hardware/hardware-manager.js',
          content: managerFile
        },
        // Individual device simulators
        ...simulatorFiles.map(sim => ({
          path: `hardware/simulators/${sim.filename}`,
          content: sim.content
        })),
        // Events system
        {
          path: 'hardware/events.js',
          content: eventsFile
        },
        // Configuration
        {
          path: 'hardware/config.js',
          content: configFile
        }
      ]
    };
  }

  generateSimulators(simulators) {
    return Object.entries(simulators).map(([deviceType, spec]) => {
      return {
        filename: `${deviceType}-simulator.js`,
        content: this.renderTemplate('simulator', {
          deviceType,
          className: this.toPascalCase(deviceType) + 'Simulator',
          methods: spec.methods,
          events: spec.events,
          operations: spec.operations,
          defaultBehavior: spec.defaultBehavior,
          errorSimulation: spec.errorSimulation
        })
      };
    });
  }

  generateHardwareManager(devices, simulators) {
    return this.renderTemplate('manager', {
      devices,
      simulators: Object.keys(simulators),
      simulatorClasses: Object.keys(simulators).map(device => ({
        device,
        className: this.toPascalCase(device) + 'Simulator'
      }))
    });
  }

  generateEventSystem(events) {
    const eventsByDevice = this.groupEventsByDevice(events);
    
    return this.renderTemplate('events', {
      eventsByDevice,
      allEvents: events
    });
  }

  generateConfiguration(configurations, devices) {
    const deviceConfigs = devices.reduce((acc, device) => {
      acc[device] = this.getDefaultDeviceConfig(device);
      return acc;
    }, {});

    return this.renderTemplate('config', {
      deviceConfigs,
      userConfigs: configurations
    });
  }

  groupEventsByDevice(events) {
    const grouped = {};
    
    events.forEach(event => {
      const deviceType = event.deviceType || 'unknown';
      if (!grouped[deviceType]) {
        grouped[deviceType] = [];
      }
      grouped[deviceType].push(event);
    });

    return grouped;
  }

  getDefaultDeviceConfig(deviceType) {
    const configs = {
      printer: {
        baudRate: 9600,
        characterSet: 'UTF-8',
        paperWidth: 80,
        autocut: true,
        cashdrawerPin: 2
      },
      scanner: {
        autoFocus: true,
        flashMode: 'auto',
        scanTimeout: 30000,
        supportedFormats: ['CODE128', 'CODE39', 'EAN13', 'QR_CODE']
      },
      nfc: {
        pollInterval: 500,
        timeout: 10000,
        supportedTypes: ['MIFARE', 'NTAG']
      },
      cashDrawer: {
        pulseWidth: 200,
        pinNumber: 2
      },
      cardReader: {
        timeout: 30000,
        supportedCards: ['VISA', 'MASTERCARD', 'AMEX'],
        encryption: true
      },
      scale: {
        unit: 'kg',
        precision: 2,
        maxWeight: 30,
        autoTare: true
      }
    };

    return configs[deviceType] || {};
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

  getSimulatorTemplate() {
    return `
const EventEmitter = require('events');

class {{className}} extends EventEmitter {
  constructor(config = {}) {
    super();
    this.deviceType = '{{deviceType}}';
    this.config = {
      ...this.getDefaultConfig(),
      ...config
    };
    
    this.connected = false;
    this.state = this.getInitialState();
    this.errorSimulation = {{errorSimulation}};
    this.defaultBehavior = {{defaultBehavior}};
    
    this.setupErrorSimulation();
  }
  
  getDefaultConfig() {
    return {
      autoConnect: true,
      errorRate: 0.05,
      responseDelay: { min: 100, max: 1000 }
    };
  }
  
  getInitialState() {
    const initialStates = {
      printer: {
        paperLevel: 100,
        coverOpen: false,
        online: true,
        temperature: 'normal'
      },
      scanner: {
        scanning: false,
        torchOn: false,
        autoFocus: true
      },
      nfc: {
        enabled: false,
        tagPresent: false,
        currentTag: null
      },
      cashDrawer: {
        open: false,
        locked: false
      },
      cardReader: {
        ready: true,
        cardPresent: false,
        currentCard: null
      },
      scale: {
        weight: 0,
        stable: true,
        tared: false
      }
    };
    
    return initialStates['{{deviceType}}'] || {};
  }
  
  // Connection methods
  async connect() {
    return new Promise((resolve, reject) => {
      if (this.connected) {
        resolve(true);
        return;
      }
      
      this.simulateDelay().then(() => {
        if (this.shouldSimulateError('connection')) {
          this.emit('connectionError', { message: 'Failed to connect to device' });
          reject(new Error('Connection failed'));
          return;
        }
        
        this.connected = true;
        this.emit('connected');
        console.log(\`{{className}} connected\`);
        resolve(true);
      });
    });
  }
  
  disconnect() {
    this.connected = false;
    this.emit('disconnected');
    console.log(\`{{className}} disconnected\`);
  }
  
  isConnected() {
    return this.connected;
  }
  
  // Device-specific methods
  ${this.generateDeviceMethods()}
  
  // Error simulation
  setupErrorSimulation() {
    if (this.config.errorRate > 0) {
      setInterval(() => {
        if (Math.random() < this.config.errorRate / 100) {
          this.simulateRandomError();
        }
      }, 10000); // Check every 10 seconds
    }
  }
  
  shouldSimulateError(operation) {
    const errorConfig = this.errorSimulation.find(e => e.type.includes(operation));
    if (errorConfig) {
      return Math.random() < errorConfig.probability;
    }
    return Math.random() < 0.05; // 5% default error rate
  }
  
  simulateRandomError() {
    if (this.errorSimulation.length > 0) {
      const randomError = this.errorSimulation[
        Math.floor(Math.random() * this.errorSimulation.length)
      ];
      this.emit('error', {
        type: randomError.type,
        message: this.getErrorMessage(randomError.type),
        timestamp: new Date().toISOString()
      });
    }
  }
  
  getErrorMessage(errorType) {
    const messages = {
      paperOut: 'Printer is out of paper',
      coverOpen: 'Printer cover is open',
      connectionLost: 'Connection to device lost',
      barcodeUnreadable: 'Unable to read barcode',
      cameraError: 'Camera malfunction',
      tagNotSupported: 'NFC tag type not supported',
      readError: 'Failed to read NFC tag',
      drawerJammed: 'Cash drawer is jammed',
      cardReadError: 'Unable to read card',
      connectionTimeout: 'Connection timeout',
      calibrationError: 'Scale calibration error',
      weightUnstable: 'Weight reading unstable',
      genericError: 'Generic device error'
    };
    
    return messages[errorType] || 'Unknown error occurred';
  }
  
  // Utility methods
  async simulateDelay() {
    const delay = this.config.responseDelay.min + 
                  Math.random() * (this.config.responseDelay.max - this.config.responseDelay.min);
    return new Promise(resolve => setTimeout(resolve, delay));
  }
  
  updateState(newState) {
    this.state = { ...this.state, ...newState };
    this.emit('stateChanged', this.state);
  }
  
  getState() {
    return { ...this.state };
  }
  
  // Event handlers for external control
  on(event, handler) {
    super.on(event, handler);
    
    // Setup automatic event responses
    if (event === 'externalTrigger') {
      this.setupExternalTriggers(handler);
    }
  }
  
  setupExternalTriggers(handler) {
    // Allow external systems to trigger device events
    this.externalHandler = handler;
  }
  
  triggerExternalEvent(eventType, data = {}) {
    switch (eventType) {
      case 'paperOut':
        this.updateState({ paperLevel: 0 });
        this.emit('paperOut');
        break;
      case 'coverOpen':
        this.updateState({ coverOpen: true });
        this.emit('coverOpen');
        break;
      case 'insertCard':
        this.updateState({ cardPresent: true, currentCard: data });
        this.emit('cardInserted', data);
        break;
      case 'placeItem':
        this.updateState({ weight: data.weight || 1.0 });
        this.emit('weightChanged', { weight: this.state.weight });
        break;
      default:
        console.warn(\`Unknown external event: \${eventType}\`);
    }
  }
}

module.exports = {{className}};
`;
  }

  generateDeviceMethods() {
    return `
  // Generate device-specific methods based on deviceType
  ${this.getDeviceSpecificMethods()}
  
  // Common device methods
  async getStatus() {
    await this.simulateDelay();
    return {
      connected: this.connected,
      state: this.state,
      timestamp: new Date().toISOString()
    };
  }
  
  async reset() {
    await this.simulateDelay();
    this.state = this.getInitialState();
    this.emit('reset');
    return true;
  }`;
  }

  getDeviceSpecificMethods() {
    return `
  // Device-specific methods will be generated based on deviceType
  // This is a placeholder - actual implementation would generate methods based on {{deviceType}}
  
  // Example methods for different device types:
  ${this.getPrinterMethods()}
  ${this.getScannerMethods()}
  ${this.getNFCMethods()}
  ${this.getCashDrawerMethods()}
  ${this.getCardReaderMethods()}
  ${this.getScaleMethods()}`;
  }

  getPrinterMethods() {
    return `
  // Printer methods
  async print(data) {
    if (!this.connected) throw new Error('Printer not connected');
    
    await this.simulateDelay();
    
    if (this.shouldSimulateError('print')) {
      throw new Error('Print failed');
    }
    
    this.emit('printStarted', { data });
    
    // Simulate printing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    this.emit('printComplete', { success: true });
    return { success: true, printId: this.generateId() };
  }
  
  async openCashDrawer() {
    if (!this.connected) throw new Error('Printer not connected');
    
    await this.simulateDelay();
    this.updateState({ drawerOpen: true });
    this.emit('drawerOpened');
    
    // Auto-close after 5 seconds
    setTimeout(() => {
      this.updateState({ drawerOpen: false });
      this.emit('drawerClosed');
    }, 5000);
    
    return { success: true };
  }`;
  }

  getScannerMethods() {
    return `
  // Scanner methods
  async startScanning() {
    if (!this.connected) throw new Error('Scanner not connected');
    
    this.updateState({ scanning: true });
    this.emit('scanStarted');
    
    // Simulate barcode detection after random delay
    setTimeout(() => {
      if (this.state.scanning && !this.shouldSimulateError('scan')) {
        const mockBarcode = this.generateMockBarcode();
        this.emit('barcodeScanned', mockBarcode);
      }
    }, 2000 + Math.random() * 3000);
    
    return { success: true };
  }
  
  stopScanning() {
    this.updateState({ scanning: false });
    this.emit('scanStopped');
    return { success: true };
  }
  
  generateMockBarcode() {
    const types = ['CODE128', 'EAN13', 'QR_CODE'];
    const type = types[Math.floor(Math.random() * types.length)];
    const data = Math.random().toString().substring(2, 15);
    
    return { type, data, timestamp: new Date().toISOString() };
  }`;
  }

  getNFCMethods() {
    return `
  // NFC methods
  async start() {
    if (!this.connected) throw new Error('NFC not connected');
    
    this.updateState({ enabled: true });
    this.emit('nfcEnabled');
    
    // Start polling for tags
    this.startTagPolling();
    
    return { success: true };
  }
  
  stop() {
    this.updateState({ enabled: false, tagPresent: false });
    this.emit('nfcDisabled');
    this.stopTagPolling();
    return { success: true };
  }
  
  startTagPolling() {
    this.pollInterval = setInterval(() => {
      if (this.state.enabled && Math.random() < 0.1) { // 10% chance of tag detection
        const mockTag = this.generateMockTag();
        this.updateState({ tagPresent: true, currentTag: mockTag });
        this.emit('tagDiscovered', mockTag);
      }
    }, 1000);
  }
  
  stopTagPolling() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  }
  
  generateMockTag() {
    return {
      id: Math.random().toString(16).substring(2, 10),
      type: 'MIFARE',
      data: { test: 'data' },
      timestamp: new Date().toISOString()
    };
  }`;
  }

  getCashDrawerMethods() {
    return `
  // Cash Drawer methods
  async open() {
    if (!this.connected) throw new Error('Cash drawer not connected');
    
    await this.simulateDelay();
    
    if (this.shouldSimulateError('open')) {
      throw new Error('Failed to open cash drawer');
    }
    
    this.updateState({ open: true });
    this.emit('drawerOpened');
    
    return { success: true };
  }
  
  close() {
    this.updateState({ open: false });
    this.emit('drawerClosed');
    return { success: true };
  }`;
  }

  getCardReaderMethods() {
    return `
  // Card Reader methods
  async readCard() {
    if (!this.connected) throw new Error('Card reader not connected');
    
    this.emit('waitingForCard');
    
    // Simulate card insertion after delay
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (this.shouldSimulateError('readCard')) {
          reject(new Error('Card read failed'));
          return;
        }
        
        const mockCard = this.generateMockCard();
        this.updateState({ cardPresent: true, currentCard: mockCard });
        this.emit('cardInserted', mockCard);
        resolve(mockCard);
      }, 3000);
    });
  }
  
  generateMockCard() {
    const types = ['VISA', 'MASTERCARD', 'AMEX'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    return {
      type,
      last4: Math.floor(Math.random() * 9999).toString().padStart(4, '0'),
      expiry: '12/25',
      holder: 'TEST CARDHOLDER',
      timestamp: new Date().toISOString()
    };
  }`;
  }

  getScaleMethods() {
    return `
  // Scale methods
  async getWeight() {
    if (!this.connected) throw new Error('Scale not connected');
    
    await this.simulateDelay();
    
    if (this.shouldSimulateError('getWeight')) {
      throw new Error('Weight reading failed');
    }
    
    // Add small random variation to weight
    const variation = (Math.random() - 0.5) * 0.01;
    const weight = Math.max(0, this.state.weight + variation);
    
    this.updateState({ weight });
    
    return {
      weight: parseFloat(weight.toFixed(3)),
      unit: 'kg',
      stable: Math.random() > 0.1, // 90% chance of stable reading
      timestamp: new Date().toISOString()
    };
  }
  
  async tare() {
    if (!this.connected) throw new Error('Scale not connected');
    
    await this.simulateDelay();
    this.updateState({ weight: 0, tared: true });
    this.emit('tared');
    
    return { success: true };
  }
  
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }`;
  }

  getManagerTemplate() {
    return `
const EventEmitter = require('events');

// Import device simulators
{{#each simulatorClasses}}
const {{className}} = require('./simulators/{{device}}-simulator');
{{/each}}

class HardwareManager extends EventEmitter {
  constructor(config = {}) {
    super();
    this.config = config;
    this.devices = new Map();
    this.deviceConfigs = config.devices || {};
    
    this.initializeDevices();
    this.setupGlobalEventHandlers();
  }
  
  initializeDevices() {
    const deviceTypes = {{devices}};
    
    deviceTypes.forEach(deviceType => {
      this.registerDevice(deviceType);
    });
    
    console.log(\`Hardware Manager initialized with \${this.devices.size} devices\`);
  }
  
  registerDevice(deviceType) {
    try {
      const config = this.deviceConfigs[deviceType] || {};
      let device;
      
      switch (deviceType) {
        {{#each simulatorClasses}}
        case '{{device}}':
          device = new {{className}}(config);
          break;
        {{/each}}
        default:
          console.warn(\`Unknown device type: \${deviceType}\`);
          return;
      }
      
      this.devices.set(deviceType, device);
      this.setupDeviceEventHandlers(deviceType, device);
      
      // Auto-connect if configured
      if (config.autoConnect !== false) {
        device.connect().catch(err => {
          console.error(\`Failed to auto-connect \${deviceType}:\`, err.message);
        });
      }
      
    } catch (error) {
      console.error(\`Failed to register device \${deviceType}:\`, error.message);
    }
  }
  
  setupDeviceEventHandlers(deviceType, device) {
    // Forward all device events with device type prefix
    const originalEmit = device.emit.bind(device);
    device.emit = (event, ...args) => {
      originalEmit(event, ...args);
      this.emit(\`\${deviceType}:\${event}\`, ...args);
      this.emit('deviceEvent', { deviceType, event, data: args[0] });
    };
    
    // Handle device errors
    device.on('error', (error) => {
      this.handleDeviceError(deviceType, error);
    });
    
    // Handle state changes
    device.on('stateChanged', (state) => {
      this.emit('deviceStateChanged', { deviceType, state });
    });
  }
  
  setupGlobalEventHandlers() {
    // Handle global device events
    this.on('deviceEvent', (eventData) => {
      console.log(\`Device Event: \${eventData.deviceType}:\${eventData.event}\`, eventData.data);
    });
    
    this.on('deviceError', (errorData) => {
      console.error(\`Device Error: \${errorData.deviceType}\`, errorData.error);
    });
  }
  
  handleDeviceError(deviceType, error) {
    this.emit('deviceError', { deviceType, error, timestamp: new Date().toISOString() });
    
    // Implement error recovery strategies
    if (error.type === 'connectionLost') {
      this.attemptReconnection(deviceType);
    }
  }
  
  async attemptReconnection(deviceType, maxAttempts = 3) {
    const device = this.devices.get(deviceType);
    if (!device) return;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        console.log(\`Attempting to reconnect \${deviceType} (attempt \${attempt}/\${maxAttempts})\`);
        await device.connect();
        console.log(\`Successfully reconnected \${deviceType}\`);
        return;
      } catch (error) {
        console.error(\`Reconnection attempt \${attempt} failed for \${deviceType}:\`, error.message);
        if (attempt < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 2000 * attempt)); // Exponential backoff
        }
      }
    }
    
    console.error(\`Failed to reconnect \${deviceType} after \${maxAttempts} attempts\`);
  }
  
  // Device control methods
  getDevice(deviceType) {
    return this.devices.get(deviceType);
  }
  
  async connectDevice(deviceType) {
    const device = this.devices.get(deviceType);
    if (!device) {
      throw new Error(\`Device \${deviceType} not found\`);
    }
    
    return await device.connect();
  }
  
  disconnectDevice(deviceType) {
    const device = this.devices.get(deviceType);
    if (device) {
      device.disconnect();
    }
  }
  
  async connectAllDevices() {
    const results = {};
    
    for (const [deviceType, device] of this.devices) {
      try {
        await device.connect();
        results[deviceType] = { success: true };
      } catch (error) {
        results[deviceType] = { success: false, error: error.message };
      }
    }
    
    return results;
  }
  
  disconnectAllDevices() {
    for (const [deviceType, device] of this.devices) {
      try {
        device.disconnect();
      } catch (error) {
        console.error(\`Error disconnecting \${deviceType}:\`, error.message);
      }
    }
  }
  
  // Status and monitoring
  getDeviceStatus(deviceType) {
    const device = this.devices.get(deviceType);
    if (!device) {
      return { connected: false, error: 'Device not found' };
    }
    
    return device.getStatus();
  }
  
  getAllDeviceStatuses() {
    const statuses = {};
    
    for (const [deviceType, device] of this.devices) {
      statuses[deviceType] = device.getStatus();
    }
    
    return statuses;
  }
  
  getConnectedDevices() {
    const connected = [];
    
    for (const [deviceType, device] of this.devices) {
      if (device.isConnected()) {
        connected.push(deviceType);
      }
    }
    
    return connected;
  }
  
  // Utility methods
  async resetDevice(deviceType) {
    const device = this.devices.get(deviceType);
    if (!device) {
      throw new Error(\`Device \${deviceType} not found\`);
    }
    
    return await device.reset();
  }
  
  async resetAllDevices() {
    const results = {};
    
    for (const [deviceType, device] of this.devices) {
      try {
        await device.reset();
        results[deviceType] = { success: true };
      } catch (error) {
        results[deviceType] = { success: false, error: error.message };
      }
    }
    
    return results;
  }
  
  // External event triggering (for testing)
  triggerDeviceEvent(deviceType, eventType, data) {
    const device = this.devices.get(deviceType);
    if (device && typeof device.triggerExternalEvent === 'function') {
      device.triggerExternalEvent(eventType, data);
    }
  }
  
  // Configuration management
  updateDeviceConfig(deviceType, newConfig) {
    this.deviceConfigs[deviceType] = {
      ...this.deviceConfigs[deviceType],
      ...newConfig
    };
    
    const device = this.devices.get(deviceType);
    if (device) {
      device.config = { ...device.config, ...newConfig };
    }
  }
  
  getDeviceConfig(deviceType) {
    return this.deviceConfigs[deviceType] || {};
  }
  
  // Cleanup
  destroy() {
    this.disconnectAllDevices();
    this.devices.clear();
    this.removeAllListeners();
  }
}

module.exports = HardwareManager;
`;
  }

  getEventsTemplate() {
    return `
const EventEmitter = require('events');

class HardwareEventSystem extends EventEmitter {
  constructor() {
    super();
    this.eventHistory = [];
    this.eventSubscriptions = new Map();
    this.eventsByDevice = {{eventsByDevice}};
  }
  
  // Event subscription management
  subscribeToDeviceEvents(deviceType, callback) {
    if (!this.eventSubscriptions.has(deviceType)) {
      this.eventSubscriptions.set(deviceType, new Set());
    }
    
    this.eventSubscriptions.get(deviceType).add(callback);
    
    // Return unsubscribe function
    return () => {
      const callbacks = this.eventSubscriptions.get(deviceType);
      if (callbacks) {
        callbacks.delete(callback);
      }
    };
  }
  
  // Event handling
  handleDeviceEvent(deviceType, eventName, data) {
    const eventData = {
      deviceType,
      eventName,
      data,
      timestamp: new Date().toISOString(),
      id: this.generateEventId()
    };
    
    // Store in history
    this.eventHistory.push(eventData);
    this.trimEventHistory();
    
    // Notify subscribers
    this.notifySubscribers(deviceType, eventData);
    
    // Emit global event
    this.emit('hardwareEvent', eventData);
    
    // Emit device-specific event
    this.emit(\`\${deviceType}:\${eventName}\`, eventData);
  }
  
  notifySubscribers(deviceType, eventData) {
    const callbacks = this.eventSubscriptions.get(deviceType);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(eventData);
        } catch (error) {
          console.error('Error in event subscriber:', error);
        }
      });
    }
  }
  
  // Event history management
  getEventHistory(deviceType = null, limit = 100) {
    let events = this.eventHistory;
    
    if (deviceType) {
      events = events.filter(event => event.deviceType === deviceType);
    }
    
    return events.slice(-limit);
  }
  
  clearEventHistory() {
    this.eventHistory = [];
  }
  
  trimEventHistory(maxEvents = 1000) {
    if (this.eventHistory.length > maxEvents) {
      this.eventHistory = this.eventHistory.slice(-maxEvents);
    }
  }
  
  // Event filtering and querying
  findEvents(criteria) {
    return this.eventHistory.filter(event => {
      return Object.entries(criteria).every(([key, value]) => {
        if (key === 'timeRange') {
          const eventTime = new Date(event.timestamp);
          return eventTime >= value.start && eventTime <= value.end;
        }
        return event[key] === value;
      });
    });
  }
  
  getEventStats() {
    const stats = {
      totalEvents: this.eventHistory.length,
      deviceBreakdown: {},
      eventBreakdown: {},
      recentActivity: this.getRecentActivity()
    };
    
    this.eventHistory.forEach(event => {
      // Device breakdown
      if (!stats.deviceBreakdown[event.deviceType]) {
        stats.deviceBreakdown[event.deviceType] = 0;
      }
      stats.deviceBreakdown[event.deviceType]++;
      
      // Event breakdown
      if (!stats.eventBreakdown[event.eventName]) {
        stats.eventBreakdown[event.eventName] = 0;
      }
      stats.eventBreakdown[event.eventName]++;
    });
    
    return stats;
  }
  
  getRecentActivity(minutes = 5) {
    const cutoff = new Date(Date.now() - minutes * 60 * 1000);
    return this.eventHistory.filter(event => 
      new Date(event.timestamp) > cutoff
    );
  }
  
  // Event simulation
  simulateEvent(deviceType, eventName, data = {}) {
    this.handleDeviceEvent(deviceType, eventName, {
      ...data,
      simulated: true
    });
  }
  
  simulateEventSequence(sequence) {
    sequence.forEach((step, index) => {
      setTimeout(() => {
        this.simulateEvent(step.deviceType, step.eventName, step.data);
      }, (step.delay || 0) + index * 100);
    });
  }
  
  // Utility methods
  generateEventId() {
    return 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
  
  // Event patterns and workflows
  defineEventPattern(name, pattern) {
    // Pattern is an array of expected events in sequence
    this.eventPatterns = this.eventPatterns || {};
    this.eventPatterns[name] = pattern;
    
    // Set up pattern detection
    this.on('hardwareEvent', (event) => {
      this.checkEventPatterns(event);
    });
  }
  
  checkEventPatterns(newEvent) {
    if (!this.eventPatterns) return;
    
    Object.entries(this.eventPatterns).forEach(([patternName, pattern]) => {
      const recentEvents = this.getEventHistory(null, pattern.length);
      
      if (this.matchesPattern(recentEvents, pattern)) {
        this.emit('patternMatched', {
          pattern: patternName,
          events: recentEvents,
          timestamp: new Date().toISOString()
        });
      }
    });
  }
  
  matchesPattern(events, pattern) {
    if (events.length < pattern.length) return false;
    
    const relevantEvents = events.slice(-pattern.length);
    
    return pattern.every((expectedEvent, index) => {
      const actualEvent = relevantEvents[index];
      return actualEvent.deviceType === expectedEvent.deviceType &&
             actualEvent.eventName === expectedEvent.eventName;
    });
  }
}

module.exports = HardwareEventSystem;
`;
  }

  getConfigTemplate() {
    return `
// Hardware configuration management
const fs = require('fs');
const path = require('path');

class HardwareConfig {
  constructor() {
    this.deviceConfigs = {{deviceConfigs}};
    this.userConfigs = {{userConfigs}};
    this.configFile = path.join(process.cwd(), 'hardware-config.json');
    
    this.loadUserConfig();
  }
  
  loadUserConfig() {
    try {
      if (fs.existsSync(this.configFile)) {
        const userConfig = JSON.parse(fs.readFileSync(this.configFile, 'utf8'));
        this.mergeConfigs(userConfig);
      }
    } catch (error) {
      console.warn('Failed to load user hardware config:', error.message);
    }
  }
  
  mergeConfigs(userConfig) {
    Object.entries(userConfig).forEach(([deviceType, config]) => {
      if (this.deviceConfigs[deviceType]) {
        this.deviceConfigs[deviceType] = {
          ...this.deviceConfigs[deviceType],
          ...config
        };
      } else {
        this.deviceConfigs[deviceType] = config;
      }
    });
  }
  
  getDeviceConfig(deviceType) {
    return this.deviceConfigs[deviceType] || {};
  }
  
  setDeviceConfig(deviceType, config) {
    this.deviceConfigs[deviceType] = {
      ...this.deviceConfigs[deviceType],
      ...config
    };
  }
  
  saveConfig() {
    try {
      fs.writeFileSync(this.configFile, JSON.stringify(this.deviceConfigs, null, 2));
      return true;
    } catch (error) {
      console.error('Failed to save hardware config:', error.message);
      return false;
    }
  }
  
  getDefaultConfig(deviceType) {
    const defaults = {
      printer: {
        baudRate: 9600,
        characterSet: 'UTF-8',
        paperWidth: 80,
        autocut: true,
        cashdrawerPin: 2,
        interface: 'USB',
        timeout: 5000
      },
      scanner: {
        autoFocus: true,
        flashMode: 'auto',
        scanTimeout: 30000,
        supportedFormats: ['CODE128', 'CODE39', 'EAN13', 'QR_CODE'],
        resolution: 'high',
        continuous: false
      },
      nfc: {
        pollInterval: 500,
        timeout: 10000,
        supportedTypes: ['MIFARE', 'NTAG', 'ISO14443A'],
        autoStart: true,
        range: 'normal'
      },
      cashDrawer: {
        pulseWidth: 200,
        pinNumber: 2,
        autoClose: true,
        closeDelay: 5000
      },
      cardReader: {
        timeout: 30000,
        supportedCards: ['VISA', 'MASTERCARD', 'AMEX', 'DISCOVER'],
        encryption: true,
        chipFirst: true,
        contactless: true
      },
      scale: {
        unit: 'kg',
        precision: 2,
        maxWeight: 30,
        autoTare: true,
        stabilityThreshold: 0.01
      }
    };
    
    return defaults[deviceType] || {};
  }
  
  validateConfig(deviceType, config) {
    const validators = {
      printer: (cfg) => {
        const errors = [];
        if (cfg.baudRate && ![9600, 19200, 38400, 115200].includes(cfg.baudRate)) {
          errors.push('Invalid baud rate');
        }
        if (cfg.paperWidth && (cfg.paperWidth < 40 || cfg.paperWidth > 120)) {
          errors.push('Paper width must be between 40-120mm');
        }
        return errors;
      },
      scanner: (cfg) => {
        const errors = [];
        if (cfg.scanTimeout && cfg.scanTimeout < 1000) {
          errors.push('Scan timeout must be at least 1000ms');
        }
        return errors;
      },
      scale: (cfg) => {
        const errors = [];
        if (cfg.maxWeight && cfg.maxWeight <= 0) {
          errors.push('Max weight must be positive');
        }
        if (cfg.precision && (cfg.precision < 0 || cfg.precision > 4)) {
          errors.push('Precision must be between 0-4 decimal places');
        }
        return errors;
      }
    };
    
    const validator = validators[deviceType];
    return validator ? validator(config) : [];
  }
  
  resetToDefaults(deviceType = null) {
    if (deviceType) {
      this.deviceConfigs[deviceType] = this.getDefaultConfig(deviceType);
    } else {
      Object.keys(this.deviceConfigs).forEach(type => {
        this.deviceConfigs[type] = this.getDefaultConfig(type);
      });
    }
  }
  
  exportConfig() {
    return JSON.stringify(this.deviceConfigs, null, 2);
  }
  
  importConfig(configJson) {
    try {
      const config = JSON.parse(configJson);
      this.deviceConfigs = { ...this.deviceConfigs, ...config };
      return true;
    } catch (error) {
      console.error('Failed to import config:', error.message);
      return false;
    }
  }
}

module.exports = HardwareConfig;
`;
  }
}

module.exports = HardwareGenerator;