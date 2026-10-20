
"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ProductsType } from "../types";

interface FavoriteState {
  favorites: ProductsType[];
  addFavorite: (product: ProductsType) => void;
  removeFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
  toggleFavorite: (product: ProductsType) => void;
  clearFavorites: () => void;
}

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (product) => {
        if (!product?.id) return;

        set((state) => {
          const exists = state.favorites.some(
            (item) => item.id === product.id,
          );

          if (exists) return state;

          return {
            favorites: [...state.favorites, product],
          };
        });
      },

      removeFavorite: (id) => {
        set((state) => ({
          favorites: state.favorites.filter(
            (item) => item.id !== id,
          ),
        }));
      },

      isFavorite: (id) => {
        return get().favorites.some((item) => item.id === id);
      },

      toggleFavorite: (product) => {
        if (!product?.id) return;

        const exists = get().favorites.some(
          (item) => item.id === product.id,
        );

        if (exists) {
          get().removeFavorite(product.id);
        } else {
          get().addFavorite(product);
        }
      },

      clearFavorites: () => set({ favorites: [] }),
    }),
    {
      name: "favorites-storage",
      storage: createJSONStorage(() => localStorage),

      partialize: (state) => ({
        favorites: state.favorites,
      }),
    },
  ),
);
