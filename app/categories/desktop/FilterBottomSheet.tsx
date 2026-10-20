"use client";

import { useEffect } from "react";
import { FilterState } from "../shared/lib/useProductFilters";
import { CategoriesType } from "@/app/types";
import { FilterPanel } from "../shared/ui/FilterPanel";

interface Brand {
  id: number;
  name: string;
  image: string;
}

interface FilterBottomSheetProps {
  open: boolean;
  onClose: () => void;
  pendingFilters: FilterState;
  setPendingFilters: (f: FilterState) => void;
  onApply: () => void;
  onReset: () => void;
  brands?: Brand[];
  categories?: CategoriesType[];
  defaultCategoryId?: number;
}

export function FilterBottomSheet({
  open,
  onClose,
  pendingFilters,
  setPendingFilters,
  onApply,
  onReset,
  brands,
  categories,
  defaultCategoryId,
}: FilterBottomSheetProps) {
  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-sheet-title"
        className="fixed w-full flex-1 bottom-0 left-0 z-50 lg:hidden bg-white rounded-t-3xl max-h-[85vh] flex flex-col animate-slide-up"
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        {/* Title */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 shrink-0">
          <h2 id="filter-sheet-title" className="text-base font-bold text-gray-900">
            Filtr
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Yopish"
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 text-gray-500"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <FilterPanel
            filters={pendingFilters}
            onChange={setPendingFilters}
            brands={brands}
            categories={categories}
            defaultCategoryId={defaultCategoryId}
          />
        </div>

        {/* Actions */}
        <div className="shrink-0 px-5 py-4 border-t border-gray-100 flex gap-3">
          <button
            type="button"
            onClick={() => {
              onReset();
              onClose();
            }}
            className="flex-1 py-3 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Tozalash
          </button>
          <button
            type="button"
            onClick={() => {
              onApply();
              onClose();
            }}
            className="flex-1 py-3 rounded-2xl bg-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Qo'llash
          </button>
        </div>
      </div>
    </>
  );
}