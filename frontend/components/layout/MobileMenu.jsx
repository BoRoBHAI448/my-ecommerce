"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Drawer } from "@/components/ui/Drawer";
import { X } from "lucide-react";

export function MobileMenu({ isOpen, onClose }) {
  const router = useRouter();

  const navLinks = [
    { label: "Categories", href: "/shop" },
    { label: "Women", href: "/category/women-s" },
    { label: "Men", href: "/category/men-s" },
    { label: "Blog", href: "/about" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    onClose();
    router.push(href);
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      side="left"
      size="sm"
      hideHeader
      className="bg-white border-none shadow-2xl w-[82vw] max-w-[310px] sm:max-w-xs"
    >
      <div className="flex flex-col h-full min-h-[100dvh] justify-between px-6 pt-6 pb-8 bg-white text-neutral-900">
        {/* Top Header: "Menu" on left, X on right */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <span className="text-neutral-400 font-semibold text-sm tracking-normal">
              Menu
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              aria-label="Close menu"
              className="p-2 -mr-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-neutral-900 hover:text-black active:scale-95 transition-transform cursor-pointer touch-manipulation"
            >
              <X className="w-5 h-5 stroke-[1.8]" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-neutral-900 font-bold text-[15.5px] tracking-tight hover:text-neutral-600 active:opacity-60 transition-colors py-1.5 block cursor-pointer touch-manipulation"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Bottom Pinned Footer */}
        <div className="pt-8">
          <p className="text-neutral-400 text-xs font-normal leading-relaxed">
            Copyright 2026 © Ligloo. All rights reserved.
          </p>
        </div>
      </div>
    </Drawer>
  );
}
