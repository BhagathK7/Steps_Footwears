// STEP Footwear App - Category Types

export interface Category {
    id: string;
    name: string;
    slug: string;
    description: string;
    image: string;
    icon?: string;
    parentId?: string;
    productCount: number;
    isActive: boolean;
    sortOrder: number;
    createdAt: string;
    updatedAt: string;
}

export interface CategoryWithChildren extends Category {
    children?: Category[];
}
