// STEP Footwear App - Notifications Settings Screen

import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    Switch,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { Header } from '../../src/components/navigation/Header';
import { useTheme } from '../../src/contexts/ThemeContext';
import { Spacing, Fonts, Colors } from '../../src/constants';

interface NotificationSetting {
    id: string;
    title: string;
    description: string;
    icon: keyof typeof Ionicons.glyphMap;
    enabled: boolean;
}

export default function NotificationsScreen() {
    const { colors } = useTheme();
    const [settings, setSettings] = useState<NotificationSetting[]>([
        {
            id: 'orders',
            title: 'Order Updates',
            description: 'Get notified about your order status',
            icon: 'bag-check',
            enabled: true,
        },
        {
            id: 'promotions',
            title: 'Promotions & Offers',
            description: 'Receive exclusive deals and discounts',
            icon: 'pricetag',
            enabled: true,
        },
        {
            id: 'newArrivals',
            title: 'New Arrivals',
            description: 'Be the first to know about new products',
            icon: 'sparkles',
            enabled: false,
        },
        {
            id: 'reminders',
            title: 'Cart Reminders',
            description: 'Remind me about items in my cart',
            icon: 'cart',
            enabled: true,
        },
        {
            id: 'wishlist',
            title: 'Wishlist Updates',
            description: 'Get alerts when wishlist items go on sale',
            icon: 'heart',
            enabled: false,
        },
    ]);

    const toggleSetting = (id: string) => {
        setSettings((prev) =>
            prev.map((setting) =>
                setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
            )
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Header title="Notifications" showBack />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Text style={[styles.description, { color: colors.textSecondary }]}>
                    Manage your notification preferences
                </Text>

                {settings.map((setting, index) => (
                    <Animated.View
                        key={setting.id}
                        entering={FadeInDown.delay(index * 100).springify()}
                        style={[styles.settingCard, { backgroundColor: colors.surface }]}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                            <Ionicons name={setting.icon} size={22} color={colors.primary} />
                        </View>
                        <View style={styles.settingInfo}>
                            <Text style={[styles.settingTitle, { color: colors.text }]}>
                                {setting.title}
                            </Text>
                            <Text style={[styles.settingDescription, { color: colors.textMuted }]}>
                                {setting.description}
                            </Text>
                        </View>
                        <Switch
                            value={setting.enabled}
                            onValueChange={() => toggleSetting(setting.id)}
                            trackColor={{ false: colors.border, true: colors.primary + '60' }}
                            thumbColor={setting.enabled ? colors.primary : colors.textMuted}
                        />
                    </Animated.View>
                ))}
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
        paddingBottom: 100,
    },
    description: {
        fontFamily: Fonts.family.regular,
        fontSize: Fonts.size.md,
        marginBottom: Spacing.lg,
    },
    settingCard: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: Spacing.radius.lg,
        padding: Spacing.lg,
        marginBottom: Spacing.md,
        ...Colors.shadows.small,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: Spacing.radius.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    settingInfo: {
        flex: 1,
        marginLeft: Spacing.md,
        marginRight: Spacing.md,
    },
    settingTitle: {
        fontFamily: Fonts.family.semiBold,
        fontSize: Fonts.size.md,
    },
    settingDescription: {
        fontFamily: Fonts.family.regular,
        fontSize: Fonts.size.sm,
        marginTop: 2,
    },
});
