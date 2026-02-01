// STEP Footwear App - API Client
// Axios instance with interceptors for authentication

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from '../config/env';

const AUTH_STORAGE_KEY = '@step_auth';

// Create axios instance
const api = axios.create({
    baseURL: Config.API_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - Add auth token
api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        try {
            const authData = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
            if (authData) {
                const { token } = JSON.parse(authData);
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            }
        } catch (error) {
            console.warn('Failed to get auth token:', error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        if (error.response?.status === 401) {
            // Token expired - clear auth and redirect to login
            await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
            // You could emit an event here to trigger logout in the app
        }

        // Format error message
        const message =
            (error.response?.data as any)?.message ||
            error.message ||
            'An error occurred';

        return Promise.reject(new Error(message));
    }
);

export default api;
