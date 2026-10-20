"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Loader2, LogOut } from "lucide-react";
import {
  accountItems,
  infoItems,
  type ProfileNavItem,
} from "@/app/lib/profile-nav";
import { useLogout } from "@/app/hooks/auth/useLogout";

const panelClass =
  "w-full overflow-hidden rounded-3xl border border-black/5 bg-white/90 px-1.5 py-2 shadow-2xl shadow-black/10 backdrop-blur-xl";

const rowClass =
  "group flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 transition-colors hover:bg-primary/5 focus-visible:bg-primary/5 focus-visible:outline-none";

function isItemActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function MenuGroup({
  label,
  items,
  pathname,
}: {
  label: string;
  items: ProfileNavItem[];
  pathname: string;
}) {
  return (
    <nav aria-label={label} className={panelClass}>
      <ul>
        {items.map((item) => {
          const active = isItemActive(pathname, item.href);
          const Icon = item.icon;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`${rowClass} ${active ? "bg-primary/5" : ""}`}
              >
                <Icon
                  aria-hidden="true"
                  className={`h-[18px] w-[18px] shrink-0 transition-colors group-hover:text-primary group-focus-visible:text-primary ${
                    active ? "text-primary" : "text-gray-400"
                  }`}
                  strokeWidth={1.75}
                />
                <span
                  className={`flex-1 truncate text-left text-sm font-medium transition-colors group-hover:text-primary group-focus-visible:text-primary ${
                    active ? "text-primary" : "text-gray-800"
                  }`}
                >
                  {item.label}
                </span>
                <ChevronRight
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 text-gray-300 transition-all group-hover:translate-x-0.5 group-hover:text-primary group-focus-visible:text-primary"
                  strokeWidth={2}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default function ProfileMenuList() {
  const pathname = usePathname();
  const { logout} = useLogout();

  return (
    <div className="flex w-full flex-col gap-4">
      <MenuGroup label="Hisob" items={accountItems} pathname={pathname} />
      <MenuGroup label="Ma'lumot" items={infoItems} pathname={pathname} />

      <div className={panelClass}>
        <button
          type="button"
          onClick={() => logout()}
          // disabled={loggingOut}
          className="group flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-left transition-colors hover:bg-red-50 focus-visible:bg-red-50 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-60"
        >
          
         
        </button>
      </div>
    </div>
  );
}