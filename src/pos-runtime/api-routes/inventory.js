/**
 * Inventory Management API Routes
 */

const express = require('express');

module.exports = (stateManager, config) => {
  const router = express.Router();

  // Get inventory levels
  router.get('/', async (req, res) => {
    try {
      const { storeId, lowStock } = req.query;
      let filters = {};
      
      if (storeId) filters.storeId = storeId;
      if (lowStock === 'true') {
        filters.$where = function() { 
          return this.quantity <= this.lowStockThreshold; 
        };
      }

      const inventory = await stateManager.query('inventory', { where: filters });
      res.json({ success: true, data: inventory });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch inventory', message: error.message });
    }
  });

  // Update inventory
  router.put('/:productId', async (req, res) => {
    try {
      const { productId } = req.params;
      const { quantity, adjustment } = req.body;

      const inventory = await stateManager.query('inventory', {
        where: { productId }
      });

      if (inventory.length === 0) {
        return res.status(404).json({ error: 'Inventory record not found' });
      }

      const currentRecord = inventory[0];
      const newQuantity = adjustment ? currentRecord.quantity + adjustment : quantity;

      const updated = await stateManager.update('inventory', currentRecord.id, {
        quantity: newQuantity,
        lastUpdated: new Date().toISOString()
      });

      res.json({ success: true, data: updated });
    } catch (error) {
      res.status(400).json({ error: 'Failed to update inventory', message: error.message });
    }
  });

  return router;
};