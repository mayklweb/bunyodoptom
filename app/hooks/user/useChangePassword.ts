import { userService } from "@/app/services/user.service";
import { useMutation } from "@tanstack/react-query";


export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: Parameters<typeof userService.changePassword>[0]) =>
      userService.changePassword(payload),
  });
}