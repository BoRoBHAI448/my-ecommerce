import { ProductGrid } from "./ProductGrid";

export function RelatedProducts({ products = [] }) {
  if (!products || products.length === 0) return null;

  return (
    <div className="py-12 border-t border-border">
      <h3 className="text-xl font-black text-text tracking-tight mb-2">
        You May Also Like
      </h3>
      <p className="text-xs sm:text-sm text-text-muted mb-6">
        Curated recommendations that complement this piece
      </p>

      <ProductGrid products={products} columns={4} />
    </div>
  );
}
