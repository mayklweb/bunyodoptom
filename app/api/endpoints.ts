export const ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: "/users/login",
    SIGNUP: "/users/signup",

    SEND_OTP: "/users/send-otp",
    VERIFY_OTP: "/users/verify-otp",
    CHECK_PHONE: "/users/check-phone",

    SEND_PASSWORD_RESET_OTP: "/users/forgot-password/send-otp",
    VERIFY_PASSWORD_RESET_OTP: "/users/forgot-password/verify-otp",
    RESET_PASSWORD: "/users/forgot-password/reset",
  },

  // Users
  USERS: {
    ME: "/users/me",
    CHANGE_PASSWORD: "/users/change-password",
  },

  // Products
  PRODUCTS: {
    ALL: "/products?all=true",
    BY_ID: (id: string | number) => `/products/${id}`,
  },

  // Categories
  CATEGORIES: {
    ALL: "/categories",
    BY_ID: (id: string | number) => `/categories/${id}`,
  },

  // Brands
  BRANDS: {
    ALL: "/brands",
    BY_ID: (id: string | number) => `/brands/${id}`,
  },

  // Orders
  ORDERS: {
    LIST: "/orders",
    BY_ID: (id: number | string) => `/orders/${id}`,
    CHECKOUT: "/orders/checkout",
    CANCEL: (id: number | string) => `/orders/${id}/cancel`,
    UPDATE_STATUS: (id: number | string) => `/orders/${id}/status`,
  },

  // Addresses
  ADDRESSES: {
    ALL: "/addresses",
    BY_ID: (id: string | number) => `/addresses/${id}`,
  },

  // Markets
  MARKETS: {
    GET: "/markets",
    CREATE: "/markets",
    UPDATE: (id: number | string) => `/markets/${id}`,
    DELETE: (id: number | string) => `/markets/${id}`,
  },

  // Checkout
  CHECKOUT: {
    CREATE: "/checkout",
  },
} as const;
