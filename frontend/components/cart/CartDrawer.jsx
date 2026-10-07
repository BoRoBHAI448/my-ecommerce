"use client";

import Link from "next/link";
import Image from "next/image";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { QuantityStepper } from "./QuantityStepper";
import { useCart } from "@/lib/cart/cart-context";
import { formatPrice } from "@/lib/format";
import { Trash2, ArrowRight, ShoppingBag } from "lucide-react";

export function CartDrawer() {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeItem,
    subtotal,
    itemCount,
  } = useCart();

  return (
    <Drawer
      isOpen={isDrawerOpen}
      onClose={closeDrawer}
      title={`Shopping Cart (${itemCount})`}
      size="md"
    >
      <div className="flex flex-col h-full -mx-5 -my-4">
        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <EmptyState
              icon={ShoppingBag}
              title="Your bag is empty"
              description="Looks like you haven't added any products to your bag yet."
              actionLabel="Start Shopping"
              onAction={closeDrawer}
            />
          </div>
        ) : (
          <>
            {/* Scrollable Items List */}
            <div className="flex-1 overflow-y-auto px-5 py-4 divide-y divide-border">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId || "default"}`}
                  className="py-4 first:pt-0 last:pb-0 flex gap-4"
                >
                  {/* Thumbnail */}
                  <div className="relative w-20 h-20 rounded-theme bg-muted overflow-hidden shrink-0 border border-border">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-text-muted text-xs">
                        No img
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <Link
                          href={`/product/${item.slug}`}
                          onClick={closeDrawer}
                          className="text-xs sm:text-sm font-semibold text-text hover:text-secondary line-clamp-1 transition-colors"
                        >
                          {item.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeItem(item.productId, item.variantId)}
                          className="text-text-muted hover:text-danger p-1 transition-colors rounded-theme"
                          aria-label={`Remove ${item.name} from bag`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {item.variantLabel && (
                        <p className="text-xs text-text-muted mt-0.5">
                          {item.variantLabel}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                      <QuantityStepper
                        quantity={item.quantity}
                        onChange={(newQty) =>
                          updateQuantity(item.productId, item.variantId, newQty)
                        }
                        size="sm"
                      />
                      <div className="text-right">
                        <span className="text-xs sm:text-sm font-bold text-text">
                          {formatPrice(Number(item.price) * item.quantity)}
                        </span>
                        {item.quantity > 1 && (
                          <div className="text-[10px] text-text-muted">
                            {formatPrice(item.price)} each
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Sticky Summary & Checkout Action */}
            <div className="border-t border-border p-5 bg-muted/40 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">Subtotal</span>
                <span className="font-extrabold text-base text-text">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <p className="text-[11px] text-text-muted">
                Taxes and delivery charges calculated at checkout.
              </p>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link href="/cart" onClick={closeDrawer} className="w-full">
                  <Button variant="outline" className="w-full">
                    View Cart
                  </Button>
                </Link>
                <Link href="/checkout" onClick={closeDrawer} className="w-full">
                  <Button
                    variant="primary"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    className="w-full"
                  >
                    Checkout
                  </Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </Drawer>
  );
}
