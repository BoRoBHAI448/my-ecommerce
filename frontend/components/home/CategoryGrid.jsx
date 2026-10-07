import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function CategoryGrid({ categories = [] }) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-8 sm:py-12">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-text tracking-tight">
              Shop by Category
            </h2>
            <p className="text-xs sm:text-sm text-text-muted mt-0.5">
              Explore curated styles across our popular departments
            </p>
          </div>
          <Link
            href="/shop"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-secondary hover:underline tracking-wider uppercase"
          >
            <span>All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="group relative flex flex-col items-center p-3 rounded-theme bg-surface border border-border/80 hover:border-secondary hover:shadow-md transition-all duration-300"
            >
              {/* Circle / Rounded Image Box */}
              <div className="relative w-full aspect-square rounded-theme overflow-hidden bg-muted mb-3">
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover group-hover:scale-108 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text-muted font-bold text-lg">
                    {cat.name.charAt(0)}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
              </div>

              {/* Title & Subcount */}
              <h3 className="font-bold text-xs sm:text-sm text-text group-hover:text-secondary text-center transition-colors">
                {cat.name}
              </h3>
              {cat.children?.length > 0 && (
                <span className="text-[11px] text-text-muted mt-0.5">
                  {cat.children.length} sub-categories
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
