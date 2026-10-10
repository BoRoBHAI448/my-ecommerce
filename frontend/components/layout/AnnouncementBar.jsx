"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { X, Sparkles } from "lucide-react";
import { useStore } from "@/lib/store-context";

export function AnnouncementBar() {
  const pathname = usePathname();
  const store = useStore();
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (pathname === "/" || !mounted || !store?.announcement?.enabled || !store?.announcement?.text || dismissed) {
    return null;
  }

  return (
    <div className="bg-neutral-950 text-neutral-200 text-[11px] font-black uppercase tracking-wider py-2.5 px-4 transition-all border-b border-neutral-800">
      <div className="container-custom flex items-center justify-between gap-4">
        <div className="flex-1 flex items-center justify-center gap-2 text-center">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>{store.announcement.text}</span>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="p-1 text-neutral-400 hover:text-white transition-colors rounded-sm"
          aria-label="Dismiss announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
