"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

import {
  BookOpen,
  Plus,
  Star,
  ShieldAlert,
  Search,
  SlidersHorizontal,
  X,
  RotateCcw,
  Check,
} from "lucide-react";
import Swal from "sweetalert2";

import useAxiosSecure from "@/src/app/hooks/useAxiosSecure";
import CourseCard from "@/src/components/shared/CourseCard";
import EditCourseModal from "@/src/components/shared/EditCourseModal";
import LoadingSpinner from "@/src/components/shared/spinner/LoadingSpinner";

interface ICourse {
  _id: string;
  title: string;
  courseType: string;
  price: string | number;
  oldPrice?: string | number;
  duration: string;
  isFeatured?: boolean;
  courseCategoryType: string;
  category: any;
  [key: string]: any;
}

interface ICategory {
  _id: string;
  name: string;
  [key: string]: any;
}

export default function MyCourses() {
  const { data: session } = useSession();
  const token = session?.accessToken as string;
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // 🔹 ফিল্টার ও সার্চ মেমরি স্টেটসমূহ
  const [searchQuery, setSearchQuery] = useState("");
  const [tempSearch, setTempSearch] = useState("");
  const [selectedCategoryType, setSelectedCategoryType] =
    useState<string>("all");
  const [selectedCourseType, setSelectedCourseType] = useState<string>("all");
  const [selectedFeaturedType, setSelectedFeaturedType] =
    useState<string>("all");
  const [selectedDbCategory, setSelectedDbCategory] = useState<string>("all");

  // 🔹 ১. তানস্ট্যাক কুয়েরি: ডাটাবেজের সকল কোর্স অটো ফেচ করবে
  const {
    data: courses = [],
    isLoading: isCoursesLoading,
    isError: isCoursesError,
    refetch,
  } = useQuery<ICourse[]>({
    queryKey: ["adminGlobalCoursesList"],
    queryFn: async () => {
      const response = await axiosSecure.get("/courses");
      return response.data?.data || response.data || [];
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  // 🔹 ২. ডেডিকেটেড ক্যাটাগরি ফেচ এপিআই (TanStack Query): কোনো ড্রামা ছাড়া সরাসরি ডাটাবেজ থেকে লাইভ ক্যাটাগরি নিয়ে আসবে
  const { data: departments = [], isLoading: isDeptsLoading } = useQuery<
    ICategory[]
  >({
    queryKey: ["adminGlobalCategoriesList"],
    queryFn: async () => {
      const response = await axiosSecure.get("/categories");
      return response.data?.data || response.data || [];
    },
    staleTime: 10 * 60 * 1000, // ক্যাটাগরি বারবার পরিবর্তন হয় না, তাই ১০ মিনিট ক্যাশ
  });

  // 🔹 ৩. ফিচার্ড টগল মিউটেশন
  const toggleFeaturedMutation = useMutation({
    mutationFn: async (payload: { id: string; isFeatured: boolean }) => {
      const response = await axiosSecure.patch(
        `/courses/admin/featured/${payload.id}`,
        { isFeatured: payload.isFeatured },
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminGlobalCoursesList"] });
    },
    onError: (error: any) => {
      Swal.fire({
        icon: "error",
        title: "অপারেশন ব্যর্থ",
        text:
          error?.response?.data?.message ||
          "ফিচার্ড স্ট্যাটাস পরিবর্তন করা সম্ভব হয়নি।",
        confirmButtonColor: "#0B5D3B",
      });
    },
  });

  // 🔹 ৪. ডিলিট মিউটেশন
  const deleteCourseMutation = useMutation({
    mutationFn: async (courseId: string) => {
      return await axiosSecure.delete(
        `/courses/teacher/delete-course/${courseId}`,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminGlobalCoursesList"] });
      Swal.fire(
        "ডিলিট সম্পন্ন!",
        "কোর্সটি সফলভাবে ডাটাবেজ থেকে মুছে ফেলা হয়েছে।",
        "success",
      );
    },
    onError: (error: any) => {
      Swal.fire(
        "ত্রুটি",
        error?.response?.data?.message || "কোর্সটি মুছে ফেলা সম্ভব হয়নি।",
        "error",
      );
    },
  });

  const handleToggleCourseFeatured = (
    courseId: string,
    currentStatus: boolean,
    courseTitle: string,
  ) => {
    if (!token) return;
    const nextStatus = !currentStatus;

    Swal.fire({
      icon: "question",
      title: nextStatus ? "হোমপেজে প্রদর্শন" : "হোমপেজ থেকে অপসারণ",
      text: nextStatus
        ? `আপনি কি "${courseTitle}" কোর্সটি মূল ল্যান্ডিং পেজে ফিচার্ড হিসেবে প্রদর্শন করতে চান?`
        : `আপনি কি "${courseTitle}" কোর্সটি মূল ল্যান্ডিং পেজের ফিচার্ড তালিকা থেকে বাদ দিতে চান?`,
      showCancelButton: true,
      confirmButtonText: nextStatus ? "হ্যাঁ, ফিচার্ড করুন" : "হ্যাঁ, বাদ দিন",
      cancelButtonText: "বাতিল",
      confirmButtonColor: "#0B5D3B",
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        toggleFeaturedMutation.mutate({ id: courseId, isFeatured: nextStatus });
      }
    });
  };

  const handleDelete = async (courseId: string) => {
    const result = await Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "একবার ডিলিট করলে এই কোর্সের ডেটা আর কখনো ফিরে পাবেন না!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0B5D3B",
      cancelButtonColor: "#d33",
      confirmButtonText: "হ্যাঁ, ডিলিট করুন!",
      cancelButtonText: "বাতিল",
    });

    if (result.isConfirmed) {
      deleteCourseMutation.mutate(courseId);
    }
  };

  const handleResetFilters = () => {
    setSelectedCategoryType("all");
    setSelectedCourseType("all");
    setSelectedFeaturedType("all");
    setSelectedDbCategory("all");
    setSearchQuery("");
    setTempSearch("");
    setIsFilterModalOpen(false);
  };

  // 🔹 ৫. ক্লায়েন্ট-সাইড মেমরি ফিল্টারিং মেট্রিক্স (High-Performance Real-time Grid)
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.duration?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (typeof course.category === "object" &&
        course.category?.name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()));

    const matchesCategoryType =
      selectedCategoryType === "all" ||
      course.courseCategoryType === selectedCategoryType;

    const matchesCourseType =
      selectedCourseType === "all" ||
      course.courseType?.toLowerCase() === selectedCourseType.toLowerCase();

    const matchesFeatured =
      selectedFeaturedType === "all" ||
      (selectedFeaturedType === "featured" && course.isFeatured === true) ||
      (selectedFeaturedType === "regular" && !course.isFeatured);

    // আইডি বা অবজেক্ট নেম যে কোনো ফরমেটেই আসুক, ডাইনামিক মঙ্গোডিবি আইডি ম্যাচিং ফিল্টার
    const courseCatId =
      typeof course.category === "object"
        ? course.category?._id
        : course.category;
    const matchesDbCategory =
      selectedDbCategory === "all" ||
      String(courseCatId) === String(selectedDbCategory);

    return (
      matchesSearch &&
      matchesCategoryType &&
      matchesCourseType &&
      matchesFeatured &&
      matchesDbCategory
    );
  });

  if (isCoursesLoading) {
    return (
      <div
        className="h-96 flex flex-col items-center justify-center gap-3"
        aria-live="polite"
        aria-busy="true"
      >
        <LoadingSpinner />
        <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
          ইনস্টিটিউট ডিরেক্টরি লোড হচ্ছে...
        </p>
      </div>
    );
  }

  if (isCoursesError) {
    return (
      <div
        className="bg-rose-50 border border-rose-100 rounded-[2rem] p-8 text-center text-rose-600 font-bold max-w-xl mx-auto mt-12"
        role="alert"
      >
        <ShieldAlert className="h-10 w-10 text-rose-500 mx-auto mb-2" />
        <p className="text-sm">
          সার্ভার কোয়েরি রেসপন্স ফেইল করেছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।
        </p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-rose-600 text-white text-xs font-black rounded-xl hover:bg-rose-700 transition-all cursor-pointer"
        >
          রিফ্রেশ করুন
        </button>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6 pb-12 px-2">
      {/* হেডার প্যানেল */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-3xl font-black text-neutral-800 tracking-tight">
            ইনস্টিটিউট কোর্সসমূহ
          </h1>
          <p className="text-[10px] md:text-sm text-neutral-500 font-medium">
            সর্বমোট {courses.length} টি লাইভ কোর্সের মধ্যে ফিল্টার্ড{" "}
            {filteredCourses.length} টি দেখানো হচ্ছে
          </p>
        </div>
        <Link href="/dashboard/admin/add-course" passHref>
          <button
            className="bg-[#0B5D3B] hover:cursor-pointer hover:bg-[#0c4a2d] text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold shadow-md transition-all active:scale-95 self-start sm:self-auto"
            aria-label="একটি নতুন কোর্স যোগ করুন"
          >
            <Plus size={18} aria-hidden="true" /> নতুন কোর্স
          </button>
        </Link>
      </div>

      {/* সার্চ ও ফিল্টার ট্রিগার বার */}
      <div className="flex items-center gap-3 bg-white p-4 rounded-3xl border border-neutral-100 shadow-3xs">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder="কোর্সের নাম, শিরোনাম অথবা ট্যাগ লিখে খুঁজুন..."
            value={tempSearch}
            onChange={(e) => {
              setTempSearch(e.target.value);
              setSearchQuery(e.target.value);
            }}
            className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 focus:border-[#0B5D3B] focus:bg-white rounded-xl text-xs font-bold placeholder:font-medium outline-none transition-all placeholder:text-neutral-400"
          />
          {tempSearch && (
            <button
              type="button"
              onClick={() => {
                setTempSearch("");
                setSearchQuery("");
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 text-xs font-bold"
            >
              মুছুন
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsFilterModalOpen(true)}
          className={`flex items-center gap-2 px-5 py-3 border rounded-xl text-xs font-black transition-all cursor-pointer active:scale-95 ${
            selectedCategoryType !== "all" ||
            selectedCourseType !== "all" ||
            selectedFeaturedType !== "all" ||
            selectedDbCategory !== "all"
              ? "bg-emerald-50 border-emerald-200 text-[#0B5D3B]"
              : "bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50"
          }`}
        >
          <SlidersHorizontal size={14} />
          ফিল্টার করুন
          {(selectedCategoryType !== "all" ||
            selectedCourseType !== "all" ||
            selectedFeaturedType !== "all" ||
            selectedDbCategory !== "all") && (
            <span className="w-2 h-2 bg-emerald-600 rounded-full inline-block" />
          )}
        </button>
      </div>

      {/* কোর্স লিস্ট রেন্ডার গ্রিড */}
      {filteredCourses.length > 0 ? (
        <div
          className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6"
          role="list"
          aria-label="ইনস্টিটিউট কোর্সের তালিকা"
        >
          {filteredCourses.map((course, idx) => {
            const isFeatured = course?.isFeatured === true;

            return (
              <div
                key={course._id}
                className="relative group/wrapper"
                role="listitem"
              >
                <div className="absolute top-3 left-3 z-30 transition-all">
                  <button
                    type="button"
                    onClick={() =>
                      handleToggleCourseFeatured(
                        course._id,
                        isFeatured,
                        course.title,
                      )
                    }
                    aria-label={`"${course.title}" কোর্সটি মূল হোমপেজে ফিচার্ড করুন`}
                    className={`p-2 rounded-xl border transition-all flex items-center gap-1 shadow-xs cursor-pointer text-[10px] font-black active:scale-95 ${
                      isFeatured
                        ? "bg-amber-500 border-amber-600 text-white hover:bg-amber-600"
                        : "bg-white border-neutral-200 text-neutral-500 hover:bg-neutral-50"
                    }`}
                  >
                    <Star
                      size={12}
                      className={isFeatured ? "fill-white" : ""}
                      aria-hidden="true"
                    />
                    <span className="hidden sm:inline">
                      {isFeatured ? "হোমপেজে সচল" : "হোমপেজে দেখান"}
                    </span>
                  </button>
                </div>

                <CourseCard
                  course={course}
                  idx={idx}
                  onEdit={(c: any) => {
                    setSelectedCourse(c as ICourse);
                    setIsModalOpen(true);
                  }}
                  onDelete={handleDelete}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div
          className="bg-white border border-dashed border-neutral-200 rounded-[2.5rem] p-12 text-center"
          role="status"
        >
          <div className="bg-neutral-50 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-200">
            <BookOpen className="w-8 h-8 md:w-10 md:h-10" aria-hidden="true" />
          </div>
          <h3 className="text-base font-bold text-neutral-700">
            কোনো কোর্স খুঁজে পাওয়া যায়নি
          </h3>
          <p className="text-xs text-neutral-400 mt-1 font-medium max-w-xs mx-auto">
            আপনার সিলেক্ট করা ফিল্টার বা সার্চ কি-ওয়ার্ডের সাথে সামঞ্জস্যপূর্ণ
            কোনো রেকর্ড সিস্টেম ডিরেক্টরিতে নেই।
          </p>
          {(selectedCategoryType !== "all" ||
            selectedCourseType !== "all" ||
            selectedFeaturedType !== "all" ||
            selectedDbCategory !== "all" ||
            searchQuery !== "") && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-4 px-4 py-2 border border-neutral-200 hover:bg-neutral-50 rounded-xl text-xs font-bold text-neutral-600 transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              <RotateCcw size={12} /> ফিল্টার রিসেট করুন
            </button>
          )}
        </div>
      )}

      {/* 🔹 ফিল্টারিং মোডাল প্যানেল */}
      <AnimatePresence>
        {isFilterModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterModalOpen(false)}
              className="fixed inset-0 bg-neutral-900/50 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl border border-neutral-100 relative z-10 flex flex-col"
            >
              {/* মোডাল হেডার */}
              <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
                <div className="flex items-center gap-2 text-neutral-800 font-black text-sm">
                  <SlidersHorizontal size={16} className="text-[#0B5D3B]" />
                  অ্যাডভান্সড ফিল্টার সেটিংস
                </div>
                <button
                  type="button"
                  onClick={() => setIsFilterModalOpen(false)}
                  className="p-1.5 hover:bg-neutral-200 rounded-full text-neutral-400 transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* ফিল্টার বডি অপশন */}
              <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
                {/* কন্ডিশন ১: ক্যাটাগরি টাইপ */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-neutral-400">
                    কোর্স ক্যাটাগরি টাইপ
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: "all", label: "সব টাইপ" },
                      { key: "academic", label: "একাডেমিক" },
                      { key: "general", label: "জেনারেল" },
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => setSelectedCategoryType(opt.key)}
                        className={`py-2 px-3 text-xs font-bold rounded-xl transition-all border cursor-pointer ${
                          selectedCategoryType === opt.key
                            ? "bg-[#0B5D3B] border-[#0B5D3B] text-white shadow-2xs"
                            : "bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 🎯 কন্ডিশন ২: সম্পূর্ণ ডাইনামিক লাইভ ডাটাবেজ ক্যাটাগরি ড্রপডাউন (No More Drama!) */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-neutral-400">
                    নির্দিষ্ট মূল বিভাগ (লাইভ ডাটাবেজ)
                  </label>
                  <select
                    value={selectedDbCategory}
                    onChange={(e) => setSelectedDbCategory(e.target.value)}
                    className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-[#0B5D3B]/10 outline-none text-neutral-700 cursor-pointer"
                  >
                    <option value="all">সকল বিভাগ (All Categories)</option>
                    {departments.map((dept: any) => (
                      <option key={dept._id} value={dept._id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Condition ৩: কোর্স টাইপ (Free/Paid) */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-neutral-400">
                    কোর্স টাইপ ফি
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: "all", label: "সব কোর্স" },
                      { key: "free", label: "ফ্রি (Free)" },
                      { key: "premium", label: "প্রিমিয়াম" },
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => setSelectedCourseType(opt.key)}
                        className={`py-2 px-3 text-xs font-bold rounded-xl transition-all border cursor-pointer ${
                          selectedCourseType === opt.key
                            ? "bg-[#0B5D3B] border-[#0B5D3B] text-white shadow-2xs"
                            : "bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Condition ৪: হোমপেজ ফিচার্ড স্ট্যাটাস */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-neutral-400">
                    হোমপেজ মডারেশন ভিউ
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: "all", label: "সব বিবরণ" },
                      { key: "featured", label: "ফিচার্ড" },
                      { key: "regular", label: "নরমাল ভিউ" },
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => setSelectedFeaturedType(opt.key)}
                        className={`py-2 px-3 text-xs font-bold rounded-xl transition-all border cursor-pointer ${
                          selectedFeaturedType === opt.key
                            ? "bg-[#0B5D3B] border-[#0B5D3B] text-white shadow-2xs"
                            : "bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* মোডাল ফুটার অ্যাকশন ট্র্যাকার */}
              <div className="p-4 border-t border-neutral-100 flex items-center gap-3 bg-neutral-50/50">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="flex-1 py-3 bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-500 font-bold rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <RotateCcw size={12} /> রিসেট করুন
                </button>
                <button
                  type="button"
                  onClick={() => setIsFilterModalOpen(false)}
                  className="flex-1 py-3 bg-[#0B5D3B] hover:bg-[#0c4a2d] text-white font-black rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Check size={14} /> ফিল্টার প্রয়োগ করুন
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* এডিট মোডাল উইজেট */}
      {selectedCourse && (
        <EditCourseModal
          isOpen={isModalOpen}
          course={selectedCourse}
          onClose={() => setIsModalOpen(false)}
          onUpdate={refetch}
        />
      )}
    </div>
  );
}