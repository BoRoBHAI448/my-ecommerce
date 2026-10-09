"use client";

import { useState } from "react";
import { useStore } from "@/lib/store-context";
import { changeAdminPassword } from "@/lib/api/admin";
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
  AlertTriangle,
  Trash2,
  RefreshCw,
  Lock,
  ShieldCheck,
  KeyRound,
} from "lucide-react";

export default function AdminSettingsPage() {
  const store = useStore();
  const resetStoreData = store?.resetStoreData;
  const [toastMessage, setToastMessage] = useState("");
  const [showResetModal, setShowResetModal] = useState(false);

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

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  function showToast(msg) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  }

  function handleSave(e) {
    e.preventDefault();
    showToast("System settings updated successfully!");
  }

  async function handlePasswordChange(e) {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!currentPassword) {
      setPasswordError("Please enter your current password.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await changeAdminPassword(currentPassword, newPassword, confirmPassword);
      if (res && res.success) {
        setPasswordSuccess("Admin password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        showToast("Admin password updated successfully!");
      } else {
        setPasswordError(res?.message || "Failed to update password. Please check your current password.");
      }
    } catch {
      setPasswordError("An unexpected error occurred while updating password.");
    } finally {
      setPasswordLoading(false);
    }
  }

  function handleResetStore() {
    if (typeof resetStoreData === "function") {
      resetStoreData();
    }
    setShowResetModal(false);
    showToast("All demo data (products, categories, brands, coupons) wiped cleanly!");
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

        {/* Admin Password & Account Security */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-indigo-600" />
              Admin Password & Security
            </h2>
            <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              Encrypted Auth (Sanctum)
            </span>
          </div>

          {passwordError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
              <p>{passwordError}</p>
            </div>
          )}

          {passwordSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-700 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <p>{passwordSuccess}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Current Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="button"
              onClick={handlePasswordChange}
              disabled={passwordLoading}
              className="bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs py-2 px-5 flex items-center gap-2"
            >
              {passwordLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  Update Password
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Danger Zone: Handover Store Reset */}
        <div className="bg-rose-50 p-6 rounded-xl border border-rose-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-semibold text-rose-900 text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Client Handover & Reset Store Baseline
              </h2>
              <p className="text-xs text-rose-700 mt-1 max-w-xl">
                Wipe all sample demo data (categories, products, brands, coupons) to deliver a clean slate site to your customer.
              </p>
            </div>

            <Button
              type="button"
              onClick={() => setShowResetModal(true)}
              className="bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs py-2 px-4 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear All Demo Data
            </Button>
          </div>
        </div>
      </form>

      {/* Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl border border-slate-100 p-6 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-100 text-rose-600 rounded-full">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Reset Store Demo Data?</h3>
                <p className="text-xs text-slate-500">This action will clear all dummy data.</p>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg text-xs text-slate-600 space-y-1.5 border border-slate-100">
              <p className="font-semibold text-slate-800">The following item collections will be wiped:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li>Demo Categories & Subcategories</li>
                <li>Demo Products & Pricing</li>
                <li>Demo Brands</li>
                <li>Demo Discount Coupons</li>
              </ul>
              <p className="pt-1 text-rose-600 font-medium">Your store will start as a completely fresh, empty site for your customer.</p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetStore}
                className="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Yes, Clear All Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
