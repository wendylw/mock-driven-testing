/**
 * Customer Management API Routes
 */

const express = require('express');

module.exports = (stateManager, config) => {
  const router = express.Router();

  // Get customers
  router.get('/', async (req, res) => {
    try {
      const { search, page = 1, limit = 50 } = req.query;
      let filters = {};
      
      if (search) {
        const searchRegex = new RegExp(search, 'i');
        filters.$or = [
          { name: searchRegex },
          { email: searchRegex },
          { phone: searchRegex }
        ];
      }

      const customers = await stateManager.query('customers', {
        where: filters,
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit)
      });

      res.json({ success: true, data: customers });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch customers', message: error.message });
    }
  });

  // Create customer
  router.post('/', async (req, res) => {
    try {
      const customer = {
        id: `customer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...req.body,
        createdAt: new Date().toISOString()
      };

      const created = await stateManager.create('customers', customer);
      res.status(201).json({ success: true, data: created });
    } catch (error) {
      res.status(400).json({ error: 'Failed to create customer', message: error.message });
    }
  });

  // Get customer by ID
  router.get('/:customerId', async (req, res) => {
    try {
      const customer = await stateManager.findById('customers', req.params.customerId);
      if (!customer) {
        return res.status(404).json({ error: 'Customer not found' });
      }
      res.json({ success: true, data: customer });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch customer', message: error.message });
    }
  });

  return router;
};