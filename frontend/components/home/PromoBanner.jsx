import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function PromoBanner({ banners = [] }) {
  if (!banners || banners.length === 0) return null;

  return (
    <section className="py-12 sm:py-20 bg-neutral-950 text-white overflow-hidden">
      <div className="container-custom">
        {banners.map((item, index) => (
          <div
            key={item.id || index}
            className="relative rounded-2xl sm:rounded-3xl overflow-hidden min-h-[460px] sm:min-h-[540px] flex items-center group"
          >
            {/* Background Image */}
            <Image
              src={item.image}
              alt={item.title || "Spotlight editorial"}
              fill
              sizes="100vw"
              className="object-cover object-center scale-100 group-hover:scale-103 transition-transform duration-1000 ease-out"
            />

            {/* Gradient Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/95 via-neutral-950/40 to-neutral-950/20 sm:bg-gradient-to-r sm:from-neutral-950/90 sm:via-neutral-950/50 sm:to-transparent" />

            {/* Content */}
            <div className="relative z-10 p-8 sm:p-16 max-w-2xl space-y-4 sm:space-y-6">
              {item.badge && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span className="text-[11px] font-black tracking-[0.25em] uppercase text-white">
                    {item.badge}
                  </span>
                </div>
              )}

              <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-[0.95]">
                {item.title}
              </h2>

              {item.subtitle && (
                <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-normal max-w-lg">
                  {item.subtitle}
                </p>
              )}

              <div className="pt-2">
                <Link
                  href={item.link || "/shop?featured=true"}
                  className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 bg-white text-black font-black uppercase tracking-wider text-xs sm:text-sm hover:bg-neutral-200 transition-all shadow-xl hover:scale-105 active:scale-95"
                >
                  <span>{item.button_text || "Discover The Edit"}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
