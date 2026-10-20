"use client";
import { ProductsType } from "@/app/types";
import { FavoriteIcon, MinusIcon, PlusIcon } from "@/app/shared/icons";
import Image from "next/image";
import { Drawer } from "vaul";
import { useCartStore } from "@/app/store/cart.store";
import { useFavoriteStore } from "@/app/store/favourite.store";

interface Props {
  product: ProductsType | null;
  onClose: () => void;
}

function ProductModal({ product, onClose }: Props) {
  const { addToCart, inc, dec, getQuantity, remove } = useCartStore();
  const { toggleFavorite, isFavorite } = useFavoriteStore();

  const open = !!product;

  return (
    <Drawer.Root
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Drawer.Content
          className="fixed left-0 right-0 bottom-0 z-50 bg-white rounded-t-3xl max-h-[90vh] flex flex-col outline-none sm:max-w-2xl sm:mx-auto"
          aria-describedby={undefined}
        >
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1 shrink-0">
            <div className="w-10 h-1 rounded-full bg-gray" />
          </div>

          {product && (
            <ProductSheetContent
              product={product}
              qty={getQuantity(product.id)}
              liked={isFavorite(product.id)}
              onAdd={() => addToCart(product)}
              onInc={() => inc(product.id)}
              onDec={() =>
                getQuantity(product.id) === 1
                  ? remove(product.id)
                  : dec(product.id)
              }
              onToggleFavorite={() => toggleFavorite(product)}
            />
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

interface ProductSheetContentProps {
  product: ProductsType;
  qty: number;
  liked: boolean;
  onAdd: () => void;
  onInc: () => void;
  onDec: () => void;
  onToggleFavorite: () => void;
}

function ProductSheetContent({
  product,
  qty,
  liked,
  onAdd,
  onInc,
  onDec,
  onToggleFavorite,
}: ProductSheetContentProps) {
  const imagePath = product?.images?.[0]?.url;
  const imageUrl = imagePath
    ? `https://api.bunyodoptom.uz${imagePath}`
    : "/placeholder.png";

  const atStockLimit = qty >= product.stock_qty;

  return (
    <div className="flex-1 overflow-y-auto px-5 pb-6 pt-2">
      <Drawer.Title className="sr-only">{product.name}</Drawer.Title>

      {/* Image */}
      <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden bg-zinc-100">
        <Image
          src={imageUrl}
          fill
          sizes="(max-width: 640px) 100vw, 640px"
          alt={product.name}
          className="object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex flex-col mt-4">
        <h2 className="text-xl font-bold">{product.name}</h2>

        <div className="flex flex-col items-start justify-between mt-3">
          <p className="text-2xl font-bold">
            {product.price.toLocaleString("uz-Latn-uz")} so'm
          </p>
          {product.stock_qty > 0 ? (
            <span className="text-xs text-green-500 font-medium">
              Mavjud: {product.stock_qty} ta
            </span>
          ) : (
            <span className="text-xs text-red-500 font-medium">Tugagan</span>
          )}
        </div>

        {product.kg_price && (
          <p className="text-sm text-gray-400 mt-1">
            Kg narxi: {product.kg_price.toLocaleString("uz-Latn-uz")} so'm
          </p>
        )}
        {product.piece_price && (
          <p className="text-sm text-gray-400">
            Dona narxi: {product.piece_price.toLocaleString("uz-Latn-uz")} so'm
          </p>
        )}

        {/* Cart controls */}
        <div className="mt-5 flex gap-2.5">
          {qty === 0 ? (
            <button
              type="button"
              onClick={onAdd}
              disabled={product.stock_qty === 0}
              className="w-full py-3 bg-primary text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Savatga qo'shish
            </button>
          ) : (
            <div className="flex flex-auto items-center justify-between bg-accent rounded-xl p-2">
              <button
                type="button"
                onClick={onDec}
                aria-label="Kamaytirish"
                className="w-10 h-10 rounded-xl bg-white text-black text-xl font-bold flex items-center justify-center cursor-pointer"
              >
                <MinusIcon />
              </button>
              <span className="font-semibold text-xl">{qty}</span>
              <button
                type="button"
                onClick={() => !atStockLimit && onInc()}
                disabled={atStockLimit}
                aria-label="Ko'paytirish"
                className="w-10 h-10 rounded-xl bg-white text-black text-xl font-bold flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <PlusIcon />
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={onToggleFavorite}
            aria-label={
              liked ? "Sevimlilardan olib tashlash" : "Sevimlilarga qo'shish"
            }
            className="bg-accent p-4 rounded-xl cursor-pointer"
          >
            <FavoriteIcon
              className={`w-6 h-6 transition-all ${
                liked ? "fill-red-500 text-red-500" : "text-gray-500"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
