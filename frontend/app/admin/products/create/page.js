"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useStore } from "@/lib/store-context";
import { createAdminProduct } from "@/lib/api/admin";
import { mockProducts, mockCategories, mockBrands } from "@/lib/api/mock/data";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
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
  HelpCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { uploadImage } from "@/lib/upload";

const COLOR_PRESETS = [
  { name: "Black", hex: "#0f172a" },
  { name: "White", hex: "#ffffff", border: true },
  { name: "Brown", hex: "#78350f" },
  { name: "Tan", hex: "#d97706" },
  { name: "Navy", hex: "#1e3a8a" },
  { name: "Blue", hex: "#2563eb" },
  { name: "Red", hex: "#dc2626" },
  { name: "Maroon", hex: "#881337" },
  { name: "Green", hex: "#16a34a" },
  { name: "Olive", hex: "#65a30d" },
  { name: "Beige", hex: "#fef3c7" },
  { name: "Grey", hex: "#4b5563" },
  { name: "Pink", hex: "#ec4899" },
  { name: "Gold", hex: "#eab308" },
  { name: "Silver", hex: "#9ca3af" },
];

const SHOE_SIZE_PRESETS = ["38", "39", "40", "41", "42", "43", "44", "45", "46"];
const CLOTHING_SIZE_PRESETS = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];

function ProductCreateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const { categories: storeCategories, brands: storeBrands, products: storeProducts, updateProducts } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const allProducts = Array.isArray(storeProducts) ? storeProducts : mockProducts;
  const categoriesList = mounted && Array.isArray(storeCategories) ? storeCategories : mockCategories;
  const brandsList = mounted && Array.isArray(storeBrands) ? storeBrands : mockBrands;

  // Basic Details
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [description, setDescription] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);

  // Pricing
  const [sellingPrice, setSellingPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [costPrice, setCostPrice] = useState("");

  // Media
  const [images, setImages] = useState([]);
  const [newImageUrl, setNewImageUrl] = useState("");

  // Variant Options Builder (e.g. Size, Color)
  const [options, setOptions] = useState([
    { name: "Size", values: ["40", "41", "42", "43"] },
    { name: "Color", values: ["Black", "Brown"] },
  ]);
  const [newOptionName, setNewOptionName] = useState("");

  // Generated Variants Matrix
  const [variants, setVariants] = useState([]);
  const [bulkStockInput, setBulkStockInput] = useState("10");
  const [bulkPriceInput, setBulkPriceInput] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState("");

  function handleApplyBulkStock() {
    const qty = Number(bulkStockInput);
    if (isNaN(qty) || qty < 0) return;
    setVariants((prev) =>
      prev.map((v) => ({
        ...v,
        stock_quantity: qty,
        in_stock: qty > 0,
      }))
    );
  }

  function handleApplyBulkPrice() {
    const price = Number(bulkPriceInput || discountPrice || sellingPrice);
    if (isNaN(price) || price < 0) return;
    setVariants((prev) =>
      prev.map((v) => ({
        ...v,
        selling_price: price,
      }))
    );
  }

  // Price change handlers with auto variant sync
  function handleSellingPriceChange(val) {
    setSellingPrice(val);
    const effective = discountPrice ? Number(discountPrice) : (Number(val) || 0);
    if (effective > 0) {
      setVariants((prev) =>
        prev.map((v) => ({
          ...v,
          selling_price: effective,
          discount_price: discountPrice ? Number(discountPrice) : null,
        }))
      );
    }
  }

  function handleDiscountPriceChange(val) {
    setDiscountPrice(val);
    const effective = val ? Number(val) : (Number(sellingPrice) || 0);
    if (effective > 0) {
      setVariants((prev) =>
        prev.map((v) => ({
          ...v,
          selling_price: effective,
          discount_price: val ? Number(val) : null,
        }))
      );
    }
  }

  // Auto-slug generator
  function handleNameChange(val) {
    setName(val);
    if (!editId) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "")
      );
    }
  }

  // Load existing data if edit mode
  useEffect(() => {
    if (editId) {
      let currentProductsList = allProducts;
      if (typeof window !== "undefined") {
        try {
          const saved = localStorage.getItem("store_custom_products");
          if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              currentProductsList = parsed;
            }
          }
        } catch {}
      }

      const found = currentProductsList.find((p) => String(p.id) === String(editId));
      if (found) {
        setName(found.name || "");
        setSlug(found.slug || "");

        // Category resolution
        const catRef = found.category;
        let catIdentifier = "";
        if (typeof catRef === "object" && catRef !== null) {
          catIdentifier = catRef.slug || (catRef.id ? String(catRef.id) : catRef.name || "");
        } else if (typeof catRef === "string") {
          catIdentifier = catRef;
        }

        // Find primary or sub-category match in categoriesList
        let foundCat = categoriesList.find(
          (c) =>
            c.slug === catIdentifier ||
            String(c.id) === String(catIdentifier) ||
            c.name?.toLowerCase() === catIdentifier.toLowerCase() ||
            String(c.id) === String(found.category_id)
        );

        if (!foundCat && categoriesList.length > 0) {
          for (const mainCat of categoriesList) {
            if (mainCat.children && Array.isArray(mainCat.children)) {
              const subMatch = mainCat.children.find(
                (s) =>
                  s.slug === catIdentifier ||
                  String(s.id) === String(catIdentifier) ||
                  s.name?.toLowerCase() === catIdentifier.toLowerCase()
              );
              if (subMatch) {
                foundCat = mainCat;
                setSelectedSubCategory(subMatch.slug || String(subMatch.id));
                break;
              }
            }
          }
        }

        if (foundCat) {
          setSelectedCategory(foundCat.slug || String(foundCat.id));
        } else if (catIdentifier) {
          setSelectedCategory(catIdentifier);
        }

        // Brand resolution
        const brandRef = found.brand;
        let brandIdentifier = "";
        if (typeof brandRef === "object" && brandRef !== null) {
          brandIdentifier = brandRef.slug || (brandRef.id ? String(brandRef.id) : brandRef.name || "");
        } else if (typeof brandRef === "string") {
          brandIdentifier = brandRef;
        }
        setSelectedBrand(brandIdentifier);

        setDescription(found.description || "");
        setSellingPrice(found.selling_price || "");
        setDiscountPrice(found.discount_price || "");
        setCostPrice(found.cost_price || "");
        setIsFeatured(!!found.is_featured);
        setIsActive(found.in_stock !== false);

        if (found.images && found.images.length > 0) {
          setImages(found.images);
        } else if (found.image) {
          setImages([found.image]);
        }

        if (found.options && found.options.length > 0) {
          setOptions(found.options);
        }
        if (found.variants && found.variants.length > 0) {
          setVariants(found.variants);
        }
      }
    } else {
      // Auto-generate initial matrix for new product
      generateMatrixFromOptions(options, 2500, []);
    }
  }, [editId, mounted, storeProducts, categoriesList]);

  // Generate Cartesian product matrix preserving existing customization
  function generateMatrixFromOptions(opts, basePrice = 0, existingVariants = variants) {
    const validOpts = opts.filter((o) => o.name && o.values.length > 0);
    if (validOpts.length === 0) {
      setVariants([]);
      return;
    }

    function cartesian(arrays) {
      return arrays.reduce(
        (a, b) => a.flatMap((d) => b.map((e) => [d, e].flat())),
        [[]]
      );
    }

    const valueArrays = validOpts.map((o) =>
      o.values.map((v) => ({ optName: o.name, val: v }))
    );
    const combinations = cartesian(valueArrays);

    const defaultEffectivePrice = discountPrice ? Number(discountPrice) : (Number(sellingPrice) || basePrice || 2500);

    const generated = combinations.map((combo, idx) => {
      const attrs = {};
      const skuParts = [];
      combo.forEach((item) => {
        attrs[item.optName] = item.val;
        skuParts.push(item.val.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 3));
      });

      // Check if matching variant exists in current state to keep custom price/stock
      const existingMatch = (existingVariants || []).find((existing) => {
        if (!existing.attributes) return false;
        const keys = Object.keys(attrs);
        return (
          keys.length === Object.keys(existing.attributes).length &&
          keys.every((k) => existing.attributes[k] === attrs[k])
        );
      });

      if (existingMatch) {
        return existingMatch;
      }

      const sku = `PRD-${skuParts.join("-")}-${idx + 101}`;
      return {
        id: Date.now() + idx,
        sku,
        attributes: attrs,
        selling_price: defaultEffectivePrice,
        discount_price: discountPrice ? Number(discountPrice) : null,
        stock_quantity: Number(bulkStockInput) || 10,
        in_stock: true,
      };
    });

    setVariants(generated);
  }

  // Update options and auto-trigger live matrix re-generation
  function updateOptionsAndGenerate(newOptions) {
    setOptions(newOptions);
    generateMatrixFromOptions(newOptions, Number(sellingPrice) || 2500, variants);
  }

  // Quick toggle color preset
  function toggleColorValue(colorName) {
    const updated = options.map((opt) => ({ ...opt, values: [...opt.values] }));
    let colorOptIdx = updated.findIndex((o) => o.name.toLowerCase() === "color");
    if (colorOptIdx === -1) {
      updated.push({ name: "Color", values: [colorName] });
    } else {
      const vals = updated[colorOptIdx].values;
      if (vals.includes(colorName)) {
        updated[colorOptIdx].values = vals.filter((v) => v !== colorName);
      } else {
        updated[colorOptIdx].values = [...vals, colorName];
      }
    }
    updateOptionsAndGenerate(updated);
  }

  // Quick toggle size preset
  function toggleSizeValue(sizeName) {
    const updated = options.map((opt) => ({ ...opt, values: [...opt.values] }));
    let sizeOptIdx = updated.findIndex((o) => o.name.toLowerCase() === "size");
    if (sizeOptIdx === -1) {
      updated.push({ name: "Size", values: [sizeName] });
    } else {
      const vals = updated[sizeOptIdx].values;
      if (vals.includes(sizeName)) {
        updated[sizeOptIdx].values = vals.filter((v) => v !== sizeName);
      } else {
        updated[sizeOptIdx].values = [...vals, sizeName];
      }
    }
    updateOptionsAndGenerate(updated);
  }

  // Handle adding a value to an option
  function handleAddOptionValue(optIdx, val) {
    if (!val.trim()) return;
    const updated = options.map((opt, i) => {
      if (i !== optIdx) return opt;
      if (opt.values.includes(val.trim())) return opt;
      return { ...opt, values: [...opt.values, val.trim()] };
    });
    updateOptionsAndGenerate(updated);
  }

  // Remove a value from an option
  function handleRemoveOptionValue(optIdx, valIdx) {
    const updated = options.map((opt, i) => {
      if (i !== optIdx) return opt;
      const newVals = [...opt.values];
      newVals.splice(valIdx, 1);
      return { ...opt, values: newVals };
    });
    updateOptionsAndGenerate(updated);
  }

  // Add new option group (e.g. "Material")
  function handleAddOptionGroup() {
    if (!newOptionName.trim()) return;
    const updated = [...options, { name: newOptionName.trim(), values: [] }];
    setNewOptionName("");
    updateOptionsAndGenerate(updated);
  }

  // Remove option group
  function handleRemoveOptionGroup(idx) {
    const updated = options.filter((_, i) => i !== idx);
    updateOptionsAndGenerate(updated);
  }

  // Add image
  function handleAddImage(e) {
    e.preventDefault();
    if (!newImageUrl.trim()) return;
    setImages([...images, newImageUrl.trim()]);
    setNewImageUrl("");
  }

  // Handle file upload from local computer via ImageKit
  async function handleFileUpload(files) {
    if (!files || files.length === 0) return;
    const imageFiles = Array.from(files).filter((file) => file.type.startsWith("image/"));
    if (imageFiles.length === 0) {
      alert("শুধুমাত্র ছবি ফাইল আপলোড করুন (JPG, PNG, WebP, SVG)");
      return;
    }

    setUploadingImages(true);
    setUploadProgressText(`ছবি আপলোড হচ্ছে (0/${imageFiles.length})...`);

    try {
      const uploadedUrls = [];
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        setUploadProgressText(`ছবি আপলোড হচ্ছে (${i + 1}/${imageFiles.length})...`);
        const res = await uploadImage(file, "/products");
        if (res?.url) {
          uploadedUrls.push(res.url);
        }
      }
      if (uploadedUrls.length > 0) {
        setImages((prev) => [...prev, ...uploadedUrls]);
        setToastMessage(`${uploadedUrls.length} টি ছবি সফলভাবে ImageKit ক্লাউডে আপলোড হয়েছে!`);
        setTimeout(() => setToastMessage(""), 3000);
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert(`ছবি আপলোড করতে সমস্যা হয়েছে: ${err.message || "Unknown error"}`);
    } finally {
      setUploadingImages(false);
      setUploadProgressText("");
    }
  }

  // Remove image
  function handleRemoveImage(idx) {
    setImages(images.filter((_, i) => i !== idx));
  }

  // Update variant row
  function handleVariantChange(index, field, value) {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  }

  // Form Submit with strict validation and zero data loss
  async function handleSaveProduct(e) {
    if (e) e.preventDefault();
    setErrorMessage("");

    // Validation 1: Name required
    if (!name.trim()) {
      setErrorMessage("প্রোডাক্টের নাম (Product Title) দেওয়া বাধ্যতামূলক!");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Validation 2: Category required
    if (!selectedCategory) {
      setErrorMessage("প্রাইমারি ক্যাটাগরি (Primary Category) সিলেক্ট করা বাধ্যতামূলক!");
      const catEl = document.getElementById("category-select");
      if (catEl) {
        catEl.scrollIntoView({ behavior: "smooth", block: "center" });
        catEl.focus();
      }
      return;
    }

    // Validation 3: Base price required
    if (!sellingPrice || Number(sellingPrice) <= 0) {
      setErrorMessage("প্রোডাক্টের দাম (Regular / Base Price) দেওয়া বাধ্যতামূলক!");
      const priceEl = document.getElementById("selling-price-input");
      if (priceEl) {
        priceEl.scrollIntoView({ behavior: "smooth", block: "center" });
        priceEl.focus();
      }
      return;
    }

    setIsSubmitting(true);

    const catObj = categoriesList.find((c) => c.slug === selectedCategory || String(c.id) === String(selectedCategory)) || {
      name: selectedCategory || "General",
      slug: selectedCategory || "general",
    };

    const subCatObj = selectedSubCategory
      ? (catObj.children || []).find((s) => s.slug === selectedSubCategory || String(s.id) === String(selectedSubCategory))
      : null;

    const finalCategoryObj = subCatObj || catObj;

    const brandObj = brandsList.find((b) => b.slug === selectedBrand || String(b.id) === String(selectedBrand)) || (selectedBrand ? { name: selectedBrand, slug: selectedBrand } : null);

    const productPayload = {
      id: editId ? Number(editId) : Date.now(),
      name: name.trim(),
      slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: description.trim(),
      selling_price: Number(sellingPrice) || 0,
      discount_price: discountPrice ? Number(discountPrice) : null,
      cost_price: costPrice ? Number(costPrice) : null,
      image: images[0] || "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80",
      images: images,
      category: finalCategoryObj,
      brand: brandObj,
      in_stock: isActive,
      is_featured: isFeatured,
      options: options,
      variants: variants.length > 0 ? variants : [
        {
          id: Date.now(),
          sku: `SKU-${Date.now()}`,
          selling_price: Number(sellingPrice) || 0,
          stock_quantity: 10,
          in_stock: isActive,
        },
      ],
    };

    // Safely retrieve current saved products from localStorage or context to prevent overwriting
    let currentSavedProducts = [];
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("store_custom_products");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            currentSavedProducts = parsed;
          }
        }
      } catch {}
    }

    const baselineProducts = currentSavedProducts.length > 0
      ? currentSavedProducts
      : (Array.isArray(storeProducts) && storeProducts.length > 0 ? storeProducts : (Array.isArray(allProducts) ? allProducts : []));

    let updatedProducts;
    if (editId) {
      updatedProducts = baselineProducts.map((p) =>
        String(p.id) === String(editId) ? productPayload : p
      );
    } else {
      const filtered = baselineProducts.filter((p) => String(p.id) !== String(productPayload.id));
      updatedProducts = [productPayload, ...filtered];
    }

    if (typeof window !== "undefined") {
      try {
        // Strip base64 data URIs before saving — they can exceed localStorage quota (5MB limit).
        // Only keep http/https URL strings. The in-memory storeProducts will keep the full version.
        const productsForStorage = updatedProducts.map((p) => ({
          ...p,
          image: p.image?.startsWith("data:") ? "" : (p.image || ""),
          images: Array.isArray(p.images)
            ? p.images.filter((img) => img && !img.startsWith("data:"))
            : [],
        }));
        localStorage.setItem("store_custom_products", JSON.stringify(productsForStorage));
      } catch (storageErr) {
        console.warn("localStorage save failed:", storageErr);
        // Try saving without images at all as last resort
        try {
          const minimalProducts = updatedProducts.map((p) => ({
            ...p,
            image: p.image?.startsWith("data:") ? "" : (p.image || ""),
            images: [],
          }));
          localStorage.setItem("store_custom_products", JSON.stringify(minimalProducts));
        } catch {}
      }
    }

    if (typeof updateProducts === "function") {
      updateProducts(updatedProducts);
    }

    // Send to Laravel API in background (non-blocking)
    createAdminProduct({
      name: name.trim(),
      category_id: (subCatObj && typeof subCatObj.id === "number") ? subCatObj.id : (catObj && typeof catObj.id === "number" ? catObj.id : 1),
      brand_id: (brandObj && typeof brandObj.id === "number") ? brandObj.id : null,
      regular_price: Number(sellingPrice) || 0,
      selling_price: discountPrice ? Number(discountPrice) : (Number(sellingPrice) || 0),
      discount_price: discountPrice ? Number(discountPrice) : null,
      stock: variants.length > 0 ? variants.reduce((sum, v) => sum + (v.stock_quantity || 0), 0) : 10,
      description: description.trim(),
      thumbnail: images[0] || null,
      is_featured: isFeatured,
      is_active: isActive,
      images: images,
    }).catch(() => {});

    setToastMessage("Product saved successfully!");

    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/admin/products");
    }, 600);
  }

  // Extract selected colors & sizes for quick reference
  const selectedColors = options.find((o) => o.name.toLowerCase() === "color")?.values || [];
  const selectedSizes = options.find((o) => o.name.toLowerCase() === "size")?.values || [];

  return (
    <div className="space-y-6 pb-16">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-slate-700 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <p className="text-sm font-medium">{toastMessage}</p>
        </div>
      )}

      {/* Error Alert Banner */}
      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-semibold animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <p className="flex-1">{errorMessage}</p>
          <button
            type="button"
            onClick={() => setErrorMessage("")}
            className="text-rose-500 hover:text-rose-700 font-bold text-lg leading-none"
          >
            ×
          </button>
        </div>
      )}

      {/* Back and Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {editId ? "Edit Product" : "Add New Product"}
            </h1>
            <p className="text-sm text-slate-500">
              {editId
                ? `Update details and inventory for SKU #${editId}`
                : "Create a new product with live auto-generated Color × Size variant combinations."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/products">
            <Button variant="outline" size="sm">
              Cancel
            </Button>
          </Link>
          <Button
            size="sm"
            onClick={handleSaveProduct}
            disabled={isSubmitting}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {isSubmitting ? "Saving..." : editId ? "Save Changes" : "Publish Product"}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSaveProduct} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Main details, media, variants */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section 1: Basic Information */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Package className="w-4 h-4 text-indigo-600" />
              General Information
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Product Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Italian Leather Tassel Loafer"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                URL Slug
              </label>
              <div className="flex rounded-lg border border-slate-200 bg-slate-50 overflow-hidden text-sm">
                <span className="px-3 py-2 text-slate-400 bg-slate-100 border-r border-slate-200 select-none">
                  /product/
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3 py-2 bg-transparent focus:outline-none"
                  placeholder="italian-leather-tassel-loafer"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Product Description
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide detailed description, materials, care instructions, and styling notes..."
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
          </div>

          {/* Section 2: Media Gallery */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-indigo-600" />
              Product Media Gallery
            </h2>

            {/* File Upload Box */}
            <div
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                uploadingImages
                  ? "border-indigo-400 bg-indigo-50/50 cursor-wait"
                  : "border-slate-200 hover:border-indigo-500 bg-slate-50/50 hover:bg-slate-50 cursor-pointer group"
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
                id="product-file-upload"
              />
              <label
                htmlFor={uploadingImages ? undefined : "product-file-upload"}
                className={`${uploadingImages ? "cursor-wait" : "cursor-pointer"} block space-y-2`}
              >
                {uploadingImages ? (
                  <div className="py-2 space-y-2">
                    <Loader2 className="w-8 h-8 text-indigo-600 mx-auto animate-spin" />
                    <p className="text-xs font-bold text-indigo-700 animate-pulse">
                      {uploadProgressText || "ImageKit ক্লাউডে আপলোড হচ্ছে..."}
                    </p>
                    <p className="text-[11px] text-slate-500">অনুগ্রহ করে একটু অপেক্ষা করুন</p>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="w-8 h-8 text-indigo-500 mx-auto group-hover:scale-110 transition-transform" />
                    <p className="text-xs font-bold text-slate-800">
                      কম্পিউটার থেকে ছবি সিলেক্ট করুন (Click to Upload or Drag & Drop)
                    </p>
                    <p className="text-[11px] text-slate-400">
                      JPG, PNG, WebP, SVG সাপোর্টেড • সরাসরি ক্লাউডে সেভ হবে এবং কোনোদিন হারাবে না
                    </p>
                  </>
                )}
              </label>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative group aspect-square rounded-lg border border-slate-200 overflow-hidden bg-slate-50"
                  >
                    <img
                      src={img}
                      alt={`Preview ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {idx === 0 && (
                      <span className="absolute top-2 left-2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                        Main Cover
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-2 right-2 p-1 bg-rose-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Image URL Input fallback */}
            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <input
                type="url"
                placeholder="অথবা ইমেজের লিঙ্ক পেস্ট করুন (Paste image URL)..."
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddImage}
                className="gap-1.5"
              >
                <Plus className="w-4 h-4" />
                URL থেকে ছবি যোগ করুন
              </Button>
            </div>
          </div>

          {/* Section 3: Pricing */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-indigo-600" />
              Default Pricing (BDT)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Regular / Base Price (৳) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="2500"
                  value={sellingPrice}
                  onChange={(e) => handleSellingPriceChange(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Sale / Discount Price (৳)
                </label>
                <input
                  type="number"
                  placeholder="1999 (Optional)"
                  value={discountPrice}
                  onChange={(e) => handleDiscountPriceChange(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-semibold text-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Cost per Item (৳)
                </label>
                <input
                  type="number"
                  placeholder="1200 (Internal)"
                  value={costPrice}
                  onChange={(e) => setCostPrice(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-500"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Live Size x Color Variant Generator Matrix */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-600" />
                  Color & Size Variant Generator
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  কালার এবং সাইজ পছন্দ করলেই স্বয়ংক্রিয়ভাবে (Live) ভ্যারিয়েন্ট কম্বিনেশন তৈরি হবে।
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => generateMatrixFromOptions(options, Number(sellingPrice), [])}
                  className="text-xs gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  Reset Matrix
                </Button>
              </div>
            </div>

            {/* Quick Color Selection Box */}
            <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                    🎨 Color Selection (কালারসমূহ)
                  </span>
                  <Badge variant="indigo" className="text-[10px] px-2 py-0.5 font-semibold">
                    {selectedColors.length} Selected
                  </Badge>
                </div>
                {selectedColors.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      const updated = options.map((opt) =>
                        opt.name.toLowerCase() === "color" ? { ...opt, values: [] } : opt
                      );
                      updateOptionsAndGenerate(updated);
                    }}
                    className="text-[11px] text-rose-600 hover:underline font-medium"
                  >
                    Clear Colors
                  </button>
                )}
              </div>

              {/* Color Swatch Presets */}
              <div className="flex flex-wrap gap-2 items-center">
                {COLOR_PRESETS.map((col) => {
                  const isSelected = selectedColors.includes(col.name);
                  return (
                    <button
                      key={col.name}
                      type="button"
                      onClick={() => toggleColorValue(col.name)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        isSelected
                          ? "bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-600 ring-offset-1"
                          : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <span
                        className={`w-3.5 h-3.5 rounded-full inline-block shadow-inner ${
                          col.border ? "border border-slate-400" : ""
                        }`}
                        style={{ backgroundColor: col.hex }}
                      />
                      <span>{col.name}</span>
                      {isSelected && <span className="text-[10px] font-bold">✓</span>}
                    </button>
                  );
                })}
              </div>

              {/* Custom Color Input */}
              <div className="pt-2 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="+ Add Custom Color (e.g. Chocolate Brown, Rose Gold) & Enter..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (e.target.value.trim()) {
                        toggleColorValue(e.target.value.trim());
                        e.target.value = "";
                      }
                    }
                  }}
                  className="flex-1 px-3 py-1.5 bg-white border border-dashed border-slate-300 rounded-lg text-xs focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            {/* Quick Size Selection Box */}
            <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                    📏 Size Selection (সাইজসমূহ)
                  </span>
                  <Badge variant="indigo" className="text-[10px] px-2 py-0.5 font-semibold">
                    {selectedSizes.length} Selected
                  </Badge>
                </div>
                {selectedSizes.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      const updated = options.map((opt) =>
                        opt.name.toLowerCase() === "size" ? { ...opt, values: [] } : opt
                      );
                      updateOptionsAndGenerate(updated);
                    }}
                    className="text-[11px] text-rose-600 hover:underline font-medium"
                  >
                    Clear Sizes
                  </button>
                )}
              </div>

              {/* Shoe Sizes */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Shoe Sizes (EU Standards):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {SHOE_SIZE_PRESETS.map((sz) => {
                    const isSelected = selectedSizes.includes(sz);
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => toggleSizeValue(sz)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          isSelected
                            ? "bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-600 ring-offset-1"
                            : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Apparel Sizes */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Clothing / Apparel Sizes:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {CLOTHING_SIZE_PRESETS.map((sz) => {
                    const isSelected = selectedSizes.includes(sz);
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => toggleSizeValue(sz)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          isSelected
                            ? "bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-600 ring-offset-1"
                            : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Size Input */}
              <div className="pt-2 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="+ Add Custom Size (e.g. Free Size, 34W x 32L) & Enter..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (e.target.value.trim()) {
                        toggleSizeValue(e.target.value.trim());
                        e.target.value = "";
                      }
                    }
                  }}
                  className="flex-1 px-3 py-1.5 bg-white border border-dashed border-slate-300 rounded-lg text-xs focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            {/* Custom Option Groups Editor (Other than Color / Size) */}
            <div className="space-y-3">
              {options
                .filter(
                  (o) =>
                    o.name.toLowerCase() !== "color" && o.name.toLowerCase() !== "size"
                )
                .map((opt, optIdx) => {
                  const actualIndex = options.findIndex((o) => o === opt);
                  return (
                    <div
                      key={optIdx}
                      className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-slate-800">
                          Option: {opt.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveOptionGroup(actualIndex)}
                          className="text-xs text-rose-600 hover:underline flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove Group
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2 items-center">
                        {opt.values.map((v, valIdx) => (
                          <span
                            key={valIdx}
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-700 shadow-sm"
                          >
                            {v}
                            <button
                              type="button"
                              onClick={() => handleRemoveOptionValue(actualIndex, valIdx)}
                              className="text-slate-400 hover:text-rose-500"
                            >
                              ×
                            </button>
                          </span>
                        ))}

                        <input
                          type="text"
                          placeholder={`+ Add ${opt.name} value & Enter`}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddOptionValue(actualIndex, e.target.value);
                              e.target.value = "";
                            }
                          }}
                          className="px-3 py-1 bg-white border border-dashed border-slate-300 rounded-full text-xs focus:outline-none focus:border-indigo-600"
                        />
                      </div>
                    </div>
                  );
                })}

              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  placeholder="New custom option name (e.g. Material, Sole Type)..."
                  value={newOptionName}
                  onChange={(e) => setNewOptionName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddOptionGroup();
                    }
                  }}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddOptionGroup}
                  className="text-xs"
                >
                  + Add Custom Option Group
                </Button>
              </div>
            </div>

            {/* Generated Variants Live Table */}
            {variants.length > 0 ? (
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-indigo-50/80 p-4 rounded-xl border border-indigo-100">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-slate-900">
                        Generated Combinations ({variants.length} Variants)
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Total Stock: {variants.reduce((sum, v) => sum + (Number(v.stock_quantity) || 0), 0)} Units
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {selectedColors.length > 0 ? `${selectedColors.length} Colors` : "0 Colors"}{" "}
                      × {selectedSizes.length > 0 ? `${selectedSizes.length} Sizes` : "0 Sizes"}{" "}
                      = {variants.length} combinations automatically synced.
                    </p>
                  </div>

                  {/* Bulk Controls */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <label className="text-xs font-semibold text-slate-700 whitespace-nowrap">
                        Bulk Price (৳):
                      </label>
                      <input
                        type="number"
                        min="0"
                        placeholder={sellingPrice || "2500"}
                        value={bulkPriceInput}
                        onChange={(e) => setBulkPriceInput(e.target.value)}
                        className="w-20 px-2 py-1 bg-white border border-slate-300 rounded text-xs font-semibold focus:outline-none focus:border-indigo-600"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={handleApplyBulkPrice}
                        className="text-xs py-1 px-2.5 bg-white"
                      >
                        Apply Price
                      </Button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <label className="text-xs font-semibold text-slate-700 whitespace-nowrap">
                        Bulk Stock:
                      </label>
                      <input
                        type="number"
                        min="0"
                        placeholder="10"
                        value={bulkStockInput}
                        onChange={(e) => setBulkStockInput(e.target.value)}
                        className="w-16 px-2 py-1 bg-white border border-slate-300 rounded text-xs font-semibold focus:outline-none focus:border-indigo-600"
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleApplyBulkStock}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs py-1 px-2.5 font-bold"
                      >
                        Apply Stock
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-2xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="py-3 px-4">Variant Attributes</th>
                        <th className="py-3 px-4">SKU Code</th>
                        <th className="py-3 px-4 w-32">Price (৳)</th>
                        <th className="py-3 px-4 w-28">Stock Units</th>
                        <th className="py-3 px-4 text-center w-24">In Stock</th>
                        <th className="py-3 px-4 text-right w-20">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {variants.map((v, idx) => {
                        const attrs = v.attributes || {};
                        const colorVal = attrs.Color || attrs.color;
                        const sizeVal = attrs.Size || attrs.size;
                        const matchedPreset = COLOR_PRESETS.find(
                          (c) => c.name.toLowerCase() === (colorVal || "").toLowerCase()
                        );

                        return (
                          <tr key={idx} className="hover:bg-indigo-50/30 transition-colors">
                            <td className="py-2.5 px-4 font-semibold text-slate-900">
                              <div className="flex items-center gap-2">
                                {matchedPreset && (
                                  <span
                                    className={`w-3.5 h-3.5 rounded-full inline-block shadow-inner ${
                                      matchedPreset.border ? "border border-slate-400" : ""
                                    }`}
                                    style={{ backgroundColor: matchedPreset.hex }}
                                  />
                                )}
                                <span>
                                  {Object.entries(attrs)
                                    .map(([key, val]) => `${key}: ${val}`)
                                    .join(" / ")}
                                </span>
                              </div>
                            </td>
                            <td className="py-2.5 px-4">
                              <input
                                type="text"
                                value={v.sku}
                                onChange={(e) =>
                                  handleVariantChange(idx, "sku", e.target.value)
                                }
                                className="w-full px-2 py-1 border border-slate-200 rounded font-mono text-[11px] focus:outline-none focus:border-indigo-600"
                              />
                            </td>
                            <td className="py-2.5 px-4">
                              <input
                                type="number"
                                value={v.selling_price}
                                onChange={(e) =>
                                  handleVariantChange(
                                    idx,
                                    "selling_price",
                                    Number(e.target.value)
                                  )
                                }
                                className="w-full px-2 py-1 border border-slate-200 rounded font-bold text-slate-900 focus:outline-none focus:border-indigo-600"
                              />
                            </td>
                            <td className="py-2.5 px-4">
                              <input
                                type="number"
                                value={v.stock_quantity}
                                onChange={(e) =>
                                  handleVariantChange(
                                    idx,
                                    "stock_quantity",
                                    Number(e.target.value)
                                  )
                                }
                                className="w-full px-2 py-1 border border-slate-200 rounded font-bold text-slate-800 focus:outline-none focus:border-indigo-600"
                              />
                            </td>
                            <td className="py-2.5 px-4 text-center">
                              <input
                                type="checkbox"
                                checked={v.in_stock}
                                onChange={(e) =>
                                  handleVariantChange(idx, "in_stock", e.target.checked)
                                }
                                className="w-4 h-4 text-indigo-600 rounded border-slate-300 cursor-pointer"
                              />
                            </td>
                            <td className="py-2.5 px-4 text-right">
                              <button
                                type="button"
                                onClick={() =>
                                  setVariants(variants.filter((_, i) => i !== idx))
                                }
                                className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                                title="Remove combination"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 text-slate-500 text-xs">
                কোন কালার অথবা সাইজ সিলেক্ট করা নেই। ওপরে কালার ও সাইজ চুজ করুন ভ্যারিয়েন্ট কম্বিনেশন দেখতে।
              </div>
            )}
          </div>
        </div>

        {/* Right Column (4 cols): Category, Brand, Status, Flags */}
        <div className="lg:col-span-4 space-y-6">
          {/* Status & Visibility */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-semibold text-slate-900">Publishing Status</h2>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="text-sm font-semibold text-slate-800">Product Active</p>
                <p className="text-xs text-slate-500">Visible on storefront catalog</p>
              </div>
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded border-slate-300"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="text-sm font-semibold text-slate-800">Featured Showcase</p>
                <p className="text-xs text-slate-500">Show on homepage curated list</p>
              </div>
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded border-slate-300"
              />
            </div>
          </div>

          {/* Category Assignment */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-semibold text-slate-900">Organization</h2>

            {/* Primary Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>
                  Primary Category <span className="text-rose-500">*</span>
                </span>
                {!selectedCategory && (
                  <span className="text-[10px] text-rose-500 font-bold lowercase">Required / বাধ্যতামূলক</span>
                )}
              </label>
              <select
                id="category-select"
                required
                suppressHydrationWarning
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedSubCategory("");
                  if (errorMessage) setErrorMessage("");
                }}
                className={`w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium transition-colors ${
                  !selectedCategory && errorMessage
                    ? "border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/20"
                    : "border-slate-200 focus:border-indigo-600"
                }`}
              >
                <option value="">Select Primary Category (বাধ্যতামূলক)...</option>
                {categoriesList.map((c) => (
                  <option key={c.id} value={c.slug || c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sub-Category Option */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Sub-Category (Optional)
              </label>
              <select
                suppressHydrationWarning
                value={selectedSubCategory}
                onChange={(e) => setSelectedSubCategory(e.target.value)}
                disabled={!selectedCategory}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium disabled:bg-slate-100 disabled:text-slate-400"
              >
                <option value="">
                  {selectedCategory ? "Select Sub-Category (Optional)..." : "প্রথমে Primary Category সিলেক্ট করুন"}
                </option>
                {(
                  categoriesList.find(
                    (c) => c.slug === selectedCategory || String(c.id) === String(selectedCategory)
                  )?.children || []
                ).map((sub) => (
                  <option key={sub.id} value={sub.slug || sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Brand */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Brand
              </label>
              <select
                suppressHydrationWarning
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium"
              >
                <option value="">Select Brand (Optional)...</option>
                {brandsList.map((b) => (
                  <option key={b.id} value={b.slug || b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Help Box */}
          <div className="bg-indigo-50/70 p-5 rounded-xl border border-indigo-100 space-y-2">
            <h3 className="text-xs font-bold text-indigo-950 flex items-center gap-1.5 uppercase tracking-wider">
              <Info className="w-4 h-4 text-indigo-600" />
              Shoes & Bags Pro-Tip
            </h3>
            <p className="text-xs text-indigo-900 leading-relaxed">
              When adding shoes, enter standard EU shoe sizes (e.g. 39, 40, 41, 42, 43, 44)
              and colors. Matrix combinations automatically sync SKUs and stock.
            </p>
          </div>
        </div>

        {/* Bottom Save Action Bar */}
        <div className="lg:col-span-12 bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">
                {editId ? "Ready to update product?" : "Ready to publish product?"}
              </p>
              <p className="text-xs text-slate-500">
                {variants.length} Variants ({variants.reduce((s, v) => s + (Number(v.stock_quantity) || 0), 0)} Stock Units) will be saved to inventory.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <Link href="/admin/products">
              <Button type="button" variant="outline" size="sm">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              size="sm"
              onClick={handleSaveProduct}
              disabled={isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2 shadow-sm"
            >
              {isSubmitting ? "Saving Product..." : editId ? "Save Changes" : "Publish Product"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function AdminProductCreatePage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
          <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm">Loading product editor...</p>
        </div>
      }
    >
      <ProductCreateContent />
    </Suspense>
  );
}
