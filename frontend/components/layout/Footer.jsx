import Link from "next/link";
import { Phone, Mail, MapPin, Clock, ShieldCheck, Truck, RefreshCw, Headphones } from "lucide-react";

export function Footer({ store, categories = [] }) {
  const currentYear = 2026;

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="container-custom">
        {/* Top Features Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-amber-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-white">Fast Nationwide Delivery</h4>
              <p className="text-[11px] text-slate-400">Dhaka in 24-48 hrs</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-white">Cash on Delivery</h4>
              <p className="text-[11px] text-slate-400">Pay upon parcel arrival</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-amber-400 shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-white">7-Day Easy Return</h4>
              <p className="text-[11px] text-slate-400">Hassle-free exchange</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-amber-400 shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-white">Dedicated Support</h4>
              <p className="text-[11px] text-slate-400">Call or WhatsApp anytime</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12">
          {/* Col 1: Store Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-theme bg-white text-slate-900 flex items-center justify-center font-black text-xl">
                {store?.name ? store.name.charAt(0) : "A"}
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                {store?.name || "Apex Cart"}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              {store?.tagline ||
                "Your premier destination for curated fashion, authentic lifestyle accessories, and premium daily essentials."}
            </p>
            {store?.contact?.hours && (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Operating hours: {store.contact.hours}</span>
              </div>
            )}
          </div>

          {/* Col 2: Categories */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Categories
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="hover:text-amber-400 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/shop" className="text-amber-400 hover:underline">
                  View All &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Policies */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/track-order" className="hover:text-amber-400 transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="hover:text-amber-400 transition-colors">
                  Order History
                </Link>
              </li>
              <li>
                <Link href="/return-policy" className="hover:text-amber-400 transition-colors">
                  Return & Exchange Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-amber-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-amber-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-400 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact info */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Contact & Hotline
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-400">
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
        <div className="pt-8 mt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            &copy; {currentYear} {store?.name || "Apex Cart"}. All rights reserved. Built with Next.js.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-slate-400">Accepted Payments:</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold text-[10px]">
              Cash on Delivery (COD)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
