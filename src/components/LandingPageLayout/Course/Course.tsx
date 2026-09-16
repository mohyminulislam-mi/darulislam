"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import {
  Clock,
  ArrowRight,
  Tag,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import useAxiosSecure from "@/src/app/hooks/useAxiosSecure";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const CourseCardSkeleton = () => (
  <article
    className="bg-white rounded-[2rem] border border-slate-100 p-3.5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] h-full flex flex-col relative overflow-hidden animate-pulse w-full"
    aria-busy="true"
  >
    <div className="relative aspect-[16/10] w-full bg-slate-100 rounded-2xl overflow-hidden shrink-0">
      <div className="absolute inset-0 bg-slate-200" />
    </div>
    <div className="p-4 pt-5 flex-1 flex flex-col justify-between space-y-5">
      <div className="space-y-3">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
          <span className="h-5 w-24 bg-slate-200 rounded-md" />
          <span className="h-5 w-14 bg-slate-200 rounded-md" />
        </div>
        <div className="h-6 w-3/4 bg-slate-300 rounded mb-1" />
        <div className="flex items-center gap-1.5 mt-1">
          <span className="h-4 w-16 bg-slate-200 rounded-md" />
        </div>
      </div>
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="h-6 w-16 bg-slate-200 rounded-xl" />
        <div className="h-8 w-24 bg-slate-100 rounded-xl" />
      </div>
    </div>
  </article>
);

interface ICourse {
  _id: string;
  title: string;
  image: string;
  courseType: string;
  price: number;
  oldPrice?: number;
  duration: string;
  courseCategoryType: string;
  label?: string;
  instructor?: {
    name: string;
    email: string;
  };
  category?: {
    name: string;
  };
}

export default function HomeFeaturedCourses() {
  const axiosSecure = useAxiosSecure();

  const {
    data: featuredCourses = [],
    isLoading,
    isError,
  } = useQuery<ICourse[]>({
    queryKey: ["homeFeaturedCoursesList"],
    queryFn: async () => {
      const response = await axiosSecure.get("/courses?isFeatured=true");
      return response.data?.data || response.data || [];
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const getCourseDetailsUrl = (course: ICourse) => {
    if (course.courseCategoryType === "academic") {
      return `/education-details/${course.title}`;
    }
    return `/education/${course._id}`;
  };

  if (isError) return null;

  return (
    <section
      className="px-4 py-12 md:py-20"
      aria-label="ফিচার্ড কোর্সসমূহ"
    >
      {/* 🟢 এখানে parent container থেকে 'group' সরিয়ে দেওয়া হয়েছে */}
      <div className="bg-[#faf6ec] shadow-[inset_0_0_20px_rgba(245,158,11,0.4)] max-w-7xl mx-auto px-5 py-6 rounded-2xl relative">
        <div className="mx-auto mb-12 max-w-lg space-y-3 text-center">
          <h2 className="text-2xl font-extrabold text-green-800 lg:text-4xl">
            আমাদের বিশেষ কোর্সসমূহ
          </h2>

          <p className="text-sm lg:text-base">
            দারুল ইসলামের পরিচালিত সেরা কোর্সসমূহ থেকে আপনার পছন্দের বিষয়টি
            বেছে নিন।
          </p>

          <div className="mx-auto h-1 w-16 rounded-full bg-green-800"></div>
        </div>

        {isLoading ? (
          <div className="relative px-2 md:px-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
              {[...Array(3)].map((_, idx) => (
                <div key={idx} className="w-full h-auto">
                  <CourseCardSkeleton />
                </div>
              ))}
            </div>
            <div className="w-full flex justify-center mt-8">
              <div className="course-swiper-pagination flex justify-center items-center gap-1"></div>
            </div>
          </div>
        ) : featuredCourses && featuredCourses.length > 0 ? (
          <div className="relative px-2 md:px-10">
            <Swiper
              modules={[Autoplay, Pagination, Navigation]}
              navigation={{
                nextEl: ".next-btn-courses",
                prevEl: ".prev-btn-courses",
              }}
              spaceBetween={24}
              slidesPerView={1}
              loop={featuredCourses.length > 3}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
                el: ".course-swiper-pagination",
              }}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 3 },
              }}
              className="!p-4 !-m-4"
            >
              {featuredCourses.map((course: ICourse) => {
                const detailsUrl = getCourseDetailsUrl(course);
                const isAcademic = course.courseCategoryType === "academic";

                return (
                  <SwiperSlide key={course._id} className="h-auto !py-4">
                    <Link
                      href={detailsUrl}
                      className="block h-full cursor-pointer group"
                    >
                      {/* 🟢 hover:scale-[1.02] এবং hover:-translate-y-1.5 দিয়ে স্মুথ কার্ড অ্যানিমেশন যোগ করা হলো */}
                      <article className="bg-white rounded-[2rem] border border-slate-100 p-3.5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_35px_rgba(11,93,59,0.15)] hover:border-emerald-200 hover:scale-[1.02] hover:-translate-y-1.5 transition-all duration-300 ease-out h-full flex flex-col relative overflow-hidden">
                        <div className="relative aspect-[16/10] w-full bg-slate-50 rounded-2xl overflow-hidden shrink-0 shadow-3xs">
                          <Image
                            src={course.image || "/images/course-fallback.png"}
                            alt={course.title}
                            fill
                            sizes="(max-w-7xl) 33vw, 100vw"
                            className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                          />
                          {course.label && (
                            <span className="absolute top-3 right-3 bg-[#0B5D3B] text-white font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                              {course.label}
                            </span>
                          )}
                        </div>

                        <div className="p-4 pt-5 flex-1 flex flex-col justify-between space-y-5">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                              <span className="flex items-center gap-1 bg-slate-50 text-slate-500 px-2.5 py-1 rounded-md border border-slate-100">
                                <Tag size={12} className="text-[#0B5D3B]" />
                                {course.category?.name ||
                                  (isAcademic ? "Academic" : "General")}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock size={12} />
                                {course.duration}
                              </span>
                            </div>

                            <h3 className="text-base font-black text-slate-800 martial-title leading-snug tracking-tight group-hover:text-[#0B5D3B] transition-colors duration-300 line-clamp-2 min-h-[44px]">
                              {course.title}
                            </h3>
                          </div>

                          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                            <div>
                              {isAcademic ? (
                                <span className="text-[11px] font-black text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl uppercase tracking-wider border border-emerald-100/50">
                                  একাডেমিক
                                </span>
                              ) : (
                                <div className="flex items-baseline gap-1.5">
                                  <span className="text-lg font-black text-slate-900">
                                    ৳{course.price}
                                  </span>
                                  {course.oldPrice &&
                                  course.oldPrice > course.price ? (
                                    <span className="text-xs font-medium text-slate-400 line-through">
                                      ৳{course.oldPrice}
                                    </span>
                                  ) : null}
                                </div>
                              )}
                            </div>

                            <div
                              className="py-2.5 px-4 bg-slate-900 text-white rounded-xl text-xs font-medium group-hover:bg-[#0B5D3B] transition-colors duration-300 flex items-center gap-1.5 shadow-sm"
                              aria-label={`"${course.title}" কোর্সের বিস্তারিত বিবরণ দেখুন`}
                            >
                              বিস্তারিত দেখুন
                            </div>
                          </div>
                        </div>
                      </article>
                    </Link>
                  </SwiperSlide>
                );
              })}
            </Swiper>

            <button className="prev-btn-courses absolute top-1/2 -left-2 md:-left-4 -translate-y-10 z-10 w-10 h-10 flex items-center justify-center bg-white border border-green-100 text-green-600 rounded-full shadow-md hover:bg-green-600 hover:text-white transition-all disabled:opacity-20 cursor-pointer">
              <ChevronLeft size={22} />
            </button>
            <button className="next-btn-courses absolute top-1/2 -right-2 md:-right-4 -translate-y-10 z-10 w-10 h-10 flex items-center justify-center bg-white border border-green-100 text-green-600 rounded-full shadow-md hover:bg-green-600 hover:text-white transition-all disabled:opacity-20 cursor-pointer">
              <ChevronRight size={22} />
            </button>

            <div className="w-full flex justify-center mt-8">
              <div className="course-swiper-pagination flex justify-center items-center gap-1"></div>
            </div>
          </div>
        ) : (
          <div
            className="bg-white/80 border border-slate-200 border-dashed rounded-3xl p-12 text-center"
            role="status"
          >
            <BookOpen className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-700">
              কোনো বিশেষ কোর্স সচল নেই
            </h3>
          </div>
        )}

        {/* সব কোর্স বোতাম */}
        <div className="mt-10 flex justify-center">
          <Link
            href="/education"
            className="group flex items-center gap-2 rounded-full bg-green-700 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-green-800"
          >
            আমাদের কোর্সসমূহ দেখুন
            <ArrowRight
              size={18}
              className="transition group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>

      {/* 🔹 স্টাইলশীট ফিক্স */}
      <style jsx global>{`
        .course-swiper-pagination {
          width: auto !important;
          display: inline-flex !important;
          position: relative !important;
          inset: unset !important;
          transform: none !important;
          margin: 0 auto !important;
        }
        .course-swiper-pagination .swiper-pagination-bullet {
          margin: 0 4px !important;
          background: #cbd5e1;
          opacity: 1;
          width: 8px;
          height: 8px;
          transition: all 0.3s ease;
        }
        .course-swiper-pagination .swiper-pagination-bullet-active {
          background: #4ea44b !important;
          width: 24px !important;
          border-radius: 12px !important;
        }
      `}</style>
    </section>
  );
}