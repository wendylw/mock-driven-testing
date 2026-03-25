const ScenarioStorage = require('./storage');
const Scenario = require('./model');

class ScenarioService {
  constructor() {
    this.storage = new ScenarioStorage();
    this.scenarioCache = new Map();
  }

  async create(scenarioData) {
    const scenario = new Scenario(scenarioData);
    
    const validationErrors = scenario.validate();
    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }

    if (scenario.parent) {
      const parentExists = await this.storage.getScenarioById(scenario.parent);
      if (!parentExists) {
        throw new Error('Parent scenario not found');
      }
    }

    return await this.storage.createScenario(scenario.toJSON());
  }

  async getById(id) {
    return await this.storage.getScenarioById(id);
  }

  async getAll() {
    return await this.storage.getAllScenarios();
  }

  async getActive() {
    return await this.storage.getActiveScenario();
  }

  async update(id, updateData) {
    const existing = await this.storage.getScenarioById(id);
    if (!existing) {
      throw new Error('Scenario not found');
    }

    const updated = new Scenario({
      ...existing,
      ...updateData,
      id,
      updatedAt: new Date().toISOString()
    });

    const validationErrors = updated.validate();
    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }

    this.clearCache(id);
    return await this.storage.updateScenario(id, updated.toJSON());
  }

  async delete(id) {
    const children = await this.storage.getScenarioChildren(id);
    if (children.length > 0) {
      throw new Error('Cannot delete scenario with children');
    }

    this.clearCache(id);
    return await this.storage.deleteScenario(id);
  }

  async activate(id) {
    this.clearCache();
    return await this.storage.activateScenario(id);
  }

  async clone(id, newName) {
    return await this.storage.cloneScenario(id, newName);
  }

  async getByTag(tag) {
    return await this.storage.getScenariosByTag(tag);
  }

  async search(query) {
    return await this.storage.searchScenarios(query);
  }

  async getFullScenario(id) {
    if (this.scenarioCache.has(id)) {
      return this.scenarioCache.get(id);
    }

    const scenario = await this.storage.getScenarioById(id);
    if (!scenario) {
      return null;
    }

    const chain = await this.resolveInheritanceChain(scenario);
    const fullScenario = this.mergeScenarioChain(chain);

    this.scenarioCache.set(id, fullScenario);
    return fullScenario;
  }

  async resolveInheritanceChain(scenario) {
    const chain = [scenario];
    let current = scenario;
    const visited = new Set([scenario.id]);

    while (current.parent) {
      const parent = await this.storage.getScenarioById(current.parent);
      if (!parent) break;

      if (visited.has(parent.id)) {
        throw new Error('Circular dependency detected in scenario inheritance');
      }

      visited.add(parent.id);
      chain.unshift(parent);
      current = parent;
    }

    return chain;
  }

  mergeScenarioChain(chain) {
    if (chain.length === 0) return null;
    if (chain.length === 1) return new Scenario(chain[0]);

    let merged = new Scenario(chain[0]);
    
    for (let i = 1; i < chain.length; i++) {
      const current = new Scenario(chain[i]);
      merged = current.mergeWithParent(merged);
    }

    return merged;
  }

  interpolateVariables(obj, variables = {}) {
    const builtinVars = {
      now: () => new Date().toISOString(),
      timestamp: () => Date.now(),
      random: () => Math.random(),
      uuid: () => require('crypto').randomBytes(16).toString('hex'),
      date: () => new Date().toLocaleDateString(),
      time: () => new Date().toLocaleTimeString()
    };

    const allVars = { ...variables };

    const interpolate = (value) => {
      if (typeof value === 'string') {
        return value.replace(/\{\{(\w+)(?:\((.*?)\))?\}\}/g, (match, varName, args) => {
          if (builtinVars[varName]) {
            if (typeof builtinVars[varName] === 'function') {
              return builtinVars[varName](args);
            }
            return builtinVars[varName];
          }
          
          if (allVars.hasOwnProperty(varName)) {
            return allVars[varName];
          }
          
          return match;
        });
      }
      
      if (Array.isArray(value)) {
        return value.map(interpolate);
      }
      
      if (typeof value === 'object' && value !== null) {
        const result = {};
        for (const key in value) {
          result[key] = interpolate(value[key]);
        }
        return result;
      }
      
      return value;
    };

    return interpolate(obj);
  }

  clearCache(id = null) {
    if (id) {
      this.scenarioCache.delete(id);
      for (const [key, scenario] of this.scenarioCache) {
        if (scenario.parent === id) {
          this.scenarioCache.delete(key);
        }
      }
    } else {
      this.scenarioCache.clear();
    }
  }

  async validateScenarioMocks(scenarioId, mockService) {
    const scenario = await this.getFullScenario(scenarioId);
    if (!scenario) {
      throw new Error('Scenario not found');
    }

    const errors = [];
    for (const mockRef of scenario.mocks) {
      const mock = await mockService.getById(mockRef.mockId);
      if (!mock) {
        errors.push(`Mock ${mockRef.mockId} not found`);
      }
    }

    return errors;
  }

  async getScenarioStats() {
    const scenarios = await this.storage.getAllScenarios();
    const active = scenarios.find(s => s.active);
    
    const tagCounts = {};
    scenarios.forEach(scenario => {
      (scenario.tags || []).forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    return {
      total: scenarios.length,
      activeScenario: active ? active.name : null,
      tagDistribution: tagCounts,
      withParent: scenarios.filter(s => s.parent).length,
      withMocks: scenarios.filter(s => s.mocks && s.mocks.length > 0).length
    };
  }
}

module.exports = ScenarioService;