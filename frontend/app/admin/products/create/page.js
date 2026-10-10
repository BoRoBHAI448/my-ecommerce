"use client";

import { useState, useEffect, Suspense, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useStore } from "@/lib/store-context";
import { mockProducts, mockCategories, mockBrands } from "@/lib/api/mock/data";
import { uploadProductImageToSupabase } from "@/lib/supabase/storage";
import { createAdminProductInSupabase } from "@/lib/supabase/products";
import {
  ArrowLeft,
  Package,
  Plus,
  Trash2,
  UploadCloud,
  CheckCircle2,
  Sparkles,
  Layers,
  Image as ImageIcon,
  DollarSign,
  Info,
  Eye,
  ExternalLink,
  HelpCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  X,
  Check,
  Star,
  Shirt,
  Footprints,
  ShoppingBag,
  SlidersHorizontal,
  Tag,
} from "lucide-react";

// ── Product Archetype Configurations ──────────────────────────────────────────
const PRODUCT_TYPES = [
  {
    id: "clothing",
    name: "Clothing & Dresses",
    nameBn: "পোশাক / ড্রেস / টপস",
    icon: Shirt,
    titlePlaceholder: "e.g. Column Knit Maxi Dress",
    taglinePlaceholder: "Made for effortless days with fluid movement and quiet luxury tailoring...",
    defaultCategory: "dresses",
    sizeSystem: "apparel",
    allowedSizeSystems: ["apparel", "one_size"],
    badgeLabel: "Dress / Apparel",
    specsTemplate: [
      { label: "Fabric / Material", key: "material", placeholder: "e.g. 100% Organic Linen Blend" },
      { label: "Fit & Cut", key: "fit", placeholder: "e.g. Relaxed fluid silhouette" },
      { label: "Care Instructions", key: "care", placeholder: "e.g. Hand wash cold or dry clean" },
    ],
  },
  {
    id: "pants",
    name: "Pants & Trousers",
    nameBn: "প্যান্ট / ট্রাউজার / জিন্স",
    icon: SlidersHorizontal,
    titlePlaceholder: "e.g. Wide-Leg Pleated Wool Trouser",
    taglinePlaceholder: "Designed with a high rise and relaxed drape, tailored from breathable worsted wool...",
    defaultCategory: "trousers",
    sizeSystem: "waist",
    allowedSizeSystems: ["waist", "apparel"],
    badgeLabel: "Trousers & Pants",
    specsTemplate: [
      { label: "Fabric / Weave", key: "material", placeholder: "e.g. 100% Worsted Wool Twill" },
      { label: "Rise & Leg Style", key: "fit", placeholder: "e.g. High-Rise, Wide-Leg drape" },
      { label: "Waist Closure", key: "closure", placeholder: "e.g. Concealed hook & zip fly" },
    ],
  },
  {
    id: "shoes",
    name: "Shoes & Footwear",
    nameBn: "জুতো / স্নিকার্স / লোফার",
    icon: Footprints,
    titlePlaceholder: "e.g. Italian Leather Tassel Loafer",
    taglinePlaceholder: "Handcrafted from full-grain calfskin leather with durable Blake-stitched sole...",
    defaultCategory: "shoes-loafers",
    sizeSystem: "shoes_eu",
    allowedSizeSystems: ["shoes_eu", "shoes_us"],
    badgeLabel: "Footwear & Shoes",
    specsTemplate: [
      { label: "Upper Material", key: "material", placeholder: "e.g. Full-grain Italian Calfskin" },
      { label: "Outsole Type", key: "sole", placeholder: "e.g. Vibram Rubber Lug Sole" },
      { label: "Insole & Lining", key: "insole", placeholder: "e.g. Cushioned leather footbed" },
    ],
  },
  {
    id: "bags",
    name: "Bags & Leather",
    nameBn: "ব্যাগ / পার্স / ব্যাকপ্যাক",
    icon: ShoppingBag,
    titlePlaceholder: "e.g. Minimalist Soft Calfskin Tote",
    taglinePlaceholder: "Spacious everyday companion with reinforced handles and interior zip pocket...",
    defaultCategory: "bags-totes",
    sizeSystem: "bags",
    allowedSizeSystems: ["bags", "one_size"],
    badgeLabel: "Bags & Leather",
    specsTemplate: [
      { label: "Leather Finish", key: "material", placeholder: "e.g. Supple Pebbled Calfskin" },
      { label: "Dimensions", key: "dimensions", placeholder: "e.g. 38cm (W) x 32cm (H) x 14cm (D)" },
      { label: "Hardware & Closure", key: "hardware", placeholder: "e.g. Magnetic snap & brass hardware" },
    ],
  },
  {
    id: "accessories",
    name: "Accessories & Other",
    nameBn: "বেল্ট / সানগ্লাস / অন্যান্য",
    icon: Sparkles,
    titlePlaceholder: "e.g. Handcrafted Brass Buckle Leather Belt",
    taglinePlaceholder: "Accenting minimal wardrobes with timeless understated craftsmanship...",
    defaultCategory: "accessories-belts",
    sizeSystem: "one_size",
    allowedSizeSystems: ["one_size", "waist"],
    badgeLabel: "Accessories",
    specsTemplate: [
      { label: "Material & Build", key: "material", placeholder: "e.g. Solid Brass & Bridle Leather" },
      { label: "Finish / Accent", key: "finish", placeholder: "e.g. Satin brushed gold" },
    ],
  },
];

// ── Sizing Presets by Category System ─────────────────────────────────────────
const SIZE_SYSTEMS = {
  apparel: {
    label: "Apparel (XS - 3XL)",
    options: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
  },
  waist: {
    label: "Waist Inches (28 - 38)",
    options: ["28", "29", "30", "31", "32", "33", "34", "36", "38"],
  },
  shoes_eu: {
    label: "EU Shoe (38 - 46)",
    options: ["38", "39", "40", "41", "42", "43", "44", "45", "46"],
  },
  shoes_us: {
    label: "US Shoe (6 - 12)",
    options: ["6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "12"],
  },
  bags: {
    label: "Bag Sizes",
    options: ["One Size", "Mini", "Small", "Medium", "Large"],
  },
  one_size: {
    label: "One Size / Standard",
    options: ["One Size", "Standard", "Free Size"],
  },
};

const COLORS_PRESET = [
  { name: "Noir Black", hex: "#18181b" },
  { name: "Beige / Oatmeal", hex: "#e5ded4" },
  { name: "Cream / White", hex: "#fafaf9", border: true },
  { name: "Espresso Brown", hex: "#3b2219" },
  { name: "Terracotta", hex: "#9a3412" },
  { name: "Sage Olive", hex: "#4d7c0f" },
  { name: "Navy Blue", hex: "#1e3a8a" },
  { name: "Charcoal Grey", hex: "#374151" },
  { name: "Tan / Camel", hex: "#b45309" },
  { name: "Burgundy Wine", hex: "#831843" },
];

function ProductCreateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const {
    categories: storeCategories,
    brands: storeBrands,
    products: storeProducts,
    updateProducts,
  } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const allProducts = Array.isArray(storeProducts) ? storeProducts : mockProducts;

  // ── Form State ────────────────────────────────────────────────────────────
  const [productType, setProductType] = useState("clothing");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isSlugCustom, setIsSlugCustom] = useState(false);
  const [gender, setGender] = useState("Women");
  const [selectedCategory, setSelectedCategory] = useState("dresses");
  const [sku, setSku] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");

  // Specifications
  const [specs, setSpecs] = useState({});

  // Pricing & Stock
  const [regularPrice, setRegularPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [stockCount, setStockCount] = useState("44");
  const [customBadge, setCustomBadge] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  // Media
  const [images, setImages] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState("");

  // Variants & Sizing Mode
  const [hasVariants, setHasVariants] = useState(false);
  const [activeSizeSystem, setActiveSizeSystem] = useState("apparel");
  const [selectedSizes, setSelectedSizes] = useState(["S", "M", "L"]);
  const [customSizeInput, setCustomSizeInput] = useState("");
  const [customSizes, setCustomSizes] = useState([]);

  // Colors
  const [selectedColors, setSelectedColors] = useState(["Noir Black"]);
  const [customColorInput, setCustomColorInput] = useState("");
  const [allColors, setAllColors] = useState(COLORS_PRESET);

  // UI Alerts
  const [toastMessage, setToastMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeConfig = useMemo(() => {
    return PRODUCT_TYPES.find((pt) => pt.id === productType) || PRODUCT_TYPES[0];
  }, [productType]);

  // Compute strictly relevant size systems for the active product archetype
  const relevantSizeSystems = useMemo(() => {
    const allowed = activeConfig?.allowedSizeSystems || [activeConfig?.sizeSystem || "apparel"];
    return allowed
      .map((key) => [key, SIZE_SYSTEMS[key]])
      .filter(([_, val]) => Boolean(val));
  }, [activeConfig]);

  // Handle switching size system within the relevant category
  function handleSwitchSizeSystem(sysKey) {
    setActiveSizeSystem(sysKey);
    // Populate sensible default sizes for this system
    if (sysKey === "shoes_eu") {
      setSelectedSizes(["40", "41", "42", "43"]);
    } else if (sysKey === "shoes_us") {
      setSelectedSizes(["8", "8.5", "9", "9.5", "10"]);
    } else if (sysKey === "waist") {
      setSelectedSizes(["30", "32", "34"]);
    } else if (sysKey === "apparel") {
      setSelectedSizes(["S", "M", "L", "XL"]);
    } else if (sysKey === "bags") {
      setSelectedSizes(["Small", "Medium", "Large"]);
    } else if (sysKey === "one_size") {
      setSelectedSizes(["One Size"]);
    } else {
      setSelectedSizes([]);
    }
  }

  // Handle switching product type (e.g. Shoes, Pants, Dresses, Bags)
  function handleSelectProductType(typeId) {
    setProductType(typeId);
    const cfg = PRODUCT_TYPES.find((pt) => pt.id === typeId);
    if (cfg) {
      setActiveSizeSystem(cfg.sizeSystem);
      setSelectedCategory(cfg.defaultCategory);

      // Default reasonable sizes based on type
      if (cfg.sizeSystem === "shoes_eu") {
        setSelectedSizes(["40", "41", "42", "43"]);
      } else if (cfg.sizeSystem === "shoes_us") {
        setSelectedSizes(["8", "8.5", "9", "9.5", "10"]);
      } else if (cfg.sizeSystem === "waist") {
        setSelectedSizes(["30", "32", "34"]);
      } else if (cfg.sizeSystem === "bags") {
        setSelectedSizes(["Small", "Medium", "Large"]);
      } else if (cfg.sizeSystem === "one_size") {
        setSelectedSizes(["One Size"]);
      } else {
        setSelectedSizes(["S", "M", "L"]);
      }
    }
  }

  // Auto-generate slug and SKU when name changes
  function handleNameChange(val) {
    setName(val);
    if (!isSlugCustom) {
      const generatedSlug = val
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setSlug(generatedSlug);
    }
    if (!sku) {
      const prefix = productType === "shoes" ? "SH" : productType === "pants" ? "PN" : productType === "bags" ? "BG" : "FV";
      const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
      setSku(`${prefix}-${randomCode}`);
    }
  }

  // Auto-calculated discount percentage
  const calculatedDiscountBadge = useMemo(() => {
    if (customBadge.trim()) return customBadge.trim();
    const reg = parseFloat(regularPrice);
    const sell = parseFloat(sellingPrice);
    if (reg > 0 && sell > 0 && reg > sell) {
      const pct = Math.round(((reg - sell) / reg) * 100);
      return `${pct}%`;
    }
    return "";
  }, [regularPrice, sellingPrice, customBadge]);

  // Pre-fill if editing
  useEffect(() => {
    if (!editId || !mounted) return;
    const found = allProducts.find((p) => String(p.id) === String(editId));
    if (found) {
      setName(found.name || "");
      setSlug(found.slug || "");
      setIsSlugCustom(true);
      setSku(found.sku || "");
      setRegularPrice(found.regular_price ? String(found.regular_price) : "");
      setSellingPrice(
        found.selling_price
          ? String(found.selling_price)
          : found.price
          ? String(found.price)
          : ""
      );
      setStockCount(String(found.stock || found.stock_count || 44));
      setCustomBadge(found.discount_badge || "");
      setGender(found.gender || "Women");
      setShortDescription(found.short_description || "");
      setDescription(found.description || "");
      setIsActive(found.is_active !== false);
      setIsFeatured(Boolean(found.is_featured));

      if (Array.isArray(found.images) && found.images.length > 0) {
        setImages(found.images);
      } else if (found.image || found.thumbnail) {
        setImages([found.image || found.thumbnail]);
      }
    }
  }, [editId, mounted, allProducts]);

  // ── Image Upload & Automatic WebP Conversion ──────────────────────────────
  async function handleFileUpload(files) {
    if (!files || files.length === 0) return;
    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );
    if (imageFiles.length === 0) {
      setErrorMessage("Please select valid image files (JPG, PNG, HEIC, WebP).");
      return;
    }

    setUploadingImages(true);
    setUploadProgressText(`Converting to WebP & uploading (0/${imageFiles.length})...`);

    try {
      const uploadedUrls = [];
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        setUploadProgressText(
          `Auto-converting to WebP (${i + 1}/${imageFiles.length})...`
        );
        const res = await uploadProductImageToSupabase(
          file,
          slug || name || "product"
        );
        if (res?.url) {
          uploadedUrls.push(res.url);
        }
      }

      if (uploadedUrls.length > 0) {
        setImages((prev) => [...prev, ...uploadedUrls]);
        setToastMessage(
          `✓ ${uploadedUrls.length} image(s) auto-converted to WebP & saved to Supabase!`
        );
        setTimeout(() => setToastMessage(""), 4000);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setErrorMessage(`Upload error: ${err.message || "Failed to upload"}`);
    } finally {
      setUploadingImages(false);
      setUploadProgressText("");
    }
  }

  function handleRemoveImage(idx) {
    setImages(images.filter((_, i) => i !== idx));
  }

  // Add custom size
  function handleAddCustomSize(e) {
    if (e) e.preventDefault();
    const trimmed = customSizeInput.trim();
    if (!trimmed) return;
    if (!customSizes.includes(trimmed)) {
      setCustomSizes((prev) => [...prev, trimmed]);
    }
    if (!selectedSizes.includes(trimmed)) {
      setSelectedSizes((prev) => [...prev, trimmed]);
    }
    setCustomSizeInput("");
  }

  // Add custom color
  function handleAddCustomColor(e) {
    if (e) e.preventDefault();
    const trimmed = customColorInput.trim();
    if (!trimmed) return;
    if (!allColors.some((c) => c.name.toLowerCase() === trimmed.toLowerCase())) {
      const newEntry = { name: trimmed, hex: "#52525b" };
      setAllColors((prev) => [...prev, newEntry]);
    }
    if (!selectedColors.includes(trimmed)) {
      setSelectedColors((prev) => [...prev, trimmed]);
    }
    setCustomColorInput("");
  }

  // ── Form Submission ───────────────────────────────────────────────────────
  async function handleSaveProduct(e) {
    if (e) e.preventDefault();
    setErrorMessage("");

    if (!name.trim()) {
      setErrorMessage("Please enter a product title.");
      return;
    }
    if (!sellingPrice || parseFloat(sellingPrice) <= 0) {
      setErrorMessage("Please enter a valid price.");
      return;
    }
    if (images.length === 0) {
      setErrorMessage(
        "Please upload at least 1 product image. (The first 4 images form the PDP 2x2 grid)."
      );
      return;
    }

    setIsSubmitting(true);

    const priceNum = parseFloat(sellingPrice);
    const regNum = regularPrice ? parseFloat(regularPrice) : null;
    const finalBadge = calculatedDiscountBadge;
    const finalSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    // Build specs summary into description
    const formattedSpecs = Object.entries(specs)
      .filter(([_, val]) => val && val.trim())
      .map(([key, val]) => `• ${key.charAt(0).toUpperCase() + key.slice(1)}: ${val.trim()}`)
      .join("\n");

    const fullDescription = formattedSpecs
      ? `${description.trim() ? description.trim() + "\n\n" : ""}Key Specifications:\n${formattedSpecs}`
      : description.trim();

    const productPayload = {
      name: name.trim(),
      slug: finalSlug,
      sku: sku.trim() || `FV-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      regular_price: regNum || priceNum,
      selling_price: priceNum,
      discount_price: regNum && regNum > priceNum ? priceNum : null,
      discount_badge: finalBadge || null,
      stock: parseInt(stockCount, 10) || 44,
      in_stock: isActive,
      gender: gender || "Women",
      short_description: shortDescription.trim() || fullDescription.slice(0, 180),
      description: fullDescription,
      thumbnail: images[0] || null,
      images: images,
      is_featured: isFeatured,
      is_active: isActive,
    };

    let supabaseSaved = false;
    try {
      await createAdminProductInSupabase(productPayload);
      supabaseSaved = true;
      setToastMessage("✓ Product published to Supabase successfully!");
    } catch (err) {
      console.warn("Supabase save notice:", err);
      setToastMessage("✓ Product saved to store catalog!");
    }

    // Always update local state so fallback views refresh immediately
    if (typeof updateProducts === "function") {
      updateProducts((prev) => [
        {
          id: String(Date.now()),
          ...productPayload,
          price: priceNum,
          originalPrice: regNum,
          image: images[0] || "",
          productType,
          sizes: hasVariants ? selectedSizes : [],
          colors: hasVariants ? selectedColors : [],
        },
        ...(Array.isArray(prev) ? prev : []),
      ]);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/admin/products");
    }, 700);
  }

  return (
    <div className="max-w-[1400px] mx-auto pb-20 px-4 sm:px-6">
      {/* ── Top Header Bar ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6 border-b border-neutral-200">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="w-9 h-9 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-600 hover:text-black hover:bg-neutral-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-semibold text-neutral-900 tracking-tight">
                {editId ? "Edit Lookbook Product" : "New Lookbook Product"}
              </h1>
              <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-700 rounded-full">
                Supabase Connected
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Create and publish any item (Shoes, Pants, Dresses, Bags) with auto-converted .webp gallery.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleSaveProduct}
            disabled={isSubmitting || uploadingImages}
            className="px-5 py-2.5 bg-neutral-950 hover:bg-neutral-800 disabled:opacity-50 text-white text-xs font-semibold uppercase tracking-wider rounded-lg shadow-sm active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Publish Product
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Alerts ─────────────────────────────────────────────────────── */}
      {errorMessage && (
        <div className="mt-5 p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage("")}
            className="text-rose-500 hover:text-rose-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-neutral-950 text-white rounded-xl shadow-2xl border border-neutral-800 text-xs font-medium flex items-center gap-3 animate-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── Section 0: Product Type Switcher (Card 0) ──────────────────── */}
      <div className="mt-7 bg-white p-5 sm:p-6 rounded-2xl border border-neutral-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-neutral-700" />
              1. Choose Product Type / আইটেম সিলেক্ট করুন
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Select what you are adding (Shoe, Pant, Dress, Bag) — forms, sizes and specs adapt instantly.
            </p>
          </div>
          <span className="text-[11px] font-medium text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-md self-start sm:self-auto">
            Active: <strong className="text-neutral-900">{activeConfig.name}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {PRODUCT_TYPES.map((pt) => {
            const Icon = pt.icon;
            const isSelected = productType === pt.id;
            return (
              <button
                key={pt.id}
                type="button"
                onClick={() => handleSelectProductType(pt.id)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                  isSelected
                    ? "bg-neutral-950 text-white border-neutral-950 shadow-sm ring-2 ring-neutral-900/10"
                    : "bg-neutral-50/70 hover:bg-neutral-100 text-neutral-800 border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isSelected ? "bg-white/15 text-white" : "bg-white text-neutral-800 shadow-2xs"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </div>

                <div>
                  <div className="text-xs font-bold">{pt.name}</div>
                  <div className={`text-[10px] mt-0.5 ${isSelected ? "text-neutral-300" : "text-neutral-500"}`}>
                    {pt.nameBn}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Main Form Layout (2 Columns) ────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        {/* ── Left Column (8 cols): Primary Details & Media ──────────────── */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section 1: Basic Information */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-2xs space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
                <Package className="w-4 h-4 text-neutral-700" />
                2. Product Information
              </h2>
              <span className="text-xs text-neutral-400 font-normal">
                Required fields marked with *
              </span>
            </div>

            {/* Product Title */}
            <div>
              <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-1.5">
                Product Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder={activeConfig.titlePlaceholder}
                className="w-full px-4 py-2.5 bg-neutral-50/60 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all"
              />
            </div>

            {/* URL Slug & SKU Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-1.5">
                  URL Slug
                </label>
                <div className="flex items-center bg-neutral-50/60 border border-neutral-200 rounded-xl overflow-hidden text-xs">
                  <span className="px-3 py-2 text-neutral-400 bg-neutral-100/70 border-r border-neutral-200 select-none">
                    /product/
                  </span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => {
                      setIsSlugCustom(true);
                      setSlug(e.target.value);
                    }}
                    placeholder="italian-leather-tassel-loafer"
                    className="w-full px-3 py-2 bg-transparent focus:outline-none font-mono text-neutral-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-1.5">
                  Product SKU Code
                </label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="e.g. SH-892-4B11"
                  className="w-full px-4 py-2 bg-neutral-50/60 border border-neutral-200 rounded-xl text-xs font-mono uppercase text-neutral-800 focus:bg-white focus:outline-none focus:border-neutral-900"
                />
              </div>
            </div>

            {/* Short Tagline (PDP Excerpt) */}
            <div>
              <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>PDP Header Tagline (Short Excerpt)</span>
                <span className="text-[10px] text-neutral-400 font-normal">
                  Shown under title on product page
                </span>
              </label>
              <textarea
                rows={2}
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder={activeConfig.taglinePlaceholder}
                className="w-full px-4 py-2.5 bg-neutral-50/60 border border-neutral-200 rounded-xl text-xs text-neutral-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all resize-none"
              />
            </div>

            {/* Full Editorial Description */}
            <div>
              <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Editorial Story (Full Description)</span>
                <span className="text-[10px] text-neutral-400 font-normal">
                  Shown in the "Description" tab below
                </span>
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Every detail has been settled on purpose — where the seams land, how heavy the leather is, how the edge finishes. It is a quiet piece, and quiet pieces only work when the craftsmanship is right..."
                className="w-full px-4 py-2.5 bg-neutral-50/60 border border-neutral-200 rounded-xl text-xs text-neutral-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all"
              />
            </div>

            {/* Dynamic Product Specifications / Highlights */}
            {activeConfig.specsTemplate && activeConfig.specsTemplate.length > 0 && (
              <div className="pt-3 border-t border-neutral-100">
                <span className="block text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-neutral-600" />
                  {activeConfig.name} Specifications & Highlights (Optional)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {activeConfig.specsTemplate.map((spec) => (
                    <div key={spec.key}>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                        {spec.label}
                      </label>
                      <input
                        type="text"
                        value={specs[spec.key] || ""}
                        onChange={(e) =>
                          setSpecs((prev) => ({ ...prev, [spec.key]: e.target.value }))
                        }
                        placeholder={spec.placeholder}
                        className="w-full px-3 py-2 bg-neutral-50/60 border border-neutral-200 rounded-lg text-xs text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-900"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Lookbook 2x2 Media Gallery */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-neutral-700" />
                  3. Lookbook 2×2 Photo Gallery
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Uploaded photos are automatically converted into <strong>.webp</strong> and form the 2×2 product grid.
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-neutral-100 rounded-full text-neutral-700">
                {images.length} / 4 Recommended
              </span>
            </div>

            {/* Dropzone */}
            <div
              className={`border-2 border-dashed rounded-2xl p-7 text-center transition-all ${
                uploadingImages
                  ? "border-neutral-400 bg-neutral-50 cursor-wait"
                  : "border-neutral-300 hover:border-neutral-900 bg-neutral-50/60 hover:bg-neutral-50 cursor-pointer"
              }`}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                disabled={uploadingImages}
                onChange={(e) => {
                  handleFileUpload(e.target.files);
                  e.target.value = "";
                }}
                className="hidden"
                id="product-photo-upload"
              />
              <label
                htmlFor={uploadingImages ? undefined : "product-photo-upload"}
                className="cursor-pointer block space-y-2 select-none"
              >
                {uploadingImages ? (
                  <div className="py-2 space-y-2">
                    <Loader2 className="w-8 h-8 text-neutral-900 mx-auto animate-spin" />
                    <p className="text-xs font-semibold text-neutral-800">
                      {uploadProgressText || "Converting to WebP & uploading..."}
                    </p>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="w-8 h-8 text-neutral-600 mx-auto" />
                    <p className="text-xs font-bold text-neutral-900">
                      Click to upload or Drag & Drop Photos
                    </p>
                    <p className="text-[11px] text-neutral-500">
                      Supports JPG, PNG, HEIC • Auto-converts to lightweight .webp
                    </p>
                  </>
                )}
              </label>
            </div>

            {/* 4-Slot Visual Preview Matrix */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {images.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className="relative group aspect-[3/4] bg-neutral-100 rounded-xl overflow-hidden border border-neutral-200 select-none"
                  >
                    <img
                      src={imgUrl}
                      alt={`Gallery slot ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />

                    {/* Badge */}
                    <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                      {idx === 0 && (
                        <span className="bg-neutral-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm shadow-xs">
                          Main Cover
                        </span>
                      )}
                      <span className="bg-emerald-600/90 backdrop-blur-xs text-white text-[9px] font-semibold px-1.5 py-0.5 rounded-xs">
                        WebP ✓
                      </span>
                    </div>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-2 right-2 w-7 h-7 bg-rose-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-rose-700 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="absolute bottom-2 left-2 right-2 text-center bg-black/60 backdrop-blur-xs text-white text-[10px] py-0.5 rounded-xs">
                      Slot #{idx + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Clean Pricing & Inventory */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-xs">
                ৳
              </span>
              4. Pricing & Inventory (BDT / ৳)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Selling Price */}
              <div>
                <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-1.5">
                  Sale / Offer Price (BDT ৳) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 font-bold text-sm">
                    ৳
                  </span>
                  <input
                    type="number"
                    step="1"
                    required
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(e.target.value)}
                    placeholder="2450"
                    className="w-full pl-8 pr-4 py-2.5 bg-neutral-50/60 border border-neutral-200 rounded-xl text-sm font-bold text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              {/* Regular / Original Price */}
              <div>
                <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-1.5">
                  Regular Price (BDT ৳) (Optional)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 font-bold text-sm">
                    ৳
                  </span>
                  <input
                    type="number"
                    step="1"
                    value={regularPrice}
                    onChange={(e) => setRegularPrice(e.target.value)}
                    placeholder="3200"
                    className="w-full pl-8 pr-4 py-2.5 bg-neutral-50/60 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              {/* In Stock Count */}
              <div>
                <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-1.5">
                  Stock Units (Available)
                </label>
                <input
                  type="number"
                  value={stockCount}
                  onChange={(e) => setStockCount(e.target.value)}
                  placeholder="44"
                  className="w-full px-4 py-2.5 bg-neutral-50/60 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-900"
                />
              </div>
            </div>

            {/* Discount Badge Preview Banner */}
            {calculatedDiscountBadge && (
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/80 flex items-center justify-between text-xs">
                <span className="text-neutral-600">
                  Calculated Lookbook Badge:
                </span>
                <span className="px-2.5 py-1 bg-neutral-900 text-white font-bold rounded-md">
                  {calculatedDiscountBadge}
                </span>
              </div>
            )}
          </div>

          {/* Section 4: Adaptive Size / Color Options (Toggle Switch) */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-neutral-700" />
                  5. Sizing & Colors (Optional Options)
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Does this item come in different shoe sizes, waist sizes, or colors?
                </p>
              </div>

              {/* Modern Switch */}
              <button
                type="button"
                onClick={() => setHasVariants((v) => !v)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  hasVariants ? "bg-neutral-950" : "bg-neutral-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    hasVariants ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {hasVariants && (
              <div className="pt-4 border-t border-neutral-100 space-y-5 animate-in fade-in">
                {/* Sizing System Selector Tabs (Only relevant to the active category) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider">
                      Size System Presets ({activeConfig.name})
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      {relevantSizeSystems.length > 1
                        ? "Switch sizing standards with one click"
                        : "Category-specific sizing standard"}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 p-1 bg-neutral-100 rounded-xl">
                    {relevantSizeSystems.map(([sysKey, sysVal]) => {
                      const isActive = activeSizeSystem === sysKey;
                      return (
                        <button
                          key={sysKey}
                          type="button"
                          onClick={() => handleSwitchSizeSystem(sysKey)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            isActive
                              ? "bg-white text-neutral-900 shadow-2xs font-bold"
                              : "text-neutral-600 hover:text-neutral-900"
                          }`}
                        >
                          {sysVal.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Size Chips */}
                <div>
                  <span className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-2">
                    Available Sizes ({SIZE_SYSTEMS[activeSizeSystem]?.label || "Sizes"})
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {SIZE_SYSTEMS[activeSizeSystem]?.options.map((sz) => {
                      const isSelected = selectedSizes.includes(sz);
                      return (
                        <button
                          key={sz}
                          type="button"
                          onClick={() =>
                            setSelectedSizes((prev) =>
                              isSelected
                                ? prev.filter((s) => s !== sz)
                                : [...prev, sz]
                            )
                          }
                          className={`min-w-11 px-3 h-9 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                            isSelected
                              ? "bg-neutral-900 text-white border-neutral-900 shadow-xs"
                              : "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400"
                          }`}
                        >
                          {sz}
                        </button>
                      );
                    })}

                    {/* Any custom sizes added */}
                    {customSizes.map((csz) => {
                      const isSelected = selectedSizes.includes(csz);
                      return (
                        <button
                          key={csz}
                          type="button"
                          onClick={() =>
                            setSelectedSizes((prev) =>
                              isSelected
                                ? prev.filter((s) => s !== csz)
                                : [...prev, csz]
                            )
                          }
                          className={`min-w-11 px-3 h-9 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                            isSelected
                              ? "bg-neutral-900 text-white border-neutral-900 shadow-xs"
                              : "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400"
                          }`}
                        >
                          {csz}
                        </button>
                      );
                    })}
                  </div>

                  {/* Add Custom Size Inline Form */}
                  <div className="flex items-center gap-2 mt-3 max-w-sm">
                    <input
                      type="text"
                      value={customSizeInput}
                      onChange={(e) => setCustomSizeInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddCustomSize(e)}
                      placeholder="Add custom size (e.g. 41.5, 32W x 34L)..."
                      className="flex-1 px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs text-neutral-800 focus:bg-white focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomSize}
                      className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold rounded-lg text-xs cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Size
                    </button>
                  </div>
                </div>

                {/* Color Chips */}
                <div>
                  <span className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-2">
                    Available Colors
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {allColors.map((col) => {
                      const isSelected = selectedColors.includes(col.name);
                      return (
                        <button
                          key={col.name}
                          type="button"
                          onClick={() =>
                            setSelectedColors((prev) =>
                              isSelected
                                ? prev.filter((c) => c !== col.name)
                                : [...prev, col.name]
                            )
                          }
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-2 transition-all cursor-pointer ${
                            isSelected
                              ? "bg-neutral-900 text-white border-neutral-900 shadow-xs"
                              : "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400"
                          }`}
                        >
                          <span
                            className="w-3 h-3 rounded-full border border-black/10"
                            style={{ backgroundColor: col.hex }}
                          />
                          <span>{col.name}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Add Custom Color */}
                  <div className="flex items-center gap-2 mt-3 max-w-sm">
                    <input
                      type="text"
                      value={customColorInput}
                      onChange={(e) => setCustomColorInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddCustomColor(e)}
                      placeholder="Add custom color (e.g. Forest Green, Ivory)..."
                      className="flex-1 px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs text-neutral-800 focus:bg-white focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomColor}
                      className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold rounded-lg text-xs cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Color
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Right Column (4 cols): Live Storefront Card Preview & Settings ─ */}
        <div className="lg:col-span-4 space-y-6">
          {/* Live Lookbook Card Preview Widget */}
          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs space-y-3 sticky top-6">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-neutral-600" />
                Live Card Preview
              </h3>
              <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-mono">
                Storefront appearance
              </span>
            </div>

            {/* The Actual Lookbook Storefront Card Clone */}
            <div className="border border-neutral-150 rounded-xl overflow-hidden bg-white shadow-xs group">
              <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden">
                {images[0] ? (
                  <img
                    src={images[0]}
                    alt={name || "Product preview"}
                    className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-neutral-300 p-4 text-center">
                    <ImageIcon className="w-10 h-10 mb-2 stroke-1" />
                    <span className="text-xs text-neutral-400">
                      Upload photo to view preview
                    </span>
                  </div>
                )}

                {/* Top Badges */}
                <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10">
                  {calculatedDiscountBadge && (
                    <span className="bg-white text-neutral-900 text-[10px] font-bold px-2 py-0.5 shadow-xs">
                      {calculatedDiscountBadge}
                    </span>
                  )}
                  <span className="bg-black/75 backdrop-blur-xs text-white text-[9px] font-semibold px-2 py-0.5 rounded-xs">
                    {activeConfig.badgeLabel}
                  </span>
                </div>

                {/* Quick View mock overlay */}
                <div className="absolute bottom-2 left-2 right-2 bg-white/95 backdrop-blur-xs text-neutral-900 text-[11px] font-semibold py-1.5 rounded-sm shadow-xs text-center opacity-0 group-hover:opacity-100 transition-opacity">
                  Quick View
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-3.5 space-y-1 bg-white">
                <div className="text-xs font-medium text-neutral-900 line-clamp-1">
                  {name || activeConfig.titlePlaceholder}
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 pt-0.5">
                  <span className="text-xs font-bold text-neutral-950">
                    ৳{sellingPrice ? Number(sellingPrice).toLocaleString("en-BD") : "2,450"}
                  </span>
                  {regularPrice && (
                    <span className="text-[11px] text-neutral-400 line-through">
                      ৳{Number(regularPrice).toLocaleString("en-BD")}
                    </span>
                  )}
                </div>

                {/* Selected Sizes preview */}
                {hasVariants && selectedSizes.length > 0 && (
                  <div className="flex items-center gap-1 flex-wrap pt-1">
                    <span className="text-[10px] text-neutral-400">Sizes:</span>
                    {selectedSizes.slice(0, 5).map((s) => (
                      <span
                        key={s}
                        className="text-[9px] font-semibold px-1.5 py-0.2 bg-neutral-100 rounded text-neutral-700"
                      >
                        {s}
                      </span>
                    ))}
                    {selectedSizes.length > 5 && (
                      <span className="text-[9px] text-neutral-400">
                        +{selectedSizes.length - 5}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-1 text-[11px] text-amber-500 pt-0.5">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-2.5 h-2.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-neutral-500 text-[10px] ml-1">
                    5.0 (New)
                  </span>
                </div>
              </div>
            </div>

            {/* Department & Organization */}
            <div className="pt-2 space-y-4">
              <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                Department & Organization
              </h3>

              {/* Department (Tab on Homepage Carousel) */}
              <div>
                <label className="block text-xs font-semibold text-neutral-800 mb-1">
                  Lookbook Department (Tab) <span className="text-rose-500">*</span>
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50/60 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-900 focus:bg-white focus:outline-none"
                >
                  <option value="Women">Women (Rethink Wardrobe Women)</option>
                  <option value="Men">Men (Rethink Wardrobe Men)</option>
                  <option value="Unisex">Unisex / General</option>
                </select>
              </div>

              {/* Sub-Category Dropdown grouped nicely */}
              <div>
                <label className="block text-xs font-semibold text-neutral-800 mb-1">
                  Sub-Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50/60 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-900 focus:bg-white focus:outline-none"
                >
                  <optgroup label="👗 Clothing & Apparel">
                    <option value="dresses">Dresses (পোশাক / ড্রেস)</option>
                    <option value="t-shirts">T-shirts & Tops (টি-শার্ট ও টপস)</option>
                    <option value="shirts">Shirts & Blouses (শার্ট)</option>
                    <option value="outerwear">Jackets & Blazers (ব্লেজার ও জ্যাকেট)</option>
                    <option value="knitwear">Knitwear & Sweaters (সোয়েটার)</option>
                  </optgroup>
                  <optgroup label="👖 Pants & Bottoms">
                    <option value="trousers">Formal Trousers (ফরমাল ট্রাউজার)</option>
                    <option value="jeans">Denim Jeans (জিন্স)</option>
                    <option value="chinos">Chinos & Casual Pants (চিনোস)</option>
                    <option value="shorts">Shorts (শর্টস)</option>
                    <option value="skirts">Skirts (স্কার্ট)</option>
                  </optgroup>
                  <optgroup label="👞 Shoes & Footwear">
                    <option value="shoes-loafers">Loafers & Slip-ons (লোফার)</option>
                    <option value="shoes-boots">Leather Boots (বুটস)</option>
                    <option value="shoes-sneakers">Sneakers & Runners (স্নিকার্স)</option>
                    <option value="shoes-heels">Heels & Pumps (হিলস)</option>
                    <option value="shoes-sandals">Slides & Sandals (স্যান্ডেল)</option>
                  </optgroup>
                  <optgroup label="👜 Bags & Leather">
                    <option value="bags-totes">Totes & Shoppers (টোট ব্যাগ)</option>
                    <option value="bags-crossbody">Crossbody & Shoulder (ক্রসবডি ব্যাগ)</option>
                    <option value="bags-wallets">Wallets & Cardholders (ওয়ালেট)</option>
                    <option value="bags-backpacks">Backpacks (ব্যাকপ্যাক)</option>
                  </optgroup>
                  <optgroup label="✨ Accessories & Other">
                    <option value="accessories-belts">Leather Belts (বেল্ট)</option>
                    <option value="accessories-eyewear">Sunglasses & Eyewear (সানগ্লাস)</option>
                    <option value="accessories-scarves">Scarves & Silk (স্কার্ফ)</option>
                    <option value="accessories-jewelry">Jewelry & Watches (জুয়েলারি ও ওয়াচ)</option>
                  </optgroup>
                </select>
              </div>

              {/* Custom Badge override */}
              <div>
                <label className="block text-xs font-semibold text-neutral-800 mb-1">
                  Custom Badge Override
                </label>
                <input
                  type="text"
                  value={customBadge}
                  onChange={(e) => setCustomBadge(e.target.value)}
                  placeholder="e.g. 19% or NEW ARRIVAL"
                  className="w-full px-3 py-2 bg-neutral-50/60 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:bg-white focus:outline-none"
                />
              </div>

              <hr className="border-neutral-100" />

              {/* Active Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-neutral-800">
                    Publish to Storefront
                  </p>
                  <p className="text-[11px] text-neutral-400">
                    Live on homepage carousel
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-neutral-900 cursor-pointer"
                />
              </div>

              {/* Featured Showcase */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-neutral-800">
                    Featured Showcase
                  </p>
                  <p className="text-[11px] text-neutral-400">
                    Pin to top of lookbook
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-neutral-900 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductCreatePage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-xs text-neutral-500">
          Loading product editor...
        </div>
      }
    >
      <ProductCreateContent />
    </Suspense>
  );
}
