import { ProductCard } from "./ProductCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils";

export function ProductGrid({
  products = [],
  isLoading = false,
  emptyMessage,
  emptyTitle,
  className,
  columns = 4,
}) {
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
