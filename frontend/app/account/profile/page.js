"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Check } from "lucide-react";

export default function AccountProfilePage() {
  const [profile, setProfile] = useState({
    name: "Asif Mahmud",
    phone: "01711223344",
    email: "asif.mahmud@example.com",
    address: "House 14, Road 5, Dhanmondi, Dhaka-1205",
  });

  const [saved, setSaved] = useState(false);

  function handleSave(e) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6">
      <div className="pb-3 border-b border-border">
        <h2 className="text-base font-bold text-text uppercase tracking-wider">
          Profile & Address Settings
        </h2>
        <p className="text-xs text-text-muted mt-0.5">
          Keep your default shipping address and contact details up to date
        </p>
      </div>

      <div className="p-6 rounded-theme bg-surface border border-border/80 shadow-2xs">
        <form onSubmit={handleSave} className="space-y-4 max-w-lg">
          <Input
            label="Full Name"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            required
          />

          <Input
            label="Phone Number"
            type="tel"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            required
          />

          <Input
            label="Email Address"
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />

          <Input
            label="Default Delivery Address"
            value={profile.address}
            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
            required
          />

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              leftIcon={saved ? <Check className="w-4 h-4 text-emerald-400" /> : undefined}
            >
              {saved ? "Saved Successfully!" : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
