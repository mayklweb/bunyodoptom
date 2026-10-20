import { useQuery } from "@tanstack/react-query";

// import { productService } from "@/services/product.service";
import { categoryKeys } from "./category.keys";
import { categoryService } from "@/services/category.service";

export function useCategory(id?: string | number) {
  return useQuery({
    queryKey: categoryKeys.detail(id!),

    queryFn: () => categoryService.getCategory(id!),

    enabled: !!id,
  });
}
