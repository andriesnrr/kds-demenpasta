'use client';

import React, { useState, useEffect } from 'react';
import { useOrders } from '@/lib/hooks/useOrders';
import { useSound } from '@/lib/hooks/useSound';
import OrderGrid from '@/components/kitchen/OrderGrid';
import StationFilter from '@/components/kitchen/StationFilter';
import StockManager from '@/components/stock/StockManager';
import { Order } from '@/types/order';
import Link from 'next/link';
import { ArrowLeft, Clock, ChefHat } from 'lucide-react';

export default function KitchenDisplay() {
  const [selectedStation, setSelectedStation] = useState('all');
  const { orders, loading, updateOrderStatus } = useOrders();
  const { playNewOrder, playOrderReady } = useSound();
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [previousOrderCount, setPreviousOrderCount] = useState(0);

  useEffect(() => {
    setCurrentTime(new Date());
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredOrders = selectedStation === 'all' 
    ? orders 
    : orders.filter(o => o.status !== 'completed');

  useEffect(() => {
    if (orders.length > previousOrderCount) {
      const pendingOrders = orders.filter(o => o.status === 'pending');
      if (pendingOrders.length > 0) playNewOrder();
    }
    setPreviousOrderCount(orders.length);
  }, [orders.length, previousOrderCount, playNewOrder, orders]);

  const handleStatusUpdate = async (orderId: string, status: Order['status']) => {
    await updateOrderStatus(orderId, status);
    if (status === 'ready') playOrderReady();
  };

  const stats = {
    pending: filteredOrders.filter(o => o.status === 'pending').length,
    preparing: filteredOrders.filter(o => o.status === 'preparing').length,
    ready: filteredOrders.filter(o => o.status === 'ready').length,
    total: filteredOrders.length
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center animate-pulse">
          <ChefHat size={64} className="text-gray-300 mx-auto mb-4" />
          <p className="text-xl text-gray-600 font-semibold">Memuat Kitchen Display...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30 border-b border-gray-200 px-4 md:px-6 py-3">
        <div className="flex flex-col xl:flex-row justify-between items-center gap-4">
          
          {/* Kiri: Title & Jam */}
          <div className="flex items-center justify-between w-full xl:w-auto">
            <div className="flex items-center gap-4">
              <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ArrowLeft size={24} className="text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  <ChefHat className="text-orange-500" /> Kitchen
                </h1>
                {currentTime && (
                  <div className="flex items-center gap-1.5 text-gray-500 text-sm font-medium mt-0.5">
                     <Clock size={14} />
                     <span className="font-mono">
                      {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Quick Stats (Mobile only) */}
            <div className="xl:hidden flex gap-2">
               <div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-lg font-bold text-sm">
                 {stats.pending}
               </div>
            </div>
          </div>

          {/* Kanan: Stock Manager & Stats (Desktop) */}
          <div className="flex flex-col md:flex-row items-center gap-4 w-full xl:w-auto">
            
            {/* --- STOCK MONITOR (Desktop Mode - EDITABLE) --- */}
            <div className="hidden md:block min-w-[300px]">
               <StockManager compact={true} readOnly={false} />
            </div>

            <div className="hidden md:block w-px h-8 bg-gray-200"></div>

            {/* Stats Pills (Desktop) */}
            <div className="hidden md:flex gap-2">
              <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-700 rounded-xl border border-yellow-200">
                <span className="text-xs font-bold uppercase tracking-wider">Pending</span>
                <span className="text-xl font-black leading-none">{stats.pending}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl border border-blue-200">
                <span className="text-xs font-bold uppercase tracking-wider">Cook</span>
                <span className="text-xl font-black leading-none">{stats.preparing}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-xl border border-green-200">
                <span className="text-xs font-bold uppercase tracking-wider">Ready</span>
                <span className="text-xl font-black leading-none">{stats.ready}</span>
              </div>
            </div>
          </div>

        </div>
      </header>

      <main className="flex-1 p-4 md:p-6 overflow-hidden flex flex-col">
        {/* --- STOCK MONITOR (Mobile Mode - EDITABLE) --- */}
        <div className="md:hidden mb-4">
           <StockManager compact={false} readOnly={false} />
        </div>

        <div className="hidden mb-4">
          <StationFilter selectedStation={selectedStation} onStationChange={setSelectedStation} />
        </div>

        <div className="flex-1 overflow-y-auto">
           <OrderGrid orders={filteredOrders} onUpdateStatus={handleStatusUpdate} />
        </div>
      </main>
    </div>
  );
}