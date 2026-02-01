// STEP Footwear App - Auth Service
// API calls for authentication

import api from './api';
import { User } from '../types/user';

export interface LoginResponse {
    user: User;
    token: string;
    message: string;
}

export interface RegisterData {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
}

export interface LoginData {
    email: string;
    password: string;
}

// Register a new user
export async function register(data: RegisterData): Promise<LoginResponse> {
    const response = await api.post('/auth/register', data);
    return response.data;
}

// Login user
export async function login(data: LoginData): Promise<LoginResponse> {
    const response = await api.post('/auth/login', data);
    return response.data;
}

// Get current user (validate token)
export async function getCurrentUser(): Promise<{ user: User }> {
    const response = await api.get('/auth/me');
    return response.data;
}

// Logout (server-side)
export async function logout(): Promise<void> {
    await api.post('/auth/logout');
}
