"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { allProfileNavItems } from "@/app/lib/profile-nav";

export default function ProfileMenuList() {
  const pathname = usePathname();

  return (
    <div className="w-full bg-white rounded-3xl shadow-xl overflow-hidden">
      <div className="py-2 px-1.5">
        {allProfileNavItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href}>
              <button
                className={`group w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-colors ${
                  isActive ? "bg-primary/5" : "hover:bg-primary/5"
                }`}
              >
                {Icon && (
                  <Icon
                    size={18}
                    className={`shrink-0 transition-colors ${
                      isActive
                        ? "text-primary"
                        : "text-gray-400 group-hover:text-primary"
                    }`}
                    strokeWidth={2}
                  />
                )}
                <span className="flex-1 text-left">
                  <span
                    className={`block text-sm font-medium transition-colors ${
                      isActive
                        ? "text-primary"
                        : "text-gray-800 group-hover:text-primary"
                    }`}
                  >
                    {item.label}
                  </span>
                </span>

                <svg
                  className={`h-4 w-4 shrink-0 transition-colors ${
                    isActive
                      ? "text-primary"
                      : "text-gray-300 group-hover:text-primary"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
