"use client";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
// @ts-ignore: swiper CSS module declaration missing
import "swiper/css";
// @ts-ignore: swiper CSS module declaration missing
import "swiper/css/pagination";
// @ts-ignore: swiper CSS module declaration missing
import "swiper/css/navigation";

import { Autoplay, Pagination } from "swiper/modules";

const banner = [
  { id: 1, image: "/banner-1.jpg" },
  { id: 2, image: "/banner-2.jpg" },
  { id: 3, image: "/banner-3.jpg" },
  { id: 4, image: "/banner-4.jpg" },
  { id: 5, image: "/banner-5.jpg" },
];

function Banner() {
  return (
    <section>
      <div className="mt-20">
        <div className="container">
          <div className="rounded-3xl overflow-hidden relative shadow-sm">
            <Swiper
              loop={true}
              spaceBetween={20}
              autoplay={{
                delay: 2500,
                disableOnInteraction: true,
              }}
              pagination={{ clickable: true }}
              modules={[Autoplay, Pagination]}
              className="w-full h-full rounded-3xl overflow-hidden banner-swiper"
            >
              {banner.map(({ id, image }, i) => (
                <SwiperSlide key={id} className="rounded-3xl overflow-hidden">
                  <Image
                    width={1368}
                    height={615}
                    src={image}
                    alt={`Banner ${id}`}
                    priority={i === 0}
                    className="w-full h-full object-cover"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .banner-swiper .swiper-pagination-bullet {
          background: #fff;
          opacity: 0.6;
          width: 8px;
          height: 8px;
          transition: all 0.2s ease;
        }
        .banner-swiper .swiper-pagination-bullet-active {
          opacity: 1;
          width: 20px;
          border-radius: 9999px;
        }
      `}</style>
    </section>
  );
}

export default Banner;
