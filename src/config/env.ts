// STEP Footwear App - Environment Configuration
// This file manages environment-specific configuration

// API configuration - Update these values for your environment
export const Config = {
    // Backend API URL
    // For development, use your local server or deployed backend URL
    API_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',

    // Razorpay configuration
    RAZORPAY_KEY_ID: process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID || '',

    // App configuration
    APP_NAME: 'STEP',
    APP_VERSION: '1.0.0',
    CURRENCY: 'INR',
    CURRENCY_SYMBOL: '₹',

    // Pagination
    DEFAULT_PAGE_SIZE: 20,

    // Image placeholders
    PLACEHOLDER_PRODUCT: 'https://via.placeholder.com/400x400?text=Product',
    PLACEHOLDER_CATEGORY: 'https://via.placeholder.com/300x200?text=Category',
    PLACEHOLDER_AVATAR: 'https://via.placeholder.com/150x150?text=User',

    // Feature flags
    ENABLE_MOCK_DATA: true, // Set to false when backend is ready
};

export default Config;
