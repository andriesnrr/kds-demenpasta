// src/app/page.tsx
'use client';

import React from 'react';
import { ChefHat, BarChart3, Monitor, Utensils } from 'lucide-react';
import Image from 'next/image';

export default function ImprovedHome() {
  const navigate = (path: string) => {
    window.location.href = path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-9xl opacity-10 animate-bounce">🥟</div>
        <div className="absolute top-40 right-20 text-7xl opacity-10 animate-pulse" style={{animationDelay: '1s'}}>🍜</div>
        <div className="absolute bottom-20 left-1/4 text-8xl opacity-10 animate-bounce" style={{animationDelay: '2s'}}>🥢</div>
        <div className="absolute bottom-40 right-1/4 text-6xl opacity-10 animate-pulse" style={{animationDelay: '1.5s'}}>🥡</div>
      </div>

      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 relative z-10">
        <div className="w-full max-w-6xl">
          {/* Header Section with LOGO */}
          <div className="text-center mb-12 animate-fadeIn">
            <div className="relative w-48 h-48 sm:w-64 sm:h-64 mx-auto mb-6 transform hover:scale-105 transition-transform duration-300">
               <Image
                  src="/images/logo-demen-pasta.jpg"
                  alt="Demen Pasta Logo"
                  fill
                  className="object-contain drop-shadow-2xl rounded-full"
                  priority
               />
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white mb-4 drop-shadow-2xl tracking-tight">
              DEMEN PASTA 
            </h1>
            <div className="inline-block bg-white/20 backdrop-blur-md px-8 py-3 rounded-full border-2 border-white/30">
              <p className="text-xl sm:text-2xl font-bold text-white">
                Kitchen Display System
              </p>
            </div>
          </div>

          {/* Main Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Kitchen Display Card */}
            <button
              onClick={() => navigate('/kitchen')}
              className="group bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300 text-left"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <ChefHat size={40} className="text-white" />
                </div>
                <div className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-bold">
                  Kitchen
                </div>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                Kitchen Display
              </h2>
              <p className="text-gray-600 mb-6 text-lg">
                Monitor dan kelola pesanan real-time dari dapur
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-700">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Real-time order updates</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Status management</span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between text-blue-600 font-semibold">
                <span>Buka Kitchen</span>
                <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            {/* Admin Dashboard Card */}
            <button
              onClick={() => navigate('/admin')}
              className="group bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300 text-left"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Utensils size={40} className="text-white" />
                </div>
                <div className="bg-purple-100 text-purple-600 px-4 py-1 rounded-full text-sm font-bold">
                  Admin
                </div>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                Admin Dashboard
              </h2>
              <p className="text-gray-600 mb-6 text-lg">
                Kelola pesanan, menu, dan operasional
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-700">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">Tambah & edit pesanan</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">Print receipts</span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between text-purple-600 font-semibold">
                <span>Buka Admin</span>
                <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>

          {/* Secondary Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Statistics Card */}
            <button
              onClick={() => navigate('/stats')}
              className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 text-left"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 size={28} className="text-white" />
                </div>
                <div className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-bold">
                  Analytics
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                Statistics & Reports
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Analisis penjualan dan performa
              </p>

              <div className="flex items-center justify-between text-green-600 font-semibold text-sm">
                <span>Lihat Stats</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            {/* Customer Display Card */}
            <button
              onClick={() => navigate('/display')}
              className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 text-left"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-br from-orange-500 to-red-500 p-3 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300">
                  <Monitor size={28} className="text-white" />
                </div>
                <div className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-bold">
                  Display
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                Customer Display
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Tampilan pesanan siap untuk customer
              </p>

              <div className="flex items-center justify-between text-orange-600 font-semibold text-sm">
                <span>Buka Display</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>

          {/* Footer */}
          <div className="text-center mt-12 animate-fadeIn" style={{animationDelay: '0.3s'}}>
            <div className="bg-white/20 backdrop-blur-md inline-block px-6 py-3 rounded-full border border-white/30">
              <p className="text-white text-sm font-medium">
                © 2025 Demen Pasta
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}