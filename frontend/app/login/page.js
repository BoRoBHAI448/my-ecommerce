"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { isValidBDPhone } from "@/lib/validators";
import { Lock, Phone, UserCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!isValidBDPhone(phone)) {
      setError("Please enter a valid 11-digit mobile number (e.g. 017XXXXXXXX)");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      // Simulate success
      router.push("/account/orders");
    }, 600);
  }

  return (
    <div className="container-custom py-8 sm:py-16 max-w-md">
      <Breadcrumbs items={[{ label: "Login" }]} />

      <div className="p-6 sm:p-8 rounded-theme bg-surface border border-border/80 shadow-2xs space-y-6 mt-4">
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2">
            <UserCheck className="w-6 h-6" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-text tracking-tight">
            Customer Login
          </h1>
          <p className="text-xs text-text-muted">
            Enter your mobile number and password to access your account
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-theme bg-red-50 border border-red-200 text-xs text-danger font-medium animate-in fade-in">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Mobile Number"
            type="tel"
            placeholder="01712345678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            leftIcon={<Phone className="w-4 h-4 text-text-muted" />}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4 text-text-muted" />}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={loading}
            className="w-full font-bold h-11 shadow-sm"
          >
            Sign In
          </Button>
        </form>

        <div className="text-center pt-2 border-t border-border/80 text-xs text-text-muted">
          <span>Don&apos;t have an account yet? </span>
          <Link href="/register" className="font-bold text-secondary hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
