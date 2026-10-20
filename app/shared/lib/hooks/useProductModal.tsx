import { useState } from "react";
import { ProductsType } from "@/app/types";

export function useProductModal() {
  const [selectedProduct, setSelectedProduct] = useState<ProductsType | null>(null);

  const openModal = (product: ProductsType) => setSelectedProduct(product);
  const closeModal = () => setSelectedProduct(null);

  return { selectedProduct, openModal, closeModal };
}