import { authService } from "@/app/services/auth.service";
import { useAuthStore } from "@/app/store/auth.store";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export function useLogin() {
  const queryClient = useQueryClient();

  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: authService.login,

    onSuccess: (data) => {
      queryClient.clear();

      setAuth({
        token: data.token,
        user: data.data,
      });
    },
  });
}



