// STEP Footwear App - Image Carousel Component
// Swipeable product image gallery

import React, { useState, useRef } from 'react';
import {
    StyleSheet,
    View,
    Image,
    Dimensions,
    FlatList,
    NativeSyntheticEvent,
    NativeScrollEvent,
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    withSpring,
    interpolate,
    useSharedValue,
} from 'react-native-reanimated';
import { useTheme } from '../../contexts/ThemeContext';
import { Spacing, Animations } from '../../constants';
import { ProductImage } from '../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ImageCarouselProps {
    images: ProductImage[];
    height?: number;
}

export function ImageCarousel({ images, height = 400 }: ImageCarouselProps) {
    const { colors } = useTheme();
    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const contentOffset = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffset / SCREEN_WIDTH);
        setActiveIndex(index);
    };

    const renderImage = ({ item, index }: { item: ProductImage; index: number }) => (
        <View style={[styles.imageContainer, { height }]}>
            <Image
                source={{ uri: item.url }}
                style={styles.image}
                resizeMode="cover"
            />
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={images}
                renderItem={renderImage}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                decelerationRate="fast"
            />

            {/* Pagination dots */}
            <View style={styles.pagination}>
                {images.map((_, index) => (
                    <PaginationDot
                        key={index}
                        isActive={index === activeIndex}
                        colors={colors}
                    />
                ))}
            </View>
        </View>
    );
}

interface PaginationDotProps {
    isActive: boolean;
    colors: any;
}

function PaginationDot({ isActive, colors }: PaginationDotProps) {
    const animatedStyle = useAnimatedStyle(() => ({
        width: withSpring(isActive ? 24 : 8, Animations.spring.snappy),
        backgroundColor: isActive ? colors.primary : colors.border,
    }));

    return <Animated.View style={[styles.dot, animatedStyle]} />;
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    imageContainer: {
        width: SCREEN_WIDTH,
        backgroundColor: '#F5F5F5',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: Spacing.md,
        left: 0,
        right: 0,
        gap: Spacing.xs,
    },
    dot: {
        height: 8,
        borderRadius: 4,
    },
});

export default ImageCarousel;
