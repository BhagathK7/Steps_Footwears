// STEP Footwear App - Icon Button Component
// Circular icon button with animation

import React from 'react';
import { StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedPressable } from './AnimatedPressable';
import { useTheme } from '../../contexts/ThemeContext';
import { Spacing, Colors } from '../../constants';

interface IconButtonProps {
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
    size?: number;
    iconSize?: number;
    color?: string;
    backgroundColor?: string;
    style?: StyleProp<ViewStyle>;
    disabled?: boolean;
    variant?: 'filled' | 'outlined' | 'ghost';
}

export function IconButton({
    icon,
    onPress,
    size = 44,
    iconSize = 22,
    color,
    backgroundColor,
    style,
    disabled = false,
    variant = 'ghost',
}: IconButtonProps) {
    const { colors } = useTheme();

    const getStyles = (): ViewStyle => {
        const base: ViewStyle = {
            width: size,
            height: size,
            borderRadius: size / 2,
            justifyContent: 'center',
            alignItems: 'center',
        };

        switch (variant) {
            case 'filled':
                base.backgroundColor = backgroundColor || colors.primary;
                break;
            case 'outlined':
                base.backgroundColor = 'transparent';
                base.borderWidth = 1.5;
                base.borderColor = color || colors.border;
                break;
            case 'ghost':
            default:
                base.backgroundColor = 'transparent';
                break;
        }

        return base;
    };

    const getIconColor = (): string => {
        if (color) return color;
        if (variant === 'filled') return '#FFFFFF';
        return colors.icon;
    };

    return (
        <AnimatedPressable
            onPress={onPress}
            disabled={disabled}
            style={[getStyles(), style]}
        >
            <Ionicons name={icon} size={iconSize} color={getIconColor()} />
        </AnimatedPressable>
    );
}

export default IconButton;
