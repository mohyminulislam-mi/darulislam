"use client";

import React, { useState } from "react";
import {
  Megaphone,
  Calendar,
  Search,
  Bell,
  FileText,
  ExternalLink,
  Loader2,
  AlertCircle,
  Pin,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Phone,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "@/src/app/hooks/useAxiosSecure";
import LoadingSpinner from "@/src/components/shared/spinner/LoadingSpinner";

export default function NoticeBoard() {
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourseIds, setSelectedCourseIds] = useState("");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  const {
    data: noticesResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["studentNotices", selectedCourseIds],
    queryFn: async () => {
      const url = `/notices`;
      const res = await axiosSecure.get(url);
      return res.data;
    },
  });

  const noticesData = noticesResponse?.data || [];
  const totalCount = noticesResponse?.totalCount || 0;

  // সার্চ ফিল্টারিং
  const filteredNotices = noticesData.filter(
    (notice: any) =>
      notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredNotices.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNotices = filteredNotices.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#F4F7F5] pb-12">
      {/* 🟢 Top Hero Header Banner */}
      <div className="bg-[#0B5D3B] text-white pt-20 lg:pt-24 pb-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full w-fit backdrop-blur-sm">
              <Bell size={13} className="text-emerald-300 animate-bounce" />
              <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-200">
                সর্বশেষ ঘোষণা
              </span>
            </div>
            <h1 className="text-xl md:text-3xl font-black italic">
              ইনস্টিটিউট নোটিশ বোর্ড
            </h1>
            <p className="text-xs font-medium text-emerald-100 max-w-xl leading-relaxed">
              দারুল ইসলাম ইনস্টিটিউটের অফিশিয়াল নোটিশ ও গুরুত্বপূর্ণ আপডেটগুলো
              এখানে সংক্ষেপে দেখতে পাবেন।
            </p>
          </div>

          {/* সার্চ বার */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="নোটিশ খুঁজুন..."
              className="w-full pl-9 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 text-xs focus:outline-none focus:bg-white focus:text-neutral-800 focus:placeholder-neutral-400 transition-all"
            />
            <Search
              className="absolute left-3 top-2.5 text-white/50"
              size={14}
            />
          </div>
        </div>
      </div>

      {/* 🔵 Main Content Area */}
      <div className="max-w-4xl mx-auto px-4 -mt-12 relative z-10 space-y-4">
        {/* নোটিশ হেডার টাইটেল */}
        <div className="bg-white px-4 py-3 rounded-xl shadow-md border border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-[#0B5D3B]"></span>
            <h2 className="text-xs font-black text-neutral-700 uppercase tracking-wider">
              সকল নোটিশ ({isLoading ? "..." : filteredNotices.length})
            </h2>
          </div>
          {totalCount > 0 && (
            <span className="text-[10px] text-neutral-400 font-bold">
              মোট নোটিশ: {totalCount} টি
            </span>
          )}
        </div>

        {/* নোটিশ লিস্ট এরিয়া */}
        <div className="grid grid-cols-1 gap-3">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl border border-neutral-100 gap-2">
              <LoadingSpinner />
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl border border-red-100 text-red-500 gap-2 text-center px-4">
              <AlertCircle size={24} />
              <p className="text-xs font-bold">
                নোটিশ ডাটা লোড করতে সমস্যা হয়েছে।
              </p>
              <p className="text-[10px] text-red-400">
                {(error as any)?.message || "সার্ভার এরর"}
              </p>
            </div>
          ) : currentNotices.length > 0 ? (
            currentNotices.map((notice: any) => {
              const isUrgent = notice.type === "urgent";
              const isPinned = notice.pinned === true;

              return (
                <div
                  key={notice._id}
                  className="bg-white rounded-xl border border-neutral-100 p-4 md:p-5 shadow-sm hover:shadow-md transition-all flex flex-col gap-3 relative overflow-hidden"
                >
                  {isPinned ? (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600" />
                  ) : isUrgent ? (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500" />
                  ) : null}

                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        isUrgent
                          ? "bg-orange-50 text-orange-500"
                          : isPinned
                            ? "bg-blue-50 text-blue-600"
                            : "bg-emerald-50 text-[#0B5D3B]"
                      }`}
                    >
                      {isPinned ? (
                        <Pin size={16} className="rotate-45" />
                      ) : (
                        <Megaphone size={16} />
                      )}
                    </div>

                    <div className="space-y-1.5 w-full">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded text-[10px] font-bold">
                            {notice.course?.name || "সাধারণ নোটিশ"}
                          </span>

                          {/* পিনড ব্যাজ */}
                          {isPinned && (
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 rounded text-[9px] font-black tracking-wide flex items-center gap-0.5">
                              পিন করা
                            </span>
                          )}

                          {/* জরুরী ব্যাজ */}
                          {isUrgent && (
                            <span className="px-2 py-0.5 bg-orange-50 text-orange-600 border border-orange-100 rounded text-[9px] font-black italic animate-pulse">
                              জরুরী
                            </span>
                          )}
                        </div>

                        {/* প্রকাশের তারিখ - রাইট অ্যালাইনড */}
                        <div className="flex items-center gap-1 text-[10px] text-neutral-400 font-bold">
                          <Calendar size={10} />
                          <span>
                            {notice.createdAt
                              ? new Date(notice.createdAt).toLocaleDateString(
                                  "bn-BD",
                                  {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  },
                                )
                              : "তারিখ পাওয়া যায়নি"}
                          </span>
                        </div>
                      </div>

                      {/* নোটিশ টাইটেল */}
                      <h3 className="text-xs md:text-base font-black text-neutral-800 highway-snug flex items-center gap-1.5">
                        {notice.title}
                      </h3>

                      {/* নোটিশ ডেসক্রিপশন */}
                      <p className="text-[11px] md:text-xs text-neutral-500 font-medium leading-relaxed whitespace-pre-line">
                        {notice.description}
                      </p>

                      {notice.instructor && (
                        <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-neutral-50">
                          <img
                            src={
                              notice.instructor.profilePicture ||
                              "https://avatars.githubusercontent.com/u/198446517?v=4"
                            }
                            alt={notice.instructor.name}
                            className="w-5 h-5 rounded-full object-cover bg-neutral-100"
                          />
                          <p className="text-[10px] font-bold text-neutral-400">
                            ঘোষণা করেছেন:{" "}
                            <span className="text-neutral-600 font-black">
                              {notice.instructor.name}
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl border border-neutral-100 gap-2 text-center px-4">
              <Megaphone className="text-neutral-300" size={28} />
              <p className="text-xs font-black text-neutral-500">
                এই মুহূর্তে কোনো নোটিশ বা ঘোষণা পাওয়া যায়নি।
              </p>
            </div>
          )}
        </div>

        {/* 🟢 Pagination UI Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-2 bg-white p-4 rounded-xl border border-neutral-100 shadow-sm">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
            >
              <ChevronLeft size={14} />
            </button>

            {Array.from({ length: totalPages }, (_, index) => {
              const pageNum = index + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                    currentPage === pageNum
                      ? "bg-[#0B5D3B] text-white shadow-md"
                      : "border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}

        {/* ফুটার হেল্প ডেক্স পার্ট */}
        <div className="bg-white rounded-2xl p-5 border border-neutral-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-[#0B5D3B] shrink-0">
              <HelpCircle size={18} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-neutral-800">
                কোনো কিছু বুঝতে সমস্যা হচ্ছে?
              </h4>
              <p className="text-[11px] text-neutral-600 font-medium mt-0.5">
                বিস্তারিত জানতে সরাসরি আমাদের সাথে ফোনে যোগাযোগ করুন।
              </p>
            </div>
          </div>

          <a
            href="tel:+8801792297764"
            className="w-full sm:w-auto px-5 py-2.5 bg-[#0B5D3B] hover:bg-[#0c462a] text-white font-semibold text-[11px] rounded-lg transition-all shadow-sm flex items-center justify-center gap-1.5 shrink-0 cursor-pointer active:scale-95"
          >
            <Phone size={12} className="fill-white" />
            <span>কল করুন</span>
          </a>
        </div>
      </div>
    </div>
  );
}
