// STEP Footwear App - Contact Us Screen

import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    Linking,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { Header } from '../../src/components/navigation/Header';
import { Input } from '../../src/components/common/Input';
import { Button } from '../../src/components/common/Button';
import { AnimatedPressable } from '../../src/components/common/AnimatedPressable';
import { useTheme } from '../../src/contexts/ThemeContext';
import { Spacing, Fonts, Colors } from '../../src/constants';

const contactOptions = [
    {
        id: 'phone',
        icon: 'call' as const,
        title: 'Call Us',
        subtitle: '+91 1800-123-4567',
        action: 'tel:+911800123456',
    },
    {
        id: 'email',
        icon: 'mail' as const,
        title: 'Email Us',
        subtitle: 'support@step.in',
        action: 'mailto:support@step.in',
    },
    {
        id: 'whatsapp',
        icon: 'logo-whatsapp' as const,
        title: 'WhatsApp',
        subtitle: '+91 98765 43210',
        action: 'https://wa.me/919876543210',
    },
];

export default function ContactScreen() {
    const { colors } = useTheme();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleContact = (action: string) => {
        Linking.openURL(action);
    };

    const handleSubmit = async () => {
        if (!name.trim() || !email.trim() || !message.trim()) return;

        setIsSubmitting(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setName('');
        setEmail('');
        setMessage('');
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Header title="Contact Us" showBack />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Text style={[styles.title, { color: colors.text }]}>
                    Get in Touch
                </Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                    We'd love to hear from you
                </Text>

                {/* Contact Options */}
                <View style={styles.contactOptions}>
                    {contactOptions.map((option, index) => (
                        <Animated.View
                            key={option.id}
                            entering={FadeInDown.delay(index * 100).springify()}
                        >
                            <AnimatedPressable
                                onPress={() => handleContact(option.action)}
                                style={[styles.contactCard, { backgroundColor: colors.surface }]}
                            >
                                <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                                    <Ionicons name={option.icon} size={24} color={colors.primary} />
                                </View>
                                <View style={styles.contactInfo}>
                                    <Text style={[styles.contactTitle, { color: colors.text }]}>
                                        {option.title}
                                    </Text>
                                    <Text style={[styles.contactSubtitle, { color: colors.textSecondary }]}>
                                        {option.subtitle}
                                    </Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                            </AnimatedPressable>
                        </Animated.View>
                    ))}
                </View>

                {/* Contact Form */}
                <View style={styles.formSection}>
                    <Text style={[styles.formTitle, { color: colors.text }]}>
                        Send us a Message
                    </Text>

                    <Input
                        label="Your Name"
                        placeholder="John Doe"
                        value={name}
                        onChangeText={setName}
                        leftIcon="person-outline"
                    />

                    <Input
                        label="Email"
                        placeholder="your@email.com"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        leftIcon="mail-outline"
                    />

                    <Input
                        label="Message"
                        placeholder="How can we help you?"
                        value={message}
                        onChangeText={setMessage}
                        multiline
                        numberOfLines={4}
                        leftIcon="chatbox-outline"
                    />

                    <Button
                        title="Send Message"
                        onPress={handleSubmit}
                        variant="gradient"
                        fullWidth
                        loading={isSubmitting}
                        style={styles.submitButton}
                    />
                </View>
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
    title: {
        fontFamily: Fonts.family.bold,
        fontSize: Fonts.size.xl,
    },
    subtitle: {
        fontFamily: Fonts.family.regular,
        fontSize: Fonts.size.md,
        marginTop: Spacing.xs,
    },
    contactOptions: {
        marginTop: Spacing.lg,
    },
    contactCard: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: Spacing.radius.lg,
        padding: Spacing.lg,
        marginBottom: Spacing.sm,
        ...Colors.shadows.small,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: Spacing.radius.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contactInfo: {
        flex: 1,
        marginLeft: Spacing.md,
    },
    contactTitle: {
        fontFamily: Fonts.family.semiBold,
        fontSize: Fonts.size.md,
    },
    contactSubtitle: {
        fontFamily: Fonts.family.regular,
        fontSize: Fonts.size.sm,
        marginTop: 2,
    },
    formSection: {
        marginTop: Spacing.xl,
    },
    formTitle: {
        fontFamily: Fonts.family.semiBold,
        fontSize: Fonts.size.lg,
        marginBottom: Spacing.md,
    },
    submitButton: {
        marginTop: Spacing.md,
    },
});
