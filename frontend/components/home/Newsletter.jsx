"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useStore } from "@/lib/store-context";
import { Mail, CheckCircle2, MessageCircle } from "lucide-react";

export function Newsletter() {
  const store = useStore();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
  }

  return (
    <section className="py-12 sm:py-16 bg-primary text-primary-contrast border-t border-border/80">
      <div className="container-custom max-w-4xl text-center space-y-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 text-secondary mb-2">
          <Mail className="w-6 h-6" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
          Join the {store?.name || "Apex"} Circle
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
          Be the first to hear about seasonal capsule drops, private discounts, and member-only promotions.
        </p>

        {subscribed ? (
          <div className="flex items-center justify-center gap-2 p-4 rounded-theme bg-white/10 text-emerald-400 font-medium text-sm animate-in fade-in">
            <CheckCircle2 className="w-5 h-5" />
            <span>Thank you for subscribing! Check your inbox soon.</span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto"
          >
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white text-text border-none h-11 placeholder:text-slate-400 focus:ring-secondary"
            />
            <Button
              type="submit"
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto shrink-0 font-bold"
            >
              Subscribe
            </Button>
          </form>
        )}

        {store?.whatsapp && (
          <div className="pt-4 border-t border-white/10 flex items-center justify-center gap-2 text-xs text-slate-300">
            <span>Prefer quick updates?</span>
            <a
              href={`https://wa.me/${store.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-secondary font-bold hover:underline"
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
