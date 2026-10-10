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
  const formatted = decoded.replace(/-s\b/gi, "'s");
  return formatted
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function generateMetadata(props) {
  const params = await props.params;
  const slug = params.slug;
  const categoriesRes = await getCategories();
  const categories = categoriesRes?.data || [];
  const category = categories.find((c) => {
    if (!c?.slug) return false;
    const cleanC = c.slug.toLowerCase().replace(/[^a-z0-9]/g, "");
    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9]/g, "");
    return c.slug === slug || c.slug === decodeURIComponent(slug) || cleanC === cleanSlug;
  });

  const titleName = category?.name || formatSlugToTitle(slug);

  return {
    title: `${titleName} Collection`,
    description: `Explore premium ${titleName} styles and collections.`,
  };
}

export default async function CategoryPage(props) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const slug = params.slug;

  const sort = searchParams?.sort || "latest";
  const brand = searchParams?.brand || "";
  const min_price = searchParams?.min_price || "";
  const max_price = searchParams?.max_price || "";
  const page = Number(searchParams?.page || 1);

  const [productsRes, categoriesRes, brandsRes] = await Promise.all([
    getProducts({
      category: slug,
      sort,
      brand,
      min_price,
      max_price,
      page,
      per_page: 12,
    }),
    getCategories(),
    getBrands(),
  ]);

  const categories = categoriesRes?.data || [];
  const currentCategory = categories.find((c) => {
    if (!c?.slug) return false;
    const cleanC = c.slug.toLowerCase().replace(/[^a-z0-9]/g, "");
    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9]/g, "");
    return c.slug === slug || c.slug === decodeURIComponent(slug) || cleanC === cleanSlug;
  });

  const categoryTitle = currentCategory?.name || formatSlugToTitle(slug);

  const products = productsRes?.data || [];
  const meta = productsRes?.meta || { current_page: 1, last_page: 1, total: 0 };
  const brands = brandsRes?.data || [];

  return (
    <div className="container-custom py-4 sm:py-6">
      <Breadcrumbs
        items={[
          { label: "Shop", href: "/shop" },
          { label: categoryTitle },
        ]}
      />

      <div className="py-2 mb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-text tracking-tight">
          {categoryTitle}
        </h1>
        {currentCategory?.children?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {currentCategory.children.map((sub) => (
              <span
                key={sub.id}
                className="px-3 py-1 text-xs font-semibold rounded-full bg-muted text-text hover:bg-slate-200 transition-colors"
              >
                {sub.name}
              </span>
            ))}
          </div>
        )}
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
            emptyTitle={`No products in ${categoryTitle}`}
            emptyMessage="There are currently no items available in this category with your active filters."
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
