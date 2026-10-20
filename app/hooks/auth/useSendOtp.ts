import { authService } from "@/app/services/auth.service";
import { useMutation } from "@tanstack/react-query";

export function useSendOtp() {
  return useMutation({
    mutationFn: (phone: string) =>
      authService.sendOtp(phone),
  });
}