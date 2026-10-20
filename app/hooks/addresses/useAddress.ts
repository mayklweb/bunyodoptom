import { useQuery } from "@tanstack/react-query";

import { addressService } from "@/services/address.service";
import { addressKeys } from "./address.keys";

export function useSingleAddress(
  id: number | string,
) {
  return useQuery({
    queryKey: addressKeys.one(id),

    queryFn: () =>
      addressService.getAddress(id),

    enabled: !!id,
  });
}