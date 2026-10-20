"use client";
import { useProduct } from "@/app/hooks/products/useProduct";
import { useProducts } from "@/app/hooks/products/useProducts";

import Image from "next/image";

export default function ProductsClient({ id }: { id: number }) {
  // All products
  const { data: products, isLoading, isError } = useProducts();

  // Single product
  const { data: product } = useProduct(id);

  // In JSX
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  return (
    <section>
      <div className="container">
        <div className="mt-5">
          <div>
            <div className="rounded-3xl overflow-hidden w-full h-60">
              <Image
                className="w-full h-full object-cover"
                src="/cookie.webp"
                alt="product"
                width={300}
                height={200}
                priority
              />
            </div>
            <div>
              <h1 className="text-2xl font-medium mt-4">Product Name</h1>
              <div className="flex items-center justify-between mt-2">
                <p className="text-lg font-semibold">25 000 USZ</p>
              </div>
            </div>
            <div></div>
          </div>
        </div>
      </div>
      {/* {product ? (
        <div>
          <h1>{product.name}</h1>
          <p>{product.price}</p>
          <img src={product.photo} alt={product.name} />
        </div>
      ) : (
        <p>Product not found.</p>
      )} */}
    </section>
  );
}
