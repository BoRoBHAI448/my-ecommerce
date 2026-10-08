import { getProducts, getCategories, getBrands } from "@/lib/api/storefront";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { CatalogHeader } from "@/components/shop/CatalogHeader";
import { ActiveFilters } from "@/components/shop/ActiveFilters";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Pagination } from "@/components/shop/Pagination";
import { Search } from "lucide-react";

export const instant = false;

export async function generateMetadata(props) {
  const searchParams = await props.searchParams;
  const q = searchParams?.q || "";

  return {
    title: q ? `Search results for "${q}"` : "Search Products",
    description: `Find products matching "${q}" at Apex Cart.`,
  };
}

export default async function SearchPage(props) {
  const searchParams = await props.searchParams;
  const query = searchParams?.q || "";
  const sort = searchParams?.sort || "latest";
  const category = searchParams?.category || "";
  const brand = searchParams?.brand || "";
  const min_price = searchParams?.min_price || "";
  const max_price = searchParams?.max_price || "";
  const page = Number(searchParams?.page || 1);

  const [productsRes, categoriesRes, brandsRes] = await Promise.all([
    getProducts({
      search: query,
      category,
      brand,
      sort,
      min_price,
      max_price,
      page,
      per_page: 12,
    }),
    getCategories(),
    getBrands(),
  ]);

  const products = productsRes?.data || [];
  const meta = productsRes?.meta || { current_page: 1, last_page: 1, total: 0 };
  const categories = categoriesRes?.data || [];
  const brands = brandsRes?.data || [];

  return (
    <div className="container-custom py-4 sm:py-6">
      <Breadcrumbs
        items={[
          { label: "Shop", href: "/shop" },
          { label: query ? `Search: "${query}"` : "Search" },
        ]}
      />

      <div className="py-2 mb-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-text-muted shrink-0">
          <Search className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-text tracking-tight">
            {query ? (
              <>
                Search results for &ldquo;<span className="text-secondary">{query}</span>&rdquo;
              </>
            ) : (
              "Search Products"
            )}
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-0.5">
            {meta.total} {meta.total === 1 ? "result found" : "results found"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start pt-2">
        <div className="hidden lg:block lg:col-span-1 sticky top-28 bg-surface p-5 rounded-theme border border-border/80 shadow-2xs">
          <FilterSidebar categories={categories} brands={brands} />
        </div>

        <div className="lg:col-span-3">
          <CatalogHeader
            total={meta.total}
            currentSort={sort}
            categories={categories}
            brands={brands}
          />

          <ActiveFilters categories={categories} brands={brands} />

          <ProductGrid
            products={products}
            columns={3}
            emptyTitle={`No results found for "${query}"`}
            emptyMessage="Check your spelling or try broader search terms like 'shirt', 'loafer', or 'wallet'."
          />

          <Pagination
            currentPage={meta.current_page}
            lastPage={meta.last_page}
          />
        </div>
      </div>
    </div>
  );
}
