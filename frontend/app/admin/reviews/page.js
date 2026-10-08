"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  MessageSquare,
  Star,
  CheckCircle2,
  XCircle,
  Trash2,
  ShieldCheck,
  Search,
  Filter,
} from "lucide-react";

export default function AdminReviewsPage() {
  const initialReviews = [
    {
      id: 1,
      customer_name: "Tanvir Ahmed",
      verified_buyer: true,
      product_name: "Classic Supima Cotton Oxford Shirt",
      product_image:
        "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&auto=format&fit=crop&q=80",
      rating: 5,
      date: "2026-10-07",
      comment:
        "Fabric quality is top-notch! The cotton feels very breathable and comfortable in warm weather. Accurate fit and quick delivery.",
      status: "Approved",
    },
    {
      id: 2,
      customer_name: "Nusrat Jahan",
      verified_buyer: true,
      product_name: "Structured Italian Leather Tote Bag",
      product_image:
        "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&auto=format&fit=crop&q=80",
      rating: 5,
      date: "2026-10-06",
      comment:
        "Absolutely stunning bag! Fits my 14-inch MacBook easily along with daily essentials. Stitching and finishing are flawless.",
      status: "Approved",
    },
    {
      id: 3,
      customer_name: "Rafiqul Islam",
      verified_buyer: false,
      product_name: "Handcrafted Heritage Penny Loafer",
      product_image:
        "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=400&auto=format&fit=crop&q=80",
      rating: 4,
      date: "2026-10-08",
      comment:
        "The shoe looks premium and authentic leather. Slight break-in needed for size 42, but otherwise very satisfied.",
      status: "Pending",
    },
    {
      id: 4,
      customer_name: "Anika Tabassum",
      verified_buyer: true,
      product_name: "Minimalist Full-Grain Leather Bi-Fold Wallet",
      product_image:
        "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&auto=format&fit=crop&q=80",
      rating: 1,
      date: "2026-10-05",
      comment:
        "Color was slightly darker than pictured on website. Customer support resolved it with exchange though.",
      status: "Pending",
    },
  ];

  const [reviews, setReviews] = useState(initialReviews);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  function showToast(msg) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  }

  function handleApprove(id) {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Approved" } : r))
    );
    showToast("Review approved & published to storefront!");
  }

  function handleReject(id) {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Rejected" } : r))
    );
    showToast("Review rejected.");
  }

  function handleDelete(id) {
    if (window.confirm("Permanently delete this review?")) {
      setReviews((prev) => prev.filter((r) => r.id !== id));
      showToast("Review deleted.");
    }
  }

  const filtered = reviews.filter((r) => {
    const matchesTab = activeTab === "all" || r.status === activeTab;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      r.customer_name.toLowerCase().includes(query) ||
      r.product_name.toLowerCase().includes(query) ||
      r.comment.toLowerCase().includes(query);
    return matchesTab && matchesSearch;
  });

  const pendingCount = reviews.filter((r) => r.status === "Pending").length;

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
              <MessageSquare className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900">
              Reviews & Feedback Moderation
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Moderate customer product reviews, maintain verified ratings, and prevent spam.
          </p>
        </div>
      </div>

      {/* Stats KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Reviews
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{reviews.length}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
              Pending Approval
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{pendingCount}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Star className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              Store Rating
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-1">4.8 / 5.0</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            ★
          </div>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-200 bg-slate-50/50">
          {[
            { id: "all", label: "All Reviews" },
            { id: "Pending", label: `Pending (${pendingCount})` },
            { id: "Approved", label: "Approved" },
            { id: "Rejected", label: "Rejected" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 text-xs font-bold border-b-2 transition-all ${
                activeTab === tab.id
                  ? "border-indigo-600 text-indigo-600 bg-white"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="w-full sm:w-80 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search reviewer or product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>
          <span className="text-xs text-slate-500">
            Showing <strong>{filtered.length}</strong> items
          </span>
        </div>

        {/* Reviews List */}
        <div className="divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              No reviews matching criteria.
            </div>
          ) : (
            filtered.map((rev) => (
              <div
                key={rev.id}
                className="p-5 flex flex-col sm:flex-row items-start justify-between gap-4 hover:bg-slate-50/60 transition-colors"
              >
                {/* Left: Product & Review details */}
                <div className="flex items-start gap-4 min-w-0">
                  <img
                    src={rev.product_image}
                    alt={rev.product_name}
                    className="w-14 h-14 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 text-sm">
                        {rev.customer_name}
                      </span>
                      {rev.verified_buyer && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <ShieldCheck className="w-3 h-3" /> Verified Buyer
                        </span>
                      )}
                      <span className="text-xs text-slate-400">• {rev.date}</span>
                    </div>

                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-300"
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-xs font-medium text-slate-600 pt-0.5">
                      On <strong className="text-slate-800">{rev.product_name}</strong>
                    </p>

                    <p className="text-sm text-slate-700 pt-1 leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>
                </div>

                {/* Right: Moderation Actions */}
                <div className="flex sm:flex-col items-end justify-between gap-3 shrink-0 w-full sm:w-auto">
                  <Badge
                    variant={
                      rev.status === "Approved"
                        ? "success"
                        : rev.status === "Rejected"
                        ? "danger"
                        : "warning"
                    }
                  >
                    {rev.status}
                  </Badge>

                  <div className="flex items-center gap-2">
                    {rev.status !== "Approved" && (
                      <Button
                        size="sm"
                        onClick={() => handleApprove(rev.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8 px-3 gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                      </Button>
                    )}
                    {rev.status !== "Rejected" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReject(rev.id)}
                        className="text-xs h-8 px-3 text-amber-700 border-amber-300 hover:bg-amber-50"
                      >
                        Reject
                      </Button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDelete(rev.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
