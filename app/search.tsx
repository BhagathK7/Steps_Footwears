// STEP Footwear App - Search Screen
// Real-time product search

import React, { useState, useEffect, useCallback } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    FlatList,
    Keyboard,
    TouchableWithoutFeedback,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeIn, FadeOut } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { IconButton } from '../src/components/common/IconButton';
import { ProductCard } from '../src/components/product/ProductCard';
import { LoadingSpinner } from '../src/components/common/LoadingSpinner';
import { AnimatedPressable } from '../src/components/common/AnimatedPressable';
import { useTheme } from '../src/contexts/ThemeContext';
import { productService } from '../src/services';
import { storage } from '../src/utils';
import { Spacing, Fonts } from '../src/constants';
import { Product } from '../src/types';

export default function SearchScreen() {
    const { colors } = useTheme();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Product[]>([]);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    useEffect(() => {
        loadRecentSearches();
    }, []);

    useEffect(() => {
        const delayedSearch = setTimeout(() => {
            if (query.length >= 2) {
                performSearch(query);
            } else {
                setResults([]);
                setHasSearched(false);
            }
        }, 300); // Debounce

        return () => clearTimeout(delayedSearch);
    }, [query]);

    const loadRecentSearches = async () => {
        const searches = await storage.getRecentSearches();
        setRecentSearches(searches);
    };

    const performSearch = async (searchQuery: string) => {
        setIsLoading(true);
        setHasSearched(true);
        try {
            const products = await productService.searchProducts(searchQuery);
            setResults(products);
            // Save to recent searches
            await storage.addRecentSearch(searchQuery);
            loadRecentSearches();
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRecentSearchPress = (searchTerm: string) => {
        setQuery(searchTerm);
    };

    const handleClearRecentSearches = async () => {
        await storage.clearRecentSearches();
        setRecentSearches([]);
    };

    const handleClose = () => {
        router.back();
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
                {/* Search Header */}
                <Animated.View
                    entering={FadeInDown.springify()}
                    style={styles.header}
                >
                    <View style={[styles.searchBar, { backgroundColor: colors.surfaceVariant }]}>
                        <Ionicons name="search" size={20} color={colors.textMuted} />
                        <TextInput
                            style={[styles.searchInput, { color: colors.text }]}
                            placeholder="Search shoes..."
                            placeholderTextColor={colors.textMuted}
                            value={query}
                            onChangeText={setQuery}
                            autoFocus
                            returnKeyType="search"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                        {query.length > 0 && (
                            <IconButton
                                icon="close-circle"
                                onPress={() => setQuery('')}
                                size={28}
                                iconSize={18}
                                color={colors.textMuted}
                            />
                        )}
                    </View>
                    <AnimatedPressable onPress={handleClose}>
                        <Text style={[styles.cancelButton, { color: colors.primary }]}>
                            Cancel
                        </Text>
                    </AnimatedPressable>
                </Animated.View>

                {/* Content */}
                {isLoading ? (
                    <LoadingSpinner />
                ) : query.length === 0 ? (
                    // Recent Searches
                    <Animated.View entering={FadeIn} style={styles.recentContainer}>
                        {recentSearches.length > 0 && (
                            <>
                                <View style={styles.recentHeader}>
                                    <Text style={[styles.recentTitle, { color: colors.text }]}>
                                        Recent Searches
                                    </Text>
                                    <AnimatedPressable onPress={handleClearRecentSearches}>
                                        <Text style={[styles.clearButton, { color: colors.primary }]}>
                                            Clear All
                                        </Text>
                                    </AnimatedPressable>
                                </View>
                                {recentSearches.map((search, index) => (
                                    <Animated.View
                                        key={search}
                                        entering={FadeInDown.delay(index * 50).springify()}
                                    >
                                        <AnimatedPressable
                                            onPress={() => handleRecentSearchPress(search)}
                                            style={styles.recentItem}
                                        >
                                            <Ionicons name="time-outline" size={18} color={colors.textMuted} />
                                            <Text style={[styles.recentText, { color: colors.text }]}>
                                                {search}
                                            </Text>
                                        </AnimatedPressable>
                                    </Animated.View>
                                ))}
                            </>
                        )}

                        {/* Popular Searches */}
                        <Text style={[styles.recentTitle, { color: colors.text, marginTop: Spacing.xl }]}>
                            Popular
                        </Text>
                        <View style={styles.popularContainer}>
                            {['Running', 'Sneakers', 'Nike', 'Limited Edition', 'Casual'].map((term, index) => (
                                <Animated.View
                                    key={term}
                                    entering={FadeInDown.delay(100 + index * 50).springify()}
                                >
                                    <AnimatedPressable
                                        onPress={() => handleRecentSearchPress(term)}
                                        style={[styles.popularChip, { backgroundColor: colors.surfaceVariant }]}
                                    >
                                        <Text style={[styles.popularText, { color: colors.text }]}>
                                            {term}
                                        </Text>
                                    </AnimatedPressable>
                                </Animated.View>
                            ))}
                        </View>
                    </Animated.View>
                ) : hasSearched && results.length === 0 ? (
                    // No Results
                    <View style={styles.emptyContainer}>
                        <Ionicons name="search-outline" size={60} color={colors.textMuted} />
                        <Text style={[styles.emptyTitle, { color: colors.text }]}>
                            No results found
                        </Text>
                        <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                            Try searching for something else
                        </Text>
                    </View>
                ) : (
                    // Search Results
                    <FlatList
                        data={results}
                        keyExtractor={(item) => item.id}
                        numColumns={2}
                        contentContainerStyle={styles.resultsContainer}
                        columnWrapperStyle={styles.resultsRow}
                        showsVerticalScrollIndicator={false}
                        ListHeaderComponent={
                            <Text style={[styles.resultsCount, { color: colors.textSecondary }]}>
                                {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
                            </Text>
                        }
                        renderItem={({ item, index }) => (
                            <ProductCard product={item} index={index} variant="grid" />
                        )}
                    />
                )}
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.screenPadding,
        paddingVertical: Spacing.sm,
        gap: Spacing.md,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: Spacing.radius.lg,
        gap: Spacing.sm,
    },
    searchInput: {
        flex: 1,
        fontFamily: Fonts.family.regular,
        fontSize: Fonts.size.md,
        paddingVertical: Spacing.xs,
    },
    cancelButton: {
        fontFamily: Fonts.family.medium,
        fontSize: Fonts.size.md,
    },
    recentContainer: {
        paddingHorizontal: Spacing.screenPadding,
        paddingTop: Spacing.md,
    },
    recentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    recentTitle: {
        fontFamily: Fonts.family.semiBold,
        fontSize: Fonts.size.lg,
    },
    clearButton: {
        fontFamily: Fonts.family.medium,
        fontSize: Fonts.size.sm,
    },
    recentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.md,
        gap: Spacing.md,
    },
    recentText: {
        fontFamily: Fonts.family.regular,
        fontSize: Fonts.size.md,
    },
    popularContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
        marginTop: Spacing.md,
    },
    popularChip: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: Spacing.radius.full,
    },
    popularText: {
        fontFamily: Fonts.family.medium,
        fontSize: Fonts.size.sm,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: Spacing.xl,
    },
    emptyTitle: {
        fontFamily: Fonts.family.bold,
        fontSize: Fonts.size.xl,
        marginTop: Spacing.lg,
    },
    emptySubtitle: {
        fontFamily: Fonts.family.regular,
        fontSize: Fonts.size.md,
        marginTop: Spacing.sm,
        textAlign: 'center',
    },
    resultsContainer: {
        padding: Spacing.screenPadding,
    },
    resultsRow: {
        justifyContent: 'space-between',
    },
    resultsCount: {
        fontFamily: Fonts.family.regular,
        fontSize: Fonts.size.sm,
        marginBottom: Spacing.md,
    },
});
