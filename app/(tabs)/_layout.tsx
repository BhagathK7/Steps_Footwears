// STEP Footwear App - Tab Layout
// Bottom tab navigation with glass tab bar

import React from 'react';
import { Tabs } from 'expo-router';
import { GlassTabBar } from '../../src/components/navigation/GlassTabBar';
import { useTheme } from '../../src/contexts/ThemeContext';

export default function TabLayout() {
    const { colors } = useTheme();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
            }}
            tabBar={(props) => <GlassTabBar {...props} />}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                }}
            />
            <Tabs.Screen
                name="categories"
                options={{
                    title: 'Categories',
                }}
            />
            <Tabs.Screen
                name="cart"
                options={{
                    title: 'Cart',
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                }}
            />
        </Tabs>
    );
}
