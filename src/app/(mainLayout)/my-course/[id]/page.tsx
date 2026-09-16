"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  CheckCircle2,
  Video,
  HelpCircle,
  Lock,
  ExternalLink,
  UploadCloud,
  CheckCircle,
} from "lucide-react";
import LoadingSpinner from "@/src/components/shared/spinner/LoadingSpinner";

const INITIAL_MODULES_DATA = [
  {
    id: "session-01",
    type: "live",
    title: "লাইভ সেশন ০১ : পরিচিতি ও ড্যাশবোর্ড সেটআপ",
    instructor: "মাওলানা রফিকুল ইসলাম",
    time: "আজ রাত ০৯:০০ টা",
    meetLink: "https://meet.google.com/abc-defg-hij",
    description:
      "আমাদের আজকের ক্লাসটি Google Meet-এর মাধ্যমে লাইভ পরিচালনা করা হবে। ক্লাসে যোগ দিতে নিচের বাটনে ক্লিক করুন।",
    isLocked: false,
  },
  {
    id: "assign-01",
    type: "assignment",
    title: "অ্যাসাইনমেন্ট-০১: বেসিক থিওরি ও নোট সাবমিশন",
    description:
      "গত ৩টি সেশনে যা শেখানো হয়েছে, তার উপর একটি সংক্ষিপ্ত বিবরণী লিখে ডক ফাইল অথবা ড্রাইভ লিংক আকারে নিচে সাবমিট করুন।",
    isLocked: false,
  },
  {
    id: "session-02",
    type: "live",
    title: "লাইভ সেশন ০২ : অ্যাডভান্সড ডেটাবেজ ও স্কিমা ডিজাইন",
    instructor: "মাওলানা রফিকুল ইসলাম",
    time: "আগামীকাল রাত ০৯:০০ টা",
    meetLink: "https://meet.google.com/xyz-mno-pqr",
    description:
      "দ্বিতীয় সেশনে আমরা রিলেশনাল এবং নন-রিলেশনাল ডেটাবেজের আর্কিটেকচার নিয়ে প্র্যাক্টিক্যাল আলোচনা করব।",
    isLocked: false,
  },
  {
    id: "resource-01",
    type: "resource",
    title: "০৩. ক্লাসের প্রয়োজনীয় সোর্স কোড ও পিডিএফ গাইড",
    description:
      "এই মডিউলের সব রেফারেন্স বুক লিংক এবং গিটহাব সোর্স কোড এখানে পেয়ে যাবেন।",
    isLocked: true,
  },
];

const MyCourseDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [modules, setModules] = useState<any[]>(INITIAL_MODULES_DATA);

  const [activeItem, setActiveItem] = useState<any>(INITIAL_MODULES_DATA[0]);
  const [completedItems, setCompletedItems] = useState<string[]>([]);
  const [assignmentSubmitted, setAssignmentSubmitted] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    const loadCourseData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/education.json");
        const data = await response.json();
        const allCourses = data?.freeCoursesData?.courses || [];
        const matched = allCourses.find((c: any) => c.id === Number(id));
        setCourse(matched || null);

        // ei data amar pore dynamic korte kaje lagbe mohyminul bhai
        // if (matched?.modules) {
        //   setModules(matched.modules);
        //   setActiveItem(matched.modules[0]);
        // }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) loadCourseData();
  }, [id]);

  const toggleItemComplete = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (completedItems.includes(itemId)) {
      setCompletedItems(completedItems.filter((id) => id !== itemId));
    } else {
      setCompletedItems([...completedItems, itemId]);
    }
  };

  const handleAssignmentSubmit = (itemId: string) => {
    setAssignmentSubmitted((prev) => ({ ...prev, [itemId]: true }));
    if (!completedItems.includes(itemId)) {
      setCompletedItems((prev) => [...prev, itemId]);
    }
  };

  const isAllModulesFinished = modules
    .filter((m) => !m.isLocked)
    .every((m) => completedItems.includes(m.id) || assignmentSubmitted[m.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
        <LoadingSpinner />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] p-4 text-center">
        <div className="bg-white p-8 rounded-[2rem] border border-neutral-100 shadow-sm max-w-sm w-full">
          <HelpCircle className="text-red-400 mx-auto mb-3" size={40} />
          <h2 className="text-base font-black text-slate-800">
            কোর্সটি খুঁজে পাওয়া যায়নি!
          </h2>
          <button
            onClick={() => router.push("/student-profile")}
            className="mt-4 hover:cursor-pointer w-full py-2.5 bg-slate-950 hover:bg-[#0B5D3B] text-white text-xs font-bold rounded-xl transition-all shadow-sm"
          >
            ড্যাশবোর্ডে ফিরে যান
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16 pt-24 md:pt-28 lg:pt-32 font-sans relative z-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Back navigation */}
        <button
          onClick={() => router.back()}
          className="mb-6 hover:cursor-pointer inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#0B5D3B] transition-colors bg-white px-4 py-2 rounded-full border border-neutral-100 shadow-sm"
        >
          <ArrowLeft size={14} />
          <span>ড্যাশবোর্ডে ফিরে যান</span>
        </button>

        {/* Dynamic Main Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Column: Content Workspace */}
          <div className="lg:col-span-2 space-y-6">
            {/* 🟢 Live Class Workspace */}
            {activeItem?.type === "live" && (
              <div className="bg-gradient-to-br from-[#0d4d2e] via-[#052214] to-black rounded-[2rem] p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-neutral-100 animate-fadeIn">
                <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-[#0B5D3B]/30 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-white/10 px-2.5 py-1 rounded-md border border-white/5">
                      লাইভ সেশন ড্যাশবোর্ড
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
                      {activeItem.title}
                    </h2>
                    <p className="text-xs text-slate-300 font-medium">
                      প্রশিক্ষক:{" "}
                      <span className="text-white font-bold">
                        {activeItem.instructor}
                      </span>{" "}
                      | সময়:{" "}
                      <span className="text-emerald-400 font-bold">
                        {activeItem.time}
                      </span>
                    </p>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
                    {activeItem.description}
                  </p>

                  <div className="pt-2">
                    <a
                      href={activeItem.meetLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#0B5D3B] hover:bg-[#0c462a] text-white font-bold text-xs rounded-xl shadow-md transition-all border border-white/10 active:scale-95"
                    >
                      <Video size={16} />
                      <span>গুগল মিট ক্লাসে জয়েন করুন</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {activeItem?.type === "assignment" && (
              <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-neutral-100 shadow-xl space-y-4 animate-fadeIn">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm sm:text-base font-black text-slate-800 flex items-center gap-2">
                    <span>📝 মডিউল অ্যাসাইনমেন্ট হাব</span>
                  </h3>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-md ${assignmentSubmitted[activeItem.id] ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}
                  >
                    {assignmentSubmitted[activeItem.id]
                      ? "সাবমিট করা হয়েছে"
                      : "পেন্ডিং"}
                  </span>
                </div>

                <div className="p-5 bg-slate-50/80 rounded-2xl border border-neutral-200/60 space-y-2">
                  <h4 className="text-xs sm:text-sm font-black text-slate-700">
                    {activeItem.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    {activeItem.description}
                  </p>
                </div>

                {!assignmentSubmitted[activeItem.id] ? (
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <input
                      type="text"
                      placeholder="আপনার অ্যাসাইনমেন্ট ড্রাইভ লিংকটি এখানে দিন..."
                      className="flex-1 px-4 py-2.5 bg-slate-50 border border-neutral-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0B5D3B] transition-all"
                    />
                    <button
                      onClick={() => handleAssignmentSubmit(activeItem.id)}
                      className="px-5 py-2.5 bg-slate-950 hover:bg-[#0B5D3B] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 whitespace-nowrap"
                    >
                      <UploadCloud size={14} />
                      অ্যাসাইনমেন্ট সাবমিট করুন
                    </button>
                  </div>
                ) : (
                  <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2 text-emerald-800 text-xs font-bold shadow-sm">
                    <CheckCircle
                      className="text-emerald-600 shrink-0"
                      size={18}
                    />
                    <span>
                      আলহামদুলিল্লাহ্‌! আপনার অ্যাসাইনমেন্টটি সফলভাবে জমা নেওয়া
                      হয়েছে। ওস্তাদ দ্রুত মূল্যায়ন করবেন।
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Common Course Information Card */}
            <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-neutral-100 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] sm:text-xs font-bold text-[#0B5D3B] bg-[#0B5D3B]/5 px-3 py-1 rounded-md">
                  {course.details.batchInfo.split(" ")[0]}
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-md">
                  লাইভ সেশন অ্যাক্সেস
                </span>
              </div>

              <h1 className="text-lg sm:text-2xl font-black text-slate-800 leading-snug">
                {course.details.fullTitle}
              </h1>

              <div className="h-px bg-neutral-100 w-full"></div>

              <div className="space-y-2">
                <h3 className="text-xs sm:text-sm font-black text-slate-400 uppercase tracking-wider">
                  কোর্সের বিবরণ
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  {course.details.description}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Course Outline Sidebar */}
          <div className="bg-white rounded-[2rem] border border-neutral-100 shadow-sm overflow-hidden flex flex-col justify-between lg:sticky lg:top-28">
            <div className="p-5 bg-slate-50/80 border-b border-neutral-100">
              <h3 className="text-xs sm:text-sm font-black text-slate-800">
                লাইভ সেশন ও মডিউল লিস্টিং
              </h3>
              <p className="text-[10px] sm:text-xs text-slate-400 font-medium mt-0.5">
                রিসোর্সে ক্লিক করে বামপাশে বিস্তারিত দেখুন
              </p>
            </div>

            {/* Playlist Content Layer - Map over dynamic modules */}
            <div className="divide-y divide-neutral-100 overflow-y-auto max-h-[380px] sm:max-h-[450px]">
              {modules.map((item, index) => {
                if (item.isLocked) {
                  return (
                    <div
                      key={item.id}
                      className="p-4 flex items-start gap-3.5 text-slate-400 bg-slate-50/40"
                    >
                      <Lock
                        size={16}
                        className="mt-0.5 shrink-0 text-slate-300"
                      />
                      <div className="space-y-1">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-400 leading-snug">
                          {item.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-medium inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md">
                          <FileText size={10} /> স্টাডি রিসোর্স ফাইল
                        </span>
                      </div>
                    </div>
                  );
                }

                const isSelected = activeItem?.id === item.id;
                const isCompleted =
                  completedItems.includes(item.id) ||
                  assignmentSubmitted[item.id];

                return (
                  <div
                    key={item.id}
                    onClick={() => setActiveItem(item)}
                    className={`p-4 flex items-start gap-3.5 cursor-pointer transition-all border-l-4 ${isSelected ? "bg-[#0B5D3B]/5 border-[#0B5D3B]" : "border-transparent hover:bg-slate-50"}`}
                  >
                    <div
                      onClick={(e) => toggleItemComplete(item.id, e)}
                      className="mt-0.5 shrink-0 transition-transform active:scale-95"
                    >
                      {isCompleted ? (
                        <CheckCircle2 size={18} className="text-[#0B5D3B]" />
                      ) : (
                        <div className="w-[18px] h-[18px] rounded-full border-2 border-neutral-300 hover:border-[#0B5D3B]"></div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <h4
                        className={`text-xs sm:text-sm font-bold leading-snug ${isSelected ? "text-slate-950" : "text-slate-700"}`}
                      >
                        {item.title}
                      </h4>
                      <span
                        className={`text-[10px] font-bold inline-flex items-center gap-1 px-2 py-0.5 rounded-md ${
                          item.type === "live"
                            ? "text-[#0B5D3B] bg-white border border-[#0B5D3B]/10"
                            : isCompleted
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {item.type === "live" ? (
                          <Video size={10} />
                        ) : (
                          <FileText size={10} />
                        )}
                        {item.type === "live"
                          ? "লাইভ ক্লাস"
                          : isCompleted
                            ? "টাস্ক কমপ্লিট"
                            : "অ্যাসাইনমেন্ট জমা দিন"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 bg-slate-50 border-t border-neutral-100 space-y-2">
              <button
                onClick={() => {
                  if (isAllModulesFinished) {
                    router.push("/education");
                  } else {
                    alert(
                      "দয়া করে সবকটি লাইভ ক্লাস এবং অ্যাসাইনমেন্ট মডিউল সম্পন্ন করুন!",
                    );
                  }
                }}
                disabled={!isAllModulesFinished}
                className={`w-full py-3 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer ${
                  isAllModulesFinished
                    ? "bg-[#0B5D3B] hover:bg-[#0c462a] text-white"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                }`}
              >
                <CheckCircle2 size={16} />
                <span>কোর্স সম্পন্ন করুন</span>
              </button>
              <div className="text-[9px] text-center font-bold uppercase tracking-widest text-slate-400">
                {course.details.batchInfo}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCourseDetailsPage;