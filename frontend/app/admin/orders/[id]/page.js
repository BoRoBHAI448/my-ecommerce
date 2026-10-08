"use client";

import { useState, use } from "react";
import Link from "next/link";
import { mockOrders } from "@/lib/api/mock/data";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  ArrowLeft,
  Printer,
  ShoppingBag,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Send,
  User,
  ShieldCheck,
  Calendar,
} from "lucide-react";

export default function AdminOrderDetailPage({ params }) {
  const unwrappedParams = use(params);
  const orderId = unwrappedParams.id;

  const foundOrder =
    mockOrders.find((o) => o.id === orderId) || mockOrders[0];

  const [order, setOrder] = useState(foundOrder);
  const [currentStatus, setCurrentStatus] = useState(order.status);
  const [courierName, setCourierName] = useState(order.courier || "Steadfast Courier");
  const [trackingNumber, setTrackingNumber] = useState(order.tracking_code || "");
  const [newNote, setNewNote] = useState("");
  const [toastMsg, setToastMsg] = useState("");

  function showToast(msg) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  }

  function handleStatusUpdate() {
    const updated = {
      ...order,
      status: currentStatus,
      courier: courierName,
      tracking_code: trackingNumber,
      timeline: [
        ...order.timeline,
        {
          status: currentStatus,
          time: "Just now",
          note: newNote || `Order updated to ${currentStatus}`,
        },
      ],
    };
    setOrder(updated);
    setNewNote("");
    showToast("Order status & courier info saved!");
  }

  function handlePrintInvoice() {
    window.print();
  }

  return (
    <div className="space-y-6 pb-16 print:p-0 print:space-y-4">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-slate-700 animate-in fade-in duration-200 print:hidden">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <p className="text-sm font-medium">{toastMsg}</p>
        </div>
      )}

      {/* Top Bar (Hidden during Print) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="p-2 border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold text-slate-900 font-mono">
                Order #{order.id}
              </h1>
              <Badge
                variant={
                  order.status === "Delivered"
                    ? "success"
                    : order.status === "Pending"
                    ? "warning"
                    : order.status === "Cancelled"
                    ? "danger"
                    : "info"
                }
              >
                {order.status}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              Placed on {order.created_at}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrintInvoice}
            className="gap-2"
          >
            <Printer className="w-4 h-4" />
            Print Invoice
          </Button>
        </div>
      </div>

      {/* Printable Invoice Header (Visible only on print or clean view) */}
      <div className="hidden print:block border-b border-slate-300 pb-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              APEX CART
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              House 42, Road 11, Banani, Dhaka-1213, Bangladesh
            </p>
            <p className="text-xs text-slate-500">Phone: +880 1711-223344</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold font-mono text-slate-800">
              INVOICE #{order.id}
            </h2>
            <p className="text-xs text-slate-500">{order.created_at}</p>
            <p className="text-xs font-semibold text-slate-700 mt-1">
              Payment: {order.payment_method} ({order.payment_status})
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (8 Cols): Order Items, Summary, Timeline */}
        <div className="lg:col-span-8 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden print:border-none print:shadow-none">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-indigo-600" />
                Ordered Items ({order.items.length})
              </h2>
            </div>

            <div className="divide-y divide-slate-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                    />
                    <div>
                      <h3 className="font-semibold text-sm text-slate-900">
                        {item.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">{item.variant}</p>
                      <p className="text-[11px] font-mono text-slate-400">
                        SKU: {item.sku}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-xs text-slate-500">
                      ৳{item.price.toLocaleString()} × {item.quantity}
                    </p>
                    <p className="font-bold text-slate-900 text-sm mt-0.5">
                      ৳{item.total.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="bg-slate-50/70 p-4 border-t border-slate-200 space-y-2 text-sm">
              <div className="flex justify-between text-slate-600 text-xs">
                <span>Subtotal</span>
                <span className="font-semibold">৳{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600 text-xs">
                <span>Delivery Charge ({order.shipping.zone_name.split(" ")[0]})</span>
                <span className="font-semibold">৳{order.shipping_fee.toLocaleString()}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 text-xs">
                  <span>Discount</span>
                  <span className="font-semibold">-৳{order.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-900 font-bold text-base pt-2 border-t border-slate-200">
                <span>Grand Total</span>
                <span className="text-indigo-600">৳{order.grand_total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Timeline & Order Logs (Hidden in Print) */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 print:hidden">
            <h2 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              Order Activity & Timeline
            </h2>

            <div className="space-y-4 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-slate-200">
              {order.timeline.map((event, idx) => (
                <div key={idx} className="relative flex items-start gap-4 pl-8">
                  <div className="absolute left-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-indigo-600 border-2 border-white ring-2 ring-indigo-100" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">{event.status}</span>
                      <span className="text-slate-400">{event.time}</span>
                    </div>
                    {event.note && (
                      <p className="text-xs text-slate-500 mt-1">{event.note}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add internal staff note */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Add Note / Update Activity
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Spoke with customer, confirmed delivery for Thursday..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleStatusUpdate}
                  className="gap-1 text-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  Add Note
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right (4 Cols): Status updater, customer & shipping info */}
        <div className="lg:col-span-4 space-y-6">
          {/* Status & Courier Control Panel (Hidden in print) */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4 print:hidden">
            <h2 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
              <Truck className="w-4 h-4 text-indigo-600" />
              Fulfillment & Courier
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Order Status
              </label>
              <select
                value={currentStatus}
                onChange={(e) => setCurrentStatus(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              >
                <option value="Pending">Pending (Unconfirmed)</option>
                <option value="Processing">Processing (Packaging)</option>
                <option value="Shipped">Shipped (In Transit)</option>
                <option value="Delivered">Delivered (Completed)</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Assign Courier
              </label>
              <select
                value={courierName}
                onChange={(e) => setCourierName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              >
                <option value="Steadfast Courier">Steadfast Courier</option>
                <option value="Pathao Logistics">Pathao Logistics</option>
                <option value="RedX Logistics">RedX Logistics</option>
                <option value="Paperfly">Paperfly</option>
                <option value="Sundarban Courier">Sundarban Courier</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Consignment / Tracking Code
              </label>
              <input
                type="text"
                placeholder="e.g. STF-889102"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>

            <Button
              onClick={handleStatusUpdate}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs py-2.5"
            >
              Save Order Changes
            </Button>
          </div>

          {/* Customer Details Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <h2 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-600" />
              Customer Information
            </h2>

            <div className="space-y-2 text-xs">
              <p className="font-bold text-slate-900 text-sm">{order.customer.name}</p>
              <div className="flex items-center gap-2 text-slate-600">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <a
                  href={`tel:${order.customer.phone}`}
                  className="font-mono text-indigo-600 hover:underline"
                >
                  {order.customer.phone}
                </a>
              </div>
              {order.customer.email && (
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{order.customer.email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Address Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <h2 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-600" />
              Delivery Address
            </h2>

            <div className="space-y-2 text-xs text-slate-700">
              <p className="font-medium">{order.shipping.address}</p>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900">{order.shipping.city}</span>
                <span>•</span>
                <span className="text-indigo-600 font-medium">
                  {order.shipping.zone_name}
                </span>
              </div>
              {order.shipping.instructions && (
                <div className="p-2.5 bg-amber-50 rounded-lg text-amber-900 text-[11px] border border-amber-200/60 mt-2">
                  <strong>Special Instruction:</strong> {order.shipping.instructions}
                </div>
              )}
            </div>
          </div>

          {/* Payment Info Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <h2 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-indigo-600" />
              Payment Information
            </h2>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Method:</span>
                <span className="font-semibold text-slate-800">{order.payment_method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Status:</span>
                <span
                  className={`font-bold ${
                    order.payment_status === "Paid"
                      ? "text-emerald-600"
                      : "text-amber-600"
                  }`}
                >
                  {order.payment_status}
                </span>
              </div>
              {order.transaction_id && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Trx ID:</span>
                  <span className="font-mono font-medium text-slate-700">
                    {order.transaction_id}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
