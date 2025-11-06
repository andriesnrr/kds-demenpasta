'use client';

import { useOrders } from '@/lib/hooks/useOrders';
import StatsPanel from '@/components/stats/StatsPanel';
import { ChefHat, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function StatsPage() {
  const { orders, loading, error } = useOrders();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="hover:opacity-80">
                <ArrowLeft size={24} />
              </Link>
              <ChefHat size={32} />
              <div>
                <h1 className="text-2xl font-bold">Statistics Dashboard</h1>
                <p className="text-sm text-orange-100">Dimsum Ampas Tahu</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-orange-100">
                {new Date().toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
              <div className="text-xl font-bold">
                {new Date().toLocaleTimeString('id-ID', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex gap-1">
            <Link
              href="/kitchen"
              className="px-6 py-3 font-medium text-gray-600 hover:bg-gray-100"
            >
              🍳 Kitchen
            </Link>
            <Link
              href="/admin"
              className="px-6 py-3 font-medium text-gray-600 hover:bg-gray-100"
            >
              📝 Admin
            </Link>
            <Link
              href="/stats"
              className="px-6 py-3 font-medium bg-orange-500 text-white"
            >
              📊 Stats
            </Link>
            <Link
              href="/display"
              className="px-6 py-3 font-medium text-gray-600 hover:bg-gray-100"
            >
              📺 Display
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <StatsPanel orders={orders} />
      </main>
    </div>
  );
}