// STEP Footwear App - Quantity Selector Component
// Plus/minus quantity controls

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, {
    useAnimatedStyle,
    withSpring,
    useSharedValue,
    withSequence,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { AnimatedPressable } from '../common/AnimatedPressable';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { Spacing, Fonts, Animations } from '../../constants';

interface QuantitySelectorProps {
    quantity: number;
    onQuantityChange: (quantity: number) => void;
    minQuantity?: number;
    maxQuantity?: number;
    size?: 'small' | 'medium' | 'large';
}

export function QuantitySelector({
    quantity,
    onQuantityChange,
    minQuantity = 1,
    maxQuantity = 10,
    size = 'medium',
}: QuantitySelectorProps) {
    const { colors } = useTheme();
    const quantityScale = useSharedValue(1);

    const handleDecrease = () => {
        if (quantity > minQuantity) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            animateQuantity();
            onQuantityChange(quantity - 1);
        }
    };

    const handleIncrease = () => {
        if (quantity < maxQuantity) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            animateQuantity();
            onQuantityChange(quantity + 1);
        }
    };

    const animateQuantity = () => {
        quantityScale.value = withSequence(
            withSpring(1.2, Animations.spring.snappy),
            withSpring(1, Animations.spring.snappy)
        );
    };

    const quantityAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: quantityScale.value }],
    }));

    const getSizeStyles = () => {
        switch (size) {
            case 'small':
                return {
                    container: styles.containerSmall,
                    button: styles.buttonSmall,
                    text: styles.textSmall,
                    iconSize: 16,
                };
            case 'large':
                return {
                    container: styles.containerLarge,
                    button: styles.buttonLarge,
                    text: styles.textLarge,
                    iconSize: 24,
                };
            default:
                return {
                    container: styles.containerMedium,
                    button: styles.buttonMedium,
                    text: styles.textMedium,
                    iconSize: 20,
                };
        }
    };

    const sizeStyles = getSizeStyles();
    const canDecrease = quantity > minQuantity;
    const canIncrease = quantity < maxQuantity;

    return (
        <View
            style={[
                styles.container,
                sizeStyles.container,
                { backgroundColor: colors.surfaceVariant, borderColor: colors.border },
            ]}
        >
            <AnimatedPressable
                onPress={handleDecrease}
                disabled={!canDecrease}
                haptic={false}
                style={[sizeStyles.button, !canDecrease && styles.disabled]}
            >
                <Ionicons
                    name="remove"
                    size={sizeStyles.iconSize}
                    color={canDecrease ? colors.text : colors.textMuted}
                />
            </AnimatedPressable>

            <Animated.View style={quantityAnimatedStyle}>
                <Text style={[styles.quantity, sizeStyles.text, { color: colors.text }]}>
                    {quantity}
                </Text>
            </Animated.View>

            <AnimatedPressable
                onPress={handleIncrease}
                disabled={!canIncrease}
                haptic={false}
                style={[sizeStyles.button, !canIncrease && styles.disabled]}
            >
                <Ionicons
                    name="add"
                    size={sizeStyles.iconSize}
                    color={canIncrease ? colors.text : colors.textMuted}
                />
            </AnimatedPressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: Spacing.radius.md,
        borderWidth: 1,
    },
    containerSmall: {
        height: 36,
        minWidth: 100,
        paddingHorizontal: Spacing.xs,
    },
    containerMedium: {
        height: 48,
        minWidth: 130,
        paddingHorizontal: Spacing.sm,
    },
    containerLarge: {
        height: 56,
        minWidth: 150,
        paddingHorizontal: Spacing.md,
    },
    buttonSmall: {
        width: 28,
        height: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonMedium: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonLarge: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    disabled: {
        opacity: 0.4,
    },
    quantity: {
        fontFamily: Fonts.family.bold,
        textAlign: 'center',
        minWidth: 30,
    },
    textSmall: {
        fontSize: Fonts.size.md,
    },
    textMedium: {
        fontSize: Fonts.size.lg,
    },
    textLarge: {
        fontSize: Fonts.size.xl,
    },
});

export default QuantitySelector;
