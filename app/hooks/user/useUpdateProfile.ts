import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { userKeys } from "./user.keys";
import { useAuthStore } from "@/app/store/auth.store";
import { userService } from "@/app/services/user.service";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: userService.updateProfile,

    onSuccess: (updatedUser) => {
      setUser({
        id: String(updatedUser.id),
        name: updatedUser.name,
      });

      queryClient.setQueryData(
        userKeys.profile(),
        updatedUser,
      );
    },
  });
}