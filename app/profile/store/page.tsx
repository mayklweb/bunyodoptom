"use client";

import { useId, useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";

import { DISTRICTS } from "@/app/profile/model/constants/constants";
import {
  EditIcon,
  LocationIcon,
  MarketIcon,
  DeleteIcon,
} from "@/app/shared/icons";
import { useMarket } from "@/app/hooks/markets/useMarkets";
import { useCreateMarket } from "@/app/hooks/markets/useCreateMarket";
import { useUpdateMarket } from "@/app/hooks/markets/useUpdateMarket";
import { useDeleteMarket } from "@/app/hooks/markets/useDeleteMarket";

interface FormState {
  name: string;
  district: string;
  address: string;
}

const empty: FormState = { name: "", district: "", address: "" };

/* ------------------------------------------------------------------ */
/* Styles — same Tailwind classes as the category dropdown            */
/* ------------------------------------------------------------------ */

const panelClass =
  "w-full overflow-hidden rounded-3xl border border-black/5 bg-white/90 shadow-2xl shadow-black/10 backdrop-blur-xl";

const rowClass = "flex items-start gap-3 rounded-2xl px-3.5 py-2.5";

const inputClass =
  "h-11 w-full min-w-0 rounded-2xl border border-black/5 bg-gray-50 px-3.5 text-base text-gray-800 outline-none transition-shadow placeholder:text-gray-400 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary/20 md:text-sm";

const buttonBase =
  "inline-flex h-10 items-center justify-center gap-2 rounded-xl px-5 text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

const primaryButton = `${buttonBase} bg-primary text-white shadow-sm hover:bg-primary/90`;
const softButton = `${buttonBase} bg-primary/10 text-primary hover:bg-primary/15`;
const dangerSoftButton = `${buttonBase} bg-red-50 text-red-600 hover:bg-red-100 focus-visible:ring-red-500/40`;
const dangerButton = `${buttonBase} bg-red-600 text-white shadow-sm hover:bg-red-700 focus-visible:ring-red-500/40`;

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

// The API may store either the district id or its name — handle both
const findDistrict = (value?: string | number | null) =>
  DISTRICTS.find(
    (d) => String(d.id) === String(value) || d.district === value,
  );

/* ------------------------------------------------------------------ */

function StorePage() {
  const uid = useId();

  const { data: markets, isLoading } = useMarket();
  const {
    mutate: createMarket,
    isPending: creating,
    isError: createFailed,
    reset: resetCreate,
  } = useCreateMarket();
  const {
    mutate: updateMarket,
    isPending: updating,
    isError: updateFailed,
    reset: resetUpdate,
  } = useUpdateMarket();
  const {
    mutate: deleteMarket,
    isPending: deleting,
    isError: deleteFailed,
    reset: resetDelete,
  } = useDeleteMarket();

  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [draft, setDraft] = useState<FormState>(empty);

  const shop = markets?.[0];
  const isEmpty = !shop;
  const saving = creating || updating;
  const saveFailed = createFailed || updateFailed;

  const districtName = findDistrict(shop?.district)?.district ?? shop?.district;

  const canSave =
    draft.name.trim() && draft.district && draft.address.trim() && !saving;

  const handleEdit = () => {
    resetCreate();
    resetUpdate();
    setConfirmDelete(false);
    setDraft({
      name: shop?.name ?? "",
      district: String(findDistrict(shop?.district)?.id ?? shop?.district ?? ""),
      address: shop?.address ?? "",
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setDraft(empty);
    setIsEditing(false);
    setConfirmDelete(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setDraft((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave) return;

    const payload = {
      name: draft.name.trim(),
      region: "Xorazm",
      district: draft.district,
      address: draft.address.trim(),
    };

    if (shop) {
      updateMarket({ id: shop.id, data: payload }, { onSuccess: handleCancel });
    } else {
      createMarket(payload, { onSuccess: handleCancel });
    }
  };

  const handleDelete = () => {
    if (!shop) return;
    deleteMarket(shop.id, {
      onSuccess: () => {
        setConfirmDelete(false);
        setIsEditing(false);
        setDraft(empty);
      },
    });
  };

  const askDelete = () => {
    resetDelete();
    setConfirmDelete(true);
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-xl" aria-busy="true" aria-label="Yuklanmoqda">
        <div className={`${panelClass} space-y-1 p-2`}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-12 animate-pulse rounded-2xl bg-gray-100"
              style={{ opacity: 1 - i * 0.2 }}
            />
          ))}
        </div>
      </div>
    );
  }

  const nameId = `${uid}-name`;
  const districtId = `${uid}-district`;
  const addressId = `${uid}-address`;
  const confirmId = `${uid}-confirm`;

  return (
    <div className="w-full max-w-xl">
      {/* Page header */}
      <div className="mb-3 hidden lg:block">
        <h1 className="text-2xl font-semibold">Mening do&apos;konim</h1>
      </div>

      <section className={panelClass}>
        {/* Card header */}
        <div className="flex flex-wrap items-center gap-3 border-b border-black/5 px-5 py-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <MarketIcon className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs text-gray-400">Do&apos;kon ma&apos;lumotlari</p>
            <p className="truncate text-sm font-semibold text-gray-800">
              {shop?.name ?? (
                <span className="font-normal text-gray-400">
                  Nom kiritilmagan
                </span>
              )}
            </p>
          </div>

          {!isEmpty && !isEditing && (
            <div className="flex items-center gap-2">
              <button type="button" onClick={handleEdit} className={softButton}>
                <EditIcon className="h-4 w-4" />
                Tahrirlash
              </button>
              <button
                type="button"
                onClick={askDelete}
                className={dangerSoftButton}
              >
                <DeleteIcon className="h-4 w-4" />
                O&apos;chirish
              </button>
            </div>
          )}
        </div>

        <div className="p-4">
          {/* Delete confirmation */}
          {confirmDelete && (
            <div
              role="alertdialog"
              aria-labelledby={confirmId}
              className="mb-4 rounded-2xl bg-red-50 p-4"
            >
              <p id={confirmId} className="mb-3 text-sm font-medium text-red-700">
                Do&apos;konni o&apos;chirishni tasdiqlaysizmi? Bu amalni qaytarib
                bo&apos;lmaydi.
              </p>
              {deleteFailed && (
                <p role="alert" className="mb-3 text-sm text-red-600">
                  O&apos;chirib bo&apos;lmadi. Qaytadan urinib ko&apos;ring.
                </p>
              )}
              <div className="flex flex-col-reverse gap-2 sm:flex-row">
                <button
                  type="button"
                  autoFocus
                  onClick={() => setConfirmDelete(false)}
                  disabled={deleting}
                  className={`${softButton} flex-1`}
                >
                  Bekor qilish
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className={`${dangerButton} flex-1`}
                >
                  {deleting && (
                    <Loader2
                      aria-hidden="true"
                      className="h-4 w-4 animate-spin"
                    />
                  )}
                  {deleting ? "O'chirilmoqda..." : "Ha, o'chirish"}
                </button>
              </div>
            </div>
          )}

          {isEditing ? (
            <form onSubmit={handleSave} noValidate className="flex flex-col gap-4">
              {/* Shop name */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor={nameId}
                  className="px-0.5 text-sm font-medium text-gray-800"
                >
                  Do&apos;kon nomi
                </label>
                <input
                  id={nameId}
                  type="text"
                  name="name"
                  autoComplete="organization"
                  value={draft.name}
                  onChange={handleChange}
                  placeholder="Masalan: Bahor savdo markazi"
                  className={inputClass}
                />
              </div>

              {/* District */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor={districtId}
                  className="px-0.5 text-sm font-medium text-gray-800"
                >
                  Tuman / Shahar
                </label>
                <div className="relative">
                  <select
                    id={districtId}
                    name="district"
                    value={draft.district}
                    onChange={handleChange}
                    className={`${inputClass} cursor-pointer appearance-none pr-10 ${
                      draft.district ? "" : "text-gray-400"
                    }`}
                  >
                    <option value="">Tumanni tanlang</option>
                    {DISTRICTS.map((d) => (
                      <option key={d.id} value={d.id} className="text-gray-800">
                        {d.district}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    aria-hidden="true"
                    className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                    strokeWidth={2}
                  />
                </div>
              </div>

              {/* Exact address */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor={addressId}
                  className="px-0.5 text-sm font-medium text-gray-800"
                >
                  Aniq manzil
                </label>
                <input
                  id={addressId}
                  type="text"
                  name="address"
                  autoComplete="street-address"
                  value={draft.address}
                  onChange={handleChange}
                  placeholder="Ko'cha, uy raqami..."
                  className={inputClass}
                />
              </div>

              {saveFailed && !saving && (
                <p role="alert" className="px-0.5 text-sm text-red-600">
                  Saqlab bo&apos;lmadi. Qaytadan urinib ko&apos;ring.
                </p>
              )}

              {/* Actions */}
              <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className={`${softButton} flex-1`}
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={!canSave}
                  className={`${primaryButton} flex-1`}
                >
                  {saving && (
                    <Loader2
                      aria-hidden="true"
                      className="h-4 w-4 animate-spin"
                    />
                  )}
                  {saving ? "Saqlanmoqda..." : "Saqlash"}
                </button>
              </div>
            </form>
          ) : isEmpty ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-3xl bg-gray-100 text-gray-400">
                <LocationIcon className="h-6 w-6" />
              </div>
              <p className="text-sm text-gray-500">
                Do&apos;kon ma&apos;lumotlari kiritilmagan
              </p>
              <button
                type="button"
                onClick={handleEdit}
                className={`${primaryButton} mt-4`}
              >
                Ma&apos;lumot qo&apos;shish
              </button>
            </div>
          ) : (
            <dl className="-mx-2.5 -my-2">
              <InfoRow
                icon={<MarketIcon className="h-[18px] w-[18px]" />}
                label="Do'kon nomi"
                value={shop.name}
              />
              <InfoRow
                icon={<LocationIcon className="h-[18px] w-[18px]" />}
                label="Joylashuv"
                value={[districtName, shop.address].filter(Boolean).join(", ")}
              />
            </dl>
          )}
        </div>
      </section>
    </div>
  );
}

export default StorePage;

/** Read-only row styled like a dropdown item */
function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
}) {
  return (
    <div className={rowClass}>
      <span className="mt-0.5 shrink-0 text-gray-400">{icon}</span>
      <div className="min-w-0 flex-1">
        <dt className="text-xs text-gray-400">{label}</dt>
        <dd className="break-words text-sm font-medium text-gray-800">
          {value || <span className="font-normal text-gray-400">—</span>}
        </dd>
      </div>
    </div>
  );
}