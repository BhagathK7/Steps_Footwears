// STEP Footwear App - Onboarding Screen
// 3-page carousel showcasing app features

import React, { useState, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    FlatList,
    ViewToken,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
    FadeIn,
    FadeInDown,
    useSharedValue,
    useAnimatedStyle,
    interpolate,
    withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { Button } from '../src/components/common/Button';
import { AnimatedPressable } from '../src/components/common/AnimatedPressable';
import { useTheme } from '../src/contexts/ThemeContext';
import { Spacing, Fonts, Colors } from '../src/constants';
import { storage } from '../src/utils';

const { width, height } = Dimensions.get('window');

interface OnboardingSlide {
    id: string;
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    description: string;
    color: string;
}

const slides: OnboardingSlide[] = [
    {
        id: '1',
        icon: 'footsteps',
        title: 'Walk in Style',
        description: 'Discover the latest trends in premium footwear from top brands around the world.',
        color: Colors.light.primary,
    },
    {
        id: '2',
        icon: 'sparkles',
        title: 'Exclusive Collection',
        description: 'Get access to exclusive drops, limited editions, and member-only discounts.',
        color: Colors.secondary,
    },
    {
        id: '3',
        icon: 'rocket',
        title: 'Fast Delivery',
        description: 'Free express shipping on orders over ₹1,999. Easy returns within 30 days.',
        color: Colors.accent,
    },
];

export default function OnboardingScreen() {
    const { colors } = useTheme();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const flatListRef = useRef<FlatList>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useSharedValue(0);

    const handleNext = () => {
        if (currentIndex < slides.length - 1) {
            flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
        } else {
            handleGetStarted();
        }
    };

    const handleSkip = () => {
        handleGetStarted();
    };

    const handleGetStarted = async () => {
        await storage.set('onboarding_complete', true);
        router.replace('/auth/signin');
    };

    const onViewableItemsChanged = useRef(
        ({ viewableItems }: { viewableItems: ViewToken[] }) => {
            if (viewableItems.length > 0) {
                setCurrentIndex(viewableItems[0].index || 0);
            }
        }
    ).current;

    const renderSlide = ({ item, index }: { item: OnboardingSlide; index: number }) => {
        return (
            <View style={styles.slide}>
                <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
                    <Ionicons name={item.icon} size={80} color={item.color} />
                </View>
                <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
                <Text style={[styles.description, { color: colors.textSecondary }]}>
                    {item.description}
                </Text>
            </View>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Background gradient */}
            <LinearGradient
                colors={[colors.primary + '15', 'transparent', colors.primaryLight + '10'] as const}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            {/* Header */}
            <Animated.View
                entering={FadeIn.duration(600)}
                style={[styles.header, { paddingTop: insets.top + Spacing.md }]}
            >
                <Text style={[styles.logo, { color: colors.primary }]}>STEP</Text>
                <AnimatedPressable onPress={handleSkip}>
                    <Text style={[styles.skipText, { color: colors.textMuted }]}>Skip</Text>
                </AnimatedPressable>
            </Animated.View>

            {/* Slides */}
            <FlatList
                ref={flatListRef}
                data={slides}
                renderItem={renderSlide}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
                onScroll={(e) => {
                    scrollX.value = e.nativeEvent.contentOffset.x;
                }}
            />

            {/* Pagination & Button */}
            <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.xl }]}>
                {/* Dots */}
                <View style={styles.pagination}>
                    {slides.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                {
                                    backgroundColor:
                                        index === currentIndex ? colors.primary : colors.border,
                                    width: index === currentIndex ? 24 : 8,
                                },
                            ]}
                        />
                    ))}
                </View>

                {/* Button */}
                <Button
                    title={currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
                    onPress={handleNext}
                    variant="gradient"
                    fullWidth
                    style={styles.button}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.screenPadding,
    },
    logo: {
        fontFamily: Fonts.family.extraBold,
        fontSize: 28,
        letterSpacing: 3,
    },
    skipText: {
        fontFamily: Fonts.family.medium,
        fontSize: Fonts.size.md,
    },
    slide: {
        width,
        paddingHorizontal: Spacing.xl,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        width: 160,
        height: 160,
        borderRadius: 80,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.xxl,
    },
    title: {
        fontFamily: Fonts.family.bold,
        fontSize: Fonts.size.xxxl,
        textAlign: 'center',
        marginBottom: Spacing.md,
    },
    description: {
        fontFamily: Fonts.family.regular,
        fontSize: Fonts.size.md,
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: Spacing.lg,
    },
    footer: {
        paddingHorizontal: Spacing.screenPadding,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.xl,
        gap: Spacing.sm,
    },
    dot: {
        height: 8,
        borderRadius: 4,
    },
    button: {
        marginTop: Spacing.md,
    },
});
