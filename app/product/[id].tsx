// STEP Footwear App - Product Detail Screen
// Comprehensive product view with all options

import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    Alert,
    Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { Header } from '../../src/components/navigation/Header';
import { Button } from '../../src/components/common/Button';
import { IconButton } from '../../src/components/common/IconButton';
import { LoadingSpinner } from '../../src/components/common/LoadingSpinner';
import { ImageCarousel } from '../../src/components/product/ImageCarousel';
import { SizeSelector } from '../../src/components/product/SizeSelector';
import { ColorSelector } from '../../src/components/product/ColorSelector';
import { QuantitySelector } from '../../src/components/product/QuantitySelector';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useCart } from '../../src/contexts/CartContext';
import { useFavorites } from '../../src/contexts/FavoritesContext';
import { productService } from '../../src/services';
import { formatPrice, calculateDiscount } from '../../src/utils';
import { Spacing, Fonts, Colors } from '../../src/constants';
import { Product } from '../../src/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ProductDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { colors } = useTheme();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { addItem } = useCart();
    const { isFavorite, toggleFavorite } = useFavorites();

    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    useEffect(() => {
        loadProduct();
    }, [id]);

    const loadProduct = async () => {
        if (!id) return;
        try {
            const prod = await productService.getProduct(id);
            setProduct(prod);
            // Set default selections
            if (prod.sizes.length > 0) setSelectedSize(prod.sizes[0]);
            if (prod.colors.length > 0) setSelectedColor(prod.colors[0].name);
        } catch (error) {
            console.error('Failed to load product:', error);
            Alert.alert('Error', 'Failed to load product details');
        } finally {
            setIsLoading(false);
        }
    };

    const getStockForSelection = () => {
        if (!product || !selectedSize || !selectedColor) return 0;
        const variant = product.variants.find(
            (v) => v.size === selectedSize && v.color === selectedColor
        );
        return variant?.stock || 0;
    };

    const getAvailableSizes = () => {
        if (!product || !selectedColor) return product?.sizes || [];
        return product.variants
            .filter((v) => v.color === selectedColor && v.stock > 0)
            .map((v) => v.size);
    };

    const handleAddToCart = async () => {
        if (!product) return;

        if (!selectedSize) {
            Alert.alert('Select Size', 'Please select a size');
            return;
        }

        if (!selectedColor) {
            Alert.alert('Select Color', 'Please select a color');
            return;
        }

        const stock = getStockForSelection();
        if (stock === 0) {
            Alert.alert('Out of Stock', 'This variant is currently out of stock');
            return;
        }

        setIsAddingToCart(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        // Find the variant
        const variant = product.variants.find(
            (v) => v.size === selectedSize && v.color === selectedColor
        );

        addItem({
            product,
            variant: variant!,
            quantity,
            selectedSize,
            selectedColor,
        });

        setTimeout(() => {
            setIsAddingToCart(false);
            Alert.alert(
                'Added to Cart',
                `${product.name} has been added to your cart`,
                [
                    { text: 'Continue Shopping', style: 'cancel' },
                    { text: 'View Cart', onPress: () => router.push('/cart') },
                ]
            );
        }, 500);
    };

    const handleBuyNow = () => {
        handleAddToCart();
        setTimeout(() => {
            router.push('/checkout');
        }, 600);
    };

    const handleFavoritePress = () => {
        if (product) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            toggleFavorite(product);
        }
    };

    if (isLoading) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Header showBack title="Product" />
                <LoadingSpinner />
            </View>
        );
    }

    if (!product) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Header showBack title="Product" />
                <View style={styles.errorContainer}>
                    <Text style={[styles.errorText, { color: colors.textMuted }]}>
                        Product not found
                    </Text>
                </View>
            </View>
        );
    }

    const hasDiscount = product.originalPrice && product.originalPrice > product.price;
    const discountPercent = hasDiscount
        ? calculateDiscount(product.originalPrice!, product.price)
        : 0;
    const stock = getStockForSelection();
    const favorited = isFavorite(product.id);

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <Header
                showBack
                showSearch={false}
                rightAction={
                    <IconButton
                        icon={favorited ? 'heart' : 'heart-outline'}
                        onPress={handleFavoritePress}
                        color={favorited ? colors.error : colors.icon}
                    />
                }
                transparent
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Image Carousel */}
                <Animated.View entering={FadeIn.duration(500)}>
                    <ImageCarousel images={product.images} height={380} />
                </Animated.View>

                {/* Product Info */}
                <Animated.View
                    entering={FadeInDown.delay(200).springify()}
                    style={styles.productInfo}
                >
                    <View style={styles.brandRow}>
                        <Text style={[styles.brand, { color: colors.textMuted }]}>
                            {product.brand}
                        </Text>
                        {product.isNew && (
                            <View style={[styles.newBadge, { backgroundColor: colors.primary }]}>
                                <Text style={styles.newBadgeText}>NEW</Text>
                            </View>
                        )}
                    </View>

                    <Text style={[styles.name, { color: colors.text }]}>
                        {product.name}
                    </Text>

                    {/* Rating */}
                    <View style={styles.ratingRow}>
                        <View style={styles.stars}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Ionicons
                                    key={star}
                                    name={star <= Math.floor(product.rating) ? 'star' : 'star-outline'}
                                    size={16}
                                    color="#FFB800"
                                />
                            ))}
                        </View>
                        <Text style={[styles.rating, { color: colors.textSecondary }]}>
                            {product.rating.toFixed(1)} ({product.reviewCount} reviews)
                        </Text>
                    </View>

                    {/* Price */}
                    <View style={styles.priceRow}>
                        <Text style={[styles.price, { color: colors.text }]}>
                            {formatPrice(product.price)}
                        </Text>
                        {hasDiscount && (
                            <>
                                <Text style={[styles.originalPrice, { color: colors.textMuted }]}>
                                    {formatPrice(product.originalPrice!)}
                                </Text>
                                <View style={[styles.discountBadge, { backgroundColor: colors.error }]}>
                                    <Text style={styles.discountText}>{discountPercent}% OFF</Text>
                                </View>
                            </>
                        )}
                    </View>

                    {/* Description */}
                    <Text style={[styles.description, { color: colors.textSecondary }]}>
                        {product.description}
                    </Text>
                </Animated.View>

                {/* Color Selector */}
                <Animated.View
                    entering={FadeInDown.delay(300).springify()}
                    style={styles.section}
                >
                    <ColorSelector
                        colors={product.colors}
                        selectedColor={selectedColor}
                        onSelectColor={setSelectedColor}
                    />
                </Animated.View>

                {/* Size Selector */}
                <Animated.View
                    entering={FadeInDown.delay(400).springify()}
                    style={styles.section}
                >
                    <SizeSelector
                        sizes={product.sizes}
                        selectedSize={selectedSize}
                        onSelectSize={setSelectedSize}
                        availableSizes={getAvailableSizes()}
                    />
                </Animated.View>

                {/* Quantity and Stock */}
                <Animated.View
                    entering={FadeInDown.delay(500).springify()}
                    style={styles.section}
                >
                    <View style={styles.quantityRow}>
                        <View>
                            <Text style={[styles.sectionLabel, { color: colors.text }]}>
                                Quantity
                            </Text>
                            <QuantitySelector
                                quantity={quantity}
                                onQuantityChange={setQuantity}
                                maxQuantity={Math.min(stock, 10)}
                            />
                        </View>
                        <View style={styles.stockInfo}>
                            {stock > 0 ? (
                                <>
                                    <Ionicons
                                        name="checkmark-circle"
                                        size={18}
                                        color={stock > 5 ? colors.success : colors.warning}
                                    />
                                    <Text
                                        style={[
                                            styles.stockText,
                                            { color: stock > 5 ? colors.success : colors.warning },
                                        ]}
                                    >
                                        {stock > 10 ? 'In Stock' : `Only ${stock} left`}
                                    </Text>
                                </>
                            ) : (
                                <>
                                    <Ionicons name="close-circle" size={18} color={colors.error} />
                                    <Text style={[styles.stockText, { color: colors.error }]}>
                                        Out of Stock
                                    </Text>
                                </>
                            )}
                        </View>
                    </View>
                </Animated.View>

                {/* Shipping Info */}
                <Animated.View
                    entering={FadeInDown.delay(600).springify()}
                    style={[styles.shippingInfo, { backgroundColor: colors.surfaceVariant }]}
                >
                    <View style={styles.shippingRow}>
                        <Ionicons name="cube-outline" size={20} color={colors.primary} />
                        <Text style={[styles.shippingText, { color: colors.text }]}>
                            Free shipping on orders above ₹1,999
                        </Text>
                    </View>
                    <View style={styles.shippingRow}>
                        <Ionicons name="refresh-outline" size={20} color={colors.primary} />
                        <Text style={[styles.shippingText, { color: colors.text }]}>
                            Easy 15-day returns
                        </Text>
                    </View>
                </Animated.View>

                <View style={{ height: 120 }} />
            </ScrollView>

            {/* Bottom Action Bar */}
            <View
                style={[
                    styles.actionBar,
                    {
                        backgroundColor: colors.background,
                        paddingBottom: insets.bottom + Spacing.md,
                    },
                ]}
            >
                <Button
                    title="Add to Cart"
                    onPress={handleAddToCart}
                    variant="outline"
                    disabled={stock === 0}
                    loading={isAddingToCart}
                    style={styles.cartButton}
                    icon={<Ionicons name="bag-add-outline" size={20} color={colors.primary} />}
                />
                <Button
                    title="Buy Now"
                    onPress={handleBuyNow}
                    variant="gradient"
                    disabled={stock === 0}
                    style={styles.buyButton}
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
        paddingBottom: Spacing.xl,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontFamily: Fonts.family.medium,
        fontSize: Fonts.size.lg,
    },
    productInfo: {
        paddingHorizontal: Spacing.screenPadding,
        paddingTop: Spacing.lg,
    },
    brandRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    brand: {
        fontFamily: Fonts.family.medium,
        fontSize: Fonts.size.sm,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    newBadge: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: 2,
        borderRadius: Spacing.radius.sm,
    },
    newBadgeText: {
        fontFamily: Fonts.family.semiBold,
        fontSize: Fonts.size.xs,
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
    name: {
        fontFamily: Fonts.family.bold,
        fontSize: Fonts.size.xxl,
        marginTop: Spacing.xs,
        lineHeight: 32,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: Spacing.sm,
        gap: Spacing.sm,
    },
    stars: {
        flexDirection: 'row',
        gap: 2,
    },
    rating: {
        fontFamily: Fonts.family.regular,
        fontSize: Fonts.size.sm,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: Spacing.md,
        gap: Spacing.sm,
    },
    price: {
        fontFamily: Fonts.family.extraBold,
        fontSize: Fonts.size.xxxl,
    },
    originalPrice: {
        fontFamily: Fonts.family.regular,
        fontSize: Fonts.size.lg,
        textDecorationLine: 'line-through',
    },
    discountBadge: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: 4,
        borderRadius: Spacing.radius.sm,
    },
    discountText: {
        fontFamily: Fonts.family.semiBold,
        fontSize: Fonts.size.sm,
        color: '#FFFFFF',
    },
    description: {
        fontFamily: Fonts.family.regular,
        fontSize: Fonts.size.md,
        lineHeight: 24,
        marginTop: Spacing.lg,
    },
    section: {
        paddingHorizontal: Spacing.screenPadding,
    },
    sectionLabel: {
        fontFamily: Fonts.family.semiBold,
        fontSize: Fonts.size.md,
        marginBottom: Spacing.sm,
    },
    quantityRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginVertical: Spacing.md,
    },
    stockInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
    },
    stockText: {
        fontFamily: Fonts.family.medium,
        fontSize: Fonts.size.sm,
    },
    shippingInfo: {
        marginHorizontal: Spacing.screenPadding,
        marginTop: Spacing.lg,
        padding: Spacing.md,
        borderRadius: Spacing.radius.lg,
        gap: Spacing.sm,
    },
    shippingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    shippingText: {
        fontFamily: Fonts.family.regular,
        fontSize: Fonts.size.sm,
    },
    actionBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        paddingHorizontal: Spacing.screenPadding,
        paddingTop: Spacing.md,
        gap: Spacing.md,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
    },
    cartButton: {
        flex: 1,
    },
    buyButton: {
        flex: 1,
    },
});
