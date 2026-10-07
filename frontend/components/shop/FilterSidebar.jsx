"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ChevronDown, SlidersHorizontal, RotateCcw } from "lucide-react";

export function FilterSidebar({ categories = [], brands = [], className }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") || "";
  const currentBrand = searchParams.get("brand") || "";
  const currentMinPrice = searchParams.get("min_price") || "";
  const currentMaxPrice = searchParams.get("max_price") || "";

  const [minPrice, setMinPrice] = useState(currentMinPrice);
  const [maxPrice, setMaxPrice] = useState(currentMaxPrice);

  function updateQuery(key, value) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }

  function handlePriceApply(e) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (minPrice) params.set("min_price", minPrice);
    else params.delete("min_price");

    if (maxPrice) params.set("max_price", maxPrice);
    else params.delete("max_price");

    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }

  function handleReset() {
    setMinPrice("");
    setMaxPrice("");
    router.push(pathname);
  }

  return (
    <aside className={className}>
      <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-text-muted" />
          <h3 className="text-sm font-bold text-text uppercase tracking-wider">
            Filters
          </h3>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="text-xs text-text-muted hover:text-danger inline-flex items-center gap-1 font-medium transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      <div className="space-y-6">
        {/* Categories Section */}
        <div>
          <h4 className="text-xs font-bold text-text uppercase tracking-wider mb-3">
            Categories
          </h4>
          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
            <button
              type="button"
              onClick={() => updateQuery("category", "")}
              className={`block w-full text-left text-xs py-1.5 px-2 rounded-theme transition-colors font-medium ${
                !currentCategory
                  ? "bg-primary text-primary-contrast font-bold"
                  : "text-text hover:bg-muted"
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => updateQuery("category", cat.slug)}
                className={`block w-full text-left text-xs py-1.5 px-2 rounded-theme transition-colors font-medium ${
                  currentCategory === cat.slug
                    ? "bg-primary text-primary-contrast font-bold"
                    : "text-text hover:bg-muted"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Brands Section */}
        {brands.length > 0 && (
          <div className="border-t border-border pt-6">
            <h4 className="text-xs font-bold text-text uppercase tracking-wider mb-3">
              Brands
            </h4>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              <button
                type="button"
                onClick={() => updateQuery("brand", "")}
                className={`block w-full text-left text-xs py-1.5 px-2 rounded-theme transition-colors font-medium ${
                  !currentBrand
                    ? "bg-primary text-primary-contrast font-bold"
                    : "text-text hover:bg-muted"
                }`}
              >
                All Brands
              </button>
              {brands.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => updateQuery("brand", b.slug)}
                  className={`block w-full text-left text-xs py-1.5 px-2 rounded-theme transition-colors font-medium ${
                    currentBrand === b.slug
                      ? "bg-primary text-primary-contrast font-bold"
                      : "text-text hover:bg-muted"
                  }`}
                >
                  {b.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Price Range */}
        <div className="border-t border-border pt-6">
          <h4 className="text-xs font-bold text-text uppercase tracking-wider mb-3">
            Price Range (৳)
          </h4>
          <form onSubmit={handlePriceApply} className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full h-8 px-2.5 rounded-theme border border-border bg-surface text-xs text-text placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full h-8 px-2.5 rounded-theme border border-border bg-surface text-xs text-text placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <Button type="submit" variant="outline" size="sm" className="w-full text-xs">
              Apply Price
            </Button>
          </form>
        </div>
      </div>
    </aside>
  );
}
