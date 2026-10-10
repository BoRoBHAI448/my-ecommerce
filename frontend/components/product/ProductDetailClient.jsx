"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store-context";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ProductView } from "@/components/product/ProductView";
import { ReviewsSection } from "@/components/product/ReviewsSection";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { Button } from "@/components/ui/Button";
import { Compass, Home, ShoppingBag, Loader2 } from "lucide-react";

export function ProductDetailClient({ initialProduct, slug, initialRelated = [] }) {
  const { products: storeProducts } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Find product from SSR or client-side store/localStorage
  const product = useMemo(() => {
    if (initialProduct) return initialProduct;
    if (!mounted) return null;

    // Search in StoreContext
    if (Array.isArray(storeProducts) && storeProducts.length > 0) {
      const found = storeProducts.find(
        (p) => p.slug === slug || String(p.id) === String(slug)
      );
      if (found) return found;
    }

    // Search in localStorage directly
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("store_custom_products");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            const found = parsed.find(
              (p) => p.slug === slug || String(p.id) === String(slug)
            );
            if (found) return found;
          }
        }
      } catch {}
    }

    return null;
  }, [initialProduct, mounted, storeProducts, slug]);

  // Related products fallback from store
  const relatedProducts = useMemo(() => {
    if (initialRelated && initialRelated.length > 0) return initialRelated;
    if (!product) return [];

    const allProds = Array.isArray(storeProducts) && storeProducts.length > 0 ? storeProducts : [];
    return allProds
      .filter((p) => p.slug !== product.slug && p.category?.slug === product.category?.slug)
      .slice(0, 4);
  }, [initialRelated, product, storeProducts]);

  // During SSR or first client render before mounting when initialProduct wasn't in SSR
  if (!product && !mounted) {
    return (
      <div className="container-custom py-16 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-3" />
        <p className="text-sm font-medium text-slate-500">Loading product details...</p>
      </div>
    );
  }

  // Not found after client mount
  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center p-8 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <Compass className="w-8 h-8" />
          </div>
          <span className="text-4xl font-black text-amber-500">404</span>
          <h2 className="text-xl font-bold text-slate-900 mt-1 mb-2">Product Not Found</h2>
          <p className="text-xs sm:text-sm text-slate-500 mb-6">
            The product you are looking for might have been removed, renamed, or is unavailable.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="md"
                leftIcon={<Home className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                Return Home
              </Button>
            </Link>
            <Link href="/shop" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="md"
                leftIcon={<ShoppingBag className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                Browse Shop
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentPrice = product.discount_price || product.min_price || product.selling_price;

  // JSON-LD structured data for rich snippets in Google search
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images || [product.image],
    description: product.description,
    brand: {
      "@type": "Brand",
      name: product.brand?.name || "Apex Artisan",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "BDT",
      price: currentPrice,
      availability: product.in_stock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="container-custom py-4 sm:py-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumbs
        items={[
          { label: "Shop", href: "/shop" },
          {
            label: product.category?.name || "Category",
            href: `/category/${product.category?.slug || ""}`,
          },
          { label: product.name },
        ]}
      />

      {/* Main Interactive Product View */}
      <ProductView product={product} />

      {/* Reviews & Social Proof */}
      <ReviewsSection
        reviews={product.reviews || []}
        rating={product.rating || 5}
        count={product.review_count || 0}
      />

      {/* Related Complementary Products */}
      {relatedProducts.length > 0 && <RelatedProducts products={relatedProducts} />}
    </div>
  );
}
