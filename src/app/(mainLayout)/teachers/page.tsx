"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Briefcase,
  GraduationCap,
  IdCard,
  Search,
  Phone,
  BookOpen,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import axios from "axios";

interface TeacherData {
  _id: string;
  user: {
    name: string;
    profileImage: string;
    phone?: string;
  };
  department: {
    _id: string;
    name: string;
  };
  designation: string;
  qualifications: string;
  experience: string;
  teacherId: string;
}

export default function PublicTeachersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all approved public teachers matching state dependencies
  const {
    data: teachers = [],
    isLoading,
    isError,
  } = useQuery<TeacherData[]>({
    queryKey: ["publicTeachersList"],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/teachers`,
      );
      return response.data?.data || response.data || [];
    },
    staleTime: 1000 * 60 * 5,
  });

  // Client-side text matrix search filter
  const filteredTeachers = teachers.filter((teacher) => {
    const name = teacher.user?.name || "";
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 pt-20">
      {/* Premium Dark/Green Madrasa Theme Header */}
      <div className="bg-gradient-to-br from-[#0d4d2e] font-sans via-[#052214] to-black text-white p-6 pt-16 pb-28 rounded-b-[2.5rem] lg:rounded-b-[4rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-72 h-72 bg-[#0B5D3B]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-72 h-72 bg-black/40 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <h1 className="text-3xl lg:text-5xl font-black tracking-tight flex items-center gap-3">
              <GraduationCap className="text-emerald-400" size={38} />
              সম্মানিত উস্তাদমণ্ডলী
            </h1>
            <p className="text-slate-300 text-xs lg:text-sm mt-2 font-medium max-w-xl">
              দারুল ইসলামের অভিজ্ঞ ও দক্ষ আলেমদের পরিচিতি। আপনার পছন্দের
              উস্তাদের তত্ত্বাবধানে ইসলাম শিক্ষার পথ সুগম করুন।
            </p>
          </div>

          {/* Premium Glassmorphism Search input context controller */}
          <div className="relative w-full md:w-80 shrink-0">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="ওস্তাদজীর নাম দিয়ে খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-slate-400 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-inner"
            />
          </div>
        </div>
      </div>

      {/* Main Grid Render Boundaries */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="w-full max-w-sm h-96 bg-white rounded-3xl border border-slate-100 animate-pulse mx-auto"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-10 bg-red-50 text-red-600 rounded-[2rem] border border-red-100 text-xs font-bold flex items-center justify-center gap-2 max-w-md mx-auto shadow-sm">
            <AlertCircle size={16} />
            <span>
              শিক্ষকদের তালিকা লোড করতে সমস্যা হয়েছে! দয়া করে রিফ্রেশ দিন।
            </span>
          </div>
        ) : filteredTeachers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredTeachers.map((teacher, idx) => (
              <motion.div
                key={teacher._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="group w-full max-w-sm overflow-hidden rounded-[2rem] border border-slate-100 bg-white/90 shadow-xl shadow-slate-200/50 backdrop-blur transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 mx-auto flex flex-col justify-between"
              >
                <div>
                  {/* Top Vector Decorative Accent Bar */}
                  <div className="relative h-24 bg-gradient-to-r from-green-700 to-green-500" />

                  {/* Profile Image Node Layout */}
                  <div className="-mt-14 flex justify-center">
                    <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-white shadow-lg bg-slate-50">
                      <Image
                        src={teacher.user?.profileImage || "/hujur.webp"}
                        alt={teacher.user?.name || "Instructor"}
                        fill
                        sizes="112px"
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* Core Card Metas Content */}
                  <div className="px-6 pt-4 text-center space-y-1">
                    <h3 className="text-lg font-black text-slate-800 group-hover:text-green-700 transition-colors">
                      {teacher.user?.name}
                    </h3>
                    <p className="text-xs font-semibold text-slate-600 line-clamp-1 max-w-[90%] mx-auto">
                      {teacher.qualifications}
                    </p>
                  </div>

                  {/* Parameter Fields Structure Box */}
                  <div className="p-5 mx-5 my-4 space-y-3 rounded-2xl bg-slate-50 border border-slate-100 text-left">
                    <div className="flex items-start gap-3">
                      <IdCard
                        size={16}
                        className="mt-0.5 text-green-700 shrink-0"
                      />
                      <div>
                        <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">
                          শিক্ষক আইডি
                        </p>
                        <p className="text-xs font-bold mt-0.5">
                          {teacher.teacherId || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Briefcase
                        size={16}
                        className="mt-0.5 text-green-700 shrink-0"
                      />
                      <div>
                        <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">
                          অভিজ্ঞতা
                        </p>
                        <p className="text-xs font-bold mt-0.5">
                          {teacher.experience || "নিয়মিত সেশন"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <GraduationCap
                        size={16}
                        className="mt-0.5 text-green-700 shrink-0"
                      />
                      <div>
                        <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">
                          বিভাগ
                        </p>
                        <p className="text-xs font-bold mt-0.5">
                          {teacher.department?.name || "ইসলামী অনুষদ"}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-slate-200/60 pt-2.5 mt-1">
                      <p className="text-[10px] font-black text-green-800 uppercase tracking-wider">
                        Department of Darul Islam
                      </p>
                      <p className="text-xs font-medium mt-0.5">
                        দারুল ইসলাম {teacher.department?.name || "অনুষদ"}
                      </p>
                    </div>
                  </div>
                </div>

              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] shadow-sm text-center max-w-sm mx-auto border border-neutral-100">
            <BookOpen className="text-slate-300 mb-2" size={32} />
            <h4 className="text-sm font-black text-slate-700">
              কোনো ওস্তাদজীর তথ্য পাওয়া যায়নি
            </h4>
          </div>
        )}
      </div>
    </div>
  );
}