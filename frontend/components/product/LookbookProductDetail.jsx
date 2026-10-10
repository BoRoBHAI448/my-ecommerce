"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Heart, Repeat, Truck, ShieldCheck, Check, MessageCircle, Share2 } from "lucide-react";
import { useCart } from "@/lib/cart/cart-context";

export function LookbookProductDetail({ product, relatedProducts = [] }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isCompared, setIsCompared] = useState(false);
  const [addedToast, setAddedToast] = useState(false);
  const [selectedSize, setSelectedSize] = useState(
    Array.isArray(product?.sizes) && product.sizes.length > 0 ? product.sizes[0] : "M"
  );

  // Price calculations
  const price = product.discount_price || product.selling_price || 2450;
  const originalPrice = product.has_discount
    ? product.selling_price || 3000
    : null;
  const discountBadge = product.discount_badge || "19%";
  const stockCount = product.stock_count || 44;
  const sku = product.sku || "FV-782-6F7D";
  const rating = product.rating || 3.3;
  const reviewCount = product.review_count || 3;

  // 4 Gallery images for the 2x2 grid
  const galleryImages =
    product.images && product.images.length >= 4
      ? product.images.slice(0, 4)
      : [
          product.image || "/images/wardrobe-1.jpg",
          product.image || "/images/wardrobe-1.jpg",
          product.image || "/images/wardrobe-1.jpg",
          product.image || "/images/wardrobe-1.jpg",
        ];

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.image,
      price: price,
      originalPrice: originalPrice,
      quantity: quantity,
      size: selectedSize,
    });
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* ── Breadcrumb Navigation ────────────────────────────────────── */}
      <div className="w-full max-w-[1660px] mx-auto px-5 sm:px-8 md:px-12 lg:px-14 xl:px-16 pt-5 pb-6">
        <nav className="flex items-center gap-2 text-xs text-neutral-500 font-normal">
          <Link href="/" className="hover:text-neutral-900 transition-colors">
            Home
          </Link>
          <span className="text-neutral-300">/</span>
          <Link
            href={`/category/${product.category?.slug || "dresses"}`}
            className="hover:text-neutral-900 transition-colors"
          >
            {product.category?.name || "Dresses"}
          </Link>
          <span className="text-neutral-300">/</span>
          <span className="text-neutral-900 font-medium truncate">
            {product.name}
          </span>
        </nav>
      </div>

      {/* ── Main Product Section (2x2 Grid on Left, Buy Box on Right) ── */}
      <div className="w-full max-w-[1660px] mx-auto px-5 sm:px-8 md:px-12 lg:px-14 xl:px-16 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-14 items-start">
          {/* ── LEFT: 2x2 Editorial Photo Gallery ── */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
              {galleryImages.map((imgSrc, idx) => (
                <div
                  key={idx}
                  className="relative aspect-[3/4] bg-[#f5f5f5] overflow-hidden group select-none"
                >
                  <Image
                    src={imgSrc}
                    alt={`${product.name} editorial view ${idx + 1}`}
                    fill
                    sizes="(max-width: 1024px) 50vw, 35vw"
                    priority={idx === 0}
                    className="object-cover object-center scale-100 group-hover:scale-103 transition-transform duration-700 ease-out"
                  />

                  {/* Top-Left Discount Badge on the 1st image (matching screenshot) */}
                  {idx === 0 && discountBadge && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className="bg-white text-neutral-900 text-[11px] font-bold px-2.5 py-0.5 shadow-xs select-none">
                        {discountBadge}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Product Buy Box ── */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 flex flex-col pt-1">
            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-medium text-neutral-900 tracking-tight leading-snug">
              {product.name}
            </h1>

            {/* Rating & SKU Row */}
            <div className="flex items-center gap-3 text-xs text-neutral-500 mt-2.5 pb-4 border-b border-neutral-100">
              <div className="flex items-center gap-1">
                <div className="flex items-center text-amber-500">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3.5 h-3.5 ${
                        star <= Math.round(rating)
                          ? "fill-amber-400 text-amber-400"
                          : "fill-neutral-200 text-neutral-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-semibold text-neutral-900 ml-0.5">
                  {Number(rating).toFixed(1)}
                </span>
                <span className="text-neutral-400">({reviewCount})</span>
              </div>
              <span className="text-neutral-300">|</span>
              <span className="font-mono text-[11px] text-neutral-400 uppercase">
                SKU: {sku}
              </span>
            </div>

            {/* Excerpt / Short Description */}
            <p className="text-xs sm:text-[13px] text-neutral-600 leading-relaxed mt-4">
              {product.short_description ||
                "Made for the days that go on longer than planned. The column knit maxi dress moves comfortably, resists creasing, and reads as considered whether you are at a desk or out afterwards."}
            </p>

            {/* Pricing & Stock Status */}
            <div className="flex items-center gap-3 mt-6">
              <span className="text-2xl font-bold text-neutral-950">
                ৳{Number(price).toLocaleString("en-BD")}
              </span>
              {originalPrice && (
                <span className="text-sm text-neutral-400 line-through">
                  ৳{Number(originalPrice).toLocaleString("en-BD")}
                </span>
              )}
              <span className="ml-1 inline-flex items-center px-2 py-0.5 text-[11px] font-medium text-emerald-800 bg-emerald-50 rounded-xs">
                {stockCount} in stock
              </span>
            </div>

            {/* Size Selector (Supports Shoes, Pants, Dresses, etc.) */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mt-5">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-neutral-900 uppercase tracking-wider">
                    Select Size: <span className="font-bold">{selectedSize}</span>
                  </span>
                  <button type="button" className="text-neutral-400 text-[11px] hover:text-neutral-900 cursor-pointer underline">
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`min-w-10 px-3 h-9 text-xs font-semibold border transition-all cursor-pointer ${
                        selectedSize === sz
                          ? "bg-black text-white border-black"
                          : "bg-white text-neutral-800 border-neutral-300 hover:border-black"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper & ADD TO CART */}
            <div className="flex items-center gap-3 mt-6">
              {/* Stepper */}
              <div className="flex items-center border border-neutral-300 h-11 bg-white select-none">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="w-9 h-full flex items-center justify-center text-neutral-600 hover:text-black hover:bg-neutral-50 transition-colors cursor-pointer text-base"
                >
                  −
                </button>
                <span className="w-10 text-center text-xs font-semibold text-neutral-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                  className="w-9 h-full flex items-center justify-center text-neutral-600 hover:text-black hover:bg-neutral-50 transition-colors cursor-pointer text-base"
                >
                  +
                </button>
              </div>

              {/* Full Width ADD TO CART Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 h-11 bg-black text-white text-[11px] font-bold uppercase tracking-[0.16em] hover:bg-neutral-800 active:scale-[0.99] transition-all flex items-center justify-center cursor-pointer"
              >
                {addedToast ? "ADDED TO CART ✓" : "ADD TO CART"}
              </button>
            </div>

            {/* Secondary Action Links (Wishlist & Compare) */}
            <div className="flex items-center gap-6 mt-4 text-xs text-neutral-600">
              <button
                type="button"
                onClick={() => setIsWishlisted((prev) => !prev)}
                className="flex items-center gap-1.5 hover:text-black transition-colors cursor-pointer"
              >
                <Heart
                  className={`w-3.5 h-3.5 ${
                    isWishlisted ? "fill-red-500 text-red-500" : ""
                  }`}
                />
                <span>{isWishlisted ? "Wishlisted" : "Add to wishlist"}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsCompared((prev) => !prev)}
                className="flex items-center gap-1.5 hover:text-black transition-colors cursor-pointer"
              >
                <Repeat className="w-3.5 h-3.5" />
                <span>{isCompared ? "Compared" : "Compare"}</span>
              </button>
            </div>

            {/* Dispatch & 3-Year Guarantee Box (Matches Screenshot) */}
            <div className="mt-6 bg-[#f9f9f9] border border-neutral-150 p-4 space-y-2 rounded-xs text-[11px] text-neutral-600 leading-normal">
              <div className="flex items-start gap-2.5">
                <Truck className="w-4 h-4 text-neutral-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-neutral-900">
                    Dispatched in 24 Hours:
                  </span>{" "}
                  Orders leave the studio same day
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-neutral-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-neutral-900">
                    3-Year Guarantee:
                  </span>{" "}
                  Every Fe Vesture piece is covered in full.
                </div>
              </div>
            </div>

            {/* Social Share Row */}
            <div className="flex items-center gap-2 mt-5 text-xs text-neutral-500">
              <span className="text-[11px] text-neutral-400 mr-1">Share:</span>
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Share on Facebook"
                className="w-6 h-6 rounded-full border border-neutral-200 flex items-center justify-center text-[10px] text-neutral-700 hover:border-black hover:text-black transition-colors"
              >
                f
              </a>
              {/* X / Twitter */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Share on X"
                className="w-6 h-6 rounded-full border border-neutral-200 flex items-center justify-center text-[10px] text-neutral-700 hover:border-black hover:text-black transition-colors"
              >
                𝕏
              </a>
              {/* Pinterest */}
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Share on Pinterest"
                className="w-6 h-6 rounded-full border border-neutral-200 flex items-center justify-center text-[10px] text-neutral-700 hover:border-black hover:text-black transition-colors"
              >
                P
              </a>
              {/* WhatsApp */}
              <a
                href="https://whatsapp.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Share on WhatsApp"
                className="w-6 h-6 rounded-full border border-neutral-200 flex items-center justify-center text-[10px] text-neutral-700 hover:border-black hover:text-black transition-colors"
              >
                💬
              </a>
            </div>
          </div>
        </div>

        {/* ── Tabs Section: Description & Reviews ─────────────────────── */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-neutral-200">
          <div className="flex items-center gap-8 border-b border-neutral-200 pb-3">
            <button
              type="button"
              onClick={() => setActiveTab("description")}
              className={`text-sm font-medium transition-colors cursor-pointer ${
                activeTab === "description"
                  ? "text-neutral-950 font-semibold border-b-2 border-neutral-950 -mb-[14px] pb-3"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              Description
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("reviews")}
              className={`text-sm font-medium transition-colors cursor-pointer ${
                activeTab === "reviews"
                  ? "text-neutral-950 font-semibold border-b-2 border-neutral-950 -mb-[14px] pb-3"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              Reviews ({reviewCount})
            </button>
          </div>

          <div className="py-6 text-xs sm:text-[13px] text-neutral-600 leading-relaxed space-y-4 max-w-4xl">
            {activeTab === "description" ? (
              <>
                <p>
                  Every detail has been settled on purpose — where the seams land,
                  how heavy the cloth is, how the hem finishes. It is a quiet
                  piece, and quiet pieces only work when the making is right.
                </p>
                <p>
                  Wear it on its own for something easy and unfussy, or build
                  tailored layers around it. It is meant to sit at the base of an
                  outfit rather than compete with the rest of it.
                </p>
              </>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-neutral-50 border border-neutral-200/60 rounded-xs">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-neutral-900">
                      Eleanor V.
                    </span>
                    <span className="text-neutral-400 text-[11px]">
                      • Verified Buyer
                    </span>
                  </div>
                  <div className="flex items-center text-amber-500 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-3 h-3 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <p className="text-neutral-700">
                    The fabric drape and knit structure are extraordinary.
                    Effortlessly elegant whether worn casually or for an evening
                    dinner.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Related Products Section (Matches Screenshot Exactly) ────── */}
        <div className="mt-14 sm:mt-18 pt-8 border-t border-neutral-200">
          <h2 className="text-xl font-medium text-neutral-900 mb-7">
            Related products
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.slice(0, 4).map((item) => (
              <Link
                key={item.id}
                href={`/product/${item.slug}`}
                className="group flex flex-col select-none"
              >
                {/* Image Frame */}
                <div className="relative aspect-[3/4] bg-[#f5f5f5] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover object-center scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  {item.discount_badge && (
                    <div className="absolute top-2.5 left-2.5 z-10">
                      <span className="bg-white text-neutral-900 text-[11px] font-bold px-2 py-0.5 shadow-xs select-none">
                        {item.discount_badge}
                      </span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="pt-3 pb-1 flex flex-col">
                  <span className="text-sm font-normal text-neutral-900 group-hover:text-black line-clamp-1 transition-colors">
                    {item.name}
                  </span>

                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-sm font-bold text-neutral-950">
                      ৳{Number(item.discount_price || item.selling_price).toLocaleString("en-BD")}
                    </span>
                    {item.selling_price && item.has_discount && (
                      <span className="text-xs text-neutral-400 line-through font-normal">
                        ৳{Number(item.selling_price).toLocaleString("en-BD")}
                      </span>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mt-1 text-xs">
                    <div className="flex items-center text-amber-500">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            star <= Math.round(item.rating || 4)
                              ? "fill-amber-400 text-amber-400"
                              : "text-neutral-200 fill-neutral-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-neutral-900 ml-0.5">
                      {Number(item.rating || 4).toFixed(1)}
                    </span>
                    <span className="text-neutral-400">
                      ({item.review_count || 3})
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
