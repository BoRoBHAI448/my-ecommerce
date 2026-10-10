import Link from "next/link";

export function BrandStrip({ brands = [] }) {
  if (!brands || brands.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 border-t border-b border-neutral-200/80 bg-neutral-50/40">
      <div className="container-custom">
        <div className="text-center mb-8">
          <span className="text-[11px] font-black tracking-[0.3em] text-neutral-400 uppercase">
            Curated Heritage & Contemporary Brands
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/brand/${brand.slug}`}
              className="group flex items-center justify-center px-4 py-2 text-sm sm:text-base font-black tracking-[0.25em] uppercase text-neutral-400 hover:text-neutral-950 transition-colors duration-300"
            >
              <span className="group-hover:scale-105 transition-transform">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
