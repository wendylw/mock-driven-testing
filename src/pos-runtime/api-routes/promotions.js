/**
 * Promotions API Routes
 */

const express = require('express');

module.exports = (stateManager, config) => {
  const router = express.Router();

  router.get('/', async (req, res) => {
    try {
      const promotions = await stateManager.getAll('promotions');
      res.json({ success: true, data: promotions });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch promotions', message: error.message });
    }
  });

  return router;
};