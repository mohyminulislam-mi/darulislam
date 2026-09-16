"use client";
import React from "react";
import { ArrowRight, ClipboardCheck, FileText, PenTool } from "lucide-react";
import Link from "next/link";

// ১. ইন্টারফেস ডিফাইন করা (TS এর জন্য)
interface AdmissionStep {
  title: string;
  desc: string;
  icon: React.ReactNode;
}

const AdmissionInfo: React.FC = () => {
  // ২. অ্যারেতে টাইপ অ্যাসাইন করা
  const steps: AdmissionStep[] = [
    {
      title: "অনলাইন ফরম",
      desc: "ভর্তি হতে অনলাইন ফরম সঠিক তথ্য দিয়ে পূরণ করুন",
      icon: <FileText className="w-6 h-6" />,
    },
    {
      title: "কাগজপত্র জমা",
      desc: "প্রয়োজনীয় সকল কাগজপত্র স্ক্যান করে জমা দিন",
      icon: <ClipboardCheck className="w-6 h-6" />,
    },
    {
      title: "ভর্তি পরীক্ষা",
      desc: "নির্ধারিত সময়ে ভর্তি পরীক্ষায় অংশগ্রহণ করুন",
      icon: <PenTool className="w-6 h-6" />,
    },
  ];

  return (
    <section className="my-8 px-5 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-50 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />

      <div className="bg-gray-300 max-w-7xl mx-auto px-5 py-6 rounded-2xl text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-black text-[#0B5D3B] mb-4">
          ভর্তি তথ্য ও প্রক্রিয়া
        </h2>
        <p className="text-gray-500 mb-12 max-w-lg mx-auto text-sm md:text-base">
          সহজ তিনটি ধাপ অনুসরণ করে আজই আপনার ভর্তি কার্যক্রম সম্পন্ন করুন।
        </p>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {steps.map((step, i) => (
            <div
              key={i}
              className="group relative p-8 bg-white border border-emerald-50 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 text-center"
            >
              {/* Number Badge */}
              <div className="absolute top-4 right-6 text-5xl font-black text-emerald-50 group-hover:text-emerald-100 transition-colors">
                0{i + 1}
              </div>

              {/* Icon Container */}
              <div className="relative w-16 h-16 mx-auto mb-6 bg-emerald-50 text-[#0B5D3B] rounded-2xl flex items-center justify-center group-hover:bg-[#0B5D3B] group-hover:text-white transition-all duration-300 transform group-hover:rotate-6">
                {step.icon}
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <Link href="/auth/register" className="flex items-center gap-2 px-10 py-4 bg-[#0B5D3B] text-white font-black rounded-2xl hover:bg-[#0d4d2e] transition-all shadow-lg hover:shadow-emerald-200 active:scale-95">
            এখনই আবেদন করুন
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link href="/contact" className="px-10 py-4 border-2 border-emerald-100 text-gray-600 font-bold rounded-2xl hover:bg-emerald-50 transition-all">
            হেল্পলাইন যোগাযোগ
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AdmissionInfo;
