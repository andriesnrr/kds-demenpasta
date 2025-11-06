'use client';

import { useState } from 'react';
import { Order, OrderStatus } from '@/types/order';
import { formatCurrency } from '@/lib/utils/formatters';
import { Edit2, Trash2, Eye } from 'lucide-react';
import Modal from '@/components/ui/Modal';

interface OrderListProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  onEditOrder: (order: Order) => void; // ← NEW
  onDeleteOrder: (orderId: string) => Promise<void>; // ← NEW
}

export default function OrderList({
  orders,
  onUpdateStatus,
  onEditOrder,
  onDeleteOrder,
}: OrderListProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const getStatusLabel = (status: OrderStatus) => {
    const labels = {
      pending: 'Pending',
      preparing: 'Dimasak',
      ready: 'Siap',
      completed: 'Selesai',
    };
    return labels[status];
  };

  const getStatusClass = (status: OrderStatus) => {
    const classes = {
      pending: 'bg-gray-100 text-gray-800',
      preparing: 'bg-yellow-100 text-yellow-800',
      ready: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
    };
    return classes[status];
  };

  const renderOrderInfo = (order: Order) => {
    let info = order.customerName;
    if (order.tableNumber) {
      info += ` | Meja ${order.tableNumber}`;
    }
    return info;
  };

  const handleDelete = async (orderId: string, orderNumber: string) => {
    const confirmed = window.confirm(
      `Yakin ingin menghapus pesanan ${orderNumber}? Aksi ini tidak bisa dibatalkan!`
    );

    if (!confirmed) return;

    try {
      setDeletingId(orderId);
      await onDeleteOrder(orderId);
      alert('Pesanan berhasil dihapus!');
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Gagal menghapus pesanan. Coba lagi.');
    } finally {
      setDeletingId(null);
    }
  };

  const viewOrderDetail = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4 text-brand-black">
          Semua Pesanan Hari Ini
        </h3>

        {orders.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg">Belum ada pesanan hari ini</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map(order => (
              <div
                key={order.id}
                className="border-l-4 border-brand-red pl-4 py-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-lg text-brand-black">
                      {order.orderNumber}
                    </span>
                    <span className="mx-2 text-gray-400">|</span>
                    <span className="text-brand-black">{renderOrderInfo(order)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-brand-black">
                      {order.totalPieces} pcs
                    </span>
                    <span className="font-bold text-brand-red">
                      {formatCurrency(order.totalPrice)}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusClass(
                        order.status
                      )}`}
                    >
                      {getStatusLabel(order.status)}
                    </span>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      {/* View Detail */}
                      <button
                        onClick={() => viewOrderDetail(order)}
                        className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                        title="Lihat Detail"
                      >
                        <Eye size={18} />
                      </button>

                      {/* Edit - Only for pending/preparing */}
                      {(order.status === 'pending' || order.status === 'preparing') && (
                        <button
                          onClick={() => onEditOrder(order)}
                          className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
                          title="Edit Pesanan"
                        >
                          <Edit2 size={18} />
                        </button>
                      )}

                      {/* Mark as Ready */}
                      {order.status === 'ready' && (
                        <button
                          onClick={() => onUpdateStatus(order.id, 'completed')}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                        >
                          Sudah Diambil
                        </button>
                      )}

                      {/* Delete - Only for pending */}
                      {order.status === 'pending' && (
                        <button
                          onClick={() => handleDelete(order.id, order.orderNumber)}
                          disabled={deletingId === order.id}
                          className="p-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white rounded-lg transition-colors"
                          title="Hapus Pesanan"
                        >
                          {deletingId === order.id ? (
                            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <Modal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          title={`Detail Pesanan ${selectedOrder.orderNumber}`}
        >
          <div className="space-y-4">
            {/* Customer Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold text-brand-black mb-2">Informasi Customer</h4>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-semibold">Nama:</span> {selectedOrder.customerName}
                </p>
                <p>
                  <span className="font-semibold">HP:</span> {selectedOrder.customerPhone}
                </p>
                <p>
                  <span className="font-semibold">Tipe:</span>{' '}
                  <span className="capitalize">{selectedOrder.orderType}</span>
                </p>
                {selectedOrder.tableNumber && (
                  <p>
                    <span className="font-semibold">Meja:</span> {selectedOrder.tableNumber}
                  </p>
                )}
              </div>
            </div>

            {/* Items */}
            <div>
              <h4 className="font-bold text-brand-black mb-2">Items Pesanan</h4>
              <div className="space-y-2">
                {selectedOrder.items.map(item => (
                  <div key={item.id} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold text-brand-black">
                        🥟 {item.menuName} x{item.quantity}
                      </span>
                      <span className="font-bold text-brand-red">
                        {formatCurrency(item.subtotal)}
                      </span>
                    </div>
                    {item.notes && (
                      <p className="text-sm text-gray-600">📝 {item.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Additionals */}
            {selectedOrder.additionals && selectedOrder.additionals.length > 0 && (
              <div>
                <h4 className="font-bold text-brand-black mb-2">Additional</h4>
                <div className="space-y-2">
                  {selectedOrder.additionals.map(add => (
                    <div key={add.id} className="bg-yellow-50 p-3 rounded-lg flex justify-between">
                      <span className="text-brand-black">
                        {add.name} x{add.quantity}
                      </span>
                      <span className="font-semibold text-brand-red">
                        {formatCurrency(add.subtotal)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Total */}
            <div className="bg-red-50 p-4 rounded-lg border-2 border-brand-red">
              <div className="flex justify-between text-xl font-bold">
                <span className="text-brand-black">Total:</span>
                <span className="text-brand-red">
                  {formatCurrency(selectedOrder.totalPrice)}
                </span>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {selectedOrder.totalPieces} pieces
              </div>
            </div>

            {/* Timestamps */}
            <div className="text-xs text-gray-500 space-y-1">
              <p>
                Dibuat: {new Date(selectedOrder.createdAt).toLocaleString('id-ID')}
              </p>
              {selectedOrder.startedAt && (
                <p>
                  Mulai Masak: {new Date(selectedOrder.startedAt).toLocaleString('id-ID')}
                </p>
              )}
              {selectedOrder.readyAt && (
                <p>
                  Siap: {new Date(selectedOrder.readyAt).toLocaleString('id-ID')}
                </p>
              )}
              {selectedOrder.completedAt && (
                <p>
                  Selesai: {new Date(selectedOrder.completedAt).toLocaleString('id-ID')}
                </p>
              )}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}