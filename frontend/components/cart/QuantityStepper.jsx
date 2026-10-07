"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function QuantityStepper({
  quantity = 1,
  min = 1,
  max = 99,
  onChange,
  size = "md",
  disabled = false,
  className,
}) {
  const sizeClasses = {
    sm: "h-7 text-xs",
    md: "h-9 text-sm",
    lg: "h-11 text-base",
  }[size] || "h-9 text-sm";

  const btnClasses = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-11 h-11",
  }[size] || "w-9 h-9";

  return (
    <div
      className={cn(
        "inline-flex items-center border border-border rounded-theme bg-surface select-none",
        sizeClasses,
        className
      )}
    >
      <button
        type="button"
        disabled={disabled || quantity <= min}
        onClick={() => onChange(Math.max(min, quantity - 1))}
        className={cn(
          "flex items-center justify-center text-text-muted hover:text-text hover:bg-muted transition-colors disabled:opacity-40 disabled:pointer-events-none rounded-l-theme",
          btnClasses
        )}
        aria-label="Decrease quantity"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>

      <span className="min-w-8 px-2 text-center font-bold text-text">
        {quantity}
      </span>

      <button
        type="button"
        disabled={disabled || quantity >= max}
        onClick={() => onChange(Math.min(max, quantity + 1))}
        className={cn(
          "flex items-center justify-center text-text-muted hover:text-text hover:bg-muted transition-colors disabled:opacity-40 disabled:pointer-events-none rounded-r-theme",
          btnClasses
        )}
        aria-label="Increase quantity"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
