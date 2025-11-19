'use client';

import { useStock } from '@/lib/hooks/useStock';
import { Package, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface StockItemProps {
  label: string;
  value: number;
  type: 'ayam' | 'jamur';
  readOnly: boolean;
  compact: boolean;
  onUpdate: (type: 'ayam' | 'jamur', val: number) => void;
}

// Komponen dipindah ke LUAR agar state tidak reset saat parent render
const StockItem = ({ label, value, type, readOnly, compact, onUpdate }: StockItemProps) => {
  const [localValue, setLocalValue] = useState(value.toString());
  const [isEditing, setIsEditing] = useState(false);

  // Sinkronisasi data DB -> Lokal (Hanya jika user TIDAK sedang mengetik)
  useEffect(() => {
    if (!isEditing) {
      setLocalValue(value.toString());
    }
  }, [value, isEditing]);

  const handleFocus = () => {
    setIsEditing(true);
    // Opsional: auto select text saat diklik biar gampang ganti
    // e.target.select(); 
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (localValue === '') {
      // Jika kosong, jangan update ke 0, tapi kembalikan ke nilai terakhir dari DB
      setLocalValue(value.toString());
    } else {
      const num = parseInt(localValue);
      if (!isNaN(num)) {
        onUpdate(type, num);
      } else {
        setLocalValue(value.toString());
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur(); // Trigger handleBlur untuk simpan
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Hanya terima angka
    if (val === '' || /^\d+$/.test(val)) {
      setLocalValue(val);
    }
  };

  return (
    <div className={`flex flex-col ${compact ? 'p-2' : 'p-4'} bg-white rounded-xl border transition-all ${value < 10 ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
      <div className="flex justify-between items-center mb-1">
        <span className={`font-bold text-gray-600 ${compact ? 'text-xs' : 'text-sm'}`}>{label}</span>
        {value < 10 && <AlertTriangle size={14} className="text-red-500 animate-bounce" />}
      </div>
      
      <div className="relative">
        {readOnly ? (
          <span className={`font-black block ${compact ? 'text-xl' : 'text-3xl'} ${value < 10 ? 'text-red-600' : 'text-gray-900'}`}>
            {value} <span className="text-sm font-normal text-gray-500">pcs</span>
          </span>
        ) : (
          <div className="flex items-center gap-2">
             <input
              type="text"
              inputMode="numeric"
              value={localValue}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              className={`w-full font-black bg-transparent outline-none border-b-2 border-dashed focus:border-solid focus:border-orange-500 transition-colors ${compact ? 'text-xl' : 'text-3xl'} ${value < 10 ? 'text-red-600 border-red-300' : 'text-gray-900 border-gray-300'}`}
            />
            <span className="text-sm font-medium text-gray-400 absolute right-0 bottom-1.5 pointer-events-none">pcs</span>
          </div>
        )}
      </div>
    </div>
  );
};

interface StockManagerProps {
  compact?: boolean;
  readOnly?: boolean;
}

export default function StockManager({ compact = false, readOnly = false }: StockManagerProps) {
  const { stock, updateStock, loading } = useStock();

  if (loading) return <div className="animate-pulse h-20 bg-gray-200/50 rounded-xl w-full"></div>;

  return (
    <div className={`w-full ${!compact ? 'bg-white p-5 rounded-2xl shadow-sm border border-gray-200' : ''}`}>
      {!compact && (
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Package className="text-orange-500" size={24} />
          {readOnly ? 'Status Stok Dapur' : 'Update Stok Dapur'}
        </h3>
      )}
      <div className={`grid ${compact ? 'grid-cols-2 gap-2' : 'grid-cols-1 sm:grid-cols-2 gap-4'}`}>
        <StockItem 
          label="🥟 Stok Ayam" 
          value={stock.ayam} 
          type="ayam" 
          readOnly={readOnly} 
          compact={compact} 
          onUpdate={updateStock} 
        />
        <StockItem 
          label="🍄 Stok Jamur" 
          value={stock.jamur} 
          type="jamur" 
          readOnly={readOnly} 
          compact={compact} 
          onUpdate={updateStock} 
        />
      </div>
      {!readOnly && !compact && (
        <p className="text-xs text-gray-400 mt-3 italic text-center">
          *Klik angka, ketik jumlah, lalu Enter untuk simpan.
        </p>
      )}
    </div>
  );
}