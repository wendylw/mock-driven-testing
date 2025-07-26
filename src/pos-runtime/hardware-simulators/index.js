const EventEmitter = require('events');

// Hardware Simulator Classes
class PrinterSimulator extends EventEmitter {
  constructor(config = {}) {
    super();
    this.deviceType = 'printer';
    this.config = {
      baudRate: 9600,
      characterSet: 'UTF-8',
      paperWidth: 80,
      autocut: true,
      cashdrawerPin: 2,
      ...config
    };
    
    this.connected = false;
    this.state = {
      paperLevel: 100,
      coverOpen: false,
      online: true,
      temperature: 'normal',
      drawerOpen: false
    };
    
    this.jobQueue = [];
    this.processing = false;
  }

  async connect() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() < 0.95) { // 95% success rate
          this.connected = true;
          this.emit('connected');
          resolve(true);
        } else {
          reject(new Error('Failed to connect to printer'));
        }
      }, 500);
    });
  }

  disconnect() {
    this.connected = false;
    this.emit('disconnected');
  }

  async print(data) {
    if (!this.connected) {
      throw new Error('Printer not connected');
    }

    if (this.state.paperLevel <= 0) {
      throw new Error('Out of paper');
    }

    if (this.state.coverOpen) {
      throw new Error('Printer cover is open');
    }

    return new Promise((resolve, reject) => {
      const job = {
        id: this.generateJobId(),
        data,
        timestamp: new Date().toISOString()
      };

      this.jobQueue.push(job);
      this.processQueue();

      setTimeout(() => {
        if (Math.random() < 0.9) { // 90% success rate
          this.state.paperLevel -= 5; // Consume some paper
          this.emit('printComplete', { jobId: job.id, success: true });
          resolve({ success: true, jobId: job.id });
        } else {
          this.emit('printError', { jobId: job.id, error: 'Print failed' });
          reject(new Error('Print failed'));
        }
      }, 2000);
    });
  }

  async openCashDrawer() {
    if (!this.connected) {
      throw new Error('Printer not connected');
    }

    return new Promise((resolve) => {
      this.state.drawerOpen = true;
      this.emit('drawerOpened');
      
      // Auto-close after 5 seconds
      setTimeout(() => {
        this.state.drawerOpen = false;
        this.emit('drawerClosed');
      }, 5000);

      resolve({ success: true });
    });
  }

  processQueue() {
    if (this.processing || this.jobQueue.length === 0) return;
    
    this.processing = true;
    this.emit('processingStarted');
    
    setTimeout(() => {
      this.jobQueue.shift(); // Remove completed job
      this.processing = false;
      
      if (this.jobQueue.length > 0) {
        this.processQueue();
      } else {
        this.emit('queueEmpty');
      }
    }, 1000);
  }

  generateJobId() {
    return 'PRINT_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
  }

  getStatus() {
    return {
      connected: this.connected,
      state: this.state,
      queueLength: this.jobQueue.length,
      processing: this.processing
    };
  }
}

class ScannerSimulator extends EventEmitter {
  constructor(config = {}) {
    super();
    this.deviceType = 'scanner';
    this.config = {
      autoFocus: true,
      flashMode: 'auto',
      scanTimeout: 30000,
      supportedFormats: ['CODE128', 'CODE39', 'EAN13', 'QR_CODE'],
      ...config
    };
    
    this.connected = false;
    this.state = {
      scanning: false,
      torchOn: false,
      autoFocus: true
    };
    
    this.scanInterval = null;
  }

  async connect() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() < 0.98) { // 98% success rate
          this.connected = true;
          this.emit('connected');
          resolve(true);
        } else {
          reject(new Error('Failed to connect to scanner'));
        }
      }, 200);
    });
  }

  disconnect() {
    this.connected = false;
    this.stopScanning();
    this.emit('disconnected');
  }

  startScanning() {
    if (!this.connected) {
      throw new Error('Scanner not connected');
    }

    this.state.scanning = true;
    this.emit('scanStarted');
    
    // Simulate barcode detection
    this.scanInterval = setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance of finding a barcode
        const barcode = this.generateMockBarcode();
        this.emit('barcodeScanned', barcode);
      }
    }, 2000);

    return { success: true };
  }

  stopScanning() {
    this.state.scanning = false;
    
    if (this.scanInterval) {
      clearInterval(this.scanInterval);
      this.scanInterval = null;
    }
    
    this.emit('scanStopped');
    return { success: true };
  }

  generateMockBarcode() {
    const formats = this.config.supportedFormats;
    const format = formats[Math.floor(Math.random() * formats.length)];
    
    const barcodes = {
      'CODE128': () => Math.random().toString().substring(2, 15),
      'EAN13': () => Math.floor(Math.random() * 9000000000000) + 1000000000000,
      'QR_CODE': () => `QR_${Math.random().toString(36).substring(2, 10)}`,
      'CODE39': () => Math.random().toString(36).substring(2, 12).toUpperCase()
    };

    return {
      type: format,
      data: barcodes[format]().toString(),
      timestamp: new Date().toISOString(),
      quality: Math.floor(Math.random() * 40) + 60 // 60-100% quality
    };
  }

  getStatus() {
    return {
      connected: this.connected,
      state: this.state,
      supportedFormats: this.config.supportedFormats
    };
  }
}

class NFCSimulator extends EventEmitter {
  constructor(config = {}) {
    super();
    this.deviceType = 'nfc';
    this.config = {
      pollInterval: 500,
      timeout: 10000,
      supportedTypes: ['MIFARE', 'NTAG', 'ISO14443A'],
      ...config
    };
    
    this.connected = false;
    this.state = {
      enabled: false,
      tagPresent: false,
      currentTag: null
    };
    
    this.pollInterval = null;
  }

  async connect() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() < 0.95) { // 95% success rate
          this.connected = true;
          this.emit('connected');
          resolve(true);
        } else {
          reject(new Error('Failed to connect to NFC reader'));
        }
      }, 300);
    });
  }

  disconnect() {
    this.connected = false;
    this.stop();
    this.emit('disconnected');
  }

  start() {
    if (!this.connected) {
      throw new Error('NFC reader not connected');
    }

    this.state.enabled = true;
    this.emit('nfcEnabled');
    
    // Start polling for tags
    this.pollInterval = setInterval(() => {
      this.pollForTags();
    }, this.config.pollInterval);

    return { success: true };
  }

  stop() {
    this.state.enabled = false;
    this.state.tagPresent = false;
    this.state.currentTag = null;
    
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
    
    this.emit('nfcDisabled');
    return { success: true };
  }

  pollForTags() {
    if (!this.state.enabled) return;

    // 15% chance of tag detection
    if (Math.random() < 0.15) {
      if (!this.state.tagPresent) {
        const tag = this.generateMockTag();
        this.state.tagPresent = true;
        this.state.currentTag = tag;
        this.emit('tagDiscovered', tag);
      }
    } else {
      if (this.state.tagPresent) {
        this.state.tagPresent = false;
        this.state.currentTag = null;
        this.emit('tagLost');
      }
    }
  }

  generateMockTag() {
    const types = this.config.supportedTypes;
    const type = types[Math.floor(Math.random() * types.length)];
    
    return {
      id: Math.random().toString(16).substring(2, 10),
      type,
      data: {
        message: `Mock ${type} tag`,
        timestamp: new Date().toISOString(),
        payload: Math.random().toString(36).substring(2, 20)
      },
      size: Math.floor(Math.random() * 1000) + 100,
      writable: Math.random() < 0.7 // 70% are writable
    };
  }

  async readTag() {
    if (!this.connected) {
      throw new Error('NFC reader not connected');
    }

    if (!this.state.enabled) {
      throw new Error('NFC reader not enabled');
    }

    return new Promise((resolve, reject) => {
      if (this.state.tagPresent && this.state.currentTag) {
        resolve(this.state.currentTag);
      } else {
        setTimeout(() => {
          reject(new Error('No tag present'));
        }, 1000);
      }
    });
  }

  getStatus() {
    return {
      connected: this.connected,
      state: this.state,
      supportedTypes: this.config.supportedTypes
    };
  }
}

class CashDrawerSimulator extends EventEmitter {
  constructor(config = {}) {
    super();
    this.deviceType = 'cashDrawer';
    this.config = {
      pulseWidth: 200,
      pinNumber: 2,
      autoClose: true,
      closeDelay: 5000,
      ...config
    };
    
    this.connected = false;
    this.state = {
      open: false,
      locked: false
    };
  }

  async connect() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() < 0.99) { // 99% success rate
          this.connected = true;
          this.emit('connected');
          resolve(true);
        } else {
          reject(new Error('Failed to connect to cash drawer'));
        }
      }, 100);
    });
  }

  disconnect() {
    this.connected = false;
    this.emit('disconnected');
  }

  async open() {
    if (!this.connected) {
      throw new Error('Cash drawer not connected');
    }

    if (this.state.locked) {
      throw new Error('Cash drawer is locked');
    }

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() < 0.98) { // 98% success rate
          this.state.open = true;
          this.emit('drawerOpened');
          
          // Auto-close if configured
          if (this.config.autoClose) {
            setTimeout(() => {
              this.state.open = false;
              this.emit('drawerClosed');
            }, this.config.closeDelay);
          }
          
          resolve({ success: true });
        } else {
          reject(new Error('Failed to open cash drawer'));
        }
      }, this.config.pulseWidth);
    });
  }

  close() {
    this.state.open = false;
    this.emit('drawerClosed');
    return { success: true };
  }

  getStatus() {
    return {
      connected: this.connected,
      state: this.state
    };
  }
}

class CardReaderSimulator extends EventEmitter {
  constructor(config = {}) {
    super();
    this.deviceType = 'cardReader';
    this.config = {
      timeout: 30000,
      supportedCards: ['VISA', 'MASTERCARD', 'AMEX', 'DISCOVER'],
      encryption: true,
      chipFirst: true,
      contactless: true,
      ...config
    };
    
    this.connected = false;
    this.state = {
      ready: true,
      cardPresent: false,
      currentCard: null,
      processing: false
    };
  }

  async connect() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() < 0.96) { // 96% success rate
          this.connected = true;
          this.emit('connected');
          resolve(true);
        } else {
          reject(new Error('Failed to connect to card reader'));
        }
      }, 800);
    });
  }

  disconnect() {
    this.connected = false;
    this.emit('disconnected');
  }

  async readCard() {
    if (!this.connected) {
      throw new Error('Card reader not connected');
    }

    if (!this.state.ready) {
      throw new Error('Card reader not ready');
    }

    this.state.processing = true;
    this.emit('waitingForCard');

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.state.processing = false;
        reject(new Error('Card read timeout'));
      }, this.config.timeout);

      // Simulate card insertion after random delay
      setTimeout(() => {
        clearTimeout(timeout);
        
        if (Math.random() < 0.92) { // 92% success rate
          const card = this.generateMockCard();
          this.state.cardPresent = true;
          this.state.currentCard = card;
          this.state.processing = false;
          
          this.emit('cardInserted', card);
          resolve(card);
        } else {
          this.state.processing = false;
          reject(new Error('Card read error'));
        }
      }, 2000 + Math.random() * 3000);
    });
  }

  generateMockCard() {
    const brands = this.config.supportedCards;
    const brand = brands[Math.floor(Math.random() * brands.length)];
    
    const cardTypes = ['chip', 'swipe', 'contactless'];
    const type = cardTypes[Math.floor(Math.random() * cardTypes.length)];
    
    return {
      brand,
      type,
      last4: Math.floor(Math.random() * 9999).toString().padStart(4, '0'),
      expiry: {
        month: Math.floor(Math.random() * 12) + 1,
        year: new Date().getFullYear() + Math.floor(Math.random() * 5) + 1
      },
      holder: 'TEST CARDHOLDER',
      encrypted: this.config.encryption,
      timestamp: new Date().toISOString()
    };
  }

  async processPayment(amount, card = null) {
    if (!this.connected) {
      throw new Error('Card reader not connected');
    }

    const paymentCard = card || this.state.currentCard;
    if (!paymentCard) {
      throw new Error('No card present');
    }

    this.state.processing = true;
    this.emit('paymentStarted', { amount, card: paymentCard });

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.state.processing = false;
        
        if (Math.random() < 0.95) { // 95% success rate
          const result = {
            success: true,
            transactionId: this.generateTransactionId(),
            amount,
            card: paymentCard,
            timestamp: new Date().toISOString(),
            authCode: Math.random().toString(36).substring(2, 8).toUpperCase()
          };
          
          this.emit('paymentComplete', result);
          resolve(result);
        } else {
          const error = { message: 'Payment declined', code: 'DECLINED' };
          this.emit('paymentError', error);
          reject(error);
        }
      }, 3000 + Math.random() * 2000);
    });
  }

  generateTransactionId() {
    return 'TXN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
  }

  getStatus() {
    return {
      connected: this.connected,
      state: this.state,
      supportedCards: this.config.supportedCards
    };
  }
}

class ScaleSimulator extends EventEmitter {
  constructor(config = {}) {
    super();
    this.deviceType = 'scale';
    this.config = {
      unit: 'kg',
      precision: 2,
      maxWeight: 30,
      autoTare: true,
      stabilityThreshold: 0.01,
      ...config
    };
    
    this.connected = false;
    this.state = {
      weight: 0,
      stable: true,
      tared: false,
      overload: false
    };
    
    this.weightHistory = [];
    this.stabilityTimer = null;
  }

  async connect() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() < 0.97) { // 97% success rate
          this.connected = true;
          this.emit('connected');
          resolve(true);
        } else {
          reject(new Error('Failed to connect to scale'));
        }
      }, 400);
    });
  }

  disconnect() {
    this.connected = false;
    this.emit('disconnected');
  }

  async getWeight() {
    if (!this.connected) {
      throw new Error('Scale not connected');
    }

    // Add small random variation
    const variation = (Math.random() - 0.5) * 0.02;
    let weight = Math.max(0, this.state.weight + variation);
    
    // Check for overload
    if (weight > this.config.maxWeight) {
      this.state.overload = true;
      this.emit('overload', { maxWeight: this.config.maxWeight });
      throw new Error('Scale overloaded');
    } else {
      this.state.overload = false;
    }

    // Update weight history for stability calculation
    this.weightHistory.push(weight);
    if (this.weightHistory.length > 10) {
      this.weightHistory.shift();
    }

    // Calculate stability
    this.calculateStability();

    const result = {
      weight: parseFloat(weight.toFixed(this.config.precision)),
      unit: this.config.unit,
      stable: this.state.stable,
      tared: this.state.tared,
      timestamp: new Date().toISOString()
    };

    this.emit('weightChanged', result);
    return result;
  }

  calculateStability() {
    if (this.weightHistory.length < 3) {
      this.state.stable = false;
      return;
    }

    const recent = this.weightHistory.slice(-3);
    const variance = this.calculateVariance(recent);
    const wasStable = this.state.stable;
    
    this.state.stable = variance < this.config.stabilityThreshold;
    
    if (!wasStable && this.state.stable) {
      this.emit('weightStabilized', { weight: this.state.weight });
    }
  }

  calculateVariance(values) {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    return squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  }

  async tare() {
    if (!this.connected) {
      throw new Error('Scale not connected');
    }

    return new Promise((resolve) => {
      this.state.weight = 0;
      this.state.tared = true;
      this.weightHistory = [0];
      
      this.emit('tared');
      resolve({ success: true });
    });
  }

  // Simulate placing/removing items
  placeItem(weight) {
    if (weight < 0) {
      throw new Error('Weight cannot be negative');
    }
    
    this.state.weight = weight;
    this.state.stable = false;
    
    // Start stability timer
    if (this.stabilityTimer) {
      clearTimeout(this.stabilityTimer);
    }
    
    this.stabilityTimer = setTimeout(() => {
      this.state.stable = true;
      this.emit('weightStabilized', { weight: this.state.weight });
    }, 2000);
    
    this.emit('itemPlaced', { weight });
  }

  removeItem() {
    this.state.weight = 0;
    this.state.stable = false;
    
    setTimeout(() => {
      this.state.stable = true;
      this.emit('weightStabilized', { weight: 0 });
    }, 1000);
    
    this.emit('itemRemoved');
  }

  getStatus() {
    return {
      connected: this.connected,
      state: this.state,
      config: {
        unit: this.config.unit,
        precision: this.config.precision,
        maxWeight: this.config.maxWeight
      }
    };
  }
}

// Hardware Manager for all simulators
class HardwareSimulatorManager extends EventEmitter {
  constructor(config = {}) {
    super();
    this.config = config;
    this.devices = new Map();
    this.deviceConfigs = config.devices || {};
    
    this.initializeDevices();
    this.setupGlobalEventHandlers();
  }

  initializeDevices() {
    const deviceClasses = {
      printer: PrinterSimulator,
      scanner: ScannerSimulator,
      nfc: NFCSimulator,
      cashDrawer: CashDrawerSimulator,
      cardReader: CardReaderSimulator,
      scale: ScaleSimulator
    };

    Object.entries(deviceClasses).forEach(([deviceType, DeviceClass]) => {
      const config = this.deviceConfigs[deviceType] || {};
      const device = new DeviceClass(config);
      
      this.devices.set(deviceType, device);
      this.setupDeviceEventHandlers(deviceType, device);
    });

    console.log(`Hardware Simulator Manager initialized with ${this.devices.size} devices`);
  }

  setupDeviceEventHandlers(deviceType, device) {
    // Forward all device events with device type prefix
    const originalEmit = device.emit.bind(device);
    device.emit = (event, ...args) => {
      originalEmit(event, ...args);
      this.emit(`${deviceType}:${event}`, ...args);
      this.emit('deviceEvent', { deviceType, event, data: args[0] });
    };
  }

  setupGlobalEventHandlers() {
    this.on('deviceEvent', (eventData) => {
      console.log(`Hardware Event: ${eventData.deviceType}:${eventData.event}`, eventData.data);
    });
  }

  getDevice(deviceType) {
    return this.devices.get(deviceType);
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
        console.error(`Error disconnecting ${deviceType}:`, error.message);
      }
    }
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
      if (device.connected) {
        connected.push(deviceType);
      }
    }
    
    return connected;
  }
}

module.exports = {
  PrinterSimulator,
  ScannerSimulator,
  NFCSimulator,
  CashDrawerSimulator,
  CardReaderSimulator,
  ScaleSimulator,
  HardwareSimulatorManager
};