// STEP Footwear App - Theme Context
// Persistent light/dark mode with smooth transitions

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, ThemeColors, ColorScheme } from '../constants/colors';

const THEME_STORAGE_KEY = '@step_theme';

interface ThemeContextType {
    theme: ColorScheme;
    colors: ThemeColors;
    isDark: boolean;
    toggleTheme: () => void;
    setTheme: (theme: ColorScheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const systemColorScheme = useSystemColorScheme();
    const [theme, setThemeState] = useState<ColorScheme>('light');
    const [isLoaded, setIsLoaded] = useState(false);

    // Load saved theme on mount
    useEffect(() => {
        loadTheme();
    }, []);

    const loadTheme = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
            if (savedTheme === 'light' || savedTheme === 'dark') {
                setThemeState(savedTheme);
            } else if (systemColorScheme) {
                setThemeState(systemColorScheme);
            }
        } catch (error) {
            console.warn('Failed to load theme:', error);
        } finally {
            setIsLoaded(true);
        }
    };

    const setTheme = useCallback(async (newTheme: ColorScheme) => {
        try {
            await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
            setThemeState(newTheme);
        } catch (error) {
            console.warn('Failed to save theme:', error);
        }
    }, []);

    const toggleTheme = useCallback(() => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    }, [theme, setTheme]);

    const colors = theme === 'dark' ? Colors.dark : Colors.light;
    const isDark = theme === 'dark';

    // Don't render until theme is loaded to prevent flash
    if (!isLoaded) {
        return null;
    }

    return (
        <ThemeContext.Provider
            value={{
                theme,
                colors,
                isDark,
                toggleTheme,
                setTheme,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}

export default ThemeContext;
