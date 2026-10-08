"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { useAuth } from "@/lib/auth-context";
import { isValidBDPhone } from "@/lib/validators";
import { Lock, Phone, UserCheck, ArrowRight } from "lucide-react";

// Separated into inner component so useSearchParams works inside Suspense
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoggedIn } = useAuth();

  const redirect = searchParams.get("redirect") || "/account/orders";

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Already logged in → bounce away
  useEffect(() => {
    if (isLoggedIn) router.replace(redirect);
  }, [isLoggedIn, redirect, router]);

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!isValidBDPhone(phone)) {
      setError("সঠিক ১১ সংখ্যার মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)");
      return;
    }
    if (!password) {
      setError("পাসওয়ার্ড দিন");
      return;
    }

    setLoading(true);
    const result = login({ phone, password });
    setLoading(false);

    if (!result.success) {
      setError(result.error);
    } else {
      router.replace(redirect);
    }
  }

  return (
    <div className="p-6 sm:p-8 rounded-theme bg-surface border border-border/80 shadow-2xs space-y-6 mt-4">
      <div className="text-center space-y-1">
        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2">
          <UserCheck className="w-6 h-6" />
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-text tracking-tight">
          Customer Login
        </h1>
        <p className="text-xs text-text-muted">
          মোবাইল নম্বর ও পাসওয়ার্ড দিয়ে সাইন ইন করুন
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-theme bg-red-50 border border-red-200 text-xs text-danger font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="মোবাইল নম্বর"
          type="tel"
          placeholder="01712345678"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          leftIcon={<Phone className="w-4 h-4 text-text-muted" />}
          required
        />

        <Input
          label="পাসওয়ার্ড"
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
          সাইন ইন করুন <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </form>

      <div className="text-center pt-2 border-t border-border/80 text-xs text-text-muted space-y-1">
        <div>
          <span>নতুন অ্যাকাউন্ট? </span>
          <Link
            href={`/register?redirect=${encodeURIComponent(redirect)}`}
            className="font-bold text-secondary hover:underline"
          >
            এখানে রেজিস্ট্রেশন করুন
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="container-custom py-8 sm:py-16 max-w-md">
      <Breadcrumbs items={[{ label: "Login" }]} />
      <Suspense fallback={<div className="h-80 animate-pulse rounded-theme bg-muted mt-4" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
