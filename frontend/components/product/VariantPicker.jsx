"use client";

import { cn } from "@/lib/utils";

export function VariantPicker({
  options = [],
  variants = [],
  selectedAttributes = {},
  onSelect,
}) {
  if (!options || options.length === 0) return null;

  return (
    <div className="space-y-4">
      {options.map((optionGroup) => {
        const groupName = optionGroup.name;
        const currentSelected = selectedAttributes[groupName];

        return (
          <div key={groupName} className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-text">
                {groupName}: <span className="text-secondary font-bold">{currentSelected || "Select"}</span>
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {optionGroup.values.map((val) => {
                const isSelected = currentSelected === val;

                // Check if this option combination is in stock in any variant
                const hypotheticalAttrs = { ...selectedAttributes, [groupName]: val };
                const matchingVariant = variants.find((v) =>
                  Object.entries(hypotheticalAttrs).every(
                    ([k, vVal]) => !vVal || v.attributes[k] === vVal
                  )
                );

                const isOutOfStock = matchingVariant && !matchingVariant.in_stock;

                return (
                  <button
                    key={val}
                    type="button"
                    disabled={isOutOfStock}
                    onClick={() => onSelect(groupName, val)}
                    className={cn(
                      "min-w-10 h-9 px-3 rounded-theme text-xs font-bold transition-all duration-200 border",
                      isSelected
                        ? "bg-primary text-primary-contrast border-primary shadow-xs"
                        : "bg-surface text-text border-border hover:border-text-muted hover:bg-muted/50",
                      isOutOfStock &&
                        "opacity-40 cursor-not-allowed bg-muted line-through text-text-muted border-border/50"
                    )}
                  >
                    {val}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
