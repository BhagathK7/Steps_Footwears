// STEP Footwear App - Header Component
// App header with theme toggle and search

import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, {
    useAnimatedStyle,
    withSpring,
    useSharedValue,
} from 'react-native-reanimated';
import { IconButton } from '../common/IconButton';
import { useTheme } from '../../contexts/ThemeContext';
import { Spacing, Fonts, Animations } from '../../constants';

interface HeaderProps {
    title?: string;
    showLogo?: boolean;
    showSearch?: boolean;
    showBack?: boolean;
    showThemeToggle?: boolean;
    transparent?: boolean;
    rightAction?: React.ReactNode;
    onSearchPress?: () => void;
}

export function Header({
    title,
    showLogo = false,
    showSearch = true,
    showBack = false,
    showThemeToggle = true,
    transparent = false,
    rightAction,
    onSearchPress,
}: HeaderProps) {
    const { colors, isDark, toggleTheme } = useTheme();
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const rotation = useSharedValue(0);

    const handleThemeToggle = () => {
        rotation.value = withSpring(rotation.value + 180, Animations.spring.bouncy);
        toggleTheme();
    };

    const themeIconStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotation.value}deg` }],
    }));

    const handleSearchPress = () => {
        if (onSearchPress) {
            onSearchPress();
        } else {
            router.push('/search');
        }
    };

    const handleBackPress = () => {
        router.back();
    };

    return (
        <View
            style={[
                styles.container,
                {
                    paddingTop: insets.top + Spacing.sm,
                    backgroundColor: transparent ? 'transparent' : colors.background,
                },
            ]}
        >
            <View style={styles.content}>
                {/* Left section */}
                <View style={styles.leftSection}>
                    {showBack ? (
                        <IconButton
                            icon="arrow-back"
                            onPress={handleBackPress}
                            size={40}
                            color={colors.icon}
                        />
                    ) : showThemeToggle ? (
                        <Pressable onPress={handleThemeToggle}>
                            <Animated.View style={themeIconStyle}>
                                <Ionicons
                                    name={isDark ? 'sunny' : 'moon'}
                                    size={24}
                                    color={colors.icon}
                                />
                            </Animated.View>
                        </Pressable>
                    ) : (
                        <View style={styles.placeholder} />
                    )}
                </View>

                {/* Center section */}
                <View style={styles.centerSection}>
                    {showLogo ? (
                        <View style={styles.logoContainer}>
                            <Text style={[styles.logo, { color: colors.text }]}>
                                S
                                <Text style={{ color: colors.primary }}>TEP</Text>
                            </Text>
                        </View>
                    ) : title ? (
                        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
                            {title}
                        </Text>
                    ) : null}
                </View>

                {/* Right section */}
                <View style={styles.rightSection}>
                    {rightAction ? (
                        rightAction
                    ) : showSearch ? (
                        <IconButton
                            icon="search"
                            onPress={handleSearchPress}
                            size={40}
                            color={colors.icon}
                        />
                    ) : (
                        <View style={styles.placeholder} />
                    )}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: Spacing.screenPadding,
        paddingBottom: Spacing.sm,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 44,
    },
    leftSection: {
        width: 44,
        alignItems: 'flex-start',
    },
    centerSection: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rightSection: {
        width: 44,
        alignItems: 'flex-end',
    },
    placeholder: {
        width: 40,
    },
    logoContainer: {
        alignItems: 'center',
    },
    logo: {
        fontFamily: Fonts.family.extraBold,
        fontSize: Fonts.size.xxl,
        letterSpacing: Fonts.letterSpacing.wide,
    },
    title: {
        fontFamily: Fonts.family.semiBold,
        fontSize: Fonts.size.lg,
    },
});

export default Header;
