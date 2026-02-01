// STEP Footwear App - Storage Utilities
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
    THEME: '@step_theme',
    AUTH: '@step_auth',
    CART: '@step_cart',
    FAVORITES: '@step_favorites',
    RECENT_SEARCHES: '@step_recent_searches',
    RECENTLY_VIEWED: '@step_recently_viewed',
} as const;

export const storage = {
    // Generic get/set
    async get<T>(key: string): Promise<T | null> {
        try {
            const value = await AsyncStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.warn(`Failed to get ${key}:`, error);
            return null;
        }
    },

    async set<T>(key: string, value: T): Promise<void> {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.warn(`Failed to set ${key}:`, error);
        }
    },

    async remove(key: string): Promise<void> {
        try {
            await AsyncStorage.removeItem(key);
        } catch (error) {
            console.warn(`Failed to remove ${key}:`, error);
        }
    },

    async clear(): Promise<void> {
        try {
            await AsyncStorage.clear();
        } catch (error) {
            console.warn('Failed to clear storage:', error);
        }
    },

    // Recent searches
    async addRecentSearch(query: string): Promise<void> {
        const searches = (await this.get<string[]>(STORAGE_KEYS.RECENT_SEARCHES)) || [];
        const updated = [query, ...searches.filter((s) => s !== query)].slice(0, 10);
        await this.set(STORAGE_KEYS.RECENT_SEARCHES, updated);
    },

    async getRecentSearches(): Promise<string[]> {
        return (await this.get<string[]>(STORAGE_KEYS.RECENT_SEARCHES)) || [];
    },

    async clearRecentSearches(): Promise<void> {
        await this.remove(STORAGE_KEYS.RECENT_SEARCHES);
    },

    // Recently viewed products
    async addRecentlyViewed(productId: string): Promise<void> {
        const viewed = (await this.get<string[]>(STORAGE_KEYS.RECENTLY_VIEWED)) || [];
        const updated = [productId, ...viewed.filter((id) => id !== productId)].slice(0, 20);
        await this.set(STORAGE_KEYS.RECENTLY_VIEWED, updated);
    },

    async getRecentlyViewed(): Promise<string[]> {
        return (await this.get<string[]>(STORAGE_KEYS.RECENTLY_VIEWED)) || [];
    },
};

export { STORAGE_KEYS };
export default storage;
