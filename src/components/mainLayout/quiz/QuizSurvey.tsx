"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { HelpCircle, ChevronRight, Loader2, CheckCircle2 } from "lucide-react";

interface SurveyProps {
  isPending: boolean;
  onComplete: (survey: {
    knowsReading: string;
    namazFocus: string;
    userFacingProblems: string;
  }) => void;
}

export default function QuizSurvey({ isPending, onComplete }: SurveyProps) {
  const [knowsReading, setKnowsReading] = useState("");
  const [namazFocus, setNamazFocus] = useState("");
  const [userFacingProblems, setUserFacingProblems] = useState("");

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    if (knowsReading && namazFocus) {
      onComplete({
        knowsReading,
        namazFocus,
        userFacingProblems: userFacingProblems.trim(),
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-3xl mx-auto bg-white border border-neutral-100 rounded-[2.5rem] p-6 md:p-10 shadow-[0_20px_50px_rgba(11,93,59,0.02)]"
    >
      <div className="text-center mb-8 border-b pb-5 border-neutral-100/70">
        <h2 className="text-xl font-black text-slate-800 flex items-center justify-center gap-2">
          <HelpCircle className="text-[#0B5D3B]" size={22} /> আর মাত্র কয়েকটি
          প্রশ্ন
        </h2>
        <p className="text-xs text-neutral-400 font-bold mt-1.5">
          সঠিক ফলাফল ও মূল্যায়ন পরামর্শ পেতে নিচের প্রশ্নগুলোর উত্তর দিন ভাই।
        </p>
      </div>

      <form onSubmit={handleFinish} className="space-y-8 text-left">
        {/* 🎯 প্রশ্ন ১: কুরআন শুদ্ধি জ্ঞান (রেফারেন্স স্ক্রিনশটের মতো ফুল-উইডথ ভার্টিক্যাল রো) */}
        <div className="space-y-3">
          <label className="block text-sm md:text-base font-black text-slate-800">
            ১. আপনি কি কুরআন শুদ্ধ করে পড়তে জানেন?
          </label>
          <div className="flex flex-col gap-3 max-w-2xl">
            {["পড়ি কিন্তু শুদ্ধ হয় না", "শুদ্ধ হয়", "শুদ্ধ হয় না"].map(
              (opt) => {
                const isSelected = knowsReading === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setKnowsReading(opt)}
                    className={`w-full p-4.5 rounded-2xl border text-sm md:text-base font-bold transition-all duration-200 flex items-center justify-between text-left cursor-pointer select-none active:scale-[0.99] ${
                      isSelected
                        ? "bg-[#EAF7F4] border-2 border-[#0B5D3B] text-[#0B5D3B] shadow-3xs"
                        : "bg-white border-neutral-200/80 text-slate-700 hover:bg-neutral-50/80 hover:border-neutral-300"
                    }`}
                  >
                    <span>{opt}</span>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                      >
                        <CheckCircle2
                          size={18}
                          className="text-[#0B5D3B] shrink-0 fill-[#EAF7F4]"
                        />
                      </motion.div>
                    )}
                  </button>
                );
              },
            )}
          </div>
        </div>

        {/* 🎯 প্রশ্ন ২: নামাজ একাগ্রতা ট্র্যাকিং */}
        <div className="space-y-3">
          <label className="block text-sm md:text-base font-black text-slate-800">
            ২. আপনার নামাজে মনোযোগ কেমন থাকে ভাই?
          </label>
          <div className="flex flex-col gap-3 max-w-2xl">
            {["মনোযোগ অনেক ভালো", "ধরে রাখতে পারি না", "মোটামুটি থাকে"].map(
              (opt) => {
                const isSelected = namazFocus === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setNamazFocus(opt)}
                    className={`w-full p-4.5 rounded-2xl border text-sm md:text-base font-bold transition-all duration-200 flex items-center justify-between text-left cursor-pointer select-none active:scale-[0.99] ${
                      isSelected
                        ? "bg-[#EAF7F4] border-2 border-[#0B5D3B] text-[#0B5D3B] shadow-3xs"
                        : "bg-white border-neutral-200/80 text-slate-700 hover:bg-neutral-50/80 hover:border-neutral-300"
                    }`}
                  >
                    <span>{opt}</span>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                      >
                        <CheckCircle2
                          size={18}
                          className="text-[#0B5D3B] shrink-0 fill-[#EAF7F4]"
                        />
                      </motion.div>
                    )}
                  </button>
                );
              },
            )}
          </div>
        </div>

        {/* প্রশ্ন ৩: ওপেন টেক্সট এরিয়া বক্স */}
        <div className="space-y-3">
          <label className="block text-sm md:text-base font-black text-slate-800">
            ৩. কুরআন তিলাওয়াত শিখতে কোন সমস্যাগুলো ফেস করছেন? (ঐচ্ছিক)
          </label>
          <textarea
            rows={4}
            value={userFacingProblems}
            onChange={(e) => setUserFacingProblems(e.target.value)}
            placeholder="আপনার সমস্যা বা মূল লক্ষ্যটি এখানে সংক্ষেপে লিখুন..."
            className="w-full max-w-2xl border border-neutral-200 bg-neutral-50/40 rounded-2xl p-4 text-xs md:text-sm focus:outline-none focus:border-[#0B5D3B] focus:bg-white transition-all text-neutral-800 leading-relaxed resize-none font-medium"
          />
        </div>

        {/* সাবমিট অ্যাকশন বাটন */}
        <div className="pt-4 max-w-2xl">
          <button
            type="submit"
            disabled={!knowsReading || !namazFocus || isPending}
            className="w-full py-4.5 bg-[#0B5D3B] hover:bg-[#074229] disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed text-white text-sm md:text-base font-black rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-950/10 active:scale-[0.99]"
          >
            {isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <CheckCircle2 size={16} /> ফলাফল ও পরামর্শ বিবরণী দেখুন{" "}
                <ChevronRight size={16} />
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}