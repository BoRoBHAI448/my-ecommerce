"use client";

import { useState } from "react";
import { formatPrice, formatDate } from "@/lib/format";
import { Users, Search, Phone, ShoppingBag, DollarSign } from "lucide-react";

export default function AdminCustomersPage() {
  const [search, setSearch] = useState("");

  const mockCustomers = [
    {
      id: "CUST-001",
      name: "Tanvir Ahmed",
      phone: "01711223344",
      email: "tanvir.ahmed@example.com",
      ordersCount: 5,
      totalSpent: 14250,
      joinedAt: "2026-08-14",
      status: "Active",
    },
    {
      id: "CUST-002",
      name: "Farhana Yasmin",
      phone: "01822334455",
      email: "farhana.y@example.com",
      ordersCount: 3,
      totalSpent: 8700,
      joinedAt: "2026-09-02",
      status: "Active",
    },
    {
      id: "CUST-003",
      name: "Mahfuz Khan",
      phone: "01933445566",
      email: "mahfuz.khan@example.com",
      ordersCount: 6,
      totalSpent: 21500,
      joinedAt: "2026-07-19",
      status: "VIP",
    },
    {
      id: "CUST-004",
      name: "Sadia Islam",
      phone: "01644556677",
      email: "sadia.islam@example.com",
      ordersCount: 1,
      totalSpent: 2950,
      joinedAt: "2026-10-04",
      status: "Active",
    },
  ];

  const filteredCustomers = mockCustomers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Customer Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Directory of registered and guest customers who placed orders on your store
          </p>
        </div>

        {/* Quick KPI count */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
          <Users className="w-4 h-4 text-amber-600" />
          <span>{mockCustomers.length} Total Registered Customers</span>
        </div>
      </div>

      {/* Customer Directory Table with Live Search */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden space-y-4">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <input
              type="search"
              placeholder="Search by customer name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          </div>

          <span className="text-xs text-slate-400 font-medium">
            Showing {filteredCustomers.length} of {mockCustomers.length} customers
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Customer Name</th>
                <th className="py-3.5 px-4">Phone Number</th>
                <th className="py-3.5 px-4">Orders Placed</th>
                <th className="py-3.5 px-4">Total Spent</th>
                <th className="py-3.5 px-4">Joined Date</th>
                <th className="py-3.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredCustomers.map((cust) => (
                <tr key={cust.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-900 text-amber-400 font-bold text-xs flex items-center justify-center shrink-0">
                        {cust.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm leading-tight">
                          {cust.name}
                        </p>
                        <p className="text-[11px] text-slate-400">{cust.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">
                    {cust.phone}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 font-bold text-slate-900">
                      <ShoppingBag className="w-3.5 h-3.5 text-slate-400" />
                      {cust.ordersCount} orders
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-black text-slate-900 text-sm">
                    {formatPrice(cust.totalSpent)}
                  </td>

                  <td className="py-3.5 px-4 text-slate-500">
                    {formatDate(cust.joinedAt)}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        cust.status === "VIP"
                          ? "bg-amber-100 text-amber-900 border border-amber-300"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {cust.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
