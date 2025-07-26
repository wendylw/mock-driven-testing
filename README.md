# Mock-Driven Testing Revolution

An AI-powered solution to generate stubs and mocks for all 45 StoreHub repositories, making complex systems independently testable.

## 🎯 Problem Statement

StoreHub's 45 repositories are difficult to test due to complex interdependencies. Testing often requires the entire system to be running, making isolated unit and integration testing nearly impossible.

## 💡 Solution

This project provides:
- **Automatic dependency analysis** across all StoreHub repos
- **AI-generated mocks and stubs** that mimic real service behaviors
- **Realistic test doubles** based on actual API patterns
- **Zero-config mock generation** for immediate testing
- **Isolated testing capabilities** for every repository

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/wendylw/mock-driven-testing.git

# Install dependencies
npm install

# Analyze a StoreHub repository
npm run analyze -- --repo beep-v1-webapp

# Generate mocks for a repository
npm run generate-mocks -- --repo beep-v1-webapp

# Generate mocks for all repositories
npm run generate-all-mocks
```

## 📁 Project Structure

```
mock-driven-testing/
├── README.md              # Project documentation
├── package.json           # Node.js configuration
├── config/
│   └── repos.json         # StoreHub repositories configuration
├── src/
│   ├── analyzer/          # Dependency analysis engine
│   ├── generator/         # Mock generation logic
│   ├── templates/         # Mock templates
│   └── utils/             # Utility functions
├── generated/             # Generated mocks output
│   └── [repo-name]/       # Mocks for each repository
├── examples/              # Usage examples
└── docs/                  # Additional documentation
```

## 🔧 Core Features

### 1. Dependency Analysis
- Scans package.json, import statements, and API calls
- Maps inter-service dependencies
- Identifies external service interfaces

### 2. Mock Generation
- Creates TypeScript/JavaScript mocks
- Generates realistic response data
- Supports async operations and promises
- Handles error scenarios

### 3. Integration Support
- Jest mock modules
- Sinon.js stubs
- MSW (Mock Service Worker) handlers
- Custom mock servers

## 📊 Supported StoreHub Repositories

The system supports all 45 StoreHub repositories including:
- beep-v1-webapp
- backoffice-v1-web
- backoffice-v2-webapp
- core-backend services
- And more...

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.