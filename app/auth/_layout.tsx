// STEP Footwear App - Auth Layout
// Stack layout for authentication screens

import React from 'react';
import { Stack } from 'expo-router';
import { useTheme } from '../../src/contexts/ThemeContext';

export default function AuthLayout() {
    const { colors } = useTheme();

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.background },
                animation: 'slide_from_right',
            }}
        >
            <Stack.Screen name="signin" />
            <Stack.Screen name="signup" />
        </Stack>
    );
}
