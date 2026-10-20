import { useQuery } from "@tanstack/react-query";

import { userKeys } from "./user.keys";
import { userService } from "@/app/services/user.service";

export function useProfile() {
  return useQuery({
    queryKey: userKeys.profile(),
    queryFn: userService.getProfile,
  });
}