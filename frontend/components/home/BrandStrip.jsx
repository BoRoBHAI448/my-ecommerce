import Link from "next/link";

export function BrandStrip({ brands = [] }) {
  if (!brands || brands.length === 0) return null;

  return (
    <section className="py-8 sm:py-10 border-t border-b border-border/70 bg-surface/60">
      <div className="container-custom">
        <div className="text-center mb-6">
          <span className="text-[11px] font-bold tracking-widest text-text-muted uppercase">
            Curated Heritage & Contemporary Brands
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/brand/${brand.slug}`}
              className="flex items-center justify-center px-4 py-2 text-sm sm:text-base font-black tracking-widest uppercase text-text-muted/70 hover:text-text transition-colors duration-200"
            >
              {brand.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
