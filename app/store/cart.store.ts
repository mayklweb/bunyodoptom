import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { ProductsType } from "../types";

// import { ProductsType } from "@/types";
// import { storage } from "@/lib/secure-storage";

export interface CartItem extends ProductsType {
  count: number;
}

type CartId = string | number;

type CartState = {
  cart: CartItem[];
  selectedIds: CartId[];

  getQuantity: (id: CartId) => number;

  addToCart: (item: Omit<CartItem, "count">) => void;

  inc: (id: CartId) => void;
  dec: (id: CartId) => void;
  changeQty: (id: CartId, delta: number) => void;

  remove: (id: CartId) => void;
  clearCart: () => void;

  allSelected: () => boolean;
  toggleAll: () => void;
  toggleItem: (id: CartId) => void;

  selectedItems: () => CartItem[];

  total: () => number;
  totalCount: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      selectedIds: [],

      // ─────────────────────────────────────────────
      // GET QUANTITY
      // ─────────────────────────────────────────────

      getQuantity: (id) => {
        const item = get().cart.find((item) => item.id === id);
        return item?.count ?? 0;
      },

      // ─────────────────────────────────────────────
      // ADD TO CART
      // ─────────────────────────────────────────────

      addToCart: (item) => {
        set((state) => {
          const existing = state.cart.find(
            (cartItem) => cartItem.id === item.id,
          );

          // Product already exists
          if (existing) {
            if (existing.count >= Number(item.stock_qty)) {
              return state;
            }

            return {
              cart: state.cart.map((cartItem) =>
                cartItem.id === item.id
                  ? {
                      ...cartItem,
                      count: cartItem.count + 1,
                    }
                  : cartItem,
              ),
            };
          }

          // Out of stock products cannot be added
          if (Number(item.stock_qty) <= 0) {
            return state;
          }

          // New product
          return {
            cart: [
              ...state.cart,
              {
                ...item,
                price: Number(item.price),
                stock_qty: Number(item.stock_qty),
                count: 1,
              },
            ],

            // New products are selected automatically
            selectedIds: state.selectedIds.includes(item.id)
              ? state.selectedIds
              : [...state.selectedIds, item.id],
          };
        });
      },

      // ─────────────────────────────────────────────
      // INCREMENT
      // ─────────────────────────────────────────────

      inc: (id) => {
        set((state) => ({
          cart: state.cart.map((item) => {
            if (item.id !== id) {
              return item;
            }

            const stock = Number(item.stock_qty);

            if (item.count >= stock) {
              return item;
            }

            return {
              ...item,
              count: item.count + 1,
            };
          }),
        }));
      },

      // ─────────────────────────────────────────────
      // DECREMENT
      // ─────────────────────────────────────────────

      dec: (id) => {
        set((state) => ({
          cart: state.cart.map((item) => {
            if (item.id !== id) {
              return item;
            }

            // Minimum quantity = 1
            if (item.count <= 1) {
              return item;
            }

            return {
              ...item,
              count: item.count - 1,
            };
          }),
        }));
      },

      // ─────────────────────────────────────────────
      // CHANGE QUANTITY
      // ─────────────────────────────────────────────

      changeQty: (id, delta) => {
        if (delta > 0) {
          get().inc(id);
          return;
        }

        if (delta < 0) {
          get().dec(id);
        }
      },

      // ─────────────────────────────────────────────
      // REMOVE
      // ─────────────────────────────────────────────

      remove: (id) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
          selectedIds: state.selectedIds.filter(
            (selectedId) => selectedId !== id,
          ),
        }));
      },

      // ─────────────────────────────────────────────
      // CLEAR
      // ─────────────────────────────────────────────

      clearCart: () => {
        set({
          cart: [],
          selectedIds: [],
        });
      },

      // ─────────────────────────────────────────────
      // SELECTION
      // ─────────────────────────────────────────────

      allSelected: () => {
        const { cart, selectedIds } = get();

        if (cart.length === 0) {
          return false;
        }

        return cart.every((item) => selectedIds.includes(item.id));
      },

      toggleAll: () => {
        set((state) => {
          const { cart, selectedIds } = state;

          const isAllSelected =
            cart.length > 0 &&
            cart.every((item) => selectedIds.includes(item.id));

          return {
            selectedIds: isAllSelected ? [] : cart.map((item) => item.id),
          };
        });
      },

      toggleItem: (id) => {
        set((state) => {
          const isSelected = state.selectedIds.includes(id);

          return {
            selectedIds: isSelected
              ? state.selectedIds.filter((selectedId) => selectedId !== id)
              : [...state.selectedIds, id],
          };
        });
      },

      // ─────────────────────────────────────────────
      // SELECTED ITEMS
      // ─────────────────────────────────────────────

      selectedItems: () => {
        const { cart, selectedIds } = get();

        return cart.filter((item) => selectedIds.includes(item.id));
      },

      // ─────────────────────────────────────────────
      // TOTAL
      // ─────────────────────────────────────────────

      total: () => {
        return get()
          .selectedItems()
          .reduce((sum, item) => sum + Number(item.price) * item.count, 0);
      },

      totalCount: () => {
        return get()
          .selectedItems()
          .reduce((sum, item) => sum + item.count, 0);
      },
    }),

    {
      name: "cart-storage",

      storage: createJSONStorage(() => localStorage),

      partialize: (state) => ({
        cart: state.cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: Number(item.price),
          count: item.count,
          stock_qty: Number(item.stock_qty),

          // Only first image is needed in cart
          images: item.images?.[0] ? [item.images[0]] : undefined,
        })),

        selectedIds: state.selectedIds,
      }),
    },
  ),
);