import { CheckIcon } from "../../shared/icons";

interface SelectAllToggleProps {
  isAllSelected: boolean;
  selectedCount: number;
  onToggle: () => void;
}

export function SelectAllToggle({
  isAllSelected,
  selectedCount,
  onToggle,
}: SelectAllToggleProps) {
  return (
    <div
      className="flex items-center gap-3 cursor-pointer select-none bg-white p-4 rounded-xl"
      onClick={onToggle}
    >
      <div
        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
          isAllSelected
            ? "bg-primary border-primary"
            : "border-gray-300 bg-white"
        }`}
      >
        {isAllSelected && <CheckIcon className="w-3 h-3 text-white" />}
      </div>
      <span className="text-sm font-medium text-black">
        Tanlangan: {selectedCount} ta mahsulot
      </span>
    </div>
  );
}
