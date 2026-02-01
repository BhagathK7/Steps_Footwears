// STEP Footwear App - Cart Context
// Global cart state management with persistence

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product, ProductVariant } from '../types/product';

const CART_STORAGE_KEY = '@step_cart';

export interface CartItem {
    id: string;
    product: Product;
    variant: ProductVariant;
    quantity: number;
    selectedSize: string;
    selectedColor: string;
}

interface CartState {
    items: CartItem[];
    isLoading: boolean;
}

type CartAction =
    | { type: 'SET_ITEMS'; payload: CartItem[] }
    | { type: 'ADD_ITEM'; payload: CartItem }
    | { type: 'REMOVE_ITEM'; payload: string }
    | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
    | { type: 'CLEAR_CART' }
    | { type: 'SET_LOADING'; payload: boolean };

const initialState: CartState = {
    items: [],
    isLoading: true,
};

function cartReducer(state: CartState, action: CartAction): CartState {
    switch (action.type) {
        case 'SET_ITEMS':
            return { ...state, items: action.payload, isLoading: false };
        case 'ADD_ITEM': {
            const existingIndex = state.items.findIndex(
                (item) =>
                    item.product.id === action.payload.product.id &&
                    item.selectedSize === action.payload.selectedSize &&
                    item.selectedColor === action.payload.selectedColor
            );
            if (existingIndex !== -1) {
                const updatedItems = [...state.items];
                updatedItems[existingIndex].quantity += action.payload.quantity;
                return { ...state, items: updatedItems };
            }
            return { ...state, items: [...state.items, action.payload] };
        }
        case 'REMOVE_ITEM':
            return { ...state, items: state.items.filter((item) => item.id !== action.payload) };
        case 'UPDATE_QUANTITY':
            return {
                ...state,
                items: state.items.map((item) =>
                    item.id === action.payload.id
                        ? { ...item, quantity: action.payload.quantity }
                        : item
                ),
            };
        case 'CLEAR_CART':
            return { ...state, items: [] };
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        default:
            return state;
    }
}

interface CartContextType {
    items: CartItem[];
    isLoading: boolean;
    itemCount: number;
    subtotal: number;
    addItem: (item: Omit<CartItem, 'id'>) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    getItemQuantity: (productId: string, size: string, color: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    // Load cart from storage on mount
    useEffect(() => {
        loadCart();
    }, []);

    // Save cart to storage whenever it changes
    useEffect(() => {
        if (!state.isLoading) {
            saveCart(state.items);
        }
    }, [state.items, state.isLoading]);

    const loadCart = async () => {
        try {
            const savedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
            if (savedCart) {
                const items = JSON.parse(savedCart);
                dispatch({ type: 'SET_ITEMS', payload: items });
            } else {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        } catch (error) {
            console.warn('Failed to load cart:', error);
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const saveCart = async (items: CartItem[]) => {
        try {
            await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        } catch (error) {
            console.warn('Failed to save cart:', error);
        }
    };

    const addItem = useCallback((item: Omit<CartItem, 'id'>) => {
        const id = `${item.product.id}-${item.selectedSize}-${item.selectedColor}-${Date.now()}`;
        dispatch({ type: 'ADD_ITEM', payload: { ...item, id } });
    }, []);

    const removeItem = useCallback((id: string) => {
        dispatch({ type: 'REMOVE_ITEM', payload: id });
    }, []);

    const updateQuantity = useCallback((id: string, quantity: number) => {
        if (quantity <= 0) {
            dispatch({ type: 'REMOVE_ITEM', payload: id });
        } else {
            dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
        }
    }, []);

    const clearCart = useCallback(() => {
        dispatch({ type: 'CLEAR_CART' });
    }, []);

    const getItemQuantity = useCallback(
        (productId: string, size: string, color: string) => {
            const item = state.items.find(
                (i) =>
                    i.product.id === productId &&
                    i.selectedSize === size &&
                    i.selectedColor === color
            );
            return item?.quantity || 0;
        },
        [state.items]
    );

    const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = state.items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    return (
        <CartContext.Provider
            value={{
                items: state.items,
                isLoading: state.isLoading,
                itemCount,
                subtotal,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                getItemQuantity,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}

export default CartContext;
