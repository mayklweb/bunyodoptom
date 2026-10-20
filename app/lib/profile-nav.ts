import {
  FileText,
  MapPin,
  Package,
  Heart,
  Store,
  Info,
  Headset,
  type LucideIcon,
} from "lucide-react";

export type ProfileNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const accountItems: ProfileNavItem[] = [
  { href: "/profile/info", label: "Shaxsiy ma'lumotlar", icon: FileText },
  { href: "/profile/orders", label: "Buyurtmalar", icon: Package },
  { href: "/profile/favorites", label: "Sevimlilar", icon: Heart },
  { href: "/profile/store", label: "Do'kon", icon: Store },
];

export const infoItems: ProfileNavItem[] = [
  { href: "/profile/about", label: "Biz haqimizda", icon: Info },
  { href: "/profile/contact", label: "Bog'lanish", icon: Headset },
];

export const allProfileNavItems = [...accountItems, ...infoItems];