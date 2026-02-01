// STEP Footwear App - Animated Pressable Component
// Reusable pressable with scale animation and haptic feedback
// Uses standard Pressable for cross-platform compatibility

import React, { useCallback } from 'react';
import { StyleSheet, ViewStyle, StyleProp, Pressable, Platform } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Animations } from '../../constants';

const AnimatedPressableView = Animated.createAnimatedComponent(Pressable);

interface AnimatedPressableProps {
    children: React.ReactNode;
    onPress?: () => void;
    onLongPress?: () => void;
    style?: StyleProp<ViewStyle>;
    disabled?: boolean;
    haptic?: boolean;
    scaleValue?: number;
}

export function AnimatedPressable({
    children,
    onPress,
    onLongPress,
    style,
    disabled = false,
    haptic = true,
    scaleValue = Animations.scale.pressed,
}: AnimatedPressableProps) {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    const triggerHaptic = useCallback(() => {
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    }, []);

    const triggerMediumHaptic = useCallback(() => {
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
    }, []);

    const handlePressIn = useCallback(() => {
        scale.value = withSpring(scaleValue, Animations.spring.snappy);
        opacity.value = withSpring(Animations.opacity.pressed, Animations.spring.snappy);
    }, [scaleValue]);

    const handlePressOut = useCallback(() => {
        scale.value = withSpring(1, Animations.spring.snappy);
        opacity.value = withSpring(1, Animations.spring.snappy);
    }, []);

    const handlePress = useCallback(() => {
        if (haptic) {
            triggerHaptic();
        }
        onPress?.();
    }, [haptic, onPress, triggerHaptic]);

    const handleLongPress = useCallback(() => {
        if (haptic) {
            triggerMediumHaptic();
        }
        onLongPress?.();
    }, [haptic, onLongPress, triggerMediumHaptic]);

    return (
        <AnimatedPressableView
            onPress={handlePress}
            onLongPress={onLongPress ? handleLongPress : undefined}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={disabled}
            style={[
                style,
                animatedStyle,
                disabled && styles.disabled,
            ]}
        >
            {children}
        </AnimatedPressableView>
    );
}

const styles = StyleSheet.create({
    disabled: {
        opacity: 0.5,
    },
});

export default AnimatedPressable;
