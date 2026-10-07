import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "./Spinner";

export const Button = forwardRef(function Button(
  {
    children,
    type = "button",
    variant = "primary",
    size = "md",
    isLoading = false,
    disabled = false,
    className,
    leftIcon,
    rightIcon,
    ...props
  },
  ref
) {
  const baseClasses =
    "inline-flex items-center justify-center font-medium transition-all duration-200 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed";

  const variantClasses = {
    primary:
      "bg-primary text-primary-contrast hover:bg-primary-hover focus-visible:ring-primary shadow-sm active:scale-[0.99]",
    secondary:
      "bg-secondary text-secondary-contrast hover:bg-secondary-hover focus-visible:ring-secondary shadow-sm active:scale-[0.99]",
    outline:
      "border border-border bg-surface text-text hover:bg-muted hover:text-text focus-visible:ring-primary shadow-xs",
    ghost:
      "text-text hover:bg-muted focus-visible:ring-primary",
    danger:
      "bg-danger text-white hover:bg-red-600 focus-visible:ring-danger shadow-sm active:scale-[0.99]",
  }[variant] || variantClasses.primary;

  const sizeClasses = {
    sm: "h-8 px-3 text-xs gap-1.5 rounded-theme",
    md: "h-10 px-4 text-sm gap-2 rounded-theme",
    lg: "h-12 px-6 text-base gap-2.5 rounded-theme",
    icon: "h-10 w-10 p-0 rounded-theme",
  }[size] || sizeClasses.md;

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      className={cn(baseClasses, variantClasses, sizeClasses, className)}
      {...props}
    >
      {isLoading ? (
        <Spinner size={size === "lg" ? "md" : "sm"} className="text-current" />
      ) : (
        leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
      )}
      {children}
      {!isLoading && rightIcon && (
        <span className="inline-flex shrink-0">{rightIcon}</span>
      )}
    </button>
  );
});
