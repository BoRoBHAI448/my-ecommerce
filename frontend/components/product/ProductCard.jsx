"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { Rating } from "@/components/ui/Rating";
import { formatPrice, getDiscountPercentage } from "@/lib/format";
import { useCart } from "@/lib/cart/cart-context";
import { getValidImageSrc } from "@/lib/utils";
import { ShoppingBag, Check } from "lucide-react";
import { useState } from "react";

export function ProductCard({ product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const currentPrice = product.discount_price || product.min_price || product.selling_price;
  const originalPrice = product.has_discount ? product.selling_price || product.max_price : null;
  const discountLabel = getDiscountPercentage(originalPrice, currentPrice);
  const imageSrc = getValidImageSrc(product.image || product.images?.[0]);

  function handleQuickAdd(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!product.in_stock) return;

    // Pick first variant if present
    const firstVariant = product.variants?.[0];

    addItem({
      productId: product.id,
      variantId: firstVariant?.id || null,
      variantLabel: firstVariant?.attributes
        ? Object.values(firstVariant.attributes).join(" / ")
        : null,
      name: product.name,
      slug: product.slug,
      image: imageSrc,
      price: currentPrice,
      originalPrice: originalPrice,
      quantity: 1,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="group relative flex flex-col h-full bg-surface rounded-theme border border-border/80 overflow-hidden shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-300">
      {/* Product Image Frame */}
      <Link
        href={`/product/${product.slug}`}
        className="relative block w-full aspect-square bg-muted/60 overflow-hidden"
      >
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-muted text-xs font-medium">
            No image
          </div>
        )}

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.has_discount && discountLabel && (
            <Badge variant="sale" size="sm">
              {discountLabel}
            </Badge>
          )}
          {!product.in_stock && (
            <Badge variant="default" size="sm" className="bg-slate-900/80 text-white backdrop-blur-xs">
              Out of stock
            </Badge>
          )}
          {product.is_featured && product.in_stock && !product.has_discount && (
            <Badge variant="new" size="sm">
              Featured
            </Badge>
          )}
        </div>

        {/* Quick Add Button (Hover on Desktop, Always Visible on Mobile) */}
        {product.in_stock && (
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={added}
            aria-label={`Add ${product.name} to cart`}
            className="absolute bottom-2.5 right-2.5 z-10 p-2.5 rounded-full bg-primary text-primary-contrast shadow-md hover:bg-primary-hover active:scale-95 transition-all duration-200 lg:opacity-0 lg:group-hover:opacity-100 lg:translate-y-2 lg:group-hover:translate-y-0"
          >
            {added ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <ShoppingBag className="w-4 h-4" />
            )}
          </button>
        )}
      </Link>

      {/* Product Information */}
      <div className="flex-1 flex flex-col p-3.5 sm:p-4">
        {/* Category & Brand info */}
        <div className="flex items-center justify-between text-[11px] text-text-muted mb-1.5 gap-2">
          {product.category?.name && (
            <span className="uppercase tracking-wider font-medium truncate">
              {product.category.name}
            </span>
          )}
          {product.rating > 0 && (
            <Rating value={product.rating} size="sm" />
          )}
        </div>

        {/* Product Title */}
        <Link
          href={`/product/${product.slug}`}
          className="text-xs sm:text-sm font-semibold text-text hover:text-secondary line-clamp-2 leading-snug transition-colors mb-2"
        >
          {product.name}
        </Link>

        {/* Price Tag */}
        <div className="mt-auto pt-1 flex items-baseline gap-2">
          <span className="font-extrabold text-sm sm:text-base text-text">
            {formatPrice(currentPrice)}
          </span>
          {originalPrice && originalPrice > currentPrice && (
            <span className="text-xs text-text-muted line-through font-normal">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
