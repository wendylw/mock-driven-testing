const crypto = require('crypto');

function generateId() {
  return crypto.randomBytes(16).toString('hex');
}

class Scenario {
  constructor(data = {}) {
    this.id = data.id || generateId();
    this.name = data.name;
    this.description = data.description || '';
    this.tags = data.tags || [];
    this.active = data.active !== false;
    this.parent = data.parent || null;
    this.variables = data.variables || {};
    this.mocks = data.mocks || [];
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  mergeWithParent(parentScenario) {
    if (!parentScenario) return this;

    return new Scenario({
      ...this,
      variables: {
        ...parentScenario.variables,
        ...this.variables
      },
      mocks: this.mergeMocks(parentScenario.mocks, this.mocks)
    });
  }

  mergeMocks(parentMocks, childMocks) {
    const mergedMocks = [...parentMocks];
    
    childMocks.forEach(childMock => {
      const existingIndex = mergedMocks.findIndex(
        m => m.mockId === childMock.mockId
      );
      
      if (existingIndex >= 0) {
        mergedMocks[existingIndex] = this.mergeMockOverrides(
          mergedMocks[existingIndex],
          childMock
        );
      } else {
        mergedMocks.push(childMock);
      }
    });

    return mergedMocks;
  }

  mergeMockOverrides(baseMock, overrideMock) {
    return {
      ...baseMock,
      ...overrideMock,
      overrides: {
        ...baseMock.overrides,
        ...overrideMock.overrides
      }
    };
  }

  validate() {
    const errors = [];

    if (!this.name || typeof this.name !== 'string') {
      errors.push('Scenario name is required and must be a string');
    }

    if (!Array.isArray(this.tags)) {
      errors.push('Tags must be an array');
    }

    if (typeof this.active !== 'boolean') {
      errors.push('Active must be a boolean');
    }

    if (this.parent && typeof this.parent !== 'string') {
      errors.push('Parent must be a string ID or null');
    }

    if (typeof this.variables !== 'object' || this.variables === null) {
      errors.push('Variables must be an object');
    }

    if (!Array.isArray(this.mocks)) {
      errors.push('Mocks must be an array');
    }

    this.mocks.forEach((mock, index) => {
      if (!mock.mockId) {
        errors.push(`Mock at index ${index} must have a mockId`);
      }
    });

    return errors;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      tags: this.tags,
      active: this.active,
      parent: this.parent,
      variables: this.variables,
      mocks: this.mocks,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Scenario;