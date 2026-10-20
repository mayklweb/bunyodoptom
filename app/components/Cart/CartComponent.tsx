"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CartHeader } from "./CartHeader";
import { EmptyCart } from "./EmptyCart";
import { SelectAllToggle } from "./SelectAllToggle";
import { CartItemCard } from "./CartItemCard";
import { CartSummary } from "./CartSummary";
import { CheckoutModal } from "./CheckoutModal";
import { MarketRegisterModal } from "../MarketRegisterModal/MarketRegisterModal";
import { MobileBottomBar } from "./MobileBottomBar";
import { useUIStore } from "@/app/store/useUIStore";
import { useProfile } from "@/app/hooks/user/useProfile";
import { useCheckout } from "@/app/hooks/orders/useCheckout";

import { useCartStore } from "@/app/store/cart.store";
import { useMarket } from "@/app/hooks/markets/useMarkets";
import { useCreateMarket } from "@/app/hooks/markets/useCreateMarket";
import { useUpdateMarket } from "@/app/hooks/markets/useUpdateMarket";
import { useDeleteMarket } from "@/app/hooks/markets/useDeleteMarket";

type PaymentMethod = "cash" | "click";

function CartComponent() {
  const {
    cart,
    changeQty,
    remove,
    toggleAll,
    toggleItem,
    allSelected,
    selectedItems,
    total,
    totalCount,
    selectedIds,
    clearCart,
  } = useCartStore();

  const { setActiveSection } = useUIStore();
  const router = useRouter();

  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useProfile();
  const { mutate: checkout, isPending } = useCheckout();
  const {
    data: market,
    isLoading: isStoreLoading,
    isError: isStoreError,
    refetch: refetchStore,
  } = useMarket();
  const { mutate: createStore, isPending: creating } = useCreateMarket();
  const { mutate: updateStore, isPending: updating } = useUpdateMarket();
  const { mutate: deleteStore, isPending: deleting } = useDeleteMarket();

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showMarketModal, setShowMarketModal] = useState(false);
  const [pendingMarketId, setPendingMarketId] = useState<number | null>(null);


  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  function handleCheckout() {
    if (isUserLoading || isStoreLoading || isPending) return;

    if (isUserError || !user) {
      alert("Iltimos, tizimga kiring.");
      return;
    }

    if (isStoreError) {
      alert("Do‘kon ma’lumotlarini yuklashda xatolik yuz berdi.");
      return;
    }

    if (!market && !pendingMarketId) {
      setShowMarketModal(true);
      return;
    }

    proceedToCheckout(pendingMarketId ?? market?.id ?? null);
  }

  function handleMarketRegistered(marketId: number) {
    setPendingMarketId(marketId);
    setShowMarketModal(false);
    proceedToCheckout(marketId);
  }

  const proceedToCheckout = (marketId: number | null) => {
    if (!user) {
      alert(
        "Пожалуйста, войдите в систему, чтобы продолжить оформление заказа.",
      );
      return;
    }

    if (!marketId) {
      alert("Пожалуйста, выберите магазин.");
      return;
    }

    if (!selectedAddressId) {
      alert("Пожалуйста, выберите адрес доставки.");
      return;
    }

    const items = selectedItems();

    const products = items.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      qty: item.count ?? 1,
    }));

    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.count,
      0,
    );

    checkout(
      {
        user_id: parseInt(user.id),
        total_amount: totalAmount,
        address_id: selectedAddressId,
        market_id: marketId,
        payment_method: paymentMethod,
        payed: false,
        status: "preparing",
        products: products,
      },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          setActiveSection("orders");
          clearCart();
          router.push("/profile");
        },
        onError: (error) => {
          console.error("Checkout failed:", error);
          alert(
            "Buyurtma yuborishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.",
          );
        },
      },
    );
  };

  const canCheckout =
    selectedItems().length > 0 && !!selectedAddressId && !isPending;

  return (
    <>
      <div className="w-full h-full flex flex-col mt-20">
        <CartHeader />

        {cart.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="flex flex-col lg:flex-row items-start gap-5">
            {/* Cart items section */}
            <div className="w-full lg:w-7/10 flex flex-col gap-5">
              <SelectAllToggle
                isAllSelected={allSelected()}
                selectedCount={selectedItems().length}
                onToggle={toggleAll}
              />

              <div className="flex flex-col gap-3">
                {cart.map((item) => (
                  <CartItemCard
                    key={item.id}
                    item={item}
                    isSelected={selectedIds.includes(item.id)}
                    onToggle={toggleItem}
                    onChangeQty={changeQty}
                    onRemove={remove}
                  />
                ))}
              </div>
            </div>

            {/* Desktop summary sidebar */}
            <CartSummary
              user={user}
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
              totalCount={totalCount()}
              total={total()}
              selectedItemsCount={selectedItems().length}
              canCheckout={canCheckout}
              isPending={isPending}
              onCheckout={handleCheckout}
            />

            {/* Mobile bottom bar */}
            <MobileBottomBar
              totalCount={totalCount()}
              total={total()}
              selectedCount={selectedItems().length}
              onCheckout={() => setIsModalOpen(true)}
            />

            {/* Mobile checkout modal */}
            <CheckoutModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              user={user}
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
              totalCount={totalCount()}
              total={total()}
              canCheckout={canCheckout}
              isPending={isPending}
              onCheckout={handleCheckout}
            />
          </div>
        )}
      </div>

      {showMarketModal && (
        <MarketRegisterModal
          onSuccess={handleMarketRegistered}
          onClose={() => setShowMarketModal(false)}
        />
      )}
    </>
  );
}

export default CartComponent;
