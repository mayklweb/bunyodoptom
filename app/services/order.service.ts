import api from "../api/client";
import { ENDPOINTS } from "../api/endpoints";

export type OrderStatus = "pending" | "preparing" | "delivered" | "cancelled";
export type PaymentMethod = "cash" | "click";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

// Savatdagi mahsulot (frontend ichida)
export type OrderProduct = {
  id: number;
  name?: string;
  price?: number;
  count?: number;
  qty?: number;
  images?: {
    url: string;
  }[];
  // [key: string]: unknown;
};

// Backendga yuboriladigan mahsulot
export type CheckoutProductPayload = {
  id: number;
  qty: number;
};

// Checkout uchun backendga yuboriladigan ma'lumotlar
export type CheckoutPayload = {
  market_id: number;
  payment_method: PaymentMethod;
  notes?: string;
  idempotency_key?: string;
  products: CheckoutProductPayload[];
};

// Backenddan keladigan buyurtma
export type Order = {
  id: number;
  user: { id: number; phone: string; name: string } | null;
  products: {
    qty: number;
    unit_price: number;
    product: {
      id: number;
      name: string;
      images?: { url: string }[];
      [key: string]: unknown;
    };
    [key: string]: unknown;
  }[];
  market: {
    market_id: number;
    name: string | null;
    address: string | null;
    region: string | null;
    district: string | null;
  } | null;
  total_amount: number;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  status: OrderStatus;
  note: string;
  created_at: string;
};

export type UpdateOrderStatusPayload = {
  status: OrderStatus;
};

export const orderService = {
  getOrders: async (): Promise<Order[]> => {
    const { data } = await api.get(ENDPOINTS.ORDERS.LIST);

    return data.data;
  },

  getOrder: async (id: number | string): Promise<Order> => {
    const { data } = await api.get(ENDPOINTS.ORDERS.BY_ID(id));

    return data.data;
  },

  checkout: async (payload: CheckoutPayload): Promise<Order> => {
    const body = {
      market_id: payload.market_id,
      payment_method: payload.payment_method,
      notes: payload.notes,
      idempotency_key: payload.idempotency_key,
      // backend faqat id va qty ni o'qiydi
      products: payload.products.map((p) => ({
        id: p.id,
        qty: p.qty ?? 1,
      })),
    };

    const { data } = await api.post(ENDPOINTS.ORDERS.CHECKOUT, body);

    return data.data;
  },

  cancelOrder: async (id: number | string): Promise<Order> => {
    const { data } = await api.post(ENDPOINTS.ORDERS.CANCEL(id));

    return data.data;
  },

  updateStatus: async (
    id: number | string,
    payload: UpdateOrderStatusPayload,
  ): Promise<Order> => {
    const { data } = await api.put(ENDPOINTS.ORDERS.UPDATE_STATUS(id), payload);

    return data.data;
  },
};
