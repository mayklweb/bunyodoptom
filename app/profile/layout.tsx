"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { allProfileNavItems } from "@/app/lib/profile-nav";
import ProfileSidebar from "./ui/components/Sidebar/ProfileSidebar";
// import ProfileSidebar from "../components/ProfileSidebar";

export default function ProfileLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isRoot = pathname === "/profile";
  const currentTitle =
    allProfileNavItems.find((item) => item.href === pathname)?.label ??
    "Profil";

  return (
    <div>
      {/* MOBILE HEADER */}
      <header className="fixed top-0 z-10 w-full bg-white md:hidden">
        <div className="container">
          <div
            className={`flex items-center relative ${isRoot ? "py-6" : "py-3"}`}
          >
            {!isRoot ? (
              <Link
                href="/profile"
                className="flex items-center text-base text-dark-gray"
                aria-label="Orqaga"
              >
                <ChevronLeft size={20} className="text-dark-gray" />
                <span className="mb-0.5 text-base font-medium">Orqaga</span>
              </Link>
            ) : (
              <span className="w-8" aria-hidden />
            )}
            <h1 className="flex-1 text-lg font-semibold text-center text-black absolute left-1/2 -translate-x-1/2">
              {isRoot ? "Profil" : currentTitle}
            </h1>
            <span className="w-8" aria-hidden />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-md px-4 pb-16 pt-20 md:max-w-5xl md:px-8 md:pt-28">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[260px_1fr] md:items-start md:gap-8">
          <div className="hidden md:sticky md:top-28 md:block">
            <ProfileSidebar />
          </div>

          <div className="min-w-0">{children}</div>
        </div>
      </main>
    </div>
  );
}
