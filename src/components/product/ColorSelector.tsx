// STEP Footwear App - Color Selector Component
// Color swatches with selection animation

import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import Animated, {
    useAnimatedStyle,
    withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { AnimatedPressable } from '../common/AnimatedPressable';
import { useTheme } from '../../contexts/ThemeContext';
import { Spacing, Fonts, Animations } from '../../constants';

interface ColorOption {
    name: string;
    code: string;
}

interface ColorSelectorProps {
    colors: ColorOption[];
    selectedColor: string;
    onSelectColor: (color: string) => void;
}

export function ColorSelector({
    colors: colorOptions,
    selectedColor,
    onSelectColor,
}: ColorSelectorProps) {
    const { colors } = useTheme();

    const handleSelect = (colorName: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onSelectColor(colorName);
    };

    const selectedColorOption = colorOptions.find((c) => c.name === selectedColor);

    return (
        <View style={styles.container}>
            <View style={styles.labelRow}>
                <Text style={[styles.label, { color: colors.text }]}>Color</Text>
                <Text style={[styles.selectedName, { color: colors.textSecondary }]}>
                    {selectedColor}
                </Text>
            </View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.colorsContainer}
            >
                {colorOptions.map((colorOption) => {
                    const isSelected = colorOption.name === selectedColor;
                    const isLight = isLightColor(colorOption.code);

                    return (
                        <ColorButton
                            key={colorOption.name}
                            colorOption={colorOption}
                            isSelected={isSelected}
                            isLight={isLight}
                            onPress={() => handleSelect(colorOption.name)}
                            themeColors={colors}
                        />
                    );
                })}
            </ScrollView>
        </View>
    );
}

interface ColorButtonProps {
    colorOption: ColorOption;
    isSelected: boolean;
    isLight: boolean;
    onPress: () => void;
    themeColors: any;
}

function ColorButton({ colorOption, isSelected, isLight, onPress, themeColors }: ColorButtonProps) {
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: withSpring(isSelected ? 1.1 : 1, Animations.spring.snappy) }],
        borderWidth: withSpring(isSelected ? 2 : 0, Animations.spring.snappy),
    }));

    return (
        <AnimatedPressable onPress={onPress} haptic={false}>
            <Animated.View
                style={[
                    styles.colorButton,
                    {
                        backgroundColor: colorOption.code,
                        borderColor: themeColors.primary,
                    },
                    animatedStyle,
                    isLight && styles.lightColorBorder,
                ]}
            >
                {isSelected && (
                    <Ionicons
                        name="checkmark"
                        size={20}
                        color={isLight ? '#000000' : '#FFFFFF'}
                    />
                )}
            </Animated.View>
        </AnimatedPressable>
    );
}

// Helper to determine if color is light
function isLightColor(hexColor: string): boolean {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 155;
}

const styles = StyleSheet.create({
    container: {
        marginVertical: Spacing.md,
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.sm,
        gap: Spacing.sm,
    },
    label: {
        fontFamily: Fonts.family.semiBold,
        fontSize: Fonts.size.md,
    },
    selectedName: {
        fontFamily: Fonts.family.regular,
        fontSize: Fonts.size.md,
    },
    colorsContainer: {
        flexDirection: 'row',
        gap: Spacing.md,
        paddingVertical: Spacing.xs,
    },
    colorButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lightColorBorder: {
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
    },
});

export default ColorSelector;
