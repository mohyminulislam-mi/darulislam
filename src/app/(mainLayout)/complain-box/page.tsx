"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  MessageSquareText,
  Send,
  CheckCircle2,
  User,
  Phone,
  FileText,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import useAxiosSecure from "../../hooks/useAxiosSecure";

interface ComplainFormValues {
  name: string;
  phone: string;
  complainType: string;
  subject: string;
  description: string;
}

export default function ComplainBoxPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const axiosSecure = useAxiosSecure();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ComplainFormValues>();

  const onSubmit = async (data: ComplainFormValues) => {
    setSubmitError("");
    try {
      const res = await axiosSecure.post("/complains", data);
      if (res.data?.success) {
        setIsSubmitted(true);
        reset();
      }
    } catch (error: any) {
      console.error("অভিযোগ পাঠাতে সমস্যা হয়েছে:", error);
      setSubmitError(
        error?.response?.data?.message ||
          "বার্তা পাঠাতে ব্যর্থ হয়েছে! পুনরায় চেষ্টা করুন।",
      );
    }
  };

  return (
    <section className="flex flex-col min-h-screen bg-[#F7FBF7] max-w-11/12 mx-auto">
      {/* Hero Section */}
      <div className="relative h-48 lg:h-64 bg-[#0B3D2E] flex items-end p-6 lg:p-12 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] bg-repeat" />
        <div className="relative z-10 w-full max-w-screen-xl mx-auto flex items-center gap-4">
          <div className="w-16 h-16 bg-[#8FE3A9] rounded-2xl flex items-center justify-center text-[#0B3D2E] shadow-lg">
            <MessageSquareText size={36} />
          </div>
          <div>
            <h1 className="text-2xl lg:text-4xl font-black">
              অভিযোগ ও পরামর্শ বক্স
            </h1>
            <p className="text-sm font-bold text-[#F5EFE1]/80 uppercase tracking-widest mt-1">
              আপনার মতামত, অভিযোগ বা পরামর্শ আমাদের জানান
            </p>
          </div>
        </div>
      </div>

      {/* মেইন কন্টেন্ট এরিয়া */}
      <div className="max-w-screen-xl mx-auto w-full px-4 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* বাম পাশের নির্দেশনাবলী ও তথ্য */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-[#0B3D2E]/5 shadow-xl space-y-4">
            <h3 className="text-xl font-black text-[#0B3D2E]">
              গোপনীয়তার নিশ্চয়তা
            </h3>
            <p className="text-[#0B3D2E]/70 text-sm leading-relaxed font-medium">
              আপনার দেওয়া যেকোনো তথ্য সম্পূর্ণ গোপন রাখা হবে। মাদরাসার শিক্ষার
              পরিবেশ উন্নত করতে এবং যেকোনো সমস্যা সমাধানে আপনার মূল্যবান মতামত
              সরাসরি আমাদের অ্যাডমিন প্যানেলে পৌঁছে যাবে।
            </p>

            <div className="pt-4 border-t border-dashed border-[#0B3D2E]/10 space-y-3">
              <div className="flex items-start gap-3 text-xs text-[#0B3D2E]/80 font-bold">
                <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span>অভিযোগের সত্যতা নিশ্চিত হয়ে সাবমিট করুন।</span>
              </div>
              <div className="flex items-start gap-3 text-xs text-[#0B3D2E]/80 font-bold">
                <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span>
                  জরুরি প্রয়োজনে আমরা আপনার মোবাইল নম্বরে যোগাযোগ করতে পারি।
                </span>
              </div>
            </div>
          </div>

          {/* জরুরি সহায়তা কার্ড */}
          <div className="bg-[#0B3D2E] p-8 rounded-[2.5rem] text-white space-y-2 text-center shadow-lg">
            <p className="opacity-70 text-xs font-bold uppercase tracking-wider">
              জরুরি যেকোনো জিজ্ঞাসায়
            </p>
            <h4 className="text-lg font-black">সরাসরি অফিস নাম্বারে কল করুন</h4>
            <p className="text-2xl font-black text-[#8FE3A9] pt-2">
              ০১৭৯২২৯৭৭৬৪
            </p>
          </div>
        </div>

        {/* ডান পাশের কমপ্লেইন ফর্ম */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[3rem] shadow-xl border border-[#0B3D2E]/5 p-6 md:p-10">
            {isSubmitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm border border-emerald-100">
                  <CheckCircle2 size={48} />
                </div>
                <h2 className="text-2xl font-black text-[#0B3D2E]">
                  আপনার বার্তা সফলভাবে গৃহীত হয়েছে!
                </h2>
                <p className="text-[#0B3D2E]/70 max-w-md mx-auto font-medium text-sm leading-relaxed">
                  গুরুত্বসহকারে আপনার অভিযোগ বা পরামর্শটি পর্যালোচনা করা হবে।
                  মাদরাসার উন্নয়নে অংশ নেওয়ার জন্য আপনাকে ধন্যবাদ।
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-4 inline-flex bg-[#0B3D2E] text-white font-bold px-6 py-2.5 rounded-2xl text-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  আরেকটি বার্তা পাঠান
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <h2 className="text-xl font-black text-[#0B3D2E] mb-2 border-b pb-3 border-dashed border-[#0B3D2E]/10">
                  অভিযোগ/পরামর্শ ফর্ম পূরণ করুন
                </h2>

                {submitError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-bold flex items-center gap-2">
                    <AlertCircle size={16} /> {submitError}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* নাম ইনপুট */}
                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-black text-[#0B3D2E] mb-1.5">
                      <User size={16} className="text-amber-600" /> আপনার নাম
                      (ঐচ্ছিক)
                    </label>
                    <input
                      {...register("name")}
                      placeholder="উদা: আব্দুল্লাহ আল মামুন"
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl p-3.5 text-[#0B3D2E] font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]/20 focus:border-[#0B3D2E]"
                    />
                  </div>

                  {/* মোবাইল নাম্বার */}
                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-black text-[#0B3D2E] mb-1.5">
                      <Phone size={16} className="text-amber-600" /> মোবাইল
                      নম্বর
                    </label>
                    <input
                      {...register("phone", {
                        required: "মোবাইল নম্বর দেওয়া আবশ্যক",
                        pattern: {
                          value: /^[0-9-+]{11,14}$/,
                          message: "সঠিক মোবাইল নম্বর প্রদান করুন",
                        },
                      })}
                      placeholder="উদা: ০১৭XXXXXXXX"
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl p-3.5 text-[#0B3D2E] font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]/20 focus:border-[#0B3D2E]"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1 font-medium flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* বিষয়ের ধরন বা ক্যাটাগরি */}
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-black text-[#0B3D2E] mb-1.5">
                    <FileText size={16} className="text-amber-600" /> বার্তার
                    ধরন সিলেক্ট করুন
                  </label>
                  <select
                    {...register("complainType", {
                      required: "একটি ক্যাটাগরি সিলেক্ট করুন",
                    })}
                    className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl p-3.5 text-[#0B3D2E] font-medium focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]/20 focus:border-[#0B3D2E]"
                  >
                    <option value="complain">অভিযোগ (Complain)</option>
                    <option value="suggestion">পরামর্শ (Suggestion)</option>
                    <option value="query">
                      অন্যান্য জিজ্ঞাসা (General Query)
                    </option>
                  </select>
                </div>

                {/* বিষয় */}
                <div>
                  <label className="text-sm font-black text-[#0B3D2E] block mb-1.5">
                    বিষয় বা শিরোনাম
                  </label>
                  <input
                    {...register("subject", { required: "বিষয় লেখা আবশ্যক" })}
                    placeholder="উদা: ক্লাস শিডিউল সংক্রান্ত সমস্যা"
                    className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl p-3.5 text-[#0B3D2E] font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]/20 focus:border-[#0B3D2E]"
                  />
                  {errors.subject && (
                    <p className="text-red-500 text-xs mt-1 font-medium flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.subject.message}
                    </p>
                  )}
                </div>

                {/* বিস্তারিত বিবরণ */}
                <div>
                  <label className="text-sm font-black text-[#0B3D2E] block mb-1.5">
                    বিস্তারিত বিবরণ লিখুন
                  </label>
                  <textarea
                    {...register("description", {
                      required: "বিস্তারিত বিবরণ দেওয়া আবশ্যক",
                    })}
                    rows={5}
                    placeholder="আপনার অভিযোগ বা পরামর্শটি এখানে বিস্তারিতভাবে বুঝিয়ে লিখুন..."
                    className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl p-4 text-[#0B3D2E]/90 font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]/20 focus:border-[#0B3D2E] leading-relaxed"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs mt-1 font-medium flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.description.message}
                    </p>
                  )}
                </div>

                {/* সাবমিট বাটন */}
                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center cursor-pointer gap-2 bg-[#0B3D2E] text-white hover:bg-[#0B3D2E]/90 px-8 py-4 rounded-2xl font-bold shadow-lg transition-transform active:scale-95 disabled:opacity-50 disabled:scale-100"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw size={18} className="animate-spin" /> পাঠানো
                        হচ্ছে...
                      </>
                    ) : (
                      <>
                        <Send size={18} /> বার্তা জমা দিন
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
