"use client";

import CartComponent from "../components/Cart/CartComponent";
import MobileHeader from "../shared/components/Mobileheader";

function Cart() {
  return (
    <section>
      <MobileHeader title="Savat" />

      {/* pt-20 — mobil'dagi fixed MobileHeader balandligiga joy qoldirish uchun.
          md:pt-0 — desktopda alohida header yo'q, AppHeader allaqachon joy qoldiradi. */}
      <div className="container pt-20 md:pt-0">
        <div className="w-full h-full flex flex-col">
          <CartComponent />
        </div>
      </div>
    </section>
  );
}

export default Cart;
