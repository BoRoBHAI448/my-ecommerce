import { getStore } from "@/lib/api/storefront";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export async function generateMetadata() {
  const storeRes = await getStore();
  const store = storeRes?.data;
  return {
    title: `Privacy Policy | ${store?.name || "Apex Cart"}`,
    description: "Read our privacy policy regarding data collection and protection.",
  };
}

export default async function PrivacyPage() {
  const storeRes = await getStore();
  const store = storeRes?.data;

  return (
    <div className="container-custom py-6 sm:py-12 max-w-4xl space-y-6">
      <Breadcrumbs items={[{ label: "Privacy Policy" }]} />

      <h1 className="text-2xl sm:text-3xl font-black text-text tracking-tight">
        Privacy Policy
      </h1>

      <div className="p-6 sm:p-8 rounded-theme bg-surface border border-border/80 shadow-2xs space-y-4 text-xs sm:text-sm text-text-muted leading-relaxed">
        <p>
          At <strong>{store?.name || "Apex Cart"}</strong>, we take the confidentiality and safety of your personal information very seriously. This policy outlines how your information is gathered and protected.
        </p>

        <h3 className="font-bold text-text text-sm pt-2">1. Information We Collect</h3>
        <p>
          When placing an order or registering, we collect your name, mobile contact number, shipping destination address, and optional email for order fulfillment.
        </p>

        <h3 className="font-bold text-text text-sm pt-2">2. How We Use Your Data</h3>
        <p>
          We use your phone number and address solely to communicate order status updates, dispatch riders, and verify Cash on Delivery orders. We never sell or distribute your data to third-party marketing brokers.
        </p>

        <h3 className="font-bold text-text text-sm pt-2">3. Security Safeguards</h3>
        <p>
          All communications are secured over HTTPS encryption. Customer session authentication tokens are safely stored in secure httpOnly cookies.
        </p>
      </div>
    </div>
  );
}
