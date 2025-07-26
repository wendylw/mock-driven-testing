/**
 * Settings API Routes
 */

const express = require('express');

module.exports = (stateManager, config) => {
  const router = express.Router();

  router.get('/system', async (req, res) => {
    try {
      const settings = await stateManager.query('system_settings', {});
      res.json({ success: true, data: settings[0] || {} });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch settings', message: error.message });
    }
  });

  return router;
};