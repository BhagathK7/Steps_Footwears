// STEP Footwear App - Sign Up Screen
// New user registration

import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { Button } from '../../src/components/common/Button';
import { Input } from '../../src/components/common/Input';
import { AnimatedPressable } from '../../src/components/common/AnimatedPressable';
import { IconButton } from '../../src/components/common/IconButton';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useAuth } from '../../src/contexts/AuthContext';
import { Spacing, Fonts } from '../../src/constants';

interface FormErrors {
    fullName?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
}

export default function SignUpScreen() {
    const { colors } = useTheme();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { login } = useAuth();

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});

    const validateForm = () => {
        const newErrors: FormErrors = {};

        if (!fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        } else if (fullName.trim().length < 2) {
            newErrors.fullName = 'Name must be at least 2 characters';
        }

        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^[0-9]{10}$/.test(phone)) {
            newErrors.phone = 'Please enter a valid 10-digit phone number';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSignUp = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            // For demo, simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Mock successful registration
            await login({
                id: 'user_' + Date.now(),
                email,
                fullName,
                phone,
                createdAt: new Date().toISOString(),
            }, 'mock_token_' + Date.now());

            router.replace('/(tabs)');
        } catch (error) {
            console.error('Sign up error:', error);
            setErrors({ email: 'An account with this email already exists' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Background gradient */}
            <LinearGradient
                colors={[colors.primary + '20', 'transparent']}
                style={styles.gradient}
            />

            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={[
                        styles.scrollContent,
                        { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 40 },
                    ]}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Back Button */}
                    <View style={styles.header}>
                        <IconButton
                            icon="arrow-back"
                            onPress={() => router.back()}
                            color={colors.text}
                        />
                    </View>

                    {/* Logo */}
                    <Animated.View
                        entering={FadeIn.duration(600)}
                        style={styles.logoContainer}
                    >
                        <Text style={[styles.logo, { color: colors.primary }]}>STEP</Text>
                    </Animated.View>

                    {/* Welcome Text */}
                    <Animated.View entering={FadeInDown.delay(200).springify()}>
                        <Text style={[styles.title, { color: colors.text }]}>
                            Create Account
                        </Text>
                        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                            Sign up to start shopping
                        </Text>
                    </Animated.View>

                    {/* Form */}
                    <Animated.View
                        entering={FadeInDown.delay(400).springify()}
                        style={styles.form}
                    >
                        <Input
                            label="Full Name"
                            placeholder="John Doe"
                            value={fullName}
                            onChangeText={setFullName}
                            leftIcon="person-outline"
                            error={errors.fullName}
                            autoCapitalize="words"
                        />

                        <Input
                            label="Email"
                            placeholder="your@email.com"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            leftIcon="mail-outline"
                            error={errors.email}
                        />

                        <Input
                            label="Phone Number"
                            placeholder="9876543210"
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                            leftIcon="call-outline"
                            error={errors.phone}
                            maxLength={10}
                        />

                        <Input
                            label="Password"
                            placeholder="At least 6 characters"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            leftIcon="lock-closed-outline"
                            error={errors.password}
                        />

                        <Input
                            label="Confirm Password"
                            placeholder="Re-enter your password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                            leftIcon="lock-closed-outline"
                            error={errors.confirmPassword}
                        />

                        <Button
                            title="Create Account"
                            onPress={handleSignUp}
                            variant="gradient"
                            fullWidth
                            loading={isLoading}
                            style={styles.signUpButton}
                        />
                    </Animated.View>

                    {/* Terms */}
                    <Animated.View
                        entering={FadeInDown.delay(600).springify()}
                        style={styles.termsContainer}
                    >
                        <Text style={[styles.termsText, { color: colors.textMuted }]}>
                            By signing up, you agree to our{' '}
                        </Text>
                        <AnimatedPressable onPress={() => router.push('/support/terms')}>
                            <Text style={[styles.termsLink, { color: colors.primary }]}>
                                Terms of Service
                            </Text>
                        </AnimatedPressable>
                        <Text style={[styles.termsText, { color: colors.textMuted }]}>
                            {' '}and{' '}
                        </Text>
                        <AnimatedPressable onPress={() => router.push('/support/terms')}>
                            <Text style={[styles.termsLink, { color: colors.primary }]}>
                                Privacy Policy
                            </Text>
                        </AnimatedPressable>
                    </Animated.View>

                    {/* Sign In Link */}
                    <Animated.View
                        entering={FadeInDown.delay(700).springify()}
                        style={styles.signInContainer}
                    >
                        <Text style={[styles.signInText, { color: colors.textSecondary }]}>
                            Already have an account?{' '}
                        </Text>
                        <Link href="/auth/signin" asChild>
                            <AnimatedPressable>
                                <Text style={[styles.signInLink, { color: colors.primary }]}>
                                    Sign In
                                </Text>
                            </AnimatedPressable>
                        </Link>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 300,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: Spacing.screenPadding,
    },
    header: {
        marginBottom: Spacing.md,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    logo: {
        fontFamily: Fonts.family.extraBold,
        fontSize: 36,
        letterSpacing: 4,
    },
    title: {
        fontFamily: Fonts.family.bold,
        fontSize: Fonts.size.xxl,
        textAlign: 'center',
    },
    subtitle: {
        fontFamily: Fonts.family.regular,
        fontSize: Fonts.size.md,
        textAlign: 'center',
        marginTop: Spacing.sm,
    },
    form: {
        marginTop: Spacing.lg,
    },
    signUpButton: {
        marginTop: Spacing.lg,
    },
    termsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: Spacing.lg,
    },
    termsText: {
        fontFamily: Fonts.family.regular,
        fontSize: Fonts.size.sm,
    },
    termsLink: {
        fontFamily: Fonts.family.medium,
        fontSize: Fonts.size.sm,
    },
    signInContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: Spacing.xl,
    },
    signInText: {
        fontFamily: Fonts.family.regular,
        fontSize: Fonts.size.md,
    },
    signInLink: {
        fontFamily: Fonts.family.semiBold,
        fontSize: Fonts.size.md,
    },
});
