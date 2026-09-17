"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useAxiosSecure from "@/src/app/hooks/useAxiosSecure";
import { RenderIcon } from "@/src/config/icons";
import Image from "next/image";
import Link from "next/link";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const AcademicSkeleton = () => (
  <div className="flex flex-col items-center text-center gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] h-full animate-pulse w-full">
    <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-slate-100 shrink-0" />
    <div className="space-y-2 w-full flex flex-col items-center">
      <div className="h-4 bg-slate-200 rounded w-3/4" />
      <div className="h-3 bg-slate-100 rounded w-1/2" />
    </div>
  </div>
);

interface ICategory {
  _id: string;
  name: string;
  image: string;
  description?: string;
  isActive: boolean;
  subCategories: any[];
  icon?: string;
}

const Academic = () => {
  const axiosSecure = useAxiosSecure();

  const {
    data: categories = [],
    isLoading,
    isError,
  } = useQuery<ICategory[]>({
    queryKey: ["homeAcademicCategoriesList"],
    queryFn: async () => {
      const response = await axiosSecure.get("/categories");
      const fetchedData = response.data?.data || response.data || [];
      return fetchedData.filter((cat: ICategory) => cat.isActive !== false);
    },
    staleTime: 15 * 60 * 1000,
    gcTime: 45 * 60 * 1000,
  });

  const getSubTitleFallback = (cat: ICategory) => {
    if (cat.description && cat.description.trim() !== "") {
      const words = cat.description.trim().split(/\s+/);
      if (words.length <= 4) return cat.description;
      return words.slice(0, 4).join(" ") + "...";
    }
    return `${cat.subCategories?.length || 0}টি উপ-বিভাগ`;
  };

  // Helper: Build the URL for each category as requested
  const buildCategoryUrl = (cat: ICategory) => {
    const encodedName = encodeURIComponent(cat.name);
    return `/course-directory/${cat._id}?name=${encodedName}`;
  };

  if (isError) return null;

  return (
    <section className="px-5 max-w-11/12 mx-auto">
      <div className="bg-brand-pale/80 shadow-[inset_0_0_20px_rgba(238,245,239,0.2)] max-w-7xl mx-auto px-5 py-6 rounded-2xl relative group">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-green-800 inline-block relative">
            একাডেমিক বিভাগ
            <span className="block h-1 bg-green-800 mt-2 mx-auto w-1/2 rounded-full" />
          </h2>
        </div>

        <div className="relative px-2 md:px-10">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4">
              {[...Array(6)].map((_, idx) => (
                <div key={idx} className="w-full h-auto">
                  <AcademicSkeleton />
                </div>
              ))}
            </div>
          ) : categories && categories.length > 0 ? (
            <Swiper
              modules={[Navigation, Pagination]}
              loop={categories.length > 4}
              navigation={{
                nextEl: ".next-btn-academic",
                prevEl: ".prev-btn-academic",
              }}
              pagination={{
                clickable: true,
                el: ".academic-pagination",
              }}
              breakpoints={{
                320: { slidesPerView: 2, spaceBetween: 12 },
                480: { slidesPerView: 2, spaceBetween: 14 },
                640: { slidesPerView: 2, spaceBetween: 18 },
                1024: { slidesPerView: 5, spaceBetween: 20 },
                1280: { slidesPerView: 6, spaceBetween: 20 },
              }}
              className="!p-4 !-m-4"
            >
              {categories.map((cat: ICategory) => (
                <SwiperSlide key={cat._id} className="h-auto !py-4">
                  <Link
                    href={buildCategoryUrl(cat)}
                    className="flex flex-col items-center text-center gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(14,61,47,0.06)] hover:shadow-[0_8px_30px_rgba(14,61,47,0.14)] hover:scale-105 transition-transform duration-300 ease-out [transform-style:preserve-3d] [backface-visibility:hidden] [perspective:1000px] h-full group/item cursor-pointer"
                    prefetch={false}
                  >
                    <div className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-xl bg-green-50 text-green-700 transition-colors duration-500 group-hover/item:bg-green-600 group-hover/item:text-white overflow-hidden relative shadow-inner">
                      {cat.image && cat.image.trim() !== "" && !cat.icon ? (
                        <Image
                          src={cat.image}
                          alt={cat.name}
                          fill
                          className="object-cover rounded-xl"
                          priority={false}
                          unoptimized={cat.image.includes(".svg")}
                        />
                      ) : (
                        <RenderIcon
                          name={cat.icon || "BookOpen"}
                          className="w-7 h-7 relative z-10"
                        />
                      )}
                    </div>

                    <div>
                      <p className="text-sm md:text-base font-bold text-gray-800 leading-tight truncate max-w-[120px] md:max-w-[150px]">
                        {cat.name}
                      </p>
                      <p className="text-[10px] md:text-xs text-gray-500 mt-1 font-medium line-clamp-1">
                        {getSubTitleFallback(cat)}
                      </p>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-slate-200">
              <p className="text-xs text-slate-400 italic">
                কোনো একাডেমিক বিভাগ সচল পাওয়া যায়নি।
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          <button className="prev-btn-academic absolute top-1/2 -left-2 md:-left-4 -translate-y-10 z-10 w-10 h-10 flex items-center justify-center bg-white border border-green-100 text-green-600 rounded-full shadow-md hover:bg-green-600 hover:text-white transition-all disabled:opacity-20 cursor-pointer active:scale-95">
            <ChevronLeft size={22} />
          </button>
          <button className="next-btn-academic absolute top-1/2 -right-2 md:-right-4 -translate-y-10 z-10 w-10 h-10 flex items-center justify-center bg-white border border-green-100 text-green-600 rounded-full shadow-md hover:bg-green-600 hover:text-white transition-all disabled:opacity-20 cursor-pointer active:scale-95">
            <ChevronRight size={22} />
          </button>
        </div>

        {/* Pagination Dot Container - Center aligned */}
        <div className="w-full flex justify-center mt-8">
          <div className="academic-pagination flex justify-center items-center gap-1"></div>
        </div>

        <style jsx global>{`
          .academic-pagination {
            width: auto !important;
            display: inline-flex !important;
            position: relative !important;
            inset: unset !important;
            transform: none !important;
            margin: 0 auto !important;
          }
          .academic-pagination .swiper-pagination-bullet {
            margin: 0 4px !important;
            background: #d1d5db;
            opacity: 1;
            width: 8px;
            height: 8px;
            transition: all 0.3s ease;
          }
          .academic-pagination .swiper-pagination-bullet-active {
            background: #16a34a !important;
            width: 24px !important;
            border-radius: 12px !important;
          }
        `}</style>
      </div>
    </section>
  );
};

export default Academic;
