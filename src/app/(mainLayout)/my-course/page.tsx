"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "@/src/app/hooks/useAxiosSecure";
import {
  BookOpen,
  GraduationCap,
  Clock,
  PlayCircle,
  CheckCircle,
  Search,
  User,
  AlertCircle,
  Lock,
} from "lucide-react";

// Skeleton loader for course cards
const CourseCardSkeleton = () => (
  <div className="bg-white rounded-[2rem] border border-neutral-100 shadow-sm overflow-hidden flex flex-col animate-pulse">
    <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden shrink-0">
      <div className="w-full h-full bg-slate-200" />
      <div className="absolute top-3 left-3 w-14 h-6 bg-slate-300 rounded-lg" />
    </div>
    <div className="p-5 flex-1 flex flex-col gap-4">
      <div className="space-y-2">
        <div className="w-28 h-6 bg-slate-200 rounded-md"></div>
        <div className="w-40 h-6 bg-slate-300 rounded-md"></div>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
        <div className="w-24 h-4 bg-slate-200 rounded-md"></div>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-neutral-50 gap-6">
        <div className="w-20 h-4 bg-slate-200 rounded" />
        <div className="w-16 h-4 bg-slate-200 rounded" />
      </div>
    </div>
    <div className="p-4 bg-slate-50/50 border-t border-neutral-100">
      <div className="w-full h-10 bg-slate-200 rounded-xl" />
    </div>
  </div>
);

export default function MyCoursesPage() {
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: courses = [],
    isLoading,
    isError,
  } = useQuery<any[]>({
    queryKey: ["student-enrolled-courses"],
    queryFn: async () => {
      const res = await axiosSecure.get("/students/my-courses");
      return res.data?.data || res.data || [];
    },
  });

  const filteredCourses = courses.filter((course) => {
    const courseTitle = course?.title || "";
    return courseTitle.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16 pt-16 lg:pt-18 font-sans">
      <div className="bg-gradient-to-br from-[#0d4d2e] via-[#052214] to-black text-white p-6 pt-12 pb-24 rounded-b-[2rem] lg:rounded-b-[4rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-72 h-72 bg-[#0B5D3B]/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-72 h-72 bg-black/40 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-[#0B5D3B] bg-white/90 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 w-fit shadow-sm">
              <span>স্টুডেন্ট ড্যাশবোর্ড</span>
            </div>
            <h1 className="text-2xl lg:text-4xl font-black tracking-tight flex items-center gap-2">
              <GraduationCap className="text-white" size={32} />
              আমার এনরোল করা কোর্সসমূহ
            </h1>
            <p className="text-slate-300 text-xs lg:text-sm mt-1 font-medium">
              আপনার চলমান কোর্সগুলোর প্রোগ্রেস ও ক্লাস শিডিউল এখানে ট্র্যাক
              করুন।
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="কোর্সের নাম দিয়ে খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-slate-400 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0B5D3B] transition-all"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-12 relative z-10">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, idx) => (
              <CourseCardSkeleton key={idx} />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-10 bg-red-50 text-red-600 rounded-[2rem] border border-red-100 text-xs font-bold flex items-center justify-center gap-2 max-w-md md:max-w-lg mx-auto shadow-sm">
            <AlertCircle size={16} />
            <span>
              ডাটা লোড করতে সমস্যা হয়েছে! দয়া করে লগইন সেশন বা নেটওয়ার্ক চেক
              করুন।
            </span>
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const courseId = course?._id || course?.id;
              const instructorName =
                course?.instructor?.name || "ওস্তাদ নির্ধারিত হচ্ছে";
              const isPending = course?.enrollmentStatus === "pending";

              return (
                <div
                  key={courseId}
                  className={`bg-white rounded-[2rem] border border-neutral-100 shadow-sm overflow-hidden flex flex-col justify-between group transition-all duration-300 ${
                    isPending
                      ? "opacity-80 relative select-none pointer-events-none"
                      : "hover:shadow-xl hover:-translate-y-1"
                  }`}
                >
                  <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden shrink-0">
                    <img
                      src={course.image || "/placeholder-course.jpg"}
                      alt={course.title}
                      className={`w-full h-full object-cover transition-transform duration-500 ${!isPending && "group-hover:scale-105"}`}
                    />

                    {isPending ? (
                      <>
                        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2 transition-all">
                          <div className="p-3 bg-white/90 text-amber-600 rounded-full shadow-lg border border-amber-100 animate-pulse">
                            <Lock size={24} className="stroke-[2.5]" />
                          </div>
                          <span className="text-white text-[11px] font-black bg-amber-600/90 px-2.5 py-1 rounded-md shadow-sm tracking-wide">
                            অনুমোদনের অপেক্ষায়
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 bg-[#0B5D3B] text-white font-bold text-[10px] rounded-lg shadow-md">
                        <CheckCircle size={11} />
                        <span>চলমান</span>
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                    <div className="space-y-2">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-md capitalize inline-block ${isPending ? "bg-amber-50 text-amber-700 border border-amber-100/50" : "bg-[#0B5D3B]/5 text-[#0B5D3B]"}`}
                      >
                        {course.courseCategoryType || "সাধারণ মডিউল"}
                      </span>

                      <h3
                        className={`text-base font-black text-slate-800 line-clamp-2 transition-colors leading-snug ${!isPending && "group-hover:text-[#0B5D3B]"}`}
                      >
                        {course.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <User
                        size={14}
                        className={
                          isPending ? "text-amber-600" : "text-[#0B5D3B]"
                        }
                      />
                      <span className="text-[11px] font-bold text-slate-600 truncate">
                        প্রশিক্ষক: {isPending ? "পেন্ডিং রয়েছে" : instructorName}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-neutral-50 text-slate-500 text-xs font-bold">
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} className="text-slate-400" />
                        <span>{course.duration || "নিয়মিত সেশন"}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <BookOpen size={14} className="text-slate-400" />
                        <span className="uppercase">
                          {course.courseType || "General"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50/50 border-t border-neutral-100 shrink-0">
                    {isPending ? (
                      <button
                        disabled
                        className="w-full py-3 bg-slate-300 text-slate-500 font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 cursor-not-allowed"
                      >
                        <Lock size={14} />
                        <span>ক্লাসরুম লকড রয়েছে</span>
                      </button>
                    ) : (
                      <Link
                        href={`/my-course/${courseId}`}
                        className="w-full py-3 bg-slate-950 hover:bg-[#0B5D3B] text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 group/btn"
                      >
                        <PlayCircle
                          size={15}
                          className="group-hover/btn:scale-110 transition-transform"
                        />
                        <span>ক্লাসরুমে প্রবেশ করুন</span>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] shadow-sm text-center max-w-sm mx-auto border border-neutral-100">
            <BookOpen className="text-slate-300 mb-2" size={32} />
            <h4 className="text-sm font-black text-slate-700">
              কোনো কোর্স পাওয়া যায়নি
            </h4>
          </div>
        )}
      </div>
    </div>
  );
}