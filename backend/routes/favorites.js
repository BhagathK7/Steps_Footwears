// STEP Footwear App - Favorites Routes
// User wishlist management

const express = require('express');
const Favorite = require('../models/Favorite');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user's favorites
router.get('/', auth, async (req, res) => {
    try {
        const favorites = await Favorite.find({ user: req.user._id })
            .populate('product')
            .sort({ addedAt: -1 });

        res.json({ favorites });
    } catch (error) {
        console.error('Get favorites error:', error);
        res.status(500).json({ error: 'Failed to fetch favorites' });
    }
});

// Add to favorites
router.post('/add', auth, async (req, res) => {
    try {
        const { productId } = req.body;

        // Check if already favorited
        const existing = await Favorite.findOne({
            user: req.user._id,
            product: productId,
        });

        if (existing) {
            return res.json({ message: 'Already in favorites', favorite: existing });
        }

        const favorite = new Favorite({
            user: req.user._id,
            product: productId,
        });

        await favorite.save();
        await favorite.populate('product');

        res.json({ favorite });
    } catch (error) {
        console.error('Add favorite error:', error);
        res.status(500).json({ error: 'Failed to add to favorites' });
    }
});

// Remove from favorites
router.delete('/remove/:productId', auth, async (req, res) => {
    try {
        const { productId } = req.params;

        await Favorite.findOneAndDelete({
            user: req.user._id,
            product: productId,
        });

        res.json({ message: 'Removed from favorites' });
    } catch (error) {
        console.error('Remove favorite error:', error);
        res.status(500).json({ error: 'Failed to remove from favorites' });
    }
});

// Check if product is favorited
router.get('/check/:productId', auth, async (req, res) => {
    try {
        const { productId } = req.params;

        const favorite = await Favorite.findOne({
            user: req.user._id,
            product: productId,
        });

        res.json({ isFavorite: !!favorite });
    } catch (error) {
        console.error('Check favorite error:', error);
        res.status(500).json({ error: 'Failed to check favorite' });
    }
});

module.exports = router;
