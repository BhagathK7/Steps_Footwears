// STEP Footwear App - Favorites Context
// Wishlist/favorites management

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../types/product';

const FAVORITES_STORAGE_KEY = '@step_favorites';

interface FavoritesContextType {
    favorites: Product[];
    isLoading: boolean;
    addFavorite: (product: Product) => void;
    removeFavorite: (productId: string) => void;
    toggleFavorite: (product: Product) => void;
    isFavorite: (productId: string) => boolean;
    clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
    const [favorites, setFavorites] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadFavorites();
    }, []);

    useEffect(() => {
        if (!isLoading) {
            saveFavorites(favorites);
        }
    }, [favorites, isLoading]);

    const loadFavorites = async () => {
        try {
            const saved = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
            if (saved) {
                setFavorites(JSON.parse(saved));
            }
        } catch (error) {
            console.warn('Failed to load favorites:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const saveFavorites = async (items: Product[]) => {
        try {
            await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(items));
        } catch (error) {
            console.warn('Failed to save favorites:', error);
        }
    };

    const addFavorite = useCallback((product: Product) => {
        setFavorites((prev) => {
            if (prev.some((p) => p.id === product.id)) {
                return prev;
            }
            return [...prev, product];
        });
    }, []);

    const removeFavorite = useCallback((productId: string) => {
        setFavorites((prev) => prev.filter((p) => p.id !== productId));
    }, []);

    const toggleFavorite = useCallback((product: Product) => {
        setFavorites((prev) => {
            const exists = prev.some((p) => p.id === product.id);
            if (exists) {
                return prev.filter((p) => p.id !== product.id);
            }
            return [...prev, product];
        });
    }, []);

    const isFavorite = useCallback(
        (productId: string) => {
            return favorites.some((p) => p.id === productId);
        },
        [favorites]
    );

    const clearFavorites = useCallback(() => {
        setFavorites([]);
    }, []);

    return (
        <FavoritesContext.Provider
            value={{
                favorites,
                isLoading,
                addFavorite,
                removeFavorite,
                toggleFavorite,
                isFavorite,
                clearFavorites,
            }}
        >
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavorites() {
    const context = useContext(FavoritesContext);
    if (context === undefined) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
}

export default FavoritesContext;
