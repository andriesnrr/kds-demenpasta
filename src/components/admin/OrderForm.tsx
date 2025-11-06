'use client';

import { useState, useEffect } from 'react';
import { Order, OrderItem, OrderType, AdditionalOrderItem } from '@/types/order';
import { MENU_DATA, ADDITIONAL_ITEMS } from '@/types/menu';
import { X, Plus, Minus, ShoppingCart, User, Phone, UtensilsCrossed, Trash2 } from 'lucide-react';
import { generateOrderNumber } from '@/lib/utils/orderHelpers';
import { formatCurrency } from '@/lib/utils/formatters';

interface OrderFormProps {
  onSubmit: (order: Omit<Order, 'id'>) => Promise<string | null | undefined>;
  onClose: () => void;
  editOrder?: Order | null;
}

export default function OrderForm({ onSubmit, onClose, editOrder }: OrderFormProps) {
  // --- STATE ---
  const [customerName, setCustomerName] = useState(editOrder?.customerName || '');
  const [customerPhone, setCustomerPhone] = useState(editOrder?.customerPhone || '');
  const [orderType, setOrderType] = useState<OrderType>(editOrder?.orderType || 'takeaway');
  const [tableNumber, setTableNumber] = useState(editOrder?.tableNumber || '');
  const [cart, setCart] = useState<OrderItem[]>(editOrder?.items || []);
  const [additionals, setAdditionals] = useState<AdditionalOrderItem[]>(editOrder?.additionals || []);
  
  const [selectedMenu, setSelectedMenu] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // --- HANDLERS ---
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
        setAdditionals(additionals.map(a => a.id === additionalId ? { ...a, quantity: newQuantity, subtotal: additional.price * newQuantity } : a));
      }
    } else if (delta > 0) {
      setAdditionals([...additionals, { id: additionalId, name: additional.name, quantity: 1, price: additional.price, subtotal: additional.price }]);
    }
  };

  const getAdditionalQuantity = (additionalId: string) => {
    return additionals.find(a => a.id === additionalId)?.quantity || 0;
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + item.subtotal, 0) + additionals.reduce((sum, a) => sum + a.subtotal, 0);
  };

  const getTotalPieces = () => {
    return cart.reduce((sum, item) => sum + item.packSize * item.quantity, 0);
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
        totalItems: cart.reduce((sum, item) => sum + item.quantity, 0),
        totalPieces: getTotalPieces(),
        totalPrice: getTotalPrice(),
      };

      await onSubmit(order);
      alert(editOrder ? 'Pesanan berhasil diupdate!' : 'Pesanan berhasil dibuat!');
      onClose();
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Gagal menyimpan pesanan.');
    } finally {
      setSubmitting(false);
    }
  };

  // Disable background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  // --- RENDER ---
  return (
    <div className="bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 rounded-3xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-white p-6 border-b-2 border-orange-100 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-orange-500 to-red-500 p-3 rounded-xl shadow-md">
            <UtensilsCrossed size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900">
              {editOrder ? `Edit Pesanan ${editOrder.orderNumber}` : 'Form Pesanan Baru'}
            </h1>
            <p className="text-gray-500 text-sm font-medium">Isi detail pesanan pelanggan</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors"
        >
          <X size={24} className="text-gray-600" />
        </button>
      </div>

      <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Left Column - Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info Card */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border-2 border-blue-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-100 p-2.5 rounded-xl">
                <User size={22} className="text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Informasi Customer</h2>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Nama Customer *</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-medium"
                  placeholder="Masukkan nama customer"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Nomor HP</label>
                <div className="relative">
                  <Phone size={20} className="absolute left-4 top-3.5 text-gray-400" />
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl pl-12 pr-4 py-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-medium"
                    placeholder="08xxxxxxxxxx"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Tipe Pesanan</label>
                  <select
                    value={orderType}
                    onChange={(e) => setOrderType(e.target.value as OrderType)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-bold text-gray-800"
                  >
                    <option value="takeaway">📦 Takeaway</option>
                    <option value="dine-in">🍽️ Dine In</option>
                    <option value="delivery">🛵 Delivery</option>
                  </select>
                </div>

                {orderType === 'dine-in' && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Nomor Meja *</label>
                    <input
                      type="text"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-bold text-center"
                      placeholder="Contoh: 5"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Add Menu Card */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border-2 border-orange-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-orange-100 p-2.5 rounded-xl">
                <ShoppingCart size={22} className="text-orange-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Tambah Menu</h2>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Pilih Menu</label>
                <select
                  value={selectedMenu}
                  onChange={(e) => setSelectedMenu(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-orange-500 focus:ring-4 focus:ring-orange-50 outline-none transition-all font-bold text-gray-800"
                >
                  <option value="">-- Pilih Menu Dimsum --</option>
                  {MENU_DATA.map(menu => (
                    <option key={menu.id} value={menu.id}>
                      {menu.name} ({formatCurrency(menu.price)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col md:flex-row gap-5">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Jumlah</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="bg-gray-100 hover:bg-gray-200 w-12 h-12 rounded-xl font-bold transition-colors flex items-center justify-center"
                    >
                      <Minus size={20} />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-20 border-2 border-gray-200 rounded-xl px-2 py-3 text-center font-black text-xl focus:border-orange-500 outline-none"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="bg-orange-500 hover:bg-orange-600 text-white w-12 h-12 rounded-xl font-bold transition-colors flex items-center justify-center shadow-md"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>

                <div className="flex-[2]">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Catatan (opsional)</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-orange-500 focus:ring-4 focus:ring-orange-50 outline-none transition-all"
                    placeholder="Contoh: Pedas banget, Jangan pakai saos"
                  />
                </div>
              </div>

              <button
                onClick={addToCart}
                disabled={!selectedMenu}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg disabled:shadow-none flex items-center justify-center gap-2 text-lg"
              >
                <Plus size={24} />
                Tambah ke Keranjang
              </button>
            </div>
          </div>

          {/* Additional Items Card */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border-2 border-yellow-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>🍟</span> Additional / Topping
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ADDITIONAL_ITEMS.map(additional => {
                const qty = getAdditionalQuantity(additional.id);
                return (
                  <div
                    key={additional.id}
                    className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                      qty > 0 ? 'bg-yellow-50 border-yellow-300' : 'bg-white border-gray-200 hover:border-yellow-200'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-gray-800">{additional.name}</div>
                      <div className="text-sm font-semibold text-orange-600">{formatCurrency(additional.price)}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {qty > 0 && (
                        <button
                          onClick={() => updateAdditional(additional.id, -1)}
                          className="w-8 h-8 bg-white border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                        >
                          <Minus size={14} />
                        </button>
                      )}
                      {qty > 0 ? (
                        <span className="w-6 text-center font-black">{qty}</span>
                      ) : (
                        <button
                           onClick={() => updateAdditional(additional.id, 1)}
                           className="w-8 h-8 bg-gray-100 hover:bg-orange-500 hover:text-white rounded-lg flex items-center justify-center transition-colors"
                        >
                          <Plus size={18} />
                        </button>
                      )}
                      {qty > 0 && (
                        <button
                          onClick={() => updateAdditional(additional.id, 1)}
                          className="w-8 h-8 bg-orange-500 text-white rounded-lg flex items-center justify-center hover:bg-orange-600"
                        >
                          <Plus size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column - Cart Summary (Sticky) */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-xl border-2 border-purple-100 sticky top-24 flex flex-col max-h-[calc(100vh-8rem)]">
            <div className="p-5 border-b-2 border-purple-100 bg-purple-50/50">
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <ShoppingCart size={24} className="text-purple-600" />
                Ringkasan Pesanan
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 && additionals.length === 0 ? (
                <div className="text-center py-10 text-gray-400 flex flex-col items-center">
                  <ShoppingCart size={64} className="opacity-20 mb-4" />
                  <p className="font-medium">Keranjang masih kosong</p>
                  <p className="text-sm">Tambahkan menu dari form di samping</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {cart.map(item => (
                      <div key={item.id} className="bg-white border-2 border-purple-100 rounded-xl p-3 shadow-sm relative group">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-bold text-gray-900">🥟 {item.menuName}</div>
                            <div className="text-sm text-gray-500 font-medium mt-0.5">
                              {item.quantity} x {formatCurrency(item.price)}
                            </div>
                            {item.notes && (
                              <div className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-md mt-2 inline-block font-medium">
                                📝 {item.notes}
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="font-black text-purple-600">{formatCurrency(item.subtotal)}</div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-400 hover:text-red-600 p-1.5 mt-1 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full shadow-sm border border-gray-100"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {additionals.length > 0 && (
                    <div className="bg-yellow-50/80 border-2 border-yellow-100 rounded-xl p-3 space-y-2">
                      <div className="text-xs font-bold text-yellow-800 uppercase tracking-wider mb-1">Additional</div>
                      {additionals.map(add => (
                        <div key={add.id} className="flex justify-between text-sm">
                          <span className="font-medium text-gray-700">+ {add.name} x{add.quantity}</span>
                          <span className="font-bold text-yellow-700">{formatCurrency(add.subtotal)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="p-5 bg-white border-t-2 border-purple-100">
              <div className="bg-gray-900 text-white rounded-xl p-4 mb-4 shadow-lg">
                <div className="flex justify-between mb-1 text-white/80 text-sm">
                   <span>Total Item:</span>
                   <span className="font-bold">{cart.reduce((sum, i) => sum + i.quantity, 0)}</span>
                </div>
                 <div className="flex justify-between mb-3 text-white/80 text-sm">
                   <span>Total Pieces:</span>
                   <span className="font-bold">{getTotalPieces()} pcs</span>
                </div>
                <div className="flex justify-between text-2xl border-t border-white/20 pt-3">
                  <span className="font-bold">TOTAL</span>
                  <span className="font-black text-green-400">{formatCurrency(getTotalPrice())}</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!customerName || cart.length === 0 || submitting}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl disabled:shadow-none text-lg flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>Processing...</>
                ) : editOrder ? (
                  <>✅ Update Pesanan</>
                ) : (
                  <>🚀 Kirim ke Dapur</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}