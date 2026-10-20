import { ProductCard } from "@/app/components";
import ProductModal from "@/app/components/ProductModal/ProductModal";
import { useProducts } from "@/app/hooks/products/useProducts";
import { useProductModal } from "@/app/shared/lib/hooks/useProductModal";
// import { useProductModal } from "@/app/shared/lib/hooks/useProductModal";
// import { useProducts } from "@/app/shared/lib/hooks/useProducts";
// import { useShuffledProducts } from "@/app/shared/lib/hooks/useShuffledProducts";
import { ProductsType } from "@/app/types";
import { useState } from "react";

function RecomendedProductsSkeleton() {
  return (
    <section>
      <div className="container">
        <div className="mt-5">
          {/* Title skeleton */}
          <div className="h-9 md:h-10 lg:h-11 w-40 bg-gray-200 rounded-xl animate-pulse" />

          <div className="mt-6 mb-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl bg-gray-100 overflow-hidden animate-pulse [animation-fill-mode:both]"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {/* Image */}
                <div className="w-full h-40 sm:h-44 md:h-48 bg-gray-300" />
                {/* Content */}
                <div className="p-3 flex flex-col gap-2">
                  {/* Product name */}
                  <div className="h-3.5 w-3/4 bg-gray-300 rounded-full" />
                  <div className="h-3 w-1/2 bg-gray-200 rounded-full" />
                  {/* Price */}
                  <div className="h-4 w-2/3 bg-gray-300 rounded-full mt-1" />
                  {/* Button */}
                  <div className="h-9 w-full bg-gray-200 rounded-xl mt-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function normalizeProducts(products: ProductsType[]): ProductsType[] {
  return products
    ?.filter(
      (p) => Array.isArray(p.images) && p.images.length > 0 && p.images[0]?.url
    )
    .map((p) => ({
      ...p,
      mainImage:
        `https://api.bunyodoptom.uz${p.images[0]?.url}` &&
        `https://api.bunyodoptom.uz${p.images[1]?.url}`,
    }));
}


function RecomendedProducts() {
  const { data: products, isLoading, isError } = useProducts();
  const filtred = normalizeProducts(products)
  // const recomendedProduct = useShuffledProducts<ProductsType>(filtred, 20);

  const { selectedProduct, openModal, closeModal } = useProductModal();

  // const [selectedProduct, setSelectedProduct] = useState()
  // const [openModal, setOpenModal] = useState()
  // const [closeModal, setCloseModal] = useState()

  if (isLoading) return <RecomendedProductsSkeleton />;
  if (isError) return <div>Error</div>;

  return (
    <section>
      <div className="container">
        <div className="mt-5">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold">
              Trenddagi mahsulotlar
            </h1>
          </div>
          <div className="mt-6 mb-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {products.map((product: ProductsType, i: number) => (
              <ProductCard
                key={i}
                product={product}
                onClick={() => openModal(product)}
              />
            ))}
          </div>
        </div>
      </div>
      <ProductModal product={selectedProduct} onClose={closeModal} />
    </section>
  );
}

export default RecomendedProducts;
