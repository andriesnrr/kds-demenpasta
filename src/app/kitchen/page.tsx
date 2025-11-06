// src/app/kitchen/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useOrders } from '@/lib/hooks/useOrders';
import { useSound } from '@/lib/hooks/useSound';
import OrderGrid from '@/components/kitchen/OrderGrid';
import StationFilter from '@/components/kitchen/StationFilter';
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

  // ... (getOrderCounts function if needed later)

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
    <div className="min-h-screen bg-gray-100">
      {/* Styled Header */}
      <header className="bg-white shadow-sm sticky top-0 z-20 border-b border-gray-200">
        <div className="max-w-[1920px] mx-auto px-4 md:px-6 py-3">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <Link
                href="/admin"
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft size={24} className="text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  <ChefHat className="text-orange-500" /> Kitchen Display
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

            {/* Quick Stats */}
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
              <div className="flex items-center gap-3 px-4 py-2 bg-yellow-50 text-yellow-700 rounded-xl border border-yellow-200">
                <span className="text-xs font-bold uppercase tracking-wider">Pending</span>
                <span className="text-2xl font-black leading-none">{stats.pending}</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl border border-blue-200">
                <span className="text-xs font-bold uppercase tracking-wider">Cook</span>
                <span className="text-2xl font-black leading-none">{stats.preparing}</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 bg-green-50 text-green-700 rounded-xl border border-green-200">
                <span className="text-xs font-bold uppercase tracking-wider">Ready</span>
                <span className="text-2xl font-black leading-none">{stats.ready}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1920px] mx-auto px-4 md:px-6 py-6 h-[calc(100vh-80px)]">
        {/* Hidden Station Filter for now, can be enabled if needed */}
        <div className="hidden mb-4">
          <StationFilter selectedStation={selectedStation} onStationChange={setSelectedStation} />
        </div>
        <OrderGrid orders={filteredOrders} onUpdateStatus={handleStatusUpdate} />
      </main>
    </div>
  );
}