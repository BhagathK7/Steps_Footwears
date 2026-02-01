// STEP Footwear App - Order Types

import { Product } from './product';
import { Address } from './user';

export interface OrderItem {
    id: string;
    product: Product;
    productId: string;
    productName: string;
    productImage: string;
    selectedSize: string;
    selectedColor: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

export interface OrderPayment {
    id: string;
    method: 'razorpay' | 'cod';
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
    amount: number;
    currency: string;
    paidAt?: string;
}

export interface Order {
    id: string;
    orderNumber: string;
    userId: string;
    items: OrderItem[];
    shippingAddress: Address;
    billingAddress?: Address;
    payment: OrderPayment;
    subtotal: number;
    shippingCost: number;
    tax: number;
    discount: number;
    total: number;
    status: OrderStatus;
    statusHistory: OrderStatusUpdate[];
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export type OrderStatus =
    | 'pending'
    | 'confirmed'
    | 'processing'
    | 'shipped'
    | 'out_for_delivery'
    | 'delivered'
    | 'cancelled'
    | 'refunded';

export interface OrderStatusUpdate {
    status: OrderStatus;
    timestamp: string;
    note?: string;
}

export interface CreateOrderRequest {
    items: {
        productId: string;
        quantity: number;
        selectedSize: string;
        selectedColor: string;
    }[];
    shippingAddressId: string;
    billingAddressId?: string;
    paymentMethod: 'razorpay' | 'cod';
    couponCode?: string;
    notes?: string;
}

export interface Invoice {
    orderId: string;
    orderNumber: string;
    invoiceNumber: string;
    invoiceDate: string;
    customerName: string;
    customerEmail: string;
    shippingAddress: Address;
    items: OrderItem[];
    subtotal: number;
    shippingCost: number;
    tax: number;
    discount: number;
    total: number;
    paymentMethod: string;
    paymentStatus: string;
}
