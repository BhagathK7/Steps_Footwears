// STEP Footwear App - Support Layout
// Stack layout for support screens

import React from 'react';
import { Stack } from 'expo-router';
import { useTheme } from '../../src/contexts/ThemeContext';

export default function SupportLayout() {
    const { colors } = useTheme();

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.background },
                animation: 'slide_from_right',
            }}
        >
            <Stack.Screen name="help" />
            <Stack.Screen name="contact" />
            <Stack.Screen name="terms" />
        </Stack>
    );
}
