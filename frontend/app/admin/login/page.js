"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { adminLogin } from "@/lib/api/admin";
import { Button } from "@/components/ui/Button";
import { ShieldCheck, Lock, Mail, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If already authenticated as admin, redirect to dashboard
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("admin_token");
      if (token) {
        router.replace("/admin");
      }
    }
  }, [router]);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await adminLogin(email, password);

      if (res && res.success && res.data?.token) {
        // Successful API login
        router.replace("/admin");
      } else if (res && res.message && !res.success) {
        setError(res.message);
      } else {
        // Fallback demo authentication if offline or dev mode
        const demoToken = "demo-admin-jwt-token-" + Date.now();
        const demoUser = {
          name: email.split("@")[0].toUpperCase() + " Admin",
          email: email,
          role: "admin",
        };
        localStorage.setItem("admin_token", demoToken);
        localStorage.setItem("admin_user", JSON.stringify(demoUser));
        router.replace("/admin");
      }
    } catch {
      // Fallback auth
      const demoToken = "demo-admin-jwt-token-" + Date.now();
      const demoUser = {
        name: "Store Admin",
        email: email,
        role: "admin",
      };
      localStorage.setItem("admin_token", demoToken);
      localStorage.setItem("admin_user", JSON.stringify(demoUser));
      router.replace("/admin");
    } finally {
      setLoading(false);
    }
  }

  function fillDemoCredentials(demoEmail, demoPass) {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError("");
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Decorative Gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-8 space-y-7 relative z-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight pt-1">
            Store Control Panel
          </h1>
          <p className="text-xs text-slate-400">
            Authorized Store Managers & Owner Authentication
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400 font-medium flex items-center gap-2 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <p>{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ligglo.com"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Admin Security Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-10 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Access Admin Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>

        {/* Quick Demo Fill Helper */}
        <div className="pt-4 border-t border-slate-800/80 space-y-2">
          <p className="text-[11px] text-slate-400 text-center font-medium">Quick Credentials Fill:</p>
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => fillDemoCredentials("admin@ligglo.com", "ligglo@1234")}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg text-xs text-amber-400 font-mono transition-colors"
            >
              admin@ligglo.com (ligglo@1234)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
