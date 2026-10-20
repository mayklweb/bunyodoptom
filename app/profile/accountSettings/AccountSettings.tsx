"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronRight, Loader2, Lock, Pencil, Phone, Trash2, User } from "lucide-react";

import { useDeleteProfile } from "@/app/hooks/user/useDeleteProfile";
import { useUpdateProfile } from "@/app/hooks/user/useUpdateProfile";

type DeleteStep = 1 | 2;

interface AccountSettingsProps {
  user: { name?: string; phone?: string } | null | undefined;
}

/* ------------------------------------------------------------------ */
/* Small primitives                                                    */
/* ------------------------------------------------------------------ */

function Field({
  invalid,
  children,
}: {
  invalid?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      role="group"
      data-invalid={invalid || undefined}
      className="group/field flex w-full flex-col gap-2"
    >
      {children}
    </div>
  );
}

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="flex w-fit items-center gap-2 px-0.5 text-sm font-medium leading-snug text-gray-800 group-data-invalid/field:text-red-600"
    >
      {children}
    </label>
  );
}

function FieldDescription({
  id,
  className = "",
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p
      id={id}
      className={`px-0.5 text-sm font-normal leading-normal text-balance text-gray-500 ${className}`}
    >
      {children}
    </p>
  );
}

function FieldError({
  id,
  message,
  className = "",
}: {
  id?: string;
  message?: string | null;
  className?: string;
}) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className={`text-sm text-red-600 ${className}`}>
      {message}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* Styles — same visual language as the category dropdown / menu list  */
/* ------------------------------------------------------------------ */

const panelClass =
  "w-full overflow-hidden rounded-3xl border border-black/5 bg-white/90 px-1.5 py-2 shadow-2xl shadow-black/10 backdrop-blur-xl";

const rowClass =
  "group flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 transition-colors";

const iconClass = "h-[18px] w-[18px] shrink-0 text-gray-400";

const inputClass =
  "h-11 w-full min-w-0 rounded-2xl border border-black/5 bg-gray-50 px-3.5 text-base text-gray-800 outline-none transition-shadow placeholder:text-gray-400 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:text-gray-500 aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-red-500/20 md:text-sm";

// Same button classes as the Katalog dropdown button
const buttonBase =
  "inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

const primaryButton = `${buttonBase} bg-primary text-white shadow-sm hover:bg-primary/90`;
const outlineButton = `${buttonBase} bg-primary/10 text-primary hover:bg-primary/15`;
const dangerButton = `${buttonBase} bg-red-600 text-white shadow-sm hover:bg-red-700 focus-visible:ring-red-500/40`;

/* ------------------------------------------------------------------ */

function formatPhone(local: string): string {
  const d = local.replace(/\D/g, "").slice(0, 9);
  if (!d) return "";
  const parts = [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)];
  return `+998 ${parts.filter(Boolean).join(" ")}`;
}

function normalizePhone(phone?: string): string {
  return (phone ?? "").replace(/\D/g, "").replace(/^998/, "").slice(0, 9);
}

export default function AccountSettings({ user }: AccountSettingsProps) {
  const uid = useId();

  const [name, setName] = useState("");
  const [rawPhone, setRawPhone] = useState("");
  const [original, setOriginal] = useState({ name: "", rawPhone: "" });
  const [nameError, setNameError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteStep, setDeleteStep] = useState<DeleteStep>(1);
  const [password, setPassword] = useState("");
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const deleteTriggerRef = useRef<HTMLButtonElement>(null);

  const {
    mutate: updateProfile,
    isPending,
    isError: isUpdateError,
  } = useUpdateProfile();
  const { mutate: deleteAccount, isPending: isDeleting } = useDeleteProfile();

  // Sync form with the user object
  useEffect(() => {
    if (!user) return;
    const phone = normalizePhone(user.phone);
    const uname = user.name ?? "";
    setName(uname);
    setRawPhone(phone);
    setOriginal({ name: uname, rawPhone: phone });
  }, [user]);

  // Hide the "saved" message after a moment
  useEffect(() => {
    if (saved) {
      const t = setTimeout(() => setSaved(false), 3000);
      return () => clearTimeout(t);
    }
  }, [saved]);

  // Modal: Escape to close + lock page scroll
  useEffect(() => {
    if (!deleteModalVisible) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isDeleting) closeDeleteModal();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteModalVisible, isDeleting]);

  const trimmedName = name.trim();
  const hasChanges =
    trimmedName !== original.name || rawPhone !== original.rawPhone;

  /* ---- Save profile ---- */

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!hasChanges || isPending) return;

    if (!trimmedName) {
      setNameError("Ism kiritilishi shart");
      return;
    }
    setNameError(null);
    setSaved(false);

    updateProfile(
      { name: trimmedName, phone: rawPhone },
      {
        onSuccess: () => {
          setOriginal({ name: trimmedName, rawPhone });
          setName(trimmedName);
          setSaved(true);
        },
      },
    );
  }

  /* ---- Delete account ---- */

  function openDeleteModal() {
    setDeleteStep(1);
    setPassword("");
    setDeleteError(null);
    setDeleteModalVisible(true);
  }

  function closeDeleteModal() {
    if (isDeleting) return;
    setDeleteModalVisible(false);
    setDeleteStep(1);
    setPassword("");
    setDeleteError(null);
    // Return focus to the button that opened the dialog
    requestAnimationFrame(() => deleteTriggerRef.current?.focus());
  }

  function handleConfirmDelete(e: React.FormEvent) {
    e.preventDefault();
    if (isDeleting) return;

    if (!password) {
      setDeleteError("Parolni kiriting");
      return;
    }
    setDeleteError(null);

    deleteAccount(
      { password },
      {
        onSuccess: () => {
          setDeleteModalVisible(false);
          setDeleteStep(1);
          setPassword("");
        },
        onError: (error: unknown) => {
          const message = (
            error as { response?: { data?: { message?: string } } }
          )?.response?.data?.message;
          setDeleteError(
            message === "Password mismatch"
              ? "Parol noto'g'ri"
              : "Xatolik yuz berdi. Qaytadan urinib ko'ring.",
          );
        },
      },
    );
  }

  const nameId = `${uid}-name`;
  const phoneId = `${uid}-phone`;
  const titleId = `${uid}-dialog-title`;
  const descId = `${uid}-dialog-desc`;
  const passwordId = `${uid}-delete-password`;

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      {/* Profile form — rows like the profile menu list */}
      <form
        onSubmit={handleSave}
        noValidate
        aria-label="Shaxsiy ma'lumotlar"
        className="flex flex-col gap-3"
      >
        <div className={panelClass}>
          {/* Name row (editable) */}
          <label
            htmlFor={nameId}
            className={`${rowClass} cursor-text hover:bg-primary/5 focus-within:bg-primary/5 has-[[aria-invalid=true]]:bg-red-50`}
          >
            <User aria-hidden="true" className={iconClass} strokeWidth={1.75} />
            <span className="min-w-0 flex-1">
              <span className="block text-xs text-gray-500">Ism</span>
              <input
                id={nameId}
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (nameError) setNameError(null);
                  if (saved) setSaved(false);
                }}
                placeholder="Ismingizni kiriting"
                aria-invalid={!!nameError}
                aria-describedby={nameError ? `${nameId}-error` : undefined}
                className="block w-full min-w-0 bg-transparent text-sm font-medium text-gray-800 outline-none placeholder:font-normal placeholder:text-gray-400"
              />
            </span>
            <Pencil
              aria-hidden="true"
              className="h-4 w-4 shrink-0 text-gray-300 transition-colors group-hover:text-primary group-focus-within:text-primary"
              strokeWidth={2}
            />
          </label>

          {/* Phone row (read-only) */}
          <label htmlFor={phoneId} className={`${rowClass} cursor-not-allowed`}>
            <Phone aria-hidden="true" className={iconClass} strokeWidth={1.75} />
            <span className="min-w-0 flex-1">
              <span className="block text-xs text-gray-500">Telefon</span>
              <input
                id={phoneId}
                type="tel"
                value={formatPhone(rawPhone)}
                disabled
                readOnly
                placeholder="+998 90 123 45 67"
                aria-describedby={`${phoneId}-desc`}
                className="block w-full min-w-0 cursor-not-allowed bg-transparent text-sm font-medium text-gray-500 outline-none placeholder:font-normal placeholder:text-gray-400"
              />
            </span>
            <Lock
              aria-hidden="true"
              className="h-4 w-4 shrink-0 text-gray-300"
              strokeWidth={2}
            />
          </label>
        </div>

        <FieldError
          id={`${nameId}-error`}
          message={nameError}
          className="px-3.5"
        />
        <FieldDescription id={`${phoneId}-desc`} className="px-3.5">
          Telefon raqamni o&apos;zgartirib bo&apos;lmaydi.
        </FieldDescription>

        {isUpdateError && !isPending && (
          <FieldError
            message="Saqlab bo'lmadi. Qaytadan urinib ko'ring."
            className="px-3.5"
          />
        )}

        <button
          type="submit"
          disabled={!hasChanges || isPending}
          className={`${primaryButton} w-full`}
        >
          {isPending && (
            <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
          )}
          {isPending ? "Saqlanmoqda..." : "Saqlash"}
        </button>

        <div aria-live="polite" className="min-h-5">
          {saved && (
            <FieldDescription className="text-center">
              O&apos;zgarishlar saqlandi.
            </FieldDescription>
          )}
        </div>
      </form>

      {/* Danger zone — a list row, like the menu items */}
      <section aria-labelledby={`${uid}-danger`} className={panelClass}>
        <h2 id={`${uid}-danger`} className="sr-only">
          Akkauntni o&apos;chirish
        </h2>
        <button
          ref={deleteTriggerRef}
          type="button"
          onClick={openDeleteModal}
          aria-haspopup="dialog"
          className={`${rowClass} text-left hover:bg-red-50 focus-visible:bg-red-50 focus-visible:outline-none`}
        >
          <Trash2
            aria-hidden="true"
            className="h-[18px] w-[18px] shrink-0 text-red-500"
            strokeWidth={1.75}
          />
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-medium text-red-600">
              Akkauntni o&apos;chirish
            </span>
            <span className="block text-xs text-gray-500">
              Barcha ma&apos;lumotlar o&apos;chiriladi
            </span>
          </span>
          <ChevronRight
            aria-hidden="true"
            className="h-4 w-4 shrink-0 text-gray-300 transition-transform group-hover:translate-x-0.5"
            strokeWidth={2}
          />
        </button>
      </section>

      {/* Delete-account confirmation dialog */}
      {deleteModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            aria-hidden="true"
            onClick={closeDeleteModal}
            className="account-fade absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descId}
            className="account-pop relative w-full max-w-sm overflow-hidden rounded-3xl border border-black/5 bg-white/95 p-6 shadow-2xl shadow-black/10 backdrop-blur-xl"
          >
            {deleteStep === 1 ? (
              <div className="flex flex-col gap-6">
                <div className="space-y-2">
                  <h2
                    id={titleId}
                    className="text-lg font-semibold text-gray-800"
                  >
                    Akkauntni o&apos;chirish
                  </h2>
                  <FieldDescription id={descId}>
                    Rostdan ham akkauntingizni o&apos;chirmoqchimisiz? Bu amalni
                    ortga qaytarib bo&apos;lmaydi.
                  </FieldDescription>
                </div>

                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    autoFocus
                    onClick={closeDeleteModal}
                    className={outlineButton}
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteStep(2)}
                    className={dangerButton}
                  >
                    Davom etish
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleConfirmDelete}
                noValidate
                className="flex flex-col gap-6"
              >
                <div className="space-y-2">
                  <h2
                    id={titleId}
                    className="text-lg font-semibold text-gray-800"
                  >
                    Parolni tasdiqlang
                  </h2>
                  <FieldDescription id={descId}>
                    Xavfsizlik uchun akkauntni o&apos;chirishdan oldin parolingizni
                    kiriting.
                  </FieldDescription>
                </div>

                <Field invalid={!!deleteError}>
                  <FieldLabel htmlFor={passwordId}>Parol</FieldLabel>
                  <input
                    id={passwordId}
                    type="password"
                    autoComplete="current-password"
                    autoFocus
                    value={password}
                    disabled={isDeleting}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (deleteError) setDeleteError(null);
                    }}
                    placeholder="Parolni kiriting"
                    aria-invalid={!!deleteError}
                    aria-describedby={
                      deleteError ? `${passwordId}-error` : undefined
                    }
                    className={inputClass}
                  />
                  <FieldError
                    id={`${passwordId}-error`}
                    message={deleteError}
                    className="px-0.5"
                  />
                </Field>

                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={closeDeleteModal}
                    disabled={isDeleting}
                    className={outlineButton}
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    disabled={isDeleting}
                    className={dangerButton}
                  >
                    {isDeleting && (
                      <Loader2
                        aria-hidden="true"
                        className="h-4 w-4 animate-spin"
                      />
                    )}
                    {isDeleting ? "O'chirilmoqda..." : "Ha, o'chirish"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <style>{`
        .account-fade { animation: accountFade 0.15s ease-out; }
        .account-pop  { animation: accountPop 0.2s cubic-bezier(.16,1,.3,1); }
        @keyframes accountFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes accountPop {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .account-fade, .account-pop { animation: none; }
        }
      `}</style>
    </div>
  );
}