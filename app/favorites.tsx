// STEP Footwear App - Favorites Screen
// User's saved/wishlist products

import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { Header } from '../src/components/navigation/Header';
import { ProductCard } from '../src/components/product/ProductCard';
import { Button } from '../src/components/common/Button';
import { useTheme } from '../src/contexts/ThemeContext';
import { useFavorites } from '../src/contexts/FavoritesContext';
import { Spacing, Fonts } from '../src/constants';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - Spacing.screenPadding * 2 - Spacing.md) / 2;

export default function FavoritesScreen() {
    const { colors } = useTheme();
    const router = useRouter();
    const { favorites } = useFavorites();

    if (favorites.length === 0) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Header title="Favorites" showBack />
                <View style={styles.emptyContainer}>
                    <Ionicons name="heart-outline" size={80} color={colors.textMuted} />
                    <Text style={[styles.emptyTitle, { color: colors.text }]}>
                        No favorites yet
                    </Text>
                    <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                        Start adding products you love
                    </Text>
                    <Button
                        title="Browse Products"
                        onPress={() => router.push('/')}
                        variant="gradient"
                        style={styles.browseButton}
                    />
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Header title={`Favorites (${favorites.length})`} showBack />
            <FlatList
                data={favorites}
                numColumns={2}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                columnWrapperStyle={styles.row}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => (
                    <Animated.View
                        entering={FadeInDown.delay(index * 100).springify()}
                        style={styles.cardContainer}
                    >
                        <ProductCard
                            product={item}
                            variant="grid"
                            index={index}
                        />
                    </Animated.View>
                )}
            />
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
    browseButton: {
        marginTop: Spacing.xl,
        minWidth: 200,
    },
    listContent: {
        padding: Spacing.screenPadding,
        paddingBottom: 100,
    },
    row: {
        justifyContent: 'space-between',
    },
    cardContainer: {
        width: CARD_WIDTH,
        marginBottom: Spacing.md,
    },
});
