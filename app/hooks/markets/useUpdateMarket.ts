import { useMutation, useQueryClient } from "@tanstack/react-query";


import { marketKeys } from "./market.keys";
import { marketService, UpdateMarketPayload } from "@/app/services/market.service";

type UpdateMarketVariables = {
  id: number;
  data: UpdateMarketPayload;
};

export function useUpdateMarket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateMarketVariables) =>
      marketService.updateMarket(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: marketKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: marketKeys.one(variables.id),
      });
    },
  });
}
