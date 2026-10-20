import { useQuery } from "@tanstack/react-query";

import { addressService } from "@/services/address.service";
import { addressKeys } from "./address.keys";

export function useAddress() {
  return useQuery({
    queryKey: addressKeys.all,
    queryFn: addressService.getAddresses,
  });
}