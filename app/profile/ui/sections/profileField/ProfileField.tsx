import type { ChangeEvent, KeyboardEvent, Ref } from "react";

interface ProfileFieldProps {
  label: string;
  value: string;
  /** Whether this specific input is currently typeable. Driven by the
   *  page-level edit mode AND this field's own `disabled` config. */
  editable: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  inputRef?: Ref<HTMLInputElement>;
}

/**
 * Pure input field — no per-field buttons. Editing is controlled globally
 * by the parent (PersonalInfo), which has a single Edit/Save button that
 * enables/disables every field's `editable` prop at once.
 */
export function ProfileField({
  label,
  value,
  editable,
  onChange,
  onKeyDown,
  inputRef,
}: ProfileFieldProps) {
  return (
    <div>
      <label className="text-sm text-gray">{label}</label>
   
      <input
        ref={inputRef}
        type="text"
        value={value}
        disabled={!editable}
        onChange={onChange}
        onKeyDown={onKeyDown}
        className="mt-1 w-full rounded-xl bg-white px-3 py-2 text-black outline-none focus:text-black disabled:text-gray"
      />
    </div>
  );
}
