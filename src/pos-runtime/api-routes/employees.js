/**
 * Employee Management API Routes
 */

const express = require('express');

module.exports = (stateManager, config) => {
  const router = express.Router();

  router.get('/', async (req, res) => {
    try {
      const employees = await stateManager.getAll('employees');
      res.json({ success: true, data: employees });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch employees', message: error.message });
    }
  });

  return router;
};