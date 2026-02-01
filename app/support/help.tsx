// STEP Footwear App - Help Center Screen

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

interface FAQ {
    id: string;
    question: string;
    answer: string;
}

const faqs: FAQ[] = [
    {
        id: '1',
        question: 'How do I track my order?',
        answer: 'You can track your order by going to Profile > My Orders and clicking on the order you want to track. You will receive real-time updates on your order status.',
    },
    {
        id: '2',
        question: 'What is your return policy?',
        answer: 'We offer a 30-day easy return policy. If you are not satisfied with your purchase, you can return it within 30 days of delivery for a full refund or exchange.',
    },
    {
        id: '3',
        question: 'How long does delivery take?',
        answer: 'Standard delivery takes 3-5 business days. Express delivery is available for orders above ₹1,999 and takes 1-2 business days.',
    },
    {
        id: '4',
        question: 'Is Cash on Delivery available?',
        answer: 'Yes, Cash on Delivery (COD) is available for all orders. A nominal COD fee of ₹49 applies to orders below ₹999.',
    },
    {
        id: '5',
        question: 'How do I cancel my order?',
        answer: 'You can cancel your order within 24 hours of placing it. Go to Profile > My Orders, select the order, and click Cancel Order.',
    },
    {
        id: '6',
        question: 'Are the products authentic?',
        answer: 'Yes, all products sold on STEP are 100% authentic and sourced directly from authorized brand distributors.',
    },
];

export default function HelpScreen() {
    const { colors } = useTheme();
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Header title="Help Center" showBack />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Text style={[styles.title, { color: colors.text }]}>
                    Frequently Asked Questions
                </Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                    Find answers to common questions
                </Text>

                {faqs.map((faq, index) => (
                    <Animated.View
                        key={faq.id}
                        entering={FadeInDown.delay(index * 80).springify()}
                    >
                        <AnimatedPressable
                            onPress={() => toggleExpand(faq.id)}
                            style={[styles.faqCard, { backgroundColor: colors.surface }]}
                        >
                            <View style={styles.questionRow}>
                                <Text style={[styles.question, { color: colors.text }]}>
                                    {faq.question}
                                </Text>
                                <Ionicons
                                    name={expandedId === faq.id ? 'chevron-up' : 'chevron-down'}
                                    size={20}
                                    color={colors.textMuted}
                                />
                            </View>
                            {expandedId === faq.id && (
                                <Text style={[styles.answer, { color: colors.textSecondary }]}>
                                    {faq.answer}
                                </Text>
                            )}
                        </AnimatedPressable>
                    </Animated.View>
                ))}

                <View style={styles.contactSection}>
                    <Text style={[styles.contactTitle, { color: colors.text }]}>
                        Still need help?
                    </Text>
                    <Text style={[styles.contactText, { color: colors.textSecondary }]}>
                        Our support team is available 24/7
                    </Text>
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
        marginBottom: Spacing.lg,
    },
    faqCard: {
        borderRadius: Spacing.radius.lg,
        padding: Spacing.lg,
        marginBottom: Spacing.sm,
        ...Colors.shadows.small,
    },
    questionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    question: {
        flex: 1,
        fontFamily: Fonts.family.semiBold,
        fontSize: Fonts.size.md,
        marginRight: Spacing.md,
    },
    answer: {
        fontFamily: Fonts.family.regular,
        fontSize: Fonts.size.sm,
        lineHeight: 22,
        marginTop: Spacing.md,
        paddingTop: Spacing.md,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
    },
    contactSection: {
        marginTop: Spacing.xl,
        alignItems: 'center',
    },
    contactTitle: {
        fontFamily: Fonts.family.semiBold,
        fontSize: Fonts.size.lg,
    },
    contactText: {
        fontFamily: Fonts.family.regular,
        fontSize: Fonts.size.md,
        marginTop: Spacing.xs,
    },
});
