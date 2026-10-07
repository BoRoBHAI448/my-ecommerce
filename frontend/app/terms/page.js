import { getStore } from "@/lib/api/storefront";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export async function generateMetadata() {
  const storeRes = await getStore();
  const store = storeRes?.data;
  return {
    title: `Terms & Conditions | ${store?.name || "Apex Cart"}`,
    description: "Terms and conditions of service for customer orders and browsing.",
  };
}

export default async function TermsPage() {
  const storeRes = await getStore();
  const store = storeRes?.data;

  return (
    <div className="container-custom py-6 sm:py-12 max-w-4xl space-y-6">
      <Breadcrumbs items={[{ label: "Terms of Service" }]} />

      <h1 className="text-2xl sm:text-3xl font-black text-text tracking-tight">
        Terms & Conditions
      </h1>

      <div className="p-6 sm:p-8 rounded-theme bg-surface border border-border/80 shadow-2xs space-y-4 text-xs sm:text-sm text-text-muted leading-relaxed">
        <p>
          Welcome to <strong>{store?.name || "Apex Cart"}</strong>. By browsing our website and placing orders, you agree to comply with and be bound by the following terms of service.
        </p>

        <h3 className="font-bold text-text text-sm pt-2">1. Product Pricing & Availability</h3>
        <p>
          All prices are quoted in Bangladeshi Taka ({store?.currency || "BDT"}). While we strive for absolute accuracy, inadvertent technical errors in pricing or stock counts may occasionally occur. We reserve the right to revise incorrect orders before dispatch.
        </p>

        <h3 className="font-bold text-text text-sm pt-2">2. Order Placement & Cash on Delivery</h3>
        <p>
          Placing a Cash on Delivery order constitutes a binding agreement to accept the parcel upon arrival and pay the delivery rider the specified order amount.
        </p>

        <h3 className="font-bold text-text text-sm pt-2">3. Intellectual Property</h3>
        <p>
          All photography, brand logos, graphic assets, and product descriptions displayed across this storefront are protected intellectual property.
        </p>
      </div>
    </div>
  );
}
