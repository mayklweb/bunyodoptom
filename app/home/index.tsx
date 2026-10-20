"use client";
import ProductModal from "../components/ProductModal/ProductModal";
// import { useProductModal } from "../shared/lib/hooks/useProductModal";
import {
  Banner,
  Brands,
  Categories,
  FavoriteProducts,
  RecomendedProducts,
} from "./ui/sections";

function Home() {
  // const { selectedProduct, openModal, closeModal } = useProductModal();
  return (
    <div className="mt-5 pb-5">
      <Banner />
      <Categories />
      <FavoriteProducts />
      {/* <Brands /> */}
      <RecomendedProducts />
      {/* Modal */}
    </div>
  );
}

export default Home;
