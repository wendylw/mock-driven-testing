const express = require('express');
const router = express.Router();
const ScenarioService = require('./service');
const scenarioTemplates = require('./templates');

const scenarioService = new ScenarioService();

router.get('/', async (req, res) => {
  try {
    const scenarios = await scenarioService.getAll();
    res.json({
      scenarios,
      total: scenarios.length
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch scenarios',
      message: error.message
    });
  }
});

router.get('/active', async (req, res) => {
  try {
    const activeScenario = await scenarioService.getActive();
    if (!activeScenario) {
      return res.status(404).json({
        error: 'No active scenario',
        message: 'No scenario is currently active'
      });
    }
    res.json(activeScenario);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch active scenario',
      message: error.message
    });
  }
});

router.get('/templates', (req, res) => {
  const templates = {
    base: Object.keys(scenarioTemplates.base),
    business: Object.keys(scenarioTemplates.business)
  };
  res.json(templates);
});

router.get('/stats', async (req, res) => {
  try {
    const stats = await scenarioService.getScenarioStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch scenario stats',
      message: error.message
    });
  }
});

router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({
        error: 'Search query required',
        message: 'Please provide a search query parameter "q"'
      });
    }
    
    const scenarios = await scenarioService.search(q);
    res.json({
      scenarios,
      total: scenarios.length,
      query: q
    });
  } catch (error) {
    res.status(500).json({
      error: 'Search failed',
      message: error.message
    });
  }
});

router.get('/tag/:tag', async (req, res) => {
  try {
    const { tag } = req.params;
    const scenarios = await scenarioService.getByTag(tag);
    res.json({
      scenarios,
      total: scenarios.length,
      tag
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch scenarios by tag',
      message: error.message
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const scenario = await scenarioService.getById(req.params.id);
    if (!scenario) {
      return res.status(404).json({
        error: 'Scenario not found',
        message: `No scenario found with ID: ${req.params.id}`
      });
    }
    res.json(scenario);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch scenario',
      message: error.message
    });
  }
});

router.get('/:id/full', async (req, res) => {
  try {
    const fullScenario = await scenarioService.getFullScenario(req.params.id);
    if (!fullScenario) {
      return res.status(404).json({
        error: 'Scenario not found',
        message: `No scenario found with ID: ${req.params.id}`
      });
    }
    res.json(fullScenario);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch full scenario',
      message: error.message
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const scenario = await scenarioService.create(req.body);
    res.status(201).json(scenario);
  } catch (error) {
    res.status(400).json({
      error: 'Failed to create scenario',
      message: error.message
    });
  }
});

router.post('/from-template', async (req, res) => {
  try {
    const { templatePath, customizations } = req.body;
    if (!templatePath) {
      return res.status(400).json({
        error: 'Template path required',
        message: 'Please provide a templatePath'
      });
    }

    const templateData = scenarioTemplates.createScenarioFromTemplate(
      templatePath,
      customizations
    );
    
    const scenario = await scenarioService.create(templateData);
    res.status(201).json(scenario);
  } catch (error) {
    res.status(400).json({
      error: 'Failed to create scenario from template',
      message: error.message
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const scenario = await scenarioService.update(req.params.id, req.body);
    res.json(scenario);
  } catch (error) {
    res.status(400).json({
      error: 'Failed to update scenario',
      message: error.message
    });
  }
});

router.post('/:id/activate', async (req, res) => {
  try {
    const scenario = await scenarioService.activate(req.params.id);
    res.json({
      message: 'Scenario activated successfully',
      scenario
    });
  } catch (error) {
    res.status(400).json({
      error: 'Failed to activate scenario',
      message: error.message
    });
  }
});

router.post('/:id/clone', async (req, res) => {
  try {
    const { name } = req.body;
    const clonedScenario = await scenarioService.clone(req.params.id, name);
    res.status(201).json(clonedScenario);
  } catch (error) {
    res.status(400).json({
      error: 'Failed to clone scenario',
      message: error.message
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await scenarioService.delete(req.params.id);
    res.json({
      message: 'Scenario deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      error: 'Failed to delete scenario',
      message: error.message
    });
  }
});

module.exports = router;