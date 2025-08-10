export interface Order {
  id: number;
  userId: number;
  totalAmount: number;
  status: string;
  shippingAddress: string;
  createdAt: string;
  shippedAt?: string;
  deliveredAt?: string;
  orderItems: OrderItem[];
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CreateOrder {
  shippingAddress: string;
  orderItems: CreateOrderItem[];
}

export interface CreateOrderItem {
  productId: number;
  quantity: number;
}

export interface CartItem {
  product: any;
  quantity: number;
}
