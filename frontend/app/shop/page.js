import { getProducts, getCategories, getBrands } from "@/lib/api/storefront";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { CatalogHeader } from "@/components/shop/CatalogHeader";
import { ActiveFilters } from "@/components/shop/ActiveFilters";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Pagination } from "@/components/shop/Pagination";

export const metadata = {
  title: "Shop All Collections",
  description: "Browse our complete catalog of curated apparel, leather accessories, and footwear.",
};

export default async function ShopPage(props) {
  const searchParams = await props.searchParams;
  const sort = searchParams?.sort || "latest";
  const category = searchParams?.category || "";
  const brand = searchParams?.brand || "";
  const min_price = searchParams?.min_price || "";
  const max_price = searchParams?.max_price || "";
  const search = searchParams?.search || "";
  const page = Number(searchParams?.page || 1);

  const [productsRes, categoriesRes, brandsRes] = await Promise.all([
    getProducts({
      sort,
      category,
      brand,
      min_price,
      max_price,
      search,
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
      <Breadcrumbs items={[{ label: "Shop All Products" }]} />

      <div className="py-2 mb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-text tracking-tight">
          All Products
        </h1>
        <p className="text-xs sm:text-sm text-text-muted mt-1">
          Explore our signature craftsmanship and timeless essentials
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start pt-2">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block lg:col-span-1 sticky top-28 bg-surface p-5 rounded-theme border border-border/80 shadow-2xs">
          <FilterSidebar categories={categories} brands={brands} />
        </div>

        {/* Product Listing Main Area */}
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
            emptyTitle="No matching products"
            emptyMessage="No items match your active filters. Try adjusting your price range or category selection."
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
