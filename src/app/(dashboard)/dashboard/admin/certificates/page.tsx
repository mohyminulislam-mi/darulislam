"use client";

import { useState } from "react";
import useAxiosSecure from "@/src/app/hooks/useAxiosSecure";
import { SubmitHandler, useForm as useHookForm } from "react-hook-form";
import {
  Award,
  User,
  BookOpen,
  Calendar,
  Building2,
  CheckCircle2,
  Send,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import Swal from "sweetalert2";

// Certificate Form Types
type CertificateFormInputs = {
  certificateId: string;
  studentName: string;
  fatherName: string;
  courseName: string;
  issueDate: string;
  grade: string;
  duration: string;
  status: string;
  issuedBy: string;
};

export default function AdminCertificateDashboard() {
  const axiosSecure = useAxiosSecure();
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useHookForm<CertificateFormInputs>({
    defaultValues: {
      status: "Verified",
      issuedBy: "দারুল ইসলাম এডুকেশন ইনস্টিটিউট",
      grade: "A+ (Outstanding)",
      duration: "৬ মাস",
    },
  });

  const onSubmit: SubmitHandler<CertificateFormInputs> = async (data) => {
    const formattedData = {
      ...data,
      certificateId: data.certificateId.trim().toUpperCase(),
    };

    try {
      setIsLoading(true);

      const res = await axiosSecure.post("/certificates", formattedData);

      if (res.status === 200 || res.status === 201) {
        Swal.fire({
          icon: "success",
          title: "সার্টিফিকেট সেভ হয়েছে!",
          text: "নতুন সার্টিফিকেট ডাটা সফলভাবে যুক্ত করা হয়েছে।",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
        });

        reset();
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "ব্যর্থ হয়েছে",
        text: error.response?.data?.message || "সার্টিফিকেট তৈরি করা যায়নি।",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#F7FBF7] p-4 sm:p-6 lg:p-10">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* হেডার */}
        <div className="bg-white p-6 rounded-3xl border border-[#0B3D2E]/10 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs font-black text-[#0B3D2E] uppercase tracking-wider bg-[#8FE3A9]/20 px-3 py-1 rounded-md inline-flex items-center gap-1">
              <ShieldCheck size={14} /> এডমিন ড্যাশবোর্ড
            </span>
            <h1 className="text-2xl font-black text-[#0B3D2E] mt-1">
              নতুন সার্টিফিকেট ইস্যু ও এন্ট্রি করুন
            </h1>
          </div>
        </div>

        {/* সাকসেস মেসেজ */}
        {successMsg && (
          <div className="bg-green-100 border border-green-300 text-green-800 p-4 rounded-2xl font-bold text-sm flex items-center gap-2">
            <CheckCircle2 size={18} className="text-green-700" /> {successMsg}
          </div>
        )}

        {/* ফর্ম সেকশন */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#0B3D2E]/10 shadow-sm space-y-6">
            <h2 className="text-lg font-black text-[#0B3D2E] border-b pb-3 flex items-center gap-2">
              <Award size={20} /> সনদের বিস্তারিত তথ্য
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* সার্টিফিকেট আইডি */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  সার্টিফিকেট আইডি / নম্বর{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Award
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    {...register("certificateId", {
                      required: "সার্টিফিকেট আইডি আবশ্যক",
                    })}
                    placeholder="যেমন: CERT-2026-103"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#0B3D2E] transition uppercase"
                  />
                </div>
                {errors.certificateId && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.certificateId.message}
                  </p>
                )}
              </div>

              {/* শিক্ষার্থীর নাম */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  শিক্ষার্থীর নাম <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    {...register("studentName", {
                      required: "শিক্ষার্থীর নাম আবশ্যক",
                    })}
                    placeholder="যেমন: আব্দুল্লাহ আল মামুন"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#0B3D2E] transition"
                  />
                </div>
                {errors.studentName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.studentName.message}
                  </p>
                )}
              </div>

              {/* বাবার নাম */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  বাবার নাম <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    {...register("fatherName", {
                      required: "বাবার নাম আবশ্যক",
                    })}
                    placeholder="যেমন: মোঃ রফিকুল ইসলাম"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#0B3D2E] transition"
                  />
                </div>
                {errors.fatherName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.fatherName.message}
                  </p>
                )}
              </div>

              {/* কোর্সের নাম */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  কোর্সের নাম <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <BookOpen
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    {...register("courseName", {
                      required: "কোর্সের নাম আবশ্যক",
                    })}
                    placeholder="যেমন: ডিজিটাল ক্যালিগ্রাফি ও ডিজাইন"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#0B3D2E] transition"
                  />
                </div>
                {errors.courseName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.courseName.message}
                  </p>
                )}
              </div>

              {/* অর্জিত গ্রেড / ফলাফল */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  অর্জিত গ্রেড / ফলাফল
                </label>
                <select
                  {...register("grade")}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#0B3D2E] transition"
                >
                  <option value="A+ (Outstanding)">A+ (Outstanding)</option>
                  <option value="A (Excellent)">A (Excellent)</option>
                  <option value="A- (Very Good)">A- (Very Good)</option>
                  <option value="B (Good)">B (Good)</option>
                  <option value="Pass">Pass</option>
                </select>
              </div>

              {/* কোর্সের সময়কাল */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  কোর্সের সময়কাল (Duration)
                </label>
                <input
                  {...register("duration")}
                  placeholder="যেমন: ৬ মাস / ৩ মাস"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#0B3D2E] transition"
                />
              </div>

              {/* ইস্যুর তারিখ */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  ইস্যুর তারিখ <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    {...register("issueDate", {
                      required: "ইস্যুর তারিখ আবশ্যক",
                    })}
                    placeholder="যেমন: ১৫ জুন, ২০২৬"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#0B3D2E] transition"
                  />
                </div>
                {errors.issueDate && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.issueDate.message}
                  </p>
                )}
              </div>

              {/* ইস্যুকারী প্রতিষ্ঠান */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  ইস্যুকারী প্রতিষ্ঠান
                </label>
                <div className="relative">
                  <Building2
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    {...register("issuedBy")}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#0B3D2E] transition"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* সাবমিট বাটন */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0B3D2E] text-white py-4 rounded-2xl font-black text-base hover:bg-green-900 transition flex items-center justify-center gap-2 shadow-lg cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw size={18} className="animate-spin" /> ডাটা সেভ
                হচ্ছে...
              </>
            ) : (
              <>
                <Send size={18} /> সার্টিফিকেট ডাটা সেভ করুন
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
