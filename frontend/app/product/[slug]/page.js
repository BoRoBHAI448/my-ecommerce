import { getProductBySlug, getRelatedProducts } from "@/lib/api/storefront";
import { ProductDetailClient } from "@/components/product/ProductDetailClient";

// Allow blocking on params (Next.js 16+ instant shell opt-out)
export const instant = false;

export async function generateMetadata(props) {
  const params = await props.params;
  const productRes = await getProductBySlug(params.slug);
  const product = productRes?.data;

  if (!product) {
    return { title: "Product Details" };
  }

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

  const product = productRes?.data || null;
  const relatedProducts = relatedRes?.data || [];

  return (
    <ProductDetailClient
      initialProduct={product}
      slug={slug}
      initialRelated={relatedProducts}
    />
  );
}

