// STEP Footwear App - Typography System
// Premium fonts using Outfit from Google Fonts

export const Fonts = {
    // Font families
    family: {
        regular: 'Outfit_400Regular',
        medium: 'Outfit_500Medium',
        semiBold: 'Outfit_600SemiBold',
        bold: 'Outfit_700Bold',
        extraBold: 'Outfit_800ExtraBold',
    },

    // Font sizes
    size: {
        xs: 11,
        sm: 13,
        md: 15,
        lg: 17,
        xl: 20,
        xxl: 24,
        xxxl: 32,
        display: 40,
        hero: 56,
    },

    // Line heights
    lineHeight: {
        tight: 1.1,
        normal: 1.4,
        relaxed: 1.6,
    },

    // Letter spacing
    letterSpacing: {
        tight: -0.5,
        normal: 0,
        wide: 0.5,
        extraWide: 1,
    },
};

// Pre-defined text styles
export const TextStyles = {
    hero: {
        fontFamily: Fonts.family.extraBold,
        fontSize: Fonts.size.hero,
        lineHeight: Fonts.size.hero * Fonts.lineHeight.tight,
        letterSpacing: Fonts.letterSpacing.tight,
    },
    display: {
        fontFamily: Fonts.family.bold,
        fontSize: Fonts.size.display,
        lineHeight: Fonts.size.display * Fonts.lineHeight.tight,
        letterSpacing: Fonts.letterSpacing.tight,
    },
    h1: {
        fontFamily: Fonts.family.bold,
        fontSize: Fonts.size.xxxl,
        lineHeight: Fonts.size.xxxl * Fonts.lineHeight.tight,
    },
    h2: {
        fontFamily: Fonts.family.semiBold,
        fontSize: Fonts.size.xxl,
        lineHeight: Fonts.size.xxl * Fonts.lineHeight.tight,
    },
    h3: {
        fontFamily: Fonts.family.semiBold,
        fontSize: Fonts.size.xl,
        lineHeight: Fonts.size.xl * Fonts.lineHeight.normal,
    },
    h4: {
        fontFamily: Fonts.family.medium,
        fontSize: Fonts.size.lg,
        lineHeight: Fonts.size.lg * Fonts.lineHeight.normal,
    },
    body: {
        fontFamily: Fonts.family.regular,
        fontSize: Fonts.size.md,
        lineHeight: Fonts.size.md * Fonts.lineHeight.relaxed,
    },
    bodyMedium: {
        fontFamily: Fonts.family.medium,
        fontSize: Fonts.size.md,
        lineHeight: Fonts.size.md * Fonts.lineHeight.relaxed,
    },
    bodySm: {
        fontFamily: Fonts.family.regular,
        fontSize: Fonts.size.sm,
        lineHeight: Fonts.size.sm * Fonts.lineHeight.relaxed,
    },
    caption: {
        fontFamily: Fonts.family.regular,
        fontSize: Fonts.size.xs,
        lineHeight: Fonts.size.xs * Fonts.lineHeight.normal,
    },
    button: {
        fontFamily: Fonts.family.semiBold,
        fontSize: Fonts.size.md,
        letterSpacing: Fonts.letterSpacing.wide,
    },
    buttonSm: {
        fontFamily: Fonts.family.medium,
        fontSize: Fonts.size.sm,
        letterSpacing: Fonts.letterSpacing.wide,
    },
    price: {
        fontFamily: Fonts.family.bold,
        fontSize: Fonts.size.xl,
    },
    priceLarge: {
        fontFamily: Fonts.family.extraBold,
        fontSize: Fonts.size.xxl,
    },
    label: {
        fontFamily: Fonts.family.medium,
        fontSize: Fonts.size.sm,
        letterSpacing: Fonts.letterSpacing.wide,
        textTransform: 'uppercase' as const,
    },
};

export default Fonts;
