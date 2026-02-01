// STEP Footwear App - Terms & Privacy Screen

import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
} from 'react-native';

import { Header } from '../../src/components/navigation/Header';
import { useTheme } from '../../src/contexts/ThemeContext';
import { Spacing, Fonts } from '../../src/constants';

export default function TermsScreen() {
    const { colors } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Header title="Terms & Privacy" showBack />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    Terms of Service
                </Text>
                <Text style={[styles.lastUpdated, { color: colors.textMuted }]}>
                    Last updated: January 2024
                </Text>

                <Text style={[styles.heading, { color: colors.text }]}>
                    1. Acceptance of Terms
                </Text>
                <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
                    By accessing or using the STEP mobile application, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                </Text>

                <Text style={[styles.heading, { color: colors.text }]}>
                    2. User Accounts
                </Text>
                <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
                    You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account.
                </Text>

                <Text style={[styles.heading, { color: colors.text }]}>
                    3. Products and Pricing
                </Text>
                <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
                    All products are subject to availability. Prices are subject to change without notice. We reserve the right to refuse or cancel any order.
                </Text>

                <Text style={[styles.heading, { color: colors.text }]}>
                    4. Shipping and Delivery
                </Text>
                <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
                    Delivery times are estimates and may vary. We are not responsible for delays caused by external factors beyond our control.
                </Text>

                <View style={styles.divider} />

                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    Privacy Policy
                </Text>

                <Text style={[styles.heading, { color: colors.text }]}>
                    1. Information We Collect
                </Text>
                <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
                    We collect information you provide directly, including name, email, phone number, shipping address, and payment information.
                </Text>

                <Text style={[styles.heading, { color: colors.text }]}>
                    2. How We Use Your Information
                </Text>
                <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
                    We use your information to process orders, communicate with you, improve our services, and send promotional content (with your consent).
                </Text>

                <Text style={[styles.heading, { color: colors.text }]}>
                    3. Data Security
                </Text>
                <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
                    We implement industry-standard security measures to protect your personal information. Payment data is encrypted and processed securely.
                </Text>

                <Text style={[styles.heading, { color: colors.text }]}>
                    4. Your Rights
                </Text>
                <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
                    You have the right to access, correct, or delete your personal information. Contact us at privacy@step.in for any data-related requests.
                </Text>

                <Text style={[styles.heading, { color: colors.text }]}>
                    5. Contact Us
                </Text>
                <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
                    If you have questions about these terms or our privacy practices, please contact us at legal@step.in or call +91 1800-123-4567.
                </Text>
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
    sectionTitle: {
        fontFamily: Fonts.family.bold,
        fontSize: Fonts.size.xl,
        marginBottom: Spacing.xs,
    },
    lastUpdated: {
        fontFamily: Fonts.family.regular,
        fontSize: Fonts.size.sm,
        marginBottom: Spacing.lg,
    },
    heading: {
        fontFamily: Fonts.family.semiBold,
        fontSize: Fonts.size.md,
        marginTop: Spacing.lg,
        marginBottom: Spacing.sm,
    },
    paragraph: {
        fontFamily: Fonts.family.regular,
        fontSize: Fonts.size.sm,
        lineHeight: 22,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.1)',
        marginVertical: Spacing.xl,
    },
});
