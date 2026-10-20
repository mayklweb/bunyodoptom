// utils/bottomSheetRef.ts
import BottomSheet from "@gorhom/bottom-sheet";

export const homeSheetRef = { current: null as BottomSheet | null };

export function closeBottomSheet() {
  homeSheetRef.current?.close();
}

export function openBottomSheet() {
  homeSheetRef.current?.expand();
}