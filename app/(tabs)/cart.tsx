// STEP Footwear App - Cart Screen
// Shopping cart with items management

import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    Image,
    Alert,
    Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
    FadeInDown,
    FadeOutLeft,
    Layout,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../../src/components/navigation/Header';
import { Button } from '../../src/components/common/Button';
import { IconButton } from '../../src/components/common/IconButton';
import { QuantitySelector } from '../../src/components/product/QuantitySelector';
import { AnimatedPressable } from '../../src/components/common/AnimatedPressable';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useCart, CartItem } from '../../src/contexts/CartContext';
import { formatPrice } from '../../src/utils';
import { Spacing, Fonts, Colors } from '../../src/constants';

export default function CartScreen() {
    const { colors } = useTheme();
    const router = useRouter();
    const { items, itemCount, subtotal, updateQuantity, removeItem, clearCart } = useCart();

    const handleCheckout = () => {
        if (items.length === 0) {
            Alert.alert('Empty Cart', 'Please add items to your cart before checkout.');
            return;
        }
        router.push('/checkout');
    };

    const handleRemoveItem = (id: string) => {
        if (Platform.OS === 'web') {
            // On web, use confirm dialog
            if (window.confirm('Remove this item from your cart?')) {
                removeItem(id);
            }
        } else {
            Alert.alert(
                'Remove Item',
                'Are you sure you want to remove this item from your cart?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Remove', style: 'destructive', onPress: () => removeItem(id) },
                ]
            );
        }
    };

    const handleClearCart = () => {
        if (Platform.OS === 'web') {
            if (window.confirm('Remove all items from your cart?')) {
                clearCart();
            }
        } else {
            Alert.alert(
                'Clear Cart',
                'Are you sure you want to remove all items from your cart?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Clear', style: 'destructive', onPress: clearCart },
                ]
            );
        }
    };

    // Calculate totals
    const shipping = subtotal > 1999 ? 0 : 99;
    const tax = Math.round(subtotal * 0.18); // 18% GST
    const total = subtotal + shipping + tax;

    if (items.length === 0) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Header title="Cart" showSearch={false} />
                <View style={styles.emptyContainer}>
                    <Ionicons name="bag-outline" size={80} color={colors.textMuted} />
                    <Text style={[styles.emptyTitle, { color: colors.text }]}>
                        Your cart is empty
                    </Text>
                    <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                        Looks like you haven't added any items yet
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
            <Header
                title={`Cart (${itemCount})`}
                showSearch={false}
                rightAction={
                    <IconButton
                        icon="trash-outline"
                        onPress={handleClearCart}
                        color={colors.error}
                    />
                }
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Cart Items */}
                {items.map((item, index) => (
                    <Animated.View
                        key={item.id}
                        entering={FadeInDown.delay(index * 100).springify()}
                        exiting={FadeOutLeft.duration(300)}
                        layout={Layout.springify()}
                    >
                        <CartItemCard
                            item={item}
                            colors={colors}
                            onQuantityChange={(qty) => updateQuantity(item.id, qty)}
                            onRemove={() => handleRemoveItem(item.id)}
                            onPress={() => router.push(`/product/${item.product.id}`)}
                        />
                    </Animated.View>
                ))}

                {/* Order Summary */}
                <View style={[styles.summaryCard, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.summaryTitle, { color: colors.text }]}>
                        Order Summary
                    </Text>

                    <View style={styles.summaryRow}>
                        <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                            Subtotal ({itemCount} items)
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

                    {subtotal < 1999 && (
                        <View style={[styles.freeShippingBanner, { backgroundColor: colors.primaryLight + '20' }]}>
                            <Ionicons name="gift-outline" size={18} color={colors.primary} />
                            <Text style={[styles.freeShippingText, { color: colors.primary }]}>
                                Add {formatPrice(1999 - subtotal)} more for FREE shipping!
                            </Text>
                        </View>
                    )}

                    <View style={[styles.divider, { backgroundColor: colors.border }]} />

                    <View style={styles.summaryRow}>
                        <Text style={[styles.totalLabel, { color: colors.text }]}>
                            Total
                        </Text>
                        <Text style={[styles.totalValue, { color: colors.text }]}>
                            {formatPrice(total)}
                        </Text>
                    </View>
                </View>

                <View style={styles.bottomSpacing} />
            </ScrollView>

            {/* Checkout Button */}
            <View style={[styles.checkoutContainer, { backgroundColor: colors.background }]}>
                <View style={styles.checkoutInfo}>
                    <Text style={[styles.checkoutLabel, { color: colors.textSecondary }]}>
                        Total
                    </Text>
                    <Text style={[styles.checkoutTotal, { color: colors.text }]}>
                        {formatPrice(total)}
                    </Text>
                </View>
                <Button
                    title="Checkout"
                    onPress={handleCheckout}
                    variant="gradient"
                    style={styles.checkoutButton}
                />
            </View>
        </View>
    );
}

interface CartItemCardProps {
    item: CartItem;
    colors: any;
    onQuantityChange: (quantity: number) => void;
    onRemove: () => void;
    onPress: () => void;
}

function CartItemCard({ item, colors, onQuantityChange, onRemove, onPress }: CartItemCardProps) {
    const primaryImage = item.product.images.find((img) => img.isPrimary) || item.product.images[0];

    return (
        <View style={[styles.cartItem, { backgroundColor: colors.surface }]}>
            <AnimatedPressable onPress={onPress}>
                <Image
                    source={{ uri: primaryImage?.url }}
                    style={[styles.itemImage, { backgroundColor: colors.surfaceVariant }]}
                    resizeMode="cover"
                />
            </AnimatedPressable>

            <View style={styles.itemContent}>
                <View style={styles.itemHeader}>
                    <View style={styles.itemInfo}>
                        <Text style={[styles.itemBrand, { color: colors.textMuted }]}>
                            {item.product.brand}
                        </Text>
                        <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={2}>
                            {item.product.name}
                        </Text>
                    </View>
                    <IconButton
                        icon="close"
                        onPress={onRemove}
                        size={28}
                        iconSize={16}
                        color={colors.textMuted}
                    />
                </View>

                <View style={styles.itemDetails}>
                    <Text style={[styles.itemVariant, { color: colors.textSecondary }]}>
                        Size: {item.selectedSize} • {item.selectedColor}
                    </Text>
                </View>

                <View style={styles.itemFooter}>
                    <QuantitySelector
                        quantity={item.quantity}
                        onQuantityChange={onQuantityChange}
                        size="small"
                    />
                    <Text style={[styles.itemPrice, { color: colors.text }]}>
                        {formatPrice(item.product.price * item.quantity)}
                    </Text>
                </View>
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
    cartItem: {
        flexDirection: 'row',
        borderRadius: Spacing.radius.lg,
        padding: Spacing.md,
        marginBottom: Spacing.md,
        ...Colors.shadows.small,
    },
    itemImage: {
        width: 100,
        height: 100,
        borderRadius: Spacing.radius.md,
    },
    itemContent: {
        flex: 1,
        marginLeft: Spacing.md,
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    itemInfo: {
        flex: 1,
    },
    itemBrand: {
        fontFamily: Fonts.family.medium,
        fontSize: Fonts.size.xs,
        textTransform: 'uppercase',
    },
    itemName: {
        fontFamily: Fonts.family.semiBold,
        fontSize: Fonts.size.md,
        marginTop: 2,
    },
    itemDetails: {
        marginTop: Spacing.sm,
    },
    itemVariant: {
        fontFamily: Fonts.family.regular,
        fontSize: Fonts.size.sm,
    },
    itemFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: Spacing.md,
    },
    itemPrice: {
        fontFamily: Fonts.family.bold,
        fontSize: Fonts.size.lg,
    },
    summaryCard: {
        borderRadius: Spacing.radius.lg,
        padding: Spacing.lg,
        marginTop: Spacing.md,
        ...Colors.shadows.small,
    },
    summaryTitle: {
        fontFamily: Fonts.family.bold,
        fontSize: Fonts.size.lg,
        marginBottom: Spacing.md,
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
    freeShippingBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.sm,
        borderRadius: Spacing.radius.md,
        marginVertical: Spacing.sm,
        gap: Spacing.sm,
    },
    freeShippingText: {
        fontFamily: Fonts.family.medium,
        fontSize: Fonts.size.sm,
        flex: 1,
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
    bottomSpacing: {
        height: 180,
    },
    checkoutContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.screenPadding,
        paddingVertical: Spacing.md,
        paddingBottom: Spacing.xl,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
    },
    checkoutInfo: {
        flex: 1,
    },
    checkoutLabel: {
        fontFamily: Fonts.family.regular,
        fontSize: Fonts.size.sm,
    },
    checkoutTotal: {
        fontFamily: Fonts.family.bold,
        fontSize: Fonts.size.xl,
    },
    checkoutButton: {
        minWidth: 150,
    },
});
