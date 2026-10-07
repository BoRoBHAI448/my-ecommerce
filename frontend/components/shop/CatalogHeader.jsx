"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { SortSelect } from "./SortSelect";
import { FilterDrawer } from "./FilterDrawer";
import { SlidersHorizontal } from "lucide-react";

export function CatalogHeader({
  total = 0,
  currentSort = "latest",
  categories = [],
  brands = [],
}) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-2 border-b border-border/80">
        <div className="flex items-center gap-3">
          {/* Mobile Filter Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsFilterOpen(true)}
            leftIcon={<SlidersHorizontal className="w-3.5 h-3.5" />}
            className="lg:hidden text-xs"
          >
            Filters
          </Button>

          <p className="text-xs sm:text-sm text-text-muted">
            Showing <span className="font-bold text-text">{total}</span> {total === 1 ? "item" : "items"}
          </p>
        </div>

        <SortSelect currentSort={currentSort} />
      </div>

      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        categories={categories}
        brands={brands}
      />
    </>
  );
}
