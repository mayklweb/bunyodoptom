import { authService } from "@/app/services/auth.service";
import { useMutation } from "@tanstack/react-query";

export function useVerifyOtp() {
  return useMutation({
    mutationFn: ({
      phone,
      code,
    }: {
      phone: string;
      code: string;
    }) =>
      authService.verifyOtp({
        phone,
        code,
      }),
  });
}