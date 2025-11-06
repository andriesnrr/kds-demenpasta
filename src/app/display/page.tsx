'use client';

import { useOrders } from '@/lib/hooks/useOrders';
import CustomerDisplay from '@/components/display/CustomerDisplay';
import { Volume2, VolumeX } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function DisplayPage() {
  const { orders } = useOrders();
  const [soundEnabled, setSoundEnabled] = useState(true);

  const readyOrders = orders.filter(o => o.status === 'ready');

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 to-red-600 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link
            href="/"
            className="text-white hover:text-orange-100 transition-colors"
          >
            ← Kembali
          </Link>
          
          <h1 className="text-5xl font-bold text-white text-center flex-1">
            🥟 Pesanan Siap
          </h1>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="text-white hover:text-orange-100 transition-colors p-2"
          >
            {soundEnabled ? <Volume2 size={32} /> : <VolumeX size={32} />}
          </button>
        </div>

        {/* Display */}
        <CustomerDisplay orders={readyOrders} soundEnabled={soundEnabled} />
      </div>
    </div>
  );
}