// "use client";

// import { useEffect, useState } from "react";
// import {
//   useAddAddress,
//   useAddresses,
//   useDeleteAddress,
//   useEditAddress,
// } from "@/app/shared/lib/hooks/useAddresses";
// import { Address } from "@/app/shared/lib/addressesApi";
// import {
//   CheckIcon,
//   CloseIcon,
//   DeleteIcon,
//   EditIcon,
//   PlusIcon,
// } from "@/app/shared/icons";
// import { useAddressStore } from "@/app/store/useAddressStore";

// const DISTRICTS = [
//   "Urganch tumani",
//   "Xonqa tumani",
//   "Bog'ot tumani",
//   "Gurlan tumani",
//   "Qo'shko'pir tumani",
//   "Shovot tumani",
//   "Yangiariq tumani",
//   "Yangibozor tumani",
//   "Xazorasp tumani",
//   "Pitnak tumani",
// ];

// interface FormState {
//   region: string;
//   district: string;
//   address: string;
// }

// const empty: FormState = {
//   region: "Xorazm",
//   district: "",
//   address: "",
// };

// export function Addresses() {
//   const { data: addresses, isLoading } = useAddresses();
//   const { mutate: addAddress, isPending: adding } = useAddAddress();
//   const { mutate: editAddress, isPending: editing } = useEditAddress();
//   const { mutate: deleteAddress } = useDeleteAddress();

//   console.log(addresses);

//   const { selectedId, setSelected, initFromAddresses } = useAddressStore();

//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [editingId, setEditingId] = useState<number | null>(null);
//   const [form, setForm] = useState<FormState>(empty);
//   const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

//   useEffect(() => {
//     if (addresses?.length) initFromAddresses(addresses);
//   }, [addresses]);

//   const openAdd = () => {
//     setEditingId(null);
//     setForm(empty);
//     setIsFormOpen(true);
//   };

//   const openEdit = (e: React.MouseEvent, addr: Address) => {
//     e.stopPropagation();
//     setEditingId(addr.id);
//     setForm({
//       region: addr.region,
//       district: addr.district,
//       address: addr.address,
//     });
//     setIsFormOpen(true);
//   };

//   const closeForm = () => {
//     setIsFormOpen(false);
//     setEditingId(null);
//     setForm(empty);
//   };

//   const handleDelete = (e: React.MouseEvent, id: number) => {
//     e.stopPropagation();
//     if (confirmDeleteId === id) {
//       deleteAddress(id, { onSuccess: () => setConfirmDeleteId(null) });
//     } else {
//       setConfirmDeleteId(id);
//     }
//   };

//   const handleSubmit = () => {
//     if (!form.district || !form.address) return;

//     const payload: Partial<Address> = {
//       region: "Xorazm",
//       district: form.district,
//       address: form.address,
//     };

//     if (editingId) {
//       editAddress({ id: editingId, data: payload }, { onSuccess: closeForm });
//     } else {
//       addAddress(payload as Omit<Address, "id">, { onSuccess: closeForm });
//     }
//   };

//   if (isLoading)
//     return <div className="text-sm text-gray-400">Yuklanmoqda...</div>;

//   return (
//     <div className="flex flex-col gap-3">
//       {addresses?.map((address: Address) => {
//         const isSelected = selectedId === address.id;

//         return (
//           <div
//             key={address.id}
//             className={`border rounded-xl p-4 flex flex-col gap-3 transition-colors ${
//               isSelected
//                 ? "border-accent bg-[#e5e6ff]"
//                 : "bg-primary/10 border-gray-100"
//             }`}
//           >
//             {/* Info + radio row */}
//             <div className="w-full flex items-start justify-between gap-2">
//               <div className="flex-1 min-w-0">
//                 <p className="text-sm font-semibold">
//                   {address.region}, {address.district}
//                 </p>
//                 <p className="text-xs text-gray-400 mt-0.5 truncate">
//                   {address.address}
//                 </p>
//               </div>
//             </div>

//             <div className="w-full h-px bg-gray-200/60" />

//             {/* Action buttons */}
//             <div className="flex items-center gap-2 flex-wrap">
//               {/* Select button — only shown when not already selected */}
//               {!isSelected && (
//                 <button
//                   onClick={() => setSelected(address)}
//                   className="text-xs px-3 py-1.5 rounded-lg border border-primary/40 text-primary hover:bg-primary/10 transition-colors font-medium"
//                 >
//                   Tanlash
//                 </button>
//               )}

//               {/* Selected badge */}
//               {isSelected && (
//                 <span className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-primary/10 text-primary font-medium">
//                   <CheckIcon className="w-3 h-3" />
//                   Tanlangan
//                 </span>
//               )}

//               <button
//                 onClick={(e) => openEdit(e, address)}
//                 className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
//               >
//                 <EditIcon className="w-3.5 h-3.5" />
//                 Tahrirlash
//               </button>

//               <button
//                 onClick={(e) => handleDelete(e, address.id)}
//                 className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors ${
//                   confirmDeleteId === address.id
//                     ? "border-red-400 bg-red-500 text-white hover:bg-red-600"
//                     : "border-red-200 text-red-500 hover:bg-red-50"
//                 }`}
//               >
//                 <DeleteIcon className="w-3.5 h-3.5" />
//                 {confirmDeleteId === address.id ? "Tasdiqlash" : "O'chirish"}
//               </button>

//               {confirmDeleteId === address.id && (
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     setConfirmDeleteId(null);
//                   }}
//                   className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
//                 >
//                   Bekor
//                 </button>
//               )}
//             </div>
//           </div>
//         );
//       })}

//       {addresses?.length === 0 && (
//         <div className="text-center text-gray-400 text-sm py-6">
//           Manzil yo'q. Yangi manzil qo'shing.
//         </div>
//       )}

//       {!isFormOpen && (
//         <button
//           onClick={openAdd}
//           className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
//         >
//           <PlusIcon className="w-4 h-4" />
//           Yangi manzil qo'shish
//         </button>
//       )}

//       {isFormOpen && (
//         <div className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col gap-3 shadow-sm">
//           <div className="flex items-center justify-between">
//             <h3 className="text-sm font-semibold">
//               {editingId ? "Manzilni tahrirlash" : "Yangi manzil"}
//             </h3>
//             <button
//               onClick={closeForm}
//               className="text-gray-400 hover:text-gray-600"
//             >
//               <CloseIcon className="w-4 h-4" />
//             </button>
//           </div>

//           <input
//             value="Xorazm"
//             disabled
//             className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
//           />

//           <select
//             value={form.district}
//             onChange={(e) =>
//               setForm((p) => ({ ...p, district: e.target.value }))
//             }
//             className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary transition-colors bg-white"
//           >
//             <option value="">Tuman tanlang</option>
//             {DISTRICTS.map((d) => (
//               <option key={d} value={d}>
//                 {d}
//               </option>
//             ))}
//           </select>

//           <input
//             value={form.address}
//             onChange={(e) =>
//               setForm((p) => ({ ...p, address: e.target.value }))
//             }
//             placeholder="Ko'cha, uy raqami"
//             className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
//           />

//           <div className="flex gap-2">
//             <button
//               onClick={closeForm}
//               className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
//             >
//               Bekor qilish
//             </button>
//             <button
//               onClick={handleSubmit}
//               disabled={adding || editing || !form.district || !form.address}
//               className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-medium disabled:opacity-40 hover:opacity-90 transition-opacity"
//             >
//               {adding || editing
//                 ? "Saqlanmoqda..."
//                 : editingId
//                   ? "Saqlash"
//                   : "Qo'shish"}
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
