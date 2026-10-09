"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store-context";
import { useCart } from "@/lib/cart/cart-context";
import { useAuth } from "@/lib/auth-context";
import { MobileMenu } from "./MobileMenu";
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  ChevronDown,
  PhoneCall,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Header({ categories: propCategories = [] }) {
  const store = useStore();
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const categories = (mounted && Array.isArray(store?.categories)) ? store.categories : propCategories;
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

              <Link href="/" className="flex items-center gap-2 group min-w-0">
                {/* Logo / Brand icon — only render dynamic content after mount to prevent hydration mismatch */}
                {mounted && store?.logo && store.logo !== "/logo.png" ? (
                  <img
                    src={store.logo}
                    alt={store?.name || "Store Logo"}
                    className="h-11 w-11 sm:h-12 sm:w-12 shrink-0 rounded-full object-cover ring-2 ring-primary/20 shadow-sm group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-9 h-9 shrink-0 rounded-theme bg-primary flex items-center justify-center text-primary-contrast font-black text-xl tracking-tighter shadow-sm group-hover:scale-105 transition-transform">
                    {/* Keep the letter stable: only use store name after mount */}
                    {mounted ? (store?.name ? store.name.charAt(0).toUpperCase() : "A") : "A"}
                  </div>
                )}
                <div className="flex flex-col min-w-0">
                  <span className="font-extrabold text-base sm:text-lg text-text tracking-tight leading-none whitespace-nowrap truncate max-w-[120px] sm:max-w-[160px]">
                    {/* Stable fallback on server; real name after mount */}
                    {mounted ? (store?.name || "Apex Cart") : "Apex Cart"}
                  </span>
                  {mounted && store?.tagline && (
                    <span className="text-[10px] text-text-muted hidden 2xl:inline-block leading-tight font-medium mt-0.5 truncate max-w-[160px]">
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

              {/* Dynamic Categories Dropdown Menu */}
              {categories.slice(0, 5).map((cat) => (
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

                  {/* Subcategories Dropdown */}
                  {cat.children?.length > 0 && (
                    <div
                      className={cn(
                        "absolute top-full left-0 min-w-56 rounded-theme bg-surface shadow-xl border border-border/80 p-2 z-50 transition-all duration-200",
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

              {/* Overflow 'More Categories' if more than 5 */}
              {categories.length > 5 && (
                <div
                  className="relative group"
                  onMouseEnter={() => setActiveDropdown("more_cats")}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-text hover:text-secondary transition-colors py-2"
                  >
                    <span>More</span>
                    <ChevronDown className="w-3.5 h-3.5 text-text-muted group-hover:rotate-180 transition-transform duration-200" />
                  </button>

                  <div
                    className={cn(
                      "absolute top-full right-0 min-w-60 rounded-theme bg-surface shadow-xl border border-border/80 p-2 z-50 transition-all duration-200",
                      activeDropdown === "more_cats"
                        ? "opacity-100 visible translate-y-0"
                        : "opacity-0 invisible translate-y-2 pointer-events-none"
                    )}
                  >
                    <div className="space-y-1">
                      {categories.slice(5).map((cat) => (
                        <div key={cat.id} className="border-b border-border/40 last:border-b-0 pb-1 mb-1">
                          <Link
                            href={`/category/${cat.slug}`}
                            className="block px-3 py-1.5 text-xs font-bold text-text hover:text-primary hover:bg-muted rounded-theme"
                          >
                            {cat.name}
                          </Link>
                          {cat.children?.length > 0 && (
                            <div className="pl-5 space-y-0.5 pt-0.5">
                              {cat.children.map((sub) => (
                                <Link
                                  key={sub.id}
                                  href={`/category/${sub.slug}`}
                                  className="block px-2 py-1 text-[11px] text-text-muted hover:text-text hover:bg-muted/80 rounded-theme"
                                >
                                  {sub.name}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
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
              {mounted && store?.contact?.phone && (
                <a
                  href={`tel:${store.contact.phone}`}
                  className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-theme text-xs font-medium text-text-muted hover:text-text hover:bg-muted transition-colors mr-1 whitespace-nowrap shrink-0"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-secondary shrink-0" />
                  <span>{store.contact.phone}</span>
                </a>
              )}

              {/* Account / Auth */}
              {mounted ? (
                user ? (
                  // Logged in: show name + logout dropdown
                  <div className="relative group">
                    <button
                      type="button"
                      className="flex items-center gap-1.5 p-2 rounded-theme text-text hover:bg-muted transition-colors"
                      aria-label="Account menu"
                    >
                      <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-contrast text-xs font-black">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="hidden sm:inline text-xs font-semibold max-w-[80px] truncate">
                        {user.name.split(" ")[0]}
                      </span>
                      <ChevronDown className="w-3 h-3 text-text-muted" />
                    </button>
                    {/* Dropdown */}
                    <div className="absolute right-0 top-full mt-1 min-w-44 rounded-theme bg-surface shadow-xl border border-border/80 p-1.5 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
                      <Link
                        href="/account/orders"
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-text hover:bg-muted rounded-theme"
                      >
                        <User className="w-3.5 h-3.5" /> My Account
                      </Link>
                      <button
                        type="button"
                        onClick={() => logout()}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-danger hover:bg-red-50 rounded-theme"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Log Out
                      </button>
                    </div>
                  </div>
                ) : (
                  // Logged out: Login link
                  <Link
                    href="/login"
                    className="p-2 rounded-theme text-text hover:bg-muted transition-colors"
                    aria-label="Login"
                  >
                    <User className="w-5 h-5 sm:w-6 sm:h-6" />
                  </Link>
                )
              ) : (
                // Pre-mount placeholder — matches server render
                <div className="w-9 h-9" />
              )}

              {/* Cart Drawer Trigger */}
              <button
                type="button"
                onClick={toggleDrawer}
                className="relative p-2 rounded-theme text-text hover:bg-muted transition-colors"
                aria-label={`Shopping bag with ${mounted ? itemCount : 0} items`}
              >
                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
                {mounted && itemCount > 0 && (
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
