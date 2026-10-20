"use client";

import type { KeyboardEvent } from "react";
import { FIELD_CONFIG } from "@/app/profile/model/constants/constants";
import { usePersonalInfoForm } from "@/app/profile/model/hooks/usePersonalInfoForm";
import { DeleteAccountSection } from "../accountSettings/DeleteAccountSection";
import { ProfileField } from "../ui/sections/profileField/ProfileField";
import { useLogout } from "@/app/hooks/auth/useLogout";

function InfoPage() {
  const {
    fields,
    draft,
    isEditing,
    saving,
    isReady,
    updateDraft,
    toggleEditSave,
    cancelEditing,
  } = usePersonalInfoForm();

  const { mutate: logout, isPending: loggingOut } = useLogout();

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") toggleEditSave();
    if (e.key === "Escape") cancelEditing();
  };

  return (
    <div className="h-full w-full">
      <div className="hidden lg:mb-3 lg:block">
        <h1 className="text-2xl font-semibold">Shaxsiy ma&apos;lumotlar</h1>
      </div>

      <div className="flex flex-col gap-2.5">
        {FIELD_CONFIG.map(({ key, label, disabled }) => (
          <ProfileField
            key={key}
            label={label}
            value={isEditing ? (draft[key] ?? "") : (fields[key] ?? "")}
            editable={isEditing && !disabled}
            onChange={(e) => updateDraft(key, e.target.value)}
            onKeyDown={handleKeyDown}
          />
        ))}

        {/* Bitta tugma: Tahrirlash -> inputlar enable bo'ladi -> Saqlash */}
        <button
          type="button"
          onClick={toggleEditSave}
          disabled={saving || !isReady}
          className="mt-2 w-full rounded-xl text-[#fff] bg-[#2563EB] py-3 text-center text-[15px] font-semibold  transition-colors disabled:opacity-50 cursor-pointer hover:bg-primary/80"
        >
          {!isReady
            ? "Yuklanmoqda..."
            : saving
              ? "Saqlanmoqda..."
              : isEditing
                ? "Saqlash"
                : "Tahrirlash"}
        </button>

        <DeleteAccountSection />
      </div>
    </div>
  );
}

export default InfoPage;
