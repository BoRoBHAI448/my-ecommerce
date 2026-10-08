"use client";

import { useState, useEffect, useRef } from "react";
import { useStore } from "@/lib/store-context";
import { mockCategories, mockProducts } from "@/lib/api/mock/data";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  FolderTree,
  PlusCircle,
  Trash2,
  Check,
  ImagePlus,
  X,
  Upload,
  ChevronRight,
  Package,
} from "lucide-react";

// ─── Image Upload Box ────────────────────────────────────────────────────────
function ImageUploadBox({ value, onChange, label = "Category Image" }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  function processFile(file) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("শুধুমাত্র ছবি ফাইল আপলোড করুন (JPG, PNG, WebP, SVG)");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert("ছবির সাইজ সর্বোচ্চ 2MB হতে হবে");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => onChange(reader.result);
    reader.readAsDataURL(file);
  }

  function handleFileChange(e) {
    processFile(e.target.files?.[0]);
    e.target.value = ""; // allow re-selecting same file
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    processFile(e.dataTransfer.files?.[0]);
  }

  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
        {label}
      </label>

      {value ? (
        // Preview
        <div className="relative w-full h-40 rounded-xl overflow-hidden border-2 border-slate-200 group">
          <img
            src={value}
            alt="Category preview"
            className="w-full h-full object-cover"
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg bg-white text-xs font-bold text-slate-800 flex items-center gap-1.5 hover:bg-slate-100"
            >
              <Upload className="w-3.5 h-3.5" /> পরিবর্তন করুন
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="p-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        // Drop zone
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`w-full h-40 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all select-none
            ${dragging
              ? "border-amber-400 bg-amber-50"
              : "border-slate-200 bg-slate-50 hover:border-amber-300 hover:bg-amber-50/50"
            }`}
        >
          <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-500 flex items-center justify-center">
            <ImagePlus className="w-5 h-5" />
          </div>
          <div className="text-center">
            <p className="text-xs font-semibold text-slate-700">
              ছবি আপলোড করুন
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              ক্লিক করুন বা ড্র্যাগ করুন · JPG, PNG, WebP · সর্বোচ্চ 2MB
            </p>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function AdminCategoriesPage() {
  const { categories: storeCategories, updateCategories } = useStore();
  const [categories, setCategories] = useState(
    storeCategories?.length ? storeCategories : mockCategories
  );
  const [showAddForm, setShowAddForm] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // ── Product count map: slug → count (uses mock data; replace with API when backend is ready)
  const productCountBySlug = mockProducts.reduce((acc, p) => {
    const slug = p.category?.slug;
    if (slug) acc[slug] = (acc[slug] || 0) + 1;
    return acc;
  }, {});

  // Total products under a root category = its own + all subcategory counts
  function getCategoryTotal(cat) {
    const own = productCountBySlug[cat.slug] || 0;
    const sub = (cat.children || []).reduce(
      (sum, s) => sum + (productCountBySlug[s.slug] || 0),
      0
    );
    return own + sub;
  }

  // Keep in sync with store context
  useEffect(() => {
    if (storeCategories?.length) setCategories(storeCategories);
  }, [storeCategories]);

  // ── Form state
  const [name, setName]       = useState("");
  const [slug, setSlug]       = useState("");
  const [parentId, setParentId] = useState("");
  const [image, setImage]     = useState("");
  const [description, setDescription] = useState("");

  function handleNameChange(val) {
    setName(val);
    setSlug(
      val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
    );
  }

  function resetForm() {
    setName(""); setSlug(""); setParentId(""); setImage(""); setDescription("");
    setShowAddForm(false);
  }

  function saveAndSync(updated) {
    setCategories(updated);
    if (typeof updateCategories === "function") updateCategories(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  }

  function handleAddCategory(e) {
    e.preventDefault();
    if (!name.trim()) return;

    let updated;
    if (parentId) {
      // Subcategory
      updated = categories.map((cat) => {
        if (String(cat.id) === String(parentId)) {
          return {
            ...cat,
            children: [
              ...(cat.children || []),
              { id: Date.now(), name, slug, image },
            ],
          };
        }
        return cat;
      });
    } else {
      // Root category
      updated = [
        {
          id: Date.now(),
          name,
          slug,
          description,
          image:
            image ||
            "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80",
          children: [],
        },
        ...categories,
      ];
    }

    saveAndSync(updated);
    resetForm();
  }

  function handleDeleteCategory(id) {
    if (!confirm("এই category মুছে ফেলবেন?")) return;
    const updated = categories.filter((c) => c.id !== id);
    saveAndSync(updated);
  }

  function handleDeleteSubcategory(parentId, subId) {
    if (!confirm("এই sub-category মুছে ফেলবেন?")) return;
    const updated = categories.map((cat) => {
      if (cat.id !== parentId) return cat;
      return { ...cat, children: (cat.children || []).filter((s) => s.id !== subId) };
    });
    saveAndSync(updated);
  }

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Category Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Storefront departments, sub-categories, and cover images
          </p>
        </div>

        <Button
          type="button"
          onClick={() => { setShowAddForm(!showAddForm); }}
          variant="primary"
          leftIcon={<PlusCircle className="w-4 h-4 text-amber-400" />}
          className="shadow-sm font-bold"
        >
          {showAddForm ? "ফর্ম বন্ধ করুন" : "নতুন Category যোগ করুন"}
        </Button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Category সেভ হয়েছে এবং Storefront header-এ আপডেট হয়েছে!</span>
        </div>
      )}

      {/* ── Add Category Form ─────────────────────────────────────────────── */}
      {showAddForm && (
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-5 animate-in fade-in">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <FolderTree className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              নতুন Category তৈরি করুন
            </h2>
          </div>

          <form onSubmit={handleAddCategory} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Category Name"
                placeholder="যেমন: Leather Footwear, Luxury Bags"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
              />
              <Input
                label="URL Slug (Auto-generated)"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Parent selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Parent Category
                </label>
                <select
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <option value="">None (Top-Level Category)</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      Sub-category under "{c.name}"
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400 mt-1">
                  Top-level হলে header navigation-এ দেখাবে।
                </p>
              </div>

              <Input
                label="Description (Optional)"
                placeholder="এই category সম্পর্কে সংক্ষিপ্ত বিবরণ"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Image upload — only for root categories */}
            {!parentId && (
              <ImageUploadBox
                value={image}
                onChange={setImage}
                label="Category Cover Image"
              />
            )}

            <div className="pt-2 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={resetForm}>
                বাতিল
              </Button>
              <Button type="submit" variant="primary">
                Save &amp; Publish
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* ── Categories List ───────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Active Categories ({categories.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Homepage grid ও header mega menu-তে এগুলো দেখায়
            </p>
          </div>
          {/* Total product count across all categories */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600">
            <Package className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-bold">
              {mockProducts.length} Products
            </span>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {categories.map((cat) => (
            <div key={cat.id}>
              {/* Root Category Row */}
              <div className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/80 transition-colors">
                {/* Thumbnail */}
                <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 shrink-0 bg-slate-100">
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-lg font-black">
                      {cat.name.charAt(0)}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-slate-900 truncate">{cat.name}</p>
                    {/* Total product count badge */}
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold shrink-0
                      ${getCategoryTotal(cat) > 0
                        ? "bg-amber-100 text-amber-700"
                        : "bg-slate-100 text-slate-400"}`}
                    >
                      <Package className="w-2.5 h-2.5" />
                      {getCategoryTotal(cat)}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-slate-400 mt-0.5">/{cat.slug}</p>
                  {cat.description && (
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">{cat.description}</p>
                  )}
                </div>

                {/* Sub-category chips */}
                <div className="hidden md:flex flex-wrap gap-1.5 max-w-xs">
                  {cat.children?.length > 0 ? (
                    cat.children.map((sub) => {
                      const subCount = productCountBySlug[sub.slug] || 0;
                      return (
                        <span
                          key={sub.id}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-700 font-semibold group"
                        >
                          <ChevronRight className="w-2.5 h-2.5 text-slate-400" />
                          {sub.name}
                          {/* Sub product count */}
                          <span className={`ml-0.5 px-1 rounded text-[10px] font-bold
                            ${subCount > 0 ? "bg-amber-100 text-amber-600" : "bg-slate-200 text-slate-400"}`}
                          >
                            {subCount}
                          </span>
                          <button
                            type="button"
                            title="Sub-category মুছুন"
                            onClick={() => handleDeleteSubcategory(cat.id, sub.id)}
                            className="ml-0.5 text-slate-300 hover:text-red-500 transition-colors"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-[11px] text-slate-400 italic">Sub-category নেই</span>
                  )}
                </div>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="p-1.5 rounded-lg text-slate-300 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
                  title="Category মুছুন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {categories.length === 0 && (
            <div className="py-16 text-center text-slate-400 text-sm">
              <FolderTree className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-semibold">কোনো Category নেই</p>
              <p className="text-xs mt-1">উপরে "নতুন Category যোগ করুন" বাটনে ক্লিক করুন</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
