# 🎯 Mock-Driven Testing

A parameterized mock system that captures and replays real API responses with dynamic parameter-based data generation.

## 🚀 Quick Start

```bash
# Start the proxy server
node proxy-final.js

# Visit the application
http://coffee.beep.local.shub.us:3001/
```

## ✨ Key Features

- **Real API Capture**: Automatically captures live API responses
- **Parameterized Mocks**: Generates different data based on request parameters  
- **GraphQL Support**: Full support for GraphQL queries with variables
- **Zero Dependencies**: Works out of the box with no external packages
- **Live Integration**: Seamlessly integrates with existing proxy-final.js

## 📁 Project Structure

```
mock-driven-testing/
├── proxy-final.js              # Main proxy server (port 3001)
├── parameterized-patch.js      # Parameterized mock enhancement
├── docs/                       # Documentation
│   ├── MOCK-DRIVEN-TESTING-DOCUMENTATION.md
│   └── FINAL-STRUCTURE.md
├── parameterized-mocks/        # Mock system components
│   ├── entities/
│   │   ├── DataGenerator.js    # Data generation engine
│   │   ├── DynamicIDHandler.js # ID handling utilities
│   │   └── TemplateEngine.js   # Template processing
│   └── README.md
├── generated/                  # Auto-generated mocks
│   └── beep-v1-webapp/
│       └── api-mocks-realtime.js
└── captured-data/              # API capture history
```

## 📖 Documentation

- **[Complete Documentation](docs/MOCK-DRIVEN-TESTING-DOCUMENTATION.md)** - Full feature guide and API reference
- **[Project Structure](docs/FINAL-STRUCTURE.md)** - Detailed file organization and usage

## 🎯 Usage Examples

### Basic API Mocking
```bash
# Enable mock mode by adding ?_mock=1
http://localhost:3001/api/users?_mock=1
```

### GraphQL ProductDetail
```bash
curl -X POST "http://localhost:3001/api/gql/ProductDetail?_mock=1" \
  -H "Content-Type: application/json" \
  -d '{"variables":{"productId":"abc123","variationId":"var456"}}'
```

### Demo Mode
```bash
# View parameterized mock capabilities
http://localhost:3001/api/demo?_demo=1
```

## 🔍 Monitoring

- **Statistics**: `http://localhost:3001/__mock_stats`
- **Patch Info**: `http://localhost:3001/__parameterized_info`
- **Logs**: `proxy.log`

## ✅ Core Functionality

1. **Live API Capture**: Automatically records real API responses
2. **Parameter Detection**: Recognizes GraphQL variables, REST path params, and query parameters
3. **Deterministic Generation**: Same input parameters always generate consistent data
4. **Universal Support**: Works with any API endpoint pattern
5. **Non-invasive**: Existing functionality remains completely unchanged

## 🛠️ Technical Features

- **Smart Parameter Recognition**: Automatically detects IDs in GraphQL variables, URL paths, and query strings
- **Stable Data Generation**: Uses hash functions to ensure consistent responses for same parameters  
- **Map-based Lookups**: Elegant parameter mapping instead of if-else chains
- **Real-time Mock Updates**: Captured data automatically generates mock handlers
- **Zero External Dependencies**: Self-contained with no npm package requirements

The system seamlessly captures live API data during normal usage and makes it available as parameterized mocks, enabling comprehensive testing with realistic data patterns.