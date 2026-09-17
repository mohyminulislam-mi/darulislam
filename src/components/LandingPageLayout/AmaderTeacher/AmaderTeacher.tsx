"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  IdCard,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";

// ✅ swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

interface TeacherData {
  _id: string;
  user: {
    name: string;
    profileImage: string;
  };
  department: {
    name: string;
  };
  designation: string;
  qualifications: string;
  experience: string;
  teacherId: string;
}

const TeacherSkeletonCard = () => (
  <div className="w-full max-w-sm overflow-hidden rounded-3xl border border-green-50/50 bg-white/95 shadow-md animate-pulse mx-auto">
    <div className="h-24 bg-neutral-200" />
    <div className="-mt-14 flex justify-center">
      <div className="h-28 w-28 rounded-full bg-neutral-300 border-4 border-white shadow" />
    </div>
    <div className="space-y-4 px-6 pb-6 pt-4">
      <div className="space-y-2">
        <div className="h-5 w-1/2 bg-neutral-200 rounded mx-auto" />
        <div className="h-4 w-3/4 bg-neutral-200 rounded mx-auto" />
      </div>
      <div className="space-y-3 rounded-2xl bg-neutral-50 p-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-neutral-200 rounded-xl" />
          <div className="space-y-1 flex-1">
            <div className="h-3 w-12 bg-neutral-200 rounded" />
            <div className="h-4 w-20 bg-neutral-200 rounded" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-neutral-200 rounded-xl" />
          <div className="space-y-1 flex-1">
            <div className="h-3 w-10 bg-neutral-200 rounded" />
            <div className="h-4 w-24 bg-neutral-200 rounded" />
          </div>
        </div>
        <div className="border-t border-neutral-100 pt-3 space-y-1">
          <div className="h-3 w-32 bg-neutral-200 rounded" />
          <div className="h-4 w-24 bg-neutral-200 rounded" />
        </div>
      </div>
    </div>
  </div>
);

const fetchTopTeachers = async (): Promise<TeacherData[]> => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/teachers?limit=5&featured=true`,
  );
  return response.data;
};

export default function TeacherSlider() {
  const {
    data: teachers = [],
    isLoading: loading,
    isError,
  } = useQuery<TeacherData[]>({
    queryKey: ["topTeachers"],
    queryFn: fetchTopTeachers,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  if (isError) return null;

  return (
    <section className="relative overflow-hidden px-4 py-8 md:py-12 lg:px-8 max-w-11/12 mx-auto">
      <div className="relative z-10 bg-brand-pale/80 shadow-[inset_0_0_20px_rgba(238,245,239,0.2)] max-w-7xl mx-auto px-6 py-8 md:px-10 rounded-2xl">
        {/* Header */}
        <div className="mx-auto mb-10 max-w-2xl space-y-3 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-block rounded-full bg-green-100 px-4 py-1 text-xs font-bold text-green-800"
          >
            দক্ষ শিক্ষকমণ্ডলী
          </motion.div>

          <h2 className="text-2xl font-extrabold text-green-800 lg:text-4xl">
            আমাদের অভিজ্ঞ উস্তাদগণ
          </h2>

          <p className="text-sm lg:text-base">
            অভিজ্ঞ আলেমদের তত্ত্বাবধানে মানসম্মত ইসলাম শিক্ষার ভিত্তি।
          </p>

          <div className="mx-auto h-1 w-16 rounded-full bg-white/60"></div>
        </div>

        {/* Swiper Slider with Controls */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
            <TeacherSkeletonCard />
            <TeacherSkeletonCard />
            <TeacherSkeletonCard />
          </div>
        ) : teachers.length === 0 ? (
          <div className="text-center text-white/80 text-sm py-12">
            কোনো শিক্ষকের তথ্য পাওয়া যায়নি।
          </div>
        ) : (
          <div className="relative">
            <Swiper
              modules={[Autoplay, Pagination, Navigation]}
              slidesPerView={1}
              loop={teachers.length > 1}
              speed={800}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              navigation={{
                nextEl: ".next-btn-academic",
                prevEl: ".prev-btn-academic",
              }}
              pagination={{
                clickable: true,
                el: ".academic-pagination",
              }}
              breakpoints={{
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="teacher-swiper"
            >
              {teachers.map((teacher) => (
                <SwiperSlide key={teacher._id} className="py-4">
                  <div className="flex justify-center px-2">
                    {/* Card */}
                    <div className="group w-full max-w-sm overflow-hidden rounded-3xl border border-green-100 bg-white/95 shadow-lg backdrop-blur transition-all duration-300 hover:shadow-2xl">
                      {/* top bg */}
                      <div className="relative h-24 bg-gradient-to-r from-green-700 to-green-500" />

                      {/* image */}
                      <div className="-mt-14 flex justify-center">
                        <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-white shadow-lg bg-white">
                          <Image
                            src={teacher.user?.profileImage || "/hujur.webp"}
                            alt={teacher.user?.name || "দারুল ইসলাম শিক্ষক"}
                            fill
                            sizes="(max-width: 112px) 100vw, 112px"
                            priority
                            className="object-cover"
                          />
                        </div>
                      </div>

                      {/* content */}
                      <div className="space-y-4 px-6 pb-6 pt-4 text-center">
                        {/* name */}
                        <div>
                          <h3 className="text-lg font-bold text-green-800">
                            {teacher.user?.name}
                          </h3>
                          <p className="mt-1 text-sm text-neutral-500 line-clamp-1">
                            {teacher.qualifications}
                          </p>
                        </div>

                        {/* info */}
                        <div className="space-y-3 rounded-2xl bg-green-50 p-4 text-left">
                          <div className="flex items-start gap-3">
                            <IdCard
                              size={18}
                              className="mt-0.5 text-green-700 shrink-0"
                            />
                            <div>
                              <p className="text-xs font-semibold text-green-700">
                                শিক্ষক আইডি
                              </p>
                              <p className="text-sm text-neutral-700">
                                {teacher?.teacherId || "N/A"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Briefcase
                              size={18}
                              className="mt-0.5 text-green-700 shrink-0"
                            />
                            <div>
                              <p className="text-xs font-semibold text-green-700">
                                অভিজ্ঞতা
                              </p>
                              <p className="text-sm text-neutral-700">
                                {teacher.experience}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <GraduationCap
                              size={18}
                              className="mt-0.5 text-green-700 shrink-0"
                            />
                            <div>
                              <p className="text-xs font-semibold text-green-700">
                                বিভাগ
                              </p>
                              <p className="text-sm text-neutral-700">
                                {teacher.department?.name}
                              </p>
                            </div>
                          </div>

                          <div className="border-t border-green-100 pt-3">
                            <p className="text-xs font-semibold text-green-700">
                              Department of Darul Islam
                            </p>
                            <p className="text-sm text-neutral-700">
                              দারুল ইসলাম {teacher.department?.name || "অনুষদ"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Navigation Buttons Inside Slider Container */}
            <button
              aria-label="Previous Slide"
              className="prev-btn-academic absolute top-1/2 -left-3 md:-left-5 -translate-y-1/2 z-20 w-10 h-10 cursor-pointer flex items-center justify-center bg-white text-green-700 rounded-full shadow-lg border border-green-100 hover:bg-green-700 hover:text-white transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              aria-label="Next Slide"
              className="next-btn-academic absolute top-1/2 -right-3 md:-right-5 -translate-y-1/2 z-20 w-10 h-10 cursor-pointer flex items-center justify-center bg-white text-green-700 rounded-full shadow-lg border border-green-100 hover:bg-green-700 hover:text-white transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        )}

        {/* CTA */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/teachers"
            className="group flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-green-800 shadow-md transition hover:bg-green-50"
          >
            সকল উস্তাদজীর তালিকা
            <ArrowRight
              size={18}
              className="transition group-hover:translate-x-1 text-green-800"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
