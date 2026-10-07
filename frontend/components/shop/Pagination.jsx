"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Pagination({ currentPage = 1, lastPage = 1 }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (lastPage <= 1) return null;

  function createPageUrl(pageNumber) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(pageNumber));
    return `${pathname}?${params.toString()}`;
  }

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1.5 py-8">
      {/* Previous Page */}
      {currentPage > 1 ? (
        <Link
          href={createPageUrl(currentPage - 1)}
          className="inline-flex items-center justify-center w-9 h-9 rounded-theme border border-border bg-surface text-text hover:bg-muted transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </Link>
      ) : (
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-theme border border-border/50 text-text-muted/40 cursor-not-allowed">
          <ChevronLeft className="w-4 h-4" />
        </span>
      )}

      {/* Page Numbers */}
      {Array.from({ length: lastPage }).map((_, i) => {
        const page = i + 1;
        const isActive = page === currentPage;

        return (
          <Link
            key={page}
            href={createPageUrl(page)}
            className={cn(
              "inline-flex items-center justify-center w-9 h-9 rounded-theme text-xs font-bold transition-all",
              isActive
                ? "bg-primary text-primary-contrast shadow-xs"
                : "border border-border bg-surface text-text hover:bg-muted"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {page}
          </Link>
        );
      })}

      {/* Next Page */}
      {currentPage < lastPage ? (
        <Link
          href={createPageUrl(currentPage + 1)}
          className="inline-flex items-center justify-center w-9 h-9 rounded-theme border border-border bg-surface text-text hover:bg-muted transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </Link>
      ) : (
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-theme border border-border/50 text-text-muted/40 cursor-not-allowed">
          <ChevronRight className="w-4 h-4" />
        </span>
      )}
    </nav>
  );
}
