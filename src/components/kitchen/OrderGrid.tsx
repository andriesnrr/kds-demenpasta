'use client';

import { Order, OrderStatus } from '@/types/order';
import OrderCard from './OrderCard';
import { Bell, ChefHat, CheckCircle, LucideIcon } from 'lucide-react';

interface OrderGridProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => Promise<void>;
}

interface ColumnHeaderProps {
  title: string;
  count: number;
  icon: LucideIcon;
  colorClass: string;
  bgClass: string;
}

export default function OrderGrid({ orders, onUpdateStatus }: OrderGridProps) {
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const preparingOrders = orders.filter(o => o.status === 'preparing');
  const readyOrders = orders.filter(o => o.status === 'ready');

  const ColumnHeader = ({ title, count, icon: Icon, colorClass, bgClass }: ColumnHeaderProps) => (
      <div className={`flex items-center justify-between p-4 rounded-xl mb-4 ${bgClass} border-2 ${colorClass}`}>
        <div className="flex items-center gap-3">
             <div className={`p-2 rounded-lg bg-white ${colorClass.replace('border', 'text')}`}>
                 <Icon size={24} />
             </div>
             <h3 className="text-lg font-black text-gray-800 uppercase tracking-wide">
                {title}
             </h3>
        </div>
        <span className="bg-white text-gray-800 px-4 py-1.5 rounded-full font-black text-lg shadow-sm">
          {count}
        </span>
      </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Pending Column */}
      <div className="flex flex-col h-full">
        <ColumnHeader 
            title="Pesanan Baru" 
            count={pendingOrders.length} 
            icon={Bell}
            bgClass="bg-yellow-50"
            colorClass="border-yellow-400"
        />
        <div className="space-y-6 flex-1 overflow-y-auto pb-6 px-1">
          {pendingOrders.length === 0 ? (
            <div className="text-center py-12 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200">
              <Bell size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-400 font-medium">Tidak ada pesanan baru</p>
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
      <div className="flex flex-col h-full">
        <ColumnHeader 
            title="Sedang Dimasak" 
            count={preparingOrders.length} 
            icon={ChefHat}
            bgClass="bg-blue-50"
            colorClass="border-blue-400"
        />
        <div className="space-y-6 flex-1 overflow-y-auto pb-6 px-1">
          {preparingOrders.length === 0 ? (
             <div className="text-center py-12 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200">
              <ChefHat size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-400 font-medium">Dapur sedang santai</p>
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
      <div className="flex flex-col h-full">
        <ColumnHeader 
            title="Siap Diantar" 
            count={readyOrders.length} 
            icon={CheckCircle}
            bgClass="bg-green-50"
            colorClass="border-green-400"
        />
        <div className="space-y-6 flex-1 overflow-y-auto pb-6 px-1">
          {readyOrders.length === 0 ? (
             <div className="text-center py-12 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200">
              <CheckCircle size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-400 font-medium">Belum ada yang siap</p>
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