import { useQuery } from "@tanstack/react-query";
import { orderKeys } from "./order.keys";
import { orderService } from "@/app/services/order.service";

export function useOrders() {
  return useQuery({
    queryKey: orderKeys.all,
    queryFn: orderService.getOrders,
  });
}