// STEP Footwear App - Addresses Screen
// Manage delivery addresses

import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { Header } from '../src/components/navigation/Header';
import { Button } from '../src/components/common/Button';
import { AnimatedPressable } from '../src/components/common/AnimatedPressable';
import { IconButton } from '../src/components/common/IconButton';
import { useTheme } from '../src/contexts/ThemeContext';
import { Spacing, Fonts, Colors } from '../src/constants';

// Mock addresses
const mockAddresses = [
    {
        id: '1',
        name: 'Home',
        fullName: 'John Doe',
        address: '123 Main Street, Apartment 4B',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        phone: '9876543210',
        isDefault: true,
    },
    {
        id: '2',
        name: 'Office',
        fullName: 'John Doe',
        address: 'Tech Park, Building C, Floor 5',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001',
        phone: '9876543210',
        isDefault: false,
    },
];

export default function AddressesScreen() {
    const { colors } = useTheme();
    const router = useRouter();
    const [addresses, setAddresses] = useState(mockAddresses);

    const handleSetDefault = (id: string) => {
        setAddresses((prev) =>
            prev.map((addr) => ({
                ...addr,
                isDefault: addr.id === id,
            }))
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Header title="My Addresses" showBack />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {addresses.map((address, index) => (
                    <Animated.View
                        key={address.id}
                        entering={FadeInDown.delay(index * 100).springify()}
                    >
                        <View style={[styles.addressCard, { backgroundColor: colors.surface }]}>
                            <View style={styles.addressHeader}>
                                <View style={styles.addressLabel}>
                                    <Ionicons
                                        name={address.name === 'Home' ? 'home' : 'business'}
                                        size={18}
                                        color={colors.primary}
                                    />
                                    <Text style={[styles.labelText, { color: colors.text }]}>
                                        {address.name}
                                    </Text>
                                    {address.isDefault && (
                                        <View style={[styles.defaultBadge, { backgroundColor: colors.primary + '20' }]}>
                                            <Text style={[styles.defaultText, { color: colors.primary }]}>
                                                Default
                                            </Text>
                                        </View>
                                    )}
                                </View>
                                <IconButton
                                    icon="ellipsis-vertical"
                                    size={32}
                                    iconSize={18}
                                    onPress={() => { }}
                                    color={colors.textMuted}
                                />
                            </View>
                            <Text style={[styles.fullName, { color: colors.text }]}>
                                {address.fullName}
                            </Text>
                            <Text style={[styles.addressText, { color: colors.textSecondary }]}>
                                {address.address}
                            </Text>
                            <Text style={[styles.addressText, { color: colors.textSecondary }]}>
                                {address.city}, {address.state} - {address.pincode}
                            </Text>
                            <Text style={[styles.phone, { color: colors.textMuted }]}>
                                📞 {address.phone}
                            </Text>
                            {!address.isDefault && (
                                <AnimatedPressable
                                    onPress={() => handleSetDefault(address.id)}
                                    style={styles.setDefaultButton}
                                >
                                    <Text style={[styles.setDefaultText, { color: colors.primary }]}>
                                        Set as Default
                                    </Text>
                                </AnimatedPressable>
                            )}
                        </View>
                    </Animated.View>
                ))}

                <Button
                    title="Add New Address"
                    onPress={() => { }}
                    variant="outline"
                    fullWidth
                    style={styles.addButton}
                />
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
    addressCard: {
        borderRadius: Spacing.radius.lg,
        padding: Spacing.lg,
        marginBottom: Spacing.md,
        ...Colors.shadows.small,
    },
    addressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    addressLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    labelText: {
        fontFamily: Fonts.family.semiBold,
        fontSize: Fonts.size.md,
    },
    defaultBadge: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: 2,
        borderRadius: Spacing.radius.full,
    },
    defaultText: {
        fontFamily: Fonts.family.medium,
        fontSize: Fonts.size.xs,
    },
    fullName: {
        fontFamily: Fonts.family.medium,
        fontSize: Fonts.size.md,
        marginBottom: Spacing.xs,
    },
    addressText: {
        fontFamily: Fonts.family.regular,
        fontSize: Fonts.size.sm,
        lineHeight: 20,
    },
    phone: {
        fontFamily: Fonts.family.regular,
        fontSize: Fonts.size.sm,
        marginTop: Spacing.sm,
    },
    setDefaultButton: {
        marginTop: Spacing.md,
        paddingTop: Spacing.md,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
    },
    setDefaultText: {
        fontFamily: Fonts.family.medium,
        fontSize: Fonts.size.sm,
        textAlign: 'center',
    },
    addButton: {
        marginTop: Spacing.md,
    },
});
