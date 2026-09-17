"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const FreeTest = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBanner(true);
    }, 3000); // ৫ সেকেন্ড পর স্লাইড-ইন করবে ভাই

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative overflow-hidden bg-brand-pale/60 px-5 py-10 md:py-16">
      <div className="max-w-6xl mx-auto relative z-10">
        <AnimatePresence>
          {showBanner && (
            <motion.div
              key="quiz-promo-banner"
              initial={{ opacity: 0, y: 50, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.98 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mt-12 overflow-hidden rounded-[2rem] border border-green-200 bg-white p-6 md:p-8 shadow-[0_15px_40px_rgba(14,61,47,0.08)] flex flex-col md:flex-row md:items-center justify-between gap-6 relative"
            >
              {/* মডার্ন ব্যাকগ্রাউন্ড ডেকোরেশন শেপ */}
              <div className="absolute -left-10 -bottom-10 w-36 h-36 bg-brand/10 rounded-full blur-xl pointer-events-none" />

              {/* বাম পাশের কন্টেন্ট এরিয়া */}
              <div className="space-y-4 max-w-2xl relative z-10">
                <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">
                  মাত্র ২ মিনিটের ফ্রি টেস্টে জেনে নিন আপনি কতটুকু কুরআন পারেন
                </h3>
                <p className="text-xs md:text-sm text-slate-500 font-bold">
                  ১২টি ছোট ও সহজ প্রশ্নের উত্তর দিয়েই জেনে নিন আপনার কুরআন পড়ার
                  বর্তমান লেভেল কোনটি।
                </p>

                {/* ইনলাইন ফিচার বুলেটস (স্ক্রিনশটের হুবহু রি-ডিজাইন) */}
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1">
                  <div className="flex items-center gap-1.5 text-xs font-black text-brand">
                    <CheckCircle2 size={14} className="fill-brand-pale" />{" "}
                    তাৎক্ষণিক ফলাফল
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-black text-brand">
                    <CheckCircle2 size={14} className="fill-brand-pale" />{" "}
                    পার্সোনালাইজড সাজেশন
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-black text-brand">
                    <CheckCircle2 size={14} className="fill-brand-pale" />{" "}
                    সম্পূর্ণ ফ্রি টেস্ট
                  </div>
                </div>
              </div>

              {/* ডান পাশের গেমিফাইড কল-টু-অ্যাকশন বাটন */}
              <div className="shrink-0 relative z-10 flex items-center">
                <Link
                  href="/quiz-test"
                  className="w-full md:w-auto px-6 py-4 bg-brand hover:bg-brand-dark text-white text-xs md:text-sm font-black rounded-2xl transition-all flex items-center justify-center gap-2 group shadow-md shadow-emerald-950/10 active:scale-[0.98] cursor-pointer"
                >
                  ফ্রি টেস্ট শুরু করুন
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default FreeTest;
