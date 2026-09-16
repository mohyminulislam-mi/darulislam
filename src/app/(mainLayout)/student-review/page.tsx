"use client";
import React, { useState } from "react";
import { MessageSquare, Star, Send, Sparkles } from "lucide-react";
import Swal from "sweetalert2";
import useAxiosSecure from "@/src/app/hooks/useAxiosSecure";

const TestimonialStudent: React.FC = () => {
  const axiosSecure = useAxiosSecure();

  // ফর্ম ইনপুট ও সাবমিট স্টেট
  const [text, setText] = useState<string>("");
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);

  // ➕ নতুন রিভিউ সাবমিট করা (POST - raw JSON)
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      Swal.fire({
        icon: "warning",
        title: "খালি রিভিউ!",
        text: "অনুগ্রহ করে আপনার মতামতটি লিখুন।",
        confirmButtonColor: "#0B5D3B",
      });
      return;
    }

    setSubmitLoading(true);
    try {
      const res = await axiosSecure.post("/testimonials", {
        text: text,
        rating: rating,
      });

      if (res.status === 200 || res.status === 201) {
        Swal.fire({
          icon: "success",
          title: "রিভিউ সাবমিট হয়েছে!",
          text: "আপনার মতামতটি সফলভাবে জমা হয়েছে। অ্যাডমিন অ্যাপ্রুভ করার পর এটি ল্যান্ডিং পেজে শো করবে।",
          confirmButtonColor: "#0B5D3B",
        });

        // ফর্ম ক্লিয়ার করা
        setText("");
        setRating(5);
      }
    } catch (err: any) {
      console.error("Submission error:", err);
      Swal.fire({
        icon: "error",
        title: "সাবমিট করা যায়নি!",
        text:
          err.response?.data?.message ||
          "রিভিউ জমা দিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
        confirmButtonColor: "#d33",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50/50 px-4 pb-12 pt-24 md:pt-28 flex flex-col items-center justify-center relative overflow-hidden">
      {/* 🔮 ব্যাকগ্রাউন্ড গ্লো ইফেক্ট (প্রিমিয়াম ডিজাইনের জন্য) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-emerald-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-xl mx-auto">
        {/* ✨ পেজ হেডার সেকশন */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-[10px] md:text-xs font-black text-[#0B5D3B] mb-3 uppercase tracking-wider animate-pulse">
            Student Feedback Panel
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight flex items-center justify-center gap-2">
            আপনার <span className="text-[#0B5D3B]">মূল্যবান রিভিউ</span> দিন
          </h1>
          <p className="text-xs text-gray-500 mt-2 max-w-sm mx-auto font-medium leading-relaxed">
            মাদরাসা বা কোর্সের কারিকুলাম ও ওস্তাদদের ক্লাস নিয়ে আপনার চমৎকার
            অভিজ্ঞতাটি সবার সাথে শেয়ার করুন।
          </p>
        </div>

        {/* 📥 গ্লাস-মর্ফিজম টাচ রিভিউ সাবমিশন ফর্ম */}
        <div className="bg-white/80 backdrop-blur-md p-6 md:p-8 rounded-[2rem] border border-gray-200/60 shadow-xl shadow-gray-200/40 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-900/5">
          <form onSubmit={handleSubmitReview} className="space-y-6">
            {/* ⭐ ডাইনামিক ইন্টারক্টিভ স্টার রেটিং গ্রাফিক্স */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-gray-700 uppercase tracking-wide">
                কোর্স বা মাদরাসা রেটিং
              </label>
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200/70 p-3.5 rounded-2xl w-full justify-center sm:justify-start transition-all">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-transform active:scale-90 hover:scale-110 focus:outline-hidden"
                    >
                      <Star
                        className={`w-7 md:w-8 h-7 md:h-8 transition-all duration-150 ${
                          star <= (hoverRating || rating)
                            ? "text-amber-400 fill-amber-400 drop-shadow-[0_2px_4px_rgba(251,191,36,0.2)]"
                            : "text-gray-200"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <div className="h-5 w-[1px] bg-gray-200 mx-2 hidden sm:block" />
                <span className="text-xs font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-100">
                  {rating === 5 ? "৫ স্টার (অসাধারণ)" : `${rating} স্টার`}
                </span>
              </div>
            </div>

            {/* 💬 মতামত টেক্সট এরিয়া */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-gray-700 uppercase tracking-wide">
                আপনার বিস্তারিত মতামত
              </label>
              <div className="relative">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="যেমন: আলহামদুলিল্লাহ, অনলাইন কিতাব বিভাগের ওস্তাদদের বোঝানোর স্টাইল এবং মাদরাসার কারিকুলামটি খুবই চমৎকার ও গোছানো..."
                  rows={6}
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-xs md:text-sm focus:outline-hidden focus:border-[#0B5D3B] focus:bg-white font-medium transition-all duration-300 resize-none leading-relaxed shadow-inner"
                  required
                />
                <div className="absolute bottom-3 right-4 text-[10px] font-bold text-gray-400 pointer-events-none">
                  {text.length} characters
                </div>
              </div>
            </div>

            {/* 🚀 সাবমিট বাটন */}
            <button
              type="submit"
              disabled={submitLoading}
              className="w-full py-4 bg-[#0B5D3B] text-white font-black rounded-2xl text-xs md:text-sm uppercase tracking-wider shadow-lg shadow-emerald-900/20 hover:bg-[#0c462a] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 group"
            >
              {submitLoading ? (
                "সাবমিট হচ্ছে..."
              ) : (
                <>
                  রিভিউ সাবমিট করুন
                  <Send className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TestimonialStudent;
