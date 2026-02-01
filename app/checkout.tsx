// STEP Footwear App - Checkout Screen
// Payment and order placement with Razorpay

import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    Alert,
    Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { Header } from '../src/components/navigation/Header';
import { Button } from '../src/components/common/Button';
import { Card } from '../src/components/common/Card';
import { Input } from '../src/components/common/Input';
import { AnimatedPressable } from '../src/components/common/AnimatedPressable';
import { LoadingSpinner } from '../src/components/common/LoadingSpinner';
import { useTheme } from '../src/contexts/ThemeContext';
import { useCart } from '../src/contexts/CartContext';
import { useAuth } from '../src/contexts/AuthContext';
import { formatPrice } from '../src/utils';
import { Spacing, Fonts, Colors } from '../src/constants';
import Config from '../src/config/env';

export default function CheckoutScreen() {
    const { colors } = useTheme();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { items, subtotal, clearCart } = useCart();
    const { user, isAuthenticated } = useAuth();

    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<'razorpay' | 'cod'>('razorpay');

    // Address form state
    const [address, setAddress] = useState({
        fullName: user?.fullName || '',
        phone: user?.phone || '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
    });

    // Calculate totals
    const shipping = subtotal > 1999 ? 0 : 99;
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + shipping + tax;

    const validateAddress = () => {
        if (!address.fullName.trim()) {
            Alert.alert('Error', 'Please enter your full name');
            return false;
        }
        if (!address.phone.trim() || address.phone.length < 10) {
            Alert.alert('Error', 'Please enter a valid phone number');
            return false;
        }
        if (!address.addressLine1.trim()) {
            Alert.alert('Error', 'Please enter your address');
            return false;
        }
        if (!address.city.trim()) {
            Alert.alert('Error', 'Please enter your city');
            return false;
        }
        if (!address.state.trim()) {
            Alert.alert('Error', 'Please enter your state');
            return false;
        }
        if (!address.postalCode.trim() || address.postalCode.length !== 6) {
            Alert.alert('Error', 'Please enter a valid 6-digit postal code');
            return false;
        }
        return true;
    };

    const handlePayment = async () => {
        if (items.length === 0) {
            Alert.alert('Empty Cart', 'Your cart is empty');
            return;
        }

        if (!validateAddress()) {
            return;
        }

        setIsProcessing(true);

        try {
            if (selectedPayment === 'razorpay') {
                // Razorpay integration
                // In production, you would:
                // 1. Call your backend to create a Razorpay order
                // 2. Open Razorpay checkout with the order details
                // 3. Handle success/failure callbacks

                // For demo, we'll simulate a successful payment
                if (Config.RAZORPAY_KEY_ID) {
                    // Actual Razorpay implementation would go here
                    // RazorpayCheckout.open(options)...
                }

                // Simulate payment processing
                await new Promise((resolve) => setTimeout(resolve, 2000));

                // Success - navigate to confirmation
                clearCart();
                router.replace({
                    pathname: '/order-confirmation',
                    params: {
                        orderId: 'ORD' + Date.now(),
                        total: total.toString(),
                    },
                });
            } else {
                // Cash on Delivery
                await new Promise((resolve) => setTimeout(resolve, 1000));

                clearCart();
                router.replace({
                    pathname: '/order-confirmation',
                    params: {
                        orderId: 'ORD' + Date.now(),
                        total: total.toString(),
                        cod: 'true',
                    },
                });
            }
        } catch (error) {
            console.error('Payment failed:', error);
            Alert.alert('Payment Failed', 'Something went wrong. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (items.length === 0) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Header showBack title="Checkout" showSearch={false} />
                <View style={styles.emptyContainer}>
                    <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                        Your cart is empty
                    </Text>
                    <Button
                        title="Continue Shopping"
                        onPress={() => router.push('/')}
                        variant="gradient"
                        style={{ marginTop: Spacing.lg }}
                    />
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Header showBack title="Checkout" showSearch={false} />

            {isProcessing && <LoadingSpinner overlay />}

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Shipping Address */}
                <Animated.View entering={FadeInDown.springify()}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        Shipping Address
                    </Text>
                    <Card style={styles.formCard}>
                        <Input
                            label="Full Name"
                            placeholder="John Doe"
                            value={address.fullName}
                            onChangeText={(text) => setAddress((prev) => ({ ...prev, fullName: text }))}
                            leftIcon="person-outline"
                        />
                        <Input
                            label="Phone Number"
                            placeholder="9876543210"
                            value={address.phone}
                            onChangeText={(text) => setAddress((prev) => ({ ...prev, phone: text }))}
                            leftIcon="call-outline"
                            keyboardType="phone-pad"
                            maxLength={10}
                        />
                        <Input
                            label="Address Line 1"
                            placeholder="House/Flat No., Building Name"
                            value={address.addressLine1}
                            onChangeText={(text) => setAddress((prev) => ({ ...prev, addressLine1: text }))}
                            leftIcon="location-outline"
                        />
                        <Input
                            label="Address Line 2 (Optional)"
                            placeholder="Street, Landmark"
                            value={address.addressLine2}
                            onChangeText={(text) => setAddress((prev) => ({ ...prev, addressLine2: text }))}
                            leftIcon="map-outline"
                        />
                        <View style={styles.row}>
                            <Input
                                label="City"
                                placeholder="Mumbai"
                                value={address.city}
                                onChangeText={(text) => setAddress((prev) => ({ ...prev, city: text }))}
                                containerStyle={styles.halfInput}
                            />
                            <Input
                                label="State"
                                placeholder="Maharashtra"
                                value={address.state}
                                onChangeText={(text) => setAddress((prev) => ({ ...prev, state: text }))}
                                containerStyle={styles.halfInput}
                            />
                        </View>
                        <Input
                            label="Postal Code"
                            placeholder="400001"
                            value={address.postalCode}
                            onChangeText={(text) => setAddress((prev) => ({ ...prev, postalCode: text }))}
                            keyboardType="number-pad"
                            maxLength={6}
                        />
                    </Card>
                </Animated.View>

                {/* Payment Method */}
                <Animated.View entering={FadeInDown.delay(100).springify()}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        Payment Method
                    </Text>

                    <AnimatedPressable
                        onPress={() => setSelectedPayment('razorpay')}
                        style={[
                            styles.paymentOption,
                            {
                                backgroundColor: colors.surface,
                                borderColor: selectedPayment === 'razorpay' ? colors.primary : colors.border,
                                borderWidth: selectedPayment === 'razorpay' ? 2 : 1,
                            },
                        ]}
                    >
                        <View style={[styles.paymentIcon, { backgroundColor: '#072654' }]}>
                            <Text style={styles.razorpayText}>R</Text>
                        </View>
                        <View style={styles.paymentInfo}>
                            <Text style={[styles.paymentTitle, { color: colors.text }]}>
                                Razorpay
                            </Text>
                            <Text style={[styles.paymentSubtitle, { color: colors.textSecondary }]}>
                                Credit/Debit Card, UPI, Net Banking
                            </Text>
                        </View>
                        <View
                            style={[
                                styles.radio,
                                {
                                    borderColor: selectedPayment === 'razorpay' ? colors.primary : colors.border,
                                    backgroundColor: selectedPayment === 'razorpay' ? colors.primary : 'transparent',
                                },
                            ]}
                        >
                            {selectedPayment === 'razorpay' && (
                                <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                            )}
                        </View>
                    </AnimatedPressable>

                    <AnimatedPressable
                        onPress={() => setSelectedPayment('cod')}
                        style={[
                            styles.paymentOption,
                            {
                                backgroundColor: colors.surface,
                                borderColor: selectedPayment === 'cod' ? colors.primary : colors.border,
                                borderWidth: selectedPayment === 'cod' ? 2 : 1,
                            },
                        ]}
                    >
                        <View style={[styles.paymentIcon, { backgroundColor: colors.surfaceVariant }]}>
                            <Ionicons name="cash-outline" size={22} color={colors.primary} />
                        </View>
                        <View style={styles.paymentInfo}>
                            <Text style={[styles.paymentTitle, { color: colors.text }]}>
                                Cash on Delivery
                            </Text>
                            <Text style={[styles.paymentSubtitle, { color: colors.textSecondary }]}>
                                Pay when you receive
                            </Text>
                        </View>
                        <View
                            style={[
                                styles.radio,
                                {
                                    borderColor: selectedPayment === 'cod' ? colors.primary : colors.border,
                                    backgroundColor: selectedPayment === 'cod' ? colors.primary : 'transparent',
                                },
                            ]}
                        >
                            {selectedPayment === 'cod' && (
                                <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                            )}
                        </View>
                    </AnimatedPressable>
                </Animated.View>

                {/* Order Summary */}
                <Animated.View entering={FadeInDown.delay(200).springify()}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        Order Summary
                    </Text>
                    <Card>
                        <View style={styles.summaryRow}>
                            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                                Items ({items.length})
                            </Text>
                            <Text style={[styles.summaryValue, { color: colors.text }]}>
                                {formatPrice(subtotal)}
                            </Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                                Shipping
                            </Text>
                            <Text style={[styles.summaryValue, { color: shipping === 0 ? colors.success : colors.text }]}>
                                {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                            </Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                                Tax (GST 18%)
                            </Text>
                            <Text style={[styles.summaryValue, { color: colors.text }]}>
                                {formatPrice(tax)}
                            </Text>
                        </View>
                        <View style={[styles.divider, { backgroundColor: colors.border }]} />
                        <View style={styles.summaryRow}>
                            <Text style={[styles.totalLabel, { color: colors.text }]}>
                                Total
                            </Text>
                            <Text style={[styles.totalValue, { color: colors.text }]}>
                                {formatPrice(total)}
                            </Text>
                        </View>
                    </Card>
                </Animated.View>

                <View style={{ height: 120 }} />
            </ScrollView>

            {/* Place Order Button */}
            <View
                style={[
                    styles.footer,
                    {
                        backgroundColor: colors.background,
                        paddingBottom: insets.bottom + Spacing.md,
                    },
                ]}
            >
                <Button
                    title={selectedPayment === 'cod' ? 'Place Order' : `Pay ${formatPrice(total)}`}
                    onPress={handlePayment}
                    variant="gradient"
                    fullWidth
                    loading={isProcessing}
                    icon={
                        <Ionicons
                            name={selectedPayment === 'cod' ? 'checkmark-circle' : 'card'}
                            size={20}
                            color="#FFFFFF"
                        />
                    }
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: Spacing.screenPadding,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontFamily: Fonts.family.medium,
        fontSize: Fonts.size.lg,
    },
    sectionTitle: {
        fontFamily: Fonts.family.bold,
        fontSize: Fonts.size.lg,
        marginBottom: Spacing.md,
        marginTop: Spacing.lg,
    },
    formCard: {
        padding: Spacing.md,
    },
    row: {
        flexDirection: 'row',
        gap: Spacing.md,
    },
    halfInput: {
        flex: 1,
    },
    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        borderRadius: Spacing.radius.lg,
        marginBottom: Spacing.sm,
    },
    paymentIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    razorpayText: {
        fontFamily: Fonts.family.bold,
        fontSize: Fonts.size.lg,
        color: '#FFFFFF',
    },
    paymentInfo: {
        flex: 1,
        marginLeft: Spacing.md,
    },
    paymentTitle: {
        fontFamily: Fonts.family.semiBold,
        fontSize: Fonts.size.md,
    },
    paymentSubtitle: {
        fontFamily: Fonts.family.regular,
        fontSize: Fonts.size.sm,
        marginTop: 2,
    },
    radio: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Spacing.sm,
    },
    summaryLabel: {
        fontFamily: Fonts.family.regular,
        fontSize: Fonts.size.md,
    },
    summaryValue: {
        fontFamily: Fonts.family.medium,
        fontSize: Fonts.size.md,
    },
    divider: {
        height: 1,
        marginVertical: Spacing.md,
    },
    totalLabel: {
        fontFamily: Fonts.family.bold,
        fontSize: Fonts.size.lg,
    },
    totalValue: {
        fontFamily: Fonts.family.extraBold,
        fontSize: Fonts.size.xl,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: Spacing.screenPadding,
        paddingTop: Spacing.md,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
    },
});
