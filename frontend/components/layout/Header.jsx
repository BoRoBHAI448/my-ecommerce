"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store-context";
import { useCart } from "@/lib/cart/cart-context";
import { MobileMenu } from "./MobileMenu";
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  ChevronDown,
  PhoneCall,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Header({ categories = [] }) {
  const store = useStore();
  const { itemCount, toggleDrawer } = useCart();
  const router = useRouter();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleSearchSubmit(e) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  }

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full bg-surface/95 backdrop-blur-md transition-shadow duration-200 border-b border-border/80",
          isScrolled ? "shadow-md" : "shadow-xs"
        )}
      >
        <div className="container-custom">
          {/* Main Bar */}
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
            {/* Mobile Menu Trigger & Logo */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 -ml-2 rounded-theme text-text hover:bg-muted transition-colors"
                aria-label="Open navigation menu"
              >
                <Menu className="w-6 h-6" />
              </button>

              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-9 h-9 rounded-theme bg-primary flex items-center justify-center text-primary-contrast font-black text-xl tracking-tighter shadow-sm group-hover:scale-105 transition-transform">
                  {store?.name ? store.name.charAt(0) : "Ligglo Fashion Zone"}
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-lg sm:text-xl text-text tracking-tight leading-none">
                    {store?.name || "Ligglo Fashion Zone"}
                  </span>
                  {store?.tagline && (
                    <span className="text-[10px] text-text-muted hidden sm:inline-block leading-tight font-medium mt-0.5">
                      {store.tagline}
                    </span>
                  )}
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6">
              <Link
                href="/"
                className="text-sm font-semibold text-text hover:text-secondary transition-colors"
              >
                Home
              </Link>
              <Link
                href="/shop"
                className="text-sm font-semibold text-text hover:text-secondary transition-colors"
              >
                Shop All
              </Link>

              {/* Categories Dropdown / Mega Menu */}
              {categories.slice(0, 4).map((cat) => (
                <div
                  key={cat.id}
                  className="relative group"
                  onMouseEnter={() => setActiveDropdown(cat.id)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={`/category/${cat.slug}`}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-text hover:text-secondary transition-colors py-2"
                  >
                    <span>{cat.name}</span>
                    {cat.children?.length > 0 && (
                      <ChevronDown className="w-3.5 h-3.5 text-text-muted group-hover:rotate-180 transition-transform duration-200" />
                    )}
                  </Link>

                  {/* Dropdown Menu */}
                  {cat.children?.length > 0 && (
                    <div
                      className={cn(
                        "absolute top-full left-0 w-56 rounded-theme bg-surface shadow-xl border border-border p-2 z-50 transition-all duration-200",
                        activeDropdown === cat.id
                          ? "opacity-100 visible translate-y-0"
                          : "opacity-0 invisible translate-y-2 pointer-events-none"
                      )}
                    >
                      <div className="space-y-0.5">
                        <Link
                          href={`/category/${cat.slug}`}
                          className="block px-3 py-2 text-xs font-bold text-secondary uppercase tracking-wider rounded-theme hover:bg-muted"
                        >
                          All {cat.name}
                        </Link>
                        {cat.children.map((sub) => (
                          <Link
                            key={sub.id}
                            href={`/category/${sub.slug}`}
                            className="block px-3 py-1.5 text-xs text-text hover:text-primary hover:bg-muted rounded-theme transition-colors font-medium"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Search Bar (Desktop) */}
            <div className="hidden md:flex flex-1 max-w-xs lg:max-w-sm mx-4">
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, brands..."
                  className="w-full h-10 pl-9 pr-4 rounded-theme border border-border bg-muted/50 text-xs sm:text-sm text-text placeholder:text-text-muted focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
                <Search className="w-4 h-4 text-text-muted absolute left-3 top-3 pointer-events-none" />
              </form>
            </div>

            {/* Action Buttons (Help, Account, Cart) */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Help hotline (hidden on small) */}
              {store?.contact?.phone && (
                <a
                  href={`tel:${store.contact.phone}`}
                  className="hidden xl:flex items-center gap-2 px-2.5 py-1.5 rounded-theme text-xs font-medium text-text-muted hover:text-text hover:bg-muted transition-colors mr-1"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-secondary" />
                  <span>{store.contact.phone}</span>
                </a>
              )}

              {/* Account */}
              <Link
                href="/account/orders"
                className="p-2 rounded-theme text-text hover:bg-muted transition-colors"
                aria-label="User Account"
              >
                <User className="w-5 h-5 sm:w-6 sm:h-6" />
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                type="button"
                onClick={toggleDrawer}
                className="relative p-2 rounded-theme text-text hover:bg-muted transition-colors"
                aria-label={`Shopping bag with ${itemCount} items`}
              >
                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
                {itemCount > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-secondary text-secondary-contrast text-[11px] font-bold flex items-center justify-center animate-scaleIn shadow-xs">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search Bar (Mobile Only Full Width) */}
          <div className="md:hidden pb-3">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, brands..."
                className="w-full h-9 pl-9 pr-4 rounded-theme border border-border bg-muted/50 text-xs text-text placeholder:text-text-muted focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <Search className="w-3.5 h-3.5 text-text-muted absolute left-3 top-2.5 pointer-events-none" />
            </form>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        categories={categories}
      />
    </>
  );
}
