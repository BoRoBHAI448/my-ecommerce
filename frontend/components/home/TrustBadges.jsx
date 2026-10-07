import { Truck, ShieldCheck, RefreshCw, Headphones } from "lucide-react";

export function TrustBadges() {
  const badges = [
    {
      icon: Truck,
      title: "Nationwide Fast Delivery",
      description: "Quick 24-48h delivery inside Dhaka, 3-4 days nationwide",
    },
    {
      icon: ShieldCheck,
      title: "Cash on Delivery",
      description: "Inspect parcel at your doorstep before final payment",
    },
    {
      icon: RefreshCw,
      title: "7-Day Easy Exchange",
      description: "Hassle-free size and product replacement guarantee",
    },
    {
      icon: Headphones,
      title: "Dedicated Support",
      description: "Call or chat on WhatsApp 7 days a week from 9 AM",
    },
  ];

  return (
    <section className="py-10 sm:py-14 bg-muted/40 border-t border-border/70">
      <div className="container-custom">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {badges.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 rounded-theme bg-surface border border-border/60 shadow-2xs"
              >
                <div className="w-12 h-12 rounded-full bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text mb-1">{b.title}</h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    {b.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
