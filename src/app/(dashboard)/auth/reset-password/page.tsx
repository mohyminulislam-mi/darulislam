"use client";

import React, { useState, Suspense } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import Swal from "sweetalert2";
import login1 from "@/public/images/login1.png";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<any>({
    mode: "onChange",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [globalError, setGlobalError] = useState("");

  const passwordValue = watch("password");

  const onSubmit: SubmitHandler<any> = async (data) => {
    setGlobalError("");

    if (!token) {
      setGlobalError("রিসেট টোকেনটি পাওয়া যায়নি। অনুগ্রহ করে মেইলের সঠিক লিঙ্কটি ব্যবহার করুন।");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`,
        {
          token,
          password: data.password,
        }
      );

      if (response.data?.success) {
        Swal.fire({
          title: "সফল হয়েছে!",
          text: response.data?.message || "আপনার পাসওয়ার্ডটি সফলভাবে পরিবর্তন করা হয়েছে।",
          icon: "success",
          confirmButtonColor: "#0B5D3B",
          customClass: { popup: "rounded-[2rem]" },
        }).then(() => {
          router.push("/auth/login");
        });
      }
    } catch (error: any) {
      setGlobalError(
        error.response?.data?.message || "পাসওয়ার্ড রিসেট করতে ব্যর্থ হয়েছে। লিঙ্কটির মেয়াদ শেষ হতে পারে।"
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
              নতুন পাসওয়ার্ড
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
            নিরাপত্তা <br /> <span className="text-[#C8A44D]">হালনাগাদ করুন</span>
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
              href="/auth/login"
              className="inline-flex items-center gap-2 text-neutral-400 hover:text-[#0B5D3B] transition-colors group"
            >
              <div className="p-2.5 lg:p-0 bg-neutral-50 lg:bg-transparent rounded-full lg:rounded-none border border-neutral-100 lg:border-none shadow-sm lg:shadow-none">
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
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

          <div className="mb-10">
            <h2 className="text-2xl lg:text-4xl font-black text-neutral-900 tracking-tight">
              রিসেট পাসওয়ার্ড
            </h2>
            <p className="text-neutral-500 font-semibold mt-1 text-sm lg:text-[15px]">
              আপনার অ্যাকাউন্টের জন্য নতুন পাসওয়ার্ড সেট করুন
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  {...register("password", {
                    required: "নতুন পাসওয়ার্ডটি আবশ্যক",
                    minLength: {
                      value: 6,
                      message: "পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে",
                    },
                  })}
                  placeholder="নতুন পাসওয়ার্ড"
                  className="w-full pl-6 pr-14 py-4.5 bg-neutral-50 lg:bg-neutral-50/50 border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-[#0B5D3B] focus:bg-white outline-none transition-all font-bold text-sm"
                />
                <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-3 text-neutral-300">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="hover:text-[#0B5D3B] transition-colors p-1"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                  <div className="w-[1px] h-4 bg-neutral-200"></div>
                  <Lock size={20} />
                </div>
              </div>
              {errors.password && (
                <p className="text-xs font-bold text-red-500 mt-1.5 pl-2">
                  {errors.password.message as string}
                </p>
              )}
            </div>

            <div>
              <div className="relative group">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  {...register("confirmPassword", {
                    required: "পাসওয়ার্ড নিশ্চিত করা আবশ্যক",
                    validate: (value) => value === passwordValue || "পাসওয়ার্ড দুটি মিলেনি",
                  })}
                  placeholder="নতুন পাসওয়ার্ড নিশ্চিত করুন"
                  className="w-full pl-6 pr-14 py-4.5 bg-neutral-50 lg:bg-neutral-50/50 border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-[#0B5D3B] focus:bg-white outline-none transition-all font-bold text-sm"
                />
                <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-3 text-neutral-300">
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="hover:text-[#0B5D3B] transition-colors p-1"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                  <div className="w-[1px] h-4 bg-neutral-200"></div>
                  <Lock size={20} />
                </div>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs font-bold text-red-500 mt-1.5 pl-2">
                  {errors.confirmPassword.message as string}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#0B5D3B] hover:cursor-pointer hover:bg-[#0d4d2e] text-white py-5 rounded-2xl font-black text-xl transition-all shadow-xl shadow-green-900/20 active:scale-[0.98] mt-4 uppercase tracking-widest disabled:opacity-70 flex justify-center items-center gap-2"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : "পাসওয়ার্ড রিসেট করুন"}
            </button>
          </form>

          <div className="mt-10 flex items-center gap-4 p-5 bg-[#0B5D3B]/5 rounded-[2rem] border border-[#0B5D3B]/10">
            <div className="p-3 bg-white rounded-2xl text-[#0B5D3B] shadow-sm">
              <ShieldCheck size={24} />
            </div>
            <p className="text-[11px] leading-relaxed text-neutral-600 font-bold">
              আপনার পাসওয়ার্ড পরিবর্তন প্রক্রিয়াটি অত্যন্ত সুরক্ষিত।{" "}
              <span className="text-[#0B5D3B]">End-to-End SSL</span> সুরক্ষায় নতুন ক্রেডেনশিয়াল ডাটাবেজে হ্যাশ করা হচ্ছে।
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4">
          <Loader2 className="w-12 h-12 text-[#0B5D3B] animate-spin mb-4" />
          <p className="text-sm font-bold text-slate-500">লোডিং হচ্ছে...</p>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}