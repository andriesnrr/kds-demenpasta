// src/app/stats/page.tsx
'use client';

import { useOrders } from '@/lib/hooks/useOrders';
import StatsPanel from '@/components/stats/StatsPanel';
import { BarChart3, ArrowLeft, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function StatsPage() {
  const { orders, loading, error } = useOrders();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-50">
        <div className="text-center animate-pulse">
          <BarChart3 size={48} className="text-purple-300 mx-auto mb-4" />
          <p className="text-purple-700 font-semibold text-lg">Menganalisis Data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
          <p className="text-red-600 mb-4 font-semibold">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold transition-colors"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/admin"
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft size={24} className="text-gray-600" />
              </Link>
              <div className="bg-purple-100 p-2 rounded-xl">
                <BarChart3 size={24} className="text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">Laporan Statistik</h1>
                <p className="text-sm text-gray-500 font-medium">Analisis performa penjualan</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 text-gray-500 bg-gray-100 px-4 py-2 rounded-xl font-medium">
              <Calendar size={18} />
              {new Date().toLocaleDateString('id-ID', { 
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <StatsPanel orders={orders} />
      </main>
    </div>
  );
}