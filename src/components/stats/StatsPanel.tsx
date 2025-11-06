'use client';

import { useState } from 'react';
import { Order } from '@/types/order';
import { Package, TrendingUp, Clock, Calendar } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/formatters';
import { useStats, getDateRange, DateRangeType, DateRange } from '@/lib/hooks/useStats';
import { exportStatsToExcel, exportDetailedOrdersToExcel } from '@/lib/utils/exportHelpers';
import StatsCard from './StatsCard';
import ExportButton from '@/components/ui/ExportButton';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface StatsPanelProps {
  orders: Order[];
}

export default function StatsPanel({ orders }: StatsPanelProps) {
  const [filterType, setFilterType] = useState<DateRangeType>('today');
  const [customStartDate, setCustomStartDate] = useState<Date>(new Date());
  const [customEndDate, setCustomEndDate] = useState<Date>(new Date());

  const dateRange: DateRange = 
    filterType === 'custom'
      ? getDateRange('custom', customStartDate, customEndDate)
      : getDateRange(filterType);

  const stats = useStats(orders, dateRange);

  const formatDateForFilename = (date: Date) => date.toLocaleDateString('id-ID').replace(/\//g, '-');
  const dateRangeStr = `${formatDateForFilename(dateRange.start)}_to_${formatDateForFilename(dateRange.end)}`;

  const exportOptions = [
    {
      label: 'Laporan Statistik Ringkas',
      description: 'Download ringkasan performa, menu populer, dan omzet.',
      onClick: () => exportStatsToExcel(stats, dateRange, `statistik-${dateRangeStr}`),
    },
    {
      label: 'Laporan Detail Pesanan',
      description: 'Download data mentah semua pesanan dan itemnya.',
      onClick: () => exportDetailedOrdersToExcel(orders, `detail-pesanan-${dateRangeStr}`),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Export Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-brand-black">Statistik & Laporan</h2>
        <ExportButton options={exportOptions} />
      </div>

      {/* Date Range Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar size={20} className="text-orange-500" />
          Filter Periode
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Filters */}
          <div>
            <label className="block text-sm font-semibold mb-3 text-gray-700">
              Pilih Periode Cepat
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['today', 'week', 'month'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type as DateRangeType)}
                  className={`py-2.5 px-4 rounded-xl font-semibold transition-all ${
                    filterType === type
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {type === 'today' ? 'Hari Ini' : type === 'week' ? 'Minggu Ini' : 'Bulan Ini'}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Date Range */}
          <div>
            <label className="block text-sm font-semibold mb-3 text-gray-700">
              Kustom Tanggal
            </label>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <DatePicker
                  selected={customStartDate}
                  onChange={(date) => {
                    setCustomStartDate(date || new Date());
                    setFilterType('custom');
                  }}
                  selectsStart
                  startDate={customStartDate}
                  endDate={customEndDate}
                  dateFormat="dd/MM/yyyy"
                  className={`w-full border-2 rounded-xl px-4 py-2.5 font-medium outline-none transition-colors ${
                    filterType === 'custom' ? 'border-orange-500 bg-orange-50/30' : 'border-gray-200'
                  }`}
                  placeholderText="Dari tanggal"
                />
              </div>
              <span className="text-gray-400 font-bold">—</span>
              <div className="relative flex-1">
                <DatePicker
                  selected={customEndDate}
                  onChange={(date) => {
                    setCustomEndDate(date || new Date());
                    setFilterType('custom');
                  }}
                  selectsEnd
                  startDate={customStartDate}
                  endDate={customEndDate}
                  minDate={customStartDate}
                  dateFormat="dd/MM/yyyy"
                  className={`w-full border-2 rounded-xl px-4 py-2.5 font-medium outline-none transition-colors ${
                    filterType === 'custom' ? 'border-orange-500 bg-orange-50/30' : 'border-gray-200'
                  }`}
                  placeholderText="Sampai tanggal"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Selected Range Display */}
        <div className="mt-6 p-3 bg-gray-50 rounded-lg text-sm text-gray-600 flex items-center gap-2">
          <InfoIcon />
          <span>
            Menampilkan data periode: <span className="font-bold text-gray-900">{dateRange.start.toLocaleDateString('id-ID')} — {dateRange.end.toLocaleDateString('id-ID')}</span>
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Pesanan"
          value={stats.totalOrders.toString()}
          subtitle={`${stats.completedOrders} selesai`}
          icon={<Package size={24} />}
          color="blue"
        />

        <StatsCard
          title="Total Pendapatan"
          value={formatCurrency(stats.totalRevenue)}
          subtitle={`Rata-rata: ${formatCurrency(stats.avgOrderValue)}`}
          icon={<TrendingUp size={24} />}
          color="green"
        />

        <StatsCard
          title="Dimsum Terjual"
          value={stats.totalPieces.toString()}
          subtitle="pieces keseluruhan"
          icon={<span className="text-2xl">🥟</span>}
          color="orange"
        />

        <StatsCard
          title="Rata-rata Waktu"
          value={`${stats.avgPrepTime.toFixed(0)} min`}
          subtitle="waktu persiapan"
          icon={<Clock size={24} />}
          color="purple"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold mb-6 text-gray-900">Status Pesanan</h3>
          <div className="space-y-4">
            <ProgressBar label="🔔 Pending" value={stats.ordersByStatus.pending} total={stats.totalOrders} color="bg-yellow-500" bgColor="bg-yellow-50" textColor="text-yellow-700" />
            <ProgressBar label="👨‍🍳 Preparing" value={stats.ordersByStatus.preparing} total={stats.totalOrders} color="bg-blue-500" bgColor="bg-blue-50" textColor="text-blue-700" />
            <ProgressBar label="✅ Ready" value={stats.ordersByStatus.ready} total={stats.totalOrders} color="bg-green-500" bgColor="bg-green-50" textColor="text-green-700" />
            <ProgressBar label="📦 Completed" value={stats.ordersByStatus.completed} total={stats.totalOrders} color="bg-gray-500" bgColor="bg-gray-50" textColor="text-gray-700" />
          </div>
        </div>

        {/* Order Type Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold mb-6 text-gray-900">Tipe Pesanan</h3>
          <div className="space-y-4">
            <ProgressBar label="🍽️ Dine In" value={stats.ordersByType['dine-in']} total={stats.totalOrders} color="bg-orange-500" bgColor="bg-orange-50" textColor="text-orange-700" />
            <ProgressBar label="📦 Takeaway" value={stats.ordersByType.takeaway} total={stats.totalOrders} color="bg-blue-500" bgColor="bg-blue-50" textColor="text-blue-700" />
            <ProgressBar label="🛵 Delivery" value={stats.ordersByType.delivery} total={stats.totalOrders} color="bg-purple-500" bgColor="bg-purple-50" textColor="text-purple-700" />
          </div>
        </div>
      </div>

      {/* Menu Popularity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold mb-6 text-gray-900">Menu Terpopuler</h3>
        <div className="space-y-3">
          {Object.keys(stats.menuStats).length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <p className="text-gray-500 font-medium">Belum ada data penjualan untuk periode ini</p>
            </div>
          ) : (
            Object.entries(stats.menuStats)
              .sort((a, b) => b[1].count - a[1].count)
              .map(([menuName, data], index) => (
                <div
                  key={menuName}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-black text-lg ${
                    index === 0 ? 'bg-yellow-400 text-yellow-900' : 
                    index === 1 ? 'bg-gray-300 text-gray-800' : 
                    index === 2 ? 'bg-orange-200 text-orange-800' : 'bg-gray-200 text-gray-600'
                  }`}>
                    #{index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900">{menuName}</div>
                    <div className="text-sm text-gray-500 font-medium mt-0.5">
                      {data.count} terjual <span className="mx-1">•</span> {data.percentage.toFixed(1)}% dari revenue
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-gray-900">
                      {formatCurrency(data.revenue)}
                    </div>
                    <div className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full inline-block mt-1">
                      Revenue
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>

      {/* Additional Stats & Hourly (Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Hourly Performance */}
         <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold mb-6 text-gray-900">Performa Per Jam</h3>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {stats.hourlyStats.filter(h => h.orders > 0).length === 0 ? (
               <div className="text-center py-8 text-gray-400">Tidak ada aktivitas</div>
            ) : (
              stats.hourlyStats
              .filter(h => h.orders > 0)
              .map(hourData => {
                const maxOrders = Math.max(...stats.hourlyStats.map(h => h.orders));
                const percent = (hourData.orders / maxOrders) * 100;
                return (
                  <div key={hourData.hour} className="flex items-center gap-3 text-sm">
                    <div className="w-12 font-bold text-gray-500">
                      {hourData.hour.toString().padStart(2, '0')}:00
                    </div>
                    <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden flex items-center relative">
                      <div
                        className="h-full bg-orange-400 opacity-20 absolute left-0 top-0"
                        style={{ width: `${percent}%` }}
                      />
                      <div
                        className="h-full bg-orange-500 absolute left-0 top-0 rounded-r-lg transition-all duration-500"
                        style={{ width: `${Math.max(percent, 2)}%` }}
                      />
                      <div className="relative z-10 ml-3 font-bold text-gray-700 flex justify-between w-full pr-3">
                         <span>{hourData.orders} order</span>
                         <span>{formatCurrency(hourData.revenue)}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Additional Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold mb-6 text-gray-900">Penjualan Tambahan</h3>
          <div className="space-y-3">
            {Object.keys(stats.additionalStats).length === 0 ? (
               <div className="text-center py-8 text-gray-400">Belum ada data</div>
            ) : (
              Object.entries(stats.additionalStats)
                .sort((a, b) => b[1].count - a[1].count)
                .map(([name, data]) => (
                  <div
                    key={name}
                    className="p-4 bg-yellow-50 rounded-xl border border-yellow-100"
                  >
                    <div className="font-bold text-gray-900 mb-1">{name}</div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium text-yellow-800 bg-yellow-100 px-2 py-0.5 rounded-md">
                        {data.count}x terjual
                      </div>
                      <div className="font-black text-yellow-900">
                        {formatCurrency(data.revenue)}
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>

      {/* Daily Summary (only if range > 1 day) */}
      {filterType !== 'today' && stats.dailyStats.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold mb-6 text-gray-900">Ringkasan Harian</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {stats.dailyStats.map(dayData => (
              <div
                key={dayData.date}
                className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-orange-300 transition-colors"
              >
                <div className="text-sm font-bold text-gray-500 mb-2">{dayData.date}</div>
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-2xl font-black text-gray-900">{dayData.orders}</div>
                    <div className="text-xs font-semibold text-gray-500">Orders</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-orange-600">{formatCurrency(dayData.revenue)}</div>
                    <div className="text-xs font-semibold text-gray-500">Revenue</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface ProgressBarProps {
  label: string;
  value: number;
  total: number;
  color: string;
  bgColor: string;
  textColor: string;
}

function ProgressBar({ label, value, total, color, bgColor, textColor }: ProgressBarProps) {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between mb-1.5">
        <span className={`text-sm font-bold ${textColor}`}>{label}</span>
        <span className="text-sm font-bold text-gray-700">{value} ({percentage.toFixed(0)}%)</span>
      </div>
      <div className={`h-3 ${bgColor} rounded-full overflow-hidden`}>
        <div
          className={`h-full ${color} transition-all duration-500 ease-out rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function InfoIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
  );
}