/**
 * Product Management API Routes
 * Handles products, categories, modifiers, and pricing
 */

const express = require('express');

module.exports = (stateManager, config) => {
  const router = express.Router();

  // Helper functions
  const validateProduct = (product) => {
    const required = ['name', 'storeId'];
    const missing = required.filter(field => !product[field]);
    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }
  };

  const validateCategory = (category) => {
    const required = ['name', 'storeId'];
    const missing = required.filter(field => !category[field]);
    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }
  };

  const generateSKU = (name, storeId) => {
    const prefix = name.substring(0, 3).toUpperCase();
    const storePrefix = storeId.substring(-3);
    const timestamp = Date.now().toString().substring(-6);
    return `${prefix}${storePrefix}${timestamp}`;
  };

  const calculateInventoryMetrics = async (productId) => {
    const transactions = await stateManager.query('transactions', {
      where: { 
        status: 'completed',
        'items.productId': productId
      }
    });

    let totalSold = 0;
    let revenue = 0;

    transactions.forEach(transaction => {
      transaction.items?.forEach(item => {
        if (item.productId === productId) {
          totalSold += item.quantity;
          revenue += item.totalPrice;
        }
      });
    });

    return { totalSold, revenue };
  };

  // ===== PRODUCTS =====

  // Get all products
  router.get('/', async (req, res) => {
    try {
      const { 
        storeId, 
        categoryId, 
        search, 
        status = 'active',
        page = 1, 
        limit = 50,
        sortBy = 'name',
        sortOrder = 'asc',
        includeInventory = 'false',
        includeMetrics = 'false'
      } = req.query;

      let filters = {};
      
      if (storeId) filters.storeId = storeId;
      if (categoryId) filters.categoryId = categoryId;
      if (status !== 'all') filters.status = status;
      
      if (search) {
        // Simple text search across name, sku, and barcode
        const searchRegex = new RegExp(search, 'i');
        filters.$or = [
          { name: searchRegex },
          { sku: searchRegex },
          { barcode: searchRegex },
          { description: searchRegex }
        ];
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const products = await stateManager.query('products', {
        where: filters,
        limit: parseInt(limit),
        offset: skip,
        sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 }
      });

      // Enhance products with additional data if requested
      const enhancedProducts = await Promise.all(products.map(async (product) => {
        const enhanced = { ...product };

        // Include category information
        if (product.categoryId) {
          const category = await stateManager.findById('categories', product.categoryId);
          enhanced.category = category ? {
            id: category.id,
            name: category.name,
            color: category.color
          } : null;
        }

        // Include inventory levels
        if (includeInventory === 'true') {
          const inventory = await stateManager.query('inventory', {
            where: { productId: product.id }
          });
          enhanced.inventory = inventory[0] || {
            quantity: 0,
            lowStockThreshold: 10,
            status: 'out_of_stock'
          };
        }

        // Include sales metrics
        if (includeMetrics === 'true') {
          enhanced.metrics = await calculateInventoryMetrics(product.id);
        }

        return enhanced;
      }));

      // Get total count for pagination
      const totalCount = await stateManager.count('products', filters);

      res.json({
        success: true,
        data: enhancedProducts,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalCount,
          totalPages: Math.ceil(totalCount / parseInt(limit)),
          hasNext: skip + enhancedProducts.length < totalCount,
          hasPrev: parseInt(page) > 1
        }
      });

    } catch (error) {
      console.error('Get products error:', error);
      res.status(500).json({
        error: 'Failed to fetch products',
        message: error.message
      });
    }
  });

  // Get single product
  router.get('/:productId', async (req, res) => {
    try {
      const { productId } = req.params;
      const { includeInventory = 'true', includeMetrics = 'true' } = req.query;

      const product = await stateManager.findById('products', productId);
      
      if (!product) {
        return res.status(404).json({
          error: 'Product not found',
          message: `Product with ID ${productId} does not exist`
        });
      }

      const enhanced = { ...product };

      // Include category
      if (product.categoryId) {
        const category = await stateManager.findById('categories', product.categoryId);
        enhanced.category = category;
      }

      // Include modifiers
      if (product.modifierIds && product.modifierIds.length > 0) {
        const modifiers = await stateManager.query('modifiers', {
          where: { id: { $in: product.modifierIds } }
        });
        enhanced.modifiers = modifiers;
      }

      // Include pricing information
      const pricebooks = await stateManager.query('pricebooks', {
        where: { storeId: product.storeId, active: true }
      });
      
      enhanced.pricing = [];
      for (const pricebook of pricebooks) {
        const priceItem = await stateManager.query('pricebook_items', {
          where: { pricebookId: pricebook.id, productId: product.id }
        });
        if (priceItem.length > 0) {
          enhanced.pricing.push({
            pricebookId: pricebook.id,
            pricebookName: pricebook.name,
            price: priceItem[0].price,
            currency: priceItem[0].currency || 'MYR'
          });
        }
      }

      // Include inventory
      if (includeInventory === 'true') {
        const inventory = await stateManager.query('inventory', {
          where: { productId: product.id }
        });
        enhanced.inventory = inventory[0] || null;
      }

      // Include metrics
      if (includeMetrics === 'true') {
        enhanced.metrics = await calculateInventoryMetrics(product.id);
      }

      res.json({
        success: true,
        data: enhanced
      });

    } catch (error) {
      console.error('Get product error:', error);
      res.status(500).json({
        error: 'Failed to fetch product',
        message: error.message
      });
    }
  });

  // Create product
  router.post('/', async (req, res) => {
    try {
      const productData = req.body;
      
      validateProduct(productData);

      // Generate SKU if not provided
      if (!productData.sku) {
        productData.sku = generateSKU(productData.name, productData.storeId);
      }

      // Check for duplicate SKU
      const existingBySku = await stateManager.query('products', {
        where: { sku: productData.sku, storeId: productData.storeId }
      });

      if (existingBySku.length > 0) {
        return res.status(409).json({
          error: 'Duplicate SKU',
          message: 'A product with this SKU already exists in the store'
        });
      }

      // Check for duplicate barcode
      if (productData.barcode) {
        const existingByBarcode = await stateManager.query('products', {
          where: { barcode: productData.barcode, storeId: productData.storeId }
        });

        if (existingByBarcode.length > 0) {
          return res.status(409).json({
            error: 'Duplicate barcode',
            message: 'A product with this barcode already exists in the store'
          });
        }
      }

      const product = {
        id: `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: productData.name,
        description: productData.description || '',
        sku: productData.sku,
        barcode: productData.barcode || null,
        storeId: productData.storeId,
        categoryId: productData.categoryId || null,
        basePrice: parseFloat(productData.basePrice) || 0,
        cost: parseFloat(productData.cost) || 0,
        taxable: productData.taxable !== false,
        taxRate: parseFloat(productData.taxRate) || 0,
        trackInventory: productData.trackInventory !== false,
        allowBackorder: productData.allowBackorder === true,
        images: productData.images || [],
        variants: productData.variants || [],
        modifierIds: productData.modifierIds || [],
        tags: productData.tags || [],
        status: productData.status || 'active',
        weight: parseFloat(productData.weight) || null,
        dimensions: productData.dimensions || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: req.currentUser?.id || 'system'
      };

      const createdProduct = await stateManager.create('products', product);

      // Create initial inventory record if tracking inventory
      if (product.trackInventory) {
        const inventory = {
          id: `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          productId: createdProduct.id,
          storeId: product.storeId,
          quantity: parseInt(productData.initialQuantity) || 0,
          lowStockThreshold: parseInt(productData.lowStockThreshold) || 10,
          lastUpdated: new Date().toISOString(),
          lastStockCount: new Date().toISOString()
        };

        await stateManager.create('inventory', inventory);
      }

      res.status(201).json({
        success: true,
        data: createdProduct
      });

    } catch (error) {
      console.error('Create product error:', error);
      res.status(400).json({
        error: 'Failed to create product',
        message: error.message
      });
    }
  });

  // Update product
  router.put('/:productId', async (req, res) => {
    try {
      const { productId } = req.params;
      const updates = req.body;

      const product = await stateManager.findById('products', productId);
      if (!product) {
        return res.status(404).json({
          error: 'Product not found'
        });
      }

      // Validate SKU uniqueness if changed
      if (updates.sku && updates.sku !== product.sku) {
        const existing = await stateManager.query('products', {
          where: { 
            sku: updates.sku, 
            storeId: product.storeId,
            id: { $ne: productId }
          }
        });

        if (existing.length > 0) {
          return res.status(409).json({
            error: 'Duplicate SKU',
            message: 'Another product with this SKU already exists'
          });
        }
      }

      // Validate barcode uniqueness if changed
      if (updates.barcode && updates.barcode !== product.barcode) {
        const existing = await stateManager.query('products', {
          where: { 
            barcode: updates.barcode, 
            storeId: product.storeId,
            id: { $ne: productId }
          }
        });

        if (existing.length > 0) {
          return res.status(409).json({
            error: 'Duplicate barcode',
            message: 'Another product with this barcode already exists'
          });
        }
      }

      const updatedProduct = await stateManager.update('products', productId, {
        ...updates,
        updatedAt: new Date().toISOString(),
        updatedBy: req.currentUser?.id || 'system'
      });

      res.json({
        success: true,
        data: updatedProduct
      });

    } catch (error) {
      console.error('Update product error:', error);
      res.status(400).json({
        error: 'Failed to update product',
        message: error.message
      });
    }
  });

  // Delete product
  router.delete('/:productId', async (req, res) => {
    try {
      const { productId } = req.params;
      const { force = 'false' } = req.query;

      const product = await stateManager.findById('products', productId);
      if (!product) {
        return res.status(404).json({
          error: 'Product not found'
        });
      }

      // Check if product is used in any active transactions
      const activeTransactions = await stateManager.query('transactions', {
        where: {
          status: { $in: ['pending', 'processing'] },
          'items.productId': productId
        }
      });

      if (activeTransactions.length > 0 && force !== 'true') {
        return res.status(409).json({
          error: 'Product in use',
          message: 'Product is used in active transactions. Use force=true to delete anyway.',
          activeTransactions: activeTransactions.length
        });
      }

      if (force === 'true') {
        // Hard delete
        await stateManager.delete('products', productId);
        // Also delete related inventory records
        const inventoryRecords = await stateManager.query('inventory', {
          where: { productId }
        });
        for (const inv of inventoryRecords) {
          await stateManager.delete('inventory', inv.id);
        }
      } else {
        // Soft delete
        await stateManager.update('products', productId, {
          status: 'deleted',
          deletedAt: new Date().toISOString(),
          deletedBy: req.currentUser?.id || 'system'
        });
      }

      res.status(204).send();

    } catch (error) {
      console.error('Delete product error:', error);
      res.status(500).json({
        error: 'Failed to delete product',
        message: error.message
      });
    }
  });

  // Bulk update products
  router.post('/bulk-update', async (req, res) => {
    try {
      const { productIds, updates } = req.body;

      if (!Array.isArray(productIds) || productIds.length === 0) {
        return res.status(400).json({
          error: 'Invalid product IDs',
          message: 'productIds must be a non-empty array'
        });
      }

      const results = [];
      const errors = [];

      for (const productId of productIds) {
        try {
          const updatedProduct = await stateManager.update('products', productId, {
            ...updates,
            updatedAt: new Date().toISOString(),
            updatedBy: req.currentUser?.id || 'system'
          });
          results.push(updatedProduct);
        } catch (error) {
          errors.push({
            productId,
            error: error.message
          });
        }
      }

      res.json({
        success: true,
        data: {
          updated: results,
          errors,
          totalProcessed: productIds.length,
          successCount: results.length,
          errorCount: errors.length
        }
      });

    } catch (error) {
      console.error('Bulk update error:', error);
      res.status(500).json({
        error: 'Bulk update failed',
        message: error.message
      });
    }
  });

  // Search products
  router.get('/search', async (req, res) => {
    try {
      const { q, storeId, limit = 20 } = req.query;

      if (!q || q.length < 2) {
        return res.status(400).json({
          error: 'Invalid search query',
          message: 'Search query must be at least 2 characters long'
        });
      }

      const searchRegex = new RegExp(q, 'i');
      const filters = {
        status: 'active',
        $or: [
          { name: searchRegex },
          { sku: searchRegex },
          { barcode: searchRegex },
          { description: searchRegex }
        ]
      };

      if (storeId) {
        filters.storeId = storeId;
      }

      const products = await stateManager.query('products', {
        where: filters,
        limit: parseInt(limit),
        sort: { name: 1 }
      });

      // Include basic inventory info
      const enhancedProducts = await Promise.all(products.map(async (product) => {
        const inventory = await stateManager.query('inventory', {
          where: { productId: product.id }
        });

        return {
          ...product,
          inventory: inventory[0] || null
        };
      }));

      res.json({
        success: true,
        data: enhancedProducts,
        meta: {
          query: q,
          count: enhancedProducts.length
        }
      });

    } catch (error) {
      console.error('Search products error:', error);
      res.status(500).json({
        error: 'Search failed',
        message: error.message
      });
    }
  });

  return router;
};