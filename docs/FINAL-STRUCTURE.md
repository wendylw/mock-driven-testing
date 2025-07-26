# 🎯 Mock-Driven Testing - Project Structure

## 📁 Root Files

```
mock-driven-testing/
├── proxy-final.js              # Main proxy server (port 3001)
├── parameterized-patch.js      # Parameterized mock enhancement  
├── package.json               # Project configuration
├── proxy.log                  # Runtime logs
└── README.md                  # Main documentation
```

## 📁 Documentation

```
docs/
├── MOCK-DRIVEN-TESTING-DOCUMENTATION.md  # Complete feature guide
└── FINAL-STRUCTURE.md                    # This file
```

## 📁 Mock System Components

```
parameterized-mocks/
├── entities/
│   ├── DataGenerator.js       # Data generation engine
│   ├── DynamicIDHandler.js    # ID handling utilities  
│   └── TemplateEngine.js      # Template processing
└── README.md                  # Mock system documentation
```

## 📁 Generated Content

```
generated/beep-v1-webapp/      # Real-time generated mocks
└── api-mocks-realtime.js      # Live mock handlers

captured-data/                 # API capture history  
├── final-capture-*.json       # Recent capture files
└── .gitkeep
```

## 🚀 Quick Start

### 1. Start Proxy Server
```bash
node proxy-final.js
```

### 2. Access Application
```bash
# Normal mode - captures real API data
http://coffee.beep.local.shub.us:3001/

# Mock mode - uses parameterized mocks
http://coffee.beep.local.shub.us:3001/api/users?_mock=1

# Demo mode - shows mock capabilities  
http://coffee.beep.local.shub.us:3001/api/demo?_demo=1
```

### 3. Monitor System
```bash
# View capture statistics
http://localhost:3001/__mock_stats

# Check parameterized patch info
http://localhost:3001/__parameterized_info
```

## ✅ Core Features

### 🎯 Live API Capture
- Automatically records real API responses during normal usage
- Stores captured data in `captured-data/` directory
- Updates real-time mock handlers in `generated/beep-v1-webapp/api-mocks-realtime.js`

### 🔧 Parameterized Mock Generation
- Detects GraphQL variables, REST path parameters, and query parameters
- Generates consistent data based on input parameters using hash functions
- Creates elegant Map-based mock handlers instead of if-else chains

### 🌐 Universal API Support  
- **GraphQL**: Extracts variables like `productId`, `orderId`, `storeId`
- **REST Paths**: Identifies ID segments in URLs (e.g., `/api/users/12345`)
- **Query Params**: Recognizes important parameters like `shippingType`, `business`

### 🔄 Real-time Integration
- Zero configuration - works immediately with existing proxy
- Non-invasive - all existing functionality preserved
- Live updates - captured data automatically becomes available as mocks

## 🛠️ Technical Implementation

### Parameter Recognition Logic
```javascript
// GraphQL variables
paramKey = body.variables.productId || body.variables.orderId

// REST path segments  
paramKey = pathSegments.find(segment => segment.length > 10)

// Query parameters
paramKey = queryParams.get('shippingType') || queryParams.get('business')
```

### Deterministic Data Generation
```javascript
// Consistent hash-based generation
const hash = this.hashId(productId, seed);
const price = 5.50 + (hash % 20); // Always same price for same ID
```

### Elegant Mock Handlers
```javascript
// Map-based parameter lookup
const paramMap = {
  "67287c47e097f800076d2c77": { /* Mocha data */ },
  "67287951e097f800076d1bb5": { /* Espresso data */ }
};
const responseData = paramMap[paramValue] || paramMap[defaultValue];
```

## 📊 File Organization Benefits

1. **Clean Root**: Only essential files in root directory
2. **Organized Docs**: All documentation centralized in `docs/`
3. **Modular Components**: Mock system cleanly separated
4. **Auto-Generated**: Generated content clearly identified
5. **Historical Data**: Captured API data preserved for reference

This structure provides a clean, maintainable codebase that's easy to understand and extend.