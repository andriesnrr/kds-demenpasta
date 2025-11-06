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
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden border border-gray-100 transform transition-all duration-300 animate-fadeIn flex flex-col">
      {/* Header */}
      <div className={`p-4 relative overflow-hidden ${
        order.status === 'pending' ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
        order.status === 'preparing' ? 'bg-gradient-to-r from-blue-500 to-indigo-600' :
        'bg-gradient-to-r from-green-500 to-emerald-600'
      }`}>
        <div className="flex items-center justify-between relative z-10 text-white">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-black tracking-wider">#{order.orderNumber}</span>
            {order.orderType === 'takeaway' && (
               <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase">
                 Takeaway
               </span>
            )}
          </div>
          <div className={`text-xl font-black ${timerColorClass} bg-white px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-2`}>
             <Clock size={18} /> {formatTime(elapsed)}
          </div>
        </div>
        {/* Table Number Badge if Dine In */}
        {order.tableNumber && (
          <div className="absolute -bottom-3 left-4 bg-white text-gray-900 px-4 py-1 rounded-full text-sm font-bold shadow-md z-20 border-2 border-gray-100 flex items-center gap-1">
            <span>🍽️ Meja {order.tableNumber}</span>
          </div>
        )}
      </div>

      {/* Customer & Items Container */}
      <div className="p-4 pt-6 flex-1 flex flex-col gap-4">
        {/* Items List */}
        <div className="space-y-2 flex-1">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <span className="text-2xl mt-0.5">🥟</span>
              <div className="flex-1">
                {/* UBAHAN DI SINI: Format Nama Menu - Jumlah pcs */}
                <div className="font-bold text-gray-800 text-lg leading-tight">
                  {item.menuName} - {item.quantity} pcs
                </div>
                
                {item.notes && (
                  <div className="mt-1.5 flex items-start gap-1.5 text-red-600 bg-red-50 p-2 rounded-lg">
                    <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                    <span className="text-sm font-bold">{item.notes}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
          {/* Additionals if any */}
          {order.additionals && order.additionals.length > 0 && (
             <div className="mt-2 pt-2 border-t border-dashed border-gray-200">
               <p className="text-xs font-bold text-gray-500 uppercase mb-1">Tambahan:</p>
               {order.additionals.map((add, idx) => (
                 <div key={`add-${idx}`} className="flex justify-between text-sm bg-yellow-50 p-2 rounded-lg mb-1 text-yellow-800 font-bold">
                    {/* Format untuk additional juga disesuaikan agar konsisten */}
                    <span>{add.name} - {add.quantity} pcs</span>
                 </div>
               ))}
             </div>
          )}
        </div>

        {/* Customer Info Compact */}
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 p-2 rounded-lg justify-center">
          <User size={14} /> <span className="font-semibold truncate max-w-[150px]">{order.customerName}</span>
        </div>
      </div>

      {/* Action Button */}
      <div className="p-4 bg-gray-50 border-t border-gray-100">
        {order.status === 'pending' && (
          <button
            onClick={() => handleStatusUpdate('preparing')}
            disabled={updating}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md active:scale-95"
          >
            <ChefHat size={20} />
            {updating ? '...' : 'Mulai Masak'}
          </button>
        )}
        {order.status === 'preparing' && (
          <button
            onClick={() => handleStatusUpdate('ready')}
            disabled={updating}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md active:scale-95"
          >
            <CheckCircle size={20} />
            {updating ? '...' : 'Selesai Masak'}
          </button>
        )}
        {order.status === 'ready' && (
          <button
            onClick={() => handleStatusUpdate('completed')}
            disabled={updating}
            className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md active:scale-95"
          >
            <Package size={20} />
            {updating ? '...' : 'Selesai Diambil'}
          </button>
        )}
      </div>
    </div>
  );
}