// STEP Footwear App - Order Routes
// Order creation and management

const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user's orders
router.get('/', auth, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .sort({ createdAt: -1 });

        res.json({ orders });
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// Get order by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json({ order });
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({ error: 'Failed to fetch order' });
    }
});

// Create order
router.post('/create', auth, async (req, res) => {
    try {
        const { shippingAddress, paymentMethod, items, subtotal, shipping, tax, total } = req.body;

        const order = new Order({
            user: req.user._id,
            items,
            shippingAddress,
            payment: {
                method: paymentMethod,
                status: paymentMethod === 'cod' ? 'pending' : 'pending',
            },
            subtotal,
            shipping,
            tax,
            total,
            status: 'confirmed',
            estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
        });

        await order.save();

        // Clear user's cart
        await Cart.findOneAndUpdate(
            { user: req.user._id },
            { items: [] }
        );

        res.status(201).json({ order });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// Update payment status (for Razorpay callback)
router.post('/:id/payment', auth, async (req, res) => {
    try {
        const { razorpayOrderId, razorpayPaymentId, status } = req.body;

        const order = await Order.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            {
                'payment.razorpayOrderId': razorpayOrderId,
                'payment.razorpayPaymentId': razorpayPaymentId,
                'payment.status': status,
            },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json({ order });
    } catch (error) {
        console.error('Update payment error:', error);
        res.status(500).json({ error: 'Failed to update payment' });
    }
});

// Cancel order
router.post('/:id/cancel', auth, async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        if (!['pending', 'confirmed'].includes(order.status)) {
            return res.status(400).json({ error: 'Cannot cancel order at this stage' });
        }

        order.status = 'cancelled';
        await order.save();

        res.json({ order });
    } catch (error) {
        console.error('Cancel order error:', error);
        res.status(500).json({ error: 'Failed to cancel order' });
    }
});

module.exports = router;
