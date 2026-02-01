// STEP Footwear App - Animation Constants
// Smooth 60fps animation configurations

import { Easing } from 'react-native-reanimated';

export const Animations = {
    // Durations (milliseconds)
    duration: {
        instant: 100,
        fast: 200,
        normal: 300,
        slow: 500,
        verySlow: 800,
    },

    // Spring configurations for react-native-reanimated
    spring: {
        // Snappy - for button presses, quick feedback
        snappy: {
            damping: 20,
            stiffness: 300,
            mass: 0.8,
        },
        // Bouncy - for playful animations
        bouncy: {
            damping: 12,
            stiffness: 200,
            mass: 1,
        },
        // Gentle - for page transitions
        gentle: {
            damping: 20,
            stiffness: 120,
            mass: 1,
        },
        // Stiff - for quick snaps
        stiff: {
            damping: 30,
            stiffness: 400,
            mass: 0.5,
        },
    },

    // Timing configurations
    timing: {
        easeIn: {
            duration: 300,
            easing: Easing.in(Easing.cubic),
        },
        easeOut: {
            duration: 300,
            easing: Easing.out(Easing.cubic),
        },
        easeInOut: {
            duration: 300,
            easing: Easing.inOut(Easing.cubic),
        },
    },

    // Scale values for press feedback
    scale: {
        pressed: 0.97,
        active: 1.02,
        normal: 1,
    },

    // Opacity values
    opacity: {
        disabled: 0.5,
        pressed: 0.8,
        normal: 1,
    },

    // Stagger delays for list animations
    stagger: {
        fast: 50,
        normal: 100,
        slow: 150,
    },
};

export default Animations;
