"use client";

import { Drawer } from "@/components/ui/Drawer";
import { FilterSidebar } from "./FilterSidebar";

export function FilterDrawer({ isOpen, onClose, categories = [], brands = [] }) {
  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Filters" side="left" size="sm">
      <div className="py-2">
        <FilterSidebar categories={categories} brands={brands} />
      </div>
    </Drawer>
  );
}
