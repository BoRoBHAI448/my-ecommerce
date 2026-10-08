"use client";

import { useState } from "react";
import { useStore } from "@/lib/store-context";
import { Button } from "@/components/ui/Button";
import {
  Settings,
  Truck,
  Building,
  CheckCircle2,
  FileText,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function AdminSettingsPage() {
  const store = useStore();
  const [toastMessage, setToastMessage] = useState("");

  const [businessName, setBusinessName] = useState(store?.name || "Apex Cart");
  const [phone, setPhone] = useState(store?.contact?.phone || "+880 1711-223344");
  const [email, setEmail] = useState(store?.contact?.email || "support@apexcart.com");
  const [address, setAddress] = useState(
    store?.contact?.address || "House 42, Road 11, Banani, Dhaka-1213, Bangladesh"
  );
  const [binNumber, setBinNumber] = useState("BIN-00291039-2026");

  // Delivery Fees
  const [insideDhaka, setInsideDhaka] = useState(70);
  const [subDhaka, setSubDhaka] = useState(100);
  const [outsideDhaka, setOutsideDhaka] = useState(130);
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState(2000);

  // Invoice terms
  const [invoiceTerms, setInvoiceTerms] = useState(
    "Products can be exchanged within 7 days with original packaging and invoice tag attached. No return on discounted items."
  );

  function showToast(msg) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  }

  function handleSave(e) {
    e.preventDefault();
    showToast("System settings updated successfully!");
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Settings className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900">System Settings</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            General business profile, Bangladesh delivery zones fees, and invoice print terms.
          </p>
        </div>

        <Button
          onClick={handleSave}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
        >
          Save Changes
        </Button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Business Profile */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
            <Building className="w-4 h-4 text-indigo-600" />
            Company & Contact Profile
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Store Trade Name
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                VAT / BIN Registration
              </label>
              <input
                type="text"
                value={binNumber}
                onChange={(e) => setBinNumber(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Hotline Phone
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Official Support Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Storefront Official Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
            />
          </div>
        </div>

        {/* Shipping & Delivery Zones Fees */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
            <Truck className="w-4 h-4 text-indigo-600" />
            Nationwide Delivery Zones (Bangladesh)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Inside Dhaka (৳)
              </label>
              <input
                type="number"
                value={insideDhaka}
                onChange={(e) => setInsideDhaka(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-semibold focus:outline-none"
              />
              <span className="text-[11px] text-slate-400">Regular Metro Dhaka</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Sub-Dhaka / Savar / Gazipur (৳)
              </label>
              <input
                type="number"
                value={subDhaka}
                onChange={(e) => setSubDhaka(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-semibold focus:outline-none"
              />
              <span className="text-[11px] text-slate-400">Greater Dhaka Outskirts</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Outside Dhaka / Nationwide (৳)
              </label>
              <input
                type="number"
                value={outsideDhaka}
                onChange={(e) => setOutsideDhaka(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-semibold focus:outline-none"
              />
              <span className="text-[11px] text-slate-400">All 64 Districts via Courier</span>
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Free Shipping Threshold (৳)
            </label>
            <div className="max-w-xs">
              <input
                type="number"
                value={freeDeliveryThreshold}
                onChange={(e) => setFreeDeliveryThreshold(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-semibold focus:outline-none"
              />
              <span className="text-[11px] text-slate-400">
                Orders equal or above this amount receive free delivery
              </span>
            </div>
          </div>
        </div>

        {/* Invoice Footer Terms */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-600" />
            Printable Invoice Policy & Footer
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Return & Exchange Note (Appears on Customer Invoices)
            </label>
            <textarea
              rows={3}
              value={invoiceTerms}
              onChange={(e) => setInvoiceTerms(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
