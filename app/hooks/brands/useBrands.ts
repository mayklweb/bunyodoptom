import { useQuery } from "@tanstack/react-query";
import { brandKeys } from "./brand.keys";
import { brandService } from "@/app/services/brand.service";

export function useBrands() {
  return useQuery({
    queryKey: brandKeys.list,

    queryFn: async () => {
      const response = await brandService.getBrands();

      return response.data;
    },
  });
}
