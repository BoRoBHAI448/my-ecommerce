"use client";

import { MobileHero } from "./MobileHero";
import { DesktopHero } from "./DesktopHero";

/**
 * LuxuryEditorialHero orchestrates a 100% separate code implementation
 * for the mobile and desktop versions to guarantee complete visual fidelity
 * and zero cross-device layout interference.
 */
export function LuxuryEditorialHero(props) {
  return (
    <>
      {/* ── Mobile Version (Separate isolated code matching mobile screenshot) ── */}
      <div className="block md:hidden">
        <MobileHero {...props} />
      </div>

      {/* ── Web / Desktop Version (Isolated and untouched for desktop excellence) ── */}
      <div className="hidden md:block">
        <DesktopHero {...props} />
      </div>
    </>
  );
}
