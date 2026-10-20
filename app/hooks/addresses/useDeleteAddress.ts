import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import Toast from "react-native-toast-message";

import { addressService } from "@/services/address.service";
import { addressKeys } from "./address.keys";

export function useDeleteAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) =>
      addressService.deleteAddress(id),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: addressKeys.all,
      });

      queryClient.removeQueries({
        queryKey: addressKeys.one(id),
      });

      Toast.show({
        type: "success",
        text1: "Manzil o'chirildi",
      });
    },

    onError: () => {
      Toast.show({
        type: "error",
        text1: "Manzilni o'chirib bo'lmadi",
      });
    },
  });
}