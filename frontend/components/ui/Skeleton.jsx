import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-theme bg-slate-200/80",
        className
      )}
      {...props}
    />
  );
}
