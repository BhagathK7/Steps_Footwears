// STEP Footwear App - Home Screen
// Main store page with featured products and categories

import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    FlatList,
    RefreshControl,
    Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Header } from '../../src/components/navigation/Header';
import { ProductCard } from '../../src/components/product/ProductCard';
import { AnimatedPressable } from '../../src/components/common/AnimatedPressable';
import { LoadingSpinner, Skeleton } from '../../src/components/common/LoadingSpinner';
import { useTheme } from '../../src/contexts/ThemeContext';
import { productService, categoryService } from '../../src/services';
import { Spacing, Fonts } from '../../src/constants';
import { Product, Category } from '../../src/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeScreen() {
    const { colors } = useTheme();
    const router = useRouter();
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [newArrivals, setNewArrivals] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [featured, arrivals, cats] = await Promise.all([
                productService.getFeaturedProducts(),
                productService.getNewArrivals(),
                categoryService.getCategories(),
            ]);
            setFeaturedProducts(featured);
            setNewArrivals(arrivals);
            setCategories(cats);
        } catch (error) {
            console.error('Failed to load home data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    const handleCategoryPress = (category: Category) => {
        router.push(`/categories?id=${category.id}`);
    };

    if (isLoading) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Header showLogo />
                <LoadingSpinner />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Header showLogo />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        tintColor={colors.primary}
                    />
                }
            >
                {/* Hero Section */}
                <Animated.View
                    entering={FadeIn.duration(500)}
                    style={styles.heroSection}
                >
                    <Text style={[styles.heroTitle, { color: colors.text }]}>
                        Find Your{'\n'}Perfect Step
                    </Text>
                    <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
                        Discover premium footwear curated just for you
                    </Text>
                </Animated.View>

                {/* Categories */}
                <Animated.View entering={FadeInDown.delay(200).springify()}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                            Categories
                        </Text>
                        <AnimatedPressable onPress={() => router.push('/categories')}>
                            <Text style={[styles.seeAll, { color: colors.primary }]}>
                                See All
                            </Text>
                        </AnimatedPressable>
                    </View>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.categoriesContainer}
                    >
                        {categories.slice(0, 6).map((category, index) => (
                            <CategoryCard
                                key={category.id}
                                category={category}
                                onPress={() => handleCategoryPress(category)}
                                colors={colors}
                                index={index}
                            />
                        ))}
                    </ScrollView>
                </Animated.View>

                {/* Featured Products */}
                <Animated.View entering={FadeInDown.delay(400).springify()}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                            Featured
                        </Text>
                        <AnimatedPressable onPress={() => router.push('/categories?filter=featured')}>
                            <Text style={[styles.seeAll, { color: colors.primary }]}>
                                See All
                            </Text>
                        </AnimatedPressable>
                    </View>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.featuredContainer}
                    >
                        {featuredProducts.map((product, index) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                variant="featured"
                                index={index}
                            />
                        ))}
                    </ScrollView>
                </Animated.View>

                {/* New Arrivals Grid */}
                <Animated.View entering={FadeInDown.delay(600).springify()}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                            New Arrivals
                        </Text>
                    </View>

                    <View style={styles.productsGrid}>
                        {newArrivals.map((product, index) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                variant="grid"
                                index={index}
                            />
                        ))}
                    </View>
                </Animated.View>

                {/* Bottom spacing for tab bar */}
                <View style={styles.bottomSpacing} />
            </ScrollView>
        </View>
    );
}

interface CategoryCardProps {
    category: Category;
    onPress: () => void;
    colors: any;
    index: number;
}

function CategoryCard({ category, onPress, colors, index }: CategoryCardProps) {
    return (
        <Animated.View entering={FadeInDown.delay(100 * index).springify()}>
            <AnimatedPressable onPress={onPress} style={styles.categoryCard}>
                <View
                    style={[
                        styles.categoryImageContainer,
                        { backgroundColor: colors.surfaceVariant },
                    ]}
                >
                    <Animated.Image
                        source={{ uri: category.image }}
                        style={styles.categoryImage}
                        resizeMode="cover"
                    />
                </View>
                <Text
                    style={[styles.categoryName, { color: colors.text }]}
                    numberOfLines={1}
                >
                    {category.name}
                </Text>
                <Text style={[styles.categoryCount, { color: colors.textMuted }]}>
                    {category.productCount} items
                </Text>
            </AnimatedPressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: Spacing.screenPadding,
    },
    heroSection: {
        paddingVertical: Spacing.lg,
    },
    heroTitle: {
        fontFamily: Fonts.family.extraBold,
        fontSize: Fonts.size.display,
        lineHeight: Fonts.size.display * 1.1,
        letterSpacing: -1,
    },
    heroSubtitle: {
        fontFamily: Fonts.family.regular,
        fontSize: Fonts.size.md,
        marginTop: Spacing.sm,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: Spacing.xl,
        marginBottom: Spacing.md,
    },
    sectionTitle: {
        fontFamily: Fonts.family.bold,
        fontSize: Fonts.size.xl,
    },
    seeAll: {
        fontFamily: Fonts.family.medium,
        fontSize: Fonts.size.sm,
    },
    categoriesContainer: {
        gap: Spacing.md,
        paddingRight: Spacing.screenPadding,
    },
    categoryCard: {
        width: 100,
        alignItems: 'center',
    },
    categoryImageContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        overflow: 'hidden',
        marginBottom: Spacing.sm,
    },
    categoryImage: {
        width: '100%',
        height: '100%',
    },
    categoryName: {
        fontFamily: Fonts.family.semiBold,
        fontSize: Fonts.size.sm,
        textAlign: 'center',
    },
    categoryCount: {
        fontFamily: Fonts.family.regular,
        fontSize: Fonts.size.xs,
    },
    featuredContainer: {
        paddingRight: Spacing.screenPadding,
    },
    productsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    bottomSpacing: {
        height: 120,
    },
});
