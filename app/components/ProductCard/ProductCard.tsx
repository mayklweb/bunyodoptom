import { FavoriteIcon } from "@/app/shared/icons";
import { useFavoriteStore } from "@/app/store/favourite.store";
import { ProductsType } from "@/app/types";
import Image from "next/image";
import Link from "next/link";

interface Props {
  product: ProductsType;
  onClick?: () => void;
}

function ProductCard({ product, onClick }: Props) {
  const { toggleFavorite, isFavorite } = useFavoriteStore();

  const liked = isFavorite(product.id);

  const imagePath = product?.images?.[0]?.url;

  const imageUrl = imagePath
    ? `https://api.bunyodoptom.uz${imagePath}`
    : "/placeholder.png";

  const cardClass = "flex flex-col items-start gap-5 border-0 shadow-none";

  const content = (
    <div className="w-full relative">
      <div className="relative w-full aspect-4/3 rounded-xl overflow-hidden mb-2.5 ">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 18vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col items-start gap-0.5 w-full">
        <h2 className="w-full font-semibold text-primary text-base tracking-tight leading-[100%] truncate">
          {product.name.toUpperCase()}
        </h2>
        <p className="font-semibold text-dark-gray text-base tracking-tight">
          {product.price?.toLocaleString("uz-Latn-uz")} so'm
        </p>
      </div>
    </div>
  );

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => toggleFavorite(product)}
        aria-label={
          liked ? "Sevimlilardan olib tashlash" : "Sevimlilarga qo'shish"
        }
        className="p-1.5 absolute top-2 right-2 z-2 bg-white shadow-sm rounded-full cursor-pointer hover:scale-105 active:scale-95 transition-transform"
      >
        <FavoriteIcon
          className={`w-5 h-5 transition-colors ${
            liked ? "fill-error text-error" : "text-black"
          }`}
        />
      </button>

      {onClick ? (
        <div
          onClick={onClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && onClick()}
          className={`${cardClass} cursor-pointer`}
        >
          {content}
        </div>
      ) : (
        <Link href={`/product/${product.id}`} className={cardClass}>
          {content}
        </Link>
      )}
    </div>
  );
}

export default ProductCard;
