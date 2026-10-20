"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { CategoriesType } from "@/app/types";
import { KatalogIcon } from "@/app/shared/icons";
import { useCategories } from "@/app/hooks/categories/useCategories";

// Adjust these imports to your project
// import { useCategories } from "@/hooks/useCategories";
// import KatalogIcon from "@/components/icons/KatalogIcon";
// import type { CategoriesType } from "@/types";

const slugify = (value: string) =>
  value.trim().toLowerCase().replace(/\s+/g, "-");

const getCategoryHref = (cat: CategoriesType) =>
  `/categories/${cat.id ?? slugify(cat.name)}`;

function Chevron({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function ChevronRight({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

function MenuSkeleton() {
  return (
    <div className="space-y-1 p-2" aria-hidden="true">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-10 animate-pulse rounded-2xl bg-gray-100"
          style={{ opacity: 1 - i * 0.12 }}
        />
      ))}
    </div>
  );
}

export default function CategoryDropdown() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const { data: categories = [], isLoading, isError, refetch } = useCategories();

  const close = useCallback((returnFocus = false) => {
    setOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  }, []);

  // Close on outside click / tap and on Escape — only while open
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) close();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(true);
    };

    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  const getItems = () =>
    Array.from(
      menuRef.current?.querySelectorAll<HTMLAnchorElement>('[role="menuitem"]') ??
        [],
    );

  const focusItem = (index: number) => {
    const items = getItems();
    if (!items.length) return;
    items[(index + items.length) % items.length].focus();
  };

  // Arrow-key navigation inside the menu
  const onMenuKeyDown = (e: React.KeyboardEvent) => {
    const items = getItems();
    const current = items.indexOf(document.activeElement as HTMLAnchorElement);

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        focusItem(current + 1);
        break;
      case "ArrowUp":
        e.preventDefault();
        focusItem(current - 1);
        break;
      case "Home":
        e.preventDefault();
        focusItem(0);
        break;
      case "End":
        e.preventDefault();
        focusItem(items.length - 1);
        break;
      case "Tab":
        close();
        break;
    }
  };

  // Open with ArrowDown from the button and focus the first item
  const onButtonKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      requestAnimationFrame(() => focusItem(0));
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onButtonKeyDown}
        className={`hidden cursor-pointer items-center gap-2 rounded-xl px-5 py-2.5 text-base font-medium capitalize transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 lg:flex ${
          open
            ? "bg-primary/10 text-primary"
            : "bg-primary text-white shadow-sm hover:bg-primary/90"
        }`}
      >
        <KatalogIcon />
        Katalog
        <Chevron
          className={`h-4 w-4 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          id={menuId}
          ref={menuRef}
          role="menu"
          aria-label="Katalog"
          onKeyDown={onMenuKeyDown}
          className="katalog-drop absolute left-0 top-[calc(100%+10px)] z-50 w-72 overflow-hidden rounded-3xl border border-black/5 bg-white/90 shadow-2xl shadow-black/10 backdrop-blur-xl"
        >
          <div className="max-h-80 overflow-y-auto overscroll-contain px-1.5 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {isLoading && <MenuSkeleton />}

            {isError && (
              <div className="flex flex-col items-center gap-2 px-4 py-6 text-center">
                <p className="text-sm text-gray-600">
                  Kategoriyalarni yuklab bo‘lmadi
                </p>
                <button
                  type="button"
                  onClick={() => refetch?.()}
                  className="rounded-lg px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
                >
                  Qayta urinish
                </button>
              </div>
            )}

            {!isLoading && !isError && categories.length === 0 && (
              <p className="px-4 py-6 text-center text-sm text-gray-500">
                Kategoriyalar topilmadi
              </p>
            )}

            {!isLoading &&
              !isError &&
              categories.map((cat: CategoriesType) => (
                <Link
                  key={cat.id ?? cat.name}
                  href={getCategoryHref(cat)}
                  role="menuitem"
                  tabIndex={-1}
                  onClick={() => close()}
                  className="group flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 transition-colors hover:bg-primary/5 focus-visible:bg-primary/5 focus-visible:outline-none"
                >
                  <span className="flex-1 truncate text-left text-sm font-medium text-gray-800 transition-colors group-hover:text-primary group-focus-visible:text-primary">
                    {cat.name}
                  </span>
                  <ChevronRight className="h-4 w-4 text-gray-300 transition-all group-hover:translate-x-0.5 group-hover:text-primary group-focus-visible:text-primary" />
                </Link>
              ))}
          </div>
        </div>
      )}

      <style>{`
        .katalog-drop {
          animation: katalogDrop 0.2s cubic-bezier(.16,1,.3,1);
          transform-origin: top left;
        }
        @keyframes katalogDrop {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .katalog-drop { animation: none; }
        }
      `}</style>
    </div>
  );
}