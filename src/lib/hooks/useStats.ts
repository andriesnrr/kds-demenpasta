'use client';

import { useMemo } from 'react';
import { Order } from '@/types/order';

export type DateRangeType = 'today' | 'week' | 'month' | 'custom';

export interface DateRange {
  start: Date;
  end: Date;
}

export interface StatsData {
  totalOrders: number;
  completedOrders: number;
  totalRevenue: number;
  totalPieces: number;
  avgPrepTime: number;
  avgOrderValue: number;
  menuStats: {
    [key: string]: {
      count: number;
      revenue: number;
      percentage: number;
    };
  };
  additionalStats: {
    [key: string]: {
      count: number;
      revenue: number;
    };
  };
  ordersByType: {
    'dine-in': number;
    takeaway: number;
    delivery: number;
  };
  ordersByStatus: {
    pending: number;
    preparing: number;
    ready: number;
    completed: number;
  };
  hourlyStats: {
    hour: number;
    orders: number;
    revenue: number;
  }[];
  dailyStats: {
    date: string;
    orders: number;
    revenue: number;
  }[];
}

export function useStats(orders: Order[], dateRange: DateRange): StatsData {
  return useMemo(() => {
    // Filter orders by date range
    const filteredOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= dateRange.start && orderDate <= dateRange.end;
    });

    const completedOrders = filteredOrders.filter(o => o.status === 'completed');

    // Total Revenue
    const totalRevenue = completedOrders.reduce((sum, o) => sum + o.totalPrice, 0);

    // Total Pieces
    const totalPieces = completedOrders.reduce((sum, o) => sum + o.totalPieces, 0);

    // Average Prep Time
    const ordersWithTime = completedOrders.filter(
      o => o.startedAt && o.completedAt
    );
    const avgPrepTime =
      ordersWithTime.length > 0
        ? ordersWithTime.reduce(
            (sum, o) => sum + ((o.completedAt || 0) - (o.startedAt || 0)) / 60000,
            0
          ) / ordersWithTime.length
        : 0;

    // Average Order Value
    const avgOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;

    // Menu Statistics
    const menuStats: { [key: string]: { count: number; revenue: number; percentage: number } } = {};
    completedOrders.forEach(order => {
      order.items.forEach(item => {
        if (!menuStats[item.menuName]) {
          menuStats[item.menuName] = { count: 0, revenue: 0, percentage: 0 };
        }
        menuStats[item.menuName].count += item.quantity;
        menuStats[item.menuName].revenue += item.subtotal;
      });
    });

    // Calculate percentages
    Object.keys(menuStats).forEach(key => {
      menuStats[key].percentage = totalRevenue > 0 
        ? (menuStats[key].revenue / totalRevenue) * 100 
        : 0;
    });

    // Additional Statistics
    const additionalStats: { [key: string]: { count: number; revenue: number } } = {};
    completedOrders.forEach(order => {
      if (order.additionals) {
        order.additionals.forEach(add => {
          if (!additionalStats[add.name]) {
            additionalStats[add.name] = { count: 0, revenue: 0 };
          }
          additionalStats[add.name].count += add.quantity;
          additionalStats[add.name].revenue += add.subtotal;
        });
      }
    });

    // Orders by Type
    const ordersByType = {
      'dine-in': filteredOrders.filter(o => o.orderType === 'dine-in').length,
      'takeaway': filteredOrders.filter(o => o.orderType === 'takeaway').length,
      'delivery': filteredOrders.filter(o => o.orderType === 'delivery').length,
    };

    // Orders by Status
    const ordersByStatus = {
      pending: filteredOrders.filter(o => o.status === 'pending').length,
      preparing: filteredOrders.filter(o => o.status === 'preparing').length,
      ready: filteredOrders.filter(o => o.status === 'ready').length,
      completed: filteredOrders.filter(o => o.status === 'completed').length,
    };

    // Hourly Statistics
    const hourlyMap: { [hour: number]: { orders: number; revenue: number } } = {};
    completedOrders.forEach(order => {
      const hour = new Date(order.createdAt).getHours();
      if (!hourlyMap[hour]) {
        hourlyMap[hour] = { orders: 0, revenue: 0 };
      }
      hourlyMap[hour].orders += 1;
      hourlyMap[hour].revenue += order.totalPrice;
    });

    const hourlyStats = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      orders: hourlyMap[hour]?.orders || 0,
      revenue: hourlyMap[hour]?.revenue || 0,
    }));

    // Daily Statistics
    const dailyMap: { [date: string]: { orders: number; revenue: number } } = {};
    completedOrders.forEach(order => {
      const date = new Date(order.createdAt).toLocaleDateString('id-ID');
      if (!dailyMap[date]) {
        dailyMap[date] = { orders: 0, revenue: 0 };
      }
      dailyMap[date].orders += 1;
      dailyMap[date].revenue += order.totalPrice;
    });

    const dailyStats = Object.entries(dailyMap).map(([date, data]) => ({
      date,
      orders: data.orders,
      revenue: data.revenue,
    }));

    return {
      totalOrders: filteredOrders.length,
      completedOrders: completedOrders.length,
      totalRevenue,
      totalPieces,
      avgPrepTime,
      avgOrderValue,
      menuStats,
      additionalStats,
      ordersByType,
      ordersByStatus,
      hourlyStats,
      dailyStats,
    };
  }, [orders, dateRange]);
}

// Helper to get date range
export function getDateRange(type: DateRangeType, customStart?: Date, customEnd?: Date): DateRange {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (type) {
    case 'today':
      return {
        start: today,
        end: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1),
      };

    case 'week':
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
      return {
        start: weekStart,
        end: new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000 - 1),
      };

    case 'month':
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);
      return {
        start: monthStart,
        end: monthEnd,
      };

    case 'custom':
      if (!customStart || !customEnd) {
        return { start: today, end: today };
      }
      return {
        start: new Date(customStart.getFullYear(), customStart.getMonth(), customStart.getDate()),
        end: new Date(customEnd.getFullYear(), customEnd.getMonth(), customEnd.getDate(), 23, 59, 59),
      };

    default:
      return { start: today, end: today };
  }
}