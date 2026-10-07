"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
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
    const interval = setInterval(nextSlide, 5500);
    return () => clearInterval(interval);
  }, [banners.length, nextSlide]);

  if (!banners || banners.length === 0) return null;

  return (
    <div className="relative w-full h-[400px] sm:h-[480px] lg:h-[560px] bg-slate-900 overflow-hidden rounded-none sm:rounded-theme my-0 sm:my-4 shadow-sm group">
      {/* Slides */}
      {banners.map((banner, index) => {
        const isActive = index === currentIndex;

        return (
          <div
            key={banner.id || index}
            className={cn(
              "absolute inset-0 transition-opacity duration-700 ease-in-out",
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
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-cover object-center scale-100 group-hover:scale-102 transition-transform duration-1000"
              />
              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/50 to-transparent sm:from-slate-950/80 sm:via-slate-950/30" />
            </div>

            {/* Banner Text Content */}
            <div className="relative h-full container-custom flex items-center">
              <div className="max-w-xl text-white space-y-4 py-8">
                {banner.badge && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-secondary text-secondary-contrast shadow-xs">
                    {banner.badge}
                  </span>
                )}

                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight sm:leading-none">
                  {banner.title}
                </h1>

                {banner.subtitle && (
                  <p className="text-xs sm:text-base text-slate-200 line-clamp-2 max-w-md leading-relaxed font-normal">
                    {banner.subtitle}
                  </p>
                )}

                {banner.link && (
                  <div className="pt-2">
                    <Link href={banner.link}>
                      <Button
                        variant="primary"
                        size="lg"
                        rightIcon={<ArrowRight className="w-4 h-4" />}
                        className="bg-white text-slate-900 hover:bg-slate-100 font-bold border-none shadow-md"
                      >
                        {banner.cta_text || "Shop Collection"}
                      </Button>
                    </Link>
                  </div>
                )}
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
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-xs transition-colors opacity-80 group-hover:opacity-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-xs transition-colors opacity-80 group-hover:opacity-100"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {banners.map((_, dotIndex) => (
              <button
                key={dotIndex}
                type="button"
                onClick={() => setCurrentIndex(dotIndex)}
                aria-label={`Go to slide ${dotIndex + 1}`}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  dotIndex === currentIndex
                    ? "w-7 bg-secondary"
                    : "w-2 bg-white/50 hover:bg-white"
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
