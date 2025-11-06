// app/admin/page.tsx
'use client';

import React, { useState } from 'react';
import { useOrders } from '@/lib/hooks/useOrders';
import { Order, OrderItem } from '@/types/order';

export default function AdminDashboard() {
  const { orders, addOrder } = useOrders();
  const [showNewOrderForm, setShowNewOrderForm] = useState(false);

  const stats = {
    today: orders.length,
    revenue: orders
      .filter(o => o.status === 'completed')
      .reduce((sum, o) => sum + o.items.reduce((s, i) => s + (i.quantity * 1), 0), 0) * 50000,
    avgTime: orders.length > 0
      ? Math.floor(orders.reduce((sum, o) => sum + o.estimatedTime, 0) / orders.length)
      : 0,
    pending: orders.filter(o => o.status === 'pending').length
  };

  const handleCreateOrder = (formData: any) => {
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      orderNumber: `${Date.now().toString().slice(-4)}`,
      tableNumber: formData.tableNumber,
      customerName: formData.customerName,
      items: formData.items,
      status: 'pending',
      priority: formData.priority || 'normal',
      station: formData.items[0]?.station || 'grill',
      createdAt: new Date(),
      estimatedTime: formData.items.reduce((sum: number, item: OrderItem) => sum + 10, 0),
      type: formData.type || 'dine-in',
      notes: formData.notes
    };

    addOrder(newOrder);
    setShowNewOrderForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <button
              onClick={() => setShowNewOrderForm(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            >
              + New Order
            </button>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-600 mb-1">Today's Orders</div>
            <div className="text-3xl font-bold text-gray-900">{stats.today}</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-600 mb-1">Revenue</div>
            <div className="text-3xl font-bold text-green-600">
              Rp {stats.revenue.toLocaleString('id-ID')}
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

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Order #</th>
                  <th className="text-left py-3 px-4">Time</th>
                  <th className="text-left py-3 px-4">Table</th>
                  <th className="text-left py-3 px-4">Items</th>
                  <th className="text-left py-3 px-4">Station</th>
                  <th className="text-left py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 10).map(order => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">#{order.orderNumber}</td>
                    <td className="py-3 px-4">
                      {order.createdAt.toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-3 px-4">{order.tableNumber || '-'}</td>
                    <td className="py-3 px-4">{order.items.length} items</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-gray-200 rounded text-sm">
                        {order.station}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          order.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'ready'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'preparing'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* New Order Modal */}
      {showNewOrderForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Create New Order</h2>
            <p className="text-gray-600 mb-4">
              This is a demo form. In production, implement full order creation with menu selection.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  handleCreateOrder({
                    tableNumber: '5',
                    customerName: 'Demo Customer',
                    type: 'dine-in',
                    priority: 'normal',
                    items: [
                      {
                        id: '1',
                        menuItemId: '1',
                        name: 'Grilled Chicken',
                        quantity: 2,
                        station: 'grill',
                        notes: 'Well done'
                      }
                    ],
                    notes: 'Test order'
                  });
                }}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Create Demo Order
              </button>
              <button
                onClick={() => setShowNewOrderForm(false)}
                className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}