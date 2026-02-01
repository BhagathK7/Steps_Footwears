// STEP Footwear App - User Types

export interface Address {
    id: string;
    label: string; // e.g., "Home", "Work"
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
}

export interface User {
    id: string;
    email: string;
    fullName: string;
    phone?: string;
    avatar?: string;
    role: 'customer' | 'admin';
    addresses: Address[];
    defaultAddressId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    user: User;
    token: string;
    refreshToken?: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
}
