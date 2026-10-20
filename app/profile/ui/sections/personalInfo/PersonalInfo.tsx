"use client";

import {
  FIELD_CONFIG,
  INITIAL_FIELDS,
} from "@/app/profile/model/constants/constants";
import { FieldKey, ProfileFields } from "@/app/profile/model/types/types";
import { useState, useRef, useEffect } from "react";
import { ProfileField } from "../profileField/ProfileField";
import {
  useGetMe,
  useUpdateProfile,
  useUser,
  useLogout,
} from "@/app/shared/lib/useAuth"; // ✅ import useLogout

export function PersonalInfo() {
  const { mutate: getMe } = useGetMe();
  const { mutate: updateMe, isPending: saving } = useUpdateProfile();
  const { data: user } = useUser();
  const { mutate: logout, isPending: loggingOut } = useLogout(); // ✅

  const [fields, setFields] = useState<ProfileFields>(INITIAL_FIELDS);
  const [draft, setDraft] = useState<ProfileFields>(INITIAL_FIELDS);
  const [editingField, setEditingField] = useState<FieldKey | null>(null);

  const initializedRef = useRef(false);
  const inputRefs = useRef<Partial<Record<FieldKey, HTMLInputElement | null>>>(
    {},
  );

  useEffect(() => {
    getMe();
  }, []);

  useEffect(() => {
    if (user && !initializedRef.current) {
      initializedRef.current = true;
      const updated: ProfileFields = {
        ...INITIAL_FIELDS,
        name: user.name ?? "",
        phone: user.phone ?? "",
        id: String(user.id),
      };
      setFields(updated);
      setDraft(updated);
    }
  }, [user]);

  useEffect(() => {
    if (editingField) inputRefs.current[editingField]?.focus();
  }, [editingField]);

  const handleToggle = (key: FieldKey) => setEditingField(key);

  const handleChange = (key: FieldKey, value: string) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const handleSave = (key: FieldKey) => {
    const value = draft[key];
    if (!value) return;

    const payload = {
      name: key === "name" ? value : draft.name,
      phone: key === "phone" ? value : draft.phone,
    };

    updateMe(payload, {
      onSuccess: () => {
        setFields((prev) => ({ ...prev, [key]: value }));
        setEditingField(null);
      },
    });
  };

  const handleCancel = (key: FieldKey) => {
    setDraft((prev) => ({ ...prev, [key]: fields[key] }));
    setEditingField(null);
  };

  const handleLogout = () => logout();

  return (
    <div className="w-full h-full">
      <div className="hidden lg:block lg:mb-3">
        <h1 className="text-2xl font-semibold">Shaxsiy ma'lumotlar</h1>
      </div>

      <div className="flex flex-col gap-2.5">
        {FIELD_CONFIG.map(({ key, label, disabled }) => (
          <ProfileField
            key={key}
            label={label}
            value={
              editingField === key ? (draft[key] ?? "") : (fields[key] ?? "")
            }
            /* pass editing prop via a cast to avoid TS prop-type error in this file */
            {...({ editing: editingField === key } as any)}
            disabled={disabled}
            saving={saving && editingField === key}
            onChange={(e) => handleChange(key, e.target.value)}
            onToggle={() => handleToggle(key)}
            onSave={() => handleSave(key)}
            onCancel={() => handleCancel(key)}
            inputRef={(el) => {
              inputRefs.current[key] = el;
            }}
          />
        ))}

        {/* ✅ Logout button */}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="hidden lg:block mt-2 w-full py-3 rounded-xl border border-red-200 text-red-500 text-sm font-medium
            hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {loggingOut ? "Chiqilmoqda..." : "Hisobdan chiqish"}
        </button>
      </div>
    </div>
  );
}
