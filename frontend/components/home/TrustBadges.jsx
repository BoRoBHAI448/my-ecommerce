import { Truck, ShieldCheck, RefreshCw, Headphones } from "lucide-react";

export function TrustBadges() {
  const badges = [
    {
      icon: Truck,
      title: "Fast Nationwide Delivery",
      description: "24-48h in Dhaka, 3-4 days nationwide",
    },
    {
      icon: ShieldCheck,
      title: "Doorstep Inspection",
      description: "Inspect before payment with full COD",
    },
    {
      icon: RefreshCw,
      title: "7-Day Easy Exchange",
      description: "Hassle-free size replacement guarantee",
    },
    {
      icon: Headphones,
      title: "Concierge Support",
      description: "Dedicated assistance 7 days a week",
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-white border-t border-neutral-200/80">
      <div className="container-custom">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {badges.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-neutral-50 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-neutral-100 text-neutral-900 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-neutral-950 mb-0.5">
                    {b.title}
                  </h3>
                  <p className="text-xs text-neutral-500 font-normal leading-relaxed">
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
