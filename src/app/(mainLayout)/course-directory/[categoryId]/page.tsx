"use client";

import  { Suspense, useState, useMemo } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Clock,
  Tag,
  Users,
  BookOpen,
  Search,
  GraduationCap,
  Award,
  ChevronRight,
  Home,
} from "lucide-react";
import Image from "next/image";
import { getAllCourses } from "@/src/lib/data";

interface CourseHighlight {
  label: string;
  value: string;
}

interface CourseDetails {
  fullTitle: string;
  description: string;
  admissionFee: number;
  oldAdmissionFee: number;
  monthlyFee: number | null;
  discount: number;
  coupon: string;
  batchInfo: string;
  highlights: CourseHighlight[];
}

interface CourseItem {
  id: string;
  title: string;
  price: number;
  oldPrice: number;
  image: string;
  upcomingBatch: any;
  details: CourseDetails;
}

//  Professional Shimmer Skeleton Loader for enhanced UX
function CourseCardSkeleton() {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between overflow-hidden animate-pulse">
      <div>
        <div className="h-28 sm:h-48 w-full bg-slate-200" />
        <div className="p-3 sm:p-6 space-y-3">
          <div className="h-4 sm:h-6 bg-slate-200 rounded-md w-3/4" />
          <div className="space-y-1.5">
            <div className="h-3 bg-slate-200 rounded-md w-full" />
            <div className="h-3 bg-slate-200 rounded-md w-5/6" />
          </div>
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <div className="h-3 bg-slate-100 rounded-md w-1/2" />
            <div className="h-3 bg-slate-100 rounded-md w-2/3" />
          </div>
        </div>
      </div>
      <div className="p-3 sm:p-6 pt-0 flex items-center justify-between gap-2 mt-auto">
        <div className="h-6 bg-slate-200 rounded-md w-1/4" />
        <div className="h-8 sm:h-10 bg-slate-200 rounded-lg w-24" />
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";

function CourseDirectoryContent() {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState<string>("");

  const categoryId = params?.categoryId as string;
  const urlCategoryName = searchParams.get("name");

  const {
    data: courses = [],
    isLoading: loading,
    error,
  } = useQuery<CourseItem[]>({
    queryKey: ["categoryCourses", categoryId],
    queryFn: async () => {
      const res = await getAllCourses();
      if (!res || !Array.isArray(res.dynamicCategories)) return [];

      const currentCategory = res.dynamicCategories.find(
        (value: any) => value._id === categoryId,
      );

      if (!currentCategory) return [];

      const rawSubCategories = currentCategory.subCategories;
      if (!rawSubCategories) return [];

      const cleanSubArray = Array.isArray(rawSubCategories)
        ? rawSubCategories
        : Object.values(rawSubCategories);

      if (!cleanSubArray || typeof cleanSubArray.map !== "function") return [];

      return cleanSubArray.map((sub: any) => ({
        id: sub?._id || String(Math.random()),
        title: sub?.name || "কোর্স টাইটেল",
        price: sub?.admissionFee || 0,
        oldPrice: sub?.oldAdmissionFee || 0,
        image:
          sub?.image && sub.image.trim() !== ""
            ? sub.image
            : currentCategory.image || "",
        upcomingBatch: sub?.upcomingBatch || null,
        details: {
          fullTitle: sub?.fullTitle || sub?.name || "",
          description: sub?.description || "",
          admissionFee: sub?.admissionFee || 0,
          oldAdmissionFee: sub?.oldAdmissionFee || 0,
          monthlyFee: sub?.monthlyFee || null,
          discount: sub?.discount || 0,
          coupon: sub?.coupon || "",
          batchInfo: sub?.classSchedule || "নতুন ব্যাচ শীঘ্রই শুরু হবে",
          highlights: Array.isArray(sub?.highlights) ? sub.highlights : [],
        },
      }));
    },
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000, // Cache clean data for 5 minutes
    gcTime: 10 * 60 * 1000,
  });

  const activePageTitle = urlCategoryName || "বিভাগীয় কোর্স সমূহের তালিকা";

  // 🚀 useMemo optimizes CPU cycles during filtering workflows
  const filteredCourses = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return courses;
    return courses.filter(
      (course) =>
        course.title.toLowerCase().includes(query) ||
        course.details?.description?.toLowerCase().includes(query) ||
        course.id.toLowerCase().includes(query),
    );
  }, [courses, searchQuery]);

  return (
    <main className="bg-gradient-to-b from-[#f4fbf7] to-[#fcfdfd] min-h-screen pt-28 sm:pt-36 pb-12 px-2 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 px-2 sm:px-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <button
              onClick={() => router.push("/")}
              className="hover:text-emerald-600 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              হোম
            </button>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <button
              onClick={() => router.push("/education")}
              className="hover:text-emerald-600 transition-colors cursor-pointer"
            >
              কোর্স ক্যাটাগরি
            </button>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <span className="text-emerald-600 font-medium truncate max-w-[150px] sm:max-w-none">
              {activePageTitle}
            </span>
          </div>

          <button
            onClick={() => router.back()}
            className="inline-flex items-center justify-center gap-2 text-xs font-bold text-slate-700 bg-white hover:text-emerald-600 hover:border-emerald-200 border border-slate-200 px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer active:scale-95 self-start sm:self-auto"
            aria-label="পেছনে যান"
          >
            <ArrowLeft className="h-4 w-4" />
            পেছনে যান
          </button>
        </div>

        <div className="mb-8 px-2 sm:px-0">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {activePageTitle}
              </h1>
              <p className="mt-1 text-xs sm:text-base text-slate-500 max-w-3xl">
                নিচে এই বিভাগের সকল অ্যাক্টিভ ও চলমান কোর্স দেওয়া হলো। আপনার
                পছন্দের কোর্সটিতে আজই যুক্ত হোন।
              </p>
            </div>

            <div className="flex gap-3 text-xs font-medium text-slate-600">
              <div className="bg-white border border-slate-100 shadow-xs px-3 py-2 rounded-xl flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-emerald-500" />
                <span>মোট কোর্স: {courses.length}টি</span>
              </div>
              <div className="bg-white border border-slate-100 shadow-xs px-3 py-2 rounded-xl flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                <span>সার্টিফিকেট যুক্ত</span>
              </div>
            </div>
          </div>
        </div>

        {courses.length > 0 && (
          <div className="mb-8 px-2 sm:px-0 max-w-md">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="নির্দিষ্ট কোর্স খুঁজুন (যেমন: তাজভীদ)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all shadow-xs"
              />
            </div>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
            {[...Array(6)].map((_, index) => (
              <CourseCardSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-red-50 rounded-2xl border border-red-100 m-2 p-8 text-red-600">
            <p className="font-semibold">
              {(error as any)?.message || "কিছু একটা ভুল হয়েছে"}
            </p>
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
            {filteredCourses.map((course) => {
              const duration =
                course.details?.highlights?.find(
                  (h) =>
                    h.label === "কোর্সের মেয়াদ" ||
                    h.label === "সময়" ||
                    h.label === "মেয়াদ",
                )?.value || "নির্ধারিত নয়";

              return (
                <article
                  key={course.id}
                  className="bg-white rounded-xl sm:rounded-2xl border border-slate-100 shadow-xs hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  <div>
                    <div className="h-28 sm:h-48 w-full relative overflow-hidden bg-slate-50">
                      {course.image ? (
                        <Image
                          src={course.image}
                          alt={course.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-[#0B5D3B]/10 flex items-center justify-center text-xs text-neutral-400 font-bold">
                          {course.title}
                        </div>
                      )}
                      {course.details?.discount > 0 && (
                        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-rose-500 text-white text-[9px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg shadow-xs">
                          {course.details.discount}% ছাড়
                        </div>
                      )}
                    </div>

                    <div className="p-3 sm:p-6">
                      <h3 className="text-sm sm:text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1 mb-1 sm:mb-2">
                        {course.title}
                      </h3>
                      <p className="text-slate-500 text-[11px] sm:text-sm line-clamp-2 mb-3 sm:mb-4 min-h-[32px] sm:min-h-[40px]">
                        {course.details?.description}
                      </p>

                      <div className="space-y-1.5 sm:space-y-2 border-t border-slate-100 pt-3 mb-1 text-[10px] sm:text-xs text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span className="truncate">মেয়াদ: {duration}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>
                            {course.upcomingBatch
                              ? `ব্যাচ: ${course.upcomingBatch.batchName} (ভর্তি চলছে)`
                              : `স্ট্যাটাস: ${course.details?.batchInfo}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 sm:p-6 pt-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-auto border-t border-slate-50/50">
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-base sm:text-2xl font-black text-emerald-600">
                          ৳{course.price}
                        </span>
                        {course.oldPrice > course.price && (
                          <span className="text-slate-400 text-[10px] sm:text-xs line-through">
                            ৳{course.oldPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        router.push(
                          `/education-details?data=${encodeURIComponent(
                            JSON.stringify(course),
                          )}`,
                        );
                      }}
                      className="w-full sm:w-auto inline-flex items-center justify-center bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white font-bold px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl transition-all duration-200 text-[11px] sm:text-sm border border-emerald-100 shadow-xs cursor-pointer active:scale-95"
                    >
                      বিস্তারিত
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200 m-2 p-8">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium text-sm sm:text-base">
              {searchQuery
                ? "আপনার অনুসন্ধানকৃত মেলানো কোনো কোর্স পাওয়া যায়নি।"
                : "এই বিভাগের অধীনে এই মুহূর্তে কোনো কোর্স এভেইলেবল নেই।"}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="mt-3 text-xs font-semibold text-emerald-600 underline"
              >
                রিসেট সার্চ
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default function CourseDirectoryPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto pt-44 px-4 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8 animate-pulse">
          {[...Array(6)].map((_, idx) => (
            <div key={idx} className="bg-slate-100 h-72 rounded-2xl" />
          ))}
        </div>
      }
    >
      <CourseDirectoryContent />
    </Suspense>
  );
}