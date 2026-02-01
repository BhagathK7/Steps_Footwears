// STEP Footwear App - Orders Screen
// Order history

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
import { formatPrice } from '../src/utils';
import { Spacing, Fonts, Colors } from '../src/constants';

// Mock orders data
const mockOrders = [
    {
        id: 'ORD-2024-001',
        date: '2024-01-28',
        status: 'Delivered',
        total: 12999,
        items: 2,
    },
    {
        id: 'ORD-2024-002',
        date: '2024-01-20',
        status: 'In Transit',
        total: 8499,
        items: 1,
    },
];

export default function OrdersScreen() {
    const { colors } = useTheme();
    const router = useRouter();

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Delivered':
                return colors.success;
            case 'In Transit':
                return colors.warning;
            case 'Processing':
                return colors.primary;
            case 'Cancelled':
                return colors.error;
            default:
                return colors.textMuted;
        }
    };

    if (mockOrders.length === 0) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Header title="My Orders" showBack />
                <View style={styles.emptyContainer}>
                    <Ionicons name="receipt-outline" size={80} color={colors.textMuted} />
                    <Text style={[styles.emptyTitle, { color: colors.text }]}>
                        No orders yet
                    </Text>
                    <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                        Your order history will appear here
                    </Text>
                    <Button
                        title="Start Shopping"
                        onPress={() => router.push('/')}
                        variant="gradient"
                        style={styles.shopButton}
                    />
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Header title="My Orders" showBack />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {mockOrders.map((order, index) => (
                    <Animated.View
                        key={order.id}
                        entering={FadeInDown.delay(index * 100).springify()}
                    >
                        <AnimatedPressable
                            onPress={() => { }}
                            style={[styles.orderCard, { backgroundColor: colors.surface }]}
                        >
                            <View style={styles.orderHeader}>
                                <Text style={[styles.orderId, { color: colors.text }]}>
                                    {order.id}
                                </Text>
                                <View
                                    style={[
                                        styles.statusBadge,
                                        { backgroundColor: getStatusColor(order.status) + '20' },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.statusText,
                                            { color: getStatusColor(order.status) },
                                        ]}
                                    >
                                        {order.status}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.orderDetails}>
                                <Text style={[styles.orderDate, { color: colors.textSecondary }]}>
                                    {new Date(order.date).toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                    })}
                                </Text>
                                <Text style={[styles.orderItems, { color: colors.textMuted }]}>
                                    {order.items} {order.items === 1 ? 'item' : 'items'}
                                </Text>
                            </View>
                            <View style={styles.orderFooter}>
                                <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>
                                    Total
                                </Text>
                                <Text style={[styles.totalValue, { color: colors.text }]}>
                                    {formatPrice(order.total)}
                                </Text>
                            </View>
                        </AnimatedPressable>
                    </Animated.View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: Spacing.xl,
    },
    emptyTitle: {
        fontFamily: Fonts.family.bold,
        fontSize: Fonts.size.xxl,
        marginTop: Spacing.lg,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontFamily: Fonts.family.regular,
        fontSize: Fonts.size.md,
        marginTop: Spacing.sm,
        textAlign: 'center',
    },
    shopButton: {
        marginTop: Spacing.xl,
        minWidth: 200,
    },
    scrollContent: {
        padding: Spacing.screenPadding,
        paddingBottom: 100,
    },
    orderCard: {
        borderRadius: Spacing.radius.lg,
        padding: Spacing.lg,
        marginBottom: Spacing.md,
        ...Colors.shadows.small,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    orderId: {
        fontFamily: Fonts.family.semiBold,
        fontSize: Fonts.size.md,
    },
    statusBadge: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs,
        borderRadius: Spacing.radius.full,
    },
    statusText: {
        fontFamily: Fonts.family.medium,
        fontSize: Fonts.size.xs,
    },
    orderDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: Spacing.md,
    },
    orderDate: {
        fontFamily: Fonts.family.regular,
        fontSize: Fonts.size.sm,
    },
    orderItems: {
        fontFamily: Fonts.family.regular,
        fontSize: Fonts.size.sm,
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: Spacing.md,
        paddingTop: Spacing.md,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
    },
    totalLabel: {
        fontFamily: Fonts.family.regular,
        fontSize: Fonts.size.sm,
    },
    totalValue: {
        fontFamily: Fonts.family.bold,
        fontSize: Fonts.size.lg,
    },
});
