// STEP Footwear App - Profile Screen
// User profile, addresses, orders, and settings

import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    Image,
    Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../../src/components/navigation/Header';
import { Button } from '../../src/components/common/Button';
import { Card } from '../../src/components/common/Card';
import { AnimatedPressable } from '../../src/components/common/AnimatedPressable';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useAuth } from '../../src/contexts/AuthContext';
import { useFavorites } from '../../src/contexts/FavoritesContext';
import { Spacing, Fonts, Colors } from '../../src/constants';

interface MenuItemProps {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle?: string;
    onPress: () => void;
    colors: any;
    showBadge?: boolean;
    badgeCount?: number;
    danger?: boolean;
}

function MenuItem({ icon, title, subtitle, onPress, colors, showBadge, badgeCount, danger }: MenuItemProps) {
    return (
        <AnimatedPressable onPress={onPress} style={styles.menuItem}>
            <View style={[styles.menuIcon, { backgroundColor: danger ? colors.error + '15' : colors.surfaceVariant }]}>
                <Ionicons name={icon} size={22} color={danger ? colors.error : colors.primary} />
            </View>
            <View style={styles.menuContent}>
                <Text style={[styles.menuTitle, { color: danger ? colors.error : colors.text }]}>
                    {title}
                </Text>
                {subtitle && (
                    <Text style={[styles.menuSubtitle, { color: colors.textMuted }]}>
                        {subtitle}
                    </Text>
                )}
            </View>
            {showBadge && badgeCount && badgeCount > 0 && (
                <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                    <Text style={styles.badgeText}>{badgeCount}</Text>
                </View>
            )}
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </AnimatedPressable>
    );
}

export default function ProfileScreen() {
    const { colors, isDark, toggleTheme } = useTheme();
    const { user, isAuthenticated, logout } = useAuth();
    const { favorites } = useFavorites();
    const router = useRouter();

    const handleLogin = () => {
        router.push('/auth/signin');
    };

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Logout', style: 'destructive', onPress: logout },
            ]
        );
    };

    const menuSections = [
        {
            title: 'My Account',
            items: [
                { icon: 'heart-outline' as const, title: 'Favorites', subtitle: `${favorites.length} items`, onPress: () => router.push('/favorites') },
                { icon: 'receipt-outline' as const, title: 'Orders', subtitle: 'View order history', onPress: () => router.push('/orders') },
                { icon: 'location-outline' as const, title: 'Addresses', subtitle: 'Manage delivery addresses', onPress: () => router.push('/addresses') },
                { icon: 'card-outline' as const, title: 'Payment Methods', onPress: () => router.push('/payments') },
            ],
        },
        {
            title: 'Settings',
            items: [
                { icon: 'notifications-outline' as const, title: 'Notifications', onPress: () => router.push('/settings/notifications') },
                { icon: isDark ? 'sunny-outline' : 'moon-outline' as const, title: 'Theme', subtitle: isDark ? 'Dark Mode' : 'Light Mode', onPress: toggleTheme },
                { icon: 'language-outline' as const, title: 'Language', subtitle: 'English', onPress: () => router.push('/settings/language') },
            ],
        },
        {
            title: 'Support',
            items: [
                { icon: 'help-circle-outline' as const, title: 'Help Center', onPress: () => router.push('/support/help') },
                { icon: 'chatbubble-outline' as const, title: 'Contact Us', onPress: () => router.push('/support/contact') },
                { icon: 'document-text-outline' as const, title: 'Terms & Privacy', onPress: () => router.push('/support/terms') },
            ],
        },
    ];

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Header title="Profile" showSearch={false} />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Profile Header */}
                <Animated.View
                    entering={FadeInDown.springify()}
                    style={[styles.profileCard, { backgroundColor: colors.surface }]}
                >
                    <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                        {user?.avatar ? (
                            <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
                        ) : (
                            <Text style={styles.avatarText}>
                                {user?.fullName?.charAt(0) || 'G'}
                            </Text>
                        )}
                    </View>

                    {isAuthenticated && user ? (
                        <View style={styles.profileInfo}>
                            <Text style={[styles.profileName, { color: colors.text }]}>
                                {user.fullName}
                            </Text>
                            <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>
                                {user.email}
                            </Text>
                        </View>
                    ) : (
                        <View style={styles.profileInfo}>
                            <Text style={[styles.profileName, { color: colors.text }]}>
                                Guest User
                            </Text>
                            <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>
                                Sign in for personalized experience
                            </Text>
                        </View>
                    )}

                    {!isAuthenticated && (
                        <Button
                            title="Sign In"
                            onPress={handleLogin}
                            variant="gradient"
                            size="small"
                            style={styles.signInButton}
                        />
                    )}
                </Animated.View>

                {/* Quick Stats */}
                <Animated.View
                    entering={FadeInDown.delay(100).springify()}
                    style={styles.statsContainer}
                >
                    <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
                        <Text style={[styles.statNumber, { color: colors.primary }]}>
                            {favorites.length}
                        </Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                            Favorites
                        </Text>
                    </View>
                    <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
                        <Text style={[styles.statNumber, { color: colors.primary }]}>
                            0
                        </Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                            Orders
                        </Text>
                    </View>
                    <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
                        <Text style={[styles.statNumber, { color: colors.primary }]}>
                            ₹0
                        </Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                            Saved
                        </Text>
                    </View>
                </Animated.View>

                {/* Menu Sections */}
                {menuSections.map((section, sectionIndex) => (
                    <Animated.View
                        key={section.title}
                        entering={FadeInDown.delay(200 + sectionIndex * 100).springify()}
                        style={styles.menuSection}
                    >
                        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                            {section.title}
                        </Text>
                        <View style={[styles.menuCard, { backgroundColor: colors.surface }]}>
                            {section.items.map((item, index) => (
                                <React.Fragment key={item.title}>
                                    <MenuItem {...item} colors={colors} />
                                    {index < section.items.length - 1 && (
                                        <View style={[styles.menuDivider, { backgroundColor: colors.border }]} />
                                    )}
                                </React.Fragment>
                            ))}
                        </View>
                    </Animated.View>
                ))}

                {/* Logout Button */}
                {isAuthenticated && (
                    <Animated.View entering={FadeInDown.delay(500).springify()}>
                        <View style={[styles.menuCard, { backgroundColor: colors.surface }]}>
                            <MenuItem
                                icon="log-out-outline"
                                title="Logout"
                                onPress={handleLogout}
                                colors={colors}
                                danger
                            />
                        </View>
                    </Animated.View>
                )}

                {/* App Version */}
                <Text style={[styles.version, { color: colors.textMuted }]}>
                    STEP v1.0.0
                </Text>

                <View style={styles.bottomSpacing} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: Spacing.screenPadding,
    },
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.lg,
        borderRadius: Spacing.radius.xl,
        ...Colors.shadows.small,
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        borderRadius: 32,
    },
    avatarText: {
        fontFamily: Fonts.family.bold,
        fontSize: Fonts.size.xxl,
        color: '#FFFFFF',
    },
    profileInfo: {
        flex: 1,
        marginLeft: Spacing.md,
    },
    profileName: {
        fontFamily: Fonts.family.bold,
        fontSize: Fonts.size.lg,
    },
    profileEmail: {
        fontFamily: Fonts.family.regular,
        fontSize: Fonts.size.sm,
        marginTop: 2,
    },
    signInButton: {
        marginLeft: Spacing.sm,
    },
    statsContainer: {
        flexDirection: 'row',
        marginTop: Spacing.lg,
        gap: Spacing.md,
    },
    statCard: {
        flex: 1,
        padding: Spacing.md,
        borderRadius: Spacing.radius.lg,
        alignItems: 'center',
        ...Colors.shadows.small,
    },
    statNumber: {
        fontFamily: Fonts.family.bold,
        fontSize: Fonts.size.xl,
    },
    statLabel: {
        fontFamily: Fonts.family.regular,
        fontSize: Fonts.size.xs,
        marginTop: 2,
    },
    menuSection: {
        marginTop: Spacing.xl,
    },
    sectionTitle: {
        fontFamily: Fonts.family.semiBold,
        fontSize: Fonts.size.sm,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: Spacing.sm,
        marginLeft: Spacing.sm,
    },
    menuCard: {
        borderRadius: Spacing.radius.lg,
        overflow: 'hidden',
        ...Colors.shadows.small,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
    },
    menuIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuContent: {
        flex: 1,
        marginLeft: Spacing.md,
    },
    menuTitle: {
        fontFamily: Fonts.family.semiBold,
        fontSize: Fonts.size.md,
    },
    menuSubtitle: {
        fontFamily: Fonts.family.regular,
        fontSize: Fonts.size.sm,
        marginTop: 2,
    },
    menuDivider: {
        height: 1,
        marginLeft: 68,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        marginRight: Spacing.sm,
    },
    badgeText: {
        fontFamily: Fonts.family.semiBold,
        fontSize: Fonts.size.xs,
        color: '#FFFFFF',
    },
    version: {
        fontFamily: Fonts.family.regular,
        fontSize: Fonts.size.sm,
        textAlign: 'center',
        marginTop: Spacing.xl,
    },
    bottomSpacing: {
        height: 120,
    },
});
