const express = require('express');
const router = express.Router();
const MockService = require('./service');
const MockValidator = require('./validator');
const logger = require('../utils/logger');

const mockService = new MockService();

// 获取Mock列表
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const result = await mockService.list({ 
      page: parseInt(page), 
      limit: parseInt(limit), 
      search 
    });
    
    res.json(result);
  } catch (error) {
    logger.error('GET /api/mocks error:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch mocks',
      message: error.message 
    });
  }
});

// 获取单个Mock
router.get('/:id', async (req, res) => {
  try {
    const mock = await mockService.getById(req.params.id);
    res.json(mock);
  } catch (error) {
    logger.error(`GET /api/mocks/${req.params.id} error:`, error.message);
    
    if (error.message === 'Mock not found') {
      res.status(404).json({ 
        error: 'Mock not found',
        message: error.message 
      });
    } else {
      res.status(500).json({ 
        error: 'Failed to fetch mock',
        message: error.message 
      });
    }
  }
});

// 创建Mock
router.post('/', MockValidator.validateMiddleware, async (req, res) => {
  try {
    const mock = await mockService.create(req.body);
    res.status(201).json(mock);
  } catch (error) {
    logger.error('POST /api/mocks error:', error.message);
    res.status(400).json({ 
      error: 'Failed to create mock',
      message: error.message 
    });
  }
});

// 更新Mock
router.put('/:id', MockValidator.validateMiddleware, async (req, res) => {
  try {
    const mock = await mockService.update(req.params.id, req.body);
    res.json(mock);
  } catch (error) {
    logger.error(`PUT /api/mocks/${req.params.id} error:`, error.message);
    
    if (error.message === 'Mock not found') {
      res.status(404).json({ 
        error: 'Mock not found',
        message: error.message 
      });
    } else {
      res.status(400).json({ 
        error: 'Failed to update mock',
        message: error.message 
      });
    }
  }
});

// 删除Mock
router.delete('/:id', async (req, res) => {
  try {
    await mockService.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    logger.error(`DELETE /api/mocks/${req.params.id} error:`, error.message);
    
    if (error.message === 'Mock not found') {
      res.status(404).json({ 
        error: 'Mock not found',
        message: error.message 
      });
    } else {
      res.status(500).json({ 
        error: 'Failed to delete mock',
        message: error.message 
      });
    }
  }
});

// 删除所有Mock（用于测试）
router.delete('/', async (req, res) => {
  try {
    await mockService.deleteAll();
    res.status(204).send();
  } catch (error) {
    logger.error('DELETE /api/mocks error:', error.message);
    res.status(500).json({ 
      error: 'Failed to delete all mocks',
      message: error.message 
    });
  }
});

// 导出Mock
router.get('/export/all', async (req, res) => {
  try {
    const data = await mockService.export();
    res.header('Content-Type', 'application/json');
    res.header('Content-Disposition', 'attachment; filename=mocks.json');
    res.send(JSON.stringify(data, null, 2));
  } catch (error) {
    logger.error('GET /api/mocks/export/all error:', error.message);
    res.status(500).json({ 
      error: 'Failed to export mocks',
      message: error.message 
    });
  }
});

// 导入Mock
router.post('/import', async (req, res) => {
  try {
    const result = await mockService.import(req.body);
    res.json(result);
  } catch (error) {
    logger.error('POST /api/mocks/import error:', error.message);
    res.status(400).json({ 
      error: 'Failed to import mocks',
      message: error.message 
    });
  }
});

// 获取活跃的Mock（内部API）
router.get('/internal/active', async (req, res) => {
  try {
    const mocks = await mockService.getActiveMocks();
    res.json(mocks);
  } catch (error) {
    logger.error('GET /api/mocks/internal/active error:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch active mocks',
      message: error.message 
    });
  }
});

// 获取请求日志
router.get('/logs/requests', async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const result = await mockService.getRequestLogs({ 
      page: parseInt(page), 
      limit: parseInt(limit) 
    });
    
    res.json(result);
  } catch (error) {
    logger.error('GET /api/mocks/logs/requests error:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch request logs',
      message: error.message 
    });
  }
});

module.exports = router;