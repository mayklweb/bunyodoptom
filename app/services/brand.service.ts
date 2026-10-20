// import { api } from "@/api/client";
import api from "../api/client";
import { ENDPOINTS } from "../api/endpoints";

export const brandService = {
  getBrands: async () => {
    const { data } = await api.get(
      ENDPOINTS.BRANDS.ALL
    );

    return data;
  },

  getBrand: async (id: number | string) => {
    const { data } = await api.get(
      ENDPOINTS.BRANDS.BY_ID(id)
    );

    return data;
  },
};