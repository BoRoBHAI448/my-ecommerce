"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { isValidBDPhone } from "@/lib/validators";
import { User, Phone, Lock, UserPlus } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Full name is required");
      return;
    }

    if (!isValidBDPhone(phone)) {
      setError("Please enter a valid 11-digit mobile number (e.g. 017XXXXXXXX)");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      router.push("/account/profile");
    }, 600);
  }

  return (
    <div className="container-custom py-8 sm:py-16 max-w-md">
      <Breadcrumbs items={[{ label: "Register" }]} />

      <div className="p-6 sm:p-8 rounded-theme bg-surface border border-border/80 shadow-2xs space-y-6 mt-4">
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-text tracking-tight">
            Create an Account
          </h1>
          <p className="text-xs text-text-muted">
            Track your orders, save delivery addresses, and enjoy faster checkouts
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-theme bg-red-50 border border-red-200 text-xs text-danger font-medium animate-in fade-in">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="e.g. Asif Mahmud"
            value={name}
            onChange={(e) => setName(e.target.value)}
            leftIcon={<User className="w-4 h-4 text-text-muted" />}
            required
          />

          <Input
            label="Mobile Number (01XXXXXXXXX)"
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
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4 text-text-muted" />}
            required
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Repeat password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            Create Account
          </Button>
        </form>

        <div className="text-center pt-2 border-t border-border/80 text-xs text-text-muted">
          <span>Already registered? </span>
          <Link href="/login" className="font-bold text-secondary hover:underline">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}
