"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store-context";
import { LookbookProductDetail } from "@/components/product/LookbookProductDetail";
import { mockProducts } from "@/lib/api/mock/data";
import { getStorefrontProductBySlug } from "@/lib/supabase/products";
import { Button } from "@/components/ui/Button";
import { Compass, Home, ShoppingBag, Loader2 } from "lucide-react";

export function ProductDetailClient({ initialProduct, slug, initialRelated = [] }) {
  const { products: storeProducts } = useStore();
  const [mounted, setMounted] = useState(false);
  const [supabaseProduct, setSupabaseProduct] = useState(null);

  useEffect(() => {
    setMounted(true);
    async function loadFromSupabase() {
      try {
        const live = await getStorefrontProductBySlug(slug);
        if (live) {
          const rawImages = Array.isArray(live.images) && live.images.length > 0 ? live.images : [live.thumbnail || "/images/wardrobe-1.jpg"];
          // Pad to 4 images for 2x2 grid if fewer
          const paddedImages = rawImages.length >= 4 ? rawImages.slice(0, 4) : [
            rawImages[0],
            rawImages[1] || rawImages[0],
            rawImages[2] || rawImages[0],
            rawImages[3] || rawImages[0],
          ];

          setSupabaseProduct({
            id: String(live.id),
            name: live.name,
            slug: live.slug,
            sku: live.sku || "FV-782-6F7D",
            selling_price: Number(live.regular_price || 0),
            discount_price: Number(live.selling_price || 0),
            has_discount: Boolean(live.discount_price || live.regular_price > live.selling_price),
            discount_badge:
              live.discount_badge ||
              (live.discount_price && live.regular_price
                ? `${Math.round(
                    ((live.regular_price - live.selling_price) /
                      live.regular_price) *
                      100
                  )}%`
                : null),
            rating: Number(live.rating || 5.0),
            review_count: Number(live.review_count || 0),
            stock_count: Number(live.stock || 44),
            in_stock: Boolean(live.in_stock),
            short_description:
              live.short_description || live.description?.slice(0, 200),
            description: live.description,
            image: live.thumbnail || live.images?.[0] || "/images/wardrobe-1.jpg",
            images: paddedImages,
            category: {
              name: live.gender || "Dresses",
              slug: (live.gender || "dresses").toLowerCase(),
            },
          });
        }
      } catch (err) {
        console.warn("Supabase PDP product load notice:", err);
      }
    }
    loadFromSupabase();
  }, [slug]);

  // Find product from Supabase, SSR, client-side store, mock catalogue, or localStorage
  const product = useMemo(() => {
    if (supabaseProduct) return supabaseProduct;
    if (initialProduct) return initialProduct;

    // Search in mockProducts directly (lookbook items)
    const mockFound = mockProducts.find(
      (p) => p.slug === slug || String(p.id) === String(slug)
    );
    if (mockFound) return mockFound;

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

  // Related products fallback
  const relatedProducts = useMemo(() => {
    if (initialRelated && initialRelated.length > 0) return initialRelated;
    if (!product) return [];

    // Prioritize dresses / lookbook related items
    const related = mockProducts
      .filter((p) => p.slug !== product.slug)
      .slice(0, 4);

    return related;
  }, [initialRelated, product]);

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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LookbookProductDetail
        product={product}
        relatedProducts={relatedProducts}
      />
    </>
  );
}
