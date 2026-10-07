"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/lib/cart/cart-context";
import { mockCoupons } from "@/lib/api/mock/data";
import { Tag, Check, X } from "lucide-react";

export function CouponInput() {
  const { coupon, applyCoupon, removeCoupon, subtotal } = useCart();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleApply(e) {
    e.preventDefault();
    setError("");
    if (!code.trim()) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const cleanCode = code.trim().toUpperCase();
      const match = mockCoupons.find((c) => c.code === cleanCode);

      if (!match) {
        setError("Invalid discount code. Try FREEDEL or SAVE10.");
        return;
      }

      if (match.min_order && subtotal < match.min_order) {
        setError(`This coupon requires a minimum subtotal of ৳${match.min_order}.`);
        return;
      }

      applyCoupon(match);
      setCode("");
    }, 400);
  }

  if (coupon) {
    return (
      <div className="flex items-center justify-between p-3 rounded-theme bg-emerald-50 border border-emerald-200 text-xs">
        <div className="flex items-center gap-2 text-emerald-800">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>
            Code <strong>{coupon.code}</strong> applied ({coupon.type === "percent" ? `${coupon.percent}% off` : `৳${coupon.amount || coupon.discount} off`})
          </span>
        </div>
        <button
          type="button"
          onClick={removeCoupon}
          className="text-text-muted hover:text-danger p-1"
          aria-label="Remove coupon"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <form onSubmit={handleApply} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Promo code (e.g. FREEDEL)"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              if (error) setError("");
            }}
            className="w-full h-10 pl-8 pr-3 rounded-theme border border-border bg-surface text-xs text-text placeholder:text-text-muted uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-primary font-medium"
          />
          <Tag className="w-3.5 h-3.5 text-text-muted absolute left-2.5 top-3.5 pointer-events-none" />
        </div>
        <Button
          type="submit"
          variant="outline"
          size="md"
          isLoading={loading}
          disabled={!code.trim()}
          className="text-xs shrink-0 font-bold"
        >
          Apply
        </Button>
      </form>

      {error && <p className="text-xs text-danger font-medium">{error}</p>}
    </div>
  );
}
