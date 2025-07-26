/**
 * Transaction Processing API Routes
 * Handles transaction creation, updates, items, and completion
 */

const express = require('express');

module.exports = (stateManager, config) => {
  const router = express.Router();

  // Helper functions
  const calculateTransactionTotals = (items = [], discounts = [], taxes = []) => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountAmount = discounts.reduce((sum, discount) => sum + discount.amount, 0);
    const taxAmount = taxes.reduce((sum, tax) => sum + tax.amount, 0);
    return {
      subtotal,
      discountAmount,
      taxAmount,
      total: subtotal - discountAmount + taxAmount
    };
  };

  // Get transactions
  router.get('/', async (req, res) => {
    try {
      const { storeId, status, page = 1, limit = 50 } = req.query;
      let filters = {};
      
      if (storeId) filters.storeId = storeId;
      if (status) filters.status = status;

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const transactions = await stateManager.query('transactions', {
        where: filters,
        limit: parseInt(limit),
        offset: skip,
        sort: { createdAt: -1 }
      });

      res.json({
        success: true,
        data: transactions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: transactions.length
        }
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch transactions',
        message: error.message
      });
    }
  });

  // Create transaction
  router.post('/', async (req, res) => {
    try {
      const transactionData = req.body;
      
      const transaction = {
        id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        receiptNumber: `R${Date.now()}`,
        storeId: transactionData.storeId,
        registerId: transactionData.registerId,
        employeeId: req.currentUser?.id,
        customerId: transactionData.customerId || null,
        type: transactionData.type || 'sale',
        status: 'pending',
        items: [],
        discounts: [],
        taxes: [],
        payments: [],
        subtotal: 0,
        discountAmount: 0,
        taxAmount: 0,
        total: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const created = await stateManager.create('transactions', transaction);

      res.status(201).json({
        success: true,
        data: created
      });
    } catch (error) {
      res.status(400).json({
        error: 'Failed to create transaction',
        message: error.message
      });
    }
  });

  // Get transaction by ID
  router.get('/:transactionId', async (req, res) => {
    try {
      const transaction = await stateManager.findById('transactions', req.params.transactionId);
      if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found' });
      }
      res.json({
        success: true,
        data: transaction
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch transaction',
        message: error.message
      });
    }
  });

  // Add item to transaction
  router.post('/:transactionId/items', async (req, res) => {
    try {
      const { transactionId } = req.params;
      const { productId, quantity = 1, modifiers = [] } = req.body;

      const transaction = await stateManager.findById('transactions', transactionId);
      if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found' });
      }

      const product = await stateManager.findById('products', productId);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      const item = {
        id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        productId,
        name: product.name,
        sku: product.sku,
        quantity,
        price: product.basePrice,
        totalPrice: product.basePrice * quantity,
        modifiers,
        addedAt: new Date().toISOString()
      };

      const updatedItems = [...(transaction.items || []), item];
      const totals = calculateTransactionTotals(updatedItems, transaction.discounts, transaction.taxes);

      const updated = await stateManager.update('transactions', transactionId, {
        items: updatedItems,
        ...totals,
        updatedAt: new Date().toISOString()
      });

      res.json({
        success: true,
        data: updated
      });
    } catch (error) {
      res.status(400).json({
        error: 'Failed to add item',
        message: error.message
      });
    }
  });

  // Complete transaction
  router.post('/:transactionId/complete', async (req, res) => {
    try {
      const { transactionId } = req.params;
      
      const transaction = await stateManager.findById('transactions', transactionId);
      if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found' });
      }

      if (transaction.status !== 'pending') {
        return res.status(400).json({ 
          error: 'Transaction cannot be completed',
          message: `Transaction is in ${transaction.status} status`
        });
      }

      const updated = await stateManager.update('transactions', transactionId, {
        status: 'completed',
        completedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      res.json({
        success: true,
        data: updated
      });
    } catch (error) {
      res.status(400).json({
        error: 'Failed to complete transaction',
        message: error.message
      });
    }
  });

  // Void transaction
  router.post('/:transactionId/void', async (req, res) => {
    try {
      const { transactionId } = req.params;
      const { reason } = req.body;

      const updated = await stateManager.update('transactions', transactionId, {
        status: 'voided',
        voidReason: reason || 'No reason provided',
        voidedAt: new Date().toISOString(),
        voidedBy: req.currentUser?.id,
        updatedAt: new Date().toISOString()
      });

      res.json({
        success: true,
        data: updated
      });
    } catch (error) {
      res.status(400).json({
        error: 'Failed to void transaction',
        message: error.message
      });
    }
  });

  return router;
};