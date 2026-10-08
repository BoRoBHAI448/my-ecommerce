"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
} from "lucide-react";

function ProductCreateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  // Basic Details
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [description, setDescription] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);

  // Pricing
  const [sellingPrice, setSellingPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [costPrice, setCostPrice] = useState("");

  // Media
  const [images, setImages] = useState([
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80",
  ]);
  const [newImageUrl, setNewImageUrl] = useState("");

  // Variant Options Builder (e.g. Size, Color)
  const [options, setOptions] = useState([
    { name: "Size", values: ["40", "41", "42", "43"] },
    { name: "Color", values: ["Black", "Brown"] },
  ]);
  const [newOptionName, setNewOptionName] = useState("");

  // Generated Variants Matrix
  const [variants, setVariants] = useState([]);
  const [toastMessage, setToastMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const found = mockProducts.find((p) => p.id === Number(editId));
      if (found) {
        setName(found.name);
        setSlug(found.slug);
        setSelectedCategory(found.category?.slug || "");
        setSelectedBrand(found.brand?.slug || "");
        setDescription(found.description || "");
        setSellingPrice(found.selling_price || "");
        setDiscountPrice(found.discount_price || "");
        setIsFeatured(!!found.is_featured);
        setIsActive(!!found.in_stock);
        if (found.images && found.images.length > 0) {
          setImages(found.images);
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
      generateMatrixFromOptions(options, 2500);
    }
  }, [editId]);

  // Generate Cartesian product matrix
  function generateMatrixFromOptions(opts, basePrice = 0) {
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

    const generated = combinations.map((combo, idx) => {
      const attrs = {};
      const skuParts = [];
      combo.forEach((item) => {
        attrs[item.optName] = item.val;
        skuParts.push(item.val.toUpperCase().slice(0, 3));
      });

      const sku = `PRD-${skuParts.join("-")}-${idx + 101}`;
      return {
        id: Date.now() + idx,
        sku,
        attributes: attrs,
        selling_price: Number(sellingPrice) || basePrice || 2500,
        discount_price: discountPrice ? Number(discountPrice) : null,
        stock_quantity: 10,
        in_stock: true,
      };
    });

    setVariants(generated);
  }

  // Handle adding a value to an option (e.g. Size "44")
  function handleAddOptionValue(optIdx, val) {
    if (!val.trim()) return;
    const updated = [...options];
    if (!updated[optIdx].values.includes(val.trim())) {
      updated[optIdx].values.push(val.trim());
      setOptions(updated);
    }
  }

  // Remove a value from an option
  function handleRemoveOptionValue(optIdx, valIdx) {
    const updated = [...options];
    updated[optIdx].values.splice(valIdx, 1);
    setOptions(updated);
  }

  // Add new option group (e.g. "Material")
  function handleAddOptionGroup() {
    if (!newOptionName.trim()) return;
    setOptions([...options, { name: newOptionName.trim(), values: [] }]);
    setNewOptionName("");
  }

  // Remove option group
  function handleRemoveOptionGroup(idx) {
    const updated = [...options];
    updated.splice(idx, 1);
    setOptions(updated);
  }

  // Add image
  function handleAddImage(e) {
    e.preventDefault();
    if (!newImageUrl.trim()) return;
    setImages([...images, newImageUrl.trim()]);
    setNewImageUrl("");
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

  // Form Submit
  function handleSaveProduct(e) {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please enter product name");
      return;
    }

    setIsSubmitting(true);
    setToastMessage("Product saved successfully!");

    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/admin/products");
    }, 1200);
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-slate-700 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <p className="text-sm font-medium">{toastMessage}</p>
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
                : "Create a new single or multi-variant product with full matrix control."}
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

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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

            {/* Add Image URL Input */}
            <div className="flex gap-2 pt-2">
              <input
                type="url"
                placeholder="Paste high-res image URL (Unsplash or CDN)..."
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
                Add Image
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
                  onChange={(e) => setSellingPrice(e.target.value)}
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
                  onChange={(e) => setDiscountPrice(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
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

          {/* Section 4: Size x Color Variant Generator Matrix */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  Variant Attributes (Size × Color)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure size and color options, then regenerate matrix combinations.
                </p>
              </div>

              <Button
                type="button"
                size="sm"
                onClick={() => generateMatrixFromOptions(options, Number(sellingPrice))}
                className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 font-medium"
              >
                <Sparkles className="w-4 h-4" />
                Generate Matrix
              </Button>
            </div>

            {/* Option attributes editor */}
            <div className="space-y-4">
              {options.map((opt, optIdx) => (
                <div
                  key={optIdx}
                  className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-slate-800">
                      Option {optIdx + 1}: {opt.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveOptionGroup(optIdx)}
                      className="text-xs text-rose-600 hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>

                  {/* Pills */}
                  <div className="flex flex-wrap gap-2 items-center">
                    {opt.values.map((v, valIdx) => (
                      <span
                        key={valIdx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-700 shadow-2xl"
                      >
                        {v}
                        <button
                          type="button"
                          onClick={() => handleRemoveOptionValue(optIdx, valIdx)}
                          className="text-slate-400 hover:text-rose-500"
                        >
                          ×
                        </button>
                      </span>
                    ))}

                    {/* Quick Add Tag Input */}
                    <input
                      type="text"
                      placeholder={`+ Add ${opt.name} and press Enter`}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddOptionValue(optIdx, e.target.value);
                          e.target.value = "";
                        }
                      }}
                      className="px-3 py-1 bg-white border border-dashed border-slate-300 rounded-full text-xs focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                </div>
              ))}

              {/* Add Option Button */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="New option name (e.g. Material, Width)..."
                  value={newOptionName}
                  onChange={(e) => setNewOptionName(e.target.value)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddOptionGroup}
                  className="text-xs"
                >
                  + Add Option Type
                </Button>
              </div>
            </div>

            {/* Generated Variants Table */}
            {variants.length > 0 && (
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Generated Combinations ({variants.length} Variants)
                  </h3>
                  <span className="text-xs text-slate-500">
                    Each combination has independent stock and SKU
                  </span>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Variant (Attributes)</th>
                        <th className="py-2.5 px-3">SKU</th>
                        <th className="py-2.5 px-3 w-28">Price (৳)</th>
                        <th className="py-2.5 px-3 w-24">Stock Units</th>
                        <th className="py-2.5 px-3 text-center">In Stock</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {variants.map((v, idx) => {
                        const attrText = Object.entries(v.attributes || {})
                          .map(([key, val]) => `${key}: ${val}`)
                          .join(" / ");

                        return (
                          <tr key={idx} className="hover:bg-slate-50/60">
                            <td className="py-2.5 px-3 font-medium text-slate-900">
                              {attrText}
                            </td>
                            <td className="py-2.5 px-3">
                              <input
                                type="text"
                                value={v.sku}
                                onChange={(e) =>
                                  handleVariantChange(idx, "sku", e.target.value)
                                }
                                className="w-full px-2 py-1 border border-slate-200 rounded font-mono text-[11px]"
                              />
                            </td>
                            <td className="py-2.5 px-3">
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
                                className="w-full px-2 py-1 border border-slate-200 rounded font-semibold"
                              />
                            </td>
                            <td className="py-2.5 px-3">
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
                                className="w-full px-2 py-1 border border-slate-200 rounded font-semibold text-slate-800"
                              />
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <input
                                type="checkbox"
                                checked={v.in_stock}
                                onChange={(e) =>
                                  handleVariantChange(idx, "in_stock", e.target.checked)
                                }
                                className="w-4 h-4 text-indigo-600 rounded border-slate-300"
                              />
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <button
                                type="button"
                                onClick={() =>
                                  setVariants(variants.filter((_, i) => i !== idx))
                                }
                                className="text-slate-400 hover:text-rose-600"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
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

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Primary Category <span className="text-rose-500">*</span>
              </label>
              <select
                required
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              >
                <option value="">Select Category...</option>
                {mockCategories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Brand
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              >
                <option value="">Select Brand (Optional)...</option>
                {mockBrands.map((b) => (
                  <option key={b.id} value={b.slug}>
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
              and colors. Click <strong>Generate Matrix</strong> to automatically create SKU codes
              and individual stock trackers for each combination.
            </p>
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
