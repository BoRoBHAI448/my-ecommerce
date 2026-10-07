"use client";

import { useState } from "react";
import { mockCategories } from "@/lib/api/mock/data";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import {
  FolderTree,
  PlusCircle,
  Trash2,
  Edit2,
  Check,
  ChevronRight,
} from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState(mockCategories);
  const [showAddForm, setShowAddForm] = useState(false);

  // New Category Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [parentId, setParentId] = useState("");
  const [image, setImage] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  function handleNameChange(val) {
    setName(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "")
    );
  }

  function handleAddCategory(e) {
    e.preventDefault();
    if (!name.trim()) return;

    if (parentId) {
      // Adding as a subcategory under an existing parent
      setCategories((prev) =>
        prev.map((cat) => {
          if (cat.id === Number(parentId)) {
            const updatedChildren = [
              ...(cat.children || []),
              { id: Date.now(), name, slug },
            ];
            return { ...cat, children: updatedChildren };
          }
          return cat;
        })
      );
    } else {
      // Adding as a root category
      const newCat = {
        id: Date.now(),
        name,
        slug,
        image:
          image ||
          "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80",
        children: [],
      };
      setCategories((prev) => [newCat, ...prev]);
    }

    setName("");
    setSlug("");
    setParentId("");
    setImage("");
    setShowAddForm(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  }

  function handleDeleteCategory(id) {
    if (confirm("Are you sure you want to remove this category?")) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    }
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
            Organize main storefront departments (Shoes, Bags, Apparel) and sub-categories
          </p>
        </div>

        <Button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          variant="primary"
          leftIcon={<PlusCircle className="w-4 h-4 text-amber-400" />}
          className="shadow-sm font-bold"
        >
          {showAddForm ? "Close Form" : "Add New Category"}
        </Button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Category created and synchronized with storefront header navigation!</span>
        </div>
      )}

      {/* Add Category Form Accordion */}
      {showAddForm && (
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4 animate-in fade-in">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <FolderTree className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Create New Department / Category
            </h2>
          </div>

          <form onSubmit={handleAddCategory} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Category Name"
                placeholder="e.g. Leather Footwear or Luxury Bags"
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
              <div>
                <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-1.5">
                  Parent Category (Hierarchy)
                </label>
                <select
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                >
                  <option value="">None (Top-Level Main Category)</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      Subcategory under &quot;{c.name}&quot;
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400 mt-1">
                  Leave as None if this should be a primary header navigation item.
                </p>
              </div>

              <Input
                label="Cover Image URL (Optional)"
                placeholder="https://images.unsplash.com/..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save & Publish
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Table List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Active Store Categories ({categories.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              These categories appear on the homepage grid and header mega menu
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Category Name</th>
                <th className="py-3.5 px-4">Slug</th>
                <th className="py-3.5 px-4">Sub-Categories</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center shrink-0 border border-slate-200">
                        {cat.name.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-900 text-sm">
                        {cat.name}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-slate-500">
                    /{cat.slug}
                  </td>

                  <td className="py-3.5 px-4">
                    {cat.children?.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {cat.children.map((sub) => (
                          <span
                            key={sub.id}
                            className="inline-flex items-center px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-700 font-semibold"
                          >
                            {sub.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">No subcategories</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
