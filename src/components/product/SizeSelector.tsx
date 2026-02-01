// STEP Footwear App - Size Selector Component
// Animated size selection buttons

import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import Animated, {
    useAnimatedStyle,
    withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { AnimatedPressable } from '../common/AnimatedPressable';
import { useTheme } from '../../contexts/ThemeContext';
import { Spacing, Fonts, Animations } from '../../constants';

interface SizeSelectorProps {
    sizes: string[];
    selectedSize: string;
    onSelectSize: (size: string) => void;
    availableSizes?: string[];
}

export function SizeSelector({
    sizes,
    selectedSize,
    onSelectSize,
    availableSizes,
}: SizeSelectorProps) {
    const { colors } = useTheme();

    const isSizeAvailable = (size: string) => {
        if (!availableSizes) return true;
        return availableSizes.includes(size);
    };

    const handleSelect = (size: string) => {
        if (!isSizeAvailable(size)) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onSelectSize(size);
    };

    return (
        <View style={styles.container}>
            <Text style={[styles.label, { color: colors.text }]}>Select Size</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.sizesContainer}
            >
                {sizes.map((size) => {
                    const isSelected = size === selectedSize;
                    const isAvailable = isSizeAvailable(size);

                    return (
                        <SizeButton
                            key={size}
                            size={size}
                            isSelected={isSelected}
                            isAvailable={isAvailable}
                            onPress={() => handleSelect(size)}
                            colors={colors}
                        />
                    );
                })}
            </ScrollView>
        </View>
    );
}

interface SizeButtonProps {
    size: string;
    isSelected: boolean;
    isAvailable: boolean;
    onPress: () => void;
    colors: any;
}

function SizeButton({ size, isSelected, isAvailable, onPress, colors }: SizeButtonProps) {
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: withSpring(isSelected ? 1.05 : 1, Animations.spring.snappy) }],
        backgroundColor: isSelected ? colors.primary : colors.surface,
        borderColor: isSelected ? colors.primary : colors.border,
    }));

    return (
        <AnimatedPressable
            onPress={onPress}
            disabled={!isAvailable}
            haptic={false}
        >
            <Animated.View
                style={[
                    styles.sizeButton,
                    animatedStyle,
                    !isAvailable && styles.unavailable,
                ]}
            >
                <Text
                    style={[
                        styles.sizeText,
                        {
                            color: isSelected ? '#FFFFFF' : colors.text,
                            opacity: isAvailable ? 1 : 0.4,
                        },
                    ]}
                >
                    {size}
                </Text>
                {!isAvailable && <View style={[styles.strikeThrough, { backgroundColor: colors.textMuted }]} />}
            </Animated.View>
        </AnimatedPressable>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: Spacing.md,
    },
    label: {
        fontFamily: Fonts.family.semiBold,
        fontSize: Fonts.size.md,
        marginBottom: Spacing.sm,
    },
    sizesContainer: {
        flexDirection: 'row',
        gap: Spacing.sm,
        paddingVertical: Spacing.xs,
    },
    sizeButton: {
        minWidth: 56,
        height: 48,
        borderRadius: Spacing.radius.md,
        borderWidth: 1.5,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: Spacing.sm,
        position: 'relative',
        overflow: 'hidden',
    },
    sizeText: {
        fontFamily: Fonts.family.semiBold,
        fontSize: Fonts.size.sm,
    },
    unavailable: {
        opacity: 0.6,
    },
    strikeThrough: {
        position: 'absolute',
        width: '140%',
        height: 1.5,
        transform: [{ rotate: '-45deg' }],
    },
});

export default SizeSelector;
