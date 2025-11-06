// src/components/kitchen/OrderGrid.tsx
'use client';

import { Order, OrderStatus } from '@/types/order';
import OrderCard from './OrderCard';

interface OrderGridProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => Promise<void>;
}

export default function OrderGrid({ orders, onUpdateStatus }: OrderGridProps) {
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const preparingOrders = orders.filter(o => o.status === 'preparing');
  const readyOrders = orders.filter(o => o.status === 'ready');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Pending Column */}
      <div>
        <div className="bg-yellow-50 rounded-lg p-4 mb-4 border-2 border-yellow-300">
          <h3 className="text-lg font-bold text-gray-800 flex items-center justify-between">
            🔔 Pesanan Baru
            <span className="bg-white px-3 py-1 rounded-full text-sm">
              {pendingOrders.length}
            </span>
          </h3>
        </div>
        <div className="space-y-4">
          {pendingOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              Tidak ada pesanan baru
            </div>
          ) : (
            pendingOrders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                onUpdateStatus={onUpdateStatus}
              />
            ))
          )}
        </div>
      </div>

      {/* Preparing Column */}
      <div>
        <div className="bg-blue-50 rounded-lg p-4 mb-4 border-2 border-blue-300">
          <h3 className="text-lg font-bold text-gray-800 flex items-center justify-between">
            👨‍🍳 Sedang Dimasak
            <span className="bg-white px-3 py-1 rounded-full text-sm">
              {preparingOrders.length}
            </span>
          </h3>
        </div>
        <div className="space-y-4">
          {preparingOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              Tidak ada pesanan sedang dimasak
            </div>
          ) : (
            preparingOrders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                onUpdateStatus={onUpdateStatus}
              />
            ))
          )}
        </div>
      </div>

      {/* Ready Column */}
      <div>
        <div className="bg-green-50 rounded-lg p-4 mb-4 border-2 border-green-300">
          <h3 className="text-lg font-bold text-gray-800 flex items-center justify-between">
            ✅ Siap Diantar
            <span className="bg-white px-3 py-1 rounded-full text-sm">
              {readyOrders.length}
            </span>
          </h3>
        </div>
        <div className="space-y-4">
          {readyOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              Tidak ada pesanan siap
            </div>
          ) : (
            readyOrders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                onUpdateStatus={onUpdateStatus}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}