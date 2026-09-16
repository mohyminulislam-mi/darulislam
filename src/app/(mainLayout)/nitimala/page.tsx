"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldAlert,
  ChevronDown,
  BookOpen,
  Clock,
  CreditCard,
  Award,
  FileText,
  HelpCircle,
} from "lucide-react";

const policyCategories = [
  {
    id: "general",
    title: "সাধারণ আচরণবিধি",
    icon: BookOpen,
    color: "from-emerald-50 to-emerald-100 text-emerald-700 border-emerald-200",
    rules: [
      {
        question: "ইনস্টিটিউটের প্রধান শৃঙ্খলা ও নীতিমালা কী?",
        answer:
          "দারুল ইসলাম ইনস্টিটিউটের সকল শিক্ষার্থীকে ইসলামি মূল্যবোধ, পারস্পরিক শ্রদ্ধা এবং অ্যাকাডেমিক সততা বজায় রাখতে হবে। লাইভ ক্লাস বা ফোরামে কোনো প্রকার অশালীন আচরণ কঠোরভাবে নিষিদ্ধ।",
      },
      {
        question: "অনলাইন ক্লাসে উপস্থিতি ও পরিবেশ কেমন হওয়া উচিত?",
        answer:
          "ক্লাস শুরুর অন্তত ৫ মিনিট আগে জয়েন করা বাধ্যতা মূলক। ক্লাসের সময় ভিডিও/অডিও অন রাখার নির্দেশ দিলে তা মেনে চলতে হবে এবং একটি শান্ত পরিবেশ থেকে ক্লাসে অংশ নিতে হবে।",
      },
    ],
  },
  {
    id: "academic",
    title: "অ্যাকাডেমিক ও পরীক্ষা নীতিমালা",
    icon: Clock,
    color: "from-blue-50 to-blue-100 text-blue-700 border-blue-200",
    rules: [
      {
        question: "এসাইনমেন্ট জমা ও কুইজের সময়সীমা",
        answer:
          "প্রতিটি মডিউলের এসাইনমেন্ট নির্দিষ্ট ডেডলাইনের মধ্যে ড্যাশবোর্ডে সাবমিট করতে হবে। যৌক্তিক কারণ ছাড়া লেট সাবমিশনের ক্ষেত্রে মার্কস কর্তন করা হতে পারে।",
      },
      {
        question: "কোর্সের পাসিং মার্কস ও সার্টিফিকেট পাওয়ার যোগ্যতা",
        answer:
          "কোর্সের ফাইনাল সার্টিফিকেট অর্জন করতে হলে প্রতিটি পরীক্ষা, কুইজ এবং এসাইনমেন্ট মিলিয়ে ন্যূনতম ৭০% মার্কস পেতে হবে এবং ক্লাসে অন্তত ৮০% উপস্থিতি থাকতে হবে।",
      },
    ],
  },
  {
    id: "payment",
    title: "ফি ও পেমেন্ট সংক্রান্ত নিয়ম",
    icon: CreditCard,
    color: "from-amber-50 to-amber-100 text-amber-700 border-amber-200",
    rules: [
      {
        question: "মাসিক কোর্স ফি পরিশোধের সময়সীমা",
        answer:
          "চলতি মাসের ফি পরবর্তী মাসের ১০ তারিখের মধ্যে ড্যাশবোর্ডের পেমেন্ট গেটওয়ের মাধ্যমে পরিশোধ করতে হবে। নির্ধারিত সময়ের পর স্বয়ংক্রিয়ভাবে সাময়িক অ্যাকাউন্ট হোল্ড হতে পারে।",
      },
      {
        question: "রিফান্ড পলিসি (Refund Policy)",
        answer:
          "কোর্স শুরু হওয়ার প্রথম ৭ দিনের মধ্যে কোনো শিক্ষার্থী কোর্সটি কন্টিনিউ করতে না চাইলে উপযুক্ত কারণ দর্শিয়ে রিফান্ডের আবেদন করতে পারবেন। ৭ দিন পর কোনো রিফান্ড গ্রহণযোগ্য নয়।",
      },
    ],
  },
  {
    id: "suspension",
    title: "অ্যাকাউন্ট সাময়িক বা স্থায়ী বাতিলকরণ",
    icon: ShieldAlert,
    color: "from-rose-50 to-rose-100 text-rose-700 border-rose-200",
    rules: [
      {
        question: "কোন কোন কারণে অ্যাকাউন্ট সাসপেন্ড হতে পারে?",
        answer:
          "কোর্সের প্রিমিয়াম ভিডিও বা রিসোর্স পাইরেসি করলে, অন্য কারো সাথে নিজের ড্যাশবোর্ড অ্যাকাউন্ট শেয়ার করলে কিংবা ইনস্টিটিউটের নিয়মের চরম লঙ্ঘন করলে কোনো নোটিশ ছাড়াই অ্যাকাউন্ট স্থায়ীভাবে ব্যান করা হবে।",
      },
    ],
  },
];

const StudentRulesPage = () => {
  const [activeCategory, setActiveCategory] = useState("general");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const currentCategoryData = policyCategories.find(
    (cat) => cat.id === activeCategory,
  );

  return (
    <article className="pt-24 md:pt-28 pb-12 px-4 font-sans max-w-5xl mx-auto space-y-8">
      <header className="bg-gradient-to-br from-[#0B5D3B] to-[#0c4a2d] text-white p-6 md:p-10 rounded-3xl shadow-xl relative overflow-hidden">
        <div
          className="absolute right-0 top-0 opacity-10 transform translate-x-6 -translate-y-6 pointer-events-none"
          aria-hidden="true"
        >
          <FileText size={200} />
        </div>
        <div className="relative z-10 max-w-2xl">
          <span className="bg-white/20 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">
            স্টুডেন্ট গাইডলাইন
          </span>
          <h1 className="text-2xl md:text-4xl font-black mt-3 tracking-tight leading-tight">
            ইনস্টিটিউটের নীতিমালা ও ছাত্র নির্দেশিকা
          </h1>
          <p className="text-xs md:text-base text-emerald-100/90 mt-3 leading-relaxed">
            দারুল ইসলাম ইনস্টিটিউটের একজন আদর্শ শিক্ষার্থী হিসেবে অ্যাকাডেমিক
            শৃঙ্খলা ও ইসলামি মূল্যবোধ বজায় রাখার জন্য নিচের নীতিমালাগুলো মনোযোগ
            দিয়ে পড়ুন এবং অনুসরণ করুন।
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        <aside className="md:col-span-4 bg-white border border-neutral-100 shadow-sm rounded-2xl md:rounded-3xl p-3 space-y-1.5 md:sticky md:top-28 z-10 overflow-hidden">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider px-3 mb-2">
            নীতিমালা ক্যাটাগরি
          </p>
          <div
            className="grid grid-cols-2 md:flex md:flex-col gap-1.5 pb-2 md:pb-0" // মোবাইলে grid-cols-2 এবং md তে flex-col করা হয়েছে
            role="tablist"
          >
            {policyCategories.map((category) => {
              const IconComponent = category.icon;
              const isActive = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => {
                    setActiveCategory(category.id);
                    setExpandedIndex(0);
                  }}
                  className={`w-full text-left px-3 py-2.5 md:px-4 md:py-3 rounded-xl md:rounded-2xl flex items-center gap-2 md:gap-3 font-bold text-xs md:text-sm transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#0B5D3B] text-white shadow-md shadow-emerald-900/10"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-lg border flex-shrink-0 ${isActive ? "bg-white/20 border-white/10 text-white" : "bg-neutral-50 border-neutral-100 text-neutral-500"}`}
                  >
                    <IconComponent size={16} />
                  </div>
                  <span className="flex-1 line-clamp-1 md:line-clamp-none">
                    {category.title}
                  </span>{" "}
                </button>
              );
            })}
          </div>
        </aside>

        <main className="md:col-span-8 space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div
                className={`p-4 rounded-2xl border bg-gradient-to-r flex items-center gap-3 ${currentCategoryData?.color}`}
              >
                {currentCategoryData && (
                  <currentCategoryData.icon size={20} aria-hidden="true" />
                )}
                <h2 className="font-extrabold text-sm md:text-lg">
                  {currentCategoryData?.title}
                </h2>
              </div>

              {/* অ্যাকর্ডিয়ন লিস্ট */}
              <div className="space-y-3">
                {currentCategoryData?.rules.map((rule, idx) => {
                  const isExpanded = expandedIndex === idx;
                  return (
                    <section
                      key={idx}
                      className="bg-white border border-neutral-100 rounded-2xl overflow-hidden shadow-sm hover:border-neutral-200/80 transition-all"
                    >
                      {/* প্রশ্ন/হেডার বাটন */}
                      <button
                        onClick={() =>
                          setExpandedIndex(isExpanded ? null : idx)
                        }
                        aria-expanded={isExpanded}
                        className="w-full text-left p-4 md:p-5 flex justify-between items-center gap-4 cursor-pointer group"
                      >
                        <div className="flex items-start gap-2.5">
                          <HelpCircle
                            size={18}
                            className="text-emerald-600 shrink-0 mt-0.5"
                            aria-hidden="true"
                          />
                          <h3 className="font-bold text-xs md:text-base text-neutral-800 group-hover:text-neutral-900 transition-colors">
                            {rule.question}
                          </h3>
                        </div>
                        <ChevronDown
                          size={16}
                          className={`text-neutral-400 shrink-0 transition-transform duration-300 ${
                            isExpanded
                              ? "transform rotate-180 text-emerald-600"
                              : ""
                          }`}
                          aria-hidden="true"
                        />
                      </button>

                      {/* উত্তর/কনটেন্ট বডি (অ্যানিমেশন সহ) */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                          >
                            <div className="px-4 pb-5 md:px-5 md:pb-6 pt-0 border-t border-neutral-50 text-xs md:text-sm text-neutral-600 leading-relaxed bg-neutral-50/40">
                              <p>{rule.answer}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </section>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* অতিরিক্ত সাহায্য/যোগাযোগ নোট */}
          <footer className="bg-amber-50/60 border border-amber-100 p-4 rounded-2xl flex items-start gap-3 mt-6">
            <Award
              className="text-amber-600 shrink-0 mt-0.5"
              size={18}
              aria-hidden="true"
            />
            <p className="text-[11px] md:text-xs text-amber-800 leading-relaxed">
              <strong>বিশেষ দ্রষ্টব্য:</strong> দারুল ইসলাম ইনস্টিটিউট যেকোনো
              সময়ে পরিবেশ ও পরিস্থিতির প্রেক্ষিতে নীতিমালার সংশোধন বা পরিমার্জন
              করার অধিকার সংরক্ষণ করে। কোনো নীতিমালার বিষয়ে বুঝতে সমস্যা হলে
              সাপোর্ট টিকেট ওপেন করুন।
            </p>
          </footer>
        </main>
      </div>
    </article>
  );
};

export default StudentRulesPage;
