// import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
// import { useAuthStore } from "@/stores/auth.store";

// export function setupInterceptors(api: AxiosInstance) {
//   // 🔐 REQUEST INTERCEPTOR
//   api.interceptors.request.use(
//     (config: InternalAxiosRequestConfig) => {
//       const token = useAuthStore.getState().token;

//       if (token) {
//         config.headers.set("Authorization", `Bearer ${token}`);
//       }

//       return config;
//     },
//     (error) => Promise.reject(error),
//   );

//   // 🚪 RESPONSE INTERCEPTOR
//   api.interceptors.response.use(
//     (response) => response,
//     (error) => {
//       if (error.response?.status === 401) {
//         useAuthStore.getState().clearAuth();
//       }

//       return Promise.reject(error);
//     },
//   );
// }

import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";

import { queryClient } from "@/app/lib/query-client";
import { useAuthStore } from "../store/auth.store";

export function setupInterceptors(api: AxiosInstance) {
  // 🔐 REQUEST INTERCEPTOR
  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = useAuthStore.getState().token;

      if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
      }

      return config;
    },
    (error) => Promise.reject(error),
  );

  // 🚪 RESPONSE INTERCEPTOR
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      const currentToken = useAuthStore.getState().token;

      // Aynan hozirgi sessiya tokeni bilan yuborilgan so'rov 401 oldimi?
      // - tokensiz so'rov (masalan, login'da noto'g'ri parol) sessiya tugashi emas
      // - eski token bilan ketgan, kech qaytgan so'rov yangi sessiyani buzmasligi kerak
      // - token allaqachon tozalangan bo'lsa, qayta ishlamaymiz (parallel 401'lar)
      const requestConfig = error.config ?? error.response?.config;
      const sentAuth = requestConfig?.headers?.get?.("Authorization");
      const isSessionExpired =
        error.response?.status === 401 &&
        !!currentToken &&
        sentAuth === `Bearer ${currentToken}`;
        
      if (isSessionExpired) {
        useAuthStore.getState().clearAuth();
        queryClient.clear();
      }

      return Promise.reject(error);
    },
  );
}
