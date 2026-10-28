import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useCartStore } from "./cart.store";

type User = {
  id: string;
  name: string;
};

type AuthState = {
  token: string | null;
  user: User | null;
  isHydrated: boolean;

  setAuth: (data: { token: string; user: User }) => void;

  setUser: (user: User) => void;

  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isHydrated: false,

      setAuth: ({ token, user }) => {
        const previousUserId = get().user?.id;

        // Local cart is not keyed by user. Drop it when the signed-in
        // identity changes so the next session cannot see another user's items.
        if (previousUserId != null && previousUserId !== user.id) {
          useCartStore.getState().clearCart();
        }

        set({
          token,
          user,
          isHydrated: true,
        });
      },

      setUser: (user) => {
        set({
          user,
        });
      },

      clearAuth: () => {
        set({
          token: null,
          user: null,
          isHydrated: true,
        });
      },
    }),

    {
      name: "auth-storage",

      storage: createJSONStorage(() => localStorage),

      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) {
          }

          useAuthStore.setState({
            isHydrated: true,
          });
        };
      },
    },
  ),
);
