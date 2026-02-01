// STEP Footwear App - Card Component
// Premium card with shadow and optional press action

import React from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import { AnimatedPressable } from './AnimatedPressable';
import { useTheme } from '../../contexts/ThemeContext';
import { Spacing, Colors } from '../../constants';

interface CardProps {
    children: React.ReactNode;
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
    padding?: number;
    elevated?: boolean;
    borderRadius?: number;
}

export function Card({
    children,
    onPress,
    style,
    padding = Spacing.cardPadding,
    elevated = true,
    borderRadius = Spacing.radius.lg,
}: CardProps) {
    const { colors, isDark } = useTheme();

    const cardStyle: ViewStyle = {
        backgroundColor: colors.card,
        borderRadius,
        padding,
        ...(elevated && {
            ...Colors.shadows.medium,
            shadowColor: isDark ? '#000000' : Colors.shadows.medium.shadowColor,
        }),
    };

    if (onPress) {
        return (
            <AnimatedPressable onPress={onPress} style={[cardStyle, style]}>
                {children}
            </AnimatedPressable>
        );
    }

    return <View style={[cardStyle, style]}>{children}</View>;
}

export default Card;
