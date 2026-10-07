import { cn } from "@/lib/utils";

export function Badge({
  children,
  variant = "default",
  size = "md",
  className,
  ...props
}) {
  const variantClasses = {
    default: "bg-muted text-text-muted",
    primary: "bg-primary text-primary-contrast",
    secondary: "bg-secondary text-secondary-contrast",
    sale: "bg-danger text-white font-bold tracking-wider",
    new: "bg-emerald-600 text-white font-semibold",
    success: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    warning: "bg-amber-100 text-amber-800 border border-amber-200",
    danger: "bg-red-100 text-red-800 border border-red-200",
    outline: "bg-transparent border border-border text-text",
  }[variant] || "bg-muted text-text-muted";

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
  }[size] || "px-2.5 py-1 text-xs";

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full uppercase tracking-wider select-none shrink-0",
        variantClasses,
        sizeClasses,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
