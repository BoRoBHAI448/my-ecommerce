"use client";

import { useState } from "react";
import Link from "next/link";
import { mockIncompleteOrders } from "@/lib/api/mock/data";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Clock,
  Phone,
  MessageCircle,
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Search,
  ExternalLink,
} from "lucide-react";

export default function AdminIncompleteOrdersPage() {
  const [incompletes, setIncompletes] = useState(mockIncompleteOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  function showToast(msg) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  }

  // Update call status
  function handleStatusChange(id, status) {
    setIncompletes((prev) =>
      prev.map((item) => (item.id === id ? { ...item, call_status: status } : item))
    );
    showToast(`Call status updated to "${status}"`);
  }

  // Generate WhatsApp recovery link
  function getWhatsAppRecoveryLink(item) {
    const phone = item.phone.replace(/[^0-9]/g, "");
    const bdPhone = phone.startsWith("88") ? phone : `88${phone}`;
    const text = encodeURIComponent(
      `Assalamu Alaikum ${item.customer_name}, Apex Cart theke bolchilam. Apni amader website e cart e kichu product rekhechen (${item.cart_items.map((i) => i.name).join(", ")}). Order ti confirm korte kono shohayota lagbe ki?`
    );
    return `https://wa.me/${bdPhone}?text=${text}`;
  }

  const filtered = incompletes.filter(
    (item) =>
      item.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.phone.includes(searchQuery)
  );

  const potentialRevenue = incompletes.reduce((acc, i) => acc + i.cart_total, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-slate-700 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <p className="text-sm font-medium">{toastMessage}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <RotateCcw className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900">
              Incomplete / Abandoned Checkouts
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Recover lost sales by contacting shoppers who left without completing checkout.
          </p>
        </div>

        <Link href="/admin/orders">
          <Button variant="outline" size="sm" className="gap-2">
            <ShoppingBag className="w-4 h-4" />
            View Completed Orders
          </Button>
        </Link>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Abandoned Carts
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{incompletes.length}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              Recoverable Value
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              ৳{potentialRevenue.toLocaleString()}
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            ৳
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              Conversion Opportunity
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-1">~35%</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search & Incomplete Carts Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:w-80 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by customer phone or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          <div className="text-xs text-slate-500">
            Showing <strong>{filtered.length}</strong> incomplete checkouts
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-xs uppercase tracking-wider">
                <th className="py-3 px-4">Shopper</th>
                <th className="py-3 px-4">Cart Items & Total</th>
                <th className="py-3 px-4">Abandoned Stage</th>
                <th className="py-3 px-4">Time Elapsed</th>
                <th className="py-3 px-4 text-center">Follow-Up Status</th>
                <th className="py-3 px-4 text-right">Quick Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Shopper */}
                  <td className="py-3.5 px-4">
                    <div>
                      <p className="font-semibold text-slate-900">{item.customer_name}</p>
                      <a
                        href={`tel:${item.phone}`}
                        className="text-xs font-mono text-indigo-600 hover:underline flex items-center gap-1 mt-0.5"
                      >
                        <Phone className="w-3 h-3" />
                        {item.phone}
                      </a>
                      <p className="text-[11px] text-slate-400 mt-0.5">{item.address}</p>
                    </div>
                  </td>

                  {/* Cart Items */}
                  <td className="py-3.5 px-4">
                    <div>
                      <p className="font-bold text-slate-900">
                        ৳{item.cart_total.toLocaleString()}
                      </p>
                      <div className="space-y-0.5 mt-1">
                        {item.cart_items.map((ci, idx) => (
                          <div key={idx} className="text-xs text-slate-600">
                            • {ci.name} ({ci.variant})
                          </div>
                        ))}
                      </div>
                    </div>
                  </td>

                  {/* Abandoned Step */}
                  <td className="py-3.5 px-4">
                    <span className="inline-block px-2.5 py-1 bg-amber-50 text-amber-800 text-xs font-medium rounded-md border border-amber-200/60">
                      {item.abandoned_step}
                    </span>
                  </td>

                  {/* Time */}
                  <td className="py-3.5 px-4 text-xs text-slate-500">
                    {item.created_at}
                  </td>

                  {/* Call Status */}
                  <td className="py-3.5 px-4 text-center">
                    <select
                      value={item.call_status}
                      onChange={(e) => handleStatusChange(item.id, e.target.value)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                        item.call_status.includes("Recovered")
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : item.call_status.includes("Pending")
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      <option value="Pending Call">Pending Call</option>
                      <option value="Called - No Answer">Called - No Answer</option>
                      <option value="Recovered - Order Placed">Recovered - Order Placed</option>
                      <option value="Cancelled by Customer">Cancelled by Customer</option>
                    </select>
                  </td>

                  {/* Quick Contact Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`tel:${item.phone}`}
                        className="p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium"
                        title="Call Customer"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        Call
                      </a>

                      <a
                        href={getWhatsAppRecoveryLink(item)}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium"
                        title="Send WhatsApp Message"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        WhatsApp
                      </a>
                    </div>
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
