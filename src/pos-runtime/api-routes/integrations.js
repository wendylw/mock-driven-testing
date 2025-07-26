/**
 * Third-party Integrations API Routes
 */

const express = require('express');

module.exports = (stateManager, config) => {
  const router = express.Router();

  // E-commerce integrations
  router.get('/ecommerce', async (req, res) => {
    try {
      const integrations = [
        { platform: 'shopify', status: 'connected', orders: 45 },
        { platform: 'woocommerce', status: 'disconnected', orders: 0 }
      ];
      res.json({ success: true, data: integrations });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch integrations', message: error.message });
    }
  });

  // Payment gateway integrations
  router.get('/payment-gateways', async (req, res) => {
    try {
      const gateways = [
        { name: 'GHL Terminal', status: 'active' },
        { name: 'TNG eWallet', status: 'active' },
        { name: 'GrabPay', status: 'active' }
      ];
      res.json({ success: true, data: gateways });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch gateways', message: error.message });
    }
  });

  return router;
};