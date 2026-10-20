"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
// import { useCategories } from "@/app/shared/lib/hooks/useCategories";
// import { useCategoryStore } from "@/app/store/useCategoryStore";
// import { useProducts } from "@/app/shared/lib/hooks/useProducts";
import { CategoriesType, ProductsType } from "../types";
import { ProductCard } from "@/app/components";
import { FilterIcon } from "@/app/shared/icons";
import { useProductFilters } from "./shared/lib/useProductFilters";
import { FilterBottomSheet } from "./desktop/FilterBottomSheet";
import { FilterPanel } from "./shared/ui/FilterPanel";
import Link from "next/link";
import { useBrands } from "../hooks/brands/useBrands";
import { useProducts } from "../hooks/products/useProducts";
import { useCategories } from "../hooks/categories/useCategories";

function normalizeProducts(products: ProductsType[]): ProductsType[] {
  return products
    ?.filter(
      (p) => Array.isArray(p.images) && p.images.length > 0 && p.images[0]?.url,
    )
    .map((p) => ({
      ...p,
      mainImage:
        `https://api.bunyodoptom.uz${p.images[0]?.url}` &&
        `https://api.bunyodoptom.uz${p.images[1]?.url}`,
    }));
}

export default function CategoriesPage() {
  const router = useRouter();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: allProducts, isLoading: productsLoading } = useProducts();
  const { data: brands } = useBrands();
  // const { selectedCategoryId, setSelectedCategoryId } = useCategoryStore();

  const [sheetOpen, setSheetOpen] = useState(false);

  const products = normalizeProducts(allProducts);

  // Desktop: use selectedCategoryId or fall back to first category
  // const desktopCategoryId =
  //   selectedCategoryId ?? (categories?.[0]?.id || 0);

  // const activeCategory = categories?.find(
  //   (c: CategoriesType) => c.id === selectedCategoryId,
  // );

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
  } = useProductFilters(products);

  const productsReady = !productsLoading && !!products;

  const handleMobileClick = (category: CategoriesType) => {
    // setSelectedCategoryId(category.id);
    router.push(`/categories/${category.id}`);
  };

  const handleDesktopCategoryClick = (category: CategoriesType) => {
    // setSelectedCategoryId(category.id);
  };

  return (
    <>
      {/* ── MOBILE: category grid ─────────────────────────────── */}
      <div className="flex flex-col h-full lg:hidden mt-20">
        {categoriesLoading ? (
          <div className="grid grid-cols-2 gap-3 px-4 pb-24 mt-5">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-gray-100 animate-pulse aspect-square [animation-fill-mode:both]"
                style={{ animationDelay: `${i * 60}ms` }}
              />
            ))}
          </div>
        ) : (
          <>
            {/* <div className="px-4 pt-5 pb-3">
              <h1 className="text-xl font-bold text-gray-900">Katalog</h1>
              <p className="text-sm text-gray-400 mt-0.5">
                {categories?.length ?? 0} ta kategoriya
              </p>
            </div> */}

            <div className="grid grid-cols-2 gap-3 px-4 pb-24">
              {categories?.map((category: CategoriesType) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleMobileClick(category)}
                  className="flex flex-col bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm active:scale-[0.97] transition-transform text-left"
                >
                  <div className="w-full aspect-4/3 relative overflow-hidden rounded-2xl">
                    <Image
                      src={
                        category.image
                          ? `https://api.bunyodoptom.uz${category.image}`
                          : "/placeholder.png"
                      }
                      alt={category.name}
                      fill
                      sizes="(max-width: 640px) 45vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="pl-4 px-4 py-2">
                    <p className="text-lg font-semibold text-primary leading-snug line-clamp-2 text-center truncate">
                      {category.name}
                    </p>
                  </div>
                </button>
              ))}

              {categories?.length === 0 && (
                <div className="col-span-2 text-center text-gray-400 text-sm py-12">
                  Kategoriyalar topilmadi
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* ── DESKTOP: sidebar categories + filter + products ───── */}
      <section className="hidden lg:block">
        <div className="container">
          <div className="flex h-full overflow-hidden mt-24">
            {/* Main area */}
            <div className="flex flex-col flex-1 overflow-hidden pl-5">
              {/* Header */}
              <div className="flex items-center gap-3 pb-4 shrink-0">
                <div className="flex-1 min-w-0">
                  {/* {categoriesLoading ? (
                    <div className="h-5 w-32 bg-gray-100 animate-pulse rounded-lg" />
                  ) : ( */}
                  <h1 className="text-lg font-bold text-gray-900 truncate">
                    {"Mahsulotlar"}
                  </h1>
                  {/* )} */}
                  {productsReady && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {filtered.length} ta mahsulot
                    </p>
                  )}
                </div>
                {activeCount > 0 && (
                  <button
                    onClick={resetAll}
                    className="text-xs text-primary font-medium hover:underline"
                  >
                    Tozalash
                  </button>
                )}
              </div>

              {/* Filter sidebar + products */}
              <div className="flex flex-1 overflow-hidden gap-4">
                {/* Filter panel */}
                <aside className="w-56 shrink-0 overflow-y-auto sticky top-5">
                  <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 flex flex-col gap-4">
                    <p className="text-xs font-bold text-gray-900">Filtr</p>
                    <FilterPanel
                      filters={filters}
                      onChange={setFilters}
                      brands={brands}
                      categories={categories}
                      // defaultCategoryId={desktopCategoryId}
                    />
                  </div>
                </aside>

                {/* Products grid */}
                <div className="flex-1 overflow-y-auto pb-10">
                  {!productsReady ? (
                    <div className="grid grid-cols-3 xl:grid-cols-4 gap-3">
                      {Array.from({ length: 8 }).map((_, i) => (
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
                          onClick={resetAll}
                          className="mt-3 px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium"
                        >
                          Filtrni tozalash
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 xl:grid-cols-4 gap-3">
                      {filtered.map((product: ProductsType, i) => (
                        // <Link key={i} href={`/product/${product.id}`}>
                        <ProductCard product={product} />
                        // </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile filter bottom sheet (unused on this page but kept for consistency) */}
      <FilterBottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        pendingFilters={pendingFilters}
        setPendingFilters={setPendingFilters}
        onApply={applyPending}
        onReset={resetPending}
        brands={brands}
        categories={categories}
        // defaultCategoryId={desktopCategoryId}
      />
    </>
  );
}
