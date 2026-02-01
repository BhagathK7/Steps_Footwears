// STEP Footwear App - Order Model
// MongoDB schema for orders

const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    name: String,
    brand: String,
    image: String,
    price: Number,
    quantity: Number,
    selectedSize: String,
    selectedColor: String,
});

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        required: true,
        unique: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [orderItemSchema],
    shippingAddress: {
        fullName: String,
        address: String,
        city: String,
        state: String,
        pincode: String,
        phone: String,
    },
    payment: {
        method: {
            type: String,
            enum: ['razorpay', 'cod'],
            required: true,
        },
        razorpayOrderId: String,
        razorpayPaymentId: String,
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed', 'refunded'],
            default: 'pending',
        },
    },
    subtotal: Number,
    shipping: Number,
    tax: Number,
    total: Number,
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending',
    },
    trackingNumber: String,
    estimatedDelivery: Date,
    deliveredAt: Date,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Generate order number
orderSchema.pre('save', function (next) {
    if (!this.orderNumber) {
        const year = new Date().getFullYear();
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        this.orderNumber = `ORD-${year}-${random}`;
    }
    this.updatedAt = new Date();
    next();
});

module.exports = mongoose.model('Order', orderSchema);
