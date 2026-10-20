"use client";

import { useProfile } from "@/app/hooks/user/useProfile";
// import { useUser } from "@/app/shared/lib/useAuth";
import { CartIcon, HomeIcon, ProductsIcon, UserIcon } from "@/app/shared/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Footer() {
  const { data: user } = useProfile();

  console.log(user)

  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  const navItems = [
    { path: "/", icon: HomeIcon, label: "Asosiy" },
    { path: "/categories", icon: ProductsIcon, label: "Katalog" },
    { path: "/cart", icon: CartIcon, label: "Savat" },
    { path: "/profile", icon: UserIcon, label: user ? user.name : "Kirish" },
  ];

  return (
    <footer className="block lg:hidden fixed z-4 bottom-0 left-0 w-full rounded-t-3xl bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="container">
        <div className="flex items-center justify-between py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                href={item.path}
                className="flex-1 flex justify-center"
              >
                <div
                  className={`flex items-center justify-center flex-col gap-0.5 px-2 py-1 rounded-2xl transition-all duration-200`}
                >
                  <span
                    className={`transition-colors duration-200 ${
                      active ? "text-primary" : "text-gray"
                    }`}
                  >
                    <Icon active={active} />
                  </span>
                  <span
                    className={`text-[12px]  font-semibold leading-tight max-w-16 truncate transition-colors duration-200 ${
                      active ? "text-primary" : "text-gray"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
