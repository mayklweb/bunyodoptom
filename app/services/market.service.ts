import api from "../api/client";
import { ENDPOINTS } from "../api/endpoints";

export type Market = {
  id: number;
  name: string;
  address?: string;
  region?: string;
  district?: string;
};

export type CreateMarketPayload = {
  name: string;
  address?: string;
  region?: string;
  district?: string;
};

export type UpdateMarketPayload = Partial<CreateMarketPayload>;

export const marketService = {
  getMarkets: async () => {
    const { data } = await api.get(ENDPOINTS.MARKETS.GET);

    return data.data;
  },

  createMarket: async (payload: CreateMarketPayload) => {
    const { data } = await api.post(ENDPOINTS.MARKETS.CREATE, payload);

    return data.data;
  },

  updateMarket: async (id: number, payload: UpdateMarketPayload) => {
    const { data } = await api.put(ENDPOINTS.MARKETS.UPDATE(id), payload);

    return data.data;
  },

  deleteMarket: async (id: number) => {
    const { data } = await api.delete(ENDPOINTS.MARKETS.DELETE(id));

    return data.data;
  },
};
