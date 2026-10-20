import { create } from "zustand";

type PasswordResetState = {
  phone: string;
  resetToken: string | null;

  setPhone: (phone: string) => void;
  setResetToken: (resetToken: string) => void;
  clear: () => void;
};

export const usePasswordResetStore = create<PasswordResetState>((set) => ({
  phone: "",
  resetToken: null,

  setPhone: (phone) => set({ phone }),

  setResetToken: (resetToken) => set({ resetToken }),

  clear: () =>
    set({
      phone: "",
      resetToken: null,
    }),
}));