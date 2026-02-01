// STEP Footwear App - Auth Context
// User authentication state management

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/user';

const AUTH_STORAGE_KEY = '@step_auth';

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
}

type AuthAction =
    | { type: 'SET_AUTH'; payload: { user: User; token: string } }
    | { type: 'LOGOUT' }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'UPDATE_USER'; payload: Partial<User> };

const initialState: AuthState = {
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
    switch (action.type) {
        case 'SET_AUTH':
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                isAuthenticated: true,
                isLoading: false,
            };
        case 'LOGOUT':
            return {
                ...state,
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
            };
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'UPDATE_USER':
            return {
                ...state,
                user: state.user ? { ...state.user, ...action.payload } : null,
            };
        default:
            return state;
    }
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    isAdmin: boolean;
    login: (user: User, token: string) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Load auth state on mount
    useEffect(() => {
        loadAuth();
    }, []);

    const loadAuth = async () => {
        try {
            const authData = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
            if (authData) {
                const { user, token } = JSON.parse(authData);
                if (user && token) {
                    dispatch({ type: 'SET_AUTH', payload: { user, token } });
                    return;
                }
            }
            dispatch({ type: 'SET_LOADING', payload: false });
        } catch (error) {
            console.warn('Failed to load auth:', error);
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const login = useCallback(async (user: User, token: string) => {
        try {
            await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user, token }));
            dispatch({ type: 'SET_AUTH', payload: { user, token } });
        } catch (error) {
            console.warn('Failed to save auth:', error);
            throw error;
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
            dispatch({ type: 'LOGOUT' });
        } catch (error) {
            console.warn('Failed to clear auth:', error);
        }
    }, []);

    const updateUser = useCallback((updates: Partial<User>) => {
        dispatch({ type: 'UPDATE_USER', payload: updates });
    }, []);

    const isAdmin = state.user?.role === 'admin';

    return (
        <AuthContext.Provider
            value={{
                user: state.user,
                token: state.token,
                isLoading: state.isLoading,
                isAuthenticated: state.isAuthenticated,
                isAdmin,
                login,
                logout,
                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;
