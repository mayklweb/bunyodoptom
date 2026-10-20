import { UserInfoCard } from "./UserInfoCard";
import { PaymentMethodSelector } from "./PaymentMethodSelector";

interface CartSummaryProps {
  user: any;
  paymentMethod: "cash" | "click";
  onPaymentMethodChange: (method: "cash" | "click") => void;
  totalCount: number;
  total: number;
  selectedItemsCount: number;
  canCheckout: boolean;
  isPending: boolean;
  onCheckout: () => void;
}

export function CartSummary({
  user,
  paymentMethod,
  onPaymentMethodChange,
  totalCount,
  total,
  selectedItemsCount,
  canCheckout,
  isPending,
  onCheckout,
}: CartSummaryProps) {
  return (
    <div className="w-full lg:w-3/10 bg-white rounded-2xl shadow-sm p-4 hidden lg:flex flex-col gap-3">
      {user && (
        <>
          <UserInfoCard name={user.name} phone={user.phone} />
          <div className="w-full h-px bg-gray-100" />
        </>
      )}

      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>Tanlangan mahsulotlar</span>
        <span>{totalCount} dona</span>
      </div>

      <div className="w-full h-px bg-gray-100" />

      <div className="w-full h-px bg-gray-100" />

      <PaymentMethodSelector
        selected={paymentMethod}
        onChange={onPaymentMethodChange}
        variant="desktop"
      />

      <div className="w-full h-px bg-gray-100" />

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">Jami summa</span>
        <span className="text-lg font-bold text-gray-900">
          {total.toLocaleString()} so'm
        </span>
      </div>

      <button
        onClick={onCheckout}
        disabled={!canCheckout}
        className="w-full py-3 rounded-xl bg-primary text-white font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        {isPending
          ? "Yuborilmoqda..."
          : `Buyurtma berish (${selectedItemsCount})`}
      </button>
    </div>
  );
}
