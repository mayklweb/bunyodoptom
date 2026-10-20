"use client";

import { ProductCard } from "@/app/components";
import { useFavoriteStore } from "@/app/store/favourite.store";

function FavoritesPage() {
  const { favorites, clearFavorites } = useFavoriteStore();
  return (
    <div className="w-full h-full">
      <div className="hidden lg:block lg:mb-5">
        <h1 className="text-2xl font-semibold">Sevimlilar</h1>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {favorites.map((product, i) => (
          <ProductCard key={i} product={product} />
        ))}
      </div>
    </div>
  );
}

export default FavoritesPage;
