"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Clock,
  Search,
  Layers,
  Globe,
  Edit3,
  SlidersHorizontal,
  X,
  Info,
  Calendar,
  CheckCircle2,
  Tag,
} from "lucide-react";

// 1️⃣ 🎯 মেগা ফিক্স: হেডার সার্চ ও ফিল্টার বাটনের প্রিমিয়াম স্কেলিটন লোডার
const HeaderSkeleton = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-5 animate-pulse">
      <div>
        <div className="h-7 w-40 bg-neutral-200 rounded-lg mb-2" />
        <div className="h-4 w-32 bg-neutral-200 rounded" />
      </div>
      <div className="flex items-center gap-3 w-full sm:w-auto">
        {/* Search Bar Skeleton */}
        <div className="h-10 w-full sm:w-64 bg-neutral-200 rounded-xl" />
        {/* Filter Button Skeleton */}
        <div className="h-10 w-24 bg-neutral-200 rounded-xl" />
      </div>
    </div>
  );
};

// 2️⃣ 🎯 মেগা ফিক্স: অরিজিনাল কার্ডের সাথে ১০০% উইড্থ এবং প্যাডিং সিঙ্ক করা স্কেলিটন
const CourseCardSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 w-full">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white rounded-[2rem] border border-neutral-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col h-full relative animate-pulse"
        >
          {/* Image Aspect Ratio Match */}
          <div className="relative aspect-[16/10] w-full bg-neutral-100 rounded-b-2xl shadow-3xs" />

          {/* Content Padding and Space Aligned with Real Card */}
          <div className="p-3 md:p-5 flex flex-col flex-grow justify-between space-y-4">
            <div className="space-y-2">
              <div className="h-3 w-16 bg-neutral-200 rounded" />
              <div className="space-y-1.5">
                <div className="h-4 w-full bg-neutral-200 rounded" />
                <div className="h-4 w-4/5 bg-neutral-200 rounded" />
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-50 flex items-center justify-between">
              <div className="flex flex-col gap-1.5">
                <div className="h-2.5 w-10 bg-neutral-200 rounded" />
                <div className="h-4 w-14 bg-neutral-200 rounded" />
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <div className="h-2.5 w-8 bg-neutral-200 rounded" />
                <div className="h-4 w-12 bg-neutral-200 rounded" />
              </div>
            </div>

            <div className="pt-1 w-full">
              <div className="h-10 w-full bg-neutral-200 rounded-xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

interface ICourse {
  _id: string;
  title: string;
  image: string;
  price: number;
  duration: string;
  courseType: string;
  courseCategoryType: string;
  modules?: Array<{ title: string; statusType: string; statusText?: string }>;
  details?: {
    fullTitle?: string;
    description?: string;
    admissionFee?: number;
    monthlyFee?: number;
    batchInfo?: string;
    highlights?: Array<{ label: string; value: string }>;
  };
  category?: {
    name: string;
  };
  [key: string]: any;
}

const MyCourses = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const token = (session as any)?.accessToken;

  const [courses, setCourses] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryType, setCategoryType] = useState("");
  const [deliveryType, setDeliveryType] = useState("");
  const [isOpenFilterModal, setIsOpenFilterModal] = useState(false);

  const [selectedCourseDetails, setSelectedCourseDetails] =
    useState<ICourse | null>(null);

  const filterRef = useRef<HTMLDivElement>(null);

  const fetchCourses = useCallback(async () => {
    if (!token) return;
    setLoading(true);

    try {
      const queryParams = new URLSearchParams();
      if (searchQuery) queryParams.append("search", searchQuery);
      if (categoryType) queryParams.append("courseCategoryType", categoryType);
      if (deliveryType) queryParams.append("courseType", deliveryType);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/courses/teacher/my-courses?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        setCourses([]);
        return;
      }

      const result = await response.json();

      let parsedCourses = [];
      if (result && result.success && Array.isArray(result.data)) {
        parsedCourses = result.data;
      } else if (Array.isArray(result)) {
        parsedCourses = result;
      } else if (Array.isArray(result?.data)) {
        parsedCourses = result.data;
      } else if (result?.courses && Array.isArray(result.courses)) {
        parsedCourses = result.courses;
      }

      setCourses(parsedCourses);
    } catch (error) {
      console.error("Fetch error:", error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, [token, searchQuery, categoryType, deliveryType]);

  useEffect(() => {
    if (status === "authenticated" && token) {
      fetchCourses();
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [status, token, fetchCourses]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsOpenFilterModal(false);
      }
    };
    if (isOpenFilterModal) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpenFilterModal]);

  const onEdit = (courseId: string) => {
    router.push(`/dashboard/teacher/edit-course/${courseId}`);
  };

  const clearFilters = () => {
    setCategoryType("");
    setDeliveryType("");
    setIsOpenFilterModal(false);
  };

  const isFilterActive = categoryType !== "" || deliveryType !== "";

  // 🎯 মেইন ট্র্যাপ ফিক্স: হেডার সহ পুরো পেজের কন্টেইনার উইড্থ বজায় রেখে স্কেলিটন লোড করানো হচ্ছে
  if (
    status === "loading" ||
    (loading && status === "authenticated" && courses.length === 0)
  ) {
    return (
      <div className="mt-4 space-y-6 pb-12 px-1 font-sans antialiased w-full">
        <HeaderSkeleton />
        <div className="pt-4">
          <CourseCardSkeleton count={6} />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-6 pb-12 px-1 antialiased relative">
      {/* 🔹 প্রিমিয়াম ইন্টারেক্টিভ হেডার */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-5">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-neutral-800 tracking-tight">
            আমার কোর্স সমূহ
          </h2>
          <p className="text-xs md:text-sm text-neutral-500 font-medium mt-0.5">
            মোট {courses.length}টি কোর্স পরিচালনা করছেন
          </p>
        </div>

        {/* 🔍 সার্চ এবং ফিল্টার বার */}
        <div
          className="flex items-center gap-3 w-full sm:w-auto relative"
          ref={filterRef}
        >
          <div className="relative flex-1 sm:w-64 sm:flex-none">
            <Search
              className="absolute left-3.5 top-3 text-neutral-400"
              size={14}
            />
            <input
              type="text"
              placeholder="কোর্সের নাম দিয়ে খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#0B5D3B] focus:bg-white transition-all font-bold text-neutral-700"
            />
          </div>

          <button
            onClick={() => setIsOpenFilterModal(!isOpenFilterModal)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-black transition-all shadow-sm cursor-pointer select-none relative ${
              isOpenFilterModal || isFilterActive
                ? "bg-[#0B5D3B] border-[#0B5D3B] text-white"
                : "bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50"
            }`}
          >
            <SlidersHorizontal size={14} />
            ফিল্টার
            {isFilterActive && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>

          <AnimatePresence>
            {isOpenFilterModal && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute right-0 top-12 mt-1 w-72 bg-white rounded-2xl border border-neutral-100 shadow-[0_15px_40px_rgba(0,0,0,0.12)] p-4 z-50 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-neutral-50 pb-2">
                  <span className="text-xs font-black text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
                    অ্যাডভান্সড ফিল্টারস
                  </span>
                  <button
                    onClick={() => setIsOpenFilterModal(false)}
                    className="p-1 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-neutral-500 uppercase flex items-center gap-1">
                    <Layers size={12} className="text-[#0B5D3B]" /> ক্যাটাগরি
                    লেভেল
                  </label>
                  <select
                    value={categoryType}
                    onChange={(e) => setCategoryType(e.target.value)}
                    className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#0B5D3B] font-bold text-neutral-700 cursor-pointer"
                  >
                    <option value="">সকল ক্যাটাগরি (All)</option>
                    <option value="academic">একাডেমিক (Academic)</option>
                    <option value="general">জেনারেল (General)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-neutral-500 uppercase flex items-center gap-1">
                    <Globe size={12} className="text-[#0B5D3B]" /> ক্লাস
                    ডেলিভারি মোড
                  </label>
                  <select
                    value={deliveryType}
                    onChange={(e) => setDeliveryType(e.target.value)}
                    className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#0B5D3B] font-bold text-neutral-700 cursor-pointer"
                  >
                    <option value="">ডেলিভারি মোড (All)</option>
                    <option value="Online">অনলাইন (Online)</option>
                    <option value="Offline">অফলাইন (Offline)</option>
                  </select>
                </div>

                <div className="pt-2 border-t border-neutral-50 flex items-center justify-between gap-2">
                  <button
                    onClick={clearFilters}
                    disabled={!isFilterActive}
                    className="px-3 py-2 text-[11px] font-black text-red-600 hover:bg-red-50 rounded-xl transition-all disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                  >
                    রিসেট ফিল্টার
                  </button>
                  <button
                    onClick={() => setIsOpenFilterModal(false)}
                    className="px-4 py-2 text-[11px] font-black bg-slate-900 text-white hover:bg-slate-800 rounded-xl shadow-sm transition-all cursor-pointer"
                  >
                    প্রয়োগ করুন
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 🔹 প্রফেশনাল মেগা কোর্স কার্ড গ্রিড */}
      {courses.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {courses.map((course, idx) => (
            <motion.div
              key={course._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="bg-white rounded-[2rem] border border-neutral-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden group hover:shadow-[0_12px_30px_rgba(11,93,59,0.06)] hover:border-emerald-100/60 transition-all duration-300 flex flex-col h-full relative"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-50 rounded-b-2xl shadow-3xs">
                <Image
                  src={course.image || "/images/course-fallback.png"}
                  alt={course.title}
                  fill
                  unoptimized
                  sizes="(max-w-7xl) 33vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-85" />

                <div className="absolute top-2 left-2 md:top-3 md:left-3 flex gap-1">
                  <span className="bg-[#0B5D3B] text-white text-[8px] md:text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider shadow-sm">
                    {course.courseType || "Online"}
                  </span>
                  <span
                    className={`text-white text-[8px] md:text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider shadow-sm ${
                      course.courseCategoryType === "academic"
                        ? "bg-amber-600"
                        : "bg-slate-700"
                    }`}
                  >
                    {course.courseCategoryType === "academic"
                      ? "Academic"
                      : "General"}
                  </span>
                </div>
              </div>

              <div className="p-3 md:p-5 flex flex-col flex-grow justify-between space-y-4">
                <div className="space-y-1">
                  <span className="text-[9px] md:text-[10px] text-neutral-400 font-bold tracking-wide uppercase block">
                    {course.category?.name || "ইসলামি নেساب"}
                  </span>
                  <h3 className="font-black text-neutral-800 text-xs md:text-base leading-snug tracking-tight group-hover:text-[#0B5D3B] transition-colors line-clamp-2 min-h-[32px] md:min-h-[44px]">
                    {course.title}
                  </h3>
                </div>

                <div className="pt-3 border-t border-neutral-50 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[8px] md:text-[9px] text-neutral-400 font-bold uppercase">
                      কোর্স ফি
                    </span>
                    <span className="text-xs md:text-base font-black text-neutral-800 leading-none mt-0.5">
                      {course.courseCategoryType === "academic"
                        ? "একাডেমিক"
                        : `৳${course.price || 0}`}
                    </span>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="text-[8px] md:text-[9px] text-neutral-400 font-bold uppercase">
                      মেয়াদ
                    </span>
                    <span className="text-[9px] md:text-xs text-neutral-600 font-bold flex items-center gap-0.5 mt-0.5">
                      <Clock size={11} className="text-[#0B5D3B]" />
                      {course.duration || "০ ঘণ্টা"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 w-full">
                  <button
                    onClick={() => setSelectedCourseDetails(course)}
                    className="w-full py-2.5 bg-neutral-50 text-neutral-700 hover:bg-green-800 hover:text-white border border-neutral-200/70 rounded-xl font-black text-xs md:text-sm flex items-center justify-center gap-1.5 active:scale-98 transition-all cursor-pointer select-none group"
                  >
                    <Info size={14} className="text-green-600" />
                    বিস্তারিত জানুন
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-neutral-100 rounded-[2rem] p-12 text-center shadow-3xs max-w-sm mx-auto">
          <div className="bg-neutral-50 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-3 text-neutral-300 border border-neutral-100">
            <BookOpen className="w-5 h-5 text-neutral-400" />
          </div>
          <h3 className="text-sm md:text-base font-black text-neutral-800">
            কোনো কোর্স পাওয়া যায়নি
          </h3>
          <p className="text-neutral-400 text-[11px] font-medium mt-1 max-w-xs mx-auto">
            আপনার ফিল্টার কন্ডিশন অথবা সার্চিং প্যারামিটারে কোনোসক্রিয় কোর্স
            ডাটাবেজে রেকর্ড নেই।
          </p>
        </div>
      )}

      {/* বিস্তারিত বিবরণ পপআপ মোডাল */}
      <AnimatePresence>
        {selectedCourseDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCourseDetails(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-2xl bg-[#FDFBF7] rounded-[2.5rem] shadow-[0_25px_60px_rgba(0,0,0,0.2)] border border-neutral-100 overflow-hidden z-10 flex flex-col max-h-[85vh]"
            >
              <div className="bg-[#0B5D3B] p-6 text-white relative shrink-0">
                <span className="text-[10px] bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                  {selectedCourseDetails.category?.name || "কোর্স বিবরণী"}
                </span>
                <h3 className="text-lg md:text-2xl font-black tracking-tight mt-2.5 leading-snug">
                  {selectedCourseDetails.details?.fullTitle ||
                    selectedCourseDetails.title}
                </h3>
                <button
                  onClick={() => setSelectedCourseDetails(null)}
                  className="absolute top-5 right-5 p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-6 text-sm text-neutral-700 font-sans">
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-[#0B5D3B] uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-[#0B5D3B] rounded-full inline-block" />{" "}
                    কোর্স পরিচিতি
                  </h4>
                  {selectedCourseDetails.details?.description ? (
                    <div
                      className="text-xs md:text-sm text-neutral-600 leading-relaxed font-medium bg-neutral-50 p-4 rounded-2xl border border-neutral-100 max-w-none
        [&_h1]:text-xl [&_h1]:font-black [&_h1]:text-slate-800 [&_h1]:mt-3 [&_h1]:mb-1.5
        [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-slate-800 [&_h2]:mt-2.5 [&_h2]:mb-1
        [&_p]:mb-2 [&_p]:last:mb-0
        [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3 [&_ol]:space-y-1
        [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_ul]:space-y-1"
                      dangerouslySetInnerHTML={{
                        __html: selectedCourseDetails.details.description,
                      }}
                    />
                  ) : (
                    <p className="text-xs md:text-sm text-neutral-600 leading-relaxed font-medium bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
                      এই কোর্সের কোনো বিবরণী যুক্ত করা হয়নি।
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-amber-50/40 border border-amber-100/50 p-4 rounded-2xl space-y-1">
                    <span className="text-[10px] font-black text-amber-800 uppercase tracking-wide flex items-center gap-1">
                      <Calendar size={12} /> ব্যাচ ও ক্লাসের সময়সূচী
                    </span>
                    <p className="text-xs font-bold text-neutral-700 mt-1">
                      {selectedCourseDetails.details?.batchInfo ||
                        "এডমিন প্যানেল থেকে ব্যাচের সময়সূচী নির্ধারণের অপেক্ষায়।"}
                    </p>
                  </div>

                  <div className="bg-emerald-50/40 border border-emerald-100/40 p-4 rounded-2xl flex flex-col justify-center space-y-1">
                    <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wide flex items-center gap-1">
                      <Tag size={12} /> অর্থনৈতিক কাঠামো
                    </span>
                    <div className="text-xs font-bold text-neutral-700 mt-0.5 space-y-0.5">
                      {selectedCourseDetails.courseCategoryType ===
                      "academic" ? (
                        <>
                          <p>
                            ভর্তি ফি:{" "}
                            <span className="text-[#0B5D3B] font-black">
                              ৳
                              {selectedCourseDetails.details?.admissionFee || 0}
                            </span>
                          </p>
                          <p>
                            মাসিক ফি:{" "}
                            <span className="text-[#0B5D3B] font-black">
                              ৳{selectedCourseDetails.details?.monthlyFee || 0}
                            </span>
                          </p>
                        </>
                      ) : (
                        <p>
                          এককালীন ফি:{" "}
                          <span className="text-[#0B5D3B] font-black">
                            ৳{selectedCourseDetails.price || 0}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {selectedCourseDetails.details?.highlights &&
                  selectedCourseDetails.details.highlights.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-black text-[#0B5D3B] uppercase tracking-wider flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-[#0B5D3B] rounded-full inline-block" />{" "}
                        কোর্স হাইলাইটস ও বৈশিষ্ট্য
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {selectedCourseDetails.details.highlights.map(
                          (item, hIdx) => (
                            <div
                              key={hIdx}
                              className="flex items-center gap-2 bg-white px-4 py-2.5 border border-neutral-100 rounded-xl shadow-3xs"
                            >
                              <CheckCircle2
                                size={14}
                                className="text-emerald-600 shrink-0"
                              />
                              <p className="text-xs font-bold text-neutral-700">
                                <span className="text-neutral-400 font-medium">
                                  {item.label}:
                                </span>{" "}
                                {item.value}
                              </p>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                {selectedCourseDetails.modules &&
                  selectedCourseDetails.modules.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-black text-[#0B5D3B] uppercase tracking-wider flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-[#0B5D3B] rounded-full inline-block" />{" "}
                        পাঠ্যক্রম সূচী (Syllabus Modules)
                      </h4>
                      <div className="space-y-2">
                        {selectedCourseDetails.modules.map((mod, mIdx) => (
                          <div
                            key={mIdx}
                            className="flex items-center justify-between bg-white border border-neutral-100 px-4 py-3 rounded-xl hover:border-emerald-100 transition-colors"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="w-5 h-5 rounded-md bg-neutral-50 text-neutral-400 font-black text-[10px] flex items-center justify-center border">
                                {mIdx + 1}
                              </span>
                              <p className="text-xs font-black text-neutral-800">
                                {mod.title}
                              </p>
                            </div>
                            <span className="bg-slate-100 text-slate-700 text-[9px] font-black px-2 py-0.5 rounded-md uppercase">
                              {mod.statusType?.replace("_", " ") ||
                                "Live Class"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>

              <div className="p-5 bg-neutral-50 border-t border-neutral-100 flex justify-end shrink-0">
                <button
                  onClick={() => setSelectedCourseDetails(null)}
                  className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-black shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  উইন্ডো বন্ধ করুন
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyCourses;
