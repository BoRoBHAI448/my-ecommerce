"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import { mockOrders } from "@/lib/api/mock/data";
import { getAdminOrders, updateAdminOrderStatus } from "@/lib/api/admin";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";

import {
  ShoppingBag,
  PlusCircle,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Phone,
  FileText,
  MapPin,
  ArrowRight,
  Printer,
  ChevronDown,
} from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [toastMessage, setToastMessage] = useState("");
  const [statusChangeOrder, setStatusChangeOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  function showToast(msg) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  }

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const statusParam = activeTab === "all" ? "" : activeTab.toLowerCase();
      const res = await getAdminOrders({ status: statusParam, search: searchQuery });

      if (res && res.data) {
        const normalized = res.data.map((o) => ({
          id: o.order_number || String(o.id),
          rawId: o.id,
          customer: {
            name: o.customer_name || o.customer?.name || "Customer",
            phone: o.customer_phone || o.customer?.phone || "",
          },
          shipping: {
            address: o.shipping_address || o.shipping?.address || "",
            city: o.city || o.shipping?.city || "Dhaka",
            zone_name: o.zone || "Inside Dhaka",
          },
          items: (o.items || []).map((i) => ({
            name: i.product_name || i.name || "Product",
            image: i.product_image || i.image || "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400",
            quantity: i.quantity || 1,
          })),
          grand_total: o.total_amount || o.grand_total || 0,
          payment_method: (o.payment_method || "cod").toUpperCase(),
          payment_status:
            (o.payment_status || "pending").charAt(0).toUpperCase() +
            (o.payment_status || "pending").slice(1),
          status:
            (o.order_status || o.status || "pending").charAt(0).toUpperCase() +
            (o.order_status || o.status || "pending").slice(1),
          created_at: o.created_at
            ? new Date(o.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "",
        }));
        setOrders(normalized);
      } else {
        setOrders(mockOrders);
      }
    } catch (err) {
      console.error("Failed to fetch admin orders:", err);
      setOrders(mockOrders);
    } finally {
      setLoading(false);
    }
  }, [activeTab, searchQuery]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);


  // Status badge styling helper
  function getStatusBadge(status) {
    switch (status) {
      case "Pending":
        return <Badge variant="warning" className="gap-1"><Clock className="w-3 h-3" /> Pending</Badge>;
      case "Processing":
        return <Badge variant="info" className="gap-1 bg-blue-50 text-blue-700 border-blue-200"><Clock className="w-3 h-3" /> Processing</Badge>;
      case "Shipped":
        return <Badge variant="purple" className="gap-1 bg-purple-50 text-purple-700 border-purple-200"><Truck className="w-3 h-3" /> Shipped</Badge>;
      case "Delivered":
        return <Badge variant="success" className="gap-1"><CheckCircle2 className="w-3 h-3" /> Delivered</Badge>;
      case "Cancelled":
        return <Badge variant="danger" className="gap-1"><XCircle className="w-3 h-3" /> Cancelled</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  }

  // Tab counts
  const tabCounts = useMemo(() => {
    const counts = { all: orders.length };
    orders.forEach((o) => {
      counts[o.status] = (counts[o.status] || 0) + 1;
    });
    return counts;
  }, [orders]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesTab = activeTab === "all" || o.status === activeTab;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        o.id.toLowerCase().includes(query) ||
        o.customer.name.toLowerCase().includes(query) ||
        o.customer.phone.includes(query) ||
        o.shipping.address.toLowerCase().includes(query);

      return matchesTab && matchesSearch;
    });
  }, [orders, activeTab, searchQuery]);

  // Bulk actions
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredOrders.map((o) => o.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkStatusChange = (status) => {
    setOrders((prev) =>
      prev.map((o) => (selectedIds.includes(o.id) ? { ...o, status } : o))
    );
    showToast(`Updated ${selectedIds.length} orders to "${status}"`);
    setSelectedIds([]);
  };

  // Single order status update
  const handleUpdateStatus = async () => {
    if (!statusChangeOrder || !newStatus) return;
    try {
      if (statusChangeOrder.rawId) {
        await updateAdminOrderStatus(
          statusChangeOrder.rawId,
          newStatus.toLowerCase()
        );
      }
      setOrders((prev) =>
        prev.map((o) =>
          o.id === statusChangeOrder.id ? { ...o, status: newStatus } : o
        )
      );
      showToast(`Order #${statusChangeOrder.id} status changed to ${newStatus}`);
    } catch (err) {
      console.error("Failed to update status on server:", err);
      showToast(`Updated status locally for #${statusChangeOrder.id}`);
    } finally {
      setStatusChangeOrder(null);
    }
  };


  return (
    <div className="space-y-6 pb-12">
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
              <ShoppingBag className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900">Orders Management</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Track customer orders, confirm cash-on-delivery shipments, and manage deliveries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/orders/create">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-sm font-medium">
              <PlusCircle className="w-4 h-4" />
              Create Manual Order
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Orders
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{orders.length}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
              Pending Confirmation
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{tabCounts["Pending"] || 0}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider">
              In Transit (Shipped)
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{tabCounts["Shipped"] || 0}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <Truck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              Delivered Completed
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{tabCounts["Delivered"] || 0}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tabs & Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 overflow-x-auto bg-slate-50/50">
          {[
            { id: "all", label: "All Orders" },
            { id: "Pending", label: "Pending" },
            { id: "Processing", label: "Processing" },
            { id: "Shipped", label: "Shipped" },
            { id: "Delivered", label: "Delivered" },
            { id: "Cancelled", label: "Cancelled" },
          ].map((tab) => {
            const count = tab.id === "all" ? orders.length : tabCounts[tab.id] || 0;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? "border-indigo-600 text-indigo-600 bg-white"
                    : "border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100/50"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                    isActive ? "bg-indigo-100 text-indigo-700" : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Bulk Toolbar */}
        <div className="p-4 space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="w-full sm:w-96 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by Order ID, Customer name, Phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 w-full sm:w-auto justify-end">
              <span>Showing {filteredOrders.length} orders</span>
            </div>
          </div>

          {/* Bulk actions */}
          {selectedIds.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 bg-indigo-50 border border-indigo-100 rounded-lg">
              <span className="text-xs font-semibold text-indigo-900">
                {selectedIds.length} orders selected
              </span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkStatusChange("Processing")}
                  className="text-xs h-8 text-blue-700 border-blue-300 hover:bg-blue-50"
                >
                  Mark Processing
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkStatusChange("Shipped")}
                  className="text-xs h-8 text-purple-700 border-purple-300 hover:bg-purple-50"
                >
                  Mark Shipped
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkStatusChange("Delivered")}
                  className="text-xs h-8 text-emerald-700 border-emerald-300 hover:bg-emerald-50"
                >
                  Mark Delivered
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkStatusChange("Cancelled")}
                  className="text-xs h-8 text-rose-700 border-rose-300 hover:bg-rose-50"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto border-t border-slate-200">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-xs uppercase tracking-wider">
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={
                      filteredOrders.length > 0 &&
                      selectedIds.length === filteredOrders.length
                    }
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4">Order Reference</th>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4">Items Ordered</th>
                <th className="py-3 px-4">Payment & Total</th>
                <th className="py-3 px-4">Courier / Delivery</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400">
                    <ShoppingBag className="w-12 h-12 mx-auto stroke-1 text-slate-300 mb-2" />
                    <p className="text-base font-medium text-slate-600">No orders found</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Try selecting a different status tab or search query.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isChecked = selectedIds.includes(order.id);
                  const itemCount = order.items.reduce((acc, i) => acc + i.quantity, 0);

                  return (
                    <tr
                      key={order.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isChecked ? "bg-indigo-50/30" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-4">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSelect(order.id)}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                        />
                      </td>

                      {/* Order ID & Date */}
                      <td className="py-3.5 px-4">
                        <div>
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="font-bold text-slate-900 hover:text-indigo-600 font-mono text-sm transition-colors"
                          >
                            {order.id}
                          </Link>
                          <div className="text-xs text-slate-400 mt-0.5">
                            {order.created_at}
                          </div>
                        </div>
                      </td>

                      {/* Customer Info */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <p className="font-semibold text-slate-900">{order.customer.name}</p>
                          <a
                            href={`tel:${order.customer.phone}`}
                            className="text-xs font-mono text-indigo-600 hover:underline flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3" />
                            {order.customer.phone}
                          </a>
                          <div className="text-[11px] text-slate-400 truncate max-w-[200px]" title={order.shipping.address}>
                            {order.shipping.city}
                          </div>
                        </div>
                      </td>

                      {/* Items */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2 overflow-hidden shrink-0">
                            {order.items.slice(0, 2).map((item, idx) => (
                              <img
                                key={idx}
                                src={item.image}
                                alt={item.name}
                                className="inline-block h-8 w-8 rounded-md ring-2 ring-white object-cover bg-slate-100"
                              />
                            ))}
                          </div>
                          <div>
                            <span className="font-medium text-slate-800 text-xs">
                              {order.items[0]?.name}
                            </span>
                            {order.items.length > 1 && (
                              <span className="text-[11px] text-slate-500 ml-1">
                                +{order.items.length - 1} more
                              </span>
                            )}
                            <div className="text-[11px] text-slate-400">
                              {itemCount} unit{itemCount > 1 ? "s" : ""}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Total & Payment */}
                      <td className="py-3.5 px-4">
                        <div>
                          <div className="font-bold text-slate-900">
                            ৳{order.grand_total.toLocaleString()}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            {order.payment_method}
                          </div>
                          <span
                            className={`inline-block text-[10px] font-bold px-1.5 py-0.2 rounded mt-0.5 ${
                              order.payment_status === "Paid"
                                ? "bg-emerald-100 text-emerald-700"
                                : order.payment_status === "Refunded"
                                ? "bg-slate-100 text-slate-600"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {order.payment_status}
                          </span>
                        </div>
                      </td>

                      {/* Delivery */}
                      <td className="py-3.5 px-4">
                        <div className="text-xs space-y-0.5">
                          <span className="font-medium text-slate-700">
                            {order.courier || "Not assigned"}
                          </span>
                          {order.tracking_code ? (
                            <div className="font-mono text-[11px] text-indigo-600">
                              #{order.tracking_code}
                            </div>
                          ) : (
                            <div className="text-[11px] text-slate-400">Zone: {order.shipping.zone_name.split(" ")[0]}</div>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            setStatusChangeOrder(order);
                            setNewStatus(order.status);
                          }}
                          className="hover:opacity-80 transition-opacity"
                        >
                          {getStatusBadge(order.status)}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            title="View Full Order"
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            title="Update Status"
                            onClick={() => {
                              setStatusChangeOrder(order);
                              setNewStatus(order.status);
                            }}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Change Status Modal */}
      {statusChangeOrder && (
        <Modal
          isOpen={!!statusChangeOrder}
          onClose={() => setStatusChangeOrder(null)}
          title={`Update Status: Order #${statusChangeOrder.id}`}
        >
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Change fulfillment status for{" "}
              <strong className="text-slate-900">{statusChangeOrder.customer.name}</strong>:
            </p>

            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium"
            >
              <option value="Pending">Pending (Waiting Confirmation)</option>
              <option value="Processing">Processing (Packaging in Warehouse)</option>
              <option value="Shipped">Shipped (Dispatched with Courier)</option>
              <option value="Delivered">Delivered (Completed)</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStatusChangeOrder(null)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleUpdateStatus}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Save Status
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
