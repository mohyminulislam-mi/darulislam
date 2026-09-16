"use client";
import React from "react";
import { ArrowUpRight, BookOpen, Sparkles, Heart } from "lucide-react";

const ShopPromoGrid = () => {
  const promos = [
    {
      id: 1,
      tag: "নতুন কালেকশন",
      title: "প্রিমিয়াম জায়নামাজ ও আতর সম্ভার",
      desc: "ইবাদতে প্রশান্তি নিশ্চিত করতে আমাদের বাছাইকৃত সেরা কালেকশন",
      icon: <Sparkles className="w-5 h-5 text-emerald-600" />,
      bgGradient: "from-emerald-50/80 via-white to-emerald-50/30",
      borderColor: "border-emerald-100/70",
      tagBg: "bg-emerald-100 text-emerald-800",
    },
    {
      id: 2,
      tag: "বিশেষ উপহার",
      title: "ইসলামিক বই ও কিতাব কম্বো",
      desc: "প্রিয়জনকে দ্বীনি জ্ঞান উপহার দিতে আমাদের বিশেষ প্যাকেজসমূহ",
      icon: <BookOpen className="w-5 h-5 text-amber-600" />,
      bgGradient: "from-amber-50/60 via-white to-amber-50/20",
      borderColor: "border-amber-100/70",
      tagBg: "bg-amber-100 text-amber-800",
    },
  ];

  return (
    <section className="px-4 py-4 md:py-6 max-w-7xl mx-auto space-y-6">
      {/* 📜 ১. ইসলামিক মোটিভেশনাল কোট বার (ব্র্যান্ড ভ্যালু তৈরি করবে) */}
      <div className="relative bg-gradient-to-r from-[#0B5D3B] to-[#0c462a] text-white p-5 md:p-6 rounded-[2rem] shadow-md overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        {/* ব্যাকগ্রাউন্ড ওয়াটারমার্ক ডিজাইন */}
        <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 opacity-5 pointer-events-none">
          <Heart className="w-64 h-64" />
        </div>

        <div className="space-y-1">
          <p className="text-[11px] font-black text-emerald-300 uppercase tracking-widest">
            আল-হাদিস / বাণী
          </p>
          <h3 className="text-sm md:text-base font-bold text-neutral-100 leading-relaxed max-w-3xl">
            "সত ও আমানতদার ব্যবসায়ী কিয়ামতের দিন নবী সিদ্দিক ও শহীদগণের সাথে
            থাকবেন।"
            <span className="text-xs text-emerald-200/80 font-medium block md:inline md:ml-2">
              — (তিরমিযী: ১২০৯)
            </span>
          </h3>
        </div>

        <div className="flex-shrink-0 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-xs font-black tracking-wider text-emerald-100">
          ১০০% হালাল ও বিশ্বস্ত
        </div>
      </div>

      {/* 📱 💻 ২. মডার্ন প্রমোশনাল গ্রিড ব্যানার কার্ড */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {promos.map((promo) => (
          <div
            key={promo.id}
            className={`relative bg-gradient-to-br ${promo.bgGradient} border ${promo.borderColor} p-6 md:p-8 rounded-[2.2rem] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group overflow-hidden`}
          >
            {/* আল আলংকারিক সার্কেল ডট */}
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/60 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>

            <div>
              {/* ট্যাগ ও আইকন */}
              <div className="flex items-center justify-between mb-5">
                <span
                  className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider ${promo.tagBg}`}
                >
                  {promo.tag}
                </span>
                <div className="w-9 h-9 bg-white border border-neutral-100 rounded-xl flex items-center justify-center shadow-sm">
                  {promo.icon}
                </div>
              </div>

              {/* টাইটেল ও সাবটাইটেল */}
              <h2 className="text-base md:text-xl font-black text-neutral-800 leading-snug">
                {promo.title}
              </h2>
              <p className="text-xs font-medium text-neutral-500 mt-2 leading-relaxed max-w-sm">
                {promo.desc}
              </p>
            </div>

            {/* অ্যাকশন লিংক বাটন */}
            <div className="mt-6 pt-4 border-t border-neutral-100/50 flex items-center justify-between text-xs font-black text-neutral-700 group-hover:text-[#0B5D3B] transition-colors">
              <span>কালেকশন দেখুন</span>
              <div className="w-7 h-7 bg-white group-hover:bg-[#0B5D3B] border border-neutral-100 group-hover:border-[#0B5D3B] text-neutral-400 group-hover:text-white rounded-lg flex items-center justify-center transition-all group-hover:rotate-45">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ShopPromoGrid;
