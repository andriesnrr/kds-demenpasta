'use client';

import { useState, useEffect } from 'react';
import { Order, OrderStatus } from '@/types/order';
import { User, Phone, AlertCircle, CheckCircle, Package, ChefHat, Clock } from 'lucide-react';
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

  const timerColorClass = getTimerColor(elapsed / 60);

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-gray-100 transform hover:scale-[1.01] transition-all duration-300 animate-fadeIn">
      {/* Header with Gradient */}
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 p-4 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-10 -mt-10"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                <Package size={20} className="text-white" />
              </div>
              <div>
                <div className="text-white/80 text-xs font-medium mb-0.5">Order #</div>
                <div className="text-2xl font-black text-white tracking-wider">{order.orderNumber}</div>
              </div>
            </div>
            
            <div className={`text-xl font-black ${timerColorClass} bg-white px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-2`}>
               <Clock size={18} /> {formatTime(elapsed)}
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {order.tableNumber && (
              <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30">
                <span className="text-white text-xs font-bold">🍽️ Meja {order.tableNumber}</span>
              </div>
            )}
            {order.orderType === 'takeaway' && (
               <div className="inline-flex items-center gap-1.5 bg-yellow-400/90 backdrop-blur-sm px-3 py-1 rounded-full">
               <span className="text-gray-900 text-xs font-bold">👜 Takeaway</span>
             </div>
            )}
          </div>
        </div>
      </div>

      {/* Customer Info */}
      <div className="px-4 py-3 bg-white border-b-2 border-gray-50">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 p-1.5 rounded-md">
              <User size={14} className="text-blue-600" />
            </div>
            <div className="truncate">
              <div className="text-[10px] text-gray-500 font-medium uppercase">Customer</div>
              <div className="font-bold text-gray-900 text-sm truncate">{order.customerName}</div>
            </div>
          </div>
          {order.customerPhone && (
             <div className="flex items-center gap-2">
             <div className="bg-green-100 p-1.5 rounded-md">
               <Phone size={14} className="text-green-600" />
             </div>
             <div className="truncate">
               <div className="text-[10px] text-gray-500 font-medium uppercase">Phone</div>
               <div className="font-bold text-gray-900 text-sm truncate">{order.customerPhone}</div>
             </div>
           </div>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="p-4 space-y-3 bg-gray-50/50">
        {order.items.map(item => (
          <div
            key={item.id}
            className="bg-white border-l-[6px] border-orange-500 rounded-r-lg p-3 shadow-sm"
          >
            <div className="flex items-start justify-between mb-1">
              <div className="flex-1 pr-2">
                <div className="flex items-center gap-1.5 mb-1">
                   <span className="text-lg">🥟</span>
                   <span className="font-bold text-gray-900 leading-tight">{item.menuName}</span>
                </div>
              </div>
              <div className="bg-orange-500 text-white px-2.5 py-1 rounded-lg font-black text-md shadow-sm flex-shrink-0">
                x{item.quantity}
              </div>
            </div>
            {item.notes && (
              <div className="mt-2 flex items-start gap-2 bg-red-50 border border-red-200 rounded-md p-2">
                <AlertCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-red-600 font-bold text-sm leading-tight">{item.notes}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="px-4 py-3 bg-white border-t-2 border-gray-100">
        <div className="flex items-center justify-between">
          <span className="font-bold text-gray-600 text-sm uppercase tracking-wider">Total Items:</span>
          <span className="text-2xl font-black text-orange-600">{order.totalPieces} pcs</span>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 bg-white border-t border-gray-100">
        {order.status === 'pending' && (
          <button
            onClick={() => handleStatusUpdate('preparing')}
            disabled={updating}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 rounded-xl transition-all transform active:scale-95 shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <ChefHat size={20} />
            {updating ? 'Memproses...' : 'Mulai Masak'}
          </button>
        )}
        {order.status === 'preparing' && (
          <button
            onClick={() => handleStatusUpdate('ready')}
            disabled={updating}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 rounded-xl transition-all transform active:scale-95 shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <CheckCircle size={20} />
            {updating ? 'Memproses...' : 'Selesai - Siap Diantar'}
          </button>
        )}
        {order.status === 'ready' && (
          <button
            onClick={() => handleStatusUpdate('completed')}
            disabled={updating}
            className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-3 rounded-xl transition-all transform active:scale-95 shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Package size={20} />
            {updating ? 'Memproses...' : 'Sudah Diambil'}
          </button>
        )}
      </div>
    </div>
  );
}