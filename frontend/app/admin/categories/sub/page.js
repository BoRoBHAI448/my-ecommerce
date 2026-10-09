"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/lib/store-context";
import { mockCategories } from "@/lib/api/mock/data";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FolderTree, PlusCircle, Trash2, Check } from "lucide-react";

export default function AdminSubCategoriesPage() {
  const { categories: storeCategories, updateCategories } = useStore();
  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState(mockCategories);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && Array.isArray(storeCategories)) {
      setCategories(storeCategories);
    }
  }, [mounted, storeCategories]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [parentCatId, setParentCatId] = useState(
    categories[0]?.id?.toString() || ""
  );
  const [subName, setSubName] = useState("");
  const [subSlug, setSubSlug] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Flatten all subcategories with parent reference
  const subCategoriesList = categories.flatMap((cat) =>
    (cat.children || []).map((child) => ({
      ...child,
      parentName: cat.name,
      parentId: cat.id,
    }))
  );

  function handleNameChange(val) {
    setSubName(val);
    setSubSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "")
    );
  }

  function handleAddSubCategory(e) {
    e.preventDefault();
    if (!subName.trim() || !parentCatId) return;

    const updated = categories.map((cat) => {
      if (cat.id === Number(parentCatId)) {
        const newChild = {
          id: Date.now(),
          name: subName,
          slug: subSlug,
        };
        return {
          ...cat,
          children: [...(cat.children || []), newChild],
        };
      }
      return cat;
    });

    setCategories(updated);
    if (typeof updateCategories === "function") {
      updateCategories(updated);
    }

    setSubName("");
    setSubSlug("");
    setShowAddForm(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  }

  function handleDeleteSubCategory(parentId, childId) {
    if (confirm("Remove this sub-category?")) {
      const updated = categories.map((cat) => {
        if (cat.id === parentId) {
          return {
            ...cat,
            children: (cat.children || []).filter((c) => c.id !== childId),
          };
        }
        return cat;
      });

      setCategories(updated);
      if (typeof updateCategories === "function") {
        updateCategories(updated);
      }
    }
  }

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Sub-Categories Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Create and organize targeted sub-departments under main parent categories
          </p>
        </div>

        <Button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          variant="primary"
          leftIcon={<PlusCircle className="w-4 h-4 text-amber-400" />}
          className="shadow-sm font-bold"
        >
          {showAddForm ? "Close Form" : "Add Sub-Category"}
        </Button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Sub-category created successfully and linked to parent!</span>
        </div>
      )}

      {/* Add Sub Category Form */}
      {showAddForm && (
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4 animate-in fade-in">
          <div className="flex items-center gap-2 pb-3 border-slate-100 border-b">
            <FolderTree className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Create New Sub-Category
            </h2>
          </div>

          <form onSubmit={handleAddSubCategory} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-1.5">
                  Select Parent Department
                </label>
                <select
                  value={parentCatId}
                  onChange={(e) => setParentCatId(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  required
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Sub-Category Name"
                placeholder="e.g. Leather Loafers or Gym Backpacks"
                value={subName}
                onChange={(e) => handleNameChange(e.target.value)}
                required
              />

              <Input
                label="Slug (Auto-generated)"
                value={subSlug}
                onChange={(e) => setSubSlug(e.target.value)}
                required
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
                Add Sub-Category
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Sub Categories Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200">
          <h2 className="text-base font-bold text-slate-900">
            All Sub-Categories ({subCategoriesList.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Grouped under parent categories for the header mega-menu
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Sub-Category Name</th>
                <th className="py-3.5 px-4">Parent Category</th>
                <th className="py-3.5 px-4">Slug</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {subCategoriesList.map((sub) => (
                <tr key={`${sub.parentId}-${sub.id}`} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {sub.name}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-block px-2.5 py-1 rounded-full text-[11px] bg-amber-50 text-amber-800 font-bold border border-amber-200">
                      {sub.parentName}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-500">
                    /{sub.slug}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleDeleteSubCategory(sub.parentId, sub.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete subcategory"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
