// STEP Footwear App - Categories Screen
// Browse products by category

import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    FlatList,
    Image,
    Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Header } from '../../src/components/navigation/Header';
import { ProductCard } from '../../src/components/product/ProductCard';
import { AnimatedPressable } from '../../src/components/common/AnimatedPressable';
import { LoadingSpinner } from '../../src/components/common/LoadingSpinner';
import { useTheme } from '../../src/contexts/ThemeContext';
import { productService, categoryService } from '../../src/services';
import { Spacing, Fonts, Colors } from '../../src/constants';
import { Product, Category } from '../../src/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function CategoriesScreen() {
    const { colors } = useTheme();
    const router = useRouter();
    const params = useLocalSearchParams<{ id?: string }>();

    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(params.id || null);
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            loadProducts(selectedCategory);
        } else {
            loadAllProducts();
        }
    }, [selectedCategory]);

    const loadCategories = async () => {
        try {
            const cats = await categoryService.getCategories();
            setCategories(cats);
            if (!selectedCategory && cats.length > 0) {
                // Don't auto-select, show all products initially
            }
        } catch (error) {
            console.error('Failed to load categories:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadProducts = async (categoryId: string) => {
        setIsLoadingProducts(true);
        try {
            const prods = await productService.getProductsByCategory(categoryId);
            setProducts(prods);
        } catch (error) {
            console.error('Failed to load products:', error);
        } finally {
            setIsLoadingProducts(false);
        }
    };

    const loadAllProducts = async () => {
        setIsLoadingProducts(true);
        try {
            const response = await productService.getProducts();
            setProducts(response.products);
        } catch (error) {
            console.error('Failed to load products:', error);
        } finally {
            setIsLoadingProducts(false);
        }
    };

    const handleCategoryPress = (categoryId: string) => {
        if (selectedCategory === categoryId) {
            setSelectedCategory(null); // Deselect to show all
        } else {
            setSelectedCategory(categoryId);
        }
    };

    if (isLoading) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Header title="Categories" />
                <LoadingSpinner />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Header title="Categories" />

            {/* Category Pills */}
            <Animated.View entering={FadeIn.duration(300)}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoryPills}
                >
                    <AnimatedPressable
                        onPress={() => setSelectedCategory(null)}
                        style={[
                            styles.categoryPill,
                            {
                                backgroundColor: !selectedCategory ? colors.primary : colors.surfaceVariant,
                                borderColor: !selectedCategory ? colors.primary : colors.border,
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.categoryPillText,
                                { color: !selectedCategory ? '#FFFFFF' : colors.text },
                            ]}
                        >
                            All
                        </Text>
                    </AnimatedPressable>

                    {categories.map((category) => {
                        const isSelected = selectedCategory === category.id;
                        return (
                            <AnimatedPressable
                                key={category.id}
                                onPress={() => handleCategoryPress(category.id)}
                                style={[
                                    styles.categoryPill,
                                    {
                                        backgroundColor: isSelected ? colors.primary : colors.surfaceVariant,
                                        borderColor: isSelected ? colors.primary : colors.border,
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.categoryPillText,
                                        { color: isSelected ? '#FFFFFF' : colors.text },
                                    ]}
                                >
                                    {category.name}
                                </Text>
                            </AnimatedPressable>
                        );
                    })}
                </ScrollView>
            </Animated.View>

            {/* Products Grid */}
            {isLoadingProducts ? (
                <LoadingSpinner />
            ) : (
                <FlatList
                    data={products}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    contentContainerStyle={styles.productsContainer}
                    columnWrapperStyle={styles.productsRow}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                                No products found
                            </Text>
                        </View>
                    }
                    renderItem={({ item, index }) => (
                        <ProductCard product={item} index={index} variant="grid" />
                    )}
                    ListFooterComponent={<View style={styles.bottomSpacing} />}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    categoryPills: {
        paddingHorizontal: Spacing.screenPadding,
        paddingVertical: Spacing.md,
        gap: Spacing.sm,
    },
    categoryPill: {
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.sm,
        borderRadius: Spacing.radius.full,
        borderWidth: 1,
    },
    categoryPillText: {
        fontFamily: Fonts.family.medium,
        fontSize: Fonts.size.sm,
    },
    productsContainer: {
        paddingHorizontal: Spacing.screenPadding,
    },
    productsRow: {
        justifyContent: 'space-between',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: Spacing.xxxl,
    },
    emptyText: {
        fontFamily: Fonts.family.medium,
        fontSize: Fonts.size.md,
    },
    bottomSpacing: {
        height: 120,
    },
});
