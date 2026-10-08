"use client";

import { useState } from "react";
import Image from "next/image";
import { cn, getValidImageSrc } from "@/lib/utils";
import { ImageOff } from "lucide-react";

export function Gallery({ images = [], title = "Product" }) {
  const rawList = Array.isArray(images) ? images : [images];
  const validImages = rawList.map(getValidImageSrc).filter(Boolean);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const activeImage = validImages[selectedIndex] || validImages[0] || null;

  function handleMouseMove(e) {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  }

  if (validImages.length === 0) {
    return (
      <div className="w-full aspect-square bg-muted/60 rounded-theme flex flex-col items-center justify-center text-text-muted text-sm font-medium border border-border/80 p-6 text-center">
        <ImageOff className="w-10 h-10 mb-2 text-text-muted/60" />
        <span>No image available</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col-reverse sm:flex-row gap-4">
      {/* Thumbnails Column */}
      {validImages.length > 1 && (
        <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto max-h-[500px] shrink-0 pb-2 sm:pb-0 scrollbar-none">
          {validImages.map((imgUrl, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={cn(
                "relative w-16 h-16 sm:w-20 sm:h-20 rounded-theme overflow-hidden border-2 bg-muted shrink-0 transition-all duration-200",
                selectedIndex === idx
                  ? "border-secondary shadow-xs scale-102"
                  : "border-border hover:border-text-muted opacity-70 hover:opacity-100"
              )}
              aria-label={`View photo ${idx + 1}`}
            >
              <Image
                src={imgUrl}
                alt={`${title} thumbnail ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image Stage with Hover Zoom */}
      <div
        className="relative flex-1 aspect-square sm:aspect-[4/5] bg-muted/40 rounded-theme overflow-hidden border border-border/80 shadow-2xs cursor-crosshair"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        {activeImage && (
          <Image
            src={activeImage}
            alt={title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className={cn(
              "object-cover transition-transform duration-300 ease-out",
              isZoomed ? "scale-150" : "scale-100"
            )}
            style={
              isZoomed
                ? {
                    transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                  }
                : undefined
            }
          />
        )}
      </div>
    </div>
  );
}

