"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

import { CartIcon, CloseIcon, EyeIcon, LocationIcon } from "@/app/shared/icons";
import { useOrders } from "@/app/hooks/orders/useOrders";
import { useCancelOrder } from "@/app/hooks/orders/useCancelOrder";

type OrdersPageOrder = NonNullable<
  ReturnType<typeof useOrders>["data"]
>[number];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

type StatusKey = "shipping" | "preparing" | "delivered" | "cancelled";

const STATUS_META: Record<StatusKey, { label: string; dot: string }> = {
  shipping: { label: "Yo'lda", dot: "bg-blue-500" },
  preparing: { label: "Tayorlanmoqda", dot: "bg-amber-500" },
  delivered: { label: "Yetkazildi", dot: "bg-green-500" },
  cancelled: { label: "Bekor qilindi", dot: "bg-red-500" },
};

// Backend may send Uzbek or English values — normalise both to one key
const STATUS_ALIASES: Record<string, StatusKey> = {
  "yo'lda": "shipping",
  pending: "shipping",
  tayorlanmoqda: "preparing",
  preparing: "preparing",
  yetkazildi: "delivered",
  delivered: "delivered",
  "bekor qilindi": "cancelled",
  cancelled: "cancelled",
};

function getStatus(raw: string | undefined) {
  const normalized = (raw ?? "")
    .toLowerCase()
    .replace(/[’ʻʼ`]/g, "'")
    .trim();
  const key = STATUS_ALIASES[normalized];
  return key
    ? { key, ...STATUS_META[key] }
    : { key: null, label: raw || "Noma'lum", dot: "bg-gray-400" };
}

function canCancel(order: OrdersPageOrder) {
  const { key } = getStatus(order.status);
  return key === "shipping" || key === "preparing";
}

function getTotal(order: OrdersPageOrder) {
  return order.products.reduce((sum, p) => sum + Number(p.price) * p.qty, 0);
}

// Fixed formatting — avoids server/client locale mismatches
function formatSum(value: number) {
  return `${Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ")} so'm`;
}

/* ------------------------------------------------------------------ */
/* Styles — same Tailwind classes as the category dropdown            */
/* ------------------------------------------------------------------ */

// Dropdown panel
const panelClass =
  "overflow-hidden rounded-3xl border border-black/5 bg-white/90 shadow-2xl shadow-black/10 backdrop-blur-xl";

// Dropdown item row
const rowClass = "flex items-center gap-3 rounded-2xl px-3.5 py-2.5";

const buttonBase =
  "inline-flex h-10 items-center justify-center gap-2 rounded-xl px-5 text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

const primaryButton = `${buttonBase} bg-primary text-white shadow-sm hover:bg-primary/90`;
const softButton = `${buttonBase} bg-primary/10 text-primary hover:bg-primary/15`;
const dangerSoftButton = `${buttonBase} bg-red-50 text-red-600 hover:bg-red-100 focus-visible:ring-red-500/40`;
const dangerButton = `${buttonBase} bg-red-600 text-white shadow-sm hover:bg-red-700 focus-visible:ring-red-500/40`;

/* ------------------------------------------------------------------ */
/* Small components                                                    */
/* ------------------------------------------------------------------ */

function StatusBadge({ status }: { status: string }) {
  const { label, dot } = getStatus(status);
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}

function StateMessage({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[50vh] w-full items-center justify-center">
      <div className="flex max-w-xs flex-col items-center gap-3 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gray-100 text-gray-400">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
        {action}
      </div>
    </div>
  );
}

function OrdersSkeleton() {
  return (
    <div
      className="flex flex-col gap-3"
      aria-busy="true"
      aria-label="Yuklanmoqda"
    >
      {[0, 1, 2].map((i) => (
        <div key={i} className={`${panelClass} space-y-1 p-2`}>
          {[0, 1, 2, 3].map((j) => (
            <div
              key={j}
              className="h-10 animate-pulse rounded-2xl bg-gray-100"
              style={{ opacity: 1 - j * 0.15 }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/** Accessible modal: Escape, backdrop click, scroll lock, focus trap/restore */
function Modal({
  onClose,
  labelledBy,
  children,
  maxWidth = "max-w-md",
}: {
  onClose: () => void;
  labelledBy: string;
  children: React.ReactNode;
  maxWidth?: string;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;

      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        aria-hidden="true"
        onClick={onClose}
        className="orders-fade absolute inset-0 bg-black/40 backdrop-blur-sm"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className={`orders-drop relative flex max-h-[90vh] w-full ${maxWidth} flex-col ${panelClass} bg-white/95 outline-none`}
      >
        {children}
      </div>
    </div>
  );
}

/** A product line styled like a dropdown item */
function ProductRow({
  name,
  detail,
  total,
}: {
  name: string;
  detail: string;
  total: string;
}) {
  return (
    <li className={rowClass}>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-gray-800">
          {name}
        </span>
        <span className="block text-xs text-gray-400">{detail}</span>
      </span>
      <span className="shrink-0 text-sm font-medium text-gray-800">
        {total}
      </span>
    </li>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

function OrdersPage() {
  const uid = useId();
  const { data: orders, isLoading, isError, refetch } = useOrders();
  const {
    mutate: cancelOrder,
    isPending: isCancelling,
    isError: isCancelError,
    variables: cancellingId,
    reset: resetCancel,
  } = useCancelOrder();

  const [selectedOrder, setSelectedOrder] = useState<OrdersPageOrder | null>(
    null,
  );
  const [cancelTarget, setCancelTarget] = useState<OrdersPageOrder | null>(
    null,
  );

  const closeCancelDialog = () => {
    if (isCancelling) return;
    setCancelTarget(null);
    resetCancel();
  };

  const confirmCancel = () => {
    if (!cancelTarget) return;
    cancelOrder(cancelTarget.id, {
      onSuccess: () => setCancelTarget(null),
    });
  };

  const askCancel = (order: OrdersPageOrder) => {
    setSelectedOrder(null);
    resetCancel();
    setCancelTarget(order);
  };

  return (
    <div className="h-full w-full">
      <div className="mb-5 hidden lg:block">
        <h1 className="text-2xl font-semibold">Buyurtmalar</h1>
      </div>

      {isLoading && <OrdersSkeleton />}

      {isError && (
        <StateMessage
          icon={<CloseIcon className="h-8 w-8" />}
          title="Xatolik yuz berdi"
          description="Buyurtmalarni yuklab bo'lmadi. Qaytadan urinib ko'ring."
          action={
            <button
              type="button"
              onClick={() => refetch()}
              className={`${primaryButton} mt-1`}
            >
              Qayta yuklash
            </button>
          }
        />
      )}

      {!isLoading && !isError && orders?.length === 0 && (
        <StateMessage
          icon={<CartIcon className="h-8 w-8" />}
          title="Buyurtma mavjud emas"
          description="Hozircha sizda hech qanday buyurtma mavjud emas"
        />
      )}

      {!isLoading && !isError && orders && orders.length > 0 && (
        <ul className="flex flex-col gap-4">
          {orders.map((order) => (
            <li key={order.id}>
              <OrderCard
                order={order}
                onViewDetails={() => setSelectedOrder(order)}
                onCancel={() => askCancel(order)}
                isCancelling={isCancelling && cancellingId === order.id}
              />
            </li>
          ))}
        </ul>
      )}

      {/* Detail modal */}
      {selectedOrder && (
        <Modal
          onClose={() => setSelectedOrder(null)}
          labelledBy={`${uid}-detail-title`}
        >
          <div className="flex items-start justify-between gap-3 px-5 pb-3 pt-5">
            <div>
              <p className="text-xs text-gray-400">Buyurtma raqami</p>
              <h2
                id={`${uid}-detail-title`}
                className="text-base font-semibold text-gray-800"
              >
                #{selectedOrder.id}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={selectedOrder.status} />
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                aria-label="Yopish"
                className="rounded-xl p-1.5 text-gray-400 transition-colors hover:bg-primary/5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          

          <ul className="flex-1 overflow-y-auto overscroll-contain px-1.5 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {selectedOrder.products.map((item, i) => (
              <ProductRow
                key={`${item.name}-${i}`}
                name={typeof item.name === "string" ? item.name : "Mahsulot"}
                detail={`${item.qty} dona × ${formatSum(Number(item.price))}`}
                total={formatSum(Number(item.price) * item.qty)}
              />
            ))}
          </ul>

          <div className="flex items-center justify-between border-t border-black/5 px-5 py-4">
            <p className="text-sm text-gray-500">Jami summa</p>
            <p className="text-lg font-semibold text-gray-800">
              {formatSum(getTotal(selectedOrder))}
            </p>
          </div>

          <div className="flex flex-col-reverse gap-2 px-5 pb-5 sm:flex-row sm:justify-end">
            {canCancel(selectedOrder) && (
              <button
                type="button"
                onClick={() => askCancel(selectedOrder)}
                className={dangerSoftButton}
              >
                Bekor qilish
              </button>
            )}
            <button
              type="button"
              onClick={() => setSelectedOrder(null)}
              className={softButton}
            >
              Yopish
            </button>
          </div>
        </Modal>
      )}

      {/* Cancel confirmation */}
      {cancelTarget && (
        <Modal
          onClose={closeCancelDialog}
          labelledBy={`${uid}-cancel-title`}
          maxWidth="max-w-sm"
        >
          <div className="flex flex-col gap-6 p-6">
            <div className="space-y-2">
              <h2
                id={`${uid}-cancel-title`}
                className="text-lg font-semibold text-gray-800"
              >
                Buyurtmani bekor qilish
              </h2>
              <p className="text-sm text-gray-500">
                #{cancelTarget.id} raqamli buyurtmani bekor qilmoqchimisiz? Bu
                amalni ortga qaytarib bo&apos;lmaydi.
              </p>
              {isCancelError && (
                <p role="alert" className="text-sm text-red-600">
                  Bekor qilib bo&apos;lmadi. Qaytadan urinib ko&apos;ring.
                </p>
              )}
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                autoFocus
                onClick={closeCancelDialog}
                disabled={isCancelling}
                className={softButton}
              >
                Yo&apos;q, qolsin
              </button>
              <button
                type="button"
                onClick={confirmCancel}
                disabled={isCancelling}
                className={dangerButton}
              >
                {isCancelling && (
                  <Loader2
                    aria-hidden="true"
                    className="h-4 w-4 animate-spin"
                  />
                )}
                {isCancelling ? "Bekor qilinmoqda..." : "Ha, bekor qilish"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      <style>{`
        .orders-fade { animation: ordersFade 0.2s ease-out; }
        .orders-drop {
          animation: ordersDrop 0.2s cubic-bezier(.16,1,.3,1);
        }
        @keyframes ordersFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes ordersDrop {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .orders-fade, .orders-drop { animation: none; }
        }
      `}</style>
    </div>
  );
}

export default OrdersPage;

/* ------------------------------------------------------------------ */
/* Order card                                                          */
/* ------------------------------------------------------------------ */

const PREVIEW_COUNT = 3;

function OrderCard({
  order,
  onViewDetails,
  onCancel,
  isCancelling,
}: {
  order: OrdersPageOrder;
  onViewDetails: () => void;
  onCancel: () => void;
  isCancelling: boolean;
}) {
  const previewProducts = order.products.slice(0, PREVIEW_COUNT);
  const remaining = order.products.length - PREVIEW_COUNT;

  return (
    <article className={panelClass}>
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-5 pb-1 pt-4">
        <div className="flex min-w-0 items-center gap-2">
          <span className="text-sm font-semibold text-gray-800">
            #{order.id}
          </span>
         
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Products */}
      <ul className="px-1.5 py-2">
        {previewProducts.map((item, i) => (
          <ProductRow
            key={`${item.name}-${i}`}
            name={String(item.name ?? "Mahsulot")}
            detail={`${item.qty} dona`}
            total={formatSum(Number(item.price) * item.qty)}
          />
        ))}
        {remaining > 0 && (
          <li className="px-3.5 py-1.5 text-xs text-gray-400">
            +{remaining} ta mahsulot yana
          </li>
        )}
      </ul>

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-black/5 px-5 py-4">
        <div>
          <p className="text-xs text-gray-400">Jami</p>
          <p className="text-base font-semibold text-gray-800">
            {formatSum(getTotal(order))}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {canCancel(order) && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isCancelling}
              className={dangerSoftButton}
            >
              {isCancelling && (
                <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
              )}
              Bekor qilish
            </button>
          )}
          <button
            type="button"
            onClick={onViewDetails}
            className={primaryButton}
          >
            <EyeIcon className="h-4 w-4" />
            Batafsil
          </button>
        </div>
      </div>
    </article>
  );
}
