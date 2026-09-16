"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Star,
  Users,
  GraduationCap,
  Award,
  Quote,
  MessageSquare,
} from "lucide-react";
import useAxiosSecure from "@/src/app/hooks/useAxiosSecure";

// --- ১️⃣ প্রিমিয়াম লেআউট শিফট প্রোটেকশন স্কেলিটন কম্পোনেন্ট ---
const TestimonialSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white rounded-[2rem] p-6 border border-neutral-100 flex flex-col justify-between h-64"
        >
          <div className="space-y-3">
            <div className="w-12 h-8 bg-neutral-200 rounded-lg" />
            <div className="h-4 w-full bg-neutral-200 rounded" />
            <div className="h-4 w-5/6 bg-neutral-200 rounded" />
          </div>
          <div className="flex items-center gap-3 pt-4 border-t border-neutral-50">
            <div className="w-12 h-12 bg-neutral-200 rounded-full" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-32 bg-neutral-200 rounded" />
              <div className="h-3 w-20 bg-neutral-200 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// --- ২️⃣ মতামত আইটেম ইন্টারফেস ডেফিনিশন ---
interface ITestimonial {
  _id: string;
  text: string;
  rating: number;
  userType: "student" | "teacher" | "female_teacher" | "parent";
  identityImage?: string;
  reviewerName: string;
}

export default function TestimonialsPage() {
  const axiosSecure = useAxiosSecure();

  // 🎯 ফিল্টারিং স্টেট লক (ডিফল্ট খালি মানে 'সকল মতামত')
  const [activeTab, setActiveTab] = useState<string>("");

  // 🎯 ট্যাপ কনফিগারেশন লিস্টিং (ক্লায়েন্টের স্ক্রিনশট ও রিকোয়ারমেন্ট এলাইনড)
  const filterTabs = [
    { label: "সকল মতামত", value: "" },
    { label: "ওস্তাদবৃন্দ", value: "teacher" },
    { label: "ওস্তাদাগণ", value: "female_teacher" },
    { label: "ছাত্র-ছাত্রী", value: "student" },
    { label: "অভিভাবকবৃন্দ", value: "parent" },
  ];

  // 🎯 ট্যানস্ট্যাক কুয়েরি ডাটা ফেচিং পাইপলাইন
  const { data: testimonials = [], isLoading } = useQuery<ITestimonial[]>({
    queryKey: ["publicTestimonialsList", activeTab],
    queryFn: async () => {
      const url = activeTab
        ? `/testimonials?userType=${activeTab}`
        : "/testimonials";
      const res = await axiosSecure.get(url);
      return res.data?.data || res.data || [];
    },
    staleTime: 1000 * 60 * 5, // ৫ মিনিট ক্লায়েন্ট মেমোরি ক্যাশ লক
  });

  // নাম থেকে আদ্যক্ষর (Initials) বের করার সেফ মেথড
  const getInitials = (name: string) => {
    if (!name) return "ইউ";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 1);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 px-4 sm:px-6 lg:px-8 selection:bg-emerald-100 antialiased mt-20">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* --- ৩️⃣ হেডার ও ব্যানার সেকশন (দারুল ইসলাম ব্র্যান্ড এলাইনমেন্ট) --- */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-[#0B5D3B] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 inline-flex items-center gap-1.5">
            <MessageSquare size={12} /> আমাদের অভিজ্ঞতা ও অনুভূতি
          </span>
          <h1 className="text-2xl md:text-4xl font-black text-neutral-900 tracking-tight leading-none">
            ইলমি সফরের প্রাণবন্ত অনুভূতি
          </h1>
          <p className="text-sm md:text-base text-neutral-500 font-medium leading-relaxed">
            আমাদের শিক্ষক, শিক্ষার্থী ও অভিভাবকদের মুখ থেকে শুনুন দারুল ইসলাম
            ইনস্টিটিউটের সাথে তাদের পথচলা ও অর্জনের গল্প।
          </p>
        </div>

        {/* --- ৪️⃣ ডাইনামিক ফিল্টার ট্যাব বার (১ম স্ক্রিনশট এলাইনড স্লিক মেকানিজম) --- */}
        <div className="flex flex-wrap items-center justify-center gap-2 border-b border-neutral-100 pb-2">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-5 py-2.5 rounded-xl text-xs md:text-sm font-black transition-all cursor-pointer duration-200 select-none ${
                activeTab === tab.value
                  ? "bg-[#0B5D3B] text-white shadow-sm border border-[#0B5D3B]"
                  : "bg-white text-neutral-900 border border-neutral-200/70 hover:bg-neutral-50 hover:text-neutral-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* --- ৫️⃣ রেন্ডারিং লেয়ার (ডাটা নাকি স্কেলিটন) --- */}
        {isLoading ? (
          <TestimonialSkeleton />
        ) : testimonials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((item, idx) => (
              <div
                key={item._id || idx}
                className="bg-white rounded-[2rem] border border-neutral-100 shadow-[0_4px_25px_rgba(11,93,59,0.015)] p-6 md:p-8 flex flex-col justify-between relative group hover:shadow-[0_15px_35px_rgba(11,93,59,0.04)] hover:border-emerald-100/70 transition-all duration-300 min-h-[240px] font-sans"
              >
                {/* আলংকারিক প্রফেশনাল ব্যাকগ্রাউন্ড কোট আইকন */}
                <Quote className="absolute right-6 top-6 w-12 h-12 text-neutral-50 opacity-80 group-hover:text-emerald-50/50 transition-colors pointer-events-none" />

                {/* মতামত টেক্সট ও স্টার রেটিং ব্লক */}
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, sIdx) => (
                      <Star
                        key={sIdx}
                        size={14}
                        className={
                          sIdx < (item.rating || 5)
                            ? "text-amber-500 fill-amber-500"
                            : "text-neutral-200"
                        }
                      />
                    ))}
                  </div>
                  <p className="text-xs md:text-sm font-bold leading-relaxed line-clamp-4">
                    {item.text}
                  </p>
                </div>

                {/* সাবমিটকারীর প্রোফাইল ও পরিচিতি স্ট্রাকচার */}
                <div className="pt-4 border-t border-neutral-50 flex items-center justify-between gap-4 mt-6">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-full border-2 border-emerald-50 relative overflow-hidden bg-neutral-50 shadow-3xs shrink-0 flex items-center justify-center">
                      {item.identityImage || item.identityImage ? (
                        <img
                          src={item.identityImage || item.identityImage}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-emerald-50/40 text-[#0B5D3B] font-black text-sm">
                          {getInitials(item.reviewerName || "ইউ")}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-black text-neutral-800 truncate">
                        {item.reviewerName || "সম্মানিত সুধী"}
                      </h4>
                      <p className="text-[10px] font-black text-[#0B5D3B] uppercase tracking-wider mt-0.5">
                        {item.userType === "teacher" && "শিক্ষক (ওস্তাদ)"}
                        {item.userType === "female_teacher" &&
                          "শিক্ষিকা (ওস্তাদা)"}
                        {item.userType === "student" && "শিক্ষার্থী"}
                        {item.userType === "parent" && "অভিভাবক"}
                      </p>
                    </div>
                  </div>

                  {/* ক্যাটাগরি ভিত্তিক ছোট আলংকারিক সাইড আইকন */}
                  <div className="text-neutral-300 shrink-0">
                    {item.userType === "teacher" && (
                      <Award size={18} className="text-emerald-700/30" />
                    )}
                    {item.userType === "female_teacher" && (
                      <Award size={18} className="text-teal-600/30" />
                    )}
                    {item.userType === "student" && (
                      <GraduationCap size={18} className="text-blue-600/30" />
                    )}
                    {item.userType === "parent" && (
                      <Users size={18} className="text-amber-600/30" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ডাটা না থাকলে ক্লিন এম্পটি স্টেট */
          <div className="bg-white border border-neutral-100 rounded-[2.5rem] p-12 text-center max-w-sm mx-auto shadow-3xs">
            <div className="bg-neutral-50 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 text-neutral-300 border border-neutral-50">
              <MessageSquare size={20} />
            </div>
            <h3 className="text-sm font-black text-neutral-800">
              কোনো মতামত পাওয়া যায়নি
            </h3>
            <p className="text-neutral-400 text-[11px] font-medium mt-1">
              এই ক্যাটাগরিতে এই মুহূর্তে কোনো অনুমোদিত মতামত ডাটাবেজে রেকর্ড
              নেই।
            </p>
          </div>
        )}
      </div>
    </div>
  );
}