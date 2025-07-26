/**
 * Store Management API Routes
 * Handles store information, settings, and register management
 */

const express = require('express');

module.exports = (stateManager, config) => {
  const router = express.Router();

  // Get all stores
  router.get('/', async (req, res) => {
    try {
      const stores = await stateManager.getAll('stores');
      res.json({
        success: true,
        data: stores
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch stores',
        message: error.message
      });
    }
  });

  // Get store by ID
  router.get('/:storeId', async (req, res) => {
    try {
      const store = await stateManager.findById('stores', req.params.storeId);
      if (!store) {
        return res.status(404).json({ error: 'Store not found' });
      }
      res.json({
        success: true,
        data: store
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch store',
        message: error.message
      });
    }
  });

  // Get store settings
  router.get('/:storeId/settings', async (req, res) => {
    try {
      const settings = await stateManager.query('store_settings', {
        where: { storeId: req.params.storeId }
      });
      res.json({
        success: true,
        data: settings[0] || {}
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch settings',
        message: error.message
      });
    }
  });

  // Update store settings
  router.put('/:storeId/settings', async (req, res) => {
    try {
      const { storeId } = req.params;
      const settings = await stateManager.query('store_settings', {
        where: { storeId }
      });

      let result;
      if (settings.length > 0) {
        result = await stateManager.update('store_settings', settings[0].id, {
          ...req.body,
          updatedAt: new Date().toISOString()
        });
      } else {
        result = await stateManager.create('store_settings', {
          id: `settings_${Date.now()}`,
          storeId,
          ...req.body,
          createdAt: new Date().toISOString()
        });
      }

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to update settings',
        message: error.message
      });
    }
  });

  // Get registers
  router.get('/:storeId/registers', async (req, res) => {
    try {
      const registers = await stateManager.query('registers', {
        where: { storeId: req.params.storeId }
      });
      res.json({
        success: true,
        data: registers
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch registers',
        message: error.message
      });
    }
  });

  return router;
};