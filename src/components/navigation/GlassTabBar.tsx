// STEP Footwear App - Glass Tab Bar
// iOS-style floating glass navbar with blur effect

import React from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
    useAnimatedStyle,
    withSpring,
    interpolate,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { AnimatedPressable } from '../common/AnimatedPressable';
import { Badge } from '../common/Badge';
import { useTheme } from '../../contexts/ThemeContext';
import { useCart } from '../../contexts/CartContext';
import { Spacing, Fonts, Colors, Animations } from '../../constants';

interface TabItem {
    name: string;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    iconFocused: keyof typeof Ionicons.glyphMap;
}

const tabs: TabItem[] = [
    { name: 'index', label: 'Home', icon: 'home-outline', iconFocused: 'home' },
    { name: 'categories', label: 'Categories', icon: 'grid-outline', iconFocused: 'grid' },
    { name: 'cart', label: 'Cart', icon: 'bag-outline', iconFocused: 'bag' },
    { name: 'profile', label: 'Profile', icon: 'person-outline', iconFocused: 'person' },
];

interface GlassTabBarProps {
    state: any;
    descriptors: any;
    navigation: any;
}

export function GlassTabBar({ state, descriptors, navigation }: GlassTabBarProps) {
    const { colors, isDark } = useTheme();
    const { itemCount } = useCart();

    return (
        <View style={styles.container}>
            <BlurView
                intensity={isDark ? 40 : 80}
                tint={isDark ? 'dark' : 'light'}
                style={[
                    styles.tabBar,
                    {
                        backgroundColor: colors.tabBar,
                        borderColor: colors.tabBarBorder,
                    },
                ]}
            >
                {state.routes.map((route: any, index: number) => {
                    const { options } = descriptors[route.key];
                    const isFocused = state.index === index;
                    const tab = tabs.find((t) => t.name === route.name) || tabs[0];

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            navigation.navigate(route.name);
                        }
                    };

                    return (
                        <TabButton
                            key={route.key}
                            tab={tab}
                            isFocused={isFocused}
                            onPress={onPress}
                            colors={colors}
                            badgeCount={route.name === 'cart' ? itemCount : undefined}
                        />
                    );
                })}
            </BlurView>
        </View>
    );
}

interface TabButtonProps {
    tab: TabItem;
    isFocused: boolean;
    onPress: () => void;
    colors: any;
    badgeCount?: number;
}

function TabButton({ tab, isFocused, onPress, colors, badgeCount }: TabButtonProps) {
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scale: withSpring(isFocused ? 1.1 : 1, Animations.spring.snappy),
                },
            ],
        };
    });

    const iconColor = isFocused ? colors.primary : colors.iconMuted;
    const labelColor = isFocused ? colors.primary : colors.textMuted;

    return (
        <AnimatedPressable onPress={onPress} style={styles.tabButton} haptic={false}>
            <Animated.View style={[styles.tabContent, animatedStyle]}>
                <View style={styles.iconContainer}>
                    <Ionicons
                        name={isFocused ? tab.iconFocused : tab.icon}
                        size={24}
                        color={iconColor}
                    />
                    {badgeCount !== undefined && badgeCount > 0 && (
                        <View style={styles.badge}>
                            <Badge count={badgeCount} size="small" />
                        </View>
                    )}
                </View>
                <Text
                    style={[
                        styles.label,
                        {
                            color: labelColor,
                            fontFamily: isFocused ? Fonts.family.semiBold : Fonts.family.regular,
                        },
                    ]}
                >
                    {tab.label}
                </Text>
                {isFocused && (
                    <View style={[styles.indicator, { backgroundColor: colors.primary }]} />
                )}
            </Animated.View>
        </AnimatedPressable>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: Spacing.tabBar.marginBottom,
        left: Spacing.tabBar.marginHorizontal,
        right: Spacing.tabBar.marginHorizontal,
    },
    tabBar: {
        flexDirection: 'row',
        height: Spacing.tabBar.height,
        borderRadius: Spacing.tabBar.borderRadius,
        borderWidth: 1,
        overflow: 'hidden',
        ...Colors.shadows.medium,
    },
    tabButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabContent: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: -6,
        right: -10,
    },
    label: {
        fontSize: Fonts.size.xs,
        marginTop: 4,
    },
    indicator: {
        position: 'absolute',
        bottom: -12,
        width: 4,
        height: 4,
        borderRadius: 2,
    },
});

export default GlassTabBar;
