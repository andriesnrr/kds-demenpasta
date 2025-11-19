'use client';

import { useEffect, useState } from 'react';
import { ref, onValue, update } from 'firebase/database';
import { database } from '@/lib/firebase';

export interface StockData {
  ayam: number;
  jamur: number;
}

export function useStock() {
  const [stock, setStock] = useState<StockData>({ ayam: 0, jamur: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stockRef = ref(database, 'stock');
    
    const unsubscribe = onValue(stockRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setStock({
          ayam: Number(data.ayam) || 0,
          jamur: Number(data.jamur) || 0
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateStock = async (type: 'ayam' | 'jamur', value: number) => {
    const newValue = Math.max(0, value);
    
    const stockRef = ref(database, 'stock');
    
    // Optimistic Update UI
    setStock(prev => ({ ...prev, [type]: newValue }));

    // Gunakan UPDATE agar lebih aman
    await update(stockRef, {
      [type]: newValue
    });
  };

  return { stock, loading, updateStock };
}