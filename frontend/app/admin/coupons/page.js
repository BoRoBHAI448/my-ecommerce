"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/lib/store-context";
import { mockCoupons } from "@/lib/api/mock/data";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import {
  Percent,
  PlusCircle,
  Tag,
  Copy,
  Trash2,
  CheckCircle2,
  Calendar,
  Layers,
  Search,
  Sparkles,
} from "lucide-react";

export default function AdminCouponsPage() {
  const initialCoupons = [
    {
      id: 1,
      code: "FREEDEL",
      type: "delivery",
      discount: 100,
      min_order: 1500,
      usage_count: 84,
      usage_limit: 200,
      expiry_date: "2026-12-31",
      is_active: true,
    },
    {
      id: 2,
      code: "SAVE10",
      type: "percent",
      percent: 10,
      discount: 10,
      min_order: 1000,
      usage_count: 142,
      usage_limit: 500,
      expiry_date: "2026-11-30",
      is_active: true,
    },
    {
      id: 3,
      code: "WELCOME200",
      type: "fixed",
      discount: 200,
      min_order: 2000,
      usage_count: 59,
      usage_limit: 100,
      expiry_date: "2026-10-31",
      is_active: true,
    },
    {
      id: 4,
      code: "FLASH30",
      type: "percent",
      percent: 30,
      discount: 30,
      min_order: 3500,
      usage_count: 50,
      usage_limit: 50,
      expiry_date: "2026-10-01",
      is_active: false,
    },
  ];

  const { coupons: storeCoupons, updateCoupons } = useStore();
  const [mounted, setMounted] = useState(false);
  const [coupons, setCoupons] = useState(initialCoupons);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && Array.isArray(storeCoupons)) {
      setCoupons(storeCoupons);
    }
  }, [mounted, storeCoupons]);

  function saveAndSyncCoupons(updated) {
    setCoupons(updated);
    if (typeof updateCoupons === "function") {
      updateCoupons(updated);
    }
  }

  // New coupon form state
  const [code, setCode] = useState("");
  const [type, setType] = useState("percent");
  const [discountValue, setDiscountValue] = useState("");
  const [minOrder, setMinOrder] = useState("");
  const [usageLimit, setUsageLimit] = useState("100");
  const [expiryDate, setExpiryDate] = useState("2026-12-31");

  function showToast(msg) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  }

  function handleCreateCoupon(e) {
    e.preventDefault();
    if (!code.trim() || !discountValue) return;

    const newCoupon = {
      id: Date.now(),
      code: code.trim().toUpperCase(),
      type,
      discount: Number(discountValue),
      percent: type === "percent" ? Number(discountValue) : undefined,
      min_order: Number(minOrder) || 0,
      usage_count: 0,
      usage_limit: Number(usageLimit) || 100,
      expiry_date: expiryDate,
      is_active: true,
    };

    const updated = [newCoupon, ...coupons];
    saveAndSyncCoupons(updated);
    setShowAddModal(false);
    setCode("");
    setDiscountValue("");
    setMinOrder("");
    showToast(`Coupon "${newCoupon.code}" created successfully!`);
  }

  function handleToggleStatus(id) {
    const updated = coupons.map((c) => {
      if (c.id === id) {
        const next = !c.is_active;
        showToast(`Coupon ${c.code} is now ${next ? "Active" : "Disabled"}`);
        return { ...c, is_active: next };
      }
      return c;
    });
    saveAndSyncCoupons(updated);
  }

  function handleDeleteCoupon(id) {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      const updated = coupons.filter((c) => c.id !== id);
      saveAndSyncCoupons(updated);
      showToast("Coupon removed.");
    }
  }

  function handleCopy(codeStr) {
    navigator.clipboard.writeText(codeStr);
    showToast(`Code "${codeStr}" copied to clipboard!`);
  }

  const filteredCoupons = coupons.filter((c) =>
    c.code.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

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
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Percent className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900">
              Coupons & Discounts
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Create discount codes, set minimum purchase thresholds, and monitor campaign redemptions.
          </p>
        </div>

        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-sm font-medium"
        >
          <PlusCircle className="w-4 h-4" />
          Create New Coupon
        </Button>
      </div>

      {/* Stats KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Coupons
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-1" suppressHydrationWarning>
              {coupons.filter((c) => c.is_active).length}
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Tag className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              Total Redemptions
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-1" suppressHydrationWarning>
              {coupons.reduce((acc, c) => acc + c.usage_count, 0)}
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
              Avg Min Order
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-1">৳1,500</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            ৳
          </div>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:w-80 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search coupon code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          <span className="text-xs text-slate-500">
            Showing <strong>{filteredCoupons.length}</strong> coupons
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-xs uppercase tracking-wider">
                <th className="py-3 px-4">Coupon Code</th>
                <th className="py-3 px-4">Discount Value</th>
                <th className="py-3 px-4">Minimum Order</th>
                <th className="py-3 px-4">Usage & Limit</th>
                <th className="py-3 px-4">Expires On</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCoupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Code */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                        {coupon.code}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(coupon.code)}
                        title="Copy Code"
                        className="text-slate-400 hover:text-indigo-600 p-1"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                  {/* Discount */}
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900">
                      {coupon.type === "percent"
                        ? `${coupon.discount}% OFF`
                        : coupon.type === "delivery"
                        ? "Free Delivery (৳100)"
                        : `৳${coupon.discount} Flat OFF`}
                    </span>
                  </td>

                  {/* Min Order */}
                  <td className="py-3.5 px-4 text-slate-600">
                    ৳{coupon.min_order.toLocaleString()}
                  </td>

                  {/* Usage */}
                  <td className="py-3.5 px-4">
                    <div className="w-36 space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-500">
                        <span>{coupon.usage_count} used</span>
                        <span>{coupon.usage_limit} max</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 rounded-full"
                          style={{
                            width: `${Math.min(
                              100,
                              (coupon.usage_count / coupon.usage_limit) * 100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Expiry */}
                  <td className="py-3.5 px-4 text-xs text-slate-500 font-mono">
                    {coupon.expiry_date}
                  </td>

                  {/* Status Toggle */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(coupon.id)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        coupon.is_active ? "bg-indigo-600" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                          coupon.is_active ? "translate-x-4" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleDeleteCoupon(coupon.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Coupon"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Create New Coupon Code"
        >
          <form onSubmit={handleCreateCoupon} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Coupon Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. SUMMER25, EIDBASH"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono uppercase font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Discount Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                >
                  <option value="percent">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (৳)</option>
                  <option value="delivery">Free Delivery</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Discount Value <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  placeholder={type === "percent" ? "15" : "200"}
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Min Order (৳)
                </label>
                <input
                  type="number"
                  placeholder="1000"
                  value={minOrder}
                  onChange={(e) => setMinOrder(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Usage Limit
                </label>
                <input
                  type="number"
                  placeholder="100"
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Expiry Date
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Create Coupon
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
