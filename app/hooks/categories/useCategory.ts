import { useQuery } from "@tanstack/react-query";

import { categoryKeys } from "./category.keys";
import { categoryService } from "@/app/services/category.service";

export function useCategory(id?: string | number) {
  return useQuery({
    queryKey: categoryKeys.detail(id!),

    queryFn: () => categoryService.getCategory(id!),

    enabled: !!id,
  });
}
