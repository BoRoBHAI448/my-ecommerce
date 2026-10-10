"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Heart, Eye, Star } from "lucide-react";
import { useCart } from "@/lib/cart/cart-context";
import { useStore } from "@/lib/store-context";
import { getStorefrontProducts } from "@/lib/supabase/products";

const TABS = ["Women", "Men", "Dresses", "T-shirts"];

function WardrobeProductCard({
  item,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
}) {
  const frameRef = useRef(null);
  const badgeRef = useRef(null);
  const isInsideRef = useRef(false);

  const handleMouseMove = (e) => {
    if (!frameRef.current || !badgeRef.current) return;
    const rect = frameRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    badgeRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(1)`;
  };

  const handleMouseEnter = (e) => {
    if (!frameRef.current || !badgeRef.current) return;
    isInsideRef.current = true;
    const rect = frameRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    badgeRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(1)`;
    badgeRef.current.style.opacity = "1";
  };

  const handleMouseLeave = () => {
    if (!badgeRef.current) return;
    isInsideRef.current = false;
    badgeRef.current.style.opacity = "0";
    const currentTransform = badgeRef.current.style.transform || "";
    const base = currentTransform.replace(/scale\([^)]*\)/, "").trim();
    badgeRef.current.style.transform = `${base} scale(0.6)`;
  };

  const hideBadge = () => {
    if (badgeRef.current) badgeRef.current.style.opacity = "0";
  };

  const showBadge = () => {
    if (badgeRef.current && isInsideRef.current) {
      badgeRef.current.style.opacity = "1";
    }
  };

  return (
    <div className="w-[280px] sm:w-[calc(50%-10px)] lg:w-[calc(25%-18px)] shrink-0 snap-start flex flex-col group/card">
      {/* Card Image Frame with Cursor Tracker */}
      <div
        ref={frameRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative w-full aspect-[3/4] bg-[#f5f5f5] overflow-hidden cursor-pointer"
      >
        <Link href={`/product/${item.slug}`} className="relative block w-full h-full">
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 75vw, (max-width: 1024px) 45vw, 25vw"
            className="object-cover object-center scale-100 group-hover/card:scale-105 transition-transform duration-700 ease-out"
          />
        </Link>

        {/* Top-Left Discount Badge */}
        {item.discountBadge && (
          <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none select-none">
            <span className="bg-white text-neutral-900 text-[11px] font-bold px-2 py-0.5 shadow-xs">
              {item.discountBadge}
            </span>
          </div>
        )}

        {/* Top-Right Action Controls (Wishlist & Quick View) */}
        <div
          onMouseEnter={hideBadge}
          onMouseLeave={showBadge}
          className="absolute top-2.5 right-2.5 z-20 flex flex-col gap-1.5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-200"
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(item.id);
            }}
            aria-label="Add to wishlist"
            className="w-8 h-8 rounded-sm bg-white shadow-xs flex items-center justify-center text-neutral-800 hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            <Heart
              className={`w-4 h-4 ${
                isWishlisted
                  ? "fill-red-500 text-red-500"
                  : "text-neutral-800"
              }`}
            />
          </button>

          <Link
            href={`/product/${item.slug}`}
            aria-label="Quick view"
            className="w-8 h-8 rounded-sm bg-white shadow-xs flex items-center justify-center text-neutral-800 hover:bg-neutral-50 transition-colors"
          >
            <Eye className="w-4 h-4 text-neutral-800" />
          </Link>
        </div>

        {/* ── Magnetic / Cursor-Following "VIEW" Pill ── */}
        <div
          ref={badgeRef}
          className="absolute top-0 left-0 z-10 w-[50px] h-[50px] rounded-full bg-neutral-900/90 text-white text-[10px] font-bold uppercase tracking-[0.15em] flex items-center justify-center shadow-lg pointer-events-none select-none opacity-0 will-change-transform"
          style={{
            transform: "translate3d(50%, 50%, 0) translate(-50%, -50%) scale(0.6)",
            transition:
              "transform 0.1s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.18s ease",
          }}
        >
          VIEW
        </div>

        {/* ── Slide-up ADD TO CART Quick Bar ── */}
        <div
          onMouseEnter={hideBadge}
          onMouseLeave={showBadge}
          className="absolute bottom-3 left-3 right-3 z-20 opacity-0 group-hover/card:opacity-100 translate-y-2 group-hover/card:translate-y-0 transition-all duration-300"
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(item);
            }}
            className="w-full py-2.5 bg-white text-neutral-900 text-[11px] font-bold uppercase tracking-[0.14em] shadow-md hover:bg-neutral-100 active:scale-[0.99] transition-all text-center cursor-pointer"
          >
            ADD TO CART
          </button>
        </div>
      </div>

      {/* Product Details Below Image */}
      <div className="pt-3 pb-1 flex flex-col">
        {/* Title */}
        <Link
          href={`/product/${item.slug}`}
          className="text-sm font-normal text-neutral-900 hover:text-black line-clamp-1 transition-colors"
        >
          {item.name}
        </Link>

        {/* Price Row (BDT ৳) */}
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-sm font-bold text-neutral-950">
            ৳{Number(item.price).toLocaleString("en-BD")}
          </span>
          {item.originalPrice && (
            <span className="text-xs text-neutral-400 line-through font-normal">
              ৳{Number(item.originalPrice).toLocaleString("en-BD")}
            </span>
          )}
        </div>

        {/* Star Rating & Review Count */}
        <div className="flex items-center gap-1 mt-1 text-xs">
          <div className="flex items-center text-amber-500">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-3.5 h-3.5 ${
                  star <= Math.round(Number(item.rating || 5))
                    ? "fill-amber-400 text-amber-400"
                    : "text-neutral-200 fill-neutral-200"
                }`}
              />
            ))}
          </div>
          <span className="font-semibold text-neutral-900 ml-0.5">
            {Number(item.rating || 5).toFixed(1)}
          </span>
          <span className="text-neutral-400 font-normal">
            ({item.reviewsCount ?? 0})
          </span>
        </div>
      </div>
    </div>
  );
}

export function RethinkWardrobeSection() {
  const [activeTab, setActiveTab] = useState("Women");
  const [wishlistedIds, setWishlistedIds] = useState([]);
  const [thumbState, setThumbState] = useState({ width: 35, left: 0 });
  const [supabaseProducts, setSupabaseProducts] = useState([]);
  const sliderRef = useRef(null);
  const trackRef = useRef(null);
  const { addItem } = useCart();
  const { products: storeProducts } = useStore();

  // Load live published products ONLY from Supabase
  useEffect(() => {
    async function loadLiveProducts() {
      try {
        const live = await getStorefrontProducts({ limit: 50 });
        if (Array.isArray(live) && live.length > 0) {
          const formatted = live.map((item) => ({
            id: String(item.id),
            name: item.name,
            slug: item.slug,
            price: Number(item.selling_price || item.regular_price || 0),
            originalPrice: item.discount_price ? Number(item.regular_price) : null,
            discountBadge:
              item.discount_badge ||
              (item.discount_price && item.regular_price
                ? `${Math.round(
                    ((item.regular_price - item.selling_price) /
                      item.regular_price) *
                      100
                  )}%`
                : null),
            rating: Number(item.rating || 5.0),
            reviewsCount: Number(item.review_count || 0),
            category: item.gender || "Women",
            subCategory: item.sub_category || "Dresses",
            image: item.thumbnail || (Array.isArray(item.images) ? item.images[0] : null) || "/images/wardrobe-1.jpg",
          }));
          setSupabaseProducts(formatted);
        } else {
          setSupabaseProducts([]);
        }
      } catch (err) {
        console.warn("Supabase storefront products fetch notice:", err);
        setSupabaseProducts([]);
      }
    }
    loadLiveProducts();
  }, []);

  // Merge live Supabase products with newly published local store products
  const productSource = useMemo(() => {
    if (supabaseProducts.length > 0) {
      const supabaseSlugs = new Set(supabaseProducts.map((p) => p.slug));
      const localOnly = (Array.isArray(storeProducts) ? storeProducts : [])
        .filter((p) => !supabaseSlugs.has(p.slug))
        .map((item) => ({
          id: String(item.id),
          name: item.name,
          slug: item.slug,
          price: Number(item.selling_price || item.price || 0),
          originalPrice:
            item.regular_price || item.originalPrice
              ? Number(item.regular_price || item.originalPrice)
              : null,
          discountBadge: item.discount_badge || null,
          rating: Number(item.rating || 5.0),
          reviewsCount: Number(item.reviewsCount || item.review_count || 0),
          category: item.gender || "Women",
          subCategory: item.sub_category || item.category?.name || "All",
          image:
            item.thumbnail ||
            (Array.isArray(item.images) ? item.images[0] : null) ||
            item.image ||
            "/images/wardrobe-1.jpg",
        }));
      return [...supabaseProducts, ...localOnly];
    }

    return (Array.isArray(storeProducts) ? storeProducts : []).map((item) => ({
      id: String(item.id),
      name: item.name,
      slug: item.slug,
      price: Number(item.selling_price || item.price || 0),
      originalPrice:
        item.regular_price || item.originalPrice
          ? Number(item.regular_price || item.originalPrice)
          : null,
      discountBadge: item.discount_badge || null,
      rating: Number(item.rating || 5.0),
      reviewsCount: Number(item.reviewsCount || item.review_count || 0),
      category: item.gender || "Women",
      subCategory: item.sub_category || item.category?.name || "All",
      image:
        item.thumbnail ||
        (Array.isArray(item.images) ? item.images[0] : null) ||
        item.image ||
        "/images/wardrobe-1.jpg",
    }));
  }, [supabaseProducts, storeProducts]);

  // Update dynamic full-width progress bar thumb
  const updateProgress = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    const maxScroll = scrollWidth - clientWidth;

    if (maxScroll <= 0) {
      setThumbState({ width: 100, left: 0 });
      return;
    }

    const visibleRatio = clientWidth / scrollWidth;
    const widthPercent = Math.max(12, Math.min(100, visibleRatio * 100));
    const progress = Math.max(0, Math.min(1, scrollLeft / maxScroll));
    const leftPercent = progress * (100 - widthPercent);

    setThumbState({
      width: widthPercent,
      left: leftPercent,
    });
  };

  // Reset scroll position on tab switch
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (sliderRef.current) {
      sliderRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
    setTimeout(updateProgress, 80);
  };

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;

    updateProgress();
    el.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      el.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [activeTab, supabaseProducts]);

  // Filter products by active tab
  const displayedProducts = productSource.filter((item) => {
    if (activeTab === "Women") return (item.category || "").toLowerCase() === "women";
    if (activeTab === "Men") return (item.category || "").toLowerCase() === "men";
    if (activeTab === "Dresses")
      return (
        (item.subCategory || "").toLowerCase().includes("dress") ||
        (item.name || "").toLowerCase().includes("dress")
      );
    if (activeTab === "T-shirts")
      return (
        (item.subCategory || "").toLowerCase().includes("t-shirt") ||
        (item.subCategory || "").toLowerCase().includes("tee") ||
        (item.name || "").toLowerCase().includes("tee")
      );
    return true;
  });

  // Scroll by exactly ONE single product card per arrow click
  const scroll = (direction) => {
    if (!sliderRef.current) return;
    const container = sliderRef.current;
    const firstCard = container.querySelector(".group\\/card");
    if (!firstCard) return;

    const cardRect = firstCard.getBoundingClientRect();
    const style = window.getComputedStyle(container);
    const gap = parseFloat(style.columnGap || style.gap) || 24;
    const singleProductStep = cardRect.width + gap;

    container.scrollBy({
      left: direction === "left" ? -singleProductStep : singleProductStep,
      behavior: "smooth",
    });
  };

  // Direct click on bottom progress track to seek
  const handleTrackClick = (e) => {
    if (!trackRef.current || !sliderRef.current) return;
    const trackRect = trackRef.current.getBoundingClientRect();
    const clickX = e.clientX - trackRect.left;
    const clickRatio = Math.max(0, Math.min(1, clickX / trackRect.width));
    const maxScroll =
      sliderRef.current.scrollWidth - sliderRef.current.clientWidth;

    sliderRef.current.scrollTo({
      left: clickRatio * maxScroll,
      behavior: "smooth",
    });
  };

  const toggleWishlist = (id) => {
    setWishlistedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAddToCart = (item) => {
    addItem({
      productId: item.id,
      name: item.name,
      slug: item.slug,
      image: item.image,
      price: item.price,
      originalPrice: item.originalPrice,
      quantity: 1,
    });
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white select-none">
      {/* ── Wide-Bleed Container: Matches Framer reference margins precisely ── */}
      <div className="w-full max-w-[1660px] mx-auto px-5 sm:px-8 md:px-12 lg:px-14 xl:px-16">
        {/* ── 1. Section Header: Title on Left, Tabs on Right ─────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-7 sm:mb-9">
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
            Rethink Your Wardrobe
          </h2>

          {/* Category Tabs */}
          <div className="flex items-center gap-6 sm:gap-8 text-xs sm:text-sm font-medium overflow-x-auto no-scrollbar">
            {TABS.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => handleTabChange(tab)}
                  className={`pb-1 transition-colors whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "text-neutral-950 font-semibold border-b-2 border-neutral-950 -mb-[2px]"
                      : "text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── 2. Carousel Slider OR Luxury Coming Soon Placeholder ────────── */}
        {displayedProducts.length > 0 ? (
          <div className="relative group/carousel">
            {/* Left Arrow Button */}
            <button
              type="button"
              onClick={() => scroll("left")}
              aria-label="Previous product"
              className="absolute -left-2 sm:-left-3 lg:-left-5 top-[38%] -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white shadow-md border border-neutral-200/80 flex items-center justify-center text-neutral-800 hover:bg-neutral-50 active:scale-95 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2]" />
            </button>

            {/* Right Arrow Button */}
            <button
              type="button"
              onClick={() => scroll("right")}
              aria-label="Next product"
              className="absolute -right-2 sm:-right-3 lg:-right-5 top-[38%] -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white shadow-md border border-neutral-200/80 flex items-center justify-center text-neutral-800 hover:bg-neutral-50 active:scale-95 transition-all cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 stroke-[2]" />
            </button>

            {/* Scrollable Track */}
            <div
              ref={sliderRef}
              className="flex gap-4 sm:gap-5 lg:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory py-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {displayedProducts.map((item) => (
                <WardrobeProductCard
                  key={item.id}
                  item={item}
                  isWishlisted={wishlistedIds.includes(item.id)}
                  onToggleWishlist={toggleWishlist}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>

            {/* ── 3. Full-Width Bottom Slider Track ── */}
            <div
              ref={trackRef}
              onClick={handleTrackClick}
              role="scrollbar"
              aria-label="Product carousel progress"
              className="mt-8 sm:mt-10 lg:mt-12 w-full h-[2px] bg-neutral-200/90 relative cursor-pointer"
            >
              <div
                className="absolute top-0 bottom-0 bg-[#8c5938] rounded-full transition-all duration-200 ease-out pointer-events-none"
                style={{
                  width: `${thumbState.width.toFixed(2)}%`,
                  left: `${thumbState.left.toFixed(2)}%`,
                }}
              />
            </div>
          </div>
        ) : (
          <div className="w-full py-16 sm:py-24 px-6 rounded-xl border border-neutral-200/70 bg-[#fafafa] flex flex-col items-center justify-center text-center">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-400 mb-2">
              Capsule In Production
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-medium text-neutral-900 tracking-tight mb-2">
              Coming Soon
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 font-light max-w-md leading-relaxed mb-6">
              Our atelier is currently curating this collection. New tailored garments will be unveiled here once published.
            </p>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 rounded-full text-[11px] font-medium text-neutral-600 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                Awaiting new season drop
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
