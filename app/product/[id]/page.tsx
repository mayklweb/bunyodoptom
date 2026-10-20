"use client";

import Image from "next/image";
import { useState } from "react";
import { useParams } from "next/navigation";
// import { useProduct, useProducts } from "@/app/shared/lib/hooks/useProducts";
// import { useCartStore } from "@/app/store/CartStore";
import { FavoriteIcon, MinusIcon, PlusIcon } from "@/app/shared/icons";
// import { useFavoritesStore } from "@/app/store/favoritesStore";
// import { useShuffledProducts } from "@/app/shared/lib/hooks/useShuffledProducts";
import { ProductsType } from "@/app/types";
import Link from "next/link";
import { useProduct } from "@/app/hooks/products/useProduct";
import { useProducts } from "@/app/hooks/products/useProducts";
import { useCartStore } from "@/app/store/cart.store";
import { useFavoriteStore } from "@/app/store/favourite.store";

function ProductSkeleton() {
  return (
    <section>
      <div className="container">
        <div className="mt-24">
          <div className="w-full flex flex-col lg:flex-row gap-5 pb-20">
            {/* Images */}
            <div className="w-full lg:w-1/2 flex flex-col gap-3">
              <div className="w-full aspect-4/3 rounded-2xl bg-gray-200 animate-pulse" />
              <div className="flex gap-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-20 h-20 rounded-xl bg-gray-200 animate-pulse"
                  />
                ))}
              </div>
            </div>
            {/* Info */}
            <div className="w-full lg:w-1/2 flex flex-col gap-4">
              <div className="h-8 w-3/4 bg-gray-200 rounded-xl animate-pulse" />
              <div className="h-4 w-1/2 bg-gray-100 rounded-xl animate-pulse" />
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-5 w-full bg-gray-100 rounded-xl animate-pulse"
                />
              ))}
              <div className="h-12 w-full bg-gray-200 rounded-xl animate-pulse mt-4" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function normalizeProducts(products: ProductsType[]): ProductsType[] {
  return products
    ?.filter(
      (p) => Array.isArray(p.images) && p.images.length > 0 && p.images[0]?.url,
    )
    .map((p) => ({
      ...p,
      mainImage:
        `https://api.bunyodoptom.uz${p.images[0]?.url}` &&
        `https://api.bunyodoptom.uz${p.images[1]?.url}`,
    }));
}

function Product() {
  const params = useParams();
  const id = Number(params?.id);
  const { data: product, isLoading, isError } = useProduct(id);
  const { addToCart, inc, dec, getQuantity, remove } = useCartStore();
  const { toggleFavorite, isFavorite } = useFavoriteStore();

  const { data: products } = useProducts();
  const filtred = normalizeProducts(products);
  // const recomendedProduct = useShuffledProducts<ProductsType>(filtred, 20);

  const liked = isFavorite(id);

  const [activeImage, setActiveImage] = useState(0);

  if (isLoading) return <ProductSkeleton />;
  if (isError || !product) {
    return (
      <div className="container mt-24 text-center text-gray-400 text-xl">
        Mahsulot topilmadi
      </div>
    );
  }

  const images = product.images?.length
    ? product.images.map((img: any) =>
        img.url ? `https://api.bunyodoptom.uz${img.url}` : "/product.jpg",
      )
    : ["/product.jpg"];

  const qty = getQuantity(product.id);

  const details = [
    { label: "Narxi", value: `${product.price.toLocaleString()} so'm` },
    product.kg_price && {
      label: "Kg narxi",
      value: `${product.kg_price.toLocaleString()} so'm`,
    },
    product.piece_price && {
      label: "Dona narxi",
      value: `${product.piece_price.toLocaleString()} so'm`,
    },
    {
      label: "Mavjud",
      value: product.stock_qty > 0 ? `${product.stock_qty} dona` : "Tugagan",
      valueClass: product.stock_qty > 0 ? "text-green-500" : "text-red-500",
    },
    product.kg && { label: "Og'irligi", value: `${product.kg} kg` },
    product.piece && { label: "Dona", value: `${product.piece} ta` },
  ].filter(Boolean) as { label: string; value: string; valueClass?: string }[];

  return (
    <div>
      <section>
        <div className="container">
          <div className="mt-24">
            <div className="w-full flex flex-col lg:flex-row gap-5 pb-24 lg:pb-20">
              {/* ── Images ── */}
              <div className="w-full lg:w-1/2 flex flex-col gap-3">
                {/* Main image */}
                <div className="w-full aspect-4/3 rounded-2xl overflow-hidden bg-gray-100 relative">
                  <Image
                    src={`${images[activeImage]}`}
                    alt={product.name}
                    fill
                    className="object-cover transition-opacity duration-300"
                    priority
                  />
                </div>

                {/* Thumbnails — only if more than 1 image */}
                {images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {images.map((src: string, i: number) => (
                      <button
                        key={i}
                        onClick={() => setActiveImage(i)}
                        className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                          activeImage === i ? "border-primary" : "border-white"
                        }`}
                      >
                        <Image
                          src={src}
                          alt={`${product.name} ${i + 1}`}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* ── Info ── */}
              <div className="w-full lg:w-1/2">
                <div className="lg:sticky lg:top-24 flex flex-col gap-4">
                  {/* Name */}
                  <h1 className="text-2xl lg:text-4xl font-semibold leading-snug">
                    {product.name}
                  </h1>

                  {/* Details table */}
                  <div className="flex flex-col gap-2.5 bg-gray-50 rounded-2xl p-4">
                    {details.map(({ label, value, valueClass }) => (
                      <div key={label} className="flex items-center gap-2">
                        <p className="text-sm text-gray-500 shrink-0">
                          {label}
                        </p>
                        <div className="flex-auto border-b border-dotted border-gray-300" />
                        <p
                          className={`text-sm font-semibold shrink-0 ${valueClass ?? "text-gray-900"}`}
                        >
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Description */}
                  {product.description && (
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {product.description}
                    </p>
                  )}

                  {/* Cart controls */}
                  <div className="mt-2 flex gap-4">
                    <button
                      onClick={() => toggleFavorite(product)}
                      className="bg-accent p-4 rounded-xl cursor-pointer"
                    >
                      <FavoriteIcon
                        className={`w-6 h-6 transition-colors ${
                          liked ? "fill-error text-error" : "text-black"
                        }`}
                      />
                    </button>
                    {qty === 0 ? (
                      <button
                        onClick={() => addToCart(product)}
                        disabled={product.stock_qty === 0}
                        className="w-full h-12 bg-primary text-white rounded-xl text-base font-semibold hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {product.stock_qty === 0
                          ? "Tugagan"
                          : "Savatga qo'shish"}
                      </button>
                    ) : (
                      <div className="w-full flex items-center justify-between bg-primary/10 rounded-xl p-2">
                        <button
                          onClick={() =>
                            qty === 1 ? remove(product.id) : dec(product.id)
                          }
                          className="w-11 h-11 rounded-lg bg-white text-black flex items-center justify-center shadow-sm"
                        >
                          <MinusIcon />
                        </button>
                        <span className="text-xl font-bold">{qty}</span>
                        <button
                          onClick={() => inc(product.id)}
                          className="w-11 h-11 rounded-lg bg-primary text-white flex items-center justify-center shadow-sm"
                        >
                          <PlusIcon />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Recommended Products ── */}
      {/* {recomendedProduct.length > 0 && (
        <section className="pb-20">
          <div className="container">
            <h2 className="text-xl lg:text-2xl font-semibold mb-5">
              Tavsiya etilgan mahsulotlar
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {recomendedProduct.map((item) => {
                const thumb = item.images?.length
                  ? `https://api.bunyodoptom.uz${item.images[0].url}`
                  : "/product.jpg";
                const itemQty = getQuantity(item.id);
                const itemLiked = isFavorite(item.id);

                return (
                  <div
                    key={item.id}
                    className="flex flex-col rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <Link href={`/product/${item.id}`}>
                      <div className="block relative aspect-4/3 bg-gray-50">
                        <Image
                          src={thumb}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex flex-col  p-2 flex-1">
                        <p className="text-sm font-semibold">{item.name}</p>

                        <p className="text-sm font-bold text-gray-900 mt-auto">
                          {item.price.toLocaleString()} so'm
                        </p>

                        <div className="flex items-center gap-2 mt-1">
                          <button
                            onClick={() => toggleFavorite(item)}
                            className="shrink-0 p-2 rounded-xl bg-accent"
                          >
                            <FavoriteIcon
                              className={`w-5 h-5 transition-colors ${
                                itemLiked
                                  ? "fill-error text-error"
                                  : "text-black"
                              }`}
                            />
                          </button>

                          {itemQty === 0 ? (
                            <button
                              onClick={() => addToCart(item)}
                              disabled={item.stock_qty === 0}
                              className="flex-1 h-9 bg-primary text-white rounded-xl text-xs font-semibold hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              {item.stock_qty === 0 ? "Tugagan" : "Qo'shish"}
                            </button>
                          ) : (
                            <div className="flex-1 flex items-center justify-between bg-primary/10 rounded-xl px-2 py-1">
                              <button
                                onClick={() =>
                                  itemQty === 1 ? remove(item.id) : dec(item.id)
                                }
                                className="w-7 h-7 rounded-md bg-white flex items-center justify-center shadow-sm"
                              >
                                <MinusIcon />
                              </button>
                              <span className="text-sm font-bold">
                                {itemQty}
                              </span>
                              <button
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); inc(item.id); }}
                                className="w-7 h-7 rounded-md bg-primary text-white flex items-center justify-center shadow-sm"
                              >
                                <PlusIcon />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )} */}
    </div>
  );
}

export default Product;
