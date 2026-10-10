"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function HeroBanner({ banners = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  }, [banners.length]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  }, [banners.length]);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [banners.length, nextSlide]);

  if (!banners || banners.length === 0) return null;

  return (
    <div className="relative w-full h-[520px] sm:h-[620px] lg:h-[720px] xl:h-[760px] bg-neutral-950 overflow-hidden group">
      {/* Slides */}
      {banners.map((banner, index) => {
        const isActive = index === currentIndex;
        const mainLink = banner.cta_link || banner.link || "/shop";
        const secondaryLink = banner.secondary_cta_link;

        return (
          <div
            key={banner.id || index}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 ease-out",
              isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            )}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={banner.image}
                alt={banner.title || "Hero banner"}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover object-center scale-100 group-hover:scale-102 transition-transform duration-1000"
              />
              {/* Dual Direction Scrim for Maximum Legibility and Cinematic Depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/95 via-neutral-950/40 to-neutral-950/20 sm:bg-gradient-to-r sm:from-neutral-950/90 sm:via-neutral-950/50 sm:to-transparent" />
            </div>

            {/* Banner Text Content */}
            <div className="relative h-full container-custom flex items-end sm:items-center pb-16 sm:pb-0">
              <div className="max-w-2xl text-white space-y-4 sm:space-y-6">
                {banner.badge && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-[11px] font-black tracking-[0.25em] uppercase text-white">
                      {banner.badge}
                    </span>
                  </div>
                )}

                <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black uppercase tracking-tight text-white leading-[0.95]">
                  {banner.title}
                </h1>

                {banner.subtitle && (
                  <p className="text-sm sm:text-lg text-neutral-200 line-clamp-2 max-w-lg leading-relaxed font-normal">
                    {banner.subtitle}
                  </p>
                )}

                <div className="pt-2 sm:pt-4 flex flex-wrap items-center gap-3">
                  <Link
                    href={mainLink}
                    className="inline-flex items-center justify-center gap-2 rounded-full px-7 sm:px-9 py-3.5 sm:py-4 bg-white text-black font-black uppercase tracking-wider text-xs sm:text-sm hover:bg-neutral-200 transition-all shadow-xl hover:scale-105 active:scale-95"
                  >
                    <span>{banner.cta_text || "Shop Collection"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  {secondaryLink && (
                    <Link
                      href={secondaryLink}
                      className="inline-flex items-center justify-center rounded-full px-7 sm:px-9 py-3.5 sm:py-4 bg-white/10 backdrop-blur-md text-white border border-white/30 font-black uppercase tracking-wider text-xs sm:text-sm hover:bg-white/20 transition-all hover:scale-105 active:scale-95"
                    >
                      <span>{banner.secondary_cta_text || "Explore"}</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous slide"
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/40 hover:bg-black/75 text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 border border-white/10"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next slide"
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/40 hover:bg-black/75 text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 border border-white/10"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Minimalist Progress Indicators */}
          <div className="absolute bottom-6 sm:bottom-8 right-6 sm:right-12 z-20 flex items-center gap-2">
            {banners.map((_, dotIndex) => (
              <button
                key={dotIndex}
                type="button"
                onClick={() => setCurrentIndex(dotIndex)}
                aria-label={`Go to slide ${dotIndex + 1}`}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  dotIndex === currentIndex
                    ? "w-8 sm:w-10 bg-white"
                    : "w-2 bg-white/40 hover:bg-white/70"
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
