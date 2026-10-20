// import { api } from "@/api/client";
// import { ENDPOINTS } from "@/api/endpoints";

import api from "../api/client";
import { ENDPOINTS } from "../api/endpoints";

export const productService = {
  // Barcha mahsulotlar
  getAllProducts: async () => {
    const { data } = await api.get(
      ENDPOINTS.PRODUCTS.ALL,
    );

    return data;
  },

  // Bitta mahsulot
  getProductById: async (id: string | number) => {
    const { data } = await api.get(
      ENDPOINTS.PRODUCTS.BY_ID(id),
    );

    return data.data;
  },
};