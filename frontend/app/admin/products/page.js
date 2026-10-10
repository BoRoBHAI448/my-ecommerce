"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store-context";
import { mockCategories, mockBrands } from "@/lib/api/mock/data";
import { supabase } from "@/lib/supabase/client";
import {
  deleteAdminProductInSupabase,
  updateAdminProductInSupabase,
} from "@/lib/supabase/products";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import {
  Package,
  PlusCircle,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Copy,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Layers,
  ArrowUpDown,
  MoreVertical,
  ExternalLink,
} from "lucide-react";

export default function AdminProductsPage() {
  const {
    products: storeProducts,
    categories: storeCategories,
    brands: storeBrands,
    updateProducts,
  } = useStore();
  const [mounted, setMounted] = useState(false);
  const [supabaseProducts, setSupabaseProducts] = useState([]);
  const [loadingDb, setLoadingDb] = useState(true);

  const categoriesList = mounted && Array.isArray(storeCategories) ? storeCategories : mockCategories;
  const brandsList = mounted && Array.isArray(storeBrands) ? storeBrands : mockBrands;

  async function loadProductsFromSupabase() {
    setLoadingDb(true);
    try {
      const res = await fetch("/api/admin/products");
      let data = null;
      if (res.ok) {
        const json = await res.json();
        data = json.data;
      }
      if (!data) {
        const fallback = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });
        data = fallback.data;
      }
      if (Array.isArray(data)) {
        const formatted = data.map((item) => ({
          ...item,
          id: item.id,
          name: item.name,
          slug: item.slug,
          image: item.thumbnail || item.images?.[0] || "",
          images: item.images || [],
          selling_price: Number(item.selling_price || item.regular_price || 0),
          discount_price: item.discount_price ? Number(item.discount_price) : null,
          regular_price: Number(item.regular_price || 0),
          in_stock: Boolean(item.is_active !== false && item.in_stock !== false),
          stock_count: Number(item.stock || 0),
          rating: Number(item.rating || 5.0),
          category: { name: item.gender || "General", slug: item.gender?.toLowerCase() || "general" },
          brand: null,
          variants: [],
        }));
        setSupabaseProducts(formatted);
        if (typeof updateProducts === "function") {
          updateProducts(formatted);
        }
      }
    } catch (err) {
      console.warn("Fetch Supabase products notice:", err);
    } finally {
      setLoadingDb(false);
    }
  }

  useEffect(() => {
    setMounted(true);
    loadProductsFromSupabase();
  }, []);

  const products = useMemo(() => {
    if (!mounted) return [];

    const LEGACY_MOCK_SLUGS = new Set([
      "veloce-carbon-trail-sneaker",
      "monochrome-tailored-relaxed-trouser",
      "heritage-oxford-commuter-pack",
      "architectural-trench-overcoat",
      "heavyweight-boxy-graphic-tee",
      "apex-court-minimalist-runner",
      "atelier-structured-leather-tote",
      "airpulse-retro-90-sneakers",
      "classic-leather-formal-shoes",
      "women-s-leather-tote-bag",
    ]);

    // Once database has finished fetching, Supabase is the single source of truth
    if (!loadingDb) {
      return supabaseProducts;
    }

    // While initial load is in progress, show clean local products
    return (Array.isArray(storeProducts) ? storeProducts : []).filter(
      (p) => p && !LEGACY_MOCK_SLUGS.has(p.slug)
    );
  }, [mounted, loadingDb, supabaseProducts, storeProducts]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedStockStatus, setSelectedStockStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedIds, setSelectedIds] = useState([]);
  const [toastMessage, setToastMessage] = useState("");
  const [deleteModalProduct, setDeleteModalProduct] = useState(null);

  function saveAndSyncProducts(updated) {
    setLocalOverride(updated);
    if (typeof updateProducts === "function") {
      updateProducts(updated);
    }
    if (typeof window !== "undefined") {
      try {
        // Strip base64 data URIs to prevent localStorage quota exceeded errors
        const productsForStorage = updated.map((p) => ({
          ...p,
          image: p.image?.startsWith("data:") ? "" : (p.image || ""),
          images: Array.isArray(p.images)
            ? p.images.filter((img) => img && !img.startsWith("data:"))
            : [],
        }));
        localStorage.setItem("store_custom_products", JSON.stringify(productsForStorage));
      } catch (err) {
        console.warn("localStorage save failed:", err);
        try {
          const minimalProducts = updated.map((p) => ({
            ...p,
            image: p.image?.startsWith("data:") ? "" : (p.image || ""),
            images: [],
          }));
          localStorage.setItem("store_custom_products", JSON.stringify(minimalProducts));
        } catch {}
      }
    }
  }

  // Quick flash notification
  function showToast(msg) {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  }

  // Calculate stats
  const stats = useMemo(() => {
    const total = products.length;
    let inStockCount = 0;
    let inStockUnits = 0;
    let lowStockCount = 0;
    let lowStockUnits = 0;
    let outOfStockCount = 0;
    let totalStockUnits = 0;

    products.forEach((p) => {
      const units =
        p.variants && p.variants.length > 0
          ? p.variants.reduce((acc, v) => acc + (v.stock_quantity || 0), 0)
          : Number(p.stock || p.stock_count || 0);
      totalStockUnits += units;
      if (units === 0 || !p.in_stock) {
        outOfStockCount++;
      } else if (units < 10) {
        lowStockCount++;
        lowStockUnits += units;
      } else {
        inStockCount++;
        inStockUnits += units;
      }
    });

    return { total, inStockCount, inStockUnits, lowStockCount, lowStockUnits, outOfStockCount, totalStockUnits };
  }, [products]);

  // Filter & Sort
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search
        const query = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !query ||
          p.name.toLowerCase().includes(query) ||
          p.slug.toLowerCase().includes(query) ||
          p.variants?.some((v) => v.sku?.toLowerCase().includes(query));

        // Category
        const matchesCategory =
          selectedCategory === "all" || p.category?.slug === selectedCategory;

        // Brand
        const matchesBrand =
          selectedBrand === "all" || p.brand?.slug === selectedBrand;

        // Stock status
        const totalUnits = (p.variants || []).reduce(
          (acc, v) => acc + (v.stock_quantity || 0),
          0
        );
        let matchesStock = true;
        if (selectedStockStatus === "in_stock") {
          matchesStock = totalUnits >= 10 && p.in_stock;
        } else if (selectedStockStatus === "low_stock") {
          matchesStock = totalUnits > 0 && totalUnits < 10;
        } else if (selectedStockStatus === "out_of_stock") {
          matchesStock = totalUnits === 0 || !p.in_stock;
        }

        return matchesQuery && matchesCategory && matchesBrand && matchesStock;
      })
      .sort((a, b) => {
        if (sortBy === "price_asc") {
          return (a.discount_price || a.selling_price) - (b.discount_price || b.selling_price);
        }
        if (sortBy === "price_desc") {
          return (b.discount_price || b.selling_price) - (a.discount_price || a.selling_price);
        }
        if (sortBy === "name_asc") {
          return a.name.localeCompare(b.name);
        }
        return b.id - a.id;
      });
  }, [products, searchQuery, selectedCategory, selectedBrand, selectedStockStatus, sortBy]);

  // Selection handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredProducts.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Status toggle
  const handleToggleStatus = async (id) => {
    const target = products.find((p) => p.id === id);
    if (!target) return;
    const nextStatus = !target.in_stock;
    try {
      await updateAdminProductInSupabase(id, { is_active: nextStatus, in_stock: nextStatus });
    } catch (err) {
      console.warn("Supabase toggle status notice:", err);
    }
    setSupabaseProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, in_stock: nextStatus } : p))
    );
    showToast(`"${target.name}" status changed to ${nextStatus ? "Active" : "Draft"}`);
  };

  // Delete product
  const confirmDeleteProduct = async () => {
    if (!deleteModalProduct) return;
    const target = deleteModalProduct;
    try {
      await deleteAdminProductInSupabase(target.id, target.slug);
    } catch (err) {
      console.warn("Supabase delete notice:", err);
    }

    setSupabaseProducts((prev) =>
      prev.filter((p) => p.id !== target.id && p.slug !== target.slug)
    );

    if (typeof updateProducts === "function") {
      updateProducts((prev) =>
        Array.isArray(prev)
          ? prev.filter((p) => p.id !== target.id && p.slug !== target.slug)
          : []
      );
    }

    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("store_custom_products");
        if (raw) {
          const parsed = JSON.parse(raw);
          const filtered = parsed.filter(
            (p) => p.id !== target.id && p.slug !== target.slug
          );
          localStorage.setItem("store_custom_products", JSON.stringify(filtered));
        }
      } catch {}
    }

    setSelectedIds((prev) => prev.filter((id) => id !== target.id));
    showToast(`"${target.name}" deleted successfully.`);
    setDeleteModalProduct(null);
  };

  // Bulk actions
  const handleBulkDelete = async () => {
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedIds.length} selected products?`
      )
    ) {
      const idsToDelete = [...selectedIds];
      try {
        await Promise.all(idsToDelete.map((id) => deleteAdminProductInSupabase(id)));
      } catch (err) {
        console.warn("Supabase bulk delete notice:", err);
      }
      setSupabaseProducts((prev) =>
        prev.filter((p) => !idsToDelete.includes(p.id))
      );
      if (typeof updateProducts === "function") {
        updateProducts((prev) =>
          Array.isArray(prev)
            ? prev.filter((p) => !idsToDelete.includes(p.id))
            : []
        );
      }
      if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem("store_custom_products");
          if (raw) {
            const parsed = JSON.parse(raw);
            const filtered = parsed.filter((p) => !idsToDelete.includes(p.id));
            localStorage.setItem("store_custom_products", JSON.stringify(filtered));
          }
        } catch {}
      }
      showToast(`${idsToDelete.length} products removed.`);
      setSelectedIds([]);
    }
  };

  const handleBulkStatusChange = async (status) => {
    try {
      await Promise.all(
        selectedIds.map((id) =>
          updateAdminProductInSupabase(id, { is_active: status, in_stock: status })
        )
      );
    } catch (err) {
      console.warn("Supabase bulk status notice:", err);
    }
    setSupabaseProducts((prev) =>
      prev.map((p) => (selectedIds.includes(p.id) ? { ...p, in_stock: status } : p))
    );
    showToast(`Updated status for ${selectedIds.length} products.`);
    setSelectedIds([]);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <p className="text-sm font-medium">{toastMessage}</p>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Package className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900">Products Catalog</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Manage your shoe & bag catalog, variant pricing, inventory stock and visibility.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/products/create">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-sm font-medium">
              <PlusCircle className="w-4 h-4" />
              Add New Product
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Products
            </p>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-bold text-slate-900" suppressHydrationWarning>{stats.total}</span>
              <span className="text-xs text-slate-500 font-medium">Items</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5" suppressHydrationWarning>
              {stats.totalStockUnits} total inventory units
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shrink-0">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              In Stock Units
            </p>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-bold text-slate-900" suppressHydrationWarning>{stats.totalStockUnits}</span>
              <span className="text-xs text-emerald-600 font-semibold">Units</span>
            </div>
            <p className="text-[11px] text-emerald-600/80 mt-0.5" suppressHydrationWarning>
              Across {stats.inStockCount} active products
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
              Low Stock Alert
            </p>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-bold text-slate-900" suppressHydrationWarning>{stats.lowStockCount}</span>
              <span className="text-xs text-amber-600 font-semibold">Products</span>
            </div>
            <p className="text-[11px] text-amber-600/80 mt-0.5" suppressHydrationWarning>
              {stats.lowStockUnits > 0 ? `${stats.lowStockUnits} units remaining` : "Inventory healthy"}
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-rose-600 uppercase tracking-wider">
              Out of Stock
            </p>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-bold text-slate-900" suppressHydrationWarning>{stats.outOfStockCount}</span>
              <span className="text-xs text-rose-600 font-semibold">Products</span>
            </div>
            <p className="text-[11px] text-rose-600/80 mt-0.5" suppressHydrationWarning>
              {stats.outOfStockCount > 0 ? "Requires restock" : "All products available"}
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <XCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search */}
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by product name, SKU, or slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          {/* Category Filter */}
          <div className="md:col-span-2">
            <select
              suppressHydrationWarning
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            >
              <option value="all">All Categories</option>
              {categoriesList.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Brand Filter */}
          <div className="md:col-span-2">
            <select
              suppressHydrationWarning
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            >
              <option value="all">All Brands</option>
              {brandsList.map((b) => (
                <option key={b.id} value={b.slug}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedStockStatus}
              onChange={(e) => setSelectedStockStatus(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            >
              <option value="all">Stock: All</option>
              <option value="in_stock">In Stock (10+)</option>
              <option value="low_stock">Low Stock (&lt;10)</option>
              <option value="out_of_stock">Out of Stock (0)</option>
            </select>
          </div>

          {/* Sort */}
          <div className="md:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            >
              <option value="newest">Sort: Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Bulk Action Toolbar */}
        {selectedIds.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 bg-indigo-50/50 p-2.5 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-indigo-900 bg-indigo-100 px-2 py-0.5 rounded-full">
                {selectedIds.length} selected
              </span>
              <span className="text-xs text-indigo-700">Apply action to selected items</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkStatusChange(true)}
                className="text-xs h-8 text-emerald-700 border-emerald-300 hover:bg-emerald-50"
              >
                Mark Active
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkStatusChange(false)}
                className="text-xs h-8 text-amber-700 border-amber-300 hover:bg-amber-50"
              >
                Mark Draft
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkDelete}
                className="text-xs h-8 text-rose-600 border-rose-300 hover:bg-rose-50"
              >
                Delete Selected
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Products Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-xs uppercase tracking-wider">
                <th className="py-3.5 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={
                      filteredProducts.length > 0 &&
                      selectedIds.length === filteredProducts.length
                    }
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">Category & Brand</th>
                <th className="py-3.5 px-4">Pricing (BDT)</th>
                <th className="py-3.5 px-4">Stock & Variants</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!mounted || loadingDb ? (
                <tr>
                  <td colSpan="7" className="py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2.5">
                      <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                      <p className="text-xs text-slate-500 font-medium">Loading catalog...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-16 text-center text-slate-400">
                    <Package className="w-12 h-12 mx-auto stroke-1 text-slate-300 mb-2" />
                    <p className="text-base font-semibold text-slate-800">No products in inventory</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Ready to add your first product? Click the button below.
                    </p>
                    <Link
                      href="/admin/products/create"
                      className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 transition-colors"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Add New Product
                    </Link>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const totalUnits =
                    product.variants && product.variants.length > 0
                      ? product.variants.reduce(
                          (acc, v) => acc + (v.stock_quantity || 0),
                          0
                        )
                      : Number(product.stock || product.stock_count || 0);
                  const variantCount = product.variants ? product.variants.length : 0;
                  const isChecked = selectedIds.includes(product.id);

                  return (
                    <tr
                      key={product.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isChecked ? "bg-indigo-50/30" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSelect(product.id)}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                        />
                      </td>

                      {/* Product Media & Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image || "/placeholder.jpg"}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <Link
                              href={`/product/${product.slug}`}
                              target="_blank"
                              className="font-semibold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-1 flex items-center gap-1 group"
                            >
                              <span>{product.name}</span>
                              <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-slate-400" />
                            </Link>
                            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                              <span>SKU: {product.variants?.[0]?.sku || "N/A"}</span>
                              <span>•</span>
                              <span className="font-mono text-[11px] truncate max-w-[160px]">
                                /{product.slug}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category & Brand */}
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-700 text-xs font-medium rounded">
                            {product.category?.name || "General"}
                          </span>
                          {product.brand && (
                            <div className="text-xs text-slate-500 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                              <span>{product.brand.name}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Pricing */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          {product.discount_price ? (
                            <>
                              <span className="font-bold text-slate-900">
                                ৳{product.discount_price.toLocaleString()}
                              </span>
                              <span className="text-xs text-slate-400 line-through">
                                ৳{product.selling_price.toLocaleString()}
                              </span>
                            </>
                          ) : (
                            <span className="font-bold text-slate-900">
                              ৳{product.selling_price?.toLocaleString() || "0"}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Stock & Variants */}
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {totalUnits > 10 ? (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                {totalUnits} in stock
                              </span>
                            ) : totalUnits > 0 ? (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                Low stock ({totalUnits})
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                                Out of stock
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Layers className="w-3 h-3 text-slate-400" />
                            {variantCount} variant{variantCount > 1 ? "s" : ""}
                          </span>
                        </div>
                      </td>

                      {/* Status Toggle */}
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(product.id)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                            product.in_stock ? "bg-indigo-600" : "bg-slate-300"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              product.in_stock ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                        <p className="text-[11px] font-medium text-slate-500 mt-1">
                          {product.in_stock ? "Active" : "Draft"}
                        </p>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/product/${product.slug}`}
                            target="_blank"
                            title="Preview on Store"
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          <button
                            type="button"
                            title="Duplicate Product"
                            onClick={() => handleCloneProduct(product)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                          </button>

                          <Link
                            href={`/admin/products/create?edit=${product.id}`}
                            title="Edit Product"
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>

                          <button
                            type="button"
                            title="Delete Product"
                            onClick={() => setDeleteModalProduct(product)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>
            Showing <strong className="text-slate-700">{!mounted || loadingDb ? 0 : filteredProducts.length}</strong> of{" "}
            <strong className="text-slate-700">{!mounted || loadingDb ? 0 : products.length}</strong> total products
          </span>
          <span className="text-slate-400">
            Total Inventory Units: <strong>{!mounted || loadingDb ? 0 : stats.totalStockUnits} items</strong>
          </span>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalProduct && (
        <Modal
          isOpen={!!deleteModalProduct}
          onClose={() => setDeleteModalProduct(null)}
          title="Delete Product Confirmation"
        >
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Are you sure you want to permanently delete{" "}
              <strong className="text-slate-900">"{deleteModalProduct.name}"</strong>? This will
              remove all associated size and color variants from the inventory.
            </p>
            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteModalProduct(null)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={confirmDeleteProduct}
                className="bg-rose-600 hover:bg-rose-700 text-white"
              >
                Yes, Delete
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
