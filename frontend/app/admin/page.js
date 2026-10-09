"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { useStore } from "@/lib/store-context";
import { getAdminDashboard } from "@/lib/api/admin";
import {
  DollarSign,
  ShoppingBag,
  Package,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  PlusCircle,
  RefreshCw,
  ShoppingBasket,
} from "lucide-react";

export default function AdminDashboardPage() {
  const store = useStore();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [apiStats, setApiStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    setMounted(true);
    let isSubscribed = true;

    async function loadDashboard() {
      try {
        const res = await getAdminDashboard();
        if (isSubscribed && res && res.data) {
          setApiStats(res.data.stats || null);
          setRecentOrders(res.data.recent_orders || []);
        }
      } catch {
        // Fallback to local context
      } finally {
        if (isSubscribed) setLoading(false);
      }
    }

    loadDashboard();
    return () => {
      isSubscribed = false;
    };
  }, []);

  // Compute product count & low stock from store context if API stats not loaded
  const products = store?.products || [];
  const categories = store?.categories || [];

  const totalProducts = apiStats?.total_products ?? (mounted ? products.length : 0);
  const lowStockCount =
    apiStats?.low_stock_products ??
    (mounted ? products.filter((p) => (p.stock ?? p.quantity ?? 10) <= 5).length : 0);

  const todayRevenue = apiStats?.today_revenue ?? apiStats?.total_revenue ?? 0;
  const todayOrders = apiStats?.today_orders ?? apiStats?.total_orders ?? 0;

  const stats = [
    {
      title: "Revenue",
      value: formatPrice(todayRevenue),
      trend: apiStats ? "Realtime store sales" : "Calculated from store orders",
      icon: DollarSign,
      color: "bg-emerald-500 text-white",
    },
    {
      title: "Total Orders",
      value: `${todayOrders} Orders`,
      trend: `${apiStats?.pending_orders ?? 0} pending dispatch`,
      icon: ShoppingBag,
      color: "bg-amber-500 text-white",
    },
    {
      title: "Total Active Products",
      value: `${totalProducts} Items`,
      trend: `Across ${categories.length} categories`,
      icon: Package,
      color: "bg-blue-500 text-white",
    },
    {
      title: "Low Stock Alerts",
      value: `${lowStockCount} Items`,
      trend: lowStockCount > 0 ? "Needs replenishment" : "Inventory healthy",
      icon: AlertTriangle,
      color: "bg-rose-500 text-white",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Welcome back! Here is what&apos;s happening across your storefront today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors shadow-xs"
          >
            <PlusCircle className="w-4 h-4 text-amber-400" />
            <span>Add New Product</span>
          </Link>
          <Link
            href="/admin/theme"
            className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <span>Theme & Colors</span>
          </Link>
        </div>
      </div>

      {/* Stats KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-start justify-between"
            >
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {s.title}
                </p>
                <h3 className="text-2xl font-black text-slate-900 mt-1" suppressHydrationWarning>
                  {mounted ? s.value : "—"}
                </h3>
                <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-medium">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                  <span suppressHydrationWarning>{s.trend}</span>
                </p>
              </div>
              <div className={`p-3 rounded-lg ${s.color} shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Recent Customer Orders
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live incoming orders from the customer storefront
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-700"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400 flex items-center justify-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span className="text-xs">Loading dashboard data...</span>
          </div>
        ) : recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {recentOrders.map((ord) => (
                  <tr key={ord.id || ord.order_number} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {ord.order_number || `APX-${ord.id}`}
                    </td>
                    <td className="py-3 px-4">{ord.customer_name || ord.shipping_address?.name || "Customer"}</td>
                    <td className="py-3 px-4 font-mono">{ord.customer_phone || ord.shipping_address?.phone || "—"}</td>
                    <td className="py-3 px-4">{ord.items?.length || ord.items_count || 1} item(s)</td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {formatPrice(ord.total_amount || ord.total || 0)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          ord.order_status === "delivered" || ord.status === "Delivered"
                            ? "bg-emerald-100 text-emerald-800"
                            : ord.order_status === "processing" || ord.status === "Processing"
                            ? "bg-blue-100 text-blue-800"
                            : ord.order_status === "confirmed" || ord.status === "Confirmed"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-slate-100 text-slate-800"
                        }`}
                      >
                        {ord.order_status || ord.status || "Pending"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href="/admin/orders"
                        className="font-bold text-amber-600 hover:underline"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 text-center space-y-2">
            <div className="w-10 h-10 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <ShoppingBasket className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-slate-600">No recent customer orders found</p>
            <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
              When customers place orders on your storefront, real order updates will appear here live.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
