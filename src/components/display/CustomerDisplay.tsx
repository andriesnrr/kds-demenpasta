// src/components/display/CustomerDisplay.tsx
'use client';

import { useState, useEffect } from 'react';
import { Order } from '@/types/order';
import { Maximize, Minimize, Bell } from 'lucide-react';

interface CustomerDisplayProps {
  orders: Order[];
  soundEnabled?: boolean;
}

export default function CustomerDisplay({ orders, soundEnabled = true }: CustomerDisplayProps) {
  // --- ORIGINAL FUNCTIONALITY (STATE & LOGIC) ---
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [newReadyOrders, setNewReadyOrders] = useState<string[]>([]);

  // Initialize time
  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Detect new ready orders and play sound
  useEffect(() => {
    const readyOrderIds = orders
      .filter(o => o.status === 'ready')
      .map(o => o.id);

    const newIds = readyOrderIds.filter(id => !newReadyOrders.includes(id));
    
    if (newIds.length > 0) {
      setNewReadyOrders(prev => [...prev, ...newIds]);
      if (soundEnabled) {
        playNotificationSound();
      }
      setTimeout(() => {
        setNewReadyOrders(prev => prev.filter(id => !newIds.includes(id)));
      }, 5000);
    }
  }, [orders, newReadyOrders, soundEnabled]);

  const playNotificationSound = () => {
    if (typeof window === 'undefined') return;
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      [0, 200, 400].forEach(delay => {
        setTimeout(() => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          oscillator.frequency.value = 880;
          oscillator.type = 'sine';
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.15);
        }, delay);
      });
    } catch (error) {
      console.warn('Sound not supported:', error);
    }
  };

  // Derived data (kept original slice(0, 4) logic to prevent overcrowding, 
  // though the new UI could handle up to 6 nicely if you wanted to change it later)
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

  // --- NEW VISUAL HELPERS ---
  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'dine-in': return '🍽️';
      case 'takeaway': return '📦';
      case 'delivery': return '🛵';
      default: return '📋';
    }
  };

  const getTypeBadgeClass = (type: string) => {
    switch(type) {
      case 'dine-in': return 'bg-blue-500';
      case 'takeaway': return 'bg-green-500';
      case 'delivery': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  // --- NEW UI RENDERING ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-pink-600 relative overflow-hidden font-sans">
      {/* Animated Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-9xl opacity-20 animate-bounce">🥟</div>
        <div className="absolute top-1/4 right-20 text-8xl opacity-15 animate-pulse" style={{animationDelay: '1s'}}>🥟</div>
        <div className="absolute bottom-20 left-1/4 text-7xl opacity-20 animate-bounce" style={{animationDelay: '2s'}}>🥟</div>
        <div className="absolute bottom-1/3 right-1/4 text-9xl opacity-15 animate-pulse" style={{animationDelay: '1.5s'}}>🥟</div>
        <div className="absolute top-1/2 left-1/2 text-6xl opacity-10 animate-bounce" style={{animationDelay: '0.5s'}}>🥟</div>
      </div>

      {/* Fullscreen Toggle (Restyled to match new theme) */}
      <div className="absolute top-6 right-6 z-50">
        <button
          onClick={toggleFullscreen}
          className="bg-white/20 hover:bg-white/30 backdrop-blur-xl border-2 border-white/30 text-white px-6 py-3 rounded-2xl flex items-center gap-3 transition-all shadow-lg hover:scale-105 active:scale-95"
        >
          {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
          <span className="font-bold hidden md:inline">
            {isFullscreen ? 'Exit' : 'Fullscreen'}
          </span>
        </button>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col p-6 md:p-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn mt-8 md:mt-0">
          <div className="inline-block mb-2 animate-bounce">
            <div className="text-7xl md:text-8xl drop-shadow-2xl">🥟</div>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-2xl mb-6 tracking-tight">
            DIMSUM AMPAS TAHU
          </h1>
          <div className="inline-block bg-white/25 backdrop-blur-md px-10 py-4 rounded-3xl border-2 border-white/40 shadow-2xl">
            <p className="text-2xl md:text-4xl font-black text-white drop-shadow-lg tracking-wide">
              PESANAN SIAP DIAMBIL
            </p>
          </div>
        </div>

        {/* Orders Display */}
        {readyOrders.length === 0 ? (
          <div className="flex-1 flex items-center justify-center mb-20">
            <div className="text-center animate-fadeIn">
              <div className="text-9xl mb-8 animate-pulse">⏳</div>
              <p className="text-5xl font-black text-white drop-shadow-2xl mb-6">
                Belum Ada Pesanan Siap
              </p>
              <div className="inline-block bg-black/10 px-8 py-3 rounded-full">
                <p className="text-2xl text-white/90 font-semibold">
                  Mohon tunggu sebentar...
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-7xl mx-auto w-full mb-12 items-start content-start">
            {readyOrders.map((order, index) => {
              const isNew = newReadyOrders.includes(order.id);
              return (
                <div
                  key={order.id}
                  className={`bg-white/95 backdrop-blur-md rounded-[2.5rem] shadow-2xl p-8 transform transition-all duration-500 hover:scale-[1.02] ${
                    isNew ? 'ring-8 ring-yellow-400/80 animate-pulse' : ''
                  }`}
                  style={{
                    animationDelay: `${index * 0.15}s`,
                    animation: 'fadeIn 0.6s ease-out backwards'
                  }}
                >
                  {/* Order Number Badge */}
                  <div className="relative mb-8">
                    <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl p-5 shadow-xl transform -rotate-2 hover:rotate-0 transition-transform border-b-4 border-red-700">
                      <div className="text-center">
                        <div className="text-orange-100 text-sm font-bold mb-1 uppercase tracking-widest opacity-80">
                          Nomor Pesanan
                        </div>
                        <div className="text-6xl md:text-7xl font-black text-white tracking-wider drop-shadow-lg">
                          {order.orderNumber}
                        </div>
                      </div>
                    </div>
                    
                    {/* New Badge */}
                    {isNew && (
                      <div className="absolute -top-5 -right-5 bg-yellow-400 text-gray-900 px-5 py-2 rounded-full font-black text-lg shadow-xl animate-bounce border-4 border-white flex items-center gap-2">
                        <Bell size={20} className="fill-current" />
                        BARU!
                      </div>
                    )}
                  </div>

                  {/* Customer Name */}
                  <div className="text-center mb-8 px-2">
                    <div className="text-3xl md:text-4xl font-black text-gray-800 leading-tight line-clamp-2">
                      {order.customerName}
                    </div>
                  </div>

                  {/* Order Type Badge */}
                  <div className="flex justify-center mb-8">
                    <div className={`${getTypeBadgeClass(order.orderType)} text-white pl-3 pr-6 py-3 rounded-2xl shadow-md flex items-center gap-3 mx-auto`}>
                      <span className="text-4xl bg-black/10 w-14 h-14 rounded-xl flex items-center justify-center">
                        {getTypeIcon(order.orderType)}
                      </span>
                      <div className="text-left">
                        <div className="text-xs font-bold uppercase opacity-80 tracking-wider mb-0.5">
                          Tipe Pesanan
                        </div>
                        <div className="text-xl font-black">
                          {order.orderType === 'dine-in' ? 'Dine In' : 
                           order.orderType === 'takeaway' ? 'Takeaway' : 'Delivery'}
                          {order.tableNumber && (
                             <span className="ml-2 inline-block border-l-2 border-white/30 pl-2">
                               Meja {order.tableNumber}
                             </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ready Indicator */}
                  <div className="bg-emerald-50 border-2 border-emerald-200/50 rounded-2xl p-3">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping"></div>
                      <span className="text-emerald-700 font-bold text-lg uppercase tracking-wider">
                        Siap Diambil
                      </span>
                      <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping"></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        {currentTime && (
          <div className="text-center animate-fadeIn mt-auto" style={{animationDelay: '0.3s'}}>
            <div className="bg-black/20 backdrop-blur-xl inline-flex flex-col md:flex-row items-center gap-4 md:gap-8 px-8 md:px-10 py-4 rounded-3xl border border-white/10 shadow-2xl">
               <div className="flex items-center gap-3 text-white/90">
                 <span className="text-3xl">📍</span>
                 <span className="text-xl md:text-2xl font-bold">
                   Silakan Ambil di Kasir
                 </span>
               </div>
               
               <div className="hidden md:block w-px h-8 bg-white/30"></div>

               <div className="flex items-center gap-4 text-white">
                <div className="text-2xl md:text-3xl font-black tracking-widest font-mono">
                  {currentTime.toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  }).replace(/\./g, ':')}
                </div>
              </div>
            </div>
             <div className="text-white/60 text-sm mt-3 font-medium">
                {currentTime.toLocaleDateString('id-ID', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </div>
          </div>
        )}
      </div>

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </div>
  );
}