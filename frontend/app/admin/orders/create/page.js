"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { mockProducts } from "@/lib/api/mock/data";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  ArrowLeft,
  Plus,
  Trash2,
  ShoppingBag,
  User,
  MapPin,
  CreditCard,
  CheckCircle2,
  Phone,
} from "lucide-react";

export default function AdminOrderCreatePage() {
  const router = useRouter();

  // Customer State
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingZone, setShippingZone] = useState("inside_dhaka");
  const [customerNotes, setCustomerNotes] = useState("");

  // Product Selection State
  const [selectedProductId, setSelectedProductId] = useState(mockProducts[0]?.id || "");
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [itemQuantity, setItemQuantity] = useState(1);

  // Cart / Line Items
  const [orderItems, setOrderItems] = useState([
    {
      id: 1,
      product_id: mockProducts[0]?.id,
      name: mockProducts[0]?.name,
      variant: "Size: L, Color: Classic White",
      sku: mockProducts[0]?.variants?.[0]?.sku || "OXF-WHT-L",
      price: mockProducts[0]?.discount_price || mockProducts[0]?.selling_price || 1850,
      quantity: 1,
      image: mockProducts[0]?.image,
    },
  ]);

  // Payment & Discount State
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery (COD)");
  const [paymentStatus, setPaymentStatus] = useState("Unpaid");
  const [transactionId, setTransactionId] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Shipping fees
  const zoneFees = {
    inside_dhaka: 70,
    sub_dhaka: 100,
    outside_dhaka: 130,
  };

  const deliveryCharge = zoneFees[shippingZone] || 70;
  const subtotal = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const grandTotal = Math.max(0, subtotal + deliveryCharge - Number(discountAmount || 0));

  // Current selected product for variant dropdown
  const currentProduct = mockProducts.find((p) => p.id === Number(selectedProductId));

  function handleAddItem() {
    if (!currentProduct) return;
    const variant = currentProduct.variants?.find((v) => v.id === Number(selectedVariantId));
    const attrText = variant
      ? Object.entries(variant.attributes || {})
          .map(([k, v]) => `${k}: ${v}`)
          .join(", ")
      : "Standard";

    const newItem = {
      id: Date.now(),
      product_id: currentProduct.id,
      name: currentProduct.name,
      variant: attrText,
      sku: variant?.sku || "SKU-AUTO",
      price: variant?.discount_price || variant?.selling_price || currentProduct.selling_price,
      quantity: Number(itemQuantity) || 1,
      image: currentProduct.image,
    };

    setOrderItems([...orderItems, newItem]);
    setItemQuantity(1);
  }

  function handleRemoveItem(idx) {
    setOrderItems(orderItems.filter((_, i) => i !== idx));
  }

  function handleSubmitOrder(e) {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !shippingAddress.trim()) {
      alert("Please fill in Customer Name, Phone, and Address");
      return;
    }
    if (orderItems.length === 0) {
      alert("Please add at least one product to the order");
      return;
    }

    setIsSubmitting(true);
    setToastMessage("Manual order created successfully!");

    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/admin/orders");
    }, 1200);
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
        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="p-2 border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Create Manual Order</h1>
            <p className="text-sm text-slate-500">
              Create an order on behalf of a customer from Facebook, WhatsApp, or phone call.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/orders">
            <Button variant="outline" size="sm">
              Cancel
            </Button>
          </Link>
          <Button
            size="sm"
            onClick={handleSubmitOrder}
            disabled={isSubmitting}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {isSubmitting ? "Creating Order..." : "Confirm & Save Order"}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Items & Details */}
        <div className="lg:col-span-8 space-y-6">
          {/* Customer Details Box */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-600" />
              Customer Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Arif Chowdhury"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Mobile Number (BD) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                    +88
                  </span>
                  <input
                    type="tel"
                    required
                    placeholder="017XXXXXXXX"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full pl-11 pr-3.5 py-2 border border-slate-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Delivery Zone <span className="text-rose-500">*</span>
                </label>
                <select
                  value={shippingZone}
                  onChange={(e) => setShippingZone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                >
                  <option value="inside_dhaka">Inside Dhaka (৳70)</option>
                  <option value="sub_dhaka">Sub Dhaka / Savar / Gazipur (৳100)</option>
                  <option value="outside_dhaka">Outside Dhaka / Nationwide (৳130)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  placeholder="arif@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Delivery Address <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                required
                placeholder="House no, Road no, Area, Thana, District..."
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
          </div>

          {/* Add Products to Order */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-indigo-600" />
              Add Items to Order
            </h2>

            {/* Product selection controls */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="sm:col-span-5">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Product
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => {
                    setSelectedProductId(e.target.value);
                    setSelectedVariantId("");
                  }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:border-indigo-600"
                >
                  {mockProducts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (৳{p.discount_price || p.selling_price})
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-4">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Variant (Size / Color)
                </label>
                <select
                  value={selectedVariantId}
                  onChange={(e) => setSelectedVariantId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:border-indigo-600"
                >
                  <option value="">Default Variant</option>
                  {currentProduct?.variants?.map((v) => (
                    <option key={v.id} value={v.id}>
                      {Object.values(v.attributes).join(" - ")} (Stock: {v.stock_quantity})
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-1">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Qty
                </label>
                <input
                  type="number"
                  min="1"
                  value={itemQuantity}
                  onChange={(e) => setItemQuantity(Math.max(1, Number(e.target.value)))}
                  className="w-full px-2 py-2 border border-slate-200 rounded-lg text-xs text-center font-bold"
                />
              </div>

              <div className="sm:col-span-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddItem}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-9 gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </Button>
              </div>
            </div>

            {/* Line items table */}
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Item</th>
                    <th className="py-2.5 px-3">Variant</th>
                    <th className="py-2.5 px-3">Unit Price</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Total</th>
                    <th className="py-2.5 px-3 text-right">Remove</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orderItems.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-6 text-center text-slate-400">
                        No items added to order yet.
                      </td>
                    </tr>
                  ) : (
                    orderItems.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60">
                        <td className="py-2.5 px-3 font-semibold text-slate-900">
                          {item.name}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">{item.variant}</td>
                        <td className="py-2.5 px-3 font-mono">৳{item.price.toLocaleString()}</td>
                        <td className="py-2.5 px-3 text-center font-bold">{item.quantity}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                          ৳{(item.price * item.quantity).toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="text-slate-400 hover:text-rose-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Summary & Payment */}
        <div className="lg:col-span-4 space-y-6">
          {/* Payment Method Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-indigo-600" />
              Payment Details
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              >
                <option value="Cash on Delivery (COD)">Cash on Delivery (COD)</option>
                <option value="bKash Manual Transfer">bKash Manual Transfer</option>
                <option value="Nagad Manual Transfer">Nagad Manual Transfer</option>
                <option value="Bank Wire">Bank Wire</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Payment Status
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              >
                <option value="Unpaid">Unpaid (Cash to Collect)</option>
                <option value="Paid">Paid (Already Received)</option>
              </select>
            </div>

            {paymentStatus === "Paid" && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Trx ID / Ref Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. BK8923412"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>
            )}
          </div>

          {/* Pricing & Billing Summary */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="font-semibold text-slate-900 text-sm">Order Summary</h2>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal</span>
                <span className="font-semibold text-slate-900">৳{subtotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Delivery Charge</span>
                <span className="font-semibold text-slate-900">৳{deliveryCharge}</span>
              </div>

              <div className="flex justify-between items-center text-slate-600 pt-1">
                <span>Staff Discount (৳)</span>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(Number(e.target.value))}
                  className="w-20 px-2 py-1 border border-slate-200 rounded text-right text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-sm font-bold text-slate-900">
                <span>Grand Total</span>
                <span className="text-indigo-600 text-base">
                  ৳{grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm py-2.5 mt-2"
            >
              {isSubmitting ? "Creating Order..." : "Confirm & Place Order"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
