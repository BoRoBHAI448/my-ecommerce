import { getStore } from "@/lib/api/storefront";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ShieldCheck, Sparkles, Heart } from "lucide-react";

export async function generateMetadata() {
  const storeRes = await getStore();
  const store = storeRes?.data;
  return {
    title: `About Us | ${store?.name || "Apex Cart"}`,
    description: `Learn about our craftsmanship, story, and values at ${store?.name || "Apex Cart"}.`,
  };
}

export default async function AboutPage() {
  const storeRes = await getStore();
  const store = storeRes?.data;

  return (
    <div className="container-custom py-6 sm:py-12 max-w-4xl space-y-10">
      <Breadcrumbs items={[{ label: "About Us" }]} />

      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-secondary tracking-widest uppercase">
          Our Heritage & Story
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-text tracking-tight">
          Crafting Elegance for Daily Living
        </h1>
        <p className="text-sm sm:text-base text-text-muted max-w-2xl mx-auto leading-relaxed">
          {store?.name || "Apex Cart"} was founded with a singular conviction: luxury is not an extravagance, but an uncompromising commitment to quality materials and timeless design.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="p-6 rounded-theme bg-surface border border-border/80 shadow-2xs space-y-3 text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-text">Pure Craftsmanship</h2>
          <p className="text-xs text-text-muted leading-relaxed">
            From Supima cotton to full-grain vegetable-tanned leather, we source ethical raw materials that age beautifully with time.
          </p>
        </div>

        <div className="p-6 rounded-theme bg-surface border border-border/80 shadow-2xs space-y-3 text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-text">Genuine Quality</h2>
          <p className="text-xs text-text-muted leading-relaxed">
            Every garment and accessory undergoes rigorous multi-tier inspection before it leaves our fulfillment facility.
          </p>
        </div>

        <div className="p-6 rounded-theme bg-surface border border-border/80 shadow-2xs space-y-3 text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <Heart className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-text">Customer First</h2>
          <p className="text-xs text-text-muted leading-relaxed">
            Transparent pricing, cash on delivery convenience, and guaranteed 7-day hassle-free exchanges nationwide.
          </p>
        </div>
      </div>
    </div>
  );
}
