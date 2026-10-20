import { useQuery } from "@tanstack/react-query";

import { productKeys } from "./product.keys";
import { productService } from "@/app/services/product.service";

export function useProduct(id?: string | number) {
  return useQuery({
    queryKey: productKeys.detail(id!),

    queryFn: () => productService.getProductById(id!),

    enabled: !!id,
  });
}