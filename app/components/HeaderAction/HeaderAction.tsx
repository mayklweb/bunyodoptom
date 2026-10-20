"use client";

import { useAuth } from "@/app/context/AuthContext";
import { CartIcon, UserIcon } from "@/app/shared/icons";
import { useAuthStore } from "@/app/store/auth.store";
import { useCartStore } from "@/app/store/cart.store";
import Link from "next/link";

// Adjust these imports to your project
// import UserIcon from "@/components/icons/UserIcon";
// import CartIcon from "@/components/icons/CartIcon";
// import { useAuth } from "@/hooks/useAuth";
// import { useCart } from "@/hooks/useCart";

const actionClass =
  "flex items-center gap-2 rounded-xl bg-primary/5 px-5 py-2.5 text-primary transition-all duration-300 ease-in-out hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40";

const labelClass = "text-base font-semibold capitalize";

export default function HeaderActions() {
  const { token, user } = useAuthStore();
  const { cart } = useCartStore();

  const count = cart.length;
  const countLabel = count > 99 ? "99+" : String(count);

  // Authenticated users go to their profile, guests to the login page
  const profileHref = token ? "/profile" : "/login";
  const profileText = token ? (user?.name ?? "Profil") : "Kirish";

  return (
    <div className="hidden items-center gap-3 lg:flex">
      <Link
        href={profileHref}
        aria-label={token ? "Profil" : "Kirish"}
        className={actionClass}
      >
        <UserIcon className="h-6 w-6" aria-hidden="true" />
        <span className={`${labelClass} max-w-32 truncate`}>{profileText}</span>
      </Link>

      <div className="relative">
        <Link
          href="/cart"
          aria-label={count > 0 ? `Savat, ${count} ta mahsulot` : "Savat"}
          className={actionClass}
        >
          <CartIcon className="h-6 w-6" aria-hidden="true" />
          <span className={labelClass}>Savat</span>
        </Link>

        {count > 0 && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-1.5 -top-1.5 z-10 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-semibold text-white shadow-sm"
          >
            {countLabel}
          </span>
        )}
      </div>
    </div>
  );
}
