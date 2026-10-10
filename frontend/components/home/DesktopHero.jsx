"use client";

import Link from "next/link";
import Image from "next/image";

export function DesktopHero({
  brandName = "Ligloo",
  kicker = "Just In for the Season",
  description = "Quiet tailoring made for real days. Considered proportions, honest fabric, and a finish that keeps its shape season after season.",
  ctaText = "SHOP THE EDIT",
  ctaLink = "/shop",
  backgroundImage = "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=2400&auto=format&fit=crop&q=90",
  categories = [],
}) {

  return (
    <section className="relative w-full h-screen min-h-[640px] max-h-[1050px] bg-neutral-950 text-white flex flex-col justify-between overflow-hidden select-none">
      {/* ── 1. High-Resolution Editorial Background Photography ──────────── */}
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          alt={`${brandName} editorial campaign`}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-100 transition-transform duration-1000 ease-out"
        />

        {/* Cinematic Dual Vignette Scrim */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/35 to-black/80" />
      </div>

      {/* Top Spacer for Fixed Sticky Editorial Header */}
      <div className="relative z-20 h-16 sm:h-20 shrink-0" aria-hidden="true" />

      {/* ── 3. Center Hero Editorial Content (Desktop) ───────────────────── */}
      <div className="relative z-20 container-custom flex-1 flex flex-col items-center justify-center text-center px-4 py-12">
        {/* Kicker Title */}
        <p className="text-base sm:text-lg font-medium text-white/95 tracking-normal drop-shadow-sm mb-4">
          {kicker}
        </p>

        {/* Massive Luxury Serif Brand Headline */}
        <h1 className="font-display font-normal text-7xl md:text-8xl lg:text-9xl text-white tracking-[0.03em] uppercase leading-none drop-shadow-md my-4">
          {brandName}
        </h1>

        {/* Editorial Subtext */}
        <p className="text-sm md:text-base text-neutral-200/90 font-light max-w-xl mx-auto leading-relaxed mb-10 px-2 drop-shadow-xs">
          {description}
        </p>

        {/* Rectangular Clean White CTA Button */}
        <div>
          <Link
            href={ctaLink}
            className="inline-flex items-center justify-center px-10 py-4 bg-white text-neutral-950 font-bold text-xs uppercase tracking-[0.2em] hover:bg-neutral-100 transition-all duration-300 shadow-2xl hover:scale-105 active:scale-95"
          >
            {ctaText}
          </Link>
        </div>
      </div>

      {/* ── 4. Bottom Fine Baseline ──────────────────────────────────────── */}
      <div className="relative z-20 w-full pb-6 px-12 flex items-center justify-between text-[10px] font-mono tracking-widest uppercase text-white/60">
        <span>COLLECTION 2026</span>
        <span>AUTUMN / WINTER</span>
      </div>
    </section>
  );
}
