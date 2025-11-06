'use client';

import React, { useState, useEffect } from 'react';
import { useOrders } from '@/lib/hooks/useOrders';
import { useSound } from '@/lib/hooks/useSound';
import OrderGrid from '@/components/kitchen/OrderGrid';
import StationFilter from '@/components/kitchen/StationFilter';
import { Order } from '@/types/order';
import Link from 'next/link';
import { ArrowLeft, Clock } from 'lucide-react';

export default function KitchenDisplay() {
  const [selectedStation, setSelectedStation] = useState('all');
  const { orders, loading, updateOrderStatus } = useOrders();
  const { playNewOrder, playOrderReady } = useSound();
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [previousOrderCount, setPreviousOrderCount] = useState(0);

  // Initialize time on client only
  useEffect(() => {
    setCurrentTime(new Date());
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter orders by station
  const filteredOrders = selectedStation === 'all' 
    ? orders 
    : orders.filter(o => o.status !== 'completed');

  // Play sound when new order arrives
  useEffect(() => {
    if (orders.length > previousOrderCount) {
      const pendingOrders = orders.filter(o => o.status === 'pending');
      if (pendingOrders.length > 0) {
        playNewOrder();
      }
    }
    setPreviousOrderCount(orders.length);
  }, [orders.length, previousOrderCount, playNewOrder, orders]);

  const handleStatusUpdate = async (orderId: string, status: Order['status']) => {
    await updateOrderStatus(orderId, status);
    if (status === 'ready') {
      playOrderReady();
    }
  };

  const getOrderCounts = () => {
    const counts: Record<string, number> = {
      all: orders.filter(o => o.status !== 'completed').length,
      grill: 0, fryer: 0, salad: 0, dessert: 0, drinks: 0
    };
    orders.forEach(order => {
      if (order.status !== 'completed') { counts.all++; }
    });
    return counts;
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
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 font-semibold">Memuat Kitchen Display...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100/50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-20 border-b border-gray-200">
        <div className="max-w-full px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <div className="flex items-center gap-4">
                <Link
                  href="/"
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title="Back to Dashboard"
                >
                  <ArrowLeft size={24} className="text-gray-600" />
                </Link>
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                  Kitchen Display System
                </h1>
              </div>
              {currentTime && (
                <div className="flex items-center gap-2 text-gray-500 mt-1 ml-14">
                   <Clock size={16} />
                   <p className="text-sm font-medium font-mono">
                    {currentTime.toLocaleTimeString('id-ID', { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </p>
                </div>
              )}
            </div>

            {/* Stats Pills */}
            <div className="flex gap-3 bg-gray-50 p-2 rounded-xl overflow-x-auto md:overflow-visible w-full md:w-auto">
              <div className="flex-1 md:flex-none text-center min-w-[80px] bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg">
                <div className="text-2xl font-black leading-none">{stats.pending}</div>
                <div className="text-[10px] uppercase font-bold tracking-wider opacity-70">Pending</div>
              </div>
              <div className="flex-1 md:flex-none text-center min-w-[80px] bg-blue-100 text-blue-800 px-4 py-2 rounded-lg">
                <div className="text-2xl font-black leading-none">{stats.preparing}</div>
                <div className="text-[10px] uppercase font-bold tracking-wider opacity-70">Cook</div>
              </div>
              <div className="flex-1 md:flex-none text-center min-w-[80px] bg-green-100 text-green-800 px-4 py-2 rounded-lg">
                <div className="text-2xl font-black leading-none">{stats.ready}</div>
                <div className="text-[10px] uppercase font-bold tracking-wider opacity-70">Ready</div>
              </div>
              <div className="flex-1 md:flex-none text-center min-w-[80px] bg-gray-800 text-white px-4 py-2 rounded-lg">
                <div className="text-2xl font-black leading-none">{stats.total}</div>
                <div className="text-[10px] uppercase font-bold tracking-wider opacity-70">Total</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1920px] mx-auto px-4 md:px-6 py-6">
        <div className="mb-6 hidden">
          <StationFilter
            selectedStation={selectedStation}
            onStationChange={setSelectedStation}
            orderCounts={getOrderCounts()}
          />
        </div>

        <OrderGrid
          orders={filteredOrders}
          onUpdateStatus={handleStatusUpdate}
        />
      </main>
    </div>
  );
}