import { notFound } from "next/navigation";
import { getProducts, getCategories, getBrands } from "@/lib/api/storefront";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { CatalogHeader } from "@/components/shop/CatalogHeader";
import { ActiveFilters } from "@/components/shop/ActiveFilters";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Pagination } from "@/components/shop/Pagination";

export const instant = false;

function formatSlugToTitle(slug) {
  if (!slug) return "";
  const decoded = decodeURIComponent(slug);
  return decoded
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function generateMetadata(props) {
  const params = await props.params;
  const slug = params.slug;
  const brandsRes = await getBrands();
  const brands = brandsRes?.data || [];
  const brand = brands.find((b) => {
    if (!b?.slug) return false;
    const cleanB = b.slug.toLowerCase().replace(/[^a-z0-9]/g, "");
    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9]/g, "");
    return b.slug === slug || b.slug === decodeURIComponent(slug) || cleanB === cleanSlug;
  });

  const titleName = brand?.name || formatSlugToTitle(slug);

  return {
    title: `${titleName} Products`,
    description: `Shop authentic collection from ${titleName}.`,
  };
}

export default async function BrandPage(props) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const slug = params.slug;

  const sort = searchParams?.sort || "latest";
  const category = searchParams?.category || "";
  const min_price = searchParams?.min_price || "";
  const max_price = searchParams?.max_price || "";
  const page = Number(searchParams?.page || 1);

  const [productsRes, categoriesRes, brandsRes] = await Promise.all([
    getProducts({
      brand: slug,
      category,
      sort,
      min_price,
      max_price,
      page,
      per_page: 12,
    }),
    getCategories(),
    getBrands(),
  ]);

  const brands = brandsRes?.data || [];
  const currentBrand = brands.find((b) => {
    if (!b?.slug) return false;
    const cleanB = b.slug.toLowerCase().replace(/[^a-z0-9]/g, "");
    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9]/g, "");
    return b.slug === slug || b.slug === decodeURIComponent(slug) || cleanB === cleanSlug;
  });

  const brandTitle = currentBrand?.name || formatSlugToTitle(slug);

  const products = productsRes?.data || [];
  const meta = productsRes?.meta || { current_page: 1, last_page: 1, total: 0 };
  const categories = categoriesRes?.data || [];

  return (
    <div className="container-custom py-4 sm:py-6">
      <Breadcrumbs
        items={[
          { label: "Shop", href: "/shop" },
          { label: brandTitle },
        ]}
      />

      <div className="py-2 mb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-text tracking-tight">
          {brandTitle}
        </h1>
        <p className="text-xs sm:text-sm text-text-muted mt-1">
          Explore products crafted by {brandTitle}
        </p>
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
            emptyTitle={`No products for ${brandTitle}`}
            emptyMessage="There are currently no products available from this brand with your active filters."
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
