"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  CreditCard,
  CheckCircle2,
  Lock,
  Smartphone,
  ShieldCheck,
  Settings,
  HelpCircle,
} from "lucide-react";

export default function AdminPaymentsPage() {
  const [toastMessage, setToastMessage] = useState("");

  const [gateways, setGateways] = useState({
    cod: {
      enabled: true,
      title: "Cash on Delivery (COD)",
      instructions: "Pay with cash when courier delivers the package to your doorstep.",
      min_order: 0,
    },
    bkash: {
      enabled: true,
      mode: "sandbox",
      merchant_number: "01711223344",
      app_key: "bkash_key_demo_8921",
      app_secret: "••••••••••••••••••••",
      username: "apexcart_merchant",
    },
    nagad: {
      enabled: true,
      mode: "sandbox",
      merchant_id: "NGD99102",
      public_key: "nagad_pub_key_demo",
    },
    sslcommerz: {
      enabled: false,
      mode: "sandbox",
      store_id: "apexcar001",
      store_passwd: "••••••••••••",
    },
  });

  function showToast(msg) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  }

  function handleToggle(gatewayKey) {
    setGateways((prev) => ({
      ...prev,
      [gatewayKey]: {
        ...prev[gatewayKey],
        enabled: !prev[gatewayKey].enabled,
      },
    }));
    showToast(`Updated payment gateway status.`);
  }

  function handleSaveAll(e) {
    e.preventDefault();
    showToast("Payment gateway credentials saved successfully!");
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
              <CreditCard className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900">Payment Gateways</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Configure Cash on Delivery and Bangladeshi MFS gateways (bKash, Nagad, SSLCommerz).
          </p>
        </div>

        <Button
          onClick={handleSaveAll}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
        >
          Save All Settings
        </Button>
      </div>

      <div className="space-y-6">
        {/* Gateway 1: Cash on Delivery (COD) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                ৳
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Cash on Delivery (COD)</h3>
                <p className="text-xs text-slate-500">Collect cash upon delivery in Bangladesh</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleToggle("cod")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                gateways.cod.enabled ? "bg-indigo-600" : "bg-slate-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  gateways.cod.enabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {gateways.cod.enabled && (
            <div className="pt-3 border-t border-slate-100 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Customer Instructions Note
                </label>
                <input
                  type="text"
                  value={gateways.cod.instructions}
                  onChange={(e) =>
                    setGateways({
                      ...gateways,
                      cod: { ...gateways.cod, instructions: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Gateway 2: bKash Direct Checkout */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center font-black text-sm">
                bK
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-sm">bKash Merchant Gateway</h3>
                  <Badge variant="purple" className="text-[10px] uppercase font-bold">
                    {gateways.bkash.mode}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500">
                  Direct tokenized checkout via bKash Payment API
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleToggle("bkash")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                gateways.bkash.enabled ? "bg-indigo-600" : "bg-slate-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  gateways.bkash.enabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {gateways.bkash.enabled && (
            <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Environment Mode
                </label>
                <select
                  value={gateways.bkash.mode}
                  onChange={(e) =>
                    setGateways({
                      ...gateways,
                      bkash: { ...gateways.bkash, mode: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="sandbox">Sandbox / Testing</option>
                  <option value="live">Live Production</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Merchant Phone Number
                </label>
                <input
                  type="text"
                  value={gateways.bkash.merchant_number}
                  onChange={(e) =>
                    setGateways({
                      ...gateways,
                      bkash: { ...gateways.bkash, merchant_number: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  App Key
                </label>
                <input
                  type="text"
                  value={gateways.bkash.app_key}
                  onChange={(e) =>
                    setGateways({
                      ...gateways,
                      bkash: { ...gateways.bkash, app_key: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  App Secret
                </label>
                <input
                  type="password"
                  value={gateways.bkash.app_secret}
                  onChange={(e) =>
                    setGateways({
                      ...gateways,
                      bkash: { ...gateways.bkash, app_secret: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
                />
              </div>
            </div>
          )}
        </div>

        {/* Gateway 3: Nagad Gateway */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center font-black text-sm">
                NG
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Nagad Payment Gateway</h3>
                <p className="text-xs text-slate-500">
                  Accept instant Nagad wallet transfers
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleToggle("nagad")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                gateways.nagad.enabled ? "bg-indigo-600" : "bg-slate-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  gateways.nagad.enabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Gateway 4: SSLCommerz */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-black text-sm">
                SSL
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">SSLCommerz Gateway</h3>
                <p className="text-xs text-slate-500">
                  Visa, Mastercard, Amex, Internet Banking & MFS aggregator
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleToggle("sslcommerz")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                gateways.sslcommerz.enabled ? "bg-indigo-600" : "bg-slate-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  gateways.sslcommerz.enabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
