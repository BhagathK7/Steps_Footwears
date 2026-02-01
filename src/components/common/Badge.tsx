// STEP Footwear App - Badge Component
// Small badge for notifications, counts, etc.

import React from 'react';
import { StyleSheet, View, Text, ViewStyle } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { Fonts, Spacing } from '../../constants';

interface BadgeProps {
    count?: number;
    maxCount?: number;
    dot?: boolean;
    color?: string;
    textColor?: string;
    size?: 'small' | 'medium';
    style?: ViewStyle;
}

export function Badge({
    count,
    maxCount = 99,
    dot = false,
    color,
    textColor,
    size = 'medium',
    style,
}: BadgeProps) {
    const { colors } = useTheme();

    if (!dot && (count === undefined || count <= 0)) {
        return null;
    }

    const backgroundColor = color || colors.primary;
    const labelColor = textColor || '#FFFFFF';

    if (dot) {
        return (
            <View
                style={[
                    styles.dot,
                    { backgroundColor },
                    size === 'small' && styles.dotSmall,
                    style,
                ]}
            />
        );
    }

    const displayCount = count! > maxCount ? `${maxCount}+` : count!.toString();
    const isWide = displayCount.length > 1;

    return (
        <View
            style={[
                styles.badge,
                { backgroundColor },
                isWide && styles.badgeWide,
                size === 'small' && styles.badgeSmall,
                style,
            ]}
        >
            <Text
                style={[
                    styles.text,
                    { color: labelColor },
                    size === 'small' && styles.textSmall,
                ]}
            >
                {displayCount}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    badge: {
        minWidth: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
    },
    badgeWide: {
        paddingHorizontal: 8,
    },
    badgeSmall: {
        minWidth: 16,
        height: 16,
        borderRadius: 8,
        paddingHorizontal: 4,
    },
    text: {
        fontFamily: Fonts.family.semiBold,
        fontSize: 11,
        textAlign: 'center',
    },
    textSmall: {
        fontSize: 9,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    dotSmall: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
});

export default Badge;
