import { authService } from "@/app/services/auth.service";
import { useMutation } from "@tanstack/react-query";

export function useSendPasswordResetOtp() {
  return useMutation({
    mutationFn: (phone: string) =>
      authService.sendPasswordResetOtp(phone),
  });
}