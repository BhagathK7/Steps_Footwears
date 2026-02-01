// STEP Footwear App - Payment Methods Screen
// Manage saved payment methods

import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { Header } from '../src/components/navigation/Header';
import { Button } from '../src/components/common/Button';
import { AnimatedPressable } from '../src/components/common/AnimatedPressable';
import { useTheme } from '../src/contexts/ThemeContext';
import { Spacing, Fonts, Colors } from '../src/constants';

// Mock payment methods
const mockPayments = [
    {
        id: '1',
        type: 'card',
        name: 'HDFC Credit Card',
        last4: '4242',
        expiry: '12/26',
        isDefault: true,
    },
    {
        id: '2',
        type: 'upi',
        name: 'Google Pay',
        upiId: 'john@okicici',
        isDefault: false,
    },
];

export default function PaymentsScreen() {
    const { colors } = useTheme();
    const router = useRouter();

    const getPaymentIcon = (type: string) => {
        switch (type) {
            case 'card':
                return 'card';
            case 'upi':
                return 'phone-portrait';
            default:
                return 'wallet';
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Header title="Payment Methods" showBack />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                    Saved Payment Methods
                </Text>

                {mockPayments.map((payment, index) => (
                    <Animated.View
                        key={payment.id}
                        entering={FadeInDown.delay(index * 100).springify()}
                    >
                        <AnimatedPressable
                            onPress={() => { }}
                            style={[styles.paymentCard, { backgroundColor: colors.surface }]}
                        >
                            <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                                <Ionicons
                                    name={getPaymentIcon(payment.type)}
                                    size={24}
                                    color={colors.primary}
                                />
                            </View>
                            <View style={styles.paymentInfo}>
                                <View style={styles.paymentHeader}>
                                    <Text style={[styles.paymentName, { color: colors.text }]}>
                                        {payment.name}
                                    </Text>
                                    {payment.isDefault && (
                                        <View style={[styles.defaultBadge, { backgroundColor: colors.success + '20' }]}>
                                            <Text style={[styles.defaultText, { color: colors.success }]}>
                                                Default
                                            </Text>
                                        </View>
                                    )}
                                </View>
                                <Text style={[styles.paymentDetails, { color: colors.textSecondary }]}>
                                    {payment.type === 'card'
                                        ? `•••• ${payment.last4} | Exp: ${payment.expiry}`
                                        : payment.upiId}
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                        </AnimatedPressable>
                    </Animated.View>
                ))}

                <View style={styles.addSection}>
                    <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                        Add Payment Method
                    </Text>

                    <AnimatedPressable
                        onPress={() => { }}
                        style={[styles.addOption, { backgroundColor: colors.surface }]}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: colors.primaryLight + '20' }]}>
                            <Ionicons name="card-outline" size={24} color={colors.primaryLight} />
                        </View>
                        <Text style={[styles.addOptionText, { color: colors.text }]}>
                            Add Credit/Debit Card
                        </Text>
                        <Ionicons name="add" size={24} color={colors.primary} />
                    </AnimatedPressable>

                    <AnimatedPressable
                        onPress={() => { }}
                        style={[styles.addOption, { backgroundColor: colors.surface }]}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: colors.accent + '20' }]}>
                            <Ionicons name="phone-portrait-outline" size={24} color={colors.accent} />
                        </View>
                        <Text style={[styles.addOptionText, { color: colors.text }]}>
                            Add UPI ID
                        </Text>
                        <Ionicons name="add" size={24} color={colors.primary} />
                    </AnimatedPressable>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: Spacing.screenPadding,
        paddingBottom: 100,
    },
    sectionTitle: {
        fontFamily: Fonts.family.medium,
        fontSize: Fonts.size.sm,
        textTransform: 'uppercase',
        marginBottom: Spacing.md,
    },
    paymentCard: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: Spacing.radius.lg,
        padding: Spacing.lg,
        marginBottom: Spacing.md,
        ...Colors.shadows.small,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: Spacing.radius.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    paymentInfo: {
        flex: 1,
        marginLeft: Spacing.md,
    },
    paymentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    paymentName: {
        fontFamily: Fonts.family.semiBold,
        fontSize: Fonts.size.md,
    },
    defaultBadge: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: 2,
        borderRadius: Spacing.radius.full,
    },
    defaultText: {
        fontFamily: Fonts.family.medium,
        fontSize: Fonts.size.xs,
    },
    paymentDetails: {
        fontFamily: Fonts.family.regular,
        fontSize: Fonts.size.sm,
        marginTop: 2,
    },
    addSection: {
        marginTop: Spacing.xl,
    },
    addOption: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: Spacing.radius.lg,
        padding: Spacing.lg,
        marginBottom: Spacing.md,
        ...Colors.shadows.small,
    },
    addOptionText: {
        flex: 1,
        fontFamily: Fonts.family.medium,
        fontSize: Fonts.size.md,
        marginLeft: Spacing.md,
    },
});
