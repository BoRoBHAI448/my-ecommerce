"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
  hideHeader = false,
}) {
  const drawerRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const openTimeRef = useRef(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      openTimeRef.current = Date.now();
      document.body.style.overflow = "hidden";
    }

    function handleKeyDown(e) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const handleBackdropClick = (e) => {
    // Ignore touch tap ghost-clicks occurring immediately after mounting
    if (Date.now() - openTimeRef.current < 250) {
      return;
    }
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

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

  const drawerContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "drawer-title" : undefined}
      className="fixed inset-0 z-[9999] overflow-hidden"
    >
      {/* Backdrop with touch ghost-click protection */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-200 z-10 touch-manipulation"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        ref={drawerRef}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "fixed flex flex-col w-full bg-surface shadow-2xl border-border z-20 duration-200 ease-out touch-pan-y",
          sizeClasses,
          sideClasses,
          className
        )}
      >
        {/* Header */}
        {!hideHeader && (
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
              className="rounded-theme p-2 text-text-muted hover:bg-muted hover:text-text transition-colors touch-manipulation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className={cn("flex-1 overflow-y-auto", !hideHeader && "px-5 py-4")}>{children}</div>
      </div>
    </div>
  );

  return createPortal(drawerContent, document.body);
}
