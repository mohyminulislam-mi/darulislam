"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Award,
  Medal,
  Trophy,
  Sparkles,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

interface ResultProps {
  payload: {
    scoreSummary: {
      letterScore: number;
      pronunciationScore: number;
      meaningScore: number;
      totalScore: number;
    };
    suggestedCourse?: string;
  };
}

export default function QuizResult({ payload }: ResultProps) {
  const { scoreSummary } = payload;
  const total = scoreSummary.totalScore;

  // 🎯 ডাইনামিক কন্টেন্ট ও ফিডব্যাক ম্যাট্রিক্স (স্কোরের ওপর ভিত্তি করে চেঞ্জ হবে ভাই)
  const getFeedbackConfig = (score: number) => {
    if (score >= 10) {
      return {
        title: "মাশাআল্লাহ্! আপনি চমৎকার পেরেছেন",
        subtitle: "আপনার কুরআন তিলাওয়াত ও হরফের জ্ঞান অত্যন্ত প্রশংসনীয় ভাই।",
        motivation:
          "তাজবীদের এই ধারাবাহিকতা বজায় রাখতে এবং ইলমি সফরে আরও একধাপ এগিয়ে যেতে আমাদের উন্নত কোর্স মডিউলগুলো দেখতে পারেন। নিয়মিত চর্চায় আপনার দক্ষতা আরও নিখুঁত হবে ইনশাআল্লাহ্।",
        Icon: Trophy,
        iconColor: "text-amber-500",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-100",
      };
    } else if (score >= 6) {
      return {
        title: "মাশাআল্লাহ্! আপনার বেশ ভালো উন্নতি হচ্ছে",
        subtitle:
          "আপনি অনেক কিছু পারেন, তবে কিছু কিছু জায়গায় সামান্য সংশোধনের প্রয়োজন আছে।",
        motivation:
          "শুদ্ধভাবে কুরআন তিলাওয়াত প্রতিটি মুসলিমের জন্য আবশ্যক। একটু সচেতনভাবে চর্চা করলে এবং অভিজ্ঞ শিক্ষকদের গাইডলাইন পেলে আপনার ছোটখাটো ভুলগুলো খুব দ্রুত দূর হয়ে যাবে ইনশাআল্লাহ্।",
        Icon: Medal,
        iconColor: "text-emerald-600",
        bgColor: "bg-emerald-50",
        borderColor: "border-emerald-100",
      };
    } else {
      return {
        title: "শুরু করার এখনই সেরা সময় ভাই",
        subtitle:
          "কুরআন শেখার যাত্রায় কোনো সংকোচ নেই; ভুল থেকেই মানুষ সঠিকটা শেখে।",
        motivation:
          "সহজ পদ্ধতিতে শূন্য থেকে তাজবীদসহ কুরআন শেখার জন্য আমাদের নিয়মিত ব্যাচগুলো চমৎকার কাজ করছে। অভিজ্ঞ ওস্তাদদের সরাসরি তত্ত্বাবধানে খুব অল্প সময়েই আপনি শুদ্ধভাবে পড়া শুরু করতে পারবেন ইনশাআল্লাহ্।",
        Icon: Award,
        iconColor: "text-teal-600",
        bgColor: "bg-teal-50",
        borderColor: "border-teal-100",
      };
    }
  };

  const config = getFeedbackConfig(total);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-5xl mx-auto bg-white border border-neutral-100 rounded-[2.5rem] p-6 md:p-10 shadow-[0_25px_60px_rgba(11,93,59,0.03)] text-center font-sans"
    >
      {/* 🎯 স্ক্রিনশটের মতো ডাইনামিক সেন্ট্রাল মোটিভেশনাল ব্যাজ */}
      <div
        className={`w-20 h-20 ${config.bgColor} ${config.borderColor} border rounded-full flex items-center justify-center ${config.iconColor} mx-auto mb-5 shadow-2xs relative`}
      >
        <config.Icon size={36} className="relative z-10" />
        <Sparkles
          size={16}
          className="absolute top-2 right-2 opacity-40 animate-pulse"
        />
      </div>

      {/* ডাইনামিক হেডিং টেক্সট লেয়ার */}
      <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight px-2">
        {config.title}
      </h2>
      <p className="text-xs md:text-sm text-slate-600 font-bold mt-2 max-w-md mx-auto leading-relaxed">
        {config.subtitle}
      </p>

      {/* 🎯 মেগা স্কোর কাউন্টার এরিয়া (হুবহু স্ক্রিনশট ইউআই সিঙ্ক) */}
      <div className="my-8 bg-gradient-to-b from-[#F4FBF9] to-white px-12 py-6 rounded-3xl border border-[#D1EDE4] w-fit mx-auto shadow-2xs relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#0B5D3B]/40" />
        <div className="text-xs font-black text-[#0B5D3B] uppercase tracking-wider mb-1">
          আপনার স্কোর
        </div>
        <div className="flex items-baseline justify-center">
          <span className="text-5xl font-mono font-black text-[#0B5D3B] tracking-tight">
            {total}
          </span>
          <span className="text-neutral-400 font-mono font-black text-xl ml-1">
            /১২
          </span>
        </div>
      </div>

      {/* 🎯 ব্রেকডাউন প্যানেল ম্যাট্রিক্স (স্ক্রিনশটের মতো প্রিমিয়াম হোয়াইট পপআপ বক্স) */}
      <div className="grid grid-cols-3 gap-3 bg-neutral-50/50 p-3 rounded-2xl border border-neutral-100/80 text-center mb-8 max-w-md mx-auto shadow-3xs">
        <div className="bg-white p-3 rounded-xl border border-neutral-100 shadow-2xs">
          <p className="text-[10px] text-neutral-400 font-black uppercase tracking-wider">
            অক্ষর
          </p>
          <p className="text-sm font-mono font-black text-slate-800 mt-1">
            {scoreSummary.letterScore} / ৪
          </p>
        </div>
        <div className="bg-white p-3 rounded-xl border border-neutral-100 shadow-2xs">
          <p className="text-[10px] text-neutral-400 font-black uppercase tracking-wider">
            উচ্চারণ
          </p>
          <p className="text-sm font-mono font-black text-slate-800 mt-1">
            {scoreSummary.pronunciationScore} / ৪
          </p>
        </div>
        <div className="bg-white p-3 rounded-xl border border-neutral-100 shadow-2xs">
          <p className="text-[10px] text-neutral-400 font-black uppercase tracking-wider">
            শব্দার্থ
          </p>
          <p className="text-sm font-mono font-black text-slate-800 mt-1">
            {scoreSummary.meaningScore} / ৪
          </p>
        </div>
      </div>

      {/* 🎯 কাস্টম মোটিভেশনাল ও এডুকেশন গাইডলাইন বক্স */}
      <div className="bg-[#FDFBF7] border-2 border-[#0B5D3B]/40 rounded-[2rem] p-6 text-left relative overflow-hidden group max-w-xl mx-auto shadow-3xs">
        <div className="absolute top-0 right-0 w-24 h-24 opacity-5 pointer-events-none bg-[#0B5D3B] rounded-bl-full" />
        <span className="text-xs font-black text-[#0B5D3B] uppercase bg-emerald-50 px-3 py-1 rounded-md border border-[#D1EDE4]">
          ইলমি সফরের পরামর্শ
        </span>
        <p className="text-xs md:text-sm text-slate-600 font-bold mt-4 leading-relaxed text-justify">
          {config.motivation}
        </p>

        {/* 🎯 কোর্সসমূহ পেজে রিডাইরেক্ট করার সিঙ্গেল অ্যাকশন বোতাম */}
        <Link
          href="/education"
          className="mt-6 w-full py-4 bg-[#0B5D3B] hover:bg-[#074229] text-white text-xs md:text-sm font-black rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer group shadow-md shadow-emerald-950/10 active:scale-[0.99]"
        >
          আমাদের কোর্সসমূহ দেখুন
          <ArrowRight
            size={14}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </div>
    </motion.div>
  );
}