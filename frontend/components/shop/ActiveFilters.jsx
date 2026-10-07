"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { X } from "lucide-react";
import { formatPrice } from "@/lib/format";

export function ActiveFilters({ categories = [], brands = [] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategorySlug = searchParams.get("category");
  const currentBrandSlug = searchParams.get("brand");
  const minPrice = searchParams.get("min_price");
  const maxPrice = searchParams.get("max_price");
  const search = searchParams.get("search");

  const activeCategory = categories.find((c) => c.slug === currentCategorySlug);
  const activeBrand = brands.find((b) => b.slug === currentBrandSlug);

  const hasFilters = Boolean(
    currentCategorySlug || currentBrandSlug || minPrice || maxPrice || search
  );

  if (!hasFilters) return null;

  function removeFilter(key) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }

  function clearAll() {
    router.push(pathname);
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4 py-2">
      <span className="text-xs font-semibold text-text-muted">Active:</span>

      {search && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-text border border-border">
          Query: &ldquo;{search}&rdquo;
          <button
            type="button"
            onClick={() => removeFilter("search")}
            className="hover:text-danger ml-0.5"
            aria-label="Remove search filter"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {activeCategory && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-text border border-border">
          Category: {activeCategory.name}
          <button
            type="button"
            onClick={() => removeFilter("category")}
            className="hover:text-danger ml-0.5"
            aria-label="Remove category filter"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {activeBrand && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-text border border-border">
          Brand: {activeBrand.name}
          <button
            type="button"
            onClick={() => removeFilter("brand")}
            className="hover:text-danger ml-0.5"
            aria-label="Remove brand filter"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {(minPrice || maxPrice) && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-text border border-border">
          Price: {minPrice ? formatPrice(minPrice) : "৳0"} – {maxPrice ? formatPrice(maxPrice) : "Any"}
          <button
            type="button"
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());
              params.delete("min_price");
              params.delete("max_price");
              params.set("page", "1");
              router.push(`${pathname}?${params.toString()}`);
            }}
            className="hover:text-danger ml-0.5"
            aria-label="Remove price filter"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      <button
        type="button"
        onClick={clearAll}
        className="text-xs font-semibold text-danger hover:underline ml-1"
      >
        Clear All
      </button>
    </div>
  );
}
