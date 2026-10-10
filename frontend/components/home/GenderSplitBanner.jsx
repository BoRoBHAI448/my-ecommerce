"use client";

import Link from "next/link";
import Image from "next/image";

export function GenderSplitBanner() {
  return (
    <section className="w-full bg-white py-2 sm:py-3 select-none">
      {/* ── 100% Edge-to-Edge Full Screen Width ── */}
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1 sm:gap-1.5 md:gap-2">
          {/* ── 1. WOMEN Editorial Showcase ── */}
          <Link
            href="/category/women"
            className="group relative w-full aspect-[4/3] sm:aspect-[16/11] lg:aspect-[16/10] overflow-hidden bg-neutral-950 block select-none cursor-pointer"
          >
            <Image
              src="/images/gender-women-banner.jpg"
              alt="Women Collection"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
              priority
            />

            {/* Bottom Dark Gradient for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent pointer-events-none" />

            {/* Editorial Content */}
            <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center text-center p-6 sm:p-8 md:p-10 lg:p-12 pb-7 sm:pb-9 md:pb-11">
              <h2 className="font-display tracking-[0.2em] uppercase text-2xl sm:text-3xl md:text-4xl text-white font-normal drop-shadow-xs transition-transform duration-500 ease-out group-hover:-translate-y-1">
                WOMEN
              </h2>
              <p className="mt-2.5 sm:mt-3 text-xs sm:text-[13px] md:text-sm text-neutral-200/90 font-light leading-relaxed max-w-[340px] sm:max-w-[380px] mx-auto">
                Quiet strength, careful detail, and a silhouette drawn for the way you actually dress.
              </p>
            </div>
          </Link>

          {/* ── 2. MEN Editorial Showcase ── */}
          <Link
            href="/category/men"
            className="group relative w-full aspect-[4/3] sm:aspect-[16/11] lg:aspect-[16/10] overflow-hidden bg-neutral-950 block select-none cursor-pointer"
          >
            <Image
              src="/images/gender-men-banner.jpg"
              alt="Men Collection"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
              priority
            />

            {/* Bottom Dark Gradient for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent pointer-events-none" />

            {/* Editorial Content */}
            <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center text-center p-6 sm:p-8 md:p-10 lg:p-12 pb-7 sm:pb-9 md:pb-11">
              <h2 className="font-display tracking-[0.2em] uppercase text-2xl sm:text-3xl md:text-4xl text-white font-normal drop-shadow-xs transition-transform duration-500 ease-out group-hover:-translate-y-1">
                MEN
              </h2>
              <p className="mt-2.5 sm:mt-3 text-xs sm:text-[13px] md:text-sm text-neutral-200/90 font-light leading-relaxed max-w-[340px] sm:max-w-[380px] mx-auto">
                Clean lines, easy confidence, and hard-wearing pieces built for the way you live.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
