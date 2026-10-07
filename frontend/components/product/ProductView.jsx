"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Gallery } from "./Gallery";
import { VariantPicker } from "./VariantPicker";
import { QuantityStepper } from "@/components/cart/QuantityStepper";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Rating } from "@/components/ui/Rating";
import { useCart } from "@/lib/cart/cart-context";
import { useStore } from "@/lib/store-context";
import { formatPrice, getDiscountPercentage } from "@/lib/format";
import {
  ShoppingBag,
  Zap,
  MessageCircle,
  Truck,
  RotateCcw,
  ShieldCheck,
  Check,
} from "lucide-react";

export function ProductView({ product }) {
  const router = useRouter();
  const { addItem } = useCart();
  const store = useStore();

  // Initial selected attributes based on first variant or option
  const initialAttributes = useMemo(() => {
    if (product.variants?.length > 0) {
      return product.variants[0].attributes || {};
    }
    const attrs = {};
    product.options?.forEach((opt) => {
      if (opt.values?.length > 0) {
        attrs[opt.name] = opt.values[0];
      }
    });
    return attrs;
  }, [product]);

  const [selectedAttributes, setSelectedAttributes] = useState(initialAttributes);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  // Determine active variant based on chosen attributes
  const activeVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) return null;
    return (
      product.variants.find((v) =>
        Object.entries(selectedAttributes).every(
          ([key, val]) => v.attributes[key] === val
        )
      ) || product.variants[0]
    );
  }, [product.variants, selectedAttributes]);

  // Dynamic pricing
  const currentPrice =
    activeVariant?.discount_price ||
    activeVariant?.selling_price ||
    product.discount_price ||
    product.min_price ||
    product.selling_price;

  const originalPrice =
    activeVariant?.discount_price
      ? activeVariant.selling_price
      : product.has_discount
      ? product.selling_price || product.max_price
      : null;

  const discountLabel = getDiscountPercentage(originalPrice, currentPrice);
  const isInStock = activeVariant ? activeVariant.in_stock : product.in_stock;
  const stockQuantity = activeVariant?.stock_quantity ?? 10;

  function handleAttributeSelect(groupName, value) {
    setSelectedAttributes((prev) => ({
      ...prev,
      [groupName]: value,
    }));
  }

  function handleAddToCart() {
    if (!isInStock) return;

    const variantLabel = activeVariant?.attributes
      ? Object.values(activeVariant.attributes).join(" / ")
      : null;

    addItem({
      productId: product.id,
      variantId: activeVariant?.id || null,
      variantLabel,
      name: product.name,
      slug: product.slug,
      image: product.image,
      price: currentPrice,
      originalPrice,
      quantity,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleBuyNow() {
    handleAddToCart();
    router.push("/checkout");
  }

  // WhatsApp Product Link
  const whatsappUrl = useMemo(() => {
    if (!store?.whatsapp) return null;
    const cleanNum = store.whatsapp.replace(/[^0-9]/g, "");
    const msg = encodeURIComponent(
      `Hello ${store.name || "Store"}, I'm interested in "${product.name}" (SKU: ${activeVariant?.sku || product.id}). Is it available?`
    );
    return `https://wa.me/${cleanNum}?text=${msg}`;
  }, [store, product, activeVariant]);

  return (
    <div className="py-4">
      {/* 2-Column Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Left: Gallery */}
        <div>
          <Gallery images={product.images || [product.image]} title={product.name} />
        </div>

        {/* Right: Product Details & Purchase Form */}
        <div className="space-y-6">
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-xs text-text-muted gap-2">
            <div className="flex items-center gap-2">
              {product.brand?.name && (
                <span className="font-bold text-text uppercase tracking-widest">
                  {product.brand.name}
                </span>
              )}
              {product.category?.name && (
                <>
                  <span>•</span>
                  <span>{product.category.name}</span>
                </>
              )}
            </div>
            {product.rating > 0 && (
              <Rating value={product.rating} count={product.review_count} size="sm" />
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-black text-text tracking-tight leading-snug">
            {product.name}
          </h1>

          {/* Pricing Row */}
          <div className="flex items-baseline gap-3 pb-4 border-b border-border/80">
            <span className="text-2xl sm:text-3xl font-black text-text">
              {formatPrice(currentPrice)}
            </span>
            {originalPrice && originalPrice > currentPrice && (
              <>
                <span className="text-base sm:text-lg text-text-muted line-through">
                  {formatPrice(originalPrice)}
                </span>
                {discountLabel && (
                  <Badge variant="sale" size="md">
                    {discountLabel}
                  </Badge>
                )}
              </>
            )}
          </div>

          {/* Stock Status Indicator */}
          <div className="flex items-center gap-2 text-xs">
            {isInStock ? (
              stockQuantity <= 5 ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  Only {stockQuantity} items left in stock
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  In Stock & Ready to Ship
                </span>
              )
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-100 text-red-900 font-semibold">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                Currently Out of Stock
              </span>
            )}

            {activeVariant?.sku && (
              <span className="text-text-muted ml-auto font-mono text-[11px]">
                SKU: {activeVariant.sku}
              </span>
            )}
          </div>

          {/* Variant Selector */}
          {product.options?.length > 0 && (
            <div className="pt-2">
              <VariantPicker
                options={product.options}
                variants={product.variants}
                selectedAttributes={selectedAttributes}
                onSelect={handleAttributeSelect}
              />
            </div>
          )}

          {/* Quantity & CTA Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-text uppercase tracking-wider">
                Qty:
              </span>
              <QuantityStepper
                quantity={quantity}
                max={stockQuantity}
                onChange={setQuantity}
                disabled={!isInStock}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Button
                type="button"
                variant="primary"
                size="lg"
                disabled={!isInStock}
                onClick={handleAddToCart}
                leftIcon={added ? <Check className="w-5 h-5 text-emerald-400" /> : <ShoppingBag className="w-5 h-5" />}
                className="w-full font-bold shadow-md"
              >
                {added ? "Added to Bag!" : "Add to Cart"}
              </Button>

              <Button
                type="button"
                variant="secondary"
                size="lg"
                disabled={!isInStock}
                onClick={handleBuyNow}
                leftIcon={<Zap className="w-5 h-5" />}
                className="w-full font-bold shadow-md"
              >
                Buy It Now
              </Button>
            </div>

            {/* Ask on WhatsApp */}
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-theme border border-[#25D366]/40 text-[#128C7E] hover:bg-[#25D366]/10 text-xs font-bold transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>Ask questions about this product on WhatsApp</span>
              </a>
            )}
          </div>

          {/* Quick Confidence Strip */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border/80 text-[11px] text-text-muted text-center">
            <div className="flex flex-col items-center gap-1 p-2">
              <Truck className="w-4 h-4 text-secondary" />
              <span>Fast 24-48h Delivery</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-2">
              <ShieldCheck className="w-4 h-4 text-secondary" />
              <span>Cash on Delivery</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-2">
              <RotateCcw className="w-4 h-4 text-secondary" />
              <span>7-Day Return</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Information Tabs */}
      <div className="mt-14 pt-8 border-t border-border">
        {/* Tabs Bar */}
        <div className="flex items-center gap-6 border-b border-border">
          <button
            type="button"
            onClick={() => setActiveTab("description")}
            className={`pb-3 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 -mb-px ${
              activeTab === "description"
                ? "border-primary text-text"
                : "border-transparent text-text-muted hover:text-text"
            }`}
          >
            Description
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("delivery")}
            className={`pb-3 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 -mb-px ${
              activeTab === "delivery"
                ? "border-primary text-text"
                : "border-transparent text-text-muted hover:text-text"
            }`}
          >
            Delivery & Returns
          </button>
        </div>

        {/* Tab Content */}
        <div className="py-6 text-sm text-text-muted leading-relaxed max-w-3xl">
          {activeTab === "description" ? (
            <div className="space-y-4">
              <p>{product.description}</p>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li>Premium grade materials and high-density finish</li>
                <li>Designed for long-lasting comfort and durability</li>
                <li>Care: gentle wash or professional dry clean</li>
              </ul>
            </div>
          ) : (
            <div className="space-y-3 text-xs">
              <p>
                <strong className="text-text">Delivery Timeline:</strong> Orders inside Dhaka are delivered within 24 to 48 hours. Orders outside Dhaka take 2 to 4 working days.
              </p>
              <p>
                <strong className="text-text">Return & Exchange:</strong> You may exchange or return any unworn, unwashed product within 7 days of delivery with original tags attached.
              </p>
              <p>
                <strong className="text-text">Payment:</strong> We accept Cash on Delivery (COD) everywhere in Bangladesh.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
