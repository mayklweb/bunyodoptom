"use client";

import { useRouter } from "next/navigation";
import { Clock, Loader2, Search, X } from "lucide-react";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

/* ----------------------------- Types ----------------------------- */

export type Suggestion = {
  id: string | number;
  title: string;
  subtitle?: string;
  /** If set, selecting this suggestion navigates here */
  href?: string;
};

type SearchFormProps = {
  /** Called with the trimmed query on submit / "all results" / recent item */
  onSearch: (query: string) => void;
  /** Async source for live suggestions. Omit to show only recent searches. */
  fetchSuggestions?: (query: string, signal: AbortSignal) => Promise<Suggestion[]>;
  /** Override what happens when a suggestion is chosen */
  onSelectSuggestion?: (suggestion: Suggestion) => void;
  initialValue?: string;
  placeholder?: string;
  className?: string;
  minChars?: number;
  debounceMs?: number;
};

type Item =
  | { key: string; kind: "recent"; label: string }
  | { key: string; kind: "suggestion"; label: string; suggestion: Suggestion }
  | { key: string; kind: "all"; label: string };

type Status = "idle" | "loading" | "success" | "error";

/* ----------------------------- Helpers ----------------------------- */

const RECENT_KEY = "katalog:recent-searches";
const MAX_RECENT = 5;

function readRecent(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === "string") : [];
  } catch {
    return [];
  }
}

function writeRecent(list: string[]) {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(list));
  } catch {
    /* storage unavailable — ignore */
  }
}

function useDebounced<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

/** Bolds the part of `text` that matches `query` */
function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  if (!q) return <>{text}</>;
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === q.toLowerCase() ? (
          <mark key={i} className="bg-transparent font-semibold text-inherit">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

/* ----------------------------- Component ----------------------------- */

export default function SearchForm({
  onSearch,
  fetchSuggestions,
  onSelectSuggestion,
  initialValue = "",
  placeholder = "Shirinlik...",
  className = "",
  minChars = 2,
  debounceMs = 250,
}: SearchFormProps) {
  const router = useRouter();
  const uid = useId();
  const listId = `${uid}-list`;
  const optionId = (i: number) => `${uid}-opt-${i}`;

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const [query, setQuery] = useState(initialValue);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [recent, setRecent] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [status, setStatus] = useState<Status>("idle");

  const trimmed = query.trim();
  const debounced = useDebounced(trimmed, debounceMs);

  // Load recent searches on mount (client only)
  useEffect(() => setRecent(readRecent()), []);

  // Fetch suggestions (debounced, cancellable)
  useEffect(() => {
    if (!fetchSuggestions || debounced.length < minChars) {
      setSuggestions([]);
      setStatus("idle");
      return;
    }

    const controller = new AbortController();
    setStatus("loading");

    fetchSuggestions(debounced, controller.signal)
      .then((data) => {
        setSuggestions(data.slice(0, 8));
        setStatus("success");
      })
      .catch((err) => {
        if (err?.name === "AbortError") return;
        setSuggestions([]);
        setStatus("error");
      });

    return () => controller.abort();
  }, [debounced, fetchSuggestions, minChars]);

  // Close on outside pointer-down
  useEffect(() => {
    if (!open) return;
    const handler = (e: PointerEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, [open]);

  /* ---- Derived list of selectable items ---- */

  const showRecent = trimmed.length === 0 && recent.length > 0;
  const showResults = trimmed.length > 0;

  const items = useMemo<Item[]>(() => {
    if (showRecent) {
      return recent.map((label) => ({ key: `r-${label}`, kind: "recent", label }));
    }
    if (!showResults) return [];

    const list: Item[] = suggestions.map((s) => ({
      key: `s-${s.id}`,
      kind: "suggestion",
      label: s.title,
      suggestion: s,
    }));
    list.push({ key: "all", kind: "all", label: trimmed });
    return list;
  }, [showRecent, showResults, recent, suggestions, trimmed]);

  const panelVisible = open && (showRecent || showResults);

  // Keep the active option scrolled into view
  useEffect(() => {
    if (activeIndex < 0) return;
    document.getElementById(optionId(activeIndex))?.scrollIntoView({ block: "nearest" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  /* ---- Actions ---- */

  const saveRecent = useCallback((value: string) => {
    setRecent((prev) => {
      const next = [value, ...prev.filter((v) => v.toLowerCase() !== value.toLowerCase())].slice(
        0,
        MAX_RECENT,
      );
      writeRecent(next);
      return next;
    });
  }, []);

  const removeRecent = (value: string) => {
    setRecent((prev) => {
      const next = prev.filter((v) => v !== value);
      writeRecent(next);
      return next;
    });
  };

  const clearRecent = () => {
    setRecent([]);
    writeRecent([]);
  };

  const runSearch = (value: string) => {
    const q = value.trim();
    if (!q) {
      inputRef.current?.focus();
      return;
    }
    saveRecent(q);
    setQuery(q);
    setOpen(false);
    setActiveIndex(-1);
    onSearch(q);
  };

  const selectItem = (item: Item) => {
    if (item.kind === "suggestion") {
      const { suggestion } = item;
      saveRecent(suggestion.title);
      setQuery(suggestion.title);
      setOpen(false);
      setActiveIndex(-1);
      if (onSelectSuggestion) onSelectSuggestion(suggestion);
      else if (suggestion.href) router.push(suggestion.href);
      else onSearch(suggestion.title);
      return;
    }
    runSearch(item.label);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (panelVisible && activeIndex >= 0 && items[activeIndex]) {
      selectItem(items[activeIndex]);
    } else {
      runSearch(query);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!open) setOpen(true);
        if (items.length) setActiveIndex((i) => (i + 1) % items.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!open) setOpen(true);
        if (items.length) setActiveIndex((i) => (i <= 0 ? items.length - 1 : i - 1));
        break;
      case "Escape":
        if (open) {
          e.preventDefault();
          setOpen(false);
          setActiveIndex(-1);
        } else if (query) {
          setQuery("");
        }
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  };

  const handleClear = () => {
    setQuery("");
    setActiveIndex(-1);
    setOpen(true);
    inputRef.current?.focus();
  };

  /* ---- Render ---- */

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <form role="search" onSubmit={handleSubmit} className="w-full">
        <label htmlFor={`${uid}-input`} className="sr-only">
          Qidirish
        </label>

        <div
          className="flex flex-auto items-center overflow-hidden rounded-xl bg-primary/5 ring-1 ring-transparent transition-shadow duration-200 focus-within:ring-primary/30 lg:w-100"
        >
          <input
            ref={inputRef}
            id={`${uid}-input`}
            type="search"
            name="q"
            role="combobox"
            aria-expanded={panelVisible}
            aria-controls={panelVisible ? listId : undefined}
            aria-autocomplete="list"
            aria-activedescendant={
              panelVisible && activeIndex >= 0 ? optionId(activeIndex) : undefined
            }
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(-1);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            autoComplete="off"
            enterKeyHint="search"
            maxLength={100}
            className="min-w-0 flex-auto bg-transparent px-4 py-2.5 outline-none placeholder:text-gray-400 [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
          />

          {status === "loading" && (
            <Loader2 aria-hidden="true" className="mr-1 h-4 w-4 animate-spin text-gray-400" />
          )}

          {query && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Tozalash"
              className="rounded-full p-1.5 text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/30"
            >
              <X aria-hidden="true" className="h-4 w-4" />
            </button>
          )}

          <button
            type="submit"
            aria-label="Qidirish"
            disabled={!trimmed}
            className="cursor-pointer px-4 py-2.5 text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Search aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
      </form>

      {panelVisible && (
        // Prevent the input from losing focus when clicking inside the panel
        <div
          onMouseDown={(e) => e.preventDefault()}
          className="search-drop absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-black/5 bg-white/90 shadow-2xl shadow-black/10 backdrop-blur-xl"
        >
          {showRecent && (
            <div className="flex items-center justify-between px-4 pb-1 pt-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                So‘nggi qidiruvlar
              </span>
              <button
                type="button"
                onClick={clearRecent}
                className="text-xs font-medium text-gray-500 hover:underline focus-visible:underline focus-visible:outline-none"
              >
                Tozalash
              </button>
            </div>
          )}

          {showResults && status === "error" && (
            <p className="px-4 pb-1 pt-3 text-sm text-gray-500">
              Takliflarni yuklab bo‘lmadi
            </p>
          )}

          {showResults &&
            status === "success" &&
            suggestions.length === 0 && (
              <p className="px-4 pb-1 pt-3 text-sm text-gray-500">
                Hech narsa topilmadi
              </p>
            )}

          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            aria-label={showRecent ? "So‘nggi qidiruvlar" : "Qidiruv takliflari"}
            className="max-h-80 overflow-y-auto overscroll-contain px-1.5 py-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {items.map((item, i) => {
              const active = i === activeIndex;
              return (
                <li
                  key={item.key}
                  id={optionId(i)}
                  role="option"
                  aria-selected={active}
                  onClick={() => selectItem(item)}
                  onMouseMove={() => active || setActiveIndex(i)}
                  className={`group flex cursor-pointer items-center gap-3 rounded-xl px-3.5 py-2.5 ${
                    active ? "bg-gray-100" : ""
                  }`}
                >
                  {item.kind === "recent" ? (
                    <Clock aria-hidden="true" className="h-4 w-4 shrink-0 text-gray-400" />
                  ) : (
                    <Search
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0 text-gray-400"
                    />
                  )}

                  <span className="min-w-0 flex-1 text-left">
                    {item.kind === "all" ? (
                      <span className="block truncate text-sm font-medium text-gray-800">
                        “{item.label}” bo‘yicha barcha natijalar
                      </span>
                    ) : (
                      <>
                        <span className="block truncate text-sm font-medium text-gray-800">
                          <Highlight
                            text={item.label}
                            query={item.kind === "suggestion" ? trimmed : ""}
                          />
                        </span>
                        {item.kind === "suggestion" && item.suggestion.subtitle && (
                          <span className="block truncate text-xs text-gray-400">
                            {item.suggestion.subtitle}
                          </span>
                        )}
                      </>
                    )}
                  </span>

                  {item.kind === "recent" && (
                    <button
                      type="button"
                      tabIndex={-1}
                      aria-label={`“${item.label}” ni o‘chirish`}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeRecent(item.label);
                      }}
                      className="rounded-full p-1 text-gray-400 opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100"
                    >
                      <X aria-hidden="true" className="h-3.5 w-3.5" />
                    </button>
                  )}
                </li>
              );
            })}

            {showResults && status === "loading" && suggestions.length === 0 && (
              <li aria-hidden="true" className="space-y-1 px-1 pb-1 pt-2">
                {[0, 1, 2].map((n) => (
                  <div
                    key={n}
                    className="h-9 animate-pulse rounded-2xl bg-gray-100"
                    style={{ opacity: 1 - n * 0.2 }}
                  />
                ))}
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Announces result count to screen readers */}
      <div aria-live="polite" className="sr-only">
        {panelVisible && showResults && status === "success"
          ? `${suggestions.length} ta taklif topildi`
          : ""}
      </div>

      <style>{`
        .search-drop {
          animation: searchDrop 0.18s cubic-bezier(.16,1,.3,1);
          transform-origin: top center;
        }
        @keyframes searchDrop {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .search-drop { animation: none; }
        }
      `}</style>
    </div>
  );
}

/* ----------------------------- Usage -----------------------------

"use client";
import { useRouter } from "next/navigation";
import SearchForm, { type Suggestion } from "./SearchForm";

async function fetchSuggestions(q: string, signal: AbortSignal): Promise<Suggestion[]> {
  const res = await fetch(`/api/search/suggest?q=${encodeURIComponent(q)}`, { signal });
  if (!res.ok) throw new Error("Failed");
  return res.json(); // [{ id, title, subtitle?, href? }]
}

export default function Header() {
  const router = useRouter();
  return (
    <SearchForm
      fetchSuggestions={fetchSuggestions}
      onSearch={(q) => router.push(`/search?q=${encodeURIComponent(q)}`)}
    />
  );
}
*/