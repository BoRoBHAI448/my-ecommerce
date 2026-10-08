"use client";

import { useState } from "react";
import { mockProducts } from "@/lib/api/mock/data";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Package,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Download,
  Search,
} from "lucide-react";

export default function AdminStockLedgerPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  // Flatten variants from all products
  const ledgerItems = [];
  mockProducts.forEach((p) => {
    (p.variants || []).forEach((v) => {
      ledgerItems.push({
        id: v.id,
        product_name: p.name,
        category: p.category?.name || "General",
        sku: v.sku,
        attributes: Object.entries(v.attributes || {})
          .map(([k, val]) => `${k}: ${val}`)
          .join(" / "),
        stock: v.stock_quantity || 0,
        price: v.selling_price || 0,
        in_stock: v.in_stock && (v.stock_quantity || 0) > 0,
      });
    });
  });

  const totalUnits = ledgerItems.reduce((acc, i) => acc + i.stock, 0);
  const totalValuation = ledgerItems.reduce((acc, i) => acc + i.stock * i.price, 0);
  const lowStockItems = ledgerItems.filter((i) => i.stock > 0 && i.stock < 5);
  const outOfStockItems = ledgerItems.filter((i) => i.stock === 0);

  const filteredItems = ledgerItems.filter((item) => {
    if (filter === "low") return item.stock > 0 && item.stock < 5;
    if (filter === "out") return item.stock === 0;
    const query = search.toLowerCase().trim();
    return (
      !query ||
      item.product_name.toLowerCase().includes(query) ||
      item.sku.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Package className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900">Stock Ledger</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Real-time inventory quantities per variant, reorder triggers, and warehouse asset valuation.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => window.print()}
          className="gap-2 text-xs"
        >
          <Download className="w-3.5 h-3.5" />
          Export Stock Sheet
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase">
            Total Inventory Units
          </p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{totalUnits} items</p>
          <p className="text-xs text-slate-400 mt-1">Across {ledgerItems.length} SKUs</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase">
            Total Stock Valuation
          </p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            ৳{totalValuation.toLocaleString()}
          </p>
          <p className="text-xs text-slate-400 mt-1">At retail selling price</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-amber-600 uppercase">
            Low Stock Alerts (&lt;5)
          </p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{lowStockItems.length}</p>
          <p className="text-xs text-amber-600 mt-1">Needs purchase reorder</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-rose-600 uppercase">
            Out of Stock SKUs
          </p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{outOfStockItems.length}</p>
          <p className="text-xs text-rose-600 mt-1">Zero units remaining</p>
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                filter === "all" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"
              }`}
            >
              All SKUs ({ledgerItems.length})
            </button>
            <button
              onClick={() => setFilter("low")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                filter === "low" ? "bg-amber-600 text-white" : "bg-slate-100 text-slate-700"
              }`}
            >
              Low Stock ({lowStockItems.length})
            </button>
            <button
              onClick={() => setFilter("out")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                filter === "out" ? "bg-rose-600 text-white" : "bg-slate-100 text-slate-700"
              }`}
            >
              Out of Stock ({outOfStockItems.length})
            </button>
          </div>

          <div className="w-full sm:w-72 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search product or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Product Name</th>
                <th className="py-2.5 px-3">SKU</th>
                <th className="py-2.5 px-3">Variant Specification</th>
                <th className="py-2.5 px-3 text-right">Unit Price</th>
                <th className="py-2.5 px-3 text-center">Stock Units</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60">
                  <td className="py-3 px-3 font-semibold text-slate-900">
                    {item.product_name}
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-600">
                    {item.sku}
                  </td>
                  <td className="py-3 px-3 text-slate-600">{item.attributes}</td>
                  <td className="py-3 px-3 text-right font-mono font-medium">
                    ৳{item.price.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-slate-900">
                    {item.stock}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {item.stock > 5 ? (
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                        Healthy
                      </span>
                    ) : item.stock > 0 ? (
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700">
                        Low Stock
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700">
                        Out of Stock
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
