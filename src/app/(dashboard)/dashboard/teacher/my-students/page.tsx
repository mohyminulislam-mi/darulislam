"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Search,
  Layers,
  SlidersHorizontal,
  X,
} from "lucide-react";
import useAxiosSecure from "@/src/app/hooks/useAxiosSecure";
import {motion, AnimatePresence} from "framer-motion"

// 1️⃣ 🎯 হেডার এবং সার্চ-ফিল্টার বাটন স্কেলিটন লোডার
const HeaderSkeleton = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-5 animate-pulse">
      <div>
        <div className="h-7 w-48 bg-neutral-200 rounded-lg mb-2" />
        <div className="h-4 w-36 bg-neutral-200 rounded" />
      </div>
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="h-10 w-full sm:w-64 bg-neutral-200 rounded-xl" />
        <div className="h-10 w-24 bg-neutral-200 rounded-xl" />
      </div>
    </div>
  );
};

// 2️⃣ 🎯 টেবিল রো-এর জন্য প্রফেশনাল এলাইনড স্কেলিটন লোডার (যা Layout Shift আটকাবে)
const TableRowSkeleton = ({ count = 5 }) => {
  return (
    <div className="bg-white rounded-[2rem] border border-neutral-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden w-full animate-pulse mt-8">
      <div className="p-5 bg-neutral-50 h-12 w-full border-b border-neutral-100" />
      <div className="divide-y divide-neutral-100 px-5">
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className="py-5 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="w-11 h-11 bg-neutral-200 rounded-full shrink-0" />
              <div className="space-y-1.5 flex-1">
                <div className="h-4 w-32 bg-neutral-200 rounded" />
                <div className="h-3 w-12 bg-neutral-200 rounded" />
              </div>
            </div>
            <div className="space-y-1.5 flex-1 hidden sm:block">
              <div className="h-4 w-28 bg-neutral-200 rounded" />
              <div className="h-3 w-36 bg-neutral-200 rounded" />
            </div>
            <div className="h-7 w-24 bg-neutral-200 rounded-xl flex-1 hidden md:block" />
            <div className="h-4 w-20 bg-neutral-200 rounded flex-1 text-right" />
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Utility: Enhanced Gender Display & Fallback Avatar ---
const getGenderLabel = (gender: string | undefined) => {
  if (!gender) return "পুরুষ";
  return gender === "female" ? "নারী" : "পুরুষ";
};

const getInitials = (name: string) => {
  if (!name) return "";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// --- Main Page Component ---
const MyStudentsPage = () => {
  const axiosSecure = useAxiosSecure();

  // 🎯 ৩টি কন্ডিশনাল সার্চ ফিল্টার স্টেট
  const [searchQuery, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [isOpenFilterModal, setIsOpenFilterModal] = useState(false);

  // পেজিনেশন স্টেট
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filterRef = useRef<HTMLDivElement>(null);

  // 🔹 ১. কোর্সের ড্রপডাউন মেনু ডাটা ফেচিং
  const { data: courses = [] } = useQuery<any[]>({
    queryKey: ["teacherOwnCoursesMenu"],
    queryFn: async () => {
      const res = await axiosSecure.get("/courses/teacher/my-courses");
      return res.data?.data || res.data || [];
    },
    staleTime: 20 * 60 * 1000,
  });

  // 🔹 ২. শিক্ষার্থীর তালিকা ফেচিং (সার্ভার সাইড কুয়েরি লক)
  const { data: studentsData = { data: [] }, isLoading } = useQuery({
    queryKey: [
      "teacherMyStudentsList",
      searchQuery,
      selectedCourse,
      selectedType,
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (selectedCourse) params.append("courseId", selectedCourse);
      if (selectedType) params.append("courseCategoryType", selectedType);

      const res = await axiosSecure.get(
        `/users/teacher/my-students?${params.toString()}`,
      );
      return res.data || { data: [] };
    },
    staleTime: 1000 * 60 * 2,
  });

  const students = studentsData.data || [];

  useEffect(() => {
    setCurrentPage(1); // ফিল্টার বদল হলে ১ম পেজে রিসেট হবে
  }, [searchQuery, selectedCourse, selectedType]);

  // আউটসাইড ক্লিকার ভ্যালিডেশন
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

  const clearFilters = () => {
    setSelectedCourse("");
    setSelectedType("");
    setIsOpenFilterModal(false);
  };

  const isFilterActive = selectedCourse !== "" || selectedType !== "";

  // পেহিনেশন ম্যাট্রিক্স ক্যালকুলেশন
  const totalItems = students.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = students.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // 🎯 মেইন ট্র্যাপ ফিক্স: হেডার সহ পুরো পেজের কন্টেইনার উইড্থ বজায় রেখে স্কেলিটন লোড করানো হচ্ছে
  if (isLoading) {
    return (
      <div className="p-4 md:p-8 antialiased bg-neutral-50 min-h-[100vh] w-full space-y-4">
        <HeaderSkeleton />
        <TableRowSkeleton count={6} />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 antialiased bg-neutral-50 min-h-[100vh] relative font-sans">
      {/* 🔹 প্রিমিয়াম ইন্টারেক্টিভ হেডার */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-5">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-neutral-800 tracking-tight flex items-center gap-2">
            <Users className="text-[#0B5D3B]" size={24} /> আমার শিক্ষার্থীসমূহ
          </h2>
          <p className="text-xs md:text-sm text-neutral-500 font-medium mt-0.5">
            মোট{" "}
            <span className="text-[#0B5D3B] font-black">
              {students.length}টি
            </span>{" "}
            শিক্ষার্থীর রেকর্ড সক্রিয় আছে
          </p>
        </div>

        {/* 🔍 সার্চ এবং ফিল্টার বার (Exact Same Like Course Page) */}
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
              placeholder="নাম/ফোন দিয়ে খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchTerm(e.target.value)}
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

          {/* 🎯 ড্রপডাউন মডাল পপআপ */}
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
                    <BookOpen size={12} className="text-[#0B5D3B]" /> কোর্স
                    সিলেক্ট
                  </label>
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#0B5D3B] font-bold text-neutral-700 cursor-pointer"
                  >
                    <option value="">সকল কোর্স (All)</option>
                    {courses.map((course: any) => (
                      <option key={course._id} value={course._id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-neutral-500 uppercase flex items-center gap-1">
                    <Layers size={12} className="text-[#0B5D3B]" /> ক্যাটাগরি
                    লেভেল
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#0B5D3B] font-bold text-neutral-700 cursor-pointer"
                  >
                    <option value="">সকল ধরণ (All Type)</option>
                    <option value="academic">একাডেমিক (Academic)</option>
                    <option value="general">জেনারেল (General)</option>
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

      {/* --- Table Section --- */}
      <div className="bg-white rounded-[2rem] border border-neutral-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)] overflow-x-auto mt-8">
        <table className="w-full text-left border-collapse text-sm">
          <thead className="bg-neutral-50 border-b border-neutral-100 sticky top-0">
            <tr className="text-neutral-500 font-black text-xs">
              <th className="p-5 uppercase">শিক্ষার্থী তথ্য</th>
              <th className="p-5 uppercase">যোগাযোগ সংযোগ</th>
              <th className="p-5 uppercase">ভর্তিকৃত কোর্স</th>
              <th className="p-5 uppercase">ভর্তির তারিখ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-50 font-bold text-neutral-700">
            {currentStudents.length > 0 ? (
              currentStudents.map((student: any) => (
                <tr
                  key={`${student._id}-${student.enrolledCourse?._id}`}
                  className="hover:bg-emerald-50/40 transition-colors"
                >
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-full border-2 border-emerald-100/50 relative overflow-hidden bg-neutral-100 shadow-3xs shrink-0">
                        {student.profileImage ? (
                          <img
                            src={student.profileImage}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-emerald-50/60 font-black text-[#0B5D3B] text-base">
                            {getInitials(student.name)}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-black text-neutral-800 text-sm md:text-base leading-tight">
                          {student.name}
                        </div>
                        <div className="text-[10px] text-neutral-400 font-black uppercase mt-0.5 tracking-wider">
                          {getGenderLabel(student.gender)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-5 align-middle">
                    <div className="flex flex-col text-xs space-y-0.5">
                      <a
                        href={`tel:${student.phone}`}
                        className="text-neutral-700 hover:text-[#0B5D3B] font-bold"
                        title="কল করুন"
                      >
                        {student.phone}
                      </a>
                      <a
                        href={`mailto:${student.email}`}
                        className="text-neutral-400 font-medium text-[11px] lowercase tracking-normal"
                        title="ইমেইল পাঠান"
                      >
                        {student.email}
                      </a>
                    </div>
                  </td>
                  <td className="p-5 align-middle">
                    <span className="inline-flex items-center gap-1.5 text-xs text-[#0B5D3B] bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100/50 max-w-xs truncate">
                      <BookOpen size={13} className="opacity-80" />
                      {student.enrolledCourse?.title || (
                        <span className="text-neutral-400">N/A</span>
                      )}
                    </span>
                  </td>
                  <td className="p-5 align-middle text-xs text-neutral-500 font-medium">
                    {student.enrolledAt
                      ? new Date(student.enrolledAt).toLocaleDateString(
                          "bn-BD",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )
                      : "--"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="p-16 text-center text-xs text-neutral-400 italic"
                >
                  কোনো শিক্ষার্থীর রেকর্ড খুঁজে পাওয়া যায়নি।
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* --- Pagination Panel --- */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-neutral-50 bg-white px-6 py-4">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="inline-flex items-center rounded-xl border bg-white px-4 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-50 disabled:opacity-40 transition-colors"
              >
                পূর্ববর্তী
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="inline-flex items-center rounded-xl border bg-white px-4 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-50 disabled:opacity-40 transition-colors"
              >
                পরবর্তী
              </button>
            </div>

            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-xs text-neutral-500 font-medium">
                  সর্বমোট{" "}
                  <span className="font-bold text-neutral-800">
                    {totalItems}
                  </span>{" "}
                  জনের মধ্যে{" "}
                  <span className="font-bold text-neutral-800">
                    {indexOfFirstItem + 1}
                  </span>{" "}
                  -{" "}
                  <span className="font-bold text-neutral-800">
                    {Math.min(indexOfLastItem, totalItems)}
                  </span>{" "}
                  দেখানো হচ্ছে
                </p>
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="inline-flex items-center rounded-xl border border-neutral-200 bg-white p-2 text-neutral-500 hover:bg-neutral-50 disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  {Array.from({ length: totalPages }, (_, index) => {
                    const pageNum = index + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() =>
                          pageNum !== currentPage && handlePageChange(pageNum)
                        }
                        className={`inline-flex items-center justify-center rounded-xl text-xs font-black w-8 h-8 transition-all cursor-pointer ${
                          currentPage === pageNum
                            ? "bg-[#0B5D3B] text-white shadow-sm"
                            : "border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="inline-flex items-center rounded-xl border border-neutral-200 bg-white p-2 text-neutral-500 hover:bg-neutral-50 disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyStudentsPage;