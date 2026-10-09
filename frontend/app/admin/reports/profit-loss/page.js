"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  TrendingUp,
  DollarSign,
  PieChart,
  Download,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export default function AdminProfitLossPage() {
  const [period, setPeriod] = useState("month");

  const revenue = 0;
  const cogs = 0;
  const shippingCollected = 0;
  const shippingCost = 0;
  const returns = 0;
  const grossProfit = 0;
  const margin = 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <PieChart className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900">Profit & Loss Analysis</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Track gross margins, COGS, courier variances, and net profitability.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="gap-2 text-xs"
          >
            <Download className="w-3.5 h-3.5" />
            Export Statement
          </Button>
        </div>
      </div>

      {/* Primary Margin Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Revenue
          </p>
          <p className="text-3xl font-black text-slate-900">৳{revenue.toLocaleString()}</p>
          <p className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" /> 76 completed orders
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Cost of Goods (COGS)
          </p>
          <p className="text-3xl font-black text-rose-600">৳{cogs.toLocaleString()}</p>
          <p className="text-xs text-slate-500">
            Average product unit cost ~52.6%
          </p>
        </div>

        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-6 rounded-xl shadow-md space-y-2">
          <p className="text-xs font-semibold text-indigo-200 uppercase tracking-wider">
            Estimated Gross Profit
          </p>
          <p className="text-3xl font-black text-emerald-400">
            ৳{grossProfit.toLocaleString()}
          </p>
          <p className="text-xs text-slate-300 font-semibold">
            Gross Margin: <strong className="text-white text-sm">{margin}%</strong>
          </p>
        </div>
      </div>

      {/* Income Statement Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 font-semibold text-sm text-slate-900">
          Monthly Profit & Loss Ledger Breakdown
        </div>

        <div className="divide-y divide-slate-100 text-sm">
          <div className="p-4 flex justify-between font-semibold text-slate-900 bg-slate-50/50">
            <span>Operating Revenue (Store Sales)</span>
            <span>৳{revenue.toLocaleString()}</span>
          </div>

          <div className="p-4 pl-8 flex justify-between text-slate-600 text-xs">
            <span>Product Production / Purchase Cost (COGS)</span>
            <span className="text-rose-600">-৳{cogs.toLocaleString()}</span>
          </div>

          <div className="p-4 pl-8 flex justify-between text-slate-600 text-xs">
            <span>Customer Delivery Fees Collected</span>
            <span className="text-emerald-600">+৳{shippingCollected.toLocaleString()}</span>
          </div>

          <div className="p-4 pl-8 flex justify-between text-slate-600 text-xs">
            <span>Actual Courier Shipping Paid (Steadfast, Pathao)</span>
            <span className="text-rose-600">-৳{shippingCost.toLocaleString()}</span>
          </div>

          <div className="p-4 pl-8 flex justify-between text-slate-600 text-xs">
            <span>Return Handling / Damaged Items Allowance</span>
            <span className="text-rose-600">-৳{returns.toLocaleString()}</span>
          </div>

          <div className="p-4 flex justify-between font-bold text-base text-slate-900 bg-emerald-50/60 border-t-2 border-emerald-500">
            <span className="text-emerald-950">Net Gross Contribution</span>
            <span className="text-emerald-700 font-mono">৳{grossProfit.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
