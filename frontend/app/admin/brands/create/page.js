"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Tag, ArrowLeft, Check } from "lucide-react";

export default function AdminCreateBrandPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [logoText, setLogoText] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleNameChange(val) {
    setName(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "")
    );
    if (!logoText) {
      setLogoText(val.slice(0, 4).toUpperCase());
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/brands");
      }, 1000);
    }, 500);
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
        <Link
          href="/admin/brands"
          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Create Brand
          </h1>
          <p className="text-xs text-slate-500">
            Add a new label or manufacturer to your storefront catalog
          </p>
        </div>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Brand created successfully! Redirecting...</span>
        </div>
      )}

      <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Brand Name"
            placeholder="e.g. Apex Artisan or Urban Edge"
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

          <Input
            label="Logo Badge Text / Initials (Short)"
            placeholder="e.g. APEX"
            value={logoText}
            onChange={(e) => setLogoText(e.target.value)}
            helperText="Short badge text displayed if an image logo is not uploaded."
          />

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <Link href="/admin/brands">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" variant="primary" isLoading={loading}>
              Create Brand
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
