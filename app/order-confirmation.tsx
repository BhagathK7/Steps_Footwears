// STEP Footwear App - Order Confirmation Screen
// Success page after placing an order

import React, { useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
    FadeIn,
    FadeInDown,
    ZoomIn,
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSequence,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

import { Button } from '../src/components/common/Button';
import { useTheme } from '../src/contexts/ThemeContext';
import { formatPrice } from '../src/utils';
import { Spacing, Fonts, Colors } from '../src/constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function OrderConfirmationScreen() {
    const { colors } = useTheme();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const params = useLocalSearchParams<{
        orderId: string;
        total: string;
        cod?: string;
    }>();

    const scale = useSharedValue(1);

    useEffect(() => {
        // Haptic feedback on success
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        // Pulsing animation for the success icon
        scale.value = withRepeat(
            withSequence(
                withTiming(1.1, { duration: 800 }),
                withTiming(1, { duration: 800 })
            ),
            3,
            false
        );
    }, []);

    const iconAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handleContinueShopping = () => {
        router.replace('/');
    };

    const handleViewOrders = () => {
        router.replace('/profile');
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Background Gradient */}
            <LinearGradient
                colors={[colors.primary + '15', 'transparent']}
                style={styles.gradient}
            />

            {/* Content */}
            <View style={[styles.content, { paddingTop: insets.top + 60 }]}>
                {/* Success Icon */}
                <Animated.View
                    entering={ZoomIn.delay(200).springify()}
                    style={iconAnimatedStyle}
                >
                    <View style={[styles.iconContainer, { backgroundColor: colors.success + '20' }]}>
                        <View style={[styles.iconInner, { backgroundColor: colors.success }]}>
                            <Ionicons name="checkmark" size={48} color="#FFFFFF" />
                        </View>
                    </View>
                </Animated.View>

                {/* Title */}
                <Animated.View entering={FadeInDown.delay(400).springify()}>
                    <Text style={[styles.title, { color: colors.text }]}>
                        Order Placed!
                    </Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                        Thank you for your purchase
                    </Text>
                </Animated.View>

                {/* Order Details Card */}
                <Animated.View
                    entering={FadeInDown.delay(600).springify()}
                    style={[styles.orderCard, { backgroundColor: colors.surface }]}
                >
                    <View style={styles.orderRow}>
                        <Text style={[styles.orderLabel, { color: colors.textSecondary }]}>
                            Order ID
                        </Text>
                        <Text style={[styles.orderValue, { color: colors.text }]}>
                            {params.orderId || 'N/A'}
                        </Text>
                    </View>

                    <View style={[styles.divider, { backgroundColor: colors.border }]} />

                    <View style={styles.orderRow}>
                        <Text style={[styles.orderLabel, { color: colors.textSecondary }]}>
                            Payment Method
                        </Text>
                        <Text style={[styles.orderValue, { color: colors.text }]}>
                            {params.cod === 'true' ? 'Cash on Delivery' : 'Razorpay'}
                        </Text>
                    </View>

                    <View style={[styles.divider, { backgroundColor: colors.border }]} />

                    <View style={styles.orderRow}>
                        <Text style={[styles.orderLabel, { color: colors.textSecondary }]}>
                            Total Amount
                        </Text>
                        <Text style={[styles.totalValue, { color: colors.success }]}>
                            {formatPrice(parseInt(params.total || '0', 10))}
                        </Text>
                    </View>
                </Animated.View>

                {/* Info Text */}
                <Animated.View entering={FadeInDown.delay(800).springify()}>
                    <View style={styles.infoContainer}>
                        <Ionicons name="mail-outline" size={20} color={colors.primary} />
                        <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                            A confirmation email has been sent to your registered email address
                        </Text>
                    </View>

                    <View style={styles.infoContainer}>
                        <Ionicons name="time-outline" size={20} color={colors.primary} />
                        <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                            Estimated delivery: 4-7 business days
                        </Text>
                    </View>
                </Animated.View>

                {/* Action Buttons */}
                <Animated.View
                    entering={FadeInDown.delay(1000).springify()}
                    style={styles.buttonContainer}
                >
                    <Button
                        title="View Orders"
                        onPress={handleViewOrders}
                        variant="outline"
                        fullWidth
                        style={styles.button}
                    />
                    <Button
                        title="Continue Shopping"
                        onPress={handleContinueShopping}
                        variant="gradient"
                        fullWidth
                        style={styles.button}
                    />
                </Animated.View>
            </View>

            {/* Decorative elements */}
            <Animated.View
                entering={FadeIn.delay(1200)}
                style={[styles.confetti, { top: insets.top + 40 }]}
            >
                {[...Array(6)].map((_, i) => (
                    <View
                        key={i}
                        style={[
                            styles.confettiDot,
                            {
                                backgroundColor: i % 2 === 0 ? colors.primary : colors.secondary,
                                left: `${15 + i * 15}%`,
                                top: Math.random() * 60,
                                transform: [{ rotate: `${i * 30}deg` }],
                            },
                        ]}
                    />
                ))}
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 400,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: Spacing.screenPadding,
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconInner: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontFamily: Fonts.family.extraBold,
        fontSize: Fonts.size.xxxl,
        textAlign: 'center',
        marginTop: Spacing.xl,
    },
    subtitle: {
        fontFamily: Fonts.family.regular,
        fontSize: Fonts.size.md,
        textAlign: 'center',
        marginTop: Spacing.sm,
    },
    orderCard: {
        width: '100%',
        borderRadius: Spacing.radius.xl,
        padding: Spacing.lg,
        marginTop: Spacing.xl,
        ...Colors.shadows.medium,
    },
    orderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: Spacing.sm,
    },
    orderLabel: {
        fontFamily: Fonts.family.regular,
        fontSize: Fonts.size.md,
    },
    orderValue: {
        fontFamily: Fonts.family.semiBold,
        fontSize: Fonts.size.md,
    },
    totalValue: {
        fontFamily: Fonts.family.bold,
        fontSize: Fonts.size.xl,
    },
    divider: {
        height: 1,
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        marginTop: Spacing.md,
        paddingHorizontal: Spacing.md,
    },
    infoText: {
        fontFamily: Fonts.family.regular,
        fontSize: Fonts.size.sm,
        flex: 1,
    },
    buttonContainer: {
        width: '100%',
        marginTop: Spacing.xxl,
        gap: Spacing.md,
    },
    button: {
        marginBottom: Spacing.sm,
    },
    confetti: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 100,
    },
    confettiDot: {
        position: 'absolute',
        width: 8,
        height: 8,
        borderRadius: 4,
    },
});
