import { Order } from '@/types/order';

export function generateOrderNumber(): string {
  const prefix = 'D';
  const number = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${number}`;
}

export function calculateTotalPieces(order: Order): number {
  return order.items.reduce((sum, item) => sum + (item.packSize * item.quantity), 0);
}

export function calculateTotalPrice(order: Order): number {
  return order.items.reduce((sum, item) => sum + item.subtotal, 0);
}

export function getOrdersByStatus(orders: Order[], status: Order['status']) {
  return orders.filter(order => order.status === status);
}

export function getTimerColor(elapsedMinutes: number): string {
  if (elapsedMinutes < 5) return 'text-green-600';
  if (elapsedMinutes < 10) return 'text-yellow-600';
  return 'text-red-600';
}