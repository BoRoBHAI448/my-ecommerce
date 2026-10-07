import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/api/storefront";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ProductView } from "@/components/product/ProductView";
import { ReviewsSection } from "@/components/product/ReviewsSection";
import { RelatedProducts } from "@/components/product/RelatedProducts";

export async function generateMetadata(props) {
  const params = await props.params;
  const productRes = await getProductBySlug(params.slug);
  const product = productRes?.data;

  if (!product) {
    return { title: "Product Not Found" };
  }

  const price = product.discount_price || product.min_price || product.selling_price;

  return {
    title: product.name,
    description: product.description?.slice(0, 160) || `Buy ${product.name} online at best price.`,
    openGraph: {
      title: product.name,
      description: product.description?.slice(0, 160),
      images: product.image ? [{ url: product.image }] : [],
    },
  };
}

export default async function ProductPage(props) {
  const params = await props.params;
  const slug = params.slug;

  const [productRes, relatedRes] = await Promise.all([
    getProductBySlug(slug),
    getRelatedProducts(slug, 4),
  ]);

  const product = productRes?.data;
  if (!product) {
    notFound();
  }

  const relatedProducts = relatedRes?.data || [];
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
      {/* JSON-LD Script tag */}
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
      <RelatedProducts products={relatedProducts} />
    </div>
  );
}
