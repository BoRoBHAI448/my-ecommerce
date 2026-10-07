import { cn } from "@/lib/utils";
import { PackageOpen } from "lucide-react";
import { Button } from "./Button";

export function EmptyState({
  icon: Icon = PackageOpen,
  title = "No items found",
  description = "We couldn't find what you're looking for. Try adjusting your filters or search terms.",
  actionLabel,
  onAction,
  actionHref,
  className,
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-dashed border-border rounded-theme bg-surface/50",
        className
      )}
    >
      <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-text-muted mb-4 shadow-xs">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-semibold text-text mb-1">{title}</h3>
      <p className="text-sm text-text-muted max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {actionLabel && (
        actionHref ? (
          <a href={actionHref}>
            <Button variant="primary">{actionLabel}</Button>
          </a>
        ) : (
          <Button variant="primary" onClick={onAction}>
            {actionLabel}
          </Button>
        )
      )}
    </div>
  );
}
