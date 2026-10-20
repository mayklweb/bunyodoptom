"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface MobileHeaderProps {
  title: string;
  /** Where the back chevron links to. Defaults to going to the home page. */
  backHref?: string;
}

/**
 * Fixed, mobile-only header with a back button and centered title.
 * Hidden on desktop (`md:hidden`) — desktop relies on the site's AppHeader.
 * Used on pages like /cart and /profile/* that are hidden from AppHeader
 * on mobile only (see AppHeader's `hideOnMobileOnly` list).
 */
export default function MobileHeader({
  title,
  backHref = "/",
}: MobileHeaderProps) {
  return (
    <header className="fixed top-0 z-10 w-full bg-white shadow-[0_2px_20px_rgba(0,0,0,0.05)] md:hidden">
      <div className="mx-auto flex max-w-md items-center gap-2 px-4 py-3">
        <h1 className="flex-1 text-center text-lg font-semibold text-black">
          {title}
        </h1>
      </div>
    </header>
  );
}
