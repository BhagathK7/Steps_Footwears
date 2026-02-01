// STEP Footwear App - User Routes
// Profile management

const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Update profile
router.put('/profile', auth, async (req, res) => {
    try {
        const { fullName, phone, avatar } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { fullName, phone, avatar, updatedAt: new Date() },
            { new: true }
        );

        res.json({ user: user.toJSON() });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// Get addresses
router.get('/addresses', auth, async (req, res) => {
    res.json({ addresses: req.user.addresses || [] });
});

// Add address
router.post('/addresses', auth, async (req, res) => {
    try {
        const address = req.body;

        // If this is the first address or marked as default, set as default
        if (!req.user.addresses?.length || address.isDefault) {
            req.user.addresses.forEach(addr => addr.isDefault = false);
            address.isDefault = true;
        }

        req.user.addresses.push(address);
        await req.user.save();

        res.json({ addresses: req.user.addresses });
    } catch (error) {
        console.error('Add address error:', error);
        res.status(500).json({ error: 'Failed to add address' });
    }
});

// Update address
router.put('/addresses/:addressId', auth, async (req, res) => {
    try {
        const { addressId } = req.params;
        const updates = req.body;

        const addressIndex = req.user.addresses.findIndex(
            addr => addr._id.toString() === addressId
        );

        if (addressIndex === -1) {
            return res.status(404).json({ error: 'Address not found' });
        }

        if (updates.isDefault) {
            req.user.addresses.forEach(addr => addr.isDefault = false);
        }

        Object.assign(req.user.addresses[addressIndex], updates);
        await req.user.save();

        res.json({ addresses: req.user.addresses });
    } catch (error) {
        console.error('Update address error:', error);
        res.status(500).json({ error: 'Failed to update address' });
    }
});

// Delete address
router.delete('/addresses/:addressId', auth, async (req, res) => {
    try {
        const { addressId } = req.params;

        req.user.addresses = req.user.addresses.filter(
            addr => addr._id.toString() !== addressId
        );

        await req.user.save();

        res.json({ addresses: req.user.addresses });
    } catch (error) {
        console.error('Delete address error:', error);
        res.status(500).json({ error: 'Failed to delete address' });
    }
});

module.exports = router;
