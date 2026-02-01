// STEP Footwear App - Currency Formatter

export function formatCurrency(
    amount: number,
    currency: string = 'INR',
    locale: string = 'en-IN'
): string {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(amount);
}

export function formatPrice(amount: number): string {
    return formatCurrency(amount, 'INR', 'en-IN');
}

export function calculateDiscount(originalPrice: number, currentPrice: number): number {
    if (originalPrice <= 0) return 0;
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}

export function formatDiscount(originalPrice: number, currentPrice: number): string {
    const discount = calculateDiscount(originalPrice, currentPrice);
    return `${discount}% OFF`;
}
