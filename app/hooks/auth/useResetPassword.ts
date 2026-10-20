import { authService } from "@/app/services/auth.service";
import { useMutation } from "@tanstack/react-query";

export function useResetPassword() {
  return useMutation({
    mutationFn: ({
      phone,
      resetToken,
      newPassword,
    }: {
      phone: string;
      resetToken: string;
      newPassword: string;
    }) =>
      authService.resetPassword({
        phone,
        resetToken,
        newPassword,
      }),
  });
}