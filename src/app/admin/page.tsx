// src/app/admin/page.tsx
'use client';

import React, { useState } from 'react';
import { useOrders } from '@/lib/hooks/useOrders';
import AdminPanel from '@/components/admin/AdminPanel';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils/formatters';

export default function AdminDashboard() {
  const { orders, loading, error, addOrder, updateOrder, updateOrderStatus, deleteOrder } = useOrders();
  const [showForm, setShowForm] = useState(false);

  const stats = {
    today: orders.length,
    revenue: orders
      .filter(o => o.status === 'completed')
      .reduce((sum, o) => sum + o.totalPrice, 0),
    avgTime: orders.length > 0
      ? Math.floor(
          orders
            .filter(o => o.startedAt && o.completedAt)
            .reduce((sum, o) => {
              const time = ((o.completedAt || 0) - (o.startedAt || 0)) / 60000;
              return sum + time;
            }, 0) / orders.filter(o => o.startedAt && o.completedAt).length || 0
        )
      : 0,
    pending: orders.filter(o => o.status === 'pending').length
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <Link
                href="/"
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                ← Back to Home
              </Link>
            </div>
            <div className="flex gap-3">
              <Link
                href="/kitchen"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
              >
                🍳 Kitchen
              </Link>
              <Link
                href="/stats"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold"
              >
                📊 Stats
              </Link>
              <Link
                href="/display"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
              >
                📺 Display
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-600 mb-1">Today&apos;s Orders</div>
            <div className="text-3xl font-bold text-gray-900">{stats.today}</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-600 mb-1">Revenue</div>
            <div className="text-3xl font-bold text-green-600">
              {formatCurrency(stats.revenue)}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-600 mb-1">Avg Prep Time</div>
            <div className="text-3xl font-bold text-blue-600">{stats.avgTime} min</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-600 mb-1">Pending</div>
            <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
          </div>
        </div>

        {/* Admin Panel */}
        <AdminPanel
          orders={orders}
          onAddOrder={addOrder}
          onUpdateOrder={updateOrder}
          onDeleteOrder={deleteOrder}
          showForm={showForm}
          setShowForm={setShowForm}
          onUpdateStatus={updateOrderStatus}
        />
      </div>
    </div>
  );
}