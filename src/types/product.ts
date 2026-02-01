// STEP Footwear App - Product Types

export interface ProductImage {
    id: string;
    url: string;
    alt: string;
    isPrimary: boolean;
}

export interface ProductVariant {
    id: string;
    color: string;
    colorCode: string; // Hex color for UI display
    size: string;
    stock: number;
    sku: string;
    images: ProductImage[];
}

export interface Product {
    id: string;
    name: string;
    brand: string;
    description: string;
    shortDescription: string;
    price: number;
    originalPrice?: number; // For showing discounts
    currency: string;
    categoryId: string;
    categoryName: string;
    images: ProductImage[];
    variants: ProductVariant[];
    sizes: string[];
    colors: { name: string; code: string }[];
    rating: number;
    reviewCount: number;
    isFeatured: boolean;
    isNew: boolean;
    isOnSale: boolean;
    tags: string[];
    createdAt: string;
    updatedAt: string;
}

export interface ProductFilters {
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    sizes?: string[];
    colors?: string[];
    brands?: string[];
    sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'rating' | 'popular';
    search?: string;
}

export interface ProductsResponse {
    products: Product[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
}
