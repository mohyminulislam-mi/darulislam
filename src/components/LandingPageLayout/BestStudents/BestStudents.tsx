"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  GraduationCap,
  Calendar,
} from "lucide-react";

type StudentApiType = {
  _id: string;
  studentNameBn: string;
  classLevel: string;
  user: {
    name: string;
    profileImage: string | null;
    gender: string;
  };
  department: {
    _id?: string;
    name: string;
  };
  address: string;
  age: string;
};

const StudentSkeletonCard = () => (
  <div className="overflow-hidden rounded-3xl border border-green-50/50 bg-white/95 shadow-md h-full animate-pulse max-w-sm mx-auto w-full">
    <div className="h-24 bg-neutral-200" />
    <div className="-mt-14 flex justify-center">
      <div className="h-28 w-28 rounded-full bg-neutral-300 border-4 border-white shadow" />
    </div>
    <div className="space-y-5 px-6 pb-6 pt-4">
      <div className="h-6 w-3/4 bg-neutral-200 rounded-md mx-auto" />
      <div className="space-y-3 rounded-2xl bg-neutral-50 p-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-neutral-200 rounded-xl" />
          <div className="space-y-1 flex-1">
            <div className="h-3 w-10 bg-neutral-200 rounded" />
            <div className="h-4 w-16 bg-neutral-200 rounded" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-neutral-200 rounded-xl" />
          <div className="space-y-1 flex-1">
            <div className="h-3 w-12 bg-neutral-200 rounded" />
            <div className="h-4 w-28 bg-neutral-200 rounded" />
          </div>
        </div>
        <div className="flex items-center gap-3 border-t border-neutral-100 pt-3">
          <div className="h-8 w-8 bg-neutral-200 rounded-xl" />
          <div className="space-y-1 flex-1">
            <div className="h-3 w-10 bg-neutral-200 rounded" />
            <div className="h-4 w-24 bg-neutral-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const StudentCard = ({ student }: { student: StudentApiType }) => (
  <div
    className="
      group relative overflow-hidden rounded-3xl
      border border-green-100 bg-white/90
      shadow-lg backdrop-blur transition-all duration-500
      hover:shadow-2xl h-full max-w-sm mx-auto w-full
    "
  >
    {/* Top Gradient */}
    <div className="relative h-24 bg-gradient-to-r from-green-700 via-green-600 to-emerald-500" />

    {/* Image */}
    <div className="-mt-14 flex justify-center">
      <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-white shadow-xl bg-white">
        <Image
          src={student.user?.profileImage || "/hujur.webp"}
          alt={student.studentNameBn || "Student"}
          fill
          sizes="(max-width: 112px) 100vw, 112px"
          priority
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
    </div>

    {/* Content */}
    <div className="space-y-5 px-6 pb-6 pt-4 text-center">
      {/* Name */}
      <div>
        <h3 className="text-xl font-bold text-green-800 line-clamp-1">
          {student.studentNameBn}
        </h3>
      </div>

      {/* Info */}
      <div className="space-y-3 rounded-2xl bg-green-50 p-4 text-left">
        {/* Age */}
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-white p-2 shadow-sm">
            <Calendar size={16} className="text-green-700" />
          </div>
          <div>
            <p className="text-xs font-semibold text-green-700">বয়স</p>
            <p className="text-sm text-neutral-700">{student.age}</p>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-white p-2 shadow-sm">
            <MapPin size={16} className="text-green-700" />
          </div>
          <div>
            <p className="text-xs font-semibold text-green-700">লোকেশন</p>
            <p className="text-sm text-neutral-700 line-clamp-1">
              {student.address}
            </p>
          </div>
        </div>

        {/* Department */}
        <div className="flex items-start gap-3 border-t border-green-100 pt-3">
          <div className="rounded-xl bg-white p-2 shadow-sm">
            <GraduationCap size={16} className="text-green-700" />
          </div>
          <div>
            <p className="text-xs font-semibold text-green-700">বিভাগ</p>
            <p className="text-sm text-neutral-700 line-clamp-1">
              {student.department?.name || "সাধারণ বিভাগ"}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const fetchTalentedStudents = async (): Promise<StudentApiType[]> => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/students?limit=10&featured=true`,
  );

  return response.data?.data || response.data || [];
};

const StudentSlider = () => {
  const {
    data: students = [],
    isLoading: loading,
    isError,
  } = useQuery<StudentApiType[]>({
    queryKey: ["talentedStudents"],
    queryFn: fetchTalentedStudents,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  if (isError) return null;

  return (
    <section className="px-4 py-8 md:py-12 lg:px-8 max-w-11/12 mx-auto">
      <div className="bg-brand-pale/80 shadow-[inset_0_0_20px_rgba(238,245,239,0.2)] max-w-7xl mx-auto px-5 py-8 rounded-3xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <span className="inline-block rounded-full bg-green-100 px-4 py-1 text-xs font-bold text-green-700">
            মেধাবী শিক্ষার্থীরা
          </span>

          <h2 className="mt-3 text-2xl font-extrabold text-green-800 md:text-4xl">
            আমাদের কৃতি শিক্ষার্থীরা
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm text-neutral-600 md:text-base">
            দারুল ইসলাম ইনস্টিটিউটের মেধাবী ও কৃতি শিক্ষার্থীদের সংক্ষিপ্ত
            পরিচিতি।
          </p>

          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-green-500"></div>
        </div>

        {/* Dynamic Loading/Data State Rendering */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
            <StudentSkeletonCard />
            <StudentSkeletonCard />
            <StudentSkeletonCard />
          </div>
        ) : students.length === 0 ? (
          <div className="text-center text-neutral-600 text-sm font-bold py-16">
            কোনো কৃতি শিক্ষার্থীর তথ্য পাওয়া যায়নি।
          </div>
        ) : (
          /* Slider Container */
          <div className="relative">
            <Swiper
              modules={[Autoplay, Navigation, Pagination]}
              spaceBetween={24}
              slidesPerView={1}
              loop={students.length > 1}
              speed={900}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              navigation={{
                nextEl: ".next-arrow",
                prevEl: ".prev-arrow",
              }}
              pagination={{
                clickable: true,
                el: ".student-custom-pagination",
              }}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 }, // ম্যাক্সিমাম ৩টি কার্ড রাখা হলো
              }}
              className="teacher-swiper !pb-12"
            >
              {students.map((student) => (
                <SwiperSlide key={student._id} className="py-2">
                  <StudentCard student={student} />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Prev Button */}
            <button
              aria-label="Previous Slide"
              className="prev-arrow absolute top-1/2 -left-3 md:-left-5 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-white text-green-700 rounded-full shadow-lg border border-green-100 hover:bg-green-700 hover:text-white transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft size={22} />
            </button>

            {/* Next Button */}
            <button
              aria-label="Next Slide"
              className="next-arrow absolute top-1/2 -right-3 md:-right-5 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-white text-green-700 rounded-full shadow-lg border border-green-100 hover:bg-green-700 hover:text-white transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight size={22} />
            </button>

            {/* Pagination Container */}
            <div className="student-custom-pagination absolute bottom-0 left-0 right-0 flex justify-center gap-1.5 z-10"></div>
          </div>
        )}
      </div>

      {/* Pagination Style */}
      <style jsx global>{`
        .student-custom-pagination .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: #cbd5e1;
          opacity: 1;
          border-radius: 999px;
          transition: all 0.3s ease;
          cursor: pointer;
          margin: 0 3px !important;
        }

        .student-custom-pagination .swiper-pagination-bullet-active {
          width: 24px;
          background: #10b981;
        }
      `}</style>
    </section>
  );
};

export default StudentSlider;
