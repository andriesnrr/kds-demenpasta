export type PackSize = 4 | 6 | 14 | 16;
export type Variant = 'ayam' | 'jamur' | 'mix';
export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed';
export type OrderType = 'dine-in' | 'takeaway' | 'delivery';
// Definisi tipe pembayaran yang sebelumnya hilang
export type PaymentMethod = 'cash' | 'qris';

export interface MenuItem {
  id: string;
  name: string;
  packSize: PackSize;
  variant: Variant;
  composition: { ayam: number; jamur: number };
  price: number;
  prepTime: number;
  available: boolean;
}

export interface AdditionalOrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface OrderItem {
  id: string;
  menuId: string;
  menuName: string;
  packSize: PackSize;
  variant: Variant;
  quantity: number;
  price: number;
  subtotal: number;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  priority: 'normal' | 'urgent';
  createdAt: number;
  startedAt: number | null;
  completedAt: number | null;
  readyAt: number | null;
  orderType: OrderType;
  tableNumber?: string;
  
  // Properti pembayaran yang wajib ada agar tidak error
  paymentMethod: PaymentMethod;
  
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  additionals?: AdditionalOrderItem[];
  totalItems: number;
  totalPieces: number;
  totalPrice: number;
}