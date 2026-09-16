"use client";

import React, { useState, useEffect, Suspense, useMemo } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  FileText,
  CheckCircle2,
  HelpCircle,
  Clock,
  X,
  Sparkles,
  Users,
  CheckCircle,
} from "lucide-react";
import CourseTabsDashboard from "@/src/components/Education/EducationDetails/page";
import TestimonialsSection from "@/src/components/Education/EducationTestimonial/EducationalTestimonial";
import Image from "next/image";
import Swal from "sweetalert2";
import useUserRole from "@/src/app/hooks/useUserRole";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// Clean and minimal batch countdown component
function BatchCountdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference <= 0) {
        setIsExpired(true);
        return;
      }
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (isExpired)
    return (
      <span className="text-red-600 font-bold text-xs">
        ভর্তি বা ক্লাস সেশন চলমান!
      </span>
    );

  const toBanglaNum = (num: number) =>
    String(num).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[+d]);

  return (
    <div className="flex gap-1.5 text-center mt-2">
      <div className="bg-[#fff7e6] px-3 py-1.5 rounded-lg w-full">
        <span className="block text-base font-black text-amber-950">
          {toBanglaNum(timeLeft.days)}
        </span>
        <span className="text-[10px] text-neutral-500 font-bold">দিন</span>
      </div>
      <div className="bg-[#fff7e6] px-3 py-1.5 rounded-lg w-full">
        <span className="block text-base font-black text-amber-950">
          {toBanglaNum(timeLeft.hours)}
        </span>
        <span className="text-[10px] text-neutral-500 font-bold">ঘণ্টা</span>
      </div>
      <div className="bg-[#fff7e6] px-3 py-1.5 rounded-lg w-full">
        <span className="block text-base font-black text-amber-950">
          {toBanglaNum(timeLeft.minutes)}
        </span>
        <span className="text-[10px] text-neutral-500 font-bold">মিনিট</span>
      </div>
      <div className="bg-[#fff7e6] px-3 py-1.5 rounded-lg w-full">
        <span className="block text-base font-black text-amber-950">
          {toBanglaNum(timeLeft.seconds)}
        </span>
        <span className="text-[10px] text-neutral-500 font-bold">সেকেন্ড</span>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";

// Premium Shimmer Skeleton Loader for Page Layout Components
function CourseDetailsSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 pt-24 pb-8 animate-pulse space-y-6">
      <div className="h-10 bg-slate-200 rounded-xl w-32" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-3">
            <div className="h-4 bg-slate-200 rounded-md w-1/4" />
            <div className="h-8 bg-slate-200 rounded-xl w-3/4" />
          </div>
          <div className="h-32 bg-slate-200 rounded-2xl w-full" />
          <div className="h-56 bg-slate-200 rounded-2xl w-full" />
        </div>
        <div className="lg:col-span-1 bg-slate-50 border border-slate-100 rounded-2xl p-6 h-96 space-y-4">
          <div className="h-8 bg-slate-200 rounded-xl w-1/2" />
          <div className="h-12 bg-slate-200 rounded-xl w-full" />
          <div className="h-12 bg-slate-200 rounded-xl w-full" />
        </div>
      </div>
    </div>
  );
}

function CourseDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { role, user, isLoading: isUserLoading } = useUserRole();

  const [courseId, setCourseId] = useState<string>("");
  const [courseTitle, setCourseTitle] = useState<string>("একাডেমিক কোর্স");
  const [batchModalOpen, setBatchModalOpen] = useState(false);
  const [isDataParsing, setIsDataParamParsing] = useState(true);

  const [courseDetails, setCourseDetails] = useState<any>({
    subtitle: "কোর্স সম্পর্কে",
    description: "কোনো বিবরণ প্রদান করা হয়নি।",
    bannerImage:
      "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=1200&auto=format&fit=crop",
    regularPrice: 0,
    discountPrice: 0,
    monthlyFee: null,
    discountPercentage: 0,
    batchStartDate: "শীঘ্রই শুরু হবে",
    couponCode: "N/A",
    highlights: [],
    upcomingBatch: null,
    enrolledStudents: [],
  });

  // Fast parsing configuration
  useEffect(() => {
    const dataParam = searchParams.get("data");
    if (dataParam) {
      try {
        const parsedData = JSON.parse(dataParam);
        if (parsedData) {
          setCourseId(parsedData.id || parsedData._id || "");
          setCourseTitle(parsedData.title || "একাডেমিক কোর্স");

          const detailsObj = parsedData.details || {};

          setCourseDetails({
            title: parsedData.title || "একাডেমিক কোর্স",
            subtitle: "কোর্স সম্পর্কে",
            description:
              detailsObj.description || "এই কোর্সের কোনো বিবরণ পাওয়া যায়নি।",
            bannerImage:
              parsedData.image ||
              "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=1200&auto=format&fit=crop",
            regularPrice: detailsObj.oldAdmissionFee || 0,
            discountPrice: detailsObj.admissionFee || 0,
            monthlyFee: detailsObj.monthlyFee || null,
            discount: detailsObj.discount || 0,
            couponCode: detailsObj.coupon || "N/A",
            batchStartDate:
              detailsObj.batchInfo || "নতুন ব্যাচ শীঘ্রই শুরু হবে",
            classSchedule: detailsObj.batchInfo || "",
            highlights: Array.isArray(detailsObj.highlights)
              ? detailsObj.highlights
              : [],
            upcomingBatch: parsedData.upcomingBatch || null,
            enrolledStudents: parsedData.enrolledStudents || [],
          });
        }
      } catch (error) {
        console.error("Error parsing section data:", error);
      } finally {
        setLoadingFalse();
      }
    } else {
      setLoadingFalse();
    }

    function setLoadingFalse() {
      setIsDataParamParsing(false);
    }
  }, [searchParams]);

  // 🎯 মেগা সিনিয়র ইউএক্স লক: এই সাব-ক্যাটাগরির যেকোনো কোর্সে স্টুডেন্ট অলরেডি ভর্তি আছে কি না তা useMemo দিয়ে ভেরিফিকেশন ভাই
  const isEnrolled = useMemo(() => {
    if (!user?._id) return false;

    // ১. প্রথম লেয়ার চেক: সাব-ক্যাটাগরির রুট লেভেলের enrolledStudents চেক
    if (
      courseDetails.enrolledStudents &&
      Array.isArray(courseDetails.enrolledStudents)
    ) {
      const match = courseDetails.enrolledStudents.some(
        (sid: any) => String(sid?.$oid || sid) === String(user._id),
      );
      if (match) return true;
    }

    // ২. ২য় লেয়ার চেক: আপকামিং ব্যাচের enrolledStudents অবজেক্ট ফিল্টারিং ভাই
    if (
      courseDetails.upcomingBatch?.enrolledStudents &&
      Array.isArray(courseDetails.upcomingBatch.enrolledStudents)
    ) {
      return courseDetails.upcomingBatch.enrolledStudents.some(
        (studentId: any) =>
          String(studentId?.$oid || studentId) === String(user._id),
      );
    }

    return false;
  }, [
    user?._id,
    courseDetails.enrolledStudents,
    courseDetails.upcomingBatch?.enrolledStudents,
  ]);

  useEffect(() => {
    if (courseTitle) {
      document.title = `${courseTitle} | আমাদের অনলাইন মাদ্রাসা`;
    }
  }, [courseTitle]);

  const handleEnrollRedirect = () => {
    if (!courseId || isEnrolled) return;

    if (!user) {
      router.replace(
        `/auth/register?redirect=${encodeURIComponent(`/education/enroll/${courseId}`)}`,
      );
      return;
    }

    if (role && role.toLowerCase() !== "student") {
      return Swal.fire({
        icon: "error",
        title: "অ্যাক্সেস অস্বীকৃত",
        text: "দুঃখিত, ওস্তাদ বা অ্যাডমিন প্যানেল অ্যাকাউন্ট থেকে কোর্সে ভর্তি হওয়া সম্ভব নয়। অনুগ্রহ করে একটি শিক্ষার্থী (Student) অ্যাকাউন্ট ব্যবহার করুন।",
        confirmButtonColor: "#d33",
      });
    }

    router.push(`/education/enroll/${courseId}`);
  };

  // Render skeletal frames if data structures are in hydration transit
  if (isUserLoading || isDataParsing) {
    return <CourseDetailsSkeleton />;
  }

  return (
    <>
      <div className="bg-white pt-24 pb-8 md:pt-32 md:pb-12 px-4 sm:px-6 lg:px-8 antialiased text-slate-800">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-xl transition-all mb-6 md:mb-8 border border-emerald-100/50 cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            পূর্বের পেজে ফিরুন
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <span className="text-amber-500 font-bold text-sm block mb-1">
                  {courseDetails.subtitle}
                </span>
                <h1 className="text-2xl md:text-3xl font-black text-[#0f2942] tracking-tight leading-tight mb-4">
                  {courseTitle}
                </h1>
              </div>

              <p className="text-slate-600 text-sm md:text-base leading-relaxed text-justify">
                {courseDetails.description}
              </p>

              <div className="relative rounded-2xl overflow-hidden h-52 sm:h-64 md:h-72 shadow-xs bg-gradient-to-r from-emerald-900 to-teal-950 group">
                <Image
                  src={courseDetails.bannerImage}
                  alt={courseTitle}
                  fill
                  className="object-cover opacity-25 mix-blend-overlay transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent"></div>

                <div className="absolute top-0 right-0 bg-amber-500 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-wider shadow-xs">
                  একাডেমিক
                </div>

                <div className="absolute bottom-6 left-6 right-6">
                  <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-wide mb-2">
                    {courseTitle}
                  </h2>
                </div>
              </div>

              <button className="w-full flex items-center justify-center gap-2 border border-slate-300 hover:border-slate-400 bg-white text-slate-800 font-bold px-6 py-3 rounded-xl transition-all shadow-xs cursor-pointer text-sm">
                <FileText className="w-4 h-4" />
                পূর্ণাঙ্গ সিলেবাস ও কারিকুলাম দেখুন
              </button>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#EAF7F4] border border-[#D1EDE4] p-5 rounded-[2rem] shadow-xs relative overflow-hidden group"
              >
                <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-[#0B5D3B]/5 rounded-full pointer-events-none" />
                <div className="space-y-3 relative z-10">
                  <div className="flex items-center gap-1.5 text-[11px] font-black text-[#0B5D3B] uppercase bg-white border border-[#0B5D3B]/10 px-2.5 py-1 rounded-lg w-fit">
                    <HelpCircle size={12} /> নিজের লেভেল জানেন তো?
                  </div>
                  <h4 className="text-xs sm:text-md lg:text-lg font-black text-slate-900 leading-snug">
                    ভর্তির আগে মাত্র ২ মিনিটে দিন একটি ফ্রি পরীক্ষা!
                  </h4>
                  <p className="text-[11px] sm:text-sm font-medium leading-normal">
                    কুরআন পড়ার সঠিক লেভেল অনুযায়ী কোন ব্যাচটি আপনার জন্য सबसे
                    উপযোগী হবে তা তাৎক্ষণিক মূল্যায়ন রিপোর্টে জেনে নিন।
                  </p>
                  <Link
                    href="/quiz-test"
                    className="mt-2 w-full py-3 bg-[#0B5D3B] hover:bg-[#074229] text-white text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-1 group/btn shadow-xs cursor-pointer"
                  >
                    ফ্রি কুইজ টেস্ট শুরু করুন
                    <span className="transition-transform group-hover/btn:translate-x-0.5">
                      →
                    </span>
                  </Link>
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-1 lg:sticky lg:top-24">
              <div className="bg-[#fffcf4] border border-[#f7e9cc] rounded-2xl p-6 shadow-xs relative overflow-hidden">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-slate-700 text-base font-bold">
                      ভর্তি ফি:
                    </span>
                    <span className="text-2xl md:text-3xl font-black text-[#0f2942]">
                      ৳{courseDetails.discountPrice}
                    </span>
                    {courseDetails.regularPrice >
                      courseDetails.discountPrice && (
                      <span className="text-slate-400 line-through text-sm font-medium">
                        ৳{courseDetails.regularPrice}
                      </span>
                    )}
                  </div>

                  {courseDetails.discount > 0 && (
                    <span className="bg-[#0f2942] text-white text-xs font-bold px-3 py-1.5 rounded-full">
                      {courseDetails.discount}% ছাড়!
                    </span>
                  )}
                </div>

                {courseDetails.monthlyFee ? (
                  <div className="text-sm font-bold text-slate-700 mb-4">
                    <span>মাসিক ফি: ৳{courseDetails.monthlyFee}</span>
                  </div>
                ) : null}

                {courseDetails.upcomingBatch && !isEnrolled && (
                  <div className="mb-5 space-y-2 pt-1 border-t border-dashed border-slate-200/60">
                    <p className="text-[11px] sm:text-xs font-bold mt-3">
                      পরবর্তী ব্যাচের ক্লাস শুরু হতে বাকি:
                    </p>

                    {courseDetails.upcomingBatch.admissionStartDate && (
                      <BatchCountdown
                        targetDate={
                          courseDetails.upcomingBatch.admissionStartDate
                        }
                      />
                    )}
                  </div>
                )}

                <div className="space-y-2.5 mb-6">
                  {/* 🎯 মেগা ইউএক্স ভেরিফিকেশন বাটন লক ফিক্স ভাই */}
                  <button
                    onClick={handleEnrollRedirect}
                    disabled={!courseId || isEnrolled}
                    className={`w-full font-bold text-base py-3 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 text-center ${
                      isEnrolled
                        ? "bg-neutral-200 text-neutral-400 cursor-not-allowed shadow-none"
                        : "bg-[#cca03a] hover:bg-[#b88f32] text-white active:scale-[0.99] cursor-pointer"
                    }`}
                  >
                    {isEnrolled ? (
                      <>
                        আপনি অলরেডি এনরোলড <CheckCircle size={18} />
                      </>
                    ) : (
                      "এখনই ভর্তি হন"
                    )}
                  </button>

                  {courseDetails.upcomingBatch && !isEnrolled && (
                    <button
                      onClick={() => setBatchModalOpen(true)}
                      className="w-full bg-white border-2 border-emerald-700 text-emerald-800 font-extrabold text-xs py-3 rounded-xl transition-all hover:bg-emerald-50 cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                    >
                      <Clock size={14} /> পরবর্তী ব্যাচের তথ্য দেখুন
                    </button>
                  )}
                </div>

                <div className="pt-2 mb-6 border-t border-slate-200/40 flex flex-col gap-3">
                  <div className="text-xs font-bold text-slate-700">
                    ক্লাস সময়সূচী ও তথ্য:
                    <span className="text-slate-900 block mt-1 font-black">
                      {courseDetails.upcomingBatch
                        ? `ক্লাস শুরু: ${new Date(courseDetails.upcomingBatch.classStartDate).toLocaleDateString("bn-BD")}`
                        : courseDetails.batchStartDate}
                    </span>
                  </div>
                </div>

                {courseDetails.highlights &&
                  courseDetails.highlights.length > 0 && (
                    <div className="border-t border-slate-200 pt-4">
                      <h3 className="text-sm font-black text-slate-900 mb-3 flex items-center gap-1.5">
                        কোর্স হাইলাইটস
                      </h3>
                      <ul className="space-y-2">
                        {courseDetails.highlights.map(
                          (highlight: any, idx: number) => (
                            <li
                              key={highlight._id || idx}
                              className="flex items-start gap-2 text-xs md:text-sm text-slate-700 font-medium"
                            >
                              <span className="text-amber-500 mt-0.5">★</span>
                              <span>
                                {highlight.label}: {highlight.value}
                              </span>
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <CourseTabsDashboard courseData={courseDetails} />

      <AnimatePresence>
        {batchModalOpen && courseDetails.upcomingBatch && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-neutral-100 overflow-hidden relative"
            >
              <div className="bg-[#0B3D2E] text-white p-6 flex flex-col relative">
                <button
                  onClick={() => setBatchModalOpen(false)}
                  className="absolute top-5 right-5 p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all cursor-pointer"
                >
                  <X size={16} />
                </button>
                <h3 className="text-lg font-black leading-tight flex items-center gap-2">
                  {courseDetails.upcomingBatch.batchName}
                </h3>
              </div>

              <div className="p-6 space-y-4 text-slate-700">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-xs border-b border-gray-200 pb-2">
                    <span className="font-bold">বর্তমান স্ট্যাটাস:</span>
                    <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 font-black rounded-md text-[10px]">
                      ভর্তি চলছে
                    </span>
                  </div>

                  {courseDetails.upcomingBatch.admissionStartDate && (
                    <div className="flex items-center justify-between text-xs border-b border-gray-200 pb-2">
                      <span className="font-bold">ভর্তি শেষ হওয়ার তারিখ:</span>
                      <span className="font-black text-slate-800">
                        {new Date(
                          courseDetails.upcomingBatch.admissionStartDate,
                        ).toLocaleDateString("bn-BD")}
                      </span>
                    </div>
                  )}

                  {courseDetails.upcomingBatch.classStartDate && (
                    <div className="flex items-center justify-between text-xs border-b border-gray-200 pb-2">
                      <span className="font-bold">লাইভ ক্লাস শুরু:</span>
                      <span className="font-black text-emerald-800">
                        {new Date(
                          courseDetails.upcomingBatch.classStartDate,
                        ).toLocaleDateString("bn-BD")}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="font-bold">আসন সংখ্যা:</span>
                    <span className="font-black text-slate-800 flex items-center gap-1">
                      <Users size={14} className="text-green-800" />
                      {courseDetails.upcomingBatch.availableSeats}টি আসন বাকি
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setBatchModalOpen(false)}
                    className="w-1/3 py-3 font-medium border border-gray-200 rounded-xl hover:bg-gray-50 text-xs transition-all active:scale-95 cursor-pointer"
                  >
                    বন্ধ করুন
                  </button>
                  <button
                    onClick={() => {
                      setBatchModalOpen(false);
                      handleEnrollRedirect();
                    }}
                    className="w-2/3 py-3 bg-[#0B5D3B] hover:bg-[#08422a] text-white font-medium rounded-xl text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 size={14} /> এখনই বুকিং করুন
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function CourseDetailsPage() {
  return (
    <Suspense fallback={<CourseDetailsSkeleton />}>
      <CourseDetailsContent />
      <TestimonialsSection />
    </Suspense>
  );
}