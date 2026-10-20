// import { api } from "@/api/client";
// import { ENDPOINTS } from "@/api/endpoints";

import api from "../api/client";
import { ENDPOINTS } from "../api/endpoints";

export type LoginPayload = {
  phone: string;
  password: string;
};

export type SignupPayload = {
  name: string;
  phone: string;
  password: string;
  verificationToken: string; 
};

export type VerifyOtpPayload = {
  phone: string;
  code: string;
};

export type ResetPasswordPayload = {
  phone: string;
  resetToken: string;
  newPassword: string;
};

export const authService = {
  // POST /users/login
  login: async (payload: LoginPayload) => {
    const { data } = await api.post(
      ENDPOINTS.AUTH.LOGIN,
      payload,
    );

    return data;
  },

  // POST /users/signup
  signup: async (payload: SignupPayload) => {
    const { data } = await api.post(
      ENDPOINTS.AUTH.SIGNUP,
      payload,
    );

    return data;
  },

  // POST /users/send-otp
  sendOtp: async (phone: string) => {
    const { data } = await api.post(
      ENDPOINTS.AUTH.SEND_OTP,
      { phone },
    );

    return data;
  },

  // POST /users/verify-otp
  verifyOtp: async (payload: VerifyOtpPayload) => {
    const { data } = await api.post(
      ENDPOINTS.AUTH.VERIFY_OTP,
      payload,
    );

    return data;
  },

  // POST /users/check-phone
  checkPhone: async (phone: string) => {
    const { data } = await api.post(
      ENDPOINTS.AUTH.CHECK_PHONE,
      { phone },
    );

    return data;
  },

  // POST /users/forgot-password/send-otp
  sendPasswordResetOtp: async (phone: string) => {
    const { data } = await api.post(
      ENDPOINTS.AUTH.SEND_PASSWORD_RESET_OTP,
      { phone },
    );

    return data;
  },

  // POST /users/forgot-password/verify-otp
  verifyPasswordResetOtp: async (
    payload: VerifyOtpPayload,
  ) => {
    const { data } = await api.post(
      ENDPOINTS.AUTH.VERIFY_PASSWORD_RESET_OTP,
      payload,
    );

    return data;
  },

  // POST /users/forgot-password/reset
  resetPassword: async (
    payload: ResetPasswordPayload,
  ) => {
    const { data } = await api.post(
      ENDPOINTS.AUTH.RESET_PASSWORD,
      payload,
    );

    return data;
  },
};