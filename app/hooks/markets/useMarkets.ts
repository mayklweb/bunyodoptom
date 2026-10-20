import { useQuery } from "@tanstack/react-query";
import { marketKeys } from "./market.keys";
import { marketService } from "@/app/services/market.service";

export function useMarket() {
  return useQuery({
    queryKey: marketKeys.all,
    queryFn: marketService.getMarkets,
  });
}