// STEP Footwear App - Sign In Screen
// User login with email and password

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
import { useTheme } from '../../src/contexts/ThemeContext';
import { useAuth } from '../../src/contexts/AuthContext';
import { Spacing, Fonts, Colors } from '../../src/constants';

export default function SignInScreen() {
    const { colors } = useTheme();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    const validateForm = () => {
        const newErrors: { email?: string; password?: string } = {};

        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSignIn = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            // For demo, simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Mock successful login
            await login({
                id: 'user_' + Date.now(),
                email,
                fullName: email.split('@')[0],
                phone: '',
                role: 'customer',
                addresses: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }, 'mock_token_' + Date.now());

            router.replace('/(tabs)');
        } catch (error) {
            console.error('Sign in error:', error);
            setErrors({ email: 'Invalid email or password' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Background gradient */}
            <LinearGradient
                colors={[colors.primary + '20', 'transparent'] as const}
                style={styles.gradient}
            />

            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={[
                        styles.scrollContent,
                        { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 40 },
                    ]}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Logo */}
                    <Animated.View
                        entering={FadeIn.duration(600)}
                        style={styles.logoContainer}
                    >
                        <Text style={[styles.logo, { color: colors.primary }]}>STEP</Text>
                        <Text style={[styles.tagline, { color: colors.textSecondary }]}>
                            Walk in Style
                        </Text>
                    </Animated.View>

                    {/* Welcome Text */}
                    <Animated.View entering={FadeInDown.delay(200).springify()}>
                        <Text style={[styles.title, { color: colors.text }]}>
                            Welcome Back
                        </Text>
                        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                            Sign in to continue shopping
                        </Text>
                    </Animated.View>

                    {/* Form */}
                    <Animated.View
                        entering={FadeInDown.delay(400).springify()}
                        style={styles.form}
                    >
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
                            label="Password"
                            placeholder="Enter your password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            leftIcon="lock-closed-outline"
                            error={errors.password}
                        />

                        <AnimatedPressable
                            onPress={() => { }}
                            style={styles.forgotPassword}
                        >
                            <Text style={[styles.forgotText, { color: colors.primary }]}>
                                Forgot Password?
                            </Text>
                        </AnimatedPressable>

                        <Button
                            title="Sign In"
                            onPress={handleSignIn}
                            variant="gradient"
                            fullWidth
                            loading={isLoading}
                            style={styles.signInButton}
                        />
                    </Animated.View>

                    {/* Divider */}
                    <Animated.View
                        entering={FadeInDown.delay(600).springify()}
                        style={styles.dividerContainer}
                    >
                        <View style={[styles.divider, { backgroundColor: colors.border }]} />
                        <Text style={[styles.dividerText, { color: colors.textMuted }]}>
                            or continue with
                        </Text>
                        <View style={[styles.divider, { backgroundColor: colors.border }]} />
                    </Animated.View>

                    {/* Social Login */}
                    <Animated.View
                        entering={FadeInDown.delay(700).springify()}
                        style={styles.socialContainer}
                    >
                        <Button
                            title="Google"
                            onPress={() => { }}
                            variant="outline"
                            style={styles.socialButton}
                        />
                        <Button
                            title="Apple"
                            onPress={() => { }}
                            variant="outline"
                            style={styles.socialButton}
                        />
                    </Animated.View>

                    {/* Sign Up Link */}
                    <Animated.View
                        entering={FadeInDown.delay(800).springify()}
                        style={styles.signUpContainer}
                    >
                        <Text style={[styles.signUpText, { color: colors.textSecondary }]}>
                            Don't have an account?{' '}
                        </Text>
                        <Link href="/auth/signup" asChild>
                            <AnimatedPressable>
                                <Text style={[styles.signUpLink, { color: colors.primary }]}>
                                    Sign Up
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
    logoContainer: {
        alignItems: 'center',
        marginBottom: Spacing.xxl,
    },
    logo: {
        fontFamily: Fonts.family.extraBold,
        fontSize: 48,
        letterSpacing: 4,
    },
    tagline: {
        fontFamily: Fonts.family.regular,
        fontSize: Fonts.size.sm,
        marginTop: Spacing.xs,
    },
    title: {
        fontFamily: Fonts.family.bold,
        fontSize: Fonts.size.xxxl,
        textAlign: 'center',
    },
    subtitle: {
        fontFamily: Fonts.family.regular,
        fontSize: Fonts.size.md,
        textAlign: 'center',
        marginTop: Spacing.sm,
    },
    form: {
        marginTop: Spacing.xl,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginTop: Spacing.sm,
        marginBottom: Spacing.md,
    },
    forgotText: {
        fontFamily: Fonts.family.medium,
        fontSize: Fonts.size.sm,
    },
    signInButton: {
        marginTop: Spacing.md,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: Spacing.xl,
    },
    divider: {
        flex: 1,
        height: 1,
    },
    dividerText: {
        fontFamily: Fonts.family.regular,
        fontSize: Fonts.size.sm,
        marginHorizontal: Spacing.md,
    },
    socialContainer: {
        flexDirection: 'row',
        gap: Spacing.md,
    },
    socialButton: {
        flex: 1,
    },
    signUpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: Spacing.xl,
    },
    signUpText: {
        fontFamily: Fonts.family.regular,
        fontSize: Fonts.size.md,
    },
    signUpLink: {
        fontFamily: Fonts.family.semiBold,
        fontSize: Fonts.size.md,
    },
});
