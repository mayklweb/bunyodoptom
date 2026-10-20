import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";


import { orderKeys } from "./order.keys";
import { CheckoutPayload, orderService } from "@/app/services/order.service";

export function useCheckout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CheckoutPayload) =>
      orderService.checkout(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: orderKeys.all,
      });

  
    },

    onError: () => {

    },
  });
}