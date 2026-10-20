import api from "../api/client";
import { ENDPOINTS } from "../api/endpoints";

export type UpdateProfilePayload = {
  name?: string;
  phone: string;
  brightday?: string;
};

export const userService = {
  getProfile: async () => {
    const { data } = await api.get(ENDPOINTS.USERS.ME);

    return data.data;
  },

  updateProfile: async (
    payload: UpdateProfilePayload,
  ) => {
    const { data } = await api.put(
      ENDPOINTS.USERS.ME,
      payload,
    );

    return data.data;
  },

  changePassword: async (payload: {
    old_password: string;
    new_password: string;
  }) => {
    const { data } = await api.put(
      ENDPOINTS.USERS.CHANGE_PASSWORD,
      payload,
    );

    return data.data;
  },

  deleteProfile: async (payload: {
    password: string;
  }) => {
    const { data } = await api.delete(
      ENDPOINTS.USERS.ME,
      {
        data: payload,
      },
    );

    return data.data;
  },
};