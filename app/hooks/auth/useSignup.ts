import { authService, SignupPayload } from "@/app/services/auth.service";
import { useAuthStore } from "@/app/store/auth.store";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export function useSignup() {
  const queryClient = useQueryClient();

  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (payload: SignupPayload) =>
      authService.signup(payload),

    onSuccess: (data) => {
      queryClient.clear();

      setAuth({
        token: data.token,
        user: data.user,
      });
    },
  });
}