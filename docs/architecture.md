# Architecture Overview

## System Design

The Mock-Driven Testing system consists of three main components:

### 1. Dependency Analyzer
- **Purpose**: Analyzes repository code to understand dependencies
- **Process**:
  - Parses `package.json` for explicit dependencies
  - Uses AST parsing to find imports and API calls
  - Identifies service-to-service communication patterns
  - Generates a comprehensive dependency report

### 2. Mock Generator
- **Purpose**: Creates appropriate mocks based on analysis
- **Strategies**:
  - **API Response Mocks**: For frontend apps calling REST APIs
  - **Service Stubs**: For backend services with internal dependencies
  - **External API Mocks**: For third-party service integrations
- **Output**: Ready-to-use mock files with realistic data

### 3. Template System
- **Purpose**: Ensures consistent mock generation
- **Templates**:
  - API mock handlers (MSW)
  - Service stubs (Jest/Sinon)
  - Test setup utilities
- **Customizable**: Easy to add new patterns

## Data Flow

```
Repository → Analyzer → Report → Generator → Mocks
                ↓                    ↓
          Dependencies          Templates
```

## Mock Strategies

### API Response Mocks (Frontend)
- Uses Mock Service Worker (MSW)
- Intercepts HTTP requests
- Returns realistic responses
- Supports error scenarios

### Service Stubs (Backend)
- Uses Jest mock functions
- Replaces service dependencies
- Maintains function signatures
- Enables behavior verification

### External API Mocks
- Combines MSW and nock
- Simulates third-party APIs
- Handles authentication
- Supports rate limiting scenarios

## Benefits

1. **Isolation**: Test each repository independently
2. **Speed**: No need to run entire system
3. **Reliability**: Consistent test environments
4. **Coverage**: Test edge cases easily
5. **Maintenance**: Auto-generated, always up-to-date