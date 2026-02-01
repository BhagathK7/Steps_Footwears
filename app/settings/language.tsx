// STEP Footwear App - Language Settings Screen

import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { Header } from '../../src/components/navigation/Header';
import { AnimatedPressable } from '../../src/components/common/AnimatedPressable';
import { useTheme } from '../../src/contexts/ThemeContext';
import { Spacing, Fonts, Colors } from '../../src/constants';

interface Language {
    code: string;
    name: string;
    nativeName: string;
}

const languages: Language[] = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
];

export default function LanguageScreen() {
    const { colors } = useTheme();
    const [selectedLanguage, setSelectedLanguage] = useState('en');

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Header title="Language" showBack />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Text style={[styles.description, { color: colors.textSecondary }]}>
                    Select your preferred language
                </Text>

                {languages.map((language, index) => (
                    <Animated.View
                        key={language.code}
                        entering={FadeInDown.delay(index * 50).springify()}
                    >
                        <AnimatedPressable
                            onPress={() => setSelectedLanguage(language.code)}
                            style={[
                                styles.languageCard,
                                { backgroundColor: colors.surface },
                                selectedLanguage === language.code && {
                                    borderColor: colors.primary,
                                    borderWidth: 2,
                                },
                            ]}
                        >
                            <View style={styles.languageInfo}>
                                <Text style={[styles.languageName, { color: colors.text }]}>
                                    {language.name}
                                </Text>
                                <Text style={[styles.nativeName, { color: colors.textSecondary }]}>
                                    {language.nativeName}
                                </Text>
                            </View>
                            {selectedLanguage === language.code && (
                                <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                            )}
                        </AnimatedPressable>
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
    languageCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: Spacing.radius.lg,
        padding: Spacing.lg,
        marginBottom: Spacing.sm,
        ...Colors.shadows.small,
    },
    languageInfo: {
        flex: 1,
    },
    languageName: {
        fontFamily: Fonts.family.semiBold,
        fontSize: Fonts.size.md,
    },
    nativeName: {
        fontFamily: Fonts.family.regular,
        fontSize: Fonts.size.sm,
        marginTop: 2,
    },
});
