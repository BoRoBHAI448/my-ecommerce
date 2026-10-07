"use client";

import { useState } from "react";
import { useStore } from "@/lib/store-context";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Check, Palette, Sparkles, MessageCircle, Sliders } from "lucide-react";

export default function AdminThemeSettingsPage() {
  const store = useStore();

  const [form, setForm] = useState({
    name: store?.name || "Apex Cart",
    tagline: store?.tagline || "Premium Everyday Essentials & Lifestyle",
    logo: store?.logo || "/logo.png",
    favicon: store?.favicon || "/favicon.ico",
    primaryColor: store?.colors?.primary || "#0f172a",
    secondaryColor: store?.colors?.secondary || "#f59e0b",
    announcementText:
      store?.announcement?.text ||
      "🎉 Free Delivery inside Dhaka on orders above ৳2,000! Use code FREEDEL",
    announcementEnabled: store?.announcement?.enabled ?? true,
    whatsapp: store?.whatsapp || "8801711223344",
  });

  const [saved, setSaved] = useState(false);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSave(e) {
    e.preventDefault();

    // Dynamically apply changed tokens to document live for instant preview
    const root = document.documentElement;
    root.style.setProperty("--color-primary", form.primaryColor);
    root.style.setProperty("--color-secondary", form.secondaryColor);

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Theme & Storefront Customization
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Control branding, header announcements, colors, and WhatsApp directly from here
          </p>
        </div>

        <Button
          type="button"
          onClick={handleSave}
          variant="primary"
          leftIcon={saved ? <Check className="w-4 h-4 text-emerald-400" /> : undefined}
          className="shadow-sm"
        >
          {saved ? "Saved & Live!" : "Save Theme Changes"}
        </Button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Store Identity */}
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              1. Brand Identity & Header
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Store Brand Name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              helperText="Appears in header, footer, invoices, and tab title."
              required
            />
            <Input
              label="Store Tagline"
              value={form.tagline}
              onChange={(e) => handleChange("tagline", e.target.value)}
              helperText="Subtitle shown under logo and meta descriptions."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Store Logo URL / Path"
              value={form.logo}
              onChange={(e) => handleChange("logo", e.target.value)}
              placeholder="/logo.png"
            />
            <Input
              label="Favicon URL / Path"
              value={form.favicon}
              onChange={(e) => handleChange("favicon", e.target.value)}
              placeholder="/favicon.ico"
            />
          </div>
        </div>

        {/* 2. Theme Colors & Tokens */}
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Palette className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              2. Color Palette & Aesthetics
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2">
                Primary Brand Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={form.primaryColor}
                  onChange={(e) => handleChange("primaryColor", e.target.value)}
                  className="w-12 h-10 p-0 border border-slate-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={form.primaryColor}
                  onChange={(e) => handleChange("primaryColor", e.target.value)}
                  className="w-36 h-10 px-3 border border-slate-200 rounded text-xs font-mono font-bold uppercase"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Used for main buttons, header badges, and prominent links.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2">
                Secondary Accent Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={form.secondaryColor}
                  onChange={(e) => handleChange("secondaryColor", e.target.value)}
                  className="w-12 h-10 p-0 border border-slate-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={form.secondaryColor}
                  onChange={(e) => handleChange("secondaryColor", e.target.value)}
                  className="w-36 h-10 px-3 border border-slate-200 rounded text-xs font-mono font-bold uppercase"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Used for sale highlights, ratings, and promo banners.
              </p>
            </div>
          </div>
        </div>

        {/* 3. Header Announcement Bar */}
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-500" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                3. Announcement Banner Bar
              </h2>
            </div>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={form.announcementEnabled}
                onChange={(e) => handleChange("announcementEnabled", e.target.checked)}
                className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900"
              />
              <span>Enable Announcement Bar</span>
            </label>
          </div>

          <Input
            label="Banner Announcement Message"
            value={form.announcementText}
            onChange={(e) => handleChange("announcementText", e.target.value)}
            disabled={!form.announcementEnabled}
            helperText="Displays at the very top of every storefront page."
          />
        </div>

        {/* 4. WhatsApp Configuration */}
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <MessageCircle className="w-4 h-4 text-[#25D366]" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              4. WhatsApp Integration
            </h2>
          </div>

          <Input
            label="WhatsApp Mobile Number (e.g. 88017XXXXXXXX)"
            value={form.whatsapp}
            onChange={(e) => handleChange("whatsapp", e.target.value)}
            helperText="The floating WhatsApp button and 'Ask about this product' buttons link directly to this number."
          />
        </div>
      </form>
    </div>
  );
}
