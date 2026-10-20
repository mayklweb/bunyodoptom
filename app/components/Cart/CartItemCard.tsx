import Link from "next/link";
import Image from "next/image";
import { CheckIcon, DeleteIcon, MinusIcon, PlusIcon } from "../../shared/icons";

interface CartItem {
  id: number;
  name: string;
  price: number;
  count: number;
  images: Array<{ url: string }>;
}

interface CartItemCardProps {
  item: CartItem;
  isSelected: boolean;
  onToggle: (id: number) => void;
  onChangeQty: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
}

export function CartItemCard({
  item,
  isSelected,
  onToggle,
  onChangeQty,
  onRemove,
}: CartItemCardProps) {
  const imagePath = item.images?.[0]?.url;
  const imageUrl = imagePath
    ? `https://api.bunyodoptom.uz${imagePath}`
    : "/placeholder.png";

  const handleDecrement = () => {
    if (item.count <= 1) {
      onRemove(item.id);
    } else {
      onChangeQty(item.id, -1);
    }
  };

  return (
    <div
      className={`bg-white rounded-xl p-2 flex flex-col gap-2 shadow-sm transition-all `}
    >
      <div className="w-full flex gap-2">
        <div className="relative w-25 h-18.5 rounded-xl bg-gray-100 overflow-hidden shrink-0">
          <Image
            src={imageUrl}
            alt={item.name}
            fill
            sizes="100px"
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0 flex flex-col">
          <Link
            href={`/product/${item.id}`}
            className="text-sm sm:text-lg font-semibold text-gray-800 truncate"
          >
            {item.name}
          </Link>
          <p className="text-sm sm:text-base font-medium text-gray-900">
            {(item.price * item.count).toLocaleString("uz-Latn-uz")} so'm
          </p>
        </div>
        <button
          type="button"
          onClick={() => onToggle(item.id)}
          aria-pressed={isSelected}
          aria-label={isSelected ? "Tanlovni bekor qilish" : "Tanlash"}
          className="cursor-pointer shrink-0"
        >
          <div
            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
              isSelected
                ? "bg-primary border-primary"
                : "border-gray-300 bg-white"
            }`}
          >
            {isSelected && <CheckIcon className="w-3 h-3 text-white" />}
          </div>
        </button>
      </div>

      <div className="border border-solid border-light-gray" />

      <div className="flex gap-4 items-center justify-end">
        <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-1 py-1">
          <button
            type="button"
            onClick={handleDecrement}
            aria-label={item.count <= 1 ? "O'chirish" : "Kamaytirish"}
            className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-gray-600 hover:text-primary transition-colors cursor-pointer"
          >
            <MinusIcon className="w-5 h-5" />
          </button>
          <span className="text-sm font-semibold w-5 text-center">
            {item.count}
          </span>
          <button
            type="button"
            onClick={() => onChangeQty(item.id, 1)}
            aria-label="Ko'paytirish"
            className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-gray-600 hover:text-primary transition-colors cursor-pointer"
          >
            <PlusIcon className="w-5 h-5" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => onRemove(item.id)}
          aria-label={`${item.name} mahsulotini o'chirish`}
          className="flex items-center text-sm font-medium gap-2 px-2 py-2 bg-error-foreground text-error rounded-lg cursor-pointer"
        >
          <DeleteIcon className="w-5 h-5" />
          <span>Yoq qilish</span>
        </button>
      </div>
    </div>
  );
}
