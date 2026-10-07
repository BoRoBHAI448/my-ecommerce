"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { useCart } from "@/lib/cart/cart-context";
import { useStore } from "@/lib/store-context";
import { formatPrice } from "@/lib/format";
import { isValidBDPhone } from "@/lib/validators";
import { ShieldCheck, Truck, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, discount, clearCart, isHydrated } = useCart();
  const store = useStore();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    zone: "inside_dhaka",
    address: "",
    district: "Dhaka",
    note: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Delivery charge calculation based on store settings
  const deliveryCharge =
    form.zone === "inside_dhaka"
      ? store?.delivery_settings?.inside_dhaka || 70
      : form.zone === "sub_dhaka"
      ? store?.delivery_settings?.sub_dhaka || 100
      : store?.delivery_settings?.outside_dhaka || 130;

  // Free delivery threshold check
  const isFreeDelivery =
    store?.delivery_settings?.free_delivery_threshold &&
    subtotal >= store.delivery_settings.free_delivery_threshold;

  const appliedDeliveryFee = isFreeDelivery ? 0 : deliveryCharge;
  const grandTotal = Math.max(0, subtotal - discount + appliedDeliveryFee);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  }

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = "Full name is required";
    if (!form.phone.trim()) {
      errs.phone = "Phone number is required";
    } else if (!isValidBDPhone(form.phone)) {
      errs.phone = "Please enter a valid 11-digit mobile number (e.g. 017XXXXXXXX)";
    }
    if (!form.address.trim()) errs.address = "Detailed delivery address is required";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleOrderSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    // Simulate placing order
    setTimeout(() => {
      setSubmitting(false);
      const generatedOrderNumber = `APX-${Date.now().toString().slice(-6)}`;

      // Save order snapshot in sessionStorage for success/tracking screens
      const orderData = {
        orderNumber: generatedOrderNumber,
        customer: form,
        items,
        subtotal,
        discount,
        deliveryFee: appliedDeliveryFee,
        total: grandTotal,
        paymentMethod: "Cash on Delivery",
        status: "Pending",
        createdAt: new Date().toISOString(),
      };

      try {
        sessionStorage.setItem(`order_${generatedOrderNumber}`, JSON.stringify(orderData));
      } catch (err) {
        // Safe fallback
      }

      clearCart();
      router.push(`/order-success/${generatedOrderNumber}`);
    }, 800);
  }

  if (!isHydrated) return null;

  if (items.length === 0) {
    return (
      <div className="container-custom py-16 text-center max-w-md mx-auto space-y-4">
        <h2 className="text-xl font-bold text-text">Your bag is empty</h2>
        <p className="text-xs sm:text-sm text-text-muted">
          You don&apos;t have any products in your bag to checkout.
        </p>
        <Link href="/shop">
          <Button variant="primary">Return to Shop</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container-custom py-4 sm:py-8">
      <Breadcrumbs
        items={[{ label: "Shopping Bag", href: "/cart" }, { label: "Checkout" }]}
      />

      <div className="py-2 mb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-text tracking-tight">
          Secure Checkout
        </h1>
        <p className="text-xs sm:text-sm text-text-muted mt-0.5">
          Complete your delivery details to place your order with Cash on Delivery
        </p>
      </div>

      <form onSubmit={handleOrderSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Form Fields Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Details Box */}
            <div className="p-6 rounded-theme bg-surface border border-border/80 shadow-2xs space-y-4">
              <h2 className="text-sm font-bold text-text uppercase tracking-wider pb-2 border-b border-border">
                1. Contact & Customer Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  placeholder="e.g. Asif Mahmud"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  error={errors.name}
                  required
                />
                <Input
                  label="Mobile Number (01XXXXXXXXX)"
                  placeholder="01712345678"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  error={errors.phone}
                  required
                />
              </div>

              <Input
                label="Email Address (Optional)"
                placeholder="asif@example.com"
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                helperText="We will send invoice and tracking updates to this email."
              />
            </div>

            {/* Shipping Address Box */}
            <div className="p-6 rounded-theme bg-surface border border-border/80 shadow-2xs space-y-4">
              <h2 className="text-sm font-bold text-text uppercase tracking-wider pb-2 border-b border-border">
                2. Delivery Destination
              </h2>

              <div className="space-y-3">
                <label className="block text-xs font-semibold text-text uppercase tracking-wider">
                  Select Delivery Zone:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => handleChange("zone", "inside_dhaka")}
                    className={`p-3 rounded-theme border text-left transition-all ${
                      form.zone === "inside_dhaka"
                        ? "border-primary bg-primary/5 text-primary font-bold shadow-xs"
                        : "border-border text-text hover:bg-muted"
                    }`}
                  >
                    <div className="text-xs font-bold">Inside Dhaka</div>
                    <div className="text-[11px] text-text-muted mt-0.5">
                      {isFreeDelivery ? "FREE" : `৳${store?.delivery_settings?.inside_dhaka || 70}`} (24-48h)
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleChange("zone", "sub_dhaka")}
                    className={`p-3 rounded-theme border text-left transition-all ${
                      form.zone === "sub_dhaka"
                        ? "border-primary bg-primary/5 text-primary font-bold shadow-xs"
                        : "border-border text-text hover:bg-muted"
                    }`}
                  >
                    <div className="text-xs font-bold">Dhaka Suburbs</div>
                    <div className="text-[11px] text-text-muted mt-0.5">
                      {isFreeDelivery ? "FREE" : `৳${store?.delivery_settings?.sub_dhaka || 100}`} (2-3 days)
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleChange("zone", "outside_dhaka")}
                    className={`p-3 rounded-theme border text-left transition-all ${
                      form.zone === "outside_dhaka"
                        ? "border-primary bg-primary/5 text-primary font-bold shadow-xs"
                        : "border-border text-text hover:bg-muted"
                    }`}
                  >
                    <div className="text-xs font-bold">Outside Dhaka</div>
                    <div className="text-[11px] text-text-muted mt-0.5">
                      {isFreeDelivery ? "FREE" : `৳${store?.delivery_settings?.outside_dhaka || 130}`} (3-4 days)
                    </div>
                  </button>
                </div>
              </div>

              <Input
                label="Full Address (House, Road, Area/Thana)"
                placeholder="House 12, Road 4, Sector 7, Uttara, Dhaka"
                value={form.address}
                onChange={(e) => handleChange("address", e.target.value)}
                error={errors.address}
                required
              />

              <div>
                <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-1.5">
                  Order Notes / Delivery Instructions (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Please call before arriving or deliver between 2 PM - 5 PM"
                  value={form.note}
                  onChange={(e) => handleChange("note", e.target.value)}
                  className="w-full p-2.5 rounded-theme border border-border bg-surface text-xs text-text placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* Payment Method Box */}
            <div className="p-6 rounded-theme bg-surface border border-border/80 shadow-2xs space-y-3">
              <h2 className="text-sm font-bold text-text uppercase tracking-wider pb-2 border-b border-border">
                3. Payment Method
              </h2>

              <div className="flex items-center justify-between p-3.5 rounded-theme border-2 border-primary bg-primary/5">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-4 border-primary bg-white shrink-0" />
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-text">
                      Cash on Delivery (COD)
                    </span>
                    <p className="text-[11px] text-text-muted mt-0.5">
                      Pay cash to delivery rider when parcel is delivered to your door.
                    </p>
                  </div>
                </div>
                <Truck className="w-5 h-5 text-primary shrink-0" />
              </div>
            </div>
          </div>

          {/* Sticky Order Summary Column */}
          <div className="lg:col-span-1 sticky top-28 space-y-4">
            <div className="p-6 rounded-theme bg-surface border border-border/80 shadow-2xs space-y-5">
              <h3 className="text-sm font-bold text-text uppercase tracking-wider pb-3 border-b border-border">
                Order Review ({items.length} items)
              </h3>

              {/* Items summary preview */}
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1 divide-y divide-border/60">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.variantId || "default"}`}
                    className="pt-2 first:pt-0 flex items-center gap-3 text-xs"
                  >
                    <div className="relative w-12 h-12 rounded bg-muted overflow-hidden shrink-0 border border-border">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-text truncate">{item.name}</p>
                      <p className="text-[11px] text-text-muted">
                        Qty: {item.quantity} {item.variantLabel && `• ${item.variantLabel}`}
                      </p>
                    </div>
                    <span className="font-bold text-text whitespace-nowrap">
                      {formatPrice(Number(item.price) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Cost Calculations */}
              <div className="space-y-2.5 text-xs text-text-muted border-t border-border pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-text">{formatPrice(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span className="font-semibold text-text">
                    {appliedDeliveryFee === 0 ? "FREE" : formatPrice(appliedDeliveryFee)}
                  </span>
                </div>

                <div className="flex justify-between text-base font-black text-text border-t border-border pt-3">
                  <span>Total Amount</span>
                  <span className="text-lg">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Confirm Order Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={submitting}
                className="w-full font-bold shadow-md h-12"
              >
                Place Order (COD)
              </Button>

              <div className="flex items-center justify-center gap-2 text-center text-[11px] text-text-muted">
                <ShieldCheck className="w-4 h-4 text-secondary shrink-0" />
                <span>Your information is encrypted & secure.</span>
              </div>
            </div>

            <Link
              href="/cart"
              className="inline-flex items-center gap-2 text-xs font-bold text-text-muted hover:text-text"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Modify Cart Items</span>
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
