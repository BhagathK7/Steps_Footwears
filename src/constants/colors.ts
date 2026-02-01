// STEP Footwear App - Color Palette
// Premium color scheme with light/dark mode support

export const Colors = {
  // Brand Colors
  primary: '#15173D',      // Deep navy - primary backgrounds, headers
  accent: '#982598',       // Rich purple - buttons, CTAs, highlights
  secondary: '#E491C9',    // Soft pink - secondary accents
  background: '#F1E9E9',   // Warm off-white - light mode background

  // Light Theme
  light: {
    background: '#F1E9E9',
    surface: '#FFFFFF',
    surfaceVariant: '#FAF7F7',
    text: '#15173D',
    textSecondary: '#5A5C7A',
    textMuted: '#9496B0',
    border: '#E8E0E0',
    borderLight: '#F5F1F1',
    primary: '#982598',
    primaryLight: '#E491C9',
    accent: '#15173D',
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    tabBar: 'rgba(255, 255, 255, 0.85)',
    tabBarBorder: 'rgba(21, 23, 61, 0.1)',
    card: '#FFFFFF',
    cardShadow: 'rgba(21, 23, 61, 0.08)',
    icon: '#15173D',
    iconMuted: '#9496B0',
    overlay: 'rgba(21, 23, 61, 0.5)',
    skeleton: '#E8E0E0',
    skeletonHighlight: '#F5F1F1',
  },

  // Dark Theme
  dark: {
    background: '#0D0E1F',
    surface: '#15173D',
    surfaceVariant: '#1E2048',
    text: '#F1E9E9',
    textSecondary: '#B8B9D0',
    textMuted: '#6E7099',
    border: '#2A2C52',
    borderLight: '#1E2048',
    primary: '#E491C9',
    primaryLight: '#982598',
    accent: '#E491C9',
    success: '#30D158',
    warning: '#FFD60A',
    error: '#FF453A',
    tabBar: 'rgba(21, 23, 61, 0.9)',
    tabBarBorder: 'rgba(228, 145, 201, 0.15)',
    card: '#1A1C3D',
    cardShadow: 'rgba(0, 0, 0, 0.3)',
    icon: '#F1E9E9',
    iconMuted: '#6E7099',
    overlay: 'rgba(0, 0, 0, 0.7)',
    skeleton: '#1E2048',
    skeletonHighlight: '#2A2C52',
  },

  // Gradients
  gradients: {
    primary: ['#982598', '#E491C9'] as const,
    dark: ['#15173D', '#0D0E1F'] as const,
    accent: ['#E491C9', '#982598'] as const,
    surface: ['#FFFFFF', '#FAF7F7'] as const,
  },

  // Shadows
  shadows: {
    small: {
      shadowColor: '#15173D',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: '#15173D',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 4,
    },
    large: {
      shadowColor: '#15173D',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.16,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};

export type ThemeColors = typeof Colors.light;
export type ColorScheme = 'light' | 'dark';
