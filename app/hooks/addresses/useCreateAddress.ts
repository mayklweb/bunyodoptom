import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import Toast from "react-native-toast-message";

import {
  addressService,
  type CreateAddressPayload,
} from "@/services/address.service";

import { addressKeys } from "./address.keys";

export function useCreateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAddressPayload) =>
      addressService.createAddress(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: addressKeys.all,
      });

      Toast.show({
        type: "success",
        text1: "Manzil qo'shildi",
      });
    },

    onError: () => {
      Toast.show({
        type: "error",
        text1: "Manzilni qo'shib bo'lmadi",
      });
    },
  });
}