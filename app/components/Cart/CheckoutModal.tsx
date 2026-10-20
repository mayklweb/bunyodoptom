import { UserInfoCard } from "./UserInfoCard";
import { AddressSelector } from "./AddressSelector";
import { PaymentMethodSelector } from "./PaymentMethodSelector";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  paymentMethod: "cash" | "click";
  onPaymentMethodChange: (method: "cash" | "click") => void;
  totalCount: number;
  total: number;
  canCheckout: boolean;
  isPending: boolean;
  onCheckout: () => void;
}

export function CheckoutModal({
  isOpen,
  onClose,
  user,
  paymentMethod,
  onPaymentMethodChange,
  totalCount,
  total,
  canCheckout,
  isPending,
  onCheckout,
}: CheckoutModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        onClick={onClose}
      />

      <div className="fixed left-0 bottom-0 w-full bg-white rounded-t-2xl z-50 p-5 flex flex-col gap-4 lg:hidden shadow-2xl">
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto -mt-1" />

        <h2 className="text-lg font-semibold text-gray-800">
          Buyurtmani tasdiqlash
        </h2>

        {user && (
          <UserInfoCard
            name={user.name}
            phone={user.phone}
            className="bg-gray-50 px-4 py-3 rounded-xl"
          />
        )}

        <div className="flex items-center justify-between text-sm text-gray-500 bg-gray-50 px-4 py-3 rounded-xl">
          <span>Mahsulotlar</span>
          <span className="font-semibold text-gray-800">{totalCount} dona</span>
        </div>

        <PaymentMethodSelector
          selected={paymentMethod}
          onChange={onPaymentMethodChange}
          variant="mobile"
        />

        <div className="w-full h-px bg-gray-100" />

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Jami summa</span>
          <span className="text-xl font-bold text-gray-900">
            {total.toLocaleString()} so'm
          </span>
        </div>

        <button
          onClick={onCheckout}
          disabled={!canCheckout}
          className="w-full py-3.5 rounded-xl bg-primary text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          {isPending
            ? "Yuborilmoqda..."
            : `Tasdiqlash — ${total.toLocaleString()} so'm`}
        </button>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl border border-gray-200 text-gray-500 text-sm font-medium cursor-pointer"
        >
          Bekor qilish
        </button>
      </div>
    </>
  );
}
