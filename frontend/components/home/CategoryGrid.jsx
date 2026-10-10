"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useStore } from "@/lib/store-context";

// Fallback high-fashion photography mapped to common slugs/keywords
const CATEGORY_FALLBACK_IMAGES = {
  footwear: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80",
  shoes: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80",
  "men-s": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80",
  men: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80",
  "women-s": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80",
  women: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80",
  "bags-accessories": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
  bags: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
  streetwear: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80",
  default: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80",
};

function getCategoryPhoto(cat) {
  if (cat?.image && !cat.image.includes("placeholder") && !cat.image.startsWith("data:")) {
    return cat.image;
  }
  const slug = (cat?.slug || "").toLowerCase();
  for (const [key, url] of Object.entries(CATEGORY_FALLBACK_IMAGES)) {
    if (slug.includes(key)) return url;
  }
  return CATEGORY_FALLBACK_IMAGES.default;
}

export function CategoryGrid({ categories: initialCategories = [] }) {
  const { categories: storeCategories } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const categories = mounted && Array.isArray(storeCategories) && storeCategories.length > 0
    ? storeCategories
    : initialCategories;

  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-12 sm:py-20 bg-neutral-50/50">
      <div className="container-custom">
        {/* Editorial Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.25em] text-neutral-400 block mb-1.5">
              Curated Departments
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-black text-neutral-950 uppercase tracking-tight">
              Shop by Category
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-black uppercase tracking-wider text-neutral-900 hover:text-amber-600 transition-colors group"
          >
            <span>All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 4:5 Portrait Editorial Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-6">
          {categories.map((cat, idx) => {
            const photoUrl = getCategoryPhoto(cat);

            return (
              <Link
                key={cat.id || idx}
                href={`/category/${cat.slug}`}
                className="group relative aspect-[4/5] rounded-xl sm:rounded-2xl overflow-hidden bg-neutral-900 shadow-sm hover:shadow-xl transition-all duration-500"
              >
                {/* Background Photography */}
                <Image
                  src={photoUrl}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover object-center scale-100 group-hover:scale-110 transition-transform duration-700 ease-out"
                />

                {/* Dark Contrast Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/5 group-hover:from-black/90 transition-colors" />

                {/* Hover Glow Accent */}
                <div className="absolute inset-0 border border-white/10 group-hover:border-white/30 rounded-xl sm:rounded-2xl transition-colors pointer-events-none" />

                {/* Floating Top Arrow Pill */}
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300">
                  <ArrowUpRight className="w-4 h-4" />
                </div>

                {/* Content Overlay at Bottom */}
                <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 flex flex-col justify-end">
                  {cat.item_count ? (
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-300 mb-1">
                      {cat.item_count} Styles
                    </span>
                  ) : null}

                  <h3 className="font-black text-base sm:text-lg text-white uppercase tracking-tight leading-snug group-hover:text-amber-300 transition-colors">
                    {cat.name}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
