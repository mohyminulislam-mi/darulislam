"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  SquarePen,
  User,
  UserCheck,
  Calendar,
  Phone,
  Mail,
  MapPin,
  BookOpen,
  University,
  CheckCircle2,
  Send,
  Clock,
  ChevronDown,
} from "lucide-react";
import { motion } from "framer-motion";

// ফর্ম ডেটার টাইপ ডেফিনিশন
type Inputs = {
  fullName: string;
  fatherName: string;
  motherName: string;
  dob: string;
  gender: string;
  mobile: string;
  email?: string;
  course: string;
  address: string;
  education?: string;
  proficiency: string[];
  declaration: boolean;
};

const courses = [
  { id: "hifz", name: "হিফযুল কুরআন" },
  { id: "alim", name: "আলিম কোর্স" },
  { id: "arabic", name: "আরবি ভাষা কোর্স" },
  { id: "tajweed", name: "তাজবীদ ও কিরাত" },
  { id: "fiqh", name: "ফিকহুল ইবাদাত" },
];

const proficiencies = [
  { id: "tajweed", label: "তাজবীদ জানি" },
  { id: "hifz", label: "হিফয করছি" },
  { id: "read", label: "আরবি পড়তে পারি" },
  { id: "mean", label: "অর্থ বুঝি" },
];

export default function AdmissionPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  // react-hook-form এর মেথডসমূহ ইনিশিয়ালাইজেশন
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      gender: "পুরুষ",
      proficiency: [],
      declaration: false,
    },
  });

  // ফর্ম সাবমিট হ্যান্ডলার
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log("Form Data Submitted:", data);
    setIsSubmitted(true);
  };

  // সফলভাবে সাবমিট হওয়ার পরের ভিউ
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#F7FBF7] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 rounded-[3rem] shadow-2xl border-4 border-green-100 text-center space-y-6 max-w-lg"
        >
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 size={64} />
          </div>
          <h2 className="text-3xl font-black text-[#0B3D2E]">
            আবেদন জমা হয়েছে!
          </h2>
          <p className="text-lg font-medium text-[#0B3D2E]/60 leading-relaxed">
            আলহামদুলিল্লাহ, আপনার ভর্তির আবেদনটি সফলভাবে গৃহীত হয়েছে। খুব
            শীঘ্রই আমরা আপনার মোবাইলে এসএমএস-এর মাধ্যমে পরবর্তী পদক্ষেপ জানিয়ে
            দেব।
          </p>
          <button
            onClick={() => {
              setIsSubmitted(false);
              reset(); // ফর্ম রিসেট করা
            }}
            className="w-full bg-[#0B3D2E] text-[#F5EFE1] cursor-pointer py-4 rounded-2xl font-black text-xl hover:scale-105 transition-transform"
          >
            ধন্যবাদ
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <section className="flex flex-col min-h-screen bg-[#F7FBF7]">
      {/* Hero Section */}
      <div className="relative h-40 lg:h-48 bg-gradient-to-r from-emerald-800 to-teal-900 flex items-end p-6 lg:p-12 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] bg-repeat" />
        <div className="relative z-10 w-full max-w-screen-xl mx-auto flex items-center gap-4">
          <div className="w-14 h-14 bg-[#8FE3A9] rounded-2xl flex items-center justify-center text-[#0B3D2E] shadow-lg">
            <SquarePen size={32} />
          </div>
          <div>
            <h1 className="text-2xl lg:text-4xl font-black">ভর্তি ফর্ম</h1>
            <p className="text-sm font-bold text-[#F5EFE1]/80 uppercase tracking-widest mt-1">
              ২০২৬ শিক্ষাবর্ষ
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto w-full px-4 py-12 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 lg:p-12 rounded-[3rem] shadow-2xl border border-[#0B3D2E]/5 w-full max-w-3xl space-y-12"
        >
          {/* Header */}
          <div className="flex items-center gap-4 pb-6 border-b-2 border-dashed border-[#0B3D2E]/10">
            <div className="w-12 h-12 bg-[#0B3D2E]/5 text-[#0B3D2E] rounded-2xl flex items-center justify-center">
              <UserCheck size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#0B3D2E]">
                আবেদনকারীর তথ্য
              </h2>
              <p className="text-sm font-medium text-[#0B3D2E]/40 mt-1">
                সঠিক তথ্য দিয়ে ফর্মটি পূরণ করুন
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* Full Name */}
            <div className="space-y-3">
              <label className="text-sm font-black text-[#0B3D2E]/60 uppercase tracking-wider flex items-center gap-2">
                <User size={14} className="text-amber-600" /> আবেদনকারীর নাম
                (পূর্ণ)
              </label>
              <input
                type="text"
                placeholder="যেমন: মুহাম্মদ রহিম"
                {...register("fullName", {
                  required: "নামের অংশটি পূরণ করা আবশ্যক",
                })}
                className="w-full bg-[#0B3D2E]/5 p-4 rounded-2xl font-bold border-2 border-transparent focus:border-[#0B3D2E]/20 outline-none transition-all"
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs font-bold mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Fathers Name */}
            <div className="space-y-3">
              <label className="text-sm font-black text-[#0B3D2E]/60 uppercase tracking-wider flex items-center gap-2">
                <UserCheck size={14} className="text-amber-600" /> পিতার নাম
              </label>
              <input
                type="text"
                placeholder="যেমন: আব্দুল করিম"
                {...register("fatherName", { required: "পিতার নাম আবশ্যক" })}
                className="w-full bg-[#0B3D2E]/5 p-4 rounded-2xl font-bold border-2 border-transparent focus:border-[#0B3D2E]/20 outline-none transition-all"
              />
              {errors.fatherName && (
                <p className="text-red-500 text-xs font-bold mt-1">
                  {errors.fatherName.message}
                </p>
              )}
            </div>

            {/* Mother's Name */}
            <div className="space-y-3">
              <label className="text-sm font-black text-[#0B3D2E]/60 uppercase tracking-wider flex items-center gap-2">
                <UserCheck size={14} className="text-amber-600" /> মাতার নাম
              </label>
              <input
                type="text"
                placeholder="যেমন: রহিমা বেগম"
                {...register("motherName", { required: "মাতার নাম আবশ্যক" })}
                className="w-full bg-[#0B3D2E]/5 p-4 rounded-2xl font-bold border-2 border-transparent focus:border-[#0B3D2E]/20 outline-none transition-all"
              />
              {errors.motherName && (
                <p className="text-red-500 text-xs font-bold mt-1">
                  {errors.motherName.message}
                </p>
              )}
            </div>

            {/* DOB */}
            <div className="space-y-3">
              <label className="text-sm font-black text-[#0B3D2E]/60 uppercase tracking-wider flex items-center gap-2">
                <Calendar size={14} className="text-amber-600" /> জন্ম তারিখ
              </label>
              <input
                type="date"
                {...register("dob", { required: "জন্ম তারিখ সিলেক্ট করুন" })}
                className="w-full bg-[#0B3D2E]/5 p-4 rounded-2xl font-bold border-2 border-transparent focus:border-[#0B3D2E]/20 outline-none transition-all"
              />
              {errors.dob && (
                <p className="text-red-500 text-xs font-bold mt-1">
                  {errors.dob.message}
                </p>
              )}
            </div>

            {/* Gender */}
            <div className="space-y-3">
              <label className="text-sm font-black text-[#0B3D2E]/60 uppercase tracking-wider">
                লিঙ্গ
              </label>
              <div className="flex gap-4">
                <label className="flex-1 bg-[#0B3D2E]/5 p-4 rounded-2xl flex items-center justify-center gap-3 cursor-pointer group hover:bg-[#0B3D2E]/10 transition-colors">
                  <input
                    type="radio"
                    value="পুরুষ"
                    {...register("gender")}
                    className="w-5 h-5 accent-[#0B3D2E]"
                  />
                  <span className="font-bold">পুরুষ</span>
                </label>
                <label className="flex-1 bg-[#0B3D2E]/5 p-4 rounded-2xl flex items-center justify-center gap-3 cursor-pointer group hover:bg-[#0B3D2E]/10 transition-colors">
                  <input
                    type="radio"
                    value="মহিলা"
                    {...register("gender")}
                    className="w-5 h-5 accent-[#0B3D2E]"
                  />
                  <span className="font-bold">মহিলা</span>
                </label>
              </div>
            </div>

            {/* Mobile */}
            <div className="space-y-3">
              <label className="text-sm font-black text-[#0B3D2E]/60 uppercase tracking-wider flex items-center gap-2">
                <Phone size={14} className="text-amber-600" /> মোবাইল নম্বর
              </label>
              <input
                type="tel"
                placeholder="০১৭XXXXXXXX"
                {...register("mobile", {
                  required: "মোবাইল নম্বর আবশ্যক",
                  pattern: {
                    value: /^(?:\+88|88)?(01[3-9]\d{8})$/,
                    message:
                      "সঠিক বাংলাদেশী মোবাইল নম্বর প্রদান করুন (১১ ডিজিট)",
                  },
                })}
                className="w-full bg-[#0B3D2E]/5 p-4 rounded-2xl font-bold border-2 border-transparent focus:border-[#0B3D2E]/20 outline-none transition-all"
              />
              {errors.mobile && (
                <p className="text-red-500 text-xs font-bold mt-1">
                  {errors.mobile.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-3">
              <label className="text-sm font-black text-[#0B3D2E]/60 uppercase tracking-wider flex items-center gap-2">
                <Mail size={14} className="text-amber-600" /> ইমেইল (ঐচ্ছিক)
              </label>
              <input
                type="email"
                placeholder="example@gmail.com"
                {...register("email", {
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "সঠিক ইমেইল অ্যাড্রেস লিখুন",
                  },
                })}
                className="w-full bg-[#0B3D2E]/5 p-4 rounded-2xl font-bold border-2 border-transparent focus:border-[#0B3D2E]/20 outline-none transition-all"
              />
              {errors.email && (
                <p className="text-red-500 text-xs font-bold mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Course Selection */}
            <div className="space-y-3">
              <label className="text-sm font-black text-[#0B3D2E]/60 uppercase tracking-wider flex items-center gap-2">
                <BookOpen size={14} className="text-amber-600" /> পছন্দের কোর্স
              </label>
              <div className="relative">
                <select
                  {...register("course", {
                    required: "একটি কোর্স সিলেক্ট করুন",
                  })}
                  className="w-full bg-[#0B3D2E]/5 p-4 rounded-2xl font-bold border-2 border-transparent focus:border-[#0B3D2E]/20 outline-none transition-all appearance-none pr-10 cursor-pointer"
                >
                  <option value="">নির্বাচন করুন</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0B3D2E]/40 pointer-events-none"
                  size={20}
                />
              </div>
              {errors.course && (
                <p className="text-red-500 text-xs font-bold mt-1">
                  {errors.course.message}
                </p>
              )}
            </div>

            {/* Address */}
            <div className="space-y-3 md:col-span-2">
              <label className="text-sm font-black text-[#0B3D2E]/60 uppercase tracking-wider flex items-center gap-2">
                <MapPin size={14} className="text-amber-600" /> বর্তমান ঠিকানা
              </label>
              <textarea
                rows={3}
                placeholder="আপনার পূর্ণ ঠিকানা লিখুন"
                {...register("address", { required: "ঠিকানা লেখা আবশ্যক" })}
                className="w-full bg-[#0B3D2E]/5 p-4 rounded-2xl font-bold border-2 border-transparent focus:border-[#0B3D2E]/20 outline-none transition-all resize-none"
              />
              {errors.address && (
                <p className="text-red-500 text-xs font-bold mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>

            {/* Education */}
            <div className="space-y-3 md:col-span-2">
              <label className="text-sm font-black text-[#0B3D2E]/60 uppercase tracking-wider flex items-center gap-2">
                <University size={14} className="text-amber-600" /> সর্বোচ্চ
                শিক্ষাগত যোগ্যতা
              </label>
              <input
                type="text"
                placeholder="যেমন: দাখিল, আলিম, এসএসসি"
                {...register("education")}
                className="w-full bg-[#0B3D2E]/5 p-4 rounded-2xl font-bold border-2 border-transparent focus:border-[#0B3D2E]/20 outline-none transition-all"
              />
            </div>

            {/* Quran Proficiency */}
            <div className="space-y-3 md:col-span-2">
              <label className="text-sm font-black text-[#0B3D2E]/60 uppercase tracking-wider">
                কুরআন সম্পর্কিত দক্ষতা
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {proficiencies.map((p) => (
                  <label
                    key={p.id}
                    className="flex items-center gap-3 p-4 bg-[#0B3D2E]/5 rounded-2xl cursor-pointer hover:bg-[#0B3D2E]/10 transition-colors"
                  >
                    <input
                      type="checkbox"
                      value={p.id}
                      {...register("proficiency")}
                      className="w-5 h-5 accent-[#0B3D2E]"
                    />
                    <span className="text-xs font-bold leading-tight">
                      {p.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Declaration */}
            <div className="md:col-span-2 space-y-2">
              <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 flex gap-4">
                <input
                  type="checkbox"
                  {...register("declaration", {
                    required: "শর্তাবলী মেনে নেওয়া আবশ্যক",
                  })}
                  className="w-6 h-6 accent-[#0B3D2E] shrink-0 mt-1"
                />
                <p className="text-sm font-medium text-amber-900 leading-relaxed">
                  আমি ঘোষণা করছি যে উপরে প্রদত্ত সকল তথ্য সঠিক এবং আমি দারুল
                  ইসলাম ইনস্টিটিউটের সকল নিয়ম কানুন মেনে চলব।
                </p>
              </div>
              {errors.declaration && (
                <p className="text-red-500 text-xs font-bold px-2">
                  {errors.declaration.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 pt-6">
              <button
                type="submit"
                className="w-full bg-[#0B3D2E] text-[#F5EFE1] py-5 cursor-pointer rounded-[1.5rem] font-black text-xl flex items-center justify-center gap-3 shadow-xl hover:translate-y-[-2px] active:translate-y-[2px] transition-all"
              >
                আবেদন জমা দিন <Send size={24} />
              </button>
              <p className="text-center text-[10px] font-bold text-[#0B3D2E]/40 uppercase tracking-widest mt-4">
                আবেদনের পর পরবর্তী পদক্ষেপসমূহ ফোনের মাধ্যমে জানানো হবে।
              </p>
            </div>
          </form>
        </motion.div>

        {/* Quick Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
          <div className="bg-white p-6 rounded-3xl shadow-xl flex items-center gap-4 border border-[#0B3D2E]/5">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-[#0B3D2E]/40">
                ভর্তির শেষ তারিখ
              </p>
              <p className="text-xl font-black text-[#0B3D2E]">১৫ মার্চ ২০২৬</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-xl flex items-center gap-4 border border-[#0B3D2E]/5">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center">
              <Phone size={24} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-[#0B3D2E]/40">
                হেল্পলাইন
              </p>
              <p className="text-xl font-black text-[#0B3D2E]">০১৭১২-৩৪৫৬৭৮</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
