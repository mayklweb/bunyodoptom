export interface CategoriesType {
  id: number;
  name: string;
  image: string;
}

export interface ProductsType {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  price: number;
  kg_price: number;
  piece_price: number;
  kg: number;
  piece: number;
  stock_qty: number;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
  brand_id: number;
  // images: Array<string | { url: string }>;
  images: { url: string }[];
}

export interface UserType {
  id: string; // User Telegram ID
  name: string; // User last name (optional)
  phone: string; // User phone number
  market_id: string;
  market_name: string;
  market_address: string;
  market_phone: string;
  market_latitude: number;
  market_longitude: number;
  market_status: string;
  market_created_at: string;
  market_updated_at: string;
  birthdate: string;
  gender: string;
  email: string;
  created_at: string;
  updated_at: string; 
}

export type OrderStatus = "pending" | "preparing" | "delivered" | "cancelled";
export type PaymentMethod = "cash" | "click";

export interface OrderProduct {
  product_id: number;
  qty: number;
  unit_price: number;
  id: number;
  category_id: number;
  name: string;
  slug: string;
  price: number;
  kg_price: number;
  piece_price: number;
  kg: number;
  piece: number;
  stock_qty: number;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
  brand_id: number;
  // images: Array<string | { url: string }>;
  images: { url: string }[];
}

export interface OrderAddress {
  id: number;
  region: string;
  district: string;
  address: string;
}

export interface Order {
  id: number;
  status: OrderStatus;
  payment: PaymentMethod;
  payed: boolean;
  user_id: number;
  market_id: number | null;
  products: OrderProduct[];
  address: OrderAddress | null;
}
