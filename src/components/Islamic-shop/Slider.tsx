"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import { ShoppingBag, ArrowRight } from "lucide-react";
import Image from "next/image";

const ShopHeroSlider = () => {
  const slides = [
    {
      id: 1,
      title: "ইসলামিক শপ",
      subtitle: "বিশ্বস্ত পণ্য, ইসলামের জন্য",
      cta: "শপে যান",
      image:
        "https://i.ibb.co.com/nMFsh8Kv/Gemini-Generated-Image-ndo8vxndo8vxndo8.png",
    },
    {
      id: 2,
      title: "প্রিমিয়াম জায়নামাজ",
      subtitle: "ইবাদতে প্রশান্তি নিশ্চিত করুন",
      cta: "এখনই দেখুন",
      image:
        "https://i.ibb.co.com/1GP1rZWn/Gemini-Generated-Image-b2onlgb2onlgb2on.png",
    },
  ];

  const scrollToProducts = () => {
    const element = document.getElementById("all-products");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full h-[220px] md:h-[300px] lg:h-[500px] mt-16 lg:mt-18 overflow-hidden bg-gray-100">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={1000}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{
          clickable: true,
          el: ".shop-pagination",
        }}
        loop={true}
        className="w-full h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full flex items-center">
              {/* ব্যাকগ্রাউন্ড ইমেজ */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                  className="transition-transform duration-[5000ms] scale-110"
                />
                {/* মোবাইলে টেক্সট ক্লিয়ার দেখানোর জন্য একটু ডার্ক ওভারলে (bg-black/50) ব্যবহার করা হয়েছে */}
                <div className="absolute inset-0 bg-black/50 md:bg-black/30"></div>
              </div>

              {/* টেক্সট কন্টেন্ট */}
              <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 w-full text-left">
                <div className="max-w-2xl space-y-1 md:space-y-3 lg:space-y-4">
                  {/* রেসপন্সিভ টাইটেল */}
                  <h1 className="text-xl sm:text-2xl md:text-5xl lg:text-7xl font-black text-white leading-tight drop-shadow-lg">
                    {slide.title}
                  </h1>

                  {/* রেসপন্সিভ সাবটাইটেল */}
                  <p className="text-[11px] sm:text-xs md:text-xl lg:text-2xl text-gray-100 font-medium drop-shadow-md">
                    {slide.subtitle}
                  </p>

                  {/* রেসপন্সিভ CTA বাটন */}
                  <div className="pt-1 md:pt-2">
                    <button
                      onClick={scrollToProducts}
                      className="inline-flex hover:cursor-pointer items-center gap-1.5 md:gap-3 px-3 py-1.5 md:px-6 md:py-3 lg:px-8 lg:py-4 bg-[#0B5D3B] text-white font-bold rounded-md md:rounded-xl lg:rounded-2xl hover:bg-[#0d4d2e] transition-all shadow-2xl active:scale-95 group text-[10px] md:text-sm lg:text-base"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 md:w-5 md:h-5" />
                      <span>{slide.cta}</span>
                      <ArrowRight className="w-3.5 h-3.5 md:w-5 md:h-5 group-hover:translate-x-2 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* কাস্টম প্যাজিনেশন (মোবাইলে একটু উপরে তোলা হয়েছে যেন ইমেজের সাথে সুন্দর দেখায়) */}
      <div className="shop-pagination absolute bottom-2 md:bottom-4 lg:bottom-6 left-0 right-0 z-20 flex justify-center gap-1 md:gap-2"></div>

      <style jsx global>{`
        .shop-pagination .swiper-pagination-bullet {
          width: 6px;
          height: 6px;
          background: white;
          opacity: 0.5;
          transition: all 0.3s ease;
        }
        @media (min-width: 768px) {
          .shop-pagination .swiper-pagination-bullet {
            width: 10px;
            height: 10px;
          }
        }
        .shop-pagination .swiper-pagination-bullet-active {
          width: 16px;
          opacity: 1;
          background: #105d38 !important;
          border-radius: 20px;
        }
        @media (min-width: 768px) {
          .shop-pagination .swiper-pagination-bullet-active {
            width: 30px;
          }
        }
        .swiper-slide {
          pointer-events: none;
        }
        .swiper-slide-active {
          pointer-events: auto;
        }
      `}</style>
    </section>
  );
};

export default ShopHeroSlider;
