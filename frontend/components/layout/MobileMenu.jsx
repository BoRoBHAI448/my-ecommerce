"use client";

import Link from "next/link";
import { Drawer } from "@/components/ui/Drawer";
import { useStore } from "@/lib/store-context";
import { Phone, Mail, MapPin, ChevronRight, User, ShoppingBag } from "lucide-react";

export function MobileMenu({ isOpen, onClose, categories = [] }) {
  const store = useStore();

  return (
    <Drawer isOpen={isOpen} onClose={onClose} side="left" title="Menu" size="sm">
      <div className="flex flex-col h-full space-y-6">
        {/* Main Links */}
        <div className="space-y-1">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center justify-between py-2.5 text-sm font-semibold text-text hover:text-secondary transition-colors"
          >
            <span>Home</span>
            <ChevronRight className="w-4 h-4 text-text-muted" />
          </Link>
          <Link
            href="/shop"
            onClick={onClose}
            className="flex items-center justify-between py-2.5 text-sm font-semibold text-text hover:text-secondary transition-colors"
          >
            <span>All Products</span>
            <ChevronRight className="w-4 h-4 text-text-muted" />
          </Link>
        </div>

        {/* Categories List */}
        <div>
          <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
            Categories
          </h4>
          <div className="space-y-1">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                onClick={onClose}
                className="flex items-center justify-between py-2 text-sm text-text hover:text-secondary transition-colors"
              >
                <span>{cat.name}</span>
                <span className="text-xs text-text-muted">
                  {cat.children?.length > 0 && `${cat.children.length} sub`}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Account Links */}
        <div className="border-t border-border pt-4 space-y-2">
          <Link
            href="/account/orders"
            onClick={onClose}
            className="flex items-center gap-3 py-2 text-sm text-text hover:text-secondary transition-colors"
          >
            <ShoppingBag className="w-4 h-4 text-text-muted" />
            <span>My Orders & Tracking</span>
          </Link>
          <Link
            href="/login"
            onClick={onClose}
            className="flex items-center gap-3 py-2 text-sm text-text hover:text-secondary transition-colors"
          >
            <User className="w-4 h-4 text-text-muted" />
            <span>Login / Register</span>
          </Link>
        </div>

        {/* Contact Info */}
        {store?.contact && (
          <div className="mt-auto border-t border-border pt-4 text-xs text-text-muted space-y-2">
            {store.contact.phone && (
              <a
                href={`tel:${store.contact.phone}`}
                className="flex items-center gap-2 hover:text-text transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-secondary" />
                <span>{store.contact.phone}</span>
              </a>
            )}
            {store.contact.email && (
              <a
                href={`mailto:${store.contact.email}`}
                className="flex items-center gap-2 hover:text-text transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-secondary" />
                <span>{store.contact.email}</span>
              </a>
            )}
            {store.contact.address && (
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-secondary shrink-0 mt-0.5" />
                <span>{store.contact.address}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </Drawer>
  );
}
