import { cn } from "@/lib/utils";

export function Spinner({ size = "md", className, ...props }) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-5 h-5 border-2",
    lg: "w-8 h-8 border-3",
  }[size] || "w-5 h-5 border-2";

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "inline-block rounded-full border-solid border-current border-r-transparent animate-spin align-[-0.125em]",
        sizeClasses,
        className
      )}
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
