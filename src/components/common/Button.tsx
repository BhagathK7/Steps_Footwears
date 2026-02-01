// STEP Footwear App - Button Component
// Premium styled button with variants and animations

import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
    StyleProp,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AnimatedPressable } from './AnimatedPressable';
import { useTheme } from '../../contexts/ThemeContext';
import { Spacing, Fonts, Colors } from '../../constants';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    loading?: boolean;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    fullWidth?: boolean;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
}

export function Button({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    loading = false,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    style,
    textStyle,
}: ButtonProps) {
    const { colors, isDark } = useTheme();

    const getButtonStyle = (): ViewStyle => {
        const baseStyle: ViewStyle = {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: Spacing.radius.lg,
        };

        // Size
        switch (size) {
            case 'small':
                baseStyle.paddingHorizontal = Spacing.md;
                baseStyle.paddingVertical = Spacing.sm;
                baseStyle.borderRadius = Spacing.radius.md;
                break;
            case 'large':
                baseStyle.paddingHorizontal = Spacing.xl;
                baseStyle.paddingVertical = Spacing.lg;
                break;
            default:
                baseStyle.paddingHorizontal = Spacing.buttonPadding.horizontal;
                baseStyle.paddingVertical = Spacing.buttonPadding.vertical;
        }

        // Variant
        switch (variant) {
            case 'primary':
                baseStyle.backgroundColor = colors.primary;
                break;
            case 'secondary':
                baseStyle.backgroundColor = colors.surfaceVariant;
                break;
            case 'outline':
                baseStyle.backgroundColor = 'transparent';
                baseStyle.borderWidth = 1.5;
                baseStyle.borderColor = colors.primary;
                break;
            case 'ghost':
                baseStyle.backgroundColor = 'transparent';
                break;
            case 'gradient':
                baseStyle.backgroundColor = 'transparent';
                break;
        }

        if (fullWidth) {
            baseStyle.width = '100%';
        }

        return baseStyle;
    };

    const getTextStyle = (): TextStyle => {
        const baseStyle: TextStyle = {
            fontFamily: Fonts.family.semiBold,
            letterSpacing: Fonts.letterSpacing.wide,
        };

        // Size
        switch (size) {
            case 'small':
                baseStyle.fontSize = Fonts.size.sm;
                break;
            case 'large':
                baseStyle.fontSize = Fonts.size.lg;
                break;
            default:
                baseStyle.fontSize = Fonts.size.md;
        }

        // Variant colors
        switch (variant) {
            case 'primary':
            case 'gradient':
                baseStyle.color = '#FFFFFF';
                break;
            case 'secondary':
                baseStyle.color = colors.text;
                break;
            case 'outline':
            case 'ghost':
                baseStyle.color = colors.primary;
                break;
        }

        return baseStyle;
    };

    const buttonStyle = getButtonStyle();
    const labelStyle = getTextStyle();

    const content = (
        <>
            {loading ? (
                <ActivityIndicator
                    color={labelStyle.color}
                    size={size === 'small' ? 'small' : 'small'}
                />
            ) : (
                <>
                    {icon && iconPosition === 'left' && (
                        <View style={styles.iconLeft}>{icon}</View>
                    )}
                    <Text style={[labelStyle, textStyle]}>{title}</Text>
                    {icon && iconPosition === 'right' && (
                        <View style={styles.iconRight}>{icon}</View>
                    )}
                </>
            )}
        </>
    );

    if (variant === 'gradient') {
        return (
            <AnimatedPressable
                onPress={onPress}
                disabled={disabled || loading}
                style={[fullWidth && styles.fullWidth, style]}
            >
                <LinearGradient
                    colors={Colors.gradients.primary}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[buttonStyle, styles.gradient]}
                >
                    {content}
                </LinearGradient>
            </AnimatedPressable>
        );
    }

    return (
        <AnimatedPressable
            onPress={onPress}
            disabled={disabled || loading}
            style={[buttonStyle, style]}
        >
            {content}
        </AnimatedPressable>
    );
}

const styles = StyleSheet.create({
    iconLeft: {
        marginRight: Spacing.sm,
    },
    iconRight: {
        marginLeft: Spacing.sm,
    },
    fullWidth: {
        width: '100%',
    },
    gradient: {
        overflow: 'hidden',
    },
});

export default Button;
