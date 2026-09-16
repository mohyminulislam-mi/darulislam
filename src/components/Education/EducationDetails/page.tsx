"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Clock,
  Calendar,
  Users,
  HelpCircle,
  Minus,
  Plus,
  GraduationCap,
  Star,
  Clock1,
  Calendar1,
} from "lucide-react";

interface CourseTabsSectionProps {
  courseData: {
    title: string;
    description: string;
    batchStartDate?: string;
    classSchedule?: string;
    highlights?: Array<{ _id: string; label: string; value: string }>;
  };
}

export default function CourseTabsSection({
  courseData,
}: CourseTabsSectionProps) {
  const [activeTab, setActiveTab] = useState<string>("details");
  const [openPlanSections, setOpenPlanSections] = useState<
    Record<string, boolean>
  >({ step1: true });
  const [openFaqs, setOpenFaqs] = useState<Record<string, boolean>>({
    q1: true,
  });

  const togglePlan = (id: string) => {
    setOpenPlanSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleFaq = (id: string) => {
    setOpenFaqs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.35, ease: "easeOut" as const }
    },
    exit: { 
      opacity: 0, 
      y: -15, 
      transition: { duration: 0.2 } 
    },
  };

  const tabsConfig = [
    { id: "details", label: "কোর্স বিস্তারিত", icon: BookOpen },
    { id: "schedule", label: "কোর্স সময়সূচী", icon: Clock },
    { id: "plan", label: "পরিকল্পনা ও মডিউল", icon: Calendar },
    { id: "sisters", label: "মেয়ে শিক্ষার্থীদের জন্য", icon: Users },
    { id: "faq", label: "সচরাচর প্রশ্ন", icon: HelpCircle },
  ];

  return (
    <section className="w-full mt-12 md:mt-20 border-t border-slate-100 pt-10 antialiased text-slate-800 my-10">
      <div className="top-16 md:top-20 z-20 bg-white/95 backdrop-blur-md border border-amber-200 shadow-sm rounded-2xl max-w-5xl mx-auto mb-8">
        <div className="px-4 overflow-x-auto scrollbar-none">
          <div className="flex justify-start md:justify-center items-center gap-1.5 py-3 whitespace-nowrap">
            {tabsConfig.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all relative cursor-pointer ${
                    isActive
                      ? "text-white shadow-md"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <TabIcon className="w-4 h-4 shrink-0" />
                  {tab.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute inset-0 rounded-xl bg-[#005f53] -z-10"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-0">
        <div className="bg-white rounded-3xl p-4 sm:p-6 md:p-10 border border-slate-100 shadow-xs min-h-[420px]">
          <AnimatePresence mode="wait">
            {activeTab === "details" && (
              <motion.div
                key="details"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-12"
              >
                <div className="text-center">
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                    আমাদের কোর্সের উদ্দেশ্য !!
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    "বিশ্বব্যাপী কুরআনের আলো ছড়িয়ে দিতে জেনারেল শিক্ষিত কর্মব্যস্ত মানুষকে সহীহ আকিদাহ ও কুরআন হাদিসের মর্মার্থ বুঝিয়ে দেয়া।",
                    "সর্বোপরি ইলমের শাখায় বিচরণ করে দ্বীন কে আকড়ে ধরে জীবন পরিচালনা করা।",
                    "একজন দায়িত্বশীল দ্বায়ীর ভূমিকা পালন করে নিজের পরিবার থেকে সমাজ পরিবর্তনে কার্যকরী ভূমিকা পালন করা।",
                    "আলেম দের অন্তর থেকে মহব্বত করা এবং সব সময় তাদের প্রতি শ্রদ্ধা পোষণ করা এই চিন্তা করে যে তারা কতই না মেহনত করেন এই রাস্তায়।",
                  ].map((text, idx) => {
                    const bgColors = [
                      "bg-[#eefbf2] border-emerald-200/60",
                      "bg-[#edf7ff] border-blue-200/60",
                      "bg-[#e8fff8] border-teal-200/60",
                      "bg-[#fffbeb] border-amber-200/60",
                    ];
                    return (
                      <motion.div
                        whileHover={{ y: -6, scale: 1.01 }}
                        key={idx}
                        className={`p-6 rounded-2xl border flex flex-col items-center justify-start text-center shadow-xs min-h-[290px] transition-all duration-300 ${bgColors[idx % 4]}`}
                      >
                        <div className="w-16 h-16 bg-[#005f53] rounded-2xl flex items-center justify-center shadow-md mb-6 shrink-0">
                          {idx === 0 && (
                            <BookOpen className="w-7 h-7 text-white" />
                          )}
                          {idx === 1 && (
                            <Users className="w-7 h-7 text-white" />
                          )}
                          {idx === 2 && (
                            <Calendar className="w-7 h-7 text-white" />
                          )}
                          {idx === 3 && (
                            <GraduationCap className="w-7 h-7 text-white" />
                          )}
                        </div>
                        <p className="text-xs md:text-sm font-semibold text-slate-800 leading-relaxed text-center px-1">
                          {text}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="pt-8 border-t border-slate-100">
                  <h3 className="text-base md:text-lg font-black text-center text-slate-900 mb-6">
                    কোর্স টি কাদের জন্য?
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {[
                      "“জেনারেল শিক্ষিত বিভিন্ন পেশার মানুষ যারা ঘরে বসেই অভিজ্ঞ আলেম এর সহবতে দ্বীনি শিক্ষায় এলেম অর্জন করতে চান এবং সে অনুযায়ী আমল করতে চান।”",
                      "“মাদরাসার শিক্ষার্থী যারা দুনিয়াবি কর্মব্যস্ততার জন্য মাদরাসা শিক্ষা পরিপূর্ণ করতে পারেন নি এবং যারা অবসরে অনলাইনে কোর্স করার কথা ভাবছেন।”",
                      "“দুনিয়ার ব্যবস্থাপনা ও দ্বীনের হেফাজতের জন্য জাগতিক ও দ্বীনি শিক্ষার সমন্বয় প্রয়োজন। সময়ক্ষেপণ না করে আল্লাহর সন্তুষ্টি অর্জনের এই পথে আসুন।”",
                    ].map((text, idx) => (
                      <div
                        key={idx}
                        className="bg-[#191e1b] text-amber-50/90 p-6 rounded-2xl border border-amber-500/10 flex items-center shadow-xs"
                      >
                        <p className="text-xs md:text-sm font-medium leading-relaxed text-center w-full">
                          {text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "schedule" && (
              <motion.div
                key="schedule"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="max-w-3xl mx-auto text-center space-y-8"
              >
                <div className="bg-gradient-to-tr from-emerald-50/70 via-white to-teal-50/70 border border-emerald-100/70 p-6 sm:p-8 rounded-3xl shadow-xs relative overflow-hidden">
                  <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto shadow-xs text-2xl mb-4">
                    <Calendar1 />
                  </div>
                  <h2 className="text-lg md:text-2xl font-black text-[#0f2942] leading-snug mb-3">
                    {courseData?.batchStartDate
                      ? `${courseData.batchStartDate} তারিখে আমাদের বিশেষ ওরিয়েন্টেশন ক্লাস অনুষ্ঠিত হবে ইনশাআল্লাহ!`
                      : "ওরিয়েন্টেশন ক্লাস শীঘ্রই শুরু হবে ইনশাআল্লাহ!"}
                  </h2>
                  <p className="text-xs md:text-sm font-extrabold text-emerald-800 bg-emerald-50 px-4 py-1.5 rounded-full inline-block">
                    শিডিউলঃ{" "}
                    {courseData?.classSchedule ||
                      "ভর্তি ফরম পূরণ করার সময় নির্ধারণ করা হবে।"}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="bg-slate-50 border border-slate-200/60 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left px-6 border-l-4 border-l-[#005f53]">
                    <div>
                      <span className="text-sm font-black text-slate-900 block sm:inline mr-2">
                        নিয়মিত অনলাইন সেশন:
                      </span>
                      <span className="text-sm font-bold text-slate-700">
                        {courseData?.classSchedule ||
                          "সাপ্তাহিক রুটিন ক্লাসরুমে প্রদান করা হবে।"}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 bg-white px-3 py-1 rounded-lg border border-slate-200 shrink-0 w-max">
                      বাংলাদেশ সময়
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "plan" && (
              <motion.div
                key="plan"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="max-w-3xl mx-auto space-y-4"
              >
                <div className="text-center mb-6">
                  <h2 className="text-base md:text-lg font-black text-slate-900 flex items-center justify-center gap-2">
                    <GraduationCap className="w-5 h-5 text-[#005f53]" /> কোর্সের
                    গুরুত্বপূর্ণ কারিকুলাম হাইলাইটস
                  </h2>
                </div>

                {courseData?.highlights && courseData?.highlights.length > 0 ? (
                  <div className="border border-slate-200/60 rounded-2xl overflow-hidden bg-white shadow-xs">
                    <button
                      onClick={() => togglePlan("step1")}
                      className="w-full flex items-center justify-between p-4 bg-slate-50/60 hover:bg-slate-50 transition-colors text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base"><BookOpen /></span>
                        <h3 className="text-sm md:text-base font-black text-slate-800">
                          {courseData.title} এর মূল পাঠ্যসমূহ
                        </h3>
                      </div>
                      <div className="flex items-center gap-3">
                        {openPlanSections["step1"] ? (
                          <Minus className="w-4 h-4 text-slate-400" />
                        ) : (
                          <Plus className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </button>

                    <AnimatePresence initial={false}>
                      {openPlanSections["step1"] && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="p-5 border-t border-slate-100 bg-white">
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {courseData.highlights.map((item, idx) => (
                                <li
                                  key={item._id || idx}
                                  className="flex items-start gap-2 text-xs md:text-sm text-slate-600 font-bold"
                                >
                                  <Star className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5 fill-amber-500" />
                                  <span>
                                    {item.label}: {item.value}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <p className="text-center text-xs text-slate-400">
                    কোনো কারিকুলাম সিলেবাস যুক্ত করা হয়নি।
                  </p>
                )}
              </motion.div>
            )}

            {activeTab === "sisters" && (
              <motion.div
                key="sisters"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-8"
              >
                <div className="text-center">
                  <span className="bg-pink-50 border border-pink-100 text-pink-700 text-xs font-semibold px-3.5 py-1.5 rounded-full inline-block mb-2">
                    ফিমেল উইং বিশেষায়িত ক্লাসরুম
                  </span>
                  <h2 className="text-lg md:text-2xl font-black text-slate-900 tracking-tight">
                    বোনদের দ্বীনি শিক্ষার বিশেষায়িত ও নিরাপদ অনলাইন মাধ্যম
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[
                    {
                      text: "যেখানে সুযোগ্য ও অভিজ্ঞ আলেমা উস্তাযাগণ সরাসরি চমৎকার পরিবেশে পাঠদান করেন।",
                      bgColor: "from-emerald-50 to-teal-50 border-emerald-100",
                      emoji: "🧕",
                    },
                    {
                      text: "একাডেমিক সকল সহায়তায় সার্বক্ষণিক একজন ডেডিকেটেড নারী ব্যাচ কো-অর্ডিনেটর নিয়োজিত থাকেন।",
                      bgColor: "from-blue-50 to-indigo-50 border-blue-100",
                      emoji: "👩‍💼",
                    },
                    {
                      text: "এমনকি শরয়ী পর্দার সর্বোচ্চ গুরুত্ব বিবেচনা করে, পরীক্ষার সময়ও কোনো প্রকার ভিডিও চালু করার বাধ্যবাধকতা নেই।",
                      bgColor: "from-rose-50 to-pink-50 border-rose-100",
                      emoji: "🌸",
                    },
                    {
                      text: "আমাদের এখানে নারী শিক্ষার্থীদের জন্য রয়েছে সম্পূর্ণ স্বতন্ত্র, নিরাপদ ও শালীন অনলাইন ক্লাসরুম ব্যবস্থাপনা।",
                      bgColor: "from-amber-50 to-orange-50 border-amber-100",
                      emoji: "🛡️",
                    },
                  ].map((card, idx) => (
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      key={idx}
                      className={`bg-gradient-to-r ${card.bgColor} p-5 rounded-2xl border flex items-start gap-4 shadow-xs`}
                    >
                      <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center text-xl shadow-xs shrink-0 border border-slate-100">
                        {card.emoji}
                      </div>
                      <p className="text-xs md:text-sm font-bold text-slate-700 leading-relaxed pt-0.5">
                        {card.text}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "faq" && (
              <motion.div
                key="faq"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="max-w-2xl mx-auto space-y-4"
              >
                <div className="text-center mb-6">
                  <h2 className="text-lg md:text-2xl font-black text-slate-900">
                    সচরাচর <span className="text-amber-500">প্রশ্নগুলোর</span>{" "}
                    উত্তর
                  </h2>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      q: "আপনাদের সার্টিফিকেট কি মান সম্মত ?",
                      a: "Our certificates are accepted worldwide and backed by IQRA Arabic foundation.",
                    },
                    {
                      q: "কর্মব্যস্ত ব্যক্তিরা কীভাবে সময় মেলাবেন?",
                      a: "Classes take only 1 hour daily, and recorded sessions backup are available anytime.",
                    },
                    {
                      q: "ভর্তি হওয়ার জন্য শিক্ষাগত যোগ্যতা কী প্রয়োজন?",
                      a: "No prior Madrasah or Arabic background required. Anyone who can read/write Bengali can easily join.",
                    },
                  ].map((faq, idx) => {
                    const id = `q-${idx}`;
                    const isOpen = !!openFaqs[id];
                    return (
                      <div
                        key={id}
                        className="border border-slate-100 rounded-xl bg-slate-50/50 px-4"
                      >
                        <button
                          onClick={() => toggleFaq(id)}
                          className="w-full flex items-start justify-between text-left gap-4 py-4 group cursor-pointer"
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-sm font-black text-slate-400 mt-0.5">
                              {idx + 1}
                            </span>
                            <h3 className="text-xs md:text-sm font-black text-slate-800 group-hover:text-[#005f53] transition-colors">
                              {faq.q}
                            </h3>
                          </div>
                          <div
                            className={`p-1 rounded-full transition-all shrink-0 mt-0.5 ${isOpen ? "bg-[#005f53] text-white" : "bg-slate-200 text-slate-600"}`}
                          >
                            {isOpen ? (
                              <Minus className="w-3 h-3" />
                            ) : (
                              <Plus className="w-3 h-3" />
                            )}
                          </div>
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <p className="pl-7 pr-2 pb-4 text-xs md:text-sm text-slate-600 leading-relaxed text-justify border-t border-slate-100 pt-3">
                                {faq.a}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
