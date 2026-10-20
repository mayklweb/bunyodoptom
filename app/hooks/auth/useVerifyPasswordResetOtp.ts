import { authService } from "@/app/services/auth.service";
import { useMutation } from "@tanstack/react-query";

export function useVerifyPasswordResetOtp() {
  return useMutation({
    mutationFn: ({
      phone,
      code,
    }: {
      phone: string;
      code: string;
    }) =>
      authService.verifyPasswordResetOtp({
        phone,
        code,
      }),
  });
}