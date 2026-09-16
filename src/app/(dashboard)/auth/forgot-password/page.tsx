"use client";

import React, { useState, Suspense } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { motion } from "framer-motion";
import {
  Mail,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import login1 from "@/public/images/login1.png";
import dynamicImport from "next/dynamic";

function ForgotPasswordContent() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");
  const emailFromUrl = searchParams.get("email") || "";

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<any>({
    defaultValues: {
      email: emailFromUrl,
    },
  });

  const [globalError, setGlobalError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const onSubmit: SubmitHandler<any> = async (data) => {
    setGlobalError("");
    setSuccessMessage("");

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`,
        { email: data.email },
      );

      if (response.data?.success) {
        setSuccessMessage(
          response.data?.message ||
            "পাসওয়ার্ড রিসেট লিঙ্কটি আপনার ইমেইলে পাঠানো হয়েছে। দয়া করে চেক করুন।",
        );
        reset();
      }
    } catch (error: any) {
      setGlobalError(
        error.response?.data?.message ||
          "অনুরোধটি প্রসেস করা সম্ভব হয়নি। অনুগ্রহ করে আবার চেষ্টা করুন।",
      );
    }
  };

  return (
    <div className="min-h-screen lg:h-screen bg-[#f8fafc] flex flex-col lg:flex-row lg:overflow-hidden">
      <div className="relative h-[45vh] lg:h-full lg:w-[55%] bg-[#0B5D3B] overflow-hidden shrink-0">
        <Image
          src={login1}
          alt="Mosque Banner"
          fill
          priority
          className="object-cover opacity-50 lg:opacity-60 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B5D3B] via-transparent to-transparent lg:hidden" />
        <div className="absolute inset-0 bg-black/10 hidden lg:block" />

        <div className="absolute inset-0 flex flex-col items-center lg:items-start justify-center text-center lg:text-left p-8 lg:p-20 space-y-6">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex flex-col items-center lg:items-start gap-2 bg-white/10 backdrop-blur-xl px-6 py-4 rounded-3xl border border-white/20 shadow-2xl"
          >
            <h1 className="text-white font-black text-2xl lg:text-3xl tracking-tight uppercase">
              পুনরুদ্ধার
            </h1>
            <span className="text-[11px] lg:text-[13px] text-white/90 font-semibold tracking-widest uppercase">
              ইসলামি শিক্ষা, সুশিক্ষিত জীবন
            </span>
          </motion.div>

          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl md:text-4xl lg:text-6xl font-black text-white leading-tight lg:block hidden drop-shadow-lg"
          >
            পাসওয়ার্ড <br />{" "}
            <span className="text-[#C8A44D]">পুনরুদ্ধার করুন</span>
          </motion.h2>
        </div>
      </div>

      <div className="flex-1 flex items-start lg:items-center justify-center relative -mt-16 lg:mt-0 z-10 lg:z-0 px-4 pb-12 lg:p-12 lg:bg-white lg:overflow-y-auto lg:h-screen scrollbar-hide">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="w-full max-w-md bg-white rounded-[2.5rem] lg:rounded-none lg:shadow-none border border-neutral-100 lg:border-none p-8 md:p-10 lg:p-0 my-auto"
        >
          <div className="flex items-center justify-between mb-8 lg:mb-10">
            <Link
              href={
                redirectUrl
                  ? `/auth/login?redirect=${encodeURIComponent(redirectUrl)}`
                  : "/auth/login"
              }
              className="inline-flex items-center gap-2 text-neutral-400 hover:text-[#0B5D3B] transition-colors group"
            >
              <div className="p-2.5 lg:p-0 bg-neutral-50 lg:bg-transparent rounded-full lg:rounded-none border border-neutral-100 lg:border-none shadow-sm lg:shadow-none">
                <ArrowLeft
                  size={20}
                  className="group-hover:-translate-x-1 transition-transform"
                />
              </div>
              <span className="hidden lg:block text-sm font-bold uppercase tracking-widest">
                লগইন পেজে ফিরুন
              </span>
            </Link>
          </div>

          {globalError && (
            <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-semibold border border-red-100 text-center">
              {globalError}
            </div>
          )}

          {successMessage && (
            <div className="mb-6 bg-emerald-50 text-[#0B5D3B] p-5 rounded-2xl text-sm font-semibold border border-emerald-100 text-center flex flex-col items-center gap-2">
              <CheckCircle2 size={24} className="text-[#0B5D3B]" />
              <p>{successMessage}</p>
            </div>
          )}

          <div className="mb-10">
            <h2 className="text-2xl lg:text-4xl font-black text-neutral-900 tracking-tight">
              পাসওয়ার্ড ভুলে গেছেন?
            </h2>
            <p className="text-neutral-500 font-semibold mt-1 text-sm lg:text-[15px]">
              আপনার নিবন্ধিত ইমেইল ঠিকানাটি প্রদান করুন
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="relative group">
              <input
                type="email"
                required
                {...register("email", { required: true })}
                placeholder="আপনার ইমেইল ঠিকানা"
                className="w-full pl-6 pr-12 py-4.5 bg-neutral-50 lg:bg-neutral-50/50 border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-[#0B5D3B] focus:bg-white outline-none transition-all font-bold text-sm"
              />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-[#0B5D3B] transition-colors">
                <Mail size={20} />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#0B5D3B] hover:cursor-pointer hover:bg-[#0d4d2e] text-white py-5 rounded-2xl font-black text-xl transition-all shadow-xl shadow-green-900/20 active:scale-[0.98] mt-4 uppercase tracking-widest disabled:opacity-70 flex justify-center items-center gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                "লিঙ্ক পাঠান"
              )}
            </button>
          </form>

          <div className="mt-10 flex items-center gap-4 p-5 bg-[#0B5D3B]/5 rounded-[2rem] border border-[#0B5D3B]/10">
            <div className="p-3 bg-white rounded-2xl text-[#0B5D3B] shadow-sm">
              <ShieldCheck size={24} />
            </div>
            <p className="text-[11px] leading-relaxed text-neutral-600 font-bold">
              আপনার নিরাপত্তা আমাদের অগ্রাধিকার।{" "}
              <span className="text-[#0B5D3B]">256-bit SSL</span> এন্ডক্রিপশনের
              মাধ্যমে প্রসেসটি সম্পন্ন করা হচ্ছে।
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4">
          <Loader2 className="w-12 h-12 text-[#0B5D3B] animate-spin mb-4" />
          <p className="text-sm font-bold text-slate-500">লোডিং হচ্ছে...</p>
        </div>
      }
    >
      <ForgotPasswordContent />
    </Suspense>
  );
}
