"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CouponInput } from "./CouponInput";
import { useCart } from "@/lib/cart/cart-context";
import { formatPrice } from "@/lib/format";
import { ArrowRight, ShieldCheck } from "lucide-react";

export function CartSummary() {
  const { subtotal, discount, total, items } = useCart();
  const isCartEmpty = items.length === 0;

  return (
    <div className="p-6 rounded-theme bg-surface border border-border/80 shadow-2xs space-y-6">
      <h3 className="text-base font-bold text-text uppercase tracking-wider pb-3 border-b border-border">
        Order Summary
      </h3>

      {/* Coupon promo code box */}
      <div>
        <CouponInput />
      </div>

      {/* Financial breakdown */}
      <div className="space-y-3 text-xs sm:text-sm text-text-muted border-t border-border pt-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-semibold text-text">{formatPrice(subtotal)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-emerald-600 font-medium">
            <span>Coupon Discount</span>
            <span>-{formatPrice(discount)}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span>Delivery Estimate</span>
          <span>Calculated at checkout</span>
        </div>

        <div className="flex justify-between text-base font-black text-text pt-3 border-t border-border">
          <span>Total</span>
          <span className="text-lg">{formatPrice(total)}</span>
        </div>
      </div>

      {/* Proceed to checkout button */}
      <Link href="/checkout" className="block">
        <Button
          variant="primary"
          size="lg"
          disabled={isCartEmpty}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="w-full font-bold shadow-md"
        >
          Proceed to Checkout
        </Button>
      </Link>

      <div className="flex items-center justify-center gap-2 text-center text-[11px] text-text-muted">
        <ShieldCheck className="w-4 h-4 text-secondary shrink-0" />
        <span>Cash on delivery guaranteed. Verified checkout.</span>
      </div>
    </div>
  );
}
