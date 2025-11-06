'use client';

import { useState, useEffect } from 'react';
import { Order } from '@/types/order';
import { Maximize, Minimize } from 'lucide-react';
import Link from 'next/link';

interface CustomerDisplayProps {
  orders: Order[];
}

export default function CustomerDisplay({ orders }: CustomerDisplayProps) {
  const [currentTime, setCurrentTime] = useState<Date | null>(null); // ← CHANGED: Start with null
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [newReadyOrders, setNewReadyOrders] = useState<string[]>([]);

  // Initialize time on client only
  useEffect(() => {
    setCurrentTime(new Date()); // ← SET initial time
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Detect new ready orders
  useEffect(() => {
    const readyOrderIds = orders
      .filter(o => o.status === 'ready')
      .map(o => o.id);

    const newIds = readyOrderIds.filter(id => !newReadyOrders.includes(id));
    
    if (newIds.length > 0) {
      setNewReadyOrders(prev => [...prev, ...newIds]);
      
      setTimeout(() => {
        setNewReadyOrders(prev => prev.filter(id => !newIds.includes(id)));
      }, 5000);
    }
  }, [orders, newReadyOrders]);

  const readyOrders = orders
    .filter(o => o.status === 'ready')
    .sort((a, b) => (b.readyAt || 0) - (a.readyAt || 0))
    .slice(0, 4);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-400 to-pink-400 relative">
      {/* Controls */}
      {!isFullscreen && (
        <div className="absolute top-4 left-4 z-10">
          <Link
            href="/admin"
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            ← Back
          </Link>
        </div>
      )}

      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={toggleFullscreen}
          className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          {isFullscreen ? 'Exit' : 'Fullscreen'}
        </button>
      </div>

      {/* Main Display */}
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        {/* Header */}
        <div className="text-center mb-12 animate-pulse">
          <div className="text-6xl mb-4">🥟</div>
          <h1 className="text-6xl font-black text-white drop-shadow-2xl mb-2">
            DIMSUM AMPAS TAHU
          </h1>
          <p className="text-3xl font-bold text-white/90 drop-shadow-lg">
            PESANAN SIAP DIAMBIL
          </p>
        </div>

        {/* Orders Grid */}
        {readyOrders.length === 0 ? (
          <div className="text-center">
            <div className="text-8xl mb-6">⏳</div>
            <p className="text-4xl font-bold text-white drop-shadow-lg">
              Belum ada pesanan siap
            </p>
            <p className="text-2xl text-white/80 mt-4">
              Mohon tunggu sebentar...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-8 w-full max-w-6xl mb-12">
            {readyOrders.map(order => (
              <div
                key={order.id}
                className={`bg-white rounded-3xl shadow-2xl p-8 transform transition-all duration-500 ${
                  newReadyOrders.includes(order.id)
                    ? 'scale-110 ring-8 ring-yellow-300 animate-bounce'
                    : 'hover:scale-105'
                }`}
              >
                <div className="text-center mb-4">
                  <div className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-2xl shadow-lg">
                    <span className="text-7xl font-black">
                      {order.orderNumber}
                    </span>
                  </div>
                </div>

                <div className="text-center mt-6">
                  <p className="text-4xl font-bold text-gray-800">
                    {order.customerName}
                  </p>
                </div>

                <div className="text-center mt-4">
                  {order.orderType === 'dine-in' && order.tableNumber && (
                    <span className="inline-block bg-blue-500 text-white px-6 py-2 rounded-full text-xl font-semibold">
                      Meja {order.tableNumber}
                    </span>
                  )}
                  {order.orderType === 'takeaway' && (
                    <span className="inline-block bg-green-500 text-white px-6 py-2 rounded-full text-xl font-semibold">
                      Takeaway
                    </span>
                  )}
                  {order.orderType === 'delivery' && (
                    <span className="inline-block bg-purple-500 text-white px-6 py-2 rounded-full text-xl font-semibold">
                      Delivery
                    </span>
                  )}
                </div>

                {newReadyOrders.includes(order.id) && (
                  <div className="text-center mt-4">
                    <span className="inline-block bg-yellow-400 text-gray-900 px-6 py-2 rounded-full text-2xl font-black animate-pulse">
                      🔔 BARU SIAP!
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="text-center">
          <p className="text-3xl font-bold text-white drop-shadow-lg mb-4">
            Silakan ambil pesanan di kasir
          </p>
          {/* ← FIXED: Only render time if available */}
          {currentTime && (
            <div className="text-2xl text-white/80">
              {currentTime.toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </div>
          )}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 text-9xl opacity-20 animate-bounce">
        🥟
      </div>
      <div
        className="absolute bottom-10 right-10 text-9xl opacity-20 animate-bounce"
        style={{ animationDelay: '1s' }}
      >
        🥟
      </div>
    </div>
  );
}