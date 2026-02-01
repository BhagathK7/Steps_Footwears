// STEP Footwear App - Product Routes
// Product listing and search

const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

// Get all products (with pagination)
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 20, category, featured, newArrivals, search } = req.query;

        let query = {};

        if (category) query.category = category;
        if (featured === 'true') query.isFeatured = true;
        if (newArrivals === 'true') query.isNewArrival = true;
        if (search) query.$text = { $search: search };

        const products = await Product.find(query)
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await Product.countDocuments(query);

        res.json({
            products,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// Get product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ product });
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});

// Get categories
router.get('/meta/categories', async (req, res) => {
    try {
        const categories = await Product.distinct('category');
        res.json({ categories });
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

module.exports = router;
