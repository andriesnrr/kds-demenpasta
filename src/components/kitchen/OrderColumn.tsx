'use client';

import { Order, OrderStatus } from '@/types/order';
import OrderCard from './OrderCard';

interface OrderColumnProps {
  title: string;
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  bgColor: string;
  borderColor: string;
}

export default function OrderColumn({
  title,
  orders,
  onUpdateStatus,
  bgColor,
  borderColor,
}: OrderColumnProps) {
  return (
    <div>
      <div className={`${bgColor} rounded-lg p-4 mb-4 border-2 ${borderColor}`}>
        <h3 className="text-lg font-bold text-gray-800 flex items-center justify-between">
          {title}
          <span className="bg-white px-3 py-1 rounded-full text-sm">
            {orders.length}
          </span>
        </h3>
      </div>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            Tidak ada pesanan
          </div>
        ) : (
          orders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onUpdateStatus={onUpdateStatus}
            />
          ))
        )}
      </div>
    </div>
  );
}