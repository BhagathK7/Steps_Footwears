// STEP Footwear App - Input Component
// Styled text input with label and error states

import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    TextInput,
    Text,
    TextInputProps,
    ViewStyle,
    Pressable,
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { Spacing, Fonts, Animations } from '../../constants';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    leftIcon?: keyof typeof Ionicons.glyphMap;
    rightIcon?: keyof typeof Ionicons.glyphMap;
    onRightIconPress?: () => void;
    containerStyle?: ViewStyle;
}

export function Input({
    label,
    error,
    leftIcon,
    rightIcon,
    onRightIconPress,
    containerStyle,
    secureTextEntry,
    onFocus,
    onBlur,
    ...props
}: InputProps) {
    const { colors } = useTheme();
    const [isFocused, setIsFocused] = useState(false);
    const [isSecure, setIsSecure] = useState(secureTextEntry);

    const borderColor = useSharedValue(colors.border);

    const animatedBorderStyle = useAnimatedStyle(() => ({
        borderColor: borderColor.value,
    }));

    const handleFocus = (e: any) => {
        setIsFocused(true);
        borderColor.value = withTiming(colors.primary, { duration: Animations.duration.fast });
        onFocus?.(e);
    };

    const handleBlur = (e: any) => {
        setIsFocused(false);
        borderColor.value = withTiming(
            error ? colors.error : colors.border,
            { duration: Animations.duration.fast }
        );
        onBlur?.(e);
    };

    const toggleSecure = () => {
        setIsSecure(!isSecure);
    };

    return (
        <View style={[styles.container, containerStyle]}>
            {label && (
                <Text style={[styles.label, { color: colors.textSecondary }]}>
                    {label}
                </Text>
            )}

            <Animated.View
                style={[
                    styles.inputContainer,
                    {
                        backgroundColor: colors.surfaceVariant,
                        borderColor: error ? colors.error : colors.border,
                    },
                    animatedBorderStyle,
                    isFocused && styles.inputFocused,
                ]}
            >
                {leftIcon && (
                    <Ionicons
                        name={leftIcon}
                        size={20}
                        color={isFocused ? colors.primary : colors.iconMuted}
                        style={styles.leftIcon}
                    />
                )}

                <TextInput
                    style={[
                        styles.input,
                        {
                            color: colors.text,
                            fontFamily: Fonts.family.regular,
                        },
                    ]}
                    placeholderTextColor={colors.textMuted}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    secureTextEntry={isSecure}
                    {...props}
                />

                {secureTextEntry && (
                    <Pressable onPress={toggleSecure} style={styles.rightIcon}>
                        <Ionicons
                            name={isSecure ? 'eye-outline' : 'eye-off-outline'}
                            size={20}
                            color={colors.iconMuted}
                        />
                    </Pressable>
                )}

                {rightIcon && !secureTextEntry && (
                    <Pressable
                        onPress={onRightIconPress}
                        style={styles.rightIcon}
                        disabled={!onRightIconPress}
                    >
                        <Ionicons
                            name={rightIcon}
                            size={20}
                            color={colors.iconMuted}
                        />
                    </Pressable>
                )}
            </Animated.View>

            {error && (
                <Text style={[styles.error, { color: colors.error }]}>
                    {error}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: Spacing.md,
    },
    label: {
        fontFamily: Fonts.family.medium,
        fontSize: Fonts.size.sm,
        marginBottom: Spacing.xs,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderRadius: Spacing.radius.md,
        paddingHorizontal: Spacing.inputPadding.horizontal,
    },
    inputFocused: {
        borderWidth: 2,
    },
    input: {
        flex: 1,
        fontSize: Fonts.size.md,
        paddingVertical: Spacing.inputPadding.vertical,
    },
    leftIcon: {
        marginRight: Spacing.sm,
    },
    rightIcon: {
        marginLeft: Spacing.sm,
        padding: Spacing.xs,
    },
    error: {
        fontFamily: Fonts.family.regular,
        fontSize: Fonts.size.xs,
        marginTop: Spacing.xs,
    },
});

export default Input;
