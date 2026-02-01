// STEP Footwear App - Settings Layout
// Stack layout for settings screens

import React from 'react';
import { Stack } from 'expo-router';
import { useTheme } from '../../src/contexts/ThemeContext';

export default function SettingsLayout() {
    const { colors } = useTheme();

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.background },
                animation: 'slide_from_right',
            }}
        >
            <Stack.Screen name="notifications" />
            <Stack.Screen name="language" />
        </Stack>
    );
}
