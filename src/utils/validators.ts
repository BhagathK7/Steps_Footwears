// STEP Footwear App - Validators

export const validators = {
    email: (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    phone: (phone: string): boolean => {
        // Indian phone number validation
        const phoneRegex = /^[6-9]\d{9}$/;
        return phoneRegex.test(phone.replace(/\D/g, ''));
    },

    postalCode: (code: string): boolean => {
        // Indian postal code (6 digits)
        const postalRegex = /^\d{6}$/;
        return postalRegex.test(code);
    },

    password: (password: string): { valid: boolean; message: string } => {
        if (password.length < 8) {
            return { valid: false, message: 'Password must be at least 8 characters' };
        }
        if (!/[A-Z]/.test(password)) {
            return { valid: false, message: 'Password must contain an uppercase letter' };
        }
        if (!/[a-z]/.test(password)) {
            return { valid: false, message: 'Password must contain a lowercase letter' };
        }
        if (!/[0-9]/.test(password)) {
            return { valid: false, message: 'Password must contain a number' };
        }
        return { valid: true, message: '' };
    },

    required: (value: string | undefined | null): boolean => {
        return value !== undefined && value !== null && value.trim().length > 0;
    },

    minLength: (value: string, min: number): boolean => {
        return value.length >= min;
    },

    maxLength: (value: string, max: number): boolean => {
        return value.length <= max;
    },
};

export default validators;
