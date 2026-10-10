"use client";

import { useState } from "react";
import { mockBanners } from "@/lib/api/mock/data";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import {
  Image as ImageIcon,
  PlusCircle,
  Trash2,
  Edit2,
  ExternalLink,
  CheckCircle2,
  Eye,
  Sparkles,
  UploadCloud,
  Loader2,
} from "lucide-react";
import { uploadImage } from "@/lib/upload";

export default function AdminBannersPage() {
  const [heroBanners, setHeroBanners] = useState(mockBanners.hero || []);
  const [promoBanners, setPromoBanners] = useState(mockBanners.promo || []);
  const [activeTab, setActiveTab] = useState("hero");
  const [toastMessage, setToastMessage] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [badge, setBadge] = useState("");
  const [ctaText, setCtaText] = useState("Shop Collection");
  const [link, setLink] = useState("/shop");
  const [imageUrl, setImageUrl] = useState("");

  async function handleBannerFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("অনুগ্রহ করে একটি সঠিক ছবি ফাইল সিলেক্ট করুন");
      return;
    }
    setUploadingBanner(true);
    try {
      const res = await uploadImage(file, "/banners");
      if (res?.url) {
        setImageUrl(res.url);
      }
    } catch (err) {
      console.error("Banner upload error:", err);
      alert(`ব্যানার আপলোড ব্যর্থ হয়েছে: ${err.message || "Unknown error"}`);
    } finally {
      setUploadingBanner(false);
      e.target.value = "";
    }
  }

  function showToast(msg) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  }

  function handleCreateBanner(e) {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) {
      alert("Please enter title and image URL");
      return;
    }

    const newBanner = {
      id: `banner_${Date.now()}`,
      title,
      subtitle,
      badge: badge || "New Collection",
      cta_text: ctaText,
      link,
      image: imageUrl,
    };

    if (activeTab === "hero") {
      setHeroBanners([newBanner, ...heroBanners]);
    } else {
      setPromoBanners([newBanner, ...promoBanners]);
    }

    setShowAddModal(false);
    setTitle("");
    setSubtitle("");
    setBadge("");
    setImageUrl("");
    showToast("Banner added successfully!");
  }

  function handleDeleteHero(id) {
    if (window.confirm("Delete this banner?")) {
      setHeroBanners(heroBanners.filter((b) => b.id !== id));
      showToast("Hero banner deleted.");
    }
  }

  function handleDeletePromo(id) {
    if (window.confirm("Delete this promo banner?")) {
      setPromoBanners(promoBanners.filter((b) => b.id !== id));
      showToast("Promo banner deleted.");
    }
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-slate-700 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <p className="text-sm font-medium">{toastMessage}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <ImageIcon className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900">
              Banners & Promotional Displays
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Control the homepage hero sliders and category promo banners shown to buyers.
          </p>
        </div>

        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-sm font-medium"
        >
          <PlusCircle className="w-4 h-4" />
          Add New Banner
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab("hero")}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-all ${
            activeTab === "hero"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Homepage Hero Sliders ({heroBanners.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("promo")}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-all ${
            activeTab === "promo"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Promotional Category Tiles ({promoBanners.length})
        </button>
      </div>

      {/* Hero Banners Grid */}
      {activeTab === "hero" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {heroBanners.map((banner, idx) => (
            <div
              key={banner.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col group"
            >
              {/* Banner Visual Preview */}
              <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-5 text-white">
                  {banner.badge && (
                    <span className="inline-block px-2 py-0.5 bg-amber-500 text-slate-950 text-[10px] font-black uppercase rounded mb-1 self-start">
                      {banner.badge}
                    </span>
                  )}
                  <h3 className="font-bold text-lg line-clamp-1">{banner.title}</h3>
                  <p className="text-xs text-white/80 line-clamp-2 mt-0.5">
                    {banner.subtitle}
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="p-4 flex items-center justify-between border-t border-slate-100 bg-slate-50/50">
                <div className="text-xs text-slate-500 space-y-0.5">
                  <div className="flex items-center gap-1 font-mono text-[11px] text-indigo-600">
                    <ExternalLink className="w-3 h-3" />
                    <span>Target: {banner.link}</span>
                  </div>
                  <div>CTA: "{banner.cta_text}"</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDeleteHero(banner.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete Banner"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Promo Banners Grid */}
      {activeTab === "promo" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {promoBanners.map((promo, idx) => (
            <div
              key={promo.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col group"
            >
              <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-900">
                <img
                  src={promo.image}
                  alt={promo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 text-white">
                  <h3 className="font-bold text-sm">{promo.title}</h3>
                  <p className="text-xs text-white/80">{promo.subtitle}</p>
                </div>
              </div>

              <div className="p-3 flex items-center justify-between border-t border-slate-100 bg-slate-50/50">
                <span className="text-[11px] font-mono text-slate-500 truncate max-w-[150px]">
                  {promo.link}
                </span>
                <button
                  type="button"
                  onClick={() => handleDeletePromo(promo.id)}
                  className="p-1 text-slate-400 hover:text-rose-600"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Banner Modal */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title={`Create ${activeTab === "hero" ? "Hero Slider" : "Promo Banner"}`}
        >
          <form onSubmit={handleCreateBanner} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Headline / Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Autumn / Winter Exclusive"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Sub-Headline / Tagline
              </label>
              <input
                type="text"
                placeholder="e.g. Flat 20% off on all formal shoes"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Tag / Badge
                </label>
                <input
                  type="text"
                  placeholder="e.g. New Season"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Button Text
                </label>
                <input
                  type="text"
                  placeholder="Shop Collection"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Target Link (URL or Store Route)
              </label>
              <input
                type="text"
                placeholder="/shop?category=mens-fashion"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Banner Image <span className="text-rose-500">*</span>
              </label>

              {/* Upload from device */}
              <div className="mb-2">
                <input
                  type="file"
                  id="banner-file-input"
                  accept="image/*"
                  disabled={uploadingBanner}
                  onChange={handleBannerFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="banner-file-input"
                  className={`flex items-center justify-center gap-2 p-3 border-2 border-dashed rounded-lg transition-colors text-xs font-medium ${
                    uploadingBanner
                      ? "border-indigo-300 bg-indigo-50 text-indigo-700 cursor-wait"
                      : "border-slate-200 hover:border-indigo-500 bg-slate-50 hover:bg-indigo-50/50 text-slate-700 cursor-pointer"
                  }`}
                >
                  {uploadingBanner ? (
                    <>
                      <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
                      <span>ImageKit ক্লাউডে আপলোড হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-4 h-4 text-indigo-600" />
                      <span>কম্পিউটার থেকে ব্যানার আপলোড করুন</span>
                    </>
                  )}
                </label>
              </div>

              <div className="flex items-center gap-2 my-2 text-xs text-slate-400">
                <div className="flex-1 border-t border-slate-200"></div>
                <span>অথবা ইমেজ URL দিন</span>
                <div className="flex-1 border-t border-slate-200"></div>
              </div>

              <input
                type="url"
                required
                placeholder="https://ik.imagekit.io/... অথবা https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>

            {imageUrl && (
              <div className="aspect-video w-full rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Publish Banner
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
