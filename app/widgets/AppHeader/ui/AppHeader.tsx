"use client";
import Link from "next/link.js";
import {
  SearchIcon,
  UserIcon,
  CartIcon,
  KatalogIcon,
} from "@/app/shared/icons";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
// import { useGetMe, useUser } from "@/app/shared/lib/useAuth";
// import { useCategories } from "@/app/shared/lib/hooks/useCategories";
import { CategoriesType } from "@/app/types";
import useIsAuth from "@/app/context/useIsAuth";
import { Button } from "@/app/components/Button";
import { useCartStore } from "@/app/store/cart.store";
import { useCategories } from "@/app/hooks/categories/useCategories";
import CategoryDropdown from "@/app/components/CategoryDropdown/CategoryDropdown";
import SearchForm from "@/app/components/SearchForm/SearchForm";
import HeaderActions from "@/app/components/HeaderAction/HeaderAction";

// --- Katalog Dropdown ---

// --- AppHeader ---
function AppHeader() {
  const path = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState<string>("");
  // const { data: user } = useUser();
  // const { mutate: getMe } = useGetMe();
  const isAuth = useIsAuth();

  useEffect(() => {
    // getMe();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/products?search=${encodeURIComponent(query)}`);
  };

  // Bu sahifalarda AppHeader umuman chiqmaydi (na mobil, na desktop).
  const hideHeader = ["signup", "login", "checkout"].includes(
    path.split("/")[1],
  );

  // Bu sahifalarda AppHeader faqat MOBIL'da yashiriladi — chunki mobil'da
  // ular o'zining alohida (orqaga tugmali) headeriga ega. Desktopda esa
  // yagona header sifatida AppHeader ko'rinishda qoladi.
  const hideOnMobileOnly = ["profile", "cart"].includes(path.split("/")[1]);

  const { cart } = useCartStore();

  return (
    <header>
      {!hideHeader && (
        <div
          className={`w-full bg-white shadow-[0_2px_20px_rgba(0,0,0,0.05)] fixed top-0 z-10 ${
            hideOnMobileOnly ? "hidden md:block" : ""
          }`}
        >
          <div className="container">
            <div className="relative">
              <div className="w-full flex gap-2 items-center justify-between py-2">
                {/* Logo */}
                <div>
                  <Link href={"/"} className="w-40 h-12 hidden lg:block">
                    <Image
                      src="/logo.png"
                      width={200}
                      height={50}
                      alt="Logo"
                      className="w-44 h-10 object-cover"
                    />
                  </Link>
                  <Link href={"/"} className="w-10 h-10 block lg:hidden">
                    <Image
                      src="/logo1.svg"
                      width={40}
                      height={40}
                      alt="Logo"
                      className="w-10 h-10 object-cover lg:hidden"
                    />
                  </Link>
                </div>

                {/* Katalog + Search */}
                <div className="w-full flex flex-auto lg:flex-0 gap-3">
                  <CategoryDropdown />
                  <SearchForm onSearch={() => handleSubmit} />
                </div>

                {/* User + Cart */}
                <HeaderActions/>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default AppHeader;
