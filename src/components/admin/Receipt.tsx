'use client';

import { Order } from '@/types/order';
import { formatCurrency } from '@/lib/utils/formatters';
import Image from 'next/image';

interface ReceiptProps {
  order: Order;
}

export default function Receipt({ order }: ReceiptProps) {
  return (
    <div className="receipt-container bg-white p-8 max-w-md mx-auto font-mono text-sm">
      {/* Header with Logo */}
      <div className="text-center mb-6 border-b-2 border-dashed border-gray-400 pb-4">
        <div className="flex justify-center mb-3">
          <Image
            src="/images/demen-pasta-logo.png"
            alt="Demen Pasta Logo"
            width={80}
            height={80}
            className="rounded-full"
          />
        </div>
        <h1 className="text-2xl font-bold text-brand-black">DEMEN PASTA</h1>
        <p className="text-xs text-gray-600 mt-1">
          Dimsum Mentai Ampas Tahu
        </p>
        <p className="text-xs text-gray-600">
          📞 0851-7677-1352
        </p>
        <p className="text-xs text-gray-600">
          📍 Surabaya, Indonesia
        </p>
      </div>

      {/* Order Info */}
      <div className="mb-4 text-xs">
        <div className="flex justify-between mb-1">
          <span className="font-semibold">No. Order:</span>
          <span className="font-bold text-brand-red">{order.orderNumber}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span>Tanggal:</span>
          <span>{new Date(order.createdAt).toLocaleDateString('id-ID')}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span>Waktu:</span>
          <span>{new Date(order.createdAt).toLocaleTimeString('id-ID')}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span>Kasir:</span>
          <span>Admin</span>
        </div>
      </div>

      {/* Customer Info */}
      <div className="mb-4 pb-3 border-b border-dashed border-gray-400 text-xs">
        <div className="flex justify-between mb-1">
          <span className="font-semibold">Customer:</span>
          <span>{order.customerName}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span>HP:</span>
          <span>{order.customerPhone}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span>Tipe:</span>
          <span className="uppercase">{order.orderType}</span>
        </div>
        {order.tableNumber && (
          <div className="flex justify-between mb-1">
            <span>Meja:</span>
            <span>{order.tableNumber}</span>
          </div>
        )}
      </div>

      {/* Items */}
      <div className="mb-4 pb-3 border-b-2 border-dashed border-gray-400">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="text-left py-2">Item</th>
              <th className="text-center py-2">Qty</th>
              <th className="text-right py-2">Harga</th>
              <th className="text-right py-2">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, index) => (
              <tr key={item.id} className="border-b border-gray-200">
                <td className="py-2">
                  <div className="font-semibold">{item.menuName}</div>
                  {item.notes && (
                    <div className="text-xs text-gray-600 italic">
                      * {item.notes}
                    </div>
                  )}
                </td>
                <td className="text-center py-2">{item.quantity}</td>
                <td className="text-right py-2">
                  {formatCurrency(item.price).replace('Rp', '')}
                </td>
                <td className="text-right py-2 font-semibold">
                  {formatCurrency(item.subtotal).replace('Rp', '')}
                </td>
              </tr>
            ))}

            {/* Additionals */}
            {order.additionals && order.additionals.length > 0 && (
              <>
                <tr>
                  <td colSpan={4} className="py-2 pt-3">
                    <div className="text-xs font-semibold text-gray-700">
                      ADDITIONAL:
                    </div>
                  </td>
                </tr>
                {order.additionals.map((add, index) => (
                  <tr key={add.id} className="border-b border-gray-200">
                    <td className="py-2 pl-4">{add.name}</td>
                    <td className="text-center py-2">{add.quantity}</td>
                    <td className="text-right py-2">
                      {formatCurrency(add.price).replace('Rp', '')}
                    </td>
                    <td className="text-right py-2 font-semibold">
                      {formatCurrency(add.subtotal).replace('Rp', '')}
                    </td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mb-4 text-xs">
        <div className="flex justify-between mb-2">
          <span>Total Items:</span>
          <span className="font-semibold">{order.totalItems}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Total Pieces:</span>
          <span className="font-semibold">{order.totalPieces} pcs</span>
        </div>
      </div>

      {/* Total */}
      <div className="mb-6 pt-3 border-t-2 border-gray-800">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold">TOTAL:</span>
          <span className="text-xl font-bold text-brand-red">
            {formatCurrency(order.totalPrice)}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-600 border-t border-dashed border-gray-400 pt-4">
        <p className="mb-2 font-semibold">Terima kasih atas pesanan Anda!</p>
        <p className="mb-1">Follow kami:</p>
        <p className="mb-1">
          📱 TikTok: @demen.pasta
        </p>
        <p className="mb-3">
          📷 Instagram: @demenpasta
        </p>
        <p className="text-xs italic">
          ~ Selamat menikmati ~
        </p>
      </div>

      {/* Barcode/QR placeholder */}
      <div className="text-center mt-4 text-xs text-gray-400">
        <p>*** {order.orderNumber} ***</p>
      </div>
    </div>
  );
}