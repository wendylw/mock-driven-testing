const fs = require('fs');
const path = require('path');

class HardwareAnalyzer {
  constructor() {
    this.hardwareLibraries = {
      printer: [
        'react-native-thermal-printer',
        'react-native-pos-printer',
        'react-native-bluetooth-escpos-printer',
        'esc-pos',
        'node-thermal-printer'
      ],
      scanner: [
        'react-native-camera',
        'react-native-qrcode-scanner',
        'react-native-barcode-scanner',
        'zxing-js',
        'quagga'
      ],
      nfc: [
        'react-native-nfc-manager',
        'nfc-pcsc',
        'react-native-hce',
        'nfc'
      ],
      cashDrawer: [
        'cash-drawer',
        'pos-hardware',
        'serial-port'
      ],
      cardReader: [
        'react-native-card-io',
        'square-react-native-plugin',
        'stripe-terminal',
        'card-reader'
      ],
      scale: [
        'scale',
        'weight-scale',
        'pos-scale'
      ]
    };

    this.hardwareMethods = {
      printer: [
        'print', 'printText', 'printImage', 'printQR', 'printBarcode',
        'openCashDrawer', 'cut', 'feed', 'setAlignment'
      ],
      scanner: [
        'startScanning', 'stopScanning', 'onBarCodeRead', 'scanBarcode',
        'scanQR', 'takePicture'
      ],
      nfc: [
        'start', 'stop', 'readTag', 'writeTag', 'registerTagEvent',
        'isSupported', 'isEnabled'
      ],
      cashDrawer: [
        'open', 'openDrawer', 'pulse', 'kick'
      ],
      cardReader: [
        'startCardReaderApplication', 'readCard', 'processPayment',
        'connectReader', 'disconnectReader'
      ],
      scale: [
        'getWeight', 'tare', 'zero', 'calibrate'
      ]
    };

    this.hardwareEvents = {
      printer: [
        'printerConnected', 'printerDisconnected', 'printComplete',
        'printerError', 'paperOut', 'coverOpen'
      ],
      scanner: [
        'barcodeScanned', 'scanError', 'cameraReady', 'torchOn', 'torchOff'
      ],
      nfc: [
        'tagDiscovered', 'tagLost', 'nfcEnabled', 'nfcDisabled'
      ],
      cashDrawer: [
        'drawerOpened', 'drawerClosed', 'drawerError'
      ],
      cardReader: [
        'cardInserted', 'cardRemoved', 'paymentComplete', 'paymentError'
      ],
      scale: [
        'weightChanged', 'scaleReady', 'scaleError'
      ]
    };
  }

  analyze(codebase) {
    const hardwareFiles = this.findHardwareFiles(codebase);
    const imports = this.findHardwareImports(hardwareFiles);
    const calls = this.analyzeHardwareCalls(hardwareFiles);
    const configs = this.extractConfigs(hardwareFiles);
    const events = this.extractHardwareEvents(hardwareFiles);

    const devices = this.identifyDevices(imports, calls);
    const operations = this.categorizeOperations(calls);

    return {
      devices,
      operations,
      configurations: configs,
      events,
      libraries: imports,
      simulators: this.generateSimulatorSpecs(devices, operations)
    };
  }

  findHardwareFiles(codebase) {
    const hardwareFiles = [];
    
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
          if (this.containsHardwareCode(content)) {
            hardwareFiles.push({
              path: filePath,
              content,
              name: file
            });
          }
        }
      });
    }

    scanDirectory(codebase);
    return hardwareFiles;
  }

  containsHardwareCode(content) {
    const allLibraries = Object.values(this.hardwareLibraries).flat();
    const hardwareKeywords = [
      'printer', 'scanner', 'barcode', 'qr', 'nfc', 'bluetooth',
      'thermal', 'receipt', 'cash drawer', 'scale', 'card reader',
      'hardware', 'device', 'serial'
    ];

    return allLibraries.some(lib => content.includes(lib)) ||
           hardwareKeywords.some(keyword => content.toLowerCase().includes(keyword));
  }

  findHardwareImports(hardwareFiles) {
    const imports = [];
    
    hardwareFiles.forEach(file => {
      // Extract import statements
      const importMatches = [
        ...file.content.matchAll(/import\s+.*?from\s+['"`]([^'"`]+)['"`]/g),
        ...file.content.matchAll(/require\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g)
      ];

      importMatches.forEach(match => {
        const importPath = match[1];
        const deviceType = this.identifyDeviceType(importPath);
        if (deviceType) {
          imports.push({
            library: importPath,
            deviceType,
            file: file.path
          });
        }
      });
    });

    return imports;
  }

  identifyDeviceType(importPath) {
    for (const [deviceType, libraries] of Object.entries(this.hardwareLibraries)) {
      if (libraries.some(lib => importPath.includes(lib))) {
        return deviceType;
      }
    }
    return null;
  }

  analyzeHardwareCalls(hardwareFiles) {
    const calls = [];
    
    hardwareFiles.forEach(file => {
      // Analyze method calls
      Object.entries(this.hardwareMethods).forEach(([deviceType, methods]) => {
        methods.forEach(method => {
          const methodRegex = new RegExp(`\\b${method}\\s*\\(`, 'g');
          const matches = [...file.content.matchAll(methodRegex)];
          
          matches.forEach(match => {
            calls.push({
              deviceType,
              method,
              file: file.path,
              context: this.extractMethodContext(file.content, match.index)
            });
          });
        });
      });

      // Extract generic hardware-related function calls
      const genericCallMatches = [...file.content.matchAll(/(\w+)\.(print|scan|read|open|connect|start|stop)\s*\(/g)];
      genericCallMatches.forEach(match => {
        const [, object, method] = match;
        const deviceType = this.inferDeviceTypeFromObject(object);
        if (deviceType) {
          calls.push({
            deviceType,
            method,
            object,
            file: file.path,
            context: this.extractMethodContext(file.content, match.index)
          });
        }
      });
    });

    return calls;
  }

  extractMethodContext(content, index) {
    const start = Math.max(0, index - 100);
    const end = Math.min(content.length, index + 100);
    return content.substring(start, end).replace(/\s+/g, ' ').trim();
  }

  inferDeviceTypeFromObject(objectName) {
    const objectLower = objectName.toLowerCase();
    
    if (objectLower.includes('print')) return 'printer';
    if (objectLower.includes('scan') || objectLower.includes('camera')) return 'scanner';
    if (objectLower.includes('nfc')) return 'nfc';
    if (objectLower.includes('drawer') || objectLower.includes('cash')) return 'cashDrawer';
    if (objectLower.includes('card') || objectLower.includes('payment')) return 'cardReader';
    if (objectLower.includes('scale') || objectLower.includes('weight')) return 'scale';
    
    return null;
  }

  extractConfigs(hardwareFiles) {
    const configs = {};
    
    hardwareFiles.forEach(file => {
      // Extract configuration objects
      const configMatches = [
        ...file.content.matchAll(/(?:const|let|var)\s+(\w*[Cc]onfig\w*)\s*=\s*({[^}]*})/g),
        ...file.content.matchAll(/(\w+)\s*:\s*({[^}]*(?:ip|port|baudRate|timeout)[^}]*})/g)
      ];

      configMatches.forEach(match => {
        const [, configName, configObject] = match;
        try {
          const cleanedConfig = this.cleanConfigObject(configObject);
          configs[configName] = {
            config: cleanedConfig,
            file: file.path
          };
        } catch (error) {
          // If parsing fails, store raw config
          configs[configName] = {
            config: configObject,
            file: file.path,
            raw: true
          };
        }
      });

      // Extract specific hardware settings
      const settingPatterns = [
        /baudRate\s*:\s*(\d+)/g,
        /port\s*:\s*['"`]([^'"`]+)['"`]/g,
        /ip\s*:\s*['"`]([^'"`]+)['"`]/g,
        /timeout\s*:\s*(\d+)/g
      ];

      settingPatterns.forEach(pattern => {
        const matches = [...file.content.matchAll(pattern)];
        matches.forEach(match => {
          const [fullMatch, value] = match;
          const setting = fullMatch.split(':')[0].trim();
          
          if (!configs.hardwareSettings) {
            configs.hardwareSettings = { file: file.path, settings: {} };
          }
          configs.hardwareSettings.settings[setting] = value;
        });
      });
    });

    return configs;
  }

  cleanConfigObject(configString) {
    // Basic cleanup for JSON parsing
    return configString
      .replace(/'/g, '"')
      .replace(/(\w+):/g, '"$1":')
      .replace(/,\s*}/g, '}');
  }

  extractHardwareEvents(hardwareFiles) {
    const events = [];
    
    hardwareFiles.forEach(file => {
      // Extract event listeners
      Object.entries(this.hardwareEvents).forEach(([deviceType, eventNames]) => {
        eventNames.forEach(eventName => {
          const eventRegex = new RegExp(`(?:on|addEventListener)\\s*\\(\\s*['"\`]${eventName}['"\`]`, 'g');
          const matches = [...file.content.matchAll(eventRegex)];
          
          matches.forEach(match => {
            events.push({
              deviceType,
              eventName,
              file: file.path,
              context: this.extractMethodContext(file.content, match.index)
            });
          });
        });
      });

      // Extract generic event patterns
      const genericEventMatches = [...file.content.matchAll(/\.on\s*\(\s*['"`]([^'"`]+)['"`]/g)];
      genericEventMatches.forEach(match => {
        const eventName = match[1];
        if (this.looksLikeHardwareEvent(eventName)) {
          events.push({
            deviceType: this.inferDeviceTypeFromEvent(eventName),
            eventName,
            file: file.path,
            generic: true
          });
        }
      });
    });

    return events;
  }

  looksLikeHardwareEvent(eventName) {
    const hardwareEventKeywords = [
      'connected', 'disconnected', 'error', 'ready', 'complete',
      'scanned', 'printed', 'opened', 'closed', 'inserted', 'removed'
    ];
    
    const lowerEventName = eventName.toLowerCase();
    return hardwareEventKeywords.some(keyword => lowerEventName.includes(keyword));
  }

  inferDeviceTypeFromEvent(eventName) {
    const lowerEventName = eventName.toLowerCase();
    
    if (lowerEventName.includes('print')) return 'printer';
    if (lowerEventName.includes('scan') || lowerEventName.includes('barcode')) return 'scanner';
    if (lowerEventName.includes('nfc') || lowerEventName.includes('tag')) return 'nfc';
    if (lowerEventName.includes('drawer') || lowerEventName.includes('cash')) return 'cashDrawer';
    if (lowerEventName.includes('card') || lowerEventName.includes('payment')) return 'cardReader';
    if (lowerEventName.includes('weight') || lowerEventName.includes('scale')) return 'scale';
    
    return 'unknown';
  }

  identifyDevices(imports, calls) {
    const devices = new Set();
    
    // From imports
    imports.forEach(imp => devices.add(imp.deviceType));
    
    // From calls
    calls.forEach(call => devices.add(call.deviceType));
    
    // Add common POS devices if none found
    if (devices.size === 0) {
      ['printer', 'scanner', 'nfc', 'cashDrawer'].forEach(device => devices.add(device));
    }
    
    return Array.from(devices);
  }

  categorizeOperations(calls) {
    const operations = {};
    
    calls.forEach(call => {
      if (!operations[call.deviceType]) {
        operations[call.deviceType] = [];
      }
      
      operations[call.deviceType].push({
        method: call.method,
        context: call.context,
        file: call.file
      });
    });

    return operations;
  }

  generateSimulatorSpecs(devices, operations) {
    const simulators = {};
    
    devices.forEach(device => {
      simulators[device] = {
        name: `${device}Simulator`,
        methods: this.hardwareMethods[device] || [],
        events: this.hardwareEvents[device] || [],
        operations: operations[device] || [],
        defaultBehavior: this.getDefaultBehavior(device),
        errorSimulation: this.getErrorSimulation(device)
      };
    });

    return simulators;
  }

  getDefaultBehavior(deviceType) {
    const behaviors = {
      printer: {
        print: { success: true, delay: 1000 },
        openCashDrawer: { success: true, delay: 500 }
      },
      scanner: {
        startScanning: { success: true, delay: 100 },
        scanBarcode: { success: true, data: '1234567890123', delay: 2000 }
      },
      nfc: {
        start: { success: true, delay: 500 },
        readTag: { success: true, data: { id: 'test-nfc-tag' }, delay: 1000 }
      },
      cashDrawer: {
        open: { success: true, delay: 300 }
      },
      cardReader: {
        readCard: { success: true, data: { last4: '1234', type: 'credit' }, delay: 3000 }
      },
      scale: {
        getWeight: { success: true, weight: 1.25, delay: 500 }
      }
    };

    return behaviors[deviceType] || { default: { success: true, delay: 1000 } };
  }

  getErrorSimulation(deviceType) {
    const errorSimulations = {
      printer: [
        { type: 'paperOut', probability: 0.1 },
        { type: 'coverOpen', probability: 0.05 },
        { type: 'connectionLost', probability: 0.02 }
      ],
      scanner: [
        { type: 'barcodeUnreadable', probability: 0.15 },
        { type: 'cameraError', probability: 0.03 }
      ],
      nfc: [
        { type: 'tagNotSupported', probability: 0.1 },
        { type: 'readError', probability: 0.08 }
      ],
      cashDrawer: [
        { type: 'drawerJammed', probability: 0.02 }
      ],
      cardReader: [
        { type: 'cardReadError', probability: 0.1 },
        { type: 'connectionTimeout', probability: 0.05 }
      ],
      scale: [
        { type: 'calibrationError', probability: 0.05 },
        { type: 'weightUnstable', probability: 0.1 }
      ]
    };

    return errorSimulations[deviceType] || [
      { type: 'genericError', probability: 0.05 }
    ];
  }
}

module.exports = HardwareAnalyzer;