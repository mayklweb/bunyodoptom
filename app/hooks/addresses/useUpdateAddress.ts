import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import Toast from "react-native-toast-message";

import {
  addressService,
  type UpdateAddressPayload,
} from "@/services/address.service";

import { addressKeys } from "./address.keys";

type UpdateAddressVariables = {
  id: number | string;
  payload: UpdateAddressPayload;
};

export function useUpdateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: UpdateAddressVariables) =>
      addressService.updateAddress(id, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: addressKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: addressKeys.one(variables.id),
      });

      Toast.show({
        type: "success",
        text1: "Manzil yangilandi",
      });
    },

    onError: () => {
      Toast.show({
        type: "error",
        text1: "Manzilni yangilab bo'lmadi",
      });
    },
  });
}