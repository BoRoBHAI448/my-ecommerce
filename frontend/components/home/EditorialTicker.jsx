"use client";

export function EditorialTicker({ text = "FIND YOUR CHOICE" }) {
  // Repeating text items for seamless infinite ribbon loop
  const items = Array.from({ length: 6 });

  return (
    <section
      aria-label="Editorial Announcement Ticker"
      className="relative w-full overflow-hidden bg-white border-y border-neutral-200/70 py-6 sm:py-8 md:py-10 select-none"
    >
      <div className="animate-marquee-infinite flex items-center whitespace-nowrap">
        {/* Track 1 */}
        <div className="flex items-center shrink-0">
          {items.map((_, i) => (
            <span key={`t1-${i}`} className="inline-flex items-center">
              <span className="font-display font-light text-3xl sm:text-5xl md:text-6xl lg:text-[64px] text-neutral-950 tracking-[0.09em] uppercase leading-none">
                {text}
              </span>
              <span className="mx-6 sm:mx-10 md:mx-14 text-2xl sm:text-4xl md:text-5xl text-neutral-400 font-serif leading-none select-none">
                &middot;
              </span>
            </span>
          ))}
        </div>

        {/* Track 2 (Duplicate for continuous loop) */}
        <div className="flex items-center shrink-0" aria-hidden="true">
          {items.map((_, i) => (
            <span key={`t2-${i}`} className="inline-flex items-center">
              <span className="font-display font-light text-3xl sm:text-5xl md:text-6xl lg:text-[64px] text-neutral-950 tracking-[0.09em] uppercase leading-none">
                {text}
              </span>
              <span className="mx-6 sm:mx-10 md:mx-14 text-2xl sm:text-4xl md:text-5xl text-neutral-400 font-serif leading-none select-none">
                &middot;
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
