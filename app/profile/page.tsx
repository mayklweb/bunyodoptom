"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ProfileMenuList from "./ui/components/ProfileMenuList/ProfileMenuList";

const DESKTOP_BREAKPOINT = "(min-width: 768px)"; // md: bilan mos

export default function ProfilePage() {
  const router = useRouter();

  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_BREAKPOINT);

    if (mql.matches) {
      router.replace("/profile/info");
    }

    // Agar oyna kengligi o'zgarib, mobil->desktopga o'tsa ham yo'naltirish ishlasin
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        router.replace("/profile/info");
      }
    };

    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, [router]);

  return (
    <div className="md:hidden">
      <ProfileMenuList />
    </div>
  );
}
