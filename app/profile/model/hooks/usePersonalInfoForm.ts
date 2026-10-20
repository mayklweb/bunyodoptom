import { useCallback, useEffect, useRef, useState } from "react";
import {
  FIELD_CONFIG,
  INITIAL_FIELDS,
} from "@/app/profile/model/constants/constants";
import { FieldKey, ProfileFields } from "@/app/profile/model/types/types";
import { useProfile } from "@/app/hooks/user/useProfile";
import { useUpdateProfile } from "@/app/hooks/user/useUpdateProfile";
// import { useGetMe, useUpdateProfile, useUser } from "@/app/shared/lib/useAuth";

interface UsePersonalInfoFormResult {
  fields: ProfileFields;
  draft: ProfileFields;
  isEditing: boolean;
  saving: boolean;
  isReady: boolean;
  updateDraft: (key: FieldKey, value: string) => void;
  toggleEditSave: () => void;
  cancelEditing: () => void;
}

export function usePersonalInfoForm(): UsePersonalInfoFormResult {
  // const { mutate: getMe } = useGetMe();
  const { mutate: updateProfile, isPending: saving } = useUpdateProfile();
  const { data: user } = useProfile();

  const [fields, setFields] = useState<ProfileFields>(INITIAL_FIELDS);
  const [draft, setDraft] = useState<ProfileFields>(INITIAL_FIELDS);
  const [isEditing, setIsEditing] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const hydratedRef = useRef(false);

  useEffect(() => {
    // getMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // faqat user.id haqiqatan mavjud bo'lganda hydrate qilamiz
    if (!user?.id || hydratedRef.current) return;
    hydratedRef.current = true;

    const hydrated: ProfileFields = {
      id: String(user.id),
      name: user.name ?? "",
      phone: user.phone ?? "",
      birthdate: user.birthdate ?? "",
      gender: user.gender ?? "",
      email: user.email ?? "",
    };
    setFields(hydrated);
    setDraft(hydrated);
    setIsReady(true);
  }, [user]);

  const updateDraft = useCallback((key: FieldKey, value: string) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }, []);

  const cancelEditing = useCallback(() => {
    setDraft(fields);
    setIsEditing(false);
  }, [fields]);

  const saveAll = useCallback(() => {
    if (!isReady) return; // hali ma'lumot kelmagan bo'lsa saqlamaymiz

    // updateProfile(
    //   {
    //     name: draft.name?.trim() ?? "",
    //     phone: draft.phone ?? "",
    //     // id yuborilmaydi — backend uni token orqali biladi
    //   },
    //   {
    //     onSuccess: (updatedUser) => {
    //       setFields((prev) => ({
    //         ...prev,
    //         name: updatedUser?.name ?? draft.name,
    //         phone: updatedUser?.phone ?? draft.phone,
    //       }));
    //       setIsEditing(false);
    //     },
    //   },
    // );
  }, [draft, updateProfile, isReady]);

  const toggleEditSave = useCallback(() => {
    if (!isReady) return;
    if (isEditing) {
      saveAll();
    } else {
      setIsEditing(true);
    }
  }, [isEditing, saveAll, isReady]);

  return {
    fields,
    draft,
    isEditing,
    saving,
    isReady,
    updateDraft,
    toggleEditSave,
    cancelEditing,
  };
}