#!/bin/bash

# MDT Phase 1 - 项目初始化脚本

echo "🚀 Initializing MDT Phase 1 - Basic Mock Platform"

# 创建项目目录结构
echo "📁 Creating project structure..."
mkdir -p src/server/{proxy,mock,utils}
mkdir -p src/cli/commands
mkdir -p src/integrations/{jest,cypress}
mkdir -p data/mocks
mkdir -p tests/{unit,integration,fixtures}
mkdir -p examples/basic-demo

# 创建基础文件
echo "📝 Creating base files..."

# package.json
cat > package.json << 'EOF'
{
  "name": "mock-driven-testing",
  "version": "1.0.0",
  "description": "MDT - Intelligent Mock Management Platform",
  "main": "src/server/index.js",
  "scripts": {
    "start": "node src/server/index.js",
    "dev": "nodemon src/server/index.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint src/",
    "format": "prettier --write \"src/**/*.js\""
  },
  "bin": {
    "mdt": "./src/cli/index.js"
  },
  "keywords": ["mock", "testing", "proxy", "api"],
  "author": "MDT Team",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2",
    "http-proxy-middleware": "^2.0.6",
    "sqlite3": "^5.1.6",
    "cors": "^2.8.5",
    "body-parser": "^1.20.2",
    "commander": "^11.0.0",
    "chalk": "^4.1.2",
    "dotenv": "^16.3.1",
    "joi": "^17.10.2",
    "winston": "^3.10.0"
  },
  "devDependencies": {
    "jest": "^29.6.4",
    "supertest": "^6.3.3",
    "nodemon": "^3.0.1",
    "eslint": "^8.49.0",
    "prettier": "^3.0.3"
  }
}
EOF

# .env.example
cat > .env.example << 'EOF'
# Server Configuration
PORT=3001
NODE_ENV=development

# Proxy Configuration
BACKEND_URL=http://localhost:8080
RECORD_MODE=false

# Database
DATABASE_PATH=./data/mdt.db

# Logging
LOG_LEVEL=info
EOF

# .gitignore
cat > .gitignore << 'EOF'
node_modules/
.env
data/*.db
data/mocks/*
!data/mocks/.gitkeep
logs/
*.log
.DS_Store
coverage/
.vscode/
.idea/
EOF

# 创建占位文件
touch data/mocks/.gitkeep

# ESLint配置
cat > .eslintrc.js << 'EOF'
module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'no-console': 'off',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
  }
};
EOF

# Prettier配置
cat > .prettierrc << 'EOF'
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80
}
EOF

# Jest配置
cat > jest.config.js << 'EOF'
module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/cli/**'
  ],
  testMatch: [
    '**/tests/**/*.test.js'
  ],
  verbose: true
};
EOF

echo "✅ Project structure created!"

# 安装依赖提示
echo ""
echo "📦 Next steps:"
echo "1. Run: npm install"
echo "2. Copy .env.example to .env and configure"
echo "3. Start development: npm run dev"
echo ""
echo "📚 Check docs/mdt-platform-plan/PHASE-1-IMPLEMENTATION.md for detailed implementation guide"