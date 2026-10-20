import { userService } from "@/app/services/user.service";
import { useCartStore } from "@/app/store/cart.store";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";


export function useDeleteProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { password: string }) =>
      userService.deleteProfile(payload),

    onSuccess: () => {
      useCartStore.getState().clearCart();
      queryClient.clear();
    },
  });
}