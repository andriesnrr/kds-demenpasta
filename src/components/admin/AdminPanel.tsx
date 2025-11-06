'use client';

import { useState } from 'react';
import { Order, OrderStatus } from '@/types/order';
import { Plus } from 'lucide-react';
import OrderForm from './OrderForm';
import OrderList from './OrderList';

interface AdminPanelProps {
  orders: Order[];
  onAddOrder: (order: Omit<Order, 'id'>) => Promise<string | null | undefined>;
  onUpdateOrder: (orderId: string, order: Omit<Order, 'id'>) => Promise<void>; // ← NEW
  onDeleteOrder: (orderId: string) => Promise<void>; // ← NEW
  showForm: boolean;
  setShowForm: (show: boolean) => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => Promise<void>;
}

export default function AdminPanel({
  orders,
  onAddOrder,
  onUpdateOrder, // ← NEW
  onDeleteOrder, // ← NEW
  showForm,
  setShowForm,
  onUpdateStatus,
}: AdminPanelProps) {
  const [editingOrder, setEditingOrder] = useState<Order | null>(null); // ← NEW

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
      // Update existing order
      await onUpdateOrder(editingOrder.id, order);
    } else {
      // Create new order
      await onAddOrder(order);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-brand-black">Admin Panel</h2>
        <button
          onClick={() => {
            setEditingOrder(null);
            setShowForm(true);
          }}
          className="bg-brand-red hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Pesanan Baru
        </button>
      </div>

      {showForm && (
        <OrderForm
          onSubmit={handleSubmitOrder}
          onClose={handleCloseForm}
          editOrder={editingOrder} // ← Pass editing order
        />
      )}

      {!showForm && (
        <OrderList
          orders={orders}
          onUpdateStatus={onUpdateStatus}
          onEditOrder={handleEditOrder} // ← NEW
          onDeleteOrder={onDeleteOrder} // ← NEW
        />
      )}
    </div>
  );
}