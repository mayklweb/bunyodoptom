import { useQuery } from "@tanstack/react-query";
import { orderService } from "@/services/order.service";
import { orderKeys } from "./order.keys";

export function useOrder(id: number | string) {
  return useQuery({
    queryKey: orderKeys.one(id),
    queryFn: () => orderService.getOrder(id),
    enabled: !!id,
  });
}