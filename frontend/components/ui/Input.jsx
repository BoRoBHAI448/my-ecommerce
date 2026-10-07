import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef(function Input(
  {
    label,
    error,
    helperText,
    id,
    type = "text",
    leftIcon,
    rightIcon,
    className,
    disabled = false,
    required = false,
    ...props
  },
  ref
) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-text uppercase tracking-wider mb-1.5"
        >
          {label}
          {required && <span className="text-danger ml-1">*</span>}
        </label>
      )}

      <div className="relative rounded-theme">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          disabled={disabled}
          required={required}
          className={cn(
            "block w-full rounded-theme border bg-surface text-text text-sm transition-colors duration-200 placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-muted disabled:text-text-muted disabled:cursor-not-allowed",
            "h-10 px-3 py-2",
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            error ? "border-danger focus:ring-danger" : "border-border",
            className
          )}
          {...props}
        />

        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted">
            {rightIcon}
          </div>
        )}
      </div>

      {error ? (
        <p className="mt-1 text-xs text-danger font-medium animate-fadeIn">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-text-muted">{helperText}</p>
      ) : null}
    </div>
  );
});
