const fs = require('fs-extra');
const path = require('path');
const Handlebars = require('../utils/handlebars-helpers');

class MockGenerator {
  constructor(analysisReport, repoConfig) {
    this.report = analysisReport;
    this.config = repoConfig;
    this.templates = this.loadTemplates();
  }

  loadTemplates() {
    const templateDir = path.join(__dirname, '../templates');
    return {
      apiMock: fs.readFileSync(path.join(templateDir, 'api-mock.hbs'), 'utf-8'),
      serviceMock: fs.readFileSync(path.join(templateDir, 'service-mock.hbs'), 'utf-8'),
      testSetup: fs.readFileSync(path.join(templateDir, 'test-setup.hbs'), 'utf-8')
    };
  }

  async generate() {
    console.log(`🤖 Generating mocks for ${this.report.repository}`);
    
    const outputDir = path.join('generated', this.report.repository);
    await fs.ensureDir(outputDir);

    // Generate mocks based on strategy
    switch (this.config.mockStrategy) {
      case 'api-responses':
        await this.generateApiMocks(outputDir);
        break;
      case 'service-stubs':
        await this.generateServiceStubs(outputDir);
        break;
      case 'external-api-mocks':
        await this.generateExternalApiMocks(outputDir);
        break;
    }

    // Generate test setup file
    await this.generateTestSetup(outputDir);
    
    console.log(`✅ Mocks generated at: ${outputDir}`);
  }

  async generateApiMocks(outputDir) {
    const apiMocks = [];
    
    // Generate mock for each API endpoint
    Object.entries(this.report.apiCalls).forEach(([endpoint, calls]) => {
      if (endpoint.startsWith('/') || endpoint.includes('http')) {
        apiMocks.push({
          endpoint,
          method: calls[0]?.method || 'get',
          mockData: this.generateMockData(endpoint)
        });
      }
    });

    const template = Handlebars.compile(this.templates.apiMock);
    const content = template({ 
      repository: this.report.repository,
      mocks: apiMocks 
    });
    
    await fs.writeFile(
      path.join(outputDir, 'api-mocks.js'),
      content
    );
  }

  async generateServiceStubs(outputDir) {
    const serviceStubs = [];
    
    // Generate stubs for each service
    this.report.dependencies.forEach(dep => {
      if (dep.includes('service')) {
        serviceStubs.push({
          serviceName: dep,
          methods: this.generateServiceMethods(dep)
        });
      }
    });

    const template = Handlebars.compile(this.templates.serviceMock);
    const content = template({ 
      repository: this.report.repository,
      services: serviceStubs 
    });
    
    await fs.writeFile(
      path.join(outputDir, 'service-stubs.js'),
      content
    );
  }

  async generateExternalApiMocks(outputDir) {
    // Similar to API mocks but for external services
    await this.generateApiMocks(outputDir);
  }

  async generateTestSetup(outputDir) {
    const template = Handlebars.compile(this.templates.testSetup);
    const content = template({
      repository: this.report.repository,
      mockStrategy: this.config.mockStrategy,
      dependencies: this.report.dependencies
    });
    
    await fs.writeFile(
      path.join(outputDir, 'setup-tests.js'),
      content
    );
  }

  generateMockData(endpoint) {
    // Generate realistic mock data based on endpoint
    const mockPatterns = {
      user: {
        id: 1,
        name: 'Test User',
        email: 'test@example.com'
      },
      product: {
        id: 1,
        name: 'Test Product',
        price: 99.99,
        stock: 100
      },
      order: {
        id: 'ORD-001',
        status: 'pending',
        total: 199.99,
        items: []
      }
    };

    // Match endpoint to pattern
    for (const [pattern, data] of Object.entries(mockPatterns)) {
      if (endpoint.toLowerCase().includes(pattern)) {
        return data;
      }
    }

    // Default mock data
    return {
      success: true,
      data: {},
      message: 'Mock response'
    };
  }

  generateServiceMethods(serviceName) {
    // Generate common service methods
    const commonMethods = ['find', 'findOne', 'create', 'update', 'delete'];
    
    return commonMethods.map(method => ({
      name: method,
      mockImplementation: `jest.fn().mockResolvedValue(mockData)`
    }));
  }
}

module.exports = MockGenerator;