"use client";

import Link from "next/link";
import Image from "next/image";

export function MobileHero({
  brandName = "Ligloo",
  categories = [],
  announcement = "MID-SEASON SALE NOW ON WITH COMPLIMENTARY EXPRESS SHIPPING WORLDWIDE",
  kicker = "Just In for the Season",
  description = "Quiet tailoring made for real days. Considered proportions, honest fabric, and a finish that keeps its shape season after season.",
  ctaText = "SHOP THE EDIT",
  ctaLink = "/shop",
  backgroundImage = "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=2400&auto=format&fit=crop&q=90",
}) {

  return (
    <div className="w-full bg-neutral-950 text-white">
      {/* ── Mobile Hero Container with Same Image as Web ─────────────────── */}
      <div className="relative w-full h-[84vh] min-h-[580px] max-h-[740px] flex flex-col justify-between overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={backgroundImage}
            alt={`${brandName} mobile campaign`}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center scale-100"
          />
          {/* Scrim Overlay for high-contrast legible text */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/75" />
        </div>

        {/* Top Spacer for Fixed Sticky Editorial Header */}
        <div className="relative z-20 h-16 shrink-0" aria-hidden="true" />

        {/* ── 4. Mobile Centered Hero Content ─────────────────────────────── */}
        <div className="relative z-20 flex-1 flex flex-col items-center justify-center text-center px-6 py-6">
          {/* Kicker */}
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 leading-tight drop-shadow-sm tracking-normal">
            {kicker}
          </h2>

          {/* Giant Brand Name */}
          <h1 className="font-display font-normal text-5xl sm:text-6xl text-white tracking-[0.03em] uppercase my-2 drop-shadow-md leading-none">
            {brandName}
          </h1>

          {/* Description */}
          <p className="text-xs sm:text-sm text-neutral-200/95 font-light leading-relaxed max-w-[285px] sm:max-w-xs mx-auto mb-7 drop-shadow-xs">
            {description}
          </p>

          {/* White Rectangular CTA Button */}
          <Link
            href={ctaLink}
            className="inline-block px-8 py-3.5 bg-white text-neutral-950 font-bold text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-neutral-100 active:scale-95 transition-transform"
          >
            {ctaText}
          </Link>
        </div>

        {/* Bottom Spacer for balance */}
        <div className="relative z-20 h-4" />
      </div>
    </div>
  );
}
