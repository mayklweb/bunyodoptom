"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useProductFilters } from "../shared/lib/useProductFilters";
import { CategoriesType, ProductsType } from "@/app/types";
import { FilterPanel } from "../shared/ui/FilterPanel";
import { ProductCard } from "@/app/components";
import { FilterBottomSheet } from "../desktop/FilterBottomSheet";
import { FilterIcon } from "@/app/shared/icons";
import { useCategories } from "@/app/hooks/categories/useCategories";
import { useProducts } from "@/app/hooks/products/useProducts";
import { useBrands } from "@/app/hooks/brands/useBrands";
import { useCategoryStore } from "@/app/store/useCategoryStore";

export default function CategoryProductsPage() {
  const router = useRouter();
  const params = useParams();
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { selectedCategoryId, setSelectedCategoryId } = useCategoryStore();
  const id = rawId ? Number(rawId) : (selectedCategoryId ?? 0);

  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: allProducts, isLoading: productsLoading } = useProducts();
  const { data: brands } = useBrands();

  const [sheetOpen, setSheetOpen] = useState(false);

  const activeCategory = categories?.find((c: any) => Number(c.id) === id);

  const {
    filters,
    setFilters,
    pendingFilters,
    setPendingFilters,
    filtered,
    activeCount,
    applyPending,
    resetPending,
    resetAll,
  } = useProductFilters(allProducts, id);

  const productsReady = !productsLoading && !!allProducts;

  return (
    <section>
      <div className="container">
        <div>
          <div className="flex h-full overflow-hidden mt-20">
            {/* ── MAIN AREA ── */}
            <div className="flex flex-col flex-1 overflow-hidden">
              {/* Header */}
              <div className="flex items-center gap-3 pb-4 shrink-0">
                {/* Back button — mobile only */}
                <button
                  type="button"
                  onClick={() => router.back()}
                  aria-label="Orqaga"
                  className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 bg-white shrink-0"
                >
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <div className="flex-1 min-w-0">
                  {categoriesLoading ? (
                    <div className="h-5 w-32 bg-gray-100 animate-pulse rounded-lg" />
                  ) : (
                    <h1 className="text-base font-bold text-gray-900 truncate">
                      {activeCategory?.name ?? "Mahsulotlar"}
                    </h1>
                  )}
                  {productsReady && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {filtered.length} ta mahsulot
                    </p>
                  )}
                </div>

                {/* Mobile filter button */}
                <button
                  type="button"
                  onClick={() => {
                    setPendingFilters(filters);
                    setSheetOpen(true);
                  }}
                  className="lg:hidden relative flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600"
                >
                  <FilterIcon />
                  Filtr
                  {activeCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                      {activeCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Body: desktop filter panel + products */}
              <div className="flex flex-1 overflow-hidden gap-4">
                {/* Desktop filter sidebar */}
                <aside className="hidden lg:flex flex-col w-56 shrink-0 overflow-y-auto sticky top-5">
                  <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 flex flex-col gap-4">
                    <p className="text-xs font-bold text-gray-900">Filtr</p>
                    <FilterPanel
                      filters={filters}
                      onChange={setFilters}
                      brands={brands}
                      categories={categories}
                      defaultCategoryId={id}
                    />
                  </div>
                </aside>

                {/* Products grid */}
                <div className="flex-1 overflow-y-auto">
                  {!productsReady ? (
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div
                          key={i}
                          className="rounded-2xl bg-gray-100 animate-pulse aspect-4/3"
                        />
                      ))}
                    </div>
                  ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <span className="text-4xl mb-3">📦</span>
                      <p className="text-gray-500 text-sm font-medium">
                        Mahsulot topilmadi
                      </p>
                      {activeCount > 0 && (
                        <button
                          type="button"
                          onClick={resetAll}
                          className="mt-3 px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium"
                        >
                          Filtrni tozalash
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                      {filtered.map((product: ProductsType) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile bottom sheet */}
      <FilterBottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        pendingFilters={pendingFilters}
        setPendingFilters={setPendingFilters}
        onApply={applyPending}
        onReset={resetPending}
        brands={brands}
        categories={categories}
        defaultCategoryId={id}
      />
    </section>
  );
}