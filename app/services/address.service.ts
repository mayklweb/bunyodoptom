import { api } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";

export type CreateAddressPayload = {
  region?: string;
  district?: string;
  address?: string;
  [key: string]: unknown;
};

export type UpdateAddressPayload = Partial<CreateAddressPayload>;

export const addressService = {
  getAddresses: async () => {
    const { data } = await api.get(
      ENDPOINTS.ADDRESSES.ALL,
    );

    return data.data;
  },

  getAddress: async (id: number | string) => {
    const { data } = await api.get(
      ENDPOINTS.ADDRESSES.BY_ID(id),
    );

    return data.data;
  },

  createAddress: async (
    payload: CreateAddressPayload,
  ) => {
    const { data } = await api.post(
      ENDPOINTS.ADDRESSES.ALL,
      payload,
    );

    return data.data;
  },

  updateAddress: async (
    id: number | string,
    payload: UpdateAddressPayload,
  ) => {
    const { data } = await api.put(
      ENDPOINTS.ADDRESSES.BY_ID(id),
      payload,
    );

    return data.data;
  },

  deleteAddress: async (id: number | string) => {
    const { data } = await api.delete(
      ENDPOINTS.ADDRESSES.BY_ID(id),
    );

    return data.data;
  },
};