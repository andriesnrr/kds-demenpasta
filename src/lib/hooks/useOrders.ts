'use client';

import { useEffect, useState } from 'react';
import { ref, onValue, push, set, update, remove } from 'firebase/database';
import { database } from '@/lib/firebase';
import { Order, OrderStatus } from '@/types/order';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ordersRef = ref(database, 'orders');
    
    const unsubscribe = onValue(
      ordersRef,
      (snapshot) => {
        try {
          const data = snapshot.val();
          if (data) {
            const ordersArray = Object.entries(data).map(([key, value]) => ({
              ...(value as Order),
              id: key,
            }));
            ordersArray.sort((a, b) => b.createdAt - a.createdAt);
            setOrders(ordersArray);
          } else {
            setOrders([]);
          }
          setLoading(false);
        } catch (err) {
          console.error('Error parsing orders:', err);
          setError('Failed to load orders');
          setLoading(false);
        }
      },
      (err) => {
        console.error('Firebase error:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addOrder = async (order: Omit<Order, 'id'>) => {
    try {
      const cleanOrder = { ...order };
      
      if (cleanOrder.tableNumber === undefined) {
        delete (cleanOrder as any).tableNumber;
      }
      
      if (cleanOrder.additionals === undefined || cleanOrder.additionals?.length === 0) {
        delete (cleanOrder as any).additionals;
      }
      
      cleanOrder.items = cleanOrder.items.map(item => {
        const cleanItem = { ...item };
        if (cleanItem.notes === undefined) {
          delete (cleanItem as any).notes;
        }
        return cleanItem;
      });

      const ordersRef = ref(database, 'orders');
      const newOrderRef = push(ordersRef);
      await set(newOrderRef, cleanOrder);
      return newOrderRef.key;
    } catch (err) {
      console.error('Error adding order:', err);
      throw err;
    }
  };

  // ← NEW: Update entire order
  const updateOrder = async (orderId: string, order: Omit<Order, 'id'>) => {
    try {
      const cleanOrder = { ...order };
      
      if (cleanOrder.tableNumber === undefined) {
        delete (cleanOrder as any).tableNumber;
      }
      
      if (cleanOrder.additionals === undefined || cleanOrder.additionals?.length === 0) {
        delete (cleanOrder as any).additionals;
      }
      
      cleanOrder.items = cleanOrder.items.map(item => {
        const cleanItem = { ...item };
        if (cleanItem.notes === undefined) {
          delete (cleanItem as any).notes;
        }
        return cleanItem;
      });

      const orderRef = ref(database, `orders/${orderId}`);
      await set(orderRef, cleanOrder);
    } catch (err) {
      console.error('Error updating order:', err);
      throw err;
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const orderRef = ref(database, `orders/${orderId}`);
      const updates: any = { status: newStatus };
      
      if (newStatus === 'preparing') {
        updates.startedAt = Date.now();
      } else if (newStatus === 'ready') {
        updates.readyAt = Date.now();
      } else if (newStatus === 'completed') {
        updates.completedAt = Date.now();
      }
      
      await update(orderRef, updates);
    } catch (err) {
      console.error('Error updating order:', err);
      throw err;
    }
  };

  const deleteOrder = async (orderId: string) => {
    try {
      const orderRef = ref(database, `orders/${orderId}`);
      await remove(orderRef);
    } catch (err) {
      console.error('Error deleting order:', err);
      throw err;
    }
  };

  return { 
    orders, 
    loading, 
    error, 
    addOrder,
    updateOrder, // ← NEW
    updateOrderStatus,
    deleteOrder 
  };
}