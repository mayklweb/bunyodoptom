import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { marketKeys } from "./market.keys";
import { marketService } from "@/app/services/market.service";

export function useDeleteMarket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      marketService.deleteMarket(id),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: marketKeys.all,
      });

      queryClient.removeQueries({
        queryKey: marketKeys.one(id),
      });
    },
  });
}