"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store-context";
import { mockBrands } from "@/lib/api/mock/data";
import { Button } from "@/components/ui/Button";
import { Tag, PlusCircle, Trash2, Edit3, Check } from "lucide-react";

export default function AdminBrandsPage() {
  const { brands: storeBrands, updateBrands } = useStore();
  const [mounted, setMounted] = useState(false);
  const [brands, setBrands] = useState(mockBrands);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && Array.isArray(storeBrands)) {
      setBrands(storeBrands);
    }
  }, [mounted, storeBrands]);

  function handleDeleteBrand(id) {
    if (confirm("Are you sure you want to delete this brand?")) {
      const updated = brands.filter((b) => b.id !== id);
      setBrands(updated);
      if (typeof updateBrands === "function") {
        updateBrands(updated);
      }
    }
  }

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Brand Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage partnering brands, labels, and manufacturers featured across your store
          </p>
        </div>

        <Link href="/admin/brands/create">
          <Button
            variant="primary"
            leftIcon={<PlusCircle className="w-4 h-4 text-amber-400" />}
            className="shadow-sm font-bold"
          >
            Add New Brand
          </Button>
        </Link>
      </div>

      {/* Brands Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200">
          <h2 className="text-base font-bold text-slate-900">
            Registered Brands ({brands.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Brands displayed on the homepage logo carousel and shop filter sidebar
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Brand Logo</th>
                <th className="py-3.5 px-4">Brand Name</th>
                <th className="py-3.5 px-4">Slug</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {brands.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-900 text-amber-400 font-black text-xs flex items-center justify-center shrink-0 uppercase tracking-wider">
                      {b.logo || b.name.slice(0, 2)}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-slate-900 text-sm">
                    {b.name}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-slate-500">
                    /brand/{b.slug}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                      Active
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleDeleteBrand(b.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete brand"
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
