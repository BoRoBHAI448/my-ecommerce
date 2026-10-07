import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Rating({
  value = 0,
  max = 5,
  size = "md",
  count,
  interactive = false,
  onChange,
  className,
}) {
  const sizeClasses = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  }[size] || "w-4 h-4";

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: max }).map((_, i) => {
          const filled = i < Math.floor(value);
          const half = !filled && i < value;

          return (
            <button
              key={i}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onChange && onChange(i + 1)}
              className={cn(
                "transition-colors",
                interactive ? "cursor-pointer hover:scale-110" : "cursor-default pointer-events-none"
              )}
              aria-label={`${i + 1} stars`}
            >
              <Star
                className={cn(
                  sizeClasses,
                  filled
                    ? "fill-amber-400 text-amber-400"
                    : half
                    ? "fill-amber-200 text-amber-400"
                    : "fill-slate-100 text-slate-300"
                )}
              />
            </button>
          );
        })}
      </div>

      {value > 0 && (
        <span className="text-xs font-semibold text-text ml-0.5">
          {Number(value).toFixed(1)}
        </span>
      )}

      {typeof count === "number" && (
        <span className="text-xs text-text-muted">({count})</span>
      )}
    </div>
  );
}
