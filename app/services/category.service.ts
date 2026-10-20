import api from "../api/client";
import { ENDPOINTS } from "../api/endpoints";

export const categoryService = {
  getCategories: async () => {
    const { data } = await api.get(ENDPOINTS.CATEGORIES.ALL);

    return data;
  },

  getCategory: async (id: number | string) => {
    const { data } = await api.get(ENDPOINTS.CATEGORIES.BY_ID(id));

    return data;
  },
};
