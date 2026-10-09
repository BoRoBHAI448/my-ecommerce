"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store-context";

export function FeaturedSection({
  title = "Featured Products",
  subtitle = "Our most loved and iconic designs",
  viewAllLink = "/shop",
  products: initialProducts = [],
  isLoading = false,
}) {
  const { products: storeProducts } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const products = mounted && Array.isArray(storeProducts) && storeProducts.length > 0
    ? storeProducts
    : initialProducts;

  if (!isLoading && products.length === 0) return null;

  return (
    <section className="py-8 sm:py-12 border-t border-border/60">
      <div className="container-custom">
        <div className="flex items-end justify-between mb-6 sm:mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-text tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs sm:text-sm text-text-muted mt-1">
                {subtitle}
              </p>
            )}
          </div>
          {viewAllLink && (
            <Link
              href={viewAllLink}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary hover:text-secondary-hover tracking-wider uppercase"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        <ProductGrid products={products} isLoading={isLoading} />
      </div>
    </section>
  );
}
