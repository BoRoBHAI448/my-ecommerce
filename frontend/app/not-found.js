import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Compass, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center p-8 rounded-theme bg-surface border border-border shadow-xs">
        <div className="w-16 h-16 rounded-full bg-muted text-text-muted flex items-center justify-center mx-auto mb-4">
          <Compass className="w-8 h-8 animate-spin-slow" />
        </div>
        <span className="text-4xl font-black text-secondary">404</span>
        <h2 className="text-xl font-bold text-text mt-1 mb-2">Page Not Found</h2>
        <p className="text-xs sm:text-sm text-text-muted mb-6">
          The page you are looking for might have been moved, renamed, or is temporarily unavailable.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/" className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="md"
              leftIcon={<Home className="w-4 h-4" />}
              className="w-full sm:w-auto"
            >
              Return Home
            </Button>
          </Link>
          <Link href="/shop" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="md"
              leftIcon={<Search className="w-4 h-4" />}
              className="w-full sm:w-auto"
            >
              Browse Shop
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
