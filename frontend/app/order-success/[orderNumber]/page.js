"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/format";
import { CheckCircle2, PackageCheck, Truck, ArrowRight, Home } from "lucide-react";

export default function OrderSuccessPage({ params }) {
  const unwrappedParams = use(params);
  const orderNumber = unwrappedParams.orderNumber;
  const [order, setOrder] = useState(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(`order_${orderNumber}`);
      if (stored) {
        setOrder(JSON.parse(stored));
      }
    } catch (e) {
      // Ignore
    }
  }, [orderNumber]);

  return (
    <div className="container-custom py-12 sm:py-16 max-w-2xl text-center space-y-8">
      {/* Success Badge */}
      <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
        <CheckCircle2 className="w-9 h-9" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold text-secondary tracking-widest uppercase">
          Thank you for your order!
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-text tracking-tight">
          Your Order Has Been Placed
        </h1>
        <p className="text-xs sm:text-sm text-text-muted max-w-md mx-auto">
          We have received your order and our fulfillment team is preparing it. We will notify you when it ships.
        </p>
      </div>

      {/* Order Info Card */}
      <div className="p-6 rounded-theme bg-surface border border-border/80 shadow-2xs text-left space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-2">
          <div>
            <span className="text-[11px] text-text-muted uppercase font-bold tracking-wider">
              Order Reference
            </span>
            <p className="font-mono text-base font-extrabold text-text mt-0.5">
              {orderNumber}
            </p>
          </div>
          <div>
            <span className="text-[11px] text-text-muted uppercase font-bold tracking-wider">
              Payment Method
            </span>
            <p className="text-xs sm:text-sm font-semibold text-text mt-0.5">
              {order?.paymentMethod || "Cash on Delivery (COD)"}
            </p>
          </div>
        </div>

        {/* Customer & Address if available */}
        {order?.customer && (
          <div className="text-xs text-text-muted space-y-1 pb-4 border-b border-border">
            <p className="font-semibold text-text">Deliver To: {order.customer.name}</p>
            <p>Phone: {order.customer.phone}</p>
            <p>Address: {order.customer.address}</p>
          </div>
        )}

        {/* Total Summary */}
        <div className="flex justify-between items-center text-sm font-bold text-text pt-1">
          <span>Amount to Pay on Delivery:</span>
          <span className="text-lg text-primary font-black">
            {formatPrice(order?.total || 0)}
          </span>
        </div>
      </div>

      {/* What Happens Next Guide */}
      <div className="p-6 rounded-theme bg-muted/40 border border-border/80 text-left space-y-4">
        <h3 className="text-xs font-bold text-text uppercase tracking-wider">
          What happens next?
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-text-muted">
          <div className="flex items-start gap-3">
            <PackageCheck className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
            <div>
              <strong className="text-text block mb-0.5">Order Confirmation</strong>
              Our customer representative may call you shortly to confirm your delivery address.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Truck className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
            <div>
              <strong className="text-text block mb-0.5">Rider Dispatch</strong>
              Your parcel will be handed to our courier partner for fast delivery.
            </div>
          </div>
        </div>
      </div>

      {/* Action Links */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <Link href={`/track-order?order=${orderNumber}`}>
          <Button variant="outline" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Track Order Status
          </Button>
        </Link>
        <Link href="/shop">
          <Button variant="primary" size="md" leftIcon={<Home className="w-4 h-4" />}>
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
}
