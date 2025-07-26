/**
 * Reports API Routes
 */

const express = require('express');

module.exports = (stateManager, config) => {
  const router = express.Router();

  router.get('/sales', async (req, res) => {
    try {
      const { storeId, startDate, endDate } = req.query;
      const transactions = await stateManager.query('transactions', {
        where: { storeId, status: 'completed' }
      });

      const totalSales = transactions.reduce((sum, t) => sum + t.total, 0);
      const totalTransactions = transactions.length;

      res.json({
        success: true,
        data: {
          totalSales,
          totalTransactions,
          averageTransaction: totalTransactions ? totalSales / totalTransactions : 0
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate sales report', message: error.message });
    }
  });

  return router;
};