"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { useStore } from "@/lib/store-context";

export function Footer({ store: propStore, categories: propCategories = [] }) {
  const contextStore = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const store = mounted ? (contextStore || propStore) : propStore;
  const categories = mounted && Array.isArray(contextStore?.categories)
    ? contextStore.categories
    : propCategories;

  const currentYear = new Date().getFullYear();
  const storeName = store?.name || "Ligloo";
  const storeInitial = storeName.charAt(0)?.toUpperCase() || "L";

  return (
    <footer className="bg-neutral-950 text-neutral-400 pt-16 pb-12 border-t border-neutral-900">
      <div className="container-custom">
        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12">
          {/* Col 1: Store Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              {store?.logo && store.logo !== "/logo.png" ? (
                <img
                  src={store.logo}
                  alt={storeName}
                  className="w-9 h-9 rounded-full object-contain bg-white p-0.5 shrink-0"
                />
              ) : (
                <div className="w-9 h-9 rounded-lg bg-white text-neutral-950 flex items-center justify-center font-display font-black text-xl shrink-0">
                  {storeInitial}
                </div>
              )}
              <span className="font-display font-black text-2xl text-white tracking-[0.06em] uppercase">
                {storeName}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-sm leading-relaxed font-normal">
              {store?.tagline || "Your premier destination for curated fashion, authentic lifestyle accessories, and premium daily essentials."}
            </p>
            {store?.contact?.hours && (
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Operating hours: {store.contact.hours}</span>
              </div>
            )}
          </div>

          {/* Col 2: Categories */}
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-4">
              Collections
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-medium">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="hover:text-white transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/shop" className="text-white hover:text-amber-400 transition-colors">
                  View All &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care */}
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-medium">
              <li>
                <Link href="/track-order" className="hover:text-white transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/customer/orders" className="hover:text-white transition-colors">
                  Order History
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-white transition-colors">
                  Return & Exchange Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact info */}
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-4">
              Concierge
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-neutral-400">
              {store?.contact?.phone && (
                <li>
                  <a
                    href={`tel:${store.contact.phone}`}
                    className="flex items-center gap-2 hover:text-white transition-colors"
                  >
                    <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{store.contact.phone}</span>
                  </a>
                </li>
              )}
              {store?.contact?.email && (
                <li>
                  <a
                    href={`mailto:${store.contact.email}`}
                    className="flex items-center gap-2 hover:text-white transition-colors"
                  >
                    <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{store.contact.email}</span>
                  </a>
                </li>
              )}
              {store?.contact?.address && (
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{store.contact.address}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payment Badges */}
        <div className="pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>
            &copy; {currentYear} {storeName}. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-neutral-400">Accepted Payments:</span>
            <span className="px-2.5 py-1 rounded bg-neutral-900 text-neutral-300 font-bold text-[10px] uppercase tracking-wider">
              Cash on Delivery (COD)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
