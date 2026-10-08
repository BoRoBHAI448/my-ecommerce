"use client";

import Link from "next/link";
import Image from "next/image";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { QuantityStepper } from "@/components/cart/QuantityStepper";
import { CartSummary } from "@/components/cart/CartSummary";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/lib/cart/cart-context";
import { formatPrice } from "@/lib/format";
import { getValidImageSrc } from "@/lib/utils";
import { Trash2, ShoppingBag, ArrowLeft } from "lucide-react";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, isHydrated } = useCart();

  if (!isHydrated) {
    return (
      <div className="container-custom py-12 text-center text-sm text-text-muted">
        Loading cart...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-custom py-8 sm:py-16">
        <Breadcrumbs items={[{ label: "Shopping Bag" }]} />
        <div className="max-w-md mx-auto my-8">
          <EmptyState
            icon={ShoppingBag}
            title="Your Shopping Bag is Empty"
            description="Explore our collection and add your favorite items to continue."
            actionLabel="Continue Shopping"
            actionHref="/shop"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-4 sm:py-8">
      <Breadcrumbs items={[{ label: "Shopping Bag" }]} />

      <div className="flex items-center justify-between py-2 mb-6 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-text tracking-tight">
            Shopping Bag
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-0.5">
            Review your chosen items before proceeding to checkout
          </p>
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="text-xs text-text-muted hover:text-danger font-semibold transition-colors"
        >
          Clear Bag
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart Line Items Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="divide-y divide-border rounded-theme border border-border/80 bg-surface shadow-2xs overflow-hidden">
            {items.map((item) => {
              const imgUrl = getValidImageSrc(item.image);

              return (
                <div
                  key={`${item.productId}-${item.variantId || "default"}`}
                  className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  {/* Thumbnail & Title */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-theme bg-muted overflow-hidden shrink-0 border border-border">
                      {imgUrl ? (
                        <Image
                          src={imgUrl}
                          alt={item.name}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-text-muted">
                          No image
                        </div>
                      )}
                    </div>

                    <div>
                      <Link
                        href={`/product/${item.slug}`}
                        className="text-sm sm:text-base font-bold text-text hover:text-secondary transition-colors line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      {item.variantLabel && (
                        <p className="text-xs text-text-muted mt-0.5">
                          Variant: <span className="font-semibold text-text">{item.variantLabel}</span>
                        </p>
                      )}
                      <p className="text-xs sm:text-sm font-bold text-text mt-1 sm:hidden">
                        {formatPrice(item.price)} each
                      </p>
                    </div>
                  </div>

                  {/* Controls & Price */}
                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 sm:gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/60">
                    <QuantityStepper
                      quantity={item.quantity}
                      onChange={(q) =>
                        updateQuantity(item.productId, item.variantId, q)
                      }
                      size="sm"
                    />

                    <div className="text-right min-w-20">
                      <span className="text-sm sm:text-base font-black text-text">
                        {formatPrice(Number(item.price) * item.quantity)}
                      </span>
                      {item.quantity > 1 && (
                        <div className="text-[10px] text-text-muted hidden sm:block">
                          {formatPrice(item.price)} / unit
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.productId, item.variantId)}
                      className="p-2 text-text-muted hover:text-danger rounded-theme hover:bg-muted transition-colors"
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-xs font-bold text-secondary hover:underline uppercase tracking-wider"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Order Summary Sticky Column */}
        <div className="lg:col-span-1 sticky top-28">
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
