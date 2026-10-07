"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error("Global application error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center p-8 rounded-theme bg-surface border border-border shadow-md">
        <div className="w-14 h-14 rounded-full bg-red-100 text-danger flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-text mb-2">Something went wrong!</h2>
        <p className="text-xs sm:text-sm text-text-muted mb-6">
          We encountered an unexpected error while loading this page. Our team has been notified.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="md"
            leftIcon={<RefreshCw className="w-4 h-4" />}
            onClick={() => reset()}
          >
            Try Again
          </Button>
          <Link href="/">
            <Button
              variant="primary"
              size="md"
              leftIcon={<Home className="w-4 h-4" />}
            >
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
