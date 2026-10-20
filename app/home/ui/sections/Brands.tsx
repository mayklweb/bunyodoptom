"use client";
import { CategoriesType } from "@/app/types";
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import { Autoplay, Navigation } from "swiper/modules";
import { LeftIcon, RightIcon } from "@/app/shared/icons";
import Link from "next/link";
import Image from "next/image";
import { useBrands } from "@/app/hooks/brands/useBrands";
// import { useBrands } from "@/app/shared/lib/hooks/useBrands";

function BrandsSkeleton() {
  return (
    <section>
      <div className="container">
        <div className="mt-5">
          {/* Header skeleton */}
          <div className="flex items-center justify-between">
            <div className="h-9 md:h-10 lg:h-11 w-40 bg-gray-200 rounded-xl animate-pulse" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 md:w-9 md:h-9 bg-gray-200 rounded-full animate-pulse" />
              <div className="w-8 h-8 md:w-9 md:h-9 bg-gray-200 rounded-full animate-pulse" />
            </div>
          </div>

          {/* Slides skeleton */}
          <div className="flex gap-2 sm:gap-2.5 md:gap-3 lg:gap-4 mt-3 lg:mt-5 overflow-hidden">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className={`
      flex-1 w-[38%] sm:w-[23%] md:w-[19%] lg:w-[15.5%] xl:w-[13.5%] 2xl:w-[10%]
      ${i >= 4 ? "hidden sm:block" : ""}
      ${i >= 5 ? "hidden md:block" : ""}
      ${i >= 7 ? "hidden lg:block" : ""}
      ${i >= 8 ? "hidden xl:block" : ""}
    `}
              >
                <div
                  className="rounded-xl bg-gray-100 overflow-hidden animate-pulse [animation-fill-mode:both]"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="p-2">
                    <div className="w-full h-16 sm:h-20 md:h-24 rounded-lg bg-gray-300" />
                    <div className="mt-2 mx-auto h-3 w-2/3 bg-gray-300 rounded-full" />
                    <div className="mt-1.5 mx-auto h-2.5 w-1/2 bg-gray-200 rounded-full mb-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Brands() {
  const { data: brands, isLoading, isError } = useBrands();
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  if (isLoading) return <BrandsSkeleton />;
  if (isError) return <div>Error</div>;

  return (
    <section>
      <div className="container">
        <div className="mt-5">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight">
              Brendlar
            </h1>
            <div className="flex items-center gap-2">
              <button
                ref={prevRef}
                className="text-primary bg-secondary p-1 rounded-full cursor-pointer"
              >
                <LeftIcon />
              </button>
              <button
                ref={nextRef}
                className="text-primary bg-secondary p-1 rounded-full cursor-pointer"
              >
                <RightIcon />
              </button>
            </div>
          </div>

          <div className="relative">
            <Swiper
              navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              }}
              onBeforeInit={(swiper) => {
                if (typeof swiper.params.navigation === "object") {
                  swiper.params.navigation.prevEl = prevRef.current;
                  swiper.params.navigation.nextEl = nextRef.current;
                }
              }}
              spaceBetween={12}
              modules={[Autoplay, Navigation]}
              breakpoints={{
                0: { slidesPerView: 2.5, spaceBetween: 8 },
                375: { slidesPerView: 3.2, spaceBetween: 10 },
                425: { slidesPerView: 3.5, spaceBetween: 10 },
                640: { slidesPerView: 4.5, spaceBetween: 12 },
                768: { slidesPerView: 5.5, spaceBetween: 14 },
                1024: { slidesPerView: 7, spaceBetween: 16 },
                1280: { slidesPerView: 8, spaceBetween: 20 },
                1536: { slidesPerView: 10, spaceBetween: 20 },
              }}
              className="w-full mt-3 lg:mt-5"
            >
              {brands
                .slice(1)
                .map(({ name, id }: CategoriesType, i: number) => (
                  <SwiperSlide key={i}>
                    <Link
                      href="/categories"
                      className="flex flex-col items-center rounded-xl bg-primary/10 overflow-hidden"
                    >
                      <div className="w-full p-1.5">
                        <div className="relative w-full aspect-4/3 rounded-md overflow-hidden">
                          <Image
                            src={`/category-${id}.jpg`}
                            fill
                            sizes="(max-width: 640px) 30vw, (max-width: 1024px) 15vw, 10vw"
                            alt={name}
                            className="object-cover"
                            priority
                          />
                        </div>
                        <p className="w-full pt-1.5 text-xs lg:text-sm text-primary text-center font-semibold line-clamp-2">
                          {name}
                        </p>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Brands;
