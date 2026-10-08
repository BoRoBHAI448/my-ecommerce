"use client";

import { useState, useEffect } from "react";
import { X, Sparkles } from "lucide-react";
import { useStore } from "@/lib/store-context";

export function AnnouncementBar() {
  const store = useStore();
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !store?.announcement?.enabled || !store?.announcement?.text || dismissed) {
    return null;
  }

  return (
    <div className="bg-primary text-primary-contrast text-xs font-medium py-2 px-4 transition-all">
      <div className="container-custom flex items-center justify-between gap-4">
        <div className="flex-1 flex items-center justify-center gap-2 text-center">
          <Sparkles className="w-3.5 h-3.5 text-secondary shrink-0" />
          <span>{store.announcement.text}</span>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="p-1 text-primary-contrast/70 hover:text-primary-contrast transition-colors rounded-sm"
          aria-label="Dismiss announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

