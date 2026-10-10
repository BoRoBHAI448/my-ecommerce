import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatPrice, formatDate } from "@/lib/format";
import { Package, ExternalLink, ArrowRight } from "lucide-react";

export const metadata = {
  title: "My Orders",
  description: "View and track your previous purchases at LIGGLO Atelier.",
};

export default function AccountOrdersPage() {
  const sampleOrders = [
    {
      id: "APX-892104",
      date: "2026-10-05T14:20:00Z",
      status: "Processing",
      total: 3700,
      paymentMethod: "Cash on Delivery",
      items: [
        { name: "Classic Supima Cotton Oxford Shirt", quantity: 1, variant: "Size: L / White", price: 1850 },
        { name: "Minimalist Leather Bi-Fold Wallet", quantity: 1, variant: "Color: Saddle", price: 1150 },
      ],
    },
    {
      id: "APX-771420",
      date: "2026-09-22T11:05:00Z",
      status: "Delivered",
      total: 4500,
      paymentMethod: "Cash on Delivery",
      items: [
        { name: "Handcrafted Heritage Penny Loafer", quantity: 1, variant: "Size: 42 / Tan", price: 4500 },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <h2 className="text-base font-bold text-text uppercase tracking-wider">
          Order History ({sampleOrders.length})
        </h2>
      </div>

      <div className="space-y-4">
        {sampleOrders.map((ord) => (
          <div
            key={ord.id}
            className="p-5 rounded-theme bg-surface border border-border/80 shadow-2xs space-y-4"
          >
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border text-xs">
              <div>
                <span className="text-text-muted">Order ID: </span>
                <span className="font-mono font-bold text-text">{ord.id}</span>
                <span className="text-text-muted mx-2">•</span>
                <span className="text-text-muted">{formatDate(ord.date)}</span>
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  variant={ord.status === "Delivered" ? "success" : "warning"}
                  size="sm"
                >
                  {ord.status}
                </Badge>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2">
              {ord.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-xs">
                  <div>
                    <p className="font-semibold text-text">{item.name}</p>
                    {item.variant && (
                      <p className="text-[11px] text-text-muted">{item.variant}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-text">
                      {formatPrice(item.price)}
                    </span>
                    <span className="text-text-muted ml-1">x {item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border">
              <div className="text-xs">
                <span className="text-text-muted">Total Paid: </span>
                <span className="font-bold text-sm text-text">
                  {formatPrice(ord.total)}
                </span>
                <span className="text-[10px] text-text-muted ml-1">({ord.paymentMethod})</span>
              </div>

              <Link href={`/track-order?order=${ord.id}`}>
                <Button
                  variant="outline"
                  size="sm"
                  rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
                  className="text-xs"
                >
                  Track Parcel
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
