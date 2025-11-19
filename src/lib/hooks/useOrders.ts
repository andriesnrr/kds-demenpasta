'use client';

import { useEffect, useState } from 'react';
import { ref, onValue, push, set, update, remove, runTransaction, get } from 'firebase/database';
import { database } from '@/lib/firebase';
import { Order, OrderStatus, OrderItem } from '@/types/order';
import { MENU_DATA } from '@/types/menu';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ordersRef = ref(database, 'orders');
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      try {
        const data = snapshot.val() as Record<string, Order> | null;
        if (data) {
          const ordersArray = Object.entries(data).map(([key, value]) => ({ ...value, id: key }));
          ordersArray.sort((a, b) => b.createdAt - a.createdAt);
          setOrders(ordersArray);
        } else {
          setOrders([]);
        }
        setLoading(false);
      } catch (err) {
        console.error(err); setError('Failed to load orders'); setLoading(false);
      }
    }, (err) => { console.error(err); setError(err.message); setLoading(false); });
    return () => unsubscribe();
  }, []);

  // --- HELPER: Hitung total bahan dari list items ---
  const calculateUsage = (items: OrderItem[]) => {
    let ayam = 0;
    let jamur = 0;
    items.forEach(item => {
      const menu = MENU_DATA.find(m => m.id === item.menuId);
      if (menu) {
        ayam += menu.composition.ayam * item.quantity;
        jamur += menu.composition.jamur * item.quantity;
      }
    });
    return { ayam, jamur };
  };

  // --- CREATE ORDER ---
  const addOrder = async (order: Omit<Order, 'id'>) => {
    try {
      // 1. Simpan Order
      const cleanOrder: any = { ...order };
      if (!cleanOrder.tableNumber) delete cleanOrder.tableNumber;
      if (!cleanOrder.additionals?.length) delete cleanOrder.additionals;
      cleanOrder.items = cleanOrder.items.map((item: any) => {
        const c = { ...item }; if (!c.notes) delete c.notes; return c;
      });

      const newOrderRef = push(ref(database, 'orders'));
      await set(newOrderRef, cleanOrder);

      // 2. Kurangi Stok
      const usage = calculateUsage(order.items);
      if (usage.ayam > 0 || usage.jamur > 0) {
        await runTransaction(ref(database, 'stock'), (current) => {
          const s = current || { ayam: 0, jamur: 0 };
          s.ayam = Math.max(0, (s.ayam || 0) - usage.ayam);
          s.jamur = Math.max(0, (s.jamur || 0) - usage.jamur);
          return s;
        });
      }
      return newOrderRef.key;
    } catch (err) { console.error(err); throw err; }
  };

  // --- UPDATE ORDER (Smart Stock Adjustment) ---
  const updateOrder = async (orderId: string, newOrderData: Omit<Order, 'id'>) => {
    try {
      // 1. Ambil data order LAMA dari database untuk tahu usage sebelumnya
      const oldOrderSnap = await get(ref(database, `orders/${orderId}`));
      const oldOrder = oldOrderSnap.val() as Order;

      if (!oldOrder) throw new Error("Order not found");

      const oldUsage = calculateUsage(oldOrder.items);
      const newUsage = calculateUsage(newOrderData.items);

      // Hitung selisih (Baru - Lama)
      // Jika positif artinya butuh stok lagi (kurangi stok DB). 
      // Jika negatif artinya stok dikembalikan (tambah stok DB).
      const diffAyam = newUsage.ayam - oldUsage.ayam;
      const diffJamur = newUsage.jamur - oldUsage.jamur;

      // 2. Update data order
      const cleanOrder: any = { ...newOrderData };
      if (!cleanOrder.tableNumber) delete cleanOrder.tableNumber;
      if (!cleanOrder.additionals?.length) delete cleanOrder.additionals;
      cleanOrder.items = cleanOrder.items.map((item: any) => {
        const c = { ...item }; if (!c.notes) delete c.notes; return c;
      });
      await set(ref(database, `orders/${orderId}`), cleanOrder);

      // 3. Update Stok berdasarkan selisih
      if (diffAyam !== 0 || diffJamur !== 0) {
        await runTransaction(ref(database, 'stock'), (current) => {
          const s = current || { ayam: 0, jamur: 0 };
          // Ingat: diff positif = pemakaian bertambah = stok berkurang
          s.ayam = Math.max(0, (s.ayam || 0) - diffAyam);
          s.jamur = Math.max(0, (s.jamur || 0) - diffJamur);
          return s;
        });
      }
    } catch (err) { console.error(err); throw err; }
  };

  // --- DELETE ORDER (Restore Stock) ---
  const deleteOrder = async (orderId: string) => {
    try {
      // 1. Ambil data order sebelum dihapus
      const oldOrderSnap = await get(ref(database, `orders/${orderId}`));
      const oldOrder = oldOrderSnap.val() as Order;

      if (oldOrder) {
        const usage = calculateUsage(oldOrder.items);
        
        // 2. Kembalikan stok (Restore)
        if (usage.ayam > 0 || usage.jamur > 0) {
          await runTransaction(ref(database, 'stock'), (current) => {
            const s = current || { ayam: 0, jamur: 0 };
            s.ayam = (s.ayam || 0) + usage.ayam;
            s.jamur = (s.jamur || 0) + usage.jamur;
            return s;
          });
        }
      }

      // 3. Hapus Order
      await remove(ref(database, `orders/${orderId}`));
    } catch (err) { console.error(err); throw err; }
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
      // ... (Sama seperti sebelumnya)
      const orderRef = ref(database, `orders/${orderId}`);
      const updates: any = { status: newStatus };
      if (newStatus === 'preparing') updates.startedAt = Date.now();
      else if (newStatus === 'ready') updates.readyAt = Date.now();
      else if (newStatus === 'completed') updates.completedAt = Date.now();
      await update(orderRef, updates);
  };

  return { orders, loading, error, addOrder, updateOrder, updateOrderStatus, deleteOrder };
}