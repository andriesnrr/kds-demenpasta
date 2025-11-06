// app/kitchen/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useOrders } from '@/lib/hooks/useOrders';
import { useSound } from '@/lib/hooks/useSound';
import OrderGrid from '@/components/kitchen/OrderGrid';
import StationFilter from '@/components/kitchen/StationFilter';
import { Order } from '@/types/order';

export default function KitchenDisplay() {
  const [selectedStation, setSelectedStation] = useState('all');
  const { orders, loading, updateOrderStatus } = useOrders(selectedStation);
  const { playNewOrder, playOrderReady } = useSound();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Play sound when new order arrives
  useEffect(() => {
    const pendingOrders = orders.filter(o => o.status === 'pending');
    if (pendingOrders.length > 0) {
      playNewOrder();
    }
  }, [orders.length]);

  const handleStatusUpdate = (orderId: string, status: Order['status']) => {
    updateOrderStatus(orderId, status);
    if (status === 'ready') {
      playOrderReady();
    }
  };

  const getOrderCounts = () => {
    const counts: Record<string, number> = {
      all: orders.length,
      grill: 0,
      fryer: 0,
      salad: 0,
      dessert: 0,
      drinks: 0
    };

    orders.forEach(order => {
      if (counts[order.station] !== undefined) {
        counts[order.station]++;
      }
    });

    return counts;
  };

  const stats = {
    pending: orders.filter(o => o.status === 'pending').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    ready: orders.filter(o => o.status === 'ready').length,
    total: orders.length
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading Kitchen Display...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-full px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Kitchen Display System</h1>
              <p className="text-sm text-gray-600">
                {currentTime.toLocaleTimeString('id-ID', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{stats.preparing}</div>
                <div className="text-sm text-gray-600">Preparing</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{stats.ready}</div>
                <div className="text-sm text-gray-600">Ready</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-full px-6 py-6">
        {/* Station Filter */}
        <div className="mb-6">
          <StationFilter
            selectedStation={selectedStation}
            onStationChange={setSelectedStation}
            orderCounts={getOrderCounts()}
          />
        </div>

        {/* Orders Grid */}
        <OrderGrid
          orders={orders}
          onUpdateStatus={handleStatusUpdate}
        />
      </main>
    </div>
  );
}