// STEP Footwear App - Product Service
// API calls for product-related operations

import api from './api';
import Config from '../config/env';
import { mockProducts, mockCategories } from './mockData';
import { Product, ProductsResponse, ProductFilters, Category } from '../types';

export const productService = {
    // Get all products with optional filters
    async getProducts(filters?: ProductFilters, page = 1): Promise<ProductsResponse> {
        if (Config.ENABLE_MOCK_DATA) {
            return this.getMockProducts(filters, page);
        }

        const params = new URLSearchParams();
        if (filters?.categoryId) params.append('categoryId', filters.categoryId);
        if (filters?.search) params.append('search', filters.search);
        if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
        if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
        if (filters?.sortBy) params.append('sortBy', filters.sortBy);
        params.append('page', page.toString());
        params.append('limit', Config.DEFAULT_PAGE_SIZE.toString());

        const response = await api.get(`/products?${params.toString()}`);
        return response.data;
    },

    // Get single product by ID
    async getProduct(id: string): Promise<Product> {
        if (Config.ENABLE_MOCK_DATA) {
            const product = mockProducts.find((p) => p.id === id);
            if (!product) throw new Error('Product not found');
            return product;
        }

        const response = await api.get(`/products/${id}`);
        return response.data;
    },

    // Get featured products
    async getFeaturedProducts(): Promise<Product[]> {
        if (Config.ENABLE_MOCK_DATA) {
            return mockProducts.filter((p) => p.isFeatured);
        }

        const response = await api.get('/products/featured');
        return response.data;
    },

    // Get new arrivals
    async getNewArrivals(): Promise<Product[]> {
        if (Config.ENABLE_MOCK_DATA) {
            return mockProducts.filter((p) => p.isNew);
        }

        const response = await api.get('/products/new-arrivals');
        return response.data;
    },

    // Get products on sale
    async getSaleProducts(): Promise<Product[]> {
        if (Config.ENABLE_MOCK_DATA) {
            return mockProducts.filter((p) => p.isOnSale);
        }

        const response = await api.get('/products/on-sale');
        return response.data;
    },

    // Search products
    async searchProducts(query: string): Promise<Product[]> {
        if (Config.ENABLE_MOCK_DATA) {
            const lowerQuery = query.toLowerCase();
            return mockProducts.filter(
                (p) =>
                    p.name.toLowerCase().includes(lowerQuery) ||
                    p.brand.toLowerCase().includes(lowerQuery) ||
                    p.categoryName.toLowerCase().includes(lowerQuery) ||
                    p.tags.some((t) => t.toLowerCase().includes(lowerQuery))
            );
        }

        const response = await api.get(`/products/search?q=${encodeURIComponent(query)}`);
        return response.data;
    },

    // Get products by category
    async getProductsByCategory(categoryId: string): Promise<Product[]> {
        if (Config.ENABLE_MOCK_DATA) {
            return mockProducts.filter((p) => p.categoryId === categoryId);
        }

        const response = await api.get(`/products/category/${categoryId}`);
        return response.data;
    },

    // Mock data helper
    getMockProducts(filters?: ProductFilters, page = 1): ProductsResponse {
        let filtered = [...mockProducts];

        if (filters?.categoryId) {
            filtered = filtered.filter((p) => p.categoryId === filters.categoryId);
        }

        if (filters?.search) {
            const lowerQuery = filters.search.toLowerCase();
            filtered = filtered.filter(
                (p) =>
                    p.name.toLowerCase().includes(lowerQuery) ||
                    p.brand.toLowerCase().includes(lowerQuery)
            );
        }

        if (filters?.minPrice) {
            filtered = filtered.filter((p) => p.price >= filters.minPrice!);
        }

        if (filters?.maxPrice) {
            filtered = filtered.filter((p) => p.price <= filters.maxPrice!);
        }

        if (filters?.sortBy) {
            switch (filters.sortBy) {
                case 'price_asc':
                    filtered.sort((a, b) => a.price - b.price);
                    break;
                case 'price_desc':
                    filtered.sort((a, b) => b.price - a.price);
                    break;
                case 'rating':
                    filtered.sort((a, b) => b.rating - a.rating);
                    break;
                case 'newest':
                    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                    break;
            }
        }

        const limit = Config.DEFAULT_PAGE_SIZE;
        const start = (page - 1) * limit;
        const paged = filtered.slice(start, start + limit);

        return {
            products: paged,
            total: filtered.length,
            page,
            limit,
            hasMore: start + limit < filtered.length,
        };
    },
};

export default productService;
