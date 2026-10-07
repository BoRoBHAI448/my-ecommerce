"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ShoppingBag, User, LogOut, PackageCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AccountLayout({ children }) {
  const pathname = usePathname();

  const links = [
    { label: "My Orders", href: "/account/orders", icon: ShoppingBag },
    { label: "Profile Settings", href: "/account/profile", icon: User },
    { label: "Track a Parcel", href: "/track-order", icon: PackageCheck },
  ];

  return (
    <div className="container-custom py-6 sm:py-10">
      <Breadcrumbs items={[{ label: "Account" }]} />

      <div className="py-2 mb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-text tracking-tight">
          Customer Portal
        </h1>
        <p className="text-xs sm:text-sm text-text-muted mt-0.5">
          Manage your personal details, order status, and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Account Navigation Sidebar */}
        <div className="lg:col-span-1 bg-surface p-4 rounded-theme border border-border/80 shadow-2xs space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-theme text-xs sm:text-sm font-semibold transition-colors",
                  isActive
                    ? "bg-primary text-primary-contrast shadow-xs"
                    : "text-text hover:bg-muted"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{link.label}</span>
              </Link>
            );
          })}

          <div className="pt-2 border-t border-border/60">
            <Link
              href="/"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-theme text-xs sm:text-sm font-semibold text-danger hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Log Out</span>
            </Link>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">{children}</div>
      </div>
    </div>
  );
}
