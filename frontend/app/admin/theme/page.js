"use client";

import { useState, useRef } from "react";
import { useStore } from "@/lib/store-context";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Check,
  Palette,
  Sparkles,
  MessageCircle,
  Sliders,
  UploadCloud,
  Image as ImageIcon,
  Trash2,
  Globe,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { uploadImage } from "@/lib/upload";

export default function AdminThemeSettingsPage() {
  const store = useStore();
  const fileInputRef = useRef(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

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

  const [autoSyncFavicon, setAutoSyncFavicon] = useState(true);
  const [saved, setSaved] = useState(false);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  // Handle Logo File Upload (PNG, JPG, SVG, WebP) to ImageKit
  async function handleLogoFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (PNG, JPG, SVG, WebP)");
      return;
    }

    setUploadingLogo(true);
    try {
      const res = await uploadImage(file, "/theme");
      if (res?.url) {
        setForm((prev) => ({
          ...prev,
          logo: res.url,
          favicon: autoSyncFavicon ? res.url : prev.favicon,
        }));

        if (autoSyncFavicon) {
          let link = document.querySelector("link[rel~='icon']");
          if (!link) {
            link = document.createElement("link");
            link.rel = "icon";
            document.head.appendChild(link);
          }
          link.href = res.url;
        }
      }
    } catch (err) {
      console.error("Logo upload error:", err);
      alert(`Logo upload failed: ${err.message || "Unknown error"}`);
    } finally {
      setUploadingLogo(false);
      e.target.value = "";
    }
  }

  // Remove uploaded logo
  function handleRemoveLogo() {
    setForm((prev) => ({
      ...prev,
      logo: "/logo.png",
      favicon: "/favicon.ico",
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleSave(e) {
    if (e) e.preventDefault();

    // 1. Apply CSS tokens
    const root = document.documentElement;
    root.style.setProperty("--color-primary", form.primaryColor);
    root.style.setProperty("--color-secondary", form.secondaryColor);

    // 2. Dynamic favicon injection
    const targetFavicon = autoSyncFavicon ? form.logo : form.favicon;
    if (targetFavicon) {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = targetFavicon;
    }

    // 3. Update store context and localStorage
    if (typeof store?.updateStore === "function") {
      store.updateStore({
        name: form.name,
        tagline: form.tagline,
        logo: form.logo,
        favicon: targetFavicon,
        colors: {
          primary: form.primaryColor,
          secondary: form.secondaryColor,
        },
        announcement: {
          enabled: form.announcementEnabled,
          text: form.announcementText,
        },
        whatsapp: form.whatsapp,
      });
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const hasCustomLogo = form.logo && form.logo !== "/logo.png";

  return (
    <div className="space-y-8 max-w-4xl pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Theme & Storefront Customization
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Control branding, upload store logo & favicon, configure colors and announcements.
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
        {/* 1. Store Identity & Logo Upload */}
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              1. Brand Identity & Logo
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

          {/* Logo Upload Section */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Store Logo & Favicon
                </label>
                <p className="text-xs text-slate-500">
                  Upload your brand logo. It will automatically be used across the storefront and as the browser tab favicon.
                </p>
              </div>

              {/* Auto Sync Toggle */}
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                <input
                  type="checkbox"
                  checked={autoSyncFavicon}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setAutoSyncFavicon(checked);
                    if (checked && form.logo) {
                      setForm((prev) => ({ ...prev, favicon: form.logo }));
                    }
                  }}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300"
                />
                <span>Auto-use logo as Favicon</span>
              </label>
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/png,image/jpeg,image/svg+xml,image/webp,image/x-icon"
              onChange={handleLogoFileUpload}
              className="hidden"
            />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
              {/* Upload Drop Area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="md:col-span-7 border-2 border-dashed border-slate-300 hover:border-indigo-500 hover:bg-indigo-50/20 rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
              >
                <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 group-hover:scale-110 flex items-center justify-center transition-transform">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    Click to Upload Store Logo
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    PNG, SVG, JPG or WebP (Transparent background recommended, max 3MB)
                  </p>
                </div>
              </div>

              {/* Live Preview Cards */}
              <div className="md:col-span-5 bg-slate-50 rounded-xl border border-slate-200 p-4 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/70">
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      Live Previews
                    </span>
                    {hasCustomLogo && (
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        className="text-[11px] text-rose-600 hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Remove
                      </button>
                    )}
                  </div>

                  {/* Header Logo Simulation */}
                  <div className="pt-2">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">
                      Navbar Logo Preview:
                    </span>
                    <div className="h-14 mt-1 bg-white rounded-lg border border-slate-200 p-2 flex items-center gap-3">
                      {hasCustomLogo ? (
                        <img
                          src={form.logo}
                          alt="Store Logo"
                          className="h-10 w-auto object-contain max-w-[140px]"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-lg bg-slate-900 text-amber-400 font-black flex items-center justify-center text-lg">
                          {form.name.charAt(0)}
                        </div>
                      )}
                      <div className="truncate">
                        <span className="font-extrabold text-xs text-slate-900 block truncate">
                          {form.name}
                        </span>
                        <span className="text-[9px] text-slate-400 block truncate">
                          {form.tagline}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Browser Tab Favicon Simulation */}
                  <div className="pt-2">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">
                      Browser Tab Favicon:
                    </span>
                    <div className="mt-1 bg-slate-200/80 rounded-t-lg p-1.5 flex items-center gap-2 max-w-[220px] border border-b-0 border-slate-300">
                      {hasCustomLogo ? (
                        <img
                          src={autoSyncFavicon ? form.logo : form.favicon}
                          alt="Favicon"
                          className="w-4 h-4 object-contain shrink-0 rounded-xs"
                        />
                      ) : (
                        <Globe className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      )}
                      <span className="text-[11px] font-medium text-slate-800 truncate">
                        {form.name} — Storefront
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>Logo automatically synchronizes with browser tab icon.</span>
                </div>
              </div>
            </div>
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
