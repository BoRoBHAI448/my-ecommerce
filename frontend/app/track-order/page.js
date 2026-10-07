"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatPrice } from "@/lib/format";
import {
  Search,
  Package,
  CheckCircle,
  Truck,
  Home,
  Clock,
  AlertCircle,
} from "lucide-react";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialOrder = searchParams.get("order") || "";

  const [orderNumber, setOrderNumber] = useState(initialOrder);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (initialOrder) {
      handleSearch(initialOrder);
    }
  }, [initialOrder]);

  function handleSearch(targetOrderNumber) {
    const numToSearch = targetOrderNumber || orderNumber;
    if (!numToSearch) return;

    setLoading(true);
    setSearched(true);

    setTimeout(() => {
      setLoading(false);

      // Check session storage first
      try {
        const stored = sessionStorage.getItem(`order_${numToSearch}`);
        if (stored) {
          setResult(JSON.parse(stored));
          return;
        }
      } catch (e) {
        // Fallback
      }

      // If not in session, generate mock track order response
      setResult({
        orderNumber: numToSearch,
        status: "Processing",
        createdAt: "2026-10-06T10:30:00Z",
        total: 2950,
        customer: {
          name: "Customer",
          address: "Dhaka, Bangladesh",
        },
        items: [
          { name: "Classic Supima Cotton Oxford Shirt", quantity: 1, price: 1850 },
          { name: "Leather Bi-Fold Wallet", quantity: 1, price: 1100 },
        ],
      });
    }, 600);
  }

  const steps = [
    { title: "Order Placed", desc: "We received your order", icon: Clock, done: true },
    { title: "Confirmed", desc: "Verified by our staff", icon: CheckCircle, done: true },
    { title: "Processing", desc: "Packed at our warehouse", icon: Package, done: result?.status !== "Pending" },
    { title: "Shipped", desc: "Handed over to delivery courier", icon: Truck, done: ["Shipped", "Delivered"].includes(result?.status) },
    { title: "Delivered", desc: "Delivered to your doorstep", icon: Home, done: result?.status === "Delivered" },
  ];

  return (
    <div className="container-custom py-4 sm:py-8 max-w-3xl">
      <Breadcrumbs items={[{ label: "Track Order" }]} />

      <div className="py-2 mb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-text tracking-tight">
          Track Your Order
        </h1>
        <p className="text-xs sm:text-sm text-text-muted mt-0.5">
          Enter your order reference number and mobile number to see real-time delivery status
        </p>
      </div>

      {/* Search Input Box */}
      <div className="p-6 rounded-theme bg-surface border border-border/80 shadow-2xs mb-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch(orderNumber);
          }}
          className="grid grid-cols-1 sm:grid-cols-5 gap-3"
        >
          <div className="sm:col-span-3">
            <Input
              placeholder="Order Number (e.g. APX-123456)"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              required
            />
          </div>
          <div className="sm:col-span-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={loading}
              leftIcon={<Search className="w-4 h-4" />}
              className="w-full font-bold h-10"
            >
              Track Order
            </Button>
          </div>
        </form>
      </div>

      {/* Result Section */}
      {searched && (
        result ? (
          <div className="space-y-6 animate-in fade-in">
            {/* Summary Card */}
            <div className="p-6 rounded-theme bg-surface border border-border/80 shadow-2xs">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border">
                <div>
                  <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                    Status
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
                    <span className="text-base font-extrabold text-text">
                      {result.status || "In Transit"}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                    Order Reference
                  </span>
                  <p className="font-mono text-sm font-bold text-text mt-1">
                    {result.orderNumber}
                  </p>
                </div>
              </div>

              {/* Progress Timeline */}
              <div className="py-8">
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 sm:gap-2">
                  {steps.map((st, i) => {
                    const Icon = st.icon;
                    return (
                      <div key={i} className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                            st.done
                              ? "bg-secondary text-secondary-contrast shadow-xs"
                              : "bg-muted text-text-muted/60"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className={`text-xs font-bold ${st.done ? "text-text" : "text-text-muted/60"}`}>
                            {st.title}
                          </p>
                          <p className="text-[10px] text-text-muted line-clamp-1">
                            {st.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Item Details */}
              {result.items?.length > 0 && (
                <div className="border-t border-border pt-4">
                  <h4 className="text-xs font-bold text-text uppercase tracking-wider mb-2">
                    Items in this parcel
                  </h4>
                  <div className="space-y-1.5 text-xs text-text-muted">
                    {result.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>{it.quantity}x {it.name}</span>
                        <span className="font-semibold text-text">{formatPrice(it.price * it.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-8 rounded-theme bg-surface border border-dashed border-border text-center">
            <AlertCircle className="w-8 h-8 text-text-muted mx-auto mb-2" />
            <h3 className="text-sm font-bold text-text">No order found</h3>
            <p className="text-xs text-text-muted mt-1">
              Please double check the order reference number or contact support on WhatsApp.
            </p>
          </div>
        )
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="container-custom py-12 text-center text-xs">Loading tracker...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
