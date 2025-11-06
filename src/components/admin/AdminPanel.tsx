'use client';

import { useState } from 'react';
import { Order, OrderStatus } from '@/types/order';
import { Plus } from 'lucide-react';
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
}

export default function AdminPanel({
  orders,
  onAddOrder,
  onUpdateOrder,
  onDeleteOrder,
  showForm,
  setShowForm,
  onUpdateStatus,
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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
        <button
          onClick={() => {
            setEditingOrder(null);
            setShowForm(true);
          }}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all transform hover:scale-105 shadow-md"
        >
          <Plus size={20} />
          Buat Pesanan Baru
        </button>
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