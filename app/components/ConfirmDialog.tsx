"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { AlertTriangle } from "lucide-react";

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  variant?: "default" | "destructive";
  loading?: boolean;
};

export default function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Ha",
  cancelLabel = "Yo'q",
  onConfirm,
  variant = "default",
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Transition show={open} as={Fragment}>
      <Dialog onClose={() => onOpenChange(false)} className="relative z-50">
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        {/* Card */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95 translate-y-2"
            enterTo="opacity-100 scale-100 translate-y-0"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100 translate-y-0"
            leaveTo="opacity-0 scale-95 translate-y-2"
          >
            <Dialog.Panel className="w-full max-w-[360px] rounded-[28px] bg-white p-6 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.3)]">
              <div
                className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${
                  variant === "destructive" ? "bg-red-50" : "bg-blue-50"
                }`}
              >
                <AlertTriangle
                  size={26}
                  strokeWidth={1.75}
                  className={
                    variant === "destructive" ? "text-red-500" : "text-[#0040B1]"
                  }
                />
              </div>

              <Dialog.Title className="text-center text-[17px] font-semibold tracking-[-0.01em] text-gray-900">
                {title}
              </Dialog.Title>

              {description && (
                <Dialog.Description className="mt-2 text-center text-[14px] leading-5 text-gray-500">
                  {description}
                </Dialog.Description>
              )}

              <div className="mt-6 flex gap-2.5">
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  disabled={loading}
                  className="flex-1 rounded-2xl bg-gray-100 py-3 text-[14px] font-semibold text-gray-700 transition-colors hover:bg-gray-200 active:scale-[0.98] disabled:opacity-50"
                >
                  {cancelLabel}
                </button>

                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={loading}
                  autoFocus
                  className={`flex-1 rounded-2xl py-3 text-[14px] font-semibold text-white transition-all active:scale-[0.98] disabled:opacity-50 ${
                    variant === "destructive"
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-[#0040B1] hover:bg-[#003399]"
                  }`}
                >
                  {loading ? "Kuting..." : confirmLabel}
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}