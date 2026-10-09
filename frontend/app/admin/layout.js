"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/lib/store-context";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  MessageSquare,
  Tag,
  FolderTree,
  BarChart3,
  Percent,
  CreditCard,
  Palette,
  Settings,
  ChevronDown,
  Menu,
  ExternalLink,
  Bell,
  Users,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const store = useStore();
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState(null);

  useEffect(() => {
    setMounted(true);

    if (pathname === "/admin/login") return;

    if (typeof window !== "undefined") {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        router.replace("/admin/login");
      } else {
        setIsAuthenticated(true);
        const userStr = localStorage.getItem("admin_user");
        if (userStr) {
          try {
            setAdminUser(JSON.parse(userStr));
          } catch {
            // Ignore
          }
        }
      }
    }
  }, [pathname, router]);

  function handleLogout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
    }
    router.replace("/admin/login");
  }

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openSubmenu, setOpenSubmenu] = useState({
    "Category Hub": true,
    "Brand Center": true,
  });

  // Standalone layout for login route
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Loading screen while verifying token
  if (mounted && !isAuthenticated) {
    return (
      <div className="h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold">Verifying Admin Access...</span>
        </div>
      </div>
    );
  }

  const navigation = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Orders",
      icon: ShoppingBag,
      items: [
        { title: "All Orders", href: "/admin/orders" },
        { title: "Incomplete Orders", href: "/admin/orders/incomplete" },
        { title: "Create Order", href: "/admin/orders/create" },
      ],
    },
    {
      title: "Products Catalog",
      icon: Package,
      items: [
        { title: "All Products", href: "/admin/products" },
        { title: "Add Product", href: "/admin/products/create" },
      ],
    },
    {
      title: "Category Hub",
      icon: FolderTree,
      items: [
        { title: "Main Categories", href: "/admin/categories" },
        { title: "Sub Categories", href: "/admin/categories/sub" },
      ],
    },
    {
      title: "Brand Center",
      icon: Tag,
      items: [
        { title: "Manage Brands", href: "/admin/brands" },
        { title: "Create Brand", href: "/admin/brands/create" },
      ],
    },
    {
      title: "Customer Center",
      href: "/admin/customers",
      icon: Users,
    },
    {
      title: "Review & Feedback",
      href: "/admin/reviews",
      icon: MessageSquare,
    },
    {
      title: "Marketing Suite",
      icon: Percent,
      items: [
        { title: "Coupons & Discounts", href: "/admin/coupons" },
        { title: "Banners & Promos", href: "/admin/banners" },
      ],
    },
    {
      title: "Report Center",
      icon: BarChart3,
      items: [
        { title: "Sales Report", href: "/admin/reports/sales" },
        { title: "Profit & Loss", href: "/admin/reports/profit-loss" },
        { title: "Stock Ledger", href: "/admin/reports/stock" },
      ],
    },
    {
      title: "Payment Gateways",
      href: "/admin/payments",
      icon: CreditCard,
    },
    {
      title: "Theme Settings",
      href: "/admin/theme",
      icon: Palette,
    },
    {
      title: "System Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  function toggleSubmenu(title) {
    setOpenSubmenu((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  }

  return (
    <div className="h-screen flex overflow-hidden bg-slate-50">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "bg-slate-900 text-slate-300 flex flex-col shrink-0 h-full transition-all duration-300 z-50 fixed inset-y-0 left-0 lg:static",
          sidebarOpen ? "w-64" : "w-20 lg:w-20 -translate-x-full lg:translate-x-0"
        )}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
          <Link href="/admin" className="flex items-center gap-3 overflow-hidden">
            {/* Logo: stable placeholder until mounted to prevent hydration mismatch */}
            {mounted && store?.logo && store.logo !== "/logo.png" ? (
              <img
                src={store.logo}
                alt={store?.name || "Logo"}
                className="w-10 h-10 rounded-full object-contain bg-white p-0.5 ring-2 ring-white/20 shrink-0"
              />
            ) : (
              <div className="w-9 h-9 rounded-lg bg-amber-500 text-slate-950 font-black flex items-center justify-center shrink-0">
                {mounted ? (store?.name ? store.name.charAt(0).toUpperCase() : "A") : "A"}
              </div>
            )}
            {sidebarOpen && (
              <div className="flex flex-col truncate">
                <span className="font-bold text-sm text-white truncate">
                  {mounted ? (store?.name || "Apex Admin") : "Apex Admin"}
                </span>
                <span className="text-[10px] text-slate-400">Store Manager</span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-none">
          {navigation.map((item) => {
            const Icon = item.icon;
            const hasSubmenu = Boolean(item.items?.length);
            const isSubmenuOpen = openSubmenu[item.title];
            const isActive =
              item.href === pathname ||
              item.items?.some((sub) => sub.href === pathname);

            if (hasSubmenu) {
              return (
                <div key={item.title} className="space-y-1">
                  <button
                    type="button"
                    onClick={() => toggleSubmenu(item.title)}
                    className={cn(
                      "w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-semibold transition-colors",
                      isActive
                        ? "bg-slate-800 text-amber-400 font-bold"
                        : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 shrink-0 text-slate-400" />
                      {sidebarOpen && <span>{item.title}</span>}
                    </div>
                    {sidebarOpen && (
                      <ChevronDown
                        className={cn(
                          "w-3.5 h-3.5 transition-transform duration-200",
                          isSubmenuOpen && "rotate-180"
                        )}
                      />
                    )}
                  </button>

                  {/* Submenu links */}
                  {sidebarOpen && isSubmenuOpen && (
                    <div className="pl-9 pr-2 py-1 space-y-1">
                      {item.items.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className={cn(
                            "block py-1.5 px-2 rounded-md text-xs transition-colors",
                            pathname === sub.href
                              ? "bg-amber-500/10 text-amber-400 font-bold"
                              : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                          )}
                        >
                          {sub.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 p-2.5 rounded-lg text-xs font-semibold transition-colors",
                  pathname === item.href
                    ? "bg-amber-500 text-slate-950 font-bold shadow-sm"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {sidebarOpen && <span>{item.title}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-800">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 p-2 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ExternalLink className="w-4 h-4 shrink-0" />
            {sidebarOpen && <span>Visit Storefront</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Topbar */}
        <header className="h-16 shrink-0 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 z-30 shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 hidden sm:inline-block">
              Store Control Panel
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-500" />
              <span>Preview Store</span>
            </Link>

            <button
              type="button"
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="w-2 h-2 rounded-full bg-amber-500 absolute top-2 right-2" />
            </button>

            {/* Profile Pill & Logout */}
            <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-amber-400 font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                {adminUser?.name ? adminUser.name.charAt(0).toUpperCase() : "AD"}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-800 leading-tight">
                  {adminUser?.name || "Store Manager"}
                </span>
                <span className="text-[10px] text-slate-400 truncate max-w-[120px]">
                  {adminUser?.email || "admin@ligglo.com"}
                </span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                title="Log Out of Admin Panel"
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-1"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
