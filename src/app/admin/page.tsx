// src/app/admin/page.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { useOrders } from '@/lib/hooks/useOrders';
import AdminPanel from '@/components/admin/AdminPanel';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils/formatters';
import { LayoutDashboard, ArrowLeft, UtensilsCrossed, BarChart3, Monitor } from 'lucide-react';
import Image from 'next/image';

export default function AdminDashboard() {
  const { orders, loading, error, addOrder, updateOrder, updateOrderStatus, deleteOrder } = useOrders();
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<'today' | 'all'>('today');

  // Helper untuk cek apakah tanggal adalah hari ini
  const isToday = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Data untuk STATS (selalu hari ini agar relevan)
  const todayOrders = useMemo(() => orders.filter(o => isToday(o.createdAt)), [orders]);
  
  // Data untuk TABEL (tergantung filter yang dipilih)
  const displayedOrders = useMemo(() => {
    return filter === 'today' ? todayOrders : orders;
  }, [orders, todayOrders, filter]);

  const stats = {
    today: todayOrders.length,
    revenue: todayOrders
      .filter(o => o.status === 'completed')
      .reduce((sum, o) => sum + o.totalPrice, 0),
    avgTime: todayOrders.length > 0
      ? Math.floor(
          todayOrders
            .filter(o => o.startedAt && o.completedAt)
            .reduce((sum, o) => {
              const time = ((o.completedAt || 0) - (o.startedAt || 0)) / 60000;
              return sum + time;
            }, 0) / todayOrders.filter(o => o.startedAt && o.completedAt).length || 0
        )
      : 0,
    pending: todayOrders.filter(o => o.status === 'pending').length
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <div className="text-center animate-pulse">
           <div className="relative w-20 h-20 mx-auto mb-4">
             <Image src="/images/logo-demen-pasta.jpg" alt="Loading..." fill className="object-contain rounded-full" />
          </div>
          <p className="text-xl text-gray-600 font-semibold">Memuat Dashboard...</p>
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
            Coba Lagi
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
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
               <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-orange-100">
                <Image
                   src="/images/logo-demen-pasta.jpg"
                   alt="Logo"
                   fill
                   className="object-cover"
                />
              </div>
              <div>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">Admin Dashboard</h1>
                <Link
                  href="/"
                  className="text-sm text-gray-500 hover:text-orange-600 flex items-center gap-1 transition-colors font-medium"
                >
                  <ArrowLeft size={16} /> Kembali ke Beranda
                </Link>
              </div>
            </div>
            
            <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
              <Link
                href="/kitchen"
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl font-bold transition-colors whitespace-nowrap"
              >
                <UtensilsCrossed size={18} />
                Kitchen
              </Link>
              <Link
                href="/stats"
                className="flex items-center gap-2 px-5 py-2.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-xl font-bold transition-colors whitespace-nowrap"
              >
                <BarChart3 size={18} />
                Stats
              </Link>
              <Link
                href="/display"
                className="flex items-center gap-2 px-5 py-2.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-xl font-bold transition-colors whitespace-nowrap"
              >
                <Monitor size={18} />
                Display
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-200 transform hover:scale-[1.02] transition-all">
            <div className="text-blue-100 text-sm font-semibold mb-1">Pesanan Hari Ini</div>
            <div className="text-4xl font-black">{stats.today}</div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg shadow-green-200 transform hover:scale-[1.02] transition-all">
            <div className="text-green-100 text-sm font-semibold mb-1">Pendapatan Hari Ini</div>
            <div className="text-3xl font-black truncate">
              {formatCurrency(stats.revenue)}
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl p-6 text-white shadow-lg shadow-purple-200 transform hover:scale-[1.02] transition-all">
            <div className="text-purple-100 text-sm font-semibold mb-1">Rata-rata Waktu</div>
            <div className="text-3xl font-black">{stats.avgTime} <span className="text-xl">min</span></div>
          </div>
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 text-white shadow-lg shadow-orange-200 transform hover:scale-[1.02] transition-all">
            <div className="text-yellow-100 text-sm font-semibold mb-1">Menunggu</div>
            <div className="text-4xl font-black">{stats.pending}</div>
          </div>
        </div>

        {/* Admin Panel Container */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 relative">
          <AdminPanel
            orders={displayedOrders}
            onAddOrder={addOrder}
            onUpdateOrder={updateOrder}
            onDeleteOrder={deleteOrder}
            showForm={showForm}
            setShowForm={setShowForm}
            onUpdateStatus={updateOrderStatus}
            filter={filter}         // <-- Meneruskan state filter
            setFilter={setFilter}   // <-- Meneruskan setter filter
          />
        </div>
      </main>
    </div>
  );
}