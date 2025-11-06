'use client';

import { useState } from 'react';
import { Order, OrderStatus } from '@/types/order';
import { formatCurrency } from '@/lib/utils/formatters';
import { Edit2, Trash2, Eye, CalendarDays, Printer, Download, Share2, Loader2 } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { printReceipt, downloadReceipt, shareReceipt } from '@/lib/utils/printHelpers';

interface OrderListProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  onEditOrder: (order: Order) => void;
  onDeleteOrder: (orderId: string) => Promise<void>;
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
  // Loading states untuk aksi receipt
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const getStatusLabel = (status: OrderStatus) => {
    const labels = { pending: 'Pending', preparing: 'Dimasak', ready: 'Siap', completed: 'Selesai' };
    return labels[status];
  };

  const getStatusClass = (status: OrderStatus) => {
    const classes = {
      pending: 'bg-gray-100 text-gray-800', preparing: 'bg-yellow-100 text-yellow-800',
      ready: 'bg-blue-100 text-blue-800', completed: 'bg-green-100 text-green-800',
    };
    return classes[status];
  };

  const isOrderToday = (timestamp: number) => {
    const date = new Date(timestamp); const today = new Date();
    return date.setHours(0,0,0,0) === today.setHours(0,0,0,0);
  };

  const renderOrderInfo = (order: Order) => {
    let info = order.customerName;
    if (order.tableNumber) info += ` | Meja ${order.tableNumber}`;
    return info;
  };

  const handleDelete = async (orderId: string, orderNumber: string) => {
    if (!window.confirm(`Yakin ingin menghapus pesanan ${orderNumber}?`)) return;
    try {
      setDeletingId(orderId);
      await onDeleteOrder(orderId);
    } catch (error) {
      console.error(error); alert('Gagal menghapus pesanan.');
    } finally {
      setDeletingId(null);
    }
  };

  // Handlers untuk receipt actions dengan loading
  const handleDownload = async (order: Order) => {
    setIsDownloading(true);
    await downloadReceipt(order);
    setIsDownloading(false);
  };

  const handleShare = async (order: Order) => {
    setIsSharing(true);
    await shareReceipt(order);
    setIsSharing(false);
  };

  return (
    <>
      <div>
        <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          Daftar Pesanan <span className="text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Total: {orders.length}</span>
        </h3>

        {orders.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-medium">Tidak ada pesanan yang ditemukan</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map(order => {
               const isToday = isOrderToday(order.createdAt);
               return (
                <div key={order.id} className={`border-l-[6px] ${order.status === 'completed' ? 'border-green-500 bg-green-50/30' : 'border-brand-red bg-white'} pl-4 py-4 pr-4 rounded-xl shadow-sm hover:shadow-md transition-all border-y border-r border-gray-100`}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-black text-lg text-gray-900">{order.orderNumber}</span>
                        {!isToday && (
                          <span className="text-xs font-medium text-gray-500 flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-md" title={new Date(order.createdAt).toLocaleString('id-ID')}>
                             <CalendarDays size={12} /> {new Date(order.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                          </span>
                        )}
                        <span className={`px-3 py-0.5 rounded-full text-xs font-bold uppercase ${getStatusClass(order.status)}`}>{getStatusLabel(order.status)}</span>
                      </div>
                      <div className="text-gray-700 font-medium flex items-center gap-2">{renderOrderInfo(order)}</div>
                    </div>
                    <div className="flex items-center justify-between md:justify-end gap-4 sm:gap-6">
                      <div className="text-right">
                        <div className="font-bold text-brand-red">{formatCurrency(order.totalPrice)}</div>
                        <div className="text-xs font-semibold text-gray-500">{order.totalPieces} pcs</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setSelectedOrder(order); setShowDetailModal(true); }} className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-lg transition-colors" title="Lihat Detail"><Eye size={18} /></button>
                        {(order.status === 'pending' || order.status === 'preparing' || order.status === 'completed') && (
                          <button onClick={() => onEditOrder(order)} className="p-2 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 rounded-lg transition-colors" title="Edit Pesanan"><Edit2 size={18} /></button>
                        )}
                        {order.status === 'ready' && (
                          <button onClick={() => onUpdateStatus(order.id, 'completed')} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm">Selesai</button>
                        )}
                        {(order.status === 'pending' || order.status === 'completed') && (
                          <button onClick={() => handleDelete(order.id, order.orderNumber)} disabled={deletingId === order.id} className="p-2 bg-red-100 text-red-600 hover:bg-red-200 disabled:bg-gray-100 disabled:text-gray-400 rounded-lg transition-colors" title="Hapus Pesanan">
                            {deletingId === order.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title={`Detail Pesanan ${selectedOrder.orderNumber}`}>
          <div className="space-y-6">
            {/* --- RECEIPT ACTIONS --- */}
            <div className="flex flex-wrap justify-end gap-2">
               <button onClick={() => printReceipt(selectedOrder)} className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold text-sm">
                  <Printer size={16} /> Print
               </button>
               <button onClick={() => handleDownload(selectedOrder)} disabled={isDownloading} className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-semibold text-sm disabled:opacity-50">
                  {isDownloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                  Simpan PNG
               </button>
               <button onClick={() => handleShare(selectedOrder)} disabled={isSharing} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm font-semibold text-sm disabled:opacity-50">
                  {isSharing ? <Loader2 size={16} className="animate-spin" /> : <Share2 size={16} />}
                  Share (WA/IG)
               </button>
            </div>

            {/* Customer Info */}
            <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
              <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">👤 Informasi Customer</h4>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <div><span className="text-gray-500 block">Nama</span><span className="font-semibold text-gray-900">{selectedOrder.customerName}</span></div>
                <div><span className="text-gray-500 block">No. HP</span><span className="font-semibold text-gray-900">{selectedOrder.customerPhone}</span></div>
                <div><span className="text-gray-500 block">Tipe Pesanan</span><span className="font-semibold text-gray-900 capitalize">{selectedOrder.orderType}</span></div>
                {selectedOrder.tableNumber && <div><span className="text-gray-500 block">Nomor Meja</span><span className="font-semibold text-gray-900">{selectedOrder.tableNumber}</span></div>}
              </div>
            </div>

            {/* Items & Additionals (Sama seperti sebelumnya, disederhanakan untuk ringkas) */}
            <div>
              <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">🥟 Item Pesanan</h4>
              <div className="space-y-2">
                {selectedOrder.items.map(item => (
                  <div key={item.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex justify-between">
                    <div>
                        <span className="font-bold text-gray-900">{item.menuName} <span className="text-gray-500">x{item.quantity}</span></span>
                        {item.notes && <div className="text-sm text-orange-700 bg-orange-50 px-2 py-1 rounded-md inline-block font-medium mt-1">📝 {item.notes}</div>}
                    </div>
                    <span className="font-bold text-gray-900">{formatCurrency(item.subtotal)}</span>
                  </div>
                ))}
              </div>
            </div>
            {selectedOrder.additionals && selectedOrder.additionals.length > 0 && (
              <div>
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">🍟 Additional</h4>
                <div className="space-y-2">
                  {selectedOrder.additionals.map(add => (
                    <div key={add.id} className="bg-yellow-50 p-3 rounded-xl border border-yellow-100 flex justify-between">
                      <span className="font-medium text-yellow-900">{add.name} x{add.quantity}</span>
                      <span className="font-bold text-yellow-900">{formatCurrency(add.subtotal)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Total */}
            <div className="pt-4 border-t border-gray-100">
               <div className="bg-gray-900 text-white p-5 rounded-2xl flex justify-between items-center mb-6">
                  <div><div className="text-gray-400 text-sm font-medium">Total Pembayaran</div><div className="text-3xl font-black">{formatCurrency(selectedOrder.totalPrice)}</div></div>
                  <div className="text-right"><div className="text-gray-400 text-sm font-medium">Total Item</div><div className="text-xl font-bold">{selectedOrder.totalPieces} pcs</div></div>
               </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}