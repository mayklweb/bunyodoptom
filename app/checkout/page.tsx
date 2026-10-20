"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
// import { useCartStore } from "../store/CartStore";
// import { useCheckout } from "../shared/lib/hooks/useCheckout";
// import { useAddresses } from "../shared/lib/hooks/useAddresses";
import {
  CartIcon,
  CheckIcon,
  CloseIcon,
  DownIcon,
  LocationIcon,
} from "../shared/icons";
import { useCreateMarket } from "../hooks/markets/useCreateMarket";
import { useCartStore } from "../store/cart.store";
import { useCheckout } from "../hooks/orders/useCheckout";
import { useMarket } from "../hooks/markets/useMarkets";
// import { useCreateMarket, useMarkets } from "../shared/lib/hooks/useMarket";

// ─── Market Registration Modal ───────────────────────────────────────────────

interface MarketModalProps {
  onSuccess: (marketId: number) => void;
  onClose: () => void;
}

function MarketRegisterModal({ onSuccess, onClose }: MarketModalProps) {
  const { mutate: createMarket, isPending } = useCreateMarket();
  const [form, setForm] = useState({
    name: "",
    region: "",
    district: "",
    address: "",
  });

  const isValid = form.name.trim() && form.address.trim();

  const handleSubmit = () => {
    if (!isValid) return;
    createMarket(form, {
      onSuccess: (market: any) => onSuccess(market.id),
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:w-[480px] rounded-t-2xl sm:rounded-2xl p-5 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle mobile */}
        <div className="sm:hidden flex justify-center mb-4">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <CloseIcon className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-bold mb-1">Magazin ro'yxatdan o'tmagan</h2>
        <p className="text-sm text-gray-400 mb-5">
          Buyurtma berish uchun avval magaziningizni ro'yxatdan o'tkazing
        </p>

        <div className="flex flex-col gap-3">
          {[
            { key: "name", label: "Magazin nomi", required: true },
            { key: "region", label: "Viloyat", required: false },
            { key: "district", label: "Tuman", required: false },
            { key: "address", label: "Manzil", required: true },
          ].map(({ key, label, required }) => (
            <div key={key}>
              <label className="text-sm font-medium text-gray-600 mb-1 block">
                {label} {required && <span className="text-red-400">*</span>}
              </label>
              <input
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition"
                placeholder={label}
                value={form[key as keyof typeof form]}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, [key]: e.target.value }))
                }
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={isPending || !isValid}
          className="mt-5 w-full py-3 bg-primary text-white font-semibold rounded-xl disabled:opacity-50 cursor-pointer transition-opacity"
        >
          {isPending ? "Saqlanmoqda..." : "Saqlash va buyurtma berish"}
        </button>
      </div>
    </div>
  );
}

// ─── Checkout ─────────────────────────────────────────────────────────────────

function Checkout() {
  const router = useRouter();
  const { selectedItems, total, totalCount } = useCartStore();
  // const { data: addresses } = useAddresses();
  const { mutate: checkout, isPending } = useCheckout();
  const { data: markets, isLoading: isMarketsLoading } = useMarket();

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  );
  const [isAddressOpen, setIsAddressOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "click">("cash");
  const [notes, setNotes] = useState("");
  const [showMarketModal, setShowMarketModal] = useState(false);

  // const selectedAddress = addresses?.find((a) => a.id === selectedAddressId);
  const products = selectedItems().map((item) => ({
    ...item,
    qty: item.count,
  }));

  const proceedToCheckout = (marketId: number | null) => {
    checkout(
      {
        // address_id: selectedAddressId,
        // market_id: marketId,
        payment_method: paymentMethod,
        // payed: false,
        products,
        notes,
        user_id: 0,
        total_amount: 0,
      },
      {
        onSuccess: () => router.push("/orders"),
      },
    );
  };

  const handleCheckout = () => {
    if (!selectedAddressId || isMarketsLoading) return;

    const hasMarket = markets && markets.length > 0;

    if (!hasMarket) {
      // No market registered → show registration modal first
      setShowMarketModal(true);
      return;
    }

    // Market exists → proceed directly
    proceedToCheckout(markets[0].id);
  };

  const handleMarketRegistered = (marketId: number) => {
    setShowMarketModal(false);
    proceedToCheckout(marketId);
  };

  if (products.length === 0) {
    return (
      <div className="container mt-10 text-center text-gray-400 text-xl">
        Tanlangan mahsulot yo'q
      </div>
    );
  }

  return (
    <section className="pb-20">
      <div className="container">
        <div className="mb-20">
          <h1 className="text-2xl font-semibold mb-6">Buyurtma berish</h1>

          <div className="flex flex-col gap-4">
            {/* Product list summary */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4">
              <h2 className="text-sm font-semibold text-gray-500 mb-3">
                Mahsulotlar ({totalCount()} dona)
              </h2>
              <div className="flex flex-col gap-3">
                {products.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                      <Image
                        src={
                          typeof item.images?.[0] === "string"
                            ? item.images?.[0]
                            : item.images?.[0]?.url || "/product.jpg"
                        }
                        alt={item.name}
                        width={300}
                        height={225}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-400">{item.count} dona</p>
                    </div>
                    <p className="text-sm font-bold shrink-0">
                      {(Number(item.price) * item.count).toLocaleString()} so'm
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment method */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4">
              <h2 className="text-sm font-semibold text-gray-500 mb-3">
                To'lov usuli
              </h2>
              <div className="flex gap-3">
                {(["cash", "click"] as const).map((method) => (
                  <button
                    key={method}
                    disabled={method === "click"}
                    onClick={() => setPaymentMethod(method)}
                    className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-semibold transition-colors ${
                      paymentMethod === method
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-gray-200 text-gray-500"
                    }`}
                  >
                    {method === "cash" ? "Naqd" : "Click"}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4">
              <h2 className="text-sm font-semibold text-gray-500 mb-2">
                Izoh (ixtiyoriy)
              </h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Kuryer uchun izoh..."
                rows={3}
                className="w-full text-sm border border-gray-200 rounded-xl p-3 resize-none outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Total + Submit */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Jami summa</span>
                <span className="text-xl font-bold text-gray-900">
                  {total().toLocaleString()} so'm
                </span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={isPending || !selectedAddressId || isMarketsLoading}
                className="w-full py-3.5 rounded-xl bg-primary text-white font-semibold text-base hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <CartIcon className="w-5 h-5" />
                {isMarketsLoading
                  ? "Tekshirilmoqda..."
                  : isPending
                    ? "Yuborilmoqda..."
                    : "Buyurtmani tasdiqlash"}
              </button>
              {!selectedAddressId && (
                <p className="text-xs text-center text-red-400">
                  Buyurtma berish uchun manzil tanlang
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Market registration modal */}
      {showMarketModal && (
        <MarketRegisterModal
          onSuccess={handleMarketRegistered}
          onClose={() => setShowMarketModal(false)}
        />
      )}
    </section>
  );
}

export default Checkout;
