'use client';

import { useState } from 'react';
import { Order, OrderStatus } from '@/types/order';
import { Plus, Calendar, Archive } from 'lucide-react';
import OrderForm from './OrderForm';
import OrderList from './OrderList';

interface AdminPanelProps {
  orders: Order[];
  onAddOrder: (order: Omit<Order, 'id'>) => Promise<string | null | undefined>;
  onUpdateOrder: (orderId: string, order: Omit<Order, 'id'>) => Promise<void>;
  onDeleteOrder: (orderId: string) => Promise<void>;
  showForm: boolean;
  setShowForm: (show: boolean) => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  filter: 'today' | 'all'; // Props baru
  setFilter: (filter: 'today' | 'all') => void; // Props baru
}

export default function AdminPanel({
  orders,
  onAddOrder,
  onUpdateOrder,
  onDeleteOrder,
  showForm,
  setShowForm,
  onUpdateStatus,
  filter,
  setFilter,
}: AdminPanelProps) {
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingOrder(null);
  };

  const handleSubmitOrder = async (order: Omit<Order, 'id'>) => {
    if (editingOrder) {
      await onUpdateOrder(editingOrder.id, order);
    } else {
      await onAddOrder(order);
    }
  };

  return (
    <div>
      {/* Header Admin Panel yang Responsif */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          {/* Filter Toggle */}
          <div className="inline-flex bg-gray-100 p-1 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => setFilter('today')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                filter === 'today'
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Calendar size={16} />
              Hari Ini
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                filter === 'all'
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Archive size={16} />
              Semua
            </button>
          </div>

          {/* Tombol Buat Pesanan Baru */}
          <button
            onClick={() => {
              setEditingOrder(null);
              setShowForm(true);
            }}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-md w-full sm:w-auto"
          >
            <Plus size={20} />
            <span>Pesanan Baru</span>
          </button>
        </div>
      </div>

      {/* Modal Overlay for Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-start justify-center p-4 md:p-8">
          <div className="w-full max-w-6xl my-8 animate-fade-in">
             <OrderForm
              onSubmit={handleSubmitOrder}
              onClose={handleCloseForm}
              editOrder={editingOrder}
            />
          </div>
        </div>
      )}

      <OrderList
        orders={orders}
        onUpdateStatus={onUpdateStatus}
        onEditOrder={handleEditOrder}
        onDeleteOrder={onDeleteOrder}
      />
    </div>
  );
}