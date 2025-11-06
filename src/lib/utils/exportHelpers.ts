import * as XLSX from 'xlsx';
import { Order } from '@/types/order';
import { StatsData } from '@/lib/hooks/useStats';

// Export Orders to Excel
export function exportOrdersToExcel(orders: Order[], filename: string = 'orders') {
  // Prepare data for export
  const exportData = orders.map(order => ({
    'No. Order': order.orderNumber,
    'Tanggal': new Date(order.createdAt).toLocaleDateString('id-ID'),
    'Waktu': new Date(order.createdAt).toLocaleTimeString('id-ID'),
    'Customer': order.customerName,
    'HP': order.customerPhone,
    'Tipe': order.orderType,
    'Meja': order.tableNumber || '-',
    'Status': order.status,
    'Items': order.items.map(item => `${item.menuName} x${item.quantity}`).join(', '),
    'Additional': order.additionals?.map(add => `${add.name} x${add.quantity}`).join(', ') || '-',
    'Total Pieces': order.totalPieces,
    'Total Harga': order.totalPrice,
    'Mulai Masak': order.startedAt ? new Date(order.startedAt).toLocaleTimeString('id-ID') : '-',
    'Siap': order.readyAt ? new Date(order.readyAt).toLocaleTimeString('id-ID') : '-',
    'Selesai': order.completedAt ? new Date(order.completedAt).toLocaleTimeString('id-ID') : '-',
  }));

  // Create workbook
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(exportData);

  // Set column widths
  const colWidths = [
    { wch: 12 }, // No. Order
    { wch: 12 }, // Tanggal
    { wch: 10 }, // Waktu
    { wch: 20 }, // Customer
    { wch: 15 }, // HP
    { wch: 12 }, // Tipe
    { wch: 8 },  // Meja
    { wch: 12 }, // Status
    { wch: 40 }, // Items
    { wch: 30 }, // Additional
    { wch: 12 }, // Total Pieces
    { wch: 15 }, // Total Harga
    { wch: 12 }, // Mulai Masak
    { wch: 12 }, // Siap
    { wch: 12 }, // Selesai
  ];
  ws['!cols'] = colWidths;

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Orders');

  // Generate file
  const timestamp = new Date().toISOString().split('T')[0];
  XLSX.writeFile(wb, `${filename}_${timestamp}.xlsx`);
}

// Export Stats to Excel
export function exportStatsToExcel(
  stats: StatsData,
  dateRange: { start: Date; end: Date },
  filename: string = 'stats'
) {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Summary
  const summaryData = [
    ['LAPORAN PENJUALAN DEMEN PASTA'],
    ['Periode:', `${dateRange.start.toLocaleDateString('id-ID')} - ${dateRange.end.toLocaleDateString('id-ID')}`],
    [''],
    ['RINGKASAN'],
    ['Total Pesanan', stats.totalOrders],
    ['Pesanan Selesai', stats.completedOrders],
    ['Total Revenue', `Rp ${stats.totalRevenue.toLocaleString('id-ID')}`],
    ['Total Dimsum Terjual', `${stats.totalPieces} pcs`],
    ['Rata-rata Waktu Masak', `${stats.avgPrepTime.toFixed(1)} menit`],
    ['Rata-rata Nilai Order', `Rp ${stats.avgOrderValue.toLocaleString('id-ID')}`],
  ];
  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  wsSummary['!cols'] = [{ wch: 25 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Ringkasan');

  // Sheet 2: Menu Popularity
  const menuData = [
    ['MENU TERPOPULER'],
    ['Menu', 'Jumlah Terjual', 'Revenue', 'Persentase'],
    ...Object.entries(stats.menuStats)
      .sort((a, b) => b[1].count - a[1].count)
      .map(([menu, data]) => [
        menu,
        data.count,
        `Rp ${data.revenue.toLocaleString('id-ID')}`,
        `${data.percentage.toFixed(1)}%`,
      ]),
  ];
  const wsMenu = XLSX.utils.aoa_to_sheet(menuData);
  wsMenu['!cols'] = [{ wch: 30 }, { wch: 15 }, { wch: 20 }, { wch: 12 }];
  XLSX.utils.book_append_sheet(wb, wsMenu, 'Menu Terpopuler');

  // Sheet 3: Additional Sales
  if (Object.keys(stats.additionalStats).length > 0) {
    const additionalData = [
      ['PENJUALAN ADDITIONAL'],
      ['Item', 'Jumlah Terjual', 'Revenue'],
      ...Object.entries(stats.additionalStats)
        .sort((a, b) => b[1].count - a[1].count)
        .map(([name, data]) => [
          name,
          data.count,
          `Rp ${data.revenue.toLocaleString('id-ID')}`,
        ]),
    ];
    const wsAdditional = XLSX.utils.aoa_to_sheet(additionalData);
    wsAdditional['!cols'] = [{ wch: 25 }, { wch: 15 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, wsAdditional, 'Additional');
  }

  // Sheet 4: Hourly Stats
  const hourlyData = [
    ['PERFORMA PER JAM'],
    ['Jam', 'Jumlah Order', 'Revenue'],
    ...stats.hourlyStats
      .filter(h => h.orders > 0)
      .map(h => [
        `${h.hour.toString().padStart(2, '0')}:00`,
        h.orders,
        `Rp ${h.revenue.toLocaleString('id-ID')}`,
      ]),
  ];
  const wsHourly = XLSX.utils.aoa_to_sheet(hourlyData);
  wsHourly['!cols'] = [{ wch: 10 }, { wch: 15 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(wb, wsHourly, 'Per Jam');

  // Sheet 5: Daily Stats (if available)
  if (stats.dailyStats.length > 0) {
    const dailyData = [
      ['RINGKASAN HARIAN'],
      ['Tanggal', 'Jumlah Order', 'Revenue'],
      ...stats.dailyStats.map(d => [
        d.date,
        d.orders,
        `Rp ${d.revenue.toLocaleString('id-ID')}`,
      ]),
    ];
    const wsDaily = XLSX.utils.aoa_to_sheet(dailyData);
    wsDaily['!cols'] = [{ wch: 15 }, { wch: 15 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, wsDaily, 'Per Hari');
  }

  // Sheet 6: Order Type Distribution
  const orderTypeData = [
    ['DISTRIBUSI TIPE PESANAN'],
    ['Tipe', 'Jumlah'],
    ['Dine In', stats.ordersByType['dine-in']],
    ['Takeaway', stats.ordersByType.takeaway],
    ['Delivery', stats.ordersByType.delivery],
  ];
  const wsOrderType = XLSX.utils.aoa_to_sheet(orderTypeData);
  wsOrderType['!cols'] = [{ wch: 20 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(wb, wsOrderType, 'Tipe Pesanan');

  // Generate file
  const timestamp = new Date().toISOString().split('T')[0];
  XLSX.writeFile(wb, `${filename}_${timestamp}.xlsx`);
}

// Export Detailed Orders (with items breakdown)
export function exportDetailedOrdersToExcel(orders: Order[], filename: string = 'detailed_orders') {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Orders Summary
  const ordersSummary = orders.map(order => ({
    'No. Order': order.orderNumber,
    'Tanggal': new Date(order.createdAt).toLocaleDateString('id-ID'),
    'Waktu': new Date(order.createdAt).toLocaleTimeString('id-ID'),
    'Customer': order.customerName,
    'HP': order.customerPhone,
    'Tipe': order.orderType,
    'Meja': order.tableNumber || '-',
    'Status': order.status,
    'Total Pieces': order.totalPieces,
    'Total Harga': order.totalPrice,
  }));
  const wsOrders = XLSX.utils.json_to_sheet(ordersSummary);
  wsOrders['!cols'] = Array(10).fill({ wch: 15 });
  XLSX.utils.book_append_sheet(wb, wsOrders, 'Orders');

  // Define interface for breakdown items to avoid 'any'
  interface ItemBreakdown {
    'No. Order': string;
    'Customer': string;
    'Menu': string;
    'Jumlah': number;
    'Harga Satuan': number;
    'Subtotal': number;
    'Catatan': string;
  }

  // Sheet 2: Items Breakdown
  const itemsBreakdown: ItemBreakdown[] = [];
  orders.forEach(order => {
    order.items.forEach(item => {
      itemsBreakdown.push({
        'No. Order': order.orderNumber,
        'Customer': order.customerName,
        'Menu': item.menuName,
        'Jumlah': item.quantity,
        'Harga Satuan': item.price,
        'Subtotal': item.subtotal,
        'Catatan': item.notes || '-',
      });
    });
  });
  const wsItems = XLSX.utils.json_to_sheet(itemsBreakdown);
  wsItems['!cols'] = Array(7).fill({ wch: 18 });
  XLSX.utils.book_append_sheet(wb, wsItems, 'Items Detail');

  interface AdditionalBreakdown {
    'No. Order': string;
    'Customer': string;
    'Additional': string;
    'Jumlah': number;
    'Harga Satuan': number;
    'Subtotal': number;
  }

  // Sheet 3: Additional Breakdown
  const additionalBreakdown: AdditionalBreakdown[] = [];
  orders.forEach(order => {
    if (order.additionals) {
      order.additionals.forEach(add => {
        additionalBreakdown.push({
          'No. Order': order.orderNumber,
          'Customer': order.customerName,
          'Additional': add.name,
          'Jumlah': add.quantity,
          'Harga Satuan': add.price,
          'Subtotal': add.subtotal,
        });
      });
    }
  });
  if (additionalBreakdown.length > 0) {
    const wsAdditional = XLSX.utils.json_to_sheet(additionalBreakdown);
    wsAdditional['!cols'] = Array(6).fill({ wch: 18 });
    XLSX.utils.book_append_sheet(wb, wsAdditional, 'Additional Detail');
  }

  // Generate file
  const timestamp = new Date().toISOString().split('T')[0];
  XLSX.writeFile(wb, `${filename}_${timestamp}.xlsx`);
}