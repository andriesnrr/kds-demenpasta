'use client';

import { useState, useEffect } from 'react';
import { Order, OrderStatus } from '@/types/order';
import { Users, ChefHat, Check, Package, AlertCircle } from 'lucide-react';
import { formatTime } from '@/lib/utils/formatters';
import { getTimerColor } from '@/lib/utils/orderHelpers';

interface OrderCardProps {
  order: Order;
  onUpdateStatus: (orderId: string, status: OrderStatus) => Promise<void>;
}

export default function OrderCard({ order, onUpdateStatus }: OrderCardProps) {
  const [elapsed, setElapsed] = useState(0);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const startTime = order.startedAt || order.createdAt;
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [order]);

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    try {
      setUpdating(true);
      await onUpdateStatus(order.id, newStatus);
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Gagal update status. Coba lagi.');
    } finally {
      setUpdating(false);
    }
  };

  const timerColor = getTimerColor(elapsed / 60);

  return (
    <div className="bg-white rounded-lg shadow-md border-2 border-gray-200 overflow-hidden hover:shadow-lg transition-shadow animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold">{order.orderNumber}</span>
            {order.tableNumber && (
              <span className="bg-white text-orange-600 px-3 py-1 rounded-full text-sm font-semibold">
                Meja {order.tableNumber}
              </span>
            )}
            {order.orderType === 'takeaway' && (
              <span className="bg-yellow-400 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
                Takeaway
              </span>
            )}
          </div>
          <div className={`text-2xl font-bold ${timerColor} bg-white px-3 py-1 rounded-lg`}>
            ⏱️ {formatTime(elapsed)}
          </div>
        </div>
      </div>

      {/* Customer Info */}
      <div className="px-4 py-2 bg-gray-50 border-b">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Users size={16} />
          <span className="font-semibold">{order.customerName}</span>
          <span className="text-gray-400">|</span>
          <span>{order.customerPhone}</span>
        </div>
      </div>

      {/* Items */}
      <div className="p-4 space-y-3">
        {order.items.map(item => (
          <div
            key={item.id}
            className="border-l-4 border-orange-400 pl-3 py-2 bg-orange-50 rounded"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-gray-800 text-lg">
                🥟 {item.menuName}
              </span>
              <span className="bg-orange-500 text-white px-3 py-1 rounded-full font-bold text-sm">
                x{item.quantity}
              </span>
            </div>
            {item.notes && (
              <div className="flex items-start gap-2 mt-2 text-sm">
                <AlertCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-red-600 font-medium">{item.notes}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="px-4 py-3 bg-gray-50 border-t border-b">
        <div className="flex items-center justify-between text-lg font-bold text-gray-800">
          <span>Total Dimsum:</span>
          <span className="text-orange-600">{order.totalPieces} pcs</span>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 bg-white space-y-2">
        {order.status === 'pending' && (
          <button
            onClick={() => handleStatusUpdate('preparing')}
            disabled={updating}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <ChefHat size={20} />
            {updating ? 'Memproses...' : 'Mulai Masak'}
          </button>
        )}
        {order.status === 'preparing' && (
          <button
            onClick={() => handleStatusUpdate('ready')}
            disabled={updating}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Check size={20} />
            {updating ? 'Memproses...' : 'Selesai - Siap Diantar'}
          </button>
        )}
        {order.status === 'ready' && (
          <button
            onClick={() => handleStatusUpdate('completed')}
            disabled={updating}
            className="w-full bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Package size={20} />
            {updating ? 'Memproses...' : 'Sudah Diambil'}
          </button>
        )}
      </div>
    </div>
  );
}