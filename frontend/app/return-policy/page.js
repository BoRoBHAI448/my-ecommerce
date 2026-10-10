import { getStore } from "@/lib/api/storefront";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { RefreshCw, CheckCircle2, AlertTriangle } from "lucide-react";

export async function generateMetadata() {
  const storeRes = await getStore();
  const store = storeRes?.data;
  return {
    title: `Return & Exchange Policy | ${store?.name || "LIGGLO Atelier"}`,
    description: "Our 7-day hassle-free return and exchange policy explained.",
  };
}

export default async function ReturnPolicyPage() {
  const storeRes = await getStore();
  const store = storeRes?.data;

  return (
    <div className="container-custom py-6 sm:py-12 max-w-4xl space-y-8">
      <Breadcrumbs items={[{ label: "Return & Exchange Policy" }]} />

      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-secondary/10 text-secondary flex items-center justify-center mx-auto mb-2">
          <RefreshCw className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-text tracking-tight">
          7-Day Easy Exchange Policy
        </h1>
        <p className="text-xs sm:text-sm text-text-muted max-w-md mx-auto">
          We want you to be completely satisfied with your purchase at {store?.name || "LIGGLO Atelier"}.
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-theme bg-surface border border-border/80 shadow-2xs space-y-6 text-xs sm:text-sm text-text-muted leading-relaxed">
        <div className="space-y-3">
          <h3 className="font-bold text-text text-base flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Eligible for Return or Exchange</span>
          </h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Product does not fit as expected and requires a different size.</li>
            <li>Defective, damaged, or incorrect item received upon delivery.</li>
            <li>Requested within 7 calendar days from the date parcel was received.</li>
            <li>Item is unworn, unwashed, and in original packaging with intact brand tags.</li>
          </ul>
        </div>

        <div className="space-y-3 pt-3 border-t border-border">
          <h3 className="font-bold text-text text-base flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Non-Returnable Items</span>
          </h3>
          <p>
            For hygiene and health safety reasons, innerwear, socks, and personal care accessories are non-exchangeable unless received defective.
          </p>
        </div>

        <div className="space-y-3 pt-3 border-t border-border">
          <h3 className="font-bold text-text text-base">How to Initiate an Exchange</h3>
          <p>
            Simply reach out to our team on WhatsApp ({store?.whatsapp || store?.contact?.phone}) with your Order Number and photo of the product. Our courier rider will deliver the replacement item directly to your doorstep and collect the return.
          </p>
        </div>
      </div>
    </div>
  );
}
