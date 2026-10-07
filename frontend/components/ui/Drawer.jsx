"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Drawer({
  isOpen,
  onClose,
  title,
  side = "right",
  children,
  size = "md",
  className,
}) {
  const drawerRef = useRef(null);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-xs",
    md: "max-w-md",
    lg: "max-w-lg",
    full: "max-w-full",
  }[size] || "max-w-md";

  const sideClasses = {
    right: "right-0 top-0 bottom-0 border-l animate-in slide-in-from-right",
    left: "left-0 top-0 bottom-0 border-r animate-in slide-in-from-left",
  }[side] || "right-0 top-0 bottom-0 border-l animate-in slide-in-from-right";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "drawer-title" : undefined}
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        ref={drawerRef}
        className={cn(
          "fixed flex flex-col w-full bg-surface shadow-2xl border-border z-10 duration-200 ease-out",
          sizeClasses,
          sideClasses,
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          {title ? (
            <h3 id="drawer-title" className="text-base font-bold text-text">
              {title}
            </h3>
          ) : (
            <div />
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            className="rounded-theme p-1 text-text-muted hover:bg-muted hover:text-text transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
      </div>
    </div>
  );
}
