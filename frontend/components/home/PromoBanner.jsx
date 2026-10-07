import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function PromoBanner({ banners = [] }) {
  if (!banners || banners.length === 0) return null;

  return (
    <section className="py-8 sm:py-12">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {banners.map((item, index) => (
            <Link
              key={item.id || index}
              href={item.link || "/shop"}
              className="group relative h-64 sm:h-72 rounded-theme overflow-hidden shadow-sm border border-border/60"
            >
              {/* Background Image */}
              <Image
                src={item.image}
                alt={item.title || "Promotion"}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent" />

              {/* Text overlay */}
              <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end text-white">
                <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-snug mb-1">
                  {item.title}
                </h3>
                {item.subtitle && (
                  <p className="text-xs sm:text-sm text-slate-200 line-clamp-1 mb-4 font-normal">
                    {item.subtitle}
                  </p>
                )}
                <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform tracking-wider uppercase">
                  <span>Explore Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
