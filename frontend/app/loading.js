import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="container-custom py-10 space-y-8 animate-pulse">
      {/* Hero skeleton */}
      <Skeleton className="w-full h-72 sm:h-96 rounded-theme" />

      {/* Categories strip skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-theme" />
        ))}
      </div>

      {/* Products grid skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pt-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="w-full aspect-square rounded-theme" />
            <Skeleton className="w-3/4 h-4 rounded-theme" />
            <Skeleton className="w-1/2 h-4 rounded-theme" />
          </div>
        ))}
      </div>
    </div>
  );
}
