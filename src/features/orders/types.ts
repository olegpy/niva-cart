export type OrderStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderItem {
  id: string;
  productId: number | null;
  titleSnapshot: string;
  unitPrice: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  stripeSessionId: string;
  stripePaymentIntentId: string | null;
  status: OrderStatus;
  total: number;
  currency: string;
  customerEmail: string;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}
