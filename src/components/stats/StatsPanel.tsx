'use client';

import { useState } from 'react';
import { Order } from '@/types/order';
import { Package, TrendingUp, Clock, DollarSign, Calendar, Download } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/formatters';
import { useStats, getDateRange, DateRangeType, DateRange } from '@/lib/hooks/useStats';
import StatsCard from './StatsCard';
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

  const exportToCSV = () => {
    // Will implement in next part
    alert('Export CSV akan diimplementasikan di Part 4!');
  };

  return (
    <div className="space-y-6">
      {/* Header with Filter */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-brand-black">Statistik & Laporan</h2>
        <button
          onClick={exportToCSV}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Download size={20} />
          Export Excel
        </button>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-brand-black mb-4 flex items-center gap-2">
          <Calendar size={20} />
          Filter Periode
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Quick Filters */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-brand-black">
              Pilih Periode
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setFilterType('today')}
                className={`py-2 px-4 rounded-lg font-semibold transition-colors ${
                  filterType === 'today'
                    ? 'bg-brand-red text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Hari Ini
              </button>
              <button
                onClick={() => setFilterType('week')}
                className={`py-2 px-4 rounded-lg font-semibold transition-colors ${
                  filterType === 'week'
                    ? 'bg-brand-red text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Minggu Ini
              </button>
              <button
                onClick={() => setFilterType('month')}
                className={`py-2 px-4 rounded-lg font-semibold transition-colors ${
                  filterType === 'month'
                    ? 'bg-brand-red text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Bulan Ini
              </button>
            </div>
          </div>

          {/* Custom Date Range */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-brand-black">
              Custom Range
            </label>
            <div className="flex items-center gap-2">
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
                className="border-2 border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-brand-red outline-none"
                placeholderText="Dari tanggal"
              />
              <span className="text-gray-500">—</span>
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
                className="border-2 border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-brand-red outline-none"
                placeholderText="Sampai tanggal"
              />
            </div>
          </div>
        </div>

        {/* Selected Range Display */}
        <div className="mt-4 text-sm text-gray-600">
          Menampilkan data:{' '}
          <span className="font-semibold text-brand-black">
            {dateRange.start.toLocaleDateString('id-ID')} - {dateRange.end.toLocaleDateString('id-ID')}
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="Total Pesanan"
          value={stats.totalOrders.toString()}
          subtitle={`${stats.completedOrders} selesai`}
          icon={<Package size={24} />}
          color="blue"
        />

        <StatsCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          subtitle={`Avg: ${formatCurrency(stats.avgOrderValue)}`}
          icon={<TrendingUp size={24} />}
          color="green"
        />

        <StatsCard
          title="Dimsum Terjual"
          value={stats.totalPieces.toString()}
          subtitle="pieces"
          icon={<span className="text-2xl">🥟</span>}
          color="orange"
        />

        <StatsCard
          title="Avg Prep Time"
          value={stats.avgPrepTime.toFixed(1)}
          subtitle="menit per order"
          icon={<Clock size={24} />}
          color="purple"
        />
      </div>

      {/* Menu Popularity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4 text-brand-black">Menu Terpopuler</h3>
        <div className="space-y-3">
          {Object.keys(stats.menuStats).length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              Belum ada data penjualan
            </div>
          ) : (
            Object.entries(stats.menuStats)
              .sort((a, b) => b[1].count - a[1].count)
              .map(([menuName, data], index) => (
                <div
                  key={menuName}
                  className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-brand-red text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-brand-black">{menuName}</div>
                    <div className="text-sm text-gray-600">
                      {data.count} pack terjual ({data.percentage.toFixed(1)}%)
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-brand-red">
                      {formatCurrency(data.revenue)}
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>

      {/* Additional Stats */}
      {Object.keys(stats.additionalStats).length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-4 text-brand-black">Penjualan Additional</h3>
          <div className="space-y-3">
            {Object.entries(stats.additionalStats)
              .sort((a, b) => b[1].count - a[1].count)
              .map(([name, data]) => (
                <div
                  key={name}
                  className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg"
                >
                  <div>
                    <div className="font-semibold text-brand-black">{name}</div>
                    <div className="text-sm text-gray-600">{data.count} terjual</div>
                  </div>
                  <div className="font-bold text-brand-red">
                    {formatCurrency(data.revenue)}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-4 text-brand-black">Status Pesanan</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <span className="font-semibold">🔔 Pending</span>
              <span className="font-bold text-yellow-600">
                {stats.ordersByStatus.pending}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="font-semibold">👨‍🍳 Preparing</span>
              <span className="font-bold text-blue-600">
                {stats.ordersByStatus.preparing}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="font-semibold">✅ Ready</span>
              <span className="font-bold text-green-600">
                {stats.ordersByStatus.ready}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-semibold">📦 Completed</span>
              <span className="font-bold text-gray-600">
                {stats.ordersByStatus.completed}
              </span>
            </div>
          </div>
        </div>

        {/* Order Type Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-4 text-brand-black">Tipe Pesanan</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
              <span className="font-semibold">🍽️ Dine In</span>
              <span className="font-bold text-orange-600">
                {stats.ordersByType['dine-in']}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="font-semibold">📦 Takeaway</span>
              <span className="font-bold text-blue-600">
                {stats.ordersByType.takeaway}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="font-semibold">🛵 Delivery</span>
              <span className="font-bold text-green-600">
                {stats.ordersByType.delivery}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Hourly Performance */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4 text-brand-black">Performa Per Jam</h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {stats.hourlyStats
            .filter(h => h.orders > 0)
            .map(hourData => (
              <div
                key={hourData.hour}
                className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded"
              >
                <div className="w-20 font-semibold text-brand-black">
                  {hourData.hour.toString().padStart(2, '0')}:00
                </div>
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-red"
                      style={{
                        width: `${(hourData.orders / Math.max(...stats.hourlyStats.map(h => h.orders))) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="w-20 text-right font-semibold text-brand-black">
                  {hourData.orders} order
                </div>
                <div className="w-32 text-right font-bold text-brand-red">
                  {formatCurrency(hourData.revenue)}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Daily Summary (for week/month view) */}
      {filterType !== 'today' && stats.dailyStats.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-4 text-brand-black">Ringkasan Harian</h3>
          <div className="space-y-2">
            {stats.dailyStats.map(dayData => (
              <div
                key={dayData.date}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
              >
                <div className="font-semibold text-brand-black">{dayData.date}</div>
                <div className="flex items-center gap-6">
                  <span className="text-gray-600">{dayData.orders} orders</span>
                  <span className="font-bold text-brand-red">
                    {formatCurrency(dayData.revenue)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}