"use client";

import { useState, useEffect, useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { ProductCard } from "./ProductCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store-context";

export function ProductGrid({
  products: initialProducts = [],
  isLoading = false,
  emptyMessage,
  emptyTitle,
  className,
  columns = 4,
}) {
  const { products: storeProducts } = useStore();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setMounted(true);
  }, []);

  const products = useMemo(() => {
    if (!mounted) {
      return initialProducts;
    }

    // After mounting, build the candidate list from localStorage / StoreContext.
    // localStorage is the source of truth for user-created products.
    let candidateList = [];
    if (Array.isArray(storeProducts) && storeProducts.length > 0) {
      candidateList = storeProducts;
    } else if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("store_custom_products");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            candidateList = parsed;
          }
        }
      } catch {}
    }

    // If no local data at all, fall back to server-side initial products
    if (candidateList.length === 0) {
      return initialProducts;
    }

    // We have localStorage data — always prefer it over SSR initialProducts.
    let list = [...candidateList];

    // 1. If on Category Page (/category/[slug]) — filter by category
    if (pathname?.startsWith("/category/")) {
      const rawSlug = pathname.replace("/category/", "").split("/")[0];
      if (rawSlug) {
        const slug = decodeURIComponent(rawSlug).toLowerCase().replace(/[^a-z0-9]/g, "");
        return list.filter((p) => {
          if (!p.category) return false;
          const cSlug = (p.category.slug || "").toLowerCase().replace(/[^a-z0-9]/g, "");
          const cName = (p.category.name || "").toLowerCase().replace(/[^a-z0-9]/g, "");
          return cSlug === slug || cName === slug;
        });
        // NOTE: returns filtered list (may be empty — shows EmptyState correctly)
      }
    }

    // 2. If on Brand Page (/brand/[slug]) — filter by brand
    if (pathname?.startsWith("/brand/")) {
      const rawSlug = pathname.replace("/brand/", "").split("/")[0];
      if (rawSlug) {
        const slug = decodeURIComponent(rawSlug).toLowerCase().replace(/[^a-z0-9]/g, "");
        return list.filter((p) => {
          if (!p.brand) return false;
          const bSlug = (p.brand.slug || "").toLowerCase().replace(/[^a-z0-9]/g, "");
          const bName = (p.brand.name || "").toLowerCase().replace(/[^a-z0-9]/g, "");
          return bSlug === slug || bName === slug;
        });
      }
    }

    // 3. Query-param filters (/shop, /search, etc.)
    const qCategory = searchParams?.get("category");
    const qBrand = searchParams?.get("brand");
    const qSearch = searchParams?.get("search") || searchParams?.get("q");
    const qFeatured = searchParams?.get("featured");

    if (qCategory) {
      const cleanCat = decodeURIComponent(qCategory).toLowerCase().replace(/[^a-z0-9]/g, "");
      list = list.filter((p) => {
        if (!p.category) return false;
        const cSlug = (p.category.slug || "").toLowerCase().replace(/[^a-z0-9]/g, "");
        const cName = (p.category.name || "").toLowerCase().replace(/[^a-z0-9]/g, "");
        return cSlug === cleanCat || cName === cleanCat;
      });
    }

    if (qBrand) {
      const cleanB = decodeURIComponent(qBrand).toLowerCase().replace(/[^a-z0-9]/g, "");
      list = list.filter((p) => {
        if (!p.brand) return false;
        const bSlug = (p.brand.slug || "").toLowerCase().replace(/[^a-z0-9]/g, "");
        const bName = (p.brand.name || "").toLowerCase().replace(/[^a-z0-9]/g, "");
        return bSlug === cleanB || bName === cleanB;
      });
    }

    if (qSearch) {
      const q = qSearch.toLowerCase();
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.category?.name?.toLowerCase().includes(q) ||
          p.brand?.name?.toLowerCase().includes(q)
      );
    }

    if (qFeatured === "true" || qFeatured === "1") {
      list = list.filter((p) => p.is_featured);
    }

    // Return filtered list. If no query filters were active, this is the full candidateList.
    return list;
  }, [mounted, storeProducts, initialProducts, pathname, searchParams]);
  if (isLoading) {
    return (
      <div
        className={cn(
          "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6",
          columns === 3 && "lg:grid-cols-3",
          className
        )}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="w-full aspect-square rounded-theme" />
            <Skeleton className="w-3/4 h-4 rounded-theme" />
            <Skeleton className="w-1/2 h-4 rounded-theme" />
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        title={emptyTitle || "No products found"}
        description={emptyMessage || "There are no products available in this collection right now."}
        actionLabel="Explore All Products"
        actionHref="/shop"
      />
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6",
        columns === 3 && "lg:grid-cols-3",
        className
      )}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
