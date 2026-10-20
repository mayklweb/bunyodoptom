import { useQuery } from "@tanstack/react-query";

import { productKeys } from "./product.keys";
import { productService } from "@/app/services/product.service";

export function useProducts(categoryId?: number) {
  return useQuery({
    queryKey: [...productKeys.list, categoryId],

    queryFn: async () => {
      const response = await productService.getAllProducts();

      const products = response.data.filter(
        (product: any) => product.images?.length > 0,
      );

      if (categoryId === undefined) {
        return products;
      }

      return products.filter(
        (product: any) => Number(product.category_id) === Number(categoryId),
      );
    },
  });
}
