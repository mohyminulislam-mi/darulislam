"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Star,
  CheckCircle2,
  ShieldCheck,
  Clock,
  Video,
  FileText,
  Lock,
  Unlock,
  PlayCircle,
  BookmarkCheck,
  HelpCircle,
  X,
  Users,
  CheckCircle,
} from "lucide-react";
import { getAllCourses } from "@/src/lib/data";
import { motion, AnimatePresence } from "framer-motion";
import LoadingSpinner from "@/src/components/shared/spinner/LoadingSpinner";
import useUserRole from "@/src/app/hooks/useUserRole";
import useAxiosSecure from "@/src/app/hooks/useAxiosSecure";
import Swal from "sweetalert2";

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
      <span className="text-rose-600 font-bold text-xs">
        ভর্তি ক্লোজড বা সেশন চলমান!
      </span>
    );

  const toBanglaNum = (num: number) =>
    String(num).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[+d]);

  return (
    <div className="flex gap-2 text-center mt-2.5">
      {["দিন", "ঘণ্টা", "مিনিট", "সেকেন্ড"].map((unit, idx) => {
        const val = [
          timeLeft.days,
          timeLeft.hours,
          timeLeft.minutes,
          timeLeft.seconds,
        ][idx];
        return (
          <div
            key={unit}
            className="bg-[#EAF7F4] px-3 py-1.5 rounded-xl border border-[#D1EDE4] w-full"
          >
            <span className="block text-base font-black text-[#0B5D3B]">
              {toBanglaNum(val)}
            </span>
            <span className="text-[9px] font-bold text-neutral-500">
              {unit}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export const dynamic = "force-dynamic";

export default function CourseDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const axiosSecure = useAxiosSecure();
  const { role, user } = useUserRole();

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [batchModalOpen, setBatchModalOpen] = useState(false);
  const [freeEnrolledSuccess, setFreeEnrolledSuccess] = useState(false);

  // 🎯 সিনিয়র লেভেল useMemo লক: ডাটাবেজ কালেকশনের রিয়েল enrolledStudents অ্যারে ভেরিফিকেশন ভাই
  const isEnrolled = useMemo(() => {
    if (freeEnrolledSuccess) return true;

    // ১. প্রথম চেক: সরাসরি কোর্স অবজেক্টে পাঠানো enrolledStudents লিস্ট চেক
    if (
      user?._id &&
      course?.enrolledStudents &&
      Array.isArray(course.enrolledStudents)
    ) {
      if (
        course.enrolledStudents.some(
          (sid: any) => String(sid?.$oid || sid) === String(user._id),
        )
      ) {
        return true;
      }
    }

    // ২. ২য় চেক: আপকামিং ব্যাচ মডেলের enrolledStudents লিস্ট ট্র্যাকিং ভাই
    if (
      user?._id &&
      course?.upcomingBatch?.enrolledStudents &&
      Array.isArray(course.upcomingBatch.enrolledStudents)
    ) {
      return course.upcomingBatch.enrolledStudents.some(
        (studentId: any) =>
          String(studentId?.$oid || studentId) === String(user._id),
      );
    }

    return false;
  }, [
    user?._id,
    course?.enrolledStudents,
    course?.upcomingBatch?.enrolledStudents,
    freeEnrolledSuccess,
  ]);

  const fetchCourseData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await getAllCourses();
      const sections = res?.courseSections || [];
      if (!Array.isArray(sections)) return;

      let foundCourse = null;
      for (const section of sections) {
        const match = section.courses.find(
          (c: any) =>
            String(c.id) === String(id) || String(c._id) === String(id),
        );

        if (match) {
          foundCourse = {
            ...match,
            category: section.categoryName || section.category,
          };
          break;
        }
      }
      setCourse(foundCourse);
    } catch (err) {
      console.error("Error fetching course details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [id]);

  const handleEnrollAction = async () => {
    if (isEnrolled || loading) return;

    if (!user) {
      router.replace(
        `/auth/register?redirect=${encodeURIComponent(`/education/enroll/${id}`)}`,
      );
      return;
    }

    if (role && role.toLowerCase() !== "student") {
      return Swal.fire(
        "অ্যাক্সেস অস্বীকৃত",
        "দুঃখিত, শিক্ষক বা অ্যাডমিন অ্যাকাউন্ট থেকে কোর্সে এনরোল করা সম্ভব নয়। অনুগ্রহ করে শিক্ষার্থী অ্যাকাউন্ট ব্যবহার করুন।",
        "warning",
      );
    }

    const isFreeCourse =
      course?.courseType?.toLowerCase() === "free" ||
      Number(course?.details?.admissionFee) === 0 ||
      Number(course?.price) === 0;

    if (isFreeCourse) {
      try {
        setLoading(true);

        const requestPayload = {
          courseId: course._id || course.id,
          method: "free",
          senderName: user?.name || "Free Student",
          bkashNumber: "00000000000",
          transactionId: `FREE-${id}-${Date.now()}`.toUpperCase(),
          amountPaid: 0,
        };

        const response = await axiosSecure.post(
          "/enrollments/enroll-course",
          requestPayload,
        );

        if (response.data?.success || response.data) {
          setFreeEnrolledSuccess(true);
          Swal.fire({
            title: "এনরোলমেন্ট সফল হয়েছে!",
            text: "ফ্রি কোর্সে আপনাকে স্বাগতম ভাই। আপনার ওস্তাদ ও ব্যাচ খুব দ্রুত ড্যাশবোর্ডে অ্যাসাইন করে দেওয়া হবে।",
            icon: "success",
            confirmButtonColor: "#0B5D3B",
          });
          await fetchCourseData();
        }
      } catch (error: any) {
        Swal.fire(
          "আবেদন ব্যর্থ",
          error?.response?.data?.message ||
            "ফ্রি এনরোলমেন্ট প্রসেস সফল করা যায়নি।",
          "error",
        );
      } finally {
        setLoading(false);
      }
      return;
    }

    router.push(`/education/enroll/${id}`);
  };

  if (loading && !course) return <LoadingSpinner fullScreen />;

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[#f8fafc] p-4">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-neutral-800">
            কোর্সটি পাওয়া যায়নি!
          </h2>
          <p className="text-neutral-500">
            সম্ভবত লিংকটি ভুল অথবা কোর্সটি বর্তমানে উপলব্ধ নেই।
          </p>
        </div>
        <button
          onClick={() => router.back()}
          className="bg-[#0B5D3B] text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold hover:bg-[#0d4d2e] transition-all cursor-pointer"
        >
          <ArrowLeft size={20} /> পেছনে ফিরে যান
        </button>
      </div>
    );
  }

  const { details, image, category, title, price } = course;

  return (
    <>
      <main className="min-h-screen bg-[#f8fafc] pb-20 pt-16 md:pt-20 antialiased font-sans">
        <nav
          className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-40 px-4 py-3"
          aria-label="ব্রেডক্রাম্ব ও নেভিগেশন"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center hover:cursor-pointer gap-2 text-neutral-600 hover:text-[#0B5D3B] transition-colors group"
            >
              <div className="p-2 rounded-full group-hover:bg-[#0B5D3B]/10 transition-colors">
                <ArrowLeft size={20} aria-hidden="true" />
              </div>
              <span className="font-bold text-sm hidden md:block">
                পেছনে যান
              </span>
            </button>

            <div className="flex items-center gap-3">
              {isEnrolled && (
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] md:text-xs font-black px-3 py-1 rounded-full flex items-center gap-1">
                  <BookmarkCheck size={14} aria-hidden="true" /> আপনি এই কোর্সে
                  এনরোলড
                </span>
              )}
              <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold">
                <Link
                  href="/education"
                  className="text-neutral-400 hover:text-[#0B5D3B]"
                >
                  এডুকেশন
                </Link>
                <span className="text-neutral-300" aria-hidden="true">
                  /
                </span>
                <span className="text-[#0B5D3B] line-clamp-1 max-w-[120px] md:max-w-none uppercase">
                  {title}
                </span>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <article className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-block bg-[#0B5D3B] text-white px-4 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                    {category}
                  </span>
                  <div
                    className="flex items-center gap-1 text-amber-500 font-bold text-sm"
                    aria-label="কোর্স রেটিং ৪.৯"
                  >
                    <Star size={16} fill="currentColor" aria-hidden="true" />{" "}
                    4.9 (রিভিউ)
                  </div>
                </div>
                <h1 className="text-2xl md:text-4xl font-black text-neutral-900 leading-tight">
                  {details?.fullTitle || title}
                </h1>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative aspect-video rounded-[2rem] overflow-hidden shadow-xl border-4 md:border-[8px] border-white bg-neutral-900 group"
              >
                {image ? (
                  <>
                    <Image
                      src={image}
                      alt={title}
                      fill
                      className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                      priority
                    />
                    {!isEnrolled && (
                      <div
                        onClick={handleEnrollAction}
                        className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white p-4 text-center cursor-pointer"
                        role="button"
                      >
                        <PlayCircle
                          size={64}
                          className="text-white opacity-90 drop-shadow-md mb-2 animate-pulse"
                          aria-hidden="true"
                        />
                        <p className="text-xs md:text-sm font-bold tracking-wide bg-black/40 px-4 py-1.5 rounded-full backdrop-blur-sm">
                          {loading
                            ? "প্রসেস হচ্ছে..."
                            : course?.courseType?.toLowerCase() === "free" ||
                                Number(details?.admissionFee) === 0 ||
                                Number(price) === 0
                              ? "ফ্রি মডিউল আনলক করতে এখানে ক্লিক করুন"
                              : "কোর্সে জয়েন করতে এখনই এনরোল করুন"}
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-neutral-400">
                    কোর্স ইমেজ লোড হচ্ছে...
                  </div>
                )}
              </motion.div>

              <section
                className="bg-white p-6 sm:p-8 rounded-[2rem] border border-neutral-100 shadow-sm space-y-4"
                aria-labelledby="desc-heading"
              >
                <h3
                  id="desc-heading"
                  className="text-xs sm:text-sm font-black text-slate-400 uppercase tracking-wider"
                >
                  কোর্সের বিবরণ
                </h3>
                <div className="text-slate-600 font-medium leading-relaxed">
                  {details?.description ? (
                    details.description.trim().startsWith("<") ? (
                      <div
                        className="[&_h1]:text-2xl [&_h1]:font-black [&_h1]:text-slate-900 [&_h1]:mt-4 [&_h1]:mb-2 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mt-4 [&_h2]:mb-2 [&_p]:mb-3 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2 [&_li]:my-0.5 [&_strong]:font-black [&_strong]:text-slate-900"
                        dangerouslySetInnerHTML={{
                          __html: details.description,
                        }}
                      />
                    ) : (
                      <p className="whitespace-pre-line">
                        {details.description}
                      </p>
                    )
                  ) : (
                    <p>
                      এই কোর্সটি আপনাকে সম্পূর্ণ জিরো থেকে অ্যাডভান্স লেভেল
                      পর্যন্ত প্রফেশনালি গাইড করবে।
                    </p>
                  )}
                </div>
              </section>

              <section
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                aria-label="কোর্স ফিচারসমূহ"
              >
                <div className="p-5 bg-white rounded-2xl border border-neutral-100 flex items-center gap-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <Clock size={22} aria-hidden="true" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-neutral-800">
                      কোর্সের মেয়াদ
                    </h4>
                    <p className="text-[11px] text-neutral-500">
                      লাইফটাইম আনলিমিটেড এক্সেস
                    </p>
                  </div>
                </div>
                <div className="p-5 bg-white rounded-2xl border border-neutral-100 flex items-center gap-4">
                  <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                    <ShieldCheck size={22} aria-hidden="true" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-neutral-800">
                      সার্টিফিকেশন
                    </h4>
                    <p className="text-[11px] text-neutral-500">
                      কোর্স শেষে ভেরিভাইড সার্টিফিকেট
                    </p>
                  </div>
                </div>
              </section>
            </article>

            <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-neutral-100 shadow-2xl space-y-6"
              >
                <div className="space-y-1">
                  <p className="text-xs font-black">ভর্তি ফি সর্বমোট</p>
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl md:text-5xl font-black text-[#0B5D3B]">
                      {details?.admissionFee === 0 ||
                      (!price && !details?.admissionFee)
                        ? "ফ্রি!"
                        : `৳${details?.admissionFee || price}`}
                    </span>
                    {details?.oldAdmissionFee > 0 && (
                      <span className="text-neutral-300 line-through text-lg font-bold">
                        ৳{details.oldAdmissionFee}
                      </span>
                    )}
                  </div>
                </div>

                {course?.upcomingBatch && !isEnrolled && (
                  <div className="pt-2 border-t border-dashed border-slate-200/80 space-y-1">
                    <p className="text-[11px] sm:text-xs font-semibold text-slate-500">
                      পরবর্তী ব্যাচের ক্লাস শুরু হতে বাকি:
                    </p>
                    {course.upcomingBatch.admissionStartDate && (
                      <BatchCountdown
                        targetDate={course.upcomingBatch.admissionStartDate}
                      />
                    )}
                  </div>
                )}

                <div className="space-y-3">
                  <button
                    onClick={handleEnrollAction}
                    disabled={isEnrolled}
                    className={`w-full font-black py-4 rounded-2xl transition-all text-base flex items-center justify-center gap-2 ${
                      isEnrolled
                        ? "bg-neutral-200 text-neutral-400 cursor-not-allowed shadow-none"
                        : "bg-[#0B5D3B] text-white hover:bg-[#074229] hover:shadow-lg hover:shadow-[#0B5D3B]/30 cursor-pointer active:scale-95"
                    }`}
                  >
                    {isEnrolled ? (
                      <>
                        আপনি অলরেডি এনরোলড <CheckCircle size={20} />
                      </>
                    ) : loading ? (
                      <>
                        অনুরোধ পাঠানো হচ্ছে... <LoadingSpinner />
                      </>
                    ) : (
                      <>
                        {course?.courseType?.toLowerCase() === "free" ||
                        Number(details?.admissionFee) === 0 ||
                        Number(price) === 0
                          ? "ফ্রি এনরোল করুন"
                          : "এখনী ভর্তি হবো"}{" "}
                        <CheckCircle2 size={20} aria-hidden="true" />
                      </>
                    )}
                  </button>

                  {course?.upcomingBatch && !isEnrolled && (
                    <button
                      onClick={() => setBatchModalOpen(true)}
                      className="w-full bg-white border-2 border-[#0B5D3B] text-[#0B5D3B] font-extrabold text-xs py-3.5 rounded-2xl transition-all hover:bg-emerald-50/50 cursor-pointer flex items-center justify-center gap-1.5 shadow-xs active:scale-95"
                    >
                      <Clock size={14} /> পরবর্তী ব্যাচের তথ্য দেখুন
                    </button>
                  )}
                </div>
              </motion.div>

              <section
                className="bg-white rounded-[2rem] border border-neutral-100 shadow-xl overflow-hidden flex flex-col justify-between"
                aria-label="কোর্স কারিকুলাম সিলেবাস"
              >
                <div className="p-5 bg-slate-50/80 border-b border-neutral-100 flex justify-between items-center">
                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-slate-800">
                      কোর্স মডিউল এবং কারিকুলাম
                    </h3>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                      {isEnrolled
                        ? "মডিউলগুলো দেখতে আপনার প্রোফাইল চেক করুন"
                        : "মডিউলগুলো দেখতে আগে ভর্তি হোন"}
                    </p>
                  </div>
                  {!isEnrolled ? (
                    <Lock size={14} className="text-slate-400" />
                  ) : (
                    <Unlock size={14} className="text-emerald-600" />
                  )}
                </div>

                <div className="divide-y divide-neutral-100 overflow-y-auto max-h-[320px]">
                  {course &&
                  Array.isArray(course.modules) &&
                  course.modules.length > 0 ? (
                    course.modules.map((mod: any, index: number) => {
                      const modId = mod._id?.$oid || mod._id || `mod-${index}`;
                      const isLiveClass = mod.statusType === "live_class";

                      return (
                        <div
                          key={modId}
                          className={`p-4 flex items-start gap-3.5 transition-all border-l-4 border-transparent ${!isEnrolled ? "cursor-not-allowed opacity-60" : "hover:bg-slate-50"}`}
                        >
                          <div className="mt-0.5 shrink-0">
                            <div className="w-[18px] h-[18px] rounded-full border-2 border-neutral-300"></div>
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold text-slate-800 leading-tight">
                              {String(index + 1).replace(
                                /\d/g,
                                (d) => "০১২৩৪৫৬৭৮৯"[+d],
                              )}
                              . {mod.title}
                            </h4>
                            <span
                              className={`text-[10px] font-bold inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border ${isLiveClass ? "text-[#0B5D3B] border-[#0B5D3B]/10" : "text-amber-700 border-amber-100 bg-amber-50/30"}`}
                            >
                              {isLiveClass ? (
                                <Video size={10} aria-hidden="true" />
                              ) : (
                                <FileText size={10} aria-hidden="true" />
                              )}
                              {mod.statusText ||
                                (isLiveClass ? "লাইভ ক্লাস" : "অ্যাসাইনমেন্ট")}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <>
                      {[
                        "০১. অরিয়েন্টেশন ও ড্যাশবোর্ড সেটআপ",
                        "০২. মডিউল ১ টাস্ক: হোমওয়ার্ক সাবমিশন",
                      ].map((title, i) => (
                        <div
                          key={title}
                          className="p-4 flex items-start gap-3.5 opacity-60 cursor-not-allowed"
                        >
                          <div className="mt-0.5 shrink-0">
                            <div className="w-[18px] h-[18px] rounded-full border-2 border-neutral-300"></div>
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold text-slate-800 leading-tight">
                              {title}
                            </h4>
                            <span
                              className={`text-[10px] font-bold inline-flex items-center gap-1 bg-white border ${i === 0 ? "text-[#0B5D3B] border-[#0B5D3B]/10" : "text-amber-700 border-amber-100 bg-amber-50/30"}`}
                            >
                              {i === 0 ? (
                                <Video size={10} />
                              ) : (
                                <FileText size={10} />
                              )}{" "}
                              {i === 0 ? "লাইভ ক্লাস - একটিভ" : "ক্লাস পেন্ডিং"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </section>

              <div className="mt-8">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#EAF7F4] border border-[#D1EDE4] p-5 rounded-[2rem] shadow-xs relative overflow-hidden group"
                >
                  <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-[#0B5D3B]/5 rounded-full pointer-events-none" />
                  <div className="space-y-3 relative z-10">
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-[#0B5D3B] uppercase bg-white border border-[#0B5D3B]/10 px-2.5 py-1 rounded-lg w-fit">
                      <HelpCircle size={12} /> নিজের লেভেল জানেন তো?
                    </div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-snug">
                      ভর্তির আগে মাত্র ২ মিনিটে দিন একটি ফ্রি পরীক্ষা!
                    </h4>
                    <p className="text-[11px] font-medium leading-normal">
                      কুরআন পড়ার সঠিক লেভেল অনুযায়ী কোন ব্যাচটি আপনার জন্য
                      সবচেয়ে উপযোগী হবে তা তাৎক্ষণিক মূল্যায়ন রিপোর্টে জেনে
                      নিন।
                    </p>
                    <Link
                      href="/quiz-test"
                      className="mt-2 w-full py-3 bg-[#0B5D3B] hover:bg-[#074229] text-white text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1 group/btn shadow-xs cursor-pointer"
                    >
                      কুইজ টেস্ট শুরু করুন{" "}
                      <span className="transition-transform group-hover/btn:translate-x-0.5">
                        →
                      </span>
                    </Link>
                  </div>
                </motion.div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {batchModalOpen && course.upcomingBatch && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-neutral-100 overflow-hidden relative"
            >
              <div className="bg-[#0B5D3B] text-white p-6 flex flex-col relative">
                <button
                  onClick={() => setBatchModalOpen(false)}
                  className="absolute top-5 right-5 p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all cursor-pointer"
                >
                  <X size={16} />
                </button>
                <h3 className="text-lg font-black leading-tight flex items-center gap-2">
                  {course.upcomingBatch.batchName}
                </h3>
              </div>
              <div className="p-6 space-y-4 text-slate-700">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                  {course.upcomingBatch.admissionStartDate && (
                    <div className="flex items-center justify-between text-xs border-b border-gray-200 pb-2">
                      <span className="font-bold text-slate-500">
                        ভর্তি শেষ হওয়ার তারিখ:
                      </span>
                      <span className="font-black text-slate-800">
                        {new Date(
                          course.upcomingBatch.admissionStartDate,
                        ).toLocaleDateString("bn-BD")}
                      </span>
                    </div>
                  )}
                  {course.upcomingBatch.classStartDate && (
                    <div className="flex items-center justify-between text-xs border-b border-gray-200 pb-2">
                      <span className="font-bold text-slate-500">
                        লাইভ ক্লাস শুরু:
                      </span>
                      <span className="font-black text-[#0B5D3B]">
                        {new Date(
                          course.upcomingBatch.classStartDate,
                        ).toLocaleDateString("bn-BD")}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="font-bold text-slate-500">
                      আসন সংখ্যা:
                    </span>
                    <span className="font-black text-slate-800 flex items-center gap-1">
                      <Users size={14} className="text-green-800" />
                      {course.upcomingBatch.availableSeats}টি আসন বাকি
                    </span>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setBatchModalOpen(false)}
                    className="w-1/3 py-3 font-bold border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-50 text-xs transition-all active:scale-95 cursor-pointer"
                  >
                    বন্ধ করুন
                  </button>
                  <button
                    onClick={() => {
                      setBatchModalOpen(false);
                      handleEnrollAction();
                    }}
                    className="w-2/3 py-3 bg-[#0B5D3B] hover:bg-[#07422a] text-white font-black rounded-xl text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 size={14} /> এখনই ভর্তি হোন
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