/**
 * Payment Processing API Routes
 * Handles payment methods, processing, and gateway integrations
 */

const express = require('express');

module.exports = (stateManager, config) => {
  const router = express.Router();

  // Process payment
  router.post('/', async (req, res) => {
    try {
      const { 
        transactionId, 
        amount, 
        method, 
        gateway = 'mock',
        gatewayData = {} 
      } = req.body;

      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const payment = {
        id: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        transactionId,
        amount: parseFloat(amount),
        method, // cash, card, ewallet, etc.
        gateway,
        gatewayData,
        status: Math.random() > 0.1 ? 'completed' : 'failed', // 90% success rate
        processedAt: new Date().toISOString(),
        reference: `REF${Date.now()}`
      };

      const created = await stateManager.create('payments', payment);

      res.status(201).json({
        success: true,
        data: created
      });
    } catch (error) {
      res.status(400).json({
        error: 'Payment processing failed',
        message: error.message
      });
    }
  });

  // Get payment methods
  router.get('/methods', async (req, res) => {
    try {
      const { storeId } = req.query;
      
      const methods = [
        {
          id: 'cash',
          name: 'Cash',
          type: 'cash',
          enabled: true,
          icon: 'cash'
        },
        {
          id: 'card',
          name: 'Credit/Debit Card',
          type: 'card',
          enabled: true,
          icon: 'credit-card'
        },
        {
          id: 'tng',
          name: 'Touch \'n Go eWallet',
          type: 'ewallet',
          enabled: true,
          icon: 'tng'
        },
        {
          id: 'grabpay',
          name: 'GrabPay',
          type: 'ewallet',
          enabled: true,
          icon: 'grabpay'
        },
        {
          id: 'boost',
          name: 'Boost',
          type: 'ewallet',
          enabled: true,
          icon: 'boost'
        }
      ];

      res.json({
        success: true,
        data: methods
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch payment methods',
        message: error.message
      });
    }
  });

  return router;
};