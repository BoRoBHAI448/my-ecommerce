"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store-context";
import { useCart } from "@/lib/cart/cart-context";
import { MobileMenu } from "./MobileMenu";
import { Search, Heart, ShoppingBag, Menu, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header({ categories: propCategories = [] }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const store = useStore();
  const { itemCount, toggleDrawer } = useCart();

  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [womenOpen, setWomenOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 30);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const brandName = (mounted && store?.name) ? store.name : "Ligloo";
  const isTransparent = isHome && !isScrolled;

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ease-out select-none",
          isTransparent
            ? "bg-transparent text-white border-b border-white/10"
            : "bg-white/95 backdrop-blur-md text-neutral-950 border-b border-neutral-200/80 shadow-xs"
        )}
      >
        <div className="w-full px-5 sm:px-8 md:px-12 flex items-center justify-between h-16 sm:h-20">
          {/* ── 1. Desktop Left Navigation Links (CATEGORIES ⌵, WOMEN ⌵, MEN) ── */}
          <div className="hidden md:flex items-center gap-7 lg:gap-8 text-xs font-bold tracking-[0.18em] uppercase">
            {/* Categories Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCategoriesOpen(true)}
              onMouseLeave={() => setCategoriesOpen(false)}
            >
              <button
                type="button"
                onClick={() => setCategoriesOpen((prev) => !prev)}
                className={cn(
                  "flex items-center gap-1.5 transition-colors focus:outline-none cursor-pointer py-2",
                  isTransparent
                    ? "text-white/90 hover:text-white"
                    : "text-neutral-900 hover:text-neutral-600"
                )}
              >
                <span>CATEGORIES</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-80" />
              </button>

              {categoriesOpen && (
                <div
                  className={cn(
                    "absolute top-full left-0 mt-1 w-56 rounded-xl p-3 shadow-2xl border text-xs tracking-wider normal-case space-y-1 duration-150",
                    isTransparent
                      ? "bg-neutral-900/95 backdrop-blur-md border-white/10 text-neutral-300"
                      : "bg-white/98 backdrop-blur-md border-neutral-200/90 text-neutral-800 shadow-xl"
                  )}
                >
                  <Link
                    href="/category/footwear"
                    onClick={() => setCategoriesOpen(false)}
                    className={cn(
                      "block px-3 py-2 rounded-lg transition-colors font-medium",
                      isTransparent ? "hover:bg-white/10 hover:text-white" : "hover:bg-neutral-100 hover:text-neutral-950"
                    )}
                  >
                    Footwear & Kicks
                  </Link>
                  <Link
                    href="/category/men-s"
                    onClick={() => setCategoriesOpen(false)}
                    className={cn(
                      "block px-3 py-2 rounded-lg transition-colors font-medium",
                      isTransparent ? "hover:bg-white/10 hover:text-white" : "hover:bg-neutral-100 hover:text-neutral-950"
                    )}
                  >
                    Men's Tailoring & Apparel
                  </Link>
                  <Link
                    href="/category/women-s"
                    onClick={() => setCategoriesOpen(false)}
                    className={cn(
                      "block px-3 py-2 rounded-lg transition-colors font-medium",
                      isTransparent ? "hover:bg-white/10 hover:text-white" : "hover:bg-neutral-100 hover:text-neutral-950"
                    )}
                  >
                    Women's Collection
                  </Link>
                  <Link
                    href="/category/accessories"
                    onClick={() => setCategoriesOpen(false)}
                    className={cn(
                      "block px-3 py-2 rounded-lg transition-colors font-medium",
                      isTransparent ? "hover:bg-white/10 hover:text-white" : "hover:bg-neutral-100 hover:text-neutral-950"
                    )}
                  >
                    Bags & Leather Goods
                  </Link>
                  <div className={cn("pt-2 border-t", isTransparent ? "border-white/10" : "border-neutral-200")}>
                    <Link
                      href="/shop"
                      onClick={() => setCategoriesOpen(false)}
                      className="block px-3 py-1.5 font-bold hover:underline text-amber-500"
                    >
                      View All Categories &rarr;
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Women Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setWomenOpen(true)}
              onMouseLeave={() => setWomenOpen(false)}
            >
              <button
                type="button"
                onClick={() => setWomenOpen((prev) => !prev)}
                className={cn(
                  "flex items-center gap-1.5 transition-colors focus:outline-none cursor-pointer py-2",
                  isTransparent
                    ? "text-white/90 hover:text-white"
                    : "text-neutral-900 hover:text-neutral-600"
                )}
              >
                <span>WOMEN</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-80" />
              </button>

              {womenOpen && (
                <div
                  className={cn(
                    "absolute top-full left-0 mt-1 w-52 rounded-xl p-3 shadow-2xl border text-xs tracking-wider normal-case space-y-1 duration-150",
                    isTransparent
                      ? "bg-neutral-900/95 backdrop-blur-md border-white/10 text-neutral-300"
                      : "bg-white/98 backdrop-blur-md border-neutral-200/90 text-neutral-800 shadow-xl"
                  )}
                >
                  <Link
                    href="/category/women-s"
                    onClick={() => setWomenOpen(false)}
                    className={cn(
                      "block px-3 py-2 rounded-lg transition-colors font-medium",
                      isTransparent ? "hover:bg-white/10 hover:text-white" : "hover:bg-neutral-100 hover:text-neutral-950"
                    )}
                  >
                    Tailored Suits & Coats
                  </Link>
                  <Link
                    href="/category/women-s"
                    onClick={() => setWomenOpen(false)}
                    className={cn(
                      "block px-3 py-2 rounded-lg transition-colors font-medium",
                      isTransparent ? "hover:bg-white/10 hover:text-white" : "hover:bg-neutral-100 hover:text-neutral-950"
                    )}
                  >
                    Evening Silhouettes
                  </Link>
                  <Link
                    href="/category/accessories"
                    onClick={() => setWomenOpen(false)}
                    className={cn(
                      "block px-3 py-2 rounded-lg transition-colors font-medium",
                      isTransparent ? "hover:bg-white/10 hover:text-white" : "hover:bg-neutral-100 hover:text-neutral-950"
                    )}
                  >
                    Leather Bags & Accents
                  </Link>
                </div>
              )}
            </div>

            {/* Men Link */}
            <Link
              href="/category/men-s"
              className={cn(
                "transition-colors py-2",
                isTransparent ? "text-white/90 hover:text-white" : "text-neutral-900 hover:text-neutral-600"
              )}
            >
              MEN
            </Link>
          </div>

          {/* ── 2. Mobile Left Trigger (Hamburger Icon + Mobile Logo) ────────── */}
          <div className="flex md:hidden items-center gap-2.5">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsMobileMenuOpen(true);
              }}
              className={cn(
                "p-2 -ml-2 transition-transform active:scale-95 touch-manipulation cursor-pointer",
                isTransparent ? "text-white hover:opacity-80" : "text-neutral-950 hover:opacity-70"
              )}
              aria-label="Open mobile navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <Link
              href="/"
              className={cn(
                "font-display font-normal text-lg tracking-[0.16em] uppercase",
                isTransparent ? "text-white" : "text-neutral-950"
              )}
            >
              {brandName}
            </Link>
          </div>

          {/* ── 3. Desktop Center Minimalist Brand Wordmark ──────────────────── */}
          <div className="hidden md:flex items-center justify-center">
            <Link
              href="/"
              className={cn(
                "font-display font-normal text-xl lg:text-2xl tracking-[0.22em] uppercase transition-opacity hover:opacity-80",
                isTransparent ? "text-white" : "text-neutral-950"
              )}
            >
              {brandName}
            </Link>
          </div>

          {/* ── 4. Right Action Icons (Search, Wishlist, Bag) ────────────────── */}
          <div
            className={cn(
              "flex items-center gap-5 sm:gap-6",
              isTransparent ? "text-white" : "text-neutral-950"
            )}
          >
            {/* Search */}
            <Link
              href="/search"
              aria-label="Search collection"
              className="p-1 hover:opacity-75 transition-opacity"
            >
              <Search className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            </Link>

            {/* Wishlist (Desktop Only) */}
            <Link
              href="/shop"
              aria-label="Wishlist"
              className="hidden sm:flex relative p-1 hover:opacity-75 transition-opacity items-center gap-1"
            >
              <Heart className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              <span className="text-[10px] font-bold font-mono">0</span>
            </Link>

            {/* Shopping Bag Drawer Trigger */}
            <button
              type="button"
              onClick={toggleDrawer}
              aria-label="View shopping bag"
              className="relative p-1 hover:opacity-75 transition-opacity flex items-center gap-1 focus:outline-none cursor-pointer touch-manipulation"
            >
              <ShoppingBag className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              <span className="text-[10px] font-bold font-mono">
                {mounted ? itemCount : 0}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Slide-out Mobile Navigation Drawer */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}
