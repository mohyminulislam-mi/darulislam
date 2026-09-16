"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link"; // 🎯 ক্লায়েন্ট-সাইড রাউটিংয়ের জন্য ইমপোর্ট করা হলো
import { ArrowUpRight } from "lucide-react"; // 🎯 বাটনে প্রফেশনাল লুক দেওয়ার জন্য আইকন
import { MessageSquare } from "lucide-react";

interface Testimonial {
  _id: string;
  user: {
    _id: string;
    name: string;
  };
  text: string;
  rating: number;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

const StarIcon = ({ active }: { active: boolean }) => (
  <svg
    className={`w-3.5 h-3.5 ${active ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`}
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/testimonials`,
        );
        if (!res.ok) throw new Error("Failed to fetch data");
        const result = await res.json();

        const data = Array.isArray(result) ? result : result.data || [];

        const approvedData = data.filter(
          (item: Testimonial) => item.isApproved === true,
        );
        setTestimonials(approvedData);
      } catch (err: any) {
        console.error("Error fetching testimonials:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  if (loading) {
    return (
      <div className="bg-white py-16 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mx-auto"></div>
        <p className="text-slate-500 mt-4 font-medium">
          শিক্ষার্থীদের মতামত লোড হচ্ছে...
        </p>
      </div>
    );
  }

  if (error || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8 antialiased text-slate-800">
      <div className="max-w-6xl mx-auto">
        {/* সেকশন হেডার */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-black text-[#0f2942] tracking-tight mb-2">
            আমাদের <span className="text-[#0B5D3B]">শিক্ষার্থীরা</span> যা বলছেন
          </h2>
          <div className="w-16 h-1 bg-[#0B5D3B] mx-auto rounded-full mt-3"></div>
        </div>

        {/* গ্রিড লেআউট */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {testimonials.map((item) => {
            const studentName = item.user?.name || "অজানা শিক্ষার্থী";
            const initialLetter = studentName.trim().charAt(0).toUpperCase();

            return (
              <div
                key={item._id}
                className="bg-[#fcfdfd] border border-slate-100/80 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full group relative overflow-hidden"
              >
                {/* হোভার এফেক্ট টপ line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 to-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div>
                  {/* স্টার্স রেটিং সেকশন */}
                  <div className="flex gap-0.5 mb-4 relative z-10">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon key={i} active={i < item.rating} />
                    ))}
                  </div>

                  {/* শিক্ষার্থীদের মতামত (item.text) */}
                  <div className="relative mb-6">
                    <span className="text-4xl text-slate-200/70 font-serif absolute -top-4 -left-2 select-none pointer-events-none group-hover:text-emerald-100 transition-colors">
                      “
                    </span>
                    <p className="text-slate-600 text-sm md:text-[14px] leading-relaxed text-justify relative z-10 pl-3 italic">
                      {item.text}
                    </p>
                  </div>
                </div>

                {/* ইউজার প্রোফাইল সেকশন (item.user.name) */}
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100 mt-auto">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-500 flex items-center justify-center text-white font-black text-sm ring-4 ring-emerald-50 shrink-0">
                    {initialLetter}
                  </div>

                  <div className="leading-tight">
                    <h4 className="text-sm font-bold text-[#0f2942] tracking-wide">
                      {studentName}
                    </h4>
                    <span className="text-[10px] text-emerald-700 font-bold tracking-wider block mt-0.5 uppercase">
                      Verified Reviewer
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* --- 🎯 নতুন আপডেট: প্রফেশনাল ও স্লিক "আরও দেখুন" বাটন প্যানেল --- */}
        <div className="text-center mt-12">
          <Link
            href="/testimonials"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-white border-2 border-green-800 hover:border-[#0B5D3B] text-[#0B5D3B] rounded-2xl text-sm font-black tracking-tight shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_25px_rgba(11,93,59,0.06)] hover:bg-[#0B5D3B] hover:text-white transition-all duration-300 transform active:scale-98 group cursor-pointer"
          >
            সকল মতামত দেখুন
            <MessageSquare
              size={16}
              className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}