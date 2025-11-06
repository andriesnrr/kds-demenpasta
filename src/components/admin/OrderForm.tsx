'use client';

import { useState } from 'react';
import { Order, OrderItem, OrderType, AdditionalOrderItem } from '@/types/order';
import { MENU_DATA, ADDITIONAL_ITEMS } from '@/types/menu';
import { X, Plus, Minus } from 'lucide-react';
import { generateOrderNumber } from '@/lib/utils/orderHelpers';
import { formatCurrency } from '@/lib/utils/formatters';

interface OrderFormProps {
  onSubmit: (order: Omit<Order, 'id'>) => Promise<string | null | undefined>;
  onClose: () => void;
  editOrder?: Order | null; // ← NEW for editing
}

export default function OrderForm({ onSubmit, onClose, editOrder }: OrderFormProps) {
  const [customerName, setCustomerName] = useState(editOrder?.customerName || '');
  const [customerPhone, setCustomerPhone] = useState(editOrder?.customerPhone || '');
  const [orderType, setOrderType] = useState<OrderType>(editOrder?.orderType || 'takeaway'); // ← DEFAULT
  const [tableNumber, setTableNumber] = useState(editOrder?.tableNumber || '');
  const [cart, setCart] = useState<OrderItem[]>(editOrder?.items || []);
  const [additionals, setAdditionals] = useState<AdditionalOrderItem[]>(editOrder?.additionals || []);
  
  const [selectedMenu, setSelectedMenu] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const addToCart = () => {
    if (!selectedMenu) return;

    const menu = MENU_DATA.find(m => m.id === selectedMenu);
    if (!menu) return;

    const item: OrderItem = {
      id: `item_${Date.now()}`,
      menuId: menu.id,
      menuName: menu.name,
      packSize: menu.packSize,
      variant: menu.variant,
      quantity,
      price: menu.price,
      subtotal: menu.price * quantity,
      notes: notes || undefined,
    };

    setCart([...cart, item]);
    setSelectedMenu('');
    setQuantity(1);
    setNotes('');
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const updateAdditional = (additionalId: string, delta: number) => {
    const additional = ADDITIONAL_ITEMS.find(a => a.id === additionalId);
    if (!additional) return;

    const existing = additionals.find(a => a.id === additionalId);
    
    if (existing) {
      const newQuantity = existing.quantity + delta;
      if (newQuantity <= 0) {
        setAdditionals(additionals.filter(a => a.id !== additionalId));
      } else {
        setAdditionals(
          additionals.map(a =>
            a.id === additionalId
              ? { ...a, quantity: newQuantity, subtotal: additional.price * newQuantity }
              : a
          )
        );
      }
    } else if (delta > 0) {
      setAdditionals([
        ...additionals,
        {
          id: additionalId,
          name: additional.name,
          quantity: 1,
          price: additional.price,
          subtotal: additional.price,
        },
      ]);
    }
  };

  const getAdditionalQuantity = (additionalId: string) => {
    return additionals.find(a => a.id === additionalId)?.quantity || 0;
  };

  const handleSubmit = async () => {
    if (!customerName || cart.length === 0) {
      alert('Nama customer dan item pesanan harus diisi!');
      return;
    }

    if (orderType === 'dine-in' && !tableNumber) {
      alert('Nomor meja harus diisi untuk dine-in!');
      return;
    }

    try {
      setSubmitting(true);

      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      const totalPieces = cart.reduce(
        (sum, item) => sum + item.packSize * item.quantity,
        0
      );
      const itemsPrice = cart.reduce((sum, item) => sum + item.subtotal, 0);
      const additionalsPrice = additionals.reduce((sum, a) => sum + a.subtotal, 0);
      const totalPrice = itemsPrice + additionalsPrice;

      const order: Omit<Order, 'id'> = {
        orderNumber: editOrder?.orderNumber || generateOrderNumber(),
        status: editOrder?.status || 'pending',
        priority: 'normal',
        createdAt: editOrder?.createdAt || Date.now(),
        startedAt: editOrder?.startedAt || null,
        completedAt: editOrder?.completedAt || null,
        readyAt: editOrder?.readyAt || null,
        orderType,
        tableNumber: orderType === 'dine-in' ? tableNumber : undefined,
        customerName,
        customerPhone,
        items: cart,
        additionals: additionals.length > 0 ? additionals : undefined,
        totalItems,
        totalPieces,
        totalPrice,
      };

      await onSubmit(order);
      alert(editOrder ? 'Pesanan berhasil diupdate!' : 'Pesanan berhasil dibuat!');
      onClose();
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Gagal menyimpan pesanan. Coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-brand-black">
          {editOrder ? 'Edit Pesanan' : 'Form Pesanan Baru'}
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {/* Customer Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-semibold mb-2 text-brand-black">
            Nama Customer *
          </label>
          <input
            type="text"
            value={customerName}
            onChange={e => setCustomerName(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-brand-red outline-none"
            placeholder="Nama pelanggan"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-brand-black">
            Nomor HP *
          </label>
          <input
            type="tel"
            value={customerPhone}
            onChange={e => setCustomerPhone(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-brand-red outline-none"
            placeholder="081234567890"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-brand-black">
            Tipe Pesanan
          </label>
          <select
            value={orderType}
            onChange={e => setOrderType(e.target.value as OrderType)}
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-brand-red outline-none"
          >
            <option value="takeaway">Takeaway</option>
            <option value="dine-in">Dine In</option>
            <option value="delivery">Delivery</option>
          </select>
        </div>

        {orderType === 'dine-in' && (
          <div>
            <label className="block text-sm font-semibold mb-2 text-brand-black">
              Nomor Meja *
            </label>
            <input
              type="text"
              value={tableNumber}
              onChange={e => setTableNumber(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-brand-red outline-none"
              placeholder="Nomor meja"
            />
          </div>
        )}
      </div>

      {/* Add Items */}
      <div className="border-t pt-6">
        <h4 className="font-bold text-lg mb-4 text-brand-black">Tambah Menu</h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-2 text-brand-black">
              Pilih Menu
            </label>
            <select
              value={selectedMenu}
              onChange={e => setSelectedMenu(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-brand-red outline-none"
            >
              <option value="">-- Pilih Menu --</option>
              {MENU_DATA.map(menu => (
                <option key={menu.id} value={menu.id}>
                  {menu.name} - {formatCurrency(menu.price)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-brand-black">Jumlah</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="bg-gray-200 hover:bg-gray-300 w-10 h-10 rounded-lg font-bold transition-colors"
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={e =>
                  setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="w-16 border-2 border-gray-300 rounded-lg px-2 py-2 text-center font-bold"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="bg-gray-200 hover:bg-gray-300 w-10 h-10 rounded-lg font-bold transition-colors"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2 text-brand-black">
            Catatan (opsional)
          </label>
          <input
            type="text"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-brand-red outline-none"
            placeholder="Contoh: Pedas extra, Tidak pedas, dll"
          />
        </div>

        <button
          onClick={addToCart}
          disabled={!selectedMenu}
          className="bg-brand-red hover:bg-red-700 disabled:bg-gray-300 text-white font-bold py-2 px-6 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Tambah ke Keranjang
        </button>
      </div>

      {/* Additionals */}
      <div className="border-t pt-6 mt-6">
        <h4 className="font-bold text-lg mb-4 text-brand-black">Additional / Topping</h4>
        <div className="space-y-3">
          {ADDITIONAL_ITEMS.map(additional => {
            const qty = getAdditionalQuantity(additional.id);
            return (
              <div
                key={additional.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="font-semibold text-brand-black">{additional.name}</div>
                  <div className="text-sm text-gray-600">
                    {formatCurrency(additional.price)}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateAdditional(additional.id, -1)}
                    disabled={qty === 0}
                    className="w-8 h-8 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center font-bold">{qty}</span>
                  <button
                    onClick={() => updateAdditional(additional.id, 1)}
                    className="w-8 h-8 bg-brand-red hover:bg-red-700 text-white rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cart Summary */}
      {cart.length > 0 && (
        <div className="border-t pt-6 mt-6">
          <h4 className="font-bold text-lg mb-4 text-brand-black">Keranjang Pesanan</h4>
          
          {/* Items */}
          <div className="space-y-2 mb-4">
            {cart.map(item => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
              >
                <div className="flex-1">
                  <div className="font-semibold text-brand-black">
                    {item.menuName} x{item.quantity}
                  </div>
                  {item.notes && (
                    <div className="text-sm text-gray-600">📝 {item.notes}</div>
                  )}
                  <div className="text-sm text-gray-500">
                    {item.packSize * item.quantity} pcs
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-brand-red">
                    {formatCurrency(item.subtotal)}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Additionals Summary */}
          {additionals.length > 0 && (
            <div className="mb-4">
              <h5 className="font-semibold text-sm mb-2 text-brand-black">Additional:</h5>
              <div className="space-y-2">
                {additionals.map(add => (
                  <div
                    key={add.id}
                    className="flex justify-between text-sm bg-yellow-50 p-2 rounded"
                  >
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
          <div className="bg-red-50 p-4 rounded-lg mb-4 border-2 border-brand-red">
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-brand-black">Total Items:</span>
              <span className="font-bold text-brand-black">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-brand-black">Total Pieces:</span>
              <span className="font-bold text-brand-black">
                {cart.reduce(
                  (sum, item) => sum + item.packSize * item.quantity,
                  0
                )}{' '}
                pcs
              </span>
            </div>
            <div className="flex justify-between text-xl border-t-2 border-brand-red pt-2 mt-2">
              <span className="font-bold text-brand-black">Total Harga:</span>
              <span className="font-bold text-brand-red">
                {formatCurrency(
                  cart.reduce((sum, item) => sum + item.subtotal, 0) +
                    additionals.reduce((sum, a) => sum + a.subtotal, 0)
                )}
              </span>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!customerName || cart.length === 0 || submitting}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-bold py-4 rounded-lg transition-colors text-lg"
          >
            {submitting ? 'Memproses...' : editOrder ? '✅ Update Pesanan' : '✅ Kirim ke Dapur'}
          </button>
        </div>
      )}
    </div>
  );
}