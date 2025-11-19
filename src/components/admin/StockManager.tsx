// src/components/admin/StockManager.tsx
'use client';

import { useStock } from '@/lib/hooks/useStock';
import { Plus, Minus, Package } from 'lucide-react';

export default function StockManager() {
  const { stock, updateStock, loading } = useStock();

  if (loading) return <div className="animate-pulse h-32 bg-gray-200 rounded-xl"></div>;

  const StockControl = ({ label, value, type }: { label: string, value: number, type: 'ayam' | 'jamur' }) => (
    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col gap-2">
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold text-gray-700">{label}</span>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${value < 10 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
          {value < 10 ? 'Stok Menipis!' : 'Aman'}
        </span>
      </div>
      
      <div className="flex items-center justify-between bg-white p-1 rounded-lg border border-gray-300">
        <button 
          onClick={() => updateStock(type, value - 1)}
          className="p-2 hover:bg-red-50 text-red-500 rounded-md transition-colors"
        >
          <Minus size={20} />
        </button>
        
        <span className="text-2xl font-black text-gray-800 min-w-[60px] text-center">
          {value}
        </span>
        
        <button 
          onClick={() => updateStock(type, value + 1)}
          className="p-2 hover:bg-green-50 text-green-500 rounded-md transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mt-1">
         <button onClick={() => updateStock(type, value + 10)} className="text-xs bg-gray-200 hover:bg-gray-300 py-1 rounded font-medium">+10</button>
         <button onClick={() => updateStock(type, value + 50)} className="text-xs bg-gray-200 hover:bg-gray-300 py-1 rounded font-medium">+50</button>
         <button onClick={() => updateStock(type, 0)} className="text-xs bg-red-100 hover:bg-red-200 text-red-600 py-1 rounded font-medium">Reset</button>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-100">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Package className="text-orange-500" /> Manajemen Stok
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StockControl label="🥟 Demen Ayam" value={stock.ayam} type="ayam" />
        <StockControl label="🍄 Demen Jamur" value={stock.jamur} type="jamur" />
      </div>
    </div>
  );
}