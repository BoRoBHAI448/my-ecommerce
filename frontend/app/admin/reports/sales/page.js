"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  CreditCard,
  Calendar,
  Download,
} from "lucide-react";

export default function AdminSalesReportPage() {
  const [period, setPeriod] = useState("30days");

  const salesByPayment = [
    { method: "Cash on Delivery (COD)", orders: 48, revenue: 98500, percentage: 66 },
    { method: "bKash Online", orders: 22, revenue: 42000, percentage: 28 },
    { method: "Nagad", orders: 6, revenue: 8000, percentage: 6 },
  ];

  const topProducts = [
    { name: "Classic Supima Cotton Oxford Shirt", sold: 34, revenue: 62900, category: "Men's Fashion" },
    { name: "Handcrafted Heritage Penny Loafer", sold: 18, revenue: 81000, category: "Footwear" },
    { name: "Structured Italian Leather Tote Bag", sold: 14, revenue: 50400, category: "Accessories & Bags" },
    { name: "Minimalist Leather Bi-Fold Wallet", sold: 26, revenue: 29900, category: "Accessories & Bags" },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <BarChart3 className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900">Sales Report</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Revenue trends, sales channels, and best-performing catalog items.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white font-medium focus:outline-none"
          >
            <option value="today">Today</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days (Current Month)</option>
            <option value="year">This Year</option>
          </select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="gap-2 text-xs"
          >
            <Download className="w-3.5 h-3.5" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>Gross Sales</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">৳148,500</p>
          <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +18.4% vs last period
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">76 Orders</p>
          <p className="text-xs text-slate-500 mt-1">94% Fulfillment rate</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>Average Order Value</span>
            <CreditCard className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">৳1,954</p>
          <p className="text-xs text-slate-500 mt-1">Across all zones</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>Items Sold</span>
            <BarChart3 className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">92 Units</p>
          <p className="text-xs text-slate-500 mt-1">Average 1.2 items/cart</p>
        </div>
      </div>

      {/* Payment Channels & Best Sellers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Payment Channels Breakdown */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="font-semibold text-slate-900 text-sm">
            Revenue by Payment Method
          </h2>

          <div className="space-y-4 pt-2">
            {salesByPayment.map((ch, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-800">{ch.method}</span>
                  <span className="text-slate-900 font-bold">
                    ৳{ch.revenue.toLocaleString()} ({ch.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full"
                    style={{ width: `${ch.percentage}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400">{ch.orders} successful orders</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Products */}
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="font-semibold text-slate-900 text-sm">
            Top Selling Catalog Products
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Product Name</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3 text-center">Units Sold</th>
                  <th className="py-2.5 px-3 text-right">Revenue (BDT)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topProducts.map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60">
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      {p.name}
                    </td>
                    <td className="py-3 px-3 text-slate-500">{p.category}</td>
                    <td className="py-3 px-3 text-center font-bold text-slate-800">
                      {p.sold}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-indigo-600 font-mono">
                      ৳{p.revenue.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
