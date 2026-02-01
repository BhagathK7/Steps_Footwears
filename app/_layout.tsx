// STEP Footwear App - Root Layout
// Main app entry with providers and fonts

import React, { useEffect, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import {
    useFonts,
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
    Outfit_800ExtraBold,
} from '@expo-google-fonts/outfit';

import { ThemeProvider, useTheme } from '../src/contexts/ThemeContext';
import { CartProvider } from '../src/contexts/CartContext';
import { AuthProvider } from '../src/contexts/AuthContext';
import { FavoritesProvider } from '../src/contexts/FavoritesContext';

// Prevent auto-hiding splash screen
SplashScreen.preventAutoHideAsync();

function RootLayoutContent() {
    const { colors, isDark } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar style={isDark ? 'light' : 'dark'} />
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: colors.background },
                    animation: 'slide_from_right',
                }}
            >
                <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
                <Stack.Screen
                    name="product/[id]"
                    options={{
                        animation: 'slide_from_bottom',
                        presentation: 'card',
                    }}
                />
                <Stack.Screen
                    name="search"
                    options={{
                        animation: 'fade',
                        presentation: 'modal',
                    }}
                />
                <Stack.Screen
                    name="checkout"
                    options={{
                        animation: 'slide_from_right',
                    }}
                />
                <Stack.Screen
                    name="order-confirmation"
                    options={{
                        animation: 'fade',
                    }}
                />
            </Stack>
        </View>
    );
}

export default function RootLayout() {
    const [fontsLoaded, fontError] = useFonts({
        Outfit_400Regular,
        Outfit_500Medium,
        Outfit_600SemiBold,
        Outfit_700Bold,
        Outfit_800ExtraBold,
    });

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded || fontError) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontError]);

    useEffect(() => {
        onLayoutRootView();
    }, [onLayoutRootView]);

    if (!fontsLoaded && !fontError) {
        return null;
    }

    return (
        <GestureHandlerRootView style={styles.container}>
            <SafeAreaProvider>
                <ThemeProvider>
                    <AuthProvider>
                        <CartProvider>
                            <FavoritesProvider>
                                <RootLayoutContent />
                            </FavoritesProvider>
                        </CartProvider>
                    </AuthProvider>
                </ThemeProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
