const EventEmitter = require('events');

class ScenarioSwitcher extends EventEmitter {
  constructor(scenarioService, mockService) {
    super();
    this.scenarioService = scenarioService;
    this.mockService = mockService;
    this.currentScenario = null;
    this.switchHistory = [];
    this.switchInProgress = false;
  }

  async initialize() {
    try {
      this.currentScenario = await this.scenarioService.getActive();
      if (this.currentScenario) {
        await this.applyScenario(this.currentScenario);
        console.log(`Initialized with scenario: ${this.currentScenario.name}`);
      }
    } catch (error) {
      console.error('Error initializing scenario switcher:', error.message);
    }
  }

  async switchToScenario(scenarioId) {
    if (this.switchInProgress) {
      throw new Error('Scenario switch already in progress');
    }

    const startTime = Date.now();
    this.switchInProgress = true;
    
    try {
      const scenario = await this.scenarioService.getById(scenarioId);
      if (!scenario) {
        throw new Error('Scenario not found');
      }

      this.recordSwitch(this.currentScenario, scenario);

      if (this.currentScenario) {
        await this.deactivateScenario(this.currentScenario);
      }

      await this.activateScenario(scenario);
      await this.applyScenario(scenario);

      this.currentScenario = scenario;

      const duration = Date.now() - startTime;
      this.emit('scenarioSwitched', {
        from: this.currentScenario,
        to: scenario,
        duration
      });

      console.log(`Switched to scenario: ${scenario.name} (${duration}ms)`);
      
      return scenario;
    } catch (error) {
      console.error('Error switching scenario:', error.message);
      this.emit('scenarioSwitchError', error);
      throw error;
    } finally {
      this.switchInProgress = false;
    }
  }

  async applyScenario(scenario) {
    const fullScenario = await this.scenarioService.getFullScenario(scenario.id);
    if (!fullScenario) {
      throw new Error('Failed to get full scenario data');
    }

    const appliedMocks = [];
    const errors = [];

    for (const scenarioMock of fullScenario.mocks) {
      try {
        const mock = await this.mockService.getById(scenarioMock.mockId);
        if (mock) {
          const updatedMock = this.applyMockOverrides(
            mock, 
            scenarioMock.overrides, 
            fullScenario.variables
          );
          await this.mockService.update(mock.id, updatedMock);
          appliedMocks.push(mock.id);
        } else {
          errors.push(`Mock ${scenarioMock.mockId} not found`);
        }
      } catch (error) {
        errors.push(`Error applying mock ${scenarioMock.mockId}: ${error.message}`);
      }
    }

    if (errors.length > 0) {
      console.warn('Scenario application warnings:', errors);
    }

    return {
      appliedMocks: appliedMocks.length,
      errors
    };
  }

  applyMockOverrides(mock, overrides, variables) {
    if (!overrides) return mock;

    const merged = JSON.parse(JSON.stringify(mock));
    
    if (overrides.response) {
      merged.response = {
        ...merged.response,
        ...overrides.response
      };
      
      if (overrides.response.headers) {
        merged.response.headers = {
          ...merged.response.headers,
          ...overrides.response.headers
        };
      }
      
      if (overrides.response.body !== undefined) {
        merged.response.body = overrides.response.body;
      }
    }

    const interpolated = this.scenarioService.interpolateVariables(merged, variables);
    return interpolated;
  }

  recordSwitch(from, to) {
    this.switchHistory.push({
      from: from?.id,
      fromName: from?.name,
      to: to?.id,
      toName: to?.name,
      timestamp: new Date().toISOString()
    });

    if (this.switchHistory.length > 100) {
      this.switchHistory = this.switchHistory.slice(-100);
    }
  }

  async deactivateScenario(scenario) {
    this.emit('scenarioDeactivating', scenario);
  }

  async activateScenario(scenario) {
    await this.scenarioService.activate(scenario.id);
    this.emit('scenarioActivating', scenario);
  }

  getSwitchHistory(limit = 10) {
    return this.switchHistory.slice(-limit);
  }

  getCurrentScenario() {
    return this.currentScenario;
  }

  async quickSwitch(scenarioName) {
    const scenarios = await this.scenarioService.search(scenarioName);
    const exactMatch = scenarios.find(s => s.name === scenarioName);
    
    if (exactMatch) {
      return await this.switchToScenario(exactMatch.id);
    }
    
    if (scenarios.length === 1) {
      return await this.switchToScenario(scenarios[0].id);
    }
    
    if (scenarios.length === 0) {
      throw new Error(`No scenario found matching: ${scenarioName}`);
    }
    
    throw new Error(`Multiple scenarios found matching: ${scenarioName}. Please be more specific.`);
  }

  async resetToDefault() {
    const defaultScenario = await this.scenarioService.getByTag('default');
    if (defaultScenario && defaultScenario.length > 0) {
      return await this.switchToScenario(defaultScenario[0].id);
    }
    
    const normalScenario = await this.scenarioService.getByTag('normal');
    if (normalScenario && normalScenario.length > 0) {
      return await this.switchToScenario(normalScenario[0].id);
    }
    
    throw new Error('No default scenario found');
  }

  getStats() {
    const recentSwitches = this.switchHistory.slice(-10);
    const avgSwitchTime = recentSwitches.reduce((sum, sw) => {
      return sum + (sw.duration || 0);
    }, 0) / (recentSwitches.length || 1);

    return {
      currentScenario: this.currentScenario?.name || 'None',
      totalSwitches: this.switchHistory.length,
      averageSwitchTime: Math.round(avgSwitchTime),
      lastSwitch: this.switchHistory[this.switchHistory.length - 1],
      switchInProgress: this.switchInProgress
    };
  }
}

module.exports = ScenarioSwitcher;