"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  User,
  Calendar,
  Mail,
  Phone,
  BookOpen,
  Users,
  Percent,
  FileText,
  ClipboardList,
  CheckSquare,
  GraduationCap,
  Bell,
  Folder,
  Scale,
  HelpCircle,
  CheckCircle,
  XCircle,
  ShieldAlert,
  IdCard,
} from "lucide-react";
import useAxiosSecure from "@/src/app/hooks/useAxiosSecure";
import Link from "next/link";

// 🎯 ১. মেগা প্রিমিয়াম লেআউট শিফট প্রটেকশন স্কেলিটন লোডার
const DashboardSkeleton = () => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-pulse">
      <div className="bg-white rounded-2xl p-6 border border-neutral-100 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-28 h-28 rounded-full bg-neutral-200" />
        <div className="flex-1 space-y-3 w-full">
          <div className="h-6 w-3/5 bg-neutral-200 rounded" />
          <div className="h-4 w-2/5 bg-neutral-200 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 border-t border-neutral-100">
            <div className="h-4 w-32 bg-neutral-200 rounded" />
            <div className="h-4 w-36 bg-neutral-200 rounded" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-xl border border-neutral-100 h-28"
          />
        ))}
      </div>
    </div>
  );
};

export default function Dashboard() {
  const axiosSecure = useAxiosSecure();
  const { data: session } = useSession();

  // 🎯 ২. তানস্ট্যাক কুয়েরি লাইভ সিঙ্ক
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["teacherDashboardOverviewStats"],
    queryFn: async () => {
      // আপনার রাউটার এন্ডপয়েন্ট অনুযায়ী ইউআরএল সিঙ্ক লক
      const res = await axiosSecure.get("/teachers/dashboard-stats");
      return res.data?.data;
    },
    staleTime: 60 * 1000 * 3, // ১ মিনিট ডেটা মেমোরি ক্যাশ লক
  });

  if (isLoading || !dashboardData) {
    return (
      <div className="min-h-screen bg-neutral-50/50 p-4 md:p-6 flex items-center justify-center">
        <DashboardSkeleton />
      </div>
    );
  }

  const { profile, stats } = dashboardData;

  // ডাইনামিক কুইক স্ট্যাটাস অ্যারে ম্যাপিং ল্যাঙ্গুয়েজ
  const statCards = [
    {
      label: "আজকের ক্লাস",
      value:
        stats.todayClasses < 10
          ? `${stats.todayClasses}`
          : stats.todayClasses.toString(),
      icon: Users,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "মোট শিক্ষার্থী",
      value: stats.totalStudents.toString(),
      icon: User,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "উপস্থিতির হার",
      value: stats.attendanceRate || "৯৫%",
      icon: Percent,
      color: "text-orange-600 bg-orange-50",
    },
    {
      label: "চলমান কোর্স",
      value:
        stats.totalCourses < 10
          ? `০${stats.totalCourses}`
          : stats.totalCourses.toString(),
      icon: BookOpen,
      color: "text-purple-600 bg-purple-50",
    },
    {
      label: "বেতন স্ট্যাটাস",
      value: "আসন্ন",
      icon: FileText,
      color: "text-teal-600 bg-teal-50",
      colSpan: "col-span-2 sm:col-span-4 md:col-span-1",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 text-gray-800 antialiased selection:bg-emerald-100">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* --- Profile Section --- */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] border border-gray-100 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center gap-6 mt-2">
            {/* Profile Image & Status */}
            <div className="flex flex-col items-center space-y-3">
              <div className="relative w-28 h-28 rounded-full border-4 border-gray-100 shadow-inner bg-gray-50 overflow-hidden flex items-center justify-center">
                {profile.profileImage ? (
                  <img
                    src={profile.profileImage}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-gray-300" />
                )}
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                অনলাইনে আছেন
              </span>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center sm:text-left space-y-3">
              <div>
                <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
                  {profile.teacherNameBn || profile.name}
                </h1>
                <p className="text-emerald-700 font-bold text-xs md:text-sm mt-0.5 uppercase tracking-wide">
                  {profile.departmentName} — {profile.designation}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs md:text-sm text-gray-600 pt-3 border-t border-gray-100 font-bold">
                <div className="flex items-center justify-center sm:justify-start gap-2.5">
                  <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span>
                    <span className="text-gray-400 font-medium">মোবাইল:</span>{" "}
                    {profile.phone}
                  </span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2.5">
                  <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span>
                    <span className="text-gray-400 font-medium">
                      নিবন্ধন তারিখ:
                    </span>{" "}
                    {new Date(profile.createdAt).toLocaleDateString("bn-BD", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2.5 sm:col-span-1 break-all">
                  <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span>
                    <span className="text-gray-400 font-medium">
                      অফিসিয়াল ইমেইল:
                    </span>{" "}
                    {profile.email}
                  </span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2.5">
                  <IdCard className="w-4 h-4 text-gray-400 flex-shrink-0" />

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-gray-400 font-medium">
                      টিচার আইডি:
                    </span>{" "}
                    {profile?.teacherId &&
                    profile.teacherId !== "রিভিউাধীন (Pending)" &&
                    profile.teacherId !== "ID জেনারেট হচ্ছে..." ? (
                      <span className="text-[11px] md:text-xs font-mono font-black text-[#0B5D3B] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                        {profile.teacherId}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 animate-pulse">
                        ⏳ অনুমোদন পেন্ডিং আছে
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Quick Stats Grid --- */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {statCards.map((stat, idx) => (
            <div
              key={idx}
              className={`bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center justify-center transition-all hover:shadow-md ${stat.colSpan || ""}`}
            >
              <div className={`p-2.5 rounded-xl ${stat.color} mb-2`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
                {stat.value}
              </span>
              <span className="text-xs text-gray-400 font-bold mt-1">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* --- Main Menu / মূল মেনু (Group Hover ইন্টিগ্রেটেড ভাই) --- */}
        <div>
          <h2 className="text-base md:text-lg font-black text-gray-900 mb-3.5 px-1 tracking-tight">
            মূল মেনু প্যানেল
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                title: "আমার ক্লাসসমূহ",
                icon: BookOpen,
                href: "/dashboard/teacher/my-course", // 🎯 আপনার তৈরি করা কোর্স পেজের পাথ
              },
              {
                title: "সিলেবাস ও পাঠ পরিকল্পনা",
                icon: ClipboardList,
                href: "/dashboard/teacher",
              },
              {
                title: "উপস্থিতি ব্যবস্থাপনা",
                icon: CheckSquare,
                href: "/dashboard/teacher/class-link",
              },
              {
                title: "পরীক্ষা ও ফলাফল",
                icon: GraduationCap,
                href: "/dashboard/teacher/assignment",
              },
              {
                title: "নোটিশ বোর্ড",
                icon: Bell,
                href: "/dashboard/teacher/notice-board",
              },
              {
                title: "ফাইল ও ডকুমেন্টস",
                icon: Folder,
                href: "/dashboard/teacher",
              },
              {
                title: "নীতিমালা ও আইন",
                icon: Scale,
                href: "/dashboard/teacher",
              },
              {
                title: "সাহায্য ও সাপোর্ট",
                icon: HelpCircle,
                href: "/dashboard/teacher",
              },
            ].map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md hover:border-emerald-200 transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
              >
                {/* 🎯 group-hover ক্লাসের মাধ্যমে আইকন অ্যানিমেশন */}
                <div className="p-3 rounded-xl bg-gray-50 text-gray-500 group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-all duration-300 mb-3 transform group-hover:scale-105">
                  <item.icon className="w-5 h-5 md:w-6 md:h-6" />
                </div>

                {/* টেক্সট কালার ট্র্যানজিশন */}
                <span className="text-xs font-black text-gray-700 group-hover:text-emerald-900 transition-colors px-1 line-clamp-2 leading-tight">
                  {item.title}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* --- Rules & Guidelines Section --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* করণীয় (Do's) */}
          <div className="bg-white rounded-2xl border border-emerald-100 shadow-xs flex flex-col justify-between overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="font-black text-xs md:text-sm text-emerald-800 uppercase tracking-wide">
                  করণীয় গাইডলাইন
                </h3>
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              </div>
              <ul className="mt-3 space-y-2 text-xs font-bold text-neutral-600">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500">●</span> সময়মতো ক্লাস নেওয়া
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500">●</span> শিক্ষার্থীদের সাথে
                  উত্তম আচরণ
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500">●</span> সিলেবাস ও মডিউল
                  অনুসরণ
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500">●</span> লাইভ ক্লাস লিঙ্ক
                  জেনারেট
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500">●</span> অভিভাবকদের সাথে
                  দ্বীনি সংযোগ
                </li>
              </ul>
            </div>
            <div className="p-3 bg-emerald-50/30 border-t border-emerald-50 text-center">
              <button className="text-xs font-black text-emerald-700 hover:text-emerald-900 transition cursor-pointer">
                বিস্তারিত দেখুন
              </button>
            </div>
          </div>

          {/* নিষেধ (Don'ts) */}
          <div className="bg-white rounded-2xl border border-rose-100 shadow-xs flex flex-col justify-between overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="font-black text-xs md:text-sm text-rose-800 uppercase tracking-wide">
                  সতর্কতা ও নিষেধ
                </h3>
                <XCircle className="w-4 h-4 text-rose-500" />
              </div>
              <ul className="mt-3 space-y-2 text-xs font-bold text-neutral-600">
                <li className="flex items-start gap-2">
                  <span className="text-rose-400">●</span> শিক্ষার্থীদের সাথে
                  কঠোর আচরণ
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400">●</span> পূর্বানুমতি ছাড়া
                  ক্লাস মিস দেওয়া
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400">●</span> মডিউলের বাইরে
                  অপ্রাসঙ্গিক আলাপ
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400">●</span> ব্যক্তিগত বাণিজ্যিক
                  প্রচারণা
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400">●</span> দ্বীনি প্রতিষ্ঠানের
                  গোপনীয়তা ক্ষুণ্ন
                </li>
              </ul>
            </div>
            <div className="p-3 bg-rose-50/30 border-t border-rose-50 text-center">
              <button className="text-xs font-black text-rose-700 hover:text-rose-900 transition cursor-pointer">
                বিস্তারিত দেখুন
              </button>
            </div>
          </div>

          {/* আইন ও বিধিমালা (Rules) */}
          <div className="bg-white rounded-2xl border border-blue-100 shadow-xs flex flex-col justify-between overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="font-black text-xs md:text-sm text-blue-800 uppercase tracking-wide">
                  আইন ও বিধিমালা
                </h3>
                <ShieldAlert className="w-4 h-4 text-blue-500" />
              </div>
              <ul className="mt-3 space-y-2 text-xs font-bold text-neutral-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">●</span> শিক্ষক শরিয়াহ
                  আচরণবিধি
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">●</span> ইমার্জেন্সি ছুটির
                  আইনি নিয়ম
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">●</span> মডারেশন ও জিম্মাদারি
                  পলিসি
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">●</span> ছাত্র অভিযোগ প্রতিকার
                  নীতি
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">●</span> তথ্য ও ইন্টেলেকচুয়াল
                  প্রটেকশন
                </li>
              </ul>
            </div>
            <div className="p-3 bg-blue-50/30 border-t border-blue-50 text-center">
              <button className="text-xs font-black text-blue-700 hover:text-blue-900 transition cursor-pointer">
                বিস্তারিত দেখুন
              </button>
            </div>
          </div>
        </div>

        {/* --- Hadith Quote Section --- */}
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 text-white rounded-3xl p-5 md:p-6 shadow-md relative overflow-hidden flex flex-col justify-between min-h-[140px]">
          <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent hidden sm:block" />
          <div className="relative z-10 space-y-3">
            <span className="text-emerald-300 font-bold text-xs tracking-wide uppercase bg-emerald-900/50 px-2.5 py-1 rounded-md border border-emerald-700/50 inline-block">
              আজকের হাদিস
            </span>
            <div className="space-y-2">
              <p
                className="text-right font-serif text-lg md:text-xl text-emerald-100 tracking-wide dir-rtl"
                dir="rtl"
              >
                إِنَّمَا بُعِثْتُ لِأُتَمِّمَ مَكَارِمَ الْأَخْلَاقِ
              </p>
              <p className="text-xs md:text-sm font-medium leading-relaxed text-gray-200">
                “আমি উত্তম চরিত্র পূর্ণ করার জন্য প্রেরিত হয়েছি।”
                <span className="text-emerald-300 block sm:inline sm:ml-2 font-normal text-[11px]">
                  (সহীহ বুখারী: ৬১১৫)
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
