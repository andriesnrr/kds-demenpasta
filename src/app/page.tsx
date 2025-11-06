// app/page.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* Left Side - Branding */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-12 text-white flex flex-col justify-center">
              <div className="text-6xl mb-6">🍽️</div>
              <h1 className="text-4xl font-bold mb-4">Kitchen Display System</h1>
              <p className="text-lg opacity-90 mb-6">
                Streamline your kitchen operations with real-time order management and tracking.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    ✓
                  </div>
                  <span>Real-time order updates</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    ✓
                  </div>
                  <span>Multi-station support</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    ✓
                  </div>
                  <span>Priority order management</span>
                </div>
              </div>
            </div>

            {/* Right Side - Login Options */}
            <div className="p-12 flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-600 mb-8">Select your role to continue</p>

              <div className="space-y-4">
                <button
                  onClick={() => router.push('/kitchen')}
                  className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-2xl">👨‍🍳</span>
                    <div className="text-left">
                      <div>Kitchen Display</div>
                      <div className="text-sm opacity-90">View and manage orders</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => router.push('/admin')}
                  className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-2xl">👤</span>
                    <div className="text-left">
                      <div>Admin Dashboard</div>
                      <div className="text-sm opacity-90">Manage orders & menu</div>
                    </div>
                  </div>
                </button>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <p className="text-center text-sm text-gray-600">
                  Demo Version - No authentication required
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-white pb-6">
        <p className="text-sm opacity-75">
          © 2024 Kitchen Display System. Built with Next.js & Tailwind CSS
        </p>
      </div>
    </div>
  );
}