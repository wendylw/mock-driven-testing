/**
 * Shift Management API Routes
 */

const express = require('express');

module.exports = (stateManager, config) => {
  const router = express.Router();

  // Start shift
  router.post('/start', async (req, res) => {
    try {
      const shift = {
        id: `shift_${Date.now()}`,
        employeeId: req.currentUser?.id,
        storeId: req.body.storeId,
        registerId: req.body.registerId,
        startTime: new Date().toISOString(),
        openingCash: req.body.openingCash || 0,
        status: 'active'
      };

      const created = await stateManager.create('shifts', shift);
      res.status(201).json({ success: true, data: created });
    } catch (error) {
      res.status(400).json({ error: 'Failed to start shift', message: error.message });
    }
  });

  // End shift
  router.post('/end', async (req, res) => {
    try {
      const { shiftId, closingCash } = req.body;
      
      const updated = await stateManager.update('shifts', shiftId, {
        endTime: new Date().toISOString(),
        closingCash: closingCash || 0,
        status: 'completed'
      });

      res.json({ success: true, data: updated });
    } catch (error) {
      res.status(400).json({ error: 'Failed to end shift', message: error.message });
    }
  });

  return router;
};