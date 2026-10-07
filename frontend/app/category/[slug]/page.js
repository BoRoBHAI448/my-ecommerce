import { notFound } from "next/navigation";
import { getProducts, getCategories, getBrands } from "@/lib/api/storefront";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { CatalogHeader } from "@/components/shop/CatalogHeader";
import { ActiveFilters } from "@/components/shop/ActiveFilters";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Pagination } from "@/components/shop/Pagination";

export async function generateMetadata(props) {
  const params = await props.params;
  const categoriesRes = await getCategories();
  const category = categoriesRes?.data?.find((c) => c.slug === params.slug);

  if (!category) return { title: "Category Not Found" };

  return {
    title: `${category.name} Collection`,
    description: `Explore premium ${category.name} styles and collections.`,
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
  const currentCategory = categories.find((c) => c.slug === slug);

  if (!currentCategory && productsRes?.data?.length === 0) {
    notFound();
  }

  const products = productsRes?.data || [];
  const meta = productsRes?.meta || { current_page: 1, last_page: 1, total: 0 };
  const brands = brandsRes?.data || [];

  return (
    <div className="container-custom py-4 sm:py-6">
      <Breadcrumbs
        items={[
          { label: "Shop", href: "/shop" },
          { label: currentCategory?.name || slug },
        ]}
      />

      <div className="py-2 mb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-text tracking-tight">
          {currentCategory?.name || slug}
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
            emptyTitle={`No products in ${currentCategory?.name || "this category"}`}
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
