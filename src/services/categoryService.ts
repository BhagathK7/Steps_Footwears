// STEP Footwear App - Category Service
// API calls for category operations

import api from './api';
import Config from '../config/env';
import { mockCategories } from './mockData';
import { Category } from '../types';

export const categoryService = {
    // Get all categories
    async getCategories(): Promise<Category[]> {
        if (Config.ENABLE_MOCK_DATA) {
            return mockCategories;
        }

        const response = await api.get('/categories');
        return response.data;
    },

    // Get single category by ID
    async getCategory(id: string): Promise<Category> {
        if (Config.ENABLE_MOCK_DATA) {
            const category = mockCategories.find((c) => c.id === id);
            if (!category) throw new Error('Category not found');
            return category;
        }

        const response = await api.get(`/categories/${id}`);
        return response.data;
    },

    // Get category by slug
    async getCategoryBySlug(slug: string): Promise<Category> {
        if (Config.ENABLE_MOCK_DATA) {
            const category = mockCategories.find((c) => c.slug === slug);
            if (!category) throw new Error('Category not found');
            return category;
        }

        const response = await api.get(`/categories/slug/${slug}`);
        return response.data;
    },
};

export default categoryService;
