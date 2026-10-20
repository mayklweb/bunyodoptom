"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CategoriesType } from "@/app/types";
import { useCategories } from "@/app/hooks/categories/useCategories";

function CategoriesSkeleton() {
  return (
    <section>
      <div className="container">
        <div className="mt-5">
          {/* Header skeleton */}
          <div className="flex items-center justify-between">
            <div className="h-9 md:h-10 lg:h-11 w-40 bg-gray-200 rounded-2xl animate-pulse" />
            <div className="w-32 h-5 bg-gray-200 rounded-full animate-pulse" />
          </div>

          {/* Grid skeleton */}
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2.5 mt-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div
                  className="w-full aspect-square rounded-[20px] bg-gray-200 animate-pulse [animation-fill-mode:both]"
                  style={{ animationDelay: `${i * 80}ms` }}
                />
                <div className="mt-2 h-3 w-3/4 bg-gray-200 rounded-full animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Categories() {
  const { data: categories, isLoading, isError } = useCategories();
  const router = useRouter();

  if (isLoading) return <CategoriesSkeleton />;
  if (isError) return <div>Error</div>;

  return (
    <section>
      <div className="container">
        <div className="mt-5">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Kategoriya
            </h3>
            <Link
              href="/catalog"
              className="flex items-center gap-1 text-primary font-semibold text-sm hover:text-secondary transition-colors"
            >
              <span>Barchasini ko'rish</span>
            </Link>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 mt-3">
            {[...categories]
              .reverse()
              .slice(0, 8)
              .map((item: CategoriesType) => (
                <button
                  key={item.id}
                  onClick={() => router.push(`categories/${item.id}`)}
                  className="flex flex-col items-center group"
                >
                  <div className="relative w-full aspect-square rounded-[20px] overflow-hidden bg-white shadow-sm group-hover:shadow-md group-active:scale-95 transition-all duration-200">
                    <Image
                      src={`https://api.bunyodoptom.uz${item.image}`}
                      fill
                      sizes="(max-width: 640px) 22vw, 10vw"
                      alt={item.name}
                      className="object-contain"
                    />
                  </div>
                  <p className="text-primary text-sm font-bold text-center mt-2 truncate w-full">
                    {item.name}
                  </p>
                </button>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Categories;
