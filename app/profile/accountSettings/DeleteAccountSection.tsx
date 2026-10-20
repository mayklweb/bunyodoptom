"use client";

import { useDeleteProfile } from "@/app/hooks/user/useDeleteProfile";
import { useState } from "react";

type DeleteStep = 1 | 2;

/**
 * Two-step "delete account" flow: confirm intent → confirm password.
 * Meant to sit alongside PersonalInfo (which already handles name/phone
 * editing via ProfileField), so this component owns only account deletion.
 */
export function DeleteAccountSection() {
  const { mutate: deleteAccount, isPending: isDeleting } = useDeleteProfile();

  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<DeleteStep>(1);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const openModal = () => {
    setStep(1);
    setPassword("");
    setError(null);
    setIsOpen(true);
  };

  const closeModal = () => {
    if (isDeleting) return;
    setIsOpen(false);
    setStep(1);
    setPassword("");
    setError(null);
  };

  const handleConfirmDelete = () => {
    if (!password) {
      setError("Parolni kiriting");
      return;
    }
    setError(null);

    deleteAccount(
      { password },
      {
        onSuccess: () => {
          setIsOpen(false);
          setStep(1);
          setPassword("");
        },
        onError: (err: any) => {
          const message =
            err?.response?.data?.message === "Password mismatch"
              ? "Parol noto'g'ri"
              : "Xatolik yuz berdi. Qaytadan urinib ko'ring.";
          setError(message);
        },
      },
    );
  };

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="mt-2 w-full rounded-2xl bg-red py-3.5 text-center text-[15px] font-semibold text-white transition-colors hover:bg-white hover:text-red cursor-pointer"
      >
        Akkauntni o&apos;chirish
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <button
            type="button"
            aria-label="Yopish"
            onClick={closeModal}
            className="absolute inset-0 bg-black/50"
          />

          <div className="relative w-full max-w-[360px] rounded-2xl bg-white p-5 shadow-xl">
            {step === 1 ? (
              <>
                <h2 className="mb-2 text-[17px] font-semibold text-gray-900">
                  Akkauntni o&apos;chirish
                </h2>
                <p className="mb-4 text-sm leading-5 text-gray-600">
                  Rostdan ham akkauntingizni o&apos;chirmoqchimisiz? Bu amalni
                  ortga qaytarib bo&apos;lmaydi.
                </p>

                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 rounded-[10px] bg-gray-100 py-3 text-center font-medium text-gray-900 hover:bg-gray-200"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex-1 rounded-[10px] bg-red py-3 text-center font-semibold text-white hover:bg-red-700"
                  >
                    O&apos;chirish
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="mb-2 text-[17px] font-semibold text-gray-900">
                  Parolni tasdiqlang
                </h2>
                <p className="mb-4 text-sm leading-5 text-gray-600">
                  Xavfsizlik uchun akkauntni o&apos;chirishdan oldin
                  parolingizni kiriting.
                </p>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Parol"
                  autoFocus
                  disabled={isDeleting}
                  className={`mb-1 w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:border-primary ${
                    error ? "border-red-600" : "border-gray-200"
                  }`}
                />

                {error && (
                  <p className="mb-3 text-[13px] text-red-600">{error}</p>
                )}

                <div className="mt-4 flex gap-2.5">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={isDeleting}
                    className="flex-1 rounded-[10px] bg-gray-100 py-3 text-center font-medium text-gray-900 hover:bg-gray-200 disabled:opacity-60"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmDelete}
                    disabled={isDeleting}
                    className="flex-1 rounded-[10px] bg-red-600 py-3 text-center font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                  >
                    {isDeleting ? "O'chirilmoqda..." : "Ha, o'chirish"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
