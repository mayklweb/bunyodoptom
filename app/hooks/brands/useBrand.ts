import { useQuery } from "@tanstack/react-query";
import { brandKeys } from "./brand.keys";
import { brandService } from "@/app/services/brand.service";


export function useBrand(id?: string | number) {
  return useQuery({
    queryKey: brandKeys.detail(id!),

    queryFn: () => brandService.getBrand(id!),

    enabled: !!id,
  });
}
