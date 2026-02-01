// STEP Footwear App - Product Card Component
// Premium product card with animations

import React from 'react';
import { StyleSheet, View, Text, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, {
    FadeInDown,
    useAnimatedStyle,
    withSpring,
    useSharedValue,
} from 'react-native-reanimated';
import { AnimatedPressable } from '../common/AnimatedPressable';
import { IconButton } from '../common/IconButton';
import { useTheme } from '../../contexts/ThemeContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { Spacing, Fonts, Colors } from '../../constants';
import { formatPrice, calculateDiscount } from '../../utils';
import { Product } from '../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - Spacing.screenPadding * 2 - Spacing.md) / 2;

interface ProductCardProps {
    product: Product;
    index?: number;
    variant?: 'grid' | 'list' | 'featured';
}

export function ProductCard({ product, index = 0, variant = 'grid' }: ProductCardProps) {
    const { colors, isDark } = useTheme();
    const { isFavorite, toggleFavorite } = useFavorites();
    const router = useRouter();
    const favorited = isFavorite(product.id);

    const heartScale = useSharedValue(1);

    const handlePress = () => {
        router.push(`/product/${product.id}`);
    };

    const handleFavoritePress = () => {
        heartScale.value = withSpring(1.3, { damping: 10 }, () => {
            heartScale.value = withSpring(1);
        });
        toggleFavorite(product);
    };

    const heartAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: heartScale.value }],
    }));

    const hasDiscount = product.originalPrice && product.originalPrice > product.price;
    const discountPercent = hasDiscount
        ? calculateDiscount(product.originalPrice!, product.price)
        : 0;

    const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];

    if (variant === 'featured') {
        return (
            <Animated.View entering={FadeInDown.delay(index * 100).springify()}>
                <AnimatedPressable onPress={handlePress} style={styles.featuredCard}>
                    <View style={[styles.featuredImageContainer, { backgroundColor: colors.surfaceVariant }]}>
                        <Image
                            source={{ uri: primaryImage?.url }}
                            style={styles.featuredImage}
                            resizeMode="cover"
                        />
                        {product.isNew && (
                            <View style={[styles.newBadge, { backgroundColor: colors.primary }]}>
                                <Text style={styles.newBadgeText}>NEW</Text>
                            </View>
                        )}
                        <Animated.View style={[styles.favoriteButton, heartAnimatedStyle]}>
                            <IconButton
                                icon={favorited ? 'heart' : 'heart-outline'}
                                onPress={handleFavoritePress}
                                size={36}
                                iconSize={20}
                                color={favorited ? colors.error : colors.icon}
                                backgroundColor={colors.surface}
                                variant="filled"
                            />
                        </Animated.View>
                    </View>
                    <View style={styles.featuredContent}>
                        <Text style={[styles.brand, { color: colors.textMuted }]}>{product.brand}</Text>
                        <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
                            {product.name}
                        </Text>
                        <View style={styles.priceRow}>
                            <Text style={[styles.price, { color: colors.text }]}>
                                {formatPrice(product.price)}
                            </Text>
                            {hasDiscount && (
                                <Text style={[styles.originalPrice, { color: colors.textMuted }]}>
                                    {formatPrice(product.originalPrice!)}
                                </Text>
                            )}
                        </View>
                    </View>
                </AnimatedPressable>
            </Animated.View>
        );
    }

    return (
        <Animated.View
            entering={FadeInDown.delay(index * 80).springify()}
            style={[styles.gridCard, { width: CARD_WIDTH }]}
        >
            <AnimatedPressable onPress={handlePress}>
                <View
                    style={[
                        styles.imageContainer,
                        { backgroundColor: colors.surfaceVariant },
                    ]}
                >
                    <Image
                        source={{ uri: primaryImage?.url }}
                        style={styles.image}
                        resizeMode="cover"
                    />

                    {/* Badges */}
                    <View style={styles.badges}>
                        {hasDiscount && (
                            <View style={[styles.discountBadge, { backgroundColor: colors.error }]}>
                                <Text style={styles.discountText}>-{discountPercent}%</Text>
                            </View>
                        )}
                        {product.isNew && (
                            <View style={[styles.newBadge, { backgroundColor: colors.primary }]}>
                                <Text style={styles.newBadgeText}>NEW</Text>
                            </View>
                        )}
                    </View>

                    {/* Favorite button */}
                    <Animated.View style={[styles.favoriteButton, heartAnimatedStyle]}>
                        <IconButton
                            icon={favorited ? 'heart' : 'heart-outline'}
                            onPress={handleFavoritePress}
                            size={32}
                            iconSize={18}
                            color={favorited ? colors.error : colors.icon}
                            backgroundColor={colors.surface}
                            variant="filled"
                        />
                    </Animated.View>
                </View>

                <View style={styles.content}>
                    <Text style={[styles.brand, { color: colors.textMuted }]} numberOfLines={1}>
                        {product.brand}
                    </Text>
                    <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>
                        {product.name}
                    </Text>
                    <View style={styles.priceRow}>
                        <Text style={[styles.price, { color: colors.text }]}>
                            {formatPrice(product.price)}
                        </Text>
                        {hasDiscount && (
                            <Text style={[styles.originalPrice, { color: colors.textMuted }]}>
                                {formatPrice(product.originalPrice!)}
                            </Text>
                        )}
                    </View>

                    {/* Rating */}
                    <View style={styles.ratingRow}>
                        <Ionicons name="star" size={12} color="#FFB800" />
                        <Text style={[styles.rating, { color: colors.textSecondary }]}>
                            {product.rating.toFixed(1)}
                        </Text>
                        <Text style={[styles.reviewCount, { color: colors.textMuted }]}>
                            ({product.reviewCount})
                        </Text>
                    </View>
                </View>
            </AnimatedPressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    // Grid card styles
    gridCard: {
        marginBottom: Spacing.md,
    },
    imageContainer: {
        aspectRatio: 1,
        borderRadius: Spacing.radius.lg,
        overflow: 'hidden',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    badges: {
        position: 'absolute',
        top: Spacing.sm,
        left: Spacing.sm,
        gap: Spacing.xs,
    },
    discountBadge: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: 4,
        borderRadius: Spacing.radius.sm,
    },
    discountText: {
        color: '#FFFFFF',
        fontFamily: Fonts.family.semiBold,
        fontSize: Fonts.size.xs,
    },
    newBadge: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: 4,
        borderRadius: Spacing.radius.sm,
    },
    newBadgeText: {
        color: '#FFFFFF',
        fontFamily: Fonts.family.semiBold,
        fontSize: Fonts.size.xs,
        letterSpacing: 1,
    },
    favoriteButton: {
        position: 'absolute',
        top: Spacing.sm,
        right: Spacing.sm,
    },
    content: {
        paddingTop: Spacing.sm,
    },
    brand: {
        fontFamily: Fonts.family.medium,
        fontSize: Fonts.size.xs,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    name: {
        fontFamily: Fonts.family.semiBold,
        fontSize: Fonts.size.md,
        marginTop: 2,
        lineHeight: 20,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: Spacing.xs,
        gap: Spacing.sm,
    },
    price: {
        fontFamily: Fonts.family.bold,
        fontSize: Fonts.size.md,
    },
    originalPrice: {
        fontFamily: Fonts.family.regular,
        fontSize: Fonts.size.sm,
        textDecorationLine: 'line-through',
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: Spacing.xs,
        gap: 4,
    },
    rating: {
        fontFamily: Fonts.family.medium,
        fontSize: Fonts.size.xs,
    },
    reviewCount: {
        fontFamily: Fonts.family.regular,
        fontSize: Fonts.size.xs,
    },

    // Featured card styles
    featuredCard: {
        width: SCREEN_WIDTH * 0.7,
        marginRight: Spacing.md,
    },
    featuredImageContainer: {
        height: 200,
        borderRadius: Spacing.radius.xl,
        overflow: 'hidden',
        position: 'relative',
    },
    featuredImage: {
        width: '100%',
        height: '100%',
    },
    featuredContent: {
        paddingTop: Spacing.md,
    },
});

export default ProductCard;
