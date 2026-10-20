import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { marketKeys } from "./market.keys";
import { CreateMarketPayload, marketService } from "@/app/services/market.service";

export function useCreateMarket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateMarketPayload) =>
      marketService.createMarket(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: marketKeys.all,
      });
    },
  });
}