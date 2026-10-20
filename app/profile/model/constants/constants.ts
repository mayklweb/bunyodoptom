import {
  DeliveryIcon,
  FavoriteIcon,
  FileIcon,
  LocationIcon,
  MarketIcon,
} from "@/app/shared/icons";
import { FieldConfig, NavItem, ProfileFields } from "../types/types";

export const NAV_ITEMS: NavItem[] = [
  { key: "personal", icon: FileIcon, label: "Shaxsiy ma’lumotlarim" },
  { key: "shop", icon: MarketIcon, label: "Do‘konim" },
  { key: "orders", icon: DeliveryIcon, label: "Buyurtmalarim" },
  { key: "addresses", icon: LocationIcon, label: "Manzillarim" },
  { key: "favorites", icon: FavoriteIcon, label: "Sevimli mahsulotlarim" },
];

export const FIELD_CONFIG: FieldConfig[] = [
  { key: "name", label: "Ism familiya" },
  { key: "phone", label: "Telefon raqam" },
  { key: "birthdate", label: "Tug'ilgan sana", disabled: true },
  { key: "gender", label: "Jinsi" },
  { key: "email", label: "Elektron pochta" },
];

export const INITIAL_FIELDS: ProfileFields = {
  id: "",
  name: "",
  phone: "",
  birthdate: "",
  gender: "",
  email: "",
};

export const DISTRICTS = [
  { id: 1, region: "Xorazm", district: "Bog'ot tumani" },
  { id: 2, region: "Xorazm", district: "Gurlan tumani" },
  { id: 3, region: "Xorazm", district: "Qo'shko'pir tumani" },
  { id: 4, region: "Xorazm", district: "Urganch tumani" },
  { id: 5, region: "Xorazm", district: "Xazorasp tumani" },
  { id: 6, region: "Xorazm", district: "Xonqa tumani" },
  { id: 7, region: "Xorazm", district: "Xiva tumani" },
  { id: 8, region: "Xorazm", district: "Shovot tumani" },
  { id: 9, region: "Xorazm", district: "Yangiariq tumani" },
  { id: 10, region: "Xorazm", district: "Yangibozor tumani" },
  { id: 11, region: "Xorazm", district: "Urganch" },
  { id: 12, region: "Xorazm", district: "Xiva" },
  // districts for other regions will filter automatically by region_id
];

type OrderStatus = "pending" | "processing" | "delivered" | "cancelled";

interface OrderItem {
  name: string;
  image: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  createdAt: string;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
}

export const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; className: string; dot: string }
> = {
  pending: {
    label: "Kutilmoqda",
    className: "bg-yellow-50 text-yellow-600",
    dot: "bg-yellow-400",
  },
  processing: {
    label: "Jarayonda",
    className: "bg-blue-50 text-blue-600",
    dot: "bg-blue-400",
  },
  delivered: {
    label: "Yetkazildi",
    className: "bg-green-50 text-green-600",
    dot: "bg-green-400",
  },
  cancelled: {
    label: "Bekor qilindi",
    className: "bg-red-50 text-red-500",
    dot: "bg-red-400",
  },
};

export const orders: Order[] = [
  {
    id: "ORD-1042",
    createdAt: "09.03.2026, 10:24",
    status: "delivered",
    total: 485000,
    items: [
      {
        name: "Nike Air Max 270",
        image:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200",
        quantity: 1,
        price: 320000,
      },
      {
        name: "Adidas Running T-shirt",
        image:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200",
        quantity: 2,
        price: 82500,
      },
    ],
  },
  {
    id: "ORD-1051",
    createdAt: "09.03.2026, 13:05",
    status: "processing",
    total: 210000,
    items: [
      {
        name: "Samsung Galaxy Buds2",
        image:
          "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200",
        quantity: 1,
        price: 210000,
      },
    ],
  },
  {
    id: "ORD-1063",
    createdAt: "09.03.2026, 15:48",
    status: "pending",
    total: 674000,
    items: [
      {
        name: "Xiaomi Smart Watch",
        image:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200",
        quantity: 1,
        price: 450000,
      },
      {
        name: "USB-C Charging Cable",
        image:
          "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=200",
        quantity: 3,
        price: 28000,
      },
      {
        name: "Phone Case",
        image:
          "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=200",
        quantity: 2,
        price: 35000,
      },
      {
        name: "Screen Protector",
        image:
          "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=200",
        quantity: 1,
        price: 18000,
      },
    ],
  },
  {
    id: "ORD-1038",
    createdAt: "08.03.2026, 09:10",
    status: "cancelled",
    total: 155000,
    items: [
      {
        name: "Wireless Mouse Logitech",
        image:
          "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200",
        quantity: 1,
        price: 155000,
      },
    ],
  },
];

export const products = [
  {
    id: 1,
    name: "ВЕЧЕРНИ ОГНИ МОЛОЧНИ 3 КГ",
    price: "30700.00 USZ",
  },
  {
    id: 2,
    name: "ВЕЧЕРНИ ОГНИ МОЛОЧНИ 3 КГ",
    price: "30700.00 USZ",
  },
  {
    id: 3,
    name: "ВЕЧЕРНИ ОГНИ МОЛОЧНИ 3 КГ",
    price: "30700.00 USZ",
  },
  {
    id: 4,
    name: "ВЕЧЕРНИ ОГНИ МОЛОЧНИ 3 КГ",
    price: "30700.00 USZ",
  },
  {
    id: 5,
    name: "ВЕЧЕРНИ ОГНИ МОЛОЧНИ 3 КГ",
    price: "30700.00 USZ",
  },
  {
    id: 6,
    name: "ВЕЧЕРНИ ОГНИ МОЛОЧНИ 3 КГ",
    price: "30700.00 USZ",
  },
  {
    id: 7,
    name: "ВЕЧЕРНИ ОГНИ МОЛОЧНИ 3 КГ",
    price: "30700.00 USZ",
  },
  {
    id: 8,
    name: "ВЕЧЕРНИ ОГНИ МОЛОЧНИ 3 КГ",
    price: "30700.00 USZ",
  },
];
