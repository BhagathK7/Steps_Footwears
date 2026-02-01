// STEP Footwear App - Loading Spinner Component
// Animated loading indicator

import React from 'react';
import { StyleSheet, View, ActivityIndicator, ViewStyle } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing,
} from 'react-native-reanimated';
import { useTheme } from '../../contexts/ThemeContext';
import { Colors } from '../../constants';

interface LoadingSpinnerProps {
    size?: 'small' | 'large';
    color?: string;
    style?: ViewStyle;
    overlay?: boolean;
}

export function LoadingSpinner({
    size = 'large',
    color,
    style,
    overlay = false,
}: LoadingSpinnerProps) {
    const { colors } = useTheme();
    const spinnerColor = color || colors.primary;

    if (overlay) {
        return (
            <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
                <View style={[styles.overlayContent, { backgroundColor: colors.surface }]}>
                    <ActivityIndicator size={size} color={spinnerColor} />
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.container, style]}>
            <ActivityIndicator size={size} color={spinnerColor} />
        </View>
    );
}

// Skeleton loader for content placeholders
interface SkeletonProps {
    width?: number | string;
    height?: number;
    borderRadius?: number;
    style?: ViewStyle;
}

export function Skeleton({
    width = '100%',
    height = 20,
    borderRadius = 8,
    style,
}: SkeletonProps) {
    const { colors } = useTheme();
    const opacity = useSharedValue(0.5);

    React.useEffect(() => {
        opacity.value = withRepeat(
            withTiming(1, { duration: 800, easing: Easing.ease }),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <Animated.View
            style={[
                {
                    width: width as any,
                    height,
                    borderRadius,
                    backgroundColor: colors.skeleton,
                },
                animatedStyle,
                style,
            ]}
        />
    );
}

// Full screen loading
export function FullScreenLoader() {
    const { colors } = useTheme();

    return (
        <View style={[styles.fullScreen, { backgroundColor: colors.background }]}>
            <LoadingSpinner size="large" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    },
    overlayContent: {
        padding: 24,
        borderRadius: 16,
        ...Colors.shadows.large,
    },
    fullScreen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default LoadingSpinner;
