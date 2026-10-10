"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store-context";

const TABS = ["All", "Dresses", "Men", "T-shirts", "Women"];

export function FeaturedSection({
  title = "FIND YOUR SEASON EDIT",
  subtitle = "Rethink Your Wardrobe",
  viewAllLink = "/shop",
  products: initialProducts = [],
  isLoading = false,
}) {
  const { products: storeProducts } = useStore();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prefer initialProducts if provided; fallback to storeProducts
  const allProducts = initialProducts?.length > 0
    ? initialProducts
    : (mounted && Array.isArray(storeProducts) && storeProducts.length > 0
      ? storeProducts
      : initialProducts);

  // Filter products by active tab if not "All"
  const filteredProducts = activeTab === "All"
    ? allProducts
    : allProducts.filter((p) => {
        const cat = (p.category?.name || p.category?.slug || "").toLowerCase();
        const tab = activeTab.toLowerCase();
        if (tab === "dresses") return cat.includes("women") || cat.includes("dress");
        if (tab === "men") return cat.includes("men");
        if (tab === "women") return cat.includes("women");
        if (tab === "t-shirts") return cat.includes("tee") || cat.includes("men") || cat.includes("streetwear");
        return true;
      });

  const products = filteredProducts.length > 0 ? filteredProducts : allProducts;

  if (!isLoading && (!allProducts || allProducts.length === 0)) return null;

  return (
    <section className="py-10 sm:py-20 border-t border-neutral-200/70 bg-white">
      <div className="container-custom">
        {/* Giant Editorial Header (Matches mobile and desktop screenshot) */}
        <div className="mb-6 sm:mb-10 text-left">
          <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-normal text-neutral-950 uppercase tracking-[0.02em] leading-tight mb-2">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm sm:text-base text-neutral-800 font-medium tracking-tight">
              {subtitle}
            </p>
          )}

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar pt-4 pb-2 text-xs sm:text-sm font-medium border-b border-neutral-100">
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`pb-2 whitespace-nowrap transition-colors relative ${
                  activeTab === tab
                    ? "text-neutral-950 font-bold border-b-2 border-neutral-950 -mb-[1px]"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Col Mobile, 4-Col Desktop Product Grid */}
        <ProductGrid products={products} isLoading={isLoading} />
      </div>
    </section>
  );
}
