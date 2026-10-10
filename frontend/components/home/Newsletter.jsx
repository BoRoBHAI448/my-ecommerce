"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/lib/store-context";
import { Mail, CheckCircle2, MessageCircle, ArrowRight } from "lucide-react";

export function Newsletter() {
  const store = useStore();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const storeName = mounted ? (store?.name || "Ligloo") : "Ligloo";
  const whatsapp  = mounted ? store?.whatsapp : null;

  function handleSubmit(e) {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
  }

  return (
    <section className="py-16 sm:py-24 bg-neutral-900 text-white border-t border-neutral-800">
      <div className="container-custom max-w-3xl text-center space-y-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 text-white mb-2">
          <Mail className="w-5 h-5" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-black uppercase tracking-[0.25em] text-neutral-400">
            Member Exclusives
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            Join the {storeName} Circle
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-neutral-300 max-w-md mx-auto leading-relaxed">
          Be the first to hear about seasonal capsule drops, private discounts, and member-only promotions.
        </p>

        {subscribed ? (
          <div className="flex items-center justify-center gap-2 p-4 rounded-xl bg-white/10 text-emerald-400 font-medium text-sm animate-in fade-in">
            <CheckCircle2 className="w-5 h-5" />
            <span>Thank you for subscribing! Check your inbox soon.</span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto pt-2"
          >
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full sm:flex-1 h-12 px-5 rounded-full bg-white text-neutral-950 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm font-medium"
            />
            <button
              type="submit"
              className="w-full sm:w-auto h-12 px-8 rounded-full bg-amber-400 hover:bg-amber-300 text-neutral-950 font-black text-xs uppercase tracking-wider shrink-0 transition-transform active:scale-95 inline-flex items-center justify-center gap-2"
            >
              <span>Subscribe</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {whatsapp && (
          <div className="pt-6 border-t border-white/10 flex items-center justify-center gap-2 text-xs text-neutral-400">
            <span>Prefer instant concierge?</span>
            <a
              href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-white hover:text-amber-400 font-bold transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Connect on WhatsApp</span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
