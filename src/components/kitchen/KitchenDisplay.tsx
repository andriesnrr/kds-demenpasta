'use client';

import { Order, OrderStatus } from '@/types/order';
import OrderColumn from './OrderColumn';

interface KitchenDisplayProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => Promise<void>;
}

export default function KitchenDisplay({ orders, onUpdateStatus }: KitchenDisplayProps) {
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const preparingOrders = orders.filter(o => o.status === 'preparing');
  const readyOrders = orders.filter(o => o.status === 'ready');

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <OrderColumn
        title="🔔 Pesanan Baru"
        orders={pendingOrders}
        onUpdateStatus={onUpdateStatus}
        bgColor="bg-yellow-50"
        borderColor="border-yellow-300"
      />
      <OrderColumn
        title="👨‍🍳 Sedang Dimasak"
        orders={preparingOrders}
        onUpdateStatus={onUpdateStatus}
        bgColor="bg-blue-50"
        borderColor="border-blue-300"
      />
      <OrderColumn
        title="✅ Siap Diantar"
        orders={readyOrders}
        onUpdateStatus={onUpdateStatus}
        bgColor="bg-green-50"
        borderColor="border-green-300"
      />
    </div>
  );
}