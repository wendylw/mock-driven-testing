const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function generateId() {
  return crypto.randomBytes(16).toString('hex');
}

class ScenarioStorage {
  constructor() {
    this.dataDir = path.join(__dirname, '../../../data');
    this.scenariosFile = path.join(this.dataDir, 'scenarios.json');
    this.scenarios = this.loadScenarios();
  }

  loadScenarios() {
    try {
      if (fs.existsSync(this.scenariosFile)) {
        const data = fs.readFileSync(this.scenariosFile, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading scenarios:', error.message);
    }
    return [];
  }

  saveScenarios() {
    try {
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
      }
      fs.writeFileSync(this.scenariosFile, JSON.stringify(this.scenarios, null, 2));
      console.log('Scenarios saved to file');
    } catch (error) {
      console.error('Error saving scenarios:', error.message);
      throw error;
    }
  }

  async createScenario(scenarioData) {
    const scenario = {
      id: generateId(),
      ...scenarioData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.scenarios.push(scenario);
    this.saveScenarios();
    
    console.log(`Scenario created: ${scenario.id} - ${scenario.name}`);
    return scenario;
  }

  async getScenarioById(id) {
    return this.scenarios.find(scenario => scenario.id === id);
  }

  async getAllScenarios() {
    return this.scenarios;
  }

  async getActiveScenario() {
    return this.scenarios.find(scenario => scenario.active);
  }

  async updateScenario(id, updateData) {
    const index = this.scenarios.findIndex(scenario => scenario.id === id);
    if (index === -1) {
      throw new Error('Scenario not found');
    }

    this.scenarios[index] = {
      ...this.scenarios[index],
      ...updateData,
      id,
      updatedAt: new Date().toISOString()
    };

    this.saveScenarios();
    console.log(`Scenario updated: ${id}`);
    return this.scenarios[index];
  }

  async deleteScenario(id) {
    const index = this.scenarios.findIndex(scenario => scenario.id === id);
    if (index === -1) {
      throw new Error('Scenario not found');
    }

    this.scenarios.splice(index, 1);
    this.saveScenarios();
    console.log(`Scenario deleted: ${id}`);
  }

  async activateScenario(id) {
    this.scenarios.forEach(scenario => {
      scenario.active = false;
    });

    const scenario = this.scenarios.find(s => s.id === id);
    if (!scenario) {
      throw new Error('Scenario not found');
    }

    scenario.active = true;
    scenario.updatedAt = new Date().toISOString();
    this.saveScenarios();

    console.log(`Scenario activated: ${id} - ${scenario.name}`);
    return scenario;
  }

  async getScenariosByTag(tag) {
    return this.scenarios.filter(scenario => 
      scenario.tags && scenario.tags.includes(tag)
    );
  }

  async searchScenarios(query) {
    const lowerQuery = query.toLowerCase();
    return this.scenarios.filter(scenario => 
      scenario.name.toLowerCase().includes(lowerQuery) ||
      (scenario.description && scenario.description.toLowerCase().includes(lowerQuery)) ||
      (scenario.tags && scenario.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
    );
  }

  async cloneScenario(id, newName) {
    const original = await this.getScenarioById(id);
    if (!original) {
      throw new Error('Scenario not found');
    }

    const cloned = {
      ...original,
      id: generateId(),
      name: newName || `${original.name} (Copy)`,
      active: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.scenarios.push(cloned);
    this.saveScenarios();
    
    console.log(`Scenario cloned: ${original.name} -> ${cloned.name}`);
    return cloned;
  }

  async getScenarioChildren(parentId) {
    return this.scenarios.filter(scenario => scenario.parent === parentId);
  }

  async getScenarioWithMocks(id, mockStorage) {
    const scenario = await this.getScenarioById(id);
    if (!scenario) {
      return null;
    }

    const scenarioWithMocks = { ...scenario, mockDetails: [] };

    for (const mockRef of scenario.mocks) {
      const mock = await mockStorage.getMockById(mockRef.mockId);
      if (mock) {
        scenarioWithMocks.mockDetails.push({
          ...mock,
          overrides: mockRef.overrides
        });
      }
    }

    return scenarioWithMocks;
  }
}

module.exports = ScenarioStorage;