"use client";

import Link from "next/link";
import Image from "next/image";
import { Rating } from "@/components/ui/Rating";
import { formatPrice, getDiscountPercentage } from "@/lib/format";
import { useCart } from "@/lib/cart/cart-context";
import { getValidImageSrc } from "@/lib/utils";
import { ShoppingBag, Check, Heart, Eye } from "lucide-react";
import { useState } from "react";

export function ProductCard({ product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  if (!product) return null;

  const currentPrice = product.discount_price || product.min_price || product.selling_price;
  const originalPrice = product.has_discount ? product.selling_price || product.max_price : null;
  const discountLabel = getDiscountPercentage(originalPrice, currentPrice);
  const primaryImage = getValidImageSrc(product.image || product.images?.[0]);
  const secondaryImage = getValidImageSrc(product.hover_image || product.images?.[1]);

  function handleQuickAdd(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!product.in_stock) return;

    const firstVariant = product.variants?.[0];

    addItem({
      productId: product.id,
      variantId: firstVariant?.id || null,
      variantLabel: firstVariant?.attributes
        ? Object.values(firstVariant.attributes).join(" / ")
        : null,
      name: product.name,
      slug: product.slug,
      image: primaryImage,
      price: currentPrice,
      originalPrice: originalPrice,
      quantity: 1,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  function handleWishlist(e) {
    e.preventDefault();
    e.stopPropagation();
    setWishlisted((prev) => !prev);
  }

  return (
    <div className="group relative flex flex-col h-full bg-transparent">
      {/* Product Image Frame */}
      <div className="relative block w-full aspect-square bg-[#f5f5f5] rounded-lg sm:rounded-xl overflow-hidden group/thumb">
        {/* Clickable Image Link */}
        <Link
          href={`/product/${product.slug}`}
          className="relative block w-full h-full"
        >
          {/* Primary Image */}
          {primaryImage ? (
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={`object-cover object-center scale-100 transition-all duration-700 ease-out ${
                secondaryImage ? "group-hover/thumb:opacity-0" : "group-hover/thumb:scale-105"
              }`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs font-semibold uppercase tracking-wider">
              No image
            </div>
          )}

          {/* Secondary Image for smooth angle switch on hover */}
          {secondaryImage && (
            <Image
              src={secondaryImage}
              alt={`${product.name} angle`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover object-center scale-100 group-hover/thumb:scale-105 opacity-0 group-hover/thumb:opacity-100 transition-all duration-700 ease-out"
            />
          )}
        </Link>

        {/* Minimalist Top-Left Discount Badge */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 pointer-events-none">
          {!product.in_stock ? (
            <span className="px-2 py-1 text-[11px] font-bold bg-neutral-900/90 text-white rounded-md shadow-xs">
              Sold Out
            </span>
          ) : product.has_discount ? (
            <span className="px-2 py-1 text-[11px] font-bold bg-white text-neutral-900 rounded-md shadow-xs">
              {discountLabel?.replace("-", "") || "18%"}
            </span>
          ) : product.tag ? (
            <span className="px-2 py-1 text-[11px] font-bold bg-white text-neutral-900 rounded-md shadow-xs">
              {product.tag}
            </span>
          ) : null}
        </div>

        {/* Top-Right Action Controls (Wishlist & Quick View) */}
        <div className="absolute top-2.5 right-2.5 z-10 flex flex-col gap-1.5">
          <button
            type="button"
            onClick={handleWishlist}
            aria-label="Save to wishlist"
            className="w-8 h-8 rounded-md bg-white hover:bg-neutral-50 text-neutral-800 flex items-center justify-center shadow-xs transition-transform active:scale-90 cursor-pointer"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                wishlisted ? "fill-red-500 text-red-500" : "text-neutral-800"
              }`}
            />
          </button>
          <Link
            href={`/product/${product.slug}`}
            aria-label="Quick view product"
            className="w-8 h-8 rounded-md bg-white hover:bg-neutral-50 text-neutral-800 flex items-center justify-center shadow-xs transition-transform active:scale-90"
          >
            <Eye className="w-4 h-4 text-neutral-800" />
          </Link>
        </div>

        {/* Quick Add Pill Button (Slides up smoothly on hover) */}
        {product.in_stock && (
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={added}
            aria-label={`Add ${product.name} to cart`}
            className="absolute bottom-3 right-3 z-10 px-3.5 py-2 rounded-full bg-neutral-950 text-white shadow-lg hover:bg-neutral-800 active:scale-95 transition-all duration-300 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider lg:opacity-0 lg:group-hover:opacity-100 lg:translate-y-2 lg:group-hover:translate-y-0 cursor-pointer"
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Product Information */}
      <div className="flex-1 flex flex-col pt-3 pb-1">
        {/* Category & Rating */}
        <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
          <span className="uppercase tracking-widest font-bold truncate">
            {product.category?.name || "Collection"}
          </span>
          {product.rating > 0 && <Rating value={product.rating} size="sm" />}
        </div>

        {/* Product Title */}
        <Link
          href={`/product/${product.slug}`}
          className="text-sm sm:text-base font-bold text-neutral-900 group-hover:text-amber-600 line-clamp-1 leading-snug transition-colors mb-1"
        >
          {product.name}
        </Link>

        {/* Variations count tag */}
        <p className="text-xs text-neutral-400 mb-2 font-medium">
          {product.colors_count ? `${product.colors_count} Colours` : product.variants?.length > 1 ? `${product.variants.length} Sizes` : "Standard"}
        </p>

        {/* Price Tag */}
        <div className="mt-auto flex items-baseline gap-2">
          <span className="font-black text-sm sm:text-base text-neutral-950 tracking-tight">
            {formatPrice(currentPrice)}
          </span>
          {originalPrice && originalPrice > currentPrice && (
            <span className="text-xs text-neutral-400 line-through font-normal">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
