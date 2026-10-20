import { useAuthStore } from "@/app/store/auth.store";
import { useCartStore } from "@/app/store/cart.store";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const clearAuth = useAuthStore((state) => state.clearAuth);

  const logout = () => {
    clearAuth();
    useCartStore.getState().clearCart();
    queryClient.clear();
    router.replace("/login");
  };

  return { logout };
};
