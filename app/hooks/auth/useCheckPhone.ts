import { authService } from "@/app/services/auth.service";
import { useMutation } from "@tanstack/react-query";

export function useCheckPhone() {
  return useMutation({
    mutationFn: (phone: string) =>
      authService.checkPhone(phone),
  });
}