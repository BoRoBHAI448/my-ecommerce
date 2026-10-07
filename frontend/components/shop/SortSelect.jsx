"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function SortSelect({ currentSort = "latest", className }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleSortChange(e) {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    params.set("page", "1"); // Reset to page 1 on sort change
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <label htmlFor="sort-select" className="text-xs text-text-muted font-medium whitespace-nowrap">
        Sort by:
      </label>
      <select
        id="sort-select"
        value={currentSort}
        onChange={handleSortChange}
        className="h-9 px-3 py-1.5 rounded-theme border border-border bg-surface text-xs font-semibold text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer"
      >
        <option value="latest">Newest Arrivals</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
      </select>
    </div>
  );
}
