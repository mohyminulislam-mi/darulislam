"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BarChart3,
  Megaphone,
  Wallet,
  MessageCircle,
  Phone,
  XCircle,
  Bell,
  Video,
  Calendar,
  Clock,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  HelpCircle,
  Mail,
} from "lucide-react";

import useUser from "../../hooks/useUser";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "@/src/app/hooks/useAxiosSecure";
import EvaluationModal from "@/src/components/shared/ResultModal";
import LoadingSpinner from "@/src/components/shared/spinner/LoadingSpinner";
import Swal from "sweetalert2";

const StudentDashboard = () => {
  const axiosSecure = useAxiosSecure();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserError,
    error: userError,
  } = useUser();

  const stats = [
    {
      title: "কোর্সসমূহ",
      icon: <Wallet size={24} />,
      link: "/my-course",
    },
    {
      title: "পরীক্ষার ফলাফল",
      icon: <BarChart3 size={24} />,
      link: "#",
      isModalTrigger: true,
    },
    {
      title: "নোটিশ বোর্ড",
      icon: <Megaphone size={24} />,
      link: "/notice",
    },
    {
      title: "নীতিমালা",
      icon: <Calendar size={24} />,
      link: "/nitimala",
    },
  ];

  const {
    data: classLinksData,
    isLoading: isClassLoading,
    refetch: refetchClassLinks,
  } = useQuery({
    queryKey: ["studentLiveClassLinks"],
    queryFn: async () => {
      const res = await axiosSecure.get("/class-links/student/my-links");
      return res.data;
    },
    enabled: !!user,
  });

  console.log(classLinksData);

  const classLinks = classLinksData?.data || [];

  const userName = user?.name || "ইউজার নাম পাওয়া যায়নি";
  const userAvatar =
    user?.profileImage ||
    `https://res.cloudinary.com/nqjmvyvo/image/upload/v1784024476/user_gowj6w.png`;

  const userSubtitle = user?.profile?.department?.name
    ? `${user?.profile?.department?.name} ${user?.profile?.classLevel ? `- ${user?.profile?.classLevel}` : ""}`
    : "সাধারণ বিভাগ";

  if (isUserLoading) {
    return (
      <div className="min-h-[calc(100vh-200px)] w-full flex items-center justify-center bg-[#F4F7F5]">
        <LoadingSpinner />
      </div>
    );
  }

  if (isUserError) {
    return (
      <div className="h-screen w-full flex items-center justify-center text-red-500 text-sm font-bold bg-[#F4F7F5]">
        ডাটা লোড করতে সমস্যা হয়েছে: {userError?.message || "সার্ভার এরর"}
      </div>
    );
  }

  const activeInstructor = classLinks[0]?.instructor || {
    name: "দারুল ইসলাম ইনস্টিটিউট",
    profilePicture: "https://res.cloudinary.com/nqjmvyvo/image/upload/v1784024476/user_gowj6w.png",
  };

  // 🎯 ওল্ড ডাটাবেজ ক্র্যাশ প্রটেকশন সেফটি লক ভাই: যদি isApproved ফিল্ড ডিফাইন না থাকে, তবে সে ডিরেক্ট অনুমোদিত
  const isApproved = user?.profile?.isApproved !== false;
  const customStudentId = user?.profile?.studentId;

  return (
    <div className="min-h-screen bg-[#F4F7F5] pb-12 pt-16 lg:pt-18 font-sans">
      {/* 🟢 Header Section */}
      <div className="bg-[#0B5D3B] text-white p-6 pt-12 pb-24 rounded-b-[2.5rem] lg:rounded-b-[4.5rem] shadow-lg relative z-0">
        <div className="max-w-7xl mx-auto flex justify-between items-start gap-4">
          <div className="flex gap-4 items-center">
            <div>
              <p className="text-white/80 text-xs lg:text-sm italic">
                আসসালামু আলাইকুম,
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-x-3 gap-y-1.5 mt-0.5">
                <Link href="/update-profile" className="hover:underline block">
                  <h1 className="text-xl lg:text-3xl font-black tracking-tight">
                    {userName}
                  </h1>
                </Link>

                {/* 🎯 রিকোয়ারমেন্ট অনুযায়ী চমৎকার টাইপোগ্রাফি স্টাইলিশ ব্যাজ রেন্ডারিং */}
                {isApproved ? (
                  customStudentId && (
                    <div className="inline-block self-start sm:self-auto">
                      <span className="inline-flex items-center text-[10px] font-mono font-black bg-white/10 text-emerald-300 px-2.5 py-0.5 rounded-md border border-white/10 shadow-inner">
                        ID: {customStudentId}
                      </span>
                    </div>
                  )
                ) : (
                  <div className="inline-block self-start sm:self-auto">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-500 text-white px-2.5 py-0.5 rounded-md border border-amber-600/30 animate-pulse shadow-sm">
                      <XCircle size={10} /> প্রোফাইল স্ট্যাটাস (Pending)
                    </span>
                  </div>
                )}
              </div>
              <p className="text-white/60 text-[10px] lg:text-xs mt-1 italic">
                {userSubtitle}
              </p>
            </div>
          </div>

          {/* Profile Picture & Notification */}
          <div className="relative">
            <Link href="/update-profile" className="block group">
              <div className="relative w-16 h-16 lg:w-20 lg:h-20 rounded-2xl overflow-hidden shadow-md border-2 border-white/20 group-hover:border-white/60 transition-all duration-300">
                <Image
                  src={userAvatar}
                  alt="User Profile"
                  fill
                  priority
                  unoptimized
                  className="object-cover opacity-100 scale-105"
                />
              </div>
            </Link>
            <div className="absolute -top-1.5 -right-1.5 flex items-center justify-center bg-red-500 rounded-full w-5 h-5 shadow-sm">
              <Bell size={12} className="text-white" strokeWidth={2.5} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full flex items-center justify-center text-[9px] font-bold text-white border border-[#0B5D3B]">
                ৩
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 -mt-12 lg:-mt-16 relative z-10 space-y-5 lg:space-y-6">
        {/* ১. ক্লাস শিডিউল ব্যানার */}
        <div className="bg-white p-4 sm:p-6 lg:p-10 rounded-[1.5rem] lg:rounded-[2rem] shadow-xl border border-neutral-100">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6">
            <div className="space-y-1 lg:space-y-2">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <h3 className="font-black text-neutral-800 text-sm lg:text-xl italic">
                  Class Schedule
                </h3>
              </div>
              <p className="text-[11px] lg:text-xs text-neutral-400 font-medium leading-relaxed">
                শিক্ষকদের সেট করা লাইভ ক্লাসের লিংকগুলো এখানে দেখতে পাবেন।
              </p>
            </div>

            {/* Refresh and Date Buttons */}
            <div className="flex items-center gap-2 sm:gap-3 self-start lg:self-auto w-full lg:w-auto justify-between lg:justify-end">
              <button
                onClick={() => refetchClassLinks()}
                className="p-2 bg-neutral-50 hover:bg-neutral-100 rounded-xl border border-neutral-200 text-neutral-500 transition-colors"
                title="রিলোড ক্লাস লিঙ্ক"
              >
                <RefreshCw
                  size={13}
                  className={isClassLoading ? "animate-spin" : ""}
                />
              </button>
              <div className="bg-neutral-50 px-3 py-2 sm:px-5 sm:py-2.5 rounded-xl sm:rounded-2xl border border-neutral-100 flex items-center gap-2 sm:gap-3">
                <Calendar size={14} className="text-[#0B5D3B]" />
                <span className="text-[10px] lg:text-xs font-black text-neutral-600 whitespace-nowrap">
                  আজ:{" "}
                  {new Date().toLocaleDateString("bn-BD", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Dynamic Class Links Rendering */}
          <div className="mt-6 lg:mt-8">
            {isClassLoading ? (
              <div className="flex flex-col items-center justify-center py-10 bg-neutral-50/50 rounded-2xl border border-dashed border-neutral-200 gap-2">
                <LoadingSpinner />
              </div>
            ) : classLinks?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {classLinks.map((item: any) => (
                  <div
                    key={item._id}
                    className="p-3 sm:p-5 bg-emerald-50/40 rounded-xl sm:rounded-2xl border border-emerald-100 flex flex-col justify-between gap-3 group hover:shadow-md transition-all duration-300"
                  >
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex justify-between items-start gap-1">
                        <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-emerald-100 text-emerald-800 rounded-md sm:rounded-lg text-[9px] sm:text-[10px] font-bold truncate max-w-[75%] tracking-wider">
                          {item.course?.title ||
                            item.course?.name ||
                            "General Course"}
                        </span>
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-md sm:rounded-lg flex items-center justify-center text-emerald-700 shadow-sm shrink-0">
                          <Video size={13} className="sm:size-[16px]" />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm lg:text-base font-black text-neutral-800 group-hover:text-[#0B5D3B] transition-colors line-clamp-2">
                          {item.classTitle}
                        </h4>
                        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-x-3 gap-y-0.5 mt-1.5 text-neutral-500 font-medium text-[10px] sm:text-[11px]">
                          <span className="flex items-center gap-1">
                            <Calendar size={10} className="sm:size-[12px]" />
                            {item.classDate
                              ? new Date(item.classDate).toLocaleDateString(
                                  "bn-BD",
                                  { day: "numeric", month: "short" },
                                )
                              : "নির্ধারিত নয়"}
                          </span>
                          <span className="flex items-center gap-1 text-neutral-700 font-bold">
                            <Clock size={10} className="sm:size-[12px]" />
                            {item.startTime || "00:00"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2 sm:py-2.5 bg-[#0B5D3B] hover:bg-[#0c462a] text-white font-bold text-[10px] sm:text-xs rounded-lg sm:rounded-xl shadow-sm transition-all flex items-center justify-center gap-1 sm:gap-2 mt-1"
                    >
                      <span className="truncate">জয়েন করুন</span>
                      <ExternalLink
                        size={10}
                        className="sm:size-[12px] shrink-0"
                      />
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 bg-neutral-50 rounded-2xl border border-neutral-100 gap-2 text-center px-4">
                <AlertCircle className="text-neutral-300" size={24} />
                <p className="text-xs font-black text-neutral-500">
                  এই মুহূর্তে কোনো লাইভ ক্লাস শিডিউল সক্রিয় নেই।
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bento Grid Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          <div className="lg:col-span-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {stats.map((item, idx) => {
                if (item.isModalTrigger) {
                  return (
                    <div
                      key={idx}
                      onClick={() => setIsModalOpen(true)}
                      className="bg-white p-4 lg:p-8 rounded-[1.2rem] lg:rounded-[1.5rem] border border-neutral-100 shadow-sm flex flex-col items-center justify-center gap-2 sm:gap-3 hover:bg-[#0B5D3B] hover:text-white transition-all duration-300 cursor-pointer group"
                    >
                      <div className="p-2.5 sm:p-3 bg-[#F4F7F5] rounded-xl sm:rounded-2xl group-hover:bg-white/20 transition-colors text-[#0B5D3B]">
                        {React.cloneElement(item.icon, {
                          className:
                            "group-hover:text-white size-[16px] sm:size-[20px]",
                        })}
                      </div>
                      <span className="text-[11px] sm:text-xs lg:text-sm font-bold text-center leading-tight">
                        {item.title}
                      </span>
                    </div>
                  );
                }

                return (
                  <Link
                    href={item.link}
                    key={idx}
                    className="bg-white p-4 lg:p-8 rounded-[1.2rem] lg:rounded-[1.5rem] border border-neutral-100 shadow-sm flex flex-col items-center justify-center gap-2 sm:gap-3 hover:bg-[#0B5D3B] hover:text-white transition-all duration-300 cursor-pointer group"
                  >
                    <div className="p-2.5 sm:p-3 bg-[#F4F7F5] rounded-xl sm:rounded-2xl group-hover:bg-white/20 transition-colors text-[#0B5D3B]">
                      {React.cloneElement(item.icon, {
                        className:
                          "group-hover:text-white size-[16px] sm:size-[20px]",
                      })}
                    </div>
                    <span className="text-[11px] sm:text-xs lg:text-sm font-bold text-center leading-tight">
                      {item.title}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* ২. Bento Grid Content: শিক্ষক এবং সহায়তা প্যানেল */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 lg:gap-6">
          {/* শিক্ষক প্রোফাইল */}
          <div className="lg:col-span-6 bg-white p-3 sm:p-6 rounded-[1.5rem] lg:rounded-[2rem] shadow-sm border border-neutral-100 flex flex-col justify-between gap-3">
            <div>
              <h3 className="font-black text-neutral-400 text-[9px] sm:text-xs mb-3 italic uppercase tracking-wider">
                Mentor
              </h3>
              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-4 mb-2">
                <img
                  src={
                    activeInstructor.profilePicture ||
                    "https://avatars.githubusercontent.com/u/198446517?v=4"
                  }
                  className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-neutral-100 shadow-sm object-cover"
                  alt="Teacher"
                />
                <div className="min-w-0">
                  <h4 className="text-[11px] sm:text-sm font-black text-neutral-800 leading-tight truncate">
                    {activeInstructor.name}
                  </h4>
                  <p className="text-[8px] sm:text-[10px] text-neutral-400 font-bold uppercase mt-0.5">
                    সিনিয়র মেন্টর
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-1.5">
              <a
                href="tel:01792297764"
                className="w-full flex items-center justify-center gap-1 py-2 bg-neutral-50 rounded-lg text-neutral-600 text-[9px] sm:text-[10px] font-bold border border-neutral-100 hover:bg-neutral-100 transition-colors"
              >
                <Phone size={11} />{" "}
                <span className="hidden sm:inline">কল করুন</span>
              </a>
              <button
                onClick={() =>
                  window.open("https://wa.me/8801792297764", "_blank")
                }
                className="w-full flex items-center hover:cursor-pointer justify-center gap-1 py-2 bg-[#0B5D3B] text-white rounded-lg text-[9px] sm:text-[10px] font-bold shadow-sm active:scale-95 transition-all hover:bg-[#0c462a]"
              >
                <MessageCircle size={11} />
                <span>হোয়াটসঅ্যাপ</span>
              </button>
            </div>
          </div>

          {/* কুইক সাপোর্ট ও সাহায্য কেন্দ্র */}
          <div className="lg:col-span-6 bg-white p-4 sm:p-6 rounded-[1.5rem] lg:rounded-[2rem] shadow-sm border border-neutral-100 flex flex-col justify-between gap-4 font-sans">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-neutral-800">
                <HelpCircle size={20} className="text-[#0B5D3B]" />
                <h3 className="font-black text-xs sm:text-sm lg:text-base">
                  সাহায্য ও সাপোর্ট কেন্দ্র
                </h3>
              </div>
              <p className="text-[11px] text-neutral-400 font-medium leading-relaxed">
                ড্যাশবোর্ড, ফি প্রদান বা ক্লাস সংক্রান্ত যেকোনো সমস্যার জন্য
                সরবরাহকৃত হেল্পলাইনে কল করুন অথবা ইমেইল পাঠাতে পারেন।
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full">
              {/* কল বাটন */}
              <button
                onClick={() => {
                  const supportNumber = "+8801792297764";
                  Swal.fire({
                    title: "হেল্পলাইনে কল করুন",
                    text: "আপনি কি আমাদের অফিসিয়াল সাপোর্ট নাম্বারে কল করতে চান?",
                    icon: "question",
                    showCancelButton: true,
                    confirmButtonText: "হ্যাঁ, কল দিন",
                    cancelButtonText: "বাতিল",
                    confirmButtonColor: "#0B5D3B",
                    cancelButtonColor: "#d33",
                    customClass: { popup: "rounded-[2rem]" },
                  }).then((result) => {
                    if (result.isConfirmed)
                      window.location.href = `tel:${supportNumber}`;
                  });
                }}
                className="flex-1 py-2.5 bg-[#0B5D3B] hover:bg-[#0d4d2e] text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Phone size={14} /> কল করুন
              </button>

              {/* ইমেইল বাটন */}
              <button
                onClick={() => {
                  const supportEmail = "darulislaminstituteofficial@gmail.com";
                  Swal.fire({
                    title: "মেইল পাঠান",
                    text: "আপনার সমস্যাটি বিস্তারিত জানাতে মেইল ওপেন করতে চান?",
                    icon: "question",
                    showCancelButton: true,
                    confirmButtonText: "হ্যাঁ, মেইল করুন",
                    cancelButtonText: "বাতিল",
                    confirmButtonColor: "#0B5D3B",
                    cancelButtonColor: "#d33",
                    customClass: { popup: "rounded-[2rem]" },
                  }).then((result) => {
                    if (result.isConfirmed)
                      window.location.href = `mailto:${supportEmail}`;
                  });
                }}
                className="flex-1 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Mail size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <EvaluationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        submissionId=""
        token=""
      />
    </div>
  );
};

export default StudentDashboard;
